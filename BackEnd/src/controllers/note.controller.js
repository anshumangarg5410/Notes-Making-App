const noteService = require('../services/note.service');

class NoteController {
  async getNotes(req, res, next) {
    try {
      const notes = await noteService.list(req.user._id, req.query);
      return res.status(200).json({
        success: true,
        count: notes.length,
        data: notes
      });
    } catch (error) {
      next(error);
    }
  }

  async getNoteById(req, res, next) {
    try {
      const note = await noteService.getById(req.user._id, req.params.id);
      if (!note) {
        return res.status(404).json({
          success: false,
          message: 'Note not found or unauthorized'
        });
      }
      return res.status(200).json({
        success: true,
        data: note
      });
    } catch (error) {
      next(error);
    }
  }

  async createNote(req, res, next) {
    try {
      const note = await noteService.create(req.user._id, req.body);
      return res.status(201).json({
        success: true,
        data: note
      });
    } catch (error) {
      next(error);
    }
  }

  async updateNote(req, res, next) {
    try {
      const note = await noteService.update(req.user._id, req.params.id, req.body);
      if (!note) {
        return res.status(404).json({
          success: false,
          message: 'Note not found or unauthorized'
        });
      }
      return res.status(200).json({
        success: true,
        data: note
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteNote(req, res, next) {
    try {
      const note = await noteService.softDelete(req.user._id, req.params.id);
      if (!note) {
        return res.status(404).json({
          success: false,
          message: 'Note not found or unauthorized'
        });
      }
      return res.status(200).json({
        success: true,
        message: 'Note moved to trash'
      });
    } catch (error) {
      next(error);
    }
  }

  async restoreNote(req, res, next) {
    try {
      const note = await noteService.restore(req.user._id, req.params.id);
      if (!note) {
        return res.status(404).json({
          success: false,
          message: 'Note not found or unauthorized'
        });
      }
      return res.status(200).json({
        success: true,
        message: 'Note restored successfully',
        data: note
      });
    } catch (error) {
      next(error);
    }
  }

  async permanentDeleteNote(req, res, next) {
    try {
      const note = await noteService.permanentDelete(req.user._id, req.params.id);
      if (!note) {
        return res.status(404).json({
          success: false,
          message: 'Note not found or unauthorized'
        });
      }
      return res.status(200).json({
        success: true,
        message: 'Note permanently deleted'
      });
    } catch (error) {
      next(error);
    }
  }

  async emptyTrash(req, res, next) {
    try {
      await noteService.emptyTrash(req.user._id);
      return res.status(200).json({
        success: true,
        message: 'Trash emptied successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  async duplicateNote(req, res, next) {
    try {
      const note = await noteService.duplicate(req.user._id, req.params.id);
      if (!note) {
        return res.status(404).json({
          success: false,
          message: 'Note not found or unauthorized'
        });
      }
      return res.status(201).json({
        success: true,
        message: 'Note duplicated successfully',
        data: note
      });
    } catch (error) {
      next(error);
    }
  }

  async togglePin(req, res, next) {
    try {
      const note = await noteService.togglePin(req.user._id, req.params.id);
      if (!note) {
        return res.status(404).json({
          success: false,
          message: 'Note not found'
        });
      }
      return res.status(200).json({
        success: true,
        data: note
      });
    } catch (error) {
      next(error);
    }
  }

  async toggleFavorite(req, res, next) {
    try {
      const note = await noteService.toggleFavorite(req.user._id, req.params.id);
      if (!note) {
        return res.status(404).json({
          success: false,
          message: 'Note not found'
        });
      }
      return res.status(200).json({
        success: true,
        data: note
      });
    } catch (error) {
      next(error);
    }
  }

  async toggleArchive(req, res, next) {
    try {
      const note = await noteService.toggleArchive(req.user._id, req.params.id);
      if (!note) {
        return res.status(404).json({
          success: false,
          message: 'Note not found'
        });
      }
      return res.status(200).json({
        success: true,
        data: note
      });
    } catch (error) {
      next(error);
    }
  }

  async getStats(req, res, next) {
    try {
      const stats = await noteService.getStats(req.user._id);
      return res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new NoteController();
