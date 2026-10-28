import React from 'react';
import {
  Sparkles,
  Zap,
  Calendar,
  CheckSquare,
  Globe,
  WifiOff,
  ArrowUpDown,
  GraduationCap,
  Terminal,
  PenTool,
  Check
} from 'lucide-react';
import cardSageLeaves from '../../assets/landing/backgrounds/card-sage-leaves.png';
import cardSandDunes from '../../assets/landing/backgrounds/card-sand-dunes.png';
import cardAirplaneTrail from '../../assets/landing/backgrounds/card-airplane-trail.png';

export const EverythingSection = () => {
  const items = [
    {
      icon: Zap,
      title: 'Quick Capture',
      desc: 'Store ideas instantly',
      color: 'text-orange-600 dark:text-orange-400 bg-orange-100/70 dark:bg-orange-950/50'
    },
    {
      icon: Calendar,
      title: 'Daily Notes',
      desc: 'Track your thoughts',
      color: 'text-amber-600 dark:text-amber-400 bg-amber-100/70 dark:bg-amber-950/50'
    },
    {
      icon: CheckSquare,
      title: 'Tasks & Reminders',
      desc: 'Stay organized',
      color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-100/70 dark:bg-emerald-950/50'
    },
    {
      icon: Globe,
      title: 'Web Clipper',
      desc: 'Save from the web',
      color: 'text-blue-600 dark:text-blue-400 bg-blue-100/70 dark:bg-blue-950/50'
    },
    {
      icon: WifiOff,
      title: 'Offline Support',
      desc: 'Work anywhere',
      color: 'text-purple-600 dark:text-purple-400 bg-purple-100/70 dark:bg-purple-950/50'
    },
    {
      icon: ArrowUpDown,
      title: 'Import & Export',
      desc: 'Your data, your control',
      color: 'text-pink-600 dark:text-pink-400 bg-pink-100/70 dark:bg-pink-950/50'
    }
  ];

  const personas = [
    {
      icon: GraduationCap,
      role: 'Students & Learners',
      highlight: 'Turn lecture notes into active spaced repetition flashcards.',
      tags: ['Flashcards', 'Quiz Gen', 'Exam Prep'],
      bg: cardSageLeaves
    },
    {
      icon: Terminal,
      role: 'Developers & Engineers',
      highlight: 'Document system designs, algorithm notes, and clean code snippets.',
      tags: ['Code Blocks', 'Markdown', 'Fast Search'],
      bg: cardSandDunes
    },
    {
      icon: PenTool,
      role: 'Researchers & Writers',
      highlight: 'Connect conceptual nodes and outline multi-chapter research papers.',
      tags: ['Knowledge Graph', 'Bi-directional Links', 'Distraction-free'],
      bg: cardAirplaneTrail
    }
  ];

  return (
    <section className="py-20 md:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 select-none">
      <div className="relative text-center max-w-3xl mx-auto mb-14 space-y-3">
        {/* Playful Tag */}
        <div className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-orange-100/70 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300">
          <Sparkles className="w-3.5 h-3.5 text-orange-500" />
          <span>BUILT FOR REAL LIFE</span>
        </div>

        <h2 className="font-serif font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#1E1E1E] dark:text-[#FAF8F5] tracking-tight">
          Everything in one place
        </h2>

        <p className="text-sm sm:text-base text-[#6E6C66] dark:text-[#A8A59E] leading-relaxed max-w-xl mx-auto">
          From quick ideas to detailed notes, from personal thoughts to professional documentation — Notely adapts to your workflow.
        </p>
      </div>

      {/* 6 Bottom Items */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 mb-12">
        {items.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#181A20] border border-[#EAE5DA] dark:border-[#272935] hover:border-orange-400/80 dark:hover:border-orange-600/60 hover:shadow-md transition-all duration-200 flex flex-col items-center text-center space-y-2.5 group"
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform`}
              >
                <Icon className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-xs sm:text-sm text-[#222] dark:text-[#FAF8F5]">
                  {item.title}
                </h4>
                <p className="text-[11px] text-[#7A7872] dark:text-[#9A9893] mt-0.5 leading-snug">
                  {item.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Workflow Personas Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-[#EAE5DA] dark:border-[#242632]">
        {personas.map((p, idx) => {
          const Icon = p.icon;
          return (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-white dark:bg-[#181A20] border border-[#EAE5DA] dark:border-[#272935] space-y-3.5 hover:shadow-md transition-shadow relative overflow-hidden"
            >
              {/* Card Background Texture Watermark */}
              <div
                className="absolute top-0 right-0 w-24 h-24 bg-no-repeat bg-right-top opacity-25 dark:opacity-5 pointer-events-none rounded-tr-3xl"
                style={{ backgroundImage: `url(${p.bg})`, backgroundSize: 'cover' }}
              />
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950/50 flex items-center justify-center text-orange-600 dark:text-orange-400">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="font-serif font-bold text-sm text-[#222] dark:text-[#FAF8F5]">
                  {p.role}
                </h4>
              </div>
              <p className="text-xs text-[#6E6C66] dark:text-[#A8A59E] leading-relaxed">
                {p.highlight}
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {p.tags.map((tag, tIdx) => (
                  <span
                    key={tIdx}
                    className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-[#F5F2EB] dark:bg-[#23252E] text-[#555] dark:text-[#CCC]"
                  >
                    <Check className="w-2.5 h-2.5 text-orange-500" />
                    <span>{tag}</span>
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Editorial Section Note */}
      <div className="pt-8 text-center select-none" aria-hidden="true">
        <p className="text-[11px] text-[#8E8B84] dark:text-[#7A7C85]">
          Built with focus, privacy, and speed in mind &bull; Designed for your everyday ideas
        </p>
      </div>
    </section>
  );
};
