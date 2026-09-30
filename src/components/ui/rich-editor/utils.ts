import { $getRoot, LexicalEditor } from 'lexical';
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';

/**
 * Calculates word count, character count, and estimated reading time from plain text.
 */
export function calculateEditorStats(text: string) {
  const trimmed = text.trim();
  const characters = trimmed.length;
  const words = trimmed ? trimmed.split(/\s+/).filter(Boolean).length : 0;
  // Average adult reading speed: 200 words per minute
  const readingTimeMinutes = Math.max(1, Math.ceil(words / 200));

  return {
    words,
    characters,
    readingTimeMinutes,
  };
}

/**
 * Parses an HTML string and populates the Lexical Editor root.
 */
export function setEditorContentFromHtml(editor: LexicalEditor, htmlString: string) {
  editor.update(() => {
    const parser = new DOMParser();
    const dom = parser.parseFromString(htmlString || '<p></p>', 'text/html');
    const nodes = $generateNodesFromDOM(editor, dom);
    const root = $getRoot();
    root.clear();
    root.append(...nodes);
  });
}

/**
 * Exports current Lexical editor state to clean HTML string.
 */
export function getEditorHtml(editor: LexicalEditor): string {
  let html = '';
  editor.getEditorState().read(() => {
    html = $generateHtmlFromNodes(editor, null);
  });
  return html;
}

/**
 * Exports current Lexical editor state to plain text.
 */
export function getEditorText(editor: LexicalEditor): string {
  let text = '';
  editor.getEditorState().read(() => {
    text = $getRoot().getTextContent();
  });
  return text;
}

/**
 * Converts basic HTML string to standard Markdown for export.
 */
export function convertHtmlToMarkdown(html: string): string {
  const container = document.createElement('div');
  container.innerHTML = html;

  let markdown = '';

  const processNode = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      markdown += node.textContent || '';
      return;
    }

    if (node.nodeType !== Node.ELEMENT_NODE) return;

    const el = node as HTMLElement;
    const tag = el.tagName.toLowerCase();

    switch (tag) {
      case 'h1':
        markdown += `# ${el.textContent?.trim()}\n\n`;
        break;
      case 'h2':
        markdown += `## ${el.textContent?.trim()}\n\n`;
        break;
      case 'h3':
        markdown += `### ${el.textContent?.trim()}\n\n`;
        break;
      case 'p':
        markdown += `${el.textContent?.trim()}\n\n`;
        break;
      case 'blockquote':
        markdown += `> ${el.textContent?.trim()}\n\n`;
        break;
      case 'pre':
        markdown += `\`\`\`\n${el.textContent?.trim()}\n\`\`\`\n\n`;
        break;
      case 'hr':
        markdown += `---\n\n`;
        break;
      case 'ul':
        Array.from(el.children).forEach((li) => {
          markdown += `* ${li.textContent?.trim()}\n`;
        });
        markdown += '\n';
        break;
      case 'ol':
        Array.from(el.children).forEach((li, index) => {
          markdown += `${index + 1}. ${li.textContent?.trim()}\n`;
        });
        markdown += '\n';
        break;
      default:
        Array.from(node.childNodes).forEach(processNode);
        break;
    }
  };

  Array.from(container.childNodes).forEach(processNode);
  return markdown.trim();
}

/**
 * Trigger browser file download for exported files (Markdown, HTML, TXT)
 */
export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
