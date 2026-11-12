const mongoose = require('mongoose');
const Note = require('../models/Note');
const { logActivity } = require('../utils/activityLogger');

class NoteService {
  async create(userId, noteData) {
    const {
      title,
      content,
      plainText,
      tags,
      color,
      icon,
      isPinned,
      isFavorite,
      notebookId,
      sectionId,
      notebook,
      section,
      folderId,
      folder,
      drawings
    } = noteData;

    const text = plainText || (typeof content === 'string' ? content : '');
    const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
    const charCount = text.length;

    const note = await Note.create({
      userId,
      title: title?.trim() || 'Untitled Note',
      content: content || '',
      plainText: text,
      tags: Array.isArray(tags) ? tags : [],
      notebookId: notebookId || null,
      sectionId: sectionId || null,
      notebook: notebook?.trim() || '',
      section: section?.trim() || '',
      folderId: folderId || null,
      folder: folder?.trim() || (notebook?.trim() || ''),
      color: color || 'default',
      icon: icon || 'document',
      isPinned: Boolean(isPinned),
      isFavorite: Boolean(isFavorite),
      wordCount,
      charCount,
      drawings: Array.isArray(drawings) ? drawings : [],
      revision: 1,
      isArchived: false,
      isDeleted: false
    });

    logActivity({
      userId,
      action: 'created_note',
      entityType: 'note',
      entityId: note._id,
      entityTitle: note.title
    });

    return note;
  }

  async list(userId, query = {}) {
    const {
      search,
      category,
      tag,
      color,
      notebookId,
      sectionId,
      filter = 'all',
      sortBy = 'updated_desc'
    } = query;

    const dbQuery = { userId };

    if (notebookId) {
      dbQuery.notebookId = notebookId;
    }

    if (sectionId) {
      dbQuery.sectionId = sectionId;
    }

    if (filter === 'trash') {
      dbQuery.isDeleted = true;
    } else if (filter === 'archived') {
      dbQuery.isDeleted = false;
      dbQuery.isArchived = true;
    } else if (filter === 'favorites') {
      dbQuery.isDeleted = false;
      dbQuery.isArchived = false;
      dbQuery.isFavorite = true;
    } else {
      dbQuery.isDeleted = false;
      dbQuery.isArchived = false;
    }

    const activeTag = category || tag;
    if (activeTag && activeTag !== 'all') {
      dbQuery.tags = { $in: [new RegExp(`^${activeTag}$`, 'i')] };
    }

    if (color && color !== 'all') {
      dbQuery.color = color;
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      dbQuery.$or = [
        { title: searchRegex },
        { plainText: searchRegex },
        { tags: searchRegex }
      ];
    }

    let sortOptions = {};
    if (filter !== 'trash' && filter !== 'archived') {
      sortOptions.isPinned = -1;
    }

    switch (sortBy) {
      case 'updated_asc':
        sortOptions.updatedAt = 1;
        break;
      case 'created_desc':
        sortOptions.createdAt = -1;
        break;
      case 'created_asc':
        sortOptions.createdAt = 1;
        break;
      case 'title_asc':
        sortOptions.title = 1;
        break;
      case 'title_desc':
        sortOptions.title = -1;
        break;
      case 'updated_desc':
      default:
        sortOptions.updatedAt = -1;
        break;
    }

    return await Note.find(dbQuery).sort(sortOptions);
  }

  async getById(userId, noteId) {
    if (!mongoose.Types.ObjectId.isValid(noteId)) return null;
    return await Note.findOne({ _id: noteId, userId });
  }

