const folderService = require('../services/folder.service');

class FolderController {
  async createFolder(req, res, next) {
    try {
      const folder = await folderService.create(req.user.id, req.body);
      res.status(201).json({
        success: true,
        data: folder,
        message: 'Folder created successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  async getFolders(req, res, next) {
    try {
      const folders = await folderService.list(req.user.id, req.query);
      res.status(200).json({
        success: true,
        data: folders,
        count: folders.length
      });
    } catch (error) {
      next(error);
    }
  }

  async getFolderById(req, res, next) {
    try {
      const folder = await folderService.getById(req.user.id, req.params.id);
      res.status(200).json({
        success: true,
        data: folder
      });
    } catch (error) {
      next(error);
    }
  }

  async updateFolder(req, res, next) {
    try {
      const folder = await folderService.update(req.user.id, req.params.id, req.body);
      res.status(200).json({
        success: true,
        data: folder,
        message: 'Folder updated successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  async moveFolder(req, res, next) {
    try {
      const { parentId } = req.body;
      const folder = await folderService.move(req.user.id, req.params.id, parentId);
      res.status(200).json({
        success: true,
        data: folder,
        message: 'Folder moved successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteFolder(req, res, next) {
    try {
      const result = await folderService.delete(req.user.id, req.params.id, req.body);
      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      next(error);
    }
  }

  async getFolderNotes(req, res, next) {
    try {
      const limit = parseInt(req.query.limit, 10) || 10;
      const notes = await folderService.getNotesByFolder(req.user.id, req.params.id, limit);
      res.status(200).json({
        success: true,
        data: notes,
        count: notes.length
      });
    } catch (error) {
      next(error);
    }
  }

  async getFolderStats(req, res, next) {
    try {
      const stats = await folderService.getStats(req.user.id);
      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new FolderController();
