import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  PenTool,
  FileText,
  FileCheck2,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { RichEditor } from '@/components/ui/rich.editor';
import { EditorAction } from './action';
import { EditorPreviewDialog } from './dialog';
import { EditorFormShowcase } from './form';
import { EditorGuide } from './guide';
import { SAMPLE_TEMPLATES, DocumentTemplate } from './constants';
import { cn } from '@/utils/cn';

export default function EditorView() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'document' | 'form' | 'guide'>('document');

  // Document Editor State
  const [content, setContent] = useState<string>(SAMPLE_TEMPLATES[0].htmlContent);
  const [plainText, setPlainText] = useState<string>('');
  const [previewOpen, setPreviewOpen] = useState(false);

  const handleLoadTemplate = (template: DocumentTemplate) => {
    setContent(template.htmlContent);
  };

  const handleReset = () => {
    setContent('<p></p>');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
              <PenTool className="h-5 w-5" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              {t('editor.view.title', 'Rich Text Editor')}
            </h1>
            <Badge variant="outline" className="border-primary/40 text-primary bg-primary/5 text-[10px]">
              Lexical v0.41+
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {t(
              'editor.view.subtitle',
              'Komponen editor kaya fitur, minimalis, dan modern berbasis Lexical dengan dukungan Markdown realtime, floating toolbar, dan validasi form.'
            )}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-3 sm:flex items-center gap-1.5 p-1 rounded-xl bg-muted/60 border border-border shrink-0 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setActiveTab('document')}
            className={cn(
              'flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer select-none truncate',
              activeTab === 'document'
                ? 'bg-card text-foreground shadow-2xs border border-border/80'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <FileText className="h-3.5 w-3.5 text-primary shrink-0" />
            <span className="truncate">{t('editor.tabs.workspace', 'Dokumen')}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('form')}
            className={cn(
              'flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer select-none truncate',
              activeTab === 'form'
                ? 'bg-card text-foreground shadow-2xs border border-border/80'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <FileCheck2 className="h-3.5 w-3.5 text-primary shrink-0" />
            <span className="truncate">{t('editor.tabs.form', 'Form & Zod')}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('guide')}
            className={cn(
              'flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer select-none truncate',
              activeTab === 'guide'
                ? 'bg-card text-foreground shadow-2xs border border-border/80'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <BookOpen className="h-3.5 w-3.5 text-primary shrink-0" />
            <span className="truncate">{t('editor.tabs.guide', 'Panduan')}</span>
          </button>
        </div>
      </div>

      {/* Main Tab Views */}
      {activeTab === 'document' && (
        <div className="space-y-4">
          {/* Action Toolbar */}
          <EditorAction
            htmlContent={content}
            plainText={plainText}
            onLoadTemplate={handleLoadTemplate}
            onReset={handleReset}
            onOpenPreview={() => setPreviewOpen(true)}
          />

          {/* Lexical Rich Editor Canvas */}
          <div className="bg-card border border-border/80 rounded-2xl p-2 sm:p-3 shadow-xs">
            <RichEditor
              value={content}
              onChange={(html, _state, text) => {
                setContent(html);
                setPlainText(text);
              }}
              minHeight="380px"
              placeholder={t(
                'editor.placeholder',
                'Mulai mengetik teks, catatan, atau ketik "#" untuk judul, "-" untuk daftar...'
              )}
            />
          </div>
        </div>
      )}

      {activeTab === 'form' && <EditorFormShowcase />}

      {activeTab === 'guide' && <EditorGuide />}

      {/* Preview Reader Dialog */}
      <EditorPreviewDialog
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        htmlContent={content}
      />
    </div>
  );
}
