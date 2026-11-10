import React from 'react';
import { PenTool, Ruler, Sparkles } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import pencilTipRealistic from '../../../assets/landing/pencil-tip-realistic.png';

export const FeaturesToEditorDivider = () => {
  const { isDark } = useTheme();

  // Generate 24 ruler centimetre intervals across the ruler bar
  const rulerTicks = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="relative w-full py-10 sm:py-14 select-none overflow-hidden z-20">
      {/* Ambient Violet Glow */}
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-20 rounded-full blur-3xl pointer-events-none transition-opacity duration-500 ${
          isDark ? 'bg-purple-700/15' : 'bg-purple-300/20'
        }`}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Top: Notebook Saddle-Stitch Seam */}
        <div className="flex items-center justify-between text-purple-400/40 text-[10px] font-mono tracking-widest mb-3 opacity-60">
          <span>× — — — × — — — ×</span>
          <span className="hidden sm:inline">NOTEBOOK BINDING // REINFORCED SEAM</span>
          <span>× — — — × — — — ×</span>
        </div>

        {/* Central Drafting Ruler Structure */}
        <div className="relative group">
          {/* Sharpened Pencil Tip Tool drawing the line */}
          <div className="absolute -top-10 left-12 sm:left-24 lg:left-36 w-14 sm:w-16 h-10 pointer-events-none transform -rotate-45 group-hover:-translate-y-1 group-hover:rotate-[-40deg] transition-all duration-300 filter drop-shadow-[0_6px_12px_rgba(0,0,0,0.5)]">
            <img
              src={pencilTipRealistic}
              alt="Pencil Tip"
              className="w-full h-full object-contain"
            />
            {/* Lead tip spark */}
            <div className="absolute bottom-1 right-2 w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b] animate-ping" />
          </div>

          {/* Precision Architect's Ruler Body */}
          <div
            className={`w-full rounded-[4px] border backdrop-blur-md px-3 sm:px-6 py-2.5 transition-all duration-300 shadow-md ${
              isDark
                ? 'bg-[#0f0b1d]/80 border-purple-500/30 group-hover:border-purple-400/60 shadow-[0_4px_20px_rgba(147,51,234,0.12)]'
                : 'bg-white/85 border-purple-200/90 group-hover:border-purple-400 shadow-[0_4px_16px_rgba(147,51,234,0.08)]'
            }`}
          >
            <div className="flex items-center justify-between relative">

              {/* Left Ruler Marks */}
              <div className="flex-1 flex items-end gap-1.5 sm:gap-2.5 overflow-hidden pr-3 sm:pr-6 opacity-75">
                {rulerTicks.slice(0, 10).map((tick) => (
                  <div key={`left-tick-${tick}`} className="flex flex-col items-center shrink-0">
                    <span className="text-[8px] font-mono text-purple-400/50 mb-1 hidden sm:block">
                      {String(tick).padStart(2, '0')}
                    </span>
                    <div
                      className={`w-[1px] transition-colors ${
                        tick % 5 === 0
                          ? isDark ? 'h-4 bg-purple-300' : 'h-4 bg-purple-600'
                          : isDark ? 'h-2 bg-purple-500/40' : 'h-2 bg-purple-400/50'
                      }`}
                    />
                  </div>
                ))}
              </div>

              {/* Centered Chapter II Stamp */}
              <div className="shrink-0 flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-1.5 rounded-full border transition-transform duration-200 group-hover:scale-[1.02] shadow-sm select-none"
                style={{
                  backgroundColor: isDark ? 'rgba(23, 15, 42, 0.95)' : 'rgba(245, 240, 255, 0.95)',
                  borderColor: isDark ? 'rgba(168, 85, 247, 0.4)' : 'rgba(147, 51, 234, 0.35)'
                }}
              >
                <div className="p-1 rounded-full bg-purple-600/20 text-purple-400">
                  <Ruler className="w-3.5 h-3.5" />
                </div>
                <div className="flex flex-col text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs sm:text-sm font-bold tracking-wide uppercase font-mono text-purple-200">
                      Chapter II : The Canvas
                    </span>
                    <Sparkles className="w-3 h-3 text-amber-400 hidden sm:inline" />
                  </div>
                  <span
                    className={`text-[10px] font-mono ${
                      isDark ? 'text-purple-300/70' : 'text-purple-700/80'
                    }`}
                  >
                    0.5mm Precision • Obsidian-Grade Quill
                  </span>
                </div>
              </div>

              {/* Right Ruler Marks */}
              <div className="flex-1 flex items-end justify-end gap-1.5 sm:gap-2.5 overflow-hidden pl-3 sm:pl-6 opacity-75">
                {rulerTicks.slice(10, 20).map((tick) => (
                  <div key={`right-tick-${tick}`} className="flex flex-col items-center shrink-0">
                    <span className="text-[8px] font-mono text-purple-400/50 mb-1 hidden sm:block">
                      {String(tick).padStart(2, '0')}
                    </span>
                    <div
                      className={`w-[1px] transition-colors ${
                        tick % 5 === 0
                          ? isDark ? 'h-4 bg-purple-300' : 'h-4 bg-purple-600'
                          : isDark ? 'h-2 bg-purple-500/40' : 'h-2 bg-purple-400/50'
                      }`}
                    />
                  </div>
                ))}
              </div>

            </div>
          </div>

          {/* Subtle Pencil Inscription Below Ruler */}
          <div className="mt-2.5 flex items-center justify-between px-2 text-[11px] font-mono">
            <span
              className={`italic ${
                isDark ? 'text-purple-300/50' : 'text-purple-800/60'
              }`}
            >
              "Where raw thought organizes into clarity."
            </span>
            <span className="text-purple-400/40 hidden sm:inline">
              ISO 216 / A4 GRID STANDARD ✎
            </span>
          </div>

        </div>

      </div>
    </div>
  );
};

export default FeaturesToEditorDivider;

