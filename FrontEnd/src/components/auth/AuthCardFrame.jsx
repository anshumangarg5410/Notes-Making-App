import React from 'react';
import { X, BookOpen, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

// Import Clipart Assets
import pinnedHeartDark from '../../assets/auth/pinned-heart-dark-clean.png';
import pinnedHeartLight from '../../assets/auth/pinned-heart-light-clean.png';
import leafBranchDark from '../../assets/auth/leaf-branch-dark-clean.png';
import leafBranchLight from '../../assets/auth/leaf-branch-light-clean.png';
import booksMugDark from '../../assets/auth/books-mug-dark-clean.png';
import booksMugLight from '../../assets/auth/books-mug-light-clean.png';
import washiTapeDark from '../../assets/auth/washi-tape-dark.png';
import washiTapeLight from '../../assets/auth/washi-tape-light.png';
import tornBottomDark from '../../assets/auth/torn-bottom-dark.png';
import tornBottomLight from '../../assets/auth/torn-bottom-light.png';

export const AuthCardFrame = ({
  children,
  onClose,
  themeOverride = null,
  showStationerySidebar = true
}) => {
  const { theme, toggleTheme } = useTheme();
  const activeTheme = themeOverride || theme;
  const isDark = activeTheme === 'dark';

  return (
    <div
      className={`relative w-full max-w-xl sm:max-w-2xl rounded-[5px] transition-all duration-300 ${
        isDark
          ? 'bg-[#211d2e] text-[#f5f3f0] border border-purple-500/40 shadow-[0_0_50px_rgba(147,51,234,0.35),0_20px_40px_rgba(0,0,0,0.8)]'
          : 'bg-[#fbf7fd] text-[#26153b] border border-purple-300/80 shadow-[0_15px_45px_rgba(147,51,234,0.18),0_2px_10px_rgba(0,0,0,0.06)]'
      }`}
      style={{
        backgroundImage: isDark
          ? 'radial-gradient(circle at 80% 20%, rgba(168,85,247,0.08) 0%, transparent 60%)'
          : 'radial-gradient(circle at 80% 20%, rgba(216,180,254,0.2) 0%, transparent 60%)'
      }}
    >
      {/* 1. Diagonal Washi Tape at Top-Left Corner */}
      <div className="absolute -top-3 -left-3 sm:-top-3.5 sm:-left-3.5 z-40 pointer-events-none select-none">
        <img
          src={isDark ? washiTapeDark : washiTapeLight}
          alt=""
          className="w-16 sm:w-20 h-auto -rotate-12 drop-shadow-md opacity-90"
        />
      </div>

      {/* 2. Spiral Binding Holes running down the left edge */}
      <div className="absolute left-2.5 sm:left-3.5 top-6 bottom-8 flex flex-col justify-between items-center pointer-events-none z-30 select-none">
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            className={`relative w-3 sm:w-3.5 h-3 sm:h-3.5 rounded-full flex items-center justify-center ${
              isDark
                ? 'bg-[#0e0918] shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.9),0_1px_1px_rgba(255,255,255,0.12)]'
                : 'bg-[#e4d8f0] shadow-[inset_0_1.5px_2px_rgba(0,0,0,0.3),0_1px_1px_rgba(255,255,255,0.8)]'
            }`}
          >
            {/* Metallic Loop Wire Highlight */}
            <div
              className={`absolute -left-1 sm:-left-1.5 w-2 sm:w-2.5 h-1 border-t-2 border-l-2 rounded-tl-full rotate-12 ${
                isDark ? 'border-purple-300/40' : 'border-purple-700/30'
              }`}
            />
          </div>
        ))}
      </div>

      {/* 3. Top Header Bar: NoteNest Logo + Theme Toggle + Close Button */}
      <div className="relative pt-5 px-6 sm:px-8 flex items-center justify-between z-30">
        {/* Placeholder spacer on left to center the logo */}
        <div className="w-16 flex items-center pl-4 sm:pl-3">
          {/* Quick theme toggle pill */}
          <button
            type="button"
            onClick={toggleTheme}
            title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            className={`p-1.5 rounded-[3px] transition-all text-xs flex items-center gap-1 cursor-pointer ${
              isDark
                ? 'bg-purple-900/40 hover:bg-purple-800/60 text-purple-300 border border-purple-500/25'
                : 'bg-purple-100 hover:bg-purple-200 text-purple-800 border border-purple-200'
            }`}
          >
            {isDark ? <Sun className="w-3.5 h-3.5 text-amber-300" /> : <Moon className="w-3.5 h-3.5 text-purple-700" />}
          </button>
        </div>

        {/* Centered NoteNest Brand Logo */}
        <div className="flex items-center gap-2 cursor-pointer select-none">
          <div
            className={`w-7 h-7 rounded-[3px] flex items-center justify-center ${
              isDark
                ? 'bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-[0_0_12px_rgba(168,85,247,0.5)]'
                : 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-sm'
            }`}
          >
            <BookOpen className="w-4 h-4" />
          </div>
          <span
            className={`font-serif font-bold text-lg sm:text-xl tracking-tight ${
              isDark ? 'text-white' : 'text-[#26153b]'
            }`}
          >
            NoteNest
          </span>
        </div>

        {/* Close Button "✕" */}
        <div className="w-16 flex justify-end">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              className={`p-1.5 rounded-[3px] transition-colors cursor-pointer ${
                isDark
                  ? 'text-stone-400 hover:text-white hover:bg-white/10'
                  : 'text-stone-500 hover:text-stone-900 hover:bg-purple-100/70'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* 4. Main Body: Split into Left Stationery Sidebar & Right Form */}
      <div className="relative px-6 sm:px-8 pt-2 pb-9 z-20 flex flex-col md:flex-row items-stretch gap-4 sm:gap-6">
        {/* Left Stationery Accent Column (visible on sm/md and up) */}
        {showStationerySidebar && (
          <div className="hidden sm:flex sm:w-36 md:w-44 shrink-0 flex-col justify-between items-center pl-3 pr-1 py-1 select-none pointer-events-none">
            {/* Top: Pinned Sticky Heart Note */}
            <div className="relative group">
              <img
                src={isDark ? pinnedHeartDark : pinnedHeartLight}
                alt=""
                className="w-20 sm:w-24 h-auto object-contain drop-shadow-md rotate-[-4deg]"
              />
            </div>

            {/* Middle: Leaf Branch */}
            <div className="my-auto py-2">
              <img
                src={isDark ? leafBranchDark : leafBranchLight}
                alt=""
                className="w-14 sm:w-16 h-auto object-contain opacity-95"
              />
            </div>

            {/* Bottom: Stacked Books + Steaming NoteNest Mug */}
            <div className="pt-2">
              <img
                src={isDark ? booksMugDark : booksMugLight}
                alt=""
                className="w-28 sm:w-32 h-auto object-contain drop-shadow-lg"
              />
            </div>
          </div>
        )}

        {/* Right Form Content */}
        <div className={`flex-1 min-w-0 ${showStationerySidebar ? 'sm:pl-2' : ''}`}>
          {children}
        </div>
      </div>

      {/* 5. Jagged Torn Paper Bottom Strip */}
      <div className="absolute -bottom-1 left-0 right-0 w-full overflow-hidden rounded-b-[5px] pointer-events-none select-none z-10">
        <img
          src={isDark ? tornBottomDark : tornBottomLight}
          alt=""
          className="w-full h-5 sm:h-6 object-cover opacity-85"
        />
      </div>
    </div>
  );
};

export default AuthCardFrame;
