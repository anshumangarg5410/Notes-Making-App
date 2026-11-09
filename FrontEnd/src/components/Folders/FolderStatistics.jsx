import React from 'react';
import { Folder, FileText, Layers, Tag } from 'lucide-react';

export const FolderStatistics = ({ stats = {} }) => {
  const cards = [
    {
      label: 'Total Folders',
      value: stats.totalFolders ?? 8,
      icon: <Folder className="w-4 h-4 text-purple-300" />
    },
    {
      label: 'Total Notes',
      value: stats.totalNotes ?? 42,
      icon: <FileText className="w-4 h-4 text-purple-300" />
    },
    {
      label: 'Nested Folders',
      value: stats.nestedFolders ?? 3,
      icon: <Layers className="w-4 h-4 text-purple-300" />
    },
    {
      label: 'Tagged Folders',
      value: stats.taggedFolders ?? 12,
      icon: <Tag className="w-4 h-4 text-purple-300" />
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 py-4">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-[#14141f] border border-[#232334] rounded-[5px] p-3 flex items-center gap-3.5 shadow-sm select-none"
        >
          <div className="w-9 h-9 rounded-[4px] bg-purple-950/60 border border-purple-500/30 flex items-center justify-center shrink-0">
            {card.icon}
          </div>
          <div>
            <div className="text-lg font-bold text-white tracking-tight leading-tight">
              {card.value}
            </div>
            <div className="text-[11px] text-gray-400 font-medium">
              {card.label}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