  async update(userId, noteId, updates) {
    if (!mongoose.Types.ObjectId.isValid(noteId)) return null;
    const allowed = [
      'title',
      'content',
      'plainText',
      'tags',
      'notebookId',
      'sectionId',
      'notebook',
      'section',
      'folderId',
      'folder',
      'color',
      'icon',
      'isPinned',
      'isFavorite',
      'isArchived',
      'drawings'
    ];
    const filteredUpdates = {};
    for (const key of allowed) {
      if (updates[key] !== undefined) {
        filteredUpdates[key] = updates[key];
      }
    }

    if (filteredUpdates.plainText !== undefined) {
      const text = filteredUpdates.plainText || '';
      filteredUpdates.wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
      filteredUpdates.charCount = text.length;
    }

    const note = await Note.findOneAndUpdate(
      { _id: noteId, userId },
      {
        $set: filteredUpdates,
        $inc: { revision: 1 }
      },
      { new: true, runValidators: true }
    );

    if (note) {
      logActivity({
        userId,
        action: 'updated_note',
        entityType: 'note',
        entityId: note._id,
        entityTitle: note.title
      });
    }

    return note;
  }

  async softDelete(userId, noteId) {
    if (!mongoose.Types.ObjectId.isValid(noteId)) return null;
    const note = await Note.findOneAndUpdate(
      { _id: noteId, userId },
      {
        $set: {
          isDeleted: true,
          deletedAt: new Date()
        }
      },
      { new: true }
    );

    if (note) {
      logActivity({
        userId,
        action: 'deleted_note',
        entityType: 'note',
        entityId: note._id,
        entityTitle: note.title
      });
    }

    return note;
  }

  async restore(userId, noteId) {
    if (!mongoose.Types.ObjectId.isValid(noteId)) return null;
    const note = await Note.findOneAndUpdate(
      { _id: noteId, userId },
      {
        $set: {
          isDeleted: false,
          deletedAt: null
        }
      },
      { new: true }
    );

    if (note) {
      logActivity({
        userId,
        action: 'restored_note',
        entityType: 'note',
        entityId: note._id,
        entityTitle: note.title
      });
    }

    return note;
  }

  async permanentDelete(userId, noteId) {
    if (!mongoose.Types.ObjectId.isValid(noteId)) return null;
    return await Note.findOneAndDelete({ _id: noteId, userId });
  }

  async emptyTrash(userId) {
    return await Note.deleteMany({ userId, isDeleted: true });
  }

  async duplicate(userId, noteId) {
    if (!mongoose.Types.ObjectId.isValid(noteId)) return null;
    const original = await Note.findOne({ _id: noteId, userId });
    if (!original) return null;

    return await Note.create({
      userId,
      title: `${original.title} (Copy)`,
      content: original.content,
      plainText: original.plainText,
      tags: original.tags,
      color: original.color,
      icon: original.icon,
      isPinned: false,
      isFavorite: original.isFavorite,
      isArchived: false,
      isDeleted: false
    });
  }

  async togglePin(userId, noteId) {
    if (!mongoose.Types.ObjectId.isValid(noteId)) return null;
    const note = await Note.findOne({ _id: noteId, userId });
    if (!note) return null;
    note.isPinned = !note.isPinned;
    return await note.save();
  }

  async toggleFavorite(userId, noteId) {
    if (!mongoose.Types.ObjectId.isValid(noteId)) return null;
    const note = await Note.findOne({ _id: noteId, userId });
    if (!note) return null;
    note.isFavorite = !note.isFavorite;
    return await note.save();
  }

  async toggleArchive(userId, noteId) {
    if (!mongoose.Types.ObjectId.isValid(noteId)) return null;
    const note = await Note.findOne({ _id: noteId, userId });
    if (!note) return null;
    note.isArchived = !note.isArchived;
    return await note.save();
  }

  async getStats(userId) {
    const [allCount, favCount, archiveCount, trashCount] = await Promise.all([
      Note.countDocuments({ userId, isDeleted: false, isArchived: false }),
      Note.countDocuments({ userId, isDeleted: false, isArchived: false, isFavorite: true }),
      Note.countDocuments({ userId, isDeleted: false, isArchived: true }),
      Note.countDocuments({ userId, isDeleted: true })
    ]);

    return {
      all: allCount,
      favorites: favCount,
      archive: archiveCount,
      trash: trashCount
    };
  }
}

module.exports = new NoteService();

