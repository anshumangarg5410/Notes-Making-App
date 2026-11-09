import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, X } from 'lucide-react';
import { useAuthModal } from '../../context/AuthModalContext';
import { useAuth } from '../../context/AuthContext';
import { EditorPreview } from './EditorPreview';
import { Benefits } from './Benefits';
import { useTheme } from '../../context/ThemeContext';

export const HeroSection = () => {
  const [showDemoModal, setShowDemoModal] = useState(false);
  const { openSignup } = useAuthModal();
  const { isAuthenticated } = useAuth();
  const { isDark } = useTheme();

  return (
    <section id="home" className="w-full py-2 sm:py-4 lg:py-4 px-4 sm:px-6 lg:px-8 relative z-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">

          {/* Left Column (5 columns on desktop) */}
          <div className="lg:col-span-5 space-y-6 text-left">

            {/* Handwritten Eyebrow Annotation with Yellow Spark */}
            <div className="inline-flex items-center gap-1.5">
              <span className="text-amber-400 font-mono text-sm">✦</span>
              <span className={`font-handwriting text-xl sm:text-2xl font-medium tracking-wide ${isDark ? 'text-indigo-300' : 'text-indigo-700'}`}>
                Your Ideas, Organized
              </span>
              <span className="text-amber-400 font-mono text-xs ml-0.5">✏️</span>
            </div>

            {/* Main Heading with Purple Hand-Drawn Loop around "Notes" */}
            <h1 className={`text-4xl sm:text-5xl lg:text-[3.5rem] font-serif font-extrabold tracking-tight leading-[1.12] ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
              A Smarter Space <br />
              for Your{' '}
              <span className="relative inline-block whitespace-nowrap">
                {/* Hand-drawn Purple Loop & Radiant Sparks */}
                <svg
                  className="absolute -inset-x-5 -inset-y-3.5 w-[calc(100%+2.5rem)] h-[calc(100%+1.8rem)] pointer-events-none overflow-visible select-none"
                  viewBox="0 0 160 70"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Purple Oval Loop */}
                  <path
                    d="M 22,35 C 16,12 135,8 145,30 C 152,48 120,62 70,64 C 20,65 5,45 25,28 C 45,15 110,18 140,32"
                    stroke={isDark ? '#818CF8' : '#6366F1'}
                    strokeWidth="3.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="drop-shadow-[0_0_8px_rgba(99,102,241,0.45)]"
                  />
                  {/* Little Radiant Pencil Sparks */}
                  <line x1="150" y1="20" x2="159" y2="15" stroke={isDark ? '#A5B4FC' : '#6366F1'} strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="156" y1="34" x2="165" y2="34" stroke={isDark ? '#A5B4FC' : '#6366F1'} strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="150" y1="46" x2="158" y2="52" stroke={isDark ? '#A5B4FC' : '#6366F1'} strokeWidth="2.5" strokeLinecap="round" />
                </svg>

                {/* Highlighted Word "Notes" */}
                <span className={`relative z-10 italic font-serif px-2 font-normal ${isDark ? 'text-indigo-200' : 'text-indigo-700'}`}>
                  Notes
                </span>
              </span>
            </h1>

            {/* Description Paragraph */}
            <p className={`text-sm sm:text-base leading-relaxed max-w-lg font-sans ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Write, organize, search and access your notes anytime, even offline. A modern,
              powerful note-taking space built for your thoughts, plans and ideas.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-1">
              {/* Primary CTA: Get Started — It's Free → */}
              {isAuthenticated ? (
                <Link
                  to="/notes"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm sm:text-base bg-gradient-to-r from-indigo-600 to-indigo-500 border border-indigo-400/50 text-white shadow-lg shadow-indigo-900/20 hover:shadow-indigo-500/30 hover:scale-102 active:scale-98 transition-all cursor-pointer"
                >
                  <span>Open Your Notes</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => openSignup()}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm sm:text-base bg-gradient-to-r from-indigo-600 to-indigo-500 border border-indigo-400/50 text-white shadow-lg shadow-indigo-900/20 hover:shadow-indigo-500/30 hover:scale-102 active:scale-98 transition-all cursor-pointer"
                >
                  <span>Get Started — It's Free</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

              {/* Secondary CTA: Watch Demo */}
              <button
                onClick={() => setShowDemoModal(true)}
                className={`inline-flex items-center gap-2.5 px-6 py-3 rounded-lg font-semibold text-sm sm:text-base border transition-all cursor-pointer ${
                  isDark
                    ? 'bg-[#0E131F]/90 border-indigo-400/40 text-indigo-200 hover:border-indigo-300 hover:text-white hover:bg-[#171E2D]'
                    : 'bg-white/90 border-indigo-200 text-indigo-700 hover:border-indigo-400 hover:text-indigo-900 hover:bg-indigo-50'
                }`}
              >
                <div className={`w-5 h-5 rounded flex items-center justify-center ${isDark ? 'bg-indigo-500/20 text-indigo-300' : 'bg-indigo-100 text-indigo-700'}`}>
                  <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
                </div>
                <span>Watch Demo</span>
              </button>
            </div>

            {/* 3 Benefits Below Buttons */}
            <Benefits />

          </div>

          {/* Right Column (7 columns on desktop) */}
          <div className="lg:col-span-7 flex items-center justify-center pt-4 lg:pt-0">
            <EditorPreview />
          </div>

        </div>
      </div>

      {/* Interactive Demo Video / Feature Walkthrough Modal */}
      {showDemoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className={`relative w-full max-w-2xl rounded-xl p-6 border shadow-2xl ${
            isDark
              ? 'border-indigo-400/30 bg-[#0E131F] text-slate-100 shadow-black/50'
              : 'border-slate-200 bg-[#F8FAFC] text-slate-900 shadow-slate-900/15'
          }`}>
            <button
              onClick={() => setShowDemoModal(false)}
              className={`absolute top-4 right-4 p-2 rounded text-slate-400 transition-colors cursor-pointer ${isDark ? 'hover:text-white hover:bg-white/10' : 'hover:text-slate-900 hover:bg-slate-100'}`}
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-[3px] bg-purple-600/30 text-purple-300 flex items-center justify-center">
                <Play className="w-4 h-4 fill-current ml-0.5" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-serif">NoteNest Demo</h3>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Tactile note-taking with offline cloud sync</p>
              </div>
            </div>

            <div className={`rounded-lg overflow-hidden border aspect-video relative flex items-center justify-center ${
              isDark ? 'border-indigo-400/20 bg-black/40' : 'border-slate-200 bg-slate-100'
            }`}>
              <div className="text-center p-6 space-y-3">
                <p className={`text-sm ${isDark ? 'text-indigo-200' : 'text-indigo-800'}`}>
                  Organize ideas into nested notebooks with markdown and local-first speed.
                </p>
                <Link
                  to="/register"
                  onClick={() => setShowDemoModal(false)}
                  className="inline-block px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors"
                >
                  Start Writing Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default HeroSection;
