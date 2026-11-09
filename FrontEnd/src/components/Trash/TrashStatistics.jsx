import React from 'react';
import { FileText, Folder, Clock, RefreshCw } from 'lucide-react';

export const TrashStatistics = ({ stats = {} }) => {
  const cards = [
    {
      label: 'Deleted Notes',
      value: stats.deletedNotes ?? 12,
      icon: <FileText className="w-4 h-4 text-purple-300" />
    },
    {
      label: 'Deleted Folders',
      value: stats.deletedFolders ?? 3,
      icon: <Folder className="w-4 h-4 text-purple-300" />
    },
    {
      label: 'Retention Period',
      value: '30 days',
      icon: <Clock className="w-4 h-4 text-purple-300" />
    },
    {
      label: 'Permanent deletion after 30 days',
      value: 'Auto Cleanup',
      icon: <RefreshCw className="w-4 h-4 text-purple-300" />
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 py-4 select-none">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-[#14141f] border border-[#232334] rounded-[5px] p-3 flex items-center gap-3.5 shadow-sm"
        >
          <div className="w-9 h-9 rounded-[4px] bg-purple-950/60 border border-purple-500/30 flex items-center justify-center shrink-0">
            {card.icon}
          </div>
          <div className="min-w-0">
            <div className="text-base sm:text-lg font-bold text-white tracking-tight truncate leading-tight">
              {card.value}
            </div>
            <div className="text-[11px] text-gray-400 font-medium truncate">
              {card.label}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
