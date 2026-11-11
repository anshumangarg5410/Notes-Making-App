const express = require('express');
const aiDrawingController = require('../controllers/aiDrawing.controller');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

// Require user authentication for Smart Ink AI cleanup
router.use(authenticate);

// POST /api/drawing/ai-cleanup
router.post('/ai-cleanup', aiDrawingController.cleanupDrawing);

module.exports = router;
