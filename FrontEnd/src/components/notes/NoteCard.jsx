import React, { useState, useRef, useEffect } from 'react';
import {
  FileText,
  Lightbulb,
  Dumbbell,
  Laptop,
  BookOpen,
  Plane,
  Soup,
  Pin,
  Star,
  MoreVertical,
  Archive,
  Trash2,
  RotateCcw,
  Palette,
  Copy
} from 'lucide-react';

const iconMap = {
  document: FileText,
  lightbulb: Lightbulb,
  dumbbell: Dumbbell,
  laptop: Laptop,
  book: BookOpen,
  plane: Plane,
  bowl: Soup
};

export const NoteCard = ({
  note,
  isSelected,
  onSelect,
  onTogglePin,
  onToggleFavorite,
  onToggleArchive,
  onDelete,
  onRestore,
  onPermanentDelete,
  onChangeColor,
  onDuplicate
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  // Format timestamp like "Today, 6:45 PM" or "Yesterday, 3:15 PM" or "Oct 20, 2026"
  const formatCardDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();

    const isToday =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday =
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear();

    const timeStr = date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

    if (isToday) return `Today, ${timeStr}`;
    if (isYesterday) return `Yesterday, ${timeStr}`;

    return date.toLocaleDateString([], {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const IconComponent = iconMap[note.icon] || FileText;

  return (
    <div
      onClick={onSelect}
      className={`group relative p-3.5 rounded-2xl cursor-pointer transition-all duration-150 border text-left ${
        isSelected
          ? 'bg-[#FBF1EB] dark:bg-terracotta-950/40 border-terracotta-300 dark:border-terracotta-700/60 shadow-sm'
          : 'bg-warm-card dark:bg-charcoal-800/80 border-warm-border/70 dark:border-charcoal-700/60 hover:border-warm-border hover:shadow-subtle'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Left Icon */}
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
            isSelected
              ? 'bg-terracotta-200/60 dark:bg-terracotta-800/60 text-terracotta-700 dark:text-terracotta-300'
              : 'bg-cream-100 dark:bg-charcoal-700 text-charcoal-600 dark:text-charcoal-300'
          }`}
        >
          <IconComponent className="w-4 h-4" />
        </div>

        {/* Content Preview */}
        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center space-x-1.5">
            <h3
              className={`font-semibold text-sm truncate leading-tight ${
                isSelected
                  ? 'text-charcoal-900 dark:text-cream-50 font-medium'
                  : 'text-charcoal-800 dark:text-cream-100'
              }`}
            >
              {note.title || 'Untitled Note'}
            </h3>
            {note.isPinned && (
              <Pin className="w-3.5 h-3.5 text-terracotta-500 fill-terracotta-500 transform rotate-45 flex-shrink-0" />
            )}
            {note.isFavorite && (
              <Star className="w-3 h-3 text-amber-500 fill-amber-500 flex-shrink-0" />
            )}
          </div>

          <p className="text-xs text-charcoal-400 dark:text-charcoal-400 line-clamp-1 mt-1 leading-normal font-normal">
            {note.plainText || 'No additional text'}
          </p>

          <div className="flex items-center space-x-2 mt-2">
            <span className="text-[11px] text-charcoal-400 dark:text-charcoal-500 font-medium">
              {formatCardDate(note.updatedAt || note.createdAt)}
            </span>
            {note.tags && note.tags.length > 0 && (
              <span className="text-[10px] bg-cream-200/60 dark:bg-charcoal-700 text-charcoal-500 dark:text-charcoal-400 px-1.5 py-0.5 rounded-md font-medium truncate max-w-[80px]">
                #{note.tags[0]}
              </span>
            )}
          </div>
        </div>

        {/* Three dots menu */}
        <div className="relative" ref={menuRef} onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="p-1 rounded-lg text-charcoal-400 hover:text-charcoal-700 dark:hover:text-cream-100 hover:bg-cream-200/50 dark:hover:bg-charcoal-700/60 transition-colors opacity-80 group-hover:opacity-100"
            title="Note options"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-7 w-44 bg-warm-card dark:bg-charcoal-800 border border-warm-border dark:border-charcoal-700 rounded-xl shadow-dropdown z-30 py-1.5 text-xs text-charcoal-700 dark:text-charcoal-200 animate-in fade-in zoom-in-95 duration-100">
              {!note.isDeleted ? (
                <>
                  <button
                    onClick={() => {
                      onTogglePin(note._id);
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-cream-100 dark:hover:bg-charcoal-700/70 flex items-center space-x-2"
                  >
                    <Pin className="w-3.5 h-3.5 text-terracotta-500" />
                    <span>{note.isPinned ? 'Unpin note' : 'Pin note'}</span>
                  </button>
                  <button
                    onClick={() => {
                      onToggleFavorite(note._id);
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-cream-100 dark:hover:bg-charcoal-700/70 flex items-center space-x-2"
                  >
                    <Star className="w-3.5 h-3.5 text-amber-500" />
                    <span>{note.isFavorite ? 'Remove favorite' : 'Add favorite'}</span>
                  </button>
                  <button
                    onClick={() => {
                      onToggleArchive(note._id);
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-cream-100 dark:hover:bg-charcoal-700/70 flex items-center space-x-2"
                  >
                    <Archive className="w-3.5 h-3.5 text-charcoal-500" />
                    <span>{note.isArchived ? 'Unarchive' : 'Archive note'}</span>
                  </button>
                  {onDuplicate && (
                    <button
                      onClick={() => {
                        onDuplicate(note._id);
                        setMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-cream-100 dark:hover:bg-charcoal-700/70 flex items-center space-x-2 text-charcoal-700 dark:text-cream-200"
                    >
                      <Copy className="w-3.5 h-3.5 text-charcoal-500" />
                      <span>Duplicate note</span>
                    </button>
                  )}
                  <div className="my-1 border-t border-warm-border dark:border-charcoal-700/70" />
                  <button
                    onClick={() => {
                      onDelete(note._id);
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 dark:text-red-400 flex items-center space-x-2"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Move to trash</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      onRestore(note._id);
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-cream-100 dark:hover:bg-charcoal-700/70 flex items-center space-x-2 text-emerald-600"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Restore note</span>
                  </button>
                  <button
                    onClick={() => {
                      onPermanentDelete(note._id);
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 dark:text-red-400 flex items-center space-x-2"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete permanently</span>
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
