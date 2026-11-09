import React from 'react';
import { Edit3, FolderTree, WifiOff, ArrowRight } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import cardHowDark from '../../assets/landing/card-how-dark.png';
import cardHowLight from '../../assets/landing/card-how-light.png';

export const HowItWorks = () => {
  const { isDark } = useTheme();

  const steps = [
    {
      number: '01',
      title: 'Create Your Notes',
      subtitle: 'Effortless Markdown & Rich Text',
      description:
        'Open a clean, distraction-free page. Use markdown shortcuts, task checklists, code blocks, or format with visual toolbars.',
      icon: Edit3,
      accentColor: isDark ? '#c084fc' : '#7c3aed',
      badge: 'Step 1'
    },
    {
      number: '02',
      title: 'Organize Your Way',
      subtitle: 'Nested Folders & Smart Tags',
      description:
        'Group by projects, courses, or hobbies. Build infinite folder depth, apply color-coded tags, and star top notes in Favorites.',
      icon: FolderTree,
      accentColor: isDark ? '#fbbf24' : '#d97706',
      badge: 'Step 2'
    },
    {
      number: '03',
      title: 'Access Anywhere, Offline',
      subtitle: 'Zero Downtime Syncing',
      description:
        'Write on the plane, subway, or in remote spots. Notes save instantly to local storage and sync seamlessly as soon as you reconnect.',
      icon: WifiOff,
      accentColor: isDark ? '#a78bfa' : '#6d28d9',
      badge: 'Step 3'
    }
  ];

  return (
    <section
      id="how-it-works"
      className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden transition-colors duration-300"
      style={{
        background: isDark
          ? 'linear-gradient(180deg, #090712 0%, #130e24 50%, #0c0817 100%)'
          : 'linear-gradient(180deg, #f4eff8 0%, #faf8f5 50%, #f6f0fa 100%)'
      }}
    >
      <div className="max-w-7xl mx-auto">

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase font-serif italic"
            style={{
              color: isDark ? '#c4b5fd' : '#7c3aed',
              backgroundColor: isDark ? 'rgba(124,58,237,0.15)' : 'rgba(124,58,237,0.08)'
            }}
          >
            <span>Simple 3-Step Process</span>
          </div>

          <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold font-serif tracking-tight ${
            isDark ? 'text-white' : 'text-stone-900'
          }`}>
            How NoteNest Works
          </h2>

          <p className={`text-sm sm:text-base ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
            From the first spark of inspiration to your personal lifelong library.
          </p>
        </div>

        {/* 3 Step Flow Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative items-stretch">

          {/* Decorative Connecting Line across steps on desktop */}
          <div className="hidden md:block absolute top-1/2 left-1/6 right-1/6 h-[2px] -translate-y-8 pointer-events-none z-0"
            style={{
              background: isDark
                ? 'linear-gradient(90deg, rgba(168,85,247,0.3) 0%, rgba(251,191,36,0.3) 50%, rgba(168,85,247,0.3) 100%)'
                : 'linear-gradient(90deg, rgba(124,58,237,0.2) 0%, rgba(217,119,6,0.2) 50%, rgba(124,58,237,0.2) 100%)',
              strokeDasharray: '4 4'
            }}
          />

          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className={`relative z-10 rounded-3xl p-7 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-2 border ${
                  isDark
                    ? 'bg-[#181229]/80 border-purple-900/30 hover:border-purple-500/50 shadow-xl shadow-black/40 hover:shadow-purple-900/20'
                    : 'bg-white/90 border-stone-200 hover:border-amber-400/50 shadow-lg hover:shadow-xl'
                }`}
              >
                {/* Step Top Bar */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span
                      className="text-4xl font-extrabold font-serif tracking-tighter opacity-80"
                      style={{ color: step.accentColor }}
                    >
                      {step.number}
                    </span>

                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm"
                      style={{
                        backgroundColor: isDark ? 'rgba(168,85,247,0.12)' : 'rgba(124,58,237,0.08)',
                        color: step.accentColor,
                        border: `1px solid ${isDark ? 'rgba(168,85,247,0.25)' : 'rgba(124,58,237,0.2)'}`
                      }}
                    >
                      <Icon className="w-6 h-6 stroke-[1.8]" />
                    </div>
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className={`text-xl font-bold font-serif mb-1 tracking-tight ${
                    isDark ? 'text-white' : 'text-stone-900'
                  }`}>
                    {step.title}
                  </h3>

                  <p
                    className="text-xs font-mono uppercase tracking-wider mb-3 font-semibold"
                    style={{ color: step.accentColor }}
                  >
                    {step.subtitle}
                  </p>

                  <p className={`text-sm leading-relaxed ${
                    isDark ? 'text-stone-300' : 'text-stone-600'
                  }`}>
                    {step.description}
                  </p>
                </div>

                {/* Subtle Progress Hint */}
                <div className="mt-8 pt-4 border-t border-purple-500/10 flex items-center justify-between text-xs">
                  <span className={isDark ? 'text-stone-400 font-medium' : 'text-stone-500 font-medium'}>
                    {step.badge}
                  </span>
                  <ArrowRight className="w-4 h-4 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Illustrated Companion Visual Banner */}
        <div className="mt-14 max-w-4xl mx-auto rounded-3xl overflow-hidden border p-2 shadow-2xl transition-all duration-300 hover:scale-[1.01]"
          style={{
            backgroundColor: isDark ? '#161026' : '#ffffff',
            borderColor: isDark ? 'rgba(168,85,247,0.25)' : 'rgba(217,119,6,0.2)'
          }}
        >
          <img
            src={isDark ? cardHowDark : cardHowLight}
            alt="NoteNest Workflow Visual"
            className="w-full h-auto object-cover rounded-2xl block"
          />
        </div>

      </div>
    </section>
  );
};

export default HowItWorks;

