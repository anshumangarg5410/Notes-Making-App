import React, { createContext, useContext, useState, useEffect } from 'react';
import { settingsService } from '../services/settingsService';

export const ACCENT_COLORS = {
  purple: {
    id: 'purple',
    name: 'Purple',
    primary: '#a855f7',
    hover: '#9333ea',
    glow: 'rgba(168, 85, 247, 0.35)',
    bg: 'rgba(168, 85, 247, 0.15)',
    border: 'rgba(168, 85, 247, 0.4)',
    text: '#c084fc',
    light: '#7c3aed'
  },
  blue: {
    id: 'blue',
    name: 'Blue',
    primary: '#3b82f6',
    hover: '#2563eb',
    glow: 'rgba(59, 130, 246, 0.35)',
    bg: 'rgba(59, 130, 246, 0.15)',
    border: 'rgba(59, 130, 246, 0.4)',
    text: '#60a5fa',
    light: '#2563eb'
  },
  cyan: {
    id: 'cyan',
    name: 'Cyan',
    primary: '#06b6d4',
    hover: '#0891b2',
    glow: 'rgba(6, 182, 212, 0.35)',
    bg: 'rgba(6, 182, 212, 0.15)',
    border: 'rgba(6, 182, 212, 0.4)',
    text: '#22d3ee',
    light: '#0891b2'
  },
  green: {
    id: 'green',
    name: 'Green',
    primary: '#10b981',
    hover: '#059669',
    glow: 'rgba(16, 185, 129, 0.35)',
    bg: 'rgba(16, 185, 129, 0.15)',
    border: 'rgba(16, 185, 129, 0.4)',
    text: '#34d399',
    light: '#059669'
  },
  amber: {
    id: 'amber',
    name: 'Amber',
    primary: '#f59e0b',
    hover: '#d97706',
    glow: 'rgba(245, 158, 11, 0.35)',
    bg: 'rgba(245, 158, 11, 0.15)',
    border: 'rgba(245, 158, 11, 0.4)',
    text: '#fbbf24',
    light: '#d97706'
  },
  pink: {
    id: 'pink',
    name: 'Pink',
    primary: '#ec4899',
    hover: '#db2777',
    glow: 'rgba(236, 72, 153, 0.35)',
    bg: 'rgba(236, 72, 153, 0.15)',
    border: 'rgba(236, 72, 153, 0.4)',
    text: '#f472b6',
    light: '#db2777'
  }
};

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('notely_theme');
      if (saved === 'light' || saved === 'dark') return saved;
      return 'dark';
    }
    return 'dark';
  });

  const [accentColor, setAccentColor] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('notely_accent_color');
      if (saved && ACCENT_COLORS[saved]) return saved;
      return 'purple';
    }
    return 'purple';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
    localStorage.setItem('notely_theme', theme);
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;
    const color = ACCENT_COLORS[accentColor] || ACCENT_COLORS.purple;

    root.style.setProperty('--accent', color.primary);
    root.style.setProperty('--accent-hover', color.hover);
    root.style.setProperty('--accent-glow', color.glow);
    root.style.setProperty('--accent-bg', color.bg);
    root.style.setProperty('--accent-border', color.border);
    root.style.setProperty('--accent-text', color.text);
    root.style.setProperty('--editor-accent', color.primary);
    root.style.setProperty('--editor-accent-hover', color.hover);
    root.setAttribute('data-accent', accentColor);
    localStorage.setItem('notely_accent_color', accentColor);
  }, [accentColor]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const setAccentColorWithSync = (newColor) => {
    if (ACCENT_COLORS[newColor]) {
      setAccentColor(newColor);
      try {
        localStorage.setItem('notely_accent_color', newColor);
        if (typeof window !== 'undefined' && navigator.onLine) {
          settingsService.updatePreferences({ accentColor: newColor }).catch(() => {});
        }
      } catch (_) {}
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        setTheme,
        isDark: theme === 'dark',
        accentColor,
        setAccentColor: setAccentColorWithSync
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
