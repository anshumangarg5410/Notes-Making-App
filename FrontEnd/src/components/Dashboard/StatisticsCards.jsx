import React from 'react';
import { FileText, Folder, Tag, Star } from 'lucide-react';

export const StatisticsCards = ({
  stats = { totalNotes: 48, folders: 6, tags: 12, favorites: 9 },
  onCardClick
}) => {
  const cards = [
    {
      id: 'all-notes',
      label: 'Total Notes',
      value: stats.totalNotes ?? 48,
      icon: FileText,
      iconBg: 'bg-purple-900/40 text-purple-300 border border-purple-500/30',
      waveColor: '#9333ea'
    },
    {
      id: 'folders',
      label: 'Folders',
      value: stats.folders ?? 6,
      icon: Folder,
      iconBg: 'bg-amber-950/40 text-amber-400 border border-amber-500/30',
      waveColor: '#d97706'
    },
    {
      id: 'tags',
      label: 'Tags',
      value: stats.tags ?? 12,
      icon: Tag,
      iconBg: 'bg-indigo-950/40 text-indigo-300 border border-indigo-500/30',
      waveColor: '#6366f1'
    },
    {
      id: 'favorites',
      label: 'Favorites',
      value: stats.favorites ?? 9,
      icon: Star,
      iconBg: 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/30',
      waveColor: '#10b981'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 select-none">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            onClick={() => onCardClick && onCardClick(card.id)}
            className="relative rounded-2xl p-4 bg-[#181226]/90 border border-purple-500/20 hover:border-purple-400/50 hover:bg-[#1e1630] transition-all duration-200 cursor-pointer overflow-hidden group shadow-md"
          >
            {/* Top row: Icon + Number & Label */}
            <div className="flex items-center gap-3.5 relative z-10">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${card.iconBg}`}
              >
                <Icon className="w-5 h-5" />
              </div>

              <div>
                <div className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-none group-hover:scale-105 transition-transform origin-left">
                  {card.value}
                </div>
                <div className="text-xs text-stone-400 mt-1 font-medium">
                  {card.label}
                </div>
              </div>
            </div>

            {/* Bottom-right decorative abstract wave SVG */}
            <svg
              className="absolute -right-2 -bottom-2 w-20 h-12 opacity-25 group-hover:opacity-40 transition-opacity pointer-events-none"
              viewBox="0 0 100 50"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0 40 Q25 15, 50 35 T100 20 L100 50 L0 50 Z"
                fill={card.waveColor}
              />
            </svg>
          </div>
        );
      })}
    </div>
  );
};

export default StatisticsCards;

