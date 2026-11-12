import React, { useState, useEffect, useMemo, useRef } from 'react';
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
  PenTool,
  Book,
  BookOpen,
  Code,
  Lightbulb,
  GraduationCap,
  Briefcase,
  Heart,
  Compass,
  Bookmark,
  MoreVertical,
  Edit2,
  Palette,
  GripVertical
} from 'lucide-react';

const NOTEBOOK_ICONS_MAP = {
  book: Book,
  'book-open': BookOpen,
  code: Code,
  lightbulb: Lightbulb,
  'graduation-cap': GraduationCap,
  briefcase: Briefcase,
  heart: Heart,
  compass: Compass,
  bookmark: Bookmark
};

const NOTEBOOK_COLOR_MAP = {
  pink: '#ec4899',
  purple: '#a855f7',
  blue: '#3b82f6',
  emerald: '#10b981',
  amber: '#f59e0b',
  rose: '#f43f5e',
  indigo: '#6366f1',
  cyan: '#06b6d4',
  charcoal: '#9ca3af'
};

export const EditorSidebar = ({
  activeNav = 'all',
  onSelectNav,
  selectedNotebookId = null,
  onSelectNotebook,
  notebooks = [],
  onCreateNotebook,
  onEditNotebook,
  onDeleteNotebook,
  onReorderNotebooks,
  onAddSection,
  // Backwards compatibility props
  selectedFolder,
  onSelectFolder,
  selectedTag,
  onSelectTag,
  folders = [],
  notes = [],
  onOpenSettings,
  stats = {},
  isCollapsed = false,
  onToggleCollapse
}) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { isDark } = useTheme();

  const [notebooksOpen, setNotebooksOpen] = useState(true);
  const [activeNotebookMenuId, setActiveNotebookMenuId] = useState(null);
  const [confirmDeleteNbId, setConfirmDeleteNbId] = useState(null);
  const [draggedNbIdx, setDraggedNbIdx] = useState(null);
  const nbMenuRef = useRef(null);

  const [tagsOpen, setTagsOpen] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [avatarLoadFailed, setAvatarLoadFailed] = useState(false);
  const avatarSrc = user?.avatar || user?.avatarUrl;

  useEffect(() => {
    const handleOutside = (e) => {
      if (nbMenuRef.current && !nbMenuRef.current.contains(e.target)) {
        setActiveNotebookMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  useEffect(() => {
    setAvatarLoadFailed(false);
  }, [user?.avatar, user?.avatarUrl]);

  const resolveAvatarUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
      return url;
    }
    return `http://localhost:5001${url.startsWith('/') ? '' : '/'}${url}`;
  };

  const defaultNotebooksList = [
    { _id: 'dsa', id: 'dsa', name: 'DSA', icon: 'code', color: 'purple' },
    { _id: 'personal', id: 'personal', name: 'Personal', icon: 'heart', color: 'pink' },
    { _id: 'college', id: 'college', name: 'College', icon: 'graduation-cap', color: 'blue' },
    { _id: 'projects', id: 'projects', name: 'Projects', icon: 'briefcase', color: 'emerald' }
  ];

  const displayNotebooks = notebooks && notebooks.length > 0 ? notebooks : defaultNotebooksList;

  // Calculate note count for a notebook
  const getNotebookNoteCount = (nb) => {
    if (typeof nb.notesCount === 'number') return nb.notesCount;
    const nbId = nb._id || nb.id;
    const nbName = (nb.name || '').toLowerCase();
    return notes.filter((n) => {
      if (n.isDeleted) return false;
      if (n.notebookId && (n.notebookId === nbId || n.notebookId?._id === nbId)) return true;
      if (n.notebook && n.notebook.toLowerCase() === nbName) return true;
      if (n.category && n.category.toLowerCase() === nbName) return true;
      if (n.folder && n.folder.toLowerCase() === nbName) return true;
      return false;
    }).length;
  };

  const handleNbDragStart = (e, index) => {
    setDraggedNbIdx(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleNbDragOver = (e, index) => {
    e.preventDefault();
    if (draggedNbIdx === null || draggedNbIdx === index) return;
    const updated = [...displayNotebooks];
    const draggedItem = updated[draggedNbIdx];
    updated.splice(draggedNbIdx, 1);
    updated.splice(index, 0, draggedItem);
    setDraggedNbIdx(index);
    onReorderNotebooks?.(updated);
  };

  const handleNbDragEnd = () => {
    setDraggedNbIdx(null);
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

  // Calculate dynamic storage usage from real user notes
  const storageInfo = useMemo(() => {
    let totalBytes = 0;
    if (Array.isArray(notes)) {
      notes.forEach((n) => {
        const titleBytes = n.title ? new Blob([n.title]).size : 0;
        const contentStr = typeof n.content === 'string' ? n.content : JSON.stringify(n.content || '');
        const contentBytes = contentStr ? new Blob([contentStr]).size : 0;
        totalBytes += titleBytes + contentBytes;
      });
    }

    const totalQuotaBytes = 512 * 1024 * 1024; // Real MongoDB Atlas M0 cluster capacity (512 MB)
    let usedFormatted = '0 KB';
    if (totalBytes < 1024 * 1024) {
      usedFormatted = `${Math.max(1, Math.round(totalBytes / 1024))} KB`;
    } else {
      usedFormatted = `${(totalBytes / (1024 * 1024)).toFixed(2)} MB`;
    }

    const rawPct = (totalBytes / totalQuotaBytes) * 100;
    const percentage = rawPct < 0.1 ? '< 1%' : `${rawPct.toFixed(1)}%`;
    const progressWidth = Math.max(3, Math.min(100, Math.round(rawPct)));

    return {
      usedFormatted,
      percentage,
      progressWidth: `${progressWidth}%`,
      totalBytes,
      quotaFormatted: '512 MB'
    };
  }, [notes]);

  const handleLogout = async () => {
    try {
      if (logout) await logout();
    } finally {
      navigate('/');
    }
  };

  const popularTags = ['#go', '#system-design', '#dbms', '#ui-ux', '#projects'];

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
          {avatarSrc && !avatarLoadFailed ? (
            <img
              src={resolveAvatarUrl(avatarSrc)}
              alt={displayName}
              referrerPolicy="no-referrer"
              onError={() => setAvatarLoadFailed(true)}
              className="w-7 h-7 rounded-full object-cover border border-purple-500/50 shadow-sm shadow-purple-900/40 shrink-0"
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#9333ea] to-[#c084fc] text-white text-[11px] font-bold flex items-center justify-center shadow-sm shadow-purple-900/50 border border-purple-400/40 shrink-0">
              {initials}
            </div>
          )}
          {!isCollapsed && (
            <div className="flex items-center gap-1.5 min-w-0">
              <span className={`font-semibold text-sm tracking-tight truncate max-w-[140px] ${isDark ? 'text-gray-100' : 'text-[#181326]'}`}>
                {displayName}
              </span>
              <ChevronDown className={`w-3.5 h-3.5 shrink-0 transition-transform duration-150 ${
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
              <div className={`px-3 py-2.5 border-b flex items-center gap-2.5 ${isDark ? 'border-[#242436]' : 'border-[#EAE6F4]'}`}>
                {avatarSrc && !avatarLoadFailed ? (
                  <img
                    src={resolveAvatarUrl(avatarSrc)}
                    alt={displayName}
                    referrerPolicy="no-referrer"
                    className="w-8 h-8 rounded-full object-cover border border-purple-500/50 shadow-sm shrink-0"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#9333ea] to-[#c084fc] text-white text-xs font-bold flex items-center justify-center shadow-sm shrink-0">
                    {initials}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className={`font-semibold truncate ${isDark ? 'text-gray-100' : 'text-[#181326]'}`}>{displayName}</div>
                  <div className={`text-[11px] truncate ${isDark ? 'text-gray-400' : 'text-[#6B7280]'}`}>{user?.email || 'Logged in'}</div>
                </div>
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
              <span className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-[#9CA3AF]'}`}>
                {notes.filter((n) => !n.isDeleted && ((n.drawings && n.drawings.length > 0) || (n.tags && n.tags.includes('sketch')))).length}
              </span>
            )}
          </button>
        </div>

        {/* Notebooks Section */}
        {!isCollapsed && (
          <div className={`pt-2 border-t ${isDark ? 'border-[#1e1e2c]' : 'border-[#EAE6F4]'}`}>
            {/* Notebooks Header */}
            <div
              onClick={() => setNotebooksOpen(!notebooksOpen)}
              className={`flex items-center justify-between px-2.5 py-1 cursor-pointer text-[11px] font-medium uppercase tracking-wider ${
                isDark ? 'text-gray-400 hover:text-gray-200' : 'text-[#6B7280] hover:text-[#181326]'
              }`}
            >
              <div className="flex items-center gap-2">
                <Book className="w-3.5 h-3.5 text-pink-400" />
                <span>Notebooks</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCreateNotebook?.();
                  }}
                  className={`p-1 rounded transition-colors ${
                    isDark ? 'hover:bg-[#252536] text-gray-400 hover:text-pink-300' : 'hover:bg-[#EAE6F4] text-[#6B7280] hover:text-pink-600'
                  }`}
                  title="Create new notebook"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
                {notebooksOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </div>
            </div>

            {/* Notebooks List */}
            {notebooksOpen && (
              <div className="mt-1 space-y-0.5 text-xs">
                {displayNotebooks.map((nb, idx) => {
                  const nbId = nb._id || nb.id;
                  const isSelected = selectedNotebookId === nbId;
                  const noteCount = getNotebookNoteCount(nb);
                  const IconComp = NOTEBOOK_ICONS_MAP[nb.icon] || Book;
                  const colorHex = NOTEBOOK_COLOR_MAP[nb.color] || '#ec4899';
                  const isMenuOpen = activeNotebookMenuId === nbId;
                  const isDeleting = confirmDeleteNbId === nbId;

                  return (
                    <div
                      key={nbId}
                      draggable
                      onDragStart={(e) => handleNbDragStart(e, idx)}
                      onDragOver={(e) => handleNbDragOver(e, idx)}
                      onDragEnd={handleNbDragEnd}
                      className="relative"
                    >
                      <div
                        className={`group relative flex items-center justify-between px-2.5 py-1.5 rounded-[4px] transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-pink-500/10 border-l-2 border-pink-500 text-pink-300 font-medium'
                            : isDark
                              ? 'text-gray-300 hover:text-gray-100 hover:bg-[#1a1a24]'
                              : 'text-[#4B5563] hover:text-[#111827] hover:bg-[#F4F2FA]'
                        }`}
                        onClick={() => onSelectNotebook?.(nb)}
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0 mr-1">
                          <span
                            className="w-4 h-4 rounded flex items-center justify-center shrink-0 transition-colors"
                            style={{ color: colorHex }}
                          >
                            <IconComp className="w-3.5 h-3.5" />
                          </span>
                          <span className="truncate">{nb.name}</span>
                        </div>

                        {/* Note Count & Menu Trigger */}
                        {isDeleting ? (
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-1 border border-red-500/40 bg-red-950/60 text-red-300 rounded px-1.5 py-0.5 text-[10px] shrink-0"
                          >
                            <span>Delete?</span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteNotebook?.(nbId);
                                setConfirmDeleteNbId(null);
                              }}
                              className="text-red-400 hover:text-red-200 font-bold px-0.5 cursor-pointer"
                            >
                              Yes
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setConfirmDeleteNbId(null);
                              }}
                              className="text-gray-400 hover:text-gray-200 px-0.5 cursor-pointer"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 shrink-0">
                            <span
                              className={`text-[10px] ${
                                isSelected ? 'text-pink-400 font-medium' : isDark ? 'text-gray-500' : 'text-[#9CA3AF]'
                              } group-hover:hidden`}
                            >
                              {noteCount}
                            </span>

                            <div className="hidden group-hover:flex items-center gap-0.5">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveNotebookMenuId(isMenuOpen ? null : nbId);
                                }}
                                className={`p-1 rounded transition-colors ${
                                  isDark
                                    ? 'hover:bg-[#252538] text-gray-400 hover:text-gray-200'
                                    : 'hover:bg-[#EAE6F4] text-[#6B7280] hover:text-[#181326]'
                                }`}
                                title="Notebook options"
                              >
                                <MoreVertical className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Dropdown Menu */}
                      {isMenuOpen && (
                        <div
                          ref={nbMenuRef}
                          onClick={(e) => e.stopPropagation()}
                          className={`absolute top-full right-2 mt-1 py-1 w-40 rounded-xl border shadow-xl z-50 text-xs backdrop-blur-md animate-in fade-in zoom-in-95 ${
                            isDark ? 'bg-[#181826] border-[#2b2b3e] text-gray-200' : 'bg-white border-slate-200 text-slate-800'
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => {
                              setActiveNotebookMenuId(null);
                              onEditNotebook?.(nb);
                            }}
                            className={`w-full flex items-center gap-2 px-3 py-1.5 text-left transition-colors cursor-pointer ${
                              isDark ? 'hover:bg-white/10' : 'hover:bg-slate-100'
                            }`}
                          >
                            <Edit2 className="w-3.5 h-3.5 text-purple-400" />
                            <span>Rename</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setActiveNotebookMenuId(null);
                              onEditNotebook?.(nb);
                            }}
                            className={`w-full flex items-center gap-2 px-3 py-1.5 text-left transition-colors cursor-pointer ${
                              isDark ? 'hover:bg-white/10' : 'hover:bg-slate-100'
                            }`}
                          >
                            <Palette className="w-3.5 h-3.5 text-pink-400" />
                            <span>Appearance</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setActiveNotebookMenuId(null);
                              onAddSection?.(nb);
                            }}
                            className={`w-full flex items-center gap-2 px-3 py-1.5 text-left transition-colors cursor-pointer ${
                              isDark ? 'hover:bg-white/10' : 'hover:bg-slate-100'
                            }`}
                          >
                            <Plus className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Add Section</span>
                          </button>

                          <div className={`h-[1px] my-1 ${isDark ? 'bg-white/10' : 'bg-slate-100'}`} />

                          <button
                            type="button"
                            onClick={() => {
                              setActiveNotebookMenuId(null);
                              setConfirmDeleteNbId(nbId);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-1.5 text-left text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
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
          <div
            onClick={() => onOpenSettings?.()}
            title="Click to view Storage and Sync Settings"
            className={`cursor-pointer rounded-[4px] p-2.5 space-y-2 border transition-colors ${
              isDark ? 'bg-[#171722] border-[#242436] hover:border-[#383a52]' : 'bg-[#F7F5FC] border-[#EAE6F3] hover:border-[#D1C9E8]'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className={`flex items-center gap-1.5 font-medium text-[11px] ${
                isDark ? 'text-gray-300' : 'text-[#374151]'
              }`}>
                <Cloud className="w-3.5 h-3.5" style={{ color: 'var(--accent, #a855f7)' }} />
                <span>Storage</span>
              </div>
              <span className="text-[11px] font-medium" style={{ color: 'var(--accent-text, #c084fc)' }}>
                {storageInfo.percentage}
              </span>
            </div>
            <div className={`text-[10px] ${isDark ? 'text-gray-400' : 'text-[#6B7280]'}`}>
              {storageInfo.usedFormatted} of 512 MB used
            </div>
            <div className={`w-full h-1.5 rounded-full overflow-hidden ${
              isDark ? 'bg-[#252536]' : 'bg-[#E5E1F0]'
            }`}>
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: storageInfo.progressWidth,
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

