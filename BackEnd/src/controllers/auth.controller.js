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
}

module.exports = new AuthController();

