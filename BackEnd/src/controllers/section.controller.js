const sectionService = require('../services/section.service');

class SectionController {
  async updateSection(req, res, next) {
    try {
      const section = await sectionService.update(req.user.id, req.params.id, req.body);
      res.status(200).json({
        success: true,
        data: section,
        message: 'Section updated successfully'
      });
    } catch (err) {
      next(err);
    }
  }

  async moveSection(req, res, next) {
    try {
      const { targetNotebookId } = req.body;
      const section = await sectionService.move(req.user.id, req.params.id, targetNotebookId);
      res.status(200).json({
        success: true,
        data: section,
        message: 'Section moved successfully'
      });
    } catch (err) {
      next(err);
    }
  }

  async reorderSections(req, res, next) {
    try {
      const { notebookId, orderedIds } = req.body;
      const sections = await sectionService.reorder(req.user.id, notebookId, orderedIds);
      res.status(200).json({
        success: true,
        data: sections,
        message: 'Sections reordered successfully'
      });
    } catch (err) {
      next(err);
    }
  }

  async deleteSection(req, res, next) {
    try {
      const result = await sectionService.delete(req.user.id, req.params.id);
      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (err) {
      next(err);
    }
  }

  async getSectionNotes(req, res, next) {
    try {
      const notes = await sectionService.getNotes(req.user.id, req.params.id);
      res.status(200).json({
        success: true,
        data: notes,
        count: notes.length
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new SectionController();

