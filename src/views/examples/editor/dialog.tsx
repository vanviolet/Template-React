import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Eye, Code2, Copy, Check, ExternalLink } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toast';
import { cn } from '@/utils/cn';

interface EditorPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  htmlContent: string;
}

export function EditorPreviewDialog({
  open,
  onOpenChange,
  htmlContent,
}: EditorPreviewDialogProps) {
  const { t } = useTranslation();
  const [viewMode, setViewMode] = useState<'rendered' | 'source'>('rendered');
  const [copied, setCopied] = useState(false);

  const handleCopySource = async () => {
    try {
      await navigator.clipboard.writeText(htmlContent);
      setCopied(true);
      toast.success(t('common.success', 'Berhasil'), {
        description: t('editor.toast.sourceCopied', 'Kode HTML disalin ke clipboard.'),
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error(t('common.error', 'Gagal'));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[85vh] flex flex-col p-6" requireDoubleClickOutside={false}>
        <DialogHeader className="space-y-1 border-b border-border/80 pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-primary">
              <Eye className="h-4 w-4" />
              <DialogTitle className="text-base font-bold text-foreground">
                {t('editor.preview.title', 'Pratinjau Dokumen Siap Cetak & Publikasi')}
              </DialogTitle>
            </div>

            {/* Rendered vs Raw HTML toggle */}
            <div className="flex items-center bg-muted/70 p-0.5 rounded-lg border border-border/70 text-xs self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setViewMode('rendered')}
                className={cn(
                  'flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all cursor-pointer font-medium',
                  viewMode === 'rendered'
                    ? 'bg-card text-foreground shadow-2xs'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Eye className="h-3.5 w-3.5" />
                <span>{t('editor.preview.rendered', 'Tampilan Baca')}</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('source')}
                className={cn(
                  'flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all cursor-pointer font-medium',
                  viewMode === 'source'
                    ? 'bg-card text-foreground shadow-2xs'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Code2 className="h-3.5 w-3.5" />
                <span>{t('editor.preview.htmlCode', 'Kode HTML')}</span>
              </button>
            </div>
          </div>
          <DialogDescription className="text-xs text-muted-foreground">
            {t(
              'editor.preview.desc',
              'Hasil render semantik persis seperti yang akan diterima pengguna atau pembaca situs.'
            )}
          </DialogDescription>
        </DialogHeader>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto py-4 px-1">
          {viewMode === 'rendered' ? (
            <div
              className="prose prose-neutral dark:prose-invert max-w-none text-sm leading-relaxed p-6 rounded-xl border border-border/80 bg-background/80 shadow-2xs"
              dangerouslySetInnerHTML={{ __html: htmlContent || '<p class="text-muted-foreground italic">Dokumen kosong...</p>' }}
            />
          ) : (
            <div className="relative">
              <pre className="p-4 rounded-xl border border-border bg-muted/60 text-foreground font-mono text-xs overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-[50vh]">
                {htmlContent || '<!-- Dokumen kosong -->'}
              </pre>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCopySource}
                className="absolute top-3 right-3 h-7 text-xs gap-1 bg-background/90"
              >
                {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                <span>{copied ? t('common.success', 'Tersalin') : t('common.copy', 'Salin')}</span>
              </Button>
            </div>
          )}
        </div>

        <DialogFooter className="flex flex-row items-center justify-between border-t border-border/80 pt-3">
          <span className="text-[11px] text-muted-foreground flex items-center gap-1">
            <ExternalLink className="h-3 w-3" />
            {t('editor.preview.footerNotice', 'Standard HTML5 & Semantic Elements')}
          </span>
          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-xs h-8"
          >
            {t('common.cancel', 'Tutup')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
