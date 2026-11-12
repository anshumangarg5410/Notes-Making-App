import React, { useState, useEffect } from 'react';
import {
  Book,
  BookOpen,
  Code,
  Lightbulb,
  GraduationCap,
  Briefcase,
  Heart,
  Compass,
  Bookmark,
  X,
  Check
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const NOTEBOOK_COLORS = [
  { name: 'pink', label: 'Pink', bg: '#ec4899', class: 'bg-pink-500' },
  { name: 'purple', label: 'Purple', bg: '#a855f7', class: 'bg-purple-500' },
  { name: 'blue', label: 'Blue', bg: '#3b82f6', class: 'bg-blue-500' },
  { name: 'emerald', label: 'Emerald', bg: '#10b981', class: 'bg-emerald-500' },
  { name: 'amber', label: 'Amber', bg: '#f59e0b', class: 'bg-amber-500' },
  { name: 'rose', label: 'Rose', bg: '#f43f5e', class: 'bg-rose-500' },
  { name: 'indigo', label: 'Indigo', bg: '#6366f1', class: 'bg-indigo-500' },
  { name: 'cyan', label: 'Cyan', bg: '#06b6d4', class: 'bg-cyan-500' },
  { name: 'charcoal', label: 'Charcoal', bg: '#4b5563', class: 'bg-gray-600' }
];

export const NOTEBOOK_ICONS = [
  { id: 'book', label: 'Notebook', component: Book },
  { id: 'book-open', label: 'Journal', component: BookOpen },
  { id: 'code', label: 'Tech / DSA', component: Code },
  { id: 'lightbulb', label: 'Ideas', component: Lightbulb },
  { id: 'graduation-cap', label: 'College / School', component: GraduationCap },
  { id: 'briefcase', label: 'Projects / Work', component: Briefcase },
  { id: 'heart', label: 'Personal', component: Heart },
  { id: 'compass', label: 'Roadmap', component: Compass },
  { id: 'bookmark', label: 'General', component: Bookmark }
];

export const NotebookModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  isEdit = false
}) => {
  const { isDark } = useTheme();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('pink');
  const [icon, setIcon] = useState('book');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setDescription(initialData.description || '');
      setColor(initialData.color || 'pink');
      setIcon(initialData.icon || 'book');
    } else {
      setName('');
      setDescription('');
      setColor('pink');
      setIcon('book');
    }
    setError('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide a notebook name');
      return;
    }

    setIsSubmitting(true);
    setError('');
    try {
      await onSubmit({
        name: name.trim(),
        description: description.trim(),
        color,
        icon
      });
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to save notebook');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className={`w-full max-w-md rounded-2xl border shadow-2xl overflow-hidden transition-all ${
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
              <Book className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-sm tracking-tight">
              {isEdit ? 'Notebook Settings' : 'Create New Notebook'}
            </h3>
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

          {/* Notebook Name */}
          <div>
            <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
              Notebook Name
            </label>
            <input
              type="text"
              autoFocus
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError('');
              }}
              placeholder="e.g. DSA, Personal, Projects..."
              className={`w-full px-3 py-2 rounded-xl text-xs focus:outline-none border transition-colors ${
                isDark
                  ? 'bg-[#181824] border-[#29293e] text-white focus:border-pink-500'
                  : 'bg-[#FAF8FD] border-[#DDD6FE] text-[#181326] focus:border-pink-500'
              }`}
            />
          </div>

          {/* Description */}
          <div>
            <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
              Description (Optional)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of this notebook..."
              className={`w-full px-3 py-2 rounded-xl text-xs focus:outline-none border transition-colors ${
                isDark
                  ? 'bg-[#181824] border-[#29293e] text-white focus:border-pink-500'
                  : 'bg-[#FAF8FD] border-[#DDD6FE] text-[#181326] focus:border-pink-500'
              }`}
            />
          </div>

          {/* Color Selection */}
          <div>
            <label className={`block text-xs font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
              Accent Color
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {NOTEBOOK_COLORS.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => setColor(c.name)}
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-transform hover:scale-110 cursor-pointer ${c.class} ${
                    color === c.name ? 'ring-2 ring-offset-2 ring-pink-400 scale-110' : 'opacity-85 hover:opacity-100'
                  }`}
                  style={{
                    ringOffsetColor: isDark ? '#12121a' : '#ffffff'
                  }}
                  title={c.label}
                >
                  {color === c.name && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                </button>
              ))}
            </div>
          </div>

          {/* Icon Selection */}
          <div>
            <label className={`block text-xs font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
              Icon
            </label>
            <div className="grid grid-cols-5 gap-2">
              {NOTEBOOK_ICONS.map((item) => {
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
              {isSubmitting ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Notebook'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NotebookModal;
