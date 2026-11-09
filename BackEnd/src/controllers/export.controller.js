const exportService = require('../services/export.service');

class ExportController {
  async importMarkdown(req, res, next) {
    try {
      const { title, markdown, folderId, folder } = req.body;
      const note = await exportService.importMarkdown(req.user._id, {
        title,
        markdown,
        folderId,
        folder
      });

      return res.status(201).json({
        success: true,
        message: 'Markdown imported successfully',
        data: note
      });
    } catch (error) {
      next(error);
    }
  }

  async exportMarkdown(req, res, next) {
    try {
      const { id } = req.params;
      const result = await exportService.exportToMarkdown(req.user._id, id);

      res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
      return res.send(result.content);
    } catch (error) {
      next(error);
    }
  }

  async exportPrintable(req, res, next) {
    try {
      const { id } = req.params;
      const result = await exportService.exportToPrintableHtml(req.user._id, id);

      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.send(result.html);
    } catch (error) {
      next(error);
    }
  }

  async bulkExport(req, res, next) {
    try {
      const data = await exportService.bulkExport(req.user._id);

      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="notenest_backup_${Date.now()}.json"`);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ExportController();

