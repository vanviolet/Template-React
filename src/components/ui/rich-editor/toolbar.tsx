import React, { useState, useEffect, useCallback } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $getSelection,
  $isRangeSelection,
  $createParagraphNode,
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
  CAN_UNDO_COMMAND,
  CAN_REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  ElementFormatType,
  TextFormatType,
} from 'lexical';
import { $setBlocksType, $patchStyleText, $getSelectionStyleValueForProperty } from '@lexical/selection';
import {
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode,
  $isQuoteNode,
  HeadingTagType,
} from '@lexical/rich-text';
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_CHECK_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
  $isListNode,
  $isListItemNode,
  ListNode,
} from '@lexical/list';
import { $createCodeNode, $isCodeNode } from '@lexical/code';
import { $isLinkNode } from '@lexical/link';
import { INSERT_HORIZONTAL_RULE_COMMAND } from '@lexical/react/LexicalHorizontalRuleNode';
import { useTranslation } from 'react-i18next';
import {
  Undo2,
  Redo2,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Subscript,
  Superscript,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  ListChecks,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  Pilcrow,
  FileCode,
  Link2,
  Minus,
  RemoveFormatting,
  Palette,
  Maximize2,
  Minimize2,
  Eye,
  ChevronDown,
  Highlighter,
  Table as TableIcon,
  Image as ImageIcon,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuGroup,
} from '@/components/ui/dropdown.menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/utils/cn';
import { BlockType } from './types';

interface ToolbarProps {
  onOpenLinkDialog: () => void;
  onOpenTableDialog: () => void;
  onOpenImageDialog: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  isReadOnly: boolean;
  onToggleReadOnly: () => void;
  disabled?: boolean;
}

const TEXT_COLORS = [
  { label: 'Default', value: '' },
  { label: 'Slate', value: '#475569' },
  { label: 'Indigo', value: '#4f46e5' },
  { label: 'Emerald', value: '#059669' },
  { label: 'Sky', value: '#0284c7' },
  { label: 'Rose', value: '#e11d48' },
  { label: 'Amber', value: '#d97706' },
  { label: 'Purple', value: '#9333ea' },
];

const HIGHLIGHT_COLORS = [
  { label: 'None', value: '' },
  { label: 'Yellow', value: 'rgba(254, 240, 138, 0.45)' },
  { label: 'Green', value: 'rgba(187, 247, 208, 0.45)' },
  { label: 'Blue', value: 'rgba(186, 230, 253, 0.45)' },
  { label: 'Pink', value: 'rgba(251, 207, 232, 0.45)' },
  { label: 'Purple', value: 'rgba(233, 213, 255, 0.45)' },
  { label: 'Orange', value: 'rgba(254, 215, 170, 0.45)' },
];

