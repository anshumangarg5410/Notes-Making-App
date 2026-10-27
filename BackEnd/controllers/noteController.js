const noteService = require('../services/noteService');

// @desc    Get all notes for current user (with search/filter/sort)
// @route   GET /api/notes
// @access  Private
const getNotes = async (req, res, next) => {
  try {
    const notes = await noteService.list(req.user._id, req.query);
    res.status(200).json({
      success: true,
      count: notes.length,
      data: notes
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single note by ID
// @route   GET /api/notes/:id
// @access  Private
const getNoteById = async (req, res, next) => {
  try {
    const note = await noteService.getById(req.user._id, req.params.id);
    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found or unauthorized'
      });
    }
    res.status(200).json({
      success: true,
      data: note
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new note
// @route   POST /api/notes
// @access  Private
const createNote = async (req, res, next) => {
  try {
    const note = await noteService.create(req.user._id, req.body);
    res.status(201).json({
      success: true,
      data: note
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a note
// @route   PUT /api/notes/:id
// @access  Private
const updateNote = async (req, res, next) => {
  try {
    const note = await noteService.update(req.user._id, req.params.id, req.body);
    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found or unauthorized'
      });
    }
    res.status(200).json({
      success: true,
      data: note
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Soft delete note (move to trash)
// @route   DELETE /api/notes/:id
// @access  Private
const deleteNote = async (req, res, next) => {
  try {
    const note = await noteService.softDelete(req.user._id, req.params.id);
    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found or unauthorized'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Note moved to trash',
      data: note
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Restore note from trash
// @route   PATCH /api/notes/:id/restore
// @access  Private
const restoreNote = async (req, res, next) => {
  try {
    const note = await noteService.restore(req.user._id, req.params.id);
    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found or unauthorized'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Note restored from trash',
      data: note
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Permanently delete note from database
// @route   DELETE /api/notes/:id/permanent
// @access  Private
const permanentDeleteNote = async (req, res, next) => {
  try {
    const note = await noteService.permanentDelete(req.user._id, req.params.id);
    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found or unauthorized'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Note permanently deleted'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Empty trash (delete all trashed notes for user)
// @route   DELETE /api/notes/trash/empty
// @access  Private
const emptyTrash = async (req, res, next) => {
  try {
    const result = await noteService.emptyTrash(req.user._id);
    res.status(200).json({
      success: true,
      message: `Trash emptied successfully`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle pin note
// @route   PATCH /api/notes/:id/pin
// @access  Private
const togglePin = async (req, res, next) => {
  try {
    const note = await noteService.togglePin(req.user._id, req.params.id);
    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found or unauthorized'
      });
    }
    res.status(200).json({
      success: true,
      data: note
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle favorite note
// @route   PATCH /api/notes/:id/favorite
// @access  Private
const toggleFavorite = async (req, res, next) => {
  try {
    const note = await noteService.toggleFavorite(req.user._id, req.params.id);
    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found or unauthorized'
      });
    }
    res.status(200).json({
      success: true,
      data: note
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle archive note
// @route   PATCH /api/notes/:id/archive
// @access  Private
const toggleArchive = async (req, res, next) => {
  try {
    const note = await noteService.toggleArchive(req.user._id, req.params.id);
    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found or unauthorized'
      });
    }
    res.status(200).json({
      success: true,
      data: note
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get note statistics for sidebar counts
// @route   GET /api/notes/stats
// @access  Private
const getNoteStats = async (req, res, next) => {
  try {
    const stats = await noteService.getStats(req.user._id);
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
  restoreNote,
  permanentDeleteNote,
  emptyTrash,
  togglePin,
  toggleFavorite,
  toggleArchive,
  getNoteStats
};
