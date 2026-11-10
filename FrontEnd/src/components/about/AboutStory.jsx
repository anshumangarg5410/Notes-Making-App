import React from 'react';
import { BookOpen, Sparkles, Check } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import cardAboutDark from '../../assets/landing/card-about-dark.png';
import cardAboutLight from '../../assets/landing/card-about-light.png';

export const AboutStory = () => {
  const { isDark } = useTheme();

  return (
    <section className="w-full py-12 sm:py-16 lg:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        {/* Left Column: Supporting Illustration */}
        <div className="lg:col-span-5 relative flex items-center justify-center order-2 lg:order-1">
          {/* Ambient Lighting Glow */}
          <div
            className={`absolute -inset-4 rounded-3xl blur-3xl opacity-40 pointer-events-none transition-opacity ${
              isDark ? 'bg-purple-600/30' : 'bg-purple-300/30'
            }`}
          />

          <div
            className={`relative w-full max-w-md rounded-2xl p-4 sm:p-5 border shadow-2xl transition-all duration-300 hover:scale-[1.01] group backdrop-blur-md ${
              isDark
                ? 'bg-[#120a22]/85 border-purple-500/35 shadow-[0_20px_50px_rgba(0,0,0,0.7),0_0_30px_rgba(168,85,247,0.2)]'
                : 'bg-white/95 border-purple-200 shadow-[0_20px_40px_rgba(147,51,234,0.12)]'
            }`}
          >
            <div className="rounded-xl overflow-hidden relative">
              <img
                src={isDark ? cardAboutDark : cardAboutLight}
                alt="NoteNest Story - Clean Digital Sanctuary"
                className="w-full h-auto object-contain rounded-xl block transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            {/* Bottom Quote Pill */}
            <div
              className={`mt-4 p-3 rounded-[8px] text-center border ${
                isDark
                  ? 'bg-purple-950/40 border-purple-500/20 text-purple-200'
                  : 'bg-purple-50 border-purple-200 text-purple-900'
              }`}
            >
              <p className="text-xs italic leading-relaxed">
                "Ideas are fragile. NoteNest gives them a calm sanctuary to grow."
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Editorial Text */}
        <div className="lg:col-span-7 space-y-6 text-left order-1 lg:order-2">
          {/* Badge */}
          <div
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              isDark
                ? 'border-purple-500/40 bg-purple-950/50 text-purple-300 shadow-[0_0_14px_rgba(168,85,247,0.25)]'
                : 'border-purple-300 bg-purple-50 text-purple-700 shadow-sm'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-purple-400" />
            <span>Our Story</span>
          </div>

          {/* Heading */}
          <h2
            className={`text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight leading-snug ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            The{' '}
            <span className="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent">
              NoteNest
            </span>{' '}
            Story
          </h2>

          {/* Description specified by user */}
          <p
            className={`text-sm sm:text-base lg:text-lg leading-relaxed ${
              isDark ? 'text-gray-300/85' : 'text-slate-600'
            }`}
          >
            NoteNest started with a simple idea — to create a clean, powerful and personal space for
            taking notes. What began as a project quickly grew into a knowledge workspace designed
            around organization, productivity and simplicity.
          </p>

          <p
            className={`text-xs sm:text-sm leading-relaxed ${
              isDark ? 'text-gray-400' : 'text-slate-500'
            }`}
          >
            Rather than forcing you into rigid corporate spreadsheets or cluttered menus, NoteNest
            combines the warm, tactile comfort of a physical notebook with modern keyboard-first
            speed, offline reliability, and intuitive vector sketchpads.
          </p>

          {/* Key Principles Checklist */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
            <div className={`flex items-center gap-2.5 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
              <span className="w-5 h-5 rounded-[4px] bg-purple-600/35 text-purple-300 flex items-center justify-center shrink-0">
                <Check className="w-3 h-3 text-purple-400" />
              </span>
              <span className="font-medium">Distraction-free focus</span>
            </div>

            <div className={`flex items-center gap-2.5 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
              <span className="w-5 h-5 rounded-[4px] bg-purple-600/35 text-purple-300 flex items-center justify-center shrink-0">
                <Check className="w-3 h-3 text-purple-400" />
              </span>
              <span className="font-medium">Full offline privacy</span>
            </div>

            <div className={`flex items-center gap-2.5 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
              <span className="w-5 h-5 rounded-[4px] bg-purple-600/35 text-purple-300 flex items-center justify-center shrink-0">
                <Check className="w-3 h-3 text-purple-400" />
              </span>
              <span className="font-medium">Hierarchical folder nesting</span>
            </div>

            <div className={`flex items-center gap-2.5 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
              <span className="w-5 h-5 rounded-[4px] bg-purple-600/35 text-purple-300 flex items-center justify-center shrink-0">
                <Check className="w-3 h-3 text-purple-400" />
              </span>
              <span className="font-medium">Scribble &amp; drawing studio</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutStory;
