import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  Check,
  Keyboard,
  PenTool,
  Columns,
  Sparkles,
  Layers,
  ChevronRight,
  Maximize2
} from 'lucide-react';
import { useEditorSettings } from '../../context/EditorSettingsContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import { EditorToolbar } from './EditorToolbar';
import { DrawingCanvas } from '../drawing/DrawingCanvas';
import { DrawingToolbar } from '../drawing/DrawingToolbar';
import { DrawingAiCleanupModal } from '../drawing/DrawingAiCleanupModal';
import { DrawingModal } from '../drawing/DrawingModal';
import { cleanupDrawingWithAi } from '../../services/drawingAiService';
import { markdownToHtml, htmlToMarkdown, stripHtmlToPlainText } from '../../utils/markdownUtils';
import VersionPreviewBanner from '../versions/VersionPreviewBanner';

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
  onManualSave,
  isReadOnly = false,
  previewVersion = null,
  onExitPreview,
  onRestorePreview,
  onOpenVersionHistory
}) => {
  const { fontSize, lineNumbers, spellCheck } = useEditorSettings();
  const { isDark } = useTheme();
  const { success, error: toastError, info } = useToast();

  const [title, setTitle] = useState(note?.title || 'Untitled Note');
  const fileInputRef = useRef(null);

  // View state: 'type' | 'draw' | 'split'
  const [noteView, setNoteView] = useState(() => {
    const isSketch = note?.tags?.includes('sketch') || note?.title?.toLowerCase().includes('sketch');
    const hasStrokes = Array.isArray(note?.drawings) && note.drawings.length > 0 && note.drawings[0]?.strokes?.length > 0;
    const hasText = note?.content && note.content !== '<p></p>' && note.content.trim();
    if (isSketch || (hasStrokes && !hasText)) {
      return 'draw';
    }
    return 'type';
  });

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

  // Drawing & Scribble Modal State (for inserting inline sketch images)
  const [isDrawingModalOpen, setIsDrawingModalOpen] = useState(false);
  const [isQuickScribble, setIsQuickScribble] = useState(false);
  const [editingDrawing, setEditingDrawing] = useState(null);

  // =========================================================================
  // NATIVE INLINE DRAWING & SMART INK STATE
  // =========================================================================
  const canvasRef = useRef(null);
  const [drawingTool, setDrawingTool] = useState('pen');
  const [drawingColor, setDrawingColor] = useState(() => (isDark ? '#c084fc' : '#7c3aed'));
  const [drawingThickness, setDrawingThickness] = useState(3);
  const [drawingBg, setDrawingBg] = useState(() => note?.drawings?.[0]?.background || 'lines');
  const [drawingZoom, setDrawingZoom] = useState(1);
  const [drawingHistory, setDrawingHistory] = useState({ canUndo: false, canRedo: false });
  const [drawingStrokeCount, setDrawingStrokeCount] = useState(() => note?.drawings?.[0]?.strokes?.length || 0);
  const [smartInkEnabled, setSmartInkEnabled] = useState(true);

  // Gemini AI Handwriting Recognition State
  const [isAiCleaning, setIsAiCleaning] = useState(false);
  const [aiCleanupData, setAiCleanupData] = useState(null);
  const [aiPreviewImage, setAiPreviewImage] = useState(null);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  const initialDrawingData = Array.isArray(note?.drawings) && note.drawings.length > 0
    ? note.drawings[0]
    : {
        id: `draw_${Date.now()}`,
        title: note?.title || 'Handwritten Notes',
        strokes: [],
        background: 'lines',
        width: 1200,
        height: 1800,
        createdAt: new Date().toISOString()
      };

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

      const strokeCount = note?.drawings?.[0]?.strokes?.length || 0;
      setDrawingStrokeCount(strokeCount);

      const isSketch = note?.tags?.includes('sketch') || note?.title?.toLowerCase().includes('sketch');
      const hasText = note?.content && note.content !== '<p></p>' && note.content.trim();
      if (isSketch || (strokeCount > 0 && !hasText)) {
        setNoteView('draw');
      } else {
        setNoteView('type');
      }
    }
  }, [note?._id, note?.id]);

  // Handle stroke changes and auto-save
  const handleCanvasStrokesChange = useCallback((newStrokes) => {
    setDrawingStrokeCount(newStrokes.length);
    if (!canvasRef.current) return;
    const currentData = canvasRef.current.getDrawingData();
    currentData.title = title || 'Handwritten Notes';
    currentData.background = drawingBg;

    const existingDrawings = Array.isArray(note?.drawings) ? [...note.drawings] : [];
    let updatedDrawings;
    if (existingDrawings.length > 0) {
      updatedDrawings = [currentData, ...existingDrawings.slice(1)];
    } else {
      updatedDrawings = [currentData];
    }

    onUpdateNote?.({
      drawings: updatedDrawings,
      updatedAt: new Date().toISOString()
    });
  }, [note?.drawings, title, drawingBg, onUpdateNote]);

  // Align Handwriting geometric baseline alignment
  const handleAlignWriting = () => {
    if (!canvasRef.current) return;
    const res = canvasRef.current.alignHandwriting();
    if (res && res.success) {
      success(`Smart Ink: Aligned ${res.linesAligned} line${res.linesAligned === 1 ? '' : 's'} of handwriting!`);
    } else {
      info('No handwriting lines detected to align');
    }
  };

  // AI Cleanup using Google Gemini
  const handleAiCleanup = async () => {
    if (!canvasRef.current) return;
    if (drawingStrokeCount === 0) {
      info('Please write or draw something on the canvas before running AI cleanup');
      return;
    }

    setIsAiCleaning(true);
    try {
      const pngDataUri = canvasRef.current.getPngDataUri();
      setAiPreviewImage(pngDataUri);

      const res = await cleanupDrawingWithAi({
        image: pngDataUri,
        promptHint: title && title !== 'Untitled Note' && title !== 'Untitled Sketch' ? title : ''
      });

      if (res && res.data) {
        setAiCleanupData(res.data);
        setIsAiModalOpen(true);
        success('Smart Ink AI handwriting recognition completed!');
      } else {
        toastError('Failed to recognize handwriting. Please try again.');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'AI handwriting cleanup failed. Check your connection or API key.';
      toastError(msg);
    } finally {
      setIsAiCleaning(false);
    }
  };

  // Insert recognized AI handwriting text into the note
  const handleInsertAiContent = (markdownText, recognizedTitle) => {
    const formattedHtml = markdownToHtml(markdownText);
    const existingContent = note?.content || (note?.plainText ? `<p>${note.plainText}</p>` : '');
    const newContent = existingContent && existingContent !== '<p></p>' && existingContent.trim()
      ? `${existingContent}<hr />${formattedHtml}`
      : formattedHtml;
    const newPlainText = (note?.plainText ? `${note.plainText}\n\n` : '') + markdownText;

    const nextTitle = (title === 'Untitled Note' || title === 'Untitled Sketch') && recognizedTitle
      ? recognizedTitle
      : title;

    if (nextTitle !== title) {
      setTitle(nextTitle);
    }

    if (editor) {
      editor.commands.setContent(newContent);
    }
    setMarkdownSource(newPlainText);
    setPlainTextValue(newPlainText);

    onUpdateNote?.({
      title: nextTitle,
      content: newContent,
      plainText: newPlainText
    });

    setNoteView('split');
    success('Recognized handwriting inserted into your note!');
  };

  // Handle modal drawing insertion for legacy embedded images
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
    editable: !isReadOnly,
    content: getInitialContent(),
    onUpdate: ({ editor: ed }) => {
      if (isReadOnly) return;
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

  // Keep editor editable state in sync with isReadOnly
  useEffect(() => {
    if (editor) {
      editor.setEditable(!isReadOnly);
    }
  }, [editor, isReadOnly]);

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

  // =========================================================================
  // VIEW SWITCHER PILL (Type | Draw | Split)
  // =========================================================================
  const renderViewSwitcher = () => (
    <div className="flex items-center gap-0.5 p-0.5 rounded-lg border border-purple-500/20 bg-purple-500/5 shrink-0">
      <button
        type="button"
        onClick={() => setNoteView('type')}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-all cursor-pointer ${
          noteView === 'type'
            ? isDark
              ? 'bg-purple-600 text-white shadow-xs font-semibold'
              : 'bg-white text-purple-700 shadow-xs border border-purple-200 font-semibold'
            : isDark
              ? 'text-gray-400 hover:text-white'
              : 'text-slate-600 hover:text-slate-900'
        }`}
        title="Type notes with keyboard"
      >
        <Keyboard className="w-3.5 h-3.5" />
        <span>Type</span>
      </button>

      <button
        type="button"
        onClick={() => setNoteView('draw')}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-all cursor-pointer ${
          noteView === 'draw'
            ? isDark
              ? 'bg-purple-600 text-white shadow-xs font-semibold'
              : 'bg-white text-purple-700 shadow-xs border border-purple-200 font-semibold'
            : isDark
              ? 'text-gray-400 hover:text-white'
              : 'text-slate-600 hover:text-slate-900'
        }`}
        title="Draw & write handwritten notes with Smart Ink AI"
      >
        <PenTool className="w-3.5 h-3.5" />
        <span>Draw</span>
        {drawingStrokeCount > 0 && (
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        )}
      </button>

      <button
        type="button"
        onClick={() => setNoteView('split')}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-all cursor-pointer ${
          noteView === 'split'
            ? isDark
              ? 'bg-purple-600 text-white shadow-xs font-semibold'
              : 'bg-white text-purple-700 shadow-xs border border-purple-200 font-semibold'
            : isDark
              ? 'text-gray-400 hover:text-white'
              : 'text-slate-600 hover:text-slate-900'
        }`}
        title="Split view: Type text and draw handwriting side-by-side"
      >
        <Columns className="w-3.5 h-3.5" />
        <span>Split</span>
      </button>
    </div>
  );

  // =========================================================================
  // DRAWING CANVAS COMPONENT SECTION
  // =========================================================================
  const renderDrawingView = (compact = false) => (
    <div className="flex-1 flex flex-col h-full overflow-hidden relative">
      <DrawingToolbar
        activeTool={drawingTool}
        onSelectTool={setDrawingTool}
        color={drawingColor}
        onChangeColor={setDrawingColor}
        thickness={drawingThickness}
        onChangeThickness={setDrawingThickness}
        background={drawingBg}
        onChangeBackground={(bg) => {
          setDrawingBg(bg);
          if (canvasRef.current) {
            const data = canvasRef.current.getDrawingData();
            data.background = bg;
            onUpdateNote?.({ drawings: [data] });
          }
        }}
        canUndo={drawingHistory.canUndo}
        canRedo={drawingHistory.canRedo}
        onUndo={() => canvasRef.current?.undo()}
        onRedo={() => canvasRef.current?.redo()}
        onClear={() => canvasRef.current?.clear()}
        zoom={drawingZoom}
        onZoomIn={() => setDrawingZoom((z) => Math.min(2.5, +(z + 0.1).toFixed(1)))}
        onZoomOut={() => setDrawingZoom((z) => Math.max(0.5, +(z - 0.1).toFixed(1)))}
        onFitScreen={() => setDrawingZoom(1)}
        onExportPNG={() => {
          canvasRef.current?.exportPNG(`${title || 'notes'}.png`);
          info('Exported sketch as PNG');
        }}
        onExportSVG={() => {
          canvasRef.current?.exportSVG(`${title || 'notes'}.svg`);
          info('Exported sketch as SVG');
        }}
        smartInkEnabled={smartInkEnabled}
        onToggleSmartInk={() => setSmartInkEnabled((prev) => !prev)}
        onAlignWriting={handleAlignWriting}
        onAiCleanup={handleAiCleanup}
        isAiCleaning={isAiCleaning}
        isCompact={compact}
        rightSlot={!compact ? renderViewSwitcher() : null}
      />

      <div className="flex-1 overflow-hidden relative">
        <DrawingCanvas
          ref={canvasRef}
          initialData={initialDrawingData}
          activeTool={drawingTool}
          color={drawingColor}
          thickness={drawingThickness}
          background={drawingBg}
          zoom={drawingZoom}
          smartInkEnabled={smartInkEnabled}
          onStrokesChange={handleCanvasStrokesChange}
          onHistoryChange={setDrawingHistory}
          className="h-full"
        />
      </div>
    </div>
  );

  // =========================================================================
  // TEXT EDITOR COMPONENT SECTION
  // =========================================================================
  const renderTextEditor = (hideToolbar = false) => (
    <div className="flex-1 flex flex-col h-full overflow-hidden relative">
      {!hideToolbar && (
        <>
          {mode === 'Plain Text' ? (
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
                  <span>{isMonospace ? 'Monospace' : 'Proportional'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyPlainText}
                  className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs transition-colors cursor-pointer ${
                    isDark ? 'text-gray-300 hover:bg-white/5 hover:text-white' : 'text-slate-600 hover:bg-purple-50 hover:text-purple-700'
                  }`}
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>

                {renderViewSwitcher()}
              </div>
            </div>
          ) : mode === 'Markdown' ? (
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
                  MD
                </span>

                {markdownView === 'source' ? (
                  <div className="flex items-center gap-1 pl-2 border-l border-purple-500/20">
                    <button
                      type="button"
                      onClick={() => handleInsertMarkdownSyntax('# ')}
                      className="px-1.5 py-0.5 rounded text-[11px] font-mono hover:bg-purple-500/15 hover:text-purple-400 cursor-pointer"
                    >
                      H1
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInsertMarkdownSyntax('## ')}
                      className="px-1.5 py-0.5 rounded text-[11px] font-mono hover:bg-purple-500/15 hover:text-purple-400 cursor-pointer"
                    >
                      H2
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInsertMarkdownSyntax('**', '**')}
                      className="px-1.5 py-0.5 rounded text-[11px] font-bold hover:bg-purple-500/15 hover:text-purple-400 cursor-pointer"
                    >
                      B
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInsertMarkdownSyntax('*', '*')}
                      className="px-1.5 py-0.5 rounded text-[11px] italic hover:bg-purple-500/15 hover:text-purple-400 cursor-pointer"
                    >
                      I
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInsertMarkdownSyntax('`', '`')}
                      className="px-1.5 py-0.5 rounded text-[11px] font-mono hover:bg-purple-500/15 hover:text-purple-400 cursor-pointer"
                    >
                      &lt;/&gt;
                    </button>
                  </div>
                ) : null}
              </div>

              <div className="flex items-center gap-2">
                <div
                  className={`flex items-center p-0.5 rounded-lg border ${
                    isDark ? 'bg-[#181624] border-[#2c2c3e]' : 'bg-[#f4effc] border-purple-200'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => handleToggleMarkdownView('wysiwyg')}
                    className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
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
                    <span>Live</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleToggleMarkdownView('source')}
                    className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
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
                    <span>Source</span>
                  </button>
                </div>

                {renderViewSwitcher()}
              </div>
            </div>
          ) : (
            <EditorToolbar
              editor={editor}
              onInsertImage={() => fileInputRef.current?.click()}
              onInsertImageUrl={handleInsertImageUrl}
              onOpenDrawingModal={handleOpenInsertDrawing}
              onOpenQuickScribble={() => setNoteView('draw')}
              noteView={noteView}
              onSwitchView={setNoteView}
              hasDrawings={drawingStrokeCount > 0}
              onOpenVersionHistory={onOpenVersionHistory}
            />
          )}

          {mode === 'Markdown' && markdownView === 'wysiwyg' && (
            <EditorToolbar
              editor={editor}
              onInsertImage={() => fileInputRef.current?.click()}
              onInsertImageUrl={handleInsertImageUrl}
              onOpenDrawingModal={handleOpenInsertDrawing}
              onOpenQuickScribble={() => setNoteView('draw')}
              noteView={noteView}
              onSwitchView={setNoteView}
              hasDrawings={drawingStrokeCount > 0}
              onOpenVersionHistory={onOpenVersionHistory}
            />
          )}
        </>
      )}

      {/* Main Document Text Scroll Area */}
      <div className="flex-1 overflow-y-auto obsidian-scrollbar px-6 sm:px-12 py-8 max-w-4xl mx-auto w-full space-y-4">
        {/* Document Title Header */}
        <div
          className={`flex items-center gap-1 group relative pb-2 border-b ${
            isDark ? 'border-purple-500/20' : 'border-[#EAE6F4]'
          }`}
        >
          <input
            type="text"
            value={title}
            onChange={isReadOnly ? undefined : handleTitleChange}
            readOnly={isReadOnly}
            spellCheck={spellCheck}
            placeholder="Untitled Note"
            className={`text-2xl sm:text-3xl font-bold bg-transparent border-none focus:outline-none w-full tracking-tight caret-purple-500 ${
              isDark ? 'text-white placeholder-gray-500' : 'text-[#111827] placeholder-slate-400'
            } ${isReadOnly ? 'cursor-default opacity-90' : ''}`}
          />
        </div>

        {/* Drawing Notice Banner if Note Contains Handwritten Strokes */}
        {drawingStrokeCount > 0 && noteView === 'type' && (
          <div
            className={`p-3 rounded-xl border flex items-center justify-between transition-colors ${
              isDark ? 'bg-purple-950/20 border-purple-500/30 text-purple-200' : 'bg-purple-50/80 border-purple-200 text-purple-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
                <PenTool className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold flex items-center gap-1.5">
                  <span>Handwritten Canvas Attached</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                    {drawingStrokeCount} strokes
                  </span>
                </div>
                <p className={`text-[11px] mt-0.5 ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                  This note contains handwritten ink and drawings.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setNoteView('draw')}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <PenTool className="w-3.5 h-3.5" />
                <span>Open Canvas</span>
              </button>
              <button
                type="button"
                onClick={() => setNoteView('split')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer flex items-center gap-1.5 ${
                  isDark ? 'border-purple-500/30 text-purple-300 hover:bg-purple-500/15' : 'border-purple-200 text-purple-700 hover:bg-purple-100'
                }`}
              >
                <Columns className="w-3.5 h-3.5" />
                <span>Split View</span>
              </button>
            </div>
          </div>
        )}

        {/* Dynamic Editor Content View */}
        {mode === 'Plain Text' ? (
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
    </div>
  );

  return (
    <div className={`flex-1 flex flex-col h-full overflow-hidden select-text transition-colors duration-150 ${
      isDark ? 'bg-[#0e0e14] text-gray-200' : 'bg-white text-[#181326]'
    }`}>
      {/* Historical Version Preview Banner */}
      {previewVersion && (
        <VersionPreviewBanner
          version={previewVersion}
          onExitPreview={onExitPreview}
          onRestore={onRestorePreview}
        />
      )}

      {/* Hidden file input for inserting images */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Main Mode Viewport Routing */}
      {noteView === 'split' ? (
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {/* Split Mode Header */}
          <div className={`h-9 border-b px-4 flex items-center justify-between text-xs select-none shrink-0 ${
            isDark ? 'bg-[#12121c] border-[#222232] text-gray-400' : 'bg-[#FAFAFD] border-[#EAE6F4] text-[#6B7280]'
          }`}>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-xs text-purple-400 flex items-center gap-1.5">
                <Columns className="w-3.5 h-3.5" />
                <span>Split Mode: Text + Handwriting Canvas</span>
              </span>
            </div>
            {renderViewSwitcher()}
          </div>

          <div className="flex-1 flex flex-col md:flex-row h-[calc(100%-36px)] overflow-hidden">
            {/* Left: Text Editor */}
            <div className={`flex-1 flex flex-col border-b md:border-b-0 md:border-r overflow-hidden ${
              isDark ? 'border-[#222232]' : 'border-[#EAE6F4]'
            }`}>
              {renderTextEditor(false)}
            </div>

            {/* Right: Drawing Canvas */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {renderDrawingView(true)}
            </div>
          </div>
        </div>
      ) : noteView === 'draw' ? (
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {/* Document Title Header in Draw Mode */}
          <div className={`px-6 sm:px-10 py-3 border-b flex items-center justify-between shrink-0 ${
            isDark ? 'bg-[#101018] border-[#20202e]' : 'bg-white border-[#EAE6F4]'
          }`}>
            <input
              type="text"
              value={title}
              onChange={isReadOnly ? undefined : handleTitleChange}
              readOnly={isReadOnly}
              placeholder="Untitled Sketch"
              className={`text-xl sm:text-2xl font-bold bg-transparent border-none focus:outline-none w-full tracking-tight caret-purple-500 ${
                isDark ? 'text-white placeholder-gray-500' : 'text-[#111827] placeholder-slate-400'
              } ${isReadOnly ? 'cursor-default opacity-90' : ''}`}
            />
            <div className="hidden sm:flex items-center gap-2 pl-4">
              <span className="text-[11px] text-purple-400 font-medium px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 whitespace-nowrap">
                ✍️ Smart Ink Canvas
              </span>
            </div>
          </div>

          {/* Drawing Toolbar and Canvas */}
          {renderDrawingView(false)}
        </div>
      ) : (
        /* Regular Type Mode */
        renderTextEditor(false)
      )}

      {/* Gemini AI Handwriting Recognition Modal */}
      <DrawingAiCleanupModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        data={aiCleanupData}
        previewImage={aiPreviewImage}
        onInsertIntoNote={handleInsertAiContent}
      />

      {/* Interactive Drawing & Scribble Modal for Inline Insertion */}
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
