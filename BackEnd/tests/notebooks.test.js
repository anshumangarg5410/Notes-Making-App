const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/User');
const Notebook = require('../src/models/Notebook');
const Section = require('../src/models/Section');
const Note = require('../src/models/Note');
const Folder = require('../src/models/Folder');
const migrationService = require('../src/services/migration.service');
const { connectDB, disconnectDB } = require('../src/config/database');

let tokenA;
let userAId;
let tokenB;
let userBId;

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await disconnectDB();
});

beforeEach(async () => {
  await User.deleteMany({ email: { $in: ['nb_user_a@test.com', 'nb_user_b@test.com'] } });
  
  const authA = await request(app).post('/api/auth/register').send({
    name: 'Notebook User A',
    email: 'nb_user_a@test.com',
    password: 'password123'
  });
  tokenA = authA.body.data?.token;
  userAId = authA.body.data?.user?._id || authA.body.data?.user?.id;

  const authB = await request(app).post('/api/auth/register').send({
    name: 'Notebook User B',
    email: 'nb_user_b@test.com',
    password: 'password123'
  });
  tokenB = authB.body.data?.token;
  userBId = authB.body.data?.user?._id || authB.body.data?.user?.id;
});

afterEach(async () => {
  if (userAId) {
    await Notebook.deleteMany({ userId: userAId });
    await Section.deleteMany({ userId: userAId });
    await Note.deleteMany({ userId: userAId });
    await Folder.deleteMany({ userId: userAId });
    await User.deleteMany({ _id: userAId });
  }
  if (userBId) {
    await Notebook.deleteMany({ userId: userBId });
    await Section.deleteMany({ userId: userBId });
    await Note.deleteMany({ userId: userBId });
    await Folder.deleteMany({ userId: userBId });
    await User.deleteMany({ _id: userBId });
  }
});

describe('Notebooks & Sections Hierarchy API', () => {
  it('should create a notebook and automatically initialize a General section', async () => {
    const res = await request(app)
      .post('/api/notebooks')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        name: 'DSA',
        color: 'pink',
        icon: 'book'
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe('DSA');

    // Verify sections of this notebook
    const sectionsRes = await request(app)
      .get(`/api/notebooks/${res.body.data._id}/sections`)
      .set('Authorization', `Bearer ${tokenA}`);

    expect(sectionsRes.status).toBe(200);
    expect(sectionsRes.body.data.length).toBeGreaterThanOrEqual(1);
    expect(sectionsRes.body.data[0].name).toBe('General');
  });

  it('should allow creating custom sections inside a notebook', async () => {
    const nbRes = await request(app)
      .post('/api/notebooks')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ name: 'College' });

    const nbId = nbRes.body.data._id;

    const secRes = await request(app)
      .post(`/api/notebooks/${nbId}/sections`)
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ name: 'Semester 1', icon: 'bookmark' });

    expect(secRes.status).toBe(201);
    expect(secRes.body.data.name).toBe('Semester 1');
    expect(secRes.body.data.notebookId.toString()).toBe(nbId.toString());
  });

  it('should isolate notebooks between users (User B cannot access User A notebook)', async () => {
    const nbRes = await request(app)
      .post('/api/notebooks')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ name: 'Personal Secrets' });

    const nbId = nbRes.body.data._id;

    // User B tries to access it
    const forbiddenRes = await request(app)
      .get(`/api/notebooks/${nbId}`)
      .set('Authorization', `Bearer ${tokenB}`);

    expect(forbiddenRes.status).toBe(404);
  });

  it('should move a section to another notebook', async () => {
    const nb1 = await request(app)
      .post('/api/notebooks')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ name: 'Notebook 1' });

    const nb2 = await request(app)
      .post('/api/notebooks')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ name: 'Notebook 2' });

    const sec = await request(app)
      .post(`/api/notebooks/${nb1.body.data._id}/sections`)
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ name: 'Movable Section' });

    const moveRes = await request(app)
      .patch(`/api/sections/${sec.body.data._id}/move`)
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ targetNotebookId: nb2.body.data._id });

    expect(moveRes.status).toBe(200);
    expect(moveRes.body.data.notebookId.toString()).toBe(nb2.body.data._id.toString());
  });

  it('should safely migrate existing folders and subfolders to notebooks and sections', async () => {
    // Create legacy root folder and subfolder
    const rootFolder = await Folder.create({
      userId: userAId,
      name: 'Legacy Projects',
      color: 'purple'
    });

    const subFolder = await Folder.create({
      userId: userAId,
      name: 'Frontend',
      parentId: rootFolder._id
    });

    // Create legacy note in subfolder
    const legacyNote = await Note.create({
      userId: userAId,
      title: 'Legacy React Note',
      folderId: subFolder._id,
      folder: 'Frontend'
    });

    // Run migration
    const result = await migrationService.migrateFoldersToNotebooks();
    expect(result.migratedNotebooks).toBeGreaterThanOrEqual(1);

    // Verify notebook was created
    const migratedNb = await Notebook.findOne({ userId: userAId, name: 'Legacy Projects' });
    expect(migratedNb).toBeTruthy();

    // Verify section was created
    const migratedSec = await Section.findOne({ userId: userAId, name: 'Frontend' });
    expect(migratedSec).toBeTruthy();
    expect(migratedSec.notebookId.toString()).toBe(migratedNb._id.toString());

    // Verify note is linked to notebook and section
    const updatedNote = await Note.findById(legacyNote._id);
    expect(updatedNote.notebookId.toString()).toBe(migratedNb._id.toString());
    expect(updatedNote.sectionId.toString()).toBe(migratedSec._id.toString());
    expect(updatedNote.notebook).toBe('Legacy Projects');
    expect(updatedNote.section).toBe('Frontend');
  });
});
