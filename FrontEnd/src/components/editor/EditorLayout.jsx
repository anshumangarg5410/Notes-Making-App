import React, { useState, useEffect, useRef, useCallback } from 'react';
import { EditorSidebar } from './EditorSidebar';
import { NotesExplorer } from './NotesExplorer';
import { EditorTabBar } from './EditorTabBar';
import { RichTextEditor } from './RichTextEditor';
import { DocumentInspector } from './DocumentInspector';
import { EditorStatusBar } from './EditorStatusBar';
import { noteService } from '../../services/noteService';
import { offlineService } from '../../services/db';
import { useToast } from '../../context/ToastContext';
import { useTheme } from '../../context/ThemeContext';
import './editorTheme.css';

export const EditorLayout = ({
  initialNoteId,
  initialNav = 'all',
  initialFolder = null,
  initialTag = null,
  onNavigateDashboard,
  onOpenSettings
}) => {
  const { success, error: toastError, info } = useToast();
  const { isDark } = useTheme();

  // Network connectivity state
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Layout & Pane visibility state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isExplorerCollapsed, setIsExplorerCollapsed] = useState(false);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false); // Collapsed by default as in screenshot, toggleable in tab bar
  const [isFocusMode, setIsFocusMode] = useState(false);

  // Navigation, Folder & Tag filter state
  const [activeNav, setActiveNav] = useState(initialNav); // 'all', 'favorites', 'trash'
  const [selectedFolder, setSelectedFolder] = useState(initialFolder);
  const [selectedTag, setSelectedTag] = useState(initialTag);
  const [searchQuery, setSearchQuery] = useState('');

  // Data state
  const [notes, setNotes] = useState([]);
  const [stats, setStats] = useState({ totalNotes: 4, favorites: 1, trash: 0 });
  const [isLoading, setIsLoading] = useState(true);

  // Multi-Tab workspace state
  const [tabs, setTabs] = useState([]);
  const [activeTabId, setActiveTabId] = useState(null);
  const [saveStatus, setSaveStatus] = useState('saved'); // 'saved', 'saving', 'unsaved', 'offline'
  const [lastSavedTime, setLastSavedTime] = useState('Just now');
  const [wordStats, setWordStats] = useState({ words: 1248, chars: 7862, readingTime: 3 });

  // Debounce save ref
  const saveTimeoutRef = useRef(null);
  const editorInstanceRef = useRef(null);

  // Monitor network connectivity
  useEffect(() => {
    const handleOnline = async () => {
      setIsOnline(true);
      info('Back online. Synchronizing changes...');
      const res = await offlineService.processSyncQueue(noteService);
      if (res.synced > 0) {
        success(`Synced ${res.synced} local changes.`);
        loadNotes();
      }
    };
    const handleOffline = () => {
      setIsOnline(false);
      info('Working offline. All changes are saved locally.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [info, success]);

  // Load notes (offline-first from Dexie + sync with server)
  const loadNotes = useCallback(async () => {
    setIsLoading(true);
    try {
      // 1. First load cached notes from local Dexie database
      const cached = await offlineService.getLocalNotes({
        filter: activeNav
      });

      if (cached && cached.length > 0) {
        setNotes(cached);
      }

      // 2. If online, fetch fresh notes from server
      if (navigator.onLine) {
        try {
          const res = await noteService.getNotes({
            filter: activeNav === 'favorites' ? 'favorites' : activeNav === 'trash' ? 'trash' : 'all',
            search: searchQuery || undefined
          });

          if (res.success && Array.isArray(res.data)) {
            let serverNotes = res.data;

            // If user has zero notes on server, provide sample notes matching design reference
            if (serverNotes.length === 0) {
              const demoNotes = [
                {
                  _id: 'demo-1',
                  id: 'demo-1',
                  title: 'Project Planning',
                  plainText: 'A complete plan for building and shipping NoteNest. Key Features: Authentication and user accounts, Rich-text editor (Tiptap), Folders and nested folders, Offline-first synchronization.',
                  content: `<p>A complete plan for building and shipping NoteNest.</p>`,
                  tags: ['projects', 'ui-ux'],
                  category: 'Projects',
                  isPinned: true,
                  isFavorite: true,
                  updatedAt: new Date().toISOString()
                },
                {
                  _id: 'demo-2',
                  id: 'demo-2',
                  title: 'DBMS Notes',
                  plainText: 'Normalization, ER diagrams, SQL queries, transactions, and indexing concepts...',
                  tags: ['dbms', 'college'],
                  category: 'College',
                  updatedAt: new Date(Date.now() - 7200000).toISOString()
                },
                {
                  _id: 'demo-3',
                  id: 'demo-3',
                  title: 'System Design',
                  plainText: 'Scalability, caching, load balancing, fault tolerance patterns...',
                  tags: ['system-design'],
                  category: 'Projects',
                  updatedAt: new Date(Date.now() - 18000000).toISOString()
                },
                {
                  _id: 'demo-4',
                  id: 'demo-4',
                  title: 'Workout Plan',
                  plainText: 'Push • Pull • Legs split, progressive overload tracking...',
                  tags: ['personal'],
                  category: 'Personal',
                  updatedAt: new Date(Date.now() - 86400000).toISOString()
                }
              ];
              serverNotes = demoNotes;
            }

            setNotes(serverNotes);
            await offlineService.cacheServerNotes(serverNotes);

            // Update stats
            setStats({
              totalNotes: serverNotes.length,
              favorites: serverNotes.filter((n) => n.isFavorite).length,
              trash: serverNotes.filter((n) => n.isDeleted).length
            });

            // Initialize active tab if tabs is empty
            if (tabs.length === 0 && serverNotes.length > 0) {
              const firstNote = serverNotes[0];
              setTabs([
                {
                  id: firstNote._id || firstNote.id,
                  title: firstNote.title || 'Project Planning',
                  note: firstNote,
                  isUnsaved: false
                }
              ]);
              setActiveTabId(firstNote._id || firstNote.id);
            }
          }
        } catch (apiErr) {
          console.warn('Backend fetch failed, using local cache:', apiErr.message);
        }
      }
    } catch (err) {
      console.warn('Error loading notes:', err);
    } finally {
      setIsLoading(false);
    }
  }, [activeNav, searchQuery]);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  // Current active note object
  const activeNote = notes.find((n) => (n._id || n.id) === activeTabId) || (tabs.find((t) => t.id === activeTabId)?.note);

  // Open note in tab
  const handleSelectNote = (note) => {
    const noteId = note._id || note.id;
    const existing = tabs.find((t) => t.id === noteId);

    if (existing) {
      setActiveTabId(noteId);
    } else {
      setTabs((prev) => [
        ...prev,
        {
          id: noteId,
          title: note.title || 'Untitled Note',
          note,
          isUnsaved: false
        }
      ]);
      setActiveTabId(noteId);
    }
  };

  // Close tab
  const handleCloseTab = (idToClose) => {
    const updatedTabs = tabs.filter((t) => t.id !== idToClose);
    setTabs(updatedTabs);

    if (activeTabId === idToClose && updatedTabs.length > 0) {
      setActiveTabId(updatedTabs[updatedTabs.length - 1].id);
    }
  };

  // Create new note
  const handleNewNote = async () => {
    let createdNote = null;

    // 1. If online, attempt to create directly on backend for permanent ObjectId
    if (navigator.onLine) {
      try {
        const res = await noteService.createNote({
          title: 'Untitled Note',
          content: '',
          plainText: '',
          tags: selectedTag ? [selectedTag] : [],
          folder: selectedFolder || 'Personal',
          category: selectedFolder || 'Personal',
          isPinned: false,
          isFavorite: false
        });
        if (res?.data) {
          createdNote = res.data;
        }
      } catch (err) {
        console.warn('Backend note creation failed, falling back to local creation:', err);
      }
    }

    // 2. Fallback to local offline note
    if (!createdNote) {
      const localId = `note_${Date.now()}`;
      createdNote = {
        _id: localId,
        id: localId,
        title: 'Untitled Note',
        plainText: '',
        content: '',
        tags: selectedTag ? [selectedTag] : [],
        category: selectedFolder || 'Personal',
        folder: selectedFolder || 'Personal',
        isPinned: false,
        isFavorite: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }

    // Save locally immediately
    await offlineService.saveLocalNote(createdNote, true);

    setNotes((prev) => [createdNote, ...prev]);
    setStats((prev) => ({ ...prev, totalNotes: (prev.totalNotes || 0) + 1 }));

    // Open in tab
    handleSelectNote(createdNote);
    success('New note created');
  };

  // Debounced auto-save handler
  const handleUpdateNote = (updatedFields) => {
    setSaveStatus('unsaved');

    // Update current tab title if title changed
    if (updatedFields.title) {
      setTabs((prev) =>
        prev.map((t) =>
          t.id === activeTabId
            ? { ...t, title: updatedFields.title, isUnsaved: true }
            : t
        )
      );
    }

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(async () => {
      setSaveStatus('saving');

      try {
        const merged = {
          ...activeNote,
          ...updatedFields,
          updatedAt: new Date().toISOString()
        };

        // 1. Persist to local Dexie database
        await offlineService.saveLocalNote(merged, true);

        // 2. Persist to backend if online and valid ID
        const targetId = activeNote?._id || activeNote?.id;
        const isValidServerId = targetId && String(targetId).length === 24 && !String(targetId).includes('-');

        if (navigator.onLine && isValidServerId) {
          await noteService.updateNote(targetId, updatedFields);
          setSaveStatus('saved');
        } else {
          setSaveStatus(navigator.onLine ? 'saved' : 'offline');
        }

        setLastSavedTime(
          new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        );

        // Update in notes list
        setNotes((prev) =>
          prev.map((n) =>
            (n._id || n.id) === targetId ? merged : n
          )
        );

        // Clear unsaved badge on tab
        setTabs((prev) =>
          prev.map((t) => (t.id === activeTabId ? { ...t, isUnsaved: false } : t))
        );
      } catch (err) {
        console.warn('Auto-save error:', err);
        setSaveStatus('offline');
      }
    }, 600);
  };

  // Note actions
  const handleTogglePin = async (noteId) => {
    try {
      const target = notes.find((n) => (n._id || n.id) === noteId);
      if (!target) return;
      const nextPinned = !target.isPinned;
      const updated = { ...target, isPinned: nextPinned };

      // Update notes list and re-sort so pinned notes are at the top
      setNotes((prev) => {
        const nextList = prev.map((n) => ((n._id || n.id) === noteId ? updated : n));
        return nextList.sort((a, b) => {
          if (a.isPinned && !b.isPinned) return -1;
          if (!a.isPinned && b.isPinned) return 1;
          return new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt);
        });
      });

      // Update active tab note reference
      setTabs((prev) => prev.map((t) => (t.id === noteId ? { ...t, note: updated } : t)));

      await offlineService.saveLocalNote(updated, true);

      const isValidServerId = String(noteId).length === 24 && !String(noteId).includes('-');
      if (navigator.onLine && isValidServerId) {
        await noteService.togglePin(noteId);
      }

      success(nextPinned ? 'Pinned to top' : 'Unpinned');
    } catch (err) {
      console.warn('togglePin error:', err);
    }
  };

  const handleToggleFavorite = async (noteId) => {
    try {
      const target = notes.find((n) => (n._id || n.id) === noteId);
      if (!target) return;
      const nextFav = !target.isFavorite;
      const updated = { ...target, isFavorite: nextFav };

      setNotes((prev) => {
        const nextList = prev.map((n) => ((n._id || n.id) === noteId ? updated : n));
        setStats((s) => ({
          ...s,
          favorites: nextList.filter((n) => n.isFavorite && !n.isDeleted).length
        }));
        return nextList;
      });

      // Update tab note reference
      setTabs((prev) => prev.map((t) => (t.id === noteId ? { ...t, note: updated } : t)));

      await offlineService.saveLocalNote(updated, true);

      const isValidServerId = String(noteId).length === 24 && !String(noteId).includes('-');
      if (navigator.onLine && isValidServerId) {
        await noteService.toggleFavorite(noteId);
      }

      success(nextFav ? 'Added to favorites' : 'Removed from favorites');
    } catch (err) {
      console.warn('toggleFavorite error:', err);
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      const target = notes.find((n) => (n._id || n.id) === noteId);
      const title = target?.title || 'Note';

      setNotes((prev) => {
        const nextList = prev.filter((n) => (n._id || n.id) !== noteId);
        setStats((s) => ({
          ...s,
          totalNotes: nextList.length,
          favorites: nextList.filter((n) => n.isFavorite && !n.isDeleted).length,
          trash: (s.trash || 0) + 1
        }));
        return nextList;
      });

      handleCloseTab(noteId);
      await offlineService.deleteLocalNote(noteId, false);

      const isValidServerId = String(noteId).length === 24 && !String(noteId).includes('-');
      if (navigator.onLine && isValidServerId) {
        await noteService.deleteNote(noteId);
      }

      info(`"${title}" moved to trash`);
    } catch (err) {
      console.warn('deleteNote error:', err);
    }
  };

  const handleDuplicateNote = async (noteId) => {
    try {
      const original = notes.find((n) => (n._id || n.id) === noteId);
      if (!original) return;

      let duplicateResult = null;
      const isValidServerId = String(noteId).length === 24 && !String(noteId).includes('-');

      if (navigator.onLine && isValidServerId) {
        try {
          const res = await noteService.duplicateNote(noteId);
          if (res?.data) {
            duplicateResult = res.data;
          }
        } catch (apiErr) {
          console.warn('Server duplicate failed, using local clone:', apiErr);
        }
      }

      if (!duplicateResult) {
        const localId = `note_${Date.now()}`;
        duplicateResult = {
          ...original,
          _id: localId,
          id: localId,
          title: `${original.title} (Copy)`,
          isPinned: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
      }

      setNotes((prev) => [duplicateResult, ...prev]);
      setStats((prev) => ({ ...prev, totalNotes: (prev.totalNotes || 0) + 1 }));

      await offlineService.saveLocalNote(duplicateResult, true);
      handleSelectNote(duplicateResult);
      success('Note duplicated');
    } catch (err) {
      console.warn('duplicateNote error:', err);
    }
  };

  const handleAddTag = (tag) => {
    if (!activeNote) return;
    const currentTags = activeNote.tags || [];
    if (!currentTags.includes(tag)) {
      const updatedTags = [...currentTags, tag];
      handleUpdateNote({ tags: updatedTags });
    }
  };

  const handleRemoveTag = (tag) => {
    if (!activeNote) return;
    const updatedTags = (activeNote.tags || []).filter((t) => t !== tag);
    handleUpdateNote({ tags: updatedTags });
  };

  return (
    <div className={`editor-workspace flex h-screen w-screen overflow-hidden font-sans antialiased ${isDark ? 'editor-workspace-dark' : 'editor-workspace-light'}`}>
      {/* PANE 1: Left Navigation Sidebar */}
      {!isFocusMode && (
        <EditorSidebar
          activeNav={activeNav}
          onSelectNav={setActiveNav}
          selectedFolder={selectedFolder}
          onSelectFolder={setSelectedFolder}
          selectedTag={selectedTag}
          onSelectTag={setSelectedTag}
          stats={stats}
          onOpenSettings={onOpenSettings}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
      )}

      {/* PANE 2: Notes Explorer */}
      {!isFocusMode && !isExplorerCollapsed && (
        <NotesExplorer
          notes={notes}
          selectedNoteId={activeTabId}
          onSelectNote={handleSelectNote}
          onNewNote={handleNewNote}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeFilter={activeNav}
          selectedFolder={selectedFolder}
          selectedTag={selectedTag}
          onTogglePin={handleTogglePin}
          onToggleFavorite={handleToggleFavorite}
          onDeleteNote={handleDeleteNote}
          onDuplicateNote={handleDuplicateNote}
          isLoading={isLoading}
        />
      )}

      {/* PANE 3: Main Writing Area */}
      <main className="editor-main flex-1 flex flex-col h-full overflow-hidden min-w-0 bg-[#0e0e14]">
        {/* Tab Bar at the top */}
        <EditorTabBar
          tabs={tabs}
          activeTabId={activeTabId}
          onSwitchTab={setActiveTabId}
          onCloseTab={handleCloseTab}
          onNewTab={handleNewNote}
          saveStatus={saveStatus}
          isInspectorOpen={isInspectorOpen}
          onToggleInspector={() => setIsInspectorOpen(!isInspectorOpen)}
          isFocusMode={isFocusMode}
          onToggleFocusMode={() => setIsFocusMode(!isFocusMode)}
        />

        {/* Tiptap Writing Workspace */}
        <div className="flex-1 overflow-hidden relative flex flex-col">
          <RichTextEditor
            key={activeTabId || 'editor-default'}
            note={activeNote}
            onUpdateNote={handleUpdateNote}
            onWordCountChange={setWordStats}
          />
        </div>

        {/* Bottom Status Bar matching screenshot */}
        <EditorStatusBar
          wordCount={wordStats.words}
          charCount={wordStats.chars}
          readingTime={wordStats.readingTime}
          lastSaved={lastSavedTime}
          isOnline={isOnline}
        />
      </main>

      {/* PANE 4: Right Document Inspector (Properties & Outline) */}
      {!isFocusMode && isInspectorOpen && (
        <DocumentInspector
          note={activeNote}
          wordCount={wordStats.words}
          charCount={wordStats.chars}
          readingTime={wordStats.readingTime}
          onAddTag={handleAddTag}
          onRemoveTag={handleRemoveTag}
          isOpen={isInspectorOpen}
          onClose={() => setIsInspectorOpen(false)}
        />
      )}
    </div>
  );
};
