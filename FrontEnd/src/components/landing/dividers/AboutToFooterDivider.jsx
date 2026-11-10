import React from 'react';
import { Scissors, ArrowUp, Sparkles, Send } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import paperAirplaneDark from '../../../assets/footer/paper-airplane-dark.png';
import paperAirplaneLight from '../../../assets/footer/paper-airplane-light.png';

export const AboutToFooterDivider = () => {
  const { isDark } = useTheme();

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative w-full py-10 sm:py-14 select-none overflow-hidden z-20">
      {/* Ambient Purple Starry Backlight */}
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-24 rounded-full blur-3xl pointer-events-none transition-opacity duration-500 ${
          isDark ? 'bg-purple-900/25' : 'bg-purple-300/20'
        }`}
      />

      {/* SVG Flight Trail Trajectory */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-20 pointer-events-none max-w-7xl mx-auto px-4 opacity-50">
        <svg
          viewBox="0 0 1200 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <path
            d="M 50 40 Q 300 10, 600 40 T 1150 35"
            stroke={isDark ? 'rgba(168, 85, 247, 0.4)' : 'rgba(147, 51, 234, 0.35)'}
            strokeWidth="1.5"
            strokeDasharray="6 6"
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Top: Perforated Tear-off Coupon Line */}
        <div className="flex items-center justify-between text-xs font-mono mb-4 text-purple-400/50">
          <div className="flex items-center gap-1.5">
            <Scissors className="w-3.5 h-3.5 transform -rotate-45" />
            <span className="text-[10px] tracking-wider uppercase hidden sm:inline">
              Tear along perforation to archive notes
            </span>
          </div>
          <span className="text-[10px] tracking-widest hidden md:inline">
            - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
          </span>
          <span className="text-[10px] tracking-wider font-mono">
            ARCHIVE // DISPATCH 001
          </span>
        </div>

        {/* Central Divider Structure */}
        <div className="relative flex items-center justify-between">

          {/* Left Dashed Track */}
          <div className="flex-1 flex items-center mr-4 sm:mr-6">
            <div
              className={`h-[1px] w-full border-t border-dashed transition-colors ${
                isDark ? 'border-purple-400/35' : 'border-purple-500/35'
              }`}
            />
            <span
              className={`w-2 h-2 rounded-full mx-2 shrink-0 ${
                isDark ? 'bg-purple-400/70 shadow-[0_0_10px_rgba(168,85,247,0.7)]' : 'bg-purple-600/70'
              }`}
            />
          </div>

          {/* Centered Origami Airplane & Return to Top Stamp */}
          <div className="relative flex items-center group cursor-pointer" onClick={handleScrollToTop}>
            {/* Origami Paper Airplane Flying Across */}
            <div className="absolute -top-10 -left-12 sm:-left-16 w-14 sm:w-16 h-10 pointer-events-none transform -rotate-12 group-hover:translate-x-3 group-hover:-translate-y-2 transition-transform duration-500 filter drop-shadow-[0_6px_14px_rgba(0,0,0,0.5)]">
              <img
                src={isDark ? paperAirplaneDark : paperAirplaneLight}
                alt="Paper Airplane"
                className="w-full h-full object-contain"
              />
              {/* Star spark trail */}
              <div className="absolute -bottom-1 -left-2 text-[8px] text-amber-400 font-mono animate-pulse">
                ✦ ✧
              </div>
            </div>

            {/* Postal Stamp Plaque */}
            <div
              className={`flex items-center gap-2 sm:gap-3 px-5 sm:px-7 py-2.5 rounded-full border transition-all duration-300 shadow-xl ${
                isDark
                  ? 'bg-[#100a20]/90 border-purple-500/40 text-purple-200 shadow-[0_0_20px_rgba(147,51,234,0.2)] group-hover:border-purple-400 group-hover:shadow-[0_0_30px_rgba(168,85,247,0.35)]'
                  : 'bg-white/95 border-purple-300 text-purple-900 shadow-[0_6px_20px_rgba(147,51,234,0.12)] group-hover:border-purple-500'
              }`}
            >
              <div className="p-1 rounded-full bg-purple-500/20 text-purple-300 group-hover:-translate-y-0.5 transition-transform">
                <ArrowUp className="w-3.5 h-3.5" />
              </div>
              <div className="flex flex-col text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs sm:text-sm font-bold tracking-wide uppercase font-mono">
                    Dispatch Complete
                  </span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                </div>
                <span
                  className={`text-[10px] font-sans ${
                    isDark ? 'text-purple-300/70' : 'text-purple-700/80'
                  }`}
                >
                  Click to glide back to top ✦
                </span>
              </div>
            </div>
          </div>

          {/* Right Dashed Track */}
          <div className="flex-1 flex items-center ml-4 sm:ml-6">
            <span
              className={`w-2 h-2 rounded-full mx-2 shrink-0 ${
                isDark ? 'bg-purple-400/70 shadow-[0_0_10px_rgba(168,85,247,0.7)]' : 'bg-purple-600/70'
              }`}
            />
            <div
              className={`h-[1px] w-full border-t border-dashed transition-colors ${
                isDark ? 'border-purple-400/35' : 'border-purple-500/35'
              }`}
            />
          </div>

        </div>

      </div>
    </div>
  );
};

export default AboutToFooterDivider;
