import React from 'react';
import { Info, Sparkles } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import editorPreviewDark from '../../assets/landing/newlaptop.png';
import editorPreviewLight from '../../assets/landing/editor-preview-light-updated.png';
import deskDark from '../../assets/dashboard/editor-desk-dark.png';

export const AboutHero = () => {
  const { isDark } = useTheme();

  return (
    <section className="relative w-full pt-4 pb-12 sm:pb-16 lg:pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        {/* Left Column: Heading, Badge, Description */}
        <div className="lg:col-span-6 space-y-6 text-left">
          {/* Badge matching reference */}
          <div
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              isDark
                ? 'border-purple-500/40 bg-purple-950/50 text-purple-300 shadow-[0_0_14px_rgba(168,85,247,0.25)]'
                : 'border-purple-300 bg-purple-50 text-purple-700 shadow-sm'
            }`}
          >
            <Info className="w-3.5 h-3.5 text-purple-400" />
            <span>About NoteNest</span>
          </div>

          {/* Main Title */}
          <h1
            className={`text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.15] ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            A Smarter Way to Capture, Organize and Grow{' '}
            <span className="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent">
              Your Knowledge
            </span>
          </h1>

          {/* Description */}
          <p
            className={`text-base sm:text-lg leading-relaxed ${
              isDark ? 'text-gray-300/85' : 'text-slate-600'
            }`}
          >
            NoteNest is a modern, distraction-free note-taking workspace built for students, developers
            and lifelong learners. It brings your notes, ideas and knowledge together in one organized
            space.
          </p>
        </div>

        {/* Right Column: Visual Product Illustration */}
        <div className="lg:col-span-6 relative flex items-center justify-center">
          {/* Ambient Lighting Glow */}
          <div
            className={`absolute -inset-4 rounded-3xl blur-3xl opacity-50 pointer-events-none transition-opacity ${
              isDark ? 'bg-purple-600/30' : 'bg-purple-300/30'
            }`}
          />

          {/* Frame Container */}
          <div
            className={`relative w-full max-w-lg rounded-2xl p-2.5 sm:p-3 border shadow-2xl transition-all duration-300 hover:scale-[1.01] group backdrop-blur-md overflow-hidden ${
              isDark
                ? 'bg-[#120a22]/85 border-purple-500/35 shadow-[0_20px_50px_rgba(0,0,0,0.7),0_0_30px_rgba(168,85,247,0.25)]'
                : 'bg-white/95 border-purple-200 shadow-[0_20px_40px_rgba(147,51,234,0.12)]'
            }`}
          >
            <div className="relative rounded-xl overflow-hidden bg-slate-950/40">
              <img
                src={isDark ? editorPreviewDark : editorPreviewLight}
                alt="NoteNest Modern Knowledge Workspace"
                className="w-full h-auto object-cover rounded-xl block transition-transform duration-500 group-hover:scale-[1.02]"
              />

              {/* Decorative Subtle Overlay Highlights */}
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/10 via-transparent to-purple-500/10 pointer-events-none" />
            </div>

            {/* Corner Ambient Badge */}
            <div
              className={`absolute top-5 right-5 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border backdrop-blur-md ${
                isDark
                  ? 'bg-purple-950/80 border-purple-400/40 text-purple-200'
                  : 'bg-white/90 border-purple-300 text-purple-800'
              }`}
            >
              <Sparkles className="w-3 h-3 text-purple-400 animate-pulse" />
              <span>Workspace Studio</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutHero;

