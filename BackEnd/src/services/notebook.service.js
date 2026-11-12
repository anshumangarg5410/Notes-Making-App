const mongoose = require('mongoose');
const Notebook = require('../models/Notebook');
const Section = require('../models/Section');
const Note = require('../models/Note');
const { logActivity } = require('../utils/activityLogger');

class NotebookService {
  /**
   * Create a new notebook with an automatic 'General' section
   */
  async create(userId, data) {
    const { name, description, color, icon } = data;

    if (!name || !name.trim()) {
      const error = new Error('Notebook name is required');
      error.statusCode = 400;
      throw error;
    }

    // Check for duplicate notebook name for this user
    const existing = await Notebook.findOne({
      userId,
      isDeleted: false,
      name: { $regex: new RegExp(`^${name.trim()}$`, 'i') }
    });

    if (existing) {
      const error = new Error('A notebook with this name already exists');
      error.statusCode = 409;
      throw error;
    }

    // Get max order
    const lastNotebook = await Notebook.findOne({ userId, isDeleted: false }).sort({ order: -1 }).select('order');
    const order = lastNotebook ? (lastNotebook.order || 0) + 1 : 0;

    const notebook = await Notebook.create({
      userId,
      name: name.trim(),
      description: description?.trim() || '',
      color: color || 'pink',
      icon: icon || 'book',
      order
    });

    // Automatically create a default 'General' section inside new notebook
    await Section.create({
      notebookId: notebook._id,
      userId,
      name: 'General',
      icon: 'bookmark',
      color: 'default',
      order: 0
    });

    logActivity({
      userId,
      action: 'created_folder', // backwards compatible activity key
      entityType: 'folder',
      entityId: notebook._id,
      entityTitle: notebook.name
    });

    return notebook;
  }

  /**
   * List all notebooks for a user with section and note counts
   */
  async list(userId, query = {}) {
    const { search, sortBy = 'order' } = query;

    const dbQuery = { userId, isDeleted: false };
    if (search && search.trim()) {
      dbQuery.name = { $regex: search.trim(), $options: 'i' };
    }

    let sort = { order: 1, createdAt: 1 };
    if (sortBy === 'name') sort = { name: 1 };
    if (sortBy === 'updated_desc') sort = { updatedAt: -1 };

    const notebooks = await Notebook.find(dbQuery).sort(sort).lean();

    // Fetch all non-deleted sections for these notebooks
    const notebookIds = notebooks.map((nb) => nb._id);
    const sections = await Section.find({
      userId,
      notebookId: { $in: notebookIds },
      isDeleted: false
    })
      .sort({ order: 1, createdAt: 1 })
      .lean();

    // Fetch note counts grouped by notebookId and sectionId
    const notes = await Note.find({
      userId,
      isDeleted: false
    })
      .select('notebookId sectionId folderId folder tags')
      .lean();

    // Build section map with note counts
    const sectionMap = new Map();
    sections.forEach((s) => {
      sectionMap.set(s._id.toString(), {
        ...s,
        id: s._id.toString(),
        noteCount: 0
      });
    });

    // Count notes per notebook & section
    const notebookMap = new Map();
    notebooks.forEach((nb) => {
      notebookMap.set(nb._id.toString(), {
        ...nb,
        id: nb._id.toString(),
        noteCount: 0,
        sectionCount: 0,
        sections: []
      });
    });

    // Put sections into notebooks
    sections.forEach((s) => {
      const nb = notebookMap.get(s.notebookId.toString());
      if (nb) {
        nb.sectionCount += 1;
        nb.sections.push(sectionMap.get(s._id.toString()));
      }
    });

    // Populate note counts
    notes.forEach((n) => {
      let countedInNotebook = false;

      if (n.sectionId && sectionMap.has(n.sectionId.toString())) {
        sectionMap.get(n.sectionId.toString()).noteCount += 1;
      }

      if (n.notebookId && notebookMap.has(n.notebookId.toString())) {
        notebookMap.get(n.notebookId.toString()).noteCount += 1;
        countedInNotebook = true;
      }

      // Backwards fallback if note only has legacy folder
      if (!countedInNotebook && n.folder) {
        const matchingNb = notebooks.find((nb) => nb.name.toLowerCase() === n.folder.toLowerCase());
        if (matchingNb && notebookMap.has(matchingNb._id.toString())) {
          notebookMap.get(matchingNb._id.toString()).noteCount += 1;
        }
      }
    });

    return Array.from(notebookMap.values());
  }

