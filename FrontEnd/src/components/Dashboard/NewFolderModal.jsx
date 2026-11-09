import React, { useState } from 'react';
import { FolderPlus, X } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const NewFolderModal = ({ isOpen, onClose, onCreateFolder, existingFolders = [] }) => {
  const [folderName, setFolderName] = useState('');
  const [parentFolder, setParentFolder] = useState('');
  const { success, error: toastError } = useToast();

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!folderName.trim()) {
      toastError('Please enter a folder name.');
      return;
    }

    if (onCreateFolder) {
      onCreateFolder(folderName.trim(), parentFolder);
    }
    success(`Folder "${folderName.trim()}" created successfully!`);
    setFolderName('');
    setParentFolder('');
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-md rounded-3xl p-6 bg-[#1b1429] border border-purple-500/30 text-white shadow-2xl animate-in zoom-in-95 duration-150 select-none">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-purple-500/20 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-900/50 border border-purple-500/30 flex items-center justify-center text-purple-300">
              <FolderPlus className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-base text-white">Create New Folder</h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-purple-200 mb-1.5">
              Folder Name
            </label>
            <input
              type="text"
              required
              autoFocus
              placeholder="e.g. Work Projects, Study Notes..."
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-[#120d1c] border border-purple-500/30 text-white placeholder-purple-300/40 outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400/40"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-purple-200 mb-1.5">
              Parent Folder (Optional)
            </label>
            <select
              value={parentFolder}
              onChange={(e) => setParentFolder(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-[#120d1c] border border-purple-500/30 text-white outline-none focus:border-purple-400"
            >
              <option value="">None (Top Level)</option>
              {existingFolders.map((f) => (
                <option key={f.id || f.name} value={f.name}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-300 hover:bg-white/10 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md hover:from-purple-500 hover:to-indigo-500 transition-all cursor-pointer"
            >
              Create Folder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewFolderModal;

