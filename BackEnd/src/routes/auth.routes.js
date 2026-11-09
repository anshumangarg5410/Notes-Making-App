const express = require('express');
const rateLimit = require('express-rate-limit');
const authController = require('../controllers/auth.controller');
const authenticate = require('../middleware/authenticate');
const validateRequest = require('../middleware/validateRequest');
const { registerSchema, loginSchema } = require('../validators/auth.validator');

const router = express.Router();

// Strict rate limiting for sensitive login & registration endpoints
const strictAuthLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // max 15 attempts per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again after 15 minutes.'
  }
});

// General rate limiter for token refresh & session verification
const generalAuthLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false
});

// A. User Registration
router.post(
  '/register',
  strictAuthLimiter,
  validateRequest(registerSchema),
  authController.register
);

// B. User Login
router.post(
  '/login',
  strictAuthLimiter,
  validateRequest(loginSchema),
  authController.login
);

// C. Get Current User (Protected)
router.get(
  '/me',
  generalAuthLimiter,
  authenticate,
  authController.me
);

// D. Refresh Authentication Token
router.post(
  '/refresh',
  generalAuthLimiter,
  authController.refresh
);

// E. Logout
router.post(
  '/logout',
  authController.logout
);

module.exports = router;

