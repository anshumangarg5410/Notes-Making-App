import React, { useState } from 'react';
import {
  PenLine,
  Type,
  Code2,
  Table,
  CheckSquare,
  Image as ImageIcon,
  Quote
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import editorMainImg from '../../assets/landing/editor-main-showcase.png';

export const EditorShowcase = () => {
  const { isDark } = useTheme();
  const [activeFeature, setActiveFeature] = useState(null);

  // Left column 3 features
  const leftFeatures = [
    {
      id: 'rich-formatting',
      icon: Type,
      title: 'Rich Formatting',
      subtitle: 'Bold, italic, underline, headings and more',
      // Hotspot on the editor screenshot (percentage)
      hotspot: { top: '3%', left: '40%', width: '48%', height: '8%' },
      anchorY: 75, // SVG vertical coordinate for connecting line
      targetPoint: { x: 380, y: 75 }
    },
    {
      id: 'code-blocks',
      icon: Code2,
      title: 'Code Blocks',
      subtitle: 'Write and highlight code effortlessly',
      hotspot: { top: '48%', left: '42%', width: '38%', height: '22%' },
      anchorY: 250,
      targetPoint: { x: 420, y: 310 }
    },
    {
      id: 'tables',
      icon: Table,
      title: 'Tables',
      subtitle: 'Organize information with clean tables',
      hotspot: { top: '72%', left: '42%', width: '38%', height: '18%' },
      anchorY: 425,
      targetPoint: { x: 420, y: 440 }
    }
  ];

  // Right column 3 features
  const rightFeatures = [
    {
      id: 'checklists',
      icon: CheckSquare,
      title: 'Checklists',
      subtitle: 'Track tasks and stay productive',
      hotspot: { top: '28%', left: '43%', width: '28%', height: '17%' },
      anchorY: 75,
      targetPoint: { x: 620, y: 190 }
    },
    {
      id: 'images-media',
      icon: ImageIcon,
      title: 'Images & Media',
      subtitle: 'Add images and visuals to your notes',
      hotspot: { top: '20%', left: '74%', width: '23%', height: '26%' },
      anchorY: 250,
      targetPoint: { x: 745, y: 190 }
    },
    {
      id: 'blockquotes',
      icon: Quote,
      title: 'Blockquotes',
      subtitle: 'Highlight key ideas and references',
      hotspot: { top: '21%', left: '43%', width: '30%', height: '6%' },
      anchorY: 425,
      targetPoint: { x: 500, y: 135 }
    }
  ];

  // Chamfered polygon style for callout cards
  const chamferedStyle = {
    clipPath:
      'polygon(12px 0%, calc(100% - 12px) 0%, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0% calc(100% - 12px), 0% 12px)'
  };

  const renderCalloutCard = (item, side) => {
    const Icon = item.icon;
    const isActive = activeFeature === item.id;

    return (
      <div
        key={item.id}
        onMouseEnter={() => setActiveFeature(item.id)}
        onMouseLeave={() => setActiveFeature(null)}
        onClick={() => setActiveFeature(isActive ? null : item.id)}
        className="group relative cursor-pointer transition-all duration-300"
      >
        {/* Chamfered Outer Border Gradient */}
        <div
          style={chamferedStyle}
          className={`p-[1.5px] transition-all duration-300 ${
            isActive
              ? 'bg-gradient-to-r from-purple-400 via-fuchsia-400 to-purple-400 shadow-[0_0_30px_rgba(192,132,252,0.6)] scale-[1.02]'
              : isDark
              ? 'bg-gradient-to-r from-purple-500/40 via-purple-600/25 to-purple-800/40 hover:from-purple-400 hover:to-fuchsia-500 hover:shadow-[0_0_20px_rgba(168,85,247,0.35)]'
              : 'bg-gradient-to-r from-purple-300 via-purple-200 to-indigo-300 hover:from-purple-400 hover:to-indigo-500 hover:shadow-[0_4px_20px_rgba(168,85,247,0.2)]'
          }`}
        >
          {/* Chamfered Inner Card Surface */}
          <div
            style={chamferedStyle}
            className={`p-4 sm:p-5 flex items-center gap-4 transition-colors duration-300 backdrop-blur-md ${
              isDark
                ? isActive
                  ? 'bg-[#180e38]'
                  : 'bg-[#100826]/90 group-hover:bg-[#140b30]/95'
                : isActive
                ? 'bg-purple-50/95'
                : 'bg-white/95 group-hover:bg-purple-50/70'
            }`}
          >
            {/* Square Icon Container */}
            <div
              className={`w-11 h-11 sm:w-12 sm:h-12 shrink-0 rounded-[8px] flex items-center justify-center border transition-all duration-300 ${
                isActive
                  ? 'border-purple-300 bg-purple-600 text-white shadow-[0_0_15px_rgba(192,132,252,0.8)]'
                  : isDark
                  ? 'border-purple-500/40 bg-purple-950/50 text-purple-300 group-hover:border-purple-400 group-hover:bg-purple-900/60 shadow-[0_0_12px_rgba(168,85,247,0.25)]'
                  : 'border-purple-300 bg-purple-100 text-purple-700 group-hover:border-purple-400 group-hover:bg-purple-200 shadow-sm'
              }`}
            >
              <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>

            {/* Text Information */}
            <div className="flex-1 min-w-0">
              <h4
                className={`text-sm sm:text-base font-bold tracking-tight truncate transition-colors ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                {item.title}
              </h4>
              <p
                className={`text-xs sm:text-[13px] leading-snug mt-0.5 line-clamp-2 transition-colors ${
                  isDark ? 'text-purple-200/70' : 'text-slate-500'
                }`}
              >
                {item.subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Small connector node on the inner edge (Desktop only) */}
        <div
          className={`hidden xl:block absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full border-2 transition-all duration-300 pointer-events-none ${
            side === 'left' ? '-right-1.5' : '-left-1.5'
          } ${
            isActive
              ? 'bg-fuchsia-300 border-white scale-150 shadow-[0_0_10px_#f0abfc]'
              : isDark
              ? 'bg-purple-400 border-[#0a0518] shadow-[0_0_8px_#c084fc]'
              : 'bg-purple-600 border-white shadow-[0_0_6px_#9333ea]'
          }`}
        />
      </div>
    );
  };

  return (
    <section
      id="editor-showcase"
      className="relative w-full py-20 lg:py-28 px-4 sm:px-6 lg:px-8 select-none overflow-hidden transition-colors duration-300 bg-transparent text-white"
    >
      {/* Background Ambience & Lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Top central purple radial light */}
        <div
          className={`absolute top-0 left-1/2 -translate-x-1/2 w-[800px] lg:w-[1100px] h-[550px] rounded-full blur-[150px] transition-opacity duration-500 ${
            isDark ? 'bg-purple-600/20 opacity-100' : 'bg-purple-400/15 opacity-80'
          }`}
        />

        {/* Subtle starlight specks in dark mode */}
        {isDark && (
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                'radial-gradient(1px 1px at 20px 30px, #e9d5ff, rgba(0,0,0,0)), radial-gradient(1.5px 1.5px at 120px 180px, #c084fc, rgba(0,0,0,0)), radial-gradient(1px 1px at 280px 80px, #ffffff, rgba(0,0,0,0)), radial-gradient(1px 1px at 420px 240px, #d8b4fe, rgba(0,0,0,0)), radial-gradient(1.5px 1.5px at 700px 120px, #c084fc, rgba(0,0,0,0)), radial-gradient(1px 1px at 900px 210px, #ffffff, rgba(0,0,0,0))',
              backgroundSize: '550px 350px'
            }}
          />
        )}

        {/* Bottom Horizon Mountain Silhouette & Neon Beam */}
        <div className="absolute bottom-0 inset-x-0 h-48 pointer-events-none overflow-hidden">
          {/* Luminous Horizon Beam */}
          <div
            className={`absolute bottom-6 inset-x-0 h-[2px] transition-opacity duration-500 ${
              isDark
                ? 'bg-gradient-to-r from-transparent via-purple-500 to-transparent shadow-[0_0_24px_rgba(192,132,252,0.9)] opacity-90'
                : 'bg-gradient-to-r from-transparent via-purple-300 to-transparent opacity-60'
            }`}
          />
          {/* Horizon mist glow */}
          <div
            className={`absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t ${
              isDark
                ? 'from-purple-950/40 via-purple-900/15 to-transparent'
                : 'from-purple-100/50 via-purple-50/20 to-transparent'
            }`}
          />
          {/* SVG Mountain Silhouettes */}
          <svg
            className={`absolute bottom-0 inset-x-0 w-full h-24 object-cover ${
              isDark ? 'text-[#06030e] fill-current opacity-95' : 'text-purple-100/70 fill-current opacity-60'
            }`}
            viewBox="0 0 1440 120"
            preserveAspectRatio="none"
          >
            <path d="M0,120 L0,75 L120,40 L220,70 L340,25 L460,80 L580,35 L680,65 L780,20 L900,75 L1020,30 L1140,80 L1260,35 L1360,65 L1440,40 L1440,120 Z" />
            <path
              d="M0,120 L0,90 L90,65 L180,85 L280,50 L400,95 L520,60 L640,85 L740,55 L860,90 L980,50 L1100,90 L1220,60 L1320,85 L1440,65 L1440,120 Z"
              opacity="0.6"
            />
          </svg>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto relative z-10">
        {/* ============================================================== */}
        {/* TOP HEADING AREA */}
        {/* ============================================================== */}
        <div className="text-center max-w-3xl mx-auto mb-14 lg:mb-16">
          {/* Outlined Badge */}
          <div
            className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold mb-4 border transition-colors ${
              isDark
                ? 'border-purple-500/40 bg-purple-950/40 text-purple-300 shadow-[0_0_14px_rgba(168,85,247,0.3)]'
                : 'border-purple-300 bg-purple-50 text-purple-700 shadow-sm'
            }`}
          >
            <PenLine className="w-3.5 h-3.5 text-purple-400" />
            <span>Editor Showcase</span>
          </div>

          {/* Main Heading with Highlighted "Everything in Between" */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
            A Powerful Editor for
            <br />
            Ideas, Code and{' '}
            <span className="relative inline-block text-purple-400 drop-shadow-[0_0_18px_rgba(192,132,252,0.6)]">
              Everything in Between
              {/* Hand-drawn purple underline accent */}
              <svg
                className="absolute -bottom-2 left-0 w-full h-3 overflow-visible pointer-events-none"
                viewBox="0 0 240 12"
                fill="none"
              >
                <path
                  d="M 2 8 C 50 2, 110 11, 160 5 C 190 2, 220 8, 238 6"
                  stroke="#c084fc"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <path
                  d="M 12 10 C 60 4, 120 13, 170 7 C 200 4, 225 10, 235 8"
                  stroke="#a855f7"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  opacity="0.7"
                />
              </svg>
            </span>
          </h2>

          {/* Subtitle */}
          <p
            className={`mt-5 text-sm sm:text-base lg:text-lg leading-relaxed ${
              isDark ? 'text-gray-300/80' : 'text-slate-600'
            }`}
          >
            A distraction-free, feature-rich editor that lets you write, format, and organize your thoughts the way you want.
          </p>
        </div>

        {/* ============================================================== */}
        {/* DESKTOP SHOWCASE COMPOSITION (3 Left Callouts - Center Editor - 3 Right Callouts) */}
        {/* ============================================================== */}
        <div className="relative mt-6 lg:mt-10">
          {/* Desktop SVG Connecting Lines Layer (xl: visible) */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none hidden xl:block z-20"
            viewBox="0 0 1280 560"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="calloutLineGradLeft" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#c084fc" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#a855f7" stopOpacity="0.4" />
              </linearGradient>
              <linearGradient id="calloutLineGradRight" x1="100%" y1="0%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#c084fc" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#a855f7" stopOpacity="0.4" />
              </linearGradient>
              <filter id="neonBeamGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Left 1: Rich Formatting -> Toolbar */}
            <path
              d="M 270 75 L 340 75 L 375 75"
              fill="none"
              stroke={activeFeature === 'rich-formatting' ? '#f0abfc' : '#a855f7'}
              strokeWidth={activeFeature === 'rich-formatting' ? '2.5' : '1.5'}
              strokeDasharray={activeFeature === 'rich-formatting' ? 'none' : '3 3'}
              filter="url(#neonBeamGlow)"
              className="transition-all duration-300"
            />
            <circle
              cx="375"
              cy="75"
              r={activeFeature === 'rich-formatting' ? '4.5' : '3'}
              fill="#c084fc"
              className="transition-all duration-300"
            />

            {/* Left 2: Code Blocks -> Code Area */}
            <path
              d="M 270 250 L 330 250 L 375 275"
              fill="none"
              stroke={activeFeature === 'code-blocks' ? '#f0abfc' : '#a855f7'}
              strokeWidth={activeFeature === 'code-blocks' ? '2.5' : '1.5'}
              filter="url(#neonBeamGlow)"
              className="transition-all duration-300"
            />
            <circle
              cx="375"
              cy="275"
              r={activeFeature === 'code-blocks' ? '4.5' : '3'}
              fill="#c084fc"
              className="transition-all duration-300"
            />

            {/* Left 3: Tables -> Table Area */}
            <path
              d="M 270 425 L 330 425 L 375 410"
              fill="none"
              stroke={activeFeature === 'tables' ? '#f0abfc' : '#a855f7'}
              strokeWidth={activeFeature === 'tables' ? '2.5' : '1.5'}
              strokeDasharray={activeFeature === 'tables' ? 'none' : '3 3'}
              filter="url(#neonBeamGlow)"
              className="transition-all duration-300"
            />
            <circle
              cx="375"
              cy="410"
              r={activeFeature === 'tables' ? '4.5' : '3'}
              fill="#c084fc"
              className="transition-all duration-300"
            />

            {/* Right 1: Checklists -> Checklist Area */}
            <path
              d="M 1010 75 L 945 75 L 905 130"
              fill="none"
              stroke={activeFeature === 'checklists' ? '#f0abfc' : '#a855f7'}
              strokeWidth={activeFeature === 'checklists' ? '2.5' : '1.5'}
              strokeDasharray={activeFeature === 'checklists' ? 'none' : '3 3'}
              filter="url(#neonBeamGlow)"
              className="transition-all duration-300"
            />
            <circle
              cx="905"
              cy="130"
              r={activeFeature === 'checklists' ? '4.5' : '3'}
              fill="#c084fc"
              className="transition-all duration-300"
            />

            {/* Right 2: Images & Media -> Photo Card */}
            <path
              d="M 1010 250 L 945 250 L 905 210"
              fill="none"
              stroke={activeFeature === 'images-media' ? '#f0abfc' : '#a855f7'}
              strokeWidth={activeFeature === 'images-media' ? '2.5' : '1.5'}
              filter="url(#neonBeamGlow)"
              className="transition-all duration-300"
            />
            <circle
              cx="905"
              cy="210"
              r={activeFeature === 'images-media' ? '4.5' : '3'}
              fill="#c084fc"
              className="transition-all duration-300"
            />

            {/* Right 3: Blockquotes -> Blockquote Area */}
            <path
              d="M 1010 425 L 945 425 L 905 385"
              fill="none"
              stroke={activeFeature === 'blockquotes' ? '#f0abfc' : '#a855f7'}
              strokeWidth={activeFeature === 'blockquotes' ? '2.5' : '1.5'}
              strokeDasharray={activeFeature === 'blockquotes' ? 'none' : '3 3'}
              filter="url(#neonBeamGlow)"
              className="transition-all duration-300"
            />
            <circle
              cx="905"
              cy="385"
              r={activeFeature === 'blockquotes' ? '4.5' : '3'}
              fill="#c084fc"
              className="transition-all duration-300"
            />
          </svg>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-center">
            {/* ======================================================= */}
            {/* LEFT COLUMN: 3 Feature Callout Cards (Hidden on mobile, shown in xl) */}
            {/* ======================================================= */}
            <div className="hidden xl:flex xl:col-span-3 flex-col justify-between h-[510px] py-3 z-30">
              {leftFeatures.map((item) => renderCalloutCard(item, 'left'))}
            </div>

            {/* ======================================================= */}
            {/* CENTER COLUMN: Large Obsidian Editor Showcase Frame */}
            {/* ======================================================= */}
            <div className="xl:col-span-6 relative z-10 flex flex-col items-center">
              {/* Outer Decorative Skewed Plates (Cinematic Backdrop) */}
              <div
                aria-hidden="true"
                className="absolute -inset-4 sm:-inset-6 rounded-3xl opacity-60 pointer-events-none"
                style={{
                  background:
                    'radial-gradient(ellipse at center, rgba(168,85,247,0.3) 0%, rgba(126,34,206,0.1) 50%, transparent 75%)'
                }}
              />

              {/* Angled Backdrop Frame (Echoing the visual reference screenshot) */}
              <div
                aria-hidden="true"
                style={chamferedStyle}
                className="absolute -top-3 -bottom-3 -inset-x-2 sm:-inset-x-4 border border-purple-500/25 bg-purple-950/20 backdrop-blur-sm pointer-events-none"
              />

              {/* Main Beveled Editor Container (Dark in both themes as specified) */}
              <div className="relative w-full rounded-2xl p-[1.5px] bg-gradient-to-b from-purple-400/50 via-purple-600/30 to-purple-900/60 shadow-[0_0_50px_rgba(168,85,247,0.35)] transition-all duration-300">
                <div className="rounded-[15px] overflow-hidden bg-[#0a0614] border border-purple-500/30 relative">
                  {/* Window Glow Beam on Top Rim */}
                  <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-purple-300 to-transparent shadow-[0_0_12px_#c084fc] z-20" />

                  {/* High-Resolution Isolated Editor Image */}
                  <img
                    src={editorMainImg}
                    alt="NoteNest Rich-Text Editor Showcase"
                    className="w-full h-auto block select-none pointer-events-none"
                    loading="lazy"
                  />

                  {/* Interactive Hotspot Indicators on hover/click */}
                  {[...leftFeatures, ...rightFeatures].map((item) => {
                    const isActive = activeFeature === item.id;
                    if (!isActive) return null;

                    return (
                      <div
                        key={`hotspot-${item.id}`}
                        style={{
                          top: item.hotspot.top,
                          left: item.hotspot.left,
                          width: item.hotspot.width,
                          height: item.hotspot.height
                        }}
                        className="absolute z-30 rounded-lg border-2 border-fuchsia-400 bg-purple-500/20 shadow-[0_0_20px_rgba(232,121,249,0.7)] animate-pulse pointer-events-none transition-all duration-300"
                      />
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ======================================================= */}
            {/* RIGHT COLUMN: 3 Feature Callout Cards (Hidden on mobile, shown in xl) */}
            {/* ======================================================= */}
            <div className="hidden xl:flex xl:col-span-3 flex-col justify-between h-[510px] py-3 z-30">
              {rightFeatures.map((item) => renderCalloutCard(item, 'right'))}
            </div>
          </div>

          {/* ============================================================== */}
          {/* RESPONSIVE CALLOUT GRID (Visible on Mobile & Tablet < xl) */}
          {/* ============================================================== */}
          <div className="xl:hidden mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...leftFeatures, ...rightFeatures].map((item, idx) =>
              renderCalloutCard(item, idx < 3 ? 'left' : 'right')
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EditorShowcase;
