import React from 'react';
import { AlertTriangle } from 'lucide-react';

export const ConfirmDialog = ({
  isOpen,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDanger = false,
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-warm-card dark:bg-charcoal-800 border border-warm-border dark:border-charcoal-700 w-full max-w-sm rounded-2xl shadow-dropdown p-6 space-y-4">
        <div className="flex items-center space-x-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
              isDanger
                ? 'bg-red-100 dark:bg-red-950/40 text-red-600'
                : 'bg-terracotta-100 dark:bg-terracotta-900/40 text-terracotta-600'
            }`}
          >
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h3 className="font-serif font-bold text-base text-charcoal-900 dark:text-cream-50">
            {title}
          </h3>
        </div>

        <p className="text-xs leading-relaxed text-charcoal-500 dark:text-charcoal-400">
          {message}
        </p>

        <div className="flex items-center justify-end space-x-2 pt-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-warm-border dark:border-charcoal-600 text-charcoal-600 dark:text-cream-200 rounded-xl text-xs font-medium hover:bg-cream-100 dark:hover:bg-charcoal-700 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-white rounded-xl text-xs font-medium shadow-sm transition-colors ${
              isDanger
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-terracotta-500 hover:bg-terracotta-600'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
