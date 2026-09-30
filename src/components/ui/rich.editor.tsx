import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { TRANSFORMERS } from '@lexical/markdown';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { HorizontalRulePlugin } from '@lexical/react/LexicalHorizontalRulePlugin';
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListNode, ListItemNode } from '@lexical/list';
import { CodeNode, CodeHighlightNode } from '@lexical/code';
import { LinkNode, AutoLinkNode } from '@lexical/link';
import { TableNode, TableRowNode, TableCellNode } from '@lexical/table';
import { TablePlugin } from '@lexical/react/LexicalTablePlugin';
import { useTranslation } from 'react-i18next';
import { AlertCircle } from 'lucide-react';

import { editorTheme } from './rich-editor/theme';
import { RichEditorProps } from './rich-editor/types';
import { Toolbar } from './rich-editor/toolbar';
import { FloatingToolbar } from './rich-editor/floating.toolbar';
import { StatusBar } from './rich-editor/status.bar';
import { HtmlPlugin } from './rich-editor/plugins/html.plugin';
import { LinkDialog } from './rich-editor/plugins/link.dialog.plugin';
import { ImageNode } from './rich-editor/nodes/image.node';
import { InsertTableDialog } from './rich-editor/plugins/insert.table.dialog';
import { InsertImageDialog } from './rich-editor/plugins/insert.image.dialog';
import { TableActionMenu } from './rich-editor/plugins/table.action.menu';
import { TableResizerPlugin } from './rich-editor/plugins/table.resizer.plugin';
import { QuickInsertDock } from './rich-editor/plugins/quick.insert.dock';
import { cn } from '@/utils/cn';

