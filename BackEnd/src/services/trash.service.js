const Note = require('../models/Note');
const Folder = require('../models/Folder');

class TrashService {
  async list(userId, query = {}) {
    const { type = 'all', search = '', sortBy = 'deleted_desc' } = query;

    let items = [];

    // 1. Fetch deleted notes if type is 'all' or 'notes'
    if (type === 'all' || type === 'notes') {
      const noteQuery = { userId, isDeleted: true };
      if (search.trim()) {
        noteQuery.$or = [
          { title: { $regex: search.trim(), $options: 'i' } },
          { plainText: { $regex: search.trim(), $options: 'i' } }
        ];
      }
      const notes = await Note.find(noteQuery).lean();
      notes.forEach((n) => {
        const deletedDate = n.deletedAt || n.updatedAt || new Date();
        const daysPassed = Math.floor((Date.now() - new Date(deletedDate)) / (1000 * 60 * 60 * 24));
        const daysRemaining = Math.max(0, 30 - daysPassed);

        // Calculate approximate size
        const rawContent = typeof n.content === 'string' ? n.content : JSON.stringify(n.content || '');
        const sizeBytes = Buffer.byteLength(n.title || '', 'utf8') + Buffer.byteLength(rawContent, 'utf8');
        const sizeKb = (sizeBytes / 1024).toFixed(1);

        // Word count
        const text = n.plainText || '';
        const words = text.trim() ? text.trim().split(/\s+/).length : 0;

        items.push({
          id: n._id.toString(),
          _id: n._id.toString(),
          name: n.title || 'Untitled Note',
          type: 'note',
          preview: n.plainText ? n.plainText.slice(0, 80) : '',
          originalLocation: n.folder || '—',
          originalFolderId: n.originalFolderId || n.folderId || null,
          deletedAt: deletedDate,
          autoDeleteInDays: daysRemaining,
          sizeKb: `${sizeKb} KB`,
          words,
          createdAt: n.createdAt,
          updatedAt: n.updatedAt
        });
      });
    }

    // 2. Fetch deleted folders if type is 'all' or 'folders'
    if (type === 'all' || type === 'folders') {
      const folderQuery = { userId, isDeleted: true };
      if (search.trim()) {
        folderQuery.name = { $regex: search.trim(), $options: 'i' };
      }
      const folders = await Folder.find(folderQuery).lean();
      for (const f of folders) {
        const deletedDate = f.deletedAt || f.updatedAt || new Date();
        const daysPassed = Math.floor((Date.now() - new Date(deletedDate)) / (1000 * 60 * 60 * 24));
        const daysRemaining = Math.max(0, 30 - daysPassed);

        // Count contained notes that were in this folder
        const noteCount = await Note.countDocuments({
          userId,
          $or: [{ folderId: f._id }, { folder: f.name }]
        });

        items.push({
          id: f._id.toString(),
          _id: f._id.toString(),
          name: f.name,
          type: 'folder',
          preview: `Contains ${noteCount} notes`,
          noteCount,
          color: f.color || 'purple',
          originalLocation: 'Root',
          deletedAt: deletedDate,
          autoDeleteInDays: daysRemaining,
          sizeKb: `${(noteCount * 4.2).toFixed(1)} KB`,
          words: 0,
          createdAt: f.createdAt,
          updatedAt: f.updatedAt
        });
      }
    }

    // 3. Sort items
    items.sort((a, b) => {
      if (sortBy === 'name_asc') return a.name.localeCompare(b.name);
      if (sortBy === 'name_desc') return b.name.localeCompare(a.name);
      if (sortBy === 'type') return a.type.localeCompare(b.type);
      if (sortBy === 'deleted_asc') return new Date(a.deletedAt) - new Date(b.deletedAt);
      return new Date(b.deletedAt) - new Date(a.deletedAt); // deleted_desc default
    });

    return items;
  }

  async getStats(userId) {
    const deletedNotes = await Note.countDocuments({ userId, isDeleted: true });
    const deletedFolders = await Folder.countDocuments({ userId, isDeleted: true });

    // Calculate reclaimable storage from deleted notes
    const notes = await Note.find({ userId, isDeleted: true }).select('title content plainText').lean();
    let totalBytes = 0;
    notes.forEach((n) => {
      const rawContent = typeof n.content === 'string' ? n.content : JSON.stringify(n.content || '');
      totalBytes += Buffer.byteLength(n.title || '', 'utf8') + Buffer.byteLength(rawContent, 'utf8');
    });

    const reclaimableMb = (totalBytes / (1024 * 1024)).toFixed(2);

    return {
      deletedNotes,
      deletedFolders,
      totalItems: deletedNotes + deletedFolders,
      retentionPeriodDays: 30,
      reclaimableStorage: `${reclaimableMb} MB`
    };
  }

