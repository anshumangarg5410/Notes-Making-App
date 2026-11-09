import React from 'react';
import { BookOpen, ShieldCheck, Feather, Sparkles, Layers, Cpu } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import cardAboutDark from '../../assets/landing/card-about-dark.png';
import cardAboutLight from '../../assets/landing/card-about-light.png';

export const AboutSection = () => {
  const { isDark } = useTheme();

  const highlights = [
    {
      icon: Feather,
      title: 'Tactile Stationery Aesthetic',
      description: 'The physical comfort of warm paper, pencil marks, and notebooks combined with smooth modern digital typography.'
    },
    {
      icon: ShieldCheck,
      title: 'Local-First Privacy',
      description: 'Your notes are stored on your device first with local IndexedDB cache. You own your knowledge, completely private.'
    },
    {
      icon: Layers,
      title: 'Nested Infinite Folders',
      description: 'No shallow limits. Nest your research, courses, meeting logs, and journals into deep intuitive structures.'
    },
    {
      icon: Cpu,
      title: 'Frictionless Cloud Sync',
      description: 'Seamlessly mirrors every character across your desktop, laptop, tablet, and mobile with zero conflict delays.'
    }
  ];

  return (
    <section
      id="about"
      className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden transition-colors duration-300"
      style={{
        background: isDark
          ? 'radial-gradient(ellipse at 80% 50%, #201338 0%, #0e0a19 60%, #090712 100%)'
          : 'radial-gradient(ellipse at 80% 50%, #faedf9 0%, #faf8f5 60%, #f4eff8 100%)'
      }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Left Column: Visual Card Showcase */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/* Ambient Purple Backdrop */}
            <div
              className="absolute -inset-2 rounded-3xl blur-2xl opacity-40 pointer-events-none"
              style={{ background: isDark ? '#7c3aed' : '#d8b4fe' }}
            />

            {/* Layered Card Container */}
            <div className="relative w-full max-w-md rounded-3xl p-3 border shadow-2xl transition-all duration-300 hover:scale-[1.02] group"
              style={{
                backgroundColor: isDark ? '#181228' : '#ffffff',
                borderColor: isDark ? 'rgba(168,85,247,0.3)' : 'rgba(217,119,6,0.2)',
                boxShadow: isDark
                  ? '0 20px 50px -10px rgba(0,0,0,0.8), 0 0 30px rgba(168,85,247,0.15)'
                  : '0 20px 40px -10px rgba(120,80,40,0.12)'
              }}
            >
              <div className="rounded-2xl overflow-hidden relative">
                <img
                  src={isDark ? cardAboutDark : cardAboutLight}
                  alt="About NoteNest Digital Notebook"
                  className="w-full h-auto object-cover rounded-2xl block"
                />
              </div>

              {/* Stationery Annotation Tape on Top-Left */}
              <div
                className={`absolute -top-3 left-8 px-4 py-1 rounded text-xs font-serif font-bold transform -rotate-2 shadow-md ${
                  isDark
                    ? 'bg-[#fbbf24] text-stone-900 shadow-amber-950/40'
                    : 'bg-[#fbbf24] text-stone-900 shadow-stone-400/40'
                }`}
              >
                ✦ The Digital Notebook
              </div>

              {/* Bottom Quote Card */}
              <div className={`mt-3 p-3.5 rounded-xl text-center ${
                isDark ? 'bg-purple-950/40 border border-purple-500/20' : 'bg-amber-50 border border-amber-200/60'
              }`}>
                <p className={`text-xs font-serif italic ${isDark ? 'text-purple-200' : 'text-amber-900'}`}>
                  "Ideas are fragile. NoteNest gives them a sanctuary to grow."
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Purpose */}
          <div className="lg:col-span-7 space-y-7">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase font-serif italic"
              style={{
                color: isDark ? '#c4b5fd' : '#7c3aed',
                backgroundColor: isDark ? 'rgba(124,58,237,0.15)' : 'rgba(124,58,237,0.08)'
              }}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>About NoteNest</span>
            </div>

            <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold font-serif tracking-tight leading-[1.15] ${
              isDark ? 'text-white' : 'text-stone-900'
            }`}>
              Designed for the Way <br />
              <span className="italic font-normal underline decoration-purple-500 decoration-wavy decoration-2">
                Your Mind Actually Works
              </span>
            </h2>

            <p className={`text-base sm:text-lg leading-relaxed ${isDark ? 'text-stone-300' : 'text-stone-600'}`}>
              Most note apps force you into sterile spreadsheets or rigid databases.
              NoteNest was born from a simple belief: the tactile elegance of opening a fresh notebook
              inspires clearer thinking than any corporate document ever could.
            </p>

            {/* Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
              {highlights.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border transition-all duration-200 hover:-translate-y-0.5 ${
                      isDark
                        ? 'bg-[#161026]/70 border-purple-900/30 hover:border-purple-500/40 shadow-sm'
                        : 'bg-white/90 border-stone-200 hover:border-amber-400/40 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`p-2 rounded-xl ${
                        isDark ? 'bg-purple-900/40 text-purple-300' : 'bg-purple-100 text-purple-700'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <h4 className={`text-sm font-bold font-serif ${
                        isDark ? 'text-white' : 'text-stone-900'
                      }`}>
                        {item.title}
                      </h4>
                    </div>
                    <p className={`text-xs leading-relaxed ${
                      isDark ? 'text-stone-400' : 'text-stone-600'
                    }`}>
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutSection;
