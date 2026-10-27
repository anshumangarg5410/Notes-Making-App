import React from 'react';
import { Search, SlidersHorizontal, FileQuestion, Trash2 } from 'lucide-react';
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
  activeFilter
}) => {
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

  const grouped = groupNotesByPeriod(notes);

  return (
    <div className="w-full md:w-80 lg:w-88 border-r border-warm-border dark:border-charcoal-800 bg-warm-bg dark:bg-charcoal-900 flex flex-col h-full flex-shrink-0 select-none">
      {/* Search & Filter Header */}
      <div className="p-4 border-b border-warm-border dark:border-charcoal-800 flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-400 dark:text-charcoal-500" />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-cream-100/70 dark:bg-charcoal-800 border border-warm-border/80 dark:border-charcoal-700 rounded-xl text-sm placeholder:text-charcoal-400 dark:placeholder:text-charcoal-500 text-charcoal-900 dark:text-cream-50 focus:outline-none focus:ring-1 focus:ring-terracotta-500 transition-all"
          />
        </div>

        <button
          onClick={onOpenFilter}
          className="p-2 rounded-xl border border-warm-border/80 dark:border-charcoal-700 bg-cream-100/70 dark:bg-charcoal-800 hover:bg-cream-200/60 dark:hover:bg-charcoal-700 text-charcoal-500 dark:text-charcoal-400 transition-colors"
          title="Filter and sort"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>
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
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {isLoading ? (
          // Loading Skeletons
          <div className="space-y-3">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="p-3.5 rounded-2xl bg-warm-card dark:bg-charcoal-800/50 border border-warm-border/40 dark:border-charcoal-700/40 animate-pulse flex space-x-3"
              >
                <div className="w-9 h-9 rounded-xl bg-cream-200/50 dark:bg-charcoal-700" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-cream-200/60 dark:bg-charcoal-700 rounded w-3/4" />
                  <div className="h-3 bg-cream-200/40 dark:bg-charcoal-700/60 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : notes.length === 0 ? (
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
                  : activeFilter === 'trash'
                  ? 'Trash is empty'
                  : activeFilter === 'favorites'
                  ? 'No favorites starred yet'
                  : activeFilter === 'archived'
                  ? 'No notes in archive'
                  : 'Click "+ New Note" to write your first thought.'}
              </p>
            </div>
          </div>
        ) : (
          // Grouped Note Cards
          Object.entries(grouped).map(([groupTitle, groupNotes]) => {
            if (groupNotes.length === 0) return null;

            return (
              <div key={groupTitle} className="space-y-2.5">
                <h4 className="text-[11px] font-semibold text-charcoal-400 dark:text-charcoal-500 uppercase tracking-wider px-1">
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
