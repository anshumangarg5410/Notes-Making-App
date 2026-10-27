import React, { useState } from 'react';
import { X, User, Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { useToast } from '../../context/ToastContext';

export const SettingsModal = ({ isOpen, onClose }) => {
  const { user, updateUser } = useAuth();
  const { success, error: toastError } = useToast();

  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'password'

  // Profile form state
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [profileLoading, setProfileLoading] = useState(false);

  // Password form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  if (!isOpen) return null;

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    try {
      const res = await authService.updateProfile({ name, email });
      if (res.success) {
        updateUser(res.data);
        success('Profile updated successfully');
        onClose();
      }
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

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

    setPasswordLoading(true);
    try {
      const res = await authService.updatePassword(currentPassword, newPassword);
      if (res.success) {
        success('Password updated successfully');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        onClose();
      }
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-warm-card dark:bg-charcoal-800 border border-warm-border dark:border-charcoal-700 w-full max-w-md rounded-2xl shadow-dropdown overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-warm-border dark:border-charcoal-700">
          <h3 className="font-serif font-bold text-lg text-charcoal-900 dark:text-cream-50">
            Account Settings
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-charcoal-400 hover:text-charcoal-700 dark:hover:text-cream-100 hover:bg-cream-100 dark:hover:bg-charcoal-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab selection */}
        <div className="flex border-b border-warm-border dark:border-charcoal-700 bg-cream-50/50 dark:bg-charcoal-900/50">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center space-x-2 border-b-2 transition-colors ${
              activeTab === 'profile'
                ? 'border-terracotta-500 text-terracotta-600 dark:text-terracotta-400 bg-warm-card dark:bg-charcoal-800'
                : 'border-transparent text-charcoal-500 hover:text-charcoal-800 dark:hover:text-cream-200'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile Details</span>
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center space-x-2 border-b-2 transition-colors ${
              activeTab === 'password'
                ? 'border-terracotta-500 text-terracotta-600 dark:text-terracotta-400 bg-warm-card dark:bg-charcoal-800'
                : 'border-transparent text-charcoal-500 hover:text-charcoal-800 dark:hover:text-cream-200'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Security & Password</span>
          </button>
        </div>

        {/* Tab content */}
        <div className="p-6">
          {activeTab === 'profile' ? (
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-charcoal-600 dark:text-cream-200 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-cream-50 dark:bg-charcoal-700 border border-warm-border dark:border-charcoal-600 rounded-xl text-sm text-charcoal-900 dark:text-cream-50 outline-none focus:ring-1 focus:ring-terracotta-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal-600 dark:text-cream-200 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-cream-50 dark:bg-charcoal-700 border border-warm-border dark:border-charcoal-600 rounded-xl text-sm text-charcoal-900 dark:text-cream-50 outline-none focus:ring-1 focus:ring-terracotta-500"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-warm-border dark:border-charcoal-600 text-charcoal-600 dark:text-cream-200 rounded-xl text-xs font-medium hover:bg-cream-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={profileLoading}
                  className="px-4 py-2 bg-terracotta-500 hover:bg-terracotta-600 text-white rounded-xl text-xs font-medium transition-colors shadow-sm disabled:opacity-50"
                >
                  {profileLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-charcoal-600 dark:text-cream-200 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-cream-50 dark:bg-charcoal-700 border border-warm-border dark:border-charcoal-600 rounded-xl text-sm text-charcoal-900 dark:text-cream-50 outline-none focus:ring-1 focus:ring-terracotta-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal-600 dark:text-cream-200 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-cream-50 dark:bg-charcoal-700 border border-warm-border dark:border-charcoal-600 rounded-xl text-sm text-charcoal-900 dark:text-cream-50 outline-none focus:ring-1 focus:ring-terracotta-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal-600 dark:text-cream-200 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-cream-50 dark:bg-charcoal-700 border border-warm-border dark:border-charcoal-600 rounded-xl text-sm text-charcoal-900 dark:text-cream-50 outline-none focus:ring-1 focus:ring-terracotta-500"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-warm-border dark:border-charcoal-600 text-charcoal-600 dark:text-cream-200 rounded-xl text-xs font-medium hover:bg-cream-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="px-4 py-2 bg-terracotta-500 hover:bg-terracotta-600 text-white rounded-xl text-xs font-medium transition-colors shadow-sm disabled:opacity-50"
                >
                  {passwordLoading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
