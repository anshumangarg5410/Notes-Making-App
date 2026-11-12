const express = require('express');
const notebookController = require('../controllers/notebook.controller');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

router.use(authenticate);

router.get('/stats', notebookController.getStats);
router.put('/reorder', notebookController.reorderNotebooks);

router.route('/')
  .get(notebookController.getNotebooks)
  .post(notebookController.createNotebook);

router.route('/:id')
  .get(notebookController.getNotebookById)
  .patch(notebookController.updateNotebook)
  .put(notebookController.updateNotebook)
  .delete(notebookController.deleteNotebook);

router.route('/:id/sections')
  .get(notebookController.getNotebookSections)
  .post(notebookController.createNotebookSection);

module.exports = router;

