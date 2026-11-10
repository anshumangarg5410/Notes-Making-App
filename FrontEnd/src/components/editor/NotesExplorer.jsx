import React, { useState, useMemo } from 'react';
import { Search, Plus, Filter, ArrowUpDown, Trash2, RotateCcw } from 'lucide-react';
import { NoteListItem } from './NoteListItem';
import { useTheme } from '../../context/ThemeContext';

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
  onRestoreNote,
  onPermanentDeleteNote,
  onEmptyTrash,
  isLoading = false
}) => {
  const [subFilter, setSubFilter] = useState('all'); // 'all', 'recent', 'pinned'
  const [sortOrder, setSortOrder] = useState('updated'); // 'updated', 'title'
  const { isDark } = useTheme();

  // Filter notes based on search, active navigation, folder, tag, and sub-filter (All/Recent/Pinned)
  const filteredNotes = useMemo(() => {
    let result = [...notes];

    // Filter by navigation view
    if (activeFilter === 'favorites') {
      result = result.filter((n) => n.isFavorite && !n.isDeleted);
    } else if (activeFilter === 'trash') {
      result = result.filter((n) => n.isDeleted);
    } else {
      result = result.filter((n) => !n.isDeleted);
    }

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
    } else {
      // Default view: pinned notes always at the top, then newest updated
      result.sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt);
      });
    }

    return result;
  }, [notes, searchQuery, selectedFolder, selectedTag, subFilter, activeFilter]);

  // Determine explorer header title
  const getHeaderTitle = () => {
    if (selectedFolder) return selectedFolder;
    if (selectedTag) return `#${selectedTag}`;
    if (activeFilter === 'favorites') return 'Favorites';
    if (activeFilter === 'trash') return 'Trash';
    return 'All Notes';
  };

  return (
    <div className={`h-full border-r flex flex-col select-none text-xs w-72 min-w-[260px] max-w-[320px] transition-colors duration-150 ${
      isDark ? 'bg-[#15151e] border-[#222230]' : 'bg-[#FAFAFD] border-[#EAE6F4]'
    }`}>
      {/* Header */}
      <div className="p-3.5 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className={`text-sm font-semibold tracking-tight ${isDark ? 'text-gray-100' : 'text-[#181326]'}`}>
            {getHeaderTitle()}
          </h2>
          <span className={`text-[11px] font-mono ${isDark ? 'text-gray-500' : 'text-[#9CA3AF]'}`}>
            {filteredNotes.length}
          </span>
        </div>

        {activeFilter === 'trash' ? (
          filteredNotes.length > 0 && (
            <button
              onClick={onEmptyTrash}
              className="px-2 py-1 rounded-[3px] bg-red-950/40 hover:bg-red-900/60 text-red-300 hover:text-white border border-red-500/30 text-[11px] font-medium transition-colors flex items-center gap-1 cursor-pointer"
              title="Empty all notes in Trash"
            >
              <Trash2 className="w-3 h-3 text-red-400" />
              <span>Empty</span>
            </button>
          )
        ) : (
          <button
            onClick={onNewNote}
            className="w-7 h-7 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white rounded-[4px] flex items-center justify-center transition-colors shadow-sm shadow-purple-900/40"
            title="New Note (Cmd+N)"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
          </button>
        )}
      </div>

      {/* Search Input matching reference */}
      <div className="px-3 py-1.5">
        <div className="relative flex items-center">
          <Search className={`w-3.5 h-3.5 absolute left-2.5 pointer-events-none ${isDark ? 'text-gray-400' : 'text-[#9CA3AF]'}`} />
          <input
            id="notes-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search notes..."
            className={`w-full rounded-[4px] pl-8 pr-12 py-1.5 text-xs focus:outline-none transition-colors border ${
              isDark
                ? 'bg-[#1b1b26] border-[#272738] text-gray-200 placeholder-gray-500 focus:border-purple-500/60'
                : 'bg-white border-[#E2DEEE] text-[#181326] placeholder-[#9CA3AF] focus:border-[#7C3AED]'
            }`}
          />
          <kbd className={`absolute right-2 px-1.5 py-0.5 text-[9px] font-mono rounded-[2px] border pointer-events-none ${
            isDark ? 'text-gray-400 bg-[#252536] border-[#313144]' : 'text-[#6B7280] bg-[#F3F0FA] border-[#E2DEEE]'
          }`}>
            ⌘ K
          </kbd>
        </div>
      </div>

      {/* Sub-Filter Tabs: All, Recent, Pinned (or Trash Info Banner) */}
      {activeFilter === 'trash' ? (
        <div className={`px-3 py-1.5 border-b text-[10px] flex items-center justify-between ${
          isDark ? 'border-[#20202e] text-gray-500' : 'border-[#EAE6F4] text-[#6B7280]'
        }`}>
          <span>Deleted notes kept for 30 days</span>
          {filteredNotes.length > 0 && <span>{filteredNotes.length} in trash</span>}
        </div>
      ) : (
        <div className={`px-3 pt-2 pb-1.5 flex items-center gap-1 border-b ${
          isDark ? 'border-[#20202e]' : 'border-[#EAE6F4]'
        }`}>
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
                    ? isDark
                      ? 'bg-purple-900/30 text-purple-300 border border-purple-500/40'
                      : 'bg-[#EDE9FE] text-[#7C3AED] border border-[#DDD6FE] font-semibold'
                    : isDark
                      ? 'text-gray-400 hover:text-gray-200 hover:bg-[#1c1c28]'
                      : 'text-[#6B7280] hover:text-[#181326] hover:bg-[#F3F0F9]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Notes List */}
      <div className="flex-1 overflow-y-auto obsidian-scrollbar p-2 space-y-1">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500 text-xs">
            <div className="w-5 h-5 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-2" />
            Loading notes...
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="p-6 text-center text-gray-500 text-xs space-y-2">
            <p>{activeFilter === 'trash' ? 'Trash is empty' : 'No notes found'}</p>
            {activeFilter !== 'trash' && (
              <button
                onClick={onNewNote}
                className="px-2.5 py-1 text-[11px] bg-purple-600/20 text-purple-300 border border-purple-500/30 rounded-[3px] hover:bg-purple-600/30 transition-colors"
              >
                Create a note
              </button>
            )}
          </div>
        ) : (
          filteredNotes.map((note) => {
            const isSelected = (note._id || note.id) === selectedNoteId;
            return (
              <NoteListItem
                key={note._id || note.id}
                note={note}
                isSelected={isSelected}
                isTrashView={activeFilter === 'trash'}
                onSelect={onSelectNote}
                onTogglePin={onTogglePin}
                onToggleFavorite={onToggleFavorite}
                onDelete={onDeleteNote}
                onDuplicate={onDuplicateNote}
                onRestore={onRestoreNote}
                onPermanentDelete={onPermanentDeleteNote}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

