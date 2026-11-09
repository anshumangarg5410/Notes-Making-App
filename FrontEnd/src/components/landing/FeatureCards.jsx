import React from 'react';
import { PenLine, Folder, CloudLightning, Search, Share } from 'lucide-react';

export const FeatureCards = () => {
  const cards = [
    {
      id: 'rich-text',
      title: 'Rich Text Editor',
      description: 'Write beautifully with powerful formatting tools.',
      icon: PenLine,
      iconColor: '#c084fc',
      borderColor: 'rgba(192, 132, 252, 0.28)',
      glowColor: 'rgba(192, 132, 252, 0.12)',
    },
    {
      id: 'folders-tags',
      title: 'Folders & Tags',
      description: 'Keep your notes organized, your way.',
      icon: Folder,
      iconColor: '#fbbf24',
      borderColor: 'rgba(251, 191, 36, 0.28)',
      glowColor: 'rgba(251, 191, 36, 0.1)',
    },
    {
      id: 'offline-first',
      title: 'Offline First',
      description: 'Access and edit notes even without internet.',
      icon: CloudLightning,
      iconColor: '#c084fc',
      borderColor: 'rgba(192, 132, 252, 0.28)',
      glowColor: 'rgba(192, 132, 252, 0.12)',
    },
    {
      id: 'search',
      title: 'Powerful Search',
      description: 'Find anything in seconds with full-text search.',
      icon: Search,
      iconColor: '#e9d5ff',
      borderColor: 'rgba(233, 213, 255, 0.25)',
      glowColor: 'rgba(233, 213, 255, 0.08)',
    },
    {
      id: 'import-export',
      title: 'Import & Export',
      description: 'Bring in your notes or take them anywhere.',
      icon: Share,
      iconColor: '#fbbf24',
      borderColor: 'rgba(251, 191, 36, 0.28)',
      glowColor: 'rgba(251, 191, 36, 0.1)',
    },
  ];

  return (
    <section id="features" className="w-full pt-1 pb-10 px-4 sm:px-6 lg:px-8 relative z-20">
      <div className="max-w-7xl mx-auto">
        {/* Five Feature Cards in a single row on desktop, wrapping gracefully on tablet & mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4.5 items-stretch">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                className="relative group rounded-[4px] p-5 transition-all duration-300 cursor-default flex flex-col justify-between hover:-translate-y-1 hover:shadow-2xl select-none"
                style={{
                  backgroundColor: 'rgba(23, 17, 36, 0.75)',
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${card.borderColor}`,
                  boxShadow: `0 8px 24px -4px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.08)`
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
                  {/* Card Icon */}
                  <div className="mb-4">
                    <Icon
                      className="w-6 h-6 stroke-[1.9] transition-transform duration-300 group-hover:scale-110"
                      style={{ color: card.iconColor }}
                    />
                  </div>

                  {/* Card Title (Serif) */}
                  <h3 className="text-base sm:text-lg font-bold font-serif text-[#f5f3f0] mb-1.5 tracking-tight group-hover:text-purple-200 transition-colors">
                    {card.title}
                  </h3>

                  {/* Card Description (Sans-serif) */}
                  <p className="text-xs sm:text-[13px] leading-relaxed text-[#b8b3c8]">
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
