import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await authService.getMe();
        if (res.success && res.data) {
          setUser(res.data);
          return;
        }
      } catch (err) {
        // Try refreshing token if initial getMe failed
        try {
          const refreshRes = await authService.refreshToken();
          if (refreshRes.success && refreshRes.data) {
            setUser(refreshRes.data);
            return;
          }
        } catch (_) {
          // If refresh also failed, clear session
          localStorage.removeItem('notely_token');
          localStorage.removeItem('notely_user');
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    const res = await authService.login(email, password);
    if (res.success && res.data) {
      setUser(res.data);
    }
    return res;
  };

  const register = async (name, email, password, confirmPassword) => {
    const res = await authService.register(name, email, password, confirmPassword);
    if (res.success && res.data) {
      setUser(res.data);
    }
    return res;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
    }
  };

  const updateUser = (updatedData) => {
    setUser((prev) => ({ ...prev, ...updatedData }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
