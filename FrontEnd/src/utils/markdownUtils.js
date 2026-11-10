import MarkdownIt from 'markdown-it';

const mdParser = new MarkdownIt({
  html: true,
  linkify: true,
  breaks: true,
  typographer: true
});

/**
 * Converts Markdown string to HTML
 * @param {string} markdown
 * @returns {string}
 */
export function markdownToHtml(markdown = '') {
  if (!markdown || typeof markdown !== 'string') return '';
  return mdParser.render(markdown);
}

/**
 * Converts an HTML string to Markdown using browser DOMParser
 * @param {string} html
 * @returns {string}
 */
export function htmlToMarkdown(html = '') {
  if (!html || typeof html !== 'string') return '';

  // If in browser environment, use DOMParser
  if (typeof window !== 'undefined' && window.DOMParser) {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      return walkNodeToMarkdown(doc.body).trim();
    } catch (_) {}
  }

  // Fallback simple regex
  return fallbackHtmlToMarkdown(html);
}

function walkNodeToMarkdown(node) {
  if (!node) return '';

  // Text node
  if (node.nodeType === Node.TEXT_NODE) {
    return node.nodeValue;
  }

  // Element node
  let childrenContent = '';
  for (let i = 0; i < node.childNodes.length; i++) {
    childrenContent += walkNodeToMarkdown(node.childNodes[i]);
  }

  const tag = node.tagName ? node.tagName.toLowerCase() : '';

  switch (tag) {
    case 'h1':
      return `\n# ${childrenContent.trim()}\n\n`;
    case 'h2':
      return `\n## ${childrenContent.trim()}\n\n`;
    case 'h3':
      return `\n### ${childrenContent.trim()}\n\n`;
    case 'h4':
      return `\n#### ${childrenContent.trim()}\n\n`;
    case 'h5':
    case 'h6':
      return `\n##### ${childrenContent.trim()}\n\n`;
    case 'strong':
    case 'b':
      return `**${childrenContent}**`;
    case 'em':
    case 'i':
      return `*${childrenContent}*`;
    case 'u':
      return `<u>${childrenContent}</u>`;
    case 's':
    case 'del':
    case 'strike':
      return `~~${childrenContent}~~`;
    case 'code':
      if (node.parentElement && node.parentElement.tagName.toLowerCase() === 'pre') {
        return childrenContent;
      }
      return `\`${childrenContent}\``;
    case 'pre':
      return `\n\`\`\`\n${childrenContent.trim()}\n\`\`\`\n\n`;
    case 'blockquote':
      return `\n> ${childrenContent.trim()}\n\n`;
    case 'p':
      return childrenContent.trim() ? `${childrenContent.trim()}\n\n` : '';
    case 'br':
      return '\n';
    case 'hr':
      return '\n---\n\n';
    case 'li': {
      // Check for task item checkbox
      const isTask = node.getAttribute('data-type') === 'taskItem' || node.classList.contains('task-item');
      const isChecked = node.getAttribute('data-checked') === 'true' || node.querySelector('input[type="checkbox"]:checked');
      if (isTask) {
        return `- [${isChecked ? 'x' : ' '}] ${childrenContent.trim()}\n`;
      }
      return `- ${childrenContent.trim()}\n`;
    }
    case 'ul':
    case 'ol':
      return `\n${childrenContent.trim()}\n\n`;
    case 'a': {
      const href = node.getAttribute('href') || '';
      return `[${childrenContent.trim()}](${href})`;
    }
    default:
      return childrenContent;
  }
}

function fallbackHtmlToMarkdown(html) {
  return html
    .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '\n# $1\n\n')
    .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '\n## $1\n\n')
    .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '\n### $1\n\n')
    .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
    .replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**')
    .replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
    .replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*')
    .replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`')
    .replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .trim();
}

/**
 * Strips HTML to clean plain text
 * @param {string} html
 * @returns {string}
 */
export function stripHtmlToPlainText(html = '') {
  if (!html || typeof html !== 'string') return '';
  if (typeof window !== 'undefined' && window.DOMParser) {
    try {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      return doc.body.textContent || '';
    } catch (_) {}
  }
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

