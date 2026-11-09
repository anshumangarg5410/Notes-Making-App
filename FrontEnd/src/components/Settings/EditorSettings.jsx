import React, { useState } from 'react';
import { PenTool, Type, FileCode, Check } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const EditorSettings = () => {
  const { success } = useToast();
  const [fontFamily, setFontFamily] = useState('inter');
  const [fontSize, setFontSize] = useState('14');
  const [lineHeight, setLineHeight] = useState('1.6');
  const [spellCheck, setSpellCheck] = useState(true);
  const [vimMode, setVimMode] = useState(false);
  const [lineNumbers, setLineNumbers] = useState(false);

  const handleSave = () => {
    localStorage.setItem('notenest_editor_settings', JSON.stringify({
      fontFamily,
      fontSize,
      lineHeight,
      spellCheck,
      vimMode,
      lineNumbers,
    }));
    success('Editor preferences saved');
  };

  return (
    <div className="space-y-4 text-xs">
      <div className="rounded-[6px] border border-[#272738] bg-[#14141e] p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <PenTool className="w-4 h-4 text-purple-400" />
          <h3 className="text-sm font-bold text-white tracking-tight">Editor Typography & Layout</h3>
        </div>
        <p className="text-[11px] text-gray-400 mb-4">
          Tune your writing environment for comfort, speed, and precision
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-gray-400 font-medium mb-1.5">Font Family</label>
            <select
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value)}
              className="w-full bg-[#1b1b26] border border-[#2e2e42] rounded-[5px] px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
            >
              <option value="inter">Inter (Default)</option>
              <option value="jetbrains">JetBrains Mono</option>
              <option value="serif">Merriweather Serif</option>
              <option value="system">System UI</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-400 font-medium mb-1.5">Font Size</label>
            <select
              value={fontSize}
              onChange={(e) => setFontSize(e.target.value)}
              className="w-full bg-[#1b1b26] border border-[#2e2e42] rounded-[5px] px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
            >
              <option value="12">12px - Compact</option>
              <option value="14">14px - Regular</option>
              <option value="16">16px - Large</option>
              <option value="18">18px - Extra Large</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-400 font-medium mb-1.5">Line Spacing</label>
            <select
              value={lineHeight}
              onChange={(e) => setLineHeight(e.target.value)}
              className="w-full bg-[#1b1b26] border border-[#2e2e42] rounded-[5px] px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
            >
              <option value="1.4">Tight (1.4)</option>
              <option value="1.6">Normal (1.6)</option>
              <option value="1.8">Relaxed (1.8)</option>
            </select>
          </div>
        </div>

        {/* Toggles */}
        <div className="space-y-3 pt-3 border-t border-[#272738]/60 max-w-lg">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="text-xs font-medium text-gray-200">Show Line Numbers in Code Blocks</p>
              <p className="text-[10.5px] text-gray-500">Displays gutter numbers for code syntax blocks</p>
            </div>
            <input
              type="checkbox"
              checked={lineNumbers}
              onChange={(e) => setLineNumbers(e.target.checked)}
              className="accent-purple-600 w-4 h-4 rounded cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="text-xs font-medium text-gray-200">Spell Check</p>
              <p className="text-[10.5px] text-gray-500">Native browser spelling detection and underline</p>
            </div>
            <input
              type="checkbox"
              checked={spellCheck}
              onChange={(e) => setSpellCheck(e.target.checked)}
              className="accent-purple-600 w-4 h-4 rounded cursor-pointer"
            />
          </label>
        </div>

        <div className="pt-5">
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium rounded-[5px] text-xs transition-all cursor-pointer shadow-sm"
          >
            Save Editor Preferences
          </button>
        </div>
      </div>
    </div>
  );
};
