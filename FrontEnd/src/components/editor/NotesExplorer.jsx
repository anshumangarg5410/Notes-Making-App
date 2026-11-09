import React, { useState, useMemo } from 'react';
import { Search, Plus, Filter, ArrowUpDown } from 'lucide-react';
import { NoteListItem } from './NoteListItem';

export const NotesExplorer = ({
  notes = [],
  selectedNoteId,
  onSelectNote,
  onNewNote,
  searchQuery = '',
  onSearchChange,
  activeFilter = 'all',
  selectedFolder,
  selectedTag,
  onTogglePin,
  onToggleFavorite,
  onDeleteNote,
  onDuplicateNote,
  isLoading = false
}) => {
  const [subFilter, setSubFilter] = useState('all'); // 'all', 'recent', 'pinned'
  const [sortOrder, setSortOrder] = useState('updated'); // 'updated', 'title'

  // Filter notes based on search, active navigation, folder, tag, and sub-filter (All/Recent/Pinned)
  const filteredNotes = useMemo(() => {
    let result = [...notes];

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((n) => {
        const titleMatch = (n.title || '').toLowerCase().includes(q);
        const tagMatch = (n.tags || []).some((t) => t.toLowerCase().includes(q));
        const contentMatch = (n.plainText || (typeof n.content === 'string' ? n.content : '')).toLowerCase().includes(q);
        return titleMatch || tagMatch || contentMatch;
      });
    }

    // Filter by Folder if selected
    if (selectedFolder) {
      result = result.filter((n) => {
        const folderName = selectedFolder.toLowerCase();
        return (
          (n.category && n.category.toLowerCase() === folderName) ||
          (n.folder && n.folder.toLowerCase() === folderName) ||
          (n.tags && n.tags.some((t) => t.toLowerCase() === folderName))
        );
      });
    }

    // Filter by Tag if selected
    if (selectedTag) {
      result = result.filter((n) =>
        (n.tags || []).some((t) => t.toLowerCase() === selectedTag.toLowerCase())
      );
    }

    // Sub-filters: 'recent', 'pinned'
    if (subFilter === 'pinned') {
      result = result.filter((n) => n.isPinned);
    } else if (subFilter === 'recent') {
      // Sort strictly by latest updated
      result.sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt));
    }

    return result;
  }, [notes, searchQuery, selectedFolder, selectedTag, subFilter]);

  // Determine explorer header title
  const getHeaderTitle = () => {
    if (selectedFolder) return selectedFolder;
    if (selectedTag) return `#${selectedTag}`;
    if (activeFilter === 'favorites') return 'Favorites';
    if (activeFilter === 'trash') return 'Trash';
    return 'All Notes';
  };

  return (
    <div className="h-full bg-[#15151e] border-r border-[#222230] flex flex-col select-none text-xs w-72 min-w-[260px] max-w-[320px]">
      {/* Header */}
      <div className="p-3.5 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-gray-100 tracking-tight">
            {getHeaderTitle()}
          </h2>
          <span className="text-[11px] text-gray-500 font-mono">
            {filteredNotes.length}
          </span>
        </div>

        <button
          onClick={onNewNote}
          className="w-7 h-7 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white rounded-[4px] flex items-center justify-center transition-colors shadow-sm shadow-purple-900/40"
          title="New Note (Cmd+N)"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>

      {/* Search Input matching reference */}
      <div className="px-3 py-1.5">
        <div className="relative flex items-center">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search notes..."
            className="w-full bg-[#1b1b26] border border-[#272738] focus:border-purple-500/60 rounded-[4px] pl-8 pr-12 py-1.5 text-xs text-gray-200 placeholder-gray-500 focus:outline-none transition-colors"
          />
          <kbd className="absolute right-2 px-1.5 py-0.5 text-[9px] font-mono text-gray-400 bg-[#252536] rounded-[2px] border border-[#313144] pointer-events-none">
            ⌘ K
          </kbd>
        </div>
      </div>

      {/* Sub-Filter Tabs: All, Recent, Pinned */}
      <div className="px-3 pt-2 pb-1.5 flex items-center gap-1 border-b border-[#20202e]">
        {[
          { id: 'all', label: 'All' },
          { id: 'recent', label: 'Recent' },
          { id: 'pinned', label: 'Pinned' }
        ].map((tab) => {
          const isActive = subFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSubFilter(tab.id)}
              className={`px-2.5 py-1 rounded-[3px] text-[11px] font-medium transition-colors ${
                isActive
                  ? 'bg-purple-900/30 text-purple-300 border border-purple-500/40'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-[#1c1c28]'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Notes List */}
      <div className="flex-1 overflow-y-auto obsidian-scrollbar p-2 space-y-1">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500 text-xs">
            <div className="w-5 h-5 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-2" />
            Loading notes...
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="p-6 text-center text-gray-500 text-xs space-y-2">
            <p>No notes found</p>
            <button
              onClick={onNewNote}
              className="px-2.5 py-1 text-[11px] bg-purple-600/20 text-purple-300 border border-purple-500/30 rounded-[3px] hover:bg-purple-600/30 transition-colors"
            >
              Create a note
            </button>
          </div>
        ) : (
          filteredNotes.map((note) => {
            const isSelected = (note._id || note.id) === selectedNoteId;
            return (
              <NoteListItem
                key={note._id || note.id}
                note={note}
                isSelected={isSelected}
                onSelect={onSelectNote}
                onTogglePin={onTogglePin}
                onToggleFavorite={onToggleFavorite}
                onDelete={onDeleteNote}
                onDuplicate={onDuplicateNote}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

