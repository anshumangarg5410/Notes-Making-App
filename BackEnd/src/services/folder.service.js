const mongoose = require('mongoose');
const Folder = require('../models/Folder');
const Note = require('../models/Note');
const { logActivity } = require('../utils/activityLogger');

class FolderService {
  async create(userId, folderData) {
    const { name, description, color, icon, parentId, isPinned } = folderData;

    if (!name || !name.trim()) {
      const error = new Error('Folder name is required');
      error.statusCode = 400;
      throw error;
    }

    let validParentId = null;
    if (parentId) {
      const parent = await Folder.findOne({ _id: parentId, userId });
      if (!parent) {
        const error = new Error('Parent folder not found or does not belong to you');
        error.statusCode = 404;
        throw error;
      }
      validParentId = parent._id;
    }

    // Check for duplicate name under same parent
    const existing = await Folder.findOne({
      userId,
      parentId: validParentId,
      name: { $regex: new RegExp(`^${name.trim()}$`, 'i') }
    });

    if (existing) {
      const error = new Error('A folder with this name already exists in this location');
      error.statusCode = 409;
      throw error;
    }

    const folder = await Folder.create({
      userId,
      name: name.trim(),
      description: description?.trim() || '',
      color: color || 'purple',
      icon: icon || 'folder',
      parentId: validParentId,
      isPinned: Boolean(isPinned)
    });

    logActivity({
      userId,
      action: 'created_folder',
      entityType: 'folder',
      entityId: folder._id,
      entityTitle: folder.name
    });

    return folder;
  }

  async list(userId, query = {}) {
    const { search, sortBy = 'updated_desc' } = query;

    const dbQuery = { userId };
    if (search && search.trim()) {
      dbQuery.name = { $regex: search.trim(), $options: 'i' };
    }

    const folders = await Folder.find(dbQuery).lean();

    // Dynamically calculate note counts and subfolder counts for each folder
    const folderIds = folders.map((f) => f._id);

    // Count non-deleted notes grouped by folderId and folder name
    const notes = await Note.find({
      userId,
      isDeleted: false
    })
      .select('folderId folder tags updatedAt')
      .lean();

    const folderMap = new Map();
    folders.forEach((f) => {
      folderMap.set(f._id.toString(), {
        ...f,
        id: f._id.toString(),
        noteCount: 0,
        subfolderCount: 0,
        subfolders: []
      });
    });

    // Populate note counts
    notes.forEach((n) => {
      if (n.folderId && folderMap.has(n.folderId.toString())) {
        const item = folderMap.get(n.folderId.toString());
        item.noteCount += 1;
      } else if (n.folder) {
        // Fallback by folder name
        const match = folders.find((f) => f.name.toLowerCase() === n.folder.toLowerCase());
        if (match) {
          const item = folderMap.get(match._id.toString());
          if (item) item.noteCount += 1;
        }
      }
    });

    // Populate subfolder relationships
    folders.forEach((f) => {
      if (f.parentId && folderMap.has(f.parentId.toString())) {
        const parent = folderMap.get(f.parentId.toString());
        parent.subfolderCount += 1;
        const subItem = folderMap.get(f._id.toString());
        parent.subfolders.push({
          id: f._id.toString(),
          _id: f._id.toString(),
          name: f.name,
          parentId: f.parentId.toString(),
          noteCount: subItem ? subItem.noteCount : 0
        });
      }
    });

    let result = Array.from(folderMap.values());

    // Sort folders
    result.sort((a, b) => {
      if (sortBy === 'name_asc') return a.name.localeCompare(b.name);
      if (sortBy === 'name_desc') return b.name.localeCompare(a.name);
      if (sortBy === 'notes_desc') return b.noteCount - a.noteCount;
      if (sortBy === 'created_desc') return new Date(b.createdAt) - new Date(a.createdAt);
      return new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt);
    });

