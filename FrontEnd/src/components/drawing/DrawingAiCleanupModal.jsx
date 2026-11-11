import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import {
  Sparkles,
  X,
  Copy,
  Check,
  FileText,
  FileCode,
  Tag,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

export const DrawingAiCleanupModal = ({
  isOpen = false,
  onClose,
  data,
  previewImage,
  onInsertIntoNote
}) => {
  const { isDark } = useTheme();
  const { success, info } = useToast();
  const [activeTab, setActiveTab] = useState('formatted'); // 'formatted' | 'raw'
  const [copied, setCopied] = useState(false);

  if (!isOpen || !data) return null;

  const {
    title = 'Handwritten Notes',
    summary = '',
    contentMarkdown = '',
    recognizedText = '',
    detectedElements = [],
    lineCount = 1
  } = data;

  const handleCopy = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInsert = () => {
    if (onInsertIntoNote) {
      onInsertIntoNote(contentMarkdown || recognizedText, title);
      success('Inserted formatted notes into your document!');
      onClose();
    } else {
      handleCopy(contentMarkdown || recognizedText);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl shadow-2xl border overflow-hidden transition-all ${
          isDark
            ? 'bg-[#12121c] border-purple-500/30 text-gray-100 shadow-purple-950/50'
            : 'bg-white border-purple-200 text-stone-900 shadow-purple-200/50'
        }`}
      >
        {/* Modal Header */}
        <div
          className={`px-5 py-4 border-b flex items-center justify-between shrink-0 ${
            isDark ? 'bg-[#181826] border-[#26263a]' : 'bg-[#FAF8FD] border-purple-100'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-purple-900/40 shrink-0">
              <Sparkles className="w-4 h-4 text-purple-200 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base tracking-tight">{title}</h3>
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Smart Ink AI
                </span>
              </div>
              <p className={`text-xs mt-0.5 line-clamp-1 ${isDark ? 'text-gray-400' : 'text-stone-500'}`}>
                {summary || 'Gemini AI handwriting recognition and structural analysis'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isDark
                ? 'text-gray-400 hover:text-white hover:bg-white/10'
                : 'text-stone-500 hover:text-stone-900 hover:bg-purple-100/70'
            }`}
            title="Close preview"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Detected Tags Bar */}
        {detectedElements.length > 0 && (
          <div
            className={`px-5 py-2 border-b flex items-center gap-2 overflow-x-auto text-xs shrink-0 ${
              isDark ? 'bg-[#151522] border-[#222234]' : 'bg-[#F6F3FC] border-purple-50'
            }`}
          >
            <span className={`text-[11px] font-medium flex items-center gap-1 ${isDark ? 'text-gray-400' : 'text-stone-500'}`}>
              <Tag className="w-3 h-3 text-purple-400" /> Detected:
            </span>
            {detectedElements.map((elem, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded-md text-[11px] font-medium capitalize bg-purple-500/15 text-purple-300 border border-purple-500/20 shrink-0"
              >
                {elem.replace(/_/g, ' ')}
              </span>
            ))}
          </div>
        )}

        {/* Modal Body: Content Preview */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Side-by-Side View on Larger Screens: Sketch Thumbnail + Result */}
          <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-4 items-start">
            {/* Sketch Thumbnail */}
            {previewImage && (
              <div
                className={`p-2 rounded-xl border flex flex-col gap-1.5 ${
                  isDark ? 'bg-[#181826] border-[#26263a]' : 'bg-[#FAF8FD] border-purple-100'
                }`}
              >
                <span className={`text-[11px] font-semibold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-stone-500'}`}>
                  Original Sketch
                </span>
                <div className="w-full aspect-[4/3] rounded-lg overflow-hidden bg-black/30 border border-white/5 flex items-center justify-center">
                  <img
                    src={previewImage}
                    alt="Handwritten sketch"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            )}

            {/* Recognized Content Pane */}
            <div className="flex flex-col flex-1 min-w-0">
              {/* Tab Selector */}
              <div className="flex items-center gap-2 mb-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('formatted')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                    activeTab === 'formatted'
                      ? 'bg-purple-600 text-white shadow-sm shadow-purple-900/30'
                      : isDark
                      ? 'text-gray-400 hover:text-white hover:bg-white/5'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-purple-50'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Formatted Notes</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('raw')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                    activeTab === 'raw'
                      ? 'bg-purple-600 text-white shadow-sm shadow-purple-900/30'
                      : isDark
                      ? 'text-gray-400 hover:text-white hover:bg-white/5'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-purple-50'
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5" />
                  <span>Plain Text</span>
                </button>
              </div>

              {/* Text Area */}
              <div
                className={`p-4 rounded-xl border font-sans text-xs sm:text-sm leading-relaxed overflow-x-auto min-h-[160px] max-h-[360px] whitespace-pre-wrap select-text ${
                  isDark
                    ? 'bg-[#161624] border-[#29293e] text-gray-200'
                    : 'bg-[#FBF9FD] border-[#E8E4F2] text-stone-800'
                }`}
              >
                {activeTab === 'formatted'
                  ? contentMarkdown || recognizedText || 'No text recognized.'
                  : recognizedText || contentMarkdown || 'No plain text available.'}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div
          className={`px-5 py-3.5 border-t flex flex-wrap items-center justify-between gap-3 shrink-0 ${
            isDark ? 'bg-[#181826] border-[#26263a]' : 'bg-[#FAF8FD] border-purple-100'
          }`}
        >
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleCopy(contentMarkdown || recognizedText)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                isDark
                  ? 'bg-[#1a1a28] border-[#2c2c42] text-gray-300 hover:text-white hover:bg-[#242438]'
                  : 'bg-white border-purple-200 text-stone-700 hover:text-stone-900 hover:bg-purple-50'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-purple-400" />
                  <span>Copy Markdown</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                isDark ? 'text-gray-400 hover:text-white' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Keep Drawing
            </button>

            <button
              type="button"
              onClick={handleInsert}
              className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium text-xs shadow-md shadow-purple-900/40 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <span>{onInsertIntoNote ? 'Insert into Note' : 'Apply Content'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DrawingAiCleanupModal;

