import React, { useState, useRef, useEffect } from 'react';
import {
  FileText,
  Lightbulb,
  Dumbbell,
  Code,
  BookOpen,
  Plane,
  Utensils,
  Cpu,
  Pin,
  Star,
  MoreVertical,
  Archive,
  Trash2,
  RotateCcw,
  Copy
} from 'lucide-react';

// Helper to determine category icon and color palette
const getCategoryDetails = (note) => {
  const title = (note.title || '').toLowerCase();
  const tags = (note.tags || []).map((t) => t.toLowerCase());
  const str = `${title} ${tags.join(' ')}`;

  if (str.includes('machine learning') || str.includes('study') || str.includes('note')) {
    return {
      Icon: FileText,
      bg: 'bg-orange-100 dark:bg-orange-950/60',
      text: 'text-orange-600 dark:text-orange-400'
    };
  }
  if (str.includes('idea') || str.includes('project')) {
    return {
      Icon: Lightbulb,
      bg: 'bg-amber-100 dark:bg-amber-950/60',
      text: 'text-amber-600 dark:text-amber-400'
    };
  }
  if (str.includes('workout') || str.includes('gym') || str.includes('fit') || str.includes('health')) {
    return {
      Icon: Dumbbell,
      bg: 'bg-rose-100 dark:bg-rose-950/60',
      text: 'text-rose-600 dark:text-rose-400'
    };
  }
  if (str.includes('web') || str.includes('code') || str.includes('development') || str.includes('react')) {
    return {
      Icon: Code,
      bg: 'bg-purple-100 dark:bg-purple-950/60',
      text: 'text-purple-600 dark:text-purple-400'
    };
  }
  if (str.includes('book') || str.includes('read')) {
    return {
      Icon: BookOpen,
      bg: 'bg-amber-100 dark:bg-amber-950/60',
      text: 'text-amber-600 dark:text-amber-400'
    };
  }
  if (str.includes('travel') || str.includes('trip') || str.includes('flight')) {
    return {
      Icon: Plane,
      bg: 'bg-sky-100 dark:bg-sky-950/60',
      text: 'text-sky-600 dark:text-sky-400'
    };
  }
  if (str.includes('recipe') || str.includes('food') || str.includes('cook') || str.includes('meal')) {
    return {
      Icon: Utensils,
      bg: 'bg-red-100 dark:bg-red-950/60',
      text: 'text-red-600 dark:text-red-400'
    };
  }
  if (str.includes('system') || str.includes('design') || str.includes('architecture')) {
    return {
      Icon: Cpu,
      bg: 'bg-teal-100 dark:bg-teal-950/60',
      text: 'text-teal-600 dark:text-teal-400'
    };
  }

  return {
    Icon: FileText,
    bg: 'bg-orange-100 dark:bg-orange-950/60',
    text: 'text-orange-600 dark:text-orange-400'
  };
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

  // Format timestamp like "Today, 10:21" or "Yesterday, 18:42" or "Oct 28"
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

    const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

    if (isToday) return `Today, ${timeStr}`;
    if (isYesterday) return `Yesterday, ${timeStr}`;

    return date.toLocaleDateString([], {
      month: 'short',
      day: 'numeric'
    });
  };

  const { Icon, bg: iconBg, text: iconColor } = getCategoryDetails(note);

  return (
    <div
      onClick={onSelect}
      className={`group relative p-3 rounded-[4px] cursor-pointer transition-all duration-150 border text-left ${
        menuOpen ? 'z-20 ' : ''
      }${
        isSelected
          ? 'bg-orange-50/80 dark:bg-orange-950/30 border-orange-400 dark:border-orange-500/60 shadow-xs ring-1 ring-orange-500/20'
          : 'bg-white/80 dark:bg-charcoal-800/80 border-warm-border/80 dark:border-charcoal-700/60 hover:border-orange-300 dark:hover:border-orange-800/60 hover:shadow-xs'
      }`}
    >
      <div className="flex items-start justify-between gap-2.5">
        {/* Left Category Icon */}
        <div
          className={`w-8 h-8 rounded-[3px] flex items-center justify-center flex-shrink-0 transition-colors ${iconBg} ${iconColor}`}
        >
          <Icon className="w-4 h-4" />
        </div>

        {/* Content Preview */}
        <div className="flex-1 min-w-0 pr-0.5">
          <div className="flex items-center space-x-1.5">
            <h3
              className={`font-semibold text-xs truncate leading-tight ${
                isSelected
                  ? 'text-charcoal-900 dark:text-cream-50 font-bold'
                  : 'text-charcoal-800 dark:text-cream-100'
              }`}
            >
              {note.title || 'Untitled Note'}
            </h3>
            {note.isPinned && (
              <Pin className="w-3 h-3 text-orange-500 fill-orange-500 transform rotate-45 flex-shrink-0" />
            )}
            {note.isFavorite && (
              <Star className="w-3 h-3 text-amber-500 fill-amber-500 flex-shrink-0" />
            )}
          </div>

          <p className="text-[11px] text-charcoal-400 dark:text-charcoal-400 line-clamp-1 mt-0.5 leading-normal font-normal">
            {note.plainText || 'No additional text'}
          </p>

          <div className="flex items-center justify-between mt-2">
            <span className="text-[10px] text-charcoal-400 dark:text-charcoal-500 font-medium">
              {formatCardDate(note.updatedAt || note.createdAt)}
            </span>
            {note.tags && note.tags.length > 0 && (
              <span className="text-[10px] bg-cream-200/60 dark:bg-charcoal-700 text-charcoal-500 dark:text-charcoal-400 px-2 py-0.5 rounded-[2px] font-medium truncate max-w-[90px]">
                #{note.tags[0]}
              </span>
            )}
          </div>
        </div>

        {/* Three dots menu */}
        <div className="relative flex-shrink-0" ref={menuRef} onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="p-1 rounded-[3px] text-charcoal-400 hover:text-charcoal-700 dark:hover:text-cream-100 hover:bg-cream-200/50 dark:hover:bg-charcoal-700/60 transition-colors opacity-70 group-hover:opacity-100"
            title="Note options"
          >
            <MoreVertical className="w-3.5 h-3.5" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-6 w-44 bg-warm-card dark:bg-charcoal-800 border border-warm-border dark:border-charcoal-700 rounded-[3px] shadow-dropdown z-30 py-1.5 text-xs text-charcoal-700 dark:text-charcoal-200 animate-in fade-in zoom-in-95 duration-100">
              {!note.isDeleted ? (
                <>
                  <button
                    onClick={() => {
                      onTogglePin(note._id);
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-cream-100 dark:hover:bg-charcoal-700/70 flex items-center space-x-2"
                  >
                    <Pin className="w-3.5 h-3.5 text-orange-500" />
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
