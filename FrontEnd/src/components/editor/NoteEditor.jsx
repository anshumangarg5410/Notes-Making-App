import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Placeholder from '@tiptap/extension-placeholder';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import {
  Home,
  ChevronRight,
  Share2,
  Check,
  MoreVertical,
  Calendar,
  Smile,
  Plus,
  X,
  Sparkles,
  Download,
  Palette,
  Pin,
  Star,
  Archive,
  Trash2,
  ArrowLeft,
  FileText
} from 'lucide-react';
import { EditorToolbar } from './EditorToolbar';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import dashboardBgLight from '../../assets/dashboard/dashboard-bg-light.png';
import dashboardBgDark from '../../assets/dashboard/dashboard-bg-dark.png';
import editorDeskLight from '../../assets/dashboard/editor-desk-light.png';
import editorDeskDark from '../../assets/dashboard/editor-desk-dark.png';

export const NoteEditor = ({
  note,
  onSaveNote,
  onTogglePin,
  onToggleFavorite,
  onToggleArchive,
  onDeleteNote,
  onBackToNotes,
  onNewNote
}) => {
  const { isDark } = useTheme();
  const { success, info } = useToast();

  const [title, setTitle] = useState(note?.title || '');
  const [saveStatus, setSaveStatus] = useState('saved'); // 'saved', 'saving', 'unsaved', 'error'
  const [tags, setTags] = useState(note?.tags || []);
  const [color, setColor] = useState(note?.color || 'default');
  const [newTagInput, setNewTagInput] = useState('');
  const [showTagInput, setShowTagInput] = useState(false);
  const [showOptionsDropdown, setShowOptionsDropdown] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const optionsDropdownRef = useRef(null);
  const pendingSaveTimeoutRef = useRef(null);
  const currentNoteIdRef = useRef(note?._id);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (optionsDropdownRef.current && !optionsDropdownRef.current.contains(e.target)) {
        setShowOptionsDropdown(false);
        setShowColorPicker(false);
      }
    };
    if (showOptionsDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showOptionsDropdown]);

  // TipTap Editor instance
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] }
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-orange-500 underline'
        }
      }),
      TaskList,
      TaskItem.configure({
        nested: true
      }),
      Placeholder.configure({
        placeholder: 'Start writing your thoughts, notes, or ideas here...'
      }),
      Table.configure({
        resizable: true
      }),
      TableRow,
      TableHeader,
      TableCell
    ],
    content: note?.content || '',
    onUpdate: () => {
      setSaveStatus('unsaved');
      triggerDebouncedSave();
    }
  });

  // Keep editor content in sync when selected note changes
  useEffect(() => {
    if (note && note._id !== currentNoteIdRef.current) {
      if (pendingSaveTimeoutRef.current) {
        clearTimeout(pendingSaveTimeoutRef.current);
      }

      currentNoteIdRef.current = note._id;
      setTitle(note.title || '');
      setTags(note.tags || []);
      setColor(note.color || 'default');
      setSaveStatus('saved');

      if (editor) {
        editor.commands.setContent(note.content || '');
      }
    }
  }, [note?._id, editor]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (pendingSaveTimeoutRef.current) {
        clearTimeout(pendingSaveTimeoutRef.current);
      }
    };
  }, []);

  // Save implementation
  const performSave = useCallback(
    async (titleToSave, tagsToSave, colorToSave) => {
      if (!editor || !note) return;

      setSaveStatus('saving');
      const content = editor.getJSON();
      const plainText = editor.getText();

      try {
        await onSaveNote(note._id, {
          title: titleToSave !== undefined ? titleToSave : title,
          content,
          plainText: plainText.substring(0, 300),
          tags: tagsToSave || tags,
          color: colorToSave || color
        });
        setSaveStatus('saved');
        success('Note saved');
      } catch (err) {
        console.error('Save error:', err);
        setSaveStatus('error');
      }
    },
    [editor, note, title, tags, color, onSaveNote, success]
  );

  // Debounced save trigger
  const triggerDebouncedSave = useCallback(
    (customTitle, customTags, customColor) => {
      if (pendingSaveTimeoutRef.current) {
        clearTimeout(pendingSaveTimeoutRef.current);
      }

      pendingSaveTimeoutRef.current = setTimeout(() => {
        performSave(customTitle, customTags, customColor);
      }, 800);
    },
    [performSave]
  );

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    setSaveStatus('unsaved');
    triggerDebouncedSave(newTitle, tags, color);
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    const trimmed = newTagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      const updated = [...tags, trimmed];
      setTags(updated);
      setNewTagInput('');
      setShowTagInput(false);
      performSave(title, updated, color);
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    const updated = tags.filter((t) => t !== tagToRemove);
    setTags(updated);
    performSave(title, updated, color);
  };

  // Export note as Markdown or Plain Text
  const handleExport = (format) => {
    setShowOptionsDropdown(false);
    const contentText = editor ? editor.getText() : note?.plainText || '';
    let fileContent = '';
    let filename = `${(title || 'Untitled').replace(/[^a-zA-Z0-9_-]/g, '_')}`;

    if (format === 'markdown') {
      fileContent = `# ${title || 'Untitled'}\n\n${contentText}`;
      filename += '.md';
    } else {
      fileContent = `${title || 'Untitled'}\n\n${contentText}`;
      filename += '.txt';
    }

    const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    info(`Exported ${filename}`);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: title || 'Untitled Note',
        text: editor ? editor.getText() : note?.plainText || '',
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      info('Note link copied to clipboard');
    }
  };

  if (!note) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-cream-50/50 dark:bg-charcoal-900 text-charcoal-400 dark:text-charcoal-500 p-8 text-center select-none">
        <div className="w-16 h-16 rounded-3xl bg-cream-100 dark:bg-charcoal-800 flex items-center justify-center mb-4">
          <FileText className="w-8 h-8 text-orange-500/80" />
        </div>
        <h3 className="font-serif font-semibold text-lg text-charcoal-700 dark:text-cream-200">
          Select or Create a Note
        </h3>
        <p className="text-xs text-charcoal-400 dark:text-charcoal-500 mt-1 max-w-sm">
          Pick a note from the left panel to continue writing, or create a fresh new page for your ideas.
        </p>
        {onNewNote && (
          <button
            onClick={onNewNote}
            className="mt-4 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 shadow-md shadow-orange-500/20 hover:shadow-orange-500/30 transition-all active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create New Note</span>
          </button>
        )}
      </div>
    );
  }

  // Format header date matching mockup
  const noteDateObj = new Date(note.updatedAt || note.createdAt);
  const formattedDate = noteDateObj.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
  const formattedTime = noteDateObj.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

  const plainText = editor ? editor.getText() : note.plainText || '';
  const wordCount = plainText.split(/\s+/).filter(Boolean).length;
  const charCount = plainText.length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-cream-50/30 dark:bg-charcoal-950 transition-colors relative">
      {/* Top Breadcrumb Bar & Note Actions */}
      <div className="relative z-30 flex items-center justify-between px-4 sm:px-6 py-2 border-b border-warm-border/60 dark:border-charcoal-800 bg-white/70 dark:bg-charcoal-900/80 backdrop-blur-sm select-none">
        {/* Breadcrumb path */}
        <div className="flex items-center space-x-2 text-xs text-charcoal-500 dark:text-charcoal-400 font-medium truncate">
          {onBackToNotes && (
            <button
              onClick={onBackToNotes}
              className="md:hidden p-1 rounded-lg text-charcoal-600 dark:text-cream-200 hover:bg-cream-200/60 dark:hover:bg-charcoal-800 mr-1"
              title="Back to notes"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}

          <div className="flex items-center space-x-1.5 text-charcoal-400 dark:text-charcoal-500">
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </div>
          <ChevronRight className="w-3 h-3 text-charcoal-300 dark:text-charcoal-600" />
          <span className="text-charcoal-400 dark:text-charcoal-500">All Notes</span>
          <ChevronRight className="w-3 h-3 text-charcoal-300 dark:text-charcoal-600" />
          <span className="font-semibold text-charcoal-800 dark:text-cream-100 truncate max-w-[150px] sm:max-w-[260px]">
            {title || 'Untitled Note'}
          </span>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center space-x-2">
          {/* Share Button */}
          <button
            onClick={handleShare}
            className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-warm-border dark:border-charcoal-700 bg-white/80 dark:bg-charcoal-800 hover:bg-cream-100 dark:hover:bg-charcoal-700 text-charcoal-700 dark:text-cream-200 text-xs font-medium transition-colors shadow-xs"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>

          {/* Save Button */}
          <button
            onClick={() => performSave()}
            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-semibold shadow-xs hover:shadow-orange-500/20 active:scale-95 transition-all"
          >
            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Save</span>
          </button>

          {/* More Options Dropdown */}
          <div className="relative" ref={optionsDropdownRef}>
            <button
              onClick={() => setShowOptionsDropdown((prev) => !prev)}
              className="p-1.5 rounded-xl text-charcoal-500 hover:text-charcoal-800 dark:hover:text-cream-100 hover:bg-cream-200/60 dark:hover:bg-charcoal-800 transition-colors"
              title="More options"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showOptionsDropdown && (
              <div className="absolute right-0 top-full mt-1.5 w-48 bg-white dark:bg-charcoal-800 border border-warm-border dark:border-charcoal-700 rounded-2xl shadow-dropdown py-1.5 text-xs text-charcoal-700 dark:text-cream-200 z-50 animate-in fade-in zoom-in-95 duration-100">
                <button
                  onClick={() => {
                    onTogglePin(note._id);
                    setShowOptionsDropdown(false);
                  }}
                  className="w-full text-left px-3.5 py-2 hover:bg-cream-100 dark:hover:bg-charcoal-700 flex items-center space-x-2"
                >
                  <Pin className="w-3.5 h-3.5 text-orange-500" />
                  <span>{note.isPinned ? 'Unpin note' : 'Pin note'}</span>
                </button>
                <button
                  onClick={() => {
                    onToggleFavorite(note._id);
                    setShowOptionsDropdown(false);
                  }}
                  className="w-full text-left px-3.5 py-2 hover:bg-cream-100 dark:hover:bg-charcoal-700 flex items-center space-x-2"
                >
                  <Star className="w-3.5 h-3.5 text-amber-500" />
                  <span>{note.isFavorite ? 'Remove favorite' : 'Add favorite'}</span>
                </button>
                <button
                  onClick={() => {
                    onToggleArchive(note._id);
                    setShowOptionsDropdown(false);
                  }}
                  className="w-full text-left px-3.5 py-2 hover:bg-cream-100 dark:hover:bg-charcoal-700 flex items-center space-x-2"
                >
                  <Archive className="w-3.5 h-3.5 text-charcoal-500" />
                  <span>{note.isArchived ? 'Unarchive' : 'Archive note'}</span>
                </button>

                <div className="my-1 border-t border-warm-border/60 dark:border-charcoal-700" />

                <button
                  onClick={() => handleExport('markdown')}
                  className="w-full text-left px-3.5 py-2 hover:bg-cream-100 dark:hover:bg-charcoal-700 flex items-center space-x-2"
                >
                  <Download className="w-3.5 h-3.5 text-charcoal-500" />
                  <span>Export Markdown (.md)</span>
                </button>
                <button
                  onClick={() => handleExport('text')}
                  className="w-full text-left px-3.5 py-2 hover:bg-cream-100 dark:hover:bg-charcoal-700 flex items-center space-x-2"
                >
                  <Download className="w-3.5 h-3.5 text-charcoal-500" />
                  <span>Export Text (.txt)</span>
                </button>

                <div className="my-1 border-t border-warm-border/60 dark:border-charcoal-700" />

                <button
                  onClick={() => {
                    onDeleteNote(note._id);
                    setShowOptionsDropdown(false);
                  }}
                  className="w-full text-left px-3.5 py-2 hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 dark:text-red-400 flex items-center space-x-2"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Move to trash</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Formatting Toolbar */}
      <EditorToolbar editor={editor} />

      {/* Editor Main Canvas with Split Fluid Background & Desk Art */}
      <div
        className="flex-1 overflow-y-auto relative bg-no-repeat bg-cover bg-bottom md:bg-right-bottom"
        style={{
          backgroundImage: `url(${isDark ? dashboardBgDark : dashboardBgLight})`
        }}
      >
        {/* Top-Right Desk Illustration Artwork matching mockup */}
        <div className="absolute right-0 top-0 pointer-events-none select-none w-56 sm:w-72 md:w-80 lg:w-[380px] max-w-[42vw] opacity-90 transition-opacity z-0">
          <img
            src={isDark ? editorDeskDark : editorDeskLight}
            alt="Workspace desk scene"
            className="w-full h-auto object-contain"
          />
        </div>

        {/* Note Writing Canvas */}
        <div className="relative z-10 px-6 sm:px-10 md:px-14 py-8 max-w-3xl w-full">
          {/* Add Icon Trigger */}
          <div className="mb-2">
            <button
              onClick={() => info('Icon selection available')}
              className="inline-flex items-center space-x-1.5 text-xs text-charcoal-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
            >
              <Smile className="w-3.5 h-3.5" />
              <span>Add icon</span>
            </button>
          </div>

          {/* Note Title Input with Bold Serif Font */}
          <div className="mb-2">
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              placeholder="Untitled Note"
              className="w-full font-serif font-bold text-3xl sm:text-4xl md:text-5xl text-charcoal-900 dark:text-cream-50 bg-transparent border-none outline-none focus:ring-0 placeholder:text-charcoal-300 dark:placeholder:text-charcoal-600 leading-tight"
            />
          </div>

          {/* Metadata Row: Calendar, Word Count, Tags */}
          <div className="flex items-center flex-wrap gap-2 sm:gap-3 text-xs text-charcoal-500 dark:text-charcoal-400 mb-2 font-medium">
            <div className="flex items-center space-x-1.5">
              <Calendar className="w-3.5 h-3.5 text-charcoal-400" />
              <span>{formattedDate} at {formattedTime}</span>
            </div>
            <span>•</span>
            <span>{wordCount} words</span>
            <span>•</span>

            {/* Tags list */}
            <div className="flex items-center flex-wrap gap-1.5">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[11px] bg-white/80 dark:bg-charcoal-800 border border-warm-border/60 dark:border-charcoal-700 text-charcoal-600 dark:text-charcoal-300 font-medium shadow-2xs"
                >
                  <span>#{tag}</span>
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-red-500 text-charcoal-400 ml-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}

              {showTagInput ? (
                <form onSubmit={handleAddTag} className="inline-flex items-center">
                  <input
                    type="text"
                    autoFocus
                    placeholder="tag name..."
                    value={newTagInput}
                    onChange={(e) => setNewTagInput(e.target.value)}
                    onBlur={() => setShowTagInput(false)}
                    className="px-2 py-0.5 text-xs bg-white dark:bg-charcoal-800 border border-warm-border dark:border-charcoal-700 rounded-md outline-none text-charcoal-800 dark:text-cream-100 w-24"
                  />
                </form>
              ) : (
                <button
                  onClick={() => setShowTagInput(true)}
                  className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] border border-dashed border-warm-border dark:border-charcoal-700 text-charcoal-500 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-white/50 transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add tags</span>
                </button>
              )}
            </div>
          </div>

          {/* Amber Accent Underline Bar */}
          <div className="w-12 h-1 bg-amber-500 rounded-full mb-6 mt-1" />

          {/* TipTap Editor Content */}
          <div className="prose prose-stone dark:prose-invert max-w-none focus:outline-none min-h-[360px]">
            <EditorContent editor={editor} />
          </div>

          {/* Live Document Statistics Bar */}
          <div className="mt-14 pt-4 border-t border-warm-border/60 dark:border-charcoal-800 flex items-center justify-between text-[11px] text-charcoal-400 dark:text-charcoal-500 font-mono">
            <div className="flex items-center space-x-3">
              <span>{wordCount} words</span>
              <span>•</span>
              <span>{charCount} characters</span>
              <span>•</span>
              <span>~{readingTime} min read</span>
            </div>
            <div>
              <span>Updated {formattedDate}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Round AI Sparkle Button in Bottom-Right Corner */}
      <button
        onClick={() => info('Notely AI writing suggestions ready')}
        className="fixed bottom-6 right-6 z-30 w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white flex items-center justify-center shadow-lg shadow-orange-500/35 hover:scale-105 active:scale-95 transition-all"
        title="Notely AI Sparkle"
      >
        <Sparkles className="w-5 h-5 fill-white/20" />
      </button>
    </div>
  );
};
