import React from 'react';
import {
  Heading1,
  Heading2,
  Heading3,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  CheckSquare,
  Link2,
  Code,
  Quote,
  Table as TableIcon,
  Undo2,
  Redo2
} from 'lucide-react';

export const EditorToolbar = ({ editor }) => {
  if (!editor) return null;

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Enter URL:', previousUrl || 'https://');
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
    <div className="flex items-center flex-wrap gap-1 px-4 py-2 border-b border-warm-border dark:border-charcoal-800 bg-warm-bg/90 dark:bg-charcoal-900/90 sticky top-0 z-20 backdrop-blur-sm select-none">
      {/* Headings */}
      <div className="flex items-center space-x-0.5 pr-2 border-r border-warm-border dark:border-charcoal-800">
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`px-2 py-1 rounded text-xs font-serif font-bold transition-colors ${
            editor.isActive('heading', { level: 1 })
              ? 'bg-terracotta-100 text-terracotta-700 dark:bg-terracotta-900/40 dark:text-terracotta-300'
              : 'text-charcoal-600 dark:text-charcoal-300 hover:bg-cream-200/60 dark:hover:bg-charcoal-800'
          }`}
          title="Heading 1"
        >
          H1
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-2 py-1 rounded text-xs font-serif font-bold transition-colors ${
            editor.isActive('heading', { level: 2 })
              ? 'bg-terracotta-100 text-terracotta-700 dark:bg-terracotta-900/40 dark:text-terracotta-300'
              : 'text-charcoal-600 dark:text-charcoal-300 hover:bg-cream-200/60 dark:hover:bg-charcoal-800'
          }`}
          title="Heading 2"
        >
          H2
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`px-2 py-1 rounded text-xs font-serif font-bold transition-colors ${
            editor.isActive('heading', { level: 3 })
              ? 'bg-terracotta-100 text-terracotta-700 dark:bg-terracotta-900/40 dark:text-terracotta-300'
              : 'text-charcoal-600 dark:text-charcoal-300 hover:bg-cream-200/60 dark:hover:bg-charcoal-800'
          }`}
          title="Heading 3"
        >
          H3
        </button>
      </div>

      {/* Formatting Marks */}
      <div className="flex items-center space-x-0.5 px-2 border-r border-warm-border dark:border-charcoal-800">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1.5 rounded transition-colors ${
            editor.isActive('bold')
              ? 'bg-terracotta-100 text-terracotta-700 dark:bg-terracotta-900/40 dark:text-terracotta-300'
              : 'text-charcoal-600 dark:text-charcoal-300 hover:bg-cream-200/60 dark:hover:bg-charcoal-800'
          }`}
          title="Bold (Ctrl+B)"
        >
          <Bold className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded transition-colors ${
            editor.isActive('italic')
              ? 'bg-terracotta-100 text-terracotta-700 dark:bg-terracotta-900/40 dark:text-terracotta-300'
              : 'text-charcoal-600 dark:text-charcoal-300 hover:bg-cream-200/60 dark:hover:bg-charcoal-800'
          }`}
          title="Italic (Ctrl+I)"
        >
          <Italic className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-1.5 rounded transition-colors ${
            editor.isActive('underline')
              ? 'bg-terracotta-100 text-terracotta-700 dark:bg-terracotta-900/40 dark:text-terracotta-300'
              : 'text-charcoal-600 dark:text-charcoal-300 hover:bg-cream-200/60 dark:hover:bg-charcoal-800'
          }`}
          title="Underline (Ctrl+U)"
        >
          <Underline className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-1.5 rounded transition-colors ${
            editor.isActive('strike')
              ? 'bg-terracotta-100 text-terracotta-700 dark:bg-terracotta-900/40 dark:text-terracotta-300'
              : 'text-charcoal-600 dark:text-charcoal-300 hover:bg-cream-200/60 dark:hover:bg-charcoal-800'
          }`}
          title="Strikethrough"
        >
          <Strikethrough className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Lists */}
      <div className="flex items-center space-x-0.5 px-2 border-r border-warm-border dark:border-charcoal-800">
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1.5 rounded transition-colors ${
            editor.isActive('bulletList')
              ? 'bg-terracotta-100 text-terracotta-700 dark:bg-terracotta-900/40 dark:text-terracotta-300'
              : 'text-charcoal-600 dark:text-charcoal-300 hover:bg-cream-200/60 dark:hover:bg-charcoal-800'
          }`}
          title="Bullet List"
        >
          <List className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1.5 rounded transition-colors ${
            editor.isActive('orderedList')
              ? 'bg-terracotta-100 text-terracotta-700 dark:bg-terracotta-900/40 dark:text-terracotta-300'
              : 'text-charcoal-600 dark:text-charcoal-300 hover:bg-cream-200/60 dark:hover:bg-charcoal-800'
          }`}
          title="Numbered List"
        >
          <ListOrdered className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          className={`p-1.5 rounded transition-colors ${
            editor.isActive('taskList')
              ? 'bg-terracotta-100 text-terracotta-700 dark:bg-terracotta-900/40 dark:text-terracotta-300'
              : 'text-charcoal-600 dark:text-charcoal-300 hover:bg-cream-200/60 dark:hover:bg-charcoal-800'
          }`}
          title="Checklist / Tasks"
        >
          <CheckSquare className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Insert Block Elements */}
      <div className="flex items-center space-x-0.5 px-2 border-r border-warm-border dark:border-charcoal-800">
        <button
          onClick={setLink}
          className={`p-1.5 rounded transition-colors ${
            editor.isActive('link')
              ? 'bg-terracotta-100 text-terracotta-700 dark:bg-terracotta-900/40 dark:text-terracotta-300'
              : 'text-charcoal-600 dark:text-charcoal-300 hover:bg-cream-200/60 dark:hover:bg-charcoal-800'
          }`}
          title="Insert Link"
        >
          <Link2 className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-1.5 rounded transition-colors ${
            editor.isActive('blockquote')
              ? 'bg-terracotta-100 text-terracotta-700 dark:bg-terracotta-900/40 dark:text-terracotta-300'
              : 'text-charcoal-600 dark:text-charcoal-300 hover:bg-cream-200/60 dark:hover:bg-charcoal-800'
          }`}
          title="Callout / Quote"
        >
          <Quote className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`p-1.5 rounded transition-colors ${
            editor.isActive('codeBlock')
              ? 'bg-terracotta-100 text-terracotta-700 dark:bg-terracotta-900/40 dark:text-terracotta-300'
              : 'text-charcoal-600 dark:text-charcoal-300 hover:bg-cream-200/60 dark:hover:bg-charcoal-800'
          }`}
          title="Code Block"
        >
          <Code className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={insertTable}
          className="p-1.5 rounded text-charcoal-600 dark:text-charcoal-300 hover:bg-cream-200/60 dark:hover:bg-charcoal-800 transition-colors"
          title="Insert Table"
        >
          <TableIcon className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Undo & Redo */}
      <div className="flex items-center space-x-0.5 pl-2">
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-1.5 rounded text-charcoal-600 dark:text-charcoal-300 hover:bg-cream-200/60 dark:hover:bg-charcoal-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          title="Undo (Ctrl+Z)"
        >
          <Undo2 className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-1.5 rounded text-charcoal-600 dark:text-charcoal-300 hover:bg-cream-200/60 dark:hover:bg-charcoal-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          title="Redo (Ctrl+Y)"
        >
          <Redo2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
