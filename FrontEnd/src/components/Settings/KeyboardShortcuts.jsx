import React from 'react';
import { Keyboard, Command } from 'lucide-react';

export const KeyboardShortcuts = () => {
  const isMac = typeof navigator !== 'undefined' && navigator.platform?.toUpperCase().indexOf('MAC') >= 0;
  const modKey = isMac ? '⌘' : 'Ctrl';

  const shortcuts = [
    { section: 'Navigation & Search', items: [
      { label: 'Global Quick Search', keys: [modKey, 'K'] },
      { label: 'Toggle Sidebar', keys: [modKey, '\\'] },
      { label: 'Quick Switcher / Notes', keys: [modKey, 'P'] },
      { label: 'Open Settings', keys: [modKey, ','] },
    ]},
    { section: 'Note Management', items: [
      { label: 'Create New Note', keys: [modKey, 'N'] },
      { label: 'Create New Folder', keys: [modKey, 'Shift', 'N'] },
      { label: 'Save / Sync Immediately', keys: [modKey, 'S'] },
      { label: 'Move Note to Trash', keys: [modKey, 'Backspace'] },
    ]},
    { section: 'Editor Formatting', items: [
      { label: 'Bold Text', keys: [modKey, 'B'] },
      { label: 'Italic Text', keys: [modKey, 'I'] },
      { label: 'Code Block / Inline Code', keys: [modKey, 'E'] },
      { label: 'Insert Link', keys: [modKey, 'K'] },
    ]},
  ];

  return (
    <div className="space-y-4 text-xs">
      <div className="rounded-[6px] border border-[#272738] bg-[#14141e] p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <Keyboard className="w-4 h-4 text-purple-400" />
          <h3 className="text-sm font-bold text-white tracking-tight">Keyboard Shortcuts</h3>
        </div>
        <p className="text-[11px] text-gray-400 mb-5">
          Work faster in NoteNest with these productivity shortcuts
        </p>

        <div className="space-y-5">
          {shortcuts.map((group) => (
            <div key={group.section}>
              <h4 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                {group.section}
              </h4>
              <div className="divide-y divide-[#272738]/60 border border-[#272738] rounded-[6px] bg-[#1a1a26]/40 overflow-hidden">
                {group.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 px-3.5 hover:bg-[#1e1e2d] transition-colors"
                  >
                    <span className="text-xs text-gray-200">{item.label}</span>
                    <div className="flex items-center gap-1">
                      {item.keys.map((k, kIdx) => (
                        <kbd
                          key={kIdx}
                          className="px-2 py-0.5 text-[10px] font-mono font-semibold bg-[#272738] border border-[#3b3b52] text-gray-200 rounded shadow-xs"
                        >
                          {k}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

