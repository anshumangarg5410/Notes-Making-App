const { OAuth2Client } = require('google-auth-library');
const environment = require('../config/environment');
const { encryptToken, decryptToken, createSignedState, verifySignedState, peekSignedState } = require('../utils/crypto');

class GoogleDriveService {
  /**
   * Initializes a Google OAuth2Client for Drive access
   * @param {string} [redirectUri] Optional custom redirect URI
   * @returns {OAuth2Client}
   */
  createOAuthClient(redirectUri) {
    const clientId = environment.googleDrive?.clientId;
    const clientSecret = environment.googleDrive?.clientSecret;
    const resolvedRedirectUri = redirectUri || environment.googleDrive?.redirectUri;

    return new OAuth2Client(clientId, clientSecret, resolvedRedirectUri);
  }

  /**
   * Generates a Google Drive OAuth authorization URL
   * @param {string} userId - Authenticated user's ID
   * @param {string} [redirectUri] - Optional dynamic redirect URI
   * @param {Object} [metadata={}] - Optional metadata such as originating client origin
   * @returns {{ authUrl: string, state: string }}
   */
  generateAuthUrl(userId, redirectUri, metadata = {}) {
    const oauth2Client = this.createOAuthClient(redirectUri);
    const state = createSignedState(userId, metadata);

    const scopes = [
      'https://www.googleapis.com/auth/drive.file',
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile'
    ];

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent',
      state,
      include_granted_scopes: true
    });

    return { authUrl, state };
  }

  /**
   * Peeks origin metadata from state parameter safely
   * @param {string} state
   * @returns {{ origin?: string }|null}
   */
  peekStateOrigin(state) {
    const peeked = peekSignedState(state);
    return peeked?.metadata || null;
  }

  /**
   * Handles Google OAuth callback, verifies signed state, exchanges code for tokens
   * @param {string} code - OAuth authorization code
   * @param {string} state - Cryptographically signed state parameter
   * @param {string} [redirectUri] - Callback URL
   * @returns {Promise<{ userId: string, refreshTokenEncrypted: string, email: string, metadata: Object }>}
   */
  async handleCallback(code, state, redirectUri) {
    if (!code) {
      const err = new Error('Authorization code is missing from Google callback');
      err.statusCode = 400;
      throw err;
    }

    const stateResult = verifySignedState(state, 600000, true);
    if (!stateResult || !stateResult.userId) {
      const err = new Error('Invalid or expired OAuth state parameter (CSRF protection)');
      err.statusCode = 403;
      throw err;
    }

    const userId = stateResult.userId;
    const metadata = stateResult.metadata || {};

    const oauth2Client = this.createOAuthClient(redirectUri);
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    let refreshToken = tokens.refresh_token;

    // Get user info to record connected Google email
    let email = '';
    try {
      const tokenInfo = await oauth2Client.getTokenInfo(tokens.access_token);
      email = tokenInfo.email || '';
    } catch (_) {
      try {
        const res = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
          headers: { Authorization: `Bearer ${tokens.access_token}` }
        });
        if (res.ok) {
          const info = await res.json();
          email = info.email || '';
        }
      } catch (e) {
        console.warn('Failed to fetch user email from Google userinfo:', e.message);
      }
    }

    const refreshTokenEncrypted = refreshToken ? encryptToken(refreshToken) : '';

    return {
      userId,
      refreshTokenEncrypted,
      email,
      tokens,
      metadata
    };
  }

  /**
   * Returns a valid access token for the given encrypted refresh token
   * @param {string} refreshTokenEncrypted
   * @returns {Promise<{ accessToken: string, client: OAuth2Client }>}
   */
  async getAccessToken(refreshTokenEncrypted) {
    if (!refreshTokenEncrypted) {
      const err = new Error('Google Drive account is not connected');
      err.statusCode = 401;
      throw err;
    }

    const refreshToken = decryptToken(refreshTokenEncrypted);
    const oauth2Client = this.createOAuthClient();
    oauth2Client.setCredentials({ refresh_token: refreshToken });

    try {
      const res = await oauth2Client.getAccessToken();
      const accessToken = res?.token || res;
      if (!accessToken) {
        throw new Error('Failed to obtain access token from Google');
      }
      return { accessToken, client: oauth2Client };
    } catch (err) {
      const errorMsg = err.message || '';
      if (errorMsg.includes('invalid_grant') || errorMsg.includes('revoked')) {
        const error = new Error('Google Drive refresh token has expired or was revoked. Please reconnect your account.');
        error.statusCode = 401;
        error.code = 'DRIVE_TOKEN_EXPIRED';
        throw error;
      }
      throw err;
    }
  }

  /**
   * Ensures the root `NoteNest` folder and required subfolders exist in user's Drive
   * @param {string} refreshTokenEncrypted
   * @param {Object} [existingFolders={}]
   * @returns {Promise<Object>} Folder IDs
   */
  async ensureAppFolderStructure(refreshTokenEncrypted, existingFolders = {}) {
    const { accessToken } = await this.getAccessToken(refreshTokenEncrypted);

    // 1. Root NoteNest Folder
    let rootFolderId = existingFolders.rootFolderId;
    if (rootFolderId) {
      // Verify it exists and is not trashed
      const rootExists = await this.verifyFileExists(accessToken, rootFolderId);
      if (!rootExists) rootFolderId = null;
    }

    if (!rootFolderId) {
      rootFolderId = await this.findOrCreateFolder(accessToken, 'NoteNest', null);
    }

    // 2. Ensure Subfolders: Notebooks, Sections, Notes, Attachments
    const subfolderNames = ['Notebooks', 'Sections', 'Notes', 'Attachments'];
    const folderIds = { rootFolderId };

    for (const name of subfolderNames) {
      const key = `${name.toLowerCase()}FolderId`;
      let subId = existingFolders[key];
      if (subId) {
        const exists = await this.verifyFileExists(accessToken, subId);
        if (!exists) subId = null;
      }
      if (!subId) {
        subId = await this.findOrCreateFolder(accessToken, name, rootFolderId);
      }
      folderIds[key] = subId;
    }

    return folderIds;
  }

  /**
   * Verifies if a file or folder exists and is not in trash
   */
  async verifyFileExists(accessToken, fileId) {
    try {
      const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?fields=id,trashed`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      if (!res.ok) return false;
      const data = await res.json();
      return !data.trashed;
    } catch (_) {
      return false;
    }
  }

  /**
   * Finds or creates a folder by name inside an optional parent folder
   */
  async findOrCreateFolder(accessToken, folderName, parentId = null) {
    let q = `mimeType = 'application/vnd.google-apps.folder' and name = '${folderName}' and trashed = false`;
    if (parentId) {
      q += ` and '${parentId}' in parents`;
    }

    const searchUrl = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(q)}&fields=files(id,name)&spaces=drive`;
    const searchRes = await fetch(searchUrl, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (searchRes.ok) {
      const data = await searchRes.json();
      if (Array.isArray(data.files) && data.files.length > 0) {
        return data.files[0].id;
      }
    }

    // Create folder
    const metadata = {
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder'
    };
    if (parentId) {
      metadata.parents = [parentId];
    }

    const createRes = await fetch('https://www.googleapis.com/drive/v3/files?fields=id,name', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(metadata)
    });

    if (!createRes.ok) {
      const errorText = await createRes.text();
      throw new Error(`Failed to create Google Drive folder "${folderName}": ${errorText}`);
    }

    const created = await createRes.json();
    return created.id;
  }

  /**
   * Uploads or updates a file on Google Drive using multipart upload
   * @param {string} accessToken
   * @param {Object} params
   * @param {string} [params.fileId] - If provided, updates existing file
   * @param {string} [params.parentId] - Required if creating new file
   * @param {string} params.fileName - File name
   * @param {string} [params.mimeType='application/json']
   * @param {string|Object} params.content - Data to write
   * @returns {Promise<{ fileId: string, modifiedTime: string }>}
   */
  async uploadFile(accessToken, { fileId, parentId, fileName, mimeType = 'application/json', content }) {
    const rawContent = typeof content === 'string' ? content : JSON.stringify(content, null, 2);
    const boundary = '-------314159265358979323846';
    const delimiter = `\r\n--${boundary}\r\n`;
    const closeDelimiter = `\r\n--${boundary}--`;

    const metadata = {
      name: fileName,
      mimeType
    };

    if (parentId && !fileId) {
      metadata.parents = [parentId];
    }

    const multipartRequestBody =
      delimiter +
      'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
      JSON.stringify(metadata) +
      delimiter +
      `Content-Type: ${mimeType}\r\n\r\n` +
      rawContent +
      closeDelimiter;

    const url = fileId
      ? `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=multipart&fields=id,name,modifiedTime,version`
      : 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,modifiedTime,version';

    const method = fileId ? 'PATCH' : 'POST';

    const res = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': `multipart/related; boundary=${boundary}`,
        'Content-Length': Buffer.byteLength(multipartRequestBody).toString()
      },
      body: multipartRequestBody
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Failed to save file "${fileName}" on Google Drive: ${errText}`);
    }

    const result = await res.json();
    return {
      fileId: result.id,
      fileName: result.name,
      modifiedTime: result.modifiedTime,
      version: result.version || 1
    };
  }

  /**
   * Reads raw file content from Google Drive
   * @param {string} accessToken
   * @param {string} fileId
   * @returns {Promise<any>}
   */
  async getFileContent(accessToken, fileId) {
    const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (!res.ok) {
      if (res.status === 404) return null;
      const errText = await res.text();
      throw new Error(`Failed to read file ${fileId} from Google Drive: ${errText}`);
    }

    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch (_) {
      return text;
    }
  }

  /**
   * Trashes a file on Google Drive (moves to Google Drive trash)
   * @param {string} accessToken
   * @param {string} fileId
   */
  async trashFile(accessToken, fileId) {
    const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ trashed: true })
    });

    if (!res.ok && res.status !== 404) {
      const errText = await res.text();
      throw new Error(`Failed to trash file ${fileId} on Google Drive: ${errText}`);
    }

    return true;
  }

  /**
   * Untrashes a file on Google Drive (restores from Google Drive trash)
   * @param {string} accessToken
   * @param {string} fileId
   */
  async untrashFile(accessToken, fileId) {
    const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ trashed: false })
    });

    if (!res.ok && res.status !== 404) {
      const errText = await res.text();
      throw new Error(`Failed to restore file ${fileId} on Google Drive: ${errText}`);
    }

    return true;
  }

  /**
   * Permanently deletes a file from Google Drive (cannot be recovered)
   * @param {string} accessToken
   * @param {string} fileId
   */
  async deleteFile(accessToken, fileId) {
    const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    if (!res.ok && res.status !== 404) {
      const errText = await res.text();
      throw new Error(`Failed to permanently delete file ${fileId} on Google Drive: ${errText}`);
    }

    return true;
  }

  /**
   * Revokes token with Google upon disconnection
   */
  async revokeToken(refreshTokenEncrypted) {
    try {
      if (!refreshTokenEncrypted) return;
      const refreshToken = decryptToken(refreshTokenEncrypted);
      await fetch(`https://oauth2.googleapis.com/revoke?token=${encodeURIComponent(refreshToken)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
    } catch (e) {
      console.warn('Google token revocation notice:', e.message);
    }
  }
}

module.exports = new GoogleDriveService();

