const Activity = require('../models/Activity');

const logActivity = async ({ userId, action, entityType, entityId, entityTitle, metadata = {} }) => {
  try {
    if (!userId || !action || !entityType) return;
    await Activity.create({
      userId,
      action,
      entityType,
      entityId,
      entityTitle: entityTitle || 'Untitled',
      metadata,
      timestamp: new Date()
    });
  } catch (err) {
    // Non-blocking logging
    console.warn('[ActivityLogger Warning]:', err.message);
  }
};

module.exports = { logActivity };

