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
  Pin,
  Star,
  Archive,
  Trash2,
  Tag,
  Palette,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowLeft,
  FileText,
  Plus,
  X,
  Download
} from 'lucide-react';
import { EditorToolbar } from './EditorToolbar';

export const NoteEditor = ({
  note,
  onSaveNote,
  onTogglePin,
  onToggleFavorite,
  onToggleArchive,
  onDeleteNote,
  onBackToNotes
}) => {
  const [title, setTitle] = useState(note?.title || '');
  const [saveStatus, setSaveStatus] = useState('saved'); // 'saved', 'saving', 'unsaved', 'error'
  const [tags, setTags] = useState(note?.tags || []);
  const [color, setColor] = useState(note?.color || 'default');
  const [newTagInput, setNewTagInput] = useState('');
  const [showTagInput, setShowTagInput] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const colorPickerRef = useRef(null);
  const exportMenuRef = useRef(null);

  const pendingSaveTimeoutRef = useRef(null);
  const isInitialMount = useRef(true);
  const currentNoteIdRef = useRef(note?._id);

  // Export note as Markdown or Plain Text
  const handleExport = (format) => {
    setShowExportMenu(false);
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
  };

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
          class: 'text-terracotta-500 underline'
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
    onUpdate: ({ editor }) => {
      setSaveStatus('unsaved');
      triggerDebouncedSave();
    }
  });

  // Keep editor content in sync when selected note changes
  useEffect(() => {
    if (note && note._id !== currentNoteIdRef.current) {
      // Flush any pending save for previous note if needed
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

  // Close color picker and export dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(e.target)) {
        setShowColorPicker(false);
      }
      if (exportMenuRef.current && !exportMenuRef.current.contains(e.target)) {
        setShowExportMenu(false);
      }
    };
    if (showColorPicker || showExportMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showColorPicker, showExportMenu]);

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
      } catch (err) {
        console.error('Autosave error:', err);
        setSaveStatus('error');
      }
    },
    [editor, note, title, tags, color, onSaveNote]
  );

  // Debounced save trigger
  const triggerDebouncedSave = useCallback(
    (customTitle, customTags, customColor) => {
      if (pendingSaveTimeoutRef.current) {
        clearTimeout(pendingSaveTimeoutRef.current);
      }

      pendingSaveTimeoutRef.current = setTimeout(() => {
        performSave(customTitle, customTags, customColor);
      }, 750);
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

  const handleSelectColor = (selectedColor) => {
    setColor(selectedColor);
    setShowColorPicker(false);
    performSave(title, tags, selectedColor);
  };

  if (!note) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-warm-bg dark:bg-charcoal-900 text-charcoal-400 dark:text-charcoal-500 p-8 text-center select-none">
        <div className="w-16 h-16 rounded-3xl bg-cream-100 dark:bg-charcoal-800 flex items-center justify-center mb-4">
          <FileText className="w-8 h-8 text-charcoal-400" />
        </div>
        <h3 className="font-serif font-semibold text-lg text-charcoal-700 dark:text-cream-200">
          Select or Create a Note
        </h3>
        <p className="text-xs text-charcoal-400 dark:text-charcoal-500 mt-1 max-w-sm">
          Pick a note from the left panel to continue writing, or create a fresh new page for your ideas.
        </p>
      </div>
    );
  }

  // Format header date matching design
  const formattedDate = new Date(note.updatedAt || note.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
  const formattedTime = new Date(note.updatedAt || note.createdAt).toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit'
  });

  const plainText = editor ? editor.getText() : note.plainText || '';
  const wordCount = plainText.split(/\s+/).filter(Boolean).length;
  const charCount = plainText.length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  const colorPalettes = [
    { id: 'default', name: 'Porcelain & Obsidian', bg: 'bg-[#F8FAFC] dark:bg-charcoal-950', dot: 'bg-indigo-500' },
    { id: 'amber', name: 'Electric Amber', bg: 'bg-amber-50/50 dark:bg-amber-950/20', dot: 'bg-amber-400' },
    { id: 'rose', name: 'Neon Rose', bg: 'bg-rose-50/50 dark:bg-rose-950/20', dot: 'bg-rose-400' },
    { id: 'emerald', name: 'Cyber Mint', bg: 'bg-emerald-50/50 dark:bg-emerald-950/20', dot: 'bg-emerald-400' },
    { id: 'sky', name: 'Electric Sky', bg: 'bg-sky-50/50 dark:bg-sky-950/20', dot: 'bg-sky-400' },
    { id: 'purple', name: 'Royal Violet', bg: 'bg-purple-50/50 dark:bg-purple-950/20', dot: 'bg-purple-500' }
  ];

  return (
    <div className={`flex-1 flex flex-col h-full overflow-hidden transition-colors ${
      colorPalettes.find((c) => c.id === color)?.bg || 'bg-warm-bg dark:bg-charcoal-950'
    }`}>
      {/* Top Mobile Bar & Note Actions */}
      <div className="relative z-30 flex items-center justify-between px-6 py-2.5 border-b border-warm-border/60 dark:border-charcoal-800 bg-warm-bg/70 dark:bg-charcoal-900/70 backdrop-blur-sm select-none">
        <div className="flex items-center space-x-2">
          {onBackToNotes && (
            <button
              onClick={onBackToNotes}
              className="md:hidden p-1.5 rounded-lg text-charcoal-600 dark:text-cream-200 hover:bg-cream-200/60 dark:hover:bg-charcoal-800 mr-1"
              title="Back to notes list"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}

          {/* Autosave Status Indicator */}
          <div className="flex items-center space-x-1.5 text-xs font-medium">
            {saveStatus === 'saved' && (
              <span className="flex items-center text-emerald-600 dark:text-emerald-400 space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Saved</span>
              </span>
            )}
            {saveStatus === 'saving' && (
              <span className="flex items-center text-amber-600 dark:text-amber-400 space-x-1 animate-pulse">
                <Clock className="w-3.5 h-3.5 animate-spin" />
                <span>Saving...</span>
              </span>
            )}
            {saveStatus === 'unsaved' && (
              <span className="flex items-center text-charcoal-400 space-x-1">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>Unsaved changes</span>
              </span>
            )}
            {saveStatus === 'error' && (
              <button
                onClick={() => performSave()}
                className="flex items-center text-red-500 space-x-1 hover:underline"
              >
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Error saving. Retry?</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Note Actions */}
        <div className="flex items-center space-x-1">
          {/* Color Picker Toggle */}
          <div className="relative" ref={colorPickerRef}>
            <button
              onClick={() => {
                setShowColorPicker((prev) => !prev);
                setShowExportMenu(false);
              }}
              className={`p-1.5 rounded-lg transition-colors ${
                showColorPicker
                  ? 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/40'
                  : 'text-charcoal-500 hover:text-charcoal-800 dark:hover:text-cream-100 hover:bg-cream-200/60 dark:hover:bg-charcoal-800'
              }`}
              title="Canvas tint"
            >
              <Palette className="w-4 h-4" />
            </button>
            {showColorPicker && (
              <div className="absolute right-0 top-full mt-2 bg-warm-card dark:bg-charcoal-800 border border-warm-border dark:border-charcoal-700 rounded-xl shadow-dropdown p-2 z-50 flex space-x-1.5 animate-in fade-in zoom-in-95 duration-100">
                {colorPalettes.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => handleSelectColor(c.id)}
                    className={`w-6 h-6 rounded-full border-2 transition-transform ${c.dot} ${
                      color === c.id ? 'border-indigo-500 scale-110 shadow-xs' : 'border-transparent hover:scale-105'
                    }`}
                    title={c.name}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Pin */}
          <button
            onClick={() => onTogglePin(note._id)}
            className={`p-1.5 rounded-lg transition-colors ${
              note.isPinned
                ? 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/40'
                : 'text-charcoal-500 hover:text-charcoal-800 dark:hover:text-cream-100 hover:bg-cream-200/60 dark:hover:bg-charcoal-800'
            }`}
            title={note.isPinned ? 'Unpin note' : 'Pin note'}
          >
            <Pin className={`w-4 h-4 transform rotate-45 ${note.isPinned ? 'fill-indigo-500 text-indigo-500' : ''}`} />
          </button>

          {/* Favorite */}
          <button
            onClick={() => onToggleFavorite(note._id)}
            className={`p-1.5 rounded-lg transition-colors ${
              note.isFavorite
                ? 'text-amber-500 bg-amber-100/60 dark:bg-amber-900/30'
                : 'text-charcoal-500 hover:text-charcoal-800 dark:hover:text-cream-100 hover:bg-cream-200/60 dark:hover:bg-charcoal-800'
            }`}
            title={note.isFavorite ? 'Remove favorite' : 'Add favorite'}
          >
            <Star className={`w-4 h-4 ${note.isFavorite ? 'fill-amber-500' : ''}`} />
          </button>

          {/* Archive */}
          <button
            onClick={() => onToggleArchive(note._id)}
            className="p-1.5 rounded-lg text-charcoal-500 hover:text-charcoal-800 dark:hover:text-cream-100 hover:bg-cream-200/60 dark:hover:bg-charcoal-800 transition-colors"
            title={note.isArchived ? 'Unarchive' : 'Archive note'}
          >
            <Archive className="w-4 h-4" />
          </button>

          {/* Export */}
          <div className="relative" ref={exportMenuRef}>
            <button
              onClick={() => {
                setShowExportMenu((prev) => !prev);
                setShowColorPicker(false);
              }}
              className={`p-1.5 rounded-lg transition-colors ${
                showExportMenu
                  ? 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/40'
                  : 'text-charcoal-500 hover:text-charcoal-800 dark:hover:text-cream-100 hover:bg-cream-200/60 dark:hover:bg-charcoal-800'
              }`}
              title="Export note"
            >
              <Download className="w-4 h-4" />
            </button>
            {showExportMenu && (
              <div className="absolute right-0 top-full mt-2 bg-warm-card dark:bg-charcoal-800 border border-warm-border dark:border-charcoal-700 rounded-xl shadow-dropdown py-1.5 w-44 z-50 text-xs animate-in fade-in zoom-in-95 duration-100">
                <button
                  onClick={() => handleExport('markdown')}
                  className="w-full text-left px-3 py-1.5 hover:bg-indigo-50 dark:hover:bg-charcoal-700 text-charcoal-700 dark:text-cream-200"
                >
                  Export as Markdown (.md)
                </button>
                <button
                  onClick={() => handleExport('text')}
                  className="w-full text-left px-3 py-1.5 hover:bg-indigo-50 dark:hover:bg-charcoal-700 text-charcoal-700 dark:text-cream-200"
                >
                  Export as Text (.txt)
                </button>
              </div>
            )}
          </div>

          {/* Delete */}
          <button
            onClick={() => onDeleteNote(note._id)}
            className="p-1.5 rounded-lg text-charcoal-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
            title="Move to trash"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Formatting Toolbar */}
      <EditorToolbar editor={editor} />

      {/* Editor Main Canvas & Title */}
      <div className="flex-1 overflow-y-auto px-6 md:px-14 lg:px-20 py-8 max-w-4xl w-full mx-auto">
        {/* Note Title Input with Large Serif Font */}
        <div className="mb-2">
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder="Untitled Note"
            className="w-full font-serif font-bold text-3xl md:text-4xl text-charcoal-900 dark:text-cream-50 bg-transparent border-none outline-none focus:ring-0 placeholder:text-charcoal-300 dark:placeholder:text-charcoal-600 leading-tight"
          />
        </div>

        {/* Subtitle Row: Timestamp & Word Count */}
        <div className="flex items-center flex-wrap gap-3 text-xs text-charcoal-400 dark:text-charcoal-500 mb-6 font-medium">
          <span>{formattedDate} • {formattedTime}</span>
          <span>•</span>
          <span>{wordCount} words</span>

          {/* Tags */}
          <div className="flex items-center flex-wrap gap-1.5 ml-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[11px] bg-cream-200/70 dark:bg-charcoal-800 text-charcoal-600 dark:text-charcoal-300 font-medium"
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
                  className="px-2 py-0.5 text-xs bg-cream-100 dark:bg-charcoal-800 border border-warm-border dark:border-charcoal-700 rounded-md outline-none text-charcoal-800 dark:text-cream-100 w-24"
                />
              </form>
            ) : (
              <button
                onClick={() => setShowTagInput(true)}
                className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[11px] border border-dashed border-warm-border dark:border-charcoal-700 text-charcoal-500 hover:text-charcoal-700 dark:hover:text-cream-200 hover:bg-cream-100/50 transition-colors"
              >
                <Plus className="w-3 h-3" />
                <span>Add Tag</span>
              </button>
            )}
          </div>
        </div>

        {/* TipTap Editor Content */}
        <div className="prose prose-stone dark:prose-invert max-w-none focus:outline-none min-h-[300px]">
          <EditorContent editor={editor} />
        </div>

        {/* Live Document Statistics Bar */}
        <div className="mt-12 pt-4 border-t border-warm-border/60 dark:border-charcoal-800 flex items-center justify-between text-[11px] text-charcoal-400 dark:text-charcoal-500 font-mono">
          <div className="flex items-center space-x-3">
            <span>{wordCount} {wordCount === 1 ? 'word' : 'words'}</span>
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
  );
};
