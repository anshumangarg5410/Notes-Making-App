import React, { useState, useEffect, useCallback } from 'react';
import {
  History,
  X,
  Bookmark,
  Clock,
  ShieldAlert,
  RotateCcw,
  Eye,
  Plus,
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import versionService from '../../services/versionService';

export const VersionHistoryPanel = ({
  note,
  isOpen,
  onClose,
  onPreviewVersion,
  onExitPreview,
  previewVersionId,
  onRestoreVersion
}) => {
  const { isDark } = useTheme();
  const { success, error: toastError } = useToast();

  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isCreatingManual, setIsCreatingManual] = useState(false);
  const [manualNameInput, setManualNameInput] = useState('');
  const [showManualForm, setShowManualForm] = useState(false);

  // Restore confirmation modal state
  const [restoreCandidate, setRestoreCandidate] = useState(null);
  const [isRestoring, setIsRestoring] = useState(false);

  const noteId = note?._id || note?.id;

  // Load versions
  const loadVersions = useCallback(async () => {
    if (!noteId) return;
    setLoading(true);
    try {
      const res = await versionService.getVersions(noteId);
      if (res.data) {
        setVersions(res.data);
      }
    } catch (err) {
      console.warn('Failed to load version history:', err);
    } finally {
      setLoading(false);
    }
  }, [noteId]);

  useEffect(() => {
    if (isOpen && noteId) {
      loadVersions();
    }
  }, [isOpen, noteId, loadVersions]);

  // Handle manual snapshot creation
  const handleCreateManualVersion = async (e) => {
    e.preventDefault();
    if (!noteId) return;

    setIsCreatingManual(true);
    try {
      const res = await versionService.createManualVersion(noteId, {
        versionName: manualNameInput.trim() || 'Manual Snapshot',
        title: note.title,
        content: note.content,
        plainText: note.plainText,
        tags: note.tags,
        drawings: note.drawings
      });

      if (res.success && res.data) {
        success('Version snapshot saved');
        setManualNameInput('');
        setShowManualForm(false);
        await loadVersions();
      }
    } catch (err) {
      toastError(err.message || 'Failed to save version snapshot');
    } finally {
      setIsCreatingManual(false);
    }
  };

  // Handle restore confirmation
  const handleConfirmRestore = async () => {
    if (!restoreCandidate || !noteId) return;

    setIsRestoring(true);
    try {
      const res = await versionService.restoreVersion(noteId, restoreCandidate._id || restoreCandidate.id);
      if (res.success && res.data) {
        success('Note restored to selected version. Current state saved as pre-restore version.');
        if (onRestoreVersion) {
          await onRestoreVersion(res.data.note);
        }
        setRestoreCandidate(null);
        await loadVersions();
      }
    } catch (err) {
      toastError(err.message || 'Failed to restore version');
    } finally {
      setIsRestoring(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <aside
        className={`h-full border-l flex flex-col select-none text-xs w-80 min-w-[280px] max-w-[340px] transition-colors duration-150 z-30 ${
          isDark ? 'bg-[#151520] border-[#242436]' : 'bg-[#FAFAFD] border-[#EAE6F4]'
        }`}
      >
        {/* Header */}
        <div
          className={`h-11 border-b px-3.5 flex items-center justify-between transition-colors duration-150 ${
            isDark ? 'border-[#242436] bg-[#13131c]' : 'border-[#EAE6F4] bg-white'
          }`}
        >
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-pink-500/15 border border-pink-500/30 flex items-center justify-center text-pink-400">
              <History className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className={`font-semibold text-xs ${isDark ? 'text-gray-100' : 'text-[#181326]'}`}>
                Version History
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className={`p-1 rounded transition-colors ${
              isDark ? 'text-gray-400 hover:text-gray-200 hover:bg-[#20202e]' : 'text-[#6B7280] hover:text-[#181326] hover:bg-[#EAE6F4]'
            }`}
            title="Close Version History"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action bar: Save Version Now button */}
        <div className={`p-3 border-b space-y-2 ${isDark ? 'border-[#242436] bg-[#181826]' : 'border-[#EAE6F4] bg-[#F7F5FC]'}`}>
          {!showManualForm ? (
            <button
              type="button"
              onClick={() => setShowManualForm(true)}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-pink-600 hover:bg-pink-500 text-white font-medium text-xs shadow-sm transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Save Version Snapshot</span>
            </button>
          ) : (
            <form onSubmit={handleCreateManualVersion} className="space-y-2">
              <input
                type="text"
                value={manualNameInput}
                onChange={(e) => setManualNameInput(e.target.value)}
                placeholder="Version label (e.g. Draft 1)"
                maxLength={60}
                autoFocus
                className={`w-full px-2.5 py-1.5 rounded-lg border text-xs outline-none focus:border-pink-500 transition-colors ${
                  isDark ? 'bg-[#12121a] border-[#2b2b3d] text-white' : 'bg-white border-[#D1D5DB] text-gray-900'
                }`}
              />
              <div className="flex items-center justify-end gap-1.5">
                <button
                  type="button"
                  onClick={() => setShowManualForm(false)}
                  className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                    isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreatingManual}
                  className="px-3 py-1 rounded bg-pink-600 hover:bg-pink-500 text-white text-[11px] font-medium disabled:opacity-50 transition-colors flex items-center gap-1"
                >
                  {isCreatingManual && <Loader2 className="w-3 h-3 animate-spin" />}
                  <span>Save</span>
                </button>
              </div>
            </form>
          )}

          {previewVersionId && (
            <div className="pt-1 flex items-center justify-between text-[11px] text-pink-400">
              <span>Preview active</span>
              <button
                type="button"
                onClick={onExitPreview}
                className="underline hover:text-pink-300 cursor-pointer"
              >
                Exit preview
              </button>
            </div>
          )}
        </div>

        {/* Versions List */}
        <div className="flex-1 overflow-y-auto obsidian-scrollbar p-3 space-y-2">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400 space-y-2">
              <Loader2 className="w-5 h-5 animate-spin text-pink-400" />
              <span className="text-[11px]">Loading revisions...</span>
            </div>
          ) : versions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center text-gray-400 px-4 space-y-2">
              <History className="w-8 h-8 opacity-40 text-pink-400" />
              <p className="text-xs font-semibold text-gray-300">No versions yet</p>
              <p className="text-[11px] leading-relaxed">
                As you edit your note, automatic snapshots will be preserved here, or click "Save Version Snapshot" above.
              </p>
            </div>
          ) : (
            versions.map((ver) => {
              const versionId = ver._id || ver.id;
              const isSelected = previewVersionId === versionId;
              const createdDate = new Date(ver.createdAt);
              const formattedDate = createdDate.toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              });
              const formattedTime = createdDate.toLocaleTimeString(undefined, {
                hour: '2-digit',
                minute: '2-digit'
              });

              return (
                <div
                  key={versionId}
                  onClick={() => onPreviewVersion?.(ver)}
                  className={`cursor-pointer rounded-xl p-3 border transition-all duration-150 relative space-y-2 group ${
                    isSelected
                      ? 'bg-pink-500/10 border-pink-500/50 shadow-md ring-1 ring-pink-500/30'
                      : isDark
                      ? 'bg-[#191926] border-[#26263b] hover:border-[#383854]'
                      : 'bg-white border-[#EAE6F4] hover:border-[#D1C9E8]'
                  }`}
                >
                  {/* Top row: Type badge & Time */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase ${
                        ver.versionType === 'manual'
                          ? 'bg-pink-500/15 border border-pink-500/30 text-pink-400'
                          : ver.versionType === 'pre-restore'
                          ? 'bg-amber-500/15 border border-amber-500/30 text-amber-400'
                          : isDark
                          ? 'bg-purple-900/20 border border-purple-500/20 text-purple-300'
                          : 'bg-purple-50 border border-purple-200 text-purple-700'
                      }`}
                    >
                      {ver.versionType === 'manual' ? (
                        <>
                          <Bookmark className="w-2.5 h-2.5" />
                          <span>Manual</span>
                        </>
                      ) : ver.versionType === 'pre-restore' ? (
                        <>
                          <ShieldAlert className="w-2.5 h-2.5" />
                          <span>Pre-restore</span>
                        </>
                      ) : (
                        <>
                          <Clock className="w-2.5 h-2.5" />
                          <span>Auto</span>
                        </>
                      )}
                    </span>

                    <span className={`text-[10px] ${isDark ? 'text-gray-400' : 'text-[#6B7280]'}`}>
                      {formattedTime}
                    </span>
                  </div>

                  {/* Title or Version Name */}
                  <div>
                    {ver.versionName ? (
                      <h4 className={`text-xs font-semibold truncate ${isDark ? 'text-gray-100' : 'text-[#181326]'}`}>
                        {ver.versionName}
                      </h4>
                    ) : (
                      <h4 className={`text-xs font-medium truncate ${isDark ? 'text-gray-200' : 'text-[#181326]'}`}>
                        {ver.title || 'Untitled Note'}
                      </h4>
                    )}
                    <span className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                      {formattedDate} • {ver.wordCount || 0} words
                    </span>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center justify-between pt-1 border-t border-[#232336]/60">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isSelected) {
                          onExitPreview?.();
                        } else {
                          onPreviewVersion?.(ver);
                        }
                      }}
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                        isSelected
                          ? 'text-pink-400 hover:text-pink-300 font-semibold'
                          : isDark
                          ? 'text-gray-400 hover:text-gray-200 hover:bg-[#232336]'
                          : 'text-[#6B7280] hover:text-[#181326] hover:bg-[#F3F0F9]'
                      }`}
                    >
                      <Eye className="w-3 h-3" />
                      <span>{isSelected ? 'Exit Preview' : 'Preview'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setRestoreCandidate(ver);
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-pink-600/15 hover:bg-pink-600 hover:text-white text-pink-400 border border-pink-500/25 text-[11px] font-medium transition-all"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Restore</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </aside>

      {/* Confirmation Modal for Restoration */}
      {restoreCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-[#161726] border border-[#2b2d42] rounded-2xl p-6 text-white shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-pink-500/15 border border-pink-500/30 flex items-center justify-center text-pink-400">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">Restore Historical Version?</h3>
                <p className="text-xs text-gray-400">
                  From {new Date(restoreCandidate.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed">
              This will replace your current note content with the historical snapshot. A snapshot of your current state will be automatically created as a <strong>pre-restore</strong> version so nothing is ever lost.
            </p>

            <div className="p-3 rounded-xl bg-[#12131e] border border-[#232538] text-[11px] text-gray-400 space-y-1">
              <div><strong>Title:</strong> {restoreCandidate.title}</div>
              <div><strong>Word Count:</strong> {restoreCandidate.wordCount || 0} words</div>
              <div><strong>Version Type:</strong> {restoreCandidate.versionType}</div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setRestoreCandidate(null)}
                disabled={isRestoring}
                className="px-4 py-2 rounded-xl border border-[#2f3148] hover:bg-[#202235] text-xs font-medium text-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmRestore}
                disabled={isRestoring}
                className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-semibold shadow-lg shadow-pink-600/25 transition-all disabled:opacity-50 flex items-center gap-1.5"
              >
                {isRestoring && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Confirm Restore</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VersionHistoryPanel;

