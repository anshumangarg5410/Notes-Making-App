import React from 'react';
import {
  User,
  ShieldCheck,
  Monitor,
  Edit3,
  RefreshCw,
  Layers,
  Bell,
  Keyboard,
  Info
} from 'lucide-react';

export const SettingsNavigation = ({
  activeTab = 'profile',
  onSelectTab
}) => {
  const categories = [
    {
      id: 'profile',
      label: 'Profile',
      sublabel: 'Your account and profile',
      icon: User
    },
    {
      id: 'account',
      label: 'Account',
      sublabel: 'Security, email and password',
      icon: ShieldCheck
    },
    {
      id: 'appearance',
      label: 'Appearance',
      sublabel: 'Theme, font and editor style',
      icon: Monitor
    },
    {
      id: 'editor',
      label: 'Editor',
      sublabel: 'Writing, markdown and code',
      icon: Edit3
    },
    {
      id: 'sync',
      label: 'Sync & Backup',
      sublabel: 'Offline mode and data sync',
      icon: RefreshCw
    },
    {
      id: 'storage',
      label: 'Storage',
      sublabel: 'Usage and plan details',
      icon: Layers
    },
    {
      id: 'notifications',
      label: 'Notifications',
      sublabel: 'Alerts and activity updates',
      icon: Bell
    },
    {
      id: 'shortcuts',
      label: 'Shortcuts',
      sublabel: 'Keyboard shortcuts',
      icon: Keyboard
    },
    {
      id: 'about',
      label: 'About',
      sublabel: 'App version and links',
      icon: Info
    }
  ];

  return (
    <aside className="w-64 min-w-[240px] max-w-[280px] h-full bg-[#13131b] border-r border-[#222230] flex flex-col select-none text-xs">
      {/* Header */}
      <div className="p-4 border-b border-[#20202e]">
        <h2 className="text-sm font-bold text-white tracking-tight">Settings</h2>
        <p className="text-[11px] text-gray-400 mt-0.5">
          Manage your account, preferences and NoteNest
        </p>
      </div>

      {/* Categories Navigation */}
      <div className="flex-1 overflow-y-auto obsidian-scrollbar p-2 space-y-1">
        {categories.map((cat) => {
          const isActive = activeTab === cat.id;
          const Icon = cat.icon;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectTab(cat.id)}
              className={`w-full text-left p-2.5 rounded-[4px] flex items-start gap-3 transition-colors ${
                isActive
                  ? 'bg-gradient-to-r from-purple-900/60 to-purple-800/30 text-white border border-purple-500/40 shadow-sm'
                  : 'text-gray-300 hover:text-white hover:bg-[#1a1a24] border border-transparent'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-[3px] flex items-center justify-center shrink-0 mt-0.5 ${
                  isActive ? 'text-purple-300' : 'text-gray-400'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>

              <div className="min-w-0">
                <div
                  className={`font-semibold text-xs truncate ${
                    isActive ? 'text-white' : 'text-gray-200'
                  }`}
                >
                  {cat.label}
                </div>
                <div className="text-[10px] text-gray-400 truncate mt-0.5">
                  {cat.sublabel}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
};

