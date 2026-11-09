import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  User,
  Shield,
  Monitor,
  PenTool,
  Cloud,
  HardDrive,
  Bell,
  Keyboard,
  Info,
  Settings as SettingsIcon
} from 'lucide-react';
import { SettingsNavigation } from '../Settings/SettingsNavigation';
import { ProfileSettings } from '../Settings/ProfileSettings';
import { AccountSettings } from '../Settings/AccountSettings';
import { AppearanceSettings } from '../Settings/AppearanceSettings';
import { EditorSettings } from '../Settings/EditorSettings';
import { SyncSettings } from '../Settings/SyncSettings';
import { StorageSettings } from '../Settings/StorageSettings';
import { NotificationSettings } from '../Settings/NotificationSettings';
import { KeyboardShortcuts } from '../Settings/KeyboardShortcuts';
import { AboutSettings } from '../Settings/AboutSettings';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import { settingsService } from '../../services/settingsService';

const CATEGORY_META = {
  profile: {
    title: 'Profile',
    subtitle: 'Manage your personal information and profile details',
    icon: User
  },
  account: {
    title: 'Account',
    subtitle: 'Security, email and password credentials',
    icon: Shield
  },
  appearance: {
    title: 'Appearance',
    subtitle: 'Customize the look and feel of NoteNest',
    icon: Monitor
  },
  editor: {
    title: 'Editor',
    subtitle: 'Writing, markdown and code preferences',
    icon: PenTool
  },
  sync: {
    title: 'Sync & Backup',
    subtitle: 'Offline mode and cloud data synchronization',
    icon: Cloud
  },
  storage: {
    title: 'Storage',
    subtitle: 'Usage and plan details',
    icon: HardDrive
  },
  notifications: {
    title: 'Notifications',
    subtitle: 'Alerts and activity updates',
    icon: Bell
  },
  shortcuts: {
    title: 'Shortcuts',
    subtitle: 'Keyboard shortcuts cheat sheet',
    icon: Keyboard
  },
  about: {
    title: 'About',
    subtitle: 'App version and links',
    icon: Info
  }
};

export const IntegratedSettingsView = ({ onBackToDashboard, initialTab = 'profile' }) => {
  const { user, updateUser } = useAuth();
  const { theme, setTheme } = useTheme();
  const { success } = useToast();

  const [activeTab, setActiveTab] = useState(initialTab);
  const [currentUser, setCurrentUser] = useState(user);

  useEffect(() => {
    let isMounted = true;
    const fetchInitialData = async () => {
      try {
        const profileRes = await settingsService.getProfile();
        if (profileRes?.user && isMounted) {
          setCurrentUser(profileRes.user);
          if (updateUser) updateUser(profileRes.user);
        }
      } catch (err) {
        console.warn('Failed to fetch initial settings data:', err);
      }
    };

    fetchInitialData();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleUserUpdate = (updatedUserData) => {
    setCurrentUser(updatedUserData);
    if (updateUser) updateUser(updatedUserData);
  };

  const currentMeta = CATEGORY_META[activeTab] || CATEGORY_META.profile;
  const ActiveIcon = currentMeta.icon;

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Return to Dashboard Bar */}
      <div className="flex items-center justify-between gap-4 pb-2 border-b border-purple-500/15">
        <button
          onClick={onBackToDashboard}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-[4px] bg-purple-950/40 hover:bg-purple-900/60 border border-purple-500/30 text-purple-200 hover:text-white text-xs font-semibold transition-all cursor-pointer shadow-sm group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Dashboard Overview</span>
        </button>

        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[3px] bg-purple-950/60 border border-purple-500/25 text-[11px] text-purple-300">
          <SettingsIcon className="w-3.5 h-3.5 text-purple-400" />
          <span>Settings &amp; Profile Integration Active</span>
        </span>
      </div>

      {/* 2-Pane Settings Stage: Sub-Navigation + Content Panel */}
      <div className="rounded-[4px] border border-purple-500/20 bg-[#120a22]/90 backdrop-blur-md shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[640px]">
        {/* Left Sub-Navigation Pane (md:col-span-4 lg:col-span-3) */}
        <div className="md:col-span-4 lg:col-span-3 border-r border-purple-500/15 bg-[#0e071c]/80 p-4">
          <SettingsNavigation
            activeTab={activeTab}
            onSelectTab={setActiveTab}
          />
        </div>

        {/* Right Active Workspace Content Pane (md:col-span-8 lg:col-span-9) */}
        <div className="md:col-span-8 lg:col-span-9 flex flex-col min-w-0">
          {/* Header of Content Pane */}
          <div className="px-6 py-5 border-b border-purple-500/15 bg-[#140b27]/80 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-[6px] border border-purple-500/30 bg-purple-950/50 flex items-center justify-center text-purple-300 shrink-0 shadow-[0_0_12px_rgba(168,85,247,0.25)]">
                <ActiveIcon className="w-4 h-4" />
              </div>

              <div>
                <h2 className="text-base font-bold text-white tracking-tight leading-tight">
                  {currentMeta.title}
                </h2>
                <p className="text-xs text-gray-400 leading-tight mt-0.5">
                  {currentMeta.subtitle}
                </p>
              </div>
            </div>
          </div>

          {/* Active Content Region */}
          <div className="p-6 overflow-y-auto max-w-4xl">
            {activeTab === 'profile' && (
              <ProfileSettings
                user={currentUser}
                onUpdate={handleUserUpdate}
              />
            )}

            {activeTab === 'account' && (
              <AccountSettings
                user={currentUser}
                onUpdate={handleUserUpdate}
              />
            )}

            {activeTab === 'appearance' && (
              <AppearanceSettings
                currentTheme={theme}
                onThemeChange={setTheme}
              />
            )}

            {activeTab === 'editor' && <EditorSettings />}

            {activeTab === 'sync' && <SyncSettings />}

            {activeTab === 'storage' && (
              <StorageSettings
                storage={{ usedMb: 245, totalGb: 2, percentage: 12 }}
                onOpenUpgrade={() => {}}
              />
            )}

            {activeTab === 'notifications' && <NotificationSettings />}

            {activeTab === 'shortcuts' && <KeyboardShortcuts />}

            {activeTab === 'about' && <AboutSettings />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegratedSettingsView;
