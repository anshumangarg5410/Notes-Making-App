import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Sun, Moon, Menu, X, ArrowRight } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const LandingNavbar = () => {
  const { isDark, toggleTheme } = useTheme();
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const sections = ['home', 'features', 'about', 'how-it-works', 'contact'];
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

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
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
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? isDark
            ? 'bg-[#0f0c1a]/85 backdrop-blur-md border-b border-purple-900/30 shadow-lg shadow-black/40 py-2.5'
            : 'bg-[#faf8f5]/85 backdrop-blur-md border-b border-amber-900/10 shadow-sm py-2.5'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">

          {/* Left: Brand Logo */}
          <Link
            to="/"
            onClick={() => scrollTo('home')}
            className="flex items-center gap-2.5 group cursor-pointer shrink-0"
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 ${
              isDark
                ? 'bg-purple-950/60 border border-purple-500/40 text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.35)]'
                : 'bg-amber-100 border border-amber-300 text-amber-900 shadow-sm'
            }`}>
              <BookOpen className="w-5 h-5 transition-transform group-hover:-rotate-6" />
            </div>
            <div className="flex flex-col">
              <span className={`text-xl font-bold tracking-tight font-serif ${
                isDark ? 'text-white' : 'text-stone-900'
              }`}>
                Note<span className={isDark ? 'text-purple-400' : 'text-amber-700'}>Nest</span>
              </span>
            </div>
          </Link>

          {/* Center: The Illustrated Wooden Pencil Navbar (Desktop) */}
          <nav className="hidden lg:flex items-center justify-center flex-1 max-w-2xl px-2">
            <div className="relative flex items-center w-full select-none filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.25)]">
              {/* Pencil Tip (Left) */}
              <div className="relative shrink-0 flex items-center">
                {/* Sharp Graphite Point */}
                <div
                  className="w-0 h-0 border-y-[17px] border-y-transparent border-r-[22px] border-r-[#262427] z-10"
                  style={{
                    filter: 'drop-shadow(-1px 0 1px rgba(0,0,0,0.5))'
                  }}
                />
                {/* Sharpened Wood Cone */}
                <div
                  className="w-0 h-0 border-y-[20px] border-y-transparent border-r-[36px] -ml-1"
                  style={{
                    borderRightColor: '#f1d6b0',
                    backgroundImage: 'linear-gradient(to right, #eed1a8, #dec095)'
                  }}
                />
              </div>

              {/* Wooden Pencil Hexagonal Shaft */}
              <div
                className="relative flex-1 h-10 flex items-center justify-around px-4 -ml-0.5 rounded-l-none"
                style={{
                  background: 'linear-gradient(180deg, #ffcc4d 0%, #f7b22a 45%, #e19515 85%, #b9760c 100%)',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4), inset 0 -1px 0 rgba(0,0,0,0.25)',
                  borderTop: '1px solid rgba(255,255,255,0.3)',
                  borderBottom: '1px solid rgba(0,0,0,0.2)'
                }}
              >
                {/* Pencil Longitudinal Facet Line */}
                <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-amber-600/30 pointer-events-none" />

                {navLinks.map((link) => {
                  const isActive = activeSection === link.id;
                  return (
                    <button
                      key={link.id}
                      onClick={() => scrollTo(link.id)}
                      className={`relative z-10 font-medium text-xs sm:text-sm px-4 py-1 rounded-full transition-all duration-200 cursor-pointer ${
                        isActive
                          ? 'bg-[#211636] text-white shadow-[inset_0_1px_3px_rgba(0,0,0,0.6),0_1px_0_rgba(255,255,255,0.2)] font-semibold scale-105'
                          : 'text-[#3b2308] hover:text-black hover:bg-amber-400/30'
                      }`}
                    >
                      {link.label}
                    </button>
                  );
                })}
              </div>

              {/* Metal Ferrule (Collar) */}
              <div
                className="w-7 h-10 shrink-0 relative flex items-center justify-center -ml-0.5"
                style={{
                  background: 'linear-gradient(180deg, #d8d8d8 0%, #ffffff 35%, #a8a8a8 70%, #7d7d7d 100%)',
                  borderTop: '1px solid #ffffff',
                  borderBottom: '1px solid #555'
                }}
              >
                {/* Ferrule Crimp Bands */}
                <div className="w-[1.5px] h-full bg-stone-500/50 mx-[1.5px]" />
                <div className="w-[1.5px] h-full bg-stone-500/50 mx-[1.5px]" />
              </div>

              {/* Pink Eraser (Right) */}
              <div
                className="w-6 h-10 shrink-0 rounded-r-md -ml-0.5"
                style={{
                  background: 'linear-gradient(180deg, #fba1b1 0%, #f37d92 50%, #d85770 100%)',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4), inset -1px 0 2px rgba(0,0,0,0.2)'
                }}
              />
            </div>
          </nav>

          {/* Right: Actions (Theme Toggle, Log In, Sign Up) */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-xl transition-all duration-200 cursor-pointer ${
                isDark
                  ? 'bg-purple-950/50 text-amber-300 hover:bg-purple-900/60 border border-purple-800/40 shadow-[0_0_10px_rgba(251,191,36,0.15)]'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-300 shadow-sm'
              }`}
              title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Log In Button */}
            <Link
              to="/login"
              className={`hidden sm:inline-flex text-sm font-medium px-4 py-2 rounded-xl transition-colors ${
                isDark
                  ? 'text-stone-300 hover:text-white hover:bg-white/5'
                  : 'text-stone-700 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              Log In
            </Link>

            {/* Sign Up CTA Button */}
            <Link
              to="/register"
              className={`text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-200 flex items-center gap-1.5 cursor-pointer shadow-md ${
                isDark
                  ? 'bg-[#8b5cf6] hover:bg-[#7c3aed] text-white shadow-[0_0_20px_rgba(139,92,246,0.45)] hover:shadow-[0_0_25px_rgba(139,92,246,0.65)] hover:scale-102'
                  : 'bg-[#7c3aed] hover:bg-[#6d28d9] text-white shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-102'
              }`}
            >
              <span>Sign Up</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden p-2 rounded-xl transition-colors cursor-pointer ${
                isDark
                  ? 'text-stone-300 hover:bg-white/10'
                  : 'text-stone-700 hover:bg-stone-100'
              }`}
              aria-label="Open mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div
            className={`lg:hidden mt-3 p-4 rounded-2xl border transition-all animate-in fade-in slide-in-from-top-4 duration-200 ${
              isDark
                ? 'bg-[#151124] border-purple-900/40 shadow-2xl'
                : 'bg-white border-stone-200 shadow-xl'
            }`}
          >
            {/* Mobile Mini Pencil Header */}
            <div className="flex items-center justify-center mb-4 pb-3 border-b border-purple-500/10">
              <div className="h-6 flex items-center w-full max-w-xs">
                <div className="w-0 h-0 border-y-[10px] border-y-transparent border-r-[14px] border-r-[#262427]" />
                <div className="w-0 h-0 border-y-[12px] border-y-transparent border-r-[22px] border-r-[#f1d6b0] -ml-0.5" />
                <div
                  className="flex-1 h-6 flex items-center justify-center text-[10px] font-bold text-amber-950 px-2 uppercase tracking-widest"
                  style={{
                    background: 'linear-gradient(180deg, #ffcc4d 0%, #f7b22a 100%)'
                  }}
                >
                  NoteNest
                </div>
                <div className="w-4 h-6 bg-stone-300 flex items-center justify-center">
                  <div className="w-0.5 h-full bg-stone-400" />
                </div>
                <div className="w-3.5 h-6 bg-[#f37d92] rounded-r-sm" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollTo(link.id)}
                  className={`text-left px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                    activeSection === link.id
                      ? isDark
                        ? 'bg-purple-900/30 text-purple-300 font-semibold'
                        : 'bg-amber-100/70 text-amber-900 font-semibold'
                      : isDark
                      ? 'text-stone-300 hover:bg-white/5'
                      : 'text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  {link.label}
                </button>
              ))}
              <div className="pt-2 mt-2 border-t border-purple-500/10 flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-center py-2 text-sm font-medium rounded-xl ${
                    isDark ? 'text-stone-300 hover:bg-white/5' : 'text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 text-sm font-semibold rounded-xl bg-purple-600 text-white shadow-md shadow-purple-600/30"
                >
                  Sign Up for Free
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default LandingNavbar;

