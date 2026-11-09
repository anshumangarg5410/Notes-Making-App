const request = require('supertest');
const app = require('../src/app');
const { connectDB, disconnectDB } = require('../src/config/database');
const User = require('../src/models/User');

const TEST_EMAIL = `test-notenest-${Date.now()}@example.com`;
const TEST_PASSWORD = 'StrongPassword123!';
const TEST_NAME = 'Test User';

async function runAuthTests() {
  console.log('--- Starting NoteNest Authentication System Verification ---\n');
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${message}`);
      failed++;
    }
  }

  try {
    // 1. Connect to MongoDB Atlas
    await connectDB();
    console.log('[Test Setup] Connected to MongoDB Atlas.');

    // Ensure clean state for test email
    await User.deleteOne({ email: TEST_EMAIL });

    // --- TEST SUITE 1: REGISTRATION ---
    console.log('\n--- 1. Testing Registration ---');

    // 1.1 Invalid email format
    const resBadEmail = await request(app)
      .post('/api/auth/register')
      .send({ name: TEST_NAME, email: 'invalid-email', password: TEST_PASSWORD });
    assert(resBadEmail.status === 400 && resBadEmail.body.success === false, 'Rejects invalid email format');

    // 1.2 Missing fields
    const resMissing = await request(app)
      .post('/api/auth/register')
      .send({ email: TEST_EMAIL });
    assert(resMissing.status === 400 && resMissing.body.success === false, 'Rejects missing required fields');

    // 1.3 Short password
    const resShortPass = await request(app)
      .post('/api/auth/register')
      .send({ name: TEST_NAME, email: TEST_EMAIL, password: '123' });
    assert(resShortPass.status === 400 && resShortPass.body.success === false, 'Rejects short password (< 6 chars)');

    // 1.4 Valid registration
    const resRegister = await request(app)
      .post('/api/auth/register')
      .send({ name: TEST_NAME, email: TEST_EMAIL, password: TEST_PASSWORD });

    assert(resRegister.status === 201 && resRegister.body.success === true, 'Registers new user with status 201');
    assert(resRegister.body.data.user.email === TEST_EMAIL, 'Returns normalized email');
    assert(!resRegister.body.data.user.password && !resRegister.body.data.user.passwordHash, 'Never returns password or passwordHash');
    assert(!!resRegister.body.data.token, 'Returns access token');
    assert(resRegister.headers['set-cookie'] && resRegister.headers['set-cookie'].length > 0, 'Attaches HttpOnly auth cookies');

    const regCookies = resRegister.headers['set-cookie'];
    const accessToken = resRegister.body.data.token;

    // 1.5 Duplicate email rejection
    const resDuplicate = await request(app)
      .post('/api/auth/register')
      .send({ name: TEST_NAME, email: TEST_EMAIL, password: TEST_PASSWORD });
    assert(resDuplicate.status === 409 && resDuplicate.body.success === false, 'Rejects duplicate email registration with 409');

    // --- TEST SUITE 2: DATABASE PERSISTENCE & ENCRYPTION ---
    console.log('\n--- 2. Testing Database Persistence & Encryption ---');
    const dbUser = await User.findOne({ email: TEST_EMAIL }).select('+password +passwordHash +refreshTokens');
    assert(!!dbUser, 'User is safely persisted in MongoDB Atlas');
    assert(dbUser.password !== TEST_PASSWORD, 'Password is never stored in plaintext');
    assert(dbUser.password && dbUser.password.startsWith('$2'), 'Password is encrypted using bcrypt');
    assert(dbUser.refreshTokens.length > 0, 'Hashed refresh token is stored in MongoDB');

    // --- TEST SUITE 3: LOGIN ---
    console.log('\n--- 3. Testing Login ---');

    // 3.1 Nonexistent email
    const resNonexistent = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nonexistent@example.com', password: TEST_PASSWORD });
    assert(resNonexistent.status === 401 && resNonexistent.body.success === false, 'Rejects nonexistent email with generic 401 error');

    // 3.2 Wrong password
    const resWrongPass = await request(app)
      .post('/api/auth/login')
      .send({ email: TEST_EMAIL, password: 'WrongPassword999' });
    assert(resWrongPass.status === 401 && resWrongPass.body.success === false, 'Rejects incorrect password with generic 401 error');

    // 3.3 Valid Login
    const resLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: TEST_EMAIL, password: TEST_PASSWORD });
    assert(resLogin.status === 200 && resLogin.body.success === true, 'Authenticates valid credentials with status 200');
    assert(resLogin.body.data.user.name === TEST_NAME, 'Returns correct user profile');
    assert(!resLogin.body.data.user.password && !resLogin.body.data.user.passwordHash, 'Never returns password in login response');
    assert(resLogin.headers['set-cookie'] && resLogin.headers['set-cookie'].length > 0, 'Attaches HttpOnly auth cookies on login');

    const loginCookies = resLogin.headers['set-cookie'];
    const loginAccessToken = resLogin.body.data.token;

    // --- TEST SUITE 4: SESSION & PROTECTED ROUTE (/api/auth/me) ---
    console.log('\n--- 4. Testing Session & Protected Route (/api/auth/me) ---');

    // 4.1 Unauthenticated access
    const resUnauth = await request(app).get('/api/auth/me');
    assert(resUnauth.status === 401 && resUnauth.body.success === false, 'Rejects unauthenticated request with 401');

    // 4.2 Access via Authorization header
    const resAuthHeader = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${loginAccessToken}`);
    assert(resAuthHeader.status === 200 && resAuthHeader.body.success === true, 'Authenticates via Authorization Bearer header');
    assert(resAuthHeader.body.data.email === TEST_EMAIL, 'Returns correct authenticated user data');

    // 4.3 Access via HttpOnly Cookie
    const resAuthCookie = await request(app)
      .get('/api/auth/me')
      .set('Cookie', loginCookies);
    assert(resAuthCookie.status === 200 && resAuthCookie.body.success === true, 'Authenticates via HttpOnly access_token cookie');

    // --- TEST SUITE 5: TOKEN REFRESH & ROTATION ---
    console.log('\n--- 5. Testing Token Refresh & Rotation ---');
    const resRefresh = await request(app)
      .post('/api/auth/refresh')
      .set('Cookie', loginCookies);
    assert(resRefresh.status === 200 && resRefresh.body.success === true, 'Rotates and issues new token via refresh token');
    assert(!!resRefresh.body.data.token, 'Returns new access token');

    // --- TEST SUITE 6: LOGOUT ---
    console.log('\n--- 6. Testing Logout ---');
    const resLogout = await request(app)
      .post('/api/auth/logout')
      .set('Cookie', loginCookies);
    assert(resLogout.status === 200 && resLogout.body.success === true, 'Logs out successfully with status 200');

    // Clean up test account
    await User.deleteOne({ email: TEST_EMAIL });
    console.log('\n[Cleanup] Test account cleaned up.');

    console.log(`\n========================================`);
    console.log(`Test Results: ${passed} Passed, ${failed} Failed`);
    console.log(`========================================\n`);

    await disconnectDB();

    if (failed > 0) {
      process.exit(1);
    }
  } catch (err) {
    console.error('[Verification Fatal]:', err);
    await disconnectDB();
    process.exit(1);
  }
}

runAuthTests();

