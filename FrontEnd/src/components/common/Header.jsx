import React, { useState, useRef, useEffect } from 'react';
import {
  Sun,
  Moon,
  Palette,
  Columns,
  Menu,
  User as UserIcon,
  LogOut,
  Settings,
  ChevronDown
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

export const Header = ({ onToggleSidebar, onOpenSettings, onToggleFocusMode, isFocusMode }) => {
  const { theme, toggleTheme, isDark } = useTheme();
  const { user, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    if (profileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [profileOpen]);

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2)
    : 'U';

  return (
    <header className="h-14 border-b border-warm-border dark:border-charcoal-800 bg-warm-bg dark:bg-charcoal-900 px-4 flex items-center justify-between select-none">
      <div className="flex items-center space-x-3">
        {/* Mobile menu trigger */}
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl text-charcoal-600 dark:text-cream-200 hover:bg-cream-200/60 dark:hover:bg-charcoal-800 transition-colors md:hidden"
          title="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Current breadcrumb or status */}
        <div className="hidden sm:flex items-center space-x-2 text-xs text-charcoal-400 dark:text-charcoal-500 font-medium">
          <span className="w-2 h-2 rounded-full bg-terracotta-500" />
          <span>Workspace</span>
        </div>
      </div>

      {/* Top Right Utility Icons (matching screenshot top-right) */}
      <div className="flex items-center space-x-1.5">
        {/* Theme Toggle (Sun / Moon) */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-charcoal-600 dark:text-charcoal-300 hover:text-terracotta-500 dark:hover:text-terracotta-400 hover:bg-cream-200/60 dark:hover:bg-charcoal-800 transition-colors"
          title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Focus Mode / Panel toggle */}
        <button
          onClick={onToggleFocusMode}
          className={`p-2 rounded-xl transition-colors ${
            isFocusMode
              ? 'text-terracotta-500 bg-terracotta-100/60 dark:bg-terracotta-900/40'
              : 'text-charcoal-600 dark:text-charcoal-300 hover:text-terracotta-500 hover:bg-cream-200/60 dark:hover:bg-charcoal-800'
          }`}
          title="Distraction-Free Focus Mode"
        >
          <Columns className="w-4 h-4" />
        </button>

        {/* User Profile Menu */}
        <div className="relative ml-2" ref={dropdownRef}>
          <button
            onClick={() => setProfileOpen((prev) => !prev)}
            className="flex items-center space-x-2 p-1.5 pl-2 rounded-xl hover:bg-cream-200/60 dark:hover:bg-charcoal-800 transition-colors"
          >
            <div className="w-7 h-7 rounded-lg bg-terracotta-500 text-white font-semibold text-xs flex items-center justify-center shadow-xs">
              {initials}
            </div>
            <span className="hidden lg:inline text-xs font-medium text-charcoal-700 dark:text-cream-100 max-w-[100px] truncate">
              {user?.name || 'User'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-charcoal-400" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-11 w-56 bg-warm-card dark:bg-charcoal-800 border border-warm-border dark:border-charcoal-700 rounded-2xl shadow-dropdown z-40 py-2 text-xs text-charcoal-700 dark:text-cream-200 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-4 py-2 border-b border-warm-border dark:border-charcoal-700">
                <p className="font-semibold text-sm text-charcoal-900 dark:text-cream-50 truncate">
                  {user?.name}
                </p>
                <p className="text-charcoal-400 dark:text-charcoal-500 text-[11px] truncate">
                  {user?.email}
                </p>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    onOpenSettings();
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-cream-100 dark:hover:bg-charcoal-700 flex items-center space-x-2.5 transition-colors"
                >
                  <Settings className="w-4 h-4 text-charcoal-500" />
                  <span>Profile & Settings</span>
                </button>

                <div className="my-1 border-t border-warm-border dark:border-charcoal-700" />

                <button
                  onClick={() => {
                    setProfileOpen(false);
                    logout();
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 dark:text-red-400 flex items-center space-x-2.5 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
