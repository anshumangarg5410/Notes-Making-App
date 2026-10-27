import api from './api';

export const authService = {
  async register(name, email, password, confirmPassword) {
    const response = await api.post('/auth/register', {
      name,
      email,
      password,
      confirmPassword
    });
    if (response.data.token) {
      localStorage.setItem('notely_token', response.data.token);
    }
    return response.data;
  },

  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('notely_token', response.data.token);
    }
    return response.data;
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('notely_token');
    }
  },

  async getMe() {
    const response = await api.get('/auth/me');
    return response.data;
  },

  async updateProfile(data) {
    const response = await api.put('/users/me', data);
    return response.data;
  },

  async updatePassword(currentPassword, newPassword) {
    const response = await api.put('/users/me/password', {
      currentPassword,
      newPassword
    });
    return response.data;
  }
};
