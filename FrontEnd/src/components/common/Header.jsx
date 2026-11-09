import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sun,
  Moon,
  Columns,
  Menu,
  Bell,
  LogOut,
  Settings,
  ChevronDown,
  Home,
  Plus
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useAuthModal } from '../../context/AuthModalContext';

export const Header = ({ onToggleSidebar, onOpenSettings, onToggleFocusMode, isFocusMode, onNewNote }) => {
  const { toggleTheme, isDark } = useTheme();
  const { user, logout } = useAuth();
  const { openLogout } = useAuthModal();
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

  const userDisplayName = user?.name
    ? user.name.split(' ')[0]
    : 'User';

  return (
    <header className="h-13 border-b border-warm-border dark:border-charcoal-800 bg-white/80 dark:bg-charcoal-900 px-4 flex items-center justify-between select-none">
      <div className="flex items-center space-x-3">
        {/* Mobile menu trigger */}
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl text-charcoal-600 dark:text-cream-200 hover:bg-cream-200/60 dark:hover:bg-charcoal-800 transition-colors md:hidden"
          title="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Home navigation link */}
        <Link
          to="/"
          className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-charcoal-600 dark:text-cream-200 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-cream-200/60 dark:hover:bg-charcoal-800 transition-colors"
          title="Back to Home Landing Page"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>

        {/* Current breadcrumb or status */}
        <div className="hidden sm:flex items-center space-x-2 text-xs text-charcoal-400 dark:text-charcoal-500 font-medium">
          <span className="text-charcoal-300 dark:text-charcoal-600">/</span>
          <span className="w-2 h-2 rounded-full bg-orange-500 shadow-xs shadow-orange-500/50" />
          <span>Notes Workspace</span>
        </div>
      </div>

      {/* Top Right Utility Icons matching mockup */}
      <div className="flex items-center space-x-1 sm:space-x-2">
        {/* Quick Add Note Button */}
        {onNewNote && (
          <button
            onClick={onNewNote}
            className="hidden sm:inline-flex items-center space-x-1.5 py-1.5 px-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl font-medium text-xs shadow-xs hover:shadow-orange-500/20 transition-all duration-150 active:scale-95 mr-1"
            title="Create New Note"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Note</span>
          </button>
        )}

        {/* Theme Toggle (Sun / Moon) */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-charcoal-600 dark:text-charcoal-300 hover:text-orange-500 dark:hover:text-orange-400 hover:bg-cream-200/60 dark:hover:bg-charcoal-800 transition-colors"
          title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notification Bell with Badge */}
        <button
          className="p-2 rounded-xl text-charcoal-600 dark:text-charcoal-300 hover:text-orange-500 dark:hover:text-orange-400 hover:bg-cream-200/60 dark:hover:bg-charcoal-800 transition-colors relative"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-orange-500 ring-2 ring-white dark:ring-charcoal-900" />
        </button>

        {/* Focus Mode / Panel toggle */}
        <button
          onClick={onToggleFocusMode}
          className={`p-2 rounded-xl transition-colors ${
            isFocusMode
              ? 'text-orange-500 bg-orange-50 dark:bg-orange-950/40'
              : 'text-charcoal-600 dark:text-charcoal-300 hover:text-orange-500 hover:bg-cream-200/60 dark:hover:bg-charcoal-800'
          }`}
          title="Distraction-Free Focus Mode"
        >
          <Columns className="w-4 h-4" />
        </button>

        {/* User Profile Menu */}
        <div className="relative ml-1 sm:ml-2" ref={dropdownRef}>
          <button
            onClick={() => setProfileOpen((prev) => !prev)}
            aria-expanded={profileOpen}
            aria-label="User account menu"
            className="flex items-center space-x-2 p-1.5 pl-2 rounded-xl hover:bg-cream-200/60 dark:hover:bg-charcoal-800 transition-colors focus:outline-none focus:ring-1 focus:ring-orange-500/50"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-teal-600 to-cyan-700 text-white font-semibold text-xs flex items-center justify-center shadow-xs">
              {initials}
            </div>
            <span className="hidden lg:inline text-xs font-medium text-charcoal-700 dark:text-cream-100 max-w-[100px] truncate">
              {userDisplayName}
            </span>
            <ChevronDown className={`w-3.5 h-3.5 text-charcoal-400 transition-transform duration-150 ${profileOpen ? 'rotate-180' : ''}`} />
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-11 w-56 bg-white dark:bg-charcoal-800 border border-warm-border dark:border-charcoal-700 rounded-2xl shadow-dropdown z-40 py-2 text-xs text-charcoal-700 dark:text-cream-200 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-4 py-2 border-b border-warm-border/60 dark:border-charcoal-700">
                <p className="font-semibold text-sm text-charcoal-900 dark:text-cream-50 truncate">
                  {user?.name || 'User'}
                </p>
                <p className="text-charcoal-400 dark:text-charcoal-500 text-[11px] truncate">
                  {user?.email || 'user@notely.app'}
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

                <div className="my-1 border-t border-warm-border/60 dark:border-charcoal-700" />

                <button
                  onClick={() => {
                    setProfileOpen(false);
                    openLogout();
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 dark:text-red-400 flex items-center space-x-2.5 transition-colors cursor-pointer"
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
