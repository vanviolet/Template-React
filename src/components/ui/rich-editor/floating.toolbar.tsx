import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  SELECTION_CHANGE_COMMAND,
  COMMAND_PRIORITY_LOW,
} from 'lexical';
import { $patchStyleText } from '@lexical/selection';
import { Bold, Italic, Underline, Strikethrough, Code, Link2, Highlighter } from 'lucide-react';
import { cn } from '@/utils/cn';

interface FloatingToolbarProps {
  onOpenLinkDialog: () => void;
  disabled?: boolean;
}

export function FloatingToolbar({ onOpenLinkDialog, disabled = false }: FloatingToolbarProps) {
  const [editor] = useLexicalComposerContext();
  const toolbarRef = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);

  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isCode, setIsCode] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const updateFloatingToolbar = useCallback(() => {
    if (disabled) {
      setPosition(null);
      return;
    }

    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || selection.rangeCount === 0) {
      setPosition(null);
      setShowColorPicker(false);
      return;
    }

    editor.getEditorState().read(() => {
      const lexicalSelection = $getSelection();
      if (!$isRangeSelection(lexicalSelection) || lexicalSelection.isCollapsed()) {
        setPosition(null);
        return;
      }

      setIsBold(lexicalSelection.hasFormat('bold'));
      setIsItalic(lexicalSelection.hasFormat('italic'));
      setIsUnderline(lexicalSelection.hasFormat('underline'));
      setIsStrikethrough(lexicalSelection.hasFormat('strikethrough'));
      setIsCode(lexicalSelection.hasFormat('code'));

      const domRange = selection.getRangeAt(0);
      const rect = domRange.getBoundingClientRect();

      // Check if rect has valid dimensions
      if (rect.width === 0 && rect.height === 0) {
        setPosition(null);
        return;
      }

      const toolbarHeight = 40;
      const toolbarWidth = 240;
      const top = Math.max(10, rect.top - toolbarHeight - 8 + window.scrollY);
      const left = Math.max(
        10,
        Math.min(
          window.innerWidth - toolbarWidth - 10,
          rect.left + rect.width / 2 - toolbarWidth / 2 + window.scrollX
        )
      );

      setPosition({ top, left });
    });
  }, [editor, disabled]);

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        updateFloatingToolbar();
        return false;
      },
      COMMAND_PRIORITY_LOW
    );
  }, [editor, updateFloatingToolbar]);

  useEffect(() => {
    const handleMouseUp = () => {
      setTimeout(updateFloatingToolbar, 20);
    };
    const handleKeyUp = () => {
      setTimeout(updateFloatingToolbar, 20);
    };
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('keyup', handleKeyUp);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [updateFloatingToolbar]);

  if (!position) return null;

  const applyHighlight = (color: string) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $patchStyleText(selection, { 'background-color': color || null });
      }
    });
    setShowColorPicker(false);
  };

  return createPortal(
    <div
      ref={toolbarRef}
      onMouseDown={(e) => e.preventDefault()} // prevent blur/loss of selection
      style={{
        position: 'absolute',
        top: `${position.top}px`,
        left: `${position.left}px`,
        zIndex: 9999,
      }}
      className="flex items-center gap-0.5 p-1 bg-popover/95 text-popover-foreground border border-border/80 rounded-xl shadow-xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-100"
    >
      <button
        type="button"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
        className={cn(
          'p-1.5 rounded-lg text-xs transition-colors cursor-pointer',
          isBold ? 'bg-primary text-primary-foreground font-bold' : 'hover:bg-muted text-foreground'
        )}
        title="Bold"
      >
        <Bold className="h-3.5 w-3.5" />
      </button>

      <button
        type="button"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
        className={cn(
          'p-1.5 rounded-lg text-xs transition-colors cursor-pointer',
          isItalic ? 'bg-primary text-primary-foreground font-bold' : 'hover:bg-muted text-foreground'
        )}
        title="Italic"
      >
        <Italic className="h-3.5 w-3.5" />
      </button>

      <button
        type="button"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}
        className={cn(
          'p-1.5 rounded-lg text-xs transition-colors cursor-pointer',
          isUnderline ? 'bg-primary text-primary-foreground font-bold' : 'hover:bg-muted text-foreground'
        )}
        title="Underline"
      >
        <Underline className="h-3.5 w-3.5" />
      </button>

      <button
        type="button"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')}
        className={cn(
          'p-1.5 rounded-lg text-xs transition-colors cursor-pointer',
          isStrikethrough ? 'bg-primary text-primary-foreground font-bold' : 'hover:bg-muted text-foreground'
        )}
        title="Strikethrough"
      >
        <Strikethrough className="h-3.5 w-3.5" />
      </button>

      <button
        type="button"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code')}
        className={cn(
          'p-1.5 rounded-lg text-xs transition-colors cursor-pointer',
          isCode ? 'bg-primary text-primary-foreground font-bold' : 'hover:bg-muted text-foreground'
        )}
        title="Inline Code"
      >
        <Code className="h-3.5 w-3.5" />
      </button>

      <div className="h-3.5 w-px bg-border mx-0.5" />

      <button
        type="button"
        onClick={onOpenLinkDialog}
        className="p-1.5 rounded-lg text-xs hover:bg-muted text-foreground transition-colors cursor-pointer"
        title="Add Link"
      >
        <Link2 className="h-3.5 w-3.5" />
      </button>

      {/* Quick Highlight toggle */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setShowColorPicker(!showColorPicker)}
          className={cn(
            'p-1.5 rounded-lg text-xs transition-colors cursor-pointer',
            showColorPicker ? 'bg-muted text-primary' : 'hover:bg-muted text-foreground'
          )}
          title="Highlight Text"
        >
          <Highlighter className="h-3.5 w-3.5" />
        </button>

        {showColorPicker && (
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 p-1.5 bg-popover border border-border rounded-lg shadow-lg flex items-center gap-1 z-50">
            <button
              type="button"
              onClick={() => applyHighlight('')}
              className="px-1.5 py-0.5 rounded text-[10px] text-muted-foreground hover:bg-muted"
            >
              None
            </button>
            <button
              type="button"
              onClick={() => applyHighlight('rgba(254, 240, 138, 0.5)')}
              className="w-4 h-4 rounded-full bg-yellow-200 border border-yellow-300 hover:scale-110 transition-transform"
            />
            <button
              type="button"
              onClick={() => applyHighlight('rgba(187, 247, 208, 0.5)')}
              className="w-4 h-4 rounded-full bg-emerald-200 border border-emerald-300 hover:scale-110 transition-transform"
            />
            <button
              type="button"
              onClick={() => applyHighlight('rgba(186, 230, 253, 0.5)')}
              className="w-4 h-4 rounded-full bg-sky-200 border border-sky-300 hover:scale-110 transition-transform"
            />
            <button
              type="button"
              onClick={() => applyHighlight('rgba(251, 207, 232, 0.5)')}
              className="w-4 h-4 rounded-full bg-pink-200 border border-pink-300 hover:scale-110 transition-transform"
            />
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
