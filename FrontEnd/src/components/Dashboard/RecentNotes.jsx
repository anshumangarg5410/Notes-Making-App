import React, { useState, useRef, useEffect } from 'react';
import {
  FileText,
  MoreHorizontal,
  Star,
  Pin,
  Trash2,
  Copy,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

export const RecentNotes = ({
  notes = [],
  onSelectNote,
  onViewAll,
  onViewTrash,
  onSelectTag,
  onTogglePin,
  onToggleFavorite,
  onDeleteNote
}) => {
  const [activeMenuId, setActiveMenuId] = useState(null);
  const menuRef = useRef(null);

  // Close 3-dot dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Format relative timestamp
  const formatTime = (dateStr) => {
    if (!dateStr) return 'Recently';
    const now = Date.now();
    const then = new Date(dateStr).getTime();
    const diffMin = Math.round((now - then) / 60000);

    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin} min ago`;
    const diffHours = Math.round(diffMin / 60);
    if (diffHours < 24) return `${diffHours} hr ago`;
    const diffDays = Math.round(diffHours / 24);
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return new Date(dateStr).toLocaleDateString();
  };

  // Tag color badge styling matching screenshot
  const getTagColorClass = (tag) => {
    const lower = tag.toLowerCase();
    if (lower === 'projects' || lower === 'ui/ux') {
      return 'bg-purple-900/40 text-purple-300 border-purple-500/30';
    }
    if (lower === 'go' || lower === 'practice') {
      return 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30';
    }
    if (lower === 'college' || lower === 'dsa') {
      return 'bg-indigo-950/40 text-indigo-300 border-indigo-500/30';
    }
    if (lower === 'dbms' || lower === 'system design') {
      return 'bg-sky-950/40 text-sky-300 border-sky-500/30';
    }
    return 'bg-purple-900/30 text-purple-200 border-purple-500/20';
  };

  return (
    <div className="rounded-[4px] p-5 sm:p-6 bg-[#181226]/90 border border-purple-500/20 shadow-xl select-none">
      {/* Panel Header */}
      <div className="flex items-center justify-between pb-4 border-b border-purple-500/15 mb-2">
        <div className="flex items-center gap-2.5">
          <FileText className="w-4 h-4 text-purple-400" />
          <h3 className="text-base font-bold text-white tracking-tight">
            Recent Notes
          </h3>
        </div>

        <div className="flex items-center gap-2.5">
          {onViewTrash && (
            <button
              type="button"
              onClick={onViewTrash}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[3px] bg-purple-950/40 hover:bg-purple-900/60 border border-purple-500/25 text-xs font-semibold text-purple-300 hover:text-white transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Trash</span>
            </button>
          )}

          <button
            type="button"
            onClick={onViewAll}
            className="inline-flex items-center gap-1 text-xs font-semibold text-purple-300 hover:text-white transition-colors cursor-pointer group"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* Note List Rows */}
      <div className="divide-y divide-purple-500/10">
        {notes.map((note) => {
          const isMenuOpen = activeMenuId === note._id;

          return (
            <div
              key={note._id}
              onClick={() => onSelectNote && onSelectNote(note)}
              className="py-3 px-2 sm:px-3 rounded-[3px] flex items-center justify-between gap-3 hover:bg-white/5 transition-colors cursor-pointer group relative"
            >
              {/* Left: Icon + Title + Snippet */}
              <div className="flex items-center gap-3.5 min-w-0 flex-1">
                {/* Purple note icon */}
                <div className="w-8 h-8 rounded-[3px] bg-purple-950/60 border border-purple-500/30 flex items-center justify-center text-purple-300 shrink-0 group-hover:scale-105 group-hover:border-purple-400 transition-all">
                  <FileText className="w-4 h-4" />
                </div>

                {/* Title & Preview */}
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs sm:text-sm font-semibold text-white group-hover:text-purple-200 transition-colors truncate">
                    {note.title || 'Untitled Note'}
                  </h4>
                  <p className="text-[11px] text-stone-400 truncate mt-0.5">
                    {note.plainText || 'No text preview available'}
                  </p>
                </div>
              </div>

              {/* Center/Right: Tag Pills (visible on sm+) */}
              <div className="hidden sm:flex items-center gap-1.5 shrink-0">
                {Array.isArray(note.tags) &&
                  note.tags.map((tag) => (
                    <span
                      key={tag}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onSelectTag) onSelectTag(tag);
                      }}
                      className={`px-2.5 py-0.5 rounded-[2px] text-[11px] font-medium border transition-colors hover:scale-105 ${getTagColorClass(
                        tag
                      )}`}
                    >
                      {tag}
                    </span>
                  ))}
              </div>

              {/* Right: Timestamp + 3-Dot Menu */}
              <div className="flex items-center gap-2.5 shrink-0">
                <span className="text-[11px] text-stone-400 whitespace-nowrap">
                  {formatTime(note.updatedAt)}
                </span>

                {/* 3-Dot Action Button */}
                <div className="relative" ref={isMenuOpen ? menuRef : null}>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveMenuId(isMenuOpen ? null : note._id);
                    }}
                    className="p-1 rounded-[3px] text-stone-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>

                  {/* 3-Dot Dropdown */}
                  {isMenuOpen && (
                    <div className="absolute right-0 mt-1 w-36 rounded-[3px] bg-[#201830] border border-purple-500/30 p-1.5 shadow-xl z-30 animate-in fade-in zoom-in-95 duration-100">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onTogglePin) onTogglePin(note._id);
                          setActiveMenuId(null);
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-[3px] text-xs text-stone-200 hover:bg-white/10 transition-colors text-left"
                      >
                        <Pin className={`w-3.5 h-3.5 ${note.isPinned ? 'fill-purple-400 text-purple-400' : ''}`} />
                        <span>{note.isPinned ? 'Unpin' : 'Pin to top'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onToggleFavorite) onToggleFavorite(note._id);
                          setActiveMenuId(null);
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-[3px] text-xs text-stone-200 hover:bg-white/10 transition-colors text-left"
                      >
                        <Star className={`w-3.5 h-3.5 ${note.isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
                        <span>{note.isFavorite ? 'Unfavorite' : 'Favorite'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onSelectNote) onSelectNote(note);
                          setActiveMenuId(null);
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-[3px] text-xs text-stone-200 hover:bg-white/10 transition-colors text-left"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Open Editor</span>
                      </button>

                      <div className="border-t border-purple-500/20 my-1" />

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onDeleteNote) onDeleteNote(note._id);
                          setActiveMenuId(null);
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-[3px] text-xs text-red-400 hover:bg-red-500/10 transition-colors text-left"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentNotes;

