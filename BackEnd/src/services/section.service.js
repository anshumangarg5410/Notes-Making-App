const mongoose = require('mongoose');
const Section = require('../models/Section');
const Notebook = require('../models/Notebook');
const Note = require('../models/Note');

class SectionService {
  /**
   * Create a new section in a notebook
   */
  async create(userId, notebookId, data) {
    const { name, icon, color } = data;

    if (!name || !name.trim()) {
      const error = new Error('Section name is required');
      error.statusCode = 400;
      throw error;
    }

    const notebook = await Notebook.findOne({ _id: notebookId, userId, isDeleted: false });
    if (!notebook) {
      const error = new Error('Target notebook not found');
      error.statusCode = 404;
      throw error;
    }

    // Check for duplicate section name in this notebook
    const existing = await Section.findOne({
      userId,
      notebookId: notebook._id,
      isDeleted: false,
      name: { $regex: new RegExp(`^${name.trim()}$`, 'i') }
    });

    if (existing) {
      const error = new Error('A section with this name already exists in this notebook');
      error.statusCode = 409;
      throw error;
    }

    const lastSection = await Section.findOne({ userId, notebookId: notebook._id, isDeleted: false })
      .sort({ order: -1 })
      .select('order');
    const order = lastSection ? (lastSection.order || 0) + 1 : 0;

    const section = await Section.create({
      notebookId: notebook._id,
      userId,
      name: name.trim(),
      icon: icon || 'bookmark',
      color: color || 'default',
      order
    });

    return section;
  }

  /**
   * List all sections in a notebook with their note counts
   */
  async listByNotebook(userId, notebookId) {
    const notebook = await Notebook.findOne({ _id: notebookId, userId, isDeleted: false });
    if (!notebook) {
      const error = new Error('Notebook not found');
      error.statusCode = 404;
      throw error;
    }

    const sections = await Section.find({
      userId,
      notebookId: notebook._id,
      isDeleted: false
    })
      .sort({ order: 1, createdAt: 1 })
      .lean();

    const notes = await Note.find({
      userId,
      notebookId: notebook._id,
      isDeleted: false
    }).select('sectionId');

    return sections.map((s) => ({
      ...s,
      id: s._id.toString(),
      noteCount: notes.filter((n) => n.sectionId && n.sectionId.toString() === s._id.toString()).length
    }));
  }

  /**
   * Update section name, icon, or color
   */
  async update(userId, sectionId, updateData) {
    const section = await Section.findOne({ _id: sectionId, userId, isDeleted: false });
    if (!section) {
      const error = new Error('Section not found');
      error.statusCode = 404;
      throw error;
    }

    const { name, icon, color } = updateData;

    if (name && name.trim() && name.trim() !== section.name) {
      const existing = await Section.findOne({
        userId,
        notebookId: section.notebookId,
        _id: { $ne: section._id },
        isDeleted: false,
        name: { $regex: new RegExp(`^${name.trim()}$`, 'i') }
      });

      if (existing) {
        const error = new Error('Another section in this notebook already has this name');
        error.statusCode = 409;
        throw error;
      }

      // Also update string name on notes
      await Note.updateMany(
        { userId, sectionId: section._id },
        { $set: { section: name.trim() } }
      );

      section.name = name.trim();
    }

    if (icon !== undefined) section.icon = icon;
    if (color !== undefined) section.color = color;

    section.revision = (section.revision || 1) + 1;
    await section.save();

    return section;
  }

  /**
   * Move section to another notebook
   */
  async move(userId, sectionId, targetNotebookId) {
    const section = await Section.findOne({ _id: sectionId, userId, isDeleted: false });
    if (!section) {
      const error = new Error('Section not found');
      error.statusCode = 404;
      throw error;
    }

    const targetNotebook = await Notebook.findOne({ _id: targetNotebookId, userId, isDeleted: false });
    if (!targetNotebook) {
      const error = new Error('Target notebook not found');
      error.statusCode = 404;
      throw error;
    }

    // Check duplicate name in target notebook
    const existing = await Section.findOne({
      userId,
      notebookId: targetNotebook._id,
      _id: { $ne: section._id },
      isDeleted: false,
      name: { $regex: new RegExp(`^${section.name}$`, 'i') }
    });

    if (existing) {
      const error = new Error('A section with this name already exists in target notebook');
      error.statusCode = 409;
      throw error;
    }

    section.notebookId = targetNotebook._id;
    await section.save();

    // Update all notes belonging to this section to point to target notebook
    await Note.updateMany(
      { userId, sectionId: section._id },
      { $set: { notebookId: targetNotebook._id, notebook: targetNotebook.name } }
    );

    return section;
  }

  /**
   * Reorder sections in a notebook
   */
  async reorder(userId, notebookId, orderedIds = []) {
    if (!Array.isArray(orderedIds)) return [];

    const updates = orderedIds.map((id, index) =>
      Section.updateOne({ _id: id, notebookId, userId }, { $set: { order: index } })
    );

    await Promise.all(updates);
    return this.listByNotebook(userId, notebookId);
  }

  /**
   * Delete section
   */
  async delete(userId, sectionId) {
    const section = await Section.findOne({ _id: sectionId, userId });
    if (!section) {
      const error = new Error('Section not found');
      error.statusCode = 404;
      throw error;
    }

    // Move notes in this section to trash so they remain recoverable!
    await Note.updateMany(
      { userId, sectionId: section._id, isDeleted: false },
      { $set: { isDeleted: true, deletedAt: new Date() } }
    );

    await Section.deleteOne({ _id: section._id, userId });

    return { success: true, message: 'Section deleted successfully' };
  }

  /**
   * Get all notes in a section
   */
  async getNotes(userId, sectionId) {
    const section = await Section.findOne({ _id: sectionId, userId });
    if (!section) {
      const error = new Error('Section not found');
      error.statusCode = 404;
      throw error;
    }

    const notes = await Note.find({
      userId,
      sectionId: section._id,
      isDeleted: false
    })
      .sort({ isPinned: -1, updatedAt: -1 })
      .lean();

    return notes;
  }
}

module.exports = new SectionService();

