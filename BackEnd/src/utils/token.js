const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const environment = require('../config/environment');

/**
 * Generate Access Token (Short-lived)
 */
const generateAccessToken = (user) => {
  return jwt.sign(
    {
      sub: user._id.toString(),
      email: user.email,
      name: user.name
    },
    environment.jwt.accessSecret,
    { expiresIn: environment.jwt.accessExpiresIn }
  );
};

/**
 * Generate Refresh Token (Longer-lived)
 */
const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      sub: user._id.toString()
    },
    environment.jwt.refreshSecret,
    { expiresIn: environment.jwt.refreshExpiresIn }
  );
};

/**
 * Verify Access Token
 */
const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, environment.jwt.accessSecret);
  } catch (error) {
    return null;
  }
};

/**
 * Verify Refresh Token
 */
const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, environment.jwt.refreshSecret);
  } catch (error) {
    return null;
  }
};

/**
 * Hash token using SHA-256 before persisting in MongoDB
 */
const hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

/**
 * Configure and attach HttpOnly authentication cookies to response
 */
const setAuthCookies = (res, accessToken, refreshToken) => {
  const isProd = environment.isProduction;

  // Access Token Cookie (15 mins)
  res.cookie('access_token', accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: 15 * 60 * 1000 // 15 mins
  });

  // Refresh Token Cookie (7 days)
  if (refreshToken) {
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      path: '/api/auth', // Scope refresh cookie to auth endpoints
      maxAge: environment.jwt.refreshExpiresInMs
    });
  }
};

/**
 * Clear Authentication Cookies
 */
const clearAuthCookies = (res) => {
  const isProd = environment.isProduction;
  res.clearCookie('access_token', {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax'
  });
  res.clearCookie('refresh_token', {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    path: '/api/auth'
  });
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  hashToken,
  setAuthCookies,
  clearAuthCookies
};

