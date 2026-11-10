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
    if (avatar instanceof FormData) {
      const response = await api.post('/users/avatar', avatar, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    }
    if (typeof avatar === 'string') {
      const response = await api.post('/users/avatar', { avatar });
      return response.data;
    }
    if (avatar instanceof File || avatar instanceof Blob) {
      const formData = new FormData();
      formData.append('avatar', avatar);
      const response = await api.post('/users/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    }
    const response = await api.post('/users/avatar', { avatar });
    return response.data;
  },

  async removeAvatar() {
    const response = await api.delete('/users/avatar');
    return response.data;
  },

  async updateCover(coverImage) {
    if (coverImage instanceof FormData) {
      const response = await api.post('/users/cover', coverImage, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    }
    if (coverImage instanceof File || coverImage instanceof Blob) {
      const formData = new FormData();
      formData.append('cover', coverImage);
      const response = await api.post('/users/cover', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    }
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

