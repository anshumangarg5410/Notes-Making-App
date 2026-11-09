const tagService = require('../services/tag.service');

class TagController {
  async list(req, res, next) {
    try {
      const tags = await tagService.list(req.user._id);
      return res.status(200).json({
        success: true,
        count: tags.length,
        data: tags
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const { name, color } = req.body;
      const tag = await tagService.create(req.user._id, { name, color });
      return res.status(201).json({
        success: true,
        message: 'Tag created successfully',
        data: tag
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { name, color } = req.body;
      const tag = await tagService.update(req.user._id, req.params.id, { name, color });
      return res.status(200).json({
        success: true,
        message: 'Tag updated successfully',
        data: tag
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const result = await tagService.delete(req.user._id, req.params.id);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TagController();

