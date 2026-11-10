import React from 'react';
import { Monitor, Sun, Moon, Laptop } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const ACCENT_COLORS = [
  { id: 'purple', name: 'Purple', hex: '#a855f7', ring: 'ring-purple-400' },
  { id: 'blue', name: 'Blue', hex: '#3b82f6', ring: 'ring-blue-400' },
  { id: 'cyan', name: 'Cyan', hex: '#06b6d4', ring: 'ring-cyan-400' },
  { id: 'green', name: 'Green', hex: '#10b981', ring: 'ring-green-400' },
  { id: 'amber', name: 'Amber', hex: '#f59e0b', ring: 'ring-amber-400' },
  { id: 'pink', name: 'Pink', hex: '#ec4899', ring: 'ring-pink-400' }
];

export const AppearanceSettings = ({
  theme: propTheme,
  accentColor: propAccentColor,
  onThemeChange,
  onAccentChange,
}) => {
  const themeContext = useTheme();
  const theme = propTheme || themeContext?.theme || 'dark';
  const accentColor = propAccentColor || themeContext?.accentColor || 'purple';
  const handleThemeChange = (val) => (onThemeChange ? onThemeChange(val) : themeContext?.setTheme(val));
  const handleAccentChange = (val) => (onAccentChange ? onAccentChange(val) : themeContext?.setAccentColor(val));
  const themes = [
    { id: 'light', label: 'Light', icon: Sun },
    { id: 'dark', label: 'Dark', icon: Moon },
    { id: 'system', label: 'System', icon: Laptop },
  ];

  return (
    <div className="rounded-[20px] border border-[#1f2433] bg-[#0d1120] p-6 shadow-[0_0_25px_rgba(9,14,27,0.35)] text-xs flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Monitor className="w-4 h-4 text-purple-400" />
          <h3 className="text-sm font-bold text-white tracking-tight">Appearance</h3>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          {themes.map((t) => {
            const Icon = t.icon;
            const isSelected = theme === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => handleThemeChange(t.id)}
                className={`relative flex flex-col items-center justify-center p-3 rounded-[10px] border transition-all text-center group cursor-pointer ${
                  isSelected
                    ? 'border-purple-500/80 bg-purple-950/25 text-white shadow-[0_0_12px_rgba(168,85,247,0.15)]'
                    : 'border-[#272738] bg-[#1b1b26]/50 text-gray-400 hover:border-gray-600 hover:text-gray-200'
                }`}
              >
                <div
                  className={`absolute top-2 right-2 w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                    isSelected
                      ? 'border-purple-400 bg-purple-600'
                      : 'border-gray-600 bg-transparent'
                  }`}
                >
                  {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>

                <div className="relative mb-2 mt-1">
                  <Icon
                    className={`w-4 h-4 ${
                      isSelected ? 'text-purple-300' : 'text-gray-400 group-hover:text-gray-200'
                    }`}
                  />
                  {isSelected && t.id === 'dark' && (
                    <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                  )}
                </div>
                <span className="text-[11px] font-medium">{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="pt-4 border-t border-[#1f2433]">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="text-[11px] font-semibold text-white">Accent Color</div>
            <div className="text-[11px] text-gray-400">Pick an accent color for highlights and active elements.</div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {ACCENT_COLORS.map((c) => {
              const isSelected = accentColor === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => handleAccentChange(c.id)}
                  title={c.name}
                  aria-label={`Select ${c.name} accent color`}
                  className={`relative flex items-center justify-center rounded-full border-2 border-transparent transition-all duration-200 ${
                    isSelected
                      ? 'scale-110'
                      : 'hover:scale-105 opacity-90 hover:opacity-100'
                  }`}
                  style={{
                    width: isSelected ? '52px' : '40px',
                    height: isSelected ? '52px' : '40px',
                    backgroundColor: c.hex,
                    borderColor: isSelected ? '#f8fafc' : 'transparent',
                    boxShadow: isSelected ? `0 0 0 3px rgba(255,255,255,0.08), 0 0 0 5px ${c.hex}50` : undefined
                  }}
                >
                  {isSelected && (
                    <div className="w-2.5 h-2.5 rounded-full bg-white/90 shadow-[0_0_0_2px_rgba(15,23,42,0.14)]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

