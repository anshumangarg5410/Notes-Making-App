const Note = require('../models/Note');

class NoteService {
  /**
   * Create a new note
   */
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

  /**
   * Query notes with filtering, search, and sorting
   */
  async list(userId, query = {}) {
    const {
      search,
      category,
      tag,
      color,
      filter = 'all', // 'all', 'favorites', 'archived', 'trash'
      sortBy = 'updated_desc'
    } = query;

    // Base query scoped to the authenticated user
    const dbQuery = { userId };

    // Lifecycle filter
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
      // Default: Active notes
      dbQuery.isDeleted = false;
      dbQuery.isArchived = false;
    }

    // Category / Tag filter
    const activeTag = category || tag;
    if (activeTag && activeTag !== 'all') {
      dbQuery.tags = { $in: [new RegExp(`^${activeTag}$`, 'i')] };
    }

    // Color filter
    if (color && color !== 'all') {
      dbQuery.color = color;
    }

    // Text search (search in title, plainText, or tags)
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      dbQuery.$or = [
        { title: searchRegex },
        { plainText: searchRegex },
        { tags: searchRegex }
      ];
    }

    // Sort order
    let sortOptions = {};
    // Keep pinned notes at the top unless in trash or archive
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

    const notes = await Note.find(dbQuery).sort(sortOptions);
    return notes;
  }

  /**
   * Get single note by id and user
   */
  async getById(userId, noteId) {
    const note = await Note.findOne({ _id: noteId, userId });
    return note;
  }

  /**
   * Update note fields
   */
  async update(userId, noteId, updates) {
    const note = await Note.findOne({ _id: noteId, userId });
    if (!note) return null;

    const allowedFields = ['title', 'content', 'plainText', 'tags', 'color', 'icon', 'isPinned', 'isFavorite', 'isArchived'];
    allowedFields.forEach((field) => {
      if (updates[field] !== undefined) {
        note[field] = updates[field];
      }
    });

    await note.save();
    return note;
  }

  /**
   * Soft delete (move to trash)
   */
  async softDelete(userId, noteId) {
    const note = await Note.findOneAndUpdate(
      { _id: noteId, userId },
      { isDeleted: true, isPinned: false },
      { new: true }
    );
    return note;
  }

  /**
   * Restore from trash
   */
  async restore(userId, noteId) {
    const note = await Note.findOneAndUpdate(
      { _id: noteId, userId },
      { isDeleted: false },
      { new: true }
    );
    return note;
  }

  /**
   * Permanent delete from database
   */
  async permanentDelete(userId, noteId) {
    const result = await Note.findOneAndDelete({ _id: noteId, userId });
    return result;
  }

  /**
   * Empty trash (permanently delete all soft-deleted notes for user)
   */
  async emptyTrash(userId) {
    const result = await Note.deleteMany({ userId, isDeleted: true });
    return result;
  }

  /**
   * Toggle pinned status
   */
  async togglePin(userId, noteId) {
    const note = await Note.findOne({ _id: noteId, userId });
    if (!note) return null;
    note.isPinned = !note.isPinned;
    await note.save();
    return note;
  }

  /**
   * Toggle favorite status
   */
  async toggleFavorite(userId, noteId) {
    const note = await Note.findOne({ _id: noteId, userId });
    if (!note) return null;
    note.isFavorite = !note.isFavorite;
    await note.save();
    return note;
  }

  /**
   * Toggle archive status
   */
  async toggleArchive(userId, noteId) {
    const note = await Note.findOne({ _id: noteId, userId });
    if (!note) return null;
    note.isArchived = !note.isArchived;
    if (note.isArchived) {
      note.isPinned = false;
    }
    await note.save();
    return note;
  }

  /**
   * Compute counts for sidebar badges
   */
  async getStats(userId) {
    const [allCount, favCount, archiveCount, trashCount, studyCount, workCount, personalCount, ideasCount] = await Promise.all([
      Note.countDocuments({ userId, isDeleted: false, isArchived: false }),
      Note.countDocuments({ userId, isDeleted: false, isArchived: false, isFavorite: true }),
      Note.countDocuments({ userId, isDeleted: false, isArchived: true }),
      Note.countDocuments({ userId, isDeleted: true }),
      Note.countDocuments({ userId, isDeleted: false, isArchived: false, tags: { $in: [/^study$/i] } }),
      Note.countDocuments({ userId, isDeleted: false, isArchived: false, tags: { $in: [/^work$/i] } }),
      Note.countDocuments({ userId, isDeleted: false, isArchived: false, tags: { $in: [/^personal$/i] } }),
      Note.countDocuments({ userId, isDeleted: false, isArchived: false, tags: { $in: [/^ideas$/i] } })
    ]);

    return {
      all: allCount,
      favorites: favCount,
      archive: archiveCount,
      trash: trashCount,
      study: studyCount,
      work: workCount,
      personal: personalCount,
      ideas: ideasCount
    };
  }
}

module.exports = new NoteService();
