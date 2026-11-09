import React, { useState } from 'react';
import { Tag, Plus, X, Hash } from 'lucide-react';

export const TagManager = ({
  tags = [],
  onAddTag,
  onRemoveTag,
  suggestedTags = ['projects', 'system-design', 'dbms', 'ui-ux', 'go', 'dsa']
}) => {
  const [inputVal, setInputVal] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const clean = inputVal.trim().replace(/^#/, '');
    if (clean && onAddTag) {
      onAddTag(clean);
      setInputVal('');
    }
  };

  return (
    <div className="space-y-3 select-none text-xs">
      <div className="flex items-center justify-between text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
        <div className="flex items-center gap-1.5">
          <Tag className="w-3.5 h-3.5 text-purple-400" />
          <span>Tags</span>
        </div>
        <span className="text-[10px] text-gray-500">{tags.length} assigned</span>
      </div>

      {/* Active tags pills */}
      <div className="flex flex-wrap gap-1.5">
        {tags.length === 0 ? (
          <div className="text-gray-500 text-xs py-1">No tags assigned.</div>
        ) : (
          tags.map((t) => (
            <span
              key={t}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[3px] bg-purple-950/60 text-purple-300 border border-purple-500/30 text-[11px]"
            >
              <Hash className="w-2.5 h-2.5 opacity-60" />
              <span>{t}</span>
              {onRemoveTag && (
                <button
                  type="button"
                  onClick={() => onRemoveTag(t)}
                  className="hover:text-red-400 p-0.5 ml-0.5"
                  title="Remove tag"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              )}
            </span>
          ))
        )}
      </div>

      {/* Add tag form */}
      <form onSubmit={handleSubmit} className="pt-1">
        <div className="flex items-center gap-1.5">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Add tag (e.g. system-design)..."
            className="flex-1 bg-[#1b1b26] border border-[#272738] focus:border-purple-500/60 rounded-[3px] px-2 py-1 text-xs text-gray-200 placeholder-gray-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!inputVal.trim()}
            className="p-1 bg-purple-600 hover:bg-purple-500 text-white rounded-[3px] disabled:opacity-40 transition-colors"
            title="Add Tag"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Suggested tags */}
      {suggestedTags && suggestedTags.length > 0 && (
        <div className="pt-2">
          <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1.5">Suggestions</div>
          <div className="flex flex-wrap gap-1">
            {suggestedTags
              .filter((st) => !tags.includes(st))
              .slice(0, 5)
              .map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => onAddTag && onAddTag(st)}
                  className="text-[10px] text-gray-400 hover:text-purple-300 bg-[#161622] hover:bg-purple-950/40 border border-[#252538] hover:border-purple-500/30 px-1.5 py-0.5 rounded-[2px] transition-colors"
                >
                  +{st}
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};
