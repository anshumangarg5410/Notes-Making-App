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
import { EditorToolbar } from './EditorToolbar';

export const RichTextEditor = ({
  note,
  onUpdateNote,
  onWordCountChange,
  onInsertImageRef
}) => {
  const [title, setTitle] = useState(note?.title || 'Untitled Note');
  const fileInputRef = useRef(null);

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
      Image.configure({
        inline: false,
        allowBase64: true,
        HTMLAttributes: {
          class: 'editor-image rounded-md border border-purple-500/30 max-h-96 my-3 object-cover shadow-md'
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

  // Calculate statistics initially
  useEffect(() => {
    if (editor) {
      const text = editor.getText();
      const words = text.trim() ? text.trim().split(/\s+/).length : 0;
      onWordCountChange?.({
        words,
        chars: text.length,
        readingTime: Math.max(1, Math.ceil(words / 200))
      });
    }
  }, [editor]);

  // Sync title & content when selected note changes
  useEffect(() => {
    if (note) {
      setTitle(note.title || 'Untitled Note');
      if (editor) {
        const nextContent = note.content || (note.plainText ? `<p>${note.plainText}</p>` : '');
        editor.commands.setContent(nextContent);
      }
    }
  }, [note?._id, note?.id]);

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    onUpdateNote?.({
      title: newTitle,
      content: editor ? editor.getHTML() : note?.content,
      plainText: editor ? editor.getText() : note?.plainText
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

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0e0e14] overflow-hidden select-text text-gray-200">
      {/* Hidden file input for inserting images */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Formatting Toolbar */}
      <EditorToolbar
        editor={editor}
        onInsertImage={() => fileInputRef.current?.click()}
        onInsertImageUrl={handleInsertImageUrl}
      />

      {/* Main Document Canvas Scroll Area */}
      <div className="flex-1 overflow-y-auto obsidian-scrollbar px-6 sm:px-12 py-8 max-w-4xl mx-auto w-full space-y-4">
        {/* Document Title Header with purple vertical cursor bar */}
        <div className="flex items-center gap-1 group relative pb-2 border-b border-purple-500/15">
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder="Untitled Note"
            className="text-2xl sm:text-3xl font-bold text-white bg-transparent border-none focus:outline-none w-full tracking-tight"
          />
          <span className="title-cursor" />
        </div>

        {/* Tiptap Rich-Text Editor Content Canvas */}
        <div className="obsidian-editor flex-1 pt-2 min-h-[350px]">
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
};

export default RichTextEditor;
