import React, { useState } from 'react';
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
  const [showModeMenu, setShowModeMenu] = useState(false);

  return (
    <div className="h-7 bg-[#101017] border-t border-[#20202e] px-4 flex items-center justify-between text-[11px] text-gray-400 select-none">
      {/* Left statistics */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1 font-mono">
          <span className="text-gray-400">Words:</span>
          <span className="text-gray-200 font-medium">{wordCount.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-1 font-mono">
          <span className="text-gray-400">Characters:</span>
          <span className="text-gray-200 font-medium">{charCount.toLocaleString()}</span>
        </div>
        <div className="hidden sm:inline-block text-gray-400">
          <span>{readingTime} min read</span>
        </div>
      </div>

      {/* Right status & mode */}
      <div className="flex items-center gap-4">
        {/* Network / Sync status indicator */}
        <div className="flex items-center gap-1.5">
          {isOnline ? (
            <span className="flex items-center gap-1 text-emerald-400/90">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Online</span>
            </span>
          ) : (
            <span className="flex items-center gap-1 text-amber-400/90">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span>Offline (Cached)</span>
            </span>
          )}
        </div>

        {/* Mode Dropdown (Markdown / Rich Text) */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowModeMenu(!showModeMenu)}
            className="flex items-center gap-1 text-gray-300 hover:text-white px-1.5 py-0.5 rounded-[2px] bg-[#1a1a24] border border-[#2b2b3d] hover:border-gray-600 transition-colors"
          >
            <span className="font-mono text-[10px] text-purple-400 bg-purple-950/60 px-1 rounded-[2px]">MD</span>
            <span>{mode}</span>
            <ChevronDown className="w-3 h-3 text-gray-400" />
          </button>

          {showModeMenu && (
            <div className="absolute bottom-full right-0 mb-1 w-32 bg-[#1c1c28] border border-[#2c2c3e] rounded-[4px] shadow-2xl py-1 z-50 text-xs">
              <button
                type="button"
                onClick={() => {
                  onSelectMode?.('Markdown');
                  setShowModeMenu(false);
                }}
                className={`w-full text-left px-3 py-1 hover:bg-[#272738] ${
                  mode === 'Markdown' ? 'text-purple-400 font-semibold' : 'text-gray-300'
                }`}
              >
                Markdown
              </button>
              <button
                type="button"
                onClick={() => {
                  onSelectMode?.('Rich Text');
                  setShowModeMenu(false);
                }}
                className={`w-full text-left px-3 py-1 hover:bg-[#272738] ${
                  mode === 'Rich Text' ? 'text-purple-400 font-semibold' : 'text-gray-300'
                }`}
              >
                Rich Text
              </button>
            </div>
          )}
        </div>

        <div className="text-gray-400">
          Last edited: <span className="text-gray-300">{lastSaved}</span>
        </div>
      </div>
    </div>
  );
};
