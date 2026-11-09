const Note = require('../models/Note');

class NoteService {
  async create(userId, noteData) {
    const { title, content, plainText, tags, color, icon, isPinned, isFavorite } = noteData;
    const note = await Note.create({
      userId,
      title: title?.trim() || 'Untitled Note',
      content: content || '',
      plainText: plainText || '',
      tags: Array.isArray(tags) ? tags : [],
      color: color || 'default',
      icon: icon || 'document',
      isPinned: Boolean(isPinned),
      isFavorite: Boolean(isFavorite),
      isArchived: false,
      isDeleted: false
    });
    return note;
  }

  async list(userId, query = {}) {
    const {
      search,
      category,
      tag,
      color,
      filter = 'all',
      sortBy = 'updated_desc'
    } = query;

    const dbQuery = { userId };

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
    return await Note.findOne({ _id: noteId, userId });
  }

  async update(userId, noteId, updates) {
    const allowed = ['title', 'content', 'plainText', 'tags', 'color', 'icon', 'isPinned', 'isFavorite', 'isArchived'];
    const filteredUpdates = {};
    for (const key of allowed) {
      if (updates[key] !== undefined) {
        filteredUpdates[key] = updates[key];
      }
    }

    return await Note.findOneAndUpdate(
      { _id: noteId, userId },
      { $set: filteredUpdates },
      { new: true, runValidators: true }
    );
  }

  async softDelete(userId, noteId) {
    return await Note.findOneAndUpdate(
      { _id: noteId, userId },
      { $set: { isDeleted: true } },
      { new: true }
    );
  }

  async restore(userId, noteId) {
    return await Note.findOneAndUpdate(
      { _id: noteId, userId },
      { $set: { isDeleted: false } },
      { new: true }
    );
  }

  async permanentDelete(userId, noteId) {
    return await Note.findOneAndDelete({ _id: noteId, userId });
  }

  async emptyTrash(userId) {
    return await Note.deleteMany({ userId, isDeleted: true });
  }

  async duplicate(userId, noteId) {
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
    const note = await Note.findOne({ _id: noteId, userId });
    if (!note) return null;
    note.isPinned = !note.isPinned;
    return await note.save();
  }

  async toggleFavorite(userId, noteId) {
    const note = await Note.findOne({ _id: noteId, userId });
    if (!note) return null;
    note.isFavorite = !note.isFavorite;
    return await note.save();
  }

  async toggleArchive(userId, noteId) {
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

