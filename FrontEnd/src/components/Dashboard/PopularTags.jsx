import React from 'react';
import { Tag } from 'lucide-react';

export const PopularTags = ({
  tags = [
    { name: 'Projects', count: 12 },
    { name: 'College', count: 10 },
    { name: 'DSA', count: 8 },
    { name: 'System Design', count: 6 },
    { name: 'Go', count: 4 },
    { name: 'UI/UX', count: 4 }
  ],
  onSelectTag
}) => {
  return (
    <div className="rounded-3xl p-5 sm:p-6 bg-[#181226]/90 border border-purple-500/20 shadow-xl select-none">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-4">
        <Tag className="w-4 h-4 text-purple-400" />
        <h3 className="text-base font-bold text-white tracking-tight">
          Popular Tags
        </h3>
      </div>

      {/* Tag Pills List */}
      <div className="flex flex-wrap items-center gap-2.5">
        {tags.map((tag) => (
          <button
            key={tag.name}
            type="button"
            onClick={() => onSelectTag && onSelectTag(tag.name)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium bg-[#1c142c] hover:bg-[#251a3a] border border-purple-500/25 hover:border-purple-400/60 text-stone-200 hover:text-white transition-all duration-200 cursor-pointer shadow-xs hover:scale-105 active:scale-95 group"
          >
            <span className="text-purple-400 font-bold group-hover:text-purple-300">
              #
            </span>
            <span>{tag.name}</span>
            <span className="ml-1 text-[11px] text-purple-300/60 group-hover:text-purple-200 font-mono">
              {tag.count}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PopularTags;

