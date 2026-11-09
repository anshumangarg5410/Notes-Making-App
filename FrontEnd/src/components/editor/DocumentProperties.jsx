import React from 'react';
import { Calendar, Clock, FileText, Hash } from 'lucide-react';

export const DocumentProperties = ({
  note,
  wordCount = 0,
  charCount = 0,
  readingTime = 1
}) => {
  return (
    <div className="space-y-4 select-none text-xs">
      <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
        Note Metadata
      </div>

      <div className="space-y-2 bg-[#1b1b26] border border-[#262638] rounded-[4px] p-3 text-xs">
        <div className="flex items-center justify-between py-1 border-b border-[#242434]">
          <span className="text-gray-400 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-gray-500" />
            Created
          </span>
          <span className="text-gray-200 font-mono text-[11px]">
            {note?.createdAt
              ? new Date(note.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })
              : 'Today'}
          </span>
        </div>

        <div className="flex items-center justify-between py-1 border-b border-[#242434]">
          <span className="text-gray-400 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-gray-500" />
            Last Modified
          </span>
          <span className="text-gray-200 font-mono text-[11px]">
            {note?.updatedAt
              ? new Date(note.updatedAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })
              : 'Just now'}
          </span>
        </div>

        <div className="flex items-center justify-between py-1 border-b border-[#242434]">
          <span className="text-gray-400 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-gray-500" />
            Word Count
          </span>
          <span className="text-purple-400 font-mono font-medium">
            {wordCount.toLocaleString()}
          </span>
        </div>

        <div className="flex items-center justify-between py-1 border-b border-[#242434]">
          <span className="text-gray-400 flex items-center gap-1.5">
            <Hash className="w-3.5 h-3.5 text-gray-500" />
            Characters
          </span>
          <span className="text-gray-200 font-mono text-[11px]">
            {charCount.toLocaleString()}
          </span>
        </div>

        <div className="flex items-center justify-between py-1">
          <span className="text-gray-400 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-gray-500" />
            Reading Time
          </span>
          <span className="text-gray-200 font-mono text-[11px]">
            {readingTime} min read
          </span>
        </div>
      </div>

      {/* Frontmatter Preview */}
      <div className="space-y-1.5">
        <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
          YAML Frontmatter
        </div>
        <pre className="bg-[#12121a] border border-[#242434] rounded-[4px] p-2.5 text-[11px] font-mono text-purple-300 leading-relaxed overflow-x-auto">
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

