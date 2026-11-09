import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ArrowLeft, Trash2, RefreshCw } from 'lucide-react';
import { TrashHeader } from '../Trash/TrashHeader';
import { TrashStatistics } from '../Trash/TrashStatistics';
import { TrashFilters } from '../Trash/TrashFilters';
import { TrashTable } from '../Trash/TrashTable';
import { TrashDetailsPanel } from '../Trash/TrashDetailsPanel';
import { EmptyTrashDialog } from '../Trash/EmptyTrashDialog';
import { PermanentDeleteDialog } from '../Trash/PermanentDeleteDialog';
import { RestoreConfirmation } from '../Trash/RestoreConfirmation';
import { trashService } from '../../services/trashService';
import { useToast } from '../../context/ToastContext';

export const IntegratedTrashView = ({ onBackToDashboard }) => {
  const { success, error: toastError } = useToast();

  // Filter & Search State
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'notes', 'folders'
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('deleted_desc');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'
  const [isInspectorOpen, setIsInspectorOpen] = useState(true);

  // Selection State
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [checkedItemIds, setCheckedItemIds] = useState([]);

  // Modal States
  const [emptyDialogOpen, setEmptyDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
  const [targetItem, setTargetItem] = useState(null);

  // Data State
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState({
    deletedNotes: 0,
    deletedFolders: 0,
    totalItems: 0,
    retentionPeriodDays: 30,
    reclaimableStorage: '0 KB'
  });
  const [isLoading, setIsLoading] = useState(true);

  // Default demo items if trash is empty so the user can see the UI in action
  const defaultScreenshotTrashItems = useMemo(
    () => [
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
        sizeKb: '12.1 KB',
        words: 850
      },
      {
        id: 'demo-trash-3',
        _id: 'demo-trash-3',
        name: 'Old Projects',
        type: 'folder',
        preview: 'Contains 4 notes: legacy scripts, draft designs, backup specs.',
        originalLocation: 'Root',
        deletedAt: '2026-11-07T18:40:00.000Z',
        autoDeleteInDays: 27,
        sizeKb: '44.8 KB',
        words: 3200
      },
      {
        id: 'demo-trash-4',
        _id: 'demo-trash-4',
        name: 'LeetCode Practice',
        type: 'note',
        preview: 'Problem solving and patterns: sliding window, two pointers, graph BFS/DFS.',
        originalLocation: 'DSA',
        deletedAt: '2026-11-06T22:05:00.000Z',
        autoDeleteInDays: 26,
        sizeKb: '15.6 KB',
        words: 980
      },
      {
        id: 'demo-trash-5',
        _id: 'demo-trash-5',
        name: 'Temp',
        type: 'folder',
        preview: 'Contains 2 notes: meeting scratchpads, draft export.',
        originalLocation: 'Root',
        deletedAt: '2026-11-05T15:18:00.000Z',
        autoDeleteInDays: 25,
        sizeKb: '8.2 KB',
        words: 410
      },
      {
        id: 'demo-trash-6',
        _id: 'demo-trash-6',
        name: 'UI Ideas (Backup)',
        type: 'note',
        preview: 'Landing page, editor, color palette, responsive design patterns, obsidian theme notes.',
        originalLocation: 'Projects',
        deletedAt: '2026-11-04T20:33:00.000Z',
        autoDeleteInDays: 24,
        sizeKb: '22.0 KB',
        words: 1540
      }
    ],
    []
  );

  const loadTrashData = useCallback(async () => {
    try {
      setIsLoading(true);
      if (navigator.onLine) {
        try {
          const res = await trashService.getTrash({
            type: activeFilter === 'all' ? undefined : activeFilter,
            search: searchQuery || undefined,
            sort: sortBy
          });

          if (res.success && Array.isArray(res.data) && res.data.length > 0) {
            setItems(res.data);
            setSelectedItemId((curr) => curr || res.data[0].id || res.data[0]._id);
          } else {
            setItems(defaultScreenshotTrashItems);
            setSelectedItemId(defaultScreenshotTrashItems[0].id);
          }

          const statsRes = await trashService.getStats();
          if (statsRes.success && statsRes.data) {
            setStats(statsRes.data);
          }
        } catch (apiErr) {
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
  }, [activeFilter, searchQuery, sortBy, defaultScreenshotTrashItems]);

  useEffect(() => {
    loadTrashData();
  }, [loadTrashData]);

  // Filtered items
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

  const selectedItem = useMemo(() => {
    return items.find((i) => (i.id || i._id) === selectedItemId) || items[0] || null;
  }, [items, selectedItemId]);

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

  const counts = {
    all: items.length,
    notes: items.filter((i) => i.type === 'note').length,
    folders: items.filter((i) => i.type === 'folder').length
  };

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Return to Dashboard Bar */}
      <div className="flex items-center justify-between gap-4 pb-2 border-b border-purple-500/15">
        <button
          onClick={onBackToDashboard}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-[4px] bg-purple-950/40 hover:bg-purple-900/60 border border-purple-500/30 text-purple-200 hover:text-white text-xs font-semibold transition-all cursor-pointer shadow-sm group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Dashboard Overview</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[3px] bg-purple-950/60 border border-purple-500/25 text-[11px] text-purple-300">
            <Trash2 className="w-3.5 h-3.5 text-purple-400" />
            <span>Trash Integration Active</span>
          </span>
          <button
            onClick={loadTrashData}
            title="Refresh Trash"
            className="p-1.5 rounded-[3px] bg-purple-950/40 hover:bg-purple-900/60 border border-purple-500/30 text-purple-300 hover:text-white transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Trash Header with Title & Action Buttons */}
      <TrashHeader
        totalItems={items.length}
        onRestoreAll={handleRestoreAll}
        onEmptyTrash={() => setEmptyDialogOpen(true)}
      />

      {/* 4 Statistics Cards */}
      <TrashStatistics stats={stats} />

      {/* Main Workspace Layout (Table on left, Details on right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-start">
        {/* Left / Center Column: Filters & Table */}
        <div className={`space-y-4 ${isInspectorOpen && selectedItem ? 'lg:col-span-8 xl:col-span-8' : 'lg:col-span-12'}`}>
          {/* Filters Bar */}
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

          {/* Table / List View */}
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

        {/* Right Column: Selected Item Inspector Panel */}
        {isInspectorOpen && selectedItem && (
          <div className="lg:col-span-4 xl:col-span-4 sticky top-6">
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
          </div>
        )}
      </div>

      {/* Confirmation Dialogs */}
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
    </div>
  );
};

export default IntegratedTrashView;
