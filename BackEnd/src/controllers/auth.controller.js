const authService = require('../services/auth.service');
const { setAuthCookies, clearAuthCookies } = require('../utils/token');

class AuthController {
  /**
   * POST /api/auth/register
   */
  async register(req, res, next) {
    try {
      const { name, email, password } = req.body;
      const result = await authService.register({ name, email, password });

      // Attach secure HttpOnly cookies
      setAuthCookies(res, result.accessToken, result.refreshToken);

      return res.status(201).json({
        success: true,
        message: 'Account created successfully',
        data: {
          user: result.user,
          token: result.accessToken
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/auth/login
   */
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await authService.login({ email, password });

      // Attach secure HttpOnly cookies
      setAuthCookies(res, result.accessToken, result.refreshToken);

      return res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          user: result.user,
          token: result.accessToken
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/auth/me
   */
  async me(req, res, next) {
    try {
      const user = await authService.getMe(req.user._id);

      return res.status(200).json({
        success: true,
        message: 'User profile retrieved successfully',
        data: user
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/auth/refresh
   */
  async refresh(req, res, next) {
    try {
      // Refresh token can come from HttpOnly cookie or request body
      const refreshToken = req.cookies?.refresh_token || req.body?.refreshToken;

      const result = await authService.refreshAccessToken(refreshToken);

      // Rotate cookies
      setAuthCookies(res, result.accessToken, result.refreshToken);

      return res.status(200).json({
        success: true,
        message: 'Token refreshed successfully',
        data: {
          user: result.user,
          token: result.accessToken
        }
      });
    } catch (error) {
      clearAuthCookies(res);
      next(error);
    }
  }

  /**
   * POST /api/auth/logout
   */
  async logout(req, res, next) {
    try {
      const userId = req.user?._id;
      const refreshToken = req.cookies?.refresh_token || req.body?.refreshToken;

      await authService.logout(userId, refreshToken);
      clearAuthCookies(res);

      return res.status(200).json({
        success: true,
        message: 'Logged out successfully'
      });
    } catch (error) {
      clearAuthCookies(res);
      next(error);
    }
  }

  /**
   * POST /api/auth/forgot-password
   */
  async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;
      const result = await authService.forgotPassword(email);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/auth/reset-password
   */
  async resetPassword(req, res, next) {
    try {
      const { token, newPassword } = req.body;
      const result = await authService.resetPassword({ token, newPassword });

      setAuthCookies(res, result.accessToken, result.refreshToken);

      return res.status(200).json({
        success: true,
        message: 'Password has been reset successfully',
        data: {
          user: result.user,
          token: result.accessToken
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/auth/verify-email
   */
  async verifyEmail(req, res, next) {
    try {
      const { token } = req.body;
      const result = await authService.verifyEmail(token);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/auth/resend-verification
   */
  async resendVerification(req, res, next) {
    try {
      const { email } = req.body;
      const result = await authService.resendVerification(email);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/auth/google
   * Verifies Google ID token and logs in the user
   */
  async googleLogin(req, res, next) {
    try {
      const idToken = req.body?.idToken || req.body?.token || req.body?.credential;
      const result = await authService.googleLogin(idToken);

      // Attach secure HttpOnly cookies
      setAuthCookies(res, result.accessToken, result.refreshToken);

      return res.status(200).json({
        success: true,
        message: 'Google authentication successful',
        data: {
          user: result.user,
          token: result.accessToken,
          googleId: result.googleUser.googleId,
          name: result.googleUser.name,
          email: result.googleUser.email,
          picture: result.googleUser.picture,
          avatar: result.user.avatar || result.googleUser.picture,
          avatarUrl: result.user.avatarUrl || result.googleUser.picture
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();

