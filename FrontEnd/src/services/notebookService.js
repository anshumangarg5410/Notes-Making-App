import api from './api';

export const notebookService = {
  // Notebook operations
  async getNotebooks(params = {}) {
    const response = await api.get('/notebooks', { params });
    return response.data;
  },

  async getNotebookById(id) {
    const response = await api.get(`/notebooks/${id}`);
    return response.data;
  },

  async createNotebook(data) {
    const response = await api.post('/notebooks', data);
    return response.data;
  },

  async updateNotebook(id, data) {
    const response = await api.patch(`/notebooks/${id}`, data);
    return response.data;
  },

  async reorderNotebooks(orderedIds) {
    const response = await api.put('/notebooks/reorder', { orderedIds });
    return response.data;
  },

  async deleteNotebook(id) {
    const response = await api.delete(`/notebooks/${id}`);
    return response.data;
  },

  // Section operations
  async getSections(notebookId) {
    const response = await api.get(`/notebooks/${notebookId}/sections`);
    return response.data;
  },

  async createSection(notebookId, data) {
    const response = await api.post(`/notebooks/${notebookId}/sections`, data);
    return response.data;
  },

  async updateSection(id, data) {
    const response = await api.patch(`/sections/${id}`, data);
    return response.data;
  },

  async reorderSections(notebookId, orderedIds) {
    const response = await api.put('/sections/reorder', { notebookId, orderedIds });
    return response.data;
  },

  async moveSection(id, targetNotebookId) {
    const response = await api.patch(`/sections/${id}/move`, { targetNotebookId });
    return response.data;
  },

  async deleteSection(id) {
    const response = await api.delete(`/sections/${id}`);
    return response.data;
  },

  async getSectionNotes(id) {
    const response = await api.get(`/sections/${id}/notes`);
    return response.data;
  },

  async getStats() {
    const response = await api.get('/notebooks/stats');
    return response.data;
  }
};

export default notebookService;

