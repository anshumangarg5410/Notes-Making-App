const express = require('express');
const folderController = require('../controllers/folder.controller');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

// All folder routes require authenticated user
router.use(authenticate);

router.get('/stats', folderController.getFolderStats);

router.route('/')
  .get(folderController.getFolders)
  .post(folderController.createFolder);

router.route('/:id')
  .get(folderController.getFolderById)
  .patch(folderController.updateFolder)
  .delete(folderController.deleteFolder);

router.patch('/:id/move', folderController.moveFolder);
router.get('/:id/notes', folderController.getFolderNotes);

module.exports = router;

