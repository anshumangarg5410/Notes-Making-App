const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/User');
const StoragePreference = require('../src/models/StoragePreference');
const { encryptToken, decryptToken, createSignedState, verifySignedState } = require('../src/utils/crypto');
const { connectDB, disconnectDB } = require('../src/config/database');

describe('Storage & Google Drive Architecture API', () => {
  let tokenA;
  let userAId;
  let tokenB;
  let userBId;

  beforeAll(async () => {
    await connectDB();

    // Create User A
    const resA = await request(app).post('/api/auth/register').send({
      name: 'Storage User A',
      email: `storage_a_${Date.now()}@notenest.test`,
      password: 'password123',
      confirmPassword: 'password123'
    });
    tokenA = resA.body.data?.token || resA.body.token;
    userAId = resA.body.data?.user?.id || resA.body.data?.user?._id;

    // Create User B
    const resB = await request(app).post('/api/auth/register').send({
      name: 'Storage User B',
      email: `storage_b_${Date.now()}@notenest.test`,
      password: 'password123',
      confirmPassword: 'password123'
    });
    tokenB = resB.body.data?.token || resB.body.token;
    userBId = resB.body.data?.user?.id || resB.body.data?.user?._id;
  });

  afterAll(async () => {
    if (userAId) {
      await User.findByIdAndDelete(userAId);
      await StoragePreference.deleteMany({ userId: userAId });
    }
    if (userBId) {
      await User.findByIdAndDelete(userBId);
      await StoragePreference.deleteMany({ userId: userBId });
    }
    await disconnectDB();
  });

  describe('Security & Encryption Utilities', () => {
    it('should encrypt and decrypt tokens correctly using AES-256-GCM', () => {
      const secret = '1//04random_refresh_token_string_example';
      const encrypted = encryptToken(secret);
      expect(encrypted).toBeDefined();
      expect(encrypted).not.toEqual(secret);
      expect(encrypted.split(':').length).toBe(3); // iv:tag:ciphertext

      const decrypted = decryptToken(encrypted);
      expect(decrypted).toEqual(secret);
    });

    it('should generate HMAC signed state and verify authentic requests', () => {
      const state = createSignedState(userAId);
      expect(state).toBeDefined();

      const verified = verifySignedState(state);
      expect(verified).toEqual(userAId);
    });

    it('should reject tampered or forged state parameters', () => {
      const state = createSignedState(userAId);
      const tampered = state.slice(0, -4) + 'abcd';
      const verified = verifySignedState(tampered);
      expect(verified).toBeNull();
    });
  });

  describe('GET /api/storage/preferences', () => {
    it('should reject unauthenticated requests', async () => {
      const res = await request(app).get('/api/storage/preferences');
      expect(res.status).toBe(401);
    });

    it('should return initial preferences with onboardingCompleted: false for new users', async () => {
      const res = await request(app)
        .get('/api/storage/preferences')
        .set('Authorization', `Bearer ${tokenA}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.provider).toBe('local');
      expect(res.body.data.onboardingCompleted).toBe(false);
      expect(res.body.data.existingMongoData).toBeDefined();
    });
  });

  describe('POST /api/storage/preferences', () => {
    it('should update storage provider and mark onboarding as complete', async () => {
      const res = await request(app)
        .post('/api/storage/preferences')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({
          provider: 'local',
          onboardingCompleted: true
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.provider).toBe('local');
      expect(res.body.data.onboardingCompleted).toBe(true);

      // Verify persistence in DB
      const pref = await StoragePreference.findOne({ userId: userAId });
      expect(pref.provider).toBe('local');
      expect(pref.onboardingCompleted).toBe(true);
    });
  });

  describe('GET /api/storage/google/connect', () => {
    it('should generate a Google Drive OAuth authorization URL with drive.file scope', async () => {
      const res = await request(app)
        .get('/api/storage/google/connect')
        .set('Authorization', `Bearer ${tokenA}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.authUrl).toContain('accounts.google.com/o/oauth2');
      expect(res.body.data.authUrl).toContain(encodeURIComponent('https://www.googleapis.com/auth/drive.file'));
      expect(res.body.data.state).toBeDefined();

      // State parameter must verify to user A
      const verified = verifySignedState(res.body.data.state);
      expect(verified).toEqual(userAId);
    });
  });

  describe('GET /api/storage/google/status', () => {
    it('should return connected: false when Google Drive is not connected', async () => {
      const res = await request(app)
        .get('/api/storage/google/status')
        .set('Authorization', `Bearer ${tokenA}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.connected).toBe(false);
    });
  });

  describe('User Isolation and Data Integrity', () => {
    it('should enforce strict user isolation (User B cannot see or overwrite User A preferences)', async () => {
      // User B updates preference
      await request(app)
        .post('/api/storage/preferences')
        .set('Authorization', `Bearer ${tokenB}`)
        .send({
          provider: 'local',
          onboardingCompleted: false
        });

      // User A preferences must remain unchanged (onboardingCompleted: true)
      const resA = await request(app)
        .get('/api/storage/preferences')
        .set('Authorization', `Bearer ${tokenA}`);

      expect(resA.body.data.onboardingCompleted).toBe(true);

      const resB = await request(app)
        .get('/api/storage/preferences')
        .set('Authorization', `Bearer ${tokenB}`);

      expect(resB.body.data.onboardingCompleted).toBe(false);
    });
  });
});
