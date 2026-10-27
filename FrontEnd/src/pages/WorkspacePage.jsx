import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from '../components/sidebar/Sidebar';
import { NoteList } from '../components/notes/NoteList';
import { NoteEditor } from '../components/editor/NoteEditor';
import { Header } from '../components/common/Header';
import { FilterModal } from '../components/modals/FilterModal';
import { SettingsModal } from '../components/modals/SettingsModal';
import { ConfirmDialog } from '../components/modals/ConfirmDialog';
import { noteService } from '../services/noteService';
import { useToast } from '../context/ToastContext';

export const WorkspacePage = () => {
  const { success, error: toastError, info } = useToast();

  // Navigation & filtering state
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'favorites', 'study', 'work', 'personal', 'ideas', 'archived', 'trash'
  const [filterTag, setFilterTag] = useState('all');
  const [filterColor, setFilterColor] = useState('all');
  const [sortBy, setSortBy] = useState('updated_desc');
  const [searchQuery, setSearchQuery] = useState('');

  // Data state
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [stats, setStats] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Layout & UI state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false });

  // Fetch statistics for sidebar badges
  const fetchStats = useCallback(async () => {
    try {
      const res = await noteService.getStats();
      if (res.success && res.data) {
        setStats(res.data);
      }
    } catch (err) {
      console.warn('Failed to load stats:', err.message);
    }
  }, []);

  // Fetch notes from server
  const fetchNotes = useCallback(async (preserveSelectionId = null) => {
    setIsLoading(true);
    try {
      const params = {
        filter: ['all', 'favorites', 'archived', 'trash'].includes(activeFilter) ? activeFilter : 'all',
        category: !['all', 'favorites', 'archived', 'trash'].includes(activeFilter) ? activeFilter : (filterTag !== 'all' ? filterTag : undefined),
        color: filterColor !== 'all' ? filterColor : undefined,
        search: searchQuery.trim() || undefined,
        sortBy
      };

      const res = await noteService.getNotes(params);
      if (res.success && Array.isArray(res.data)) {
        setNotes(res.data);

        // Selection logic: keep currently selected or select first note if desktop
        if (preserveSelectionId) {
          const match = res.data.find((n) => n._id === preserveSelectionId);
          if (match) setSelectedNote(match);
        } else if (res.data.length > 0) {
          // If no note currently selected, pick first
          setSelectedNote((current) => {
            if (current && res.data.some((n) => n._id === current._id)) {
              return res.data.find((n) => n._id === current._id);
            }
            return res.data[0];
          });
        } else {
          setSelectedNote(null);
        }
      }
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to fetch notes');
    } finally {
      setIsLoading(false);
    }
  }, [activeFilter, filterTag, filterColor, searchQuery, sortBy, toastError]);

  // Initial and reactive note loading
  useEffect(() => {
    fetchNotes();
    fetchStats();
  }, [fetchNotes, fetchStats]);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+Alt+N or Cmd+Alt+N for New Note
      if ((e.ctrlKey || e.metaKey) && e.altKey && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        handleCreateNote();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Action: Create New Note
  const handleCreateNote = async () => {
    try {
      const newNoteData = {
        title: 'Untitled Note',
        content: '',
        plainText: '',
        tags: !['all', 'favorites', 'archived', 'trash'].includes(activeFilter) ? [activeFilter] : [],
        color: 'default',
        icon: 'document'
      };

      const res = await noteService.createNote(newNoteData);
      if (res.success && res.data) {
        setNotes((prev) => [res.data, ...prev]);
        setSelectedNote(res.data);
        fetchStats();
        success('New note created');
      }
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to create note');
    }
  };

  // Action: Save Note (Autosave)
  const handleSaveNote = async (noteId, updates) => {
    const res = await noteService.updateNote(noteId, updates);
    if (res.success && res.data) {
      // Update in notes list in real time
      setNotes((prev) =>
        prev.map((n) => (n._id === noteId ? { ...n, ...res.data } : n))
      );
      if (selectedNote?._id === noteId) {
        setSelectedNote((prev) => ({ ...prev, ...res.data }));
      }
      fetchStats();
    }
    return res;
  };

  // Action: Toggle Pin
  const handleTogglePin = async (noteId) => {
    try {
      const res = await noteService.togglePin(noteId);
      if (res.success && res.data) {
        setNotes((prev) =>
          prev.map((n) => (n._id === noteId ? { ...n, isPinned: res.data.isPinned } : n))
        );
        if (selectedNote?._id === noteId) {
          setSelectedNote((prev) => ({ ...prev, isPinned: res.data.isPinned }));
        }
        success(res.data.isPinned ? 'Note pinned to top' : 'Note unpinned');
        fetchNotes(noteId);
      }
    } catch (err) {
      toastError('Failed to toggle pin');
    }
  };

  // Action: Toggle Favorite
  const handleToggleFavorite = async (noteId) => {
    try {
      const res = await noteService.toggleFavorite(noteId);
      if (res.success && res.data) {
        setNotes((prev) =>
          prev.map((n) => (n._id === noteId ? { ...n, isFavorite: res.data.isFavorite } : n))
        );
        if (selectedNote?._id === noteId) {
          setSelectedNote((prev) => ({ ...prev, isFavorite: res.data.isFavorite }));
        }
        fetchStats();
        success(res.data.isFavorite ? 'Added to favorites' : 'Removed from favorites');
      }
    } catch (err) {
      toastError('Failed to toggle favorite');
    }
  };

  // Action: Toggle Archive
  const handleToggleArchive = async (noteId) => {
    try {
      const res = await noteService.toggleArchive(noteId);
      if (res.success && res.data) {
        fetchNotes();
        fetchStats();
        success(res.data.isArchived ? 'Note archived' : 'Note unarchived');
      }
    } catch (err) {
      toastError('Failed to toggle archive');
    }
  };

  // Action: Soft Delete (Move to Trash)
  const handleDeleteNote = async (noteId) => {
    try {
      const res = await noteService.deleteNote(noteId);
      if (res.success) {
        fetchNotes();
        fetchStats();
        info('Note moved to trash');
      }
    } catch (err) {
      toastError('Failed to delete note');
    }
  };

  // Action: Restore from Trash
  const handleRestoreNote = async (noteId) => {
    try {
      const res = await noteService.restoreNote(noteId);
      if (res.success) {
        fetchNotes();
        fetchStats();
        success('Note restored from trash');
      }
    } catch (err) {
      toastError('Failed to restore note');
    }
  };

  // Action: Permanent Delete
  const handlePermanentDelete = (noteId) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Permanently Delete Note?',
      message: 'This note will be permanently removed from MongoDB. This action cannot be undone.',
      confirmText: 'Delete Permanently',
      isDanger: true,
      onConfirm: async () => {
        try {
          await noteService.permanentDeleteNote(noteId);
          setConfirmDialog({ isOpen: false });
          fetchNotes();
          fetchStats();
          success('Note permanently deleted');
        } catch (err) {
          toastError('Failed to permanently delete note');
        }
      },
      onCancel: () => setConfirmDialog({ isOpen: false })
    });
  };

  const handleResetFilters = () => {
    setFilterTag('all');
    setFilterColor('all');
    setSortBy('updated_desc');
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-warm-bg dark:bg-charcoal-900 text-charcoal-900 dark:text-cream-50 font-sans">
      {/* Top Header */}
      <Header
        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onToggleFocusMode={() => setIsFocusMode((prev) => !prev)}
        isFocusMode={isFocusMode}
      />

      {/* Main 3-Panel Content Area */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Panel 1: Left Sidebar */}
        {!isFocusMode && (
          <Sidebar
            activeFilter={activeFilter}
            onSelectFilter={(filter) => {
              setActiveFilter(filter);
              setFilterTag('all');
            }}
            stats={stats}
            onNewNote={handleCreateNote}
            isOpen={sidebarOpen}
            onCloseMobile={() => setSidebarOpen(false)}
          />
        )}

        {/* Panel 2: Middle Notes List */}
        {!isFocusMode && (
          <div
            className={`h-full ${
              selectedNote ? 'hidden md:block' : 'w-full md:block'
            }`}
          >
            <NoteList
              notes={notes}
              selectedNoteId={selectedNote?._id}
              onSelectNote={(note) => setSelectedNote(note)}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onOpenFilter={() => setIsFilterModalOpen(true)}
              isLoading={isLoading}
              onTogglePin={handleTogglePin}
              onToggleFavorite={handleToggleFavorite}
              onToggleArchive={handleToggleArchive}
              onDeleteNote={handleDeleteNote}
              onRestoreNote={handleRestoreNote}
              onPermanentDeleteNote={handlePermanentDelete}
              activeFilter={activeFilter}
            />
          </div>
        )}

        {/* Panel 3: Main Rich-Text Editor */}
        <main
          className={`flex-1 h-full overflow-hidden ${
            !selectedNote ? 'hidden md:flex' : 'flex'
          }`}
        >
          <NoteEditor
            key={selectedNote?._id || 'empty'}
            note={selectedNote}
            onSaveNote={handleSaveNote}
            onTogglePin={handleTogglePin}
            onToggleFavorite={handleToggleFavorite}
            onToggleArchive={handleToggleArchive}
            onDeleteNote={handleDeleteNote}
            onBackToNotes={() => setSelectedNote(null)}
          />
        </main>
      </div>

      {/* Filter Modal */}
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        filterTag={filterTag}
        onSelectTag={setFilterTag}
        filterColor={filterColor}
        onSelectColor={setFilterColor}
        sortBy={sortBy}
        onSelectSort={setSortBy}
        onResetFilters={handleResetFilters}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText={confirmDialog.confirmText}
        isDanger={confirmDialog.isDanger}
        onConfirm={confirmDialog.onConfirm}
        onCancel={confirmDialog.onCancel}
      />
    </div>
  );
};
