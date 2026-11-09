import React, { useRef, useEffect } from 'react';
import { ExternalLink, Edit3, FolderInput, FolderPlus, Trash2 } from 'lucide-react';

export const FolderContextMenu = ({
  folder,
  isOpen,
  onClose,
  onOpen,
  onRename,
  onMove,
  onAddSubfolder,
  onDelete
}) => {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className="absolute right-2 top-8 w-44 bg-[#1a1a26] border border-[#2b2b3d] rounded-[4px] shadow-2xl py-1 z-30 select-none text-xs text-gray-200"
    >
      <button
        onClick={() => {
          onClose();
          onOpen?.(folder);
        }}
        className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-[#252538] text-left"
      >
        <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
        <span>Open</span>
      </button>

      <button
        onClick={() => {
          onClose();
          onRename?.(folder);
        }}
        className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-[#252538] text-left"
      >
        <Edit3 className="w-3.5 h-3.5 text-gray-400" />
        <span>Rename</span>
      </button>

      <button
        onClick={() => {
          onClose();
          onMove?.(folder);
        }}
        className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-[#252538] text-left"
      >
        <FolderInput className="w-3.5 h-3.5 text-gray-400" />
        <span>Move</span>
      </button>

      <button
        onClick={() => {
          onClose();
          onAddSubfolder?.(folder);
        }}
        className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-[#252538] text-left"
      >
        <FolderPlus className="w-3.5 h-3.5 text-gray-400" />
        <span>Add Subfolder</span>
      </button>

      <div className="my-1 border-t border-[#252538]" />

      <button
        onClick={() => {
          onClose();
          onDelete?.(folder);
        }}
        className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-red-950/40 text-red-400 text-left"
      >
        <Trash2 className="w-3.5 h-3.5 text-red-400" />
        <span>Delete</span>
      </button>
    </div>
  );
};

