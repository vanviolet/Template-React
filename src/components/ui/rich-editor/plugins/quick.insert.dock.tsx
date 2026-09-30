import React, { useState, useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $getSelection,
  $isRangeSelection,
} from 'lexical';
import { $setBlocksType } from '@lexical/selection';
import {
  $createHeadingNode,
  $createQuoteNode,
  HeadingTagType,
} from '@lexical/rich-text';
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_CHECK_LIST_COMMAND,
} from '@lexical/list';
import { $createCodeNode } from '@lexical/code';
import { INSERT_HORIZONTAL_RULE_COMMAND } from '@lexical/react/LexicalHorizontalRuleNode';
import { useTranslation } from 'react-i18next';
import {
  Plus,
  Table as TableIcon,
  Image as ImageIcon,
  Link2,
  Minus,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  ListChecks,
  Quote,
  Code,
  ArrowUp,
  Pin,
  PinOff,
  ChevronUp,
  ChevronDown,
  Sparkles,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/utils/cn';

interface QuickInsertDockProps {
  onOpenTableDialog: () => void;
  onOpenImageDialog: () => void;
  onOpenLinkDialog: () => void;
  isStickyToolbar: boolean;
  onToggleStickyToolbar: () => void;
  disabled?: boolean;
}

export function QuickInsertDock({
  onOpenTableDialog,
  onOpenImageDialog,
  onOpenLinkDialog,
  isStickyToolbar,
  onToggleStickyToolbar,
  disabled = false,
}: QuickInsertDockProps) {
  const [editor] = useLexicalComposerContext();
  const { t } = useTranslation();

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isScrolledDown, setIsScrolledDown] = useState(false);
  const [isMinimized, setIsMinimized] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('editor_quick_dock_minimized') === 'true';
    }
    return false;
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolledDown(window.scrollY > 250);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMinimize = (min: boolean) => {
    setIsMinimized(min);
    try {
      localStorage.setItem('editor_quick_dock_minimized', min ? 'true' : 'false');
    } catch {
      // ignore
    }
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleInsertTable = () => {
    setIsPopoverOpen(false);
    onOpenTableDialog();
  };

  const handleInsertImage = () => {
    setIsPopoverOpen(false);
    onOpenImageDialog();
  };

  const handleInsertLink = () => {
    setIsPopoverOpen(false);
    onOpenLinkDialog();
  };

  const handleInsertHr = () => {
    editor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined);
    setIsPopoverOpen(false);
  };

  const formatHeading = (tag: HeadingTagType) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createHeadingNode(tag));
      }
    });
    setIsPopoverOpen(false);
  };

  const formatList = (type: 'bullet' | 'number' | 'check') => {
    if (type === 'bullet') {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    } else if (type === 'number') {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined);
    }
    setIsPopoverOpen(false);
  };

  const formatQuote = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createQuoteNode());
      }
    });
    setIsPopoverOpen(false);
  };

  const formatCode = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createCodeNode());
      }
    });
    setIsPopoverOpen(false);
  };

  if (disabled) return null;

  // Minimized state: sleek round button with pulse dot when scrolled
  if (isMinimized) {
    return (
      <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-8 z-40 animate-in fade-in duration-200">
        <button
          type="button"
          onClick={() => toggleMinimize(false)}
          title={t('editor.quickInsert.expand', 'Buka Menu Cepat Sisipkan')}
          className="group relative flex items-center gap-1.5 p-2.5 sm:px-3 sm:py-2.5 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer border border-primary/20 backdrop-blur-md"
        >
          <Plus className="h-4 w-4 transition-transform group-hover:rotate-90 duration-200" />
          <span className="hidden sm:inline text-xs font-semibold">
            {t('editor.quickInsert.button', 'Sisipkan')}
          </span>
          {isScrolledDown && (
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-8 z-40 animate-in fade-in slide-in-from-bottom-2 duration-200">
      <div className="flex items-center gap-1 p-1 bg-card/95 text-card-foreground rounded-2xl border border-border/80 shadow-xl backdrop-blur-md ring-1 ring-black/5 dark:ring-white/5 select-none">
        {/* Main Quick Insert Popover Trigger */}
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer',
                isPopoverOpen
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground'
              )}
            >
              <Plus className={cn('h-3.5 w-3.5 transition-transform', isPopoverOpen && 'rotate-45')} />
              <span>{t('editor.quickInsert.button', 'Sisipkan')}</span>
              <ChevronUp className="h-3 w-3 opacity-60 ml-0.5" />
            </button>
          </PopoverTrigger>

          <PopoverContent
            align="end"
            side="top"
            sideOffset={10}
            className="w-72 sm:w-80 p-3 rounded-2xl border border-border/80 bg-popover text-popover-foreground shadow-2xl backdrop-blur-xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-border/70">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <span>{t('editor.quickInsert.title', 'Menu Sisipkan Cepat')}</span>
              </div>
              <span className="text-[10px] text-muted-foreground font-medium">
                {t('editor.quickInsert.quickHint', 'Akses instan')}
              </span>
            </div>

            {/* Media & Table Section */}
            <div className="space-y-1 mb-2.5">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-1">
                Media & Komponen
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={handleInsertTable}
                  className="flex items-center gap-2 p-2 rounded-xl border border-border/70 bg-card hover:bg-primary/10 hover:border-primary/50 text-left transition-all cursor-pointer group"
                >
                  <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                    <TableIcon className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-foreground">Tabel Baru</div>
                    <div className="text-[10px] text-muted-foreground">Baris & Kolom</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={handleInsertImage}
                  className="flex items-center gap-2 p-2 rounded-xl border border-border/70 bg-card hover:bg-primary/10 hover:border-primary/50 text-left transition-all cursor-pointer group"
                >
                  <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 group-hover:bg-sky-500 group-hover:text-white transition-colors">
                    <ImageIcon className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-foreground">Gambar</div>
                    <div className="text-[10px] text-muted-foreground">Unggah / URL</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={handleInsertLink}
                  className="flex items-center gap-2 p-2 rounded-xl border border-border/70 bg-card hover:bg-primary/10 hover:border-primary/50 text-left transition-all cursor-pointer group"
                >
                  <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                    <Link2 className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-foreground">Tautan Web</div>
                    <div className="text-[10px] text-muted-foreground">Hyperlink</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={handleInsertHr}
                  className="flex items-center gap-2 p-2 rounded-xl border border-border/70 bg-card hover:bg-primary/10 hover:border-primary/50 text-left transition-all cursor-pointer group"
                >
                  <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                    <Minus className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-foreground">Garis Pemisah</div>
                    <div className="text-[10px] text-muted-foreground">Horizontal rule</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Typography & Lists Section */}
            <div className="space-y-1 mb-2">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-1">
                Judul & Format Teks
              </span>
              <div className="grid grid-cols-3 gap-1">
                <button
                  type="button"
                  onClick={() => formatHeading('h1')}
                  className="flex items-center justify-center gap-1.5 p-1.5 rounded-lg border border-border/70 hover:bg-muted text-xs font-medium text-foreground transition-colors cursor-pointer"
                >
                  <Heading1 className="h-3.5 w-3.5 text-primary" />
                  <span>Judul 1</span>
                </button>
                <button
                  type="button"
                  onClick={() => formatHeading('h2')}
                  className="flex items-center justify-center gap-1.5 p-1.5 rounded-lg border border-border/70 hover:bg-muted text-xs font-medium text-foreground transition-colors cursor-pointer"
                >
                  <Heading2 className="h-3.5 w-3.5 text-primary" />
                  <span>Judul 2</span>
                </button>
                <button
                  type="button"
                  onClick={() => formatHeading('h3')}
                  className="flex items-center justify-center gap-1.5 p-1.5 rounded-lg border border-border/70 hover:bg-muted text-xs font-medium text-foreground transition-colors cursor-pointer"
                >
                  <Heading3 className="h-3.5 w-3.5 text-primary" />
                  <span>Judul 3</span>
                </button>
              </div>

              <div className="grid grid-cols-3 gap-1 pt-1">
                <button
                  type="button"
                  onClick={() => formatList('bullet')}
                  className="flex items-center justify-center gap-1.5 p-1.5 rounded-lg border border-border/70 hover:bg-muted text-xs font-medium text-foreground transition-colors cursor-pointer"
                >
                  <List className="h-3.5 w-3.5 text-foreground" />
                  <span>Poin</span>
                </button>
                <button
                  type="button"
                  onClick={() => formatList('number')}
                  className="flex items-center justify-center gap-1.5 p-1.5 rounded-lg border border-border/70 hover:bg-muted text-xs font-medium text-foreground transition-colors cursor-pointer"
                >
                  <ListOrdered className="h-3.5 w-3.5 text-foreground" />
                  <span>Nomor</span>
                </button>
                <button
                  type="button"
                  onClick={() => formatList('check')}
                  className="flex items-center justify-center gap-1.5 p-1.5 rounded-lg border border-border/70 hover:bg-muted text-xs font-medium text-foreground transition-colors cursor-pointer"
                >
                  <ListChecks className="h-3.5 w-3.5 text-foreground" />
                  <span>Ceklis</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-1 pt-1">
                <button
                  type="button"
                  onClick={formatQuote}
                  className="flex items-center justify-center gap-1.5 p-1.5 rounded-lg border border-border/70 hover:bg-muted text-xs font-medium text-foreground transition-colors cursor-pointer"
                >
                  <Quote className="h-3.5 w-3.5 text-foreground" />
                  <span>Kutipan</span>
                </button>
                <button
                  type="button"
                  onClick={formatCode}
                  className="flex items-center justify-center gap-1.5 p-1.5 rounded-lg border border-border/70 hover:bg-muted text-xs font-medium text-foreground transition-colors cursor-pointer"
                >
                  <Code className="h-3.5 w-3.5 text-foreground" />
                  <span>Blok Kode</span>
                </button>
              </div>
            </div>

            {/* Quick footer toggle */}
            <div className="flex items-center justify-between pt-2 border-t border-border/70 text-[11px] text-muted-foreground">
              <button
                type="button"
                onClick={onToggleStickyToolbar}
                className="flex items-center gap-1.5 hover:text-foreground transition-colors cursor-pointer"
              >
                {isStickyToolbar ? (
                  <>
                    <Pin className="h-3 w-3 text-primary" />
                    <span>Toolbar Lengket: <strong>Aktif</strong></span>
                  </>
                ) : (
                  <>
                    <PinOff className="h-3 w-3 opacity-60" />
                    <span>Toolbar Lengket: <strong>Mati</strong></span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleScrollToTop}
                className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer font-medium"
              >
                <ArrowUp className="h-3 w-3" />
                <span>Ke Atas</span>
              </button>
            </div>
          </PopoverContent>
        </Popover>

        {/* 1-Click Fast Table Button */}
        <button
          type="button"
          onClick={onOpenTableDialog}
          title={t('editor.toolbar.insertTable', 'Sisipkan Tabel Langsung')}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium text-foreground hover:bg-muted transition-colors cursor-pointer"
        >
          <TableIcon className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
          <span className="hidden md:inline">Tabel</span>
        </button>

        {/* 1-Click Fast Image Button */}
        <button
          type="button"
          onClick={onOpenImageDialog}
          title={t('editor.toolbar.insertImage', 'Sisipkan Gambar Langsung')}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium text-foreground hover:bg-muted transition-colors cursor-pointer"
        >
          <ImageIcon className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400" />
          <span className="hidden md:inline">Gambar</span>
        </button>

        {/* 1-Click Fast Link Button */}
        <button
          type="button"
          onClick={onOpenLinkDialog}
          title={t('editor.toolbar.insertLink', 'Sisipkan Tautan Langsung')}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium text-foreground hover:bg-muted transition-colors cursor-pointer"
        >
          <Link2 className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
          <span className="hidden lg:inline">Tautan</span>
        </button>

        <div className="h-4 w-px bg-border/80 mx-0.5" />

        {/* Sticky Toolbar Toggle Button */}
        <button
          type="button"
          onClick={onToggleStickyToolbar}
          title={
            isStickyToolbar
              ? t('editor.toolbar.stickyOn', 'Toolbar Menempel di Atas (Klik untuk matikan)')
              : t('editor.toolbar.stickyOff', 'Toolbar Tidak Menempel (Klik untuk aktifkan)')
          }
          className={cn(
            'p-1.5 rounded-lg text-xs transition-colors cursor-pointer',
            isStickyToolbar
              ? 'bg-primary/10 text-primary hover:bg-primary/20'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          )}
        >
          {isStickyToolbar ? <Pin className="h-3.5 w-3.5" /> : <PinOff className="h-3.5 w-3.5" />}
        </button>

        {/* Scroll to Top (Visible when scrolled down) */}
        {isScrolledDown && (
          <button
            type="button"
            onClick={handleScrollToTop}
            title={t('editor.quickInsert.scrollToTop', 'Gulir Kembali ke Atas Dokumen')}
            className="p-1.5 rounded-lg text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            <ArrowUp className="h-3.5 w-3.5 text-primary" />
          </button>
        )}

        {/* Minimize Button */}
        <button
          type="button"
          onClick={() => toggleMinimize(true)}
          title={t('editor.quickInsert.minimize', 'Kecilkan Menu')}
          className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer ml-0.5"
        >
          <Minimize2 className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}
