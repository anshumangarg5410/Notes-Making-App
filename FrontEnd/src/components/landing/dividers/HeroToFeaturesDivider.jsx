import React from 'react';
import { Sparkles, Paperclip, ChevronDown } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import binderClipDark from '../../../assets/landing/binder-clip-dark.png';
import tornDividerDark from '../../../assets/footer/torn-divider-dark.png';
import tornDividerLight from '../../../assets/footer/torn-divider-light.png';

export const HeroToFeaturesDivider = () => {
  const { isDark } = useTheme();

  return (
    <div className="relative w-full py-8 sm:py-10 select-none overflow-hidden z-20">
      {/* Torn Paper Deckle Layer Banner Across the Seam */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-16 pointer-events-none opacity-40 sm:opacity-50">
        <img
          src={isDark ? tornDividerDark : tornDividerLight}
          alt="Torn Paper Seam"
          className="w-full h-full object-cover object-center filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
        />
      </div>

      {/* Ambient Purple Backlight Halo */}
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 sm:w-[600px] h-20 rounded-full blur-3xl pointer-events-none transition-opacity duration-500 ${
          isDark ? 'bg-purple-600/20' : 'bg-purple-400/25'
        }`}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main Divider Structure */}
        <div className="relative flex items-center justify-center">

          {/* Left Dashed Graphite Guide Line with Measurement Pips */}
          <div className="flex-1 flex items-center mr-3 sm:mr-6">
            <div
              className={`h-[1px] w-full border-t border-dashed transition-colors ${
                isDark ? 'border-purple-400/30' : 'border-purple-500/35'
              }`}
            />
            {/* Guide Pip */}
            <span
              className={`w-1.5 h-1.5 rounded-full mx-1.5 shrink-0 shadow-sm ${
                isDark ? 'bg-purple-400/60 shadow-[0_0_8px_rgba(168,85,247,0.6)]' : 'bg-purple-500/60'
              }`}
            />
            <span className="text-[10px] font-mono text-purple-400/50 hidden md:inline-block">
              01
            </span>
          </div>

          {/* Left-Angled Decorative Washi Tape Strip */}
          <div
            className={`hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-[2px] transform -rotate-3 -translate-y-3 shadow-md border pointer-events-none ${
              isDark
                ? 'bg-purple-900/60 border-purple-500/40 text-purple-200 backdrop-blur-sm'
                : 'bg-purple-100/90 border-purple-300 text-purple-800 backdrop-blur-sm'
            }`}
            style={{
              backgroundImage: isDark
                ? 'repeating-linear-gradient(45deg, rgba(168,85,247,0.08), rgba(168,85,247,0.08) 6px, transparent 6px, transparent 12px)'
                : 'repeating-linear-gradient(45deg, rgba(147,51,234,0.08), rgba(147,51,234,0.08) 6px, transparent 6px, transparent 12px)'
            }}
          >
            <span className="text-[10px] font-mono font-medium tracking-wider uppercase">
              ✦ NoteNest Tape // Vol. I
            </span>
          </div>

          {/* Centered Chapter Plaque & Fastener */}
          <div className="relative flex items-center group cursor-default mx-2 sm:mx-4">
            {/* Golden Stationery Binder Clip Pinning the Seam */}
            <div className="absolute -top-7 -left-5 sm:-left-6 w-9 sm:w-11 h-9 sm:h-11 pointer-events-none transform -rotate-12 group-hover:rotate-6 transition-transform duration-300 filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.45)]">
              <img
                src={binderClipDark}
                alt="Binder Clip"
                className="w-full h-full object-contain"
              />
            </div>

            {/* Chapter Glassmorphic Plaque */}
            <div
              className={`flex items-center gap-2 sm:gap-2.5 px-4 sm:px-6 py-2 rounded-full border transition-all duration-300 shadow-lg ${
                isDark
                  ? 'bg-[#0f0b1d]/85 border-purple-500/40 text-purple-200 shadow-[0_0_20px_rgba(147,51,234,0.18)] group-hover:border-purple-400 group-hover:shadow-[0_0_25px_rgba(168,85,247,0.3)]'
                  : 'bg-white/90 border-purple-300/80 text-purple-900 shadow-[0_4px_15px_rgba(147,51,234,0.12)] group-hover:border-purple-500'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span className="text-xs sm:text-sm font-semibold tracking-wide uppercase font-mono">
                Chapter I : Ecosystem
              </span>
              <span className="text-purple-400/60 hidden sm:inline">•</span>
              <span
                className={`text-[11px] hidden sm:inline font-sans ${
                  isDark ? 'text-purple-300/70' : 'text-purple-700/80'
                }`}
              >
                Capabilities & Craft
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-purple-400 group-hover:translate-y-0.5 transition-transform" />
            </div>

            {/* Right Decorative Washi Tape Strip */}
            <div
              className={`hidden xl:flex items-center gap-1.5 px-3 py-1 rounded-[2px] transform rotate-3 -translate-y-3 ml-3 shadow-md border pointer-events-none ${
                isDark
                  ? 'bg-fuchsia-950/60 border-purple-500/30 text-purple-200'
                  : 'bg-amber-50/90 border-amber-200 text-amber-900'
              }`}
              style={{
                backgroundImage:
                  'repeating-linear-gradient(-45deg, rgba(216,180,254,0.1), rgba(216,180,254,0.1) 6px, transparent 6px, transparent 12px)'
              }}
            >
              <span className="text-[10px] font-mono font-medium tracking-wider">
                0.5mm Lead ✎
              </span>
            </div>
          </div>

          {/* Right Dashed Graphite Guide Line with Measurement Pips */}
          <div className="flex-1 flex items-center ml-3 sm:mr-6">
            <span className="text-[10px] font-mono text-purple-400/50 hidden md:inline-block">
              ✦
            </span>
            <span
              className={`w-1.5 h-1.5 rounded-full mx-1.5 shrink-0 shadow-sm ${
                isDark ? 'bg-purple-400/60 shadow-[0_0_8px_rgba(168,85,247,0.6)]' : 'bg-purple-500/60'
              }`}
            />
            <div
              className={`h-[1px] w-full border-t border-dashed transition-colors ${
                isDark ? 'border-purple-400/30' : 'border-purple-500/35'
              }`}
            />
          </div>

        </div>
      </div>
    </div>
  );
};

export default HeroToFeaturesDivider;
