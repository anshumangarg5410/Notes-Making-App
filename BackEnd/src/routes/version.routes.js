const express = require('express');
const versionController = require('../controllers/version.controller');
const authenticate = require('../middleware/authenticate');

const router = express.Router({ mergeParams: true });

// Require authentication for all version operations
router.use(authenticate);

router
  .route('/')
  .get(versionController.getVersions)
  .post(versionController.createSnapshot);

router
  .route('/:versionId')
  .get(versionController.getVersionById);

router.post('/:versionId/restore', versionController.restoreVersion);

module.exports = router;
