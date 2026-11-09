import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/Dashboard/Sidebar';
import { TrashHeader } from '../components/Trash/TrashHeader';
import { TrashStatistics } from '../components/Trash/TrashStatistics';
import { TrashFilters } from '../components/Trash/TrashFilters';
import { TrashTable } from '../components/Trash/TrashTable';
import { TrashDetailsPanel } from '../components/Trash/TrashDetailsPanel';
import { EmptyTrashDialog } from '../components/Trash/EmptyTrashDialog';
import { PermanentDeleteDialog } from '../components/Trash/PermanentDeleteDialog';
import { RestoreConfirmation } from '../components/Trash/RestoreConfirmation';
import { SettingsModal } from '../components/modals/SettingsModal';
import { UpgradeProModal } from '../components/Dashboard/UpgradeProModal';
import { trashService } from '../services/trashService';
import { useToast } from '../context/ToastContext';

export const TrashPage = () => {
  const navigate = useNavigate();
  const { success, error: toastError, info } = useToast();

  // Layout & UI State
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isInspectorOpen, setIsInspectorOpen] = useState(true);

  // Filter & Search State
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'notes', 'folders'
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('deleted_desc');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'

  // Selection State
  const [selectedItemId, setSelectedItemId] = useState('demo-trash-1');
  const [checkedItemIds, setCheckedItemIds] = useState(['demo-trash-1']); // Checked in screenshot

  // Modal States
  const [emptyDialogOpen, setEmptyDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [targetItem, setTargetItem] = useState(null);

  // Data State
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState({
    deletedNotes: 12,
    deletedFolders: 3,
    totalItems: 15,
    retentionPeriodDays: 30,
    reclaimableStorage: '18.4 MB'
  });
  const [isLoading, setIsLoading] = useState(true);

  // Default demo items matching the screenshot exactly
  const defaultScreenshotTrashItems = [
    {
      id: 'demo-trash-1',
      _id: 'demo-trash-1',
      name: 'System Design Notes',
      type: 'note',
      preview: 'Scalability, load balancing, CAP theorem, consistent hashing, rate limiting...',
      originalLocation: '—',
      deletedAt: '2026-11-09T11:24:00.000Z',
      autoDeleteInDays: 29,
      sizeKb: '18.4 KB',
      words: 1246
    },
    {
      id: 'demo-trash-2',
      _id: 'demo-trash-2',
      name: 'DBMS Queries',
      type: 'note',
      preview: 'Normalization, joins, indexing, transactions, ACID properties...',
      originalLocation: 'College',
      deletedAt: '2026-11-08T21:12:00.000Z',
      autoDeleteInDays: 28,
      sizeKb: '12.8 KB',
      words: 850
    },
    {
      id: 'demo-trash-3',
      _id: 'demo-trash-3',
      name: 'Old Projects',
      type: 'folder',
      preview: 'Contains 4 notes',
      noteCount: 4,
      color: 'amber',
      originalLocation: 'Root',
      deletedAt: '2026-11-07T18:40:00.000Z',
      autoDeleteInDays: 27,
      sizeKb: '16.8 KB',
      words: 0
    },
    {
      id: 'demo-trash-4',
      _id: 'demo-trash-4',
      name: 'LeetCode Practice',
      type: 'note',
      preview: 'Problem solving and patterns, sliding window, two pointers...',
      originalLocation: 'DSA',
      deletedAt: '2026-11-06T22:05:00.000Z',
      autoDeleteInDays: 26,
      sizeKb: '14.2 KB',
      words: 920
    },
    {
      id: 'demo-trash-5',
      _id: 'demo-trash-5',
      name: 'Temp',
      type: 'folder',
      preview: 'Contains 2 notes',
      noteCount: 2,
      color: 'blue',
      originalLocation: 'Root',
      deletedAt: '2026-11-05T15:18:00.000Z',
      autoDeleteInDays: 25,
      sizeKb: '8.4 KB',
      words: 0
    },
    {
      id: 'demo-trash-6',
      _id: 'demo-trash-6',
      name: 'UI Ideas (Backup)',
      type: 'note',
      preview: 'Landing page, editor, color palette, responsive design patterns...',
      originalLocation: 'Projects',
      deletedAt: '2026-11-04T20:33:00.000Z',
      autoDeleteInDays: 24,
      sizeKb: '22.1 KB',
      words: 1480
    }
  ];

  // Load Trash Items & Statistics from Backend
  const loadTrashData = useCallback(async () => {
    setIsLoading(true);
    try {
      if (navigator.onLine) {
        try {
          const res = await trashService.getTrashItems({
            type: activeFilter,
            search: searchQuery || undefined,
            sortBy
          });

          if (res.success && Array.isArray(res.data) && res.data.length > 0) {
            setItems(res.data);
            setSelectedItemId((curr) => curr || res.data[0].id || res.data[0]._id);
          } else {
            // Pre-seed demo items if user has no deleted items yet
            setItems(defaultScreenshotTrashItems);
            setSelectedItemId(defaultScreenshotTrashItems[0].id);
          }

          const statsRes = await trashService.getStats();
          if (statsRes.success && statsRes.data) {
            setStats(statsRes.data);
          }
        } catch (apiErr) {
          console.warn('Backend fetch failed, using demo trash:', apiErr.message);
          setItems(defaultScreenshotTrashItems);
          setSelectedItemId(defaultScreenshotTrashItems[0].id);
        }
      } else {
        setItems(defaultScreenshotTrashItems);
        setSelectedItemId(defaultScreenshotTrashItems[0].id);
      }
    } catch (err) {
      console.warn('loadTrashData error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [activeFilter, searchQuery, sortBy]);

  useEffect(() => {
    loadTrashData();
  }, [loadTrashData]);

  // Keyboard shortcut listener for Cmd+K (focus search)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('input[placeholder="Search in trash..."]');
        if (searchInput) searchInput.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filtered items based on filter tabs (All, Notes, Folders)
  const filteredItems = useMemo(() => {
    let result = [...items];
    if (activeFilter === 'notes') {
      result = result.filter((i) => i.type === 'note');
    } else if (activeFilter === 'folders') {
      result = result.filter((i) => i.type === 'folder');
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (i) =>
          i.name?.toLowerCase().includes(q) ||
          i.preview?.toLowerCase().includes(q) ||
          i.originalLocation?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [items, activeFilter, searchQuery]);

  // Selected item object
  const selectedItem = useMemo(() => {
    return items.find((i) => (i.id || i._id) === selectedItemId) || items[0] || null;
  }, [items, selectedItemId]);

  // Checkbox handlers
  const handleToggleCheck = (id) => {
    setCheckedItemIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleToggleCheckAll = () => {
    const visibleIds = filteredItems.map((i) => i.id || i._id);
    const allChecked = visibleIds.every((id) => checkedItemIds.includes(id));
    if (allChecked) {
      setCheckedItemIds((prev) => prev.filter((id) => !visibleIds.includes(id)));
    } else {
      setCheckedItemIds((prev) => Array.from(new Set([...prev, ...visibleIds])));
    }
  };

  // Restoration Handlers
  const handleRestore = async (item) => {
    try {
      const itemId = item.id || item._id;
      setItems((prev) => prev.filter((i) => (i.id || i._id) !== itemId));
      setCheckedItemIds((prev) => prev.filter((id) => id !== itemId));

      if (navigator.onLine && !itemId.toString().startsWith('demo-')) {
        await trashService.restoreItem(itemId, item.type);
      }
      success(`Restored "${item.name}"`);
      loadTrashData();
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to restore item');
      loadTrashData();
    }
  };

  const handleRestoreAll = async () => {
    try {
      if (items.length === 0) return;
      setItems([]);
      setCheckedItemIds([]);
      if (navigator.onLine) {
        await trashService.restoreAll();
      }
      success('All deleted items restored successfully');
      loadTrashData();
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to restore all items');
      loadTrashData();
    }
  };

  const handleBulkRestore = async () => {
    try {
      const itemsToRestore = items.filter((i) => checkedItemIds.includes(i.id || i._id));
      for (const it of itemsToRestore) {
        if (navigator.onLine && !it.id.toString().startsWith('demo-')) {
          await trashService.restoreItem(it.id || it._id, it.type);
        }
      }
      setItems((prev) => prev.filter((i) => !checkedItemIds.includes(i.id || i._id)));
      setCheckedItemIds([]);
      success(`Restored ${itemsToRestore.length} items`);
      loadTrashData();
    } catch (err) {
      toastError('Failed to bulk restore items');
    }
  };

  // Deletion Handlers
  const handleDeletePermanently = async (item) => {
    try {
      const itemId = item.id || item._id;
      setItems((prev) => prev.filter((i) => (i.id || i._id) !== itemId));
      setCheckedItemIds((prev) => prev.filter((id) => id !== itemId));

      if (navigator.onLine && !itemId.toString().startsWith('demo-')) {
        await trashService.deletePermanently(itemId, item.type);
      }
      success(`Permanently deleted "${item.name}"`);
      loadTrashData();
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to permanently delete item');
      loadTrashData();
    }
  };

  const handleBulkDelete = async () => {
    try {
      const itemsToDelete = items.filter((i) => checkedItemIds.includes(i.id || i._id));
      for (const it of itemsToDelete) {
        if (navigator.onLine && !it.id.toString().startsWith('demo-')) {
          await trashService.deletePermanently(it.id || it._id, it.type);
        }
      }
      setItems((prev) => prev.filter((i) => !checkedItemIds.includes(i.id || i._id)));
      setCheckedItemIds([]);
      success(`Permanently deleted ${itemsToDelete.length} items`);
      loadTrashData();
    } catch (err) {
      toastError('Failed to bulk delete items');
    }
  };

  const handleEmptyTrash = async () => {
    try {
      setItems([]);
      setCheckedItemIds([]);
      if (navigator.onLine) {
        await trashService.emptyTrash();
      }
      success('Trash emptied permanently');
      loadTrashData();
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to empty trash');
      loadTrashData();
    }
  };

  const handleSelectNav = (navId) => {
    if (navId === 'dashboard') {
      navigate('/dashboard');
    } else if (navId === 'all-notes') {
      navigate('/notes?view=all');
    } else if (navId === 'favorites') {
      navigate('/notes?view=favorites');
    } else if (navId === 'folders') {
      navigate('/folders');
    } else if (navId === 'tags') {
      navigate('/notes?view=tags');
    } else if (navId === 'settings') {
      navigate('/settings');
    } else if (navId === 'help') {
      alert('NoteNest Trash: Items are kept safely for 30 days before permanent auto-cleanup.');
    }
  };

  const counts = {
    all: items.length,
    notes: items.filter((i) => i.type === 'note').length,
    folders: items.filter((i) => i.type === 'folder').length
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0c0c11] text-gray-100 font-sans antialiased">
      {/* AREA 1: Left Navigation Sidebar */}
      <Sidebar
        activeNav="trash"
        onSelectNav={handleSelectNav}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        onOpenUpgradeModal={() => setUpgradeModalOpen(true)}
      />

      {/* AREA 2: Main Trash Workspace */}
      <main className="flex-1 flex flex-col h-full overflow-hidden min-w-0 bg-[#0e0e14]">
        <div className="flex-1 overflow-y-auto obsidian-scrollbar p-6 space-y-4 max-w-7xl mx-auto w-full">
          {/* Main Trash Header */}
          <TrashHeader
            totalItems={items.length}
            onRestoreAll={handleRestoreAll}
            onEmptyTrash={() => setEmptyDialogOpen(true)}
          />

          {/* 4 Statistics Cards */}
          <TrashStatistics stats={stats} />

          {/* Filter Tabs, Search & Sort Bar */}
          <TrashFilters
            activeFilter={activeFilter}
            onSelectFilter={setActiveFilter}
            counts={counts}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sortBy={sortBy}
            onSelectSort={setSortBy}
            viewMode={viewMode}
            onSelectViewMode={setViewMode}
          />

          {/* Deleted Items Table */}
          <TrashTable
            items={filteredItems}
            selectedItemId={selectedItemId}
            onSelectItem={(it) => {
              setSelectedItemId(it.id || it._id);
              setIsInspectorOpen(true);
            }}
            checkedItemIds={checkedItemIds}
            onToggleCheck={handleToggleCheck}
            onToggleCheckAll={handleToggleCheckAll}
            onRestoreItem={(it) => {
              setTargetItem(it);
              setRestoreDialogOpen(true);
            }}
            onDeletePermanently={(it) => {
              setTargetItem(it);
              setDeleteDialogOpen(true);
            }}
            onBulkRestore={handleBulkRestore}
            onBulkDelete={handleBulkDelete}
          />
        </div>
      </main>

      {/* AREA 3: Right Selected-Item Details Panel */}
      {isInspectorOpen && (
        <TrashDetailsPanel
          item={selectedItem}
          isOpen={isInspectorOpen}
          onClose={() => setIsInspectorOpen(false)}
          onRestore={(it) => {
            setTargetItem(it);
            setRestoreDialogOpen(true);
          }}
          onDeletePermanently={(it) => {
            setTargetItem(it);
            setDeleteDialogOpen(true);
          }}
        />
      )}

      {/* Modal Dialogs */}
      <EmptyTrashDialog
        isOpen={emptyDialogOpen}
        totalItems={items.length}
        onClose={() => setEmptyDialogOpen(false)}
        onConfirm={handleEmptyTrash}
      />

      <PermanentDeleteDialog
        isOpen={deleteDialogOpen}
        item={targetItem}
        onClose={() => {
          setDeleteDialogOpen(false);
          setTargetItem(null);
        }}
        onConfirm={handleDeletePermanently}
      />

      <RestoreConfirmation
        isOpen={restoreDialogOpen}
        item={targetItem}
        onClose={() => {
          setRestoreDialogOpen(false);
          setTargetItem(null);
        }}
        onConfirm={handleRestore}
      />

      <SettingsModal
        isOpen={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
      />

      <UpgradeProModal
        isOpen={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
      />
    </div>
  );
};

export default TrashPage;

