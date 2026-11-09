import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  Home,
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
  PanelLeftClose
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
  onOpenSettings,
  stats = {},
  isCollapsed = false,
  onToggleCollapse
}) => {
  const navigate = useNavigate();
  const [foldersOpen, setFoldersOpen] = useState(true);
  const [myNotesOpen, setMyNotesOpen] = useState(true);
  const [projectsOpen, setProjectsOpen] = useState(false);
  const [tagsOpen, setTagsOpen] = useState(true);
  const [newFolderName, setNewFolderName] = useState('');
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);

  const defaultFolders = [
    { id: 'college', name: 'College', count: 18 },
    { id: 'projects', name: 'Projects', count: 12, subfolders: ['NoteNest', 'API Gateway', 'Traffic System'] },
    { id: 'personal', name: 'Personal', count: 6 },
    { id: 'dsa', name: 'DSA', count: 8 }
  ];

  const displayFolders = folders && folders.length > 0 ? folders : defaultFolders;

  const popularTags = ['#go', '#system-design', '#dbms', '#ui-ux', '#projects'];

  const handleCreateFolderSubmit = (e) => {
    e.preventDefault();
    if (newFolderName.trim() && onCreateFolder) {
      onCreateFolder(newFolderName.trim());
      setNewFolderName('');
      setIsCreatingFolder(false);
    }
  };

  return (
    <aside
      className={`h-full bg-[#13131b] border-r border-[#222230] flex flex-col justify-between select-none text-xs transition-all duration-200 ${
        isCollapsed ? 'w-14' : 'w-64 min-w-[240px]'
      }`}
    >
      {/* Top Brand Header */}
      <div className="p-3.5 border-b border-[#222230] flex items-center justify-between">
        <div
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2.5 cursor-pointer hover:opacity-90 transition-opacity"
        >
          <div className="w-7 h-7 rounded-[4px] bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white shadow-sm shadow-purple-900/40">
            <BookOpen className="w-4 h-4" />
          </div>
          {!isCollapsed && (
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-sm text-gray-100 tracking-tight">NoteNest</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </div>
          )}
        </div>

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
            onClick={() => navigate('/dashboard')}
            className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-[3px] text-gray-300 hover:text-gray-100 hover:bg-[#1a1a24] transition-colors"
            title="Dashboard"
          >
            <Home className="w-4 h-4 text-gray-400" />
            {!isCollapsed && <span>Dashboard</span>}
          </button>

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
                  className="p-0.5 hover:bg-[#252536] rounded text-gray-400 hover:text-white"
                  title="Create folder"
                >
                  <Plus className="w-3 h-3" />
                </button>
                {foldersOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </div>
            </div>

            {isCreatingFolder && (
              <form onSubmit={handleCreateFolderSubmit} className="mt-1.5 px-2.5">
                <input
                  type="text"
                  autoFocus
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="Folder name..."
                  className="w-full bg-[#1b1b26] border border-purple-500/50 rounded-[3px] px-2 py-1 text-xs text-gray-200 focus:outline-none"
                />
              </form>
            )}

            {foldersOpen && (
              <div className="mt-1 pl-2 space-y-0.5 text-xs">
                {/* My Notes Root Folder */}
                <div>
                  <button
                    onClick={() => setMyNotesOpen(!myNotesOpen)}
                    className="w-full flex items-center justify-between px-2 py-1 rounded-[3px] text-gray-300 hover:bg-[#1a1a24] text-left"
                  >
                    <div className="flex items-center gap-2">
                      {myNotesOpen ? (
                        <FolderOpen className="w-3.5 h-3.5 text-purple-400" />
                      ) : (
                        <Folder className="w-3.5 h-3.5 text-purple-400" />
                      )}
                      <span>My Notes</span>
                    </div>
                    {myNotesOpen ? (
                      <ChevronDown className="w-3 h-3 text-gray-500" />
                    ) : (
                      <ChevronRight className="w-3 h-3 text-gray-500" />
                    )}
                  </button>

                  {myNotesOpen && (
                    <div className="pl-4 space-y-0.5 mt-0.5 border-l border-[#222232] ml-3.5">
                      {displayFolders.map((folder) => {
                        const isProjects = folder.name?.toLowerCase() === 'projects';
                        const isSelected = selectedFolder === folder.name;
                        return (
                          <div key={folder.id || folder.name}>
                            <button
                              onClick={() => {
                                if (isProjects) setProjectsOpen(!projectsOpen);
                                onSelectFolder(isSelected ? null : folder.name);
                              }}
                              className={`w-full flex items-center justify-between px-2 py-1 rounded-[3px] transition-colors ${
                                isSelected
                                  ? 'bg-purple-900/30 text-purple-200 font-medium'
                                  : 'text-gray-300 hover:text-gray-100 hover:bg-[#1a1a24]'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <Folder className={`w-3.5 h-3.5 ${isSelected ? 'text-purple-400' : 'text-gray-400'}`} />
                                <span>{folder.name}</span>
                              </div>
                              <span className="text-[10px] text-gray-500">{folder.count || 0}</span>
                            </button>

                            {/* Subfolders for Projects */}
                            {isProjects && projectsOpen && folder.subfolders && (
                              <div className="pl-4 space-y-0.5 mt-0.5 border-l border-[#242436] ml-3.5">
                                {folder.subfolders.map((sub) => (
                                  <button
                                    key={sub}
                                    onClick={() => onSelectFolder(sub)}
                                    className={`w-full flex items-center gap-2 px-2 py-0.5 rounded-[2px] text-[11px] ${
                                      selectedFolder === sub ? 'text-purple-300 font-medium' : 'text-gray-400 hover:text-gray-200'
                                    }`}
                                  >
                                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500/50" />
                                    <span>{sub}</span>
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
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
            onClick={onOpenSettings}
            className="p-1.5 rounded-[3px] hover:text-gray-200 hover:bg-[#1c1c28] flex items-center gap-2"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
            {!isCollapsed && <span>Settings</span>}
          </button>

          {!isCollapsed && (
            <button
              onClick={() => alert('NoteNest Help & Shortcuts: Cmd+K for search, Cmd+S to save')}
              className="p-1.5 rounded-[3px] hover:text-gray-200 hover:bg-[#1c1c28] flex items-center gap-2"
              title="Help & Shortcuts"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Help</span>
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
