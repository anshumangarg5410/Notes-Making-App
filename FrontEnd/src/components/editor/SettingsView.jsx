import React, { useState, useRef, useMemo, useEffect } from 'react';
import {
  User,
  Moon,
  Sun,
  Laptop,
  PenTool,
  Cloud,
  RefreshCw,
  Download,
  ArrowUpDown,
  Keyboard,
  Shield,
  Info,
  Settings as SettingsIcon,
  Camera,
  Edit2,
  Check,
  X,
  ArrowLeft,
  LogOut,
  Key,
  Database,
  Trash2,
  FileText
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import { useEditorSettings } from '../../context/EditorSettingsContext';
import { authService } from '../../services/authService';
import { offlineService } from '../../services/db';
import api from '../../services/api';

export const SettingsView = ({
  onClose,
  notes = [],
  folders = [],
  stats = {}
}) => {
  const { user, updateUser, logout } = useAuth();
  const { theme, setTheme, isDark, accentColor, setAccentColor } = useTheme();
  const { success, error: toastError, info } = useToast();

  const {
    defaultFormat,
    setDefaultFormat,
    fontSize,
    setFontSize,
    lineNumbers,
    setLineNumbers,
    spellCheck,
    setSpellCheck,
    autoSaveEnabled,
    setAutoSaveEnabled,
    autoSaveInterval,
    setAutoSaveInterval
  } = useEditorSettings();

  const [activeSection, setActiveSection] = useState('account');

  // Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [profileSaving, setProfileSaving] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Password Update State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);

  // Sync state
  const [isSyncing, setIsSyncing] = useState(false);

  const displayName = user?.name || user?.username || 'User';
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'U';

  // Calculate dynamic storage usage from real user notes
  const storageInfo = useMemo(() => {
    let totalBytes = 0;
    if (Array.isArray(notes)) {
      notes.forEach((n) => {
        const titleBytes = n.title ? new Blob([n.title]).size : 0;
        const contentStr = typeof n.content === 'string' ? n.content : JSON.stringify(n.content || '');
        const contentBytes = contentStr ? new Blob([contentStr]).size : 0;
        totalBytes += titleBytes + contentBytes;
      });
    }

    const totalQuotaBytes = 2 * 1024 * 1024 * 1024; // 2 GB Workspace Quota
    let usedFormatted = '0 KB';
    if (totalBytes < 1024 * 1024) {
      usedFormatted = `${Math.max(1, Math.round(totalBytes / 1024))} KB`;
    } else {
      usedFormatted = `${(totalBytes / (1024 * 1024)).toFixed(2)} MB`;
    }

    const rawPct = (totalBytes / totalQuotaBytes) * 100;
    const percentage = rawPct < 0.1 ? '< 1%' : `${rawPct.toFixed(1)}%`;
    const progressWidth = Math.max(3, Math.min(100, Math.round(rawPct)));

    return {
      usedFormatted,
      percentage,
      progressWidth: `${progressWidth}%`,
      totalBytes
    };
  }, [notes]);

  const [localCacheSize, setLocalCacheSize] = useState('Checking...');

  useEffect(() => {
    let isMounted = true;
    const checkStorage = async () => {
      if (typeof navigator !== 'undefined' && navigator.storage && navigator.storage.estimate) {
        try {
          const est = await navigator.storage.estimate();
          const bytes = est.usage || 0;
          if (isMounted) {
            if (bytes < 1024 * 1024) {
              setLocalCacheSize(`${Math.max(1, Math.round(bytes / 1024))} KB Local`);
            } else {
              setLocalCacheSize(`${(bytes / (1024 * 1024)).toFixed(1)} MB Local`);
            }
          }
        } catch (_) {
          if (isMounted) setLocalCacheSize(`${storageInfo.usedFormatted} Local`);
        }
      } else {
        if (isMounted) setLocalCacheSize(`${storageInfo.usedFormatted} Local`);
      }
    };
    checkStorage();
    return () => { isMounted = false; };
  }, [storageInfo.usedFormatted]);

  // Section Refs for smooth scrolling
  const sectionRefs = {
    account: useRef(null),
    appearance: useRef(null),
    editor: useRef(null),
    storage: useRef(null),
    sync: useRef(null),
    offline: useRef(null),
    importExport: useRef(null),
    shortcuts: useRef(null),
    security: useRef(null),
    about: useRef(null)
  };

  const scrollToSection = (id) => {
    setActiveSection(id);
    sectionRefs[id]?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Profile update handler
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setProfileSaving(true);
    try {
      const res = await api.patch('/users/profile', { name, email });
      if (res.data?.data) {
        updateUser(res.data.data);
      } else {
        updateUser({ name, email });
      }
      setIsEditingProfile(false);
      success('Profile updated successfully');
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setProfileSaving(false);
    }
  };

  // Avatar upload handler
  const handleAvatarFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toastError('Image size should be under 5MB');
      return;
    }

    const formData = new FormData();
    formData.append('avatar', file);

    setAvatarUploading(true);
    try {
      const res = await api.post('/users/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data?.data?.avatar) {
        updateUser({ avatar: res.data.data.avatar });
        success('Avatar updated via Cloudinary');
      }
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to upload avatar');
    } finally {
      setAvatarUploading(false);
    }
  };

  // Password update handler
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toastError('New passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      toastError('Password must be at least 6 characters');
      return;
    }

    setPasswordSaving(true);
    try {
      await api.put('/users/password', { currentPassword, newPassword });
      success('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to update password');
    } finally {
      setPasswordSaving(false);
    }
  };

  // Sync Now handler
  const handleSyncNow = async () => {
    setIsSyncing(true);
    try {
      await offlineService.processSyncQueue(api);
      success('All changes synchronized with MongoDB Atlas');
    } catch (err) {
      toastError('Sync completed with local database');
    } finally {
      setIsSyncing(false);
    }
  };

  // Download JSON Backup
  const handleDownloadBackup = () => {
    const backupData = {
      app: 'NoteNest',
      version: '1.2.0',
      exportedAt: new Date().toISOString(),
      user: { name: displayName, email: user?.email },
      notesCount: notes.length,
      foldersCount: folders.length,
      notes,
      folders
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `notenest-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    success('Workspace backup exported successfully');
  };

  // Navigation menu items matching reference
  const navItems = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'appearance', label: 'Appearance', icon: Moon },
    { id: 'editor', label: 'Editor', icon: PenTool },
    { id: 'storage', label: 'Storage', icon: Cloud },
    { id: 'sync', label: 'Sync & Backup', icon: RefreshCw },
    { id: 'offline', label: 'Offline', icon: Download },
    { id: 'importExport', label: 'Import & Export', icon: ArrowUpDown },
    { id: 'shortcuts', label: 'Keyboard Shortcuts', icon: Keyboard },
    { id: 'security', label: 'Privacy & Security', icon: Shield },
    { id: 'about', label: 'About', icon: Info }
  ];

  const accentColors = [
    { id: 'purple', hex: '#9333ea', label: 'Purple' },
    { id: 'blue', hex: '#3b82f6', label: 'Blue' },
    { id: 'cyan', hex: '#06b6d4', label: 'Cyan' },
    { id: 'green', hex: '#10b981', label: 'Green' },
    { id: 'amber', hex: '#f59e0b', label: 'Amber' },
    { id: 'pink', hex: '#ec4899', label: 'Pink' }
  ];

  return (
    <div className={`flex-1 h-full overflow-y-auto obsidian-scrollbar transition-colors duration-200 ${isDark ? 'bg-[#0d0e17] text-gray-200' : 'bg-[#FAF8FD] text-[#1E1B2E]'
      }`}>
      {/* Settings Top View Header with decorative glow */}
      <div className={`relative px-8 pt-8 pb-6 border-b overflow-hidden ${isDark ? 'border-[#1f2030]' : 'border-[#EAE6F4]'
        }`}>
        {/* Subtle decorative purple wave in background */}
        <div className={`absolute -top-12 -right-12 w-96 h-96 rounded-full blur-3xl pointer-events-none ${isDark ? 'bg-purple-600/10' : 'bg-purple-300/25'
          }`} />
        <div className={`absolute top-0 right-1/4 w-64 h-32 rounded-full blur-2xl pointer-events-none ${isDark ? 'bg-indigo-600/5' : 'bg-indigo-200/20'
          }`} />

        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg ${isDark
              ? 'bg-purple-900/30 border border-purple-500/40 text-purple-400 shadow-purple-950/40'
              : 'bg-[#EDE9FE] border border-[#DDD6FE] text-[#7C3AED] shadow-purple-100'
              }`}>
              <SettingsIcon className="w-5 h-5" />
            </div>
            <div>
              <h1 className={`text-2xl font-bold tracking-tight font-sans ${isDark ? 'text-gray-100' : 'text-[#181326]'}`}>Settings</h1>
              <p className={`text-xs mt-0.5 ${isDark ? 'text-gray-400' : 'text-[#6B7280]'}`}>
                Manage your account, preferences, appearance, and more.
              </p>
            </div>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shadow-sm ${isDark
                ? 'text-gray-300 hover:text-white bg-[#1a1b28] hover:bg-[#252638] border border-[#292a3e]'
                : 'text-[#374151] hover:text-[#111827] bg-white hover:bg-[#F9F8FD] border border-[#E2DEEE]'
                }`}
              title="Return to notes"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Notes</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Settings Body Grid */}
      <div className="px-8 py-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Categories Navigation Card */}
        <div className="lg:col-span-3 sticky top-6">
          <div className={`rounded-2xl p-2.5 shadow-sm space-y-1 border ${isDark ? 'bg-[#141522] border-[#222336]' : 'bg-white border-[#EAE6F4]'
            }`}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all text-left ${isActive
                    ? isDark
                      ? 'bg-purple-900/35 text-purple-200 font-semibold border-l-2 border-purple-500 shadow-sm'
                      : 'bg-[#EDE9FE] text-[#7C3AED] font-semibold border-l-2 border-[#7C3AED]'
                    : isDark
                      ? 'text-gray-400 hover:text-gray-200 hover:bg-[#1a1b2b]'
                      : 'text-[#5F5B73] hover:text-[#1E1B2E] hover:bg-[#F6F4FA]'
                    }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? (isDark ? 'text-purple-400' : 'text-[#7C3AED]') : (isDark ? 'text-gray-400' : 'text-[#6B7280]')}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: Settings Cards Stack */}
        <div className="lg:col-span-9 space-y-6">
          {/* CARD 1: Account */}
          <div
            ref={sectionRefs.account}
            className={`rounded-2xl p-6 shadow-sm space-y-5 border ${isDark ? 'bg-[#141522] border-[#222336]' : 'bg-white border-[#EAE6F4]'
              }`}
          >
            {/* Card Header */}
            <div className={`flex items-center gap-2.5 pb-4 border-b ${isDark ? 'border-[#1f2032]' : 'border-[#F0ECF8]'}`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDark ? 'bg-purple-900/30 text-purple-400' : 'bg-[#EDE9FE] text-[#7C3AED]'
                }`}>
                <User className="w-4 h-4" />
              </div>
              <div>
                <h2 className={`text-sm font-semibold ${isDark ? 'text-gray-100' : 'text-[#181326]'}`}>Account</h2>
                <p className={`text-[11px] ${isDark ? 'text-gray-400' : 'text-[#6B7280]'}`}>Your profile and account information.</p>
              </div>
            </div>

            {/* Profile Row */}
            <div className="flex items-center justify-between flex-wrap gap-4 pt-1">
              <div className="flex items-center gap-4">
                {/* Avatar with Cloudinary Camera Button */}
                <div className="relative">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={displayName}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 rounded-full object-cover border-2 border-purple-500/50 shadow-md shadow-purple-950/50"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#9333ea] to-[#c084fc] text-white text-xl font-bold flex items-center justify-center shadow-md shadow-purple-950/50 border-2 border-purple-400/50">
                      {initials}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={avatarUploading}
                    className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center border-2 shadow-md transition-colors cursor-pointer ${isDark ? 'border-[#141522]' : 'border-white'
                      }`}
                    title="Upload profile picture to Cloudinary"
                  >
                    <Camera className="w-3 h-3" />
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarFileChange}
                    className="hidden"
                  />
                </div>

                <div>
                  <div className={`font-semibold text-base ${isDark ? 'text-gray-100' : 'text-[#181326]'}`}>{displayName}</div>
                  <div className={`text-xs mt-0.5 ${isDark ? 'text-gray-400' : 'text-[#6B7280]'}`}>{user?.email || 'anshuman.garg@example.com'}</div>
                  {avatarUploading && (
                    <span className="text-[10px] text-purple-600 flex items-center gap-1 mt-1">
                      <RefreshCw className="w-2.5 h-2.5 animate-spin" /> Uploading to Cloudinary...
                    </span>
                  )}
                </div>
              </div>

              {!isEditingProfile ? (
                <button
                  onClick={() => setIsEditingProfile(true)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors shadow-sm ${isDark
                    ? 'border-[#2b2c40] bg-[#1b1c2b] hover:bg-[#232438] text-gray-200'
                    : 'border-[#E2DEEE] bg-white hover:bg-[#F9F8FD] text-[#374151]'
                    }`}
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Profile</span>
                </button>
              ) : null}
            </div>

            {/* Inline Profile Edit Form */}
            {isEditingProfile && (
              <form onSubmit={handleSaveProfile} className={`pt-4 border-t space-y-4 ${isDark ? 'border-[#1f2032]' : 'border-[#F0ECF8]'}`}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-[#374151]'}`}>Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`w-full rounded-lg px-3 py-2 text-xs outline-none transition-colors border focus:border-purple-500 ${isDark ? 'bg-[#1b1c2c] border-[#2d2e44] text-gray-100' : 'bg-white border-[#E2DEEE] text-[#111827]'
                        }`}
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div>
                    <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-[#374151]'}`}>Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full rounded-lg px-3 py-2 text-xs outline-none transition-colors border focus:border-purple-500 ${isDark ? 'bg-[#1b1c2c] border-[#2d2e44] text-gray-100' : 'bg-white border-[#E2DEEE] text-[#111827]'
                        }`}
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(false)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium ${isDark ? 'text-gray-400 hover:text-gray-200' : 'text-[#6B7280] hover:text-[#111827]'}`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={profileSaving}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium transition-colors disabled:opacity-50"
                  >
                    {profileSaving ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                    <span>Save Changes</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* CARD 2: Appearance */}
          <div
            ref={sectionRefs.appearance}
            className={`rounded-2xl p-6 shadow-sm space-y-5 border ${isDark ? 'bg-[#141522] border-[#222336]' : 'bg-white border-[#EAE6F4]'
              }`}
          >
            {/* Header */}
            <div className={`flex items-center gap-2.5 pb-4 border-b ${isDark ? 'border-[#1f2032]' : 'border-[#F0ECF8]'}`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDark ? 'bg-purple-900/30 text-purple-400' : 'bg-[#EDE9FE] text-[#7C3AED]'
                }`}>
                <Moon className="w-4 h-4" />
              </div>
              <div>
                <h2 className={`text-sm font-semibold ${isDark ? 'text-gray-100' : 'text-[#181326]'}`}>Appearance</h2>
                <p className={`text-[11px] ${isDark ? 'text-gray-400' : 'text-[#6B7280]'}`}>Customize the look and feel of NoteNest.</p>
              </div>
            </div>

            {/* Theme Row */}
            <div className="flex items-center justify-between flex-wrap gap-4 py-1">
              <div>
                <div className={`text-xs font-medium ${isDark ? 'text-gray-200' : 'text-[#181326]'}`}>Theme</div>
                <div className={`text-[11px] ${isDark ? 'text-gray-400' : 'text-[#6B7280]'}`}>Choose your preferred workspace theme.</div>
              </div>

              {/* Theme Segmented Controls matching reference */}
              <div className={`flex items-center gap-1.5 p-1 rounded-xl border ${isDark ? 'bg-[#1a1b2c] border-[#27283c]' : 'bg-[#F4F2F9] border-[#E6E2F0]'
                }`}>
                <button
                  type="button"
                  onClick={() => {
                    setTheme('dark');
                    success('Dark theme selected');
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${isDark
                    ? 'bg-purple-900/40 text-purple-200 border border-purple-500/40 shadow-sm'
                    : 'text-[#5F5B73] hover:text-[#1E1B2E]'
                    }`}
                >
                  <Moon className="w-3.5 h-3.5" />
                  <span>Dark</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setTheme('light');
                    info('Light theme enabled for dashboard');
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${!isDark
                    ? 'bg-[#EDE9FE] text-[#7C3AED] border border-[#DDD6FE] font-semibold shadow-sm'
                    : 'text-gray-400 hover:text-gray-200'
                    }`}
                >
                  <Sun className="w-3.5 h-3.5" />
                  <span>Light</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const sysDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    setTheme(sysDark ? 'dark' : 'light');
                    info('System preference synchronized');
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${isDark ? 'text-gray-400 hover:text-gray-200' : 'text-[#5F5B73] hover:text-[#1E1B2E]'
                    }`}
                >
                  <Laptop className="w-3.5 h-3.5" />
                  <span>System</span>
                </button>
              </div>
            </div>

            {/* Accent Color Row matching reference */}
            <div className={`flex items-center justify-between flex-wrap gap-4 pt-4 border-t ${isDark ? 'border-[#1f2032]' : 'border-[#F0ECF8]'}`}>
              <div>
                <div className={`text-xs font-medium ${isDark ? 'text-gray-200' : 'text-[#181326]'}`}>Accent Color</div>
                <div className={`text-[11px] ${isDark ? 'text-gray-400' : 'text-[#6B7280]'}`}>Pick an accent color for highlights and active elements.</div>
              </div>

              <div className="flex items-center gap-2.5 sm:gap-3">
                {accentColors.map((color) => {
                  const isSelected = accentColor === color.id;
                  return (
                    <button
                      key={color.id}
                      type="button"
                      onClick={() => {
                        setAccentColor(color.id);
                        success(`Accent color set to ${color.label}`);
                      }}
                      title={color.label}
                      aria-label={`Select ${color.label} accent color`}
                      className={`relative flex items-center justify-center rounded-full border-2 border-transparent transition-all duration-200 ${isSelected
                        ? 'scale-110'
                        : 'hover:scale-105 opacity-90 hover:opacity-100'
                        }`}
                      style={{
                        width: isSelected ? '52px' : '40px',
                        height: isSelected ? '52px' : '40px',
                        backgroundColor: color.hex,
                        borderColor: isSelected ? '#f8fafc' : 'transparent',
                        boxShadow: isSelected ? `0 0 0 3px rgba(255,255,255,0.08), 0 0 0 5px ${color.hex}50` : undefined
                      }}
                    >
                      {isSelected && (
                        <div className="w-2.5 h-2.5 rounded-full bg-white/90 shadow-[0_0_0_2px_rgba(15,23,42,0.14)]" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* CARD 3: Editor */}
          <div
            ref={sectionRefs.editor}
            className={`rounded-2xl p-6 shadow-sm space-y-5 border ${isDark ? 'bg-[#141522] border-[#222336]' : 'bg-white border-[#EAE6F4]'
              }`}
          >
            {/* Header */}
            <div className={`flex items-center gap-2.5 pb-4 border-b ${isDark ? 'border-[#1f2032]' : 'border-[#F0ECF8]'}`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDark ? 'bg-purple-900/30 text-purple-400' : 'bg-[#EDE9FE] text-[#7C3AED]'
                }`}>
                <PenTool className="w-4 h-4" />
              </div>
              <div>
                <h2 className={`text-sm font-semibold ${isDark ? 'text-gray-100' : 'text-[#181326]'}`}>Editor</h2>
                <p className={`text-[11px] ${isDark ? 'text-gray-400' : 'text-[#6B7280]'}`}>Configure your writing and editing experience.</p>
              </div>
            </div>

            {/* Default Format */}
            <div className="flex items-center justify-between flex-wrap gap-4 py-1">
              <div>
                <div className={`text-xs font-medium ${isDark ? 'text-gray-200' : 'text-[#181326]'}`}>Default Format</div>
                <div className={`text-[11px] ${isDark ? 'text-gray-400' : 'text-[#6B7280]'}`}>Choose the default format for new notes.</div>
              </div>

              <select
                value={defaultFormat}
                onChange={(e) => {
                  setDefaultFormat(e.target.value);
                  success(`Default format set to ${e.target.value === 'markdown' ? 'Markdown (.md)' : e.target.value === 'plaintext' ? 'Plain Text (.txt)' : 'Rich Text'}`);
                }}
                className={`text-xs rounded-lg px-3 py-1.5 outline-none cursor-pointer border ${isDark ? 'bg-[#1b1c2c] border-[#2d2e44] text-gray-200 focus:border-purple-500' : 'bg-white border-[#D1D5DB] text-[#1F2937] focus:border-purple-500'
                  }`}
              >
                <option value="markdown">Markdown (.md)</option>
                <option value="richtext">Rich Text (TipTap)</option>
                <option value="plaintext">Plain Text (.txt)</option>
              </select>
            </div>

            {/* Font Size Slider */}
            <div className={`flex items-center justify-between flex-wrap gap-4 pt-4 border-t ${isDark ? 'border-[#1f2032]' : 'border-[#F0ECF8]'
              }`}>
              <div>
                <div className={`text-xs font-medium ${isDark ? 'text-gray-200' : 'text-[#181326]'}`}>Font Size</div>
                <div className={`text-[11px] ${isDark ? 'text-gray-400' : 'text-[#6B7280]'}`}>Adjust the editor font size.</div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="12"
                  max="22"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  style={{ accentColor: 'var(--accent, #a855f7)' }}
                  className="w-36 cursor-pointer"
                />
                <span className={`text-xs font-semibold w-12 text-right ${isDark ? 'text-gray-300' : 'text-[#374151]'}`}>{fontSize} px</span>
              </div>
            </div>

            {/* Line Numbers Toggle */}
            <div className={`flex items-center justify-between py-2 border-t ${isDark ? 'border-[#1f2032]' : 'border-[#F0ECF8]'}`}>
              <div>
                <div className={`text-xs font-medium ${isDark ? 'text-gray-200' : 'text-[#181326]'}`}>Line Numbers</div>
                <div className={`text-[11px] ${isDark ? 'text-gray-400' : 'text-[#6B7280]'}`}>Show line numbers in the editor.</div>
              </div>

              <button
                type="button"
                onClick={() => {
                  const next = !lineNumbers;
                  setLineNumbers(next);
                  info(`Line numbers ${next ? 'enabled' : 'disabled'}`);
                }}
                style={{ backgroundColor: lineNumbers ? 'var(--accent, #9333ea)' : undefined }}
                className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors ${lineNumbers ? '' : (isDark ? 'bg-[#2b2c40]' : 'bg-[#E5E7EB]')
                  }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform shadow-sm ${lineNumbers ? 'translate-x-5' : 'translate-x-0'
                    }`}
                />
              </button>
            </div>

            {/* Spell Check Toggle */}
            <div className={`flex items-center justify-between py-2 border-t ${isDark ? 'border-[#1f2032]' : 'border-[#F0ECF8]'}`}>
              <div>
                <div className={`text-xs font-medium ${isDark ? 'text-gray-200' : 'text-[#181326]'}`}>Spell Check</div>
                <div className={`text-[11px] ${isDark ? 'text-gray-400' : 'text-[#6B7280]'}`}>Check spelling while you write.</div>
              </div>

              <button
                type="button"
                onClick={() => {
                  const next = !spellCheck;
                  setSpellCheck(next);
                  info(`Spell check ${next ? 'enabled' : 'disabled'}`);
                }}
                style={{ backgroundColor: spellCheck ? 'var(--accent, #9333ea)' : undefined }}
                className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors ${spellCheck ? '' : (isDark ? 'bg-[#2b2c40]' : 'bg-[#E5E7EB]')
                  }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform shadow-sm ${spellCheck ? 'translate-x-5' : 'translate-x-0'
                    }`}
                />
              </button>
            </div>

            {/* Auto Save Toggle & Dropdown */}
            <div className={`flex items-center justify-between flex-wrap gap-4 pt-4 border-t ${isDark ? 'border-[#1f2032]' : 'border-[#F0ECF8]'}`}>
              <div>
                <div className={`text-xs font-medium ${isDark ? 'text-gray-200' : 'text-[#181326]'}`}>Auto Save</div>
                <div className={`text-[11px] ${isDark ? 'text-gray-400' : 'text-[#6B7280]'}`}>Automatically save changes as you type.</div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    const next = !autoSaveEnabled;
                    setAutoSaveEnabled(next);
                    info(`Auto save ${next ? 'enabled' : 'disabled'}`);
                  }}
                  style={{ backgroundColor: autoSaveEnabled ? 'var(--accent, #9333ea)' : undefined }}
                  className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors ${autoSaveEnabled ? '' : (isDark ? 'bg-[#2b2c40]' : 'bg-[#E5E7EB]')
                    }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform shadow-sm ${autoSaveEnabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                  />
                </button>

                <select
                  value={autoSaveInterval}
                  onChange={(e) => {
                    setAutoSaveInterval(e.target.value);
                    success(`Auto-save interval set to ${e.target.value}`);
                  }}
                  disabled={!autoSaveEnabled}
                  className={`text-xs rounded-lg px-2.5 py-1 outline-none focus:border-purple-500 cursor-pointer disabled:opacity-40 border ${isDark ? 'bg-[#1b1c2c] border-[#2d2e44] text-gray-200' : 'bg-white border-[#D1D5DB] text-[#1F2937]'
                    }`}
                >
                  <option value="750ms">Instant (750ms)</option>
                  <option value="2s">Every 2 seconds</option>
                  <option value="5s">Every 5 seconds</option>
                  <option value="10s">Every 10 seconds</option>
                </select>
              </div>
            </div>
          </div>

          {/* CARD 4: Storage */}
          <div
            ref={sectionRefs.storage}
            className={`rounded-2xl p-6 shadow-sm space-y-5 border ${isDark ? 'bg-[#141522] border-[#222336]' : 'bg-white border-[#EAE6F4]'
              }`}
          >
            <div className={`flex items-center gap-2.5 pb-4 border-b ${isDark ? 'border-[#1f2032]' : 'border-[#F0ECF8]'}`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDark ? 'bg-purple-900/30 text-purple-400' : 'bg-[#EDE9FE] text-[#7C3AED]'
                }`}>
                <Cloud className="w-4 h-4" />
              </div>
              <div>
                <h2 className={`text-sm font-semibold ${isDark ? 'text-gray-100' : 'text-[#181326]'}`}>Storage & Cloud Usage</h2>
                <p className={`text-[11px] ${isDark ? 'text-gray-400' : 'text-[#6B7280]'}`}>Manage local IndexedDB and Cloudinary CDN storage.</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-[#374151]'}`}>Workspace Cloud Storage</span>
                <span className={`font-semibold ${isDark ? 'text-purple-400' : 'text-[#7C3AED]'}`}>
                  {storageInfo.usedFormatted} of 2 GB used ({storageInfo.percentage})
                </span>
              </div>
              <div className={`w-full h-2 rounded-full overflow-hidden ${isDark ? 'bg-[#212234]' : 'bg-[#E5E1F0]'}`}>
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: storageInfo.progressWidth,
                    background: 'linear-gradient(to right, var(--accent, #a855f7), #6366f1)'
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className={`p-3 rounded-xl border ${isDark ? 'bg-[#1a1b2c] border-[#26273c]' : 'bg-[#F8F7FD] border-[#EAE6F4]'}`}>
                <div className={`text-[10px] ${isDark ? 'text-gray-400' : 'text-[#6B7280]'}`}>Cloud Database</div>
                <div className={`text-sm font-bold mt-1 ${isDark ? 'text-gray-100' : 'text-[#181326]'}`}>{notes.length} Notes</div>
              </div>
              <div className={`p-3 rounded-xl border ${isDark ? 'bg-[#1a1b2c] border-[#26273c]' : 'bg-[#F8F7FD] border-[#EAE6F4]'}`}>
                <div className={`text-[10px] ${isDark ? 'text-gray-400' : 'text-[#6B7280]'}`}>IndexedDB Cache</div>
                <div className={`text-sm font-bold mt-1 ${isDark ? 'text-gray-100' : 'text-[#181326]'}`}>{localCacheSize}</div>
              </div>
              <div className={`p-3 rounded-xl border ${isDark ? 'bg-[#1a1b2c] border-[#26273c]' : 'bg-[#F8F7FD] border-[#EAE6F4]'}`}>
                <div className={`text-[10px] ${isDark ? 'text-gray-400' : 'text-[#6B7280]'}`}>Media CDN</div>
                <div className={`text-sm font-bold mt-1 ${isDark ? 'text-gray-100' : 'text-[#181326]'}`}>Cloudinary Active</div>
              </div>
            </div>
          </div>

          {/* CARD 5: Sync & Backup */}
          <div
            ref={sectionRefs.sync}
            className={`rounded-2xl p-6 shadow-sm space-y-5 border ${isDark ? 'bg-[#141522] border-[#222336]' : 'bg-white border-[#EAE6F4]'
              }`}
          >
            <div className={`flex items-center gap-2.5 pb-4 border-b ${isDark ? 'border-[#1f2032]' : 'border-[#F0ECF8]'}`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDark ? 'bg-purple-900/30 text-purple-400' : 'bg-[#EDE9FE] text-[#7C3AED]'
                }`}>
                <RefreshCw className="w-4 h-4" />
              </div>
              <div>
                <h2 className={`text-sm font-semibold ${isDark ? 'text-gray-100' : 'text-[#181326]'}`}>Sync & Backup</h2>
                <p className={`text-[11px] ${isDark ? 'text-gray-400' : 'text-[#6B7280]'}`}>Synchronize workspace state with MongoDB Atlas.</p>
              </div>
            </div>

            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className={`text-xs font-semibold flex items-center gap-2 ${isDark ? 'text-gray-200' : 'text-[#181326]'}`}>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Online & Synchronized</span>
                </div>
                <div className={`text-[11px] mt-0.5 ${isDark ? 'text-gray-400' : 'text-[#6B7280]'}`}>
                  Last synchronized: Just now • 0 pending offline operations
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleSyncNow}
                  disabled={isSyncing}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadBackup}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${isDark
                    ? 'border-[#2d2e44] bg-[#1b1c2c] hover:bg-[#232438] text-gray-200'
                    : 'border-[#E2DEEE] bg-white hover:bg-[#F9F8FD] text-[#374151]'
                    }`}
                >
                  <Download className={`w-3.5 h-3.5 ${isDark ? 'text-purple-400' : 'text-[#7C3AED]'}`} />
                  <span>Export Backup</span>
                </button>
              </div>
            </div>
          </div>

          {/* CARD 6: Offline */}
          <div
            ref={sectionRefs.offline}
            className={`rounded-2xl p-6 shadow-sm space-y-4 border ${isDark ? 'bg-[#141522] border-[#222336]' : 'bg-white border-[#EAE6F4]'
              }`}
          >
            <div className={`flex items-center gap-2.5 pb-4 border-b ${isDark ? 'border-[#1f2032]' : 'border-[#F0ECF8]'}`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDark ? 'bg-purple-900/30 text-purple-400' : 'bg-[#EDE9FE] text-[#7C3AED]'
                }`}>
                <Download className="w-4 h-4" />
              </div>
              <div>
                <h2 className={`text-sm font-semibold ${isDark ? 'text-gray-100' : 'text-[#181326]'}`}>Offline-First Engine</h2>
                <p className={`text-[11px] ${isDark ? 'text-gray-400' : 'text-[#6B7280]'}`}>Powered by Dexie.js (IndexedDB local replica).</p>
              </div>
            </div>

            <p className={`text-xs leading-relaxed ${isDark ? 'text-gray-300' : 'text-[#374151]'}`}>
              NoteNest stores your active documents locally in IndexedDB. You can create, edit, search, and delete
              notes with zero internet connection. When connection is restored, pending changes are auto-merged.
            </p>
          </div>

          {/* CARD 7: Import & Export */}
          <div
            ref={sectionRefs.importExport}
            className={`rounded-2xl p-6 shadow-sm space-y-4 border ${isDark ? 'bg-[#141522] border-[#222336]' : 'bg-white border-[#EAE6F4]'
              }`}
          >
            <div className={`flex items-center gap-2.5 pb-4 border-b ${isDark ? 'border-[#1f2032]' : 'border-[#F0ECF8]'}`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDark ? 'bg-purple-900/30 text-purple-400' : 'bg-[#EDE9FE] text-[#7C3AED]'
                }`}>
                <ArrowUpDown className="w-4 h-4" />
              </div>
              <div>
                <h2 className={`text-sm font-semibold ${isDark ? 'text-gray-100' : 'text-[#181326]'}`}>Import & Export</h2>
                <p className={`text-[11px] ${isDark ? 'text-gray-400' : 'text-[#6B7280]'}`}>Portability for all your notes and markdown files.</p>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <button
                type="button"
                onClick={handleDownloadBackup}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-medium transition-colors ${isDark
                  ? 'bg-[#1b1c2c] hover:bg-[#25263c] border-[#2d2e44] text-gray-200'
                  : 'bg-white hover:bg-[#F9F8FD] border-[#E2DEEE] text-[#374151]'
                  }`}
              >
                <FileText className={`w-4 h-4 ${isDark ? 'text-purple-400' : 'text-[#7C3AED]'}`} />
                <span>Export Notes as JSON</span>
              </button>
            </div>
          </div>

          {/* CARD 8: Keyboard Shortcuts */}
          <div
            ref={sectionRefs.shortcuts}
            className={`rounded-2xl p-6 shadow-sm space-y-4 border ${isDark ? 'bg-[#141522] border-[#222336]' : 'bg-white border-[#EAE6F4]'
              }`}
          >
            <div className={`flex items-center gap-2.5 pb-4 border-b ${isDark ? 'border-[#1f2032]' : 'border-[#F0ECF8]'}`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDark ? 'bg-purple-900/30 text-purple-400' : 'bg-[#EDE9FE] text-[#7C3AED]'
                }`}>
                <Keyboard className="w-4 h-4" />
              </div>
              <div>
                <h2 className={`text-sm font-semibold ${isDark ? 'text-gray-100' : 'text-[#181326]'}`}>Keyboard Shortcuts</h2>
                <p className={`text-[11px] ${isDark ? 'text-gray-400' : 'text-[#6B7280]'}`}>Speed up writing and formatting.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {[
                { label: 'Save Document', key: 'Cmd + S' },
                { label: 'Quick Search', key: 'Cmd + K' },
                { label: 'Bold Text', key: 'Cmd + B' },
                { label: 'Italic Text', key: 'Cmd + I' },
                { label: 'Underline', key: 'Cmd + U' },
                { label: 'Inline Code', key: 'Cmd + E' }
              ].map((sc) => (
                <div key={sc.label} className={`flex items-center justify-between p-2.5 rounded-lg border ${isDark ? 'bg-[#191a2a] border-[#25263a] text-gray-300' : 'bg-[#F9F8FE] border-[#EAE6F4] text-[#374151]'
                  }`}>
                  <span>{sc.label}</span>
                  <kbd className={`px-2 py-0.5 font-mono text-[10px] rounded border ${isDark ? 'bg-[#25263a] text-purple-300 border-purple-500/30' : 'bg-[#EDE9FE] text-[#7C3AED] border-[#DDD6FE]'
                    }`}>
                    {sc.key}
                  </kbd>
                </div>
              ))}
            </div>
          </div>

          {/* CARD 9: Privacy & Security */}
          <div
            ref={sectionRefs.security}
            className={`rounded-2xl p-6 shadow-sm space-y-5 border ${isDark ? 'bg-[#141522] border-[#222336]' : 'bg-white border-[#EAE6F4]'
              }`}
          >
            <div className={`flex items-center gap-2.5 pb-4 border-b ${isDark ? 'border-[#1f2032]' : 'border-[#F0ECF8]'}`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDark ? 'bg-purple-900/30 text-purple-400' : 'bg-[#EDE9FE] text-[#7C3AED]'
                }`}>
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <h2 className={`text-sm font-semibold ${isDark ? 'text-gray-100' : 'text-[#181326]'}`}>Privacy & Security</h2>
                <p className={`text-[11px] ${isDark ? 'text-gray-400' : 'text-[#6B7280]'}`}>Password management and authentication security.</p>
              </div>
            </div>

            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className={`block text-[11px] font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-[#374151]'}`}>Current Password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    className={`w-full rounded-lg px-3 py-2 text-xs outline-none border focus:border-purple-500 ${isDark ? 'bg-[#1b1c2c] border-[#2d2e44] text-gray-100' : 'bg-white border-[#E2DEEE] text-[#111827]'
                      }`}
                  />
                </div>
                <div>
                  <label className={`block text-[11px] font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-[#374151]'}`}>New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                    className={`w-full rounded-lg px-3 py-2 text-xs outline-none border focus:border-purple-500 ${isDark ? 'bg-[#1b1c2c] border-[#2d2e44] text-gray-100' : 'bg-white border-[#E2DEEE] text-[#111827]'
                      }`}
                  />
                </div>
                <div>
                  <label className={`block text-[11px] font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-[#374151]'}`}>Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                    className={`w-full rounded-lg px-3 py-2 text-xs outline-none border focus:border-purple-500 ${isDark ? 'bg-[#1b1c2c] border-[#2d2e44] text-gray-100' : 'bg-white border-[#E2DEEE] text-[#111827]'
                      }`}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={passwordSaving}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium transition-colors disabled:opacity-50"
                >
                  <Key className="w-3.5 h-3.5" />
                  <span>{passwordSaving ? 'Updating...' : 'Update Password'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* CARD 10: About */}
          <div
            ref={sectionRefs.about}
            className={`rounded-2xl p-6 shadow-sm space-y-4 border ${isDark ? 'bg-[#141522] border-[#222336]' : 'bg-white border-[#EAE6F4]'
              }`}
          >
            <div className={`flex items-center gap-2.5 pb-4 border-b ${isDark ? 'border-[#1f2032]' : 'border-[#F0ECF8]'}`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDark ? 'bg-purple-900/30 text-purple-400' : 'bg-[#EDE9FE] text-[#7C3AED]'
                }`}>
                <Info className="w-4 h-4" />
              </div>
              <div>
                <h2 className={`text-sm font-semibold ${isDark ? 'text-gray-100' : 'text-[#181326]'}`}>About NoteNest</h2>
                <p className={`text-[11px] ${isDark ? 'text-gray-400' : 'text-[#6B7280]'}`}>Editorial workspace version and engineering team.</p>
              </div>
            </div>

            <div className={`text-xs space-y-2 leading-relaxed ${isDark ? 'text-gray-300' : 'text-[#374151]'}`}>
              <p>
                <strong>NoteNest v1.2.0</strong> — Built with MongoDB, Express, React, Node.js, TipTap, and Dexie.js.
              </p>
              <p className={`text-[11px] ${isDark ? 'text-gray-400' : 'text-[#6B7280]'}`}>
                Engineered by Anshuman Garg, Parth-Sohal, and Samarjeet-001 under the MIT License.
              </p>
            </div>

            <div className={`pt-4 border-t flex items-center justify-between ${isDark ? 'border-[#1f2032]' : 'border-[#F0ECF8]'}`}>
              <span className="text-xs text-red-500 font-medium">Danger Zone</span>
              <button
                type="button"
                onClick={async () => {
                  if (logout) await logout();
                  window.location.href = '/';
                }}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg border text-xs font-semibold transition-colors shadow-sm ${isDark
                  ? 'bg-red-950/40 hover:bg-red-900/60 border-red-500/40 text-red-300'
                  : 'bg-red-50 hover:bg-red-100 border-red-200 text-red-600'
                  }`}
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out of NoteNest</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
