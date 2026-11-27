const storageService = require('../services/storage.service');
const googleDriveService = require('../services/googleDrive.service');
const environment = require('../config/environment');

function sanitizeFrontendUrl(url) {
  if (!url || typeof url !== 'string') {
    return 'http://localhost:5173';
  }
  let cleaned = url.trim().replace(/\/+$/, '');
  if (!/^https?:\/\//i.test(cleaned)) {
    cleaned = `https://${cleaned}`;
  }
  return cleaned;
}

function isAllowedReturnOrigin(url) {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    const host = parsed.hostname;
    if (host === 'localhost' || host === '127.0.0.1') return true;
    if (host === 'notenest5410.vercel.app' || host.endsWith('.vercel.app')) return true;
    if (process.env.CLIENT_URL) {
      try {
        const clientHost = new URL(sanitizeFrontendUrl(process.env.CLIENT_URL)).hostname;
        if (host === clientHost) return true;
      } catch (_) {}
    }
    if (process.env.FRONTEND_URL) {
      try {
        const frontHost = new URL(sanitizeFrontendUrl(process.env.FRONTEND_URL)).hostname;
        if (host === frontHost) return true;
      } catch (_) {}
    }
    return false;
  } catch (_) {
    return false;
  }
}

class StorageController {
  /**
   * GET /api/storage/preferences
   */
  async getPreferences(req, res, next) {
    try {
      const data = await storageService.getPreferences(req.user._id);
      return res.status(200).json({
        success: true,
        data
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/storage/preferences
   */
  async updatePreferences(req, res, next) {
    try {
      const data = await storageService.updatePreferences(req.user._id, req.body);
      return res.status(200).json({
        success: true,
        message: 'Storage preferences updated successfully',
        data
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/storage/google/connect
   * Initiates Google Drive OAuth authorization flow
   */
  async connectGoogle(req, res, next) {
    try {
      if (
        !environment.googleDrive?.enabled ||
        !environment.googleDrive?.clientId ||
        !environment.googleDrive?.clientSecret
      ) {
        await storageService.markConnectionFailed(req.user._id).catch(() => {});
        return res.status(503).json({
          success: false,
          code: 'GOOGLE_DRIVE_DISABLED',
          message:
            "We're currently unable to connect to Google Drive. You can continue using NoteNest without it. Your existing notes and files remain unaffected."
        });
      }

      const redirectUri = req.query.redirect_uri || undefined;
      // Capture originating client origin from query or headers
      const rawOrigin = req.query.origin || req.headers.origin || req.headers.referer || undefined;
      let origin = undefined;
      if (rawOrigin) {
        try {
          origin = new URL(rawOrigin).origin;
        } catch (_) {}
      }

      const { authUrl, state } = googleDriveService.generateAuthUrl(
        req.user._id.toString(),
        redirectUri,
        origin ? { origin } : {}
      );
      return res.status(200).json({
        success: true,
        data: { authUrl, state }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/storage/google/callback
   * OAuth redirect callback invoked by Google
   */
  async googleCallback(req, res, next) {
    const { code, state, error } = req.query;

    // First attempt to decode origin from state so we know where to send the user back
    let returnOrigin = null;
    if (state) {
      try {
        const peeked = googleDriveService.peekStateOrigin(state);
        if (peeked?.origin && isAllowedReturnOrigin(peeked.origin)) {
          returnOrigin = sanitizeFrontendUrl(peeked.origin);
        }
      } catch (_) {}
    }

    const defaultFrontend = sanitizeFrontendUrl(
      environment.isProduction
        ? (process.env.FRONTEND_URL || 'https://notenest5410.vercel.app')
        : (process.env.CLIENT_URL || 'http://localhost:5173')
    );

    const frontendBaseUrl = returnOrigin || defaultFrontend;

    if (!environment.googleDrive?.enabled) {
      return res.redirect(
        `${frontendBaseUrl}/dashboard?storage_error=${encodeURIComponent(
          'Google Drive is temporarily unavailable.'
        )}`
      );
    }

    if (error) {
      return res.redirect(`${frontendBaseUrl}/dashboard?storage_error=${encodeURIComponent(error)}`);
    }

    try {
      const callbackResult = await googleDriveService.handleCallback(code, state);
      await storageService.connectGoogleDrive(
        callbackResult.userId,
        callbackResult.refreshTokenEncrypted,
        callbackResult.email
      );

      return res.redirect(`${frontendBaseUrl}/dashboard?storage_connected=true`);
    } catch (err) {
      console.error('[Google Drive Callback Error]:', err.message);
      return res.redirect(
        `${frontendBaseUrl}/dashboard?storage_error=${encodeURIComponent(err.message || 'OAuth callback failed')}`
      );
    }
  }

  /**
   * GET /api/storage/google/status
   */
  async getGoogleStatus(req, res, next) {
    try {
      const data = await storageService.getGoogleDriveStatus(req.user._id);
      return res.status(200).json({
        success: true,
        data
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/storage/google/disconnect
   */
  async disconnectGoogle(req, res, next) {
    try {
      const result = await storageService.disconnectGoogleDrive(req.user._id);
      return res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/storage/sync
   * Synchronize changes with Google Drive
   */
  async sync(req, res, next) {
    try {
      const result = await storageService.syncWithGoogleDrive(req.user._id, req.body);
      return res.status(200).json({
        success: true,
        message: 'Synchronized with Google Drive',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/storage/sync/status
   */
  async getSyncStatus(req, res, next) {
    try {
      const data = await storageService.getGoogleDriveStatus(req.user._id);
      return res.status(200).json({
        success: true,
        data
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/storage/migration/data
   * Retrieve existing MongoDB data to seed local IndexedDB
   */
  async getMigrationData(req, res, next) {
    try {
      const data = await storageService.getMigrationData(req.user._id);
      return res.status(200).json({
        success: true,
        data
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/storage/backup/export
   */
  async exportBackup(req, res, next) {
    try {
      const backup = await storageService.exportBackup(req.user._id, req.body?.data);
      return res.status(200).json({
        success: true,
        data: backup
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new StorageController();

