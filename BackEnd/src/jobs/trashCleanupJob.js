const trashService = require('../services/trash.service');

class TrashCleanupJob {
  constructor() {
    this.timer = null;
    this.intervalMs = 24 * 60 * 60 * 1000; // 24 hours
  }

  start() {
    console.log('[TrashCleanupJob] Initializing 30-day trash retention auto-cleanup job...');

    // Run once on startup (delayed by 10s to let server settle)
    setTimeout(() => {
      this.execute();
    }, 10000);

    // Schedule recurring execution every 24 hours
    this.timer = setInterval(() => {
      this.execute();
    }, this.intervalMs);

    if (this.timer.unref) {
      this.timer.unref(); // Don't prevent Node process from graceful exit
    }
  }

  async execute() {
    try {
      console.log('[TrashCleanupJob] Running scheduled 30-day trash retention purge...');
      await trashService.cleanupExpiredTrash();
    } catch (err) {
      console.warn('[TrashCleanupJob Error]:', err.message);
    }
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}

module.exports = new TrashCleanupJob();

