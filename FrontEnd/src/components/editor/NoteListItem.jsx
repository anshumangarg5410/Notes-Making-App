import React from 'react';
import { FileText, Pin, Star, MoreVertical, Trash2, Copy, RotateCcw } from 'lucide-react';

export const NoteListItem = ({
  note,
  isSelected,
  onSelect,
  onTogglePin,
  onToggleFavorite,
  onDelete,
  onDuplicate,
  isTrashView = false,
  onRestore,
  onPermanentDelete
}) => {
  // Format relative time helper
  const formatTime = (dateStr) => {
    if (!dateStr) return 'Just now';
    const date = new Date(dateStr);
    const now = new Date();
    const diffSecs = Math.floor((now - date) / 1000);

    if (diffSecs < 60) return 'Just now';
    if (diffSecs < 3600) return `${Math.floor(diffSecs / 60)}m ago`;
    if (diffSecs < 86400) return `${Math.floor(diffSecs / 3600)}h ago`;
    if (diffSecs < 604800) return `${Math.floor(diffSecs / 86400)}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Extract preview text
  const getExcerpt = () => {
    if (note.plainText && note.plainText.trim()) {
      return note.plainText.slice(0, 50) + (note.plainText.length > 50 ? '...' : '');
    }
    if (typeof note.content === 'string' && note.content.trim()) {
      const stripped = note.content.replace(/<[^>]+>/g, '').trim();
      return stripped.slice(0, 50) + (stripped.length > 50 ? '...' : '');
    }
    return 'No additional text';
  };

  return (
    <div
      onClick={() => onSelect(note)}
      className={`group relative p-3 rounded-[6px] cursor-pointer transition-all duration-150 select-none ${
        isSelected
          ? 'bg-gradient-to-r from-purple-950/70 to-purple-900/35 border border-purple-500/50 shadow-sm shadow-purple-950/40'
          : 'bg-transparent hover:bg-[#1a1a24] border border-transparent'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Document Icon Box */}
        <div
          className={`w-7 h-7 rounded-[4px] flex items-center justify-center shrink-0 transition-colors ${
            isSelected
              ? 'bg-purple-600/30 text-purple-300'
              : 'bg-[#1e1e2c] text-gray-400 group-hover:text-gray-300'
          }`}
        >
          <FileText className="w-4 h-4" />
        </div>

        {/* Content details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1">
            <h4
              className={`text-xs font-medium truncate ${
                isSelected ? 'text-white' : 'text-gray-200 group-hover:text-white'
              }`}
            >
              {note.title || 'Untitled Note'}
            </h4>

            <div className="flex items-center gap-1 shrink-0">
              {(isTrashView || note.isDeleted) ? (
                <span className="text-[9px] font-medium text-red-400 bg-red-950/40 px-1.5 py-0.5 rounded-[2px] border border-red-500/30">
                  Trash
                </span>
              ) : (
                <>
                  {note.isPinned && (
                    <Pin className="w-3 h-3 text-purple-400 shrink-0 fill-purple-400" />
                  )}
                  {note.isFavorite && (
                    <Star className="w-3 h-3 text-amber-400 shrink-0 fill-amber-400" />
                  )}
                </>
              )}
            </div>
          </div>

          <p className="text-[11px] text-gray-400 truncate mt-0.5 leading-relaxed">
            {getExcerpt()}
          </p>

          <div className="flex items-center justify-between mt-1 text-[10px] text-gray-500">
            <span>{formatTime(note.updatedAt || note.createdAt)}</span>

            {note.tags && note.tags.length > 0 && (
              <span className="text-[10px] text-purple-400/80 bg-purple-950/40 px-1.5 py-0.2 rounded-[2px] border border-purple-500/20">
                #{note.tags[0]}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Floating quick actions on hover */}
      <div className="absolute top-2 right-2 hidden group-hover:flex items-center gap-1 bg-[#171723] backdrop-blur-md border border-[#2a2a3d] rounded-[4px] p-0.5 z-10 shadow-xl">
        {(isTrashView || note.isDeleted) ? (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onRestore?.(note._id || note.id);
              }}
              className="px-2 py-1 rounded-[3px] bg-emerald-950/60 hover:bg-emerald-900/90 text-emerald-300 hover:text-white border border-emerald-500/30 text-[11px] font-medium transition-colors flex items-center gap-1"
              title="Restore note to All Notes"
            >
              <RotateCcw className="w-3 h-3 text-emerald-400" />
              <span>Restore</span>
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onPermanentDelete?.(note._id || note.id);
              }}
              className="px-2 py-1 rounded-[3px] bg-red-950/60 hover:bg-red-900/90 text-red-300 hover:text-white border border-red-500/30 text-[11px] font-medium transition-colors flex items-center gap-1"
              title="Permanently delete from database"
            >
              <Trash2 className="w-3 h-3 text-red-400" />
              <span>Delete Permanently</span>
            </button>
          </>
        ) : (
          <>
            {onTogglePin && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onTogglePin(note._id || note.id);
                }}
                className={`p-1.5 rounded-[3px] hover:bg-[#252538] transition-colors ${
                  note.isPinned ? 'text-purple-400 fill-purple-400' : 'text-gray-400 hover:text-white'
                }`}
                title={note.isPinned ? 'Unpin note' : 'Pin note to top'}
              >
                <Pin className={`w-3.5 h-3.5 ${note.isPinned ? 'fill-purple-400' : ''}`} />
              </button>
            )}
            {onToggleFavorite && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onToggleFavorite(note._id || note.id);
                }}
                className={`p-1.5 rounded-[3px] hover:bg-[#252538] transition-colors ${
                  note.isFavorite ? 'text-amber-400 fill-amber-400' : 'text-gray-400 hover:text-white'
                }`}
                title={note.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Star className={`w-3.5 h-3.5 ${note.isFavorite ? 'fill-amber-400' : ''}`} />
              </button>
            )}
            {onDuplicate && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onDuplicate(note._id || note.id);
                }}
                className="p-1.5 rounded-[3px] hover:bg-[#252538] text-gray-400 hover:text-white transition-colors"
                title="Duplicate note"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onDelete(note._id || note.id);
                }}
                className="p-1.5 rounded-[3px] hover:bg-[#252538] text-gray-400 hover:text-red-400 transition-colors"
                title="Move note to trash"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

