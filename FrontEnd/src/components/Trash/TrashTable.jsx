import React, { useState } from 'react';
import {
  FileText,
  Folder,
  Clock,
  MoreHorizontal,
  RotateCcw,
  Trash2,
  Check
} from 'lucide-react';
import { TrashContextMenu } from './TrashContextMenu';

export const TrashTable = ({
  items = [],
  selectedItemId,
  onSelectItem,
  checkedItemIds = [],
  onToggleCheck,
  onToggleCheckAll,
  onRestoreItem,
  onDeletePermanently,
  onBulkRestore,
  onBulkDelete
}) => {
  const [activeMenuId, setActiveMenuId] = useState(null);

  const allVisibleChecked =
    items.length > 0 && items.every((item) => checkedItemIds.includes(item.id || item._id));

  const formatDeletedDate = (dateStr) => {
    if (!dateStr) return 'Nov 9, 2026, 11:24 AM';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }) + ', ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (items.length === 0) {
    return (
      <div className="bg-[#14141f] border border-[#232334] rounded-[5px] p-12 text-center text-xs text-gray-400 space-y-2 select-none">
        <Trash2 className="w-8 h-8 text-gray-600 mx-auto stroke-1" />
        <p className="text-gray-300 font-medium">Your Trash is empty</p>
        <p className="text-gray-500 text-[11px]">Deleted notes and folders will appear here for 30 days.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 select-none">
      {/* Contextual Bulk Action Bar */}
      {checkedItemIds.length > 0 && (
        <div className="flex items-center justify-between p-2.5 bg-[#1a1528] border border-purple-500/40 rounded-[4px] text-xs text-purple-200">
          <div className="flex items-center gap-2">
            <span className="font-semibold">{checkedItemIds.length}</span>
            <span>{checkedItemIds.length === 1 ? 'item selected' : 'items selected'}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onBulkRestore}
              className="px-2.5 py-1 rounded-[3px] bg-purple-900/40 hover:bg-purple-900/60 text-purple-300 border border-purple-500/30 flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restore Selected</span>
            </button>
            <button
              onClick={onBulkDelete}
              className="px-2.5 py-1 rounded-[3px] bg-red-950/40 hover:bg-red-950/60 text-red-300 border border-red-500/30 flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Permanently</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Table Container matching screenshot */}
      <div className="bg-[#14141f] border border-[#232334] rounded-[5px] overflow-hidden">
        <table className="w-full text-left text-xs border-collapse">
          {/* Header Row */}
          <thead>
            <tr className="border-b border-[#232334] text-[11px] text-gray-400 font-medium bg-[#13131d]">
              <th className="py-2.5 pl-3.5 pr-2 w-8">
                <input
                  type="checkbox"
                  checked={allVisibleChecked}
                  onChange={onToggleCheckAll}
                  className="rounded-[2px] bg-[#1a1a26] border-[#313144] accent-purple-600 cursor-pointer w-3.5 h-3.5"
                />
              </th>
              <th className="py-2.5 px-3">Name</th>
              <th className="py-2.5 px-3 w-24">Type</th>
              <th className="py-2.5 px-3 w-44">Deleted At</th>
              <th className="py-2.5 px-3 w-36">Auto Delete In</th>
              <th className="py-2.5 pr-3 pl-2 w-10 text-right"></th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-[#1e1e2d]">
            {items.map((item) => {
              const itemId = item.id || item._id;
              const isSelected = itemId === selectedItemId;
              const isChecked = checkedItemIds.includes(itemId);
              const isFolder = item.type === 'folder';

              return (
                <tr
                  key={itemId}
                  onClick={() => onSelectItem(item)}
                  className={`group cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-gradient-to-r from-purple-950/70 to-purple-900/35 border-l-2 border-purple-500 text-white'
                      : 'hover:bg-[#181824] text-gray-200'
                  }`}
                >
                  {/* Selection Checkbox */}
                  <td
                    className="py-3 pl-3.5 pr-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleCheck(itemId);
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => onToggleCheck(itemId)}
                      className="rounded-[2px] bg-[#1a1a26] border-[#313144] accent-purple-600 cursor-pointer w-3.5 h-3.5"
                    />
                  </td>

                  {/* Name & Content Preview */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-3">
                      {/* Icon */}
                      <div
                        className={`w-7 h-7 rounded-[4px] flex items-center justify-center shrink-0 ${
                          isFolder
                            ? item.color === 'blue'
                              ? 'bg-sky-950/50 text-sky-400 border border-sky-500/30'
                              : 'bg-amber-950/50 text-amber-400 border border-amber-500/30'
                            : 'bg-purple-950/50 text-purple-300 border border-purple-500/30'
                        }`}
                      >
                        {isFolder ? (
                          <Folder className="w-4 h-4 fill-current/20" />
                        ) : (
                          <FileText className="w-4 h-4" />
                        )}
                      </div>

                      {/* Title & Preview */}
                      <div className="min-w-0">
                        <div
                          className={`font-semibold truncate text-xs ${
                            isSelected ? 'text-white' : 'text-gray-200 group-hover:text-white'
                          }`}
                        >
                          {item.name}
                        </div>
                        <div className="text-[11px] text-gray-500 truncate max-w-sm mt-0.5">
                          {item.preview || (isFolder ? `Contains ${item.noteCount || 0} notes` : 'No text preview')}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Type Badge */}
                  <td className="py-3 px-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-[3px] text-[10px] font-medium uppercase tracking-wider ${
                        isFolder
                          ? 'bg-amber-950/40 text-amber-300 border border-amber-500/30'
                          : 'bg-[#1e1e2d] text-gray-300 border border-[#2b2b3d]'
                      }`}
                    >
                      {item.type === 'folder' ? 'Folder' : 'Note'}
                    </span>
                  </td>

                  {/* Deleted At */}
                  <td className="py-3 px-3 text-[11px] text-gray-400 font-mono">
                    {formatDeletedDate(item.deletedAt)}
                  </td>

                  {/* Auto Delete In */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1.5 text-[11px] text-gray-400 font-medium">
                      <Clock className="w-3 h-3 text-purple-400" />
                      <span>{item.autoDeleteInDays ?? 29} days</span>
                    </div>
                  </td>

                  {/* Actions Column (3-dots) */}
                  <td className="py-3 pr-3 pl-2 text-right relative">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuId(activeMenuId === itemId ? null : itemId);
                      }}
                      className="p-1 rounded text-gray-400 hover:text-white hover:bg-[#222232] transition-colors"
                      title="Options"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>

                    <TrashContextMenu
                      item={item}
                      isOpen={activeMenuId === itemId}
                      onClose={() => setActiveMenuId(null)}
                      onRestore={onRestoreItem}
                      onDeletePermanently={onDeletePermanently}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

