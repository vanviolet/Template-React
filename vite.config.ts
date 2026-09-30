import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
      dedupe: [
        'react',
        'react-dom',
        'lexical',
        '@lexical/table',
        '@lexical/react',
        '@lexical/list',
        '@lexical/rich-text',
        '@lexical/selection',
        '@lexical/code',
        '@lexical/link',
        '@lexical/utils',
        '@lexical/html',
        '@lexical/markdown',
        '@lexical/history',
      ],
    },
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        'react/jsx-dev-runtime',
        'lexical',
        '@lexical/table',
        '@lexical/react/LexicalComposer',
        '@lexical/react/LexicalComposerContext',
        '@lexical/react/LexicalContentEditable',
        '@lexical/react/LexicalErrorBoundary',
        '@lexical/react/LexicalHistoryPlugin',
        '@lexical/react/LexicalRichTextPlugin',
        '@lexical/react/LexicalListPlugin',
        '@lexical/react/LexicalCheckListPlugin',
        '@lexical/react/LexicalLinkPlugin',
        '@lexical/react/LexicalAutoFocusPlugin',
        '@lexical/react/LexicalMarkdownShortcutPlugin',
        '@lexical/react/LexicalHorizontalRuleNode',
        '@lexical/react/LexicalHorizontalRulePlugin',
        '@lexical/react/LexicalTablePlugin',
        '@lexical/list',
        '@lexical/rich-text',
        '@lexical/selection',
        '@lexical/code',
        '@lexical/link',
        '@lexical/utils',
        '@lexical/html',
        '@lexical/markdown',
        '@lexical/history',
      ],
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
