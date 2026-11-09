import React from 'react';
import { Folder, Search, Plus, X } from 'lucide-react';

export const FolderPageHeader = ({
  searchQuery = '',
  onSearchChange,
  onNewFolder
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#222230]">
      {/* Title & Subtitle */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-[6px] bg-[#1a1a26] border border-[#2b2b3d] flex items-center justify-center text-purple-400 shrink-0">
          <Folder className="w-5 h-5 fill-purple-400/20" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Folders</h1>
          <p className="text-xs text-gray-400">
            Organize your notes into folders and subfolders
          </p>
        </div>
      </div>

      {/* Search Bar & New Folder CTA */}
      <div className="flex items-center gap-3">
        <div className="relative flex items-center w-full md:w-64">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search folders..."
            className="w-full bg-[#161622] border border-[#272738] focus:border-purple-500/60 rounded-[4px] pl-8 pr-12 py-1.5 text-xs text-gray-200 placeholder-gray-500 focus:outline-none transition-colors"
          />
          {searchQuery ? (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2 text-gray-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <kbd className="absolute right-2 px-1.5 py-0.5 text-[9px] font-mono text-gray-400 bg-[#222232] rounded-[2px] border border-[#2e2e42] pointer-events-none">
              ⌘ K
            </kbd>
          )}
        </div>

        <button
          onClick={onNewFolder}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs px-3.5 py-1.5 rounded-[4px] font-medium flex items-center gap-1.5 shadow-sm shadow-purple-900/40 shrink-0 transition-all hover:scale-[1.02]"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>New Folder</span>
        </button>
      </div>
    </div>
  );
};
