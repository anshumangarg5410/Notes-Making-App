import api from './api';

export const syncService = {
  async pushMutations(mutations = []) {
    const response = await api.post('/sync/push', { mutations });
    return response.data;
  },

  async pullChanges(lastSyncTimestamp = null) {
    const response = await api.post('/sync/pull', { lastSyncTimestamp });
    return response.data;
  },

  async getSyncStatus() {
    const response = await api.get('/sync/status');
    return response.data;
  }
};

export default syncService;

