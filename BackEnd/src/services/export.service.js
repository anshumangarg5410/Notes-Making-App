const Note = require('../models/Note');
const Folder = require('../models/Folder');
const { logActivity } = require('../utils/activityLogger');

class ExportService {
  /**
   * Import Markdown text into a new Note
   */
  async importMarkdown(userId, { title, markdown, folderId, folder }) {
    if (!markdown || !markdown.trim()) {
      const error = new Error('Markdown content is required for import.');
      error.statusCode = 400;
      throw error;
    }

    // Extract title from first H1 if available and title not specified
    let noteTitle = title?.trim();
    const lines = markdown.split('\n');
    if (!noteTitle) {
      const firstH1 = lines.find((l) => l.trim().startsWith('# '));
      if (firstH1) {
        noteTitle = firstH1.replace(/^#\s+/, '').trim();
      } else {
        noteTitle = 'Imported Markdown Note';
      }
    }

    // Extract plain text
    const plainText = markdown
      .replace(/^#+\s+/gm, '')
      .replace(/(\*\*|__)(.*?)\1/g, '$2')
      .replace(/(\*|_)(.*?)\1/g, '$2')
      .replace(/`{1,3}(.*?)`{1,3}/g, '$1')
      .replace(/\[(.*?)\]\(.*?\)/g, '$1')
      .trim();

    // Basic Tiptap structured JSON representation
    const tiptapContent = {
      type: 'doc',
      content: lines.map((line) => {
        const trimmed = line.trim();
        if (trimmed.startsWith('# ')) {
          return {
            type: 'heading',
            attrs: { level: 1 },
            content: [{ type: 'text', text: trimmed.replace(/^#\s+/, '') }]
          };
        } else if (trimmed.startsWith('## ')) {
          return {
            type: 'heading',
            attrs: { level: 2 },
            content: [{ type: 'text', text: trimmed.replace(/^##\s+/, '') }]
          };
        } else if (trimmed.startsWith('### ')) {
          return {
            type: 'heading',
            attrs: { level: 3 },
            content: [{ type: 'text', text: trimmed.replace(/^###\s+/, '') }]
          };
        } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          return {
            type: 'bulletList',
            content: [
              {
                type: 'listItem',
                content: [{ type: 'paragraph', content: [{ type: 'text', text: trimmed.replace(/^[-*]\s+/, '') }] }]
              }
            ]
          };
        } else if (trimmed.startsWith('```')) {
          return {
            type: 'codeBlock',
            content: [{ type: 'text', text: trimmed.replace(/```/g, '') }]
          };
        }
        return {
          type: 'paragraph',
          content: trimmed ? [{ type: 'text', text: line }] : []
        };
      })
    };

    const wordCount = plainText ? plainText.split(/\s+/).length : 0;
    const charCount = plainText.length;

    const note = await Note.create({
      userId,
      title: noteTitle,
      content: tiptapContent,
      plainText,
      folderId: folderId || null,
      folder: folder || '',
      tags: ['Imported'],
      wordCount,
      charCount,
      revision: 1
    });

    logActivity({
      userId,
      action: 'created_note',
      entityType: 'note',
      entityId: note._id,
      entityTitle: note.title,
      metadata: { source: 'markdown_import' }
    });

    return note;
  }

  /**
   * Convert Note into Markdown string
   */
  async exportToMarkdown(userId, noteId) {
    const note = await Note.findOne({ _id: noteId, userId });
    if (!note) {
      const error = new Error('Note not found.');
      error.statusCode = 404;
      throw error;
    }

    let md = `# ${note.title}\n\n`;

    if (note.folder) {
      md += `*Folder: ${note.folder}*\n`;
    }
    if (note.tags && note.tags.length > 0) {
      md += `*Tags: ${note.tags.join(', ')}*\n`;
    }
    md += `\n---\n\n`;

    if (typeof note.content === 'string') {
      md += note.content;
    } else if (note.plainText) {
      md += note.plainText;
    } else {
      md += '(Empty note)';
    }

    return {
      title: note.title,
      filename: `${note.title.toLowerCase().replace(/[^a-z0-9_-]/g, '_')}.md`,
      content: md
    };
  }

  /**
   * Export Note to HTML for printing or PDF generation
   */
  async exportToPrintableHtml(userId, noteId) {
    const note = await Note.findOne({ _id: noteId, userId });
    if (!note) {
      const error = new Error('Note not found.');
      error.statusCode = 404;
      throw error;
    }

    const safeTitle = note.title || 'Untitled Note';
    const bodyText = note.plainText || (typeof note.content === 'string' ? note.content : '');

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${safeTitle} — NoteNest</title>
  <style>
    @media print {
      body { margin: 1.5cm; }
      .no-print { display: none; }
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #1f2937;
      background: #ffffff;
      line-height: 1.6;
      max-width: 800px;
      margin: 40px auto;
      padding: 0 20px;
    }
    header {
      border-bottom: 2px solid #e5e7eb;
      padding-bottom: 16px;
      margin-bottom: 24px;
    }
    h1 {
      font-size: 28px;
      margin: 0 0 8px 0;
      color: #111827;
    }
    .meta {
      font-size: 12px;
      color: #6b7280;
    }
    .content {
      font-size: 14px;
      white-space: pre-wrap;
    }
    footer {
      margin-top: 48px;
      padding-top: 12px;
      border-top: 1px solid #e5e7eb;
      font-size: 11px;
      color: #9ca3af;
    }
  </style>
</head>
<body>
  <header>
    <h1>${safeTitle}</h1>
    <div class="meta">
      ${note.folder ? `<span>Folder: <strong>${note.folder}</strong></span> • ` : ''}
      ${note.tags && note.tags.length ? `<span>Tags: ${note.tags.join(', ')}</span> • ` : ''}
      <span>Last Modified: ${new Date(note.updatedAt).toLocaleDateString()}</span>
    </div>
  </header>
  <div class="content">${bodyText}</div>
  <footer>Exported from NoteNest — Your Ideas, Organized.</footer>
</body>
</html>`;

    return {
      title: safeTitle,
      filename: `${safeTitle.toLowerCase().replace(/[^a-z0-9_-]/g, '_')}.html`,
      html
    };
  }

  /**
   * Bulk Export all notes and folders for user
   */
  async bulkExport(userId) {
    const [notes, folders] = await Promise.all([
      Note.find({ userId, isDeleted: false }).lean(),
      Folder.find({ userId }).lean()
    ]);

    return {
      exportDate: new Date().toISOString(),
      appName: 'NoteNest',
      version: '1.0.0',
      totalNotes: notes.length,
      totalFolders: folders.length,
      folders: folders.map((f) => ({
        id: f._id.toString(),
        name: f.name,
        color: f.color,
        parentId: f.parentId ? f.parentId.toString() : null,
        createdAt: f.createdAt
      })),
      notes: notes.map((n) => ({
        id: n._id.toString(),
        title: n.title,
        content: n.content,
        plainText: n.plainText,
        folder: n.folder,
        folderId: n.folderId ? n.folderId.toString() : null,
        tags: n.tags,
        isFavorite: n.isFavorite,
        createdAt: n.createdAt,
        updatedAt: n.updatedAt
      }))
    };
  }
}

module.exports = new ExportService();
