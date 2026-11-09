import React, { useState, useEffect } from 'react';
import { X, Edit3 } from 'lucide-react';

export const RenameFolderModal = ({
  isOpen,
  folder,
  onClose,
  onRename
}) => {
  const [name, setName] = useState('');

  useEffect(() => {
    if (folder) {
      setName(folder.name || '');
    }
  }, [folder]);

  if (!isOpen || !folder) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onRename(folder._id || folder.id, name.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm select-none">
      <div className="w-full max-w-sm bg-[#161622] border border-[#2b2b3d] rounded-[5px] shadow-2xl overflow-hidden text-xs text-gray-200">
        <div className="px-5 py-3.5 border-b border-[#242436] flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold text-white text-sm">
            <Edit3 className="w-4 h-4 text-purple-400" />
            <span>Rename Folder</span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded hover:bg-[#202030]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-gray-300 font-medium mb-1">New Folder Name</label>
            <input
              type="text"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#1b1b26] border border-[#272738] focus:border-purple-500/60 rounded-[3px] px-3 py-1.5 text-xs text-white focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#242436]">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-[3px] text-gray-300 hover:text-white hover:bg-[#202030]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="px-4 py-1.5 rounded-[3px] bg-purple-600 hover:bg-purple-500 text-white font-medium disabled:opacity-40"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
