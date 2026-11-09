import React, { useState } from 'react';
import {
  FileText,
  Folder,
  X,
  Clock,
  RotateCcw,
  Trash2,
  ChevronDown,
  ChevronRight,
  HardDrive,
  FileCheck,
  FolderOpen
} from 'lucide-react';

export const TrashDetailsPanel = ({
  item,
  isOpen = true,
  onClose,
  onRestore,
  onDeletePermanently
}) => {
  const [previewOpen, setPreviewOpen] = useState(true);

  if (!isOpen || !item) {
    return (
      <aside className="w-80 min-w-[280px] h-full bg-[#13131b] border-l border-[#222230] p-6 flex flex-col items-center justify-center text-center text-xs text-gray-500 select-none">
        <Trash2 className="w-8 h-8 text-gray-600 mb-2 stroke-1" />
        <p className="text-gray-400 font-medium">No Item Selected</p>
        <p className="text-gray-500 text-[11px] mt-1">Select an item from the Trash list to view details and preview.</p>
      </aside>
    );
  }

  const isFolder = item.type === 'folder';

  const formatDeletedDate = (dateStr) => {
    if (!dateStr) return 'Nov 9, 2026, 11:24 AM';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }) + ', ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <aside className="w-80 min-w-[280px] h-full bg-[#13131b] border-l border-[#222230] flex flex-col justify-between p-4 select-none text-xs text-gray-200">
      {/* Top Details Area */}
      <div className="space-y-4">
        {/* Header with icon, title & close */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className={`w-8 h-8 rounded-[4px] flex items-center justify-center shrink-0 ${
                isFolder
                  ? 'bg-amber-950/50 text-amber-300 border border-amber-500/30'
                  : 'bg-purple-950/50 text-purple-300 border border-purple-500/30'
              }`}
            >
              {isFolder ? <Folder className="w-4 h-4 fill-current/20" /> : <FileText className="w-4 h-4" />}
            </div>
            <h2 className="text-sm font-bold text-white tracking-tight truncate">
              {item.name}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded hover:bg-[#1f1f2c]"
            title="Close Inspector"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Deletion timestamps */}
        <div className="space-y-1 text-[11px] text-gray-400 border-b border-[#20202e] pb-3">
          <div>Deleted on {formatDeletedDate(item.deletedAt)}</div>
          <div className="flex items-center gap-1.5 text-purple-400 font-medium">
            <Clock className="w-3.5 h-3.5" />
            <span>Auto-deletes in {item.autoDeleteInDays ?? 29} days</span>
          </div>
        </div>

        {/* Metadata List matching screenshot */}
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between py-1 border-b border-[#1c1c28]">
            <span className="text-gray-400 flex items-center gap-1.5">
              <FileCheck className="w-3.5 h-3.5 text-gray-500" />
              Type
            </span>
            <span className="text-gray-200 font-medium capitalize">{item.type}</span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-[#1c1c28]">
            <span className="text-gray-400 flex items-center gap-1.5">
              <HardDrive className="w-3.5 h-3.5 text-gray-500" />
              Size
            </span>
            <span className="text-gray-200 font-mono text-[11px]">{item.sizeKb || '18.4 KB'}</span>
          </div>

          {!isFolder && (
            <div className="flex items-center justify-between py-1 border-b border-[#1c1c28]">
              <span className="text-gray-400 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-gray-500" />
                Words
              </span>
              <span className="text-gray-200 font-mono text-[11px]">{item.words || 1246}</span>
            </div>
          )}

          <div className="flex items-center justify-between py-1">
            <span className="text-gray-400 flex items-center gap-1.5">
              <FolderOpen className="w-3.5 h-3.5 text-gray-500" />
              Folder
            </span>
            <span className="text-gray-200">{item.originalLocation || '—'}</span>
          </div>
        </div>

        {/* Action Buttons matching screenshot */}
        <div className="space-y-2 pt-2 border-t border-[#20202e]">
          <button
            onClick={() => onRestore(item)}
            className="w-full py-2 px-3 rounded-[4px] bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 text-white font-semibold flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restore</span>
          </button>

          <button
            onClick={() => onDeletePermanently(item)}
            className="w-full py-2 px-3 rounded-[4px] bg-red-950/20 hover:bg-red-950/40 text-red-400 border border-red-500/40 font-medium flex items-center justify-center gap-2 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-400" />
            <span>Delete Permanently</span>
          </button>
        </div>

        {/* Read-only Preview Box matching screenshot */}
        <div className="pt-2 border-t border-[#20202e] space-y-2">
          <button
            type="button"
            onClick={() => setPreviewOpen(!previewOpen)}
            className="flex items-center gap-1 text-xs font-semibold text-gray-300 hover:text-white"
          >
            {previewOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            <span>Preview</span>
          </button>

          {previewOpen && (
            <div className="p-3 bg-[#171724] border border-[#262638] rounded-[4px] space-y-1.5 text-xs">
              <div className="font-semibold text-white truncate">{item.name}</div>
              <p className="text-[11px] text-gray-400 leading-relaxed max-h-36 overflow-y-auto obsidian-scrollbar">
                {item.preview || (isFolder ? `Folder containing ${item.noteCount || 0} notes.` : 'No preview available.')}
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

