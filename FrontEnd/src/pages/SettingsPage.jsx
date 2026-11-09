import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  User,
  Shield,
  Monitor,
  PenTool,
  Cloud,
  HardDrive,
  Bell,
  Keyboard,
  Info,
  Menu,
  ChevronLeft
} from 'lucide-react';
import { Sidebar } from '../components/Dashboard/Sidebar';
import { UpgradeProModal } from '../components/Dashboard/UpgradeProModal';
import { SettingsNavigation } from '../components/Settings/SettingsNavigation';
import { ProfileSettings } from '../components/Settings/ProfileSettings';
import { AccountSettings } from '../components/Settings/AccountSettings';
import { AppearanceSettings } from '../components/Settings/AppearanceSettings';
import { EditorSettings } from '../components/Settings/EditorSettings';
import { SyncSettings } from '../components/Settings/SyncSettings';
import { StorageSettings } from '../components/Settings/StorageSettings';
import { NotificationSettings } from '../components/Settings/NotificationSettings';
import { KeyboardShortcuts } from '../components/Settings/KeyboardShortcuts';
import { AboutSettings } from '../components/Settings/AboutSettings';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import { settingsService } from '../services/settingsService';
import { folderService } from '../services/folderService';
import '../styles/authenticatedTheme.css';

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

export const SettingsPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, updateUser } = useAuth();
  const { theme, setTheme } = useTheme();
  const { success } = useToast();

  const tabParam = searchParams.get('tab') || 'profile';
  const [activeTab, setActiveTab] = useState(tabParam);
  const [currentUser, setCurrentUser] = useState(user);
  const [folders, setFolders] = useState([]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  // Sync tab with URL
  const handleSelectTab = (tabId) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
  };

  // Fetch full user profile and folder list on load
  useEffect(() => {
    let isMounted = true;
    const fetchInitialData = async () => {
      try {
        const [profileRes, foldersRes] = await Promise.allSettled([
          settingsService.getProfile(),
          folderService.getFolders()
        ]);

        if (profileRes.status === 'fulfilled' && profileRes.value?.user && isMounted) {
          setCurrentUser(profileRes.value.user);
          if (updateUser) updateUser(profileRes.value.user);
        }
        if (foldersRes.status === 'fulfilled' && foldersRes.value?.data && isMounted) {
          setFolders(foldersRes.value.data);
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

  const handleSidebarNav = (navId) => {
    if (navId === 'dashboard') navigate('/dashboard');
    else if (navId === 'folders') navigate('/folders');
    else if (navId === 'trash') navigate('/trash');
    else if (navId === 'all-notes' || navId === 'favorites') {
      navigate(`/notes?view=${navId}`);
    } else if (navId.startsWith('folder-')) {
      const folderName = navId.replace('folder-', '');
      navigate(`/notes?folder=${folderName}`);
    } else if (navId === 'settings') {
      handleSelectTab('profile');
    }
  };

  const currentMeta = CATEGORY_META[activeTab] || CATEGORY_META.profile;
  const ActiveIcon = currentMeta.icon;

  return (
    <div className={`app-theme-${theme === 'dark' ? 'dark' : 'light'} h-screen w-full flex overflow-hidden font-sans select-none`}>
      {/* COLUMN 1: Main NoteNest Application Sidebar */}
      <Sidebar
        activeNav="settings"
        onSelectNav={handleSidebarNav}
        folders={folders}
        storage={{ usedMb: 245, totalGb: 2, percentage: 12 }}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        onOpenUpgradeModal={() => setIsUpgradeModalOpen(true)}
      />

      {/* Main Settings Stage: COLUMN 2 (Navigation) + COLUMN 3 (Workspace) */}
      <div className="flex-1 flex min-w-0 h-screen overflow-hidden">
        {/* COLUMN 2: Settings Sub-Navigation */}
        <SettingsNavigation
          activeTab={activeTab}
          onSelectTab={handleSelectTab}
        />

        {/* COLUMN 3: Settings Active Workspace Content */}
        <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto bg-[#0e0a17] scrollbar-thin">
          {/* Top Header of Column 3 */}
          <div className="px-6 py-5 border-b border-[#272738]/60 bg-[#100c1c]/90 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {/* Mobile open drawer button for mobile screens */}
              <button
                type="button"
                onClick={() => setIsMobileSidebarOpen(true)}
                className="lg:hidden p-1.5 rounded-[4px] text-gray-400 hover:text-white hover:bg-white/5"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="w-8 h-8 rounded-[6px] border border-[#272738] bg-[#161224] flex items-center justify-center text-purple-300 shrink-0">
                <ActiveIcon className="w-4 h-4" />
              </div>

              <div>
                <h1 className="text-base font-bold text-white tracking-tight leading-tight">
                  {currentMeta.title}
                </h1>
                <p className="text-[11px] text-gray-400 leading-tight mt-0.5">
                  {currentMeta.subtitle}
                </p>
              </div>
            </div>

            {/* Quick Back to Dashboard action button */}
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-[5px] bg-[#1a162b] hover:bg-[#251f3d] border border-purple-500/20 text-xs text-stone-300 hover:text-white transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Back to Dashboard</span>
            </button>
          </div>

          {/* Body Content Region */}
          <div className="p-5 sm:p-6 lg:p-7 max-w-5xl w-full">
            {activeTab === 'profile' && (
              <ProfileSettings
                user={currentUser}
                onUserUpdate={handleUserUpdate}
              />
            )}

            {activeTab === 'account' && (
              <AccountSettings
                user={currentUser}
                onUserUpdate={handleUserUpdate}
              />
            )}

            {activeTab === 'appearance' && (
              <div className="max-w-xl">
                <AppearanceSettings
                  theme={currentUser?.preferences?.theme || theme}
                  accentColor={currentUser?.preferences?.accentColor || 'purple'}
                  onThemeChange={async (newTheme) => {
                    if (newTheme === 'system') {
                      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                      setTheme(systemDark ? 'dark' : 'light');
                    } else {
                      setTheme(newTheme);
                    }
                    try {
                      await settingsService.updatePreferences({ theme: newTheme });
                      success(`Theme updated to ${newTheme}`);
                    } catch (err) {
                      console.warn(err);
                    }
                  }}
                  onAccentChange={async (color) => {
                    try {
                      await settingsService.updatePreferences({ accentColor: color });
                      success(`Accent color set to ${color}`);
                    } catch (err) {
                      console.warn(err);
                    }
                  }}
                />
              </div>
            )}

            {activeTab === 'editor' && <EditorSettings />}

            {activeTab === 'sync' && <SyncSettings />}

            {activeTab === 'storage' && <StorageSettings user={currentUser} />}

            {activeTab === 'notifications' && <NotificationSettings />}

            {activeTab === 'shortcuts' && <KeyboardShortcuts />}

            {activeTab === 'about' && <AboutSettings />}
          </div>
        </main>
      </div>

      {/* Upgrade to Pro Modal */}
      <UpgradeProModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
      />
    </div>
  );
};

export default SettingsPage;
