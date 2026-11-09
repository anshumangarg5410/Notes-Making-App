import React from 'react';
import { PenTool, Folder, CloudLightning, Search, Share2, Sparkles } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const FeatureCards = () => {
  const { isDark } = useTheme();

  const features = [
    {
      id: 'editor',
      title: 'Rich Text Editor',
      description: 'Write beautifully with powerful formatting tools.',
      icon: PenTool,
      accentColor: isDark ? '#c084fc' : '#7c3aed',
      badge: 'Markdown & Rich-Text',
      bgGlow: isDark ? 'rgba(192,132,252,0.12)' : 'rgba(124,58,237,0.06)',
      borderColor: isDark ? 'rgba(192,132,252,0.25)' : 'rgba(124,58,237,0.18)',
      rotation: '-rotate-1',
    },
    {
      id: 'organization',
      title: 'Folders & Tags',
      description: 'Keep your notes organized, your way.',
      icon: Folder,
      accentColor: isDark ? '#fbbf24' : '#d97706',
      badge: 'Nested Hierarchy',
      bgGlow: isDark ? 'rgba(251,191,36,0.12)' : 'rgba(217,119,6,0.06)',
      borderColor: isDark ? 'rgba(251,191,36,0.25)' : 'rgba(217,119,6,0.18)',
      rotation: 'rotate-1',
    },
    {
      id: 'offline',
      title: 'Offline First',
      description: 'Access and edit notes even without internet.',
      icon: CloudLightning,
      accentColor: isDark ? '#c084fc' : '#9333ea',
      badge: 'Local Database',
      bgGlow: isDark ? 'rgba(192,132,252,0.12)' : 'rgba(147,51,234,0.06)',
      borderColor: isDark ? 'rgba(192,132,252,0.25)' : 'rgba(147,51,234,0.18)',
      rotation: '-rotate-0.5',
    },
    {
      id: 'search',
      title: 'Powerful Search',
      description: 'Find anything in seconds with full-text search.',
      icon: Search,
      accentColor: isDark ? '#e9d5ff' : '#6b21a8',
      badge: 'Instant Results',
      bgGlow: isDark ? 'rgba(233,213,255,0.1)' : 'rgba(107,33,168,0.05)',
      borderColor: isDark ? 'rgba(233,213,255,0.22)' : 'rgba(107,33,168,0.18)',
      rotation: 'rotate-1',
    },
    {
      id: 'export',
      title: 'Import & Export',
      description: 'Bring in your notes or take them anywhere.',
      icon: Share2,
      accentColor: isDark ? '#fbbf24' : '#b45309',
      badge: 'Markdown & PDF',
      bgGlow: isDark ? 'rgba(251,191,36,0.12)' : 'rgba(180,83,9,0.06)',
      borderColor: isDark ? 'rgba(251,191,36,0.25)' : 'rgba(180,83,9,0.18)',
      rotation: '-rotate-1',
    },
  ];

  return (
    <section
      id="features"
      className="relative pt-2 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden transition-colors duration-300"
      style={{
        background: isDark
          ? 'linear-gradient(180deg, #0c0916 0%, #151124 50%, #0d0a17 100%)'
          : 'linear-gradient(180deg, #f3edf8 0%, #faf8f5 50%, #f6f0fa 100%)'
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* 5 Feature Cards Grid matching the 5 cards in Reference */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 items-stretch">
          {features.map((feature, idx) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={feature.id}
                className={`relative group rounded-2xl p-6 transition-all duration-300 cursor-default flex flex-col justify-between ${feature.rotation} hover:rotate-0 hover:scale-103 hover:z-20`}
                style={{
                  backgroundColor: isDark ? '#191329' : '#ffffff',
                  backgroundImage: isDark
                    ? 'radial-gradient(ellipse at top left, rgba(168,85,247,0.12) 0%, transparent 70%)'
                    : 'radial-gradient(ellipse at top left, rgba(251,191,36,0.08) 0%, transparent 70%)',
                  border: `1.5px solid ${feature.borderColor}`,
                  boxShadow: isDark
                    ? '0 10px 30px -10px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.08)'
                    : '0 8px 24px -6px rgba(120,80,40,0.08), inset 0 1px 0 rgba(255,255,255,0.8)',
                }}
              >
                {/* Paper texture overlay / subtle torn edge effect */}
                <div
                  className="absolute inset-0 rounded-2xl pointer-events-none opacity-40 transition-opacity group-hover:opacity-70"
                  style={{
                    boxShadow: `inset 0 0 18px ${feature.bgGlow}`
                  }}
                />

                {/* Top: Illustrated Icon in Hand-Drawn Style */}
                <div>
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                    style={{
                      backgroundColor: feature.bgGlow,
                      border: `1px solid ${feature.borderColor}`,
                      color: feature.accentColor
                    }}
                  >
                    <IconComponent className="w-6 h-6 stroke-[1.8]" />
                  </div>

                  {/* Title */}
                  <h3
                    className={`text-lg font-bold font-serif mb-2 tracking-tight transition-colors ${
                      isDark ? 'text-white group-hover:text-purple-300' : 'text-stone-900 group-hover:text-purple-900'
                    }`}
                  >
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className={`text-xs sm:text-sm leading-relaxed ${
                    isDark ? 'text-stone-300' : 'text-stone-600'
                  }`}>
                    {feature.description}
                  </p>
                </div>

                {/* Bottom: Subtle stationery tag */}
                <div className="mt-5 pt-4 border-t border-purple-500/10 flex items-center justify-between">
                  <span
                    className="text-[11px] font-mono uppercase tracking-wider font-semibold"
                    style={{ color: feature.accentColor }}
                  >
                    {feature.badge}
                  </span>
                  <span className={`text-[10px] font-mono ${isDark ? 'text-stone-500' : 'text-stone-400'}`}>
                    0{idx + 1}
                  </span>
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
