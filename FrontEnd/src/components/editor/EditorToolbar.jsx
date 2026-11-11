import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Link as LinkIcon,
  Image as ImageIcon,
  Table as TableIcon,
  CheckSquare,
  List,
  ListOrdered,
  Quote,
  Undo2,
  Redo2,
  ChevronDown,
  Plus,
  Trash2,
  Upload,
  Globe,
  Pencil,
  PenTool
} from 'lucide-react';

export const EditorToolbar = ({
  editor,
  onInsertImage,
  onInsertImageUrl,
  onOpenDrawingModal,
  onOpenQuickScribble
}) => {
  const { isDark } = useTheme();
  const [headingDropdownOpen, setHeadingDropdownOpen] = useState(false);
  const [imageDropdownOpen, setImageDropdownOpen] = useState(false);
  const [tableDropdownOpen, setTableDropdownOpen] = useState(false);
  const [, setEditorTick] = useState(0);

  const headingRef = useRef(null);
  const imageRef = useRef(null);
  const tableRef = useRef(null);

  // Sync toolbar with editor state (selection changes, format changes)
  useEffect(() => {
    if (!editor) return;
    const update = () => setEditorTick((t) => t + 1);
    editor.on('transaction', update);
    editor.on('selectionUpdate', update);
    return () => {
      editor.off('transaction', update);
      editor.off('selectionUpdate', update);
    };
  }, [editor]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (headingRef.current && !headingRef.current.contains(e.target)) {
        setHeadingDropdownOpen(false);
      }
      if (imageRef.current && !imageRef.current.contains(e.target)) {
        setImageDropdownOpen(false);
      }
      if (tableRef.current && !tableRef.current.contains(e.target)) {
        setTableDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!editor) return null;

  // Current heading label
  const getHeadingLabel = () => {
    if (editor.isActive('heading', { level: 1 })) return 'H1';
    if (editor.isActive('heading', { level: 2 })) return 'H2';
    if (editor.isActive('heading', { level: 3 })) return 'H3';
    return 'Text';
  };

  // Smart Code / CodeBlock Handler
  const handleCodeToggle = () => {
    if (editor.isActive('codeBlock')) {
      editor.chain().focus().toggleCodeBlock().run();
      return;
    }
    if (editor.isActive('code')) {
      editor.chain().focus().toggleCode().run();
      return;
    }

    // If multiple lines selected or cursor on an empty paragraph, toggle codeBlock; else inline code
    const { from, to } = editor.state.selection;
    const text = editor.state.doc.textBetween(from, to, '\n');
    if (text.includes('\n') || (from === to && editor.state.selection.$from.parent.content.size === 0)) {
      editor.chain().focus().toggleCodeBlock().run();
    } else {
      editor.chain().focus().toggleCode().run();
    }
  };

  // Link Handler
  const handleLink = () => {
    if (editor.isActive('link')) {
      const prevUrl = editor.getAttributes('link').href || '';
      const choice = window.prompt(
        'Link URL (Edit or leave empty to remove link):',
        prevUrl
      );
      if (choice === null) return;
      if (choice.trim() === '') {
        editor.chain().focus().extendMarkRange('link').unsetLink().run();
      } else {
        editor.chain().focus().extendMarkRange('link').setLink({ href: choice.trim() }).run();
      }
      return;
    }

    const url = window.prompt('Enter link URL (e.g. https://notenest.app):', 'https://');
    if (!url || !url.trim() || url === 'https://') return;

    if (editor.state.selection.empty) {
      editor.chain().focus().insertContent(`<a href="${url.trim()}">${url.trim()}</a> `).run();
    } else {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url.trim() }).run();
    }
  };

  // Image insertion via URL prompt
  const handlePromptImageUrl = () => {
    setImageDropdownOpen(false);
    const url = window.prompt('Enter image URL (e.g. https://images.unsplash.com/...):');
    if (url && url.trim()) {
      if (onInsertImageUrl) {
        onInsertImageUrl(url.trim());
      } else {
        editor.chain().focus().setImage({ src: url.trim() }).run();
      }
    }
  };

  // Table Handler
  const isInsideTable = editor.isActive('table');

  const handleTableButtonClick = () => {
    if (!isInsideTable) {
      // If not in a table, insert a default 3x3 table with header row
      editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
    } else {
      // If inside table, toggle the table options menu
      setTableDropdownOpen(!tableDropdownOpen);
    }
  };

  const getBtnClass = (isActive) =>
    `p-1.5 rounded-[3px] transition-colors ${
      isActive
        ? isDark
          ? 'bg-purple-900/40 text-purple-300 border border-purple-500/40'
          : 'bg-[#EDE9FE] text-[#7C3AED] border border-[#DDD6FE]'
        : isDark
          ? 'text-gray-400 hover:text-gray-200 hover:bg-[#202030]'
          : 'text-[#6B7280] hover:text-[#181326] hover:bg-[#F3F0F9]'
    }`;

  return (
    <div className={`h-9 border-b px-4 flex items-center justify-between select-none text-xs transition-colors duration-150 ${
      isDark ? 'bg-[#161622] border-[#222230]' : 'bg-[#FAFAFD] border-[#EAE6F4]'
    }`}>
      <div className="flex items-center gap-1 overflow-x-auto obsidian-scrollbar py-1">
        {/* 1. Heading Dropdown */}
        <div className="relative mr-1" ref={headingRef}>
          <button
            type="button"
            onClick={() => setHeadingDropdownOpen(!headingDropdownOpen)}
            className={`flex items-center gap-1 px-2 py-1 rounded-[3px] text-xs font-semibold border transition-colors ${
              isDark
                ? 'bg-[#1d1d2b] hover:bg-[#252538] text-gray-200 border-[#2b2b3d]'
                : 'bg-white hover:bg-[#F3F0F9] text-[#181326] border-[#E2DEEE]'
            }`}
            title="Heading Style"
          >
            <span>{getHeadingLabel()}</span>
            <ChevronDown className={`w-3 h-3 ${isDark ? 'text-gray-400' : 'text-[#6B7280]'}`} />
          </button>

          {headingDropdownOpen && (
            <div className={`absolute top-full left-0 mt-1 border shadow-2xl rounded-[4px] py-1 z-50 w-36 text-xs backdrop-blur-sm ${
              isDark ? 'bg-[#1c1c28] border-[#2b2b3d]' : 'bg-white border-[#E2DEEE] shadow-purple-100'
            }`}>
              <button
                type="button"
                onClick={() => {
                  editor.chain().focus().setParagraph().run();
                  setHeadingDropdownOpen(false);
                }}
                className={`w-full text-left px-3 py-1.5 flex items-center justify-between transition-colors ${
                  !editor.isActive('heading')
                    ? isDark ? 'text-purple-400 font-semibold bg-[#272738]/50' : 'text-[#7C3AED] font-semibold bg-[#EDE9FE]'
                    : isDark ? 'text-gray-300 hover:bg-[#272738]' : 'text-[#374151] hover:bg-[#F3F0F9]'
                }`}
              >
                <span>Normal Text</span>
                <span className={`text-[10px] font-mono ${isDark ? 'text-gray-500' : 'text-[#9CA3AF]'}`}>P</span>
              </button>
              <div className={`my-1 border-t ${isDark ? 'border-[#2a2a3d]' : 'border-[#EAE6F4]'}`} />
              <button
                type="button"
                onClick={() => {
                  editor.chain().focus().setHeading({ level: 1 }).run();
                  setHeadingDropdownOpen(false);
                }}
                className={`w-full text-left px-3 py-1.5 flex items-center justify-between transition-colors ${
                  editor.isActive('heading', { level: 1 })
                    ? isDark ? 'text-purple-400 font-bold bg-[#272738]/50' : 'text-[#7C3AED] font-bold bg-[#EDE9FE]'
                    : isDark ? 'text-gray-300 hover:bg-[#272738]' : 'text-[#374151] hover:bg-[#F3F0F9]'
                }`}
              >
                <span className="font-bold">Heading 1</span>
                <span className={`text-[10px] font-mono ${isDark ? 'text-gray-500' : 'text-[#9CA3AF]'}`}>H1</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  editor.chain().focus().setHeading({ level: 2 }).run();
                  setHeadingDropdownOpen(false);
                }}
                className={`w-full text-left px-3 py-1.5 flex items-center justify-between transition-colors ${
                  editor.isActive('heading', { level: 2 })
                    ? isDark ? 'text-purple-400 font-bold bg-[#272738]/50' : 'text-[#7C3AED] font-bold bg-[#EDE9FE]'
                    : isDark ? 'text-gray-300 hover:bg-[#272738]' : 'text-[#374151] hover:bg-[#F3F0F9]'
                }`}
              >
                <span className="font-semibold">Heading 2</span>
                <span className={`text-[10px] font-mono ${isDark ? 'text-gray-500' : 'text-[#9CA3AF]'}`}>H2</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  editor.chain().focus().setHeading({ level: 3 }).run();
                  setHeadingDropdownOpen(false);
                }}
                className={`w-full text-left px-3 py-1.5 flex items-center justify-between transition-colors ${
                  editor.isActive('heading', { level: 3 })
                    ? isDark ? 'text-purple-400 font-bold bg-[#272738]/50' : 'text-[#7C3AED] font-bold bg-[#EDE9FE]'
                    : isDark ? 'text-gray-300 hover:bg-[#272738]' : 'text-[#374151] hover:bg-[#F3F0F9]'
                }`}
              >
                <span className="font-medium">Heading 3</span>
                <span className={`text-[10px] font-mono ${isDark ? 'text-gray-500' : 'text-[#9CA3AF]'}`}>H3</span>
              </button>
            </div>
          )}
        </div>

        {/* Separator */}
        <div className={`w-[1px] h-4 mx-0.5 ${isDark ? 'bg-[#262638]' : 'bg-[#EAE6F4]'}`} />

        {/* 2. Bold */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={getBtnClass(editor.isActive('bold'))}
          title="Bold (Cmd+B)"
        >
          <Bold className="w-3.5 h-3.5" />
        </button>

        {/* 3. Italic */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={getBtnClass(editor.isActive('italic'))}
          title="Italic (Cmd+I)"
        >
          <Italic className="w-3.5 h-3.5" />
        </button>

        {/* 4. Underline */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={getBtnClass(editor.isActive('underline'))}
          title="Underline (Cmd+U)"
        >
          <Underline className="w-3.5 h-3.5" />
        </button>

        {/* 5. Strikethrough */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={getBtnClass(editor.isActive('strike'))}
          title="Strikethrough"
        >
          <Strikethrough className="w-3.5 h-3.5" />
        </button>

        {/* 6. Code / Code Block */}
        <button
          type="button"
          onClick={handleCodeToggle}
          className={getBtnClass(editor.isActive('code') || editor.isActive('codeBlock'))}
          title="Code / Code Block"
        >
          <Code className="w-3.5 h-3.5" />
        </button>

        {/* Separator */}
        <div className={`w-[1px] h-4 mx-0.5 ${isDark ? 'bg-[#262638]' : 'bg-[#EAE6F4]'}`} />

        {/* 7. Link */}
        <button
          type="button"
          onClick={handleLink}
          className={getBtnClass(editor.isActive('link'))}
          title={editor.isActive('link') ? 'Edit or Remove Link' : 'Insert Link'}
        >
          <LinkIcon className="w-3.5 h-3.5" />
        </button>

        {/* 8. Image (Dropdown with Upload file & URL options) */}
        <div className="relative" ref={imageRef}>
          <button
            type="button"
            onClick={() => setImageDropdownOpen(!imageDropdownOpen)}
            className={`p-1.5 rounded-[3px] transition-colors ${
              isDark ? 'text-gray-400 hover:text-gray-200 hover:bg-[#202030]' : 'text-[#6B7280] hover:text-[#181326] hover:bg-[#F3F0F9]'
            }`}
            title="Insert Image"
          >
            <ImageIcon className="w-3.5 h-3.5" />
          </button>

          {imageDropdownOpen && (
            <div className={`absolute top-full left-0 mt-1 border shadow-2xl rounded-[4px] py-1 z-50 w-44 text-xs backdrop-blur-sm ${
              isDark ? 'bg-[#1c1c28] border-[#2b2b3d]' : 'bg-white border-[#E2DEEE] shadow-purple-100'
            }`}>
              <button
                type="button"
                onClick={() => {
                  setImageDropdownOpen(false);
                  onInsertImage?.();
                }}
                className={`w-full text-left px-3 py-1.5 flex items-center gap-2 ${
                  isDark ? 'text-gray-300 hover:bg-[#272738]' : 'text-[#374151] hover:bg-[#F3F0F9]'
                }`}
              >
                <Upload className="w-3.5 h-3.5 text-purple-500" />
                <span>Upload from device</span>
              </button>
              <button
                type="button"
                onClick={handlePromptImageUrl}
                className={`w-full text-left px-3 py-1.5 flex items-center gap-2 ${
                  isDark ? 'text-gray-300 hover:bg-[#272738]' : 'text-[#374151] hover:bg-[#F3F0F9]'
                }`}
              >
                <Globe className="w-3.5 h-3.5 text-purple-500" />
                <span>Insert from URL...</span>
              </button>
              <div className={`my-1 border-t ${isDark ? 'border-[#2a2a3d]' : 'border-[#EAE6F4]'}`} />
              <button
                type="button"
                onClick={() => {
                  setImageDropdownOpen(false);
                  onOpenDrawingModal?.();
                }}
                className={`w-full text-left px-3 py-1.5 flex items-center gap-2 ${
                  isDark ? 'text-gray-300 hover:bg-[#272738]' : 'text-[#374151] hover:bg-[#F3F0F9]'
                }`}
              >
                <PenTool className="w-3.5 h-3.5 text-purple-500" />
                <span>Create New Drawing...</span>
              </button>
            </div>
          )}
        </div>

        {/* 8b. Quick Scribble */}
        <button
          type="button"
          onClick={onOpenQuickScribble}
          className={`p-1.5 rounded-[3px] transition-colors ${
            isDark ? 'text-gray-400 hover:text-purple-300 hover:bg-[#202030]' : 'text-[#6B7280] hover:text-[#7C3AED] hover:bg-[#F3F0F9]'
          }`}
          title="Quick Scribble - Sketch or write handwritten notes"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>

        {/* 8c. Insert Drawing (Dedicated modal) */}
        <button
          type="button"
          onClick={onOpenDrawingModal}
          className={`p-1.5 rounded-[3px] transition-colors ${
            isDark ? 'text-gray-400 hover:text-purple-300 hover:bg-[#202030]' : 'text-[#6B7280] hover:text-[#7C3AED] hover:bg-[#F3F0F9]'
          }`}
          title="Insert Drawing & Diagrams - Full canvas workspace"
        >
          <PenTool className="w-3.5 h-3.5" />
        </button>

        {/* 9. Table (Inserts 3x3 table or opens options when inside table) */}
        <div className="relative" ref={tableRef}>
          <button
            type="button"
            onClick={handleTableButtonClick}
            className={getBtnClass(isInsideTable)}
            title={isInsideTable ? 'Table Actions' : 'Insert 3x3 Table'}
          >
            <TableIcon className="w-3.5 h-3.5" />
          </button>

          {tableDropdownOpen && isInsideTable && (
            <div className={`absolute top-full left-0 mt-1 border shadow-2xl rounded-[4px] py-1 z-50 w-44 text-xs backdrop-blur-sm ${
              isDark ? 'bg-[#1c1c28] border-[#2b2b3d]' : 'bg-white border-[#E2DEEE] shadow-purple-100'
            }`}>
              <button
                type="button"
                onClick={() => {
                  editor.chain().focus().addRowBefore().run();
                  setTableDropdownOpen(false);
                }}
                className={`w-full text-left px-3 py-1.5 flex items-center gap-2 ${
                  isDark ? 'text-gray-300 hover:bg-[#272738]' : 'text-[#374151] hover:bg-[#F3F0F9]'
                }`}
              >
                <Plus className="w-3 h-3 text-purple-500" />
                <span>Add Row Above</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  editor.chain().focus().addRowAfter().run();
                  setTableDropdownOpen(false);
                }}
                className={`w-full text-left px-3 py-1.5 flex items-center gap-2 ${
                  isDark ? 'text-gray-300 hover:bg-[#272738]' : 'text-[#374151] hover:bg-[#F3F0F9]'
                }`}
              >
                <Plus className="w-3 h-3 text-purple-500" />
                <span>Add Row Below</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  editor.chain().focus().deleteRow().run();
                  setTableDropdownOpen(false);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-red-500/10 flex items-center gap-2 text-red-500"
              >
                <Trash2 className="w-3 h-3 text-red-500" />
                <span>Delete Row</span>
              </button>
              <div className={`my-1 border-t ${isDark ? 'border-[#2a2a3d]' : 'border-[#EAE6F4]'}`} />
              <button
                type="button"
                onClick={() => {
                  editor.chain().focus().addColumnBefore().run();
                  setTableDropdownOpen(false);
                }}
                className={`w-full text-left px-3 py-1.5 flex items-center gap-2 ${
                  isDark ? 'text-gray-300 hover:bg-[#272738]' : 'text-[#374151] hover:bg-[#F3F0F9]'
                }`}
              >
                <Plus className="w-3 h-3 text-purple-500" />
                <span>Add Column Before</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  editor.chain().focus().addColumnAfter().run();
                  setTableDropdownOpen(false);
                }}
                className={`w-full text-left px-3 py-1.5 flex items-center gap-2 ${
                  isDark ? 'text-gray-300 hover:bg-[#272738]' : 'text-[#374151] hover:bg-[#F3F0F9]'
                }`}
              >
                <Plus className="w-3 h-3 text-purple-500" />
                <span>Add Column After</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  editor.chain().focus().deleteColumn().run();
                  setTableDropdownOpen(false);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-red-500/10 flex items-center gap-2 text-red-500"
              >
                <Trash2 className="w-3 h-3 text-red-500" />
                <span>Delete Column</span>
              </button>
              <div className={`my-1 border-t ${isDark ? 'border-[#2a2a3d]' : 'border-[#EAE6F4]'}`} />
              <button
                type="button"
                onClick={() => {
                  editor.chain().focus().deleteTable().run();
                  setTableDropdownOpen(false);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-red-500/10 flex items-center gap-2 text-red-500 font-semibold"
              >
                <Trash2 className="w-3 h-3 text-red-500" />
                <span>Delete Table</span>
              </button>
            </div>
          )}
        </div>

        {/* Separator */}
        <div className={`w-[1px] h-4 mx-0.5 ${isDark ? 'bg-[#262638]' : 'bg-[#EAE6F4]'}`} />

        {/* 10. Checklist / TaskList */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          className={getBtnClass(editor.isActive('taskList'))}
          title="Checklist / Task List"
        >
          <CheckSquare className="w-3.5 h-3.5" />
        </button>

        {/* 11. Bullet List */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={getBtnClass(editor.isActive('bulletList'))}
          title="Bullet List"
        >
          <List className="w-3.5 h-3.5" />
        </button>

        {/* 12. Numbered List */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={getBtnClass(editor.isActive('orderedList'))}
          title="Numbered List"
        >
          <ListOrdered className="w-3.5 h-3.5" />
        </button>

        {/* 13. Blockquote / Callout */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={getBtnClass(editor.isActive('blockquote'))}
          title="Blockquote / Callout"
        >
          <Quote className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 14. Undo / Redo */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className={`p-1.5 rounded-[3px] disabled:opacity-30 disabled:hover:bg-transparent transition-colors ${
            isDark ? 'text-gray-400 hover:text-gray-200 hover:bg-[#202030]' : 'text-[#6B7280] hover:text-[#181326] hover:bg-[#F3F0F9]'
          }`}
          title="Undo (Cmd+Z)"
        >
          <Undo2 className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className={`p-1.5 rounded-[3px] disabled:opacity-30 disabled:hover:bg-transparent transition-colors ${
            isDark ? 'text-gray-400 hover:text-gray-200 hover:bg-[#202030]' : 'text-[#6B7280] hover:text-[#181326] hover:bg-[#F3F0F9]'
          }`}
          title="Redo (Cmd+Shift+Z)"
        >
          <Redo2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default EditorToolbar;
