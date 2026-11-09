const User = require('../models/User');
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  hashToken
} = require('../utils/token');
const environment = require('../config/environment');

class AuthService {
  /**
   * Register a new user
   */
  async register({ name, email, password }) {
    const normalizedEmail = email.trim().toLowerCase();

    // Check if email is already registered
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      const error = new Error('An account with this email address already exists.');
      error.statusCode = 409;
      throw error;
    }

    // Create user (password is automatically hashed via pre-save hook)
    const user = new User({
      name: name.trim(),
      email: normalizedEmail,
      password
    });

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Store hashed refresh token in database
    const tokenHash = hashToken(refreshToken);
    user.refreshTokens = [
      {
        tokenHash,
        expiresAt: new Date(Date.now() + environment.jwt.refreshExpiresInMs)
      }
    ];

    await user.save();

    return {
      user: user.toJSON(),
      accessToken,
      refreshToken
    };
  }

  /**
   * Login with email and password
   */
  async login({ email, password }) {
    const normalizedEmail = email.trim().toLowerCase();

    // Find user including hidden password fields
    const user = await User.findOne({ email: normalizedEmail }).select('+password +passwordHash');
    if (!user) {
      const error = new Error('Invalid email or password.');
      error.statusCode = 401;
      throw error;
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      const error = new Error('Invalid email or password.');
      error.statusCode = 401;
      throw error;
    }

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Remove expired refresh tokens and add new one
    const now = new Date();
    const tokenHash = hashToken(refreshToken);
    const validTokens = (user.refreshTokens || []).filter((t) => t.expiresAt > now);

    validTokens.push({
      tokenHash,
      expiresAt: new Date(Date.now() + environment.jwt.refreshExpiresInMs)
    });

    user.refreshTokens = validTokens;
    await user.save();

    return {
      user: user.toJSON(),
      accessToken,
      refreshToken
    };
  }

  /**
   * Rotate and issue new access token using refresh token
   */
  async refreshAccessToken(token) {
    if (!token) {
      const error = new Error('Refresh token is required.');
      error.statusCode = 401;
      throw error;
    }

    // Verify token signature
    const decoded = verifyRefreshToken(token);
    if (!decoded || !decoded.sub) {
      const error = new Error('Invalid or expired refresh token.');
      error.statusCode = 401;
      throw error;
    }

    // Find user
    const user = await User.findById(decoded.sub).select('+refreshTokens');
    if (!user) {
      const error = new Error('User not found.');
      error.statusCode = 401;
      throw error;
    }

    // Check if the hashed refresh token exists in user's active tokens
    const tokenHash = hashToken(token);
    const tokenRecord = (user.refreshTokens || []).find((t) => t.tokenHash === tokenHash);

    if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
      // Possible token reuse or expired -> Revoke all tokens as security precaution
      user.refreshTokens = [];
      await user.save();
      const error = new Error('Invalid refresh token. Please log in again.');
      error.statusCode = 401;
      throw error;
    }

    // Issue new tokens (Token Rotation)
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);
    const newTokenHash = hashToken(newRefreshToken);

    // Replace old refresh token with new one
    user.refreshTokens = (user.refreshTokens || [])
      .filter((t) => t.tokenHash !== tokenHash && t.expiresAt > new Date())
      .concat({
        tokenHash: newTokenHash,
        expiresAt: new Date(Date.now() + environment.jwt.refreshExpiresInMs)
      });

    await user.save();

    return {
      user: user.toJSON(),
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    };
  }

  /**
   * Invalidate authentication session
   */
  async logout(userId, refreshToken = null) {
    if (!userId) return;

    try {
      const user = await User.findById(userId).select('+refreshTokens');
      if (user && user.refreshTokens) {
        if (refreshToken) {
          const tokenHash = hashToken(refreshToken);
          user.refreshTokens = user.refreshTokens.filter((t) => t.tokenHash !== tokenHash);
        } else {
          user.refreshTokens = [];
        }
        await user.save();
      }
    } catch (err) {
      console.warn('[Logout Warning]:', err.message);
    }
  }

  /**
   * Get safe user profile
   */
  async getMe(userId) {
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error('User not found.');
      error.statusCode = 404;
      throw error;
    }
    return user.toJSON();
  }
}

module.exports = new AuthService();
