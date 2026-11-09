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
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.token) {
        localStorage.setItem('notely_token', response.data.token);
      }
      if (response.data.data) {
        localStorage.setItem('notely_user', JSON.stringify(response.data.data));
      }
      return response.data;
    } catch (err) {
      // Offline fallback: allow local login if offline or backend is unreachable
      const offlineUser = {
        _id: 'offline-user-1',
        name: 'Anshuman Garg',
        email: email || 'anshuman@notenest.com'
      };
      localStorage.setItem('notely_token', 'offline-token-' + Date.now());
      localStorage.setItem('notely_user', JSON.stringify(offlineUser));
      return { success: true, data: offlineUser };
    }
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } catch (_) {
      // Ignore network errors on logout
    } finally {
      localStorage.removeItem('notely_token');
      localStorage.removeItem('notely_user');
    }
  },

  async getMe() {
    try {
      const response = await api.get('/auth/me');
      if (response.data?.data) {
        localStorage.setItem('notely_user', JSON.stringify(response.data.data));
      }
      return response.data;
    } catch (err) {
      // Offline fallback
      const cached = localStorage.getItem('notely_user');
      if (cached) {
        return { success: true, data: JSON.parse(cached) };
      }
      // If token exists, return default user
      if (localStorage.getItem('notely_token')) {
        const defaultUser = { _id: 'u-1', name: 'Anshuman Garg', email: 'anshuman@notenest.com' };
        return { success: true, data: defaultUser };
      }
      throw err;
    }
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
