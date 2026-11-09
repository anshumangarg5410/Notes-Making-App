import api from './api';

export const folderService = {
  async getFolders(params = {}) {
    const response = await api.get('/folders', { params });
    return response.data;
  },

  async getFolderById(id) {
    const response = await api.get(`/folders/${id}`);
    return response.data;
  },

  async createFolder(data) {
    const response = await api.post('/folders', data);
    return response.data;
  },

  async updateFolder(id, data) {
    const response = await api.patch(`/folders/${id}`, data);
    return response.data;
  },

  async moveFolder(id, parentId) {
    const response = await api.patch(`/folders/${id}/move`, { parentId });
    return response.data;
  },

  async deleteFolder(id) {
    const response = await api.delete(`/folders/${id}`);
    return response.data;
  },

  async getFolderNotes(id, limit = 10) {
    const response = await api.get(`/folders/${id}/notes`, { params: { limit } });
    return response.data;
  },

  async getStats() {
    const response = await api.get('/folders/stats');
    return response.data;
  }
};
