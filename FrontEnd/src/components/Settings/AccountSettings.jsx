import React, { useState } from 'react';
import { Shield, KeyRound, Mail, AlertTriangle, Check, Eye, EyeOff } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { settingsService } from '../../services/settingsService';

export const AccountSettings = ({ user, onUserUpdate }) => {
  const { success, error: toastError } = useToast();

  // Change Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Change Email state
  const [newEmail, setNewEmail] = useState('');
  const [emailPassword, setEmailPassword] = useState('');
  const [emailLoading, setEmailLoading] = useState(false);

  // Danger Zone state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      toastError('Please fill in both current and new passwords');
      return;
    }
    if (newPassword.length < 6) {
      toastError('New password must be at least 6 characters long');
      return;
    }
    if (newPassword !== confirmPassword) {
      toastError('New passwords do not match');
      return;
    }

    try {
      setPasswordLoading(true);
      await settingsService.changePassword({ currentPassword, newPassword });
      success('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!newEmail || !emailPassword) {
      toastError('Please provide your new email and password');
      return;
    }

    try {
      setEmailLoading(true);
      const res = await settingsService.changeEmail({ newEmail, password: emailPassword });
      if (res.user && onUserUpdate) onUserUpdate(res.user);
      success('Email address updated successfully');
      setNewEmail('');
      setEmailPassword('');
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to update email');
    } finally {
      setEmailLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') {
      toastError('Please type DELETE to confirm');
      return;
    }
    if (!deletePassword) {
      toastError('Please enter your password');
      return;
    }

    try {
      setDeleteLoading(true);
      await settingsService.deleteAccount({ password: deletePassword });
      success('Account deleted successfully');
      localStorage.clear();
      window.location.href = '/';
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to delete account');
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-4 text-xs">
      {/* 1. Change Password */}
      <div className="rounded-[6px] border border-[#272738] bg-[#14141e] p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <KeyRound className="w-4 h-4 text-purple-400" />
          <h3 className="text-sm font-bold text-white tracking-tight">Security & Password</h3>
        </div>
        <p className="text-[11px] text-gray-400 mb-4">
          Ensure your account stays protected by using a secure, unique password
        </p>

        <form onSubmit={handlePasswordSubmit} className="space-y-3.5 max-w-lg">
          <div>
            <label className="block text-gray-400 font-medium mb-1.5">
              Current Password
            </label>
            <div className="relative flex items-center">
              <input
                type={showCurrent ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#1b1b26] border border-[#2e2e42] rounded-[5px] px-3 py-2 pr-9 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 text-gray-500 hover:text-gray-300"
              >
                {showCurrent ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-400 font-medium mb-1.5">
                New Password
              </label>
              <div className="relative flex items-center">
                <input
                  type={showNew ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full bg-[#1b1b26] border border-[#2e2e42] rounded-[5px] px-3 py-2 pr-9 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 text-gray-500 hover:text-gray-300"
                >
                  {showNew ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-gray-400 font-medium mb-1.5">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                className="w-full bg-[#1b1b26] border border-[#2e2e42] rounded-[5px] px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={passwordLoading}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium rounded-[5px] text-xs transition-all cursor-pointer shadow-sm disabled:opacity-50"
            >
              {passwordLoading ? 'Updating Password...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>

      {/* 2. Update Primary Email */}
      <div className="rounded-[6px] border border-[#272738] bg-[#14141e] p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <Mail className="w-4 h-4 text-purple-400" />
          <h3 className="text-sm font-bold text-white tracking-tight">Primary Email Address</h3>
        </div>
        <p className="text-[11px] text-gray-400 mb-4">
          Current address: <span className="text-purple-300 font-semibold">{user?.email || 'anshumangarg@gmail.com'}</span>
        </p>

        <form onSubmit={handleEmailSubmit} className="space-y-3 max-w-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-400 font-medium mb-1.5">
                New Email Address
              </label>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-[#1b1b26] border border-[#2e2e42] rounded-[5px] px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-gray-400 font-medium mb-1.5">
                Current Password to Confirm
              </label>
              <input
                type="password"
                value={emailPassword}
                onChange={(e) => setEmailPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#1b1b26] border border-[#2e2e42] rounded-[5px] px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={emailLoading}
              className="px-4 py-2 bg-[#272738] hover:bg-[#34344a] text-white font-medium rounded-[5px] text-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              {emailLoading ? 'Updating...' : 'Change Email'}
            </button>
          </div>
        </form>
      </div>

      {/* 3. Danger Zone */}
      <div className="rounded-[6px] border border-red-900/30 bg-[#161114] p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <AlertTriangle className="w-4 h-4 text-red-400" />
          <h3 className="text-sm font-bold text-red-400 tracking-tight">Danger Zone</h3>
        </div>
        <p className="text-[11px] text-gray-400 mb-4">
          Permanently delete your NoteNest account, all notes, and offline data. This action cannot be reversed.
        </p>

        {!showDeleteModal ? (
          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="px-4 py-2 bg-red-950/40 hover:bg-red-900/60 border border-red-800/50 text-red-300 font-medium rounded-[5px] text-xs transition-colors cursor-pointer"
          >
            Delete Account
          </button>
        ) : (
          <div className="p-4 bg-red-950/20 border border-red-900/40 rounded-[6px] space-y-3 max-w-lg">
            <p className="text-xs text-red-300 font-medium">
              Are you sure? Type <span className="font-bold underline">DELETE</span> below and enter your password.
            </p>
            <input
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="Type DELETE"
              className="w-full bg-[#14141e] border border-red-800/60 rounded-[5px] px-3 py-2 text-xs text-red-200 placeholder-gray-500 focus:outline-none"
            />
            <input
              type="password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              placeholder="Your password"
              className="w-full bg-[#14141e] border border-red-800/60 rounded-[5px] px-3 py-2 text-xs text-red-200 placeholder-gray-500 focus:outline-none"
            />
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={deleteLoading || deleteConfirmText !== 'DELETE'}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 disabled:opacity-40 text-white font-medium rounded-[5px] text-xs transition-colors cursor-pointer"
              >
                {deleteLoading ? 'Deleting...' : 'Permanently Delete Account'}
              </button>
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs rounded-[5px] cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

