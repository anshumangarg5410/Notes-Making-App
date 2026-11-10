import React from 'react';
import { PenLine, Folder, CloudLightning, Search, Share } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import featureCardDark from '../../assets/landing/card-features-dark.png';
import featureCardLight from '../../assets/landing/card-features-light.png';

export const FeatureCards = () => {
  const { isDark } = useTheme();
  const cards = [
    {
      id: 'rich-text',
      title: 'Rich Text Editor',
      description: 'Write beautifully with powerful formatting tools.',
      icon: PenLine,
      iconColor: '#818CF8',
      borderColor: isDark ? 'rgba(129, 140, 248, 0.3)' : 'rgba(99, 102, 241, 0.22)',
      glowColor: isDark ? 'rgba(129, 140, 248, 0.12)' : 'rgba(99, 102, 241, 0.08)',
    },
    {
      id: 'folders-tags',
      title: 'Folders & Tags',
      description: 'Keep your notes organized, your way.',
      icon: Folder,
      iconColor: '#6366F1',
      borderColor: isDark ? 'rgba(129, 140, 248, 0.3)' : 'rgba(99, 102, 241, 0.22)',
      glowColor: isDark ? 'rgba(129, 140, 248, 0.12)' : 'rgba(99, 102, 241, 0.08)',
    },
    {
      id: 'offline-first',
      title: 'Offline First',
      description: 'Access and edit notes even without internet.',
      icon: CloudLightning,
      iconColor: '#818CF8',
      borderColor: isDark ? 'rgba(129, 140, 248, 0.3)' : 'rgba(99, 102, 241, 0.22)',
      glowColor: isDark ? 'rgba(129, 140, 248, 0.12)' : 'rgba(99, 102, 241, 0.08)',
    },
    {
      id: 'search',
      title: 'Powerful Search',
      description: 'Find anything in seconds with full-text search.',
      icon: Search,
      iconColor: '#818CF8',
      borderColor: isDark ? 'rgba(129, 140, 248, 0.3)' : 'rgba(99, 102, 241, 0.22)',
      glowColor: isDark ? 'rgba(129, 140, 248, 0.12)' : 'rgba(99, 102, 241, 0.08)',
    },
    {
      id: 'import-export',
      title: 'Import & Export',
      description: 'Bring in your notes or take them anywhere.',
      icon: Share,
      iconColor: '#6366F1',
      borderColor: isDark ? 'rgba(129, 140, 248, 0.3)' : 'rgba(99, 102, 241, 0.22)',
      glowColor: isDark ? 'rgba(129, 140, 248, 0.12)' : 'rgba(99, 102, 241, 0.08)',
    },
  ];

  return (
    <section id="feature-cards" className="w-full pt-1 pb-1 sm:pb-2 px-4 sm:px-6 lg:px-8 relative z-20">
      <div className="max-w-7xl mx-auto">
        {/* Five Feature Cards in a single row on desktop, wrapping gracefully on tablet & mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5 items-stretch">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                className="relative group rounded-[4px] p-5 transition-all duration-300 cursor-default flex flex-col justify-between hover:-translate-y-1 hover:shadow-2xl select-none"
                style={{
                  backgroundColor: isDark ? 'rgba(14, 19, 31, 0.86)' : 'rgba(248, 250, 252, 0.92)',
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${card.borderColor}`,
                  boxShadow: isDark
                    ? '0 8px 24px -4px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.06)'
                    : '0 8px 24px -4px rgba(15, 23, 42, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
                }}
              >
                {/* Subtle paper deckle edge / inner glow */}
                <div
                  className="absolute inset-0 rounded-[4px] pointer-events-none opacity-30 group-hover:opacity-70 transition-opacity"
                  style={{
                    boxShadow: `inset 0 0 16px ${card.glowColor}`
                  }}
                />

                <div>
                  <img
                    src={isDark ? featureCardDark : featureCardLight}
                    alt=""
                    aria-hidden="true"
                    className="absolute top-3 right-3 h-9 w-9 object-contain opacity-75"
                  />
                  {/* Card Icon */}
                  <div className="mb-4">
                    <Icon
                      className="w-6 h-6 stroke-[1.9] transition-transform duration-300 group-hover:scale-110"
                      style={{ color: card.iconColor }}
                    />
                  </div>

                  {/* Card Title (Serif) */}
                  <h3 className={`text-base sm:text-lg font-bold font-serif mb-1.5 tracking-tight transition-colors ${
                    isDark ? 'text-slate-100 group-hover:text-indigo-200' : 'text-slate-900 group-hover:text-indigo-700'
                  }`}>
                    {card.title}
                  </h3>

                  {/* Card Description (Sans-serif) */}
                  <p className={`text-xs sm:text-[13px] leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    {card.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeatureCards;
