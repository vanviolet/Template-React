import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  FileDown,
  Copy,
  Code2,
  Eye,
  RotateCcw,
  Sparkles,
  ChevronDown,
  FileCheck2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuGroup,
} from '@/components/ui/dropdown.menu';
import { toast } from '@/components/ui/toast';
import { SAMPLE_TEMPLATES, DocumentTemplate } from './constants';
import { convertHtmlToMarkdown, downloadFile } from '@/components/ui/rich-editor/utils';

interface EditorActionProps {
  htmlContent: string;
  plainText: string;
  onLoadTemplate: (template: DocumentTemplate) => void;
  onReset: () => void;
  onOpenPreview: () => void;
}

export function EditorAction({
  htmlContent,
  plainText,
  onLoadTemplate,
  onReset,
  onOpenPreview,
}: EditorActionProps) {
  const { t } = useTranslation();

  const handleCopyHtml = async () => {
    try {
      await navigator.clipboard.writeText(htmlContent);
      toast.success(
        t('editor.toast.copyHtmlSuccess', 'Kode HTML berhasil disalin ke clipboard!'),
        { description: t('editor.toast.copyHtmlDesc', 'Anda dapat menempelkannya di email atau web.') }
      );
    } catch {
      toast.error(t('common.error', 'Gagal menyalin'));
    }
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(plainText);
      toast.success(
        t('editor.toast.copyTextSuccess', 'Teks polos berhasil disalin!'),
        { description: t('editor.toast.copyTextDesc', 'Format teks bersih tanpa tag HTML.') }
      );
    } catch {
      toast.error(t('common.error', 'Gagal menyalin'));
    }
  };

  const handleDownloadMarkdown = () => {
    const md = convertHtmlToMarkdown(htmlContent);
    downloadFile(md, 'dokumen-lexical.md', 'text/markdown;charset=utf-8');
    toast.success(
      t('editor.toast.downloadMdSuccess', 'File Markdown (.md) berhasil diunduh!'),
      { description: t('editor.toast.downloadMdDesc', 'Disimpan di folder unduhan perangkat Anda.') }
    );
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-card/60 p-2.5 rounded-xl border border-border/80">
      {/* Templates Selector */}
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs font-medium">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span>{t('editor.action.loadTemplate', 'Pilih Template Dokumen')}</span>
              <ChevronDown className="h-3 w-3 opacity-60 ml-0.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-64">
            <DropdownMenuGroup>
              {SAMPLE_TEMPLATES.map((tmpl) => (
                <DropdownMenuItem
                  key={tmpl.id}
                  onClick={() => onLoadTemplate(tmpl)}
                  className="flex flex-col items-start gap-0.5 py-2 cursor-pointer"
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-semibold text-xs text-foreground">
                      {t(tmpl.titleKey, tmpl.defaultTitle)}
                    </span>
                    <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-medium">
                      {tmpl.badge}
                    </span>
                  </div>
                  <span className="text-[11px] text-muted-foreground line-clamp-1">
                    {t(tmpl.descriptionKey, tmpl.defaultDescription)}
                  </span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onReset} className="text-destructive gap-2 text-xs">
              <RotateCcw className="h-3.5 w-3.5" />
              <span>{t('editor.action.blankCanvas', 'Mulai dari Kanvas Kosong')}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <span className="text-xs text-muted-foreground hidden md:inline">
          {t('editor.action.hint', 'Pilih format siap pakai atau ketik bebas')}
        </span>
      </div>

      {/* Export & Preview Actions */}
      <div className="flex flex-wrap items-center gap-1.5">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleCopyHtml}
          className="h-8 text-xs gap-1.5"
          title={t('editor.action.copyHtml', 'Salin HTML')}
        >
          <Code2 className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="hidden sm:inline">{t('editor.action.copyHtml', 'Salin HTML')}</span>
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleCopyText}
          className="h-8 text-xs gap-1.5"
          title={t('editor.action.copyText', 'Salin Teks')}
        >
          <Copy className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="hidden sm:inline">{t('editor.action.copyText', 'Salin Teks')}</span>
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleDownloadMarkdown}
          className="h-8 text-xs gap-1.5"
          title={t('editor.action.downloadMd', 'Unduh Markdown')}
        >
          <FileDown className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="hidden sm:inline">.MD</span>
        </Button>

        <Button
          type="button"
          variant="default"
          size="sm"
          onClick={onOpenPreview}
          className="h-8 text-xs gap-1.5"
        >
          <Eye className="h-3.5 w-3.5" />
          <span>{t('editor.action.preview', 'Pratinjau Hasil')}</span>
        </Button>
      </div>
    </div>
  );
}
