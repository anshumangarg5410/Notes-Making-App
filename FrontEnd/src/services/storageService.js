import api from './api';

export const storageService = {
  /**
   * Get user storage preferences & cloud provider state
   */
  async getPreferences() {
    const response = await api.get('/storage/preferences');
    return response.data;
  },

  /**
   * Update storage provider and onboarding status
   * @param {{ provider?: 'local' | 'google-drive', onboardingCompleted?: boolean }} data
   */
  async updatePreferences(data) {
    const response = await api.post('/storage/preferences', data);
    return response.data;
  },

  /**
   * Generate Google Drive OAuth authorization URL
   */
  async getGoogleConnectUrl() {
    const response = await api.get('/storage/google/connect');
    return response.data;
  },

  /**
   * Check live Google Drive connection and sync status
   */
  async getGoogleStatus() {
    const response = await api.get('/storage/google/status');
    return response.data;
  },

  /**
   * Disconnect Google Drive account and revoke tokens
   */
  async disconnectGoogle() {
    const response = await api.post('/storage/google/disconnect');
    return response.data;
  },

  /**
   * Fetch legacy MongoDB user data for local-first IndexedDB seeding
   */
  async getMigrationData() {
    const response = await api.get('/storage/migration/data');
    return response.data;
  },

  /**
   * Synchronize batch of local changes with Google Drive
   * @param {{ notebooks?: Array, sections?: Array, notes?: Array, deletedIds?: Array }} payload
   */
  async syncGoogleDrive(payload) {
    const response = await api.post('/storage/sync', payload);
    return response.data;
  },

  /**
   * Export all user data from backend backup snapshot
   */
  async exportServerBackup() {
    const response = await api.get('/storage/export');
    return response.data;
  }
};

export default storageService;