  /**
   * Get single notebook by ID with its sections
   */
  async getById(userId, notebookId) {
    const notebook = await Notebook.findOne({ _id: notebookId, userId, isDeleted: false }).lean();
    if (!notebook) {
      const error = new Error('Notebook not found');
      error.statusCode = 404;
      throw error;
    }

    const sections = await Section.find({ notebookId: notebook._id, userId, isDeleted: false })
      .sort({ order: 1, createdAt: 1 })
      .lean();

    const notes = await Note.find({
      userId,
      notebookId: notebook._id,
      isDeleted: false
    }).select('sectionId');

    const sectionWithCounts = sections.map((s) => ({
      ...s,
      id: s._id.toString(),
      noteCount: notes.filter((n) => n.sectionId && n.sectionId.toString() === s._id.toString()).length
    }));

    return {
      ...notebook,
      id: notebook._id.toString(),
      noteCount: notes.length,
      sectionCount: sections.length,
      sections: sectionWithCounts
    };
  }

  /**
   * Update notebook name, icon, color, description, or pinned state
   */
  async update(userId, notebookId, updateData) {
    const notebook = await Notebook.findOne({ _id: notebookId, userId });
    if (!notebook) {
      const error = new Error('Notebook not found');
      error.statusCode = 404;
      throw error;
    }

    const { name, description, color, icon, isPinned } = updateData;

    if (name && name.trim() && name.trim() !== notebook.name) {
      const existing = await Notebook.findOne({
        userId,
        _id: { $ne: notebook._id },
        isDeleted: false,
        name: { $regex: new RegExp(`^${name.trim()}$`, 'i') }
      });

      if (existing) {
        const error = new Error('Another notebook with this name already exists');
        error.statusCode = 409;
        throw error;
      }

      // Also update string name on notes belonging to this notebook
      await Note.updateMany(
        { userId, notebookId: notebook._id },
        { $set: { notebook: name.trim() } }
      );

      notebook.name = name.trim();
    }

    if (description !== undefined) notebook.description = description.trim();
    if (color !== undefined) notebook.color = color;
    if (icon !== undefined) notebook.icon = icon;
    if (isPinned !== undefined) notebook.isPinned = Boolean(isPinned);

    notebook.revision = (notebook.revision || 1) + 1;
    await notebook.save();

    return notebook;
  }

  /**
   * Reorder notebooks (Drag & Drop)
   */
  async reorder(userId, orderedIds = []) {
    if (!Array.isArray(orderedIds)) return [];

    const updates = orderedIds.map((id, index) =>
      Notebook.updateOne({ _id: id, userId }, { $set: { order: index } })
    );

    await Promise.all(updates);
    return this.list(userId);
  }

  /**
   * Delete notebook (moves notebook, sections, and notes to trash or unlinks)
   */
  async delete(userId, notebookId) {
    const notebook = await Notebook.findOne({ _id: notebookId, userId });
    if (!notebook) {
      const error = new Error('Notebook not found');
      error.statusCode = 404;
      throw error;
    }

    // Move associated notes to Trash so they remain recoverable!
    await Note.updateMany(
      { userId, notebookId: notebook._id, isDeleted: false },
      { $set: { isDeleted: true, deletedAt: new Date() } }
    );

    // Delete sections
    await Section.deleteMany({ notebookId: notebook._id, userId });

    // Delete notebook
    await Notebook.deleteOne({ _id: notebook._id, userId });

    return { success: true, message: 'Notebook deleted successfully' };
  }

  /**
   * Get notebook statistics
   */
  async getStats(userId) {
    const notebooks = await Notebook.find({ userId, isDeleted: false }).lean();
    const sections = await Section.find({ userId, isDeleted: false }).lean();
    const notesInNotebooks = await Note.countDocuments({
      userId,
      isDeleted: false,
      notebookId: { $ne: null }
    });

    return {
      totalNotebooks: notebooks.length,
      totalSections: sections.length,
      notesInNotebooks
    };
  }
}

module.exports = new NotebookService();
