import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, Zap, RefreshCw, Smartphone, Sparkles, Check, X } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import editorPreviewDark from '../../assets/landing/editor-preview-dark.png';
import editorPreviewLight from '../../assets/landing/editor-preview-light.png';
import stickyHeartDark from '../../assets/landing/sticky-heart-dark.png';
import binderClipDark from '../../assets/landing/binder-clip-dark.png';

export const HeroSection = () => {
  const { isDark } = useTheme();
  const [showDemoModal, setShowDemoModal] = useState(false);

  return (
    <section
      id="home"
      className="relative pt-24 pb-10 flex items-center overflow-hidden transition-colors duration-300"
      style={{
        background: isDark
          ? 'radial-gradient(ellipse at 25% 45%, #2a164d 0%, #130f22 45%, #0c0916 100%)'
          : 'radial-gradient(ellipse at 25% 45%, #f5e9ff 0%, #faf8f5 50%, #f3edf8 100%)'
      }}
    >
      {/* Background Paper Texture & Ambient Glows */}
      <div
        className="absolute top-1/4 left-1/5 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none opacity-40 transition-colors duration-500"
        style={{ background: isDark ? '#7c3aed' : '#d8b4fe' }}
      />
      <div
        className="absolute bottom-1/5 right-1/4 w-[450px] h-[450px] rounded-full blur-[140px] pointer-events-none opacity-30 transition-colors duration-500"
        style={{ background: isDark ? '#9333ea' : '#c084fc' }}
      />

      {/* Hand-drawn Doodles & Pencil Annotations in Background */}
      <svg
        className="absolute top-28 left-6 sm:left-12 w-24 h-24 opacity-30 pointer-events-none select-none"
        viewBox="0 0 100 100"
        fill="none"
      >
        <path
          d="M15,50 Q35,15 55,50 T95,50"
          stroke={isDark ? '#c084fc' : '#8b5cf6'}
          strokeWidth="2"
          strokeDasharray="4 4"
        />
        <circle cx="55" cy="25" r="3.5" fill={isDark ? '#fbbf24' : '#f59e0b'} />
      </svg>

      <svg
        className="absolute bottom-16 left-1/3 w-32 h-16 opacity-25 pointer-events-none select-none"
        viewBox="0 0 120 60"
        fill="none"
      >
        <path
          d="M10,30 C30,10 70,50 110,25"
          stroke={isDark ? '#fbbf24' : '#d97706'}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M95,20 L110,25 L102,38"
          stroke={isDark ? '#fbbf24' : '#d97706'}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* Left Column (5 cols on desktop) */}
          <div className="lg:col-span-5 space-y-7 text-center lg:text-left">

            {/* Handwritten Eyebrow */}
            <div className="inline-flex items-center gap-2">
              <span
                className="text-sm sm:text-base font-serif italic tracking-wide flex items-center gap-2"
                style={{
                  color: isDark ? '#c4b5fd' : '#7c3aed'
                }}
              >
                <span className="text-amber-400">✦</span>
                <span>Your Ideas, Organized</span>
                <span className="text-amber-400 text-xs">✏️</span>
              </span>
            </div>

            {/* Main Heading with Hand-Drawn Oval around "Notes" */}
            <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.12] font-serif ${
              isDark ? 'text-white' : 'text-stone-900'
            }`}>
              A Smarter Space <br className="hidden sm:inline" />
              for Your{' '}
              <span className="relative inline-block whitespace-nowrap mt-1">
                {/* Hand-drawn purple circular doodle around Notes */}
                <svg
                  className="absolute -inset-x-5 -inset-y-3.5 w-[calc(100%+2.5rem)] h-[calc(100%+1.8rem)] pointer-events-none overflow-visible"
                  viewBox="0 0 160 70"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Purple Oval Loop */}
                  <path
                    d="M 20,35 C 15,12 135,8 145,30 C 152,48 120,62 70,64 C 20,65 5,45 25,28 C 45,15 110,18 140,32"
                    stroke={isDark ? '#a855f7' : '#9333ea'}
                    strokeWidth="3.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="drop-shadow-[0_0_8px_rgba(168,85,247,0.7)]"
                  />
                  {/* Little radiant pencil sparks */}
                  <line x1="150" y1="20" x2="158" y2="15" stroke={isDark ? '#c084fc' : '#a855f7'} strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="155" y1="34" x2="164" y2="34" stroke={isDark ? '#c084fc' : '#a855f7'} strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="150" y1="46" x2="157" y2="52" stroke={isDark ? '#c084fc' : '#a855f7'} strokeWidth="2.5" strokeLinecap="round" />
                </svg>
                <span
                  className="relative z-10 italic font-serif px-2 font-normal"
                  style={{
                    color: isDark ? '#f3e8ff' : '#6b21a8',
                    textShadow: isDark ? '0 0 20px rgba(168,85,247,0.4)' : 'none'
                  }}
                >
                  Notes
                </span>
              </span>
            </h1>

            {/* Description */}
            <p className={`text-base sm:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0 font-sans ${
              isDark ? 'text-stone-300' : 'text-stone-600'
            }`}>
              Write, organize, search and access your notes anytime, even offline. A modern,
              powerful note-taking space built for your thoughts, plans and ideas.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              {/* Primary: Get Started — It's Free */}
              <Link
                to="/register"
                className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-semibold text-base transition-all duration-200 cursor-pointer ${
                  isDark
                    ? 'bg-gradient-to-r from-[#9333ea] to-[#7c3aed] text-white shadow-[0_0_28px_rgba(147,51,234,0.55)] hover:shadow-[0_0_36px_rgba(147,51,234,0.8)] hover:scale-105 active:scale-98'
                    : 'bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 active:scale-98'
                }`}
              >
                <span>Get Started — It's Free</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              {/* Secondary: Watch Demo */}
              <button
                onClick={() => setShowDemoModal(true)}
                className={`w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full font-semibold text-base transition-all duration-200 cursor-pointer ${
                  isDark
                    ? 'bg-[#1e1633]/80 border border-purple-500/30 text-purple-200 hover:bg-[#281d45] hover:border-purple-400 hover:text-white'
                    : 'bg-white/80 border border-stone-300 text-stone-800 hover:bg-stone-50 hover:border-stone-400'
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  isDark ? 'bg-purple-900/60 text-purple-300' : 'bg-purple-100 text-purple-700'
                }`}>
                  <Play className="w-3 h-3 fill-current ml-0.5" />
                </div>
                <span>Watch Demo</span>
              </button>
            </div>

            {/* 3 Key Benefits below CTA */}
            <div className="pt-4 grid grid-cols-3 gap-3 border-t border-purple-500/15 max-w-lg mx-auto lg:mx-0">
              {/* Benefit 1: Works Offline */}
              <div className="flex flex-col items-center lg:items-start gap-1.5">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg ${
                    isDark ? 'text-amber-400 bg-amber-400/10' : 'text-amber-600 bg-amber-100'
                  }`}>
                    <Zap className="w-4 h-4" />
                  </div>
                  <span className={`text-xs sm:text-sm font-semibold ${
                    isDark ? 'text-stone-200' : 'text-stone-800'
                  }`}>
                    Works Offline
                  </span>
                </div>
              </div>

              {/* Benefit 2: Auto Syncs */}
              <div className="flex flex-col items-center lg:items-start gap-1.5">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg ${
                    isDark ? 'text-purple-400 bg-purple-400/10' : 'text-purple-600 bg-purple-100'
                  }`}>
                    <RefreshCw className="w-4 h-4" />
                  </div>
                  <span className={`text-xs sm:text-sm font-semibold ${
                    isDark ? 'text-stone-200' : 'text-stone-800'
                  }`}>
                    Auto Syncs
                  </span>
                </div>
              </div>

              {/* Benefit 3: Across Devices */}
              <div className="flex flex-col items-center lg:items-start gap-1.5">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg ${
                    isDark ? 'text-indigo-400 bg-indigo-400/10' : 'text-indigo-600 bg-indigo-100'
                  }`}>
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <span className={`text-xs sm:text-sm font-semibold ${
                    isDark ? 'text-stone-200' : 'text-stone-800'
                  }`}>
                    Across Devices
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Floating NoteNest Tablet Editor Interface (7 cols on desktop) */}
          <div className="lg:col-span-7 relative flex items-center justify-center">

            {/* Decorative Ambient Glowing Aura around Editor */}
            <div
              className="absolute -inset-4 rounded-3xl blur-2xl opacity-60 pointer-events-none transition-colors duration-500"
              style={{
                background: isDark
                  ? 'radial-gradient(circle, rgba(168,85,247,0.35) 0%, rgba(139,92,246,0.15) 50%, transparent 70%)'
                  : 'radial-gradient(circle, rgba(216,180,254,0.45) 0%, rgba(192,132,252,0.15) 50%, transparent 70%)'
              }}
            />

            {/* Floating Illustrated Elements Container */}
            <div className="relative w-full max-w-2xl group select-none">

              {/* Yellow Heart Sticky Note (Top-Right Floating) */}
              <div
                className="absolute -top-6 sm:-top-8 -right-3 sm:-right-4 w-16 sm:w-20 z-20 transform rotate-12 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-105 filter drop-shadow-lg"
              >
                <img
                  src={stickyHeartDark}
                  alt="Sticky Note"
                  className="w-full h-auto object-contain"
                />
              </div>

              {/* Metal Binder Clip (Top-Left of Editor) */}
              <div
                className="absolute -top-4 sm:-top-5 left-16 sm:left-24 w-8 sm:w-11 z-20 transform -rotate-6 transition-transform duration-300 group-hover:rotate-0 filter drop-shadow-md"
              >
                <img
                  src={binderClipDark}
                  alt="Binder Clip"
                  className="w-full h-auto object-contain"
                />
              </div>

              {/* Main Tablet Editor Interface Clipart Asset */}
              <div className="relative rounded-2xl overflow-hidden transition-all duration-500 group-hover:scale-[1.01] filter drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                <img
                  src={isDark ? editorPreviewDark : editorPreviewLight}
                  alt="NoteNest Application Interface"
                  className="w-full h-auto object-contain block select-none"
                  loading="eager"
                />

                {/* Subtle Interactive Shimmer Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/0 via-white/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              </div>

              {/* Floating Live Badge: Offline-First Mode Indicator */}
              <div
                className={`absolute -bottom-4 left-6 sm:left-12 px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2 z-20 backdrop-blur-md shadow-lg transition-transform duration-300 group-hover:-translate-y-1 ${
                  isDark
                    ? 'bg-[#1f1736]/90 border border-purple-500/40 text-purple-200 shadow-purple-950/50'
                    : 'bg-white/95 border border-amber-300 text-stone-800 shadow-amber-900/10'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Ready to write • Offline first</span>
              </div>

            </div>

          </div>

        </div>
      </div>

      {/* Interactive Demo Video / Feature Walkthrough Modal */}
      {showDemoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className={`relative w-full max-w-3xl rounded-3xl p-6 sm:p-8 border shadow-2xl transition-all ${
              isDark
                ? 'bg-[#151124] border-purple-800/40 text-stone-100 shadow-[0_0_50px_rgba(168,85,247,0.3)]'
                : 'bg-white border-stone-200 text-stone-900 shadow-2xl'
            }`}
          >
            <button
              onClick={() => setShowDemoModal(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-stone-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-purple-600/20 text-purple-400 flex items-center justify-center">
                <Play className="w-5 h-5 fill-current ml-0.5" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-serif">NoteNest in Action</h3>
                <p className="text-xs text-stone-400">See how fluid note-taking feels</p>
              </div>
            </div>

            {/* Video / Interactive Simulation Container */}
            <div className="rounded-2xl overflow-hidden border border-purple-500/20 bg-black aspect-video relative flex items-center justify-center">
              <img
                src={isDark ? editorPreviewDark : editorPreviewLight}
                alt="Demo Preview"
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-bold text-lg">Instant Note Nesting & Offline Sync</h4>
                    <p className="text-purple-300 text-sm">Experience the distraction-free markdown canvas.</p>
                  </div>
                  <Link
                    to="/register"
                    className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm shadow-lg shadow-purple-600/40 transition-colors"
                  >
                    Try it Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default HeroSection;
