import api from './api';

export const authService = {
  async register(name, email, password, confirmPassword) {
    const response = await api.post('/auth/register', {
      name,
      email,
      password,
      confirmPassword
    });

    const token = response.data.data?.token || response.data.token;
    const user = response.data.data?.user || response.data.data;

    if (token) {
      localStorage.setItem('notely_token', token);
    }
    if (user) {
      localStorage.setItem('notely_user', JSON.stringify(user));
    }

    return {
      success: true,
      message: response.data.message || 'Account created successfully',
      data: user,
      token
    };
  },

  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });

    const token = response.data.data?.token || response.data.token;
    const user = response.data.data?.user || response.data.data;

    if (token) {
      localStorage.setItem('notely_token', token);
    }
    if (user) {
      localStorage.setItem('notely_user', JSON.stringify(user));
    }

    return {
      success: true,
      message: response.data.message || 'Login successful',
      data: user,
      token
    };
  },

  async googleLogin(idToken) {
    const response = await api.post('/auth/google', { idToken });

    const token = response.data.data?.token || response.data.token;
    const user = response.data.data?.user || response.data.data;
    const googleData = {
      googleId: response.data.data?.googleId,
      name: response.data.data?.name,
      email: response.data.data?.email,
      picture: response.data.data?.picture
    };

    if (token) {
      localStorage.setItem('notely_token', token);
    }
    if (user) {
      localStorage.setItem('notely_user', JSON.stringify(user));
    }

    return {
      success: true,
      message: response.data.message || 'Google authentication successful',
      data: user,
      googleData,
      token
    };
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } catch (_) {
      // Ignore network errors during logout
    } finally {
      localStorage.removeItem('notely_token');
      localStorage.removeItem('notely_user');
    }
    return { success: true };
  },

  async getMe() {
    const response = await api.get('/auth/me');
    const user = response.data.data?.user || response.data.data;

    if (user) {
      localStorage.setItem('notely_user', JSON.stringify(user));
    }

    return {
      success: true,
      data: user
    };
  },

  async refreshToken() {
    const response = await api.post('/auth/refresh');
    const token = response.data.data?.token || response.data.token;
    const user = response.data.data?.user || response.data.data;

    if (token) {
      localStorage.setItem('notely_token', token);
    }
    if (user) {
      localStorage.setItem('notely_user', JSON.stringify(user));
    }

    return {
      success: true,
      data: user,
      token
    };
  }
};

export default authService;
