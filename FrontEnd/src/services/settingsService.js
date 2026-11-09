import api from './api';

export const settingsService = {
  async getProfile() {
    const response = await api.get('/users/profile');
    return response.data;
  },

  async updateProfile(data) {
    const response = await api.patch('/users/profile', data);
    return response.data;
  },

  async updateAvatar(avatar) {
    const response = await api.post('/users/avatar', { avatar });
    return response.data;
  },

  async removeAvatar() {
    const response = await api.delete('/users/avatar');
    return response.data;
  },

  async updateCover(coverImage) {
    const response = await api.post('/users/cover', { coverImage });
    return response.data;
  },

  async getPreferences() {
    const response = await api.get('/users/preferences');
    return response.data;
  },

  async updatePreferences(preferences) {
    const response = await api.patch('/users/preferences', preferences);
    return response.data;
  },

  async changePassword(currentPassword, newPassword) {
    const response = await api.patch('/users/password', { currentPassword, newPassword });
    return response.data;
  },

  async changeEmail(newEmail) {
    const response = await api.patch('/users/email', { newEmail });
    return response.data;
  },

  async deleteAccount() {
    const response = await api.delete('/users/account');
    return response.data;
  }
};

