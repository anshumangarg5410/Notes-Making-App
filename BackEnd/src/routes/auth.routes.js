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
  max: process.env.NODE_ENV === 'production' ? 15 : 1000,
  skipSuccessfulRequests: true,
  skip: () => process.env.NODE_ENV !== 'production',
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
  max: process.env.NODE_ENV === 'production' ? 100 : 5000,
  skip: () => process.env.NODE_ENV !== 'production',
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

// F. Password Recovery
router.post(
  '/forgot-password',
  strictAuthLimiter,
  authController.forgotPassword
);

router.post(
  '/reset-password',
  strictAuthLimiter,
  authController.resetPassword
);

// G. Email Verification
router.post(
  '/verify-email',
  generalAuthLimiter,
  authController.verifyEmail
);

router.post(
  '/resend-verification',
  strictAuthLimiter,
  authController.resendVerification
);

module.exports = router;

