const express = require('express');
const tagController = require('../controllers/tag.controller');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

router.use(authenticate);

router.route('/')
  .get(tagController.list)
  .post(tagController.create);

router.route('/:id')
  .patch(tagController.update)
  .put(tagController.update)
  .delete(tagController.delete);

module.exports = router;

