import React, { useState, useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import Placeholder from '@tiptap/extension-placeholder';
import {
  Eye,
  Code,
  FileText,
  Type,
  Copy,
  Check
} from 'lucide-react';
import { useEditorSettings } from '../../context/EditorSettingsContext';
import { useTheme } from '../../context/ThemeContext';
import { EditorToolbar } from './EditorToolbar';
import { markdownToHtml, htmlToMarkdown, stripHtmlToPlainText } from '../../utils/markdownUtils';
import { DrawingModal } from '../drawing/DrawingModal';

// Enhanced Image extension preserving drawing vector metadata
const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      'data-drawing-id': {
        default: null,
        parseHTML: (el) => el.getAttribute('data-drawing-id'),
        renderHTML: (attrs) => (attrs['data-drawing-id'] ? { 'data-drawing-id': attrs['data-drawing-id'] } : {})
      },
      'data-drawing-title': {
        default: null,
        parseHTML: (el) => el.getAttribute('data-drawing-title'),
        renderHTML: (attrs) => (attrs['data-drawing-title'] ? { 'data-drawing-title': attrs['data-drawing-title'] } : {})
      },
      'data-drawing-data': {
        default: null,
        parseHTML: (el) => el.getAttribute('data-drawing-data'),
        renderHTML: (attrs) => (attrs['data-drawing-data'] ? { 'data-drawing-data': attrs['data-drawing-data'] } : {})
      }
    };
  }
});

