const mongoose = require('mongoose');
const environment = require('./environment');

let isConnected = false;

const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  const uri = environment.database.uri;
  if (!uri) {
    throw new Error('Database connection failed: MONGO_URI is not defined in environment configuration.');
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      autoIndex: environment.nodeEnv !== 'production'
    });

    isConnected = true;
    console.log(`[Database] MongoDB Atlas connected successfully: host=${conn.connection.host}, db=${conn.connection.name}`);

    mongoose.connection.on('error', (err) => {
      console.error('[Database Error] MongoDB connection error:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      isConnected = false;
      console.warn('[Database Warning] MongoDB connection lost.');
    });

    return conn;
  } catch (error) {
    isConnected = false;
    console.error('[Database Error] Failed to connect to MongoDB Atlas:', error.message);
    throw error;
  }
};

const disconnectDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    isConnected = false;
    console.log('[Database] MongoDB connection closed.');
  }
};

module.exports = {
  connectDB,
  disconnectDB
};
