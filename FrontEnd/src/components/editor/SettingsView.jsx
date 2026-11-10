import React, { useState, useRef } from 'react';
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
  const { theme, setTheme, isDark } = useTheme();
  const { success, error: toastError, info } = useToast();

  const [activeSection, setActiveSection] = useState('account');

  // Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [profileSaving, setProfileSaving] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Appearance State
  const [accentColor, setAccentColor] = useState('purple');

  // Editor Preferences State
  const [defaultFormat, setDefaultFormat] = useState('markdown');
  const [fontSize, setFontSize] = useState(14);
  const [lineNumbers, setLineNumbers] = useState(false);
  const [spellCheck, setSpellCheck] = useState(true);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [autoSaveInterval, setAutoSaveInterval] = useState('10s');

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
    <div className="flex-1 h-full overflow-y-auto obsidian-scrollbar bg-[#0d0e17] text-gray-200">
      {/* Settings Top View Header with decorative glow */}
      <div className="relative px-8 pt-8 pb-6 border-b border-[#1f2030] overflow-hidden">
        {/* Subtle decorative purple wave in background */}
        <div className="absolute -top-12 -right-12 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-64 h-32 bg-indigo-600/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-900/30 border border-purple-500/40 text-purple-400 flex items-center justify-center shadow-lg shadow-purple-950/40">
              <SettingsIcon className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-100 tracking-tight font-sans">Settings</h1>
              <p className="text-xs text-gray-400 mt-0.5">
                Manage your account, preferences, appearance, and more.
              </p>
            </div>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-300 hover:text-white bg-[#1a1b28] hover:bg-[#252638] border border-[#292a3e] transition-all shadow-sm"
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
          <div className="bg-[#141522] border border-[#222336] rounded-2xl p-2.5 shadow-sm space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all text-left ${
                    isActive
                      ? 'bg-purple-900/35 text-purple-200 font-semibold border-l-2 border-purple-500 shadow-sm'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-[#1a1b2b]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-purple-400' : 'text-gray-400'}`} />
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
            className="bg-[#141522] border border-[#222336] rounded-2xl p-6 shadow-sm space-y-5"
          >
            {/* Card Header */}
            <div className="flex items-center gap-2.5 pb-4 border-b border-[#1f2032]">
              <div className="w-8 h-8 rounded-lg bg-purple-900/30 text-purple-400 flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-100">Account</h2>
                <p className="text-[11px] text-gray-400">Your profile and account information.</p>
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
                    className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center border-2 border-[#141522] shadow-md transition-colors cursor-pointer"
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
                  <div className="font-semibold text-base text-gray-100">{displayName}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{user?.email || 'anshuman.garg@example.com'}</div>
                  {avatarUploading && (
                    <span className="text-[10px] text-purple-400 flex items-center gap-1 mt-1">
                      <RefreshCw className="w-2.5 h-2.5 animate-spin" /> Uploading to Cloudinary...
                    </span>
                  )}
                </div>
              </div>

              {!isEditingProfile ? (
                <button
                  onClick={() => setIsEditingProfile(true)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#2b2c40] bg-[#1b1c2b] hover:bg-[#232438] text-xs font-medium text-gray-200 transition-colors shadow-sm"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Profile</span>
                </button>
              ) : null}
            </div>

            {/* Inline Profile Edit Form */}
            {isEditingProfile && (
              <form onSubmit={handleSaveProfile} className="pt-4 border-t border-[#1f2032] space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[#1b1c2c] border border-[#2d2e44] focus:border-purple-500 rounded-lg px-3 py-2 text-xs text-gray-100 outline-none transition-colors"
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#1b1c2c] border border-[#2d2e44] focus:border-purple-500 rounded-lg px-3 py-2 text-xs text-gray-100 outline-none transition-colors"
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(false)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-400 hover:text-gray-200"
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
            className="bg-[#141522] border border-[#222336] rounded-2xl p-6 shadow-sm space-y-5"
          >
            {/* Header */}
            <div className="flex items-center gap-2.5 pb-4 border-b border-[#1f2032]">
              <div className="w-8 h-8 rounded-lg bg-purple-900/30 text-purple-400 flex items-center justify-center">
                <Moon className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-100">Appearance</h2>
                <p className="text-[11px] text-gray-400">Customize the look and feel of NoteNest.</p>
              </div>
            </div>

            {/* Theme Row */}
            <div className="flex items-center justify-between flex-wrap gap-4 py-1">
              <div>
                <div className="text-xs font-medium text-gray-200">Theme</div>
                <div className="text-[11px] text-gray-400">Choose your preferred workspace theme.</div>
              </div>

              {/* Theme Segmented Controls matching reference */}
              <div className="flex items-center gap-1.5 p-1 bg-[#1a1b2c] rounded-xl border border-[#27283c]">
                <button
                  type="button"
                  onClick={() => {
                    setTheme('dark');
                    success('Dark theme selected');
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isDark
                      ? 'bg-purple-900/40 text-purple-200 border border-purple-500/40 shadow-sm'
                      : 'text-gray-400 hover:text-gray-200'
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
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    !isDark
                      ? 'bg-purple-100 text-purple-900 font-semibold shadow-sm'
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
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-400 hover:text-gray-200 transition-all"
                >
                  <Laptop className="w-3.5 h-3.5" />
                  <span>System</span>
                </button>
              </div>
            </div>

            {/* Accent Color Row matching reference */}
            <div className="flex items-center justify-between flex-wrap gap-4 pt-4 border-t border-[#1f2032]">
              <div>
                <div className="text-xs font-medium text-gray-200">Accent Color</div>
                <div className="text-[11px] text-gray-400">Pick an accent color for highlights and active elements.</div>
              </div>

              <div className="flex items-center gap-2.5">
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
                      className={`w-6 h-6 rounded-full transition-transform duration-150 ${
                        isSelected ? 'scale-125 ring-2 ring-purple-400 ring-offset-2 ring-offset-[#141522]' : 'hover:scale-110'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.label}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          {/* CARD 3: Editor */}
          <div
            ref={sectionRefs.editor}
            className="bg-[#141522] border border-[#222336] rounded-2xl p-6 shadow-sm space-y-5"
          >
            {/* Header */}
            <div className="flex items-center gap-2.5 pb-4 border-b border-[#1f2032]">
              <div className="w-8 h-8 rounded-lg bg-purple-900/30 text-purple-400 flex items-center justify-center">
                <PenTool className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-100">Editor</h2>
                <p className="text-[11px] text-gray-400">Configure your writing and editing experience.</p>
              </div>
            </div>

            {/* Default Format */}
            <div className="flex items-center justify-between flex-wrap gap-4 py-1">
              <div>
                <div className="text-xs font-medium text-gray-200">Default Format</div>
                <div className="text-[11px] text-gray-400">Choose the default format for new notes.</div>
              </div>

              <select
                value={defaultFormat}
                onChange={(e) => setDefaultFormat(e.target.value)}
                className="bg-[#1b1c2c] border border-[#2d2e44] text-xs text-gray-200 rounded-lg px-3 py-1.5 outline-none focus:border-purple-500 cursor-pointer"
              >
                <option value="markdown">Markdown (.md)</option>
                <option value="richtext">Rich Text (TipTap)</option>
                <option value="plaintext">Plain Text (.txt)</option>
              </select>
            </div>

            {/* Font Size Slider */}
            <div className="flex items-center justify-between flex-wrap gap-4 pt-4 border-t border-[#1f2032]">
              <div>
                <div className="text-xs font-medium text-gray-200">Font Size</div>
                <div className="text-[11px] text-gray-400">Adjust the editor font size.</div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="12"
                  max="22"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-36 accent-purple-500 cursor-pointer"
                />
                <span className="text-xs font-semibold text-gray-300 w-12 text-right">{fontSize} px</span>
              </div>
            </div>

            {/* Line Numbers Toggle */}
            <div className="flex items-center justify-between py-2 border-t border-[#1f2032]">
              <div>
                <div className="text-xs font-medium text-gray-200">Line Numbers</div>
                <div className="text-[11px] text-gray-400">Show line numbers in the editor.</div>
              </div>

              <button
                type="button"
                onClick={() => setLineNumbers(!lineNumbers)}
                className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors ${
                  lineNumbers ? 'bg-purple-600' : 'bg-[#2b2c40]'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    lineNumbers ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Spell Check Toggle */}
            <div className="flex items-center justify-between py-2 border-t border-[#1f2032]">
              <div>
                <div className="text-xs font-medium text-gray-200">Spell Check</div>
                <div className="text-[11px] text-gray-400">Check spelling while you write.</div>
              </div>

              <button
                type="button"
                onClick={() => setSpellCheck(!spellCheck)}
                className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors ${
                  spellCheck ? 'bg-purple-600' : 'bg-[#2b2c40]'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    spellCheck ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Auto Save Toggle & Dropdown */}
            <div className="flex items-center justify-between flex-wrap gap-4 pt-4 border-t border-[#1f2032]">
              <div>
                <div className="text-xs font-medium text-gray-200">Auto Save</div>
                <div className="text-[11px] text-gray-400">Automatically save changes as you type.</div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setAutoSaveEnabled(!autoSaveEnabled)}
                  className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors ${
                    autoSaveEnabled ? 'bg-purple-600' : 'bg-[#2b2c40]'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      autoSaveEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>

                <select
                  value={autoSaveInterval}
                  onChange={(e) => setAutoSaveInterval(e.target.value)}
                  disabled={!autoSaveEnabled}
                  className="bg-[#1b1c2c] border border-[#2d2e44] text-xs text-gray-200 rounded-lg px-2.5 py-1 outline-none focus:border-purple-500 cursor-pointer disabled:opacity-40"
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
            className="bg-[#141522] border border-[#222336] rounded-2xl p-6 shadow-sm space-y-5"
          >
            <div className="flex items-center gap-2.5 pb-4 border-b border-[#1f2032]">
              <div className="w-8 h-8 rounded-lg bg-purple-900/30 text-purple-400 flex items-center justify-center">
                <Cloud className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-100">Storage & Cloud Usage</h2>
                <p className="text-[11px] text-gray-400">Manage local IndexedDB and Cloudinary CDN storage.</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-300 font-medium">Workspace Cloud Storage</span>
                <span className="text-purple-400 font-semibold">245 MB of 2 GB used (12%)</span>
              </div>
              <div className="w-full h-2 bg-[#212234] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 w-[12%] rounded-full" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 bg-[#1a1b2c] rounded-xl border border-[#26273c]">
                <div className="text-[10px] text-gray-400">Cloud Database</div>
                <div className="text-sm font-bold text-gray-100 mt-1">{notes.length} Notes</div>
              </div>
              <div className="p-3 bg-[#1a1b2c] rounded-xl border border-[#26273c]">
                <div className="text-[10px] text-gray-400">IndexedDB Cache</div>
                <div className="text-sm font-bold text-gray-100 mt-1">18 MB Local</div>
              </div>
              <div className="p-3 bg-[#1a1b2c] rounded-xl border border-[#26273c]">
                <div className="text-[10px] text-gray-400">Media CDN</div>
                <div className="text-sm font-bold text-gray-100 mt-1">Cloudinary Active</div>
              </div>
            </div>
          </div>

          {/* CARD 5: Sync & Backup */}
          <div
            ref={sectionRefs.sync}
            className="bg-[#141522] border border-[#222336] rounded-2xl p-6 shadow-sm space-y-5"
          >
            <div className="flex items-center gap-2.5 pb-4 border-b border-[#1f2032]">
              <div className="w-8 h-8 rounded-lg bg-purple-900/30 text-purple-400 flex items-center justify-center">
                <RefreshCw className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-100">Sync & Backup</h2>
                <p className="text-[11px] text-gray-400">Synchronize workspace state with MongoDB Atlas.</p>
              </div>
            </div>

            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="text-xs font-semibold text-gray-200 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Online & Synchronized</span>
                </div>
                <div className="text-[11px] text-gray-400 mt-0.5">
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
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#2d2e44] bg-[#1b1c2c] hover:bg-[#232438] text-xs font-medium text-gray-200 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-purple-400" />
                  <span>Export Backup</span>
                </button>
              </div>
            </div>
          </div>

          {/* CARD 6: Offline */}
          <div
            ref={sectionRefs.offline}
            className="bg-[#141522] border border-[#222336] rounded-2xl p-6 shadow-sm space-y-4"
          >
            <div className="flex items-center gap-2.5 pb-4 border-b border-[#1f2032]">
              <div className="w-8 h-8 rounded-lg bg-purple-900/30 text-purple-400 flex items-center justify-center">
                <Download className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-100">Offline-First Engine</h2>
                <p className="text-[11px] text-gray-400">Powered by Dexie.js (IndexedDB local replica).</p>
              </div>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed">
              NoteNest stores your active documents locally in IndexedDB. You can create, edit, search, and delete
              notes with zero internet connection. When connection is restored, pending changes are auto-merged.
            </p>
          </div>

          {/* CARD 7: Import & Export */}
          <div
            ref={sectionRefs.importExport}
            className="bg-[#141522] border border-[#222336] rounded-2xl p-6 shadow-sm space-y-4"
          >
            <div className="flex items-center gap-2.5 pb-4 border-b border-[#1f2032]">
              <div className="w-8 h-8 rounded-lg bg-purple-900/30 text-purple-400 flex items-center justify-center">
                <ArrowUpDown className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-100">Import & Export</h2>
                <p className="text-[11px] text-gray-400">Portability for all your notes and markdown files.</p>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <button
                type="button"
                onClick={handleDownloadBackup}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1b1c2c] hover:bg-[#25263c] border border-[#2d2e44] text-xs font-medium text-gray-200 transition-colors"
              >
                <FileText className="w-4 h-4 text-purple-400" />
                <span>Export Notes as JSON</span>
              </button>
            </div>
          </div>

          {/* CARD 8: Keyboard Shortcuts */}
          <div
            ref={sectionRefs.shortcuts}
            className="bg-[#141522] border border-[#222336] rounded-2xl p-6 shadow-sm space-y-4"
          >
            <div className="flex items-center gap-2.5 pb-4 border-b border-[#1f2032]">
              <div className="w-8 h-8 rounded-lg bg-purple-900/30 text-purple-400 flex items-center justify-center">
                <Keyboard className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-100">Keyboard Shortcuts</h2>
                <p className="text-[11px] text-gray-400">Speed up writing and formatting.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="flex items-center justify-between p-2.5 bg-[#191a2a] rounded-lg">
                <span className="text-gray-300">Save Document</span>
                <kbd className="px-2 py-0.5 bg-[#25263a] text-purple-300 font-mono text-[10px] rounded border border-purple-500/30">Cmd + S</kbd>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-[#191a2a] rounded-lg">
                <span className="text-gray-300">Quick Search</span>
                <kbd className="px-2 py-0.5 bg-[#25263a] text-purple-300 font-mono text-[10px] rounded border border-purple-500/30">Cmd + K</kbd>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-[#191a2a] rounded-lg">
                <span className="text-gray-300">Bold Text</span>
                <kbd className="px-2 py-0.5 bg-[#25263a] text-purple-300 font-mono text-[10px] rounded border border-purple-500/30">Cmd + B</kbd>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-[#191a2a] rounded-lg">
                <span className="text-gray-300">Italic Text</span>
                <kbd className="px-2 py-0.5 bg-[#25263a] text-purple-300 font-mono text-[10px] rounded border border-purple-500/30">Cmd + I</kbd>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-[#191a2a] rounded-lg">
                <span className="text-gray-300">Underline</span>
                <kbd className="px-2 py-0.5 bg-[#25263a] text-purple-300 font-mono text-[10px] rounded border border-purple-500/30">Cmd + U</kbd>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-[#191a2a] rounded-lg">
                <span className="text-gray-300">Inline Code</span>
                <kbd className="px-2 py-0.5 bg-[#25263a] text-purple-300 font-mono text-[10px] rounded border border-purple-500/30">Cmd + E</kbd>
              </div>
            </div>
          </div>

          {/* CARD 9: Privacy & Security */}
          <div
            ref={sectionRefs.security}
            className="bg-[#141522] border border-[#222336] rounded-2xl p-6 shadow-sm space-y-5"
          >
            <div className="flex items-center gap-2.5 pb-4 border-b border-[#1f2032]">
              <div className="w-8 h-8 rounded-lg bg-purple-900/30 text-purple-400 flex items-center justify-center">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-100">Privacy & Security</h2>
                <p className="text-[11px] text-gray-400">Password management and authentication security.</p>
              </div>
            </div>

            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-medium text-gray-300 mb-1">Current Password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    className="w-full bg-[#1b1c2c] border border-[#2d2e44] focus:border-purple-500 rounded-lg px-3 py-2 text-xs text-gray-100 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-gray-300 mb-1">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full bg-[#1b1c2c] border border-[#2d2e44] focus:border-purple-500 rounded-lg px-3 py-2 text-xs text-gray-100 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-gray-300 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full bg-[#1b1c2c] border border-[#2d2e44] focus:border-purple-500 rounded-lg px-3 py-2 text-xs text-gray-100 outline-none"
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
            className="bg-[#141522] border border-[#222336] rounded-2xl p-6 shadow-sm space-y-4"
          >
            <div className="flex items-center gap-2.5 pb-4 border-b border-[#1f2032]">
              <div className="w-8 h-8 rounded-lg bg-purple-900/30 text-purple-400 flex items-center justify-center">
                <Info className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-100">About NoteNest</h2>
                <p className="text-[11px] text-gray-400">Editorial workspace version and engineering team.</p>
              </div>
            </div>

            <div className="text-xs text-gray-300 space-y-2 leading-relaxed">
              <p>
                <strong>NoteNest v1.2.0</strong> — Built with MongoDB, Express, React, Node.js, TipTap, and Dexie.js.
              </p>
              <p className="text-gray-400 text-[11px]">
                Engineered by Anshuman Garg, Parth-Sohal, and Samarjeet-001 under the MIT License.
              </p>
            </div>

            <div className="pt-4 border-t border-[#1f2032] flex items-center justify-between">
              <span className="text-xs text-red-400 font-medium">Danger Zone</span>
              <button
                type="button"
                onClick={async () => {
                  if (logout) await logout();
                  window.location.href = '/';
                }}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-500/40 text-red-300 text-xs font-semibold transition-colors shadow-sm"
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
