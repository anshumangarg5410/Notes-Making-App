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

  async duplicateNote(id) {
    const response = await api.post(`/notes/${id}/duplicate`);
    return response.data;
  },

  async emptyTrash() {
    const response = await api.delete('/notes/trash/empty');
    return response.data;
  },

  async getStats() {
    const response = await api.get('/notes/stats');
    return response.data;
  },

  async searchNotes(params = {}) {
    const response = await api.get('/search', { params });
    return response.data;
  },

  async importMarkdown(data) {
    const response = await api.post('/export/import-markdown', data);
    return response.data;
  },

  async exportMarkdown(id) {
    const response = await api.get(`/export/notes/${id}/markdown`, { responseType: 'blob' });
    return response.data;
  },

  async getPrintableHtml(id) {
    const response = await api.get(`/export/notes/${id}/print`, { responseType: 'text' });
    return response.data;
  },

  async bulkExport() {
    const response = await api.get('/export/bulk');
    return response.data;
  }
};
