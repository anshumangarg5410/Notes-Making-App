const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const Note = require('../models/Note');
const { seedStarterNotesForUser } = require('../utils/seedNotes');

const resetAndSeed = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI is missing in environment variables');
    }

    console.log('[Reset] Connecting to MongoDB...');
    const conn = await mongoose.connect(mongoUri);
    console.log(`[Reset] Connected to host: ${conn.connection.host}`);
    console.log(`[Reset] Database name: ${conn.connection.name}`);

    // 1. Delete all existing notes and users
    console.log('[Reset] Clearing notes collection...');
    const deletedNotes = await Note.deleteMany({});
    console.log(`[Reset] Removed ${deletedNotes.deletedCount} notes.`);

    console.log('[Reset] Clearing users collection...');
    const deletedUsers = await User.deleteMany({});
    console.log(`[Reset] Removed ${deletedUsers.deletedCount} users.`);

    // 2. Create a demo user
    console.log('[Reset] Creating fresh demo user...');
    const passwordHash = await User.hashPassword('password123');
    const demoUser = await User.create({
      name: 'Demo User',
      email: 'demo@notely.com',
      passwordHash
    });
    console.log(`[Reset] Created user: ${demoUser.email} (id: ${demoUser._id})`);

    // 3. Seed starter notes for demo user
    console.log('[Reset] Seeding sample notes for demo user...');
    await seedStarterNotesForUser(demoUser._id);
    const notesCount = await Note.countDocuments({ userId: demoUser._id });
    console.log(`[Reset] Successfully seeded ${notesCount} sample notes.`);

    console.log('\n======================================');
    console.log(' DATABASE RESET & SEED COMPLETE');
    console.log('======================================');
    console.log('Demo Login Credentials:');
    console.log('  Email:    demo@notely.com');
    console.log('  Password: password123');
    console.log('======================================\n');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('[Reset Error]:', error.message);
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
};

resetAndSeed();
