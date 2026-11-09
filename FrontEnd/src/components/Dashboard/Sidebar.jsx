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
  BookOpen,
  X,
  Sparkles
} from 'lucide-react';
import upgradeProIcon from '../../assets/dashboard/upgrade-pro-icon-clean.png';

export const Sidebar = ({
  activeNav = 'dashboard',
  onSelectNav,
  folders = [],
  storage = { usedMb: 245, totalGb: 2, percentage: 12 },
  isCollapsed = false,
  onToggleCollapse,
  isMobileOpen = false,
  onCloseMobile,
  onOpenUpgradeModal
}) => {
  const [foldersExpanded, setFoldersExpanded] = useState(false);

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
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#8b5cf6] to-[#6d28d9] text-white flex items-center justify-center shadow-[0_0_14px_rgba(139,92,246,0.5)] group-hover:scale-105 transition-transform">
                <BookOpen className="w-4 h-4" />
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
                className="hidden lg:flex p-1.5 rounded-lg text-purple-300/60 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
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
                className="lg:hidden p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
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
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] text-white shadow-[0_0_18px_rgba(139,92,246,0.45)] font-semibold'
                        : 'text-stone-300 hover:text-white hover:bg-white/5'
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
                          className="w-full flex items-center justify-between py-1.5 px-2 rounded-lg text-xs text-stone-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
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
            <div className="bg-[#181226]/80 border border-purple-500/20 rounded-2xl p-3">
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
              <div className="w-full h-1.5 rounded-full bg-purple-950/60 overflow-hidden mb-1.5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-500"
                  style={{ width: `${Math.min(100, storage.percentage)}%` }}
                />
              </div>

              <p className="text-[11px] text-purple-300/70">
                {storage.usedMb} MB of {storage.totalGb} GB used
              </p>
            </div>
          ) : (
            <div
              className="flex justify-center p-2 rounded-xl bg-[#181226]/80 text-purple-400"
              title={`${storage.percentage}% storage used`}
            >
              <Cloud className="w-4 h-4" />
            </div>
          )}

          {/* Upgrade to Pro Card */}
          {!isCollapsed && (
            <div className="relative rounded-2xl p-4 bg-gradient-to-b from-[#1e1532] to-[#150f24] border border-purple-500/30 overflow-hidden shadow-lg group">
              {/* Subtle background ambient purple glow */}
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-purple-600/20 rounded-full blur-xl pointer-events-none" />

              {/* Document Illustration */}
              <div className="flex items-center justify-center mb-2.5">
                <img
                  src={upgradeProIcon}
                  alt="Upgrade to Pro"
                  className="w-16 h-auto object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Card Text */}
              <div className="text-center mb-3">
                <h4 className="text-xs sm:text-sm font-bold text-white flex items-center justify-center gap-1">
                  <span>Upgrade to Pro</span>
                  <Sparkles className="w-3 h-3 text-amber-400" />
                </h4>
                <p className="text-[11px] text-stone-300/80 mt-1 leading-snug">
                  Get more storage, sync across devices and more.
                </p>
              </div>

              {/* CTA Button */}
              <button
                type="button"
                onClick={onOpenUpgradeModal}
                className="w-full py-2 px-3 rounded-full text-xs font-semibold bg-gradient-to-r from-[#9333ea] to-[#7c3aed] hover:from-[#8b5cf6] hover:to-[#6d28d9] text-white shadow-[0_0_15px_rgba(147,51,234,0.4)] hover:shadow-[0_0_20px_rgba(147,51,234,0.6)] transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Upgrade Now</span>
                <span className="text-sm">→</span>
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

