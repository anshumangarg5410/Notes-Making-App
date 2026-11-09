const express = require('express');
const noteController = require('../controllers/note.controller');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

// All note endpoints require authentication
router.use(authenticate);

router.get('/stats', noteController.getStats);
router.delete('/trash/empty', noteController.emptyTrash);

router.route('/')
  .get(noteController.getNotes)
  .post(noteController.createNote);

router.route('/:id')
  .get(noteController.getNoteById)
  .put(noteController.updateNote)
  .delete(noteController.deleteNote);

router.patch('/:id/restore', noteController.restoreNote);
router.delete('/:id/permanent', noteController.permanentDeleteNote);
router.post('/:id/duplicate', noteController.duplicateNote);
router.patch('/:id/pin', noteController.togglePin);
router.patch('/:id/favorite', noteController.toggleFavorite);
router.patch('/:id/archive', noteController.toggleArchive);

module.exports = router;

