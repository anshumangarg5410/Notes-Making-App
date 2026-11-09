import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ArrowLeft, LayoutGrid, List, ChevronDown, Folder as FolderIcon, RefreshCw } from 'lucide-react';
import { FolderPageHeader } from '../Folders/FolderPageHeader';
import { FolderStatistics } from '../Folders/FolderStatistics';
import { FolderGrid } from '../Folders/FolderGrid';
import { FolderList } from '../Folders/FolderList';
import { NestedFolderTree } from '../Folders/NestedFolderTree';
import { FolderDetailsPanel } from '../Folders/FolderDetailsPanel';
import { CreateFolderModal } from '../Folders/CreateFolderModal';
import { RenameFolderModal } from '../Folders/RenameFolderModal';
import { DeleteFolderDialog } from '../Folders/DeleteFolderDialog';
import { folderService } from '../../services/folderService';
import { offlineService } from '../../services/db';
import { useToast } from '../../context/ToastContext';

export const IntegratedFoldersView = ({ onBackToDashboard, onOpenFolderInEditor }) => {
  const { success, error: toastError } = useToast();

  // View & Filter states
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('updated_desc');
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  // Modal states
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [targetFolder, setTargetFolder] = useState(null);
  const [createParentId, setCreateParentId] = useState(null);

  // Data states
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [stats, setStats] = useState({
    totalFolders: 8,
    totalNotes: 42,
    nestedFolders: 3,
    taggedFolders: 12
  });
  const [isLoading, setIsLoading] = useState(true);

  // Default initial folders matching reference design
  const defaultScreenshotFolders = useMemo(
    () => [
      {
        id: 'f-college',
        _id: 'f-college',
        name: 'College',
        noteCount: 18,
        color: 'purple',
        createdAt: '2025-01-10T10:00:00.000Z',
        updatedAt: new Date(Date.now() - 7200000).toISOString()
      },
      {
        id: 'f-projects',
        _id: 'f-projects',
        name: 'Projects',
        noteCount: 12,
        subfolderCount: 3,
        subfolders: ['NoteNest', 'API Gateway', 'Traffic System'],
        color: 'blue',
        createdAt: '2025-01-08T10:00:00.000Z',
        updatedAt: new Date(Date.now() - 14400000).toISOString()
      },
      {
        id: 'f-dsa',
        _id: 'f-dsa',
        name: 'DSA',
        noteCount: 8,
        color: 'green',
        createdAt: '2025-01-05T10:00:00.000Z',
        updatedAt: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: 'f-personal',
        _id: 'f-personal',
        name: 'Personal',
        noteCount: 6,
        color: 'amber',
        createdAt: '2025-01-02T10:00:00.000Z',
        updatedAt: new Date(Date.now() - 172800000).toISOString()
      },
      {
        id: 'f-system-design',
        _id: 'f-system-design',
        name: 'System Design',
        noteCount: 5,
        color: 'rose',
        createdAt: '2025-01-01T10:00:00.000Z',
        updatedAt: new Date(Date.now() - 259200000).toISOString()
      },
      {
        id: 'f-dbms',
        _id: 'f-dbms',
        name: 'DBMS',
        noteCount: 4,
        color: 'violet',
        createdAt: '2024-12-28T10:00:00.000Z',
        updatedAt: new Date(Date.now() - 345600000).toISOString()
      },
      {
        id: 'f-ui-ux',
        _id: 'f-ui-ux',
        name: 'UI / UX',
        noteCount: 4,
        color: 'cyan',
        createdAt: '2024-12-25T10:00:00.000Z',
        updatedAt: new Date(Date.now() - 432000000).toISOString()
      },
      {
        id: 'f-resources',
        _id: 'f-resources',
        name: 'Resources',
        noteCount: 3,
        color: 'indigo',
        createdAt: '2024-12-20T10:00:00.000Z',
        updatedAt: new Date(Date.now() - 604800000).toISOString()
      }
    ],
    []
  );

  const loadFolderData = useCallback(async () => {
    setIsLoading(true);
    try {
      const localCached = await offlineService.getLocalFolders();
      if (localCached && localCached.length > 0) {
        setFolders(localCached);
        if (!selectedFolder) setSelectedFolder(localCached[0]);
      }

      if (navigator.onLine) {
        try {
          const res = await folderService.getFolders({ sortBy });
          if (res.success && Array.isArray(res.data) && res.data.length > 0) {
            setFolders(res.data);
            await offlineService.cacheServerFolders(res.data);
            setSelectedFolder((curr) => {
              if (curr) {
                const found = res.data.find((f) => (f._id || f.id) === (curr._id || curr.id));
                if (found) return found;
              }
              return res.data[0];
            });
          } else if (folders.length === 0 && (!localCached || localCached.length === 0)) {
            setFolders(defaultScreenshotFolders);
            setSelectedFolder(defaultScreenshotFolders[0]);
            await offlineService.cacheServerFolders(defaultScreenshotFolders);
          }

          const statsRes = await folderService.getStats();
          if (statsRes.success && statsRes.data) {
            setStats(statsRes.data);
          }
        } catch (apiErr) {
          if (folders.length === 0) {
            setFolders(defaultScreenshotFolders);
            setSelectedFolder(defaultScreenshotFolders[0]);
          }
        }
      }
    } catch (err) {
      console.warn('loadFolderData error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [sortBy, defaultScreenshotFolders]);

  useEffect(() => {
    loadFolderData();
  }, [loadFolderData]);

  const filteredFolders = useMemo(() => {
    if (!searchQuery.trim()) return folders;
    const q = searchQuery.toLowerCase().trim();
    return folders.filter((f) => {
      const nameMatch = f.name?.toLowerCase().includes(q);
      const descMatch = f.description?.toLowerCase().includes(q);
      const subMatch = f.subfolders?.some((s) => s.toLowerCase().includes(q));
      return nameMatch || descMatch || subMatch;
    });
  }, [folders, searchQuery]);

  const handleCreateFolder = async (folderData) => {
    try {
      if (navigator.onLine) {
        const res = await folderService.createFolder(folderData);
        if (res.success && res.data) {
          setFolders((prev) => [res.data, ...prev]);
          setSelectedFolder(res.data);
          await offlineService.saveLocalFolder(res.data);
          success(`Folder "${folderData.name}" created`);
          loadFolderData();
          return;
        }
      }

      const localFolder = {
        _id: 'f-' + Date.now(),
        id: 'f-' + Date.now(),
        name: folderData.name,
        color: folderData.color || 'purple',
        noteCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setFolders((prev) => [localFolder, ...prev]);
      setSelectedFolder(localFolder);
      await offlineService.saveLocalFolder(localFolder);
      success(`Folder "${folderData.name}" created`);
    } catch (err) {
      toastError(err.response?.data?.message || err.message || 'Failed to create folder');
    }
  };

  const handleRenameFolder = async (folderId, newName) => {
    try {
      setFolders((prev) =>
        prev.map((f) => ((f._id || f.id) === folderId ? { ...f, name: newName } : f))
      );
      if (selectedFolder && (selectedFolder._id || selectedFolder.id) === folderId) {
        setSelectedFolder((prev) => ({ ...prev, name: newName }));
      }

      if (navigator.onLine) {
        await folderService.renameFolder(folderId, newName);
      }
      success(`Folder renamed to "${newName}"`);
      loadFolderData();
    } catch (err) {
      toastError(err.response?.data?.message || err.message || 'Failed to rename folder');
      loadFolderData();
    }
  };

  const handleDeleteFolder = async (folderId) => {
    try {
      const remaining = folders.filter((f) => (f._id || f.id) !== folderId);
      setFolders(remaining);
      if (selectedFolder && (selectedFolder._id || selectedFolder.id) === folderId) {
        setSelectedFolder(remaining[0] || null);
      }

      if (navigator.onLine) {
        await folderService.deleteFolder(folderId);
      }
      success('Folder moved to trash');
      loadFolderData();
    } catch (err) {
      toastError(err.response?.data?.message || err.message || 'Failed to delete folder');
      loadFolderData();
    }
  };

  const sortLabels = {
    updated_desc: 'Last Modified',
    name_asc: 'Name (A-Z)',
    notes_desc: 'Most Notes',
    created_desc: 'Date Created'
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
            <FolderIcon className="w-3.5 h-3.5 text-purple-400" />
            <span>Folders Integration Active</span>
          </span>
          <button
            onClick={loadFolderData}
            title="Refresh Folders"
            className="p-1.5 rounded-[3px] bg-purple-950/40 hover:bg-purple-900/60 border border-purple-500/30 text-purple-300 hover:text-white transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Page Header */}
      <FolderPageHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onNewFolder={() => {
          setCreateParentId(null);
          setCreateModalOpen(true);
        }}
      />

      {/* 4 Statistics Cards */}
      <FolderStatistics stats={stats} />

      {/* Main Workspace Layout (Folders on left, Details on right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-start">
        {/* Left Column: Folders View */}
        <div className="lg:col-span-8 xl:col-span-8 space-y-5">
          {/* My Folders Header & View Controls */}
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white tracking-tight">
              My Folders
            </h2>

            <div className="flex items-center gap-2 select-none text-xs">
              {/* Sort Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-[3px] bg-[#161622] hover:bg-[#1f1f2e] text-gray-300 border border-[#272738] transition-colors"
                >
                  <span>{sortLabels[sortBy] || 'Last Modified'}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                </button>

                {sortDropdownOpen && (
                  <div className="absolute right-0 top-full mt-1 w-36 bg-[#1a1a26] border border-[#2b2b3d] rounded-[4px] shadow-2xl py-1 z-30 text-xs">
                    {Object.entries(sortLabels).map(([key, label]) => (
                      <button
                        key={key}
                        onClick={() => {
                          setSortBy(key);
                          setSortDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 hover:bg-[#252538] ${
                          sortBy === key ? 'text-purple-400 font-semibold' : 'text-gray-300'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Grid / List View Buttons */}
              <div className="flex items-center bg-[#161622] border border-[#272738] rounded-[3px] p-0.5">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-[2px] transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-purple-900/50 text-purple-300'
                      : 'text-gray-400 hover:text-white'
                  }`}
                  title="Grid View"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-[2px] transition-colors ${
                    viewMode === 'list'
                      ? 'bg-purple-900/50 text-purple-300'
                      : 'text-gray-400 hover:text-white'
                  }`}
                  title="List View"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Folder Grid / List */}
          {viewMode === 'grid' ? (
            <FolderGrid
              folders={filteredFolders}
              selectedFolderId={selectedFolder?._id || selectedFolder?.id}
              onSelectFolder={setSelectedFolder}
              onOpenFolder={(f) => onOpenFolderInEditor && onOpenFolderInEditor(f.name)}
              onRenameFolder={(f) => {
                setTargetFolder(f);
                setRenameModalOpen(true);
              }}
              onMoveFolder={() => {}}
              onAddSubfolder={(f) => {
                setCreateParentId(f._id || f.id);
                setCreateModalOpen(true);
              }}
              onDeleteFolder={(f) => {
                setTargetFolder(f);
                setDeleteDialogOpen(true);
              }}
            />
          ) : (
            <FolderList
              folders={filteredFolders}
              selectedFolderId={selectedFolder?._id || selectedFolder?.id}
              onSelectFolder={setSelectedFolder}
              onOpenFolder={(f) => onOpenFolderInEditor && onOpenFolderInEditor(f.name)}
              onRenameFolder={(f) => {
                setTargetFolder(f);
                setRenameModalOpen(true);
              }}
              onAddSubfolder={(f) => {
                setCreateParentId(f._id || f.id);
                setCreateModalOpen(true);
              }}
              onDeleteFolder={(f) => {
                setTargetFolder(f);
                setDeleteDialogOpen(true);
              }}
            />
          )}

          {/* Nested Folders Hierarchy Tree */}
          <NestedFolderTree
            onOpenSubfolder={(subName) => onOpenFolderInEditor && onOpenFolderInEditor(subName)}
          />
        </div>

        {/* Right Column: Selected Folder Details Panel */}
        <div className="lg:col-span-4 xl:col-span-4 sticky top-6">
          <FolderDetailsPanel
            folder={selectedFolder}
            onOpenFolder={(f) => onOpenFolderInEditor && onOpenFolderInEditor(f.name)}
            onRenameFolder={(f) => {
              setTargetFolder(f);
              setRenameModalOpen(true);
            }}
            onMoveFolder={() => {}}
            onAddSubfolder={(f) => {
              setCreateParentId(f._id || f.id);
              setCreateModalOpen(true);
            }}
            onDeleteFolder={(f) => {
              setTargetFolder(f);
              setDeleteDialogOpen(true);
            }}
          />
        </div>
      </div>

      {/* Modal Dialogs */}
      <CreateFolderModal
        isOpen={createModalOpen}
        onClose={() => {
          setCreateModalOpen(false);
          setCreateParentId(null);
        }}
        onCreateFolder={handleCreateFolder}
        parentId={createParentId}
        existingFolders={folders}
      />

      <RenameFolderModal
        isOpen={renameModalOpen}
        folder={targetFolder}
        onClose={() => {
          setRenameModalOpen(false);
          setTargetFolder(null);
        }}
        onRenameFolder={handleRenameFolder}
      />

      <DeleteFolderDialog
        isOpen={deleteDialogOpen}
        folder={targetFolder}
        onClose={() => {
          setDeleteDialogOpen(false);
          setTargetFolder(null);
        }}
        onConfirm={handleDeleteFolder}
      />
    </div>
  );
};

export default IntegratedFoldersView;
