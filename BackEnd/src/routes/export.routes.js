const express = require('express');
const exportController = require('../controllers/export.controller');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

router.use(authenticate);

router.post('/import-markdown', exportController.importMarkdown);
router.get('/notes/:id/markdown', exportController.exportMarkdown);
router.get('/notes/:id/print', exportController.exportPrintable);
router.get('/bulk', exportController.bulkExport);

module.exports = router;

