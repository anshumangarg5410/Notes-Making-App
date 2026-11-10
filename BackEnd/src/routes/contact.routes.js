const express = require('express');
const rateLimit = require('express-rate-limit');
const contactController = require('../controllers/contact.controller');

const router = express.Router();

// Rate limiter for contact submission: max 10 requests per 15 minutes per IP
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 10 : 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many contact inquiries from this IP. Please try again later.'
  }
});

// POST /api/contact - Public contact submission
router.post('/', contactLimiter, contactController.submitMessage);

// GET /api/contact/messages - Inquiries list
router.get('/messages', contactController.getMessages);

module.exports = router;

