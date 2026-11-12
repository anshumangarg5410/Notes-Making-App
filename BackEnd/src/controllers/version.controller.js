const versionService = require('../services/version.service');

class VersionController {
  /**
   * GET /api/notes/:noteId/versions
   * Retrieve chronological revision history of a note
   */
  async getVersions(req, res, next) {
    try {
      const { noteId } = req.params;
      const result = await versionService.getVersions(req.user._id, noteId, req.query);

      return res.status(200).json({
        success: true,
        message: 'Versions retrieved successfully',
        data: result.versions,
        pagination: result.pagination
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/notes/:noteId/versions
   * Create a manual version snapshot of the current note state
   */
  async createSnapshot(req, res, next) {
    try {
      const { noteId } = req.params;
      const { versionName, content, title, plainText, tags, drawings } = req.body;

      const version = await versionService.createSnapshot(req.user._id, noteId, {
        versionType: 'manual',
        versionName: versionName || '',
        force: true, // Manual snapshots are always created immediately
        title,
        content,
        plainText,
        tags,
        drawings
      });

      return res.status(201).json({
        success: true,
        message: 'Version snapshot created successfully',
        data: version
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/notes/:noteId/versions/:versionId
   * Retrieve a specific historical version
   */
  async getVersionById(req, res, next) {
    try {
      const { noteId, versionId } = req.params;
      const version = await versionService.getVersionById(req.user._id, noteId, versionId);

      return res.status(200).json({
        success: true,
        message: 'Version retrieved successfully',
        data: version
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/notes/:noteId/versions/:versionId/restore
   * Restore a historical version (creates pre-restore snapshot first)
   */
  async restoreVersion(req, res, next) {
    try {
      const { noteId, versionId } = req.params;
      const result = await versionService.restoreVersion(req.user._id, noteId, versionId);

      return res.status(200).json({
        success: true,
        message: 'Note restored to selected historical version successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new VersionController();
