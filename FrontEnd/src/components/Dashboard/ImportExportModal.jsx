import React, { useState } from 'react';
import { Upload, Download, X, FileText, Check } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const ImportExportModal = ({
  isOpen,
  onClose,
  initialMode = 'import', // 'import' | 'export'
  notes = [],
  onImportNote
}) => {
  const [mode, setMode] = useState(initialMode);
  const [importTitle, setImportTitle] = useState('');
  const [importContent, setImportContent] = useState('');
  const [importTags, setImportTags] = useState('Imported');
  const { success, error: toastError } = useToast();

  if (!isOpen) return null;

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const titleFromName = file.name.replace(/\.[^/.]+$/, '');
    setImportTitle(titleFromName);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      setImportContent(text);
    };
    reader.readAsText(file);
  };

  const handleImportSubmit = (e) => {
    e.preventDefault();
    if (!importContent.trim()) {
      toastError('Please choose a file or paste content to import.');
      return;
    }

    const tagsArray = importTags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    if (onImportNote) {
      onImportNote({
        title: importTitle || 'Imported Note',
        plainText: importContent,
        tags: tagsArray
      });
    }

    success('Note imported successfully!');
    setImportTitle('');
    setImportContent('');
    onClose();
  };

  const handleExportDownload = (format = 'json') => {
    let dataStr = '';
    let fileName = `notenest-backup-${new Date().toISOString().slice(0, 10)}`;

    if (format === 'json') {
      dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(notes, null, 2));
      fileName += '.json';
    } else {
      // Export as bundled Markdown
      const mdContent = notes
        .map(
          (n) => `# ${n.title || 'Untitled'}\n\nTags: ${(n.tags || []).join(', ')}\n\n${n.plainText || ''}\n\n---\n`
        )
        .join('\n');
      dataStr = 'data:text/markdown;charset=utf-8,' + encodeURIComponent(mdContent);
      fileName += '.md';
    }

    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', fileName);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    success(`Exported ${notes.length} notes as ${format.toUpperCase()}!`);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-lg rounded-[5px] p-6 bg-[#1b1429] border border-purple-500/30 text-white shadow-2xl animate-in zoom-in-95 duration-150 select-none">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-purple-500/20 mb-4">
          <div className="flex items-center gap-2">
            {mode === 'import' ? (
              <div className="w-8 h-8 rounded-[3px] bg-purple-900/50 border border-purple-500/30 flex items-center justify-center text-purple-300">
                <Upload className="w-4 h-4" />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-[3px] bg-purple-900/50 border border-purple-500/30 flex items-center justify-center text-purple-300">
                <Download className="w-4 h-4" />
              </div>
            )}
            <h3 className="font-bold text-base text-white">
              {mode === 'import' ? 'Import Notes' : 'Export Notes'}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {/* Mode Toggle */}
            <div className="flex items-center bg-[#120d1c] p-1 rounded-[3px] border border-purple-500/20 text-xs">
              <button
                type="button"
                onClick={() => setMode('import')}
                className={`px-3 py-1 rounded-[3px] font-medium transition-colors ${
                  mode === 'import' ? 'bg-purple-600 text-white' : 'text-stone-400 hover:text-white'
                }`}
              >
                Import
              </button>
              <button
                type="button"
                onClick={() => setMode('export')}
                className={`px-3 py-1 rounded-[3px] font-medium transition-colors ${
                  mode === 'export' ? 'bg-purple-600 text-white' : 'text-stone-400 hover:text-white'
                }`}
              >
                Export
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-[3px] text-stone-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {mode === 'import' ? (
          <form onSubmit={handleImportSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-purple-200 mb-1.5">
                Choose Markdown or Text File (.md, .txt)
              </label>
              <input
                type="file"
                accept=".md,.txt,.markdown"
                onChange={handleFileUpload}
                className="w-full text-xs text-stone-300 file:mr-3 file:py-2 file:px-4 file:rounded-[3px] file:border-0 file:text-xs file:font-semibold file:bg-purple-900/60 file:text-purple-200 hover:file:bg-purple-800 cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-purple-200 mb-1.5">
                Note Title
              </label>
              <input
                type="text"
                required
                placeholder="Title for the imported note"
                value={importTitle}
                onChange={(e) => setImportTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-[3px] text-xs sm:text-sm bg-[#120d1c] border border-purple-500/30 text-white placeholder-purple-300/40 outline-none focus:border-purple-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-purple-200 mb-1.5">
                Tags (comma separated)
              </label>
              <input
                type="text"
                placeholder="e.g. Projects, Documentation"
                value={importTags}
                onChange={(e) => setImportTags(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-[3px] text-xs sm:text-sm bg-[#120d1c] border border-purple-500/30 text-white placeholder-purple-300/40 outline-none focus:border-purple-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-purple-200 mb-1.5">
                Content Preview
              </label>
              <textarea
                rows={4}
                value={importContent}
                onChange={(e) => setImportContent(e.target.value)}
                placeholder="File contents will appear here or you can paste directly..."
                className="w-full px-3.5 py-2.5 rounded-[3px] text-xs bg-[#120d1c] border border-purple-500/30 text-stone-300 outline-none focus:border-purple-400 font-mono"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-[3px] text-xs font-semibold text-stone-300 hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-[3px] text-xs font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 border border-purple-400/40 text-white shadow-md hover:from-purple-500 hover:to-indigo-500 transition-all cursor-pointer"
              >
                Import Note
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4 py-2">
            <p className="text-xs text-stone-300">
              Download your knowledge archive. You have <span className="font-bold text-white">{notes.length} notes</span> available to export.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleExportDownload('json')}
                className="p-4 rounded-[4px] bg-[#140e21] border border-purple-500/25 hover:border-purple-400/60 hover:bg-[#1f1533] text-left transition-all cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-[3px] bg-purple-950 flex items-center justify-center text-purple-300 mb-2">
                  <FileText className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-white">Full JSON Backup</h4>
                <p className="text-[11px] text-stone-400 mt-0.5">Includes metadata, folders & tags.</p>
              </button>

              <button
                type="button"
                onClick={() => handleExportDownload('md')}
                className="p-4 rounded-[4px] bg-[#140e21] border border-purple-500/25 hover:border-purple-400/60 hover:bg-[#1f1533] text-left transition-all cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-[3px] bg-indigo-950 flex items-center justify-center text-indigo-300 mb-2">
                  <Download className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-white">Markdown Bundle</h4>
                <p className="text-[11px] text-stone-400 mt-0.5">Readable .md files for Obsidian / Typora.</p>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImportExportModal;

