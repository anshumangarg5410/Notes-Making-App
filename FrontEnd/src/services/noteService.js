import api from './api';

export const noteService = {
  async getNotes(params = {}) {
    const response = await api.get('/notes', { params });
    return response.data;
  },

  async getNoteById(id) {
    const response = await api.get(`/notes/${id}`);
    return response.data;
  },

  async createNote(data = {}) {
    const response = await api.post('/notes', data);
    return response.data;
  },

  async updateNote(id, data) {
    const response = await api.put(`/notes/${id}`, data);
    return response.data;
  },

  async deleteNote(id) {
    const response = await api.delete(`/notes/${id}`);
    return response.data;
  },

  async restoreNote(id) {
    const response = await api.patch(`/notes/${id}/restore`);
    return response.data;
  },

  async permanentDeleteNote(id) {
    const response = await api.delete(`/notes/${id}/permanent`);
    return response.data;
  },

  async togglePin(id) {
    const response = await api.patch(`/notes/${id}/pin`);
    return response.data;
  },

  async toggleFavorite(id) {
    const response = await api.patch(`/notes/${id}/favorite`);
    return response.data;
  },

  async toggleArchive(id) {
    const response = await api.patch(`/notes/${id}/archive`);
    return response.data;
  },

  async getStats() {
    const response = await api.get('/notes/stats');
    return response.data;
  }
};
