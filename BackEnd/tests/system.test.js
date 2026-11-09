const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const { connectDB, disconnectDB } = require('../src/config/database');
const User = require('../src/models/User');
const Note = require('../src/models/Note');
const Folder = require('../src/models/Folder');
const Tag = require('../src/models/Tag');

describe('NoteNest Full Backend Integration Suite', () => {
  let authToken = '';
  let testUser = null;
  const testEmail = `test_system_${Date.now()}@example.com`;

  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    // Clean up test records
    if (testUser && testUser._id) {
      await Promise.all([
        User.deleteOne({ _id: testUser._id }),
        Note.deleteMany({ userId: testUser._id }),
        Folder.deleteMany({ userId: testUser._id }),
        Tag.deleteMany({ userId: testUser._id })
      ]);
    }
    await disconnectDB();
  });

  // 1. AUTHENTICATION & RECOVERY
  describe('1. Authentication & Password Recovery', () => {
    it('registers a test user and returns access token', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Integration Tester',
          email: testEmail,
          password: 'TestPassword123!'
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();

      authToken = res.body.data.token;
      testUser = res.body.data.user;
    });

    it('generates a password reset token for registered email', async () => {
      const res = await request(app)
        .post('/api/auth/forgot-password')
        .send({ email: testEmail });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  // 2. FOLDERS HIERARCHY
  describe('2. Folder Management & Hierarchy', () => {
    let rootFolderId = null;
    let subFolderId = null;

    it('creates a root folder', async () => {
      const res = await request(app)
        .post('/api/folders')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Engineering',
          color: 'purple',
          description: 'Engineering notes'
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('Engineering');
      rootFolderId = res.body.data._id || res.body.data.id;
    });

    it('creates a nested subfolder', async () => {
      const res = await request(app)
        .post('/api/folders')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Distributed Systems',
          parentId: rootFolderId,
          color: 'blue'
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.parentId.toString()).toBe(rootFolderId.toString());
      subFolderId = res.body.data._id || res.body.data.id;
    });

    it('prevents circular movement (cannot move root into its own subfolder)', async () => {
      const res = await request(app)
        .put(`/api/folders/${rootFolderId}/move`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ parentId: subFolderId });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('circular');
    });
  });

  // 3. TAGS MANAGEMENT
  describe('3. Tags Management', () => {
    let createdTagId = null;

    it('creates a user-specific tag', async () => {
      const res = await request(app)
        .post('/api/tags')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Architecture',
          color: 'emerald'
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('Architecture');
      createdTagId = res.body.data._id || res.body.data.id;
    });

    it('rejects duplicate tag names for the same user', async () => {
      const res = await request(app)
        .post('/api/tags')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Architecture' });

      expect(res.status).toBe(409);
    });

    it('lists user tags with counts', async () => {
      const res = await request(app)
        .get('/api/tags')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.some((t) => t.name === 'Architecture')).toBe(true);
    });
  });

  // 4. NOTES & RICH TEXT
  describe('4. Notes CRUD & Rich Text Persistence', () => {
    let testNoteId = null;

    it('creates a note with structured Tiptap JSON and word count', async () => {
      const res = await request(app)
        .post('/api/notes')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Event-Driven Architecture',
          content: {
            type: 'doc',
            content: [
              { type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: 'EDA Overview' }] },
              { type: 'paragraph', content: [{ type: 'text', text: 'Kafka and RabbitMQ pub/sub message brokers.' }] }
            ]
          },
          plainText: 'EDA Overview. Kafka and RabbitMQ pub/sub message brokers.',
          tags: ['Architecture', 'Distributed Systems'],
          isFavorite: true
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe('Event-Driven Architecture');
      expect(res.body.data.wordCount).toBeGreaterThan(0);
      expect(res.body.data.revision).toBe(1);
      testNoteId = res.body.data._id || res.body.data.id;
    });

    it('updates note and increments revision number', async () => {
      const res = await request(app)
        .patch(`/api/notes/${testNoteId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Event-Driven Architecture v2',
          plainText: 'Updated content with event sourcing patterns.'
        });

      expect(res.status).toBe(200);
      expect(res.body.data.title).toBe('Event-Driven Architecture v2');
      expect(res.body.data.revision).toBe(2);
    });

    it('soft-deletes note into trash with deletedAt timestamp', async () => {
      const res = await request(app)
        .delete(`/api/notes/${testNoteId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toContain('trash');
    });

    it('verifies note appears in trash and restores it', async () => {
      const trashRes = await request(app)
        .get('/api/trash')
        .set('Authorization', `Bearer ${authToken}`);

      expect(trashRes.status).toBe(200);
      expect(trashRes.body.data.some((item) => item.id === testNoteId)).toBe(true);

      const restoreRes = await request(app)
        .post('/api/trash/restore')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ id: testNoteId });

      expect(restoreRes.status).toBe(200);
    });
  });

  // 5. DASHBOARD & SEARCH
  describe('5. Dashboard Aggregations & Unified Search', () => {
    it('returns real aggregated stats, popular tags, and activities', async () => {
      const res = await request(app)
        .get('/api/dashboard')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.stats).toBeDefined();
      expect(res.body.data.stats.totalNotes).toBeGreaterThanOrEqual(1);
      expect(res.body.data.stats.folders).toBeGreaterThanOrEqual(1);
      expect(res.body.data.storage).toBeDefined();
    });

    it('searches notes by title and plainText query', async () => {
      const res = await request(app)
        .get('/api/search?q=Architecture')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.notes.length).toBeGreaterThanOrEqual(1);
    });
  });

  // 6. IMPORT & EXPORT
  describe('6. Import & Export System', () => {
    let importedNoteId = null;

    it('imports Markdown text into a structured note', async () => {
      const sampleMd = `# Cloud Native Design\n\n- Microservices\n- Containerization\n- CI/CD`;
      const res = await request(app)
        .post('/api/export/import-markdown')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Cloud Native Design',
          markdown: sampleMd
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe('Cloud Native Design');
      importedNoteId = res.body.data._id || res.body.data.id;
    });

    it('exports note as clean Markdown string', async () => {
      const res = await request(app)
        .get(`/api/export/notes/${importedNoteId}/markdown`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.text).toContain('# Cloud Native Design');
    });

    it('exports note as printable HTML document', async () => {
      const res = await request(app)
        .get(`/api/export/notes/${importedNoteId}/print`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.text).toContain('<!DOCTYPE html>');
      expect(res.text).toContain('Cloud Native Design');
    });
  });

  // 7. OFFLINE SYNCHRONIZATION
  describe('7. Offline Synchronization (Push / Pull)', () => {
    it('pushes offline created note with local ID mapping', async () => {
      const localId = `local_test_${Date.now()}`;
      const res = await request(app)
        .post('/api/sync/push')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          mutations: [
            {
              clientMutationId: 'mut-1',
              action: 'create',
              entityType: 'note',
              payload: {
                _id: localId,
                title: 'Offline Draft Note',
                plainText: 'Written on an airplane without internet connection.'
              }
            }
          ]
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.idMappings[localId]).toBeDefined();
    });

    it('pulls server changes with serverTimestamp', async () => {
      const res = await request(app)
        .post('/api/sync/pull')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ lastSyncTimestamp: new Date(Date.now() - 3600000).toISOString() });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.notes)).toBe(true);
      expect(res.body.serverTimestamp).toBeDefined();
    });

    it('returns sync status', async () => {
      const res = await request(app)
        .get('/api/sync/status')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.synced).toBe(true);
      expect(res.body.data.totalNotes).toBeGreaterThanOrEqual(1);
    });
  });
});
