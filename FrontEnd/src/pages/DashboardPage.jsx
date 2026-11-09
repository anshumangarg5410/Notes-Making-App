import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { DashboardLayout } from '../components/Dashboard/DashboardLayout';
import { dashboardService } from '../services/dashboardService';
import { noteService } from '../services/noteService';
import { useToast } from '../context/ToastContext';

export const DashboardPage = ({ onOpenNoteInEditor = null }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialNav = searchParams.get('view') === 'trash' ? 'trash' : 'dashboard';
  const [data, setData] = useState({
    notes: [],
    stats: { totalNotes: 48, folders: 6, tags: 12, favorites: 9 },
    folders: [],
    tags: [],
    activities: [],
    storage: { usedMb: 245, totalGb: 2, percentage: 12 }
  });
  const [loading, setLoading] = useState(true);
  const [activeNav, setActiveNav] = useState(initialNav);
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const view = searchParams.get('view');
    if (view === 'trash') {
      setActiveNav('trash');
    } else if (view === 'folders') {
      setActiveNav('folders');
    } else if (view === 'settings' || view === 'profile') {
      setActiveNav(view);
    } else if (!view || view === 'dashboard') {
      setActiveNav('dashboard');
    }
  }, [searchParams]);

  const loadData = useCallback(async () => {
    try {
      const res = await dashboardService.getDashboardData();
      setData(res);
    } catch (err) {
      console.warn('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle clicking a note row
  const handleSelectNote = (note) => {
    dashboardService.logActivity(`Opened note "${note.title || 'Untitled'}"`, 'open');
    if (onOpenNoteInEditor) {
      onOpenNoteInEditor(note);
    } else {
      navigate(`/notes?noteId=${note._id}`);
    }
  };

  // Handle New Note action
  const handleNewNote = async () => {
    try {
      const res = await noteService.createNote({
        title: 'Untitled Note',
        plainText: '',
        tags: ['Draft']
      });
      dashboardService.logActivity('Created new note', 'create');
      success('New note created!');
      if (res.success && res.data) {
        if (onOpenNoteInEditor) {
          onOpenNoteInEditor(res.data);
        } else {
          navigate(`/notes?noteId=${res.data._id}`);
        }
      }
    } catch (err) {
      // Local fallback
      const fallbackNote = {
        _id: 'local-' + Date.now(),
        title: 'Untitled Note',
        plainText: '',
        tags: ['Draft'],
        updatedAt: new Date().toISOString()
      };
      if (onOpenNoteInEditor) {
        onOpenNoteInEditor(fallbackNote);
      } else {
        navigate(`/notes?noteId=${fallbackNote._id}`);
      }
    }
  };

  // Handle Create Folder
  const handleCreateFolder = (name, parent) => {
    const newFolder = {
      id: 'f-' + Date.now(),
      name,
      parent: parent || null,
      count: 0
    };
    const updated = [...data.folders, newFolder];
    localStorage.setItem('notenest_custom_folders', JSON.stringify(updated));
    setData((prev) => ({
      ...prev,
      folders: updated,
      stats: { ...prev.stats, folders: prev.stats.folders + 1 }
    }));
    dashboardService.logActivity(`Created folder "${name}"`, 'folder');
  };

  // Handle Import Note
  const handleImportNote = async (noteData) => {
    try {
      const res = await noteService.createNote(noteData);
      dashboardService.logActivity(`Imported "${noteData.title}"`, 'import');
      loadData();
      if (res.success && res.data) {
        if (onOpenNoteInEditor) {
          onOpenNoteInEditor(res.data);
        } else {
          navigate(`/notes?noteId=${res.data._id}`);
        }
      }
    } catch (err) {
      // Offline fallback
      setData((prev) => ({
        ...prev,
        notes: [
          {
            _id: 'imp-' + Date.now(),
            ...noteData,
            updatedAt: new Date().toISOString()
          },
          ...prev.notes
        ]
      }));
    }
  };

  // Handle Toggle Favorite
  const handleToggleFavorite = async (id) => {
    try {
      await noteService.toggleFavorite(id);
      setData((prev) => ({
        ...prev,
        notes: prev.notes.map((n) =>
          n._id === id ? { ...n, isFavorite: !n.isFavorite } : n
        )
      }));
      dashboardService.logActivity('Updated note favorite state', 'edit');
      success('Favorite status updated');
    } catch (err) {
      setData((prev) => ({
        ...prev,
        notes: prev.notes.map((n) =>
          n._id === id ? { ...n, isFavorite: !n.isFavorite } : n
        )
      }));
    }
  };

  // Handle Delete Note
  const handleDeleteNote = async (id) => {
    try {
      await noteService.deleteNote(id);
      setData((prev) => ({
        ...prev,
        notes: prev.notes.filter((n) => n._id !== id),
        stats: { ...prev.stats, totalNotes: Math.max(0, prev.stats.totalNotes - 1) }
      }));
      dashboardService.logActivity('Moved note to trash', 'delete');
      success('Note moved to trash');
    } catch (err) {
      setData((prev) => ({
        ...prev,
        notes: prev.notes.filter((n) => n._id !== id)
      }));
    }
  };

  // Handle Sidebar Nav
  const handleSelectNav = (navId) => {
    setActiveNav(navId);
    if (navId === 'dashboard') {
      setSearchParams({});
    } else if (navId === 'trash') {
      setSearchParams({ view: 'trash' });
    } else if (navId === 'folders') {
      setSearchParams({ view: 'folders' });
    } else if (navId === 'settings') {
      setSearchParams({ view: 'settings' });
    } else if (navId === 'profile') {
      setSearchParams({ view: 'profile' });
    } else if (navId === 'all-notes' || navId === 'favorites') {
      navigate(`/notes?view=${navId}`);
    } else if (navId.startsWith('folder-')) {
      const folderName = navId.replace('folder-', '');
      navigate(`/notes?folder=${folderName}`);
    }
  };

  const handleSelectTag = (tag) => {
    navigate(`/notes?tag=${tag}`);
  };

  const handleSelectFolder = (folderName) => {
    navigate(`/notes?folder=${folderName}`);
  };

  return (
    <DashboardLayout
      notes={data.notes}
      stats={data.stats}
      folders={data.folders}
      tags={data.tags}
      activities={data.activities}
      storage={data.storage}
      activeNav={activeNav}
      onSelectNav={handleSelectNav}
      onSelectNote={handleSelectNote}
      onNewNote={handleNewNote}
      onCreateFolder={handleCreateFolder}
      onImportNote={handleImportNote}
      onToggleFavorite={handleToggleFavorite}
      onDeleteNote={handleDeleteNote}
      onSelectTag={handleSelectTag}
      onSelectFolder={handleSelectFolder}
      onOpenSettings={() => handleSelectNav('settings')}
      onViewAllNotes={() => navigate('/notes?view=all')}
      onViewAllFolders={() => handleSelectNav('folders')}
    />
  );
};

export default DashboardPage;