export function Toolbar({
  onOpenLinkDialog,
  onOpenTableDialog,
  onOpenImageDialog,
  isFullscreen,
  onToggleFullscreen,
  isReadOnly,
  onToggleReadOnly,
  disabled = false,
}: ToolbarProps) {
  const [editor] = useLexicalComposerContext();
  const { t } = useTranslation();

  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [blockType, setBlockType] = useState<BlockType>('paragraph');
  const [elementFormat, setElementFormat] = useState<ElementFormatType>('left');

  // Text formats
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isCode, setIsCode] = useState(false);
  const [isSubscript, setIsSubscript] = useState(false);
  const [isSuperscript, setIsSuperscript] = useState(false);
  const [isLink, setIsLink] = useState(false);

  // Styles
  const [fontColor, setFontColor] = useState<string>('');
  const [bgColor, setBgColor] = useState<string>('');

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
      setIsStrikethrough(selection.hasFormat('strikethrough'));
      setIsCode(selection.hasFormat('code'));
      setIsSubscript(selection.hasFormat('subscript'));
      setIsSuperscript(selection.hasFormat('superscript'));

      // Link check
      const node = selection.anchor.getNode();
      const parent = node.getParent();
      setIsLink($isLinkNode(parent) || $isLinkNode(node));

      // Font color and background
      setFontColor($getSelectionStyleValueForProperty(selection, 'color', ''));
      setBgColor($getSelectionStyleValueForProperty(selection, 'background-color', ''));

      // Block Type
      const anchorNode = selection.anchor.getNode();
      let element =
        anchorNode.getKey() === 'root'
          ? anchorNode
          : anchorNode.getTopLevelElementOrThrow();

      if ($isHeadingNode(element)) {
        const tag = element.getTag();
        setBlockType(tag as BlockType);
      } else if ($isListNode(element)) {
        const listType = element.getListType();
        setBlockType(listType === 'number' ? 'number' : listType === 'check' ? 'check' : 'bullet');
      } else if ($isQuoteNode(element)) {
        setBlockType('quote');
      } else if ($isCodeNode(element)) {
        setBlockType('code');
      } else {
        const parent = anchorNode.getParent();
        if ($isListNode(parent)) {
          const listType = parent.getListType();
          setBlockType(listType === 'number' ? 'number' : listType === 'check' ? 'check' : 'bullet');
        } else if ($isListItemNode(parent)) {
          const listParent = parent.getParent();
          if ($isListNode(listParent)) {
            const listType = listParent.getListType();
            setBlockType(listType === 'number' ? 'number' : listType === 'check' ? 'check' : 'bullet');
          } else {
            setBlockType('paragraph');
          }
        } else {
          setBlockType('paragraph');
        }
      }

      if ('getFormatType' in element && typeof (element as any).getFormatType === 'function') {
        setElementFormat((element as any).getFormatType() || 'left');
      } else {
        setElementFormat('left');
      }
    }
  }, []);

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        updateToolbar();
        return false;
      },
      COMMAND_PRIORITY_CRITICAL
    );
  }, [editor, updateToolbar]);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        updateToolbar();
      });
    });
  }, [editor, updateToolbar]);

  useEffect(() => {
    const unregisterUndo = editor.registerCommand(
      CAN_UNDO_COMMAND,
      (payload: boolean) => {
        setCanUndo(payload);
        return false;
      },
      COMMAND_PRIORITY_CRITICAL
    );
    const unregisterRedo = editor.registerCommand(
      CAN_REDO_COMMAND,
      (payload: boolean) => {
        setCanRedo(payload);
        return false;
      },
      COMMAND_PRIORITY_CRITICAL
    );
    return () => {
      unregisterUndo();
      unregisterRedo();
    };
  }, [editor]);

  // Block Formatting Handlers
  const formatParagraph = () => {
    if (blockType !== 'paragraph') {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createParagraphNode());
        }
      });
    }
  };

  const formatHeading = (tag: HeadingTagType) => {
    if (blockType !== tag) {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createHeadingNode(tag));
        }
      });
    }
  };

  const formatBulletList = () => {
    if (blockType !== 'bullet') {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  };

  const formatNumberedList = () => {
    if (blockType !== 'number') {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  };

  const formatCheckList = () => {
    if (blockType !== 'check') {
      editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  };

  const formatQuote = () => {
    if (blockType !== 'quote') {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createQuoteNode());
        }
      });
    }
  };

  const formatCodeBlock = () => {
    if (blockType !== 'code') {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createCodeNode());
        }
      });
    }
  };

  const applyTextColor = (color: string) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $patchStyleText(selection, { color: color || null });
      }
    });
  };

  const applyHighlightColor = (color: string) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $patchStyleText(selection, { 'background-color': color || null });
      }
    });
  };

  const clearFormatting = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const formats: TextFormatType[] = [
          'bold',
          'italic',
          'underline',
          'strikethrough',
          'code',
          'subscript',
          'superscript',
        ];
        formats.forEach((f) => {
          if (selection.hasFormat(f)) {
            selection.formatText(f);
          }
        });
        $patchStyleText(selection, { color: null, 'background-color': null });
      }
    });
  };

  const insertHorizontalRule = () => {
    editor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined);
  };

  // Block label helper
  const getBlockLabel = () => {
    switch (blockType) {
      case 'h1':
        return t('editor.block.h1', 'Judul 1');
      case 'h2':
        return t('editor.block.h2', 'Judul 2');
      case 'h3':
        return t('editor.block.h3', 'Judul 3');
      case 'bullet':
        return t('editor.block.bullet', 'Daftar Poin');
      case 'number':
        return t('editor.block.number', 'Daftar Nomor');
      case 'check':
        return t('editor.block.check', 'Daftar Ceklis');
      case 'quote':
        return t('editor.block.quote', 'Kutipan');
      case 'code':
        return t('editor.block.code', 'Blok Kode');
      default:
        return t('editor.block.paragraph', 'Paragraf');
    }
  };

  const isControlsDisabled = disabled || isReadOnly;

  return (
    <div className="flex flex-wrap items-center gap-1 p-1.5 border-b border-border/80 bg-muted/30 backdrop-blur-xs select-none">
      {/* Undo & Redo */}
      <div className="flex items-center gap-0.5">
        <button
          type="button"
          onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
          disabled={!canUndo || isControlsDisabled}
          title={`${t('editor.toolbar.undo', 'Urungkan')} (Ctrl+Z)`}
          className={cn(
            'p-1.5 rounded-md text-foreground hover:bg-muted transition-colors cursor-pointer disabled:opacity-35 disabled:cursor-not-allowed',
            !canUndo && 'opacity-40'
          )}
        >
          <Undo2 className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
          disabled={!canRedo || isControlsDisabled}
          title={`${t('editor.toolbar.redo', 'Ulangi')} (Ctrl+Y)`}
          className={cn(
            'p-1.5 rounded-md text-foreground hover:bg-muted transition-colors cursor-pointer disabled:opacity-35 disabled:cursor-not-allowed',
            !canRedo && 'opacity-40'
          )}
        >
          <Redo2 className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="h-4 w-px bg-border/80 mx-0.5" />

      {/* Block Type Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            disabled={isControlsDisabled}
            className="flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium text-foreground hover:bg-muted border border-border/60 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed min-w-[105px] justify-between bg-background shadow-2xs"
          >
            <span className="truncate">{getBlockLabel()}</span>
            <ChevronDown className="h-3 w-3 opacity-60 shrink-0" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={formatParagraph} className="gap-2">
              <Pilcrow className="h-3.5 w-3.5 text-muted-foreground" />
              <span>{t('editor.block.paragraph', 'Paragraf')}</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => formatHeading('h1')} className="gap-2">
              <Heading1 className="h-3.5 w-3.5 text-muted-foreground" />
              <span>{t('editor.block.h1', 'Judul 1')}</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => formatHeading('h2')} className="gap-2">
              <Heading2 className="h-3.5 w-3.5 text-muted-foreground" />
              <span>{t('editor.block.h2', 'Judul 2')}</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => formatHeading('h3')} className="gap-2">
              <Heading3 className="h-3.5 w-3.5 text-muted-foreground" />
              <span>{t('editor.block.h3', 'Judul 3')}</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={formatBulletList} className="gap-2">
              <List className="h-3.5 w-3.5 text-muted-foreground" />
              <span>{t('editor.block.bullet', 'Daftar Poin')}</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={formatNumberedList} className="gap-2">
              <ListOrdered className="h-3.5 w-3.5 text-muted-foreground" />
              <span>{t('editor.block.number', 'Daftar Nomor')}</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={formatCheckList} className="gap-2">
              <ListChecks className="h-3.5 w-3.5 text-muted-foreground" />
              <span>{t('editor.block.check', 'Daftar Ceklis')}</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={formatQuote} className="gap-2">
              <Quote className="h-3.5 w-3.5 text-muted-foreground" />
              <span>{t('editor.block.quote', 'Kutipan')}</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={formatCodeBlock} className="gap-2">
              <FileCode className="h-3.5 w-3.5 text-muted-foreground" />
              <span>{t('editor.block.code', 'Blok Kode')}</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="h-4 w-px bg-border/80 mx-0.5" />

      {/* Inline Text Formats */}
      <div className="flex items-center gap-0.5">
        <button
          type="button"
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
          disabled={isControlsDisabled}
          title={`${t('editor.toolbar.bold', 'Tebal')} (Ctrl+B)`}
          className={cn(
            'p-1.5 rounded-md transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed',
            isBold
              ? 'bg-primary/15 text-primary font-semibold shadow-2xs'
              : 'text-foreground hover:bg-muted'
          )}
        >
          <Bold className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
          disabled={isControlsDisabled}
          title={`${t('editor.toolbar.italic', 'Miring')} (Ctrl+I)`}
          className={cn(
            'p-1.5 rounded-md transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed',
            isItalic
              ? 'bg-primary/15 text-primary font-semibold shadow-2xs'
              : 'text-foreground hover:bg-muted'
          )}
        >
          <Italic className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}
          disabled={isControlsDisabled}
          title={`${t('editor.toolbar.underline', 'Garis Bawah')} (Ctrl+U)`}
          className={cn(
            'p-1.5 rounded-md transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed',
            isUnderline
              ? 'bg-primary/15 text-primary font-semibold shadow-2xs'
              : 'text-foreground hover:bg-muted'
          )}
        >
          <Underline className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')}
          disabled={isControlsDisabled}
          title={t('editor.toolbar.strikethrough', 'Coret')}
          className={cn(
            'p-1.5 rounded-md transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed',
            isStrikethrough
              ? 'bg-primary/15 text-primary font-semibold shadow-2xs'
              : 'text-foreground hover:bg-muted'
          )}
        >
          <Strikethrough className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code')}
          disabled={isControlsDisabled}
          title={t('editor.toolbar.inlineCode', 'Kode Sebaris')}
          className={cn(
            'p-1.5 rounded-md transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed',
            isCode
              ? 'bg-primary/15 text-primary font-semibold shadow-2xs'
              : 'text-foreground hover:bg-muted'
          )}
        >
          <Code className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="h-4 w-px bg-border/80 mx-0.5" />

      {/* Colors & Highlight Popover */}
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            disabled={isControlsDisabled}
            title={t('editor.toolbar.colors', 'Warna Teks & Sorotan')}
            className={cn(
              'flex items-center gap-1 px-1.5 py-1 rounded-md text-foreground hover:bg-muted transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed',
              (fontColor || bgColor) && 'bg-primary/10 text-primary'
            )}
          >
            <div className="relative">
              <Palette className="h-3.5 w-3.5" />
              {fontColor && (
                <span
                  className="absolute -bottom-0.5 right-0 w-1.5 h-1.5 rounded-full border border-background"
                  style={{ backgroundColor: fontColor }}
                />
              )}
            </div>
            <Highlighter className="h-3 w-3 opacity-60" />
          </button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-56 p-3 space-y-3">
          {/* Text Color Section */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-foreground">
              {t('editor.color.textColor', 'Warna Teks')}
            </span>
            <div className="grid grid-cols-4 gap-1.5">
              {TEXT_COLORS.map((c) => (
                <button
                  key={c.label}
                  type="button"
                  onClick={() => applyTextColor(c.value)}
                  className={cn(
                    'h-6 rounded border border-border/80 flex items-center justify-center text-[10px] font-medium transition-all hover:scale-105',
                    fontColor === c.value && 'ring-2 ring-primary ring-offset-1'
                  )}
                  style={{
                    backgroundColor: c.value ? c.value : 'transparent',
                    color: c.value ? '#ffffff' : 'inherit',
                  }}
                  title={c.label}
                >
                  {!c.value && 'A'}
                </button>
              ))}
            </div>
          </div>

          <div className="h-px bg-border/70" />

          {/* Highlight Color Section */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-foreground">
              {t('editor.color.highlightColor', 'Warna Sorotan')}
            </span>
            <div className="grid grid-cols-4 gap-1.5">
              {HIGHLIGHT_COLORS.map((c) => (
                <button
                  key={c.label}
                  type="button"
                  onClick={() => applyHighlightColor(c.value)}
                  className={cn(
                    'h-6 rounded border border-border/80 text-[10px] font-medium transition-all hover:scale-105',
                    bgColor === c.value && 'ring-2 ring-primary ring-offset-1'
                  )}
                  style={{ backgroundColor: c.value || 'transparent' }}
                  title={c.label}
                >
                  {!c.value && 'None'}
                </button>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Alignment Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            disabled={isControlsDisabled}
            title={t('editor.toolbar.align', 'Perataan Teks')}
            className="p-1.5 rounded-md text-foreground hover:bg-muted transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {elementFormat === 'center' ? (
              <AlignCenter className="h-3.5 w-3.5" />
            ) : elementFormat === 'right' ? (
              <AlignRight className="h-3.5 w-3.5" />
            ) : elementFormat === 'justify' ? (
              <AlignJustify className="h-3.5 w-3.5" />
            ) : (
              <AlignLeft className="h-3.5 w-3.5" />
            )}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-36">
          <DropdownMenuItem
            onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left')}
            className="gap-2"
          >
            <AlignLeft className="h-3.5 w-3.5" />
            <span>{t('editor.align.left', 'Rata Kiri')}</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center')}
            className="gap-2"
          >
            <AlignCenter className="h-3.5 w-3.5" />
            <span>{t('editor.align.center', 'Rata Tengah')}</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right')}
            className="gap-2"
          >
            <AlignRight className="h-3.5 w-3.5" />
            <span>{t('editor.align.right', 'Rata Kanan')}</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify')}
            className="gap-2"
          >
            <AlignJustify className="h-3.5 w-3.5" />
            <span>{t('editor.align.justify', 'Rata Kanan Kiri')}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="h-4 w-px bg-border/80 mx-0.5" />

      {/* Insert Link & Divider */}
      <div className="flex items-center gap-0.5">
        <button
          type="button"
          onClick={onOpenLinkDialog}
          disabled={isControlsDisabled}
          title={t('editor.toolbar.insertLink', 'Sisipkan Tautan Hyperlink')}
          className={cn(
            'p-1.5 rounded-md transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed',
            isLink ? 'bg-primary/15 text-primary' : 'text-foreground hover:bg-muted'
          )}
        >
          <Link2 className="h-3.5 w-3.5" />
        </button>

        <button
          type="button"
          onClick={onOpenImageDialog}
          disabled={isControlsDisabled}
          title={t('editor.toolbar.insertImage', 'Sisipkan Gambar')}
          className="p-1.5 rounded-md text-foreground hover:bg-muted transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ImageIcon className="h-3.5 w-3.5" />
        </button>

        <button
          type="button"
          onClick={onOpenTableDialog}
          disabled={isControlsDisabled}
          title={t('editor.toolbar.insertTable', 'Sisipkan Tabel')}
          className="p-1.5 rounded-md text-foreground hover:bg-muted transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <TableIcon className="h-3.5 w-3.5" />
        </button>

        <button
          type="button"
          onClick={insertHorizontalRule}
          disabled={isControlsDisabled}
          title={t('editor.toolbar.insertHr', 'Garis Pembatas Horizontal')}
          className="p-1.5 rounded-md text-foreground hover:bg-muted transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Minus className="h-3.5 w-3.5" />
        </button>

        <button
          type="button"
          onClick={clearFormatting}
          disabled={isControlsDisabled}
          title={t('editor.toolbar.clearFormat', 'Hapus Semua Format Teks')}
          className="p-1.5 rounded-md text-foreground hover:bg-muted transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <RemoveFormatting className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Right-aligned Utilities: Read-only toggle & Fullscreen toggle */}
      <div className="ml-auto flex items-center gap-1 pl-2">
        <button
          type="button"
          onClick={onToggleReadOnly}
          title={
            isReadOnly
              ? t('editor.toolbar.unlock', 'Buka Mode Edit')
              : t('editor.toolbar.lock', 'Kunci Pratinjau (Hanya Baca)')
          }
          className={cn(
            'p-1.5 rounded-md transition-colors cursor-pointer text-xs flex items-center gap-1.5 px-2',
            isReadOnly
              ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400 font-medium'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
          )}
        >
          <Eye className="h-3.5 w-3.5" />
          <span className="hidden md:inline text-[11px]">
            {isReadOnly ? t('editor.toolbar.readOnly', 'Hanya Baca') : t('editor.toolbar.editable', 'Edit')}
          </span>
        </button>

        <button
          type="button"
          onClick={onToggleFullscreen}
          title={
            isFullscreen
              ? t('editor.toolbar.exitFullscreen', 'Keluar Layar Penuh')
              : t('editor.toolbar.enterFullscreen', 'Mode Layar Penuh (Zen)')
          }
          className={cn(
            'p-1.5 rounded-md transition-colors cursor-pointer',
            isFullscreen
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
          )}
        >
          {isFullscreen ? (
            <Minimize2 className="h-3.5 w-3.5" />
          ) : (
            <Maximize2 className="h-3.5 w-3.5" />
          )}
        </button>
      </div>
    </div>
  );
}
