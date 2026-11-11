import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
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
  LogOut,
  PenTool
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
  const { user, logout } = useAuth();
  const { isDark } = useTheme();

  const [foldersOpen, setFoldersOpen] = useState(true);
  const [expandedFolders, setExpandedFolders] = useState({});
  const [activeAddSubfolderParentId, setActiveAddSubfolderParentId] = useState(null);
  const [newSubfolderName, setNewSubfolderName] = useState('');
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [tagsOpen, setTagsOpen] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [avatarLoadFailed, setAvatarLoadFailed] = useState(false);

  useEffect(() => {
    setAvatarLoadFailed(false);
  }, [user?.avatar]);

  const resolveAvatarUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
      return url;
    }
    return `http://localhost:5001${url.startsWith('/') ? '' : '/'}${url}`;
  };

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
      className={`h-full border-r flex flex-col justify-between select-none text-xs transition-all duration-200 ${
        isDark ? 'bg-[#13131b] border-[#222230]' : 'bg-white border-[#EAE6F4]'
      } ${
        isCollapsed ? 'w-14' : 'w-64 min-w-[240px]'
      }`}
    >
      {/* Top Brand / User Header */}
      <div className={`relative p-3.5 border-b flex items-center justify-between ${
        isDark ? 'border-[#222230]' : 'border-[#EAE6F4]'
      }`}>
        <div
          onClick={() => setUserMenuOpen(!userMenuOpen)}
          className="flex items-center gap-2.5 cursor-pointer hover:opacity-90 transition-opacity"
          title={`Logged in as ${displayName}`}
        >
          {user?.avatar && !avatarLoadFailed ? (
            <img
              src={resolveAvatarUrl(user.avatar)}
              alt={displayName}
              onError={() => setAvatarLoadFailed(true)}
              className="w-7 h-7 rounded-full object-cover border border-purple-500/50 shadow-sm shadow-purple-900/40 shrink-0"
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#9333ea] to-[#c084fc] text-white text-[11px] font-bold flex items-center justify-center shadow-sm shadow-purple-900/50 border border-purple-400/40 shrink-0">
              {initials}
            </div>
          )}
          {!isCollapsed && (
            <div className="flex items-center gap-1.5">
              <span className={`font-semibold text-sm tracking-tight ${isDark ? 'text-gray-100' : 'text-[#181326]'}`}>NoteNest</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-150 ${
                userMenuOpen ? 'rotate-180 text-purple-500' : isDark ? 'text-gray-400' : 'text-[#6B7280]'
              }`} />
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
            <div className={`absolute top-14 left-3 w-56 border rounded-md shadow-2xl z-50 py-1 text-xs animate-in fade-in zoom-in-95 duration-100 ${
              isDark ? 'bg-[#161622] border-[#2b2b3e]' : 'bg-white border-[#EAE6F4] shadow-purple-200/40'
            }`}>
              <div className={`px-3 py-2 border-b ${isDark ? 'border-[#242436]' : 'border-[#EAE6F4]'}`}>
                <div className={`font-semibold truncate ${isDark ? 'text-gray-100' : 'text-[#181326]'}`}>{displayName}</div>
                <div className={`text-[11px] truncate ${isDark ? 'text-gray-400' : 'text-[#6B7280]'}`}>{user?.email || 'Logged in'}</div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setUserMenuOpen(false);
                  if (onOpenSettings) onOpenSettings();
                  else onSelectNav?.('settings');
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 transition-colors text-left ${
                  isDark ? 'text-gray-300 hover:text-white hover:bg-[#202030]' : 'text-[#374151] hover:text-[#111827] hover:bg-[#F9F8FD]'
                }`}
              >
                <Settings className="w-3.5 h-3.5 text-purple-500" />
                <span>Account Settings</span>
              </button>

              <div className={`h-[1px] my-1 ${isDark ? 'bg-[#242436]' : 'bg-[#EAE6F4]'}`} />

              <button
                type="button"
                onClick={() => {
                  setUserMenuOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors text-left font-medium"
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
            className={`p-1 rounded-[3px] transition-colors ${
              isDark ? 'text-gray-400 hover:text-gray-200 hover:bg-[#1f1f2c]' : 'text-[#6B7280] hover:text-[#181326] hover:bg-[#F3F0F9]'
            }`}
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
            style={
              activeNav === 'all' && !selectedFolder && !selectedTag
                ? {
                    backgroundColor: 'var(--accent-bg, rgba(168, 85, 247, 0.15))',
                    color: 'var(--accent-text, #c084fc)',
                    borderLeftColor: 'var(--accent, #a855f7)'
                  }
                : undefined
            }
            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-[3px] transition-colors ${
              activeNav === 'all' && !selectedFolder && !selectedTag
                ? 'border-l-2 font-medium'
                : isDark
                  ? 'text-gray-300 hover:text-gray-100 hover:bg-[#1a1a24]'
                  : 'text-[#4B5563] hover:text-[#111827] hover:bg-[#F4F2FA]'
            }`}
            title="All Notes"
          >
            <div className="flex items-center gap-2.5">
              <FileText
                className="w-4 h-4"
                style={
                  activeNav === 'all' && !selectedFolder && !selectedTag
                    ? { color: 'var(--accent, #a855f7)' }
                    : undefined
                }
              />
              {!isCollapsed && <span>All Notes</span>}
            </div>
            {!isCollapsed && stats.totalNotes !== undefined && (
              <span className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-[#9CA3AF]'}`}>{stats.totalNotes}</span>
            )}
          </button>

          <button
            onClick={() => {
              onSelectNav('favorites');
              onSelectFolder?.(null);
              onSelectTag?.(null);
            }}
            style={
              activeNav === 'favorites'
                ? {
                    backgroundColor: 'var(--accent-bg, rgba(168, 85, 247, 0.15))',
                    color: 'var(--accent-text, #c084fc)',
                    borderLeftColor: 'var(--accent, #a855f7)'
                  }
                : undefined
            }
            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-[3px] transition-colors ${
              activeNav === 'favorites'
                ? 'border-l-2 font-medium'
                : isDark
                  ? 'text-gray-300 hover:text-gray-100 hover:bg-[#1a1a24]'
                  : 'text-[#4B5563] hover:text-[#111827] hover:bg-[#F4F2FA]'
            }`}
            title="Favorites"
          >
            <div className="flex items-center gap-2.5">
              <Star
                className="w-4 h-4"
                style={
                  activeNav === 'favorites'
                    ? { color: 'var(--accent, #a855f7)' }
                    : undefined
                }
              />
              {!isCollapsed && <span>Favorites</span>}
            </div>
            {!isCollapsed && stats.favorites !== undefined && (
              <span className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-[#9CA3AF]'}`}>{stats.favorites}</span>
            )}
          </button>

          <button
            onClick={() => {
              onSelectNav('drawing');
              onSelectFolder?.(null);
              onSelectTag?.(null);
            }}
            style={
              activeNav === 'drawing'
                ? {
                    backgroundColor: 'var(--accent-bg, rgba(168, 85, 247, 0.15))',
                    color: 'var(--accent-text, #c084fc)',
                    borderLeftColor: 'var(--accent, #a855f7)'
                  }
                : undefined
            }
            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-[3px] transition-colors ${
              activeNav === 'drawing'
                ? 'border-l-2 font-medium'
                : isDark
                  ? 'text-gray-300 hover:text-gray-100 hover:bg-[#1a1a24]'
                  : 'text-[#4B5563] hover:text-[#111827] hover:bg-[#F4F2FA]'
            }`}
            title="Scribble / Drawing Workspace"
          >
            <div className="flex items-center gap-2.5">
              <PenTool
                className="w-4 h-4"
                style={
                  activeNav === 'drawing'
                    ? { color: 'var(--accent, #a855f7)' }
                    : undefined
                }
              />
              {!isCollapsed && <span>Drawing Canvas</span>}
            </div>
            {!isCollapsed && (
              <span className={`text-[9px] font-mono px-1 rounded ${
                isDark ? 'bg-purple-950/60 text-purple-300' : 'bg-purple-100 text-purple-700'
              }`}>
                New
              </span>
            )}
          </button>
        </div>

        {/* Folders Section */}
        {!isCollapsed && (
          <div className={`pt-2 border-t ${isDark ? 'border-[#1e1e2c]' : 'border-[#EAE6F4]'}`}>
            {/* Folders Header */}
            <div
              onClick={() => setFoldersOpen(!foldersOpen)}
              className={`flex items-center justify-between px-2.5 py-1 cursor-pointer text-[11px] font-medium uppercase tracking-wider ${
                isDark ? 'text-gray-400 hover:text-gray-200' : 'text-[#6B7280] hover:text-[#181326]'
              }`}
            >
              <div className="flex items-center gap-2">
                <Folder className="w-3.5 h-3.5 text-purple-500" />
                <span>Folders</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsCreatingFolder(!isCreatingFolder);
                  }}
                  className={`p-1 rounded transition-colors ${
                    isDark ? 'hover:bg-[#252536] text-gray-400 hover:text-purple-300' : 'hover:bg-[#EAE6F4] text-[#6B7280] hover:text-purple-600'
                  }`}
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
                  className={`flex-1 rounded-[3px] px-2 py-1 text-xs focus:outline-none border ${
                    isDark
                      ? 'bg-[#1b1b26] border-purple-500/50 text-gray-200'
                      : 'bg-white border-[#DDD6FE] text-[#181326]'
                  }`}
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
                  className={`p-1 ${isDark ? 'text-gray-400 hover:text-gray-200' : 'text-[#6B7280] hover:text-[#181326]'}`}
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
                            ? isDark
                              ? 'bg-purple-900/30 text-purple-200 font-medium'
                              : 'bg-[#EDE9FE] text-[#7C3AED] font-semibold'
                            : isDark
                              ? 'text-gray-300 hover:text-gray-100 hover:bg-[#1a1a24]'
                              : 'text-[#4B5563] hover:text-[#111827] hover:bg-[#F4F2FA]'
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
                              className={`p-0.5 rounded transition-colors ${
                                isDark ? 'hover:bg-[#252538] text-gray-400 hover:text-gray-200' : 'hover:bg-[#EAE6F4] text-[#6B7280] hover:text-[#181326]'
                              }`}
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
                              <FolderOpen className="w-3.5 h-3.5 shrink-0 text-purple-500" />
                            ) : (
                              <Folder className="w-3.5 h-3.5 shrink-0 text-purple-500" />
                            )}
                            <span className="truncate">{folder.name}</span>
                          </button>
                        </div>

                        {/* Action buttons / count / confirm delete */}
                        {confirmDeleteId === folderId ? (
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className={`flex items-center gap-1 border rounded px-1.5 py-0.5 text-[10px] shrink-0 ${
                              isDark ? 'bg-[#281822] border-red-500/40 text-red-300' : 'bg-red-50 border-red-200 text-red-600'
                            }`}
                          >
                            <span>Delete?</span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(folder);
                              }}
                              className="text-red-400 hover:text-red-200 font-bold px-1 cursor-pointer"
                              title="Confirm delete"
                            >
                              Yes
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setConfirmDeleteId(null);
                              }}
                              className="text-gray-400 hover:text-gray-200 px-0.5 cursor-pointer"
                              title="Cancel"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 shrink-0">
                            {/* Note count (visible when not hovering and not selected) */}
                            <span className={`text-[10px] ${isSelected ? 'hidden' : 'group-hover:hidden'} ${isDark ? 'text-gray-500' : 'text-[#9CA3AF]'}`}>
                              {noteCount}
                            </span>

                            {/* Actions: Add subfolder (+) & Delete folder (🗑) - visible on hover or when selected */}
                            <div className={`${isSelected ? 'flex' : 'hidden group-hover:flex'} items-center gap-0.5`}>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveAddSubfolderParentId(folderId);
                                  setNewSubfolderName('');
                                  setExpandedFolders((prev) => ({ ...prev, [folderId]: true }));
                                }}
                                className={`p-1 rounded transition-colors ${
                                  isDark ? 'hover:bg-[#252538] text-gray-400 hover:text-purple-300' : 'hover:bg-[#EAE6F4] text-[#6B7280] hover:text-purple-600'
                                }`}
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
                                className={`p-1 rounded transition-colors ${
                                  isDark ? 'hover:bg-red-950/60 text-gray-400 hover:text-red-400' : 'hover:bg-red-50 text-[#6B7280] hover:text-red-600'
                                }`}
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
                          className={`flex items-center gap-1.5 py-1 px-2 my-0.5 ml-6 border rounded-[3px] ${
                            isDark ? 'bg-[#1b1b28] border-purple-500/50' : 'bg-white border-[#DDD6FE]'
                          }`}
                        >
                          <Folder className="w-3 h-3 text-purple-500 shrink-0" />
                          <input
                            type="text"
                            autoFocus
                            value={newSubfolderName}
                            onChange={(e) => setNewSubfolderName(e.target.value)}
                            placeholder="Subfolder name..."
                            className={`flex-1 bg-transparent text-xs outline-none ${
                              isDark ? 'text-gray-200 placeholder-gray-500' : 'text-[#181326] placeholder-[#9CA3AF]'
                            }`}
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
                            className={`p-0.5 ${isDark ? 'text-gray-400 hover:text-gray-200' : 'text-[#6B7280] hover:text-[#181326]'}`}
                            title="Cancel"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </form>
                      )}

                      {/* Subfolders List (Indented Tree) */}
                      {hasSubfolders && expanded && (
                        <div className={`ml-5 pl-2.5 border-l space-y-0.5 ${isDark ? 'border-[#242436]' : 'border-[#EAE6F4]'}`}>
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
                                      ? isDark
                                        ? 'bg-purple-900/30 text-purple-200 font-medium'
                                        : 'bg-[#EDE9FE] text-[#7C3AED] font-semibold'
                                      : isDark
                                        ? 'text-gray-400 hover:text-gray-200 hover:bg-[#1a1a24]'
                                        : 'text-[#6B7280] hover:text-[#181326] hover:bg-[#F4F2FA]'
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
                                        isSubSelected ? 'bg-purple-500' : 'bg-purple-400/50'
                                      }`}
                                    />
                                    <span className="truncate text-[11px]">{sub.name}</span>
                                  </button>

                                  {/* Subfolder Actions / Delete Confirm */}
                                  {confirmDeleteId === subId ? (
                                    <div
                                      onClick={(e) => e.stopPropagation()}
                                      className={`flex items-center gap-1 border rounded px-1.5 py-0.5 text-[10px] shrink-0 ${
                                        isDark ? 'bg-[#281822] border-red-500/40 text-red-300' : 'bg-red-50 border-red-200 text-red-600'
                                      }`}
                                    >
                                      <span>Delete?</span>
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleDelete(sub);
                                        }}
                                        className="text-red-400 hover:text-red-200 font-bold px-1 cursor-pointer"
                                        title="Delete this subfolder"
                                      >
                                        Yes
                                      </button>
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setConfirmDeleteId(null);
                                        }}
                                        className="text-gray-400 hover:text-gray-200 px-0.5 cursor-pointer"
                                        title="Cancel"
                                      >
                                        No
                                      </button>
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-1 shrink-0">
                                      {/* Subfolder note count */}
                                      <span className={`text-[10px] ${isSubSelected ? 'hidden' : 'group-hover:hidden'} ${isDark ? 'text-gray-500' : 'text-[#9CA3AF]'}`}>
                                        {subCount}
                                      </span>

                                      {/* Actions: Add nested (+) & Delete Subfolder (🗑) - visible on hover or when selected */}
                                      <div className={`${isSubSelected ? 'flex' : 'hidden group-hover:flex'} items-center gap-0.5`}>
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setActiveAddSubfolderParentId(subId);
                                            setNewSubfolderName('');
                                          }}
                                          className={`p-1 rounded transition-colors ${
                                            isDark ? 'hover:bg-[#252538] text-gray-400 hover:text-purple-300' : 'hover:bg-[#EAE6F4] text-[#6B7280] hover:text-purple-600'
                                          }`}
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
                                          className={`p-1 rounded transition-colors ${
                                            isDark ? 'hover:bg-red-950/60 text-gray-400 hover:text-red-400' : 'hover:bg-red-50 text-[#6B7280] hover:text-red-600'
                                          }`}
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
                                    className={`flex items-center gap-1.5 py-1 px-2 my-0.5 ml-4 border rounded-[3px] ${
                                      isDark ? 'bg-[#1b1b28] border-purple-500/50' : 'bg-white border-[#DDD6FE]'
                                    }`}
                                  >
                                    <Folder className="w-3 h-3 text-purple-500 shrink-0" />
                                    <input
                                      type="text"
                                      autoFocus
                                      value={newSubfolderName}
                                      onChange={(e) => setNewSubfolderName(e.target.value)}
                                      placeholder="Nested folder name..."
                                      className={`flex-1 bg-transparent text-xs outline-none ${
                                        isDark ? 'text-gray-200 placeholder-gray-500' : 'text-[#181326] placeholder-[#9CA3AF]'
                                      }`}
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
                                      className={`p-0.5 ${isDark ? 'text-gray-400 hover:text-gray-200' : 'text-[#6B7280] hover:text-[#181326]'}`}
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
          <div className={`pt-2 border-t ${isDark ? 'border-[#1e1e2c]' : 'border-[#EAE6F4]'}`}>
            <div
              onClick={() => setTagsOpen(!tagsOpen)}
              className={`flex items-center justify-between px-2.5 py-1 cursor-pointer text-[11px] font-medium uppercase tracking-wider ${
                isDark ? 'text-gray-400 hover:text-gray-200' : 'text-[#6B7280] hover:text-[#181326]'
              }`}
            >
              <div className="flex items-center gap-2">
                <Tag className="w-3.5 h-3.5 text-purple-500" />
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
                          ? isDark
                            ? 'bg-purple-600/30 text-purple-200 border border-purple-500/40'
                            : 'bg-[#EDE9FE] text-[#7C3AED] border border-[#DDD6FE] font-semibold'
                          : isDark
                            ? 'bg-[#1b1b26] text-gray-400 hover:text-gray-200 border border-[#252536] hover:border-gray-600'
                            : 'bg-white text-[#6B7280] hover:text-[#181326] border border-[#E2DEEE] hover:border-[#DDD6FE]'
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
        <div className={`pt-2 border-t ${isDark ? 'border-[#1e1e2c]' : 'border-[#EAE6F4]'}`}>
          <button
            onClick={() => {
              onSelectNav('trash');
              onSelectFolder?.(null);
              onSelectTag?.(null);
            }}
            style={
              activeNav === 'trash'
                ? {
                    backgroundColor: 'var(--accent-bg, rgba(168, 85, 247, 0.15))',
                    color: 'var(--accent-text, #c084fc)',
                    borderLeftColor: 'var(--accent, #a855f7)'
                  }
                : undefined
            }
            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-[3px] transition-colors ${
              activeNav === 'trash'
                ? 'border-l-2 font-medium'
                : isDark
                  ? 'text-gray-400 hover:text-gray-200 hover:bg-[#1a1a24]'
                  : 'text-[#6B7280] hover:text-[#181326] hover:bg-[#F4F2FA]'
            }`}
            title="Trash"
          >
            <div className="flex items-center gap-2.5">
              <Trash2
                className="w-4 h-4"
                style={activeNav === 'trash' ? { color: 'var(--accent, #a855f7)' } : undefined}
              />
              {!isCollapsed && <span>Trash</span>}
            </div>
            {!isCollapsed && stats.trash !== undefined && (
              <span className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-[#9CA3AF]'}`}>{stats.trash}</span>
            )}
          </button>
        </div>
      </div>

      {/* Bottom Storage & Footer */}
      <div className={`p-3 border-t space-y-3 ${
        isDark ? 'border-[#222230] bg-[#111118]' : 'border-[#EAE6F4] bg-[#FAF8FD]'
      }`}>
        {/* Storage Widget matching reference */}
        {!isCollapsed && (
          <div className={`rounded-[4px] p-2.5 space-y-2 border ${
            isDark ? 'bg-[#171722] border-[#242436]' : 'bg-[#F7F5FC] border-[#EAE6F3]'
          }`}>
            <div className="flex items-center justify-between">
              <div className={`flex items-center gap-1.5 font-medium text-[11px] ${
                isDark ? 'text-gray-300' : 'text-[#374151]'
              }`}>
                <Cloud className="w-3.5 h-3.5" style={{ color: 'var(--accent, #a855f7)' }} />
                <span>Storage</span>
              </div>
              <span className="text-[11px] font-medium" style={{ color: 'var(--accent-text, #c084fc)' }}>12%</span>
            </div>
            <div className={`text-[10px] ${isDark ? 'text-gray-400' : 'text-[#6B7280]'}`}>245 MB of 2 GB used</div>
            <div className={`w-full h-1.5 rounded-full overflow-hidden ${
              isDark ? 'bg-[#252536]' : 'bg-[#E5E1F0]'
            }`}>
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: '12%',
                  backgroundColor: 'var(--accent, #a855f7)'
                }}
              />
            </div>
          </div>
        )}

        {/* Action icons */}
        <div className={`flex items-center justify-between pt-1 ${
          isDark ? 'text-gray-400' : 'text-[#6B7280]'
        }`}>
          <button
            onClick={() => {
              if (onOpenSettings) onOpenSettings();
              onSelectNav?.('settings');
              onSelectFolder?.(null);
              onSelectTag?.(null);
            }}
            style={
              activeNav === 'settings'
                ? {
                    backgroundColor: 'var(--accent-bg, rgba(168, 85, 247, 0.15))',
                    color: 'var(--accent-text, #c084fc)',
                    borderColor: 'var(--accent-border, rgba(168, 85, 247, 0.4))'
                  }
                : undefined
            }
            className={`p-1.5 px-2.5 rounded-lg flex items-center gap-2 transition-all ${
              activeNav === 'settings'
                ? 'font-medium shadow-sm border'
                : isDark
                  ? 'text-gray-400 hover:text-gray-200 hover:bg-[#1c1c28]'
                  : 'text-[#6B7280] hover:text-[#181326] hover:bg-[#F4F2FA]'
            }`}
            title="Settings"
          >
            <Settings
              className="w-4 h-4"
              style={activeNav === 'settings' ? { color: 'var(--accent, #a855f7)' } : undefined}
            />
            {!isCollapsed && <span>Settings</span>}
          </button>

          <div className="flex items-center gap-1">
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-1.5 transition-colors"
              title="Log Out"
            >
              <LogOut className="w-4 h-4 text-red-500" />
              {!isCollapsed && <span className="hover:text-red-600">Logout</span>}
            </button>

            {!isCollapsed && (
              <button
                onClick={() => alert('NoteNest Help & Shortcuts: Cmd+K for search, Cmd+S to save')}
                className={`p-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                  isDark ? 'hover:text-gray-200 hover:bg-[#1c1c28]' : 'hover:text-[#181326] hover:bg-[#F4F2FA]'
                }`}
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

