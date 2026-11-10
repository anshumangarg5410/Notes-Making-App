import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { ChevronDown, CheckCircle, Wifi, WifiOff } from 'lucide-react';

export const EditorStatusBar = ({
  wordCount = 0,
  charCount = 0,
  readingTime = 1,
  lastSaved = 'Just now',
  isOnline = true,
  mode = 'Markdown',
  onSelectMode
}) => {
  const { isDark } = useTheme();
  const [showModeMenu, setShowModeMenu] = useState(false);
  const modeMenuRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modeMenuRef.current && !modeMenuRef.current.contains(e.target)) {
        setShowModeMenu(false);
      }
    };
    if (showModeMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showModeMenu]);

  return (
    <div className={`h-7 border-t px-4 flex items-center justify-between text-[11px] select-none transition-colors duration-150 ${
      isDark ? 'bg-[#101017] border-[#20202e] text-gray-400' : 'bg-[#FAFAFD] border-[#EAE6F4] text-[#6B7280]'
    }`}>
      {/* Left statistics */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1 font-mono">
          <span className={isDark ? 'text-gray-400' : 'text-[#6B7280]'}>Words:</span>
          <span className={`font-medium ${isDark ? 'text-gray-200' : 'text-[#181326]'}`}>{wordCount.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-1 font-mono">
          <span className={isDark ? 'text-gray-400' : 'text-[#6B7280]'}>Characters:</span>
          <span className={`font-medium ${isDark ? 'text-gray-200' : 'text-[#181326]'}`}>{charCount.toLocaleString()}</span>
        </div>
        <div className={`hidden sm:inline-block ${isDark ? 'text-gray-400' : 'text-[#6B7280]'}`}>
          <span>{readingTime} min read</span>
        </div>
      </div>

      {/* Right status & mode */}
      <div className="flex items-center gap-4">
        {/* Network / Sync status indicator */}
        <div className="flex items-center gap-1.5">
          {isOnline ? (
            <span className="flex items-center gap-1 text-emerald-500 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Online</span>
            </span>
          ) : (
            <span className="flex items-center gap-1 text-amber-500 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              <span>Offline (Cached)</span>
            </span>
          )}
        </div>

        {/* Mode Dropdown (Markdown / Rich Text / Plain Text) */}
        <div className="relative" ref={modeMenuRef}>
          <button
            type="button"
            onClick={() => setShowModeMenu(!showModeMenu)}
            aria-label={`Current format: ${mode}. Click to change editor mode.`}
            className={`flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] border transition-colors cursor-pointer select-none ${
              isDark
                ? 'bg-[#181622] border-[#2b2b3d] text-gray-200 hover:text-white hover:border-purple-400/50'
                : 'bg-white border-[#E2DEEE] text-[#374151] hover:text-[#111827] hover:border-purple-300'
            }`}
          >
            <span
              className="font-mono text-[10px] px-1 py-0.5 rounded-[2px] font-bold"
              style={{
                backgroundColor: 'var(--accent-bg, rgba(168, 85, 247, 0.15))',
                color: 'var(--accent-text, #c084fc)'
              }}
            >
              {mode === 'Plain Text' ? 'TXT' : mode === 'Rich Text' ? 'RTF' : 'MD'}
            </span>
            <span className="font-medium text-xs">{mode}</span>
            <ChevronDown className={`w-3 h-3 transition-transform duration-150 ${showModeMenu ? 'rotate-180' : ''} ${isDark ? 'text-gray-400' : 'text-[#6B7280]'}`} />
          </button>

          {showModeMenu && (
            <div
              className={`absolute bottom-full right-0 mb-2 w-36 rounded-lg shadow-2xl py-1.5 px-1 z-50 text-xs border backdrop-blur-md animate-in fade-in duration-100 ${
                isDark
                  ? 'bg-[#181624] border-[#2c2c40] shadow-[0_10px_30px_rgba(0,0,0,0.8)]'
                  : 'bg-white border-[#E2DEEE] shadow-[0_10px_25px_rgba(147,51,234,0.12)]'
              }`}
            >
              {['Markdown', 'Rich Text', 'Plain Text'].map((item) => {
                const isSelected = mode === item;
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      onSelectMode?.(item);
                      setShowModeMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-md font-medium text-xs transition-colors flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? isDark
                          ? 'bg-purple-950/40 text-[#c084fc] font-semibold'
                          : 'bg-purple-50 text-[#7c3aed] font-semibold'
                        : isDark
                          ? 'text-gray-200 hover:bg-white/5 hover:text-white'
                          : 'text-slate-700 hover:bg-purple-50/70 hover:text-slate-900'
                    }`}
                    style={isSelected ? { color: 'var(--accent-text, #c084fc)' } : undefined}
                  >
                    <span>{item}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className={isDark ? 'text-gray-400' : 'text-[#6B7280]'}>
          Last edited: <span className={isDark ? 'text-gray-300' : 'text-[#181326]'}>{lastSaved}</span>
        </div>
      </div>
    </div>
  );
};

