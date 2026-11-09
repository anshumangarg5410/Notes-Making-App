import React, { useState } from 'react';
import { MoreVertical, Clock } from 'lucide-react';
import { FolderColorIcon } from './FolderColorIcon';
import { FolderContextMenu } from './FolderContextMenu';

export const FolderCard = ({
  folder,
  isSelected,
  onSelect,
  onOpen,
  onRename,
  onMove,
  onAddSubfolder,
  onDelete
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const formatRelativeTime = (dateStr) => {
    if (!dateStr) return '2 hr ago';
    const date = new Date(dateStr);
    const now = new Date();
    const diffSecs = Math.floor((now - date) / 1000);

    if (diffSecs < 60) return 'Just now';
    if (diffSecs < 3600) return `${Math.floor(diffSecs / 60)} min ago`;
    if (diffSecs < 86400) return `${Math.floor(diffSecs / 3600)} hr ago`;
    if (diffSecs < 172800) return 'yesterday';
    if (diffSecs < 604800) return `${Math.floor(diffSecs / 86400)} days ago`;
    return `${Math.floor(diffSecs / 604800)} week ago`;
  };

  const noteCount = folder.noteCount ?? folder.count ?? 0;
  const subfolderCount = folder.subfolderCount ?? (folder.subfolders ? folder.subfolders.length : 0);

  return (
    <div
      onClick={() => onSelect(folder)}
      className={`group relative p-3.5 rounded-[5px] border cursor-pointer select-none transition-all duration-150 ${
        isSelected
          ? 'bg-gradient-to-br from-[#1c1c2b] to-[#151522] border-purple-500/80 shadow-md shadow-purple-950/50 ring-1 ring-purple-500/30'
          : 'bg-[#15151f] hover:bg-[#181824] border-[#242436] hover:border-gray-600/60'
      }`}
    >
      <div className="flex items-start justify-between">
        <FolderColorIcon name={folder.name} color={folder.color} size="md" />

        <div className="relative">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(!menuOpen);
            }}
            className="p-1 rounded text-gray-400 hover:text-white hover:bg-[#202030] transition-colors"
            title="Options"
          >
            <MoreVertical className="w-3.5 h-3.5" />
          </button>

          <FolderContextMenu
            folder={folder}
            isOpen={menuOpen}
            onClose={() => setMenuOpen(false)}
            onOpen={onOpen}
            onRename={onRename}
            onMove={onMove}
            onAddSubfolder={onAddSubfolder}
            onDelete={onDelete}
          />
        </div>
      </div>

      <div className="mt-3">
        <h3
          className={`text-xs font-semibold truncate ${
            isSelected ? 'text-white' : 'text-gray-200 group-hover:text-white'
          }`}
        >
          {folder.name}
        </h3>

        <div className="text-[11px] text-gray-400 mt-0.5 truncate">
          {noteCount} {noteCount === 1 ? 'note' : 'notes'}
          {subfolderCount > 0 && ` • ${subfolderCount} ${subfolderCount === 1 ? 'subfolder' : 'subfolders'}`}
        </div>

        <div className="flex items-center gap-1.5 text-[10px] text-gray-500 mt-2.5">
          <Clock className="w-3 h-3 text-gray-500" />
          <span>Modified {formatRelativeTime(folder.updatedAt)}</span>
        </div>
      </div>
    </div>
  );
};

