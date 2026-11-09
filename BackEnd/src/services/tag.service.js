const Tag = require('../models/Tag');
const Note = require('../models/Note');

class TagService {
  /**
   * List all tags for a user with real-time usage counts
   */
  async list(userId) {
    const tags = await Tag.find({ userId }).sort({ name: 1 }).lean();

    // Aggregate note counts per tag from non-deleted notes
    const notes = await Note.find({ userId, isDeleted: false }, { tags: 1 }).lean();
    const tagCountMap = {};

    notes.forEach((note) => {
      if (Array.isArray(note.tags)) {
        note.tags.forEach((t) => {
          const lower = t.trim().toLowerCase();
          if (lower) {
            tagCountMap[lower] = (tagCountMap[lower] || 0) + 1;
          }
        });
      }
    });

    return tags.map((tag) => ({
      ...tag,
      id: tag._id.toString(),
      count: tagCountMap[tag.name.toLowerCase()] || 0
    }));
  }

  /**
   * Create a new tag for the user
   */
  async create(userId, { name, color }) {
    if (!name || !name.trim()) {
      const error = new Error('Tag name is required.');
      error.statusCode = 400;
      throw error;
    }

    const cleanName = name.trim();

    // Check duplicate for this user
    const existing = await Tag.findOne({
      userId,
      name: { $regex: new RegExp(`^${cleanName}$`, 'i') }
    });

    if (existing) {
      const error = new Error(`Tag "${cleanName}" already exists.`);
      error.statusCode = 409;
      throw error;
    }

    const tag = await Tag.create({
      userId,
      name: cleanName,
      color: color || 'purple'
    });

    return tag;
  }

  /**
   * Update / Rename tag
   */
  async update(userId, tagId, { name, color }) {
    const tag = await Tag.findOne({ _id: tagId, userId });
    if (!tag) {
      const error = new Error('Tag not found.');
      error.statusCode = 404;
      throw error;
    }

    const oldName = tag.name;

    if (name && name.trim() && name.trim().toLowerCase() !== oldName.toLowerCase()) {
      const newName = name.trim();
      const existing = await Tag.findOne({
        userId,
        _id: { $ne: tagId },
        name: { $regex: new RegExp(`^${newName}$`, 'i') }
      });

      if (existing) {
        const error = new Error(`Tag "${newName}" already exists.`);
        error.statusCode = 409;
        throw error;
      }

      tag.name = newName;

      // Update in all user notes that have this tag
      await Note.updateMany(
        { userId, tags: oldName },
        { $set: { 'tags.$': newName } }
      );
    }

    if (color) {
      tag.color = color;
    }

    await tag.save();
    return tag;
  }

  /**
   * Delete tag and remove it from user notes
   */
  async delete(userId, tagId) {
    const tag = await Tag.findOne({ _id: tagId, userId });
    if (!tag) {
      const error = new Error('Tag not found.');
      error.statusCode = 404;
      throw error;
    }

    // Safely remove tag from all user notes
    await Note.updateMany(
      { userId, tags: tag.name },
      { $pull: { tags: tag.name } }
    );

    await Tag.deleteOne({ _id: tagId, userId });

    return {
      success: true,
      message: `Tag "${tag.name}" deleted and removed from associated notes.`
    };
  }
}

module.exports = new TagService();