export function RichEditor({
  value,
  defaultValue,
  onChange,
  placeholder,
  readOnly: controlledReadOnly = false,
  disabled = false,
  minHeight = '240px',
  maxHeight,
  className,
  contentClassName,
  showToolbar = true,
  showStatusBar = true,
  showFloatingToolbar = true,
  enableMarkdownShortcuts = true,
  error,
  helperText,
  autoFocus = false,
  id,
}: RichEditorProps) {
  const { t } = useTranslation();
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [tableDialogOpen, setTableDialogOpen] = useState(false);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [internalReadOnly, setInternalReadOnly] = useState(controlledReadOnly);
  const [isSticky, setIsSticky] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('editor_toolbar_sticky');
      return stored !== 'false';
    }
    return true;
  });

  const handleToggleSticky = useCallback(() => {
    setIsSticky((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('editor_toolbar_sticky', next ? 'true' : 'false');
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  useEffect(() => {
    setInternalReadOnly(controlledReadOnly);
  }, [controlledReadOnly]);

  // Fullscreen escape key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  const handleToggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev);
  }, []);

  const handleToggleReadOnly = useCallback(() => {
    setInternalReadOnly((prev) => !prev);
  }, []);

  const resolvedPlaceholder =
    placeholder ??
    t(
      'editor.placeholder',
      'Mulai mengetik teks, catatan, atau ketik "#" untuk judul, "-" untuk daftar...'
    );

  const initialConfig = useMemo(() => {
    return {
      namespace: id || 'AISRichEditor',
      theme: editorTheme,
      onError(err: Error) {
        console.error('Lexical Error:', err);
      },
      nodes: [
        HeadingNode,
        QuoteNode,
        ListNode,
        ListItemNode,
        CodeNode,
        CodeHighlightNode,
        LinkNode,
        AutoLinkNode,
        HorizontalRuleNode,
        TableNode,
        TableRowNode,
        TableCellNode,
        ImageNode,
      ],
      editable: !internalReadOnly && !disabled,
    };
  }, [id, internalReadOnly, disabled]);

  return (
    <div className={cn('w-full flex flex-col space-y-1.5', className)}>
      <div
        className={cn(
          'relative rounded-xl border border-border bg-card text-card-foreground transition-all duration-200 shadow-2xs',
          isFullscreen
            ? 'fixed inset-4 z-50 rounded-2xl border-border bg-background shadow-2xl flex flex-col max-h-[calc(100vh-2rem)] overflow-hidden'
            : 'overflow-visible',
          error
            ? 'border-destructive ring-1 ring-destructive/40'
            : 'focus-within:border-primary/70 focus-within:ring-2 focus-within:ring-primary/20 hover:border-border/90',
          disabled && 'opacity-60 pointer-events-none bg-muted/20'
        )}
      >
        <LexicalComposer initialConfig={initialConfig}>
          {/* Top Sticky Toolbar */}
          {showToolbar && (
            <Toolbar
              onOpenLinkDialog={() => setLinkDialogOpen(true)}
              onOpenTableDialog={() => setTableDialogOpen(true)}
              onOpenImageDialog={() => setImageDialogOpen(true)}
              isFullscreen={isFullscreen}
              onToggleFullscreen={handleToggleFullscreen}
              isReadOnly={internalReadOnly}
              onToggleReadOnly={handleToggleReadOnly}
              disabled={disabled}
              isSticky={isSticky}
              onToggleSticky={handleToggleSticky}
            />
          )}

          {/* Editor Canvas Container */}
          <div
            className={cn(
              'relative flex-1 overflow-y-auto px-4 py-3.5',
              isFullscreen && 'p-6 lg:px-12',
              disabled && 'cursor-not-allowed'
            )}
            style={{
              minHeight: isFullscreen ? '100%' : typeof minHeight === 'number' ? `${minHeight}px` : minHeight,
              maxHeight: isFullscreen ? 'none' : typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight,
            }}
          >
            <RichTextPlugin
              contentEditable={
                <ContentEditable
                  className={cn(
                    'outline-none prose prose-neutral dark:prose-invert max-w-none text-sm leading-relaxed text-foreground select-text min-h-full',
                    disabled && 'pointer-events-none select-none',
                    contentClassName
                  )}
                />
              }
              placeholder={
                <div className="text-muted-foreground/50 select-none pointer-events-none absolute top-3.5 left-4 text-sm font-normal leading-relaxed">
                  {resolvedPlaceholder}
                </div>
              }
              ErrorBoundary={LexicalErrorBoundary}
            />

            {/* Core Plugins */}
            <HistoryPlugin />
            <ListPlugin />
            <CheckListPlugin />
            <LinkPlugin />
            <TablePlugin />
            <TableResizerPlugin />
            <HorizontalRulePlugin />
            {autoFocus && <AutoFocusPlugin />}
            {enableMarkdownShortcuts && (
              <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
            )}

            {/* Sync HTML Plugin */}
            <HtmlPlugin
              value={value}
              defaultValue={defaultValue}
              onChange={onChange}
            />

            {/* Floating Selection Toolbar */}
            {showFloatingToolbar && !internalReadOnly && !disabled && (
              <FloatingToolbar
                onOpenLinkDialog={() => setLinkDialogOpen(true)}
                disabled={internalReadOnly || disabled}
              />
            )}

            {/* Floating Table Action Menu */}
            {!internalReadOnly && !disabled && <TableActionMenu />}

            {/* Link Dialog */}
            <LinkDialog
              open={linkDialogOpen}
              onOpenChange={setLinkDialogOpen}
            />

            {/* Insert Table Dialog */}
            <InsertTableDialog
              open={tableDialogOpen}
              onOpenChange={setTableDialogOpen}
            />

            {/* Insert Image Dialog */}
            <InsertImageDialog
              open={imageDialogOpen}
              onOpenChange={setImageDialogOpen}
            />
          </div>

          {/* Bottom Status Bar */}
          {showStatusBar && (
            <StatusBar enableMarkdownShortcuts={enableMarkdownShortcuts} />
          )}

          {/* Floating Quick Insert Dock & Popover */}
          {!internalReadOnly && !disabled && (
            <QuickInsertDock
              onOpenTableDialog={() => setTableDialogOpen(true)}
              onOpenImageDialog={() => setImageDialogOpen(true)}
              onOpenLinkDialog={() => setLinkDialogOpen(true)}
              isStickyToolbar={isSticky}
              onToggleStickyToolbar={handleToggleSticky}
              disabled={internalReadOnly || disabled}
            />
          )}
        </LexicalComposer>
      </div>

      {/* Helper text or Error message */}
      {error ? (
        <div className="flex items-center gap-1.5 text-xs text-destructive animate-in fade-in slide-in-from-top-1 duration-150">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      ) : helperText ? (
        <p className="text-xs text-muted-foreground">{helperText}</p>
      ) : null}
    </div>
  );
}

export default RichEditor;
