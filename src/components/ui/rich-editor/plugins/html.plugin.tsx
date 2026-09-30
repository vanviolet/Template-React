import { useEffect, useRef } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getRoot, EditorState } from 'lexical';
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';

interface HtmlPluginProps {
  value?: string;
  defaultValue?: string;
  onChange?: (html: string, editorState: EditorState, plainText: string) => void;
}

export function HtmlPlugin({ value, defaultValue, onChange }: HtmlPluginProps) {
  const [editor] = useLexicalComposerContext();
  const lastHtmlRef = useRef<string | null>(null);
  const isInitialMount = useRef(true);

  // Initialize with defaultValue or initial value on mount
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      const initial = value ?? defaultValue;
      if (initial) {
        editor.update(() => {
          const parser = new DOMParser();
          const dom = parser.parseFromString(initial, 'text/html');
          const nodes = $generateNodesFromDOM(editor, dom);
          const root = $getRoot();
          root.clear();
          root.append(...nodes);
        });
        lastHtmlRef.current = initial;
      }
    }
  }, [editor, value, defaultValue]);

  // Synchronize when controlled `value` changes from outside (and not from our own typing)
  useEffect(() => {
    if (value !== undefined && value !== lastHtmlRef.current && !isInitialMount.current) {
      editor.update(() => {
        const parser = new DOMParser();
        const dom = parser.parseFromString(value || '<p></p>', 'text/html');
        const nodes = $generateNodesFromDOM(editor, dom);
        const root = $getRoot();
        root.clear();
        root.append(...nodes);
      });
      lastHtmlRef.current = value;
    }
  }, [editor, value]);

  // Listen for editor updates and call onChange
  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const html = $generateHtmlFromNodes(editor, null);
        const plainText = $getRoot().getTextContent();

        if (html !== lastHtmlRef.current) {
          lastHtmlRef.current = html;
          if (onChange) {
            onChange(html, editorState, plainText);
          }
        }
      });
    });
  }, [editor, onChange]);

  return null;
}
