import React from 'react';
import { Heart, BookOpen, Feather, Sparkles } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import pinnedHeartDark from '../../../assets/footer/pinned-heart-dark.png';
import pinnedHeartLight from '../../../assets/footer/pinned-heart-light.png';
import footerRibbonDark from '../../../assets/landing/footer-ribbon-dark.png';
import footerRibbonLight from '../../../assets/landing/footer-ribbon-light.png';

export const EditorToAboutDivider = () => {
  const { isDark } = useTheme();

  return (
    <div className="relative w-full py-10 sm:py-12 select-none overflow-hidden z-20">
      {/* Decorative Full-Width Stationery Ribbon Banner Underlay */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-16 pointer-events-none opacity-30 sm:opacity-40">
        <img
          src={isDark ? footerRibbonDark : footerRibbonLight}
          alt="Stationery Ribbon"
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Ambient Purple Backlight */}
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-20 rounded-full blur-3xl pointer-events-none transition-opacity duration-500 ${
          isDark ? 'bg-fuchsia-800/15' : 'bg-purple-300/20'
        }`}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="relative flex items-center justify-between">

          {/* Left Pencil Sketch Line with Washi Stitch Detail */}
          <div className="flex-1 flex items-center mr-4 sm:mr-8">
            <div
              className={`h-[1px] w-full border-t border-dashed transition-colors ${
                isDark ? 'border-purple-400/30' : 'border-purple-500/35'
              }`}
            />
            {/* Ink drop dot */}
            <span
              className={`w-2 h-2 rounded-full mx-2 shrink-0 ${
                isDark ? 'bg-purple-400/70 shadow-[0_0_10px_rgba(168,85,247,0.7)]' : 'bg-purple-600/70'
              }`}
            />
            <span className="text-[10px] font-mono text-purple-400/60 hidden md:inline-block">
              FOLIO № 03
            </span>
          </div>

          {/* Centered Chapter Plaque */}
          <div className="relative flex items-center group cursor-default mx-2">
            <div
              className={`flex items-center gap-2 sm:gap-3 px-5 sm:px-7 py-2.5 rounded-full border transition-all duration-300 shadow-xl ${
                isDark
                  ? 'bg-[#120c24]/90 border-purple-500/40 text-purple-100 shadow-[0_0_25px_rgba(168,85,247,0.2)] group-hover:border-purple-400 group-hover:shadow-[0_0_30px_rgba(192,132,252,0.35)]'
                  : 'bg-white/95 border-purple-300 text-purple-900 shadow-[0_6px_20px_rgba(147,51,234,0.15)] group-hover:border-purple-500'
              }`}
            >
              <div className="p-1 rounded-full bg-purple-500/20 text-purple-300">
                <Feather className="w-4 h-4" />
              </div>
              <div className="flex flex-col text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs sm:text-sm font-bold tracking-wide uppercase font-mono">
                    Chapter III : The Philosophy
                  </span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                </div>
                <span
                  className={`text-[10px] font-sans ${
                    isDark ? 'text-purple-300/70' : 'text-purple-700/80'
                  }`}
                >
                  Local-First Privacy • Tactile Stationery
                </span>
              </div>
            </div>

            {/* Pinned Sticky Heart Note Fastened to the Plaque Edge */}
            <div className="absolute -top-7 -right-8 sm:-right-10 w-12 sm:w-14 h-12 sm:h-14 pointer-events-none transform rotate-12 group-hover:rotate-[-6deg] group-hover:scale-110 transition-all duration-300 filter drop-shadow-[0_6px_14px_rgba(0,0,0,0.5)]">
              <img
                src={isDark ? pinnedHeartDark : pinnedHeartLight}
                alt="Pinned Heart Note"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Right Pencil Sketch Line with Handwritten Inscription */}
          <div className="flex-1 flex items-center ml-4 sm:ml-8">
            <span className="text-[10px] font-mono text-purple-400/60 hidden md:inline-block">
              ✦
            </span>
            <span
              className={`w-2 h-2 rounded-full mx-2 shrink-0 ${
                isDark ? 'bg-purple-400/70 shadow-[0_0_10px_rgba(168,85,247,0.7)]' : 'bg-purple-600/70'
              }`}
            />
            <div
              className={`h-[1px] w-full border-t border-dashed transition-colors ${
                isDark ? 'border-purple-400/30' : 'border-purple-500/35'
              }`}
            />
          </div>

        </div>

        {/* Bottom Handwritten Micro-Note */}
        <div className="mt-2 text-center">
          <p
            className={`text-[11px] font-mono tracking-wide ${
              isDark ? 'text-purple-300/40' : 'text-purple-700/50'
            }`}
          >
            ~ Built for researchers, writers, and curious minds ~
          </p>
        </div>
      </div>
    </div>
  );
};

export default EditorToAboutDivider;