    return result;
  }

  async getById(userId, folderId) {
    if (!mongoose.Types.ObjectId.isValid(folderId)) {
      const error = new Error('Folder not found');
      error.statusCode = 404;
      throw error;
    }
    const folder = await Folder.findOne({ _id: folderId, userId });
    if (!folder) {
      const error = new Error('Folder not found');
      error.statusCode = 404;
      throw error;
    }
    return folder;
  }

  async update(userId, folderId, updateData) {
    const folder = await Folder.findOne({ _id: folderId, userId });
    if (!folder) {
      const error = new Error('Folder not found');
      error.statusCode = 404;
      throw error;
    }

    const { name, description, color, icon, isPinned } = updateData;

    if (name && name.trim()) {
      // Check duplicate under same parent
      const existing = await Folder.findOne({
        userId,
        parentId: folder.parentId,
        _id: { $ne: folder._id },
        name: { $regex: new RegExp(`^${name.trim()}$`, 'i') }
      });
      if (existing) {
        const error = new Error('A folder with this name already exists in this location');
        error.statusCode = 409;
        throw error;
      }
      folder.name = name.trim();
    }

    if (description !== undefined) folder.description = description.trim();
    if (color !== undefined) folder.color = color;
    if (icon !== undefined) folder.icon = icon;
    if (isPinned !== undefined) folder.isPinned = Boolean(isPinned);

    await folder.save();

    logActivity({
      userId,
      action: 'updated_folder',
      entityType: 'folder',
      entityId: folder._id,
      entityTitle: folder.name
    });

    return folder;
  }

  async move(userId, folderId, newParentId) {
    const folder = await Folder.findOne({ _id: folderId, userId });
    if (!folder) {
      const error = new Error('Folder not found');
      error.statusCode = 404;
      throw error;
    }

    if (newParentId) {
      if (newParentId.toString() === folderId.toString()) {
        const error = new Error('A folder cannot be moved into itself');
        error.statusCode = 400;
        throw error;
      }

      const newParent = await Folder.findOne({ _id: newParentId, userId });
      if (!newParent) {
        const error = new Error('Target parent folder not found');
        error.statusCode = 404;
        throw error;
      }

      // Cycle prevention: verify target parent is not a descendant of folder
      let currentCheck = newParent;
      while (currentCheck.parentId) {
        if (currentCheck.parentId.toString() === folderId.toString()) {
          const error = new Error('Cannot move a folder into one of its subfolders (circular hierarchy)');
          error.statusCode = 400;
          throw error;
        }
        currentCheck = await Folder.findOne({ _id: currentCheck.parentId, userId });
        if (!currentCheck) break;
      }

      folder.parentId = newParent._id;
    } else {
      folder.parentId = null;
    }

    await folder.save();

    logActivity({
      userId,
      action: 'updated_folder',
      entityType: 'folder',
      entityId: folder._id,
      entityTitle: folder.name
    });

    return folder;
  }

  async delete(userId, folderId, options = {}) {
    let folder = null;
    if (mongoose.Types.ObjectId.isValid(folderId)) {
      folder = await Folder.findOne({ _id: folderId, userId });
    }
    if (!folder) {
      folder = await Folder.findOne({ name: folderId, userId });
    }
    if (!folder) {
      return { success: true, message: 'Folder deleted safely; contained notes moved to root' };
    }

    // Safety rule: Contained notes are safely moved to root (or unassigned), never deleted!
    await Note.updateMany(
      { userId, folderId: folder._id },
      { $set: { folderId: null, folder: '' } }
    );

    // Promote subfolders to folder's parent or root
    await Folder.updateMany(
      { userId, parentId: folder._id },
      { $set: { parentId: folder.parentId || null } }
    );

    await Folder.deleteOne({ _id: folder._id, userId });

    logActivity({
      userId,
      action: 'deleted_folder',
      entityType: 'folder',
      entityId: folder._id,
      entityTitle: folder.name
    });

    return { success: true, message: 'Folder deleted safely; contained notes moved to root' };
  }

  async getNotesByFolder(userId, folderId, limit = 10) {
    const folder = await Folder.findOne({ _id: folderId, userId });
    if (!folder) {
      const error = new Error('Folder not found');
      error.statusCode = 404;
      throw error;
    }

    const notes = await Note.find({
      userId,
      isDeleted: false,
      $or: [
        { folderId: folder._id },
        { folder: folder.name }
      ]
    })
      .sort({ updatedAt: -1 })
      .limit(limit)
      .lean();

    return notes;
  }

  async getStats(userId) {
    const totalFolders = await Folder.countDocuments({ userId });
    const nestedFolders = await Folder.countDocuments({ userId, parentId: { $ne: null } });

    // Total notes in folders
    const notesInFolders = await Note.countDocuments({
      userId,
      isDeleted: false,
      $or: [
        { folderId: { $ne: null } },
        { folder: { $ne: '' } }
      ]
    });

    // Tagged folders: folders containing notes that have at least one tag
    const taggedNotes = await Note.find({
      userId,
      isDeleted: false,
      'tags.0': { $exists: true },
      $or: [
        { folderId: { $ne: null } },
        { folder: { $ne: '' } }
      ]
    }).select('folderId folder');

    const taggedFolderSet = new Set();
    taggedNotes.forEach((n) => {
      if (n.folderId) taggedFolderSet.add(n.folderId.toString());
      if (n.folder) taggedFolderSet.add(n.folder.toLowerCase());
    });

    return {
      totalFolders,
      totalNotes: notesInFolders,
      nestedFolders,
      taggedFolders: taggedFolderSet.size
    };
  }
}

module.exports = new FolderService();

