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
          className="absolute inset-0 bg-[linear-gradient(110deg,rgba(24,12,39,0.9),rgba(14,9,25,0.88))] shadow-[0_0_30px_rgba(168,85,247,0.08)]"
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
              <stop offset="0%" stopColor="#e9b7ff" />
              <stop offset="45%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#d946ef" />
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
            <span className="relative flex h-8 w-8 items-center justify-center text-[#d98cff] transition-transform duration-200 group-hover:-rotate-12">
              <Pencil className="h-7 w-7 -rotate-[18deg] stroke-[1.8]" />
              <span className="absolute -bottom-0.5 left-1 h-px w-7 bg-gradient-to-r from-transparent via-[#c45aff] to-transparent shadow-[0_0_5px_#c45aff]" />
            </span>
            <span className="whitespace-nowrap text-[22px] font-bold tracking-tight text-white sm:text-[25px]">
              Note<span className="text-[#c05aff]">Nest</span>
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
                      ? 'border border-purple-400/70 bg-purple-600/25 text-white shadow-[0_0_18px_rgba(168,85,247,0.28),inset_0_0_12px_rgba(168,85,247,0.12)]'
                      : 'border border-transparent text-white/90 hover:border-purple-300/30 hover:bg-purple-400/10 hover:text-white'
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
              className="hidden h-10 w-10 items-center justify-center rounded-full border border-purple-500/30 bg-purple-500/10 text-white transition-all hover:border-purple-300/60 hover:bg-purple-500/20 hover:shadow-[0_0_18px_rgba(168,85,247,0.25)] xl:flex"
            >
              {isDark ? <Moon className="h-4 w-4 fill-current" /> : <Sun className="h-4 w-4" />}
            </button>

            {isAuthenticated ? (
              <>
                <Link
                  to="/notes"
                  className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg bg-gradient-to-r from-[#a855f7] to-[#9333ea] px-3 py-2 text-xs font-semibold text-white shadow-[0_0_16px_rgba(147,51,234,0.25)] transition-all hover:brightness-110 sm:text-sm"
                >
                  <span>My Notes</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <button
                  type="button"
                  onClick={() => openLogout()}
                  title="Log out"
                  aria-label="Log out"
                  className="hidden rounded-lg border border-purple-300/50 p-2 text-white transition-colors hover:bg-purple-500/15 sm:inline-flex"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => openLogin()}
                  className="hidden whitespace-nowrap rounded-lg border border-purple-300/70 px-3 py-2 text-xs font-medium text-white transition-all hover:bg-purple-500/15 sm:inline-flex sm:text-sm"
                >
                  Log In
                </button>
                <button
                  type="button"
                  onClick={() => openSignup()}
                  className="whitespace-nowrap rounded-lg bg-gradient-to-r from-[#c45aff] to-[#a43bf2] px-3.5 py-2 text-xs font-semibold text-[#190d25] shadow-[0_0_18px_rgba(192,90,255,0.25)] transition-all hover:brightness-110 sm:px-4 sm:text-sm"
                >
                  Sign Up
                </button>
              </>
            )}

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-xl border border-purple-300/30 p-2 text-white transition-colors hover:bg-purple-500/15 xl:hidden"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="mx-auto mt-3 max-w-[1280px] rounded-2xl border border-purple-500/30 bg-[#120d1f]/95 p-3 shadow-2xl backdrop-blur-md xl:hidden">
          <div className="mb-3 flex items-center">
            <button
              type="button"
              onClick={toggleTheme}
              className="inline-flex items-center gap-2 rounded-xl border border-purple-300/25 px-3 py-2 text-sm text-stone-200"
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
                    ? 'bg-purple-500/25 text-white'
                    : 'text-stone-300 hover:bg-white/5'
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
                  className="rounded-xl bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] px-3 py-2 text-center text-sm font-semibold text-white"
                >
                  My Notes
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openLogout();
                  }}
                  className="rounded-xl border border-white/15 px-3 py-2 text-sm text-stone-200"
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
                  className="rounded-xl border border-white/15 px-3 py-2 text-sm text-white"
                >
                  Log In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openSignup();
                  }}
                  className="rounded-xl bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] px-3 py-2 text-sm font-semibold text-white"
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
