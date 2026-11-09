const searchService = require('../services/search.service');

class SearchController {
  async search(req, res, next) {
    try {
      const results = await searchService.search(req.user._id, req.query);
      return res.status(200).json({
        success: true,
        data: results
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new SearchController();
