import React, { useState, useEffect } from 'react';
import {
  Bookmark,
  FileText,
  Code,
  CheckSquare,
  List,
  Hash,
  Tag,
  Star,
  Folder,
  X
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const SECTION_ICONS = [
  { id: 'bookmark', label: 'Bookmark', component: Bookmark },
  { id: 'file-text', label: 'Notes', component: FileText },
  { id: 'code', label: 'Code', component: Code },
  { id: 'check-square', label: 'Tasks', component: CheckSquare },
  { id: 'list', label: 'List', component: List },
  { id: 'hash', label: 'Topic', component: Hash },
  { id: 'tag', label: 'Category', component: Tag },
  { id: 'star', label: 'Important', component: Star },
  { id: 'folder', label: 'Folder', component: Folder }
];

export const SectionModal = ({
  isOpen,
  onClose,
  onSubmit,
  notebookName = '',
  initialData = null,
  isEdit = false
}) => {
  const { isDark } = useTheme();
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('bookmark');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setIcon(initialData.icon || 'bookmark');
    } else {
      setName('');
      setIcon('bookmark');
    }
    setError('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide a section name');
      return;
    }

    setIsSubmitting(true);
    setError('');
    try {
      await onSubmit({
        name: name.trim(),
        icon
      });
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to save section');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className={`w-full max-w-sm rounded-2xl border shadow-2xl overflow-hidden transition-all ${
          isDark
            ? 'bg-[#12121a] border-[#222230] text-gray-100 shadow-purple-950/20'
            : 'bg-white border-[#EAE6F4] text-slate-800 shadow-purple-200/40'
        }`}
      >
        {/* Header */}
        <div
          className={`px-5 py-4 border-b flex items-center justify-between ${
            isDark ? 'border-[#222230] bg-[#161622]' : 'border-[#EAE6F4] bg-[#FAF8FD]'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-pink-500/15 border border-pink-500/30 text-pink-400 flex items-center justify-center">
              <Bookmark className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-sm tracking-tight">
                {isEdit ? 'Rename Section' : 'Add New Section'}
              </h3>
              {notebookName && (
                <p className={`text-[11px] truncate max-w-[200px] ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                  in {notebookName}
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className={`p-1 rounded-lg transition-colors cursor-pointer ${
              isDark ? 'text-gray-400 hover:text-white hover:bg-white/10' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
              {error}
            </div>
          )}

          {/* Section Name */}
          <div>
            <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
              Section Name
            </label>
            <input
              type="text"
              autoFocus
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError('');
              }}
              placeholder="e.g. Data Structures, Semester 1, Journal..."
              className={`w-full px-3 py-2 rounded-xl text-xs focus:outline-none border transition-colors ${
                isDark
                  ? 'bg-[#181824] border-[#29293e] text-white focus:border-pink-500'
                  : 'bg-[#FAF8FD] border-[#DDD6FE] text-[#181326] focus:border-pink-500'
              }`}
            />
          </div>

          {/* Icon Selection */}
          <div>
            <label className={`block text-xs font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
              Icon
            </label>
            <div className="grid grid-cols-5 gap-2">
              {SECTION_ICONS.map((item) => {
                const IconComponent = item.component;
                const isSelected = icon === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setIcon(item.id)}
                    className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                      isSelected
                        ? isDark
                          ? 'bg-pink-500/15 border-pink-500/50 text-pink-300'
                          : 'bg-pink-50 border-pink-400 text-pink-700 shadow-xs'
                        : isDark
                          ? 'border-[#262638] text-gray-400 hover:text-white hover:bg-white/5'
                          : 'border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                    title={item.label}
                  >
                    <IconComponent className="w-4 h-4" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-inherit">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                isDark ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Section'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SectionModal;

