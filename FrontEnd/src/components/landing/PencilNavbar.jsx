import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Menu, X, ArrowRight } from 'lucide-react';

export const PencilNavbar = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'features', label: 'Features' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (id) => {
    setActiveSection(id);
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="w-full pt-4 pb-2 px-4 sm:px-6 lg:px-8 relative z-30 select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">

        {/* Left: NoteNest Logo with Doodles */}
        <Link
          to="/"
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-2.5 group cursor-pointer shrink-0"
        >
          {/* Subtle diagonal hand-drawn dashes on left */}
          <div className="hidden sm:flex flex-col gap-0.5 -mr-1 text-purple-400/80 font-mono text-xs select-none">
            <span className="transform -rotate-12 translate-y-0.5">//</span>
          </div>

          {/* Open Book Icon inside purple glowing square */}
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#25173e]/90 border border-purple-500/50 text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.4)] transition-transform group-hover:scale-105">
            <BookOpen className="w-4 h-4" />
          </div>

          {/* NoteNest Wordmark */}
          <span className="text-2xl font-bold tracking-tight text-white font-serif">
            NoteNest
          </span>
        </Link>

        {/* Center: The Illustrated Wooden Pencil Navbar (Desktop) */}
        <nav className="hidden md:flex items-center justify-center flex-1 max-w-xl mx-4">
          <div className="relative flex items-center w-full filter drop-shadow-[0_6px_14px_rgba(0,0,0,0.6)]">

            {/* Pencil Tip (Left): Graphite Point + Shaved Wood Cone */}
            <div className="relative shrink-0 flex items-center">
              {/* Sharp Dark Lead Tip */}
              <div
                className="w-0 h-0 border-y-[15px] border-y-transparent border-r-[20px] border-r-[#1e1c22] z-10"
                style={{
                  filter: 'drop-shadow(-1px 0 1px rgba(0,0,0,0.8))'
                }}
              />
              {/* Shaved Wood Cone with Natural Grain Bevel */}
              <div
                className="w-0 h-0 border-y-[17px] border-y-transparent border-r-[32px] -ml-1"
                style={{
                  borderRightColor: '#f1d6b0',
                  backgroundImage: 'linear-gradient(180deg, #f7dfbe 0%, #e8cca4 50%, #d4b589 100%)'
                }}
              />
            </div>

            {/* Wooden Pencil Hexagonal Shaft with Golden Body & Integrated Links */}
            <div
              className="relative flex-1 h-9 flex items-center justify-around px-3 -ml-0.5"
              style={{
                background: 'linear-gradient(180deg, #fcd36a 0%, #f7b42c 25%, #e59d18 75%, #be7c0c 100%)',
                boxShadow: 'inset 0 1.5px 0 rgba(255,255,255,0.45), inset 0 -1.5px 0 rgba(0,0,0,0.3)',
                borderTop: '1px solid rgba(255,255,255,0.4)',
                borderBottom: '1px solid rgba(0,0,0,0.25)'
              }}
            >
              {/* Longitudinal Facet Line */}
              <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-amber-600/35 pointer-events-none" />

              {/* Navigation Links inside Pencil Body */}
              {navLinks.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => handleNavClick(link.id)}
                    className={`relative z-10 font-semibold text-xs sm:text-sm px-4 py-1 rounded-full transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-[#2b1b46] text-white shadow-[inset_0_1px_3px_rgba(0,0,0,0.7),0_1px_1px_rgba(255,255,255,0.25)] font-bold scale-105'
                        : 'text-[#38240f] hover:text-black hover:bg-amber-400/30'
                    }`}
                  >
                    {link.label}
                  </button>
                );
              })}
            </div>

            {/* Metallic Eraser Collar / Ferrule with Double Crimps */}
            <div
              className="w-6 h-9 shrink-0 relative flex items-center justify-center -ml-0.5"
              style={{
                background: 'linear-gradient(180deg, #c084fc 0%, #8b5cf6 30%, #581c87 75%, #3b0764 100%)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.5), inset 0 -1px 0 rgba(0,0,0,0.4)',
                borderTop: '1px solid rgba(255,255,255,0.35)',
                borderBottom: '1px solid rgba(0,0,0,0.5)'
              }}
            >
              <div className="w-[1.5px] h-full bg-purple-300/60 mx-[1px]" />
              <div className="w-[1.5px] h-full bg-purple-950/70 mx-[1px]" />
            </div>

            {/* Pink-Purple Rubber Eraser (Right) */}
            <div
              className="w-5 h-9 shrink-0 rounded-r-md -ml-0.5"
              style={{
                background: 'linear-gradient(180deg, #fb8da2 0%, #ee6b84 45%, #cf4c68 85%, #a8324a 100%)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4), inset -1.5px 0 2px rgba(0,0,0,0.35)'
              }}
            />
          </div>
        </nav>

        {/* Right: Log In & Sign Up Buttons */}
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="text-stone-300 hover:text-white font-medium text-sm px-3.5 py-1.5 rounded-lg transition-colors"
          >
            Log In
          </Link>

          <Link
            to="/register"
            className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold text-sm px-5 py-2 rounded-full shadow-[0_0_18px_rgba(124,58,237,0.55)] hover:shadow-[0_0_24px_rgba(124,58,237,0.75)] transition-all hover:scale-102 active:scale-98"
          >
            Sign Up
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-stone-300 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            aria-label="Open navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 p-4 rounded-2xl bg-[#181126]/95 border border-purple-500/30 backdrop-blur-md shadow-2xl">
          {/* Mini mobile pencil bar */}
          <div className="flex items-center justify-center mb-3 pb-2 border-b border-purple-500/20">
            <div className="h-5 flex items-center w-full max-w-xs">
              <div className="w-0 h-0 border-y-[8px] border-y-transparent border-r-[12px] border-r-[#1e1c22]" />
              <div className="w-0 h-0 border-y-[10px] border-y-transparent border-r-[18px] border-r-[#e8cca4] -ml-0.5" />
              <div
                className="flex-1 h-5 flex items-center justify-center text-[10px] font-bold text-amber-950 uppercase tracking-wider"
                style={{ background: 'linear-gradient(180deg, #fcd36a 0%, #f7b42c 100%)' }}
              >
                NoteNest
              </div>
              <div className="w-3.5 h-5 bg-purple-700" />
              <div className="w-3 h-5 bg-[#ee6b84] rounded-r-xs" />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`text-left px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                  activeSection === link.id
                    ? 'bg-purple-900/40 text-purple-200 font-semibold'
                    : 'text-stone-300 hover:bg-white/5'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default PencilNavbar;
