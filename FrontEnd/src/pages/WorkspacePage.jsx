import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Sidebar } from '../components/sidebar/Sidebar';
import { NoteList } from '../components/notes/NoteList';
import { NoteEditor } from '../components/editor/NoteEditor';
import { Header } from '../components/common/Header';
import { FilterModal } from '../components/modals/FilterModal';
import { SettingsModal } from '../components/modals/SettingsModal';
import { ConfirmDialog } from '../components/modals/ConfirmDialog';
import { DashboardLayout } from '../components/Dashboard/DashboardLayout';
import { dashboardService } from '../services/dashboardService';
import { noteService } from '../services/noteService';
import { useToast } from '../context/ToastContext';

export const WorkspacePage = () => {
  const { success, error: toastError, info } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  // Navigation & filtering state - defaults to dashboard if no noteId or filter in URL
  const [activeFilter, setActiveFilter] = useState(() => searchParams.get('filter') || (searchParams.get('noteId') ? 'all' : 'dashboard')); // 'all', 'favorites', 'study', 'work', 'personal', 'ideas', 'archived', 'trash'
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

  // Dashboard initial state & data
  const [dashboardData, setDashboardData] = useState({
    notes: [],
    stats: { totalNotes: 48, folders: 6, tags: 12, favorites: 9 },
    folders: [],
    tags: [],
    activities: [],
    storage: { usedMb: 245, totalGb: 2, percentage: 12 }
  });

  useEffect(() => {
    dashboardService.getDashboardData().then(setDashboardData);
  }, [notes]);

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

  // Listen for ?action=new in URL to create note immediately
  useEffect(() => {
    if (searchParams.get('action') === 'new') {
      handleCreateNote();
      setSearchParams({}, { replace: true });
    }
  }, [searchParams]);

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

  // Action: Soft Delete (Move to Trash) with confirmation
  const handleDeleteNote = (noteId) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Move Note to Trash?',
      message: 'This note will be moved to the trash folder. You can easily restore it anytime.',
      confirmText: 'Move to Trash',
      isDanger: false,
      onConfirm: async () => {
        try {
          const res = await noteService.deleteNote(noteId);
          if (res.success) {
            setConfirmDialog({ isOpen: false });
            fetchNotes();
            fetchStats();
            info('Note moved to trash');
          }
        } catch (err) {
          toastError('Failed to delete note');
        }
      },
      onCancel: () => setConfirmDialog({ isOpen: false })
    });
  };

  // Action: Restore from Trash
  const handleRestoreNote = async (noteId) => {
    try {
      const res = await noteService.restoreNote(noteId);
      if (res.success) {
        if (selectedNote?._id === noteId) {
          setSelectedNote(null);
        }
        await fetchNotes();
        await fetchStats();
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

  // Action: Duplicate Note
  const handleDuplicateNote = async (noteId) => {
    try {
      const res = await noteService.duplicateNote(noteId);
      if (res.success && res.data) {
        setNotes((prev) => [res.data, ...prev]);
        setSelectedNote(res.data);
        fetchStats();
        success('Note duplicated');
      }
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to duplicate note');
    }
  };

  // Action: Empty Trash
  const handleEmptyTrash = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Empty Trash?',
      message: 'All notes in trash will be permanently deleted from MongoDB. This action cannot be undone.',
      confirmText: 'Empty Trash',
      isDanger: true,
      onConfirm: async () => {
        try {
          await noteService.emptyTrash();
          setConfirmDialog({ isOpen: false });
          fetchNotes();
          fetchStats();
          success('Trash emptied');
        } catch (err) {
          toastError(err.response?.data?.message || 'Failed to empty trash');
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

  // If activeFilter is 'dashboard', render the NoteNest Dashboard from the design reference
  if (activeFilter === 'dashboard') {
    return (
      <DashboardLayout
        notes={notes.length > 0 ? notes.slice(0, 5) : dashboardData.notes}
        stats={{
          totalNotes: stats.all || dashboardData.stats.totalNotes,
          folders: dashboardData.folders.length || 6,
          tags: dashboardData.tags.length || 12,
          favorites: stats.favorites || dashboardData.stats.favorites
        }}
        folders={dashboardData.folders}
        tags={dashboardData.tags}
        activities={dashboardData.activities}
        storage={dashboardData.storage}
        activeNav="dashboard"
        onSelectNav={(navId) => {
          if (navId === 'all-notes' || navId === 'all') {
            setActiveFilter('all');
          } else if (navId === 'favorites') {
            setActiveFilter('favorites');
          } else if (navId === 'trash') {
            setActiveFilter('trash');
          } else if (navId.startsWith('folder-')) {
            const fName = navId.replace('folder-', '');
            setFilterTag(fName);
            setActiveFilter('all');
          }
        }}
        onSelectNote={(note) => {
          setSelectedNote(note);
          setActiveFilter('all');
        }}
        onNewNote={handleCreateNote}
        onCreateFolder={(name) => {
          const updated = [...dashboardData.folders, { id: 'f-' + Date.now(), name, count: 0 }];
          localStorage.setItem('notenest_custom_folders', JSON.stringify(updated));
          setDashboardData((prev) => ({ ...prev, folders: updated }));
          dashboardService.logActivity(`Created folder "${name}"`, 'folder');
        }}
        onImportNote={async (noteData) => {
          const res = await noteService.createNote(noteData);
          if (res.success && res.data) {
            setSelectedNote(res.data);
            setActiveFilter('all');
          }
        }}
        onToggleFavorite={handleToggleFavorite}
        onDeleteNote={handleDeleteNote}
        onSelectTag={(tag) => {
          setFilterTag(tag);
          setActiveFilter('all');
        }}
        onSelectFolder={(folder) => {
          setFilterTag(folder);
          setActiveFilter('all');
        }}
        onViewAllNotes={() => setActiveFilter('all')}
        onViewAllFolders={() => setActiveFilter('folders')}
      />
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-warm-bg dark:bg-charcoal-900 text-charcoal-900 dark:text-cream-50 font-sans">
      {/* Top Header */}
      <Header
        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onToggleFocusMode={() => setIsFocusMode((prev) => !prev)}
        isFocusMode={isFocusMode}
        onNewNote={handleCreateNote}
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
              onDuplicateNote={handleDuplicateNote}
              onEmptyTrash={handleEmptyTrash}
              activeFilter={activeFilter}
              onNewNote={handleCreateNote}
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
            onNewNote={handleCreateNote}
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
