const express = require('express');
const trashController = require('../controllers/trash.controller');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

// All Trash operations require authentication
router.use(authenticate);

router.get('/stats', trashController.getTrashStats);
router.post('/restore', trashController.restoreItem);
router.post('/restore-all', trashController.restoreAll);
router.delete('/empty', trashController.emptyTrash);

router.route('/')
  .get(trashController.getTrashItems);

router.route('/:id')
  .delete(trashController.deletePermanently);

module.exports = router;