  async restoreItem(userId, { id, type }) {
    if (type === 'folder') {
      const folder = await Folder.findOne({ _id: id, userId });
      if (!folder) {
        const error = new Error('Deleted folder not found');
        error.statusCode = 404;
        throw error;
      }

      folder.isDeleted = false;
      folder.deletedAt = null;
      await folder.save();

      // Restore notes that belonged to this folder
      await Note.updateMany(
        { userId, folderId: folder._id, isDeleted: true },
        { $set: { isDeleted: false, deletedAt: null } }
      );

      return { success: true, message: `Folder "${folder.name}" restored successfully` };
    }

    // Default: note
    const note = await Note.findOne({ _id: id, userId });
    if (!note) {
      const error = new Error('Deleted note not found');
      error.statusCode = 404;
      throw error;
    }

    // If note had originalFolderId, check if that folder still exists and is not deleted
    if (note.originalFolderId) {
      const parentFolder = await Folder.findOne({ _id: note.originalFolderId, userId, isDeleted: false });
      if (!parentFolder) {
        note.originalFolderId = null;
        note.folderId = null;
        note.folder = '';
      } else {
        note.folderId = parentFolder._id;
        note.folder = parentFolder.name;
      }
    }

    note.isDeleted = false;
    note.deletedAt = null;
    await note.save();

    return { success: true, message: `Note "${note.title}" restored successfully` };
  }

  async restoreAll(userId) {
    // Restore all folders first
    await Folder.updateMany(
      { userId, isDeleted: true },
      { $set: { isDeleted: false, deletedAt: null } }
    );

    // Restore all notes
    const result = await Note.updateMany(
      { userId, isDeleted: true },
      { $set: { isDeleted: false, deletedAt: null } }
    );

    return {
      success: true,
      message: `Restored ${result.modifiedCount} items successfully`
    };
  }

  async deletePermanently(userId, { id, type }) {
    if (type === 'folder') {
      const folder = await Folder.findOne({ _id: id, userId });
      if (!folder) {
        const error = new Error('Folder not found in Trash');
        error.statusCode = 404;
        throw error;
      }

      // Safe note unlinking or cleanup
      await Note.updateMany(
        { userId, folderId: folder._id },
        { $set: { folderId: null, folder: '' } }
      );

      await Folder.deleteOne({ _id: id, userId });
      return { success: true, message: `Folder "${folder.name}" permanently deleted` };
    }

    // Default: note
    const note = await Note.findOne({ _id: id, userId });
    if (!note) {
      const error = new Error('Note not found in Trash');
      error.statusCode = 404;
      throw error;
    }

    await Note.deleteOne({ _id: id, userId });
    return { success: true, message: `Note "${note.title}" permanently deleted` };
  }

  async emptyTrash(userId) {
    const deletedFolders = await Folder.countDocuments({ userId, isDeleted: true });
    const deletedNotes = await Note.countDocuments({ userId, isDeleted: true });

    await Folder.deleteMany({ userId, isDeleted: true });
    await Note.deleteMany({ userId, isDeleted: true });

    return {
      success: true,
      message: `Permanently removed ${deletedNotes + deletedFolders} items from Trash`,
      deletedCount: deletedNotes + deletedFolders
    };
  }

  // 30-Day Auto Retention Cleanup routine
  async cleanupExpiredTrash() {
    try {
      const expirationThreshold = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

      const expiredFolders = await Folder.deleteMany({
        isDeleted: true,
        deletedAt: { $lt: expirationThreshold, $ne: null }
      });

      const expiredNotes = await Note.deleteMany({
        isDeleted: true,
        deletedAt: { $lt: expirationThreshold, $ne: null }
      });

      if (expiredFolders.deletedCount > 0 || expiredNotes.deletedCount > 0) {
        console.log(
          `[Trash Auto-Cleanup] Purged ${expiredNotes.deletedCount} notes and ${expiredFolders.deletedCount} folders older than 30 days.`
        );
      }
    } catch (err) {
      console.warn('[Trash Auto-Cleanup Error]:', err.message);
    }
  }
}

module.exports = new TrashService();

