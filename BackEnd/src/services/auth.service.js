const User = require('../models/User');
const crypto = require('crypto');
const { OAuth2Client } = require('google-auth-library');
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

  /**
   * Generate password reset token
   */
  async forgotPassword(email) {
    if (!email) {
      const error = new Error('Please provide an email address.');
      error.statusCode = 400;
      throw error;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return {
        success: true,
        message: 'If an account exists with this email, password reset instructions have been sent.'
      };
    }

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // In local / development mode, return resetToken in payload to ease testing
    return {
      success: true,
      message: 'Password reset token generated successfully.',
      ...(environment.nodeEnv !== 'production' ? { resetToken } : {})
    };
  }

  /**
   * Reset password with valid token
   */
  async resetPassword({ token, newPassword }) {
    if (!token || !newPassword) {
      const error = new Error('Token and new password are required.');
      error.statusCode = 400;
      throw error;
    }

    if (newPassword.length < 6) {
      const error = new Error('Password must be at least 6 characters long.');
      error.statusCode = 400;
      throw error;
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    }).select('+password +passwordResetToken +passwordResetExpires');

    if (!user) {
      const error = new Error('Password reset token is invalid or has expired.');
      error.statusCode = 400;
      throw error;
    }

    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    // Invalidate old refresh tokens
    user.refreshTokens = [];

    // Issue fresh tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
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
   * Verify email address
   */
  async verifyEmail(token) {
    if (!token) {
      const error = new Error('Verification token is required.');
      error.statusCode = 400;
      throw error;
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { $gt: Date.now() }
    });

    if (!user) {
      const error = new Error('Verification token is invalid or has expired.');
      error.statusCode = 400;
      throw error;
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return {
      success: true,
      message: 'Email verified successfully.'
    };
  }

  /**
   * Resend email verification
   */
  async resendVerification(email) {
    if (!email) {
      const error = new Error('Email address is required.');
      error.statusCode = 400;
      throw error;
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      return {
        success: true,
        message: 'If an account exists, a verification link has been sent.'
      };
    }

    if (user.isEmailVerified) {
      return {
        success: true,
        message: 'Email address is already verified.'
      };
    }

    const verificationToken = user.createEmailVerificationToken();
    await user.save({ validateBeforeSave: false });

    return {
      success: true,
      message: 'Verification email sent.',
      ...(environment.nodeEnv !== 'production' ? { verificationToken } : {})
    };
  }

  /**
   * Google ID Token Verification & Login
   * POST /api/auth/google
   */
  async googleLogin(idToken) {
    if (!idToken) {
      const error = new Error('Google ID token is required.');
      error.statusCode = 400;
      throw error;
    }

    const clientId = environment.google?.clientId || process.env.GOOGLE_CLIENT_ID;
    if (!clientId) {
      const error = new Error('GOOGLE_CLIENT_ID is not configured on the server. Please set GOOGLE_CLIENT_ID in BackEnd/.env.');
      error.statusCode = 500;
      throw error;
    }

    const client = new OAuth2Client(clientId);
    let ticket;
    try {
      ticket = await client.verifyIdToken({
        idToken,
        audience: clientId
      });
    } catch (err) {
      const error = new Error(`Invalid Google ID token: ${err.message}`);
      error.statusCode = 401;
      throw error;
    }

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      const error = new Error('Invalid token payload: missing email.');
      error.statusCode = 401;
      throw error;
    }

    const normalizedEmail = payload.email.trim().toLowerCase();
    let user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      user = new User({
        name: payload.name || payload.given_name || 'Google User',
        email: normalizedEmail,
        googleId: payload.sub,
        avatar: payload.picture || '',
        avatarUrl: payload.picture || '',
        isEmailVerified: payload.email_verified || true
      });
      await user.save();
    } else {
      let changed = false;
      if (!user.googleId) {
        user.googleId = payload.sub;
        changed = true;
      }
      if (!user.avatar && payload.picture) {
        user.avatar = payload.picture;
        user.avatarUrl = payload.picture;
        changed = true;
      }
      if (changed) {
        await user.save();
      }
    }

    // Generate tokens for existing auth architecture
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    const tokenHash = hashToken(refreshToken);
    const now = new Date();
    const validTokens = (user.refreshTokens || []).filter((t) => t.expiresAt > now);
    validTokens.push({
      tokenHash,
      expiresAt: new Date(Date.now() + environment.jwt.refreshExpiresInMs)
    });
    user.refreshTokens = validTokens;
    await user.save();

    return {
      user: user.toJSON(),
      googleUser: {
        googleId: payload.sub,
        name: user.name,
        email: user.email,
        picture: payload.picture || user.avatar || ''
      },
      accessToken,
      refreshToken
    };
  }
}

module.exports = new AuthService();

