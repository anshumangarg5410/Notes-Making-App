import React from 'react';
import { X, Check } from 'lucide-react';

export const FilterModal = ({
  isOpen,
  onClose,
  filterTag,
  onSelectTag,
  filterColor,
  onSelectColor,
  sortBy,
  onSelectSort,
  onResetFilters
}) => {
  if (!isOpen) return null;

  const categories = ['all', 'Study', 'Work', 'Personal', 'Ideas'];
  const colors = [
    { id: 'all', label: 'All Colors', dot: 'bg-charcoal-400' },
    { id: 'default', label: 'Default', dot: 'bg-warm-border' },
    { id: 'amber', label: 'Sunset Amber', dot: 'bg-amber-400' },
    { id: 'rose', label: 'Soft Rose', dot: 'bg-rose-400' },
    { id: 'emerald', label: 'Fresh Mint', dot: 'bg-emerald-400' },
    { id: 'sky', label: 'Calm Sky', dot: 'bg-sky-400' },
    { id: 'purple', label: 'Royal Lilac', dot: 'bg-purple-400' }
  ];

  const sortOptions = [
    { id: 'updated_desc', label: 'Recently Updated (Default)' },
    { id: 'updated_asc', label: 'Oldest Updated' },
    { id: 'created_desc', label: 'Newest Created' },
    { id: 'created_asc', label: 'Oldest Created' },
    { id: 'title_asc', label: 'Title (A → Z)' },
    { id: 'title_desc', label: 'Title (Z → A)' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-warm-card dark:bg-charcoal-800 border border-warm-border dark:border-charcoal-700 w-full max-w-md rounded-[5px] shadow-dropdown p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-warm-border dark:border-charcoal-700">
          <h3 className="font-serif font-bold text-lg text-charcoal-900 dark:text-cream-50">
            Filter & Sort Notes
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-[3px] text-charcoal-400 hover:text-charcoal-700 dark:hover:text-cream-100 hover:bg-cream-100 dark:hover:bg-charcoal-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Categories / Tags */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-charcoal-400 dark:text-charcoal-500">
            Category / Tag
          </label>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => onSelectTag(cat)}
                className={`px-3 py-1.5 rounded-[3px] text-xs font-medium transition-colors ${
                  filterTag === cat
                    ? 'bg-terracotta-500 text-white shadow-xs'
                    : 'bg-cream-100 dark:bg-charcoal-700/60 text-charcoal-700 dark:text-charcoal-200 hover:bg-cream-200'
                }`}
              >
                {cat === 'all' ? 'All Tags' : `#${cat}`}
              </button>
            ))}
          </div>
        </div>

        {/* Color Palette Filter */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-charcoal-400 dark:text-charcoal-500">
            Note Tint / Color
          </label>
          <div className="flex flex-wrap gap-2">
            {colors.map((c) => (
              <button
                key={c.id}
                onClick={() => onSelectColor(c.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-[3px] text-xs font-medium transition-colors border ${
                  filterColor === c.id
                    ? 'border-terracotta-500 bg-terracotta-50 dark:bg-terracotta-950/40 text-terracotta-700 dark:text-terracotta-300'
                    : 'border-warm-border dark:border-charcoal-700 bg-cream-50 dark:bg-charcoal-700/50 text-charcoal-700 dark:text-charcoal-200 hover:bg-cream-100'
                }`}
              >
                <span className={`w-2.5 h-2.5 rounded-full ${c.dot}`} />
                <span>{c.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Sorting Options */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-charcoal-400 dark:text-charcoal-500">
            Sort Order
          </label>
          <select
            value={sortBy}
            onChange={(e) => onSelectSort(e.target.value)}
            className="w-full px-3 py-2 bg-cream-50 dark:bg-charcoal-700 border border-warm-border dark:border-charcoal-600 rounded-[3px] text-sm text-charcoal-800 dark:text-cream-50 outline-none focus:ring-1 focus:ring-terracotta-500"
          >
            {sortOptions.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-warm-border dark:border-charcoal-700">
          <button
            onClick={() => {
              onResetFilters();
              onClose();
            }}
            className="text-xs font-medium text-charcoal-500 hover:text-charcoal-800 dark:hover:text-cream-200 transition-colors"
          >
            Reset Filters
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-terracotta-500 hover:bg-terracotta-600 text-white rounded-[3px] text-xs font-medium transition-colors shadow-sm"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};
