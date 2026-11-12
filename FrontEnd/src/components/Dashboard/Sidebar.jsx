import React, { useState } from 'react';
import {
  LayoutDashboard,
  FileText,
  Star,
  Folder,
  Tag,
  Trash2,
  Cloud,
  ChevronDown,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  X,
  Sparkles,
  Settings,
  HelpCircle
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import sidebarQuoteDark from '../../assets/dashboard/sidebar-quote-dark.png';
import sidebarQuoteLight from '../../assets/dashboard/sidebar-quote-light.png';
import websiteLogo from '../../assets/shared/logo/websiteLogo.png';

export const Sidebar = ({
  activeNav = 'dashboard',
  onSelectNav,
  folders = [],
  storage = { usedMb: 0.1, totalMb: 512, percentage: 0.1 },
  isCollapsed = false,
  onToggleCollapse,
  isMobileOpen = false,
  onCloseMobile
}) => {
  const [foldersExpanded, setFoldersExpanded] = useState(false);
  const { isDark } = useTheme();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'all-notes', label: 'All Notes', icon: FileText },
    { id: 'favorites', label: 'Favorites', icon: Star },
    {
      id: 'folders',
      label: 'Folders',
      icon: Folder,
      hasChildren: true,
      children: folders
    },
    { id: 'tags', label: 'Tags', icon: Tag },
    { id: 'trash', label: 'Trash', icon: Trash2 }
  ];

  const handleItemClick = (item) => {
    if (item.id === 'folders') {
      setFoldersExpanded(!foldersExpanded);
      if (onSelectNav) onSelectNav('folders');
    } else {
      if (onSelectNav) onSelectNav(item.id);
      if (onCloseMobile) onCloseMobile();
    }
  };

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-xs z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 flex flex-col justify-between bg-[#110d1c] border-r border-purple-500/15 text-[#f5f3f0] transition-all duration-300 ease-in-out select-none ${
          isCollapsed ? 'w-20' : 'w-64 sm:w-72 lg:w-[19%]'
        } ${
          isMobileOpen
            ? 'translate-x-0 shadow-2xl'
            : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Scrollable Navigation Region */}
        <div className="flex-1 overflow-y-auto px-4 py-5 scrollbar-thin">
          {/* Brand Header */}
          <div className="flex items-center justify-between mb-6 px-1">
            <div
              onClick={() => onSelectNav && onSelectNav('dashboard')}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="relative w-8 h-8 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <div className="absolute inset-0 rounded-full blur-xs bg-purple-500/30 pointer-events-none" />
                <img
                  src={websiteLogo}
                  alt="NoteNest Logo"
                  className="relative z-10 w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(168,85,247,0.4)]"
                />
              </div>
              {!isCollapsed && (
                <span className="font-serif font-bold text-xl tracking-tight text-white">
                  NoteNest
                </span>
              )}
            </div>

            {/* Desktop Collapse / Mobile Close Button */}
            <div className="flex items-center gap-1">
              {/* Desktop toggle collapse */}
              <button
                type="button"
                onClick={onToggleCollapse}
                title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                className="hidden lg:flex p-1.5 rounded-[3px] text-purple-300/60 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              >
                {isCollapsed ? (
                  <ChevronsRight className="w-4 h-4" />
                ) : (
                  <ChevronsLeft className="w-4 h-4" />
                )}
              </button>

              {/* Mobile close */}
              <button
                type="button"
                onClick={onCloseMobile}
                className="lg:hidden p-1.5 rounded-[3px] text-stone-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.id;

              return (
                <div key={item.id}>
                  <button
                    type="button"
                    onClick={() => handleItemClick(item)}
                    title={isCollapsed ? item.label : undefined}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-[3px] text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] border border-purple-400/40 text-white shadow-[0_0_14px_rgba(139,92,246,0.35)] font-semibold'
                        : 'text-stone-300 hover:text-white hover:bg-white/5 border border-transparent'
                    } ${isCollapsed ? 'justify-center px-2' : 'justify-between'}`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon
                        className={`w-4 h-4 shrink-0 ${
                          isActive ? 'text-white' : 'text-purple-300/70'
                        }`}
                      />
                      {!isCollapsed && (
                        <span className="truncate">{item.label}</span>
                      )}
                    </div>

                    {!isCollapsed && item.hasChildren && (
                      <span className="text-purple-300/60 text-xs">
                        {foldersExpanded ? (
                          <ChevronDown className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5" />
                        )}
                      </span>
                    )}
                  </button>

                  {/* Nested Folders Accordion */}
                  {!isCollapsed && item.hasChildren && foldersExpanded && (
                    <div className="ml-7 pl-3 my-1 border-l border-purple-500/20 space-y-1">
                      {folders.map((f) => (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() => {
                            if (onSelectNav) onSelectNav('folder-' + f.name);
                            if (onCloseMobile) onCloseMobile();
                          }}
                          className="w-full flex items-center justify-between py-1.5 px-2 rounded-[3px] text-xs text-stone-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                        >
                          <span className="truncate">{f.name}</span>
                          <span className="text-[11px] text-purple-300/50">
                            {f.count}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Storage Progress & Upgrade Card */}
        <div className="p-4 border-t border-purple-500/15 space-y-4">
          {/* Storage Meter */}
          {!isCollapsed ? (
            <div className="bg-[#181226]/80 border border-purple-500/20 rounded-[4px] p-3">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <div className="flex items-center gap-1.5 text-stone-200 font-medium">
                  <Cloud className="w-3.5 h-3.5 text-purple-400" />
                  <span>Storage</span>
                </div>
                <span className="text-purple-300 font-semibold text-[11px]">
                  {storage.percentage}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-1.5 rounded-[2px] bg-purple-950/60 overflow-hidden mb-1.5">
                <div
                  className="h-full rounded-[2px] bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-500"
                  style={{ width: `${Math.min(100, storage.percentage)}%` }}
                />
              </div>

              <p className="text-[11px] text-purple-300/70">
                {storage.usedMb < 1 ? '< 1 MB' : `${storage.usedMb} MB`} of 512 MB used
              </p>
            </div>
          ) : (
            <div
              className="flex justify-center p-2 rounded-[3px] bg-[#181226]/80 text-purple-400 border border-purple-500/20"
              title={`${storage.percentage}% storage used`}
            >
              <Cloud className="w-4 h-4" />
            </div>
          )}

          {!isCollapsed && (
            <img
              src={isDark ? sidebarQuoteDark : sidebarQuoteLight}
              alt=""
              aria-hidden="true"
              className="w-full h-auto object-contain"
            />
          )}

          {/* Sidebar Footer Icons */}
          <div className="flex items-center gap-2 pt-2 text-gray-400 select-none">
            <button
              type="button"
              onClick={() => onSelectNav?.('settings')}
              className={`p-1.5 rounded transition-colors cursor-pointer ${
                activeNav === 'settings'
                  ? 'text-purple-300 bg-purple-950/50 border border-purple-500/40 shadow-[0_0_8px_rgba(168,85,247,0.3)]'
                  : 'hover:text-white hover:bg-[#1e1e2d]'
              }`}
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onSelectNav?.('help')}
              className="p-1.5 rounded hover:text-white hover:bg-[#1e1e2d] transition-colors cursor-pointer"
              title="Help & Support"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
