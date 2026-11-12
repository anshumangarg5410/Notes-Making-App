import React, { useState, useMemo } from 'react';
import { Search, Plus, Filter, ArrowUpDown, Trash2, RotateCcw, Bookmark, Book, X } from 'lucide-react';
import { NoteListItem } from './NoteListItem';
import { NotebookHeader } from '../notebooks/NotebookHeader';
import { SectionList } from '../notebooks/SectionList';
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
  // Notebook hierarchy props
  selectedNotebook = null,
  sections = [],
  selectedSectionId = null,
  onSelectSection,
  notebookViewMode = 'sections', // 'sections' or 'notes'
  onSwitchNotebookViewMode,
  onEditNotebook,
  onDeleteNotebook,
  onAddSection,
  onEditSection,
  onMoveSection,
  onDeleteSection,
  onReorderSections,
  onMoveNote,
  // Standard note item actions
  onTogglePin,
  onToggleFavorite,
  onDeleteNote,
  onDuplicateNote,
  onRestoreNote,
  onPermanentDeleteNote,
  onEmptyTrash,
  folders = [],
  onDeleteFolder,
  isLoading = false
}) => {
  const [subFilter, setSubFilter] = useState('all'); // 'all', 'recent', 'pinned'
  const [sortOrder, setSortOrder] = useState('updated'); // 'updated', 'title'
  const { isDark } = useTheme();

  // Find currently active section object if any
  const activeSection = useMemo(() => {
    if (!selectedSectionId || !sections) return null;
    return sections.find((s) => (s._id || s.id) === selectedSectionId) || null;
  }, [selectedSectionId, sections]);

  // All notes belonging to the selected notebook (before sub-filters)
  const notebookNotes = useMemo(() => {
    if (!selectedNotebook) return [];
    const nbId = selectedNotebook._id || selectedNotebook.id;
    const nbName = (selectedNotebook.name || '').toLowerCase();

    return notes.filter((n) => {
      if (n.isDeleted) return false;
      if (n.notebookId && (n.notebookId === nbId || n.notebookId?._id === nbId)) return true;
      if (n.notebook && n.notebook.toLowerCase() === nbName) return true;
      if (n.category && n.category.toLowerCase() === nbName) return true;
      if (n.folder && n.folder.toLowerCase() === nbName) return true;
      return false;
    });
  }, [notes, selectedNotebook]);

  // Filter notes based on active state (global nav vs notebook mode vs section filter)
  const filteredNotes = useMemo(() => {
    let result = [...notes];

    // Case 1: Active notebook selected
    if (selectedNotebook) {
      const nbId = selectedNotebook._id || selectedNotebook.id;
      const nbName = (selectedNotebook.name || '').toLowerCase();

      result = result.filter((n) => {
        if (n.isDeleted) return false;
        if (n.notebookId && (n.notebookId === nbId || n.notebookId?._id === nbId)) return true;
        if (n.notebook && n.notebook.toLowerCase() === nbName) return true;
        if (n.category && n.category.toLowerCase() === nbName) return true;
        if (n.folder && n.folder.toLowerCase() === nbName) return true;
        return false;
      });

      // If active section is selected inside this notebook, filter down
      if (selectedSectionId) {
        const secName = (activeSection?.name || '').toLowerCase();
        result = result.filter((n) => {
          if (n.sectionId && (n.sectionId === selectedSectionId || n.sectionId?._id === selectedSectionId)) {
            return true;
          }
          if (secName && n.section && n.section.toLowerCase() === secName) {
            return true;
          }
          return false;
        });
      }
    } else {
      // Case 2: Global navigation views
      if (activeFilter === 'favorites') {
        result = result.filter((n) => n.isFavorite && !n.isDeleted);
      } else if (activeFilter === 'trash') {
        result = result.filter((n) => n.isDeleted);
      } else if (activeFilter === 'drawing') {
        result = result.filter(
          (n) => !n.isDeleted && ((n.drawings && n.drawings.length > 0) || (n.tags && n.tags.includes('sketch')))
        );
      } else {
        result = result.filter((n) => !n.isDeleted);
      }

      // Filter by legacy folder if selected
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
    }

    // Filter by Tag if selected
    if (selectedTag) {
      result = result.filter((n) => (n.tags || []).some((t) => t.toLowerCase() === selectedTag.toLowerCase()));
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((n) => {
        const titleMatch = (n.title || '').toLowerCase().includes(q);
        const tagMatch = (n.tags || []).some((t) => t.toLowerCase().includes(q));
        const contentMatch = (n.plainText || (typeof n.content === 'string' ? n.content : ''))
          .toLowerCase()
          .includes(q);
        return titleMatch || tagMatch || contentMatch;
      });
    }

    // Sub-filters: 'recent', 'pinned'
    if (subFilter === 'pinned') {
      result = result.filter((n) => n.isPinned);
    } else if (subFilter === 'recent') {
      result.sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt));
    } else {
      result.sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt);
      });
    }

    return result;
  }, [notes, selectedNotebook, selectedSectionId, activeSection, activeFilter, selectedFolder, selectedTag, searchQuery, subFilter]);

  // Determine header title for global navigation
  const getHeaderTitle = () => {
    if (selectedNotebook) return selectedNotebook.name;
    if (selectedFolder) return selectedFolder;
    if (selectedTag) return `#${selectedTag}`;
    if (activeFilter === 'favorites') return 'Favorites';
    if (activeFilter === 'trash') return 'Trash';
    if (activeFilter === 'drawing') return 'Drawings & Sketches';
    return 'All Notes';
  };

  return (
    <div
      className={`h-full border-r flex flex-col select-none text-xs w-72 min-w-[260px] max-w-[320px] transition-colors duration-150 ${
        isDark ? 'bg-[#15151e] border-[#222230]' : 'bg-[#FAFAFD] border-[#EAE6F4]'
      }`}
    >
      {/* CASE A: A NOTEBOOK IS SELECTED */}
      {selectedNotebook ? (
        <>
          {/* Notebook Header with name, section/note counts, three-dot menu */}
          <NotebookHeader
            notebook={selectedNotebook}
            sections={sections}
            notesCount={notebookNotes.length}
            onEditNotebook={() => onEditNotebook?.(selectedNotebook)}
            onAddSection={() => onAddSection?.(selectedNotebook)}
            onDeleteNotebook={() => onDeleteNotebook?.(selectedNotebook._id || selectedNotebook.id)}
          />

          {/* Segmented Navigation Control: Sections | Notes */}
          <div className={`px-3 py-2 border-b flex items-center gap-1.5 ${isDark ? 'border-[#222230]' : 'border-[#EAE6F4]'}`}>
            <button
              type="button"
              onClick={() => onSwitchNotebookViewMode?.('sections')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all text-center cursor-pointer ${
                notebookViewMode === 'sections'
                  ? 'bg-pink-500/15 text-pink-300 border border-pink-500/30 font-semibold shadow-xs'
                  : isDark
                    ? 'text-gray-400 hover:text-white hover:bg-white/5'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Sections ({sections.length})
            </button>
            <button
              type="button"
              onClick={() => onSwitchNotebookViewMode?.('notes')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all text-center cursor-pointer ${
                notebookViewMode === 'notes'
                  ? 'bg-pink-500/15 text-pink-300 border border-pink-500/30 font-semibold shadow-xs'
                  : isDark
                    ? 'text-gray-400 hover:text-white hover:bg-white/5'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Notes ({notebookNotes.length})
            </button>
          </div>

          {/* SECTIONS VIEW */}
          {notebookViewMode === 'sections' ? (
            <SectionList
              sections={sections}
              selectedSectionId={selectedSectionId}
              onSelectSection={(sec) => {
                onSelectSection?.(sec);
                onSwitchNotebookViewMode?.('notes');
              }}
              onAddSection={() => onAddSection?.(selectedNotebook)}
              onEditSection={onEditSection}
              onMoveSection={onMoveSection}
              onDeleteSection={onDeleteSection}
              onReorderSections={onReorderSections}
            />
          ) : (
            /* NOTES VIEW UNDER NOTEBOOK */
            <>
              {/* Active Section Filter Tag Banner */}
              {activeSection && (
                <div
                  className={`mx-3 my-2 px-2.5 py-1.5 rounded-lg flex items-center justify-between text-xs border ${
                    isDark ? 'bg-pink-500/10 border-pink-500/25 text-pink-300' : 'bg-pink-50 border-pink-200 text-pink-700'
                  }`}
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <Bookmark className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate font-medium">{activeSection.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onSelectSection?.(null)}
                    className="p-0.5 rounded hover:bg-pink-500/20 transition-colors ml-1 cursor-pointer"
                    title="View all notebook notes"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}

              {/* Search Bar + New Note Button */}
              <div className="px-3 py-1.5 flex items-center gap-1.5">
                <div className="relative flex-1 flex items-center">
                  <Search
                    className={`w-3.5 h-3.5 absolute left-2.5 pointer-events-none ${
                      isDark ? 'text-gray-400' : 'text-[#9CA3AF]'
                    }`}
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search notes..."
                    className={`w-full rounded-[4px] pl-8 pr-3 py-1.5 text-xs focus:outline-none transition-colors border ${
                      isDark
                        ? 'bg-[#1b1b26] border-[#272738] text-gray-200 placeholder-gray-500 focus:border-pink-500/60'
                        : 'bg-white border-[#E2DEEE] text-[#181326] placeholder-[#9CA3AF] focus:border-pink-500'
                    }`}
                  />
                </div>
                <button
                  type="button"
                  onClick={onNewNote}
                  className="w-7 h-7 bg-pink-600 hover:bg-pink-500 text-white rounded-[4px] flex items-center justify-center transition-colors shadow-sm shadow-pink-900/40 shrink-0 cursor-pointer"
                  title="New Note in this notebook"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>

              {/* Sub-Filters: All, Recent, Pinned */}
              <div
                className={`px-3 pt-1.5 pb-1.5 flex items-center gap-1 border-b ${
                  isDark ? 'border-[#20202e]' : 'border-[#EAE6F4]'
                }`}
              >
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
                      className={`px-2.5 py-0.5 rounded-[3px] text-[11px] font-medium transition-colors cursor-pointer ${
                        isActive
                          ? isDark
                            ? 'bg-pink-900/30 text-pink-300 border border-pink-500/40'
                            : 'bg-pink-50 text-pink-700 border border-pink-200 font-semibold'
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

              {/* Notes List */}
              <div className="flex-1 overflow-y-auto obsidian-scrollbar p-2 space-y-1">
                {isLoading ? (
                  <div className="p-8 text-center text-gray-500 text-xs">
                    <div className="w-5 h-5 border-2 border-pink-500/30 border-t-pink-500 rounded-full animate-spin mx-auto mb-2" />
                    Loading notes...
                  </div>
                ) : filteredNotes.length === 0 ? (
                  <div className="p-6 text-center text-gray-500 text-xs space-y-2">
                    <p>No notes found in this {activeSection ? 'section' : 'notebook'}</p>
                    <button
                      type="button"
                      onClick={onNewNote}
                      className="px-2.5 py-1 text-[11px] bg-pink-600/20 text-pink-300 border border-pink-500/30 rounded-[3px] hover:bg-pink-600/30 transition-colors cursor-pointer"
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
                        isTrashView={false}
                        onSelect={onSelectNote}
                        onTogglePin={onTogglePin}
                        onToggleFavorite={onToggleFavorite}
                        onDelete={onDeleteNote}
                        onDuplicate={onDuplicateNote}
                        onMoveNote={onMoveNote}
                      />
                    );
                  })
                )}
              </div>
            </>
          )}
        </>
      ) : (
        /* CASE B: GLOBAL NAVIGATION (All Notes, Favorites, Trash, Drawing, Tags) */
        <>
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
              <div className="flex items-center gap-1">
                <button
                  onClick={onNewNote}
                  className="w-7 h-7 bg-pink-600 hover:bg-pink-500 text-white rounded-[4px] flex items-center justify-center transition-colors shadow-sm shadow-pink-900/40 cursor-pointer"
                  title="New Note (Cmd+N)"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            )}
          </div>

          {/* Search Input */}
          <div className="px-3 py-1.5">
            <div className="relative flex items-center">
              <Search
                className={`w-3.5 h-3.5 absolute left-2.5 pointer-events-none ${
                  isDark ? 'text-gray-400' : 'text-[#9CA3AF]'
                }`}
              />
              <input
                id="notes-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search notes..."
                className={`w-full rounded-[4px] pl-8 pr-12 py-1.5 text-xs focus:outline-none transition-colors border ${
                  isDark
                    ? 'bg-[#1b1b26] border-[#272738] text-gray-200 placeholder-gray-500 focus:border-pink-500/60'
                    : 'bg-white border-[#E2DEEE] text-[#181326] placeholder-[#9CA3AF] focus:border-pink-500'
                }`}
              />
              <kbd
                className={`absolute right-2 px-1.5 py-0.5 text-[9px] font-mono rounded-[2px] border pointer-events-none ${
                  isDark ? 'text-gray-400 bg-[#252536] border-[#313144]' : 'text-[#6B7280] bg-[#F3F0FA] border-[#E2DEEE]'
                }`}
              >
                ⌘ K
              </kbd>
            </div>
          </div>

          {/* Sub-Filter Tabs: All, Recent, Pinned (or Trash Info Banner) */}
          {activeFilter === 'trash' ? (
            <div
              className={`px-3 py-1.5 border-b text-[10px] flex items-center justify-between ${
                isDark ? 'border-[#20202e] text-gray-500' : 'border-[#EAE6F4] text-[#6B7280]'
              }`}
            >
              <span>Deleted notes kept for 30 days</span>
              {filteredNotes.length > 0 && <span>{filteredNotes.length} in trash</span>}
            </div>
          ) : (
            <div
              className={`px-3 pt-2 pb-1.5 flex items-center gap-1 border-b ${
                isDark ? 'border-[#20202e]' : 'border-[#EAE6F4]'
              }`}
            >
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
                    className={`px-2.5 py-1 rounded-[3px] text-[11px] font-medium transition-colors cursor-pointer ${
                      isActive
                        ? isDark
                          ? 'bg-pink-900/30 text-pink-300 border border-pink-500/40'
                          : 'bg-pink-50 text-pink-700 border border-pink-200 font-semibold'
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
                <div className="w-5 h-5 border-2 border-pink-500/30 border-t-pink-500 rounded-full animate-spin mx-auto mb-2" />
                Loading notes...
              </div>
            ) : filteredNotes.length === 0 ? (
              <div className="p-6 text-center text-gray-500 text-xs space-y-2">
                <p>{activeFilter === 'trash' ? 'Trash is empty' : 'No notes found'}</p>
                {activeFilter !== 'trash' && (
                  <button
                    type="button"
                    onClick={onNewNote}
                    className="px-2.5 py-1 text-[11px] bg-pink-600/20 text-pink-300 border border-pink-500/30 rounded-[3px] hover:bg-pink-600/30 transition-colors cursor-pointer"
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
                    onMoveNote={onMoveNote}
                    onRestore={onRestoreNote}
                    onPermanentDelete={onPermanentDeleteNote}
                  />
                );
              })
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default NotesExplorer;
