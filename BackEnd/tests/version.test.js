const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/User');
const Note = require('../src/models/Note');
const NoteVersion = require('../src/models/NoteVersion');
const { connectDB, disconnectDB } = require('../src/config/database');
const versionService = require('../src/services/version.service');

describe('Version History System API', () => {
  let userA, tokenA;
  let userB, tokenB;
  let testNote;

  beforeAll(async () => {
    await connectDB();

    // Clean test artifacts
    await User.deleteMany({ email: { $in: ['version_user_a@test.com', 'version_user_b@test.com'] } });

    // Register User A
    const resA = await request(app).post('/api/auth/register').send({
      name: 'Version User A',
      email: 'version_user_a@test.com',
      password: 'Password123!'
    });
    tokenA = resA.body.data.token;
    userA = resA.body.data.user;

    // Register User B
    const resB = await request(app).post('/api/auth/register').send({
      name: 'Version User B',
      email: 'version_user_b@test.com',
      password: 'Password123!'
    });
    tokenB = resB.body.data.token;
    userB = resB.body.data.user;
  });

  afterAll(async () => {
    if (userA) {
      await Note.deleteMany({ userId: userA._id });
      await NoteVersion.deleteMany({ userId: userA._id });
      await User.findByIdAndDelete(userA._id);
    }
    if (userB) {
      await Note.deleteMany({ userId: userB._id });
      await NoteVersion.deleteMany({ userId: userB._id });
      await User.findByIdAndDelete(userB._id);
    }
    await disconnectDB();
  });

  beforeEach(async () => {
    // Create fresh test note for User A
    testNote = await Note.create({
      userId: userA._id,
      title: 'Initial Title',
      content: '<p>Initial Content v1</p>',
      plainText: 'Initial Content v1'
    });
  });

  afterEach(async () => {
    if (testNote) {
      await Note.findByIdAndDelete(testNote._id);
      await NoteVersion.deleteMany({ noteId: testNote._id });
    }
  });

  describe('Manual Snapshots (POST /api/notes/:noteId/versions)', () => {
    it('should reject unauthenticated request', async () => {
      const res = await request(app)
        .post(`/api/notes/${testNote._id}/versions`)
        .send({ versionName: 'Manual 1' });

      expect(res.status).toBe(401);
    });

    it('should create a manual snapshot immediately', async () => {
      const res = await request(app)
        .post(`/api/notes/${testNote._id}/versions`)
        .set('Authorization', `Bearer ${tokenA}`)
        .send({
          versionName: 'First Milestone',
          title: 'Initial Title',
          content: '<p>Initial Content v1</p>',
          plainText: 'Initial Content v1'
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.versionType).toBe('manual');
      expect(res.body.data.versionName).toBe('First Milestone');
      expect(res.body.data.title).toBe('Initial Title');

      const saved = await NoteVersion.findById(res.body.data._id);
      expect(saved).not.toBeNull();
      expect(saved.versionName).toBe('First Milestone');
    });

    it('should allow multiple manual snapshots without interval blocks', async () => {
      const res1 = await request(app)
        .post(`/api/notes/${testNote._id}/versions`)
        .set('Authorization', `Bearer ${tokenA}`)
        .send({ versionName: 'Snapshot A' });

      const res2 = await request(app)
        .post(`/api/notes/${testNote._id}/versions`)
        .set('Authorization', `Bearer ${tokenA}`)
        .send({ versionName: 'Snapshot B' });

      expect(res1.status).toBe(201);
      expect(res2.status).toBe(201);
      expect(res1.body.data._id).not.toBe(res2.body.data._id);
    });
  });

  describe('Automatic Snapshots and Duplicate Prevention', () => {
    it('should not create duplicate automatic snapshot if content has not changed', async () => {
      // 1. Create first automatic version
      const v1 = await versionService.createSnapshot(userA._id, testNote._id, {
        versionType: 'automatic',
        title: testNote.title,
        content: testNote.content,
        plainText: testNote.plainText
      });

      // 2. Try creating second automatic version with identical content
      const v2 = await versionService.createSnapshot(userA._id, testNote._id, {
        versionType: 'automatic',
        title: testNote.title,
        content: testNote.content,
        plainText: testNote.plainText
      });

      expect(v1._id.toString()).toBe(v2._id.toString());
      const count = await NoteVersion.countDocuments({ noteId: testNote._id });
      expect(count).toBe(1);
    });

    it('should trigger automatic snapshot on note update through noteService', async () => {
      // Note update with meaningful new content
      const noteService = require('../src/services/note.service');
      await noteService.update(userA._id, testNote._id, {
        content: '<p>Updated content via editor autosave</p>',
        plainText: 'Updated content via editor autosave'
      });

      // Allow async task to complete
      await new Promise((resolve) => setTimeout(resolve, 100));

      const versions = await NoteVersion.find({ noteId: testNote._id, versionType: 'automatic' });
      expect(versions.length).toBeGreaterThan(0);
      expect(versions[0].plainText).toBe('Updated content via editor autosave');
    });
  });

  describe('Listing and Retrieving Versions (GET)', () => {
    it('should return versions sorted chronologically newest first', async () => {
      await NoteVersion.create([
        {
          userId: userA._id,
          noteId: testNote._id,
          title: 'Older Version',
          content: '<p>Old</p>',
          versionType: 'manual',
          createdAt: new Date(Date.now() - 3600000)
        },
        {
          userId: userA._id,
          noteId: testNote._id,
          title: 'Newer Version',
          content: '<p>New</p>',
          versionType: 'manual',
          createdAt: new Date(Date.now() - 1000)
        }
      ]);

      const res = await request(app)
        .get(`/api/notes/${testNote._id}/versions`)
        .set('Authorization', `Bearer ${tokenA}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(2);
      expect(res.body.data[0].title).toBe('Newer Version');
      expect(res.body.data[1].title).toBe('Older Version');
    });

    it('should retrieve specific version by versionId', async () => {
      const v = await NoteVersion.create({
        userId: userA._id,
        noteId: testNote._id,
        title: 'Draft 1',
        content: '<p>Specific content</p>',
        versionType: 'manual'
      });

      const res = await request(app)
        .get(`/api/notes/${testNote._id}/versions/${v._id}`)
        .set('Authorization', `Bearer ${tokenA}`);

      expect(res.status).toBe(200);
      expect(res.body.data.content).toBe('<p>Specific content</p>');
    });
  });

  describe('Version Restoration (POST /:versionId/restore)', () => {
    it('should restore historical content and create a pre-restore backup', async () => {
      // 1. Create a historical version
      const oldVersion = await NoteVersion.create({
        userId: userA._id,
        noteId: testNote._id,
        title: 'Golden State Title',
        content: '<p>Golden State Content</p>',
        plainText: 'Golden State Content',
        versionType: 'manual'
      });

      // 2. Modify active note
      testNote.title = 'Current Bad State';
      testNote.content = '<p>Current Bad Content</p>';
      testNote.plainText = 'Current Bad Content';
      await testNote.save();

      // 3. Restore old version
      const res = await request(app)
        .post(`/api/notes/${testNote._id}/versions/${oldVersion._id}/restore`)
        .set('Authorization', `Bearer ${tokenA}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.note.title).toBe('Golden State Title');
      expect(res.body.data.note.content).toBe('<p>Golden State Content</p>');

      // Verify that pre-restore snapshot was preserved
      const preRestore = await NoteVersion.findOne({
        noteId: testNote._id,
        versionType: 'pre-restore'
      });
      expect(preRestore).not.toBeNull();
      expect(preRestore.title).toBe('Current Bad State');
      expect(preRestore.content).toBe('<p>Current Bad Content</p>');

      // Verify note in DB is restored
      const updatedNote = await Note.findById(testNote._id);
      expect(updatedNote.title).toBe('Golden State Title');
    });
  });

  describe('User Isolation and Security', () => {
    it('should forbid User B from accessing User A note versions', async () => {
      const res = await request(app)
        .get(`/api/notes/${testNote._id}/versions`)
        .set('Authorization', `Bearer ${tokenB}`);

      expect(res.status).toBe(404);
    });

    it('should forbid User B from restoring User A note version', async () => {
      const v = await NoteVersion.create({
        userId: userA._id,
        noteId: testNote._id,
        title: 'Confidential',
        content: '<p>Secret</p>',
        versionType: 'manual'
      });

      const res = await request(app)
        .post(`/api/notes/${testNote._id}/versions/${v._id}/restore`)
        .set('Authorization', `Bearer ${tokenB}`);

      expect(res.status).toBe(404);
    });
  });

  describe('Retention Policy and Cleanup', () => {
    it('should prune excess automatic versions when exceeding limit', async () => {
      // Create 52 versions
      const versions = [];
      for (let i = 0; i < 52; i++) {
        versions.push({
          userId: userA._id,
          noteId: testNote._id,
          title: `Version ${i}`,
          content: `<p>Content ${i}</p>`,
          versionType: 'automatic',
          createdAt: new Date(Date.now() - (60 - i) * 60000)
        });
      }
      await NoteVersion.insertMany(versions);

      await versionService.enforceRetention(testNote._id, userA._id);

      const remaining = await NoteVersion.countDocuments({ noteId: testNote._id });
      expect(remaining).toBeLessThanOrEqual(50);
    });

    it('should delete versions when note is permanently deleted', async () => {
      await NoteVersion.create({
        userId: userA._id,
        noteId: testNote._id,
        title: 'V1',
        content: '<p>C1</p>'
      });

      const noteService = require('../src/services/note.service');
      await noteService.permanentDelete(userA._id, testNote._id);

      const count = await NoteVersion.countDocuments({ noteId: testNote._id });
      expect(count).toBe(0);
      testNote = null;
    });
  });
});

