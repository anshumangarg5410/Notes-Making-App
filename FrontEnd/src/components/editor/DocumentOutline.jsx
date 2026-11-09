import React from 'react';
import { ListTree } from 'lucide-react';

export const DocumentOutline = ({
  headings = [],
  onScrollToHeading
}) => {
  return (
    <div className="space-y-3 select-none text-xs">
      <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <ListTree className="w-3.5 h-3.5 text-purple-400" />
          <span>Document Outline</span>
        </div>
        <span className="text-[10px] text-gray-500 font-mono">{headings.length} sections</span>
      </div>

      {headings.length === 0 ? (
        <div className="p-4 text-center text-gray-500 text-xs">
          No headings found. Add H1, H2 or H3 in your note to generate an outline.
        </div>
      ) : (
        <div className="space-y-1">
          {headings.map((h, i) => (
            <button
              key={h.id || i}
              onClick={() => onScrollToHeading && onScrollToHeading(h.text)}
              className={`w-full text-left rounded-[3px] py-1 px-2 text-xs hover:bg-[#1f1f2c] transition-colors flex items-center gap-2 group ${
                h.level === 1
                  ? 'font-medium text-gray-200 pl-2'
                  : h.level === 2
                  ? 'text-gray-300 pl-5 text-[11px]'
                  : 'text-gray-400 pl-8 text-[11px]'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  h.level === 1
                    ? 'bg-purple-400'
                    : h.level === 2
                    ? 'bg-purple-500/60'
                    : 'bg-gray-500'
                }`}
              />
              <span className="truncate group-hover:text-purple-300">{h.text}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
