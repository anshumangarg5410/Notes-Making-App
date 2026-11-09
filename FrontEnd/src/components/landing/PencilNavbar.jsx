import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Pencil, Menu, X, ArrowRight, LogOut, Moon, Sun } from 'lucide-react';
import { useAuthModal } from '../../context/AuthModalContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export const PencilNavbar = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { openLogin, openSignup, openLogout } = useAuthModal();
  const { isAuthenticated } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'features', 'about', 'contact'];
      const scrollPos = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (id) => {
    setActiveSection(id);
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'features', label: 'Features' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-40 w-full px-4 pb-2 pt-3 sm:px-6 lg:px-8">
      <div className="relative mx-auto max-w-[1280px]">
        <div
          className={`absolute inset-0 shadow-lg backdrop-blur-md ${
            isDark
              ? 'bg-[linear-gradient(110deg,rgba(14,19,31,0.96),rgba(9,13,22,0.94))] shadow-black/20'
              : 'bg-[linear-gradient(110deg,rgba(248,250,252,0.97),rgba(241,245,249,0.95))] shadow-slate-900/10'
          }`}
          style={{
            clipPath:
              'polygon(3.6% 1%, 96.4% 1%, 99.8% 50%, 96.4% 99%, 3.6% 99%, 0.2% 50%)',
          }}
        />
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
          viewBox="0 0 1000 100"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="landing-nav-stroke" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="#A5B4FC" />
              <stop offset="45%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#818CF8" />
            </linearGradient>
            <filter id="landing-nav-glow" x="-20%" y="-40%" width="140%" height="180%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <path
            d="M36 2 H964 L998 50 L964 98 H36 L2 50 Z"
            fill="none"
            stroke="url(#landing-nav-stroke)"
            strokeWidth="1.2"
            vectorEffect="non-scaling-stroke"
            filter="url(#landing-nav-glow)"
          />
        </svg>

        <div className="relative z-10 grid min-h-[72px] grid-cols-[1fr_auto] items-center gap-x-3 px-6 py-2 sm:px-8 xl:min-h-[82px] xl:grid-cols-[minmax(210px,1fr)_auto_minmax(270px,1fr)] xl:gap-5 xl:px-[4%]">
          <Link
            to="/"
            onClick={() => handleNavClick('home')}
            className="group flex w-fit items-center gap-2.5"
          >
            <span className={`relative flex h-8 w-8 items-center justify-center transition-transform duration-200 group-hover:-rotate-12 ${isDark ? 'text-indigo-300' : 'text-indigo-600'}`}>
              <Pencil className="h-7 w-7 -rotate-[18deg] stroke-[1.8]" />
              <span className="absolute -bottom-0.5 left-1 h-px w-7 bg-gradient-to-r from-transparent via-[#c45aff] to-transparent shadow-[0_0_5px_#c45aff]" />
            </span>
            <span className={`whitespace-nowrap text-[22px] font-bold tracking-tight sm:text-[25px] ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
            Note<span className={isDark ? 'text-indigo-300' : 'text-indigo-600'}>Nest</span>
            </span>
          </Link>

          <nav
            className="hidden items-center justify-center gap-3 xl:col-span-1 xl:col-start-2 xl:row-start-1 xl:flex 2xl:gap-5"
            aria-label="Main navigation"
          >
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;

              return (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => handleNavClick(link.id)}
                  aria-current={isActive ? 'location' : undefined}
                  className={`whitespace-nowrap rounded-xl px-2.5 py-2 text-xs font-medium transition-all duration-200 sm:px-3 sm:text-sm ${
                    isActive
                      ? `border border-indigo-400/60 bg-indigo-500/15 ${isDark ? 'text-indigo-100' : 'text-indigo-800'} shadow-sm`
                      : isDark
                        ? 'border border-transparent text-slate-300 hover:border-indigo-300/30 hover:bg-indigo-400/10 hover:text-white'
                        : 'border border-transparent text-slate-600 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-800'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          <div className="col-start-2 row-start-1 flex items-center justify-end gap-2 sm:gap-3 xl:col-start-3">
            <button
              type="button"
              onClick={toggleTheme}
              title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
              aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
              className={`hidden h-10 w-10 items-center justify-center rounded-full border transition-all xl:flex ${
                isDark
                  ? 'border-indigo-400/30 bg-indigo-500/10 text-indigo-200 hover:border-indigo-300/60 hover:bg-indigo-500/20'
                  : 'border-indigo-200 bg-white/70 text-indigo-700 hover:border-indigo-400 hover:bg-indigo-50'
              }`}
            >
              {isDark ? <Moon className="h-4 w-4 fill-current" /> : <Sun className="h-4 w-4" />}
            </button>

            {isAuthenticated ? (
              <>
                <Link
                  to="/notes"
                  className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-500 px-3 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-900/20 transition-all hover:brightness-110 sm:text-sm"
                >
                  <span>My Notes</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <button
                  type="button"
                  onClick={() => openLogout()}
                  title="Log out"
                  aria-label="Log out"
                  className={`hidden rounded-lg border p-2 transition-colors sm:inline-flex ${
                    isDark ? 'border-indigo-300/40 text-slate-100 hover:bg-indigo-500/15' : 'border-indigo-300 text-indigo-700 hover:bg-indigo-50'
                  }`}
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => openLogin()}
                  className={`hidden whitespace-nowrap rounded-lg border px-3 py-2 text-xs font-medium transition-all sm:inline-flex sm:text-sm ${
                    isDark ? 'border-indigo-300/50 text-slate-100 hover:bg-indigo-500/15' : 'border-indigo-300 text-indigo-700 hover:bg-indigo-50'
                  }`}
                >
                  Log In
                </button>
                <button
                  type="button"
                  onClick={() => openSignup()}
                  className="whitespace-nowrap rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-400 px-3.5 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-900/20 transition-all hover:brightness-110 sm:px-4 sm:text-sm"
                >
                  Sign Up
                </button>
              </>
            )}

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`rounded-xl border p-2 transition-colors xl:hidden ${
                isDark ? 'border-indigo-300/30 text-slate-100 hover:bg-indigo-500/15' : 'border-indigo-200 text-indigo-700 hover:bg-indigo-50'
              }`}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className={`mx-auto mt-3 max-w-[1280px] rounded-2xl border p-3 shadow-2xl backdrop-blur-md xl:hidden ${
          isDark ? 'border-indigo-400/30 bg-[#0E131F]/95' : 'border-slate-200 bg-[#F8FAFC]/95'
        }`}>
          <div className="mb-3 flex items-center">
            <button
              type="button"
              onClick={toggleTheme}
              className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm ${
                isDark ? 'border-indigo-300/25 text-slate-200' : 'border-indigo-200 text-indigo-700'
              }`}
            >
              {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              {isDark ? 'Dark mode' : 'Light mode'}
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => handleNavClick(link.id)}
                aria-current={activeSection === link.id ? 'location' : undefined}
                className={`rounded-lg px-3 py-2.5 text-left text-sm font-medium ${
                  activeSection === link.id
                    ? `bg-indigo-500/20 ${isDark ? 'text-indigo-100' : 'text-indigo-800'}`
                    : isDark
                      ? 'text-slate-300 hover:bg-white/5'
                      : 'text-slate-600 hover:bg-indigo-50'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 border-t border-purple-500/20 pt-3 sm:hidden">
            {isAuthenticated ? (
              <>
                <Link
                  to="/notes"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-3 py-2 text-center text-sm font-semibold text-white"
                >
                  My Notes
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openLogout();
                  }}
                  className={`rounded-xl border px-3 py-2 text-sm ${isDark ? 'border-white/15 text-slate-200' : 'border-slate-300 text-slate-700'}`}
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openLogin();
                  }}
                  className={`rounded-xl border px-3 py-2 text-sm ${isDark ? 'border-white/15 text-slate-100' : 'border-slate-300 text-indigo-700'}`}
                >
                  Log In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openSignup();
                  }}
                  className="rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-3 py-2 text-sm font-semibold text-white"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default PencilNavbar;
