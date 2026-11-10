import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Calendar, Clock, FileText, Hash } from 'lucide-react';

export const DocumentProperties = ({
  note,
  wordCount = 0,
  charCount = 0,
  readingTime = 1
}) => {
  const { isDark } = useTheme();

  return (
    <div className="space-y-4 select-none text-xs">
      <div className={`text-[11px] font-semibold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-[#6B7280]'}`}>
        Note Metadata
      </div>

      <div className={`space-y-2 rounded-[4px] p-3 text-xs border ${
        isDark ? 'bg-[#1b1b26] border-[#262638]' : 'bg-white border-[#EAE6F4]'
      }`}>
        <div className={`flex items-center justify-between py-1 border-b ${isDark ? 'border-[#242434]' : 'border-[#F0ECF8]'}`}>
          <span className={`flex items-center gap-1.5 ${isDark ? 'text-gray-400' : 'text-[#6B7280]'}`}>
            <Calendar className={`w-3.5 h-3.5 ${isDark ? 'text-gray-500' : 'text-[#9CA3AF]'}`} />
            Created
          </span>
          <span className={`font-mono text-[11px] ${isDark ? 'text-gray-200' : 'text-[#181326]'}`}>
            {note?.createdAt
              ? new Date(note.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })
              : 'Today'}
          </span>
        </div>

        <div className={`flex items-center justify-between py-1 border-b ${isDark ? 'border-[#242434]' : 'border-[#F0ECF8]'}`}>
          <span className={`flex items-center gap-1.5 ${isDark ? 'text-gray-400' : 'text-[#6B7280]'}`}>
            <Clock className={`w-3.5 h-3.5 ${isDark ? 'text-gray-500' : 'text-[#9CA3AF]'}`} />
            Last Modified
          </span>
          <span className={`font-mono text-[11px] ${isDark ? 'text-gray-200' : 'text-[#181326]'}`}>
            {note?.updatedAt
              ? new Date(note.updatedAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })
              : 'Just now'}
          </span>
        </div>

        <div className={`flex items-center justify-between py-1 border-b ${isDark ? 'border-[#242434]' : 'border-[#F0ECF8]'}`}>
          <span className={`flex items-center gap-1.5 ${isDark ? 'text-gray-400' : 'text-[#6B7280]'}`}>
            <FileText className={`w-3.5 h-3.5 ${isDark ? 'text-gray-500' : 'text-[#9CA3AF]'}`} />
            Word Count
          </span>
          <span className="text-purple-600 dark:text-purple-400 font-mono font-medium">
            {wordCount.toLocaleString()}
          </span>
        </div>

        <div className={`flex items-center justify-between py-1 border-b ${isDark ? 'border-[#242434]' : 'border-[#F0ECF8]'}`}>
          <span className={`flex items-center gap-1.5 ${isDark ? 'text-gray-400' : 'text-[#6B7280]'}`}>
            <Hash className={`w-3.5 h-3.5 ${isDark ? 'text-gray-500' : 'text-[#9CA3AF]'}`} />
            Characters
          </span>
          <span className={`font-mono text-[11px] ${isDark ? 'text-gray-200' : 'text-[#181326]'}`}>
            {charCount.toLocaleString()}
          </span>
        </div>

        <div className="flex items-center justify-between py-1">
          <span className={`flex items-center gap-1.5 ${isDark ? 'text-gray-400' : 'text-[#6B7280]'}`}>
            <Clock className={`w-3.5 h-3.5 ${isDark ? 'text-gray-500' : 'text-[#9CA3AF]'}`} />
            Reading Time
          </span>
          <span className={`font-mono text-[11px] ${isDark ? 'text-gray-200' : 'text-[#181326]'}`}>
            {readingTime} min read
          </span>
        </div>
      </div>

      {/* Frontmatter Preview */}
      <div className="space-y-1.5">
        <div className={`text-[11px] font-semibold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-[#6B7280]'}`}>
          YAML Frontmatter
        </div>
        <pre className={`rounded-[4px] p-2.5 text-[11px] font-mono leading-relaxed overflow-x-auto border ${
          isDark
            ? 'bg-[#12121a] border-[#242434] text-purple-300'
            : 'bg-white border-[#EAE6F4] text-purple-700'
        }`}>
{`---
title: "${note?.title || 'Untitled'}"
tags: [${(note?.tags || []).map((t) => `"${t}"`).join(', ')}]
created: "${note?.createdAt ? new Date(note.createdAt).toISOString() : new Date().toISOString()}"
---`}
        </pre>
      </div>
    </div>
  );
};

