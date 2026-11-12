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
 * @returns {string} URL-safe base64 signed state string
 */
function createSignedState(userId) {
  const key = getDerivedKey();
  const nonce = crypto.randomBytes(16).toString('hex');
  const timestamp = Date.now();
  const payload = `${userId}:${nonce}:${timestamp}`;
  const hmac = crypto.createHmac('sha256', key).update(payload).digest('hex');
  return Buffer.from(`${payload}:${hmac}`).toString('base64url');
}

/**
 * Verifies an HMAC-signed OAuth state parameter and returns the userId if valid
 * @param {string} state - The returned state parameter
 * @param {number} [maxAgeMs=600000] - State validity window (default 10 minutes)
 * @returns {string|null} userId if valid, or null if invalid/expired
 */
function verifySignedState(state, maxAgeMs = 600000) {
  try {
    if (!state) return null;
    const raw = Buffer.from(state, 'base64url').toString('utf8');
    const parts = raw.split(':');
    if (parts.length !== 4) return null;

    const [userId, nonce, timestampStr, signature] = parts;
    const key = getDerivedKey();
    const payload = `${userId}:${nonce}:${timestampStr}`;
    const expectedHmac = crypto.createHmac('sha256', key).update(payload).digest('hex');

    if (!crypto.timingSafeEqual(Buffer.from(signature, 'hex'), Buffer.from(expectedHmac, 'hex'))) {
      return null;
    }

    const timestamp = parseInt(timestampStr, 10);
    if (Date.now() - timestamp > maxAgeMs) {
      return null; // Expired state
    }

    return userId;
  } catch (_) {
    return null;
  }
}

module.exports = {
  encryptToken,
  decryptToken,
  createSignedState,
  verifySignedState
};
