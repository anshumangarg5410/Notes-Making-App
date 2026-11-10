import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { ListTree } from 'lucide-react';

export const DocumentOutline = ({
  headings = [],
  onScrollToHeading
}) => {
  const { isDark } = useTheme();

  return (
    <div className="space-y-3 select-none text-xs">
      <div className={`text-[11px] font-semibold uppercase tracking-wider flex items-center justify-between ${isDark ? 'text-gray-400' : 'text-[#6B7280]'}`}>
        <div className="flex items-center gap-1.5">
          <ListTree className="w-3.5 h-3.5 text-purple-500" />
          <span>Document Outline</span>
        </div>
        <span className={`text-[10px] font-mono ${isDark ? 'text-gray-500' : 'text-[#9CA3AF]'}`}>{headings.length} sections</span>
      </div>

      {headings.length === 0 ? (
        <div className={`p-4 text-center text-xs ${isDark ? 'text-gray-500' : 'text-[#9CA3AF]'}`}>
          No headings found. Add H1, H2 or H3 in your note to generate an outline.
        </div>
      ) : (
        <div className="space-y-1">
          {headings.map((h, i) => (
            <button
              key={h.id || i}
              onClick={() => onScrollToHeading && onScrollToHeading(h.text)}
              className={`w-full text-left rounded-[3px] py-1 px-2 text-xs transition-colors flex items-center gap-2 group ${
                isDark ? 'hover:bg-[#1f1f2c]' : 'hover:bg-[#F3F0F9]'
              } ${
                h.level === 1
                  ? isDark ? 'font-medium text-gray-200 pl-2' : 'font-medium text-[#181326] pl-2'
                  : h.level === 2
                  ? isDark ? 'text-gray-300 pl-5 text-[11px]' : 'text-[#4B5563] pl-5 text-[11px]'
                  : isDark ? 'text-gray-400 pl-8 text-[11px]' : 'text-[#6B7280] pl-8 text-[11px]'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  h.level === 1
                    ? 'bg-purple-500'
                    : h.level === 2
                    ? 'bg-purple-400/60'
                    : isDark ? 'bg-gray-500' : 'bg-gray-400'
                }`}
              />
              <span className={`truncate ${isDark ? 'group-hover:text-purple-300' : 'group-hover:text-purple-600'}`}>{h.text}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

