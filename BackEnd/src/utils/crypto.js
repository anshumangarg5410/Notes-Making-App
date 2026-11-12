const crypto = require('crypto');
const environment = require('../config/environment');

const ALGORITHM = 'aes-256-gcm';

/**
 * Derives a 32-byte key from the configured encryption secret
 */
function getDerivedKey() {
  const secret = environment.storage?.encryptionKey || 'notenest_secure_storage_encryption_key_2026';
  return crypto.createHash('sha256').update(secret).digest();
}

/**
 * Encrypts a string (e.g. OAuth refresh token) using AES-256-GCM
 * @param {string} text - Plain text to encrypt
 * @returns {string} Colon-separated hex string `iv:tag:ciphertext`
 */
function encryptToken(text) {
  if (!text) return '';
  const key = getDerivedKey();
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const tag = cipher.getAuthTag();

  return `${iv.toString('hex')}:${tag.toString('hex')}:${encrypted}`;
}

/**
 * Decrypts an encrypted token string using AES-256-GCM
 * @param {string} encryptedToken - Colon-separated hex string `iv:tag:ciphertext`
 * @returns {string} Decrypted plaintext string
 */
function decryptToken(encryptedToken) {
  if (!encryptedToken) return '';
  const parts = encryptedToken.split(':');
  if (parts.length !== 3) {
    throw new Error('Invalid encrypted token format');
  }

  const [ivHex, tagHex, encryptedHex] = parts;
  const key = getDerivedKey();
  const iv = Buffer.from(ivHex, 'hex');
  const tag = Buffer.from(tagHex, 'hex');

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(tag);

  let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

/**
 * Generates an HMAC-signed state parameter to prevent CSRF during OAuth redirect
 * @param {string} userId - Authenticated user's ID
 * @param {Object} [metadata={}] - Optional metadata such as origin
 * @returns {string} URL-safe base64 signed state string
 */
function createSignedState(userId, metadata = {}) {
  const key = getDerivedKey();
  const nonce = crypto.randomBytes(16).toString('hex');
  const timestamp = Date.now();
  const metaStr = Buffer.from(JSON.stringify(metadata)).toString('base64url');
  const payload = `${userId}:${nonce}:${timestamp}:${metaStr}`;
  const hmac = crypto.createHmac('sha256', key).update(payload).digest('hex');
  return Buffer.from(`${payload}:${hmac}`).toString('base64url');
}

/**
 * Verifies an HMAC-signed OAuth state parameter and returns the userId if valid
 * @param {string} state - The returned state parameter
 * @param {number} [maxAgeMs=600000] - State validity window (default 10 minutes)
 * @param {boolean} [returnMeta=false] - Return object with metadata if true
 * @returns {string|Object|null} userId (or { userId, metadata }) if valid, or null if invalid/expired
 */
function verifySignedState(state, maxAgeMs = 600000, returnMeta = false) {
  try {
    if (!state) return null;
    const raw = Buffer.from(state, 'base64url').toString('utf8');
    const parts = raw.split(':');
    const key = getDerivedKey();

    if (parts.length === 5) {
      const [userId, nonce, timestampStr, metaStr, signature] = parts;
      const payload = `${userId}:${nonce}:${timestampStr}:${metaStr}`;
      const expectedHmac = crypto.createHmac('sha256', key).update(payload).digest('hex');

      if (!crypto.timingSafeEqual(Buffer.from(signature, 'hex'), Buffer.from(expectedHmac, 'hex'))) {
        return null;
      }

      const timestamp = parseInt(timestampStr, 10);
      if (Date.now() - timestamp > maxAgeMs) {
        return null; // Expired state
      }

      let metadata = {};
      try {
        metadata = JSON.parse(Buffer.from(metaStr, 'base64url').toString('utf8'));
      } catch (_) {}

      return returnMeta ? { userId, metadata } : userId;
    } else if (parts.length === 4) {
      // Legacy 4-part state (no metadata)
      const [userId, nonce, timestampStr, signature] = parts;
      const payload = `${userId}:${nonce}:${timestampStr}`;
      const expectedHmac = crypto.createHmac('sha256', key).update(payload).digest('hex');

      if (!crypto.timingSafeEqual(Buffer.from(signature, 'hex'), Buffer.from(expectedHmac, 'hex'))) {
        return null;
      }

      const timestamp = parseInt(timestampStr, 10);
      if (Date.now() - timestamp > maxAgeMs) {
        return null; // Expired state
      }

      return returnMeta ? { userId, metadata: {} } : userId;
    }

    return null;
  } catch (_) {
    return null;
  }
}

/**
 * Peeks at metadata from signed state before full verification (e.g. for error redirects)
 * @param {string} state
 * @returns {Object|null}
 */
function peekSignedState(state) {
  try {
    if (!state) return null;
    const raw = Buffer.from(state, 'base64url').toString('utf8');
    const parts = raw.split(':');
    if (parts.length === 5) {
      const [userId, , , metaStr] = parts;
      let metadata = {};
      try {
        metadata = JSON.parse(Buffer.from(metaStr, 'base64url').toString('utf8'));
      } catch (_) {}
      return { userId, metadata };
    } else if (parts.length === 4) {
      return { userId: parts[0], metadata: {} };
    }
    return null;
  } catch (_) {
    return null;
  }
}

module.exports = {
  encryptToken,
  decryptToken,
  createSignedState,
  verifySignedState,
  peekSignedState
};

