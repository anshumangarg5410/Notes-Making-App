const notebookService = require('../services/notebook.service');
const sectionService = require('../services/section.service');

class NotebookController {
  async createNotebook(req, res, next) {
    try {
      const notebook = await notebookService.create(req.user.id, req.body);
      res.status(201).json({
        success: true,
        data: notebook,
        message: 'Notebook created successfully'
      });
    } catch (err) {
      next(err);
    }
  }

  async getNotebooks(req, res, next) {
    try {
      const notebooks = await notebookService.list(req.user.id, req.query);
      res.status(200).json({
        success: true,
        data: notebooks,
        count: notebooks.length
      });
    } catch (err) {
      next(err);
    }
  }

  async getNotebookById(req, res, next) {
    try {
      const notebook = await notebookService.getById(req.user.id, req.params.id);
      res.status(200).json({
        success: true,
        data: notebook
      });
    } catch (err) {
      next(err);
    }
  }

  async updateNotebook(req, res, next) {
    try {
      const notebook = await notebookService.update(req.user.id, req.params.id, req.body);
      res.status(200).json({
        success: true,
        data: notebook,
        message: 'Notebook updated successfully'
      });
    } catch (err) {
      next(err);
    }
  }

  async reorderNotebooks(req, res, next) {
    try {
      const notebooks = await notebookService.reorder(req.user.id, req.body.orderedIds);
      res.status(200).json({
        success: true,
        data: notebooks,
        message: 'Notebooks reordered successfully'
      });
    } catch (err) {
      next(err);
    }
  }

  async deleteNotebook(req, res, next) {
    try {
      const result = await notebookService.delete(req.user.id, req.params.id);
      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (err) {
      next(err);
    }
  }

  async getNotebookSections(req, res, next) {
    try {
      const sections = await sectionService.listByNotebook(req.user.id, req.params.id);
      res.status(200).json({
        success: true,
        data: sections,
        count: sections.length
      });
    } catch (err) {
      next(err);
    }
  }

  async createNotebookSection(req, res, next) {
    try {
      const section = await sectionService.create(req.user.id, req.params.id, req.body);
      res.status(201).json({
        success: true,
        data: section,
        message: 'Section created successfully'
      });
    } catch (err) {
      next(err);
    }
  }

  async getStats(req, res, next) {
    try {
      const stats = await notebookService.getStats(req.user.id);
      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new NotebookController();
