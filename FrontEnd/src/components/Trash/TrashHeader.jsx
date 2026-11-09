import React from 'react';
import { Trash2, Clock, Info, RotateCcw } from 'lucide-react';

export const TrashHeader = ({
  onEmptyTrash,
  onRestoreAll,
  totalItems = 0
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#222230]">
      {/* Title & Subtitle */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-[6px] bg-[#1a1a26] border border-[#2b2b3d] flex items-center justify-center text-purple-400 shrink-0">
          <Trash2 className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Trash</h1>
          <p className="text-xs text-gray-400">
            Deleted notes and folders are kept for 30 days
          </p>
        </div>
      </div>

      {/* 30-Day Policy Pill & Global Actions */}
      <div className="flex items-center gap-2.5">
        <div className="bg-[#151522] border border-[#272738] rounded-full px-3 py-1 flex items-center gap-1.5 text-xs text-gray-400 select-none">
          <Clock className="w-3.5 h-3.5 text-purple-400" />
          <span>Auto-delete in 30 days</span>
          <Info className="w-3.5 h-3.5 text-gray-500 hover:text-gray-300 cursor-help" />
        </div>

        {totalItems > 0 && onRestoreAll && (
          <button
            onClick={onRestoreAll}
            className="px-3 py-1 rounded-[3px] bg-[#1a1a26] hover:bg-[#222232] border border-[#2b2b3d] text-gray-300 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
            title="Restore all deleted items"
          >
            <RotateCcw className="w-3.5 h-3.5 text-purple-400" />
            <span>Restore All</span>
          </button>
        )}

        {totalItems > 0 && onEmptyTrash && (
          <button
            onClick={onEmptyTrash}
            className="px-3 py-1 rounded-[3px] bg-red-950/30 hover:bg-red-950/50 border border-red-500/40 text-red-400 hover:text-red-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
            title="Permanently remove all items"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-400" />
            <span>Empty Trash</span>
          </button>
        )}
      </div>
    </div>
  );
};
