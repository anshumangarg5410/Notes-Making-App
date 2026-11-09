import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Folder, FolderOpen } from 'lucide-react';

export const NestedFolderTree = ({
  parentFolderName = 'Projects',
  subfolders = [
    { name: 'NoteNest', count: 6 },
    { name: 'API Gateway', count: 3 },
    { name: 'Traffic System', count: 2 }
  ],
  onSelectSubfolder
}) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="pt-5 pb-4 select-none">
      {/* Collapsible Section Header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-xs font-semibold text-gray-200 hover:text-white mb-2.5 transition-colors"
      >
        {isOpen ? (
          <ChevronDown className="w-3.5 h-3.5 text-purple-400" />
        ) : (
          <ChevronRight className="w-3.5 h-3.5 text-purple-400" />
        )}
        <span>Nested Folders ({parentFolderName})</span>
      </button>

      {/* Tree View Container matching screenshot */}
      {isOpen && (
        <div className="bg-[#14141f] border border-[#232334] rounded-[5px] p-3 text-xs">
          {/* Parent Node */}
          <div className="flex items-center gap-2 text-gray-200 font-semibold mb-2">
            <ChevronDown className="w-3.5 h-3.5 text-purple-400" />
            <FolderOpen className="w-4 h-4 text-purple-400" />
            <span>{parentFolderName}</span>
          </div>

          {/* Child Branches with connecting tree lines */}
          <div className="pl-6 space-y-2 border-l border-[#28283a] ml-4 mt-1">
            {subfolders.map((sub, idx) => (
              <div
                key={sub.name || idx}
                onClick={() => onSelectSubfolder && onSelectSubfolder(sub.name)}
                className="group flex items-center justify-between py-1 px-2 rounded-[3px] hover:bg-[#1a1a28] cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="w-3 h-[1px] bg-[#2d2d40] group-hover:bg-purple-500/60" />
                  <Folder className="w-3.5 h-3.5 text-gray-400 group-hover:text-purple-300" />
                  <span className="text-gray-300 group-hover:text-white">{sub.name}</span>
                </div>
                <span className="text-[11px] text-gray-500 font-mono">
                  {sub.count} {sub.count === 1 ? 'note' : 'notes'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
