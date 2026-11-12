import React, { useState } from 'react';
import { Book, ArrowRight, X } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const MoveSectionModal = ({
  isOpen,
  onClose,
  section,
  notebooks = [],
  onMove
}) => {
  const { isDark } = useTheme();
  const currentNotebookId = section?.notebookId?._id || section?.notebookId;
  const availableNotebooks = notebooks.filter(
    (nb) => (nb._id || nb.id) !== currentNotebookId
  );
  const [selectedNotebookId, setSelectedNotebookId] = useState(() =>
    availableNotebooks[0]?._id || availableNotebooks[0]?.id || ''
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !section) return null;

  const handleMoveSubmit = async (e) => {
    e.preventDefault();
    if (!selectedNotebookId) {
      setError('Please select a destination notebook');
      return;
    }

    setIsSubmitting(true);
    setError('');
    try {
      await onMove(section._id || section.id, selectedNotebookId);
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to move section');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className={`w-full max-w-sm rounded-2xl border shadow-2xl overflow-hidden transition-all ${
          isDark
            ? 'bg-[#12121a] border-[#222230] text-gray-100 shadow-purple-950/20'
            : 'bg-white border-[#EAE6F4] text-slate-800 shadow-purple-200/40'
        }`}
      >
        <div
          className={`px-5 py-4 border-b flex items-center justify-between ${
            isDark ? 'border-[#222230] bg-[#161622]' : 'border-[#EAE6F4] bg-[#FAF8FD]'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-pink-500/15 border border-pink-500/30 text-pink-400 flex items-center justify-center">
              <ArrowRight className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-sm tracking-tight">Move Section</h3>
              <p className={`text-[11px] truncate max-w-[200px] ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                {section.name}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className={`p-1 rounded-lg transition-colors cursor-pointer ${
              isDark ? 'text-gray-400 hover:text-white hover:bg-white/10' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleMoveSubmit} className="p-5 space-y-4">
          {error && (
            <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
              {error}
            </div>
          )}

          <div>
            <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
              Select Destination Notebook
            </label>

            {availableNotebooks.length === 0 ? (
              <p className={`text-xs p-3 rounded-xl border ${isDark ? 'border-[#262638] text-gray-400' : 'border-slate-200 text-slate-500'}`}>
                No other notebooks available. Please create another notebook first.
              </p>
            ) : (
              <div className="space-y-1.5 max-h-48 overflow-y-auto obsidian-scrollbar">
                {availableNotebooks.map((nb) => {
                  const nbId = nb._id || nb.id;
                  const isSelected = selectedNotebookId === nbId;
                  return (
                    <button
                      key={nbId}
                      type="button"
                      onClick={() => setSelectedNotebookId(nbId)}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-xs transition-all cursor-pointer ${
                        isSelected
                          ? isDark
                            ? 'bg-pink-500/15 border-pink-500/50 text-pink-300 font-medium'
                            : 'bg-pink-50 border-pink-400 text-pink-700 font-semibold'
                          : isDark
                            ? 'border-[#262638] text-gray-300 hover:bg-white/5'
                            : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Book className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                        <span className="truncate">{nb.name}</span>
                      </div>
                      <span className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-slate-400'}`}>
                        {nb.sectionCount || nb.sections?.length || 0} sections
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-inherit">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                isDark ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || availableNotebooks.length === 0}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Moving...' : 'Move Section'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MoveSectionModal;

