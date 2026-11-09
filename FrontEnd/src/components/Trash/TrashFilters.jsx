import React, { useState } from 'react';
import { Search, ChevronDown, LayoutGrid, List, X } from 'lucide-react';

export const TrashFilters = ({
  activeFilter = 'all',
  onSelectFilter,
  counts = { all: 15, notes: 12, folders: 3 },
  searchQuery = '',
  onSearchChange,
  sortBy = 'deleted_desc',
  onSelectSort,
  viewMode = 'table',
  onSelectViewMode
}) => {
  const [sortOpen, setSortOpen] = useState(false);

  const filters = [
    { id: 'all', label: 'All', count: counts.all },
    { id: 'notes', label: 'Notes', count: counts.notes },
    { id: 'folders', label: 'Folders', count: counts.folders }
  ];

  const sortLabels = {
    deleted_desc: 'Deleted At',
    deleted_asc: 'Oldest First',
    name_asc: 'Name (A–Z)',
    name_desc: 'Name (Z–A)',
    type: 'Item Type'
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 select-none text-xs">
      {/* Left: Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto obsidian-scrollbar py-0.5">
        {filters.map((f) => {
          const isActive = activeFilter === f.id;
          return (
            <button
              key={f.id}
              onClick={() => onSelectFilter(f.id)}
              className={`px-3 py-1 rounded-[3px] font-medium transition-colors ${
                isActive
                  ? 'bg-purple-900/40 text-purple-300 border border-purple-500/40'
                  : 'bg-[#151520] text-gray-400 hover:text-gray-200 border border-[#242436] hover:border-gray-600'
              }`}
            >
              <span>{f.label}</span>
              <span className="ml-1 opacity-60">({f.count})</span>
            </button>
          );
        })}
      </div>

      {/* Right: Search, Sort Dropdown & View Toggles */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="relative flex items-center w-full sm:w-56">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search in trash..."
            className="w-full bg-[#161622] border border-[#272738] focus:border-purple-500/60 rounded-[3px] pl-8 pr-12 py-1.5 text-xs text-gray-200 placeholder-gray-500 focus:outline-none transition-colors"
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

        {/* Sort Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setSortOpen(!sortOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-[3px] bg-[#161622] hover:bg-[#1e1e2c] text-gray-300 border border-[#272738] transition-colors"
          >
            <span>{sortLabels[sortBy] || 'Deleted At'}</span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </button>

          {sortOpen && (
            <div className="absolute right-0 top-full mt-1 w-36 bg-[#1a1a26] border border-[#2b2b3d] rounded-[4px] shadow-2xl py-1 z-30 text-xs">
              {Object.entries(sortLabels).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => {
                    onSelectSort(key);
                    setSortOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 hover:bg-[#252538] ${
                    sortBy === key ? 'text-purple-400 font-semibold' : 'text-gray-300'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* View Mode Buttons */}
        <div className="flex items-center bg-[#161622] border border-[#272738] rounded-[3px] p-0.5">
          <button
            type="button"
            onClick={() => onSelectViewMode('grid')}
            className={`p-1.5 rounded-[2px] transition-colors ${
              viewMode === 'grid'
                ? 'bg-purple-900/50 text-purple-300'
                : 'text-gray-400 hover:text-white'
            }`}
            title="Grid View"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onSelectViewMode('table')}
            className={`p-1.5 rounded-[2px] transition-colors ${
              viewMode === 'table'
                ? 'bg-purple-900/50 text-purple-300'
                : 'text-gray-400 hover:text-white'
            }`}
            title="Table View"
          >
            <List className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
