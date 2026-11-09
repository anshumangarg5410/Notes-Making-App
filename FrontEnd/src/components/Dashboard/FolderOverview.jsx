import React from 'react';
import { Folder, ArrowRight } from 'lucide-react';

export const FolderOverview = ({
  folders = [
    { id: 'college', name: 'College', count: 18 },
    { id: 'projects', name: 'Projects', count: 12 },
    { id: 'dsa', name: 'DSA', count: 8 },
    { id: 'personal', name: 'Personal', count: 6 }
  ],
  onSelectFolder,
  onViewAllFolders
}) => {
  return (
    <div className="rounded-[4px] p-5 bg-[#181226]/90 border border-purple-500/20 shadow-xl select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-purple-500/15 mb-2">
        <div className="flex items-center gap-2.5">
          <Folder className="w-4 h-4 text-purple-400" />
          <h3 className="text-base font-bold text-white tracking-tight">
            My Folders
          </h3>
        </div>

        <button
          type="button"
          onClick={onViewAllFolders}
          className="inline-flex items-center gap-1 text-xs font-semibold text-purple-300 hover:text-white transition-colors cursor-pointer group"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Folders List */}
      <div className="space-y-1">
        {folders.map((folder) => (
          <button
            key={folder.id}
            type="button"
            onClick={() => onSelectFolder && onSelectFolder(folder.name)}
            className="w-full flex items-center justify-between p-2.5 rounded-[3px] text-left hover:bg-white/5 transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <Folder className="w-4 h-4 text-purple-400/80 group-hover:text-purple-300 shrink-0 transition-colors" />
              <span className="text-xs font-medium text-stone-200 group-hover:text-white truncate">
                {folder.name}
              </span>
            </div>

            <span className="text-xs text-stone-400 font-mono group-hover:text-stone-300">
              {folder.count}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default FolderOverview;

