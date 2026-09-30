import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $getSelection,
  $isRangeSelection,
  SELECTION_CHANGE_COMMAND,
  COMMAND_PRIORITY_LOW,
} from 'lexical';
import {
  $getTableCellNodeFromLexicalNode,
  $insertTableRowAtSelection,
  $insertTableColumnAtSelection,
  $deleteTableRowAtSelection,
  $deleteTableColumnAtSelection,
  $findTableNode,
} from '@lexical/table';
import { useTranslation } from 'react-i18next';
import {
  Rows3,
  Columns3,
  Trash2,
  Plus,
  Minus,
  Table as TableIcon,
  ChevronDown,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuGroup,
} from '@/components/ui/dropdown.menu';
import { cn } from '@/utils/cn';

export function TableActionMenu() {
  const [editor] = useLexicalComposerContext();
  const { t } = useTranslation();
  const [isInTable, setIsInTable] = useState(false);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const checkTableSelection = useCallback(() => {
    editor.getEditorState().read(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) {
        setIsInTable(false);
        setPosition(null);
        return;
      }

      const node = selection.anchor.getNode();
      const cellNode = $getTableCellNodeFromLexicalNode(node);

      if (!cellNode) {
        setIsInTable(false);
        setPosition(null);
        return;
      }

      setIsInTable(true);

      // Find DOM element of the cell to position the floating toolbar above table
      const domSelection = window.getSelection();
      if (domSelection && domSelection.rangeCount > 0) {
        const range = domSelection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        if (rect.width > 0 || rect.height > 0) {
          const top = Math.max(10, rect.top - 46 + window.scrollY);
          const left = Math.max(10, rect.left + window.scrollX);
          setPosition({ top, left });
          return;
        }
      }

      // Fallback: get cell DOM
      const cellDOM = editor.getElementByKey(cellNode.getKey());
      if (cellDOM) {
        const rect = cellDOM.getBoundingClientRect();
        const top = Math.max(10, rect.top - 46 + window.scrollY);
        const left = Math.max(10, rect.left + window.scrollX);
        setPosition({ top, left });
      }
    });
  }, [editor]);

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        checkTableSelection();
        return false;
      },
      COMMAND_PRIORITY_LOW
    );
  }, [editor, checkTableSelection]);

  useEffect(() => {
    return editor.registerUpdateListener(() => {
      checkTableSelection();
    });
  }, [editor, checkTableSelection]);

  if (!isInTable || !position) return null;

  const insertRowAbove = () => {
    editor.update(() => {
      $insertTableRowAtSelection(false);
    });
  };

  const insertRowBelow = () => {
    editor.update(() => {
      $insertTableRowAtSelection(true);
    });
  };

  const insertColumnLeft = () => {
    editor.update(() => {
      $insertTableColumnAtSelection(false);
    });
  };

  const insertColumnRight = () => {
    editor.update(() => {
      $insertTableColumnAtSelection(true);
    });
  };

  const deleteRow = () => {
    editor.update(() => {
      $deleteTableRowAtSelection();
    });
  };

  const deleteColumn = () => {
    editor.update(() => {
      $deleteTableColumnAtSelection();
    });
  };

  const deleteEntireTable = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const node = selection.anchor.getNode();
        const tableNode = $findTableNode(node);
        if (tableNode) {
          tableNode.remove();
        }
      }
    });
    setIsInTable(false);
  };

  return createPortal(
    <div
      ref={menuRef}
      onMouseDown={(e) => e.preventDefault()}
      style={{
        position: 'absolute',
        top: `${position.top}px`,
        left: `${position.left}px`,
        zIndex: 9998,
      }}
      className="flex items-center gap-1 p-1 bg-popover/95 text-popover-foreground border border-border/80 rounded-xl shadow-xl backdrop-blur-md animate-in fade-in duration-100 select-none"
    >
      <div className="flex items-center gap-1 px-1.5 py-0.5 text-[11px] font-semibold text-primary border-r border-border">
        <TableIcon className="h-3 w-3" />
        <span>Tabel</span>
      </div>

      {/* Row actions dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            <Rows3 className="h-3 w-3" />
            <span>Baris</span>
            <ChevronDown className="h-2.5 w-2.5 opacity-60" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-44 text-xs">
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={insertRowAbove} className="gap-2">
              <Plus className="h-3 w-3 text-emerald-500" />
              <span>Tambah di Atas</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={insertRowBelow} className="gap-2">
              <Plus className="h-3 w-3 text-emerald-500" />
              <span>Tambah di Bawah</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={deleteRow} className="gap-2 text-destructive">
            <Minus className="h-3 w-3" />
            <span>Hapus Baris Ini</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Column actions dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            <Columns3 className="h-3 w-3" />
            <span>Kolom</span>
            <ChevronDown className="h-2.5 w-2.5 opacity-60" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-44 text-xs">
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={insertColumnLeft} className="gap-2">
              <Plus className="h-3 w-3 text-emerald-500" />
              <span>Tambah di Kiri</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={insertColumnRight} className="gap-2">
              <Plus className="h-3 w-3 text-emerald-500" />
              <span>Tambah di Kanan</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={deleteColumn} className="gap-2 text-destructive">
            <Minus className="h-3 w-3" />
            <span>Hapus Kolom Ini</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="h-3.5 w-px bg-border mx-0.5" />

      {/* Delete Table */}
      <button
        type="button"
        onClick={deleteEntireTable}
        title="Hapus Seluruh Tabel"
        className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
      >
        <Trash2 className="h-3 w-3" />
        <span className="hidden sm:inline">Hapus</span>
      </button>
    </div>,
    document.body
  );
}
