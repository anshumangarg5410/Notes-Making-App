import React from 'react';
import {
  Sparkles,
  PenLine,
  Folder,
  Tag,
  Search,
  Cloud,
  ArrowDownToLine,
  Check,
  Star,
  CheckSquare,
  Square,
  FileText,
  BookOpen,
  ChevronDown,
  X
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import centralHologramImg from '../../assets/landing/central-book-hologram-glow.png';

export const FeaturesOverview = () => {
  const { isDark } = useTheme();

  return (
    <section
      id="features"
      className="relative w-full py-20 lg:py-28 px-4 sm:px-6 lg:px-8 select-none overflow-hidden transition-colors duration-300 bg-transparent text-white"
    >
      {/* Background Ambience & Lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Upper center purple radial glow */}
        <div
          className={`absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] sm:w-[950px] h-[550px] rounded-full blur-[140px] transition-opacity duration-500 ${
            isDark ? 'bg-purple-600/20 opacity-100' : 'bg-purple-400/15 opacity-80'
          }`}
        />
        {/* Top-right moon illumination */}
        <div
          className={`absolute top-8 right-12 w-48 h-48 rounded-full blur-[90px] transition-opacity duration-500 ${
            isDark ? 'bg-fuchsia-600/15 opacity-70' : 'bg-purple-300/25 opacity-60'
          }`}
        />
        {/* Bottom landscape mist */}
        <div
          className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-transparent to-transparent pointer-events-none"
        />
      </div>

      <div className="max-w-[1440px] mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 lg:mb-20">
          {/* Badge */}
          <div
            className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold mb-4 border transition-colors ${
              isDark
                ? 'border-purple-500/40 bg-purple-950/40 text-purple-300 shadow-[0_0_14px_rgba(168,85,247,0.3)]'
                : 'border-purple-300 bg-purple-50 text-purple-700 shadow-sm'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
            <span>Features</span>
          </div>

          {/* Main Title */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
            A Complete Knowledge Workspace{' '}
            <span className="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent">
              Built for Modern Thinking
            </span>
          </h2>

          {/* Subtitle */}
          <p
            className={`mt-4 text-sm sm:text-base lg:text-lg leading-relaxed ${
              isDark ? 'text-gray-300/80' : 'text-slate-600'
            }`}
          >
            Write, organize, search and access your notes anywhere — online or offline.
          </p>
        </div>

        {/* ============================================================== */}
        {/* INTERCONNECTED KNOWLEDGE UNIVERSE COMPOSITION */}
        {/* ============================================================== */}
        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          {/* SVG Connection Network Beams (Visible on Desktop) */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none hidden lg:block z-0"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="beamGlowLeft" x1="100%" y1="50%" x2="0%" y2="50%">
                <stop offset="0%" stopColor="#c084fc" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#a855f7" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#7e22ce" stopOpacity="0.15" />
              </linearGradient>
              <linearGradient id="beamGlowRight" x1="0%" y1="50%" x2="100%" y2="50%">
                <stop offset="0%" stopColor="#c084fc" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#a855f7" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#7e22ce" stopOpacity="0.15" />
              </linearGradient>
              <filter id="purpleBloom" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Left 3 Connecting Beams */}
            <path
              d="M 480 390 C 430 390, 420 160, 395 155"
              fill="none"
              stroke="url(#beamGlowLeft)"
              strokeWidth="2"
              strokeDasharray="4 4"
              filter="url(#purpleBloom)"
              className="animate-pulse"
            />
            <path
              d="M 470 420 C 420 420, 410 405, 395 400"
              fill="none"
              stroke="url(#beamGlowLeft)"
              strokeWidth="2.2"
              filter="url(#purpleBloom)"
            />
            <path
              d="M 480 450 C 430 450, 420 650, 395 650"
              fill="none"
              stroke="url(#beamGlowLeft)"
              strokeWidth="2"
              strokeDasharray="4 4"
              filter="url(#purpleBloom)"
              className="animate-pulse"
            />

            {/* Right 3 Connecting Beams */}
            <path
              d="M 550 390 C 600 390, 610 160, 635 155"
              fill="none"
              stroke="url(#beamGlowRight)"
              strokeWidth="2"
              strokeDasharray="4 4"
              filter="url(#purpleBloom)"
              className="animate-pulse"
            />
            <path
              d="M 560 420 C 610 420, 620 405, 635 400"
              fill="none"
              stroke="url(#beamGlowRight)"
              strokeWidth="2.2"
              filter="url(#purpleBloom)"
            />
            <path
              d="M 550 450 C 600 450, 610 650, 635 650"
              fill="none"
              stroke="url(#beamGlowRight)"
              strokeWidth="2"
              strokeDasharray="4 4"
              filter="url(#purpleBloom)"
              className="animate-pulse"
            />
          </svg>

          {/* ======================================================= */}
          {/* LEFT COLUMN: 3 Feature Panels (lg:col-span-5) */}
          {/* ======================================================= */}
          <div className="lg:col-span-5 space-y-6 lg:space-y-7 relative z-10">
            {/* PANEL 1: Advanced Rich Text Editor */}
            <div
              className={`group relative rounded-[8px] p-5 sm:p-6 transition-all duration-300 border backdrop-blur-md ${
                isDark
                  ? 'border-purple-500/35 bg-[#120a22]/85 hover:border-purple-400 hover:shadow-[0_0_30px_rgba(168,85,247,0.25)]'
                  : 'border-purple-200 bg-white/95 hover:border-purple-400 hover:shadow-[0_8px_30px_rgba(147,51,234,0.1)]'
              }`}
            >
              {/* Center-facing connector node dot */}
              <div
                className={`hidden lg:block absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 transition-transform duration-300 group-hover:scale-125 ${
                  isDark
                    ? 'bg-purple-400 border-[#090514] shadow-[0_0_10px_rgba(192,132,252,0.9)]'
                    : 'bg-purple-600 border-white shadow-[0_0_8px_rgba(147,51,234,0.6)]'
                }`}
              />

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
                {/* Left Description Area */}
                <div className="sm:col-span-6 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-[6px] bg-gradient-to-br from-purple-600 to-indigo-600 border border-purple-400/40 text-white flex items-center justify-center shadow-[0_0_12px_rgba(168,85,247,0.4)]">
                      <PenLine className="w-4 h-4" />
                    </div>
                    <h3
                      className={`text-sm sm:text-base font-bold tracking-tight leading-snug ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      Advanced
                      <br />
                      Rich Text Editor
                    </h3>
                  </div>

                  <p className={`text-xs leading-relaxed ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>
                    A powerful, distraction-free editor for notes, docs and knowledge.
                  </p>

                  <ul className="space-y-1.5 pt-1 text-[11px]">
                    <li className={`flex items-center gap-2 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                      <span className="w-4 h-4 rounded bg-purple-600/35 text-purple-300 flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5" />
                      </span>
                      <span>Rich formatting &amp; headings</span>
                    </li>
                    <li className={`flex items-center gap-2 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                      <span className="w-4 h-4 rounded bg-purple-600/35 text-purple-300 flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5" />
                      </span>
                      <span>Code blocks with syntax highlight</span>
                    </li>
                    <li className={`flex items-center gap-2 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                      <span className="w-4 h-4 rounded bg-purple-600/35 text-purple-300 flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5" />
                      </span>
                      <span>Tables, checklists and more</span>
                    </li>
                  </ul>
                </div>

                {/* Right Interactive Preview Widget */}
                <div className="sm:col-span-6">
                  <div
                    className={`rounded-[6px] border p-3 text-xs shadow-inner overflow-hidden font-sans ${
                      isDark ? 'border-purple-500/25 bg-[#170e2b]' : 'border-purple-200/80 bg-[#f8f5fc]'
                    }`}
                  >
                    {/* Window Title Bar */}
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-purple-500/15 text-[10px]">
                      <span className="font-semibold text-purple-400">NoteNest</span>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-red-500/80" />
                        <span className="w-2 h-2 rounded-full bg-amber-500/80" />
                        <span className="w-2 h-2 rounded-full bg-emerald-500/80" />
                      </div>
                    </div>

                    {/* Toolbar */}
                    <div className="flex items-center gap-1.5 text-[10px] pb-2 mb-2 border-b border-purple-500/15 text-gray-400">
                      <span className="font-bold text-gray-200 px-1 py-0.5 rounded bg-purple-950/50">B</span>
                      <span className="italic px-1">I</span>
                      <span className="underline px-1">U</span>
                      <span className="px-1">H1</span>
                      <span className="px-1">H2</span>
                      <span className="text-purple-400 px-1">&lt;/&gt;</span>
                    </div>

                    {/* Content Preview */}
                    <div className="space-y-1.5 text-[11px]">
                      <p className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        Project Planning
                      </p>
                      <div className={`flex items-center gap-1.5 text-[10.5px] ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                        <CheckSquare className="w-3 h-3 text-purple-400 shrink-0" />
                        <span>Design the architecture</span>
                      </div>
                      <div className={`flex items-center gap-1.5 text-[10.5px] ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                        <Square className="w-3 h-3 text-gray-500 shrink-0" />
                        <span>Implement the API</span>
                      </div>

                      {/* Code Block Snippet */}
                      <div
                        className={`mt-2 p-2 rounded border font-mono text-[9.5px] leading-snug ${
                          isDark
                            ? 'bg-[#0e071c] border-purple-500/20 text-purple-300'
                            : 'bg-white border-purple-200 text-purple-800'
                        }`}
                      >
                        <p><span className="text-purple-500 font-semibold">const</span> note = &#123;</p>
                        <p className="pl-3.5">title: <span className="text-amber-500">'NoteNest'</span>,</p>
                        <p className="pl-3.5">offline: <span className="text-emerald-500 font-semibold">true</span></p>
                        <p>&#125;;</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* PANEL 2: Tags & Favorites */}
            <div
              className={`group relative rounded-[8px] p-5 sm:p-6 transition-all duration-300 border backdrop-blur-md ${
                isDark
                  ? 'border-purple-500/35 bg-[#120a22]/85 hover:border-purple-400 hover:shadow-[0_0_30px_rgba(168,85,247,0.25)]'
                  : 'border-purple-200 bg-white/95 hover:border-purple-400 hover:shadow-[0_8px_30px_rgba(147,51,234,0.1)]'
              }`}
            >
              {/* Center-facing connector node dot */}
              <div
                className={`hidden lg:block absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 transition-transform duration-300 group-hover:scale-125 ${
                  isDark
                    ? 'bg-purple-400 border-[#090514] shadow-[0_0_10px_rgba(192,132,252,0.9)]'
                    : 'bg-purple-600 border-white shadow-[0_0_8px_rgba(147,51,234,0.6)]'
                }`}
              />

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
                {/* Left Description Area */}
                <div className="sm:col-span-6 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-[6px] bg-gradient-to-br from-purple-600 to-indigo-600 border border-purple-400/40 text-white flex items-center justify-center shadow-[0_0_12px_rgba(168,85,247,0.4)]">
                      <Tag className="w-4 h-4" />
                    </div>
                    <h3
                      className={`text-sm sm:text-base font-bold tracking-tight leading-snug ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      Tags &amp;
                      <br />
                      Favorites
                    </h3>
                  </div>

                  <p className={`text-xs leading-relaxed ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>
                    Add context to your notes and quickly access what matters most.
                  </p>

                  <ul className="space-y-1.5 pt-1 text-[11px]">
                    <li className={`flex items-center gap-2 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                      <span className="w-4 h-4 rounded bg-purple-600/35 text-purple-300 flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5" />
                      </span>
                      <span>Create custom tags</span>
                    </li>
                    <li className={`flex items-center gap-2 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                      <span className="w-4 h-4 rounded bg-purple-600/35 text-purple-300 flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5" />
                      </span>
                      <span>Tag notes for quick access</span>
                    </li>
                    <li className={`flex items-center gap-2 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                      <span className="w-4 h-4 rounded bg-purple-600/35 text-purple-300 flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5" />
                      </span>
                      <span>Mark important notes as favorites</span>
                    </li>
                  </ul>
                </div>

                {/* Right Interactive Preview Widget */}
                <div className="sm:col-span-6">
                  <div
                    className={`rounded-[6px] border p-4 text-xs shadow-inner space-y-3 ${
                      isDark ? 'border-purple-500/25 bg-[#170e2b]' : 'border-purple-200/80 bg-[#f8f5fc]'
                    }`}
                  >
                    {/* Tag Chips */}
                    <div className="flex flex-wrap gap-2">
                      <span
                        className={`px-2.5 py-1 rounded-[4px] border text-[11px] font-medium ${
                          isDark
                            ? 'bg-[#22153b] border-purple-500/30 text-purple-200'
                            : 'bg-purple-100/70 border-purple-300 text-purple-900'
                        }`}
                      >
                        # DSA
                      </span>
                      <span
                        className={`px-2.5 py-1 rounded-[4px] border text-[11px] font-medium ${
                          isDark
                            ? 'bg-[#22153b] border-purple-500/30 text-purple-200'
                            : 'bg-purple-100/70 border-purple-300 text-purple-900'
                        }`}
                      >
                        # React
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span
                        className={`px-2.5 py-1 rounded-[4px] border text-[11px] font-medium ${
                          isDark
                            ? 'bg-[#22153b] border-purple-500/30 text-purple-200'
                            : 'bg-purple-100/70 border-purple-300 text-purple-900'
                        }`}
                      >
                        # System Design
                      </span>
                      <span
                        className={`px-2.5 py-1 rounded-[4px] border text-[11px] font-medium ${
                          isDark
                            ? 'bg-[#22153b] border-purple-500/30 text-purple-200'
                            : 'bg-purple-100/70 border-purple-300 text-purple-900'
                        }`}
                      >
                        # Notes
                      </span>
                    </div>

                    {/* Favorite Notes Pill */}
                    <div className="pt-1">
                      <div
                        className={`flex items-center gap-2 px-3 py-2 rounded-[5px] border text-xs font-semibold ${
                          isDark
                            ? 'bg-gradient-to-r from-purple-950/60 to-purple-900/30 border-purple-500/30 text-white'
                            : 'bg-purple-50 border-purple-200 text-purple-950 shadow-xs'
                        }`}
                      >
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span>Favorite Notes</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* PANEL 3: Offline-First & Sync */}
            <div
              className={`group relative rounded-[8px] p-5 sm:p-6 transition-all duration-300 border backdrop-blur-md ${
                isDark
                  ? 'border-purple-500/35 bg-[#120a22]/85 hover:border-purple-400 hover:shadow-[0_0_30px_rgba(168,85,247,0.25)]'
                  : 'border-purple-200 bg-white/95 hover:border-purple-400 hover:shadow-[0_8px_30px_rgba(147,51,234,0.1)]'
              }`}
            >
              {/* Center-facing connector node dot */}
              <div
                className={`hidden lg:block absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 transition-transform duration-300 group-hover:scale-125 ${
                  isDark
                    ? 'bg-purple-400 border-[#090514] shadow-[0_0_10px_rgba(192,132,252,0.9)]'
                    : 'bg-purple-600 border-white shadow-[0_0_8px_rgba(147,51,234,0.6)]'
                }`}
              />

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
                {/* Left Description Area */}
                <div className="sm:col-span-6 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-[6px] bg-gradient-to-br from-purple-600 to-indigo-600 border border-purple-400/40 text-white flex items-center justify-center shadow-[0_0_12px_rgba(168,85,247,0.4)]">
                      <Cloud className="w-4 h-4" />
                    </div>
                    <h3
                      className={`text-sm sm:text-base font-bold tracking-tight leading-snug ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      Offline-First
                      <br />
                      &amp; Sync
                    </h3>
                  </div>

                  <p className={`text-xs leading-relaxed ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>
                    Work without internet and keep everything in sync across devices.
                  </p>

                  <ul className="space-y-1.5 pt-1 text-[11px]">
                    <li className={`flex items-center gap-2 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                      <span className="w-4 h-4 rounded bg-purple-600/35 text-purple-300 flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5" />
                      </span>
                      <span>Full offline access</span>
                    </li>
                    <li className={`flex items-center gap-2 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                      <span className="w-4 h-4 rounded bg-purple-600/35 text-purple-300 flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5" />
                      </span>
                      <span>Automatic background sync</span>
                    </li>
                    <li className={`flex items-center gap-2 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                      <span className="w-4 h-4 rounded bg-purple-600/35 text-purple-300 flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5" />
                      </span>
                      <span>Safe conflict resolution</span>
                    </li>
                  </ul>
                </div>

                {/* Right Interactive Preview Widget */}
                <div className="sm:col-span-6">
                  <div
                    className={`rounded-[6px] border p-4 text-xs shadow-inner flex flex-col items-center justify-center text-center space-y-3 ${
                      isDark ? 'border-purple-500/25 bg-[#170e2b]' : 'border-purple-200/80 bg-[#f8f5fc]'
                    }`}
                  >
                    {/* Device & Sync Visualization */}
                    <div className="relative flex items-center justify-center py-2 w-full">
                      {/* Laptop */}
                      <div
                        className={`relative px-3 py-2 rounded-[5px] border shadow-md flex items-center justify-center ${
                          isDark
                            ? 'bg-[#22153b] border-purple-500/40 text-purple-300'
                            : 'bg-white border-purple-200 text-purple-700'
                        }`}
                      >
                        <BookOpen className="w-5 h-5" />
                      </div>

                      {/* Floating Cloud */}
                      <div
                        className={`absolute right-2 top-0 px-2 py-1 rounded-[4px] border ${
                          isDark
                            ? 'bg-purple-950/60 border-purple-500/30 text-purple-300'
                            : 'bg-purple-100 border-purple-200 text-purple-700'
                        }`}
                      >
                        <Cloud className="w-4 h-4" />
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 text-[10.5px] font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Synced</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ======================================================= */}
          {/* CENTERPIECE: Holographic Emblem & Universe Hub (lg:col-span-2) */}
          {/* ======================================================= */}
          <div className="lg:col-span-2 flex flex-col items-center justify-center py-8 lg:py-0 relative z-20">
            {/* Concentric Glowing Orbital Rings */}
            <div className="relative w-52 sm:w-64 h-52 sm:h-64 flex items-center justify-center">
              {/* Outer Orbit Circle */}
              <div
                className={`absolute inset-0 rounded-full border border-dashed transition-colors ${
                  isDark ? 'border-purple-500/25' : 'border-purple-300/40'
                } animate-spin-slow opacity-60`}
              />

              {/* Mid Elliptical Orbit */}
              <div
                className={`absolute inset-6 rounded-full border ${
                  isDark
                    ? 'border-purple-400/30 shadow-[0_0_20px_rgba(168,85,247,0.25)]'
                    : 'border-purple-300/60 shadow-[0_0_15px_rgba(147,51,234,0.15)]'
                }`}
              />

              {/* Central Glowing 3D Emblem Container */}
              <div
                className={`relative z-10 w-28 sm:w-36 h-28 sm:h-36 rounded-[12px] border-2 shadow-2xl flex items-center justify-center transform -rotate-12 hover:rotate-0 transition-transform duration-500 group cursor-pointer backdrop-blur-md ${
                  isDark
                    ? 'bg-gradient-to-tr from-purple-950/70 via-[#271447]/90 to-purple-800/50 border-purple-400/60 shadow-[0_0_40px_rgba(168,85,247,0.5)]'
                    : 'bg-gradient-to-tr from-purple-100 via-white to-purple-50 border-purple-400/80 shadow-[0_0_30px_rgba(147,51,234,0.25)]'
                }`}
              >
                {/* Central Holographic Image Crop */}
                <img
                  src={centralHologramImg}
                  alt="NoteNest Knowledge Universe"
                  className="w-full h-full object-contain drop-shadow-[0_0_20px_rgba(192,132,252,0.8)] p-2 group-hover:scale-105 transition-transform"
                />

                {/* Ambient Beacon Highlights */}
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-purple-300 shadow-[0_0_10px_rgba(216,180,254,1)] animate-ping" />
              </div>
            </div>
          </div>

          {/* ======================================================= */}
          {/* RIGHT COLUMN: 3 Feature Panels (lg:col-span-5) */}
          {/* ======================================================= */}
          <div className="lg:col-span-5 space-y-6 lg:space-y-7 relative z-10">
            {/* PANEL 4: Folders & Nested Folders */}
            <div
              className={`group relative rounded-[8px] p-5 sm:p-6 transition-all duration-300 border backdrop-blur-md ${
                isDark
                  ? 'border-purple-500/35 bg-[#120a22]/85 hover:border-purple-400 hover:shadow-[0_0_30px_rgba(168,85,247,0.25)]'
                  : 'border-purple-200 bg-white/95 hover:border-purple-400 hover:shadow-[0_8px_30px_rgba(147,51,234,0.1)]'
              }`}
            >
              {/* Center-facing connector node dot */}
              <div
                className={`hidden lg:block absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 transition-transform duration-300 group-hover:scale-125 ${
                  isDark
                    ? 'bg-purple-400 border-[#090514] shadow-[0_0_10px_rgba(192,132,252,0.9)]'
                    : 'bg-purple-600 border-white shadow-[0_0_8px_rgba(147,51,234,0.6)]'
                }`}
              />

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
                {/* Left Description Area */}
                <div className="sm:col-span-6 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-[6px] bg-gradient-to-br from-purple-600 to-indigo-600 border border-purple-400/40 text-white flex items-center justify-center shadow-[0_0_12px_rgba(168,85,247,0.4)]">
                      <Folder className="w-4 h-4" />
                    </div>
                    <h3
                      className={`text-sm sm:text-base font-bold tracking-tight leading-snug ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      Folders &amp;
                      <br />
                      Nested Folders
                    </h3>
                  </div>

                  <p className={`text-xs leading-relaxed ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>
                    Keep your notes structured with a flexible, hierarchical folder system.
                  </p>

                  <ul className="space-y-1.5 pt-1 text-[11px]">
                    <li className={`flex items-center gap-2 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                      <span className="w-4 h-4 rounded bg-purple-600/35 text-purple-300 flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5" />
                      </span>
                      <span>Create unlimited folders</span>
                    </li>
                    <li className={`flex items-center gap-2 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                      <span className="w-4 h-4 rounded bg-purple-600/35 text-purple-300 flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5" />
                      </span>
                      <span>Nested folder hierarchy</span>
                    </li>
                    <li className={`flex items-center gap-2 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                      <span className="w-4 h-4 rounded bg-purple-600/35 text-purple-300 flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5" />
                      </span>
                      <span>Move and organize easily</span>
                    </li>
                  </ul>
                </div>

                {/* Right Interactive Preview Widget */}
                <div className="sm:col-span-6">
                  <div
                    className={`rounded-[6px] border p-3 text-xs shadow-inner font-sans space-y-1.5 ${
                      isDark ? 'border-purple-500/25 bg-[#170e2b]' : 'border-purple-200/80 bg-[#f8f5fc]'
                    }`}
                  >
                    {/* Root Folder Header */}
                    <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                      <ChevronDown className="w-3 h-3 text-purple-400" />
                      <span className={`font-semibold ${isDark ? 'text-gray-200' : 'text-slate-800'}`}>
                        My Folders
                      </span>
                    </div>

                    {/* Subfolders */}
                    <div className="pl-3 space-y-1 text-[10.5px]">
                      <div className={`flex items-center gap-1.5 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                        <Folder className="w-3 h-3 text-purple-400" />
                        <span>College</span>
                      </div>

                      <div className="space-y-1">
                        <div className={`flex items-center gap-1 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                          <ChevronDown className="w-2.5 h-2.5 text-purple-400" />
                          <Folder className="w-3 h-3 text-purple-400" />
                          <span className="font-medium">Projects</span>
                        </div>

                        {/* Nested Items */}
                        <div className="pl-4 space-y-1">
                          <div className="px-2 py-0.5 rounded-[4px] bg-purple-600/80 text-white font-semibold flex items-center gap-1 shadow-sm">
                            <FileText className="w-2.5 h-2.5" />
                            <span>NoteNest</span>
                          </div>
                          <div className={`px-2 py-0.5 flex items-center gap-1 ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                            <FileText className="w-2.5 h-2.5" />
                            <span>API Gateway</span>
                          </div>
                          <div className={`px-2 py-0.5 flex items-center gap-1 ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                            <FileText className="w-2.5 h-2.5" />
                            <span>Traffic System</span>
                          </div>
                        </div>
                      </div>

                      <div className={`flex items-center gap-1.5 pt-0.5 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                        <Folder className="w-3 h-3 text-purple-400" />
                        <span>Personal</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* PANEL 5: Powerful Search */}
            <div
              className={`group relative rounded-[8px] p-5 sm:p-6 transition-all duration-300 border backdrop-blur-md ${
                isDark
                  ? 'border-purple-500/35 bg-[#120a22]/85 hover:border-purple-400 hover:shadow-[0_0_30px_rgba(168,85,247,0.25)]'
                  : 'border-purple-200 bg-white/95 hover:border-purple-400 hover:shadow-[0_8px_30px_rgba(147,51,234,0.1)]'
              }`}
            >
              {/* Center-facing connector node dot */}
              <div
                className={`hidden lg:block absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 transition-transform duration-300 group-hover:scale-125 ${
                  isDark
                    ? 'bg-purple-400 border-[#090514] shadow-[0_0_10px_rgba(192,132,252,0.9)]'
                    : 'bg-purple-600 border-white shadow-[0_0_8px_rgba(147,51,234,0.6)]'
                }`}
              />

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
                {/* Left Description Area */}
                <div className="sm:col-span-6 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-[6px] bg-gradient-to-br from-purple-600 to-indigo-600 border border-purple-400/40 text-white flex items-center justify-center shadow-[0_0_12px_rgba(168,85,247,0.4)]">
                      <Search className="w-4 h-4" />
                    </div>
                    <h3
                      className={`text-sm sm:text-base font-bold tracking-tight leading-snug ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      Powerful
                      <br />
                      Search
                    </h3>
                  </div>

                  <p className={`text-xs leading-relaxed ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>
                    Find any note in seconds with fast, full-text search and filters.
                  </p>

                  <ul className="space-y-1.5 pt-1 text-[11px]">
                    <li className={`flex items-center gap-2 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                      <span className="w-4 h-4 rounded bg-purple-600/35 text-purple-300 flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5" />
                      </span>
                      <span>Search titles and content</span>
                    </li>
                    <li className={`flex items-center gap-2 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                      <span className="w-4 h-4 rounded bg-purple-600/35 text-purple-300 flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5" />
                      </span>
                      <span>Filter by folder, tag or favorites</span>
                    </li>
                    <li className={`flex items-center gap-2 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                      <span className="w-4 h-4 rounded bg-purple-600/35 text-purple-300 flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5" />
                      </span>
                      <span>Sort by date and relevance</span>
                    </li>
                  </ul>
                </div>

                {/* Right Interactive Preview Widget */}
                <div className="sm:col-span-6">
                  <div
                    className={`rounded-[6px] border p-3 text-xs shadow-inner space-y-2 ${
                      isDark ? 'border-purple-500/25 bg-[#170e2b]' : 'border-purple-200/80 bg-[#f8f5fc]'
                    }`}
                  >
                    {/* Search Input Simulation */}
                    <div
                      className={`flex items-center justify-between px-2.5 py-1.5 rounded-[4px] border text-xs ${
                        isDark
                          ? 'bg-[#0e071c] border-purple-500/30 text-white'
                          : 'bg-white border-purple-300 text-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Search className="w-3.5 h-3.5 text-purple-500" />
                        <span className="font-mono text-purple-400">database</span>
                      </div>
                      <X className="w-3.5 h-3.5 text-gray-400 cursor-pointer" />
                    </div>

                    <div className="text-[10px] text-gray-400 px-0.5">3 results</div>

                    {/* Results List */}
                    <div className="space-y-1.5">
                      <div
                        className={`p-1.5 rounded-[4px] border ${
                          isDark
                            ? 'bg-[#22153b] border-purple-500/20'
                            : 'bg-white border-purple-200/90'
                        }`}
                      >
                        <p
                          className={`text-[11px] font-semibold flex items-center gap-1.5 ${
                            isDark ? 'text-white' : 'text-slate-900'
                          }`}
                        >
                          <FileText className="w-3 h-3 text-purple-400" />
                          <span>DBMS Notes</span>
                        </p>
                        <p className={`text-[9.5px] truncate mt-0.5 ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                          ... database normalization ...
                        </p>
                      </div>

                      <div
                        className={`p-1.5 rounded-[4px] border ${
                          isDark
                            ? 'bg-[#1a102e] border-purple-500/15'
                            : 'bg-white border-purple-100'
                        }`}
                      >
                        <p
                          className={`text-[11px] font-semibold flex items-center gap-1.5 ${
                            isDark ? 'text-gray-200' : 'text-slate-800'
                          }`}
                        >
                          <FileText className="w-3 h-3 text-purple-400" />
                          <span>SQL Queries</span>
                        </p>
                        <p className={`text-[9.5px] truncate mt-0.5 ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                          ... joins, indexes, database ...
                        </p>
                      </div>

                      <div
                        className={`p-1.5 rounded-[4px] border ${
                          isDark
                            ? 'bg-[#1a102e] border-purple-500/15'
                            : 'bg-white border-purple-100'
                        }`}
                      >
                        <p
                          className={`text-[11px] font-semibold flex items-center gap-1.5 ${
                            isDark ? 'text-gray-200' : 'text-slate-800'
                          }`}
                        >
                          <FileText className="w-3 h-3 text-purple-400" />
                          <span>System Design</span>
                        </p>
                        <p className={`text-[9.5px] truncate mt-0.5 ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                          ... database scaling strategies ...
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* PANEL 6: Import & Export */}
            <div
              className={`group relative rounded-[8px] p-5 sm:p-6 transition-all duration-300 border backdrop-blur-md ${
                isDark
                  ? 'border-purple-500/35 bg-[#120a22]/85 hover:border-purple-400 hover:shadow-[0_0_30px_rgba(168,85,247,0.25)]'
                  : 'border-purple-200 bg-white/95 hover:border-purple-400 hover:shadow-[0_8px_30px_rgba(147,51,234,0.1)]'
              }`}
            >
              {/* Center-facing connector node dot */}
              <div
                className={`hidden lg:block absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 transition-transform duration-300 group-hover:scale-125 ${
                  isDark
                    ? 'bg-purple-400 border-[#090514] shadow-[0_0_10px_rgba(192,132,252,0.9)]'
                    : 'bg-purple-600 border-white shadow-[0_0_8px_rgba(147,51,234,0.6)]'
                }`}
              />

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
                {/* Left Description Area */}
                <div className="sm:col-span-6 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-[6px] bg-gradient-to-br from-purple-600 to-indigo-600 border border-purple-400/40 text-white flex items-center justify-center shadow-[0_0_12px_rgba(168,85,247,0.4)]">
                      <ArrowDownToLine className="w-4 h-4" />
                    </div>
                    <h3
                      className={`text-sm sm:text-base font-bold tracking-tight leading-snug ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      Import &amp;
                      <br />
                      Export
                    </h3>
                  </div>

                  <p className={`text-xs leading-relaxed ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>
                    Bring in your existing notes or take your data anywhere.
                  </p>

                  <ul className="space-y-1.5 pt-1 text-[11px]">
                    <li className={`flex items-center gap-2 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                      <span className="w-4 h-4 rounded bg-purple-600/35 text-purple-300 flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5" />
                      </span>
                      <span>Import Markdown files</span>
                    </li>
                    <li className={`flex items-center gap-2 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                      <span className="w-4 h-4 rounded bg-purple-600/35 text-purple-300 flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5" />
                      </span>
                      <span>Export notes as Markdown</span>
                    </li>
                    <li className={`flex items-center gap-2 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                      <span className="w-4 h-4 rounded bg-purple-600/35 text-purple-300 flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5" />
                      </span>
                      <span>Export notes as PDF</span>
                    </li>
                  </ul>
                </div>

                {/* Right Interactive Preview Widget */}
                <div className="sm:col-span-6">
                  <div
                    className={`rounded-[6px] border p-4 text-xs shadow-inner space-y-3 ${
                      isDark ? 'border-purple-500/25 bg-[#170e2b]' : 'border-purple-200/80 bg-[#f8f5fc]'
                    }`}
                  >
                    {/* Markdown Document Card */}
                    <div
                      className={`flex items-center gap-3 p-2.5 rounded-[5px] border ${
                        isDark
                          ? 'bg-[#22153b] border-purple-500/30'
                          : 'bg-white border-purple-200 shadow-xs'
                      }`}
                    >
                      <span className="px-1.5 py-0.5 text-[10px] font-bold font-mono bg-purple-600 text-white rounded">
                        MD
                      </span>
                      <span className={`text-xs font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        Markdown (.md)
                      </span>
                    </div>

                    {/* PDF Document Card */}
                    <div
                      className={`flex items-center gap-3 p-2.5 rounded-[5px] border ${
                        isDark
                          ? 'bg-[#22153b] border-purple-500/30'
                          : 'bg-white border-purple-200 shadow-xs'
                      }`}
                    >
                      <span className="px-1.5 py-0.5 text-[10px] font-bold font-mono bg-rose-600 text-white rounded">
                        PDF
                      </span>
                      <span className={`text-xs font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        PDF Document
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesOverview;
