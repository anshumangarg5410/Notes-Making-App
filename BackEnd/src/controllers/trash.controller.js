const trashService = require('../services/trash.service');

class TrashController {
  async getTrashItems(req, res, next) {
    try {
      const items = await trashService.list(req.user.id, req.query);
      res.status(200).json({
        success: true,
        data: items,
        count: items.length
      });
    } catch (error) {
      next(error);
    }
  }

  async getTrashStats(req, res, next) {
    try {
      const stats = await trashService.getStats(req.user.id);
      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      next(error);
    }
  }

  async restoreItem(req, res, next) {
    try {
      const result = await trashService.restoreItem(req.user.id, req.body);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async restoreAll(req, res, next) {
    try {
      const result = await trashService.restoreAll(req.user.id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async deletePermanently(req, res, next) {
    try {
      const { id } = req.params;
      const { type = 'note' } = req.query;
      const result = await trashService.deletePermanently(req.user.id, { id, type });
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async emptyTrash(req, res, next) {
    try {
      const result = await trashService.emptyTrash(req.user.id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TrashController();

