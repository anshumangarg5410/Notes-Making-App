import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  ChevronDown,
  ChevronRight,
  FileText,
  Star,
  Folder,
  FolderOpen,
  Tag,
  Trash2,
  Cloud,
  Settings,
  HelpCircle,
  Plus,
  PanelLeftClose,
  Check,
  X,
  LogOut
} from 'lucide-react';

export const EditorSidebar = ({
  activeNav = 'all',
  onSelectNav,
  selectedFolder,
  onSelectFolder,
  selectedTag,
  onSelectTag,
  folders = [],
  onCreateFolder,
  onDeleteFolder,
  notes = [],
  onOpenSettings,
  stats = {},
  isCollapsed = false,
  onToggleCollapse
}) => {
  const navigate = useNavigate();
  const [foldersOpen, setFoldersOpen] = useState(true);
  const [expandedFolders, setExpandedFolders] = useState({});
  const [activeAddSubfolderParentId, setActiveAddSubfolderParentId] = useState(null);
  const [newSubfolderName, setNewSubfolderName] = useState('');
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [tagsOpen, setTagsOpen] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const defaultFolders = [
    { id: 'projects', _id: 'projects', name: 'Projects', subfolders: [{ id: 'notenest', _id: 'notenest', name: 'NoteNest' }] },
    { id: 'college', _id: 'college', name: 'College' },
    { id: 'personal', _id: 'personal', name: 'Personal' },
    { id: 'dsa', _id: 'dsa', name: 'DSA' }
  ];

  const rawFolders = folders && folders.length > 0 ? folders : defaultFolders;

  // Split into root folders and child folders
  const rootFolders = rawFolders.filter((f) => !f.parentId);

  // Helper to get subfolders for any folder
  const getSubfoldersFor = (parent) => {
    const parentId = parent._id || parent.id;
    const directChildren = rawFolders.filter(
      (f) => f.parentId && (f.parentId === parentId || f.parentId?._id === parentId || f.parentId?.id === parentId)
    );
    if (directChildren.length > 0) return directChildren;

    if (Array.isArray(parent.subfolders) && parent.subfolders.length > 0) {
      return parent.subfolders.map((sub, idx) => {
        if (typeof sub === 'string') {
          return { id: `${parentId}_${idx}`, _id: `${parentId}_${idx}`, name: sub, parentId };
        }
        return sub;
      });
    }

    return [];
  };

  // Calculate live note count for a folder or subfolder
  const getNoteCount = (folder) => {
    if (!notes || notes.length === 0) return folder.noteCount || folder.count || 0;
    const fName = folder.name?.toLowerCase();
    const fId = folder._id || folder.id;
    return notes.filter((n) => {
      if (n.isDeleted) return false;
      return (
        (n.folderId && n.folderId === fId) ||
        (n.folder && n.folder.toLowerCase() === fName) ||
        (n.category && n.category.toLowerCase() === fName)
      );
    }).length;
  };

  const { user, logout } = useAuth();
  const displayName = user?.name || user?.username || 'User';
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'U';

  const handleLogout = async () => {
    try {
      if (logout) await logout();
    } finally {
      navigate('/');
    }
  };

  const popularTags = ['#go', '#system-design', '#dbms', '#ui-ux', '#projects'];

  const handleCreateRootFolderSubmit = (e) => {
    e.preventDefault();
    if (newFolderName.trim() && onCreateFolder) {
      onCreateFolder(newFolderName.trim(), null);
      setNewFolderName('');
      setIsCreatingFolder(false);
    }
  };

  const handleCreateSubfolderSubmit = (e, parentId) => {
    e.preventDefault();
    if (newSubfolderName.trim() && onCreateFolder) {
      onCreateFolder(newSubfolderName.trim(), parentId);
      setNewSubfolderName('');
      setActiveAddSubfolderParentId(null);
      setExpandedFolders((prev) => ({ ...prev, [parentId]: true }));
    }
  };

  const handleDelete = (item) => {
    if (onDeleteFolder) {
      onDeleteFolder(item._id || item.id, item.name);
    }
    setConfirmDeleteId(null);
  };

  const toggleFolderExpanded = (id) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [id]: prev[id] === undefined ? false : !prev[id]
    }));
  };

  const isFolderExpanded = (folder, hasChildren) => {
    const id = folder._id || folder.id;
    if (expandedFolders[id] !== undefined) {
      return expandedFolders[id];
    }
    // Default: expanded if it has children or matches active selection
    return hasChildren || selectedFolder === folder.name;
  };

  return (
    <aside
      className={`h-full bg-[#13131b] border-r border-[#222230] flex flex-col justify-between select-none text-xs transition-all duration-200 ${
        isCollapsed ? 'w-14' : 'w-64 min-w-[240px]'
      }`}
    >
      {/* Top Brand / User Header */}
      <div className="relative p-3.5 border-b border-[#222230] flex items-center justify-between">
        <div
          onClick={() => setUserMenuOpen(!userMenuOpen)}
          className="flex items-center gap-2.5 cursor-pointer hover:opacity-90 transition-opacity"
          title={`Logged in as ${displayName}`}
        >
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={displayName}
              className="w-7 h-7 rounded-full object-cover border border-purple-500/50 shadow-sm shadow-purple-900/40 shrink-0"
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#9333ea] to-[#c084fc] text-white text-[11px] font-bold flex items-center justify-center shadow-sm shadow-purple-900/50 border border-purple-400/40 shrink-0">
              {initials}
            </div>
          )}
          {!isCollapsed && (
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-sm text-gray-100 tracking-tight">NoteNest</span>
              <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-150 ${userMenuOpen ? 'rotate-180 text-purple-400' : ''}`} />
            </div>
          )}
        </div>

        {/* User Account & Logout Dropdown Menu */}
        {userMenuOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setUserMenuOpen(false)}
            />
            <div className="absolute top-14 left-3 w-56 bg-[#161622] border border-[#2b2b3e] rounded-md shadow-2xl z-50 py-1 text-xs animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-2 border-b border-[#242436]">
                <div className="font-semibold text-gray-100 truncate">{displayName}</div>
                <div className="text-[11px] text-gray-400 truncate">{user?.email || 'Logged in'}</div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setUserMenuOpen(false);
                  if (onOpenSettings) onOpenSettings();
                  else onSelectNav?.('settings');
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-gray-300 hover:text-white hover:bg-[#202030] transition-colors text-left"
              >
                <Settings className="w-3.5 h-3.5 text-purple-400" />
                <span>Account Settings</span>
              </button>

              <div className="h-[1px] bg-[#242436] my-1" />

              <button
                type="button"
                onClick={() => {
                  setUserMenuOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-950/30 transition-colors text-left font-medium"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            </div>
          </>
        )}

        {onToggleCollapse && !isCollapsed && (
          <button
            onClick={onToggleCollapse}
            className="p-1 rounded-[3px] text-gray-400 hover:text-gray-200 hover:bg-[#1f1f2c] transition-colors"
            title="Collapse Sidebar"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Main Navigation Scroll Area */}
      <div className="flex-1 overflow-y-auto obsidian-scrollbar py-3 px-2 space-y-4">
        {/* Primary Navigation Links */}
        <div className="space-y-0.5">
          <button
            onClick={() => {
              onSelectNav('all');
              onSelectFolder?.(null);
              onSelectTag?.(null);
            }}
            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-[3px] transition-colors ${
              activeNav === 'all' && !selectedFolder && !selectedTag
                ? 'bg-purple-900/30 text-purple-200 border-l-2 border-purple-500 font-medium'
                : 'text-gray-300 hover:text-gray-100 hover:bg-[#1a1a24]'
            }`}
            title="All Notes"
          >
            <div className="flex items-center gap-2.5">
              <FileText className={`w-4 h-4 ${activeNav === 'all' && !selectedFolder && !selectedTag ? 'text-purple-400' : 'text-gray-400'}`} />
              {!isCollapsed && <span>All Notes</span>}
            </div>
            {!isCollapsed && stats.totalNotes !== undefined && (
              <span className="text-[10px] text-gray-500">{stats.totalNotes}</span>
            )}
          </button>

          <button
            onClick={() => {
              onSelectNav('favorites');
              onSelectFolder?.(null);
              onSelectTag?.(null);
            }}
            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-[3px] transition-colors ${
              activeNav === 'favorites'
                ? 'bg-purple-900/30 text-purple-200 border-l-2 border-purple-500 font-medium'
                : 'text-gray-300 hover:text-gray-100 hover:bg-[#1a1a24]'
            }`}
            title="Favorites"
          >
            <div className="flex items-center gap-2.5">
              <Star className={`w-4 h-4 ${activeNav === 'favorites' ? 'text-purple-400' : 'text-gray-400'}`} />
              {!isCollapsed && <span>Favorites</span>}
            </div>
            {!isCollapsed && stats.favorites !== undefined && (
              <span className="text-[10px] text-gray-500">{stats.favorites}</span>
            )}
          </button>
        </div>

        {/* Folders Section */}
        {!isCollapsed && (
          <div className="pt-2 border-t border-[#1e1e2c]">
            {/* Folders Header */}
            <div
              onClick={() => setFoldersOpen(!foldersOpen)}
              className="flex items-center justify-between px-2.5 py-1 text-gray-400 hover:text-gray-200 cursor-pointer text-[11px] font-medium uppercase tracking-wider"
            >
              <div className="flex items-center gap-2">
                <Folder className="w-3.5 h-3.5 text-gray-400" />
                <span>Folders</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsCreatingFolder(!isCreatingFolder);
                  }}
                  className="p-1 hover:bg-[#252536] rounded text-gray-400 hover:text-purple-300 transition-colors"
                  title="Add new folder"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
                {foldersOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </div>
            </div>

            {/* Inline Root Folder Creation Input */}
            {isCreatingFolder && (
              <form onSubmit={handleCreateRootFolderSubmit} className="mt-1.5 px-2 flex items-center gap-1.5">
                <Folder className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <input
                  type="text"
                  autoFocus
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="New folder name..."
                  className="flex-1 bg-[#1b1b26] border border-purple-500/50 rounded-[3px] px-2 py-1 text-xs text-gray-200 focus:outline-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') setIsCreatingFolder(false);
                  }}
                />
                <button type="submit" className="p-1 text-purple-400 hover:text-purple-300" title="Create">
                  <Check className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsCreatingFolder(false)}
                  className="p-1 text-gray-400 hover:text-gray-200"
                  title="Cancel"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </form>
            )}

            {/* Folders Hierarchy Tree */}
            {foldersOpen && (
              <div className="mt-1 space-y-0.5 text-xs">
                {rootFolders.map((folder) => {
                  const folderId = folder._id || folder.id;
                  const isSelected = selectedFolder?.toLowerCase() === folder.name?.toLowerCase();
                  const subfolders = getSubfoldersFor(folder);
                  const hasSubfolders = subfolders.length > 0;
                  const expanded = isFolderExpanded(folder, hasSubfolders);
                  const noteCount = getNoteCount(folder);
                  const isAddingSub = activeAddSubfolderParentId === folderId;

                  return (
                    <div key={folderId} className="space-y-0.5">
                      {/* Folder Item Row */}
                      <div
                        className={`group relative flex items-center justify-between px-2 py-1 rounded-[3px] transition-colors ${
                          isSelected
                            ? 'bg-purple-900/30 text-purple-200 font-medium'
                            : 'text-gray-300 hover:text-gray-100 hover:bg-[#1a1a24]'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 flex-1 min-w-0 mr-1">
                          {/* Subfolder expand/collapse toggle chevron */}
                          {hasSubfolders ? (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFolderExpanded(folderId);
                              }}
                              className="p-0.5 hover:bg-[#252538] rounded text-gray-400 hover:text-gray-200 transition-colors"
                              title={expanded ? 'Collapse subfolders' : 'Expand subfolders'}
                            >
                              <ChevronRight
                                className={`w-3 h-3 transition-transform duration-150 ${expanded ? 'rotate-90 text-purple-400' : ''}`}
                              />
                            </button>
                          ) : (
                            <span className="w-4" />
                          )}

                          {/* Select Folder Button */}
                          <button
                            type="button"
                            onClick={() => onSelectFolder(isSelected ? null : folder.name)}
                            className="flex items-center gap-2 flex-1 min-w-0 text-left truncate"
                            title={folder.name}
                          >
                            {expanded || isSelected ? (
                              <FolderOpen className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-purple-400' : 'text-gray-400'}`} />
                            ) : (
                              <Folder className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-purple-400' : 'text-gray-400'}`} />
                            )}
                            <span className="truncate">{folder.name}</span>
                          </button>
                        </div>

                        {/* Action buttons / count / confirm delete */}
                        {confirmDeleteId === folderId ? (
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-1 bg-[#281822] border border-red-500/40 rounded px-1.5 py-0.5 text-[10px] text-red-300 shrink-0"
                          >
                            <span>Delete?</span>
                            <button
                              type="button"
                              onClick={() => handleDelete(folder)}
                              className="text-red-400 hover:text-red-200 font-bold px-1"
                              title="Confirm delete"
                            >
                              Yes
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(null)}
                              className="text-gray-400 hover:text-gray-200 px-0.5"
                              title="Cancel"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 shrink-0">
                            {/* Note count (visible when not hovering) */}
                            <span className="text-[10px] text-gray-500 group-hover:hidden">
                              {noteCount}
                            </span>

                            {/* Hover actions: Add subfolder (+) & Delete folder (🗑) */}
                            <div className="hidden group-hover:flex items-center gap-0.5">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveAddSubfolderParentId(folderId);
                                  setNewSubfolderName('');
                                  setExpandedFolders((prev) => ({ ...prev, [folderId]: true }));
                                }}
                                className="p-1 hover:bg-[#252538] rounded text-gray-400 hover:text-purple-300 transition-colors"
                                title="Add subfolder"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setConfirmDeleteId(folderId);
                                }}
                                className="p-1 hover:bg-red-950/60 rounded text-gray-400 hover:text-red-400 transition-colors"
                                title="Delete folder"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Inline Input for Adding Subfolder directly under this folder */}
                      {isAddingSub && (
                        <form
                          onSubmit={(e) => handleCreateSubfolderSubmit(e, folderId)}
                          className="flex items-center gap-1.5 py-1 px-2 my-0.5 ml-6 bg-[#1b1b28] border border-purple-500/50 rounded-[3px]"
                        >
                          <Folder className="w-3 h-3 text-purple-400 shrink-0" />
                          <input
                            type="text"
                            autoFocus
                            value={newSubfolderName}
                            onChange={(e) => setNewSubfolderName(e.target.value)}
                            placeholder="Subfolder name..."
                            className="flex-1 bg-transparent text-xs text-gray-200 outline-none placeholder-gray-500"
                            onKeyDown={(e) => {
                              if (e.key === 'Escape') setActiveAddSubfolderParentId(null);
                            }}
                          />
                          <button
                            type="submit"
                            className="p-0.5 text-purple-400 hover:text-purple-300"
                            title="Create subfolder"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setActiveAddSubfolderParentId(null)}
                            className="p-0.5 text-gray-400 hover:text-gray-200"
                            title="Cancel"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </form>
                      )}

                      {/* Subfolders List (Indented Tree) */}
                      {hasSubfolders && expanded && (
                        <div className="ml-5 pl-2.5 border-l border-[#242436] space-y-0.5">
                          {subfolders.map((sub) => {
                            const subId = sub._id || sub.id;
                            const isSubSelected = selectedFolder?.toLowerCase() === sub.name?.toLowerCase();
                            const subCount = getNoteCount(sub);
                            const isSubAddingNested = activeAddSubfolderParentId === subId;

                            return (
                              <div key={subId} className="space-y-0.5">
                                <div
                                  className={`group relative flex items-center justify-between px-2 py-0.5 rounded-[3px] transition-colors ${
                                    isSubSelected
                                      ? 'bg-purple-900/30 text-purple-200 font-medium'
                                      : 'text-gray-400 hover:text-gray-200 hover:bg-[#1a1a24]'
                                  }`}
                                >
                                  {/* Subfolder Select Button */}
                                  <button
                                    type="button"
                                    onClick={() => onSelectFolder(isSubSelected ? null : sub.name)}
                                    className="flex items-center gap-2 flex-1 min-w-0 text-left truncate mr-1"
                                    title={sub.name}
                                  >
                                    <span
                                      className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                        isSubSelected ? 'bg-purple-400' : 'bg-purple-500/40'
                                      }`}
                                    />
                                    <span className="truncate text-[11px]">{sub.name}</span>
                                  </button>

                                  {/* Subfolder Actions / Delete Confirm */}
                                  {confirmDeleteId === subId ? (
                                    <div
                                      onClick={(e) => e.stopPropagation()}
                                      className="flex items-center gap-1 bg-[#281822] border border-red-500/40 rounded px-1.5 py-0.5 text-[10px] text-red-300 shrink-0"
                                    >
                                      <span>Delete?</span>
                                      <button
                                        type="button"
                                        onClick={() => handleDelete(sub)}
                                        className="text-red-400 hover:text-red-200 font-bold px-1"
                                        title="Delete this subfolder"
                                      >
                                        Yes
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setConfirmDeleteId(null)}
                                        className="text-gray-400 hover:text-gray-200 px-0.5"
                                        title="Cancel"
                                      >
                                        No
                                      </button>
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-1 shrink-0">
                                      {/* Subfolder note count */}
                                      <span className="text-[10px] text-gray-500 group-hover:hidden">
                                        {subCount}
                                      </span>

                                      {/* Hover actions: Add nested (+) & Delete Subfolder (🗑) */}
                                      <div className="hidden group-hover:flex items-center gap-0.5">
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setActiveAddSubfolderParentId(subId);
                                            setNewSubfolderName('');
                                          }}
                                          className="p-1 hover:bg-[#252538] rounded text-gray-400 hover:text-purple-300 transition-colors"
                                          title="Add nested subfolder"
                                        >
                                          <Plus className="w-3 h-3" />
                                        </button>
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setConfirmDeleteId(subId);
                                          }}
                                          className="p-1 hover:bg-red-950/60 rounded text-gray-400 hover:text-red-400 transition-colors"
                                          title="Delete this subfolder"
                                        >
                                          <Trash2 className="w-3 h-3" />
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                </div>

                                {/* Nested Subfolder Inline Input */}
                                {isSubAddingNested && (
                                  <form
                                    onSubmit={(e) => handleCreateSubfolderSubmit(e, subId)}
                                    className="flex items-center gap-1.5 py-1 px-2 my-0.5 ml-4 bg-[#1b1b28] border border-purple-500/50 rounded-[3px]"
                                  >
                                    <Folder className="w-3 h-3 text-purple-400 shrink-0" />
                                    <input
                                      type="text"
                                      autoFocus
                                      value={newSubfolderName}
                                      onChange={(e) => setNewSubfolderName(e.target.value)}
                                      placeholder="Nested folder name..."
                                      className="flex-1 bg-transparent text-xs text-gray-200 outline-none placeholder-gray-500"
                                      onKeyDown={(e) => {
                                        if (e.key === 'Escape') setActiveAddSubfolderParentId(null);
                                      }}
                                    />
                                    <button
                                      type="submit"
                                      className="p-0.5 text-purple-400 hover:text-purple-300"
                                      title="Create"
                                    >
                                      <Check className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setActiveAddSubfolderParentId(null)}
                                      className="p-0.5 text-gray-400 hover:text-gray-200"
                                      title="Cancel"
                                    >
                                      <X className="w-3.5 h-3.5" />
                                    </button>
                                  </form>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tags Section */}
        {!isCollapsed && (
          <div className="pt-2 border-t border-[#1e1e2c]">
            <div
              onClick={() => setTagsOpen(!tagsOpen)}
              className="flex items-center justify-between px-2.5 py-1 text-gray-400 hover:text-gray-200 cursor-pointer text-[11px] font-medium uppercase tracking-wider"
            >
              <div className="flex items-center gap-2">
                <Tag className="w-3.5 h-3.5 text-gray-400" />
                <span>Tags</span>
              </div>
              {tagsOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </div>

            {tagsOpen && (
              <div className="mt-1 pl-2.5 flex flex-wrap gap-1.5">
                {popularTags.map((tag) => {
                  const rawTag = tag.replace('#', '');
                  const isSelected = selectedTag === rawTag;
                  return (
                    <button
                      key={tag}
                      onClick={() => onSelectTag(isSelected ? null : rawTag)}
                      className={`px-2 py-0.5 rounded-[3px] text-[11px] transition-colors ${
                        isSelected
                          ? 'bg-purple-600/30 text-purple-200 border border-purple-500/40'
                          : 'bg-[#1b1b26] text-gray-400 hover:text-gray-200 border border-[#252536] hover:border-gray-600'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Trash */}
        <div className="pt-2 border-t border-[#1e1e2c]">
          <button
            onClick={() => {
              onSelectNav('trash');
              onSelectFolder?.(null);
              onSelectTag?.(null);
            }}
            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-[3px] transition-colors ${
              activeNav === 'trash'
                ? 'bg-purple-900/30 text-purple-200 border-l-2 border-purple-500 font-medium'
                : 'text-gray-400 hover:text-gray-200 hover:bg-[#1a1a24]'
            }`}
            title="Trash"
          >
            <div className="flex items-center gap-2.5">
              <Trash2 className="w-4 h-4 text-gray-400" />
              {!isCollapsed && <span>Trash</span>}
            </div>
            {!isCollapsed && stats.trash !== undefined && (
              <span className="text-[10px] text-gray-500">{stats.trash}</span>
            )}
          </button>
        </div>
      </div>

      {/* Bottom Storage & Footer */}
      <div className="p-3 border-t border-[#222230] space-y-3 bg-[#111118]">
        {/* Storage Widget matching reference */}
        {!isCollapsed && (
          <div className="bg-[#171722] border border-[#242436] rounded-[4px] p-2.5 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-gray-300 font-medium text-[11px]">
                <Cloud className="w-3.5 h-3.5 text-purple-400" />
                <span>Storage</span>
              </div>
              <span className="text-[11px] text-purple-400 font-medium">12%</span>
            </div>
            <div className="text-[10px] text-gray-400">245 MB of 2 GB used</div>
            <div className="w-full h-1.5 bg-[#252536] rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 w-[12%] rounded-full" />
            </div>
          </div>
        )}

        {/* Action icons */}
        <div className="flex items-center justify-between text-gray-400 pt-1">
          <button
            onClick={() => {
              if (onOpenSettings) onOpenSettings();
              onSelectNav?.('settings');
              onSelectFolder?.(null);
              onSelectTag?.(null);
            }}
            className={`p-1.5 px-2.5 rounded-lg flex items-center gap-2 transition-all ${
              activeNav === 'settings'
                ? 'bg-purple-900/40 text-purple-200 border border-purple-500/40 font-medium shadow-sm shadow-purple-950/40'
                : 'text-gray-400 hover:text-gray-200 hover:bg-[#1c1c28]'
            }`}
            title="Settings"
          >
            <Settings className={`w-4 h-4 ${activeNav === 'settings' ? 'text-purple-400' : ''}`} />
            {!isCollapsed && <span>Settings</span>}
          </button>

          <div className="flex items-center gap-1">
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg hover:text-red-400 hover:bg-red-950/30 flex items-center gap-1.5 transition-colors text-gray-400"
              title="Log Out"
            >
              <LogOut className="w-4 h-4 text-red-400/80" />
              {!isCollapsed && <span className="hover:text-red-300">Logout</span>}
            </button>

            {!isCollapsed && (
              <button
                onClick={() => alert('NoteNest Help & Shortcuts: Cmd+K for search, Cmd+S to save')}
                className="p-1.5 rounded-lg hover:text-gray-200 hover:bg-[#1c1c28] flex items-center gap-1.5 transition-colors text-gray-400"
                title="Help & Shortcuts"
              >
                <HelpCircle className="w-4 h-4" />
                <span>Help</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};

