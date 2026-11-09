import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  ChevronDown,
  User,
  Settings,
  LogOut,
  Menu,
  CheckCircle2,
  X,
  FileText
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAuthModal } from '../../context/AuthModalContext';

export const Topbar = ({
  searchQuery = '',
  onSearchChange,
  onSelectSearchResult,
  notes = [],
  onOpenSettings,
  onToggleMobileSidebar
}) => {
  const { user } = useAuth();
  const { openLogout } = useAuthModal();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const searchInputRef = useRef(null);
  const profileRef = useRef(null);
  const notifRef = useRef(null);

  // Keyboard shortcut Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Click outside listener for dropdowns
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute initials and name
  const displayName = user?.name || 'Anshuman Garg';
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);

  // Filtered search results
  const searchResults = searchQuery.trim()
    ? notes.filter(
        (n) =>
          n.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          n.plainText?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (Array.isArray(n.tags) &&
            n.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())))
      ).slice(0, 5)
    : [];

  return (
    <header className="h-16 px-4 sm:px-6 lg:px-8 border-b border-purple-500/15 bg-[#110d1c]/90 backdrop-blur-md flex items-center justify-between gap-4 select-none z-30 sticky top-0">
      {/* Left Area: Mobile Menu Trigger + Search Bar */}
      <div className="flex items-center gap-3 flex-1 max-w-2xl">
        {/* Mobile menu trigger */}
        <button
          type="button"
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 rounded-xl text-stone-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          title="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar */}
        <div className="relative flex-1">
          <div className="relative">
            <Search className="w-4 h-4 text-purple-300/60 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search your notes, folders, or tags..."
              value={searchQuery}
              onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
              className="w-full pl-10 pr-16 py-2 rounded-xl text-xs sm:text-sm bg-[#1b1528] border border-purple-500/25 text-white placeholder-purple-300/40 outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400/40 transition-all shadow-inner"
            />
            {/* Keyboard shortcut badge */}
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none">
              <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono bg-purple-900/50 border border-purple-500/30 text-purple-200">
                ⌘ K
              </kbd>
            </div>
          </div>

          {/* Quick Search Dropdown Preview */}
          {searchFocused && searchQuery.trim() && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-[#181226] border border-purple-500/30 rounded-2xl p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="text-[11px] font-semibold text-purple-300/70 px-3 py-1.5 uppercase tracking-wider">
                Search Results ({searchResults.length})
              </div>
              {searchResults.length > 0 ? (
                <div className="space-y-1">
                  {searchResults.map((note) => (
                    <button
                      key={note._id}
                      type="button"
                      onClick={() => onSelectSearchResult && onSelectSearchResult(note)}
                      className="w-full flex items-center gap-2.5 p-2 rounded-xl text-left hover:bg-white/5 transition-colors cursor-pointer group"
                    >
                      <div className="w-6 h-6 rounded-lg bg-purple-950 border border-purple-500/30 flex items-center justify-center text-purple-300 group-hover:bg-purple-800 transition-colors">
                        <FileText className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-white truncate">
                          {note.title || 'Untitled Note'}
                        </p>
                        <p className="text-[11px] text-stone-400 truncate">
                          {note.plainText || 'No content preview'}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-stone-400 px-3 py-3 text-center">
                  No notes found matching "{searchQuery}"
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right Area: Notifications + User Profile */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            title="Notifications"
            className="p-2 rounded-xl text-stone-300 hover:text-white hover:bg-white/5 transition-colors relative cursor-pointer"
          >
            <Bell className="w-5 h-5" />
            {/* Notification Badge Dot */}
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.8)]" />
          </button>

          {/* Notifications Dropdown Drawer */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl bg-[#191326] border border-purple-500/30 p-3 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-purple-500/20 px-1">
                <span className="text-xs font-bold text-white">Notifications</span>
                <span className="text-[10px] text-purple-300/70">2 new</span>
              </div>
              <div className="space-y-2 mt-2">
                <div className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-500/20 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <p className="font-semibold text-white">Cloud Sync Complete</p>
                    <p className="text-[11px] text-stone-300/70">All 48 notes are synced safely.</p>
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-[#211933]/60 border border-purple-500/20 flex items-start gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-purple-400 mt-1 shrink-0" />
                  <div className="text-xs">
                    <p className="font-semibold text-white">Welcome to NoteNest!</p>
                    <p className="text-[11px] text-stone-300/70">Start capturing your thoughts anytime.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Pill & Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 p-1.5 pr-2.5 rounded-full hover:bg-white/5 border border-purple-500/20 transition-all cursor-pointer group"
          >
            {/* Avatar Initials Circle with Purple Gradient */}
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#9333ea] to-[#c084fc] text-white text-xs font-bold flex items-center justify-center shadow-[0_0_10px_rgba(147,51,234,0.5)]">
              {initials}
            </div>

            {/* Display Name */}
            <span className="hidden sm:inline-block text-xs font-medium text-stone-200 group-hover:text-white transition-colors">
              {displayName}
            </span>

            {/* Chevron Arrow */}
            <ChevronDown className="w-3.5 h-3.5 text-purple-300/70 group-hover:text-white transition-colors" />
          </button>

          {/* Profile Menu Dropdown */}
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-[#191326] border border-purple-500/30 p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-2 border-b border-purple-500/20 mb-1">
                <p className="text-xs font-bold text-white truncate">{displayName}</p>
                <p className="text-[11px] text-stone-400 truncate">{user?.email || 'anshuman@example.com'}</p>
              </div>

              <div className="space-y-0.5">
                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);
                    if (onOpenSettings) onOpenSettings();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-stone-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer text-left"
                >
                  <User className="w-3.5 h-3.5 text-purple-400" />
                  <span>Profile</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);
                    if (onOpenSettings) onOpenSettings();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-stone-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer text-left"
                >
                  <Settings className="w-3.5 h-3.5 text-purple-400" />
                  <span>Settings</span>
                </button>

                <div className="border-t border-purple-500/20 my-1" />

                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);
                    openLogout();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors cursor-pointer text-left"
                >
                  <LogOut className="w-3.5 h-3.5 text-red-400" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;

