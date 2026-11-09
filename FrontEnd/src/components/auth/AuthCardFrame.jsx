import React from 'react';
import { X, BookOpen, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const AuthCardFrame = ({ children, onClose, themeOverride = null }) => {
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
    >
      {/* Notebook binding holes */}
      <div className="absolute left-3 sm:left-4 top-6 bottom-6 flex flex-col justify-between items-center pointer-events-none z-30 select-none">
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            className={`relative w-3.5 h-3.5 rounded-full flex items-center justify-center ${
              isDark
                ? 'bg-[#0e0918] shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.9),0_1px_1px_rgba(255,255,255,0.12)]'
                : 'bg-[#e4d8f0] shadow-[inset_0_1.5px_2px_rgba(0,0,0,0.3),0_1px_1px_rgba(255,255,255,0.8)]'
            }`}
          >
            <div
              className={`absolute -left-1.5 w-2.5 h-1 border-t-2 border-l-2 rounded-tl-full rotate-12 ${
                isDark ? 'border-purple-300/40' : 'border-purple-700/30'
              }`}
            />
          </div>
        ))}
      </div>

      {/* Header: NoteNest logo, theme toggle, and close button */}
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

      {/* Form content sits clear of the binding holes */}
      <div className="relative z-20 pb-8 pl-12 pr-6 pt-2 sm:pl-14 sm:pr-8">
        {children}
      </div>
    </div>
  );
};

export default AuthCardFrame;
