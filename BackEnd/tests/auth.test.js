const request = require('supertest');
const app = require('../src/app');
const { connectDB, disconnectDB } = require('../src/config/database');
const User = require('../src/models/User');

const TEST_EMAIL = `test-auth-${Date.now()}@example.com`;
const TEST_PASSWORD = 'Password123!';
const TEST_NAME = 'Test User';

let accessToken = null;
let cookies = null;

beforeAll(async () => {
  await connectDB();
  await User.deleteOne({ email: TEST_EMAIL });
});

afterAll(async () => {
  await User.deleteOne({ email: TEST_EMAIL });
  await disconnectDB();
});

describe('NoteNest Authentication System', () => {
  describe('POST /api/auth/register', () => {
    it('should reject invalid email format', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ name: TEST_NAME, email: 'bad-email', password: TEST_PASSWORD });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should reject short password (< 6 chars)', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ name: TEST_NAME, email: TEST_EMAIL, password: '123' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should register a new user successfully and return tokens', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ name: TEST_NAME, email: TEST_EMAIL, password: TEST_PASSWORD });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe(TEST_EMAIL.toLowerCase());
      expect(res.body.data.user.password).toBeUndefined();
      expect(res.body.data.user.passwordHash).toBeUndefined();
      expect(res.body.data.token).toBeDefined();

      accessToken = res.body.data.token;
      cookies = res.headers['set-cookie'];
    });

    it('should reject duplicate email registration', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ name: TEST_NAME, email: TEST_EMAIL, password: TEST_PASSWORD });

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should reject invalid password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: TEST_EMAIL, password: 'WrongPassword999' });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should reject nonexistent email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'nonexistent-user@example.com', password: TEST_PASSWORD });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should login successfully with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: TEST_EMAIL, password: TEST_PASSWORD });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe(TEST_EMAIL.toLowerCase());
      expect(res.body.data.token).toBeDefined();
      expect(res.headers['set-cookie']).toBeDefined();

      accessToken = res.body.data.token;
      cookies = res.headers['set-cookie'];
    });
  });

  describe('GET /api/auth/me', () => {
    it('should reject unauthenticated request', async () => {
      const res = await request(app).get('/api/auth/me');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should return profile with Authorization header', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe(TEST_EMAIL.toLowerCase());
      expect(res.body.data.password).toBeUndefined();
    });

    it('should return profile with HttpOnly cookie', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Cookie', cookies);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe(TEST_EMAIL.toLowerCase());
    });
  });

  describe('POST /api/auth/refresh', () => {
    it('should rotate and refresh token via refresh token cookie', async () => {
      const res = await request(app)
        .post('/api/auth/refresh')
        .set('Cookie', cookies);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should logout and clear session', async () => {
      const res = await request(app)
        .post('/api/auth/logout')
        .set('Cookie', cookies);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('POST /api/auth/google', () => {
    it('should return controlled 503 error when GOOGLE_LOGIN_ENABLED is false', async () => {
      const prevFlag = process.env.GOOGLE_LOGIN_ENABLED;
      process.env.GOOGLE_LOGIN_ENABLED = 'false';

      const res = await request(app)
        .post('/api/auth/google')
        .send({ idToken: 'any.token' });

      expect(res.status).toBe(503);
      expect(res.body.success).toBe(false);
      expect(res.body.code).toBe('GOOGLE_LOGIN_DISABLED');

      if (prevFlag !== undefined) process.env.GOOGLE_LOGIN_ENABLED = prevFlag;
      else delete process.env.GOOGLE_LOGIN_ENABLED;
    });

    it('should reject requests with missing token when enabled', async () => {
      const prevFlag = process.env.GOOGLE_LOGIN_ENABLED;
      process.env.GOOGLE_LOGIN_ENABLED = 'true';

      const res = await request(app)
        .post('/api/auth/google')
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);

      if (prevFlag !== undefined) process.env.GOOGLE_LOGIN_ENABLED = prevFlag;
      else delete process.env.GOOGLE_LOGIN_ENABLED;
    });

    it('should reject invalid or tampered Google tokens when enabled', async () => {
      const prevFlag = process.env.GOOGLE_LOGIN_ENABLED;
      process.env.GOOGLE_LOGIN_ENABLED = 'true';
      process.env.GOOGLE_CLIENT_ID = 'test-client-id.apps.googleusercontent.com';

      const res = await request(app)
        .post('/api/auth/google')
        .send({ idToken: 'invalid.malformed.token' });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);

      if (prevFlag !== undefined) process.env.GOOGLE_LOGIN_ENABLED = prevFlag;
      else delete process.env.GOOGLE_LOGIN_ENABLED;
    });
  });
});
