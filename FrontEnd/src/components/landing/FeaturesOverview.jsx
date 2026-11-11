import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  PenLine,
  Folder,
  Tag,
  Search,
  Cloud,
  ArrowDownToLine,
  Check,
  Star,
  CheckSquare,
  Square,
  FileText,
  BookOpen,
  ChevronDown,
  ChevronRight,
  X,
  RotateCw,
  Download,
  CheckCircle2,
  Copy,
  FolderPlus
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const FeaturesOverview = () => {
  const { isDark } = useTheme();

  // =========================================================================
  // CARD 1: Rich Text Editor Interactive State
  // =========================================================================
  const [editorFormatting, setEditorFormatting] = useState({
    bold: true,
    italic: false,
    underline: false,
    heading: 'H2',
    code: true
  });
  const [checklist, setChecklist] = useState([
    { id: 1, text: 'Design the architecture', done: true },
    { id: 2, text: 'Implement the API', done: false },
    { id: 3, text: 'Enable Offline Dexie sync', done: true }
  ]);
  const [copiedCode, setCopiedCode] = useState(false);

  const toggleFormatting = (type) => {
    if (type === 'H1' || type === 'H2') {
      setEditorFormatting((prev) => ({
        ...prev,
        heading: prev.heading === type ? 'body' : type
      }));
    } else {
      setEditorFormatting((prev) => ({
        ...prev,
        [type]: !prev[type]
      }));
    }
  };

  const toggleChecklistItem = (id) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    );
  };

  const handleCopySnippet = () => {
    const snippet = `const note = {\n  title: 'NoteNest',\n  offline: true\n};`;
    navigator.clipboard?.writeText(snippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 1800);
  };

  // =========================================================================
  // CARD 2: Tags & Favorites Interactive State
  // =========================================================================
  const initialTags = ['DSA', 'React', 'System Design', 'Notes', 'Architecture', 'TypeScript'];
  const [selectedTags, setSelectedTags] = useState(['DSA', 'React']);
  const [isFavoriteActive, setIsFavoriteActive] = useState(true);

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // =========================================================================
  // CARD 3: Offline-First & Sync Interactive State
  // =========================================================================
  const [syncStatus, setSyncStatus] = useState('synced'); // 'synced' | 'syncing' | 'offline'
  const [lastSyncTime, setLastSyncTime] = useState('Just now');

  const triggerSync = () => {
    if (syncStatus === 'offline') {
      setSyncStatus('syncing');
      setTimeout(() => {
        setSyncStatus('synced');
        setLastSyncTime('Just now');
      }, 1200);
    } else if (syncStatus === 'synced') {
      setSyncStatus('offline');
    }
  };

  const handleSyncButton = (e) => {
    e.stopPropagation();
    setSyncStatus('syncing');
    setTimeout(() => {
      setSyncStatus('synced');
      setLastSyncTime('Just now');
    }, 1100);
  };

  // =========================================================================
  // CARD 4: Folders & Nested Folders Interactive State
  // =========================================================================
  const [isProjectsOpen, setIsProjectsOpen] = useState(true);
  const [isCollegeOpen, setIsCollegeOpen] = useState(false);
  const [selectedFolderItem, setSelectedFolderItem] = useState('NoteNest');

  // =========================================================================
  // CARD 5: Powerful Search Interactive State
  // =========================================================================
  const [searchQuery, setSearchQuery] = useState('database');
  const allSearchNotes = useMemo(
    () => [
      {
        id: 1,
        title: 'DBMS Notes',
        snippet: '... database normalization, BCNF, ACID transactions ...',
        tags: ['database', 'dbms']
      },
      {
        id: 2,
        title: 'SQL Queries',
        snippet: '... joins, indexes, database query optimization ...',
        tags: ['database', 'sql']
      },
      {
        id: 3,
        title: 'System Design',
        snippet: '... database scaling strategies, sharding, caching ...',
        tags: ['database', 'system-design']
      },
      {
        id: 4,
        title: 'NoteNest Architecture',
        snippet: '... offline-first client architecture with Dexie IndexedDB ...',
        tags: ['architecture', 'notenest']
      },
      {
        id: 5,
        title: 'API Gateway Specs',
        snippet: '... reverse proxy, rate limiting, token authentication ...',
        tags: ['api', 'backend']
      }
    ],
    []
  );

  const filteredNotes = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return allSearchNotes;
    return allSearchNotes.filter(
      (note) =>
        note.title.toLowerCase().includes(q) ||
        note.snippet.toLowerCase().includes(q) ||
        note.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [searchQuery, allSearchNotes]);

  // Helper to highlight matching text in search results
  const renderHighlightedText = (text, query) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={i} className="text-purple-400 font-bold bg-purple-500/20 px-0.5 rounded">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  // =========================================================================
  // CARD 6: Import & Export Interactive State
  // =========================================================================
  const [exportNotice, setExportNotice] = useState(null);

  const handleExportMarkdown = () => {
    const mdContent = `# NoteNest - Project Planning
Created with NoteNest

## Overview
A powerful, distraction-free knowledge workspace built for modern thinking.

## Key Features
- [x] Advanced Rich Text Editor
- [x] Folders & Nested Folders
- [x] Tags & Favorites
- [x] Offline-First with Dexie
- [x] Powerful Search
- [x] Import & Export (Markdown & PDF)

\`\`\`javascript
const note = {
  title: 'NoteNest',
  offline: true,
  storage: 'Dexie + MongoDB'
};
\`\`\`
`;
    const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'NoteNest-Project-Planning.md');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setExportNotice('NoteNest-Project-Planning.md downloaded!');
    setTimeout(() => setExportNotice(null), 3000);
  };

  const handleExportPDF = () => {
    setExportNotice('Preparing PDF document export...');
    setTimeout(() => {
      setExportNotice('PDF document ready for export!');
      setTimeout(() => setExportNotice(null), 3000);
    }, 1000);
  };

  return (
    <section
      id="features"
      className="relative w-full pt-6 pb-20 sm:pt-8 sm:pb-24 lg:pt-10 lg:pb-28 px-4 sm:px-6 lg:px-8 select-none overflow-hidden transition-colors duration-300 bg-transparent text-white scroll-mt-24 sm:scroll-mt-28 lg:scroll-mt-32"
    >
      {/* Background Ambience & Lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Upper center purple radial glow */}
        <div
          className={`absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] sm:w-[950px] h-[550px] rounded-full blur-[140px] transition-opacity duration-500 ${
            isDark ? 'bg-purple-600/20 opacity-100' : 'bg-purple-400/15 opacity-80'
          }`}
        />
        {/* Top-right moon illumination */}
        <div
          className={`absolute top-8 right-12 w-48 h-48 rounded-full blur-[90px] transition-opacity duration-500 ${
            isDark ? 'bg-fuchsia-600/15 opacity-70' : 'bg-purple-300/25 opacity-60'
          }`}
        />
        {/* Bottom landscape mist */}
        <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-transparent to-transparent pointer-events-none" />
      </div>

      <div className="max-w-[1440px] mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 lg:mb-20">
          {/* Badge */}
          <div
            className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold mb-4 border transition-colors ${
              isDark
                ? 'border-purple-500/40 bg-purple-950/40 text-purple-300 shadow-[0_0_14px_rgba(168,85,247,0.3)]'
                : 'border-purple-300 bg-purple-50 text-purple-700 shadow-sm'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
            <span>Interactive Features</span>
          </div>

          {/* Main Title */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
            A Complete Knowledge Workspace{' '}
            <span className="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent">
              Built for Modern Thinking
            </span>
          </h2>

          {/* Subtitle */}
          <p
            className={`mt-4 text-sm sm:text-base lg:text-lg leading-relaxed ${
              isDark ? 'text-gray-300/80' : 'text-slate-600'
            }`}
          >
            Write, organize, search and access your notes anywhere — online or offline. Try the interactive preview cards below!
          </p>
        </div>

        {/* ============================================================== */}
        {/* FEATURE CARDS GRID                                           */}
        {/* ============================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
          {/* ======================================================= */}
          {/* LEFT COLUMN: 3 Feature Panels                          */}
          {/* ======================================================= */}
          <div className="space-y-6 lg:space-y-7 relative z-10">
            {/* PANEL 1: Advanced Rich Text Editor */}
            <div
              className={`group relative rounded-[8px] p-5 sm:p-6 transition-all duration-300 border backdrop-blur-md ${
                isDark
                  ? 'border-purple-500/35 bg-[#120a22]/85 hover:border-purple-400 hover:shadow-[0_0_30px_rgba(168,85,247,0.25)]'
                  : 'border-purple-200 bg-white/95 hover:border-purple-400 hover:shadow-[0_8px_30px_rgba(147,51,234,0.1)]'
              }`}
            >
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
                {/* Left Description Area */}
                <div className="sm:col-span-6 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-[6px] bg-gradient-to-br from-purple-600 to-indigo-600 border border-purple-400/40 text-white flex items-center justify-center shadow-[0_0_12px_rgba(168,85,247,0.4)]">
                      <PenLine className="w-4 h-4" />
                    </div>
                    <h3
                      className={`text-sm sm:text-base font-bold tracking-tight leading-snug ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      Advanced
                      <br />
                      Rich Text Editor
                    </h3>
                  </div>

                  <p className={`text-xs leading-relaxed ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>
                    A powerful, distraction-free editor for notes, docs and knowledge.
                  </p>

                  <ul className="space-y-1.5 pt-1 text-[11px]">
                    <li className={`flex items-center gap-2 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                      <span className="w-4 h-4 rounded bg-purple-600/35 text-purple-300 flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5" />
                      </span>
                      <span>Rich formatting &amp; headings</span>
                    </li>
                    <li className={`flex items-center gap-2 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                      <span className="w-4 h-4 rounded bg-purple-600/35 text-purple-300 flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5" />
                      </span>
                      <span>Code blocks with syntax highlight</span>
                    </li>
                    <li className={`flex items-center gap-2 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                      <span className="w-4 h-4 rounded bg-purple-600/35 text-purple-300 flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5" />
                      </span>
                      <span>Tables, checklists and more</span>
                    </li>
                  </ul>
                </div>

                {/* Right Interactive Preview Widget */}
                <div className="sm:col-span-6">
                  <div
                    className={`rounded-[6px] border p-3 text-xs shadow-inner overflow-hidden font-sans ${
                      isDark ? 'border-purple-500/25 bg-[#170e2b]' : 'border-purple-200/80 bg-[#f8f5fc]'
                    }`}
                  >
                    {/* Window Title Bar */}
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-purple-500/15 text-[10px]">
                      <span className="font-semibold text-purple-400">NoteNest Editor</span>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-red-500/80" />
                        <span className="w-2 h-2 rounded-full bg-amber-500/80" />
                        <span className="w-2 h-2 rounded-full bg-emerald-500/80" />
                      </div>
                    </div>

                    {/* Interactive Toolbar */}
                    <div className="flex items-center gap-1 text-[10px] pb-2 mb-2 border-b border-purple-500/15 text-gray-400">
                      <button
                        type="button"
                        onClick={() => toggleFormatting('bold')}
                        title="Toggle Bold"
                        className={`px-1.5 py-0.5 rounded transition-colors font-bold ${
                          editorFormatting.bold
                            ? 'bg-purple-600 text-white shadow-xs'
                            : 'text-gray-300 hover:bg-purple-950/50'
                        }`}
                      >
                        B
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleFormatting('italic')}
                        title="Toggle Italic"
                        className={`px-1.5 py-0.5 rounded transition-colors italic ${
                          editorFormatting.italic
                            ? 'bg-purple-600 text-white shadow-xs'
                            : 'text-gray-300 hover:bg-purple-950/50'
                        }`}
                      >
                        I
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleFormatting('underline')}
                        title="Toggle Underline"
                        className={`px-1.5 py-0.5 rounded transition-colors underline ${
                          editorFormatting.underline
                            ? 'bg-purple-600 text-white shadow-xs'
                            : 'text-gray-300 hover:bg-purple-950/50'
                        }`}
                      >
                        U
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleFormatting('H1')}
                        title="Heading 1"
                        className={`px-1.5 py-0.5 rounded transition-colors font-semibold ${
                          editorFormatting.heading === 'H1'
                            ? 'bg-purple-600 text-white shadow-xs'
                            : 'text-gray-300 hover:bg-purple-950/50'
                        }`}
                      >
                        H1
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleFormatting('H2')}
                        title="Heading 2"
                        className={`px-1.5 py-0.5 rounded transition-colors font-semibold ${
                          editorFormatting.heading === 'H2'
                            ? 'bg-purple-600 text-white shadow-xs'
                            : 'text-gray-300 hover:bg-purple-950/50'
                        }`}
                      >
                        H2
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleFormatting('code')}
                        title="Toggle Code View"
                        className={`px-1.5 py-0.5 rounded transition-colors ${
                          editorFormatting.code
                            ? 'bg-purple-600 text-white shadow-xs'
                            : 'text-purple-400 hover:bg-purple-950/50'
                        }`}
                      >
                        &lt;/&gt;
                      </button>
                    </div>

                    {/* Content Preview */}
                    <div className="space-y-1.5 text-[11px]">
                      <p
                        className={`transition-all ${
                          editorFormatting.heading === 'H1'
                            ? 'text-sm font-extrabold text-purple-300'
                            : editorFormatting.heading === 'H2'
                            ? 'text-xs font-bold'
                            : 'text-[11px] font-medium'
                        } ${editorFormatting.bold ? 'font-bold' : 'font-normal'} ${
                          editorFormatting.italic ? 'italic' : ''
                        } ${editorFormatting.underline ? 'underline decoration-purple-400' : ''} ${
                          isDark ? 'text-white' : 'text-slate-900'
                        }`}
                      >
                        Project Planning
                      </p>

                      {/* Interactive Checkboxes */}
                      <div className="space-y-1">
                        {checklist.map((item) => (
                          <div
                            key={item.id}
                            onClick={() => toggleChecklistItem(item.id)}
                            className={`flex items-center gap-1.5 text-[10.5px] cursor-pointer select-none py-0.5 px-1 rounded transition-colors ${
                              isDark ? 'hover:bg-purple-950/40' : 'hover:bg-purple-100/50'
                            }`}
                          >
                            {item.done ? (
                              <CheckSquare className="w-3 h-3 text-purple-400 shrink-0" />
                            ) : (
                              <Square className="w-3 h-3 text-gray-500 shrink-0" />
                            )}
                            <span
                              className={`${
                                item.done
                                  ? 'line-through text-gray-400 dark:text-gray-400'
                                  : isDark
                                  ? 'text-gray-200'
                                  : 'text-slate-800 font-medium'
                              }`}
                            >
                              {item.text}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Code Block Snippet (Toggled by code button) */}
                      {editorFormatting.code && (
                        <div
                          onClick={handleCopySnippet}
                          title="Click to copy snippet"
                          className={`mt-2 p-2 rounded border font-mono text-[9.5px] leading-snug cursor-pointer group/code relative ${
                            isDark
                              ? 'bg-[#0e071c] border-purple-500/20 text-purple-300 hover:border-purple-400/50'
                              : 'bg-white border-purple-200 text-purple-800 hover:border-purple-300'
                          }`}
                        >
                          <div className="absolute top-1 right-1 opacity-0 group-hover/code:opacity-100 transition-opacity flex items-center gap-1 text-[9px] text-purple-400 bg-purple-950/80 px-1 py-0.5 rounded">
                            {copiedCode ? (
                              <>
                                <Check className="w-2.5 h-2.5 text-emerald-400" />
                                <span className="text-emerald-400">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-2.5 h-2.5" />
                                <span>Copy</span>
                              </>
                            )}
                          </div>
                          <p>
                            <span className="text-purple-500 font-semibold">const</span> note = &#123;
                          </p>
                          <p className="pl-3.5">
                            title: <span className="text-amber-500">'NoteNest'</span>,
                          </p>
                          <p className="pl-3.5">
                            offline: <span className="text-emerald-500 font-semibold">true</span>
                          </p>
                          <p>&#125;;</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* PANEL 2: Tags & Favorites */}
            <div
              className={`group relative rounded-[8px] p-5 sm:p-6 transition-all duration-300 border backdrop-blur-md ${
                isDark
                  ? 'border-purple-500/35 bg-[#120a22]/85 hover:border-purple-400 hover:shadow-[0_0_30px_rgba(168,85,247,0.25)]'
                  : 'border-purple-200 bg-white/95 hover:border-purple-400 hover:shadow-[0_8px_30px_rgba(147,51,234,0.1)]'
              }`}
            >
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
                {/* Left Description Area */}
                <div className="sm:col-span-6 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-[6px] bg-gradient-to-br from-purple-600 to-indigo-600 border border-purple-400/40 text-white flex items-center justify-center shadow-[0_0_12px_rgba(168,85,247,0.4)]">
                      <Tag className="w-4 h-4" />
                    </div>
                    <h3
                      className={`text-sm sm:text-base font-bold tracking-tight leading-snug ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      Tags &amp;
                      <br />
                      Favorites
                    </h3>
                  </div>

                  <p className={`text-xs leading-relaxed ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>
                    Add context to your notes and quickly access what matters most.
                  </p>

                  <ul className="space-y-1.5 pt-1 text-[11px]">
                    <li className={`flex items-center gap-2 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                      <span className="w-4 h-4 rounded bg-purple-600/35 text-purple-300 flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5" />
                      </span>
                      <span>Create custom tags</span>
                    </li>
                    <li className={`flex items-center gap-2 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                      <span className="w-4 h-4 rounded bg-purple-600/35 text-purple-300 flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5" />
                      </span>
                      <span>Tag notes for quick access</span>
                    </li>
                    <li className={`flex items-center gap-2 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                      <span className="w-4 h-4 rounded bg-purple-600/35 text-purple-300 flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5" />
                      </span>
                      <span>Mark important notes as favorites</span>
                    </li>
                  </ul>
                </div>

                {/* Right Interactive Preview Widget */}
                <div className="sm:col-span-6">
                  <div
                    className={`rounded-[6px] border p-4 text-xs shadow-inner space-y-3 ${
                      isDark ? 'border-purple-500/25 bg-[#170e2b]' : 'border-purple-200/80 bg-[#f8f5fc]'
                    }`}
                  >
                    {/* Interactive Tag Chips */}
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-2">
                        {initialTags.slice(0, 4).map((tag) => {
                          const isSelected = selectedTags.includes(tag);
                          return (
                            <button
                              key={tag}
                              type="button"
                              onClick={() => toggleTag(tag)}
                              className={`px-2.5 py-1 rounded-[4px] border text-[11px] font-medium transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-purple-600 border-purple-400 text-white shadow-[0_0_10px_rgba(168,85,247,0.4)] scale-105'
                                  : isDark
                                  ? 'bg-[#22153b] border-purple-500/30 text-purple-200 hover:border-purple-400/60'
                                  : 'bg-purple-100/70 border-purple-300 text-purple-900 hover:bg-purple-200/80'
                              }`}
                            >
                              #{tag}
                            </button>
                          );
                        })}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {initialTags.slice(4).map((tag) => {
                          const isSelected = selectedTags.includes(tag);
                          return (
                            <button
                              key={tag}
                              type="button"
                              onClick={() => toggleTag(tag)}
                              className={`px-2.5 py-1 rounded-[4px] border text-[11px] font-medium transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-purple-600 border-purple-400 text-white shadow-[0_0_10px_rgba(168,85,247,0.4)] scale-105'
                                  : isDark
                                  ? 'bg-[#22153b] border-purple-500/30 text-purple-200 hover:border-purple-400/60'
                                  : 'bg-purple-100/70 border-purple-300 text-purple-900 hover:bg-purple-200/80'
                              }`}
                            >
                              #{tag}
                            </button>
                          );
                        })}
                        <span className="text-[10px] text-purple-300/60 self-center">
                          {selectedTags.length} active
                        </span>
                      </div>
                    </div>

                    {/* Favorite Notes Pill (Interactive Toggle) */}
                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={() => setIsFavoriteActive(!isFavoriteActive)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-[5px] border text-xs font-semibold transition-all cursor-pointer ${
                          isFavoriteActive
                            ? 'bg-gradient-to-r from-purple-950/80 to-purple-900/60 border-purple-400/60 text-white shadow-[0_0_14px_rgba(168,85,247,0.3)]'
                            : isDark
                            ? 'bg-[#1a1130] border-purple-500/20 text-gray-400 hover:text-white'
                            : 'bg-white border-purple-200 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Star
                            className={`w-3.5 h-3.5 transition-transform ${
                              isFavoriteActive
                                ? 'text-amber-400 fill-amber-400 scale-110 animate-pulse'
                                : 'text-gray-400'
                            }`}
                          />
                          <span>Favorite Notes</span>
                        </div>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                            isFavoriteActive
                              ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                              : 'bg-purple-950/40 text-gray-400'
                          }`}
                        >
                          {isFavoriteActive ? '3 pinned' : 'Off'}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* PANEL 3: Offline-First & Sync */}
            <div
              className={`group relative rounded-[8px] p-5 sm:p-6 transition-all duration-300 border backdrop-blur-md ${
                isDark
                  ? 'border-purple-500/35 bg-[#120a22]/85 hover:border-purple-400 hover:shadow-[0_0_30px_rgba(168,85,247,0.25)]'
                  : 'border-purple-200 bg-white/95 hover:border-purple-400 hover:shadow-[0_8px_30px_rgba(147,51,234,0.1)]'
              }`}
            >
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
                {/* Left Description Area */}
                <div className="sm:col-span-6 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-[6px] bg-gradient-to-br from-purple-600 to-indigo-600 border border-purple-400/40 text-white flex items-center justify-center shadow-[0_0_12px_rgba(168,85,247,0.4)]">
                      <Cloud className="w-4 h-4" />
                    </div>
                    <h3
                      className={`text-sm sm:text-base font-bold tracking-tight leading-snug ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      Offline-First
                      <br />
                      &amp; Sync
                    </h3>
                  </div>

                  <p className={`text-xs leading-relaxed ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>
                    Work without internet and keep everything in sync across devices.
                  </p>

                  <ul className="space-y-1.5 pt-1 text-[11px]">
                    <li className={`flex items-center gap-2 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                      <span className="w-4 h-4 rounded bg-purple-600/35 text-purple-300 flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5" />
                      </span>
                      <span>Full offline access</span>
                    </li>
                    <li className={`flex items-center gap-2 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                      <span className="w-4 h-4 rounded bg-purple-600/35 text-purple-300 flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5" />
                      </span>
                      <span>Automatic background sync</span>
                    </li>
                    <li className={`flex items-center gap-2 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                      <span className="w-4 h-4 rounded bg-purple-600/35 text-purple-300 flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5" />
                      </span>
                      <span>Safe conflict resolution</span>
                    </li>
                  </ul>
                </div>

                {/* Right Interactive Preview Widget */}
                <div className="sm:col-span-6">
                  <div
                    onClick={triggerSync}
                    title="Click to toggle Online/Offline simulation"
                    className={`rounded-[6px] border p-4 text-xs shadow-inner flex flex-col items-center justify-center text-center space-y-3 cursor-pointer group/sync transition-all ${
                      isDark ? 'border-purple-500/25 bg-[#170e2b] hover:border-purple-400/50' : 'border-purple-200/80 bg-[#f8f5fc]'
                    }`}
                  >
                    {/* Device & Sync Visualization */}
                    <div className="relative flex items-center justify-center py-2 w-full">
                      {/* Laptop / Book */}
                      <div
                        className={`relative px-3 py-2 rounded-[5px] border shadow-md flex items-center justify-center transition-all ${
                          isDark
                            ? 'bg-[#22153b] border-purple-500/40 text-purple-300'
                            : 'bg-white border-purple-200 text-purple-700'
                        }`}
                      >
                        <BookOpen className="w-5 h-5" />
                      </div>

                      {/* Floating Cloud */}
                      <div
                        onClick={handleSyncButton}
                        title="Click to trigger sync"
                        className={`absolute right-2 top-0 px-2 py-1 rounded-[4px] border transition-transform hover:scale-110 ${
                          syncStatus === 'offline'
                            ? 'bg-amber-950/60 border-amber-500/40 text-amber-300'
                            : syncStatus === 'syncing'
                            ? 'bg-purple-900/80 border-purple-400 text-purple-200 animate-pulse'
                            : isDark
                            ? 'bg-purple-950/60 border-purple-500/30 text-purple-300'
                            : 'bg-purple-100 border-purple-200 text-purple-700'
                        }`}
                      >
                        {syncStatus === 'syncing' ? (
                          <RotateCw className="w-4 h-4 animate-spin text-purple-300" />
                        ) : (
                          <Cloud className="w-4 h-4" />
                        )}
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10.5px] font-semibold border transition-all ${
                        syncStatus === 'synced'
                          ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                          : syncStatus === 'syncing'
                          ? 'bg-purple-950/60 border-purple-400/60 text-purple-200'
                          : 'bg-amber-950/60 border-amber-500/50 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          syncStatus === 'synced'
                            ? 'bg-emerald-400 animate-pulse'
                            : syncStatus === 'syncing'
                            ? 'bg-purple-400 animate-ping'
                            : 'bg-amber-400'
                        }`}
                      />
                      <span>
                        {syncStatus === 'synced'
                          ? 'Synced'
                          : syncStatus === 'syncing'
                          ? 'Syncing changes...'
                          : 'Offline (Dexie Mode)'}
                      </span>
                    </div>

                    <p className="text-[9.5px] text-purple-300/60">
                      {syncStatus === 'offline'
                        ? 'Click to reconnect and sync'
                        : `Auto-saved • ${lastSyncTime}`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ======================================================= */}
          {/* RIGHT COLUMN: 3 Feature Panels                         */}
          {/* ======================================================= */}
          <div className="space-y-6 lg:space-y-7 relative z-10">
            {/* PANEL 4: Folders & Nested Folders */}
            <div
              className={`group relative rounded-[8px] p-5 sm:p-6 transition-all duration-300 border backdrop-blur-md ${
                isDark
                  ? 'border-purple-500/35 bg-[#120a22]/85 hover:border-purple-400 hover:shadow-[0_0_30px_rgba(168,85,247,0.25)]'
                  : 'border-purple-200 bg-white/95 hover:border-purple-400 hover:shadow-[0_8px_30px_rgba(147,51,234,0.1)]'
              }`}
            >
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
                {/* Left Description Area */}
                <div className="sm:col-span-6 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-[6px] bg-gradient-to-br from-purple-600 to-indigo-600 border border-purple-400/40 text-white flex items-center justify-center shadow-[0_0_12px_rgba(168,85,247,0.4)]">
                      <Folder className="w-4 h-4" />
                    </div>
                    <h3
                      className={`text-sm sm:text-base font-bold tracking-tight leading-snug ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      Folders &amp;
                      <br />
                      Nested Folders
                    </h3>
                  </div>

                  <p className={`text-xs leading-relaxed ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>
                    Keep your notes structured with a flexible, hierarchical folder system.
                  </p>

                  <ul className="space-y-1.5 pt-1 text-[11px]">
                    <li className={`flex items-center gap-2 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                      <span className="w-4 h-4 rounded bg-purple-600/35 text-purple-300 flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5" />
                      </span>
                      <span>Create unlimited folders</span>
                    </li>
                    <li className={`flex items-center gap-2 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                      <span className="w-4 h-4 rounded bg-purple-600/35 text-purple-300 flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5" />
                      </span>
                      <span>Nested folder hierarchy</span>
                    </li>
                    <li className={`flex items-center gap-2 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                      <span className="w-4 h-4 rounded bg-purple-600/35 text-purple-300 flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5" />
                      </span>
                      <span>Move and organize easily</span>
                    </li>
                  </ul>
                </div>

                {/* Right Interactive Preview Widget */}
                <div className="sm:col-span-6">
                  <div
                    className={`rounded-[6px] border p-3 text-xs shadow-inner font-sans space-y-1.5 ${
                      isDark ? 'border-purple-500/25 bg-[#170e2b]' : 'border-purple-200/80 bg-[#f8f5fc]'
                    }`}
                  >
                    {/* Root Folder Header */}
                    <div className="flex items-center justify-between text-[11px] text-gray-400 pb-0.5">
                      <div className="flex items-center gap-1.5">
                        <ChevronDown className="w-3 h-3 text-purple-400" />
                        <span className={`font-semibold ${isDark ? 'text-gray-200' : 'text-slate-800'}`}>
                          My Folders
                        </span>
                      </div>
                      <span className="text-[9.5px] text-purple-400/70 font-mono">3 items</span>
                    </div>

                    {/* Subfolders Tree */}
                    <div className="pl-3 space-y-1 text-[10.5px]">
                      {/* College Folder */}
                      <div
                        onClick={() => setSelectedFolderItem('College')}
                        className={`flex items-center gap-1.5 px-2 py-1 rounded-[4px] cursor-pointer transition-colors ${
                          selectedFolderItem === 'College'
                            ? 'bg-purple-600 text-white font-semibold shadow-xs'
                            : isDark
                            ? 'text-gray-300 hover:bg-purple-950/40'
                            : 'text-slate-700 hover:bg-purple-100/50'
                        }`}
                      >
                        <Folder className="w-3 h-3 text-purple-400" />
                        <span>College</span>
                      </div>

                      {/* Projects Folder with Nested Items */}
                      <div className="space-y-1">
                        <div
                          onClick={() => setIsProjectsOpen(!isProjectsOpen)}
                          className={`flex items-center justify-between px-2 py-1 rounded-[4px] cursor-pointer transition-colors ${
                            isDark ? 'hover:bg-purple-950/40' : 'hover:bg-purple-100/50'
                          }`}
                        >
                          <div className="flex items-center gap-1 text-gray-300">
                            {isProjectsOpen ? (
                              <ChevronDown className="w-2.5 h-2.5 text-purple-400" />
                            ) : (
                              <ChevronRight className="w-2.5 h-2.5 text-purple-400" />
                            )}
                            <Folder className="w-3 h-3 text-purple-400" />
                            <span className="font-medium">Projects</span>
                          </div>
                          <span className="text-[9px] text-purple-400/60">3 notes</span>
                        </div>

                        {/* Nested Items */}
                        {isProjectsOpen && (
                          <div className="pl-4 space-y-1 transition-all">
                            <div
                              onClick={() => setSelectedFolderItem('NoteNest')}
                              className={`px-2 py-1 rounded-[4px] cursor-pointer font-semibold flex items-center gap-1 shadow-sm transition-all ${
                                selectedFolderItem === 'NoteNest'
                                  ? 'bg-purple-600 text-white shadow-[0_0_10px_rgba(168,85,247,0.35)]'
                                  : isDark
                                  ? 'text-gray-300 hover:bg-purple-950/50'
                                  : 'text-slate-800 hover:bg-purple-100'
                              }`}
                            >
                              <FileText className="w-2.5 h-2.5" />
                              <span>NoteNest</span>
                            </div>
                            <div
                              onClick={() => setSelectedFolderItem('API Gateway')}
                              className={`px-2 py-1 rounded-[4px] cursor-pointer flex items-center gap-1 transition-all ${
                                selectedFolderItem === 'API Gateway'
                                  ? 'bg-purple-600 text-white font-semibold'
                                  : isDark
                                  ? 'text-gray-400 hover:text-gray-200 hover:bg-purple-950/40'
                                  : 'text-slate-500 hover:text-slate-900 hover:bg-purple-100'
                              }`}
                            >
                              <FileText className="w-2.5 h-2.5" />
                              <span>API Gateway</span>
                            </div>
                            <div
                              onClick={() => setSelectedFolderItem('Traffic System')}
                              className={`px-2 py-1 rounded-[4px] cursor-pointer flex items-center gap-1 transition-all ${
                                selectedFolderItem === 'Traffic System'
                                  ? 'bg-purple-600 text-white font-semibold'
                                  : isDark
                                  ? 'text-gray-400 hover:text-gray-200 hover:bg-purple-950/40'
                                  : 'text-slate-500 hover:text-slate-900 hover:bg-purple-100'
                              }`}
                            >
                              <FileText className="w-2.5 h-2.5" />
                              <span>Traffic System</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Personal Folder */}
                      <div
                        onClick={() => setSelectedFolderItem('Personal')}
                        className={`flex items-center gap-1.5 px-2 py-1 rounded-[4px] cursor-pointer transition-colors ${
                          selectedFolderItem === 'Personal'
                            ? 'bg-purple-600 text-white font-semibold shadow-xs'
                            : isDark
                            ? 'text-gray-300 hover:bg-purple-950/40'
                            : 'text-slate-700 hover:bg-purple-100/50'
                        }`}
                      >
                        <Folder className="w-3 h-3 text-purple-400" />
                        <span>Personal</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* PANEL 5: Powerful Search */}
            <div
              className={`group relative rounded-[8px] p-5 sm:p-6 transition-all duration-300 border backdrop-blur-md ${
                isDark
                  ? 'border-purple-500/35 bg-[#120a22]/85 hover:border-purple-400 hover:shadow-[0_0_30px_rgba(168,85,247,0.25)]'
                  : 'border-purple-200 bg-white/95 hover:border-purple-400 hover:shadow-[0_8px_30px_rgba(147,51,234,0.1)]'
              }`}
            >
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
                {/* Left Description Area */}
                <div className="sm:col-span-6 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-[6px] bg-gradient-to-br from-purple-600 to-indigo-600 border border-purple-400/40 text-white flex items-center justify-center shadow-[0_0_12px_rgba(168,85,247,0.4)]">
                      <Search className="w-4 h-4" />
                    </div>
                    <h3
                      className={`text-sm sm:text-base font-bold tracking-tight leading-snug ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      Powerful
                      <br />
                      Search
                    </h3>
                  </div>

                  <p className={`text-xs leading-relaxed ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>
                    Find any note in seconds with fast, full-text search and filters.
                  </p>

                  <ul className="space-y-1.5 pt-1 text-[11px]">
                    <li className={`flex items-center gap-2 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                      <span className="w-4 h-4 rounded bg-purple-600/35 text-purple-300 flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5" />
                      </span>
                      <span>Search titles and content</span>
                    </li>
                    <li className={`flex items-center gap-2 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                      <span className="w-4 h-4 rounded bg-purple-600/35 text-purple-300 flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5" />
                      </span>
                      <span>Filter by folder, tag or favorites</span>
                    </li>
                    <li className={`flex items-center gap-2 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                      <span className="w-4 h-4 rounded bg-purple-600/35 text-purple-300 flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5" />
                      </span>
                      <span>Sort by date and relevance</span>
                    </li>
                  </ul>
                </div>

                {/* Right Interactive Preview Widget */}
                <div className="sm:col-span-6">
                  <div
                    className={`rounded-[6px] border p-3 text-xs shadow-inner space-y-2 ${
                      isDark ? 'border-purple-500/25 bg-[#170e2b]' : 'border-purple-200/80 bg-[#f8f5fc]'
                    }`}
                  >
                    {/* Live Working Search Input */}
                    <div
                      className={`flex items-center justify-between px-2.5 py-1.5 rounded-[4px] border text-xs focus-within:border-purple-400 transition-colors ${
                        isDark
                          ? 'bg-[#0e071c] border-purple-500/30 text-white'
                          : 'bg-white border-purple-300 text-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <Search className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Type to search..."
                          className="bg-transparent font-mono text-purple-400 focus:outline-none w-full text-xs placeholder:text-gray-500"
                        />
                      </div>
                      {searchQuery && (
                        <button
                          type="button"
                          onClick={() => setSearchQuery('')}
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-gray-400 px-0.5">
                      <span>{filteredNotes.length} results</span>
                      {searchQuery && (
                        <span className="text-purple-300/80 font-mono">query: "{searchQuery}"</span>
                      )}
                    </div>

                    {/* Results List */}
                    <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-0.5">
                      {filteredNotes.length > 0 ? (
                        filteredNotes.slice(0, 3).map((item) => (
                          <div
                            key={item.id}
                            className={`p-1.5 rounded-[4px] border transition-colors ${
                              isDark
                                ? 'bg-[#22153b] border-purple-500/20 hover:border-purple-400/40'
                                : 'bg-white border-purple-200/90 hover:border-purple-300'
                            }`}
                          >
                            <p
                              className={`text-[11px] font-semibold flex items-center gap-1.5 ${
                                isDark ? 'text-white' : 'text-slate-900'
                              }`}
                            >
                              <FileText className="w-3 h-3 text-purple-400 shrink-0" />
                              <span>{renderHighlightedText(item.title, searchQuery)}</span>
                            </p>
                            <p className={`text-[9.5px] truncate mt-0.5 ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                              {renderHighlightedText(item.snippet, searchQuery)}
                            </p>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4 text-[10.5px] text-gray-400">
                          No notes found matching "{searchQuery}"
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* PANEL 6: Import & Export */}
            <div
              className={`group relative rounded-[8px] p-5 sm:p-6 transition-all duration-300 border backdrop-blur-md ${
                isDark
                  ? 'border-purple-500/35 bg-[#120a22]/85 hover:border-purple-400 hover:shadow-[0_0_30px_rgba(168,85,247,0.25)]'
                  : 'border-purple-200 bg-white/95 hover:border-purple-400 hover:shadow-[0_8px_30px_rgba(147,51,234,0.1)]'
              }`}
            >
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
                {/* Left Description Area */}
                <div className="sm:col-span-6 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-[6px] bg-gradient-to-br from-purple-600 to-indigo-600 border border-purple-400/40 text-white flex items-center justify-center shadow-[0_0_12px_rgba(168,85,247,0.4)]">
                      <ArrowDownToLine className="w-4 h-4" />
                    </div>
                    <h3
                      className={`text-sm sm:text-base font-bold tracking-tight leading-snug ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      Import &amp;
                      <br />
                      Export
                    </h3>
                  </div>

                  <p className={`text-xs leading-relaxed ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>
                    Bring in your existing notes or take your data anywhere.
                  </p>

                  <ul className="space-y-1.5 pt-1 text-[11px]">
                    <li className={`flex items-center gap-2 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                      <span className="w-4 h-4 rounded bg-purple-600/35 text-purple-300 flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5" />
                      </span>
                      <span>Import Markdown files</span>
                    </li>
                    <li className={`flex items-center gap-2 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                      <span className="w-4 h-4 rounded bg-purple-600/35 text-purple-300 flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5" />
                      </span>
                      <span>Export notes as Markdown</span>
                    </li>
                    <li className={`flex items-center gap-2 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                      <span className="w-4 h-4 rounded bg-purple-600/35 text-purple-300 flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5" />
                      </span>
                      <span>Export notes as PDF</span>
                    </li>
                  </ul>
                </div>

                {/* Right Interactive Preview Widget */}
                <div className="sm:col-span-6">
                  <div
                    className={`rounded-[6px] border p-4 text-xs shadow-inner space-y-3 ${
                      isDark ? 'border-purple-500/25 bg-[#170e2b]' : 'border-purple-200/80 bg-[#f8f5fc]'
                    }`}
                  >
                    {/* Live Working Markdown Export */}
                    <button
                      type="button"
                      onClick={handleExportMarkdown}
                      title="Click to download sample Markdown note"
                      className={`w-full flex items-center justify-between p-2.5 rounded-[5px] border cursor-pointer group/md transition-all ${
                        isDark
                          ? 'bg-[#22153b] border-purple-500/30 hover:border-purple-400 hover:shadow-[0_0_16px_rgba(168,85,247,0.3)]'
                          : 'bg-white border-purple-200 hover:border-purple-300 shadow-xs'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="px-1.5 py-0.5 text-[10px] font-bold font-mono bg-purple-600 text-white rounded">
                          MD
                        </span>
                        <span className={`text-xs font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          Markdown (.md)
                        </span>
                      </div>
                      <Download className="w-3.5 h-3.5 text-purple-400 group-hover/md:scale-110 transition-transform" />
                    </button>

                    {/* Live Working PDF Export */}
                    <button
                      type="button"
                      onClick={handleExportPDF}
                      title="Click to export as PDF Document"
                      className={`w-full flex items-center justify-between p-2.5 rounded-[5px] border cursor-pointer group/pdf transition-all ${
                        isDark
                          ? 'bg-[#22153b] border-purple-500/30 hover:border-rose-400 hover:shadow-[0_0_16px_rgba(244,63,94,0.25)]'
                          : 'bg-white border-purple-200 hover:border-rose-200 shadow-xs'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="px-1.5 py-0.5 text-[10px] font-bold font-mono bg-rose-600 text-white rounded">
                          PDF
                        </span>
                        <span className={`text-xs font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          PDF Document
                        </span>
                      </div>
                      <Download className="w-3.5 h-3.5 text-rose-400 group-hover/pdf:scale-110 transition-transform" />
                    </button>

                    {/* Dynamic feedback notification */}
                    {exportNotice && (
                      <div className="flex items-center gap-1.5 p-2 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-[10px] font-medium animate-fadeIn">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span className="truncate">{exportNotice}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesOverview;
