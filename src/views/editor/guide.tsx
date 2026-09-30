import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Sparkles,
  Zap,
  Layers,
  MousePointerClick,
  Code2,
  CheckCircle,
  FileCheck2,
} from 'lucide-react';
import { MARKDOWN_CHEATSHEET } from './constants';

export function EditorGuide() {
  const { t } = useTranslation();

  const features = [
    {
      icon: Zap,
      titleKey: 'editor.guide.lexicalEngineTitle',
      defaultTitle: 'Bertenaga Lexical Engine',
      descKey: 'editor.guide.lexicalEngineDesc',
      defaultDesc:
        'Menggunakan framework editor resmi Meta (Lexical) yang ringan, modular, dan berperforma tinggi tanpa bloat.',
    },
    {
      icon: MousePointerClick,
      titleKey: 'editor.guide.floatingBubbleTitle',
      defaultTitle: 'Floating Selection Bubble',
      descKey: 'editor.guide.floatingBubbleDesc',
      defaultDesc:
        'Saat kata atau kalimat diseleksi, bilah aksi cepat melayang otomatis di atas teks ala Notion & Medium.',
    },
    {
      icon: Sparkles,
      titleKey: 'editor.guide.markdownTitle',
      defaultTitle: 'Markdown Otomatis Secara Realtime',
      descKey: 'editor.guide.markdownDesc',
      defaultDesc:
        'Ketik simbol Markdown standar seperti "#", "-", atau ">" untuk mengubah format blok seketika tanpa harus menyentuh mouse.',
    },
    {
      icon: Layers,
      titleKey: 'editor.guide.colorPaletteTitle',
      defaultTitle: 'Palet Warna & Sorotan Semantic',
      descKey: 'editor.guide.colorPaletteDesc',
      defaultDesc:
        'Pilihan warna teks profesional dan penyorot latar (highlight) yang serasi dengan tema Light dan Dark.',
    },
    {
      icon: Code2,
      titleKey: 'editor.guide.multiExportTitle',
      defaultTitle: 'Ekspor Multi-Format',
      descKey: 'editor.guide.multiExportDesc',
      defaultDesc:
        'Dukungan penuh salin kode sumber HTML standar, teks polos bersih, serta ekspor berkas Markdown (.md).',
    },
    {
      icon: FileCheck2,
      titleKey: 'editor.guide.zenModeTitle',
      defaultTitle: 'Mode Layar Penuh (Zen Writing)',
      descKey: 'editor.guide.zenModeDesc',
      defaultDesc:
        'Fokus menulis tanpa distraksi dengan satu klik mode layar penuh dan tombol keluar cepat (Escape).',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((feat, idx) => {
          const Icon = feat.icon;
          return (
            <div
              key={idx}
              className="p-5 rounded-2xl border border-border bg-card shadow-2xs space-y-2 hover:border-primary/40 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <Icon className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">
                {t(feat.titleKey, feat.defaultTitle)}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {t(feat.descKey, feat.defaultDesc)}
              </p>
            </div>
          );
        })}
      </div>

      {/* Markdown Shortcut Cheatsheet */}
      <div className="p-5 sm:p-6 rounded-2xl border border-border bg-card shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">
            {t('editor.guide.cheatsheetTitle', 'Tabel Pintasan Pengetikan Cepat (Markdown Cheatsheet)')}
          </h3>
        </div>
        <p className="text-xs text-muted-foreground">
          {t(
            'editor.guide.cheatsheetDesc',
            'Tingkatkan efisiensi mengetik Anda dengan pintasan langsung di dalam area penulisan editor.'
          )}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-1">
          {MARKDOWN_CHEATSHEET.map((item, i) => (
            <div
              key={i}
              className="p-3 rounded-xl border border-border/70 bg-muted/30 space-y-1.5 text-xs"
            >
              <div className="flex items-center justify-between">
                <code className="text-[11px] font-mono font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                  {item.trigger}
                </code>
                <span className="text-[11px] text-foreground font-medium">{item.result}</span>
              </div>
              <div className="text-[11px] text-muted-foreground flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-emerald-500 shrink-0" />
                <span className="truncate">{item.example}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
