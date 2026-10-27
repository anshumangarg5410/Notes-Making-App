const express = require('express');
const router = express.Router();
const {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
  restoreNote,
  permanentDeleteNote,
  emptyTrash,
  duplicateNote,
  togglePin,
  toggleFavorite,
  toggleArchive,
  getNoteStats
} = require('../controllers/noteController');
const { protect } = require('../middleware/auth');

// Protect all note routes
router.use(protect);

router.route('/')
  .get(getNotes)
  .post(createNote);

router.get('/stats', getNoteStats);
router.delete('/trash/empty', emptyTrash);

router.route('/:id')
  .get(getNoteById)
  .put(updateNote)
  .delete(deleteNote);

router.post('/:id/duplicate', duplicateNote);
router.patch('/:id/pin', togglePin);
router.patch('/:id/favorite', toggleFavorite);
router.patch('/:id/archive', toggleArchive);
router.patch('/:id/restore', restoreNote);
router.delete('/:id/permanent', permanentDeleteNote);

module.exports = router;
