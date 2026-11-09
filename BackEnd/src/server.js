const app = require('./app');
const { connectDB, disconnectDB } = require('./config/database');
const environment = require('./config/environment');

const startServer = async () => {
  try {
    // 1. Connect to MongoDB Atlas
    await connectDB();

    // 2. Start HTTP Listener
    const server = app.listen(environment.port, () => {
      console.log(`[Server] NoteNest backend running in ${environment.nodeEnv} mode on port ${environment.port}`);
      console.log(`[Server] API Health check available at: http://localhost:${environment.port}/api/health`);
    });

    // 3. Graceful Shutdown Handlers
    const handleShutdown = async (signal) => {
      console.log(`\n[Server] Received ${signal}. Shutting down gracefully...`);
      server.close(async () => {
        console.log('[Server] HTTP listener closed.');
        await disconnectDB();
        process.exit(0);
      });

      // Force exit after 10s if connections linger
      setTimeout(() => {
        console.error('[Server Error] Forcing shutdown after timeout.');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => handleShutdown('SIGTERM'));
    process.on('SIGINT', () => handleShutdown('SIGINT'));
  } catch (error) {
    console.error('[Server Fatal] Failed to initialize server:', error.message);
    process.exit(1);
  }
};

startServer();
