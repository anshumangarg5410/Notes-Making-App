import React from 'react';
import { Eye, RotateCcw, X, ShieldAlert, Bookmark, Clock } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const VersionPreviewBanner = ({
  version,
  onExitPreview,
  onRestore
}) => {
  const { isDark } = useTheme();

  if (!version) return null;

  const createdDate = new Date(version.createdAt);
  const formattedDate = createdDate.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div
      className={`px-4 py-2.5 border-b flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 select-none transition-colors ${
        isDark
          ? 'bg-pink-950/25 border-pink-500/30 text-white'
          : 'bg-pink-50/80 border-pink-200 text-gray-900'
      }`}
    >
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-pink-500/20 border border-pink-500/30 flex items-center justify-center text-pink-400 shrink-0">
          <Eye className="w-4 h-4" />
        </div>
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-pink-400">Viewing Historical Version</span>
            <span
              className={`inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-semibold uppercase tracking-wider ${
                version.versionType === 'manual'
                  ? 'bg-pink-500/20 text-pink-300'
                  : version.versionType === 'pre-restore'
                  ? 'bg-amber-500/20 text-amber-300'
                  : 'bg-purple-500/20 text-purple-300'
              }`}
            >
              {version.versionType === 'manual' ? (
                <>
                  <Bookmark className="w-2.5 h-2.5" />
                  <span>Manual</span>
                </>
              ) : version.versionType === 'pre-restore' ? (
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
            <span className={`text-[11px] ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              • Created {formattedDate}
            </span>
          </div>
          <p className={`text-[11px] ${isDark ? 'text-gray-400' : 'text-gray-500'} leading-tight`}>
            Preview mode is read-only. Your current active note content remains safely preserved.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
        <button
          type="button"
          onClick={onRestore}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-pink-600 hover:bg-pink-500 text-white text-xs font-semibold shadow-sm transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Restore this version</span>
        </button>

        <button
          type="button"
          onClick={onExitPreview}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
            isDark
              ? 'border-[#2d2e42] bg-[#1a1b2a] hover:bg-[#232438] text-gray-300'
              : 'border-gray-300 bg-white hover:bg-gray-100 text-gray-700'
          }`}
        >
          <X className="w-3.5 h-3.5" />
          <span>Exit Preview</span>
        </button>
      </div>
    </div>
  );
};

export default VersionPreviewBanner;

