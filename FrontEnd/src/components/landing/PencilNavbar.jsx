import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Menu, X, ArrowRight, LogOut } from 'lucide-react';
import { useAuthModal } from '../../context/AuthModalContext';
import { useAuth } from '../../context/AuthContext';
import pencilTip from '../../assets/landing/pencil-tip-realistic.png';
import pencilShaft from '../../assets/landing/pencil-shaft-realistic.png';
import pencilEraser from '../../assets/landing/pencil-eraser-realistic.png';

export const PencilNavbar = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { openLogin, openSignup, openLogout } = useAuthModal();
  const { isAuthenticated, user } = useAuth();

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
    <header className="w-full pt-4 pb-2 px-4 sm:px-6 lg:px-8 relative z-30 select-none bg-transparent">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">

        {/* 1. Left: NoteNest Logo & Wordmark */}
        <Link
          to="/"
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-2.5 group cursor-pointer shrink-0"
        >
          {/* Open Book Logo inside glowing purple badge */}
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#25173e]/90 border border-purple-500/50 text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.4)] transition-transform group-hover:scale-105">
            <BookOpen className="w-4 h-4" />
          </div>

          {/* NoteNest Wordmark */}
          <span className="text-xl sm:text-2xl font-bold tracking-tight text-white font-serif">
            NoteNest
          </span>
        </Link>

        {/* 2. Center: The Realistic Golden Wooden Pencil Navigation Bar (Desktop & Tablet) */}
        <nav
          className="hidden md:flex items-center justify-center flex-1 max-w-2xl mx-2 lg:mx-6"
          role="navigation"
          aria-label="Main Navigation"
        >
          <div className="relative flex items-center w-full filter drop-shadow-[0_6px_16px_rgba(0,0,0,0.65)]">

            {/* Left: Realistic Sharpened Graphite Tip & Wood Cone */}
            <div className="shrink-0 h-10 sm:h-11 flex items-center pointer-events-none">
              <img
                src={pencilTip}
                alt=""
                className="h-full w-auto object-contain select-none"
                loading="eager"
              />
            </div>

            {/* Center: Golden Wooden Shaft with Facet Highlight & Integrated Links */}
            <div
              className="flex-1 h-10 sm:h-11 flex items-center justify-around px-2 sm:px-5 relative z-10 -ml-[1px] -mr-[1px]"
              style={{
                backgroundImage: `url(${pencilShaft})`,
                backgroundRepeat: 'repeat-x',
                backgroundSize: 'auto 100%',
                backgroundPosition: 'left center'
              }}
            >
              {navLinks.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => handleNavClick(link.id)}
                    className={`relative z-20 text-xs sm:text-[13px] font-semibold px-3 sm:px-4 py-1 rounded-full transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-[#2b1a45] text-white shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.7),0_1px_1px_rgba(255,255,255,0.2)] font-bold scale-105'
                        : 'text-[#35210c] hover:text-black hover:bg-amber-400/25'
                    }`}
                  >
                    {link.label}
                  </button>
                );
              })}
            </div>

            {/* Right: Purple Metallic Crimped Ferrule & Pink Rubber Eraser */}
            <div className="shrink-0 h-10 sm:h-11 flex items-center pointer-events-none">
              <img
                src={pencilEraser}
                alt=""
                className="h-full w-auto object-contain select-none"
                loading="eager"
              />
            </div>

          </div>
        </nav>

        {/* 3. Right: Authentication Buttons (Log In & Sign Up) */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link
                to="/notes"
                className="px-4 sm:px-5 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-[#9333ea] to-[#7c3aed] text-white shadow-[0_0_16px_rgba(147,51,234,0.5)] text-xs sm:text-sm font-semibold transition-all hover:scale-102 flex items-center gap-1.5"
              >
                <span>My Notes</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <button
                type="button"
                onClick={() => openLogout()}
                title="Log out"
                className="p-2 rounded-full border border-white/20 hover:border-white/40 text-stone-300 hover:text-white transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              {/* Log In Button: Opens Notebook Login Modal */}
              <button
                type="button"
                onClick={() => openLogin()}
                className="px-4 sm:px-5 py-1.5 sm:py-2 rounded-full border border-white/25 hover:border-white/50 text-white hover:bg-white/5 text-xs sm:text-sm font-medium transition-all cursor-pointer"
              >
                Log In
              </button>

              {/* Sign Up Button: Opens Notebook Sign Up Modal */}
              <button
                type="button"
                onClick={() => openSignup()}
                className="px-5 sm:px-6 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-[#9333ea] to-[#7c3aed] text-white hover:from-[#8b5cf6] hover:to-[#6d28d9] shadow-[0_0_16px_rgba(147,51,234,0.5)] hover:shadow-[0_0_22px_rgba(147,51,234,0.7)] text-xs sm:text-sm font-semibold transition-all hover:scale-102 active:scale-98 cursor-pointer"
              >
                Sign Up
              </button>
            </>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-stone-300 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* 4. Responsive Mobile Dropdown Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 p-4 rounded-2xl bg-[#181126]/95 border border-purple-500/30 backdrop-blur-md shadow-2xl">
          {/* Mobile compact pencil banner */}
          <div className="flex items-center justify-center mb-3 pb-2 border-b border-purple-500/20">
            <div className="h-6 flex items-center w-full max-w-xs filter drop-shadow-sm">
              <img src={pencilTip} alt="" className="h-full w-auto object-contain" />
              <div
                className="flex-1 h-full flex items-center justify-center text-[10px] font-bold text-[#35210c] uppercase tracking-wider -mx-[1px]"
                style={{
                  backgroundImage: `url(${pencilShaft})`,
                  backgroundRepeat: 'repeat-x',
                  backgroundSize: 'auto 100%'
                }}
              >
                NoteNest
              </div>
              <img src={pencilEraser} alt="" className="h-full w-auto object-contain" />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`text-left px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${
                  activeSection === link.id
                    ? 'bg-purple-900/40 text-purple-200 font-semibold'
                    : 'text-stone-300 hover:bg-white/5'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Mobile Auth Actions */}
          <div className="mt-3 pt-3 border-t border-purple-500/20 flex flex-col gap-2">
            {isAuthenticated ? (
              <div className="flex items-center justify-between">
                <Link
                  to="/notes"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 rounded-xl bg-purple-600 text-white font-semibold text-sm"
                >
                  My Notes →
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openLogout();
                  }}
                  className="ml-2 p-2 rounded-xl border border-white/20 text-stone-300"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openLogin();
                  }}
                  className="py-2 rounded-xl border border-white/20 text-white text-xs font-semibold hover:bg-white/5"
                >
                  Log In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openSignup();
                  }}
                  className="py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-semibold shadow-md"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default PencilNavbar;
