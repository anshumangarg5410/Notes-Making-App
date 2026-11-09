import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, X } from 'lucide-react';
import { useAuthModal } from '../../context/AuthModalContext';
import { useAuth } from '../../context/AuthContext';
import { EditorPreview } from './EditorPreview';
import { Benefits } from './Benefits';

export const HeroSection = () => {
  const [showDemoModal, setShowDemoModal] = useState(false);
  const { openSignup } = useAuthModal();
  const { isAuthenticated } = useAuth();

  return (
    <section id="home" className="w-full pt-8 pb-10 px-4 sm:px-6 lg:px-8 relative z-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">

          {/* Left Column (5 columns on desktop) */}
          <div className="lg:col-span-5 space-y-6 text-left">

            {/* Handwritten Eyebrow Annotation with Yellow Spark */}
            <div className="inline-flex items-center gap-1.5">
              <span className="text-amber-400 font-mono text-sm">✦</span>
              <span className="font-handwriting text-xl sm:text-2xl text-purple-300 font-medium tracking-wide">
                Your Ideas, Organized
              </span>
              <span className="text-amber-400 font-mono text-xs ml-0.5">✏️</span>
            </div>

            {/* Main Heading with Purple Hand-Drawn Loop around "Notes" */}
            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-serif font-extrabold text-[#f5f3f0] tracking-tight leading-[1.12]">
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
                    stroke="#a855f7"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="drop-shadow-[0_0_8px_rgba(168,85,247,0.7)]"
                  />
                  {/* Little Radiant Pencil Sparks */}
                  <line x1="150" y1="20" x2="159" y2="15" stroke="#c084fc" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="156" y1="34" x2="165" y2="34" stroke="#c084fc" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="150" y1="46" x2="158" y2="52" stroke="#c084fc" strokeWidth="2.5" strokeLinecap="round" />
                </svg>

                {/* Highlighted Word "Notes" */}
                <span className="relative z-10 italic font-serif px-2 font-normal text-purple-200">
                  Notes
                </span>
              </span>
            </h1>

            {/* Description Paragraph */}
            <p className="text-[#c4c0d0] text-sm sm:text-base leading-relaxed max-w-lg font-sans">
              Write, organize, search and access your notes anytime, even offline. A modern,
              powerful note-taking space built for your thoughts, plans and ideas.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-1">
              {/* Primary CTA: Get Started — It's Free → */}
              {isAuthenticated ? (
                <Link
                  to="/notes"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm sm:text-base bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] text-white shadow-[0_0_25px_rgba(139,92,246,0.55)] hover:shadow-[0_0_35px_rgba(139,92,246,0.8)] hover:scale-103 active:scale-98 transition-all cursor-pointer"
                >
                  <span>Open Your Notes</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => openSignup()}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm sm:text-base bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] text-white shadow-[0_0_25px_rgba(139,92,246,0.55)] hover:shadow-[0_0_35px_rgba(139,92,246,0.8)] hover:scale-103 active:scale-98 transition-all cursor-pointer"
                >
                  <span>Get Started — It's Free</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

              {/* Secondary CTA: Watch Demo */}
              <button
                onClick={() => setShowDemoModal(true)}
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full font-semibold text-sm sm:text-base bg-[#181324]/80 border border-purple-500/30 text-purple-200 hover:border-purple-400 hover:text-white transition-all cursor-pointer hover:bg-[#231b36]"
              >
                <div className="w-5 h-5 rounded-full flex items-center justify-center bg-purple-900/60 text-purple-300">
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
          <div className="relative w-full max-w-2xl rounded-3xl p-6 border border-purple-500/30 bg-[#151124] text-white shadow-[0_0_50px_rgba(168,85,247,0.3)]">
            <button
              onClick={() => setShowDemoModal(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-stone-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-purple-600/30 text-purple-300 flex items-center justify-center">
                <Play className="w-4 h-4 fill-current ml-0.5" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-serif">NoteNest Demo</h3>
                <p className="text-xs text-stone-400">Tactile note-taking with offline cloud sync</p>
              </div>
            </div>

            <div className="rounded-xl overflow-hidden border border-purple-500/20 aspect-video relative flex items-center justify-center bg-black/60">
              <div className="text-center p-6 space-y-3">
                <p className="text-sm text-purple-200">
                  Organize ideas into nested notebooks with markdown and local-first speed.
                </p>
                <Link
                  to="/register"
                  onClick={() => setShowDemoModal(false)}
                  className="inline-block px-5 py-2 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs transition-colors"
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
