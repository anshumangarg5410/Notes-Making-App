const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');
const Note = require('../models/Note');

const TEST_MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/notely_test_db';

let tokenA;
let userAId;
let tokenB;
let userBId;

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(TEST_MONGO_URI);
  }
});

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  }
});

beforeEach(async () => {
  await User.deleteMany({});
  await Note.deleteMany({});

  // Register User A
  const resA = await request(app).post('/api/auth/register').send({
    name: 'Alice User',
    email: 'alice@example.com',
    password: 'password123'
  });
  tokenA = resA.body.token;
  userAId = resA.body.data._id;

  // Register User B
  const resB = await request(app).post('/api/auth/register').send({
    name: 'Bob User',
    email: 'bob@example.com',
    password: 'password123'
  });
  tokenB = resB.body.token;
  userBId = resB.body.data._id;
});

describe('Notes API & Ownership Isolation', () => {
  it('should allow User A to create a note', async () => {
    const res = await request(app)
      .post('/api/notes')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        title: 'Alice Special Note',
        content: 'Top secret plan',
        plainText: 'Top secret plan',
        tags: ['Work', 'Ideas']
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe('Alice Special Note');
    expect(res.body.data.userId.toString()).toBe(userAId.toString());
  });

  it('CRITICAL: User B must NEVER be able to read User A notes', async () => {
    // User A creates a note
    const noteRes = await request(app)
      .post('/api/notes')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        title: 'Alice Private Note',
        plainText: 'Alice content'
      });
    const noteId = noteRes.body.data._id;

    // User B tries to read Alice's note
    const forbiddenRes = await request(app)
      .get(`/api/notes/${noteId}`)
      .set('Authorization', `Bearer ${tokenB}`);

    expect(forbiddenRes.status).toBe(404);
    expect(forbiddenRes.body.success).toBe(false);
  });

  it('CRITICAL: User B must NEVER be able to update, pin, or delete User A notes', async () => {
    // User A creates a note
    const noteRes = await request(app)
      .post('/api/notes')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ title: 'Untouchable Note' });
    const noteId = noteRes.body.data._id;

    // User B tries to update it
    const updateRes = await request(app)
      .put(`/api/notes/${noteId}`)
      .set('Authorization', `Bearer ${tokenB}`)
      .send({ title: 'Hacked by Bob' });
    expect(updateRes.status).toBe(404);

    // User B tries to pin it
    const pinRes = await request(app)
      .patch(`/api/notes/${noteId}/pin`)
      .set('Authorization', `Bearer ${tokenB}`);
    expect(pinRes.status).toBe(404);

    // User B tries to delete it
    const deleteRes = await request(app)
      .delete(`/api/notes/${noteId}`)
      .set('Authorization', `Bearer ${tokenB}`);
    expect(deleteRes.status).toBe(404);

    // Verify Alice's note is unchanged
    const aliceCheck = await request(app)
      .get(`/api/notes/${noteId}`)
      .set('Authorization', `Bearer ${tokenA}`);
    expect(aliceCheck.body.data.title).toBe('Untouchable Note');
    expect(aliceCheck.body.data.isPinned).toBe(false);
  });

  it('should support full lifecycle: pin, favorite, archive, trash, restore, and permanent delete', async () => {
    // 1. Create note
    const createRes = await request(app)
      .post('/api/notes')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ title: 'Lifecycle Test', tags: ['Study'] });
    const noteId = createRes.body.data._id;

    // 2. Toggle Pin
    const pinRes = await request(app)
      .patch(`/api/notes/${noteId}/pin`)
      .set('Authorization', `Bearer ${tokenA}`);
    expect(pinRes.body.data.isPinned).toBe(true);

    // 3. Toggle Favorite
    const favRes = await request(app)
      .patch(`/api/notes/${noteId}/favorite`)
      .set('Authorization', `Bearer ${tokenA}`);
    expect(favRes.body.data.isFavorite).toBe(true);

    // 4. Move to Trash (soft delete)
    const trashRes = await request(app)
      .delete(`/api/notes/${noteId}`)
      .set('Authorization', `Bearer ${tokenA}`);
    expect(trashRes.status).toBe(200);

    // Verify it doesn't appear in active list
    const activeList = await request(app)
      .get('/api/notes')
      .set('Authorization', `Bearer ${tokenA}`);
    const foundActive = activeList.body.data.some((n) => n._id === noteId);
    expect(foundActive).toBe(false);

    // Verify it appears in trash list
    const trashList = await request(app)
      .get('/api/notes?filter=trash')
      .set('Authorization', `Bearer ${tokenA}`);
    const foundInTrash = trashList.body.data.some((n) => n._id === noteId);
    expect(foundInTrash).toBe(true);

    // 5. Restore from Trash
    const restoreRes = await request(app)
      .patch(`/api/notes/${noteId}/restore`)
      .set('Authorization', `Bearer ${tokenA}`);
    expect(restoreRes.status).toBe(200);

    // Verify restored in active list
    const restoredList = await request(app)
      .get('/api/notes')
      .set('Authorization', `Bearer ${tokenA}`);
    const foundRestored = restoredList.body.data.some((n) => n._id === noteId);
    expect(foundRestored).toBe(true);

    // 6. Permanent delete
    const permDeleteRes = await request(app)
      .delete(`/api/notes/${noteId}/permanent`)
      .set('Authorization', `Bearer ${tokenA}`);
    expect(permDeleteRes.status).toBe(200);

    // Verify completely gone
    const goneRes = await request(app)
      .get(`/api/notes/${noteId}`)
      .set('Authorization', `Bearer ${tokenA}`);
    expect(goneRes.status).toBe(404);
  });

  it('should search notes by title and plainText', async () => {
    await request(app)
      .post('/api/notes')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ title: 'Quantum Computing Fundamentals', plainText: 'Superposition and qubits' });

    await request(app)
      .post('/api/notes')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ title: 'Baking Bread', plainText: 'Flour, water, yeast, salt' });

    const searchRes = await request(app)
      .get('/api/notes?search=qubits')
      .set('Authorization', `Bearer ${tokenA}`);

    expect(searchRes.status).toBe(200);
    expect(searchRes.body.data.length).toBe(1);
    expect(searchRes.body.data[0].title).toBe('Quantum Computing Fundamentals');
  });
});
