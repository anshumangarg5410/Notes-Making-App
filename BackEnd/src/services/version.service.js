const mongoose = require('mongoose');
const Note = require('../models/Note');
const NoteVersion = require('../models/NoteVersion');
const { logActivity } = require('../utils/activityLogger');

const MAX_VERSIONS_PER_NOTE = 50;
const MIN_AUTO_SNAPSHOT_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

class VersionService {
  /**
   * Compare two content values (strings or objects) for meaningful change
   */
  isContentEqual(a, b) {
    if (a === b) return true;
    if (!a && !b) return true;
    if (typeof a === 'string' && typeof b === 'string') {
      return a.trim() === b.trim();
    }
    try {
      return JSON.stringify(a) === JSON.stringify(b);
    } catch (_) {
      return false;
    }
  }

  /**
   * Create a version snapshot for a note
   */
  async createSnapshot(userId, noteId, options = {}) {
    if (!mongoose.Types.ObjectId.isValid(noteId)) {
      const error = new Error('Invalid note ID');
      error.statusCode = 400;
      throw error;
    }

    const note = await Note.findOne({ _id: noteId, userId });
    if (!note) {
      const error = new Error('Note not found or unauthorized');
      error.statusCode = 404;
      throw error;
    }

    const {
      versionType = 'manual',
      versionName = '',
      force = false,
      title = note.title,
      content = note.content,
      plainText = note.plainText,
      tags = note.tags,
      drawings = note.drawings
    } = options;

    // Check latest version for duplicate content
    const latestVersion = await NoteVersion.findOne({ noteId, userId }).sort({ createdAt: -1 });

    if (latestVersion && !force) {
      const titleMatches = (latestVersion.title || '').trim() === (title || '').trim();
      const contentMatches = this.isContentEqual(latestVersion.content, content);
      const textMatches = (latestVersion.plainText || '').trim() === (plainText || '').trim();

      if (titleMatches && contentMatches && textMatches) {
        // If content is identical, do not create duplicate
        return latestVersion;
      }

      // If automatic snapshot, enforce minimum interval
      if (versionType === 'automatic') {
        const timeSinceLast = Date.now() - new Date(latestVersion.createdAt).getTime();
        if (timeSinceLast < MIN_AUTO_SNAPSHOT_INTERVAL_MS) {
          return latestVersion;
        }
      }
    }

    const text = plainText || '';
    const wordCount = text.trim() ? text.trim().split(/\s+/).length : (note.wordCount || 0);
    const charCount = text.length || (note.charCount || 0);

    const version = await NoteVersion.create({
      userId,
      noteId,
      title: title || 'Untitled Note',
      content: content !== undefined ? content : '',
      plainText: text,
      tags: Array.isArray(tags) ? tags : [],
      drawings: Array.isArray(drawings) ? drawings : [],
      wordCount,
      charCount,
      versionType,
      versionName: versionName.trim(),
      metadata: {
        notebookId: note.notebookId,
        sectionId: note.sectionId,
        color: note.color,
        icon: note.icon
      }
    });

    // Enforce retention policy asynchronously without blocking
    this.enforceRetention(noteId, userId).catch((err) => {
      console.warn('[VersionService] Retention pruning error:', err.message);
    });

    logActivity({
      userId,
      action: versionType === 'manual' ? 'saved_note_version' : 'updated_note',
      entityType: 'note',
      entityId: noteId,
      entityTitle: note.title,
      metadata: { versionType }
    });

    return version;
  }

