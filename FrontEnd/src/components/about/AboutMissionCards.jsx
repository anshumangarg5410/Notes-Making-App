import React from 'react';
import { Target, Layers, Heart } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const AboutMissionCards = () => {
  const { isDark } = useTheme();

  const cards = [
    {
      id: 'mission',
      icon: Target,
      title: 'Our Mission',
      description: 'To simplify the way people take, manage and revisit their knowledge.'
    },
    {
      id: 'vision',
      icon: Layers,
      title: 'Our Vision',
      description: 'To build a complete knowledge workspace for learning, planning and creating.'
    },
    {
      id: 'built-for-you',
      icon: Heart,
      title: 'Built for You',
      description: 'Designed with a focus on simplicity, productivity and a great user experience.'
    }
  ];

  return (
    <section className="w-full py-6 sm:py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 items-stretch">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              className={`group relative rounded-[10px] p-6 sm:p-7 border transition-all duration-300 hover:-translate-y-1 backdrop-blur-md flex flex-col justify-between ${
                isDark
                  ? 'bg-[#120a22]/85 border-purple-500/25 hover:border-purple-400/60 hover:shadow-[0_0_30px_rgba(168,85,247,0.2)]'
                  : 'bg-white/95 border-purple-200 hover:border-purple-300 hover:shadow-[0_8px_30px_rgba(147,51,234,0.1)]'
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Purple Icon Container */}
                <div
                  className={`w-11 h-11 rounded-[8px] flex items-center justify-center shrink-0 border transition-transform duration-300 group-hover:scale-105 shadow-sm ${
                    isDark
                      ? 'bg-gradient-to-br from-purple-600/35 to-indigo-600/20 border-purple-400/40 text-purple-300 shadow-[0_0_14px_rgba(168,85,247,0.3)]'
                      : 'bg-purple-100 border-purple-200 text-purple-700'
                  }`}
                >
                  <Icon className="w-5 h-5 stroke-[2]" />
                </div>

                {/* Content */}
                <div className="space-y-1.5 text-left">
                  <h3
                    className={`text-base sm:text-lg font-bold tracking-tight ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {card.title}
                  </h3>
                  <p
                    className={`text-xs sm:text-sm leading-relaxed ${
                      isDark ? 'text-gray-300/80' : 'text-slate-600'
                    }`}
                  >
                    {card.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default AboutMissionCards;

