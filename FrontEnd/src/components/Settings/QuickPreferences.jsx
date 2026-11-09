import React from 'react';
import { SlidersHorizontal, Cloud, RefreshCw, Folder, PanelLeft } from 'lucide-react';

export const QuickPreferences = ({
  preferences = {
    offlineMode: true,
    autoSync: true,
    showNoteCount: true,
    compactSidebar: false,
  },
  onToggle,
}) => {
  const items = [
    {
      key: 'offlineMode',
      label: 'Enable offline mode',
      description: 'Edit notes without an internet connection',
      icon: Cloud,
      checked: preferences.offlineMode ?? true,
    },
    {
      key: 'autoSync',
      label: 'Auto-sync',
      description: 'Sync changes in the background',
      icon: RefreshCw,
      checked: preferences.autoSync ?? true,
    },
    {
      key: 'showNoteCount',
      label: 'Show note count in folders',
      description: '',
      icon: Folder,
      checked: preferences.showNoteCount ?? true,
    },
    {
      key: 'compactSidebar',
      label: 'Compact sidebar',
      description: '',
      icon: PanelLeft,
      checked: preferences.compactSidebar ?? false,
    },
  ];

  return (
    <div className="rounded-[6px] border border-[#272738] bg-[#14141e] p-5 shadow-sm text-xs flex flex-col justify-between h-full">
      <div>
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <SlidersHorizontal className="w-4 h-4 text-purple-400" />
          <h3 className="text-sm font-bold text-white tracking-tight">Quick Preferences</h3>
        </div>

        {/* List of Toggles */}
        <div className="space-y-3.5">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.key}
                className="flex items-center justify-between gap-3 group"
              >
                <div className="flex items-start gap-2.5 min-w-0">
                  <Icon className="w-4 h-4 text-gray-400 shrink-0 mt-0.5 group-hover:text-purple-300 transition-colors" />
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-gray-200 truncate">
                      {item.label}
                    </p>
                    {item.description && (
                      <p className="text-[10.5px] text-gray-500 leading-tight">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Switch */}
                <button
                  type="button"
                  role="switch"
                  aria-checked={item.checked}
                  onClick={() => onToggle && onToggle(item.key, !item.checked)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    item.checked
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 shadow-[0_0_8px_rgba(168,85,247,0.3)]'
                      : 'bg-[#272738]'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                      item.checked ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
