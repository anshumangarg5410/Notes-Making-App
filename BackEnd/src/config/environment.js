const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env in BackEnd directory
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const environment = {
  port: parseInt(process.env.PORT, 10) || 5001,
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',

  database: {
    uri: process.env.MONGO_URI
  },

  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET || 'notenest_access_jwt_secret_dev_2026',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'notenest_refresh_jwt_secret_dev_2026',
    accessExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
    refreshExpiresInMs: 7 * 24 * 60 * 60 * 1000 // 7 days in ms
  },

  cors: {
    allowedOrigins: [
      process.env.FRONTEND_URL,
      process.env.CLIENT_URL,
      'http://localhost:5173',
      'http://localhost:5174',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:5174'
    ].filter(Boolean)
  },

  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    apiKey: process.env.CLOUDINARY_API_KEY || '',
    apiSecret: process.env.CLOUDINARY_API_SECRET || '',
    uploadPreset: process.env.CLOUDINARY_UPLOAD_PRESET || ''
  },

  google: {
    clientId: (process.env.GOOGLE_CLIENT_ID || '').replace(/["'\s]/g, '').trim()
  },

  gemini: {
    get apiKey() {
      return (process.env.GEMINI_API_KEY || '').replace(/["'\s]/g, '').trim();
    }
  }
};

// Validate that MONGO_URI is set (except in test mode)
if (!environment.database.uri && !environment.isTest) {
  console.error('[Config Error] MONGO_URI environment variable is missing.');
}

module.exports = environment;

