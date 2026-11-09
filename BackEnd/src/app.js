const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const environment = require('./config/environment');
const authRoutes = require('./routes/auth.routes');
const noteRoutes = require('./routes/note.routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// 1. Security Headers via Helmet
app.use(helmet());

// 2. CORS Configuration
const allowedOrigins = environment.cors.allowedOrigins;
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl, postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1 || environment.nodeEnv === 'development') {
        return callback(null, true);
      }
      return callback(new Error('Cross-Origin Request Blocked by CORS Policy.'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
  })
);

// 3. Body Parsing & Cookie Parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// 4. Request Logging in non-test environments
if (!environment.isTest) {
  app.use(morgan('dev'));
}

// 5. Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'NoteNest API server is running',
    timestamp: new Date().toISOString(),
    environment: environment.nodeEnv
  });
});

// 6. API Route Handlers
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);

// Fallback for 404 Not Found on undefined API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API route not found: ${req.method} ${req.originalUrl}`
  });
});

// 7. Centralized Error Handler Middleware
app.use(errorHandler);

module.exports = app;
