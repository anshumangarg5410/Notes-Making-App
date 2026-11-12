const express = require('express');
const storageController = require('../controllers/storage.controller');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

// Google OAuth redirect callback (validated via signed state token)
router.get('/google/callback', storageController.googleCallback);

// All subsequent storage routes require authenticated session
router.use(authenticate);

// Preferences & Onboarding
router.get('/preferences', storageController.getPreferences);
router.post('/preferences', storageController.updatePreferences);

// Google Drive Account Connection
router.get('/google/connect', storageController.connectGoogle);
router.get('/google/status', storageController.getGoogleStatus);
router.post('/google/disconnect', storageController.disconnectGoogle);

// Cloud Synchronization
router.post('/sync', storageController.sync);
router.get('/sync/status', storageController.getSyncStatus);

// Data Migration & Backup
router.get('/migration/data', storageController.getMigrationData);
router.post('/backup/export', storageController.exportBackup);

module.exports = router;
