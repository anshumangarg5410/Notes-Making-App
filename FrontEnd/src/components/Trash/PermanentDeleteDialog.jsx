import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export const PermanentDeleteDialog = ({
  isOpen,
  item,
  onClose,
  onConfirm
}) => {
  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm select-none">
      <div className="w-full max-w-sm bg-[#161622] border border-[#2b2b3d] rounded-[5px] shadow-2xl overflow-hidden text-xs text-gray-200">
        <div className="px-5 py-3.5 border-b border-[#242436] flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold text-red-400 text-sm">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span>Permanently Delete</span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded hover:bg-[#202030]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-3">
          <p className="text-gray-300">
            Permanently delete <strong className="text-white">"{item.name}"</strong>?
          </p>

          <p className="p-2.5 bg-red-950/30 border border-red-500/30 rounded-[3px] text-red-300 text-[11px] leading-relaxed">
            This item will be removed permanently from the database and cannot be recovered.
          </p>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#242436]">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-[3px] text-gray-300 hover:text-white hover:bg-[#202030]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                onConfirm(item);
                onClose();
              }}
              className="px-4 py-1.5 rounded-[3px] bg-red-600 hover:bg-red-500 text-white font-semibold shadow-sm transition-colors"
            >
              Delete Permanently
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
