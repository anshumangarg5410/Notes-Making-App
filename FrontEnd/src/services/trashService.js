import api from './api';

export const trashService = {
  async getTrashItems(params = {}) {
    const response = await api.get('/trash', { params });
    return response.data;
  },

  async getStats() {
    const response = await api.get('/trash/stats');
    return response.data;
  },

  async restoreItem(id, type = 'note') {
    const response = await api.post('/trash/restore', { id, type });
    return response.data;
  },

  async restoreAll() {
    const response = await api.post('/trash/restore-all');
    return response.data;
  },

  async deletePermanently(id, type = 'note') {
    const response = await api.delete(`/trash/${id}`, { params: { type } });
    return response.data;
  },

  async emptyTrash() {
    const response = await api.delete('/trash/empty');
    return response.data;
  }
};
