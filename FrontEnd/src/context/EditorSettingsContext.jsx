import React, { createContext, useContext, useState, useEffect } from 'react';
import { settingsService } from '../services/settingsService';

const EditorSettingsContext = createContext(null);

const DEFAULT_SETTINGS = {
  defaultFormat: 'markdown', // 'markdown' | 'richtext' | 'plaintext'
  fontSize: 14,             // 12 to 22
  lineNumbers: false,       // boolean
  spellCheck: true,         // boolean
  autoSaveEnabled: true,    // boolean
  autoSaveInterval: '10s'   // '750ms' | '2s' | '5s' | '10s'
};

const INTERVAL_MAP = {
  '750ms': 750,
  '2s': 2000,
  '5s': 5000,
  '10s': 10000
};

export const EditorSettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('notenest_editor_preferences');
        if (saved) {
          const parsed = JSON.parse(saved);
          return { ...DEFAULT_SETTINGS, ...parsed };
        }
      } catch (e) {
        console.warn('Failed to parse editor preferences from localStorage:', e);
      }
    }
    return DEFAULT_SETTINGS;
  });

  // Apply CSS variables and save to localStorage
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--editor-font-size', `${settings.fontSize}px`);
    try {
      localStorage.setItem('notenest_editor_preferences', JSON.stringify(settings));
    } catch (_) {}
  }, [settings]);

  const updateSetting = (key, value) => {
    setSettings((prev) => {
      const next = { ...prev, [key]: value };
      try {
        localStorage.setItem('notenest_editor_preferences', JSON.stringify(next));
      } catch (_) {}

      // Persist to backend if online
      if (typeof window !== 'undefined' && navigator.onLine) {
        try {
          settingsService.updatePreferences({ [key]: value }).catch(() => {});
        } catch (_) {}
      }
      return next;
    });
  };

  const setDefaultFormat = (val) => updateSetting('defaultFormat', val);
  const setFontSize = (val) => updateSetting('fontSize', Number(val));
  const setLineNumbers = (val) => updateSetting('lineNumbers', Boolean(val));
  const setSpellCheck = (val) => updateSetting('spellCheck', Boolean(val));
  const setAutoSaveEnabled = (val) => updateSetting('autoSaveEnabled', Boolean(val));
  const setAutoSaveInterval = (val) => updateSetting('autoSaveInterval', val);

  const autoSaveIntervalMs = INTERVAL_MAP[settings.autoSaveInterval] || 10000;

  return (
    <EditorSettingsContext.Provider
      value={{
        ...settings,
        autoSaveIntervalMs,
        setDefaultFormat,
        setFontSize,
        setLineNumbers,
        setSpellCheck,
        setAutoSaveEnabled,
        setAutoSaveInterval,
        updateSetting
      }}
    >
      {children}
    </EditorSettingsContext.Provider>
  );
};

export const useEditorSettings = () => {
  const context = useContext(EditorSettingsContext);
  if (!context) {
    throw new Error('useEditorSettings must be used within an EditorSettingsProvider');
  }
  return context;
};
