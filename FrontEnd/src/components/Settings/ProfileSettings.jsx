import React, { useState } from 'react';
import { ProfileBanner } from './ProfileBanner';
import { PersonalInformation } from './PersonalInformation';
import { AppearanceSettings } from './AppearanceSettings';
import { QuickPreferences } from './QuickPreferences';
import { useToast } from '../../context/ToastContext';
import { useTheme } from '../../context/ThemeContext';
import { settingsService } from '../../services/settingsService';

export const ProfileSettings = ({
  user,
  onUserUpdate,
  onChangeEmailRequest,
}) => {
  const { success, error: toastError } = useToast();
  const { theme, setTheme } = useTheme();

  const [savingProfile, setSavingProfile] = useState(false);
  const [preferences, setPreferences] = useState({
    theme: user?.preferences?.theme || theme || 'dark',
    accentColor: user?.preferences?.accentColor || 'purple',
    offlineMode: user?.preferences?.offlineMode ?? true,
    autoSync: user?.preferences?.autoSync ?? true,
    showNoteCount: user?.preferences?.showNoteCount ?? true,
    compactSidebar: user?.preferences?.compactSidebar ?? false,
  });

  const handleSaveProfile = async (formData) => {
    try {
      setSavingProfile(true);
      const res = await settingsService.updateProfile(formData);
      if (res.user && onUserUpdate) {
        onUserUpdate(res.user);
      }
      success('Profile updated successfully');
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleAvatarChange = async (avatarUrl) => {
    try {
      const res = await settingsService.updateAvatar(avatarUrl);
      if (res.user && onUserUpdate) {
        onUserUpdate(res.user);
      }
      success('Avatar updated successfully');
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to update avatar');
    }
  };

  const handleAvatarRemove = async () => {
    try {
      const res = await settingsService.removeAvatar();
      if (res.user && onUserUpdate) {
        onUserUpdate(res.user);
      }
      success('Avatar removed');
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to remove avatar');
    }
  };

  const handleCoverChange = async (coverUrl) => {
    try {
      const res = await settingsService.updateCover(coverUrl);
      if (res.user && onUserUpdate) {
        onUserUpdate(res.user);
      }
      success('Cover image updated');
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to update cover');
    }
  };

  const handleThemeChange = async (newTheme) => {
    const updated = { ...preferences, theme: newTheme };
    setPreferences(updated);
    if (newTheme === 'system') {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(systemDark ? 'dark' : 'light');
    } else {
      setTheme(newTheme);
    }

    try {
      await settingsService.updatePreferences({ theme: newTheme });
    } catch (err) {
      console.warn('Preferences sync error:', err);
    }
  };

  const handleAccentChange = async (color) => {
    const updated = { ...preferences, accentColor: color };
    setPreferences(updated);
    try {
      await settingsService.updatePreferences({ accentColor: color });
      success(`Accent color set to ${color}`);
    } catch (err) {
      console.warn('Accent update error:', err);
    }
  };

  const handleTogglePref = async (key, val) => {
    const updated = { ...preferences, [key]: val };
    setPreferences(updated);
    try {
      await settingsService.updatePreferences({ [key]: val });
    } catch (err) {
      console.warn('Preference toggle error:', err);
    }
  };

  return (
    <div className="space-y-4">
      {/* 1. Profile Banner */}
      <ProfileBanner
        user={user}
        onAvatarChange={handleAvatarChange}
        onAvatarRemove={handleAvatarRemove}
        onCoverChange={handleCoverChange}
      />

      {/* 2. Personal Information */}
      <PersonalInformation
        user={user}
        onSave={handleSaveProfile}
        onChangeEmailRequest={onChangeEmailRequest}
        isLoading={savingProfile}
      />

      {/* 3. Bottom Grid: Appearance + Quick Preferences */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AppearanceSettings
          theme={preferences.theme}
          accentColor={preferences.accentColor}
          onThemeChange={handleThemeChange}
          onAccentChange={handleAccentChange}
        />
        <QuickPreferences
          preferences={preferences}
          onToggle={handleTogglePref}
        />
      </div>
    </div>
  );
};

