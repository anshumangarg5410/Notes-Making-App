import React from 'react';
import { CloudLightning, FileText, Zap, PenTool } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const AboutCapabilities = () => {
  const { isDark } = useTheme();

  const capabilities = [
    {
      id: 'offline',
      icon: CloudLightning,
      value: '100% Offline',
      label: 'Local-First Dexie Storage'
    },
    {
      id: 'editor',
      icon: FileText,
      value: 'Markdown & Rich Text',
      label: 'Dual-Mode Obsidian Flow'
    },
    {
      id: 'focus',
      icon: Zap,
      value: 'Instant Full-Text Search',
      label: 'Zero-Lag Query Engine'
    },
    {
      id: 'scribble',
      icon: PenTool,
      value: 'Scribble & Sketch',
      label: 'Vector Canvas & Handwriting'
    }
  ];

  return (
    <section className="w-full py-4 sm:py-6">
      <div
        className={`rounded-[10px] p-5 sm:p-7 border backdrop-blur-md transition-all duration-300 ${
          isDark
            ? 'bg-[#120a22]/85 border-purple-500/25 shadow-xl'
            : 'bg-white/95 border-purple-200 shadow-md'
        }`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 items-center divide-y sm:divide-y-0 lg:divide-x divide-purple-500/15">
          {capabilities.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className={`flex items-center gap-4 ${
                  idx > 0 ? 'pt-4 sm:pt-0 lg:pl-6' : ''
                }`}
              >
                <div
                  className={`w-11 h-11 rounded-[8px] flex items-center justify-center shrink-0 border ${
                    isDark
                      ? 'bg-purple-950/60 border-purple-400/40 text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.25)]'
                      : 'bg-purple-50 border-purple-200 text-purple-700'
                  }`}
                >
                  <Icon className="w-5 h-5 stroke-[2]" />
                </div>
                <div className="text-left space-y-0.5">
                  <div
                    className={`text-base sm:text-lg font-bold tracking-tight ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {item.value}
                  </div>
                  <div
                    className={`text-xs ${
                      isDark ? 'text-gray-400' : 'text-slate-500'
                    }`}
                  >
                    {item.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AboutCapabilities;
