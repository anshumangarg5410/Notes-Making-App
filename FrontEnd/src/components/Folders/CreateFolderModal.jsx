import React, { useState } from 'react';
import { X, Folder, AlertCircle } from 'lucide-react';

export const CreateFolderModal = ({
  isOpen,
  onClose,
  onCreate,
  existingFolders = [],
  initialParentId = null
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [parentId, setParentId] = useState(initialParentId || '');
  const [color, setColor] = useState('purple');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const colorOptions = [
    { id: 'purple', label: 'Purple', bg: 'bg-purple-500' },
    { id: 'blue', label: 'Blue', bg: 'bg-sky-500' },
    { id: 'green', label: 'Green', bg: 'bg-emerald-500' },
    { id: 'amber', label: 'Amber', bg: 'bg-amber-500' },
    { id: 'rose', label: 'Rose', bg: 'bg-rose-500' },
    { id: 'violet', label: 'Violet', bg: 'bg-violet-500' },
    { id: 'cyan', label: 'Cyan', bg: 'bg-cyan-500' },
    { id: 'indigo', label: 'Indigo', bg: 'bg-indigo-500' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Folder name is required');
      return;
    }

    onCreate({
      name: name.trim(),
      description: description.trim(),
      parentId: parentId || null,
      color
    });

    setName('');
    setDescription('');
    setParentId('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm select-none">
      <div className="w-full max-w-md bg-[#161622] border border-[#2b2b3d] rounded-[5px] shadow-2xl overflow-hidden text-xs text-gray-200">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-[#242436] flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold text-white text-sm">
            <Folder className="w-4 h-4 text-purple-400" />
            <span>Create New Folder</span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded hover:bg-[#202030]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-2 bg-red-950/40 border border-red-500/30 rounded text-red-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-gray-300 font-medium mb-1">
              Folder Name <span className="text-purple-400">*</span>
            </label>
            <input
              type="text"
              autoFocus
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError('');
              }}
              placeholder="e.g. Distributed Systems"
              className="w-full bg-[#1b1b26] border border-[#272738] focus:border-purple-500/60 rounded-[3px] px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-300 font-medium mb-1">
              Parent Folder (Optional)
            </label>
            <select
              value={parentId}
              onChange={(e) => setParentId(e.target.value)}
              className="w-full bg-[#1b1b26] border border-[#272738] focus:border-purple-500/60 rounded-[3px] px-3 py-1.5 text-xs text-white focus:outline-none"
            >
              <option value="">None (Top Level Root)</option>
              {existingFolders.map((f) => (
                <option key={f._id || f.id} value={f._id || f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-300 font-medium mb-1.5">
              Folder Color
            </label>
            <div className="flex items-center gap-2">
              {colorOptions.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setColor(c.id)}
                  className={`w-6 h-6 rounded-[3px] ${c.bg} transition-transform ${
                    color === c.id ? 'ring-2 ring-white scale-110' : 'opacity-70 hover:opacity-100'
                  }`}
                  title={c.label}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-gray-300 font-medium mb-1">
              Description (Optional)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of this folder..."
              className="w-full bg-[#1b1b26] border border-[#272738] focus:border-purple-500/60 rounded-[3px] px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#242436]">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-[3px] text-gray-300 hover:text-white hover:bg-[#202030] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-[3px] bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium shadow-sm shadow-purple-900/40 transition-colors"
            >
              Create Folder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

