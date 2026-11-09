import React from 'react';
import { FileText, Pin, Star, MoreVertical, Trash2, Copy } from 'lucide-react';

export const NoteListItem = ({
  note,
  isSelected,
  onSelect,
  onTogglePin,
  onToggleFavorite,
  onDelete,
  onDuplicate
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

            {note.isPinned && (
              <Pin className="w-3 h-3 text-purple-400 shrink-0 fill-purple-400/20" />
            )}
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
      <div className="absolute top-2 right-2 hidden group-hover:flex items-center gap-1 bg-[#181824]/90 backdrop-blur-sm border border-[#272738] rounded-[3px] p-0.5 z-10">
        {onTogglePin && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onTogglePin(note._id || note.id);
            }}
            className={`p-1 hover:text-white rounded ${
              note.isPinned ? 'text-purple-400' : 'text-gray-400'
            }`}
            title={note.isPinned ? 'Unpin' : 'Pin'}
          >
            <Pin className="w-3 h-3" />
          </button>
        )}
        {onToggleFavorite && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(note._id || note.id);
            }}
            className={`p-1 hover:text-white rounded ${
              note.isFavorite ? 'text-amber-400 fill-amber-400' : 'text-gray-400'
            }`}
            title="Favorite"
          >
            <Star className="w-3 h-3" />
          </button>
        )}
        {onDuplicate && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate(note._id || note.id);
            }}
            className="p-1 hover:text-white text-gray-400 rounded"
            title="Duplicate"
          >
            <Copy className="w-3 h-3" />
          </button>
        )}
        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(note._id || note.id);
            }}
            className="p-1 hover:text-red-400 text-gray-400 rounded"
            title="Delete"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
};

