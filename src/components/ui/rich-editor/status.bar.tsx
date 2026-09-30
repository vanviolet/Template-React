import React, { useState, useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getRoot } from 'lexical';
import { useTranslation } from 'react-i18next';
import { FileText, Clock, HelpCircle, Check } from 'lucide-react';
import { calculateEditorStats } from './utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface StatusBarProps {
  enableMarkdownShortcuts?: boolean;
}

export function StatusBar({ enableMarkdownShortcuts = true }: StatusBarProps) {
  const [editor] = useLexicalComposerContext();
  const { t } = useTranslation();
  const [stats, setStats] = useState({
    words: 0,
    characters: 0,
    readingTimeMinutes: 1,
  });

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const text = $getRoot().getTextContent();
        setStats(calculateEditorStats(text));
      });
    });
  }, [editor]);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-3.5 py-2 border-t border-border/70 bg-muted/20 text-[11px] text-muted-foreground select-none">
      {/* Word & Character Count */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 font-medium">
          <FileText className="h-3 w-3 text-primary/70 shrink-0" />
          <span>
            <strong className="text-foreground font-semibold">{stats.words}</strong>{' '}
            {t('editor.status.words', 'kata')}
          </span>
        </div>

        <span className="text-border">•</span>

        <div>
          <span>
            <strong className="text-foreground font-semibold">{stats.characters}</strong>{' '}
            {t('editor.status.characters', 'karakter')}
          </span>
        </div>

        <span className="text-border hidden sm:inline">•</span>

        <div className="hidden sm:flex items-center gap-1">
          <Clock className="h-3 w-3 text-muted-foreground shrink-0" />
          <span>
            ~{stats.readingTimeMinutes} {t('editor.status.minRead', 'mnt baca')}
          </span>
        </div>
      </div>

      {/* Markdown Help Popover */}
      {enableMarkdownShortcuts && (
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer px-1.5 py-0.5 rounded hover:bg-muted"
            >
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>{t('editor.status.markdownReady', 'Markdown aktif')}</span>
              <HelpCircle className="h-3 w-3 opacity-70" />
            </button>
          </PopoverTrigger>
          <PopoverContent side="top" align="end" className="w-72 p-3 text-xs space-y-2">
            <div className="font-semibold text-foreground flex items-center justify-between border-b border-border/70 pb-1.5">
              <span>{t('editor.markdown.title', 'Pintasan Format Markdown')}</span>
              <span className="text-[10px] bg-primary/10 text-primary font-medium px-1.5 py-0.5 rounded">
                Live
              </span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 text-[11px]">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-muted-foreground">
                  <code className="text-foreground font-mono bg-muted px-1 rounded"># Spasi</code>
                  <span>H1 Judul</span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <code className="text-foreground font-mono bg-muted px-1 rounded">## Spasi</code>
                  <span>H2 Judul</span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <code className="text-foreground font-mono bg-muted px-1 rounded">### Spasi</code>
                  <span>H3 Judul</span>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-muted-foreground">
                  <code className="text-foreground font-mono bg-muted px-1 rounded">- Spasi</code>
                  <span>Daftar Poin</span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <code className="text-foreground font-mono bg-muted px-1 rounded">1. Spasi</code>
                  <span>Daftar Nomor</span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <code className="text-foreground font-mono bg-muted px-1 rounded">&gt; Spasi</code>
                  <span>Kutipan</span>
                </div>
              </div>
            </div>
            <div className="pt-1 text-[10px] text-muted-foreground/80 flex items-center gap-1 border-t border-border/50">
              <Check className="h-2.5 w-2.5 text-emerald-500" />
              <span>{t('editor.markdown.hint', 'Ketik di awal paragraf untuk otomatis memformat')}</span>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
