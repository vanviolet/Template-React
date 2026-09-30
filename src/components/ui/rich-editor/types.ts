import { EditorState } from 'lexical';

export type BlockType =
  | 'paragraph'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'bullet'
  | 'number'
  | 'check'
  | 'quote'
  | 'code';

export interface RichEditorProps {
  /** Initial HTML string or controlled HTML value */
  value?: string;
  /** Initial HTML string (uncontrolled mode) */
  defaultValue?: string;
  /** Callback fired whenever the editor content changes */
  onChange?: (html: string, editorState: EditorState, plainText: string) => void;
  /** Placeholder text shown when editor is empty */
  placeholder?: string;
  /** Whether the editor is read-only */
  readOnly?: boolean;
  /** Whether the editor is disabled (visual and interaction disabled) */
  disabled?: boolean;
  /** Custom minimum height for the editing canvas */
  minHeight?: string | number;
  /** Custom maximum height (adds scrollbar when exceeded) */
  maxHeight?: string | number;
  /** Container custom className */
  className?: string;
  /** ContentEditable area custom className */
  contentClassName?: string;
  /** Whether to show the top sticky toolbar (default: true) */
  showToolbar?: boolean;
  /** Whether to show the bottom status bar with word/char counters (default: true) */
  showStatusBar?: boolean;
  /** Whether to show the floating bubble micro-toolbar on text selection (default: true) */
  showFloatingToolbar?: boolean;
  /** Whether to enable markdown shortcut typing (e.g. # for h1, - for list) (default: true) */
  enableMarkdownShortcuts?: boolean;
  /** Optional error message displayed below editor (useful for TanStack Form) */
  error?: string;
  /** Optional helper text displayed below editor */
  helperText?: string;
  /** Auto focus on mount (default: false) */
  autoFocus?: boolean;
  /** HTML id attribute */
  id?: string;
}

export interface TextColorOption {
  labelKey: string;
  defaultLabel: string;
  value: string;
  bgPreview: string;
}

export interface HighlightColorOption {
  labelKey: string;
  defaultLabel: string;
  value: string;
  bgPreview: string;
}
