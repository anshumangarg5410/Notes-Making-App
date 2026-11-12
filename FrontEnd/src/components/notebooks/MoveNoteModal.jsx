import React, { useState } from 'react';
import { Book, Bookmark, ArrowRight, X, ChevronRight, ChevronDown } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const MoveNoteModal = ({
  isOpen,
  onClose,
  note,
  notebooks = [],
  onMoveNote
}) => {
  const { isDark } = useTheme();
  const [selectedNotebookId, setSelectedNotebookId] = useState(() => note?.notebookId || notebooks[0]?._id || '');
  const [selectedSectionId, setSelectedSectionId] = useState(() => note?.sectionId || '');
  const [expandedNotebooks, setExpandedNotebooks] = useState(() => ({
    [note?.notebookId || notebooks[0]?._id]: true
  }));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !note) return null;

  const toggleExpand = (nbId) => {
    setExpandedNotebooks((prev) => ({ ...prev, [nbId]: !prev[nbId] }));
  };

  const handleMoveSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSectionId) {
      setError('Please select a destination section');
      return;
    }

    const nb = notebooks.find((n) => (n._id || n.id) === selectedNotebookId);
    const sec = nb?.sections?.find((s) => (s._id || s.id) === selectedSectionId);

    setIsSubmitting(true);
    setError('');
    try {
      await onMoveNote(note._id || note.id, {
        notebookId: selectedNotebookId,
        sectionId: selectedSectionId,
        notebook: nb ? nb.name : '',
        section: sec ? sec.name : ''
      });
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to move note');
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
              <h3 className="font-semibold text-sm tracking-tight">Move Note</h3>
              <p className={`text-[11px] truncate max-w-[200px] ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                {note.title || 'Untitled Note'}
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
              Select Destination Section
            </label>

            <div className="space-y-1.5 max-h-56 overflow-y-auto obsidian-scrollbar">
              {notebooks.map((nb) => {
                const nbId = nb._id || nb.id;
                const isExpanded = Boolean(expandedNotebooks[nbId]);
                const sections = nb.sections || [];

                return (
                  <div key={nbId} className="rounded-xl border border-inherit overflow-hidden">
                    <button
                      type="button"
                      onClick={() => toggleExpand(nbId)}
                      className={`w-full flex items-center justify-between p-2 text-xs transition-colors cursor-pointer ${
                        isDark ? 'bg-[#181824] hover:bg-[#1e1e2e] text-gray-200' : 'bg-slate-50 hover:bg-slate-100 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        {isExpanded ? <ChevronDown className="w-3.5 h-3.5 text-gray-400" /> : <ChevronRight className="w-3.5 h-3.5 text-gray-400" />}
                        <Book className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                        <span className="font-medium truncate">{nb.name}</span>
                      </div>
                      <span className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-slate-400'}`}>
                        {sections.length} sections
                      </span>
                    </button>

                    {isExpanded && (
                      <div className="p-1 space-y-1 bg-inherit">
                        {sections.length === 0 ? (
                          <div className={`text-[11px] p-2 italic ${isDark ? 'text-gray-500' : 'text-slate-400'}`}>
                            No sections in this notebook
                          </div>
                        ) : (
                          sections.map((sec) => {
                            const secId = sec._id || sec.id;
                            const isSelected = selectedSectionId === secId;

                            return (
                              <button
                                key={secId}
                                type="button"
                                onClick={() => {
                                  setSelectedNotebookId(nbId);
                                  setSelectedSectionId(secId);
                                  setError('');
                                }}
                                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                                  isSelected
                                    ? isDark
                                      ? 'bg-pink-500/20 text-pink-300 font-semibold border border-pink-500/40'
                                      : 'bg-pink-50 text-pink-700 font-semibold border border-pink-300'
                                    : isDark
                                      ? 'text-gray-300 hover:bg-white/5'
                                      : 'text-slate-600 hover:bg-slate-100'
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <Bookmark className="w-3 h-3 text-pink-400 shrink-0" />
                                  <span>{sec.name}</span>
                                </div>
                                {isSelected && (
                                  <span className="text-[10px] text-pink-400">Selected</span>
                                )}
                              </button>
                            );
                          })
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
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
              disabled={isSubmitting || !selectedSectionId}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Moving...' : 'Move Note'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MoveNoteModal;

