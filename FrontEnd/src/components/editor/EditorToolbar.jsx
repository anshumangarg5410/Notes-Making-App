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
  MoreHorizontal
} from 'lucide-react';

export const EditorToolbar = ({ editor, onInsertImage }) => {
  const [headingDropdownOpen, setHeadingDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setHeadingDropdownOpen(false);
      }
    };
    if (headingDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [headingDropdownOpen]);

  if (!editor) return null;

  // Current heading label
  const getHeadingLabel = () => {
    if (editor.isActive('heading', { level: 1 })) return 'H1';
    if (editor.isActive('heading', { level: 2 })) return 'H2';
    if (editor.isActive('heading', { level: 3 })) return 'H3';
    return 'H2';
  };

  const setLink = () => {
    const prevUrl = editor.getAttributes('link').href;
    const url = window.prompt('Enter link URL:', prevUrl || 'https://');
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const insertTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  return (
    <div className="h-9 bg-[#161622] border-b border-[#222230] px-4 flex items-center justify-between select-none text-xs">
      <div className="flex items-center gap-1 overflow-x-auto obsidian-scrollbar py-1">
        {/* Heading Dropdown */}
        <div className="relative mr-1" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setHeadingDropdownOpen(!headingDropdownOpen)}
            className="flex items-center gap-1 px-2 py-1 rounded-[3px] bg-[#1d1d2b] hover:bg-[#252538] text-gray-200 text-xs font-semibold border border-[#2b2b3d] transition-colors"
          >
            <span>{getHeadingLabel()}</span>
            <ChevronDown className="w-3 h-3 text-gray-400" />
          </button>

          {headingDropdownOpen && (
            <div className="absolute top-full left-0 mt-1 bg-[#1c1c28] border border-[#2b2b3d] shadow-xl rounded-[4px] py-1 z-50 w-28 text-xs">
              <button
                type="button"
                onClick={() => {
                  editor.chain().focus().toggleHeading({ level: 1 }).run();
                  setHeadingDropdownOpen(false);
                }}
                className={`w-full text-left px-3 py-1 hover:bg-[#272738] ${
                  editor.isActive('heading', { level: 1 }) ? 'text-purple-400 font-bold' : 'text-gray-300'
                }`}
              >
                Heading 1
              </button>
              <button
                type="button"
                onClick={() => {
                  editor.chain().focus().toggleHeading({ level: 2 }).run();
                  setHeadingDropdownOpen(false);
                }}
                className={`w-full text-left px-3 py-1 hover:bg-[#272738] ${
                  editor.isActive('heading', { level: 2 }) ? 'text-purple-400 font-bold' : 'text-gray-300'
                }`}
              >
                Heading 2
              </button>
              <button
                type="button"
                onClick={() => {
                  editor.chain().focus().toggleHeading({ level: 3 }).run();
                  setHeadingDropdownOpen(false);
                }}
                className={`w-full text-left px-3 py-1 hover:bg-[#272738] ${
                  editor.isActive('heading', { level: 3 }) ? 'text-purple-400 font-bold' : 'text-gray-300'
                }`}
              >
                Heading 3
              </button>
              <button
                type="button"
                onClick={() => {
                  editor.chain().focus().setParagraph().run();
                  setHeadingDropdownOpen(false);
                }}
                className={`w-full text-left px-3 py-1 hover:bg-[#272738] ${
                  editor.isActive('paragraph') ? 'text-purple-400 font-medium' : 'text-gray-300'
                }`}
              >
                Paragraph
              </button>
            </div>
          )}
        </div>

        {/* Separator */}
        <div className="w-[1px] h-4 bg-[#262638] mx-0.5" />

        {/* Formatting Buttons */}
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

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={`p-1.5 rounded-[3px] transition-colors ${
            editor.isActive('code')
              ? 'bg-purple-900/40 text-purple-300 border border-purple-500/40'
              : 'text-gray-400 hover:text-gray-200 hover:bg-[#202030]'
          }`}
          title="Inline Code"
        >
          <Code className="w-3.5 h-3.5" />
        </button>

        {/* Separator */}
        <div className="w-[1px] h-4 bg-[#262638] mx-0.5" />

        {/* Links & Media */}
        <button
          type="button"
          onClick={setLink}
          className={`p-1.5 rounded-[3px] transition-colors ${
            editor.isActive('link')
              ? 'bg-purple-900/40 text-purple-300 border border-purple-500/40'
              : 'text-gray-400 hover:text-gray-200 hover:bg-[#202030]'
          }`}
          title="Link"
        >
          <LinkIcon className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={onInsertImage}
          className="p-1.5 rounded-[3px] text-gray-400 hover:text-gray-200 hover:bg-[#202030] transition-colors"
          title="Insert Image"
        >
          <ImageIcon className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={insertTable}
          className="p-1.5 rounded-[3px] text-gray-400 hover:text-gray-200 hover:bg-[#202030] transition-colors"
          title="Insert Table"
        >
          <TableIcon className="w-3.5 h-3.5" />
        </button>

        {/* Separator */}
        <div className="w-[1px] h-4 bg-[#262638] mx-0.5" />

        {/* Lists & Blocks */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          className={`p-1.5 rounded-[3px] transition-colors ${
            editor.isActive('taskList')
              ? 'bg-purple-900/40 text-purple-300 border border-purple-500/40'
              : 'text-gray-400 hover:text-gray-200 hover:bg-[#202030]'
          }`}
          title="Task Checklist"
        >
          <CheckSquare className="w-3.5 h-3.5" />
        </button>

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

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-1.5 rounded-[3px] transition-colors ${
            editor.isActive('blockquote')
              ? 'bg-purple-900/40 text-purple-300 border border-purple-500/40'
              : 'text-gray-400 hover:text-gray-200 hover:bg-[#202030]'
          }`}
          title="Quote / Callout"
        >
          <Quote className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Undo / Redo */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-1.5 rounded-[3px] text-gray-400 hover:text-gray-200 hover:bg-[#202030] disabled:opacity-30 disabled:hover:bg-transparent"
          title="Undo (Cmd+Z)"
        >
          <Undo2 className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-1.5 rounded-[3px] text-gray-400 hover:text-gray-200 hover:bg-[#202030] disabled:opacity-30 disabled:hover:bg-transparent"
          title="Redo (Cmd+Shift+Z)"
        >
          <Redo2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
