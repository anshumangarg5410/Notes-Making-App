import React, { useRef, useEffect } from 'react';
import { RotateCcw, Trash2 } from 'lucide-react';

export const TrashContextMenu = ({
  item,
  isOpen,
  onClose,
  onRestore,
  onDeletePermanently
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

  if (!isOpen || !item) return null;

  return (
    <div
      ref={menuRef}
      className="absolute right-2 top-8 w-44 bg-[#1a1a26] border border-[#2b2b3d] rounded-[4px] shadow-2xl py-1 z-30 select-none text-xs text-gray-200"
    >
      <button
        onClick={() => {
          onClose();
          onRestore(item);
        }}
        className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-[#252538] text-left text-gray-200 hover:text-white"
      >
        <RotateCcw className="w-3.5 h-3.5 text-purple-400" />
        <span>Restore</span>
      </button>

      <div className="my-1 border-t border-[#252538]" />

      <button
        onClick={() => {
          onClose();
          onDeletePermanently(item);
        }}
        className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-red-950/40 text-red-400 text-left"
      >
        <Trash2 className="w-3.5 h-3.5 text-red-400" />
        <span>Delete Permanently</span>
      </button>
    </div>
  );
};
