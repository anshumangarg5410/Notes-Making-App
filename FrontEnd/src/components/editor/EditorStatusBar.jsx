import React, { useState } from 'react';
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
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowModeMenu(!showModeMenu)}
            className={`flex items-center gap-1 px-1.5 py-0.5 rounded-[2px] border transition-colors ${
              isDark
                ? 'bg-[#1a1a24] border-[#2b2b3d] text-gray-300 hover:text-white hover:border-gray-600'
                : 'bg-white border-[#E2DEEE] text-[#374151] hover:text-[#111827] hover:border-[#DDD6FE]'
            }`}
          >
            <span
              className="font-mono text-[10px] px-1 rounded-[2px]"
              style={{
                backgroundColor: 'var(--accent-bg, rgba(168, 85, 247, 0.15))',
                color: 'var(--accent-text, #c084fc)'
              }}
            >
              {mode === 'Plain Text' ? 'TXT' : mode === 'Rich Text' ? 'RTF' : 'MD'}
            </span>
            <span>{mode}</span>
            <ChevronDown className={`w-3 h-3 ${isDark ? 'text-gray-400' : 'text-[#6B7280]'}`} />
          </button>

          {showModeMenu && (
            <div className={`absolute bottom-full right-0 mb-1 w-32 rounded-[4px] shadow-2xl py-1 z-50 text-xs border ${
              isDark ? 'bg-[#1c1c28] border-[#2c2c3e]' : 'bg-white border-[#E2DEEE] shadow-purple-100'
            }`}>
              <button
                type="button"
                onClick={() => {
                  onSelectMode?.('Markdown');
                  setShowModeMenu(false);
                }}
                className={`w-full text-left px-3 py-1 ${
                  mode === 'Markdown'
                    ? 'font-semibold text-purple-600'
                    : isDark ? 'text-gray-300 hover:bg-[#272738]' : 'text-[#374151] hover:bg-[#F3F0F9]'
                }`}
                style={mode === 'Markdown' ? { color: 'var(--accent-text, #c084fc)' } : undefined}
              >
                Markdown
              </button>
              <button
                type="button"
                onClick={() => {
                  onSelectMode?.('Rich Text');
                  setShowModeMenu(false);
                }}
                className={`w-full text-left px-3 py-1 ${
                  mode === 'Rich Text'
                    ? 'font-semibold text-purple-600'
                    : isDark ? 'text-gray-300 hover:bg-[#272738]' : 'text-[#374151] hover:bg-[#F3F0F9]'
                }`}
                style={mode === 'Rich Text' ? { color: 'var(--accent-text, #c084fc)' } : undefined}
              >
                Rich Text
              </button>
              <button
                type="button"
                onClick={() => {
                  onSelectMode?.('Plain Text');
                  setShowModeMenu(false);
                }}
                className={`w-full text-left px-3 py-1 ${
                  mode === 'Plain Text'
                    ? 'font-semibold text-purple-600'
                    : isDark ? 'text-gray-300 hover:bg-[#272738]' : 'text-[#374151] hover:bg-[#F3F0F9]'
                }`}
                style={mode === 'Plain Text' ? { color: 'var(--accent-text, #c084fc)' } : undefined}
              >
                Plain Text
              </button>
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

