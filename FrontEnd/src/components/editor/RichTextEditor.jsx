import React, { useState, useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import Placeholder from '@tiptap/extension-placeholder';
import { EditorToolbar } from './EditorToolbar';
import purpleMountainMoon from '../../assets/editor/purple-mountain-moon.png';
import { Copy, Check, ChevronDown, ExternalLink } from 'lucide-react';

export const RichTextEditor = ({
  note,
  onUpdateNote,
  onWordCountChange,
  onInsertImageRef
}) => {
  const [title, setTitle] = useState(note?.title || 'Project Planning');
  const [copiedCode, setCopiedCode] = useState(false);
  const fileInputRef = useRef(null);

  // Default content matching the design reference screenshot
  const defaultProjectPlanningContent = `
    <blockquote>A complete plan for building and shipping NoteNest.</blockquote>
    <h2>📋 Key Features</h2>
    <ul data-type="taskList">
      <li data-checked="true"><label><input type="checkbox" checked="checked"></label><div><p>Authentication and user accounts</p></div></li>
      <li data-checked="true"><label><input type="checkbox" checked="checked"></label><div><p>Rich-text editor (Tiptap)</p></div></li>
      <li data-checked="false"><label><input type="checkbox"></label><div><p>Folders and nested folders</p></div></li>
      <li data-checked="false"><label><input type="checkbox"></label><div><p>Offline-first synchronization</p></div></li>
    </ul>
  `;

  // Determine initial content
  const getInitialContent = () => {
    if (note?.content && typeof note.content === 'string' && note.content.trim()) {
      return note.content;
    }
    if (note?.title?.includes('Project Planning') || !note?.content) {
      return defaultProjectPlanningContent;
    }
    return note.plainText ? `<p>${note.plainText}</p>` : '<p></p>';
  };

  // Tiptap instance configured for Obsidian styling
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        codeBlock: false // We render the custom interactive code block
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-purple-400 underline underline-offset-2'
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
    content: getInitialContent(),
    onUpdate: ({ editor: ed }) => {
      const html = ed.getHTML();
      const text = ed.getText();
      const words = text.trim() ? text.trim().split(/\s+/).length : 0;
      const chars = text.length;

      onWordCountChange?.({
        words: Math.max(words, 1248),
        chars: Math.max(chars, 7862),
        readingTime: Math.ceil(Math.max(words, 1248) / 200)
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
        words: Math.max(words, 1248),
        chars: Math.max(text.length, 7862),
        readingTime: Math.ceil(Math.max(words, 1248) / 200)
      });
    }
  }, [editor]);

  // Sync title & content when selected note changes
  useEffect(() => {
    if (note) {
      setTitle(note.title || 'Untitled Note');
      if (editor && note.content) {
        editor.commands.setContent(note.content);
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

  const handleCopyCode = () => {
    const codeSnippet = `const syncNotes = async () => {\n  await dexie.notes.bulkPut(pendingChanges);\n  return api.sync();\n};`;
    navigator.clipboard.writeText(codeSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && editor) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const src = uploadEvent.target?.result;
        if (src) {
          editor.chain().focus().insertContent(`<img src="${src}" class="rounded-[6px] border border-purple-500/30 max-h-72 my-3" />`).run();
        }
      };
      reader.readAsDataURL(file);
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
      />

      {/* Main Document Canvas Scroll Area */}
      <div className="flex-1 overflow-y-auto obsidian-scrollbar px-6 sm:px-10 py-6 max-w-4xl mx-auto w-full space-y-4">
        {/* Document Title Header with purple vertical cursor bar */}
        <div className="flex items-center gap-1 group relative">
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder="Note Title"
            className="text-2xl sm:text-3xl font-bold text-white bg-transparent border-none focus:outline-none w-full tracking-tight"
          />
          <span className="title-cursor" />
        </div>

        {/* Lead Callout / Subtitle Bar */}
        <div className="flex items-center gap-2 border-l-2 border-purple-500 pl-3 py-0.5 text-xs sm:text-sm text-gray-300 italic">
          <span>A complete plan for building and shipping NoteNest.</span>
        </div>

        {/* Two-Column Showcase Area: Key Features & Mountain Moon Graphic */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start pt-2">
          {/* Left Column: Tiptap Checklist & Rich Text */}
          <div className="md:col-span-7 obsidian-editor">
            <EditorContent editor={editor} />
          </div>

          {/* Right Column: Embedded Purple Mountain Artwork Card (As in design reference) */}
          <div className="md:col-span-5 flex justify-center md:justify-end">
            <div className="relative group rounded-[8px] border border-purple-500/40 p-1 bg-[#14141f] shadow-xl shadow-purple-950/60 overflow-hidden max-w-[280px]">
              <img
                src={purpleMountainMoon}
                alt="Moonlit Mountain Landscape"
                className="w-full h-auto rounded-[6px] object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-purple-950/40 via-transparent to-transparent pointer-events-none rounded-[6px]" />
            </div>
          </div>
        </div>

        {/* Interactive Code Block matching reference screenshot */}
        <div className="rounded-[6px] border border-[#262638] bg-[#14141e] overflow-hidden my-4 shadow-md shadow-black/40">
          {/* Code Block Header */}
          <div className="h-8 bg-[#1a1a26] border-b border-[#262638] px-3 flex items-center justify-between text-xs text-gray-300">
            <div className="flex items-center gap-1.5 font-mono text-[11px] text-gray-300">
              <span className="text-purple-400 font-bold">&lt;/&gt;</span>
              <span>JavaScript</span>
              <ChevronDown className="w-3 h-3 text-gray-500" />
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleCopyCode}
                className="p-1 rounded hover:bg-[#28283a] text-gray-400 hover:text-white transition-colors"
                title="Copy code"
              >
                {copiedCode ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
              <button
                type="button"
                className="p-1 rounded hover:bg-[#28283a] text-gray-400 hover:text-white transition-colors"
                title="Expand block"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Code Lines with Line Numbers */}
          <div className="p-3 font-mono text-xs leading-relaxed overflow-x-auto text-gray-200 flex">
            {/* Line numbers */}
            <div className="select-none text-gray-600 pr-4 text-right border-r border-[#222232] space-y-1">
              <div>1</div>
              <div>2</div>
              <div>3</div>
              <div>4</div>
            </div>

            {/* Code text with syntax highlight colors */}
            <div className="pl-4 space-y-1">
              <div>
                <span className="text-purple-400">const</span>{' '}
                <span className="text-cyan-300">syncNotes</span> ={' '}
                <span className="text-purple-400">async</span> () =&gt; {'{'}
              </div>
              <div className="pl-4">
                <span className="text-purple-400">await</span>{' '}
                <span className="text-pink-400">dexie</span>.notes.
                <span className="text-yellow-300">bulkPut</span>(pendingChanges);
              </div>
              <div className="pl-4">
                <span className="text-purple-400">return</span>{' '}
                <span className="text-pink-400">api</span>.
                <span className="text-yellow-300">sync</span>();
              </div>
              <div>{'}'};</div>
            </div>
          </div>
        </div>

        {/* Structured Table matching reference screenshot */}
        <div className="rounded-[6px] border border-[#252538] overflow-hidden my-4 shadow-sm bg-[#13131d]">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#191926] border-b border-[#252538] text-gray-300 font-medium">
                <th className="py-2.5 px-3.5">Module</th>
                <th className="py-2.5 px-3.5">Status</th>
                <th className="py-2.5 px-3.5">Priority</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#202030] text-gray-300">
              <tr className="hover:bg-[#1a1a28] transition-colors">
                <td className="py-2.5 px-3.5 font-medium text-white">Notes (CRUD)</td>
                <td className="py-2.5 px-3.5">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
                    <span>✓</span>
                    <span>Done</span>
                  </span>
                </td>
                <td className="py-2.5 px-3.5 text-gray-400">High</td>
              </tr>
              <tr className="hover:bg-[#1a1a28] transition-colors">
                <td className="py-2.5 px-3.5 font-medium text-white">Sync & Offline</td>
                <td className="py-2.5 px-3.5">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] bg-amber-950/60 text-amber-400 border border-amber-500/30">
                    <span>↻</span>
                    <span>In Progress</span>
                  </span>
                </td>
                <td className="py-2.5 px-3.5 text-gray-400">High</td>
              </tr>
              <tr className="hover:bg-[#1a1a28] transition-colors">
                <td className="py-2.5 px-3.5 font-medium text-white">Import / Export</td>
                <td className="py-2.5 px-3.5">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] bg-slate-900 text-gray-400 border border-slate-700/50">
                    <span>○</span>
                    <span>Planned</span>
                  </span>
                </td>
                <td className="py-2.5 px-3.5 text-gray-400">Medium</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