  /**
   * Get all versions for a note sorted newest to oldest
   */
  async getVersions(userId, noteId, query = {}) {
    if (!mongoose.Types.ObjectId.isValid(noteId)) {
      const error = new Error('Invalid note ID');
      error.statusCode = 400;
      throw error;
    }

    const note = await Note.findOne({ _id: noteId, userId });
    if (!note) {
      const error = new Error('Note not found or unauthorized');
      error.statusCode = 404;
      throw error;
    }

    const page = Math.max(1, parseInt(query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || 50));
    const skip = (page - 1) * limit;

    const [versions, total] = await Promise.all([
      NoteVersion.find({ noteId, userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('-metadata')
        .lean(),
      NoteVersion.countDocuments({ noteId, userId })
    ]);

    return {
      versions,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Get a specific version by ID
   */
  async getVersionById(userId, noteId, versionId) {
    if (!mongoose.Types.ObjectId.isValid(noteId) || !mongoose.Types.ObjectId.isValid(versionId)) {
      const error = new Error('Invalid ID provided');
      error.statusCode = 400;
      throw error;
    }

    const version = await NoteVersion.findOne({ _id: versionId, noteId, userId }).lean();
    if (!version) {
      const error = new Error('Version not found or unauthorized');
      error.statusCode = 404;
      throw error;
    }

    return version;
  }

  /**
   * Restore a historical version
   */
  async restoreVersion(userId, noteId, versionId) {
    if (!mongoose.Types.ObjectId.isValid(noteId) || !mongoose.Types.ObjectId.isValid(versionId)) {
      const error = new Error('Invalid ID provided');
      error.statusCode = 400;
      throw error;
    }

    const note = await Note.findOne({ _id: noteId, userId });
    if (!note) {
      const error = new Error('Note not found or unauthorized');
      error.statusCode = 404;
      throw error;
    }

    const targetVersion = await NoteVersion.findOne({ _id: versionId, noteId, userId });
    if (!targetVersion) {
      const error = new Error('Historical version not found');
      error.statusCode = 404;
      throw error;
    }

    // 1. Create a snapshot of the current state BEFORE restoring so nothing is lost
    const preRestoreVersion = await NoteVersion.create({
      userId,
      noteId,
      title: note.title,
      content: note.content,
      plainText: note.plainText,
      tags: note.tags,
      drawings: note.drawings,
      wordCount: note.wordCount,
      charCount: note.charCount,
      versionType: 'pre-restore',
      versionName: `Pre-restore snapshot before restoring ${new Date(targetVersion.createdAt).toLocaleDateString()}`,
      metadata: {
        restoringFromVersionId: targetVersion._id,
        notebookId: note.notebookId,
        sectionId: note.sectionId
      }
    });

    // 2. Overwrite note content with the target historical version
    note.title = targetVersion.title || 'Untitled Note';
    note.content = targetVersion.content;
    note.plainText = targetVersion.plainText || '';
    note.tags = targetVersion.tags || [];
    note.drawings = targetVersion.drawings || [];
    note.wordCount = targetVersion.wordCount || 0;
    note.charCount = targetVersion.charCount || 0;
    note.revision = (note.revision || 1) + 1;
    note.clientUpdatedAt = new Date();

    await note.save();

    logActivity({
      userId,
      action: 'restored_note_version',
      entityType: 'note',
      entityId: note._id,
      entityTitle: note.title
    });

    return {
      note,
      restoredFromVersion: targetVersion,
      preRestoreVersion
    };
  }

  /**
   * Enforce retention policy: Max 50 versions per note.
   * Prune older automatic snapshots first, preserving manual versions.
   */
  async enforceRetention(noteId, userId) {
    const totalCount = await NoteVersion.countDocuments({ noteId, userId });
    if (totalCount <= MAX_VERSIONS_PER_NOTE) return;

    const excessCount = totalCount - MAX_VERSIONS_PER_NOTE;

    // 1. Attempt to prune oldest automatic snapshots
    const autoVersions = await NoteVersion.find({
      noteId,
      userId,
      versionType: 'automatic'
    })
      .sort({ createdAt: 1 })
      .limit(excessCount)
      .select('_id')
      .lean();

    if (autoVersions.length > 0) {
      const idsToDelete = autoVersions.map((v) => v._id);
      await NoteVersion.deleteMany({ _id: { $in: idsToDelete } });
    }

    // 2. If still over limit, prune oldest pre-restore versions
    const remainingCount = await NoteVersion.countDocuments({ noteId, userId });
    if (remainingCount > MAX_VERSIONS_PER_NOTE) {
      const secondExcess = remainingCount - MAX_VERSIONS_PER_NOTE;
      const oldestOverall = await NoteVersion.find({ noteId, userId })
        .sort({ createdAt: 1 })
        .limit(secondExcess)
        .select('_id')
        .lean();

      if (oldestOverall.length > 0) {
        const ids = oldestOverall.map((v) => v._id);
        await NoteVersion.deleteMany({ _id: { $in: ids } });
      }
    }
  }

  /**
   * Delete all versions associated with a note
   */
  async deleteVersionsForNote(noteId, userId) {
    return await NoteVersion.deleteMany({ noteId, userId });
  }

  /**
   * Delete versions for multiple notes (e.g. empty trash)
   */
  async deleteVersionsForNotes(noteIds, userId) {
    if (!Array.isArray(noteIds) || noteIds.length === 0) return;
    return await NoteVersion.deleteMany({ noteId: { $in: noteIds }, userId });
  }
}

module.exports = new VersionService();
