import api from './api';

export const tagService = {
  async getTags() {
    const response = await api.get('/tags');
    return response.data;
  },

  async createTag(data) {
    const response = await api.post('/tags', data);
    return response.data;
  },

  async updateTag(id, data) {
    const response = await api.patch(`/tags/${id}`, data);
    return response.data;
  },

  async deleteTag(id) {
    const response = await api.delete(`/tags/${id}`);
    return response.data;
  }
};

export default tagService;

