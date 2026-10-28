import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Feather,
  Plus,
  Sun,
  Moon,
  Menu,
  X,
  FileText,
  Home,
  Sparkles,
  LogOut,
  User as UserIcon,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleAddNote = () => {
    if (isAuthenticated) {
      navigate('/notes?action=new');
    } else {
      navigate('/login', { state: { from: { pathname: '/notes', search: '?action=new' } } });
    }
    setMobileMenuOpen(false);
  };

  const handleFeaturesClick = (e) => {
    if (location.pathname === '/') {
      e.preventDefault();
      const el = document.getElementById('features');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setMobileMenuOpen(false);
  };

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2)
    : 'U';

  const isCurrent = (path) => location.pathname === path;

  // Dynamic user display name fallback
  const userDisplayName = user?.name
    ? user.name.split(' ')[0]
    : 'User';

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-warm-bg/90 dark:bg-charcoal-900/90 border-b border-warm-border dark:border-charcoal-800 transition-colors select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <Link
          to="/"
          className="flex items-center space-x-2.5 group focus:outline-none"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform duration-200">
            <Feather className="w-5 h-5 transform -rotate-12" />
          </div>
          <div>
            <span className="font-serif font-bold text-xl tracking-tight text-charcoal-900 dark:text-cream-50">
              Notely
            </span>
            <span className="hidden sm:inline-block ml-2 text-[10px] font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-full border border-indigo-100 dark:border-indigo-900/40">
              Notes
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          <Link
            to="/"
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center space-x-1.5 ${
              isCurrent('/')
                ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/80 dark:bg-indigo-950/40 font-bold'
                : 'text-charcoal-600 dark:text-charcoal-300 hover:text-charcoal-900 dark:hover:text-cream-50 hover:bg-cream-100/60 dark:hover:bg-charcoal-800'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>

          <Link
            to="/notes"
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center space-x-1.5 ${
              isCurrent('/notes')
                ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/80 dark:bg-indigo-950/40 font-bold'
                : 'text-charcoal-600 dark:text-charcoal-300 hover:text-charcoal-900 dark:hover:text-cream-50 hover:bg-cream-100/60 dark:hover:bg-charcoal-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>My Notes</span>
          </Link>

          <a
            href="/#features"
            onClick={handleFeaturesClick}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-charcoal-600 dark:text-charcoal-300 hover:text-charcoal-900 dark:hover:text-cream-50 hover:bg-cream-100/60 dark:hover:bg-charcoal-800 transition-colors flex items-center space-x-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Features</span>
          </a>
        </nav>

        {/* Right Actions */}
        <div className="hidden md:flex items-center space-x-2.5">
          {/* Add Note Button */}
          <button
            onClick={handleAddNote}
            id="nav-add-note-btn"
            className="py-2 px-3.5 bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white rounded-xl font-medium text-xs flex items-center space-x-1.5 shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all duration-200 active:scale-[0.98] group"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5] group-hover:rotate-90 transition-transform duration-200" />
            <span>Add Note</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-charcoal-600 dark:text-charcoal-300 hover:text-indigo-500 dark:hover:text-indigo-400 hover:bg-cream-100 dark:hover:bg-charcoal-800 transition-colors"
            title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            aria-label="Toggle Theme"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* User Auth Info or Login/Register */}
          {isAuthenticated ? (
            <div className="flex items-center pl-2 space-x-2 border-l border-warm-border dark:border-charcoal-800">
              <Link
                to="/notes"
                className="flex items-center space-x-2 py-1 px-2 rounded-xl hover:bg-cream-100 dark:hover:bg-charcoal-800 transition-colors"
                title="Go to Notes Workspace"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-white font-semibold text-xs flex items-center justify-center shadow-xs">
                  {initials}
                </div>
                <span className="text-xs font-medium text-charcoal-800 dark:text-cream-100 max-w-[90px] truncate">
                  {user?.name || 'My Notes'}
                </span>
              </Link>
              <button
                onClick={logout}
                className="p-2 rounded-xl text-charcoal-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2 pl-2 border-l border-warm-border dark:border-charcoal-800">
              <Link
                to="/login"
                className="px-3.5 py-2 text-xs font-medium text-charcoal-700 dark:text-cream-100 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-3.5 py-2 bg-charcoal-900 dark:bg-cream-50 text-white dark:text-charcoal-950 hover:bg-charcoal-800 dark:hover:bg-cream-100 text-xs font-semibold rounded-xl shadow-xs transition-colors"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center space-x-2 md:hidden">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-charcoal-600 dark:text-charcoal-300 hover:bg-cream-100 dark:hover:bg-charcoal-800 transition-colors"
            aria-label="Toggle Theme"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="p-2 rounded-xl text-charcoal-700 dark:text-cream-100 hover:bg-cream-100 dark:hover:bg-charcoal-800 transition-colors"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-warm-border dark:border-charcoal-800 bg-warm-bg dark:bg-charcoal-900 px-4 pt-3 pb-5 space-y-3 shadow-lg animate-in slide-in-from-top-2 duration-150">
          <nav className="space-y-1">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-2.5 px-3 py-2 rounded-xl text-sm font-medium text-charcoal-800 dark:text-cream-100 hover:bg-cream-100 dark:hover:bg-charcoal-800"
            >
              <Home className="w-4 h-4 text-indigo-500" />
              <span>Home</span>
            </Link>
            <Link
              to="/notes"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-2.5 px-3 py-2 rounded-xl text-sm font-medium text-charcoal-800 dark:text-cream-100 hover:bg-cream-100 dark:hover:bg-charcoal-800"
            >
              <FileText className="w-4 h-4 text-indigo-500" />
              <span>My Notes</span>
            </Link>
            <a
              href="/#features"
              onClick={handleFeaturesClick}
              className="flex items-center space-x-2.5 px-3 py-2 rounded-xl text-sm font-medium text-charcoal-800 dark:text-cream-100 hover:bg-cream-100 dark:hover:bg-charcoal-800"
            >
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <span>Features</span>
            </a>
          </nav>

          <div className="pt-2 border-t border-warm-border dark:border-charcoal-800 space-y-2">
            <button
              onClick={handleAddNote}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-indigo-500 to-violet-600 text-white rounded-xl text-sm font-medium flex items-center justify-center space-x-2 shadow-md shadow-indigo-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>Add Note</span>
            </button>

            {isAuthenticated ? (
              <div className="flex items-center justify-between pt-2 px-1">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-500 text-white font-semibold text-xs flex items-center justify-center">
                    {initials}
                  </div>
                  <span className="text-xs font-medium text-charcoal-700 dark:text-cream-200">
                    {user?.name}
                  </span>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs font-semibold text-red-600 dark:text-red-400 hover:underline flex items-center space-x-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 text-center text-xs font-semibold border border-warm-border dark:border-charcoal-700 rounded-xl text-charcoal-700 dark:text-cream-200"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 text-center text-xs font-semibold bg-charcoal-900 dark:bg-cream-50 text-white dark:text-charcoal-950 rounded-xl"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
