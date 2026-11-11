const request = require('supertest');
const app = require('../src/app');
const { connectDB, disconnectDB } = require('../src/config/database');
const User = require('../src/models/User');
const { generateAccessToken } = require('../src/utils/token');

const TEST_EMAIL = `ai-draw-${Date.now()}@test.com`;

describe('Smart Ink AI Drawing Endpoint', () => {
  let token;
  let testUser;

  beforeAll(async () => {
    await connectDB();
    await User.deleteOne({ email: TEST_EMAIL });

    testUser = await User.create({
      name: 'SmartInk Tester',
      email: TEST_EMAIL,
      password: 'password123'
    });
    token = generateAccessToken(testUser);
  });

  afterAll(async () => {
    if (testUser) {
      await User.deleteOne({ email: TEST_EMAIL });
    }
    await disconnectDB();
  });

  it('should reject unauthenticated requests to /api/drawing/ai-cleanup with 401', async () => {
    const res = await request(app)
      .post('/api/drawing/ai-cleanup')
      .send({ image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==' });

    expect(res.status).toBe(401);
  });

  it('should reject requests with missing image data with 400', async () => {
    const res = await request(app)
      .post('/api/drawing/ai-cleanup')
      .set('Authorization', `Bearer ${token}`)
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should return friendly 503 error if GEMINI_API_KEY is missing on server', async () => {
    const originalKey = process.env.GEMINI_API_KEY;
    delete process.env.GEMINI_API_KEY;

    const res = await request(app)
      .post('/api/drawing/ai-cleanup')
      .set('Authorization', `Bearer ${token}`)
      .send({
        image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
      });

    if (originalKey) process.env.GEMINI_API_KEY = originalKey;

    expect(res.status).toBe(503);
    expect(res.body.message).toMatch(/GEMINI_API_KEY/i);
  });
});
