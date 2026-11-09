import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthModalContext = createContext(null);

export const AuthModalProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState('login'); // 'login' | 'signup' | 'forgot' | 'logout'
  const [customTheme, setCustomTheme] = useState(null); // null = inherit app theme, 'dark', 'light'
  const [onLogoutConfirm, setOnLogoutConfirm] = useState(null);

  const openLogin = useCallback((themeOverride = null) => {
    setView('login');
    if (themeOverride) setCustomTheme(themeOverride);
    setIsOpen(true);
  }, []);

  const openSignup = useCallback((themeOverride = null) => {
    setView('signup');
    if (themeOverride) setCustomTheme(themeOverride);
    setIsOpen(true);
  }, []);

  const openForgotPassword = useCallback((themeOverride = null) => {
    setView('forgot');
    if (themeOverride) setCustomTheme(themeOverride);
    setIsOpen(true);
  }, []);

  const openLogout = useCallback((callback = null) => {
    setView('logout');
    setOnLogoutConfirm(() => callback);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setOnLogoutConfirm(null);
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);

  // Handle escape key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        closeModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeModal]);

  return (
    <AuthModalContext.Provider
      value={{
        isOpen,
        view,
        setView,
        customTheme,
        setCustomTheme,
        openLogin,
        openSignup,
        openForgotPassword,
        openLogout,
        closeModal,
        onLogoutConfirm
      }}
    >
      {children}
    </AuthModalContext.Provider>
  );
};

export const useAuthModal = () => {
  const context = useContext(AuthModalContext);
  if (!context) {
    throw new Error('useAuthModal must be used within an AuthModalProvider');
  }
  return context;
};
