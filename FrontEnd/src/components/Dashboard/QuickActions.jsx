import React from 'react';
import { Zap, Plus, FolderPlus, Upload, Download } from 'lucide-react';

export const QuickActions = ({
  onNewNote,
  onNewFolder,
  onImport,
  onExport
}) => {
  return (
    <div className="rounded-[4px] p-5 bg-[#181226]/90 border border-purple-500/20 shadow-xl select-none">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-4">
        <Zap className="w-4 h-4 text-purple-400" />
        <h3 className="text-base font-bold text-white tracking-tight">
          Quick Actions
        </h3>
      </div>

      {/* 2x2 Grid of Action Buttons */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* New Note: Visually Emphasized with Purple Gradient */}
        <button
          type="button"
          onClick={onNewNote}
          className="flex flex-col items-center justify-center p-3.5 rounded-[3px] bg-gradient-to-br from-[#9333ea] to-[#7c3aed] border border-purple-400/40 text-white shadow-[0_0_14px_rgba(147,51,234,0.35)] hover:shadow-[0_0_20px_rgba(147,51,234,0.55)] hover:scale-102 active:scale-98 transition-all cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-[3px] bg-white/15 flex items-center justify-center mb-1.5 group-hover:rotate-90 transition-transform duration-300">
            <Plus className="w-4 h-4 text-white" />
          </div>
          <span className="text-xs font-semibold">New Note</span>
        </button>

        {/* New Folder */}
        <button
          type="button"
          onClick={onNewFolder}
          className="flex flex-col items-center justify-center p-3.5 rounded-[3px] bg-[#1c152a] border border-purple-500/20 hover:border-purple-400/50 hover:bg-[#251b38] text-stone-200 hover:text-white transition-all cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-[3px] bg-purple-950/70 border border-purple-500/30 flex items-center justify-center mb-1.5 text-purple-300 group-hover:scale-105 transition-transform">
            <FolderPlus className="w-4 h-4" />
          </div>
          <span className="text-xs font-medium">New Folder</span>
        </button>

        {/* Import */}
        <button
          type="button"
          onClick={onImport}
          className="flex flex-col items-center justify-center p-3.5 rounded-[3px] bg-[#1c152a] border border-purple-500/20 hover:border-purple-400/50 hover:bg-[#251b38] text-stone-200 hover:text-white transition-all cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-[3px] bg-purple-950/70 border border-purple-500/30 flex items-center justify-center mb-1.5 text-purple-300 group-hover:-translate-y-0.5 transition-transform">
            <Upload className="w-4 h-4" />
          </div>
          <span className="text-xs font-medium">Import</span>
        </button>

        {/* Export */}
        <button
          type="button"
          onClick={onExport}
          className="flex flex-col items-center justify-center p-3.5 rounded-[3px] bg-[#1c152a] border border-purple-500/20 hover:border-purple-400/50 hover:bg-[#251b38] text-stone-200 hover:text-white transition-all cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-[3px] bg-purple-950/70 border border-purple-500/30 flex items-center justify-center mb-1.5 text-purple-300 group-hover:translate-y-0.5 transition-transform">
            <Download className="w-4 h-4" />
          </div>
          <span className="text-xs font-medium">Export</span>
        </button>
      </div>
    </div>
  );
};

export default QuickActions;