export const RichTextEditor = ({
  note,
  mode = 'Rich Text',
  onUpdateNote,
  onWordCountChange,
  onInsertImageRef,
  onManualSave
}) => {
  const { fontSize, lineNumbers, spellCheck } = useEditorSettings();
  const { isDark } = useTheme();
  const [title, setTitle] = useState(note?.title || 'Untitled Note');
  const fileInputRef = useRef(null);

  // Markdown Mode State: 'wysiwyg' | 'source'
  const [markdownView, setMarkdownView] = useState('wysiwyg');
  const [markdownSource, setMarkdownSource] = useState(() => {
    if (note?.plainText && typeof note.plainText === 'string' && note.plainText.trim()) {
      return note.plainText;
    }
    return htmlToMarkdown(note?.content || '');
  });

  // Plain Text Mode State
  const [plainTextValue, setPlainTextValue] = useState(() => {
    if (note?.plainText && typeof note.plainText === 'string' && note.plainText.trim()) {
      return note.plainText;
    }
    return stripHtmlToPlainText(note?.content || '');
  });
  const [isMonospace, setIsMonospace] = useState(true);
  const [copied, setCopied] = useState(false);

  const rawTextareaRef = useRef(null);

  // Drawing & Scribble Modal State
  const [isDrawingModalOpen, setIsDrawingModalOpen] = useState(false);
  const [isQuickScribble, setIsQuickScribble] = useState(false);
  const [editingDrawing, setEditingDrawing] = useState(null);

  const handleOpenInsertDrawing = () => {
    setEditingDrawing(null);
    setIsQuickScribble(false);
    setIsDrawingModalOpen(true);
  };

  const handleOpenQuickScribble = () => {
    setEditingDrawing(null);
    setIsQuickScribble(true);
    setIsDrawingModalOpen(true);
  };

  const handleSaveDrawing = (drawingData, svgDataUri) => {
    const existingDrawings = Array.isArray(note?.drawings) ? [...note.drawings] : [];
    const existingIndex = existingDrawings.findIndex((d) => d.id === drawingData.id);

    let updatedDrawings;
    if (existingIndex >= 0) {
      updatedDrawings = existingDrawings.map((d, i) => (i === existingIndex ? drawingData : d));
    } else {
      updatedDrawings = [...existingDrawings, drawingData];
    }

    if (editor) {
      if (editingDrawing) {
        let updated = false;
        editor.state.doc.descendants((node, pos) => {
          if (updated) return false;
          if (node.type.name === 'image' && node.attrs['data-drawing-id'] === drawingData.id) {
            updated = true;
            editor.commands.setNodeSelection(pos);
            editor.commands.updateAttributes('image', {
              src: svgDataUri,
              alt: drawingData.title || 'Drawing',
              'data-drawing-id': drawingData.id,
              'data-drawing-title': drawingData.title,
              'data-drawing-data': JSON.stringify(drawingData)
            });
          }
        });

        if (!updated) {
          editor.chain().focus().insertContent({
            type: 'image',
            attrs: {
              src: svgDataUri,
              alt: drawingData.title || 'Drawing',
              'data-drawing-id': drawingData.id,
              'data-drawing-title': drawingData.title,
              'data-drawing-data': JSON.stringify(drawingData)
            }
          }).run();
        }
      } else {
        editor.chain().focus().insertContent({
          type: 'image',
          attrs: {
            src: svgDataUri,
            alt: drawingData.title || 'Drawing',
            'data-drawing-id': drawingData.id,
            'data-drawing-title': drawingData.title,
            'data-drawing-data': JSON.stringify(drawingData)
          }
        }).run();
      }
    }

    onUpdateNote?.({
      content: editor ? editor.getHTML() : note?.content,
      plainText: editor ? editor.getText() : note?.plainText,
      drawings: updatedDrawings
    });
  };

  const handleEditorClick = (e) => {
    const img = e.target.closest('img');
    if (img) {
      const drawingId = img.getAttribute('data-drawing-id');
      const rawData = img.getAttribute('data-drawing-data');
      let drawingData = null;
      if (rawData) {
        try {
          drawingData = JSON.parse(rawData);
        } catch (_) {}
      }
      if (!drawingData && drawingId && Array.isArray(note?.drawings)) {
        drawingData = note.drawings.find((d) => d.id === drawingId);
      }

      if (drawingData) {
        setEditingDrawing(drawingData);
        setIsQuickScribble(false);
        setIsDrawingModalOpen(true);
      }
    }
  };

  // Determine initial content from the note object
  const getInitialContent = () => {
    if (note?.content && typeof note.content === 'string' && note.content.trim()) {
      return note.content;
    }
    if (note?.plainText && typeof note.plainText === 'string' && note.plainText.trim()) {
      return `<p>${note.plainText}</p>`;
    }
    return '';
  };

  // Tiptap instance configured for Obsidian styling
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] }
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-purple-400 underline underline-offset-2 cursor-pointer'
        }
      }),
      CustomImage.configure({
        inline: false,
        allowBase64: true,
        HTMLAttributes: {
          class: 'editor-image rounded-md border border-purple-500/30 max-h-[500px] my-3 object-cover shadow-md'
        }
      }),
      TaskList,
      TaskItem.configure({
        nested: true
      }),
      Placeholder.configure({
        placeholder: 'Start writing or type markdown...'
      }),
      Table.configure({
        resizable: true
      }),
      TableRow,
      TableHeader,
      TableCell
    ],
    editorProps: {
      attributes: {
        spellcheck: spellCheck ? 'true' : 'false',
        autocorrect: spellCheck ? 'on' : 'off',
        autocapitalize: spellCheck ? 'on' : 'off',
        class: 'focus:outline-none'
      },
      handlePaste: (view, event) => {
        const items = event.clipboardData?.items;
        if (items) {
          for (const item of items) {
            if (item.type.indexOf('image') === 0) {
              const file = item.getAsFile();
              if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                  const src = e.target?.result;
                  if (src && typeof src === 'string') {
                    const node = view.state.schema.nodes.image.create({ src });
                    const tr = view.state.tr.replaceSelectionWith(node);
                    view.dispatch(tr);
                  }
                };
                reader.readAsDataURL(file);
                return true;
              }
            }
          }
        }
        return false;
      },
      handleDrop: (view, event) => {
        const files = event.dataTransfer?.files;
        if (files && files.length > 0 && files[0].type.indexOf('image') === 0) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const src = e.target?.result;
            if (src && typeof src === 'string') {
              const coords = view.posAtCoords({ left: event.clientX, top: event.clientY });
              if (coords) {
                const node = view.state.schema.nodes.image.create({ src });
                const tr = view.state.tr.insert(coords.pos, node);
                view.dispatch(tr);
              }
            }
          };
          reader.readAsDataURL(files[0]);
          return true;
        }
        return false;
      }
    },
    content: getInitialContent(),
    onUpdate: ({ editor: ed }) => {
      const html = ed.getHTML();
      const text = ed.getText();
      const words = text.trim() ? text.trim().split(/\s+/).length : 0;
      const chars = text.length;

      onWordCountChange?.({
        words,
        chars,
        readingTime: Math.max(1, Math.ceil(words / 200))
      });

      onUpdateNote?.({
        title,
        content: html,
        plainText: text
      });
    }
  });

  // Calculate statistics initially for WYSIWYG
  useEffect(() => {
    if (editor && (mode === 'Rich Text' || (mode === 'Markdown' && markdownView === 'wysiwyg'))) {
      const text = editor.getText();
      const words = text.trim() ? text.trim().split(/\s+/).length : 0;
      onWordCountChange?.({
        words,
        chars: text.length,
        readingTime: Math.max(1, Math.ceil(words / 200))
      });
    }
  }, [editor, mode, markdownView]);

  // Synchronize state when selected note changes
  useEffect(() => {
    if (note) {
      setTitle(note.title || 'Untitled Note');

      const nextContent = note.content || (note.plainText ? `<p>${note.plainText}</p>` : '');
      if (editor && editor.getHTML() !== nextContent) {
        editor.commands.setContent(nextContent);
      }

      const md = note.plainText && typeof note.plainText === 'string' && note.plainText.trim()
        ? note.plainText
        : htmlToMarkdown(note.content || '');
      setMarkdownSource(md);

      const pt = note.plainText && typeof note.plainText === 'string' && note.plainText.trim()
        ? note.plainText
        : stripHtmlToPlainText(note.content || '');
      setPlainTextValue(pt);
    }
  }, [note?._id, note?.id]);

  // Synchronize spellcheck on editor DOM dynamically
  useEffect(() => {
    if (editor?.view?.dom) {
      editor.view.dom.setAttribute('spellcheck', spellCheck ? 'true' : 'false');
    }
  }, [spellCheck, editor]);

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);

    let contentToSave = editor ? editor.getHTML() : note?.content;
    let plainToSave = editor ? editor.getText() : note?.plainText;

    if (mode === 'Plain Text') {
      contentToSave = plainTextValue;
      plainToSave = plainTextValue;
    } else if (mode === 'Markdown' && markdownView === 'source') {
      contentToSave = markdownToHtml(markdownSource);
      plainToSave = markdownSource;
    }

    onUpdateNote?.({
      title: newTitle,
      content: contentToSave,
      plainText: plainToSave
    });
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && editor) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const src = uploadEvent.target?.result;
        if (src && typeof src === 'string') {
          editor.chain().focus().setImage({ src }).run();
        }
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const handleInsertImageUrl = (src) => {
    if (src && editor) {
      editor.chain().focus().setImage({ src }).run();
    }
  };

  // Plain text changes
  const handlePlainTextChange = (e) => {
    const val = e.target.value;
    setPlainTextValue(val);

    const words = val.trim() ? val.trim().split(/\s+/).length : 0;
    onWordCountChange?.({
      words,
      chars: val.length,
      readingTime: Math.max(1, Math.ceil(words / 200))
    });

    onUpdateNote?.({
      title,
      content: val,
      plainText: val
    });
  };

  // Copy plain text content
  const handleCopyPlainText = () => {
    navigator.clipboard.writeText(plainTextValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Markdown source changes
  const handleMarkdownSourceChange = (e) => {
    const val = e.target.value;
    setMarkdownSource(val);

    const words = val.trim() ? val.trim().split(/\s+/).length : 0;
    onWordCountChange?.({
      words,
      chars: val.length,
      readingTime: Math.max(1, Math.ceil(words / 200))
    });

    const parsedHtml = markdownToHtml(val);
    onUpdateNote?.({
      title,
      content: parsedHtml,
      plainText: val
    });
  };

  // Insert markdown syntax helper
  const handleInsertMarkdownSyntax = (prefix, suffix = '') => {
    const textarea = rawTextareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const current = markdownSource;
    const selected = current.substring(start, end);

    const replacement = `${prefix}${selected || 'text'}${suffix}`;
    const nextValue = current.substring(0, start) + replacement + current.substring(end);

    setMarkdownSource(nextValue);

    const parsedHtml = markdownToHtml(nextValue);
    onUpdateNote?.({
      title,
      content: parsedHtml,
      plainText: nextValue
    });

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + (selected ? selected.length : 4));
    }, 10);
  };

  // Toggle between Markdown Live View and Markdown Source View
  const handleToggleMarkdownView = (view) => {
    setMarkdownView(view);
    if (view === 'wysiwyg' && editor) {
      const renderedHtml = markdownToHtml(markdownSource);
      editor.commands.setContent(renderedHtml);
    } else if (view === 'source' && editor) {
      const currentMd = htmlToMarkdown(editor.getHTML());
      setMarkdownSource(currentMd);
    }
  };

  return (
    <div className={`flex-1 flex flex-col h-full overflow-hidden select-text transition-colors duration-150 ${
      isDark ? 'bg-[#0e0e14] text-gray-200' : 'bg-white text-[#181326]'
    }`}>
      {/* Hidden file input for inserting images */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* ============================================================== */}
      {/* 1. TOOLBAR AREA (Adapts to Mode)                               */}
      {/* ============================================================== */}
      {mode === 'Plain Text' ? (
        /* Plain Text Minimal Header Bar */
        <div
          className={`h-9 border-b px-4 flex items-center justify-between text-xs select-none transition-colors duration-150 ${
            isDark ? 'bg-[#12121c] border-[#222232] text-gray-400' : 'bg-[#FAFAFD] border-[#EAE6F4] text-[#6B7280]'
          }`}
        >
          <div className="flex items-center gap-2">
            <span
              className="font-mono text-[10px] px-1.5 py-0.5 rounded font-bold"
              style={{
                backgroundColor: 'var(--accent-bg, rgba(168, 85, 247, 0.15))',
                color: 'var(--accent-text, #c084fc)'
              }}
            >
              TXT
            </span>
            <span className="font-semibold text-xs">Plain Text Editor</span>
            <span className="text-[11px] opacity-60">• Clean, unformatted text</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsMonospace(!isMonospace)}
              className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs transition-colors cursor-pointer ${
                isMonospace
                  ? isDark ? 'bg-purple-900/30 text-purple-300 border border-purple-500/30' : 'bg-purple-100 text-purple-700 border border-purple-300'
                  : isDark ? 'text-gray-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Type className="w-3.5 h-3.5" />
              <span>{isMonospace ? 'Monospace Font' : 'Proportional Font'}</span>
            </button>

            <button
              type="button"
              onClick={handleCopyPlainText}
              className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs transition-colors cursor-pointer ${
                isDark ? 'text-gray-300 hover:bg-white/5 hover:text-white' : 'text-slate-600 hover:bg-purple-50 hover:text-purple-700'
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy All'}</span>
            </button>
          </div>
        </div>
      ) : mode === 'Markdown' ? (
        /* Markdown Mode Header Bar with Source / Live View Toggle */
        <div
          className={`h-9 border-b px-4 flex items-center justify-between text-xs select-none transition-colors duration-150 ${
            isDark ? 'bg-[#12121c] border-[#222232] text-gray-400' : 'bg-[#FAFAFD] border-[#EAE6F4] text-[#6B7280]'
          }`}
        >
          {/* Left: Format Label & Syntax Helpers */}
          <div className="flex items-center gap-2">
            <span
              className="font-mono text-[10px] px-1.5 py-0.5 rounded font-bold"
              style={{
                backgroundColor: 'var(--accent-bg, rgba(168, 85, 247, 0.15))',
                color: 'var(--accent-text, #c084fc)'
              }}
            >
              MD
            </span>

            {/* Quick Syntax Insertion Buttons (Visible in Source Mode) */}
            {markdownView === 'source' ? (
              <div className="flex items-center gap-1 pl-2 border-l border-purple-500/20">
                <button
                  type="button"
                  onClick={() => handleInsertMarkdownSyntax('# ')}
                  title="Heading 1"
                  className="px-1.5 py-0.5 rounded text-[11px] font-mono hover:bg-purple-500/15 hover:text-purple-400 cursor-pointer"
                >
                  H1
                </button>
                <button
                  type="button"
                  onClick={() => handleInsertMarkdownSyntax('## ')}
                  title="Heading 2"
                  className="px-1.5 py-0.5 rounded text-[11px] font-mono hover:bg-purple-500/15 hover:text-purple-400 cursor-pointer"
                >
                  H2
                </button>
                <button
                  type="button"
                  onClick={() => handleInsertMarkdownSyntax('**', '**')}
                  title="Bold"
                  className="px-1.5 py-0.5 rounded text-[11px] font-bold hover:bg-purple-500/15 hover:text-purple-400 cursor-pointer"
                >
                  B
                </button>
                <button
                  type="button"
                  onClick={() => handleInsertMarkdownSyntax('*', '*')}
                  title="Italic"
                  className="px-1.5 py-0.5 rounded text-[11px] italic hover:bg-purple-500/15 hover:text-purple-400 cursor-pointer"
                >
                  I
                </button>
                <button
                  type="button"
                  onClick={() => handleInsertMarkdownSyntax('`', '`')}
                  title="Code snippet"
                  className="px-1.5 py-0.5 rounded text-[11px] font-mono hover:bg-purple-500/15 hover:text-purple-400 cursor-pointer"
                >
                  &lt;/&gt;
                </button>
                <button
                  type="button"
                  onClick={() => handleInsertMarkdownSyntax('> ')}
                  title="Blockquote"
                  className="px-1.5 py-0.5 rounded text-[11px] hover:bg-purple-500/15 hover:text-purple-400 cursor-pointer"
                >
                  Quote
                </button>
                <button
                  type="button"
                  onClick={() => handleInsertMarkdownSyntax('- ')}
                  title="List item"
                  className="px-1.5 py-0.5 rounded text-[11px] hover:bg-purple-500/15 hover:text-purple-400 cursor-pointer"
                >
                  List
                </button>
                <button
                  type="button"
                  onClick={() => handleInsertMarkdownSyntax('[', '](https://)')}
                  title="Link"
                  className="px-1.5 py-0.5 rounded text-[11px] hover:bg-purple-500/15 hover:text-purple-400 cursor-pointer"
                >
                  Link
                </button>
              </div>
            ) : null}
          </div>

          {/* Right: Segmented Switcher for [Live View] vs [Raw Markdown Source] */}
          <div
            className={`flex items-center p-0.5 rounded-lg border ${
              isDark ? 'bg-[#181624] border-[#2c2c3e]' : 'bg-[#f4effc] border-purple-200'
            }`}
          >
            <button
              type="button"
              onClick={() => handleToggleMarkdownView('wysiwyg')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                markdownView === 'wysiwyg'
                  ? isDark
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-white text-purple-700 shadow-xs border border-purple-200'
                  : isDark
                    ? 'text-gray-400 hover:text-white'
                    : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Live Preview</span>
            </button>
            <button
              type="button"
              onClick={() => handleToggleMarkdownView('source')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                markdownView === 'source'
                  ? isDark
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-white text-purple-700 shadow-xs border border-purple-200'
                  : isDark
                    ? 'text-gray-400 hover:text-white'
                    : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>Markdown Source</span>
            </button>
          </div>
        </div>
      ) : (
        /* Rich Text Formatting Toolbar */
        <EditorToolbar
          editor={editor}
          onInsertImage={() => fileInputRef.current?.click()}
          onInsertImageUrl={handleInsertImageUrl}
          onOpenDrawingModal={handleOpenInsertDrawing}
          onOpenQuickScribble={handleOpenQuickScribble}
        />
      )}

      {/* In Markdown Live View, also show the formatting toolbar if desired */}
      {mode === 'Markdown' && markdownView === 'wysiwyg' && (
        <EditorToolbar
          editor={editor}
          onInsertImage={() => fileInputRef.current?.click()}
          onInsertImageUrl={handleInsertImageUrl}
          onOpenDrawingModal={handleOpenInsertDrawing}
          onOpenQuickScribble={handleOpenQuickScribble}
        />
      )}

      {/* ============================================================== */}
      {/* 2. MAIN DOCUMENT CANVAS SCROLL AREA                            */}
      {/* ============================================================== */}
      <div className="flex-1 overflow-y-auto obsidian-scrollbar px-6 sm:px-12 py-8 max-w-4xl mx-auto w-full space-y-4">
        {/* Document Title Header with accent vertical cursor bar */}
        <div
          className={`flex items-center gap-1 group relative pb-2 border-b ${
            isDark ? 'border-purple-500/20' : 'border-[#EAE6F4]'
          }`}
        >
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            spellCheck={spellCheck}
            placeholder="Untitled Note"
            className={`text-2xl sm:text-3xl font-bold bg-transparent border-none focus:outline-none w-full tracking-tight ${
              isDark ? 'text-white' : 'text-[#111827]'
            }`}
          />
          <span className="title-cursor" />
        </div>

        {/* Dynamic Editor Content View */}
        {mode === 'Plain Text' ? (
          /* PLAIN TEXT MODE */
          <div className="flex-1 pt-2 min-h-[380px]">
            <textarea
              value={plainTextValue}
              onChange={handlePlainTextChange}
              placeholder="Start typing unformatted plain text..."
              spellCheck={spellCheck}
              className={`w-full min-h-[400px] bg-transparent border-none focus:outline-none leading-relaxed transition-all resize-none ${
                isMonospace ? 'font-mono text-sm' : 'font-sans text-base'
              } ${isDark ? 'text-gray-200 placeholder-gray-500' : 'text-[#181326] placeholder-slate-400'}`}
              style={{ fontSize: `${fontSize}px` }}
            />
          </div>
        ) : mode === 'Markdown' && markdownView === 'source' ? (
          /* MARKDOWN SOURCE MODE */
          <div className="flex-1 pt-2 min-h-[380px]">
            <textarea
              ref={rawTextareaRef}
              value={markdownSource}
              onChange={handleMarkdownSourceChange}
              placeholder="# Markdown Heading&#10;&#10;Write **bold**, *italic*, - list, or [links](url)..."
              spellCheck={spellCheck}
              className={`w-full min-h-[400px] bg-transparent border-none focus:outline-none font-mono text-sm leading-relaxed transition-all resize-none ${
                isDark ? 'text-purple-200/90 placeholder-gray-600' : 'text-purple-950 placeholder-slate-400'
              }`}
              style={{ fontSize: `${fontSize}px` }}
            />
          </div>
        ) : (
          /* WYSIWYG / RICH-TEXT MODE (Tiptap Canvas) */
          <div
            onClick={handleEditorClick}
            onDoubleClick={handleEditorClick}
            className={`obsidian-editor flex-1 pt-2 min-h-[350px] transition-all duration-150 ${lineNumbers ? 'show-line-numbers' : ''}`}
            style={{ fontSize: `${fontSize}px` }}
          >
            <EditorContent editor={editor} spellCheck={spellCheck} />
          </div>
        )}
      </div>

      {/* Interactive Drawing & Scribble Modal */}
      <DrawingModal
        isOpen={isDrawingModalOpen}
        onClose={() => setIsDrawingModalOpen(false)}
        onSave={handleSaveDrawing}
        initialData={editingDrawing}
        isQuickScribble={isQuickScribble}
        noteTitle={title}
      />
    </div>
  );
};

export default RichTextEditor;
