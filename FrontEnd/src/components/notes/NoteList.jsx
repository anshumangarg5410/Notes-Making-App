import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, FileQuestion, Trash2, Plus, ChevronDown, X } from 'lucide-react';
import { NoteCard } from './NoteCard';

export const NoteList = ({
  notes = [],
  selectedNoteId,
  onSelectNote,
  searchQuery,
  onSearchChange,
  onOpenFilter,
  isLoading,
  onTogglePin,
  onToggleFavorite,
  onToggleArchive,
  onDeleteNote,
  onRestoreNote,
  onPermanentDeleteNote,
  onDuplicateNote,
  onEmptyTrash,
  activeFilter,
  onNewNote
}) => {
  const [subFilter, setSubFilter] = useState('all'); // 'all', 'recent', 'pinned', 'tags'

  // Apply quick sub-filtering based on chips
  const filteredNotes = useMemo(() => {
    let result = [...notes];
    if (subFilter === 'pinned') {
      result = result.filter((n) => n.isPinned);
    } else if (subFilter === 'recent') {
      result.sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt));
    }
    return result;
  }, [notes, subFilter]);

  // Helper to categorize notes into Today, Yesterday, This Week, Older
  const groupNotesByPeriod = (noteList) => {
    const groups = {
      Today: [],
      Yesterday: [],
      'This Week': [],
      Older: []
    };

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfYesterday = new Date(startOfToday);
    startOfYesterday.setDate(startOfYesterday.getDate() - 1);
    const startOfWeek = new Date(startOfToday);
    startOfWeek.setDate(startOfWeek.getDate() - 7);

    noteList.forEach((note) => {
      const noteDate = new Date(note.updatedAt || note.createdAt);
      if (noteDate >= startOfToday) {
        groups.Today.push(note);
      } else if (noteDate >= startOfYesterday) {
        groups.Yesterday.push(note);
      } else if (noteDate >= startOfWeek) {
        groups['This Week'].push(note);
      } else {
        groups.Older.push(note);
      }
    });

    return groups;
  };

  const grouped = groupNotesByPeriod(filteredNotes);

  const searchInputRef = React.useRef(null);

  React.useEffect(() => {
    const handleSearchKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }
    };
    window.addEventListener('keydown', handleSearchKey);
    return () => window.removeEventListener('keydown', handleSearchKey);
  }, []);

  return (
    <div className="w-full md:w-80 lg:w-84 border-r border-warm-border dark:border-charcoal-800 bg-cream-50/70 dark:bg-charcoal-900/90 flex flex-col h-full flex-shrink-0 select-none">
      {/* Search Header */}
      <div className="p-3 pb-2 border-b border-warm-border/60 dark:border-charcoal-800 space-y-2.5">
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-400 dark:text-charcoal-500" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search notes... (⌘K)"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-7 py-1.5 bg-white/90 dark:bg-charcoal-800 border border-warm-border/80 dark:border-charcoal-700/80 rounded-xl text-xs placeholder:text-charcoal-400 dark:placeholder:text-charcoal-500 text-charcoal-900 dark:text-cream-50 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-charcoal-400 hover:text-charcoal-600 dark:hover:text-cream-200 p-0.5 rounded"
                title="Clear search"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          <button
            onClick={onOpenFilter}
            className="p-1.5 rounded-xl border border-warm-border/80 dark:border-charcoal-700/80 bg-white/90 dark:bg-charcoal-800 hover:bg-cream-100 dark:hover:bg-charcoal-700 text-charcoal-500 dark:text-charcoal-400 transition-colors"
            title="Filter and sort"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Chips Bar */}
        <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar pb-0.5 text-xs">
          <button
            onClick={() => setSubFilter('all')}
            className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all ${
              subFilter === 'all'
                ? 'bg-orange-500 text-white shadow-xs'
                : 'bg-warm-border/40 dark:bg-charcoal-800 text-charcoal-600 dark:text-charcoal-400 hover:bg-warm-border/70 dark:hover:bg-charcoal-700'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setSubFilter(subFilter === 'recent' ? 'all' : 'recent')}
            className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
              subFilter === 'recent'
                ? 'bg-orange-500 text-white shadow-xs'
                : 'text-charcoal-500 dark:text-charcoal-400 hover:bg-cream-200/50 dark:hover:bg-charcoal-800'
            }`}
          >
            Recent
          </button>
          <button
            onClick={() => setSubFilter(subFilter === 'pinned' ? 'all' : 'pinned')}
            className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
              subFilter === 'pinned'
                ? 'bg-orange-500 text-white shadow-xs'
                : 'text-charcoal-500 dark:text-charcoal-400 hover:bg-cream-200/50 dark:hover:bg-charcoal-800'
            }`}
          >
            Pinned
          </button>
          <button
            onClick={onOpenFilter}
            className="inline-flex items-center space-x-0.5 px-2.5 py-1 rounded-full text-[11px] font-medium text-charcoal-500 dark:text-charcoal-400 hover:bg-cream-200/50 dark:hover:bg-charcoal-800 transition-all"
          >
            <span>Tags</span>
            <ChevronDown className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Trash Actions Bar */}
      {activeFilter === 'trash' && notes.length > 0 && (
        <div className="px-4 py-2 border-b border-warm-border/60 dark:border-charcoal-800 bg-red-50/50 dark:bg-red-950/20 flex items-center justify-between text-xs">
          <span className="text-charcoal-500 dark:text-charcoal-400 font-medium">
            {notes.length} {notes.length === 1 ? 'note' : 'notes'} in trash
          </span>
          <button
            onClick={onEmptyTrash}
            className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-semibold flex items-center space-x-1 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Empty Trash</span>
          </button>
        </div>
      )}

      {/* Notes List with Scroll */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {isLoading ? (
          // Loading Skeletons
          <div className="space-y-2.5">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="p-3 rounded-2xl bg-white/70 dark:bg-charcoal-800/50 border border-warm-border/40 dark:border-charcoal-700/40 animate-pulse flex space-x-3"
              >
                <div className="w-8 h-8 rounded-xl bg-cream-200/50 dark:bg-charcoal-700" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 bg-cream-200/60 dark:bg-charcoal-700 rounded w-3/4" />
                  <div className="h-2.5 bg-cream-200/40 dark:bg-charcoal-700/60 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredNotes.length === 0 ? (
          // Empty State
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-charcoal-400 dark:text-charcoal-500 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-cream-200/50 dark:bg-charcoal-800 flex items-center justify-center">
              <FileQuestion className="w-6 h-6 text-charcoal-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-charcoal-700 dark:text-charcoal-300">
                No notes found
              </p>
              <p className="text-xs mt-1 text-charcoal-400 dark:text-charcoal-500 max-w-[200px]">
                {searchQuery
                  ? `No matching notes for "${searchQuery}"`
                  : subFilter === 'pinned'
                  ? 'No pinned notes yet'
                  : activeFilter === 'trash'
                  ? 'Trash is empty'
                  : activeFilter === 'favorites'
                  ? 'No favorites starred yet'
                  : activeFilter === 'archived'
                  ? 'No notes in archive'
                  : 'Click "+ New Note" to write your first thought.'}
              </p>
              {onNewNote && activeFilter !== 'trash' && activeFilter !== 'archived' && !searchQuery && (
                <button
                  onClick={onNewNote}
                  className="mt-3.5 px-3.5 py-1.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl text-xs font-semibold inline-flex items-center space-x-1.5 shadow-xs transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Note</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          // Grouped Note Cards
          Object.entries(grouped).map(([groupTitle, groupNotes]) => {
            if (groupNotes.length === 0) return null;

            return (
              <div key={groupTitle} className="space-y-2">
                <h4 className="text-[11px] font-bold text-charcoal-400 dark:text-charcoal-500 uppercase tracking-wider px-1">
                  {groupTitle}
                </h4>
                <div className="space-y-2">
                  {groupNotes.map((note) => (
                    <NoteCard
                      key={note._id}
                      note={note}
                      isSelected={note._id === selectedNoteId}
                      onSelect={() => onSelectNote(note)}
                      onTogglePin={onTogglePin}
                      onToggleFavorite={onToggleFavorite}
                      onToggleArchive={onToggleArchive}
                      onDelete={onDeleteNote}
                      onRestore={onRestoreNote}
                      onPermanentDelete={onPermanentDeleteNote}
                      onDuplicate={onDuplicateNote}
                    />
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
