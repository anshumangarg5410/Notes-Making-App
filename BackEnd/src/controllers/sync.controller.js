const syncService = require('../services/sync.service');

class SyncController {
  async push(req, res, next) {
    try {
      const result = await syncService.processPush(req.user._id, req.body);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async pull(req, res, next) {
    try {
      const result = await syncService.processPull(req.user._id, req.body);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async status(req, res, next) {
    try {
      const result = await syncService.getStatus(req.user._id);
      return res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new SyncController();
