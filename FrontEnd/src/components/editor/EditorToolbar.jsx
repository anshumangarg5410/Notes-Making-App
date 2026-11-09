import React, { useState, useRef, useEffect } from 'react';
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
  Globe
} from 'lucide-react';

export const EditorToolbar = ({ editor, onInsertImage, onInsertImageUrl }) => {
  const [headingDropdownOpen, setHeadingDropdownOpen] = useState(false);
  const [imageDropdownOpen, setImageDropdownOpen] = useState(false);
  const [tableDropdownOpen, setTableDropdownOpen] = useState(false);

  const headingRef = useRef(null);
  const imageRef = useRef(null);
  const tableRef = useRef(null);

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
    return 'H2';
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

  return (
    <div className="h-9 bg-[#161622] border-b border-[#222230] px-4 flex items-center justify-between select-none text-xs">
      <div className="flex items-center gap-1 overflow-x-auto obsidian-scrollbar py-1">
        {/* 1. Heading Dropdown */}
        <div className="relative mr-1" ref={headingRef}>
          <button
            type="button"
            onClick={() => setHeadingDropdownOpen(!headingDropdownOpen)}
            className="flex items-center gap-1 px-2 py-1 rounded-[3px] bg-[#1d1d2b] hover:bg-[#252538] text-gray-200 text-xs font-semibold border border-[#2b2b3d] transition-colors"
            title="Heading Style"
          >
            <span>{getHeadingLabel()}</span>
            <ChevronDown className="w-3 h-3 text-gray-400" />
          </button>

          {headingDropdownOpen && (
            <div className="absolute top-full left-0 mt-1 bg-[#1c1c28] border border-[#2b2b3d] shadow-2xl rounded-[4px] py-1 z-50 w-36 text-xs backdrop-blur-sm">
              <button
                type="button"
                onClick={() => {
                  editor.chain().focus().toggleHeading({ level: 1 }).run();
                  setHeadingDropdownOpen(false);
                }}
                className={`w-full text-left px-3 py-1.5 hover:bg-[#272738] flex items-center justify-between ${
                  editor.isActive('heading', { level: 1 }) ? 'text-purple-400 font-bold bg-[#272738]/50' : 'text-gray-300'
                }`}
              >
                <span>Heading 1</span>
                <span className="text-[10px] text-gray-500 font-mono">H1</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  editor.chain().focus().toggleHeading({ level: 2 }).run();
                  setHeadingDropdownOpen(false);
                }}
                className={`w-full text-left px-3 py-1.5 hover:bg-[#272738] flex items-center justify-between ${
                  editor.isActive('heading', { level: 2 }) ? 'text-purple-400 font-bold bg-[#272738]/50' : 'text-gray-300'
                }`}
              >
                <span>Heading 2</span>
                <span className="text-[10px] text-gray-500 font-mono">H2</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  editor.chain().focus().toggleHeading({ level: 3 }).run();
                  setHeadingDropdownOpen(false);
                }}
                className={`w-full text-left px-3 py-1.5 hover:bg-[#272738] flex items-center justify-between ${
                  editor.isActive('heading', { level: 3 }) ? 'text-purple-400 font-bold bg-[#272738]/50' : 'text-gray-300'
                }`}
              >
                <span>Heading 3</span>
                <span className="text-[10px] text-gray-500 font-mono">H3</span>
              </button>
              <div className="my-1 border-t border-[#2a2a3d]" />
              <button
                type="button"
                onClick={() => {
                  editor.chain().focus().setParagraph().run();
                  setHeadingDropdownOpen(false);
                }}
                className={`w-full text-left px-3 py-1.5 hover:bg-[#272738] flex items-center justify-between ${
                  editor.isActive('paragraph') ? 'text-purple-400 font-semibold bg-[#272738]/50' : 'text-gray-300'
                }`}
              >
                <span>Paragraph</span>
                <span className="text-[10px] text-gray-500 font-mono">P</span>
              </button>
            </div>
          )}
        </div>

        {/* Separator */}
        <div className="w-[1px] h-4 bg-[#262638] mx-0.5" />

        {/* 2. Bold */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1.5 rounded-[3px] transition-colors ${
            editor.isActive('bold')
              ? 'bg-purple-900/40 text-purple-300 border border-purple-500/40'
              : 'text-gray-400 hover:text-gray-200 hover:bg-[#202030]'
          }`}
          title="Bold (Cmd+B)"
        >
          <Bold className="w-3.5 h-3.5" />
        </button>

        {/* 3. Italic */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded-[3px] transition-colors ${
            editor.isActive('italic')
              ? 'bg-purple-900/40 text-purple-300 border border-purple-500/40'
              : 'text-gray-400 hover:text-gray-200 hover:bg-[#202030]'
          }`}
          title="Italic (Cmd+I)"
        >
          <Italic className="w-3.5 h-3.5" />
        </button>

        {/* 4. Underline */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-1.5 rounded-[3px] transition-colors ${
            editor.isActive('underline')
              ? 'bg-purple-900/40 text-purple-300 border border-purple-500/40'
              : 'text-gray-400 hover:text-gray-200 hover:bg-[#202030]'
          }`}
          title="Underline (Cmd+U)"
        >
          <Underline className="w-3.5 h-3.5" />
        </button>

        {/* 5. Strikethrough */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-1.5 rounded-[3px] transition-colors ${
            editor.isActive('strike')
              ? 'bg-purple-900/40 text-purple-300 border border-purple-500/40'
              : 'text-gray-400 hover:text-gray-200 hover:bg-[#202030]'
          }`}
          title="Strikethrough"
        >
          <Strikethrough className="w-3.5 h-3.5" />
        </button>

        {/* 6. Code / Code Block */}
        <button
          type="button"
          onClick={handleCodeToggle}
          className={`p-1.5 rounded-[3px] transition-colors ${
            editor.isActive('code') || editor.isActive('codeBlock')
              ? 'bg-purple-900/40 text-purple-300 border border-purple-500/40'
              : 'text-gray-400 hover:text-gray-200 hover:bg-[#202030]'
          }`}
          title="Code / Code Block"
        >
          <Code className="w-3.5 h-3.5" />
        </button>

        {/* Separator */}
        <div className="w-[1px] h-4 bg-[#262638] mx-0.5" />

        {/* 7. Link */}
        <button
          type="button"
          onClick={handleLink}
          className={`p-1.5 rounded-[3px] transition-colors ${
            editor.isActive('link')
              ? 'bg-purple-900/40 text-purple-300 border border-purple-500/40'
              : 'text-gray-400 hover:text-gray-200 hover:bg-[#202030]'
          }`}
          title={editor.isActive('link') ? 'Edit or Remove Link' : 'Insert Link'}
        >
          <LinkIcon className="w-3.5 h-3.5" />
        </button>

        {/* 8. Image (Dropdown with Upload file & URL options) */}
        <div className="relative" ref={imageRef}>
          <button
            type="button"
            onClick={() => setImageDropdownOpen(!imageDropdownOpen)}
            className="p-1.5 rounded-[3px] text-gray-400 hover:text-gray-200 hover:bg-[#202030] transition-colors"
            title="Insert Image"
          >
            <ImageIcon className="w-3.5 h-3.5" />
          </button>

          {imageDropdownOpen && (
            <div className="absolute top-full left-0 mt-1 bg-[#1c1c28] border border-[#2b2b3d] shadow-2xl rounded-[4px] py-1 z-50 w-44 text-xs backdrop-blur-sm">
              <button
                type="button"
                onClick={() => {
                  setImageDropdownOpen(false);
                  onInsertImage?.();
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-[#272738] flex items-center gap-2 text-gray-300"
              >
                <Upload className="w-3.5 h-3.5 text-purple-400" />
                <span>Upload from device</span>
              </button>
              <button
                type="button"
                onClick={handlePromptImageUrl}
                className="w-full text-left px-3 py-1.5 hover:bg-[#272738] flex items-center gap-2 text-gray-300"
              >
                <Globe className="w-3.5 h-3.5 text-purple-400" />
                <span>Insert from URL...</span>
              </button>
            </div>
          )}
        </div>

        {/* 9. Table (Inserts 3x3 table or opens options when inside table) */}
        <div className="relative" ref={tableRef}>
          <button
            type="button"
            onClick={handleTableButtonClick}
            className={`p-1.5 rounded-[3px] transition-colors ${
              isInsideTable
                ? 'bg-purple-900/40 text-purple-300 border border-purple-500/40'
                : 'text-gray-400 hover:text-gray-200 hover:bg-[#202030]'
            }`}
            title={isInsideTable ? 'Table Actions' : 'Insert 3x3 Table'}
          >
            <TableIcon className="w-3.5 h-3.5" />
          </button>

          {tableDropdownOpen && isInsideTable && (
            <div className="absolute top-full left-0 mt-1 bg-[#1c1c28] border border-[#2b2b3d] shadow-2xl rounded-[4px] py-1 z-50 w-44 text-xs backdrop-blur-sm">
              <button
                type="button"
                onClick={() => {
                  editor.chain().focus().addRowBefore().run();
                  setTableDropdownOpen(false);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-[#272738] flex items-center gap-2 text-gray-300"
              >
                <Plus className="w-3 h-3 text-purple-400" />
                <span>Add Row Above</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  editor.chain().focus().addRowAfter().run();
                  setTableDropdownOpen(false);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-[#272738] flex items-center gap-2 text-gray-300"
              >
                <Plus className="w-3 h-3 text-purple-400" />
                <span>Add Row Below</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  editor.chain().focus().deleteRow().run();
                  setTableDropdownOpen(false);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-[#272738] flex items-center gap-2 text-red-300"
              >
                <Trash2 className="w-3 h-3 text-red-400" />
                <span>Delete Row</span>
              </button>
              <div className="my-1 border-t border-[#2a2a3d]" />
              <button
                type="button"
                onClick={() => {
                  editor.chain().focus().addColumnBefore().run();
                  setTableDropdownOpen(false);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-[#272738] flex items-center gap-2 text-gray-300"
              >
                <Plus className="w-3 h-3 text-purple-400" />
                <span>Add Column Before</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  editor.chain().focus().addColumnAfter().run();
                  setTableDropdownOpen(false);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-[#272738] flex items-center gap-2 text-gray-300"
              >
                <Plus className="w-3 h-3 text-purple-400" />
                <span>Add Column After</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  editor.chain().focus().deleteColumn().run();
                  setTableDropdownOpen(false);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-[#272738] flex items-center gap-2 text-red-300"
              >
                <Trash2 className="w-3 h-3 text-red-400" />
                <span>Delete Column</span>
              </button>
              <div className="my-1 border-t border-[#2a2a3d]" />
              <button
                type="button"
                onClick={() => {
                  editor.chain().focus().deleteTable().run();
                  setTableDropdownOpen(false);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-[#272738] flex items-center gap-2 text-red-400 font-semibold"
              >
                <Trash2 className="w-3 h-3 text-red-400" />
                <span>Delete Table</span>
              </button>
            </div>
          )}
        </div>

        {/* Separator */}
        <div className="w-[1px] h-4 bg-[#262638] mx-0.5" />

        {/* 10. Checklist / TaskList */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          className={`p-1.5 rounded-[3px] transition-colors ${
            editor.isActive('taskList')
              ? 'bg-purple-900/40 text-purple-300 border border-purple-500/40'
              : 'text-gray-400 hover:text-gray-200 hover:bg-[#202030]'
          }`}
          title="Checklist / Task List"
        >
          <CheckSquare className="w-3.5 h-3.5" />
        </button>

        {/* 11. Bullet List */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1.5 rounded-[3px] transition-colors ${
            editor.isActive('bulletList')
              ? 'bg-purple-900/40 text-purple-300 border border-purple-500/40'
              : 'text-gray-400 hover:text-gray-200 hover:bg-[#202030]'
          }`}
          title="Bullet List"
        >
          <List className="w-3.5 h-3.5" />
        </button>

        {/* 12. Numbered List */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1.5 rounded-[3px] transition-colors ${
            editor.isActive('orderedList')
              ? 'bg-purple-900/40 text-purple-300 border border-purple-500/40'
              : 'text-gray-400 hover:text-gray-200 hover:bg-[#202030]'
          }`}
          title="Numbered List"
        >
          <ListOrdered className="w-3.5 h-3.5" />
        </button>

        {/* 13. Blockquote / Callout */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-1.5 rounded-[3px] transition-colors ${
            editor.isActive('blockquote')
              ? 'bg-purple-900/40 text-purple-300 border border-purple-500/40'
              : 'text-gray-400 hover:text-gray-200 hover:bg-[#202030]'
          }`}
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
          className="p-1.5 rounded-[3px] text-gray-400 hover:text-gray-200 hover:bg-[#202030] disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          title="Undo (Cmd+Z)"
        >
          <Undo2 className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-1.5 rounded-[3px] text-gray-400 hover:text-gray-200 hover:bg-[#202030] disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          title="Redo (Cmd+Shift+Z)"
        >
          <Redo2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default EditorToolbar;
