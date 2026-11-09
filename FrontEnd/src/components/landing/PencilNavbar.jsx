import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Menu, X, ArrowRight, LogOut } from 'lucide-react';
import { useAuthModal } from '../../context/AuthModalContext';
import { useAuth } from '../../context/AuthContext';

export const PencilNavbar = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { openLogin, openSignup, openLogout } = useAuthModal();
  const { isAuthenticated } = useAuth();

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
    <header className="relative z-30 w-full px-4 pb-3 pt-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-3">
        <Link
          to="/"
          onClick={() => handleNavClick('home')}
          className="group flex shrink-0 items-center gap-2.5"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-purple-400/50 bg-[#1e1231]/90 text-purple-200 shadow-[0_0_18px_rgba(168,85,247,0.35)] transition-transform duration-200 group-hover:scale-105">
            <BookOpen className="h-4 w-4" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white sm:text-2xl">
            NoteNest
          </span>
        </Link>

        <nav
          className="hidden flex-1 items-center justify-center md:flex"
          role="navigation"
          aria-label="Main Navigation"
        >
          <div className="relative h-[78px] w-full max-w-[940px] shrink-0 select-none">
            <div
              className="absolute inset-0 rounded-[24px] border-[3px] border-[#a96d00] bg-[linear-gradient(180deg,#f3c45d_0%,#e7b449_17%,#d9a234_40%,#f2be58_72%,#d0972d_100%)] shadow-[0_14px_24px_rgba(0,0,0,0.55),inset_0_2px_0_rgba(255,255,255,0.35),inset_0_-6px_0_rgba(147,98,18,0.16)]"
              style={{
                backgroundImage:
                  'linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.03) 20%, rgba(0,0,0,0.08) 100%), repeating-linear-gradient(90deg, rgba(255,255,255,0.10) 0 2px, rgba(78,43,10,0.03) 2px 9px), linear-gradient(180deg, #f3c45d 0%, #e7b449 17%, #d9a234 40%, #f2be58 72%, #d0972d 100%)',
              }}
            />

            <div className="absolute left-[-18px] top-1/2 h-[90%] w-[52px] -translate-y-1/2 rounded-l-[26px] border-[3px] border-[#8d52ff] bg-[linear-gradient(90deg,#4b205d_0%,#7d4bc5_19%,#8a4ccc_40%,#9d5bd9_100%)] shadow-[inset_3px_0_8px_rgba(255,255,255,0.12),0_0_18px_rgba(128,67,189,0.5)] before:absolute before:inset-y-2 before:left-[-10px] before:w-8 before:rounded-l-[20px] before:bg-[#7b41ca] before:shadow-[inset_2px_0_8px_rgba(255,255,255,0.2)] before:content-[''] after:absolute after:-right-2 after:top-1/2 after:h-[34px] after:w-[10px] after:-translate-y-1/2 after:rounded-full after:bg-[#d59af0] after:shadow-[0_0_8px_rgba(255,255,255,0.35)]" />

            <div className="absolute right-[-16px] top-1/2 h-[95%] w-[46px] -translate-y-1/2 rounded-r-[24px] border-[3px] border-[#d67bbd] bg-[linear-gradient(90deg,#f9a0d2_0%,#d771b8_26%,#d566b4_100%)] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.25),0_0_20px_rgba(232,93,173,0.38)] before:absolute before:inset-y-[10px] before:left-1 before:right-1 before:rounded-[16px] before:bg-[linear-gradient(180deg,#f6b5dd_0%,#e387c8_18%,#df70b5_100%)] before:content-[''] after:absolute after:left-1/2 after:top-[10px] after:h-[22px] after:w-[22px] after:-translate-x-1/2 after:rounded-full after:border-2 after:border-[#c45bb0] after:bg-[radial-gradient(circle,#ffbddf_0%,#dc7bb9_50%,#b954a5_100%)] after:content-['']" />

            <div className="absolute inset-y-[7px] left-[18px] right-[22px] flex items-center overflow-hidden">
              {navLinks.map((link) => {
                const isActive = activeSection === link.id;

                return (
                  <button
                    key={link.id}
                    type="button"
                    onClick={() => handleNavClick(link.id)}
                    className={`relative z-10 flex h-full flex-1 items-center justify-center px-3 text-center font-[Georgia,serif] text-[15px] font-black uppercase tracking-[-0.06em] transition-all duration-200 ${
                      isActive
                        ? 'text-white'
                        : 'text-[#2f1c0b] hover:text-[#1c1008]'
                    }`}
                    style={{
                      textShadow: isActive
                        ? '0 2px 0 rgba(0,0,0,0.2), 0 0 12px rgba(164,110,255,0.35)'
                        : '0 1px 0 rgba(255,255,255,0.25)',
                    }}
                  >
                    <span
                      className={`inline-flex items-center justify-center rounded-[18px] px-5 py-1.5 shadow-[inset_0_2px_0_rgba(255,255,255,0.2),inset_0_-6px_10px_rgba(0,0,0,0.18)] transition-all duration-200 ${
                        isActive
                          ? 'bg-[linear-gradient(180deg,#7b44b4_0%,#5b2c7c_100%)] ring-2 ring-[#d19aff]/80'
                          : 'bg-transparent'
                      }`}
                    >
                      {link.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </nav>

        <div className="flex shrink-0 items-center gap-2.5 sm:gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link
                to="/notes"
                className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] px-4 py-2 text-xs font-semibold text-white shadow-[0_0_16px_rgba(147,51,234,0.35)] transition-transform hover:scale-[1.02] sm:text-sm"
              >
                <span>My Notes</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <button
                type="button"
                onClick={() => openLogout()}
                title="Log out"
                className="rounded-xl border border-white/15 p-2 text-stone-300 transition-colors hover:border-white/35 hover:text-white"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={() => openLogin()}
                className="rounded-xl border border-white/20 bg-white/3 px-4 py-2 text-xs font-medium text-white transition-colors hover:border-white/40 hover:bg-white/8 sm:text-sm"
              >
                Log In
              </button>
              <button
                type="button"
                onClick={() => openSignup()}
                className="rounded-xl bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] px-5 py-2 text-xs font-semibold text-white shadow-[0_0_18px_rgba(147,51,234,0.35)] transition-transform hover:scale-[1.02] sm:text-sm"
              >
                Sign Up
              </button>
            </>
          )}

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-xl border border-white/15 p-2 text-stone-300 transition-colors hover:border-white/35 hover:text-white md:hidden"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="mx-auto mt-3 max-w-7xl rounded-2xl border border-purple-500/30 bg-[#120d1f]/90 p-4 shadow-2xl backdrop-blur-md md:hidden">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => handleNavClick(link.id)}
                className={`rounded-xl px-3.5 py-2 text-left text-sm font-medium transition-colors ${
                  activeSection === link.id
                    ? 'bg-purple-900/40 text-purple-100'
                    : 'text-stone-200 hover:bg-white/5'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 border-t border-purple-500/20 pt-3">
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
