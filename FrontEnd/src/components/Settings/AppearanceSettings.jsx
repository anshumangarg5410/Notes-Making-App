import React from 'react';
import { Monitor, Sun, Moon, Laptop } from 'lucide-react';

const ACCENT_COLORS = [
  { id: 'purple', name: 'Purple', hex: '#a855f7', ring: 'ring-purple-400' },
  { id: 'blue', name: 'Blue', hex: '#3b82f6', ring: 'ring-blue-400' },
  { id: 'green', name: 'Green', hex: '#22c55e', ring: 'ring-green-400' },
  { id: 'orange', name: 'Amber', hex: '#f97316', ring: 'ring-amber-400' },
  { id: 'pink', name: 'Pink', hex: '#ec4899', ring: 'ring-pink-400' },
];

export const AppearanceSettings = ({
  theme = 'dark',
  accentColor = 'purple',
  onThemeChange,
  onAccentChange,
}) => {
  const themes = [
    { id: 'light', label: 'Light', icon: Sun },
    { id: 'dark', label: 'Dark', icon: Moon },
    { id: 'system', label: 'System', icon: Laptop },
  ];

  return (
    <div className="rounded-[6px] border border-[#272738] bg-[#14141e] p-5 shadow-sm text-xs flex flex-col justify-between h-full">
      <div>
        {/* Header */}
        <div className="flex items-center gap-2 mb-1">
          <Monitor className="w-4 h-4 text-purple-400" />
          <h3 className="text-sm font-bold text-white tracking-tight">Appearance</h3>
        </div>
        <p className="text-[11px] text-gray-400 mb-4">
          Customize the look and feel of NoteNest
        </p>

        {/* Theme Selectors */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {themes.map((t) => {
            const Icon = t.icon;
            const isSelected = theme === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => onThemeChange && onThemeChange(t.id)}
                className={`relative flex flex-col items-center justify-center p-3 rounded-[6px] border transition-all text-center group cursor-pointer ${
                  isSelected
                    ? 'border-purple-500/80 bg-purple-950/25 text-white shadow-[0_0_12px_rgba(168,85,247,0.15)]'
                    : 'border-[#272738] bg-[#1b1b26]/50 text-gray-400 hover:border-gray-600 hover:text-gray-200'
                }`}
              >
                {/* Radio indicator */}
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

      {/* Accent Color */}
      <div className="pt-2 border-t border-[#272738]/60">
        <label className="block text-[11px] font-medium text-gray-300 mb-2.5">
          Accent Color
        </label>
        <div className="flex items-center gap-2.5">
          {ACCENT_COLORS.map((c) => {
            const isSelected = accentColor === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => onAccentChange && onAccentChange(c.id)}
                title={c.name}
                className={`w-6 h-6 rounded-full transition-transform cursor-pointer flex items-center justify-center ${
                  isSelected
                    ? 'ring-2 ring-offset-2 ring-offset-[#14141e] ring-purple-400 scale-110 shadow-[0_0_8px_rgba(168,85,247,0.4)]'
                    : 'hover:scale-105 opacity-85 hover:opacity-100'
                }`}
                style={{ backgroundColor: c.hex }}
              >
                {isSelected && (
                  <div className="w-1.5 h-1.5 rounded-full bg-white shadow-xs" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
