import React, { useState } from 'react';
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import {
  Send,
  Sparkles,
  CheckCircle2,
  FileCheck,
  RotateCcw,
  Tag,
  User,
  Type,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RichEditor } from '@/components/ui/rich.editor';
import { toast } from '@/components/ui/toast';
import { EditorFormState } from './types';

const articleSchema = z.object({
  title: z
    .string()
    .min(5, 'Judul artikel wajib diisi minimal 5 karakter')
    .max(120, 'Judul artikel maksimal 120 karakter'),
  category: z.string().min(1, 'Pilih salah satu kategori publikasi'),
  author: z.string().min(3, 'Nama penulis wajib diisi minimal 3 karakter'),
  content: z
    .string()
    .min(25, 'Konten editor wajib diisi minimal 25 karakter HTML')
    .refine((val) => !val.includes('<p></p>') || val.replace(/<[^>]*>/g, '').trim().length >= 10, {
      message: 'Tuliskan teks substansi dokumen (minimal 10 karakter tulisan).',
    }),
});

export function EditorFormShowcase() {
  const { t } = useTranslation();
  const [submittedData, setSubmittedData] = useState<EditorFormState | null>(null);

  const form = useForm({
    defaultValues: {
      title: 'Pembaruan Kebijakan Operasional Digital 2026',
      category: 'Kebijakan',
      author: 'Tim Regulasi & Standarisasi',
      summary: '',
      content:
        '<h2>Ketentuan Umum</h2><p>Setiap unit kerja wajib mendokumentasikan alur persetujuan menggunakan sistem berbasis web resmi untuk menjamin akuntabilitas.</p><ul><li>Dokumen harus ditinjau berkala setiap kuartal.</li><li>Penyimpanan arsip menggunakan enkripsi standar industri.</li></ul>',
      status: 'draft' as const,
    },
    validators: {
      onChange: articleSchema,
    },
    onSubmit: async ({ value }) => {
      setSubmittedData({
        ...value,
        summary: value.content.replace(/<[^>]*>/g, '').slice(0, 150) + '...',
      });
      toast.success(
        t('editor.form.submitSuccess', 'Formulir berhasil divalidasi dan disimpan!'),
        {
          description: t(
            'editor.form.submitDesc',
            'Data artikel dengan rich content siap dikirim ke backend.'
          ),
        }
      );
    },
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Form Card */}
      <div className="lg:col-span-8 bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
        <div className="border-b border-border/80 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <h2 className="text-base font-semibold text-foreground">
              {t('editor.form.title', 'Integrasi TanStack Form + Zod Validation')}
            </h2>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {t(
              'editor.form.subtitle',
              'Contoh penggunaan RichEditor sebagai field formulir terkontrol dengan validasi skema Zod.'
            )}
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          {/* Field Judul */}
          <form.Field
            name="title"
            children={(field) => (
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                  <Type className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>{t('editor.form.fieldTitle', 'Judul Publikasi')}</span>
                  <span className="text-destructive">*</span>
                </label>
                <Input
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder={t('editor.form.titlePlaceholder', 'Masukkan judul publikasi atau surat...')}
                  className="text-xs"
                />
                {field.state.meta.isTouched && field.state.meta.errors.length ? (
                  <p className="text-[11px] text-destructive">
                    {field.state.meta.errors[0]?.message || String(field.state.meta.errors[0])}
                  </p>
                ) : null}
              </div>
            )}
          />

          {/* Grid Kategori & Penulis */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <form.Field
              name="category"
              children={(field) => (
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                    <Tag className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{t('editor.form.fieldCategory', 'Kategori Dokumen')}</span>
                    <span className="text-destructive">*</span>
                  </label>
                  <select
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    className="w-full h-9 rounded-lg border border-input bg-background px-3 py-1.5 text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer"
                  >
                    <option value="Kebijakan">Kebijakan & Regulasi</option>
                    <option value="Teknis">Dokumentasi Teknis</option>
                    <option value="Berita">Pengumuman & Berita</option>
                    <option value="Notulen">Notulen Rapat</option>
                  </select>
                </div>
              )}
            />

            <form.Field
              name="author"
              children={(field) => (
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{t('editor.form.fieldAuthor', 'Penulis / Penyusun')}</span>
                    <span className="text-destructive">*</span>
                  </label>
                  <Input
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="Nama lengkap atau divisi penyusun..."
                    className="text-xs"
                  />
                  {field.state.meta.isTouched && field.state.meta.errors.length ? (
                    <p className="text-[11px] text-destructive">
                      {field.state.meta.errors[0]?.message || String(field.state.meta.errors[0])}
                    </p>
                  ) : null}
                </div>
              )}
            />
          </div>

          {/* Field Rich Editor Content */}
          <form.Field
            name="content"
            children={(field) => (
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <FileCheck className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{t('editor.form.fieldContent', 'Isi Dokumen / Naskah Lengkap')}</span>
                    <span className="text-destructive">*</span>
                  </span>
                  <span className="text-[11px] text-muted-foreground font-normal">
                    Format Lexical Rich Text
                  </span>
                </label>

                <RichEditor
                  value={field.state.value}
                  onChange={(html) => field.handleChange(html)}
                  minHeight={260}
                  placeholder={t(
                    'editor.form.contentPlaceholder',
                    'Tulis isi naskah lengkap di sini. Gunakan toolbar untuk styling atau ketik tanda markdown...'
                  )}
                  error={
                    field.state.meta.isTouched && field.state.meta.errors.length
                      ? field.state.meta.errors[0]?.message || String(field.state.meta.errors[0])
                      : undefined
                  }
                />
              </div>
            )}
          />

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/80">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => form.reset()}
              className="h-9 text-xs gap-1.5"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>{t('common.reset', 'Riset Form')}</span>
            </Button>

            <Button
              type="submit"
              variant="default"
              size="sm"
              className="h-9 text-xs gap-1.5"
            >
              <Send className="h-3.5 w-3.5" />
              <span>{t('editor.form.submitBtn', 'Simpan & Publikasikan Dokumen')}</span>
            </Button>
          </div>
        </form>
      </div>

      {/* Payload Live Preview Card */}
      <div className="lg:col-span-4 space-y-4">
        <div className="bg-card border border-border rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-foreground">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <h3 className="text-xs font-semibold">
              {t('editor.form.payloadTitle', 'Payload Terkirim (State)')}
            </h3>
          </div>
          <p className="text-[11px] text-muted-foreground">
            {t(
              'editor.form.payloadDesc',
              'JSON payload siap dikirim ke API backend sesuai arsitektur TypeScript.'
            )}
          </p>

          <pre className="p-3 bg-muted/60 border border-border/80 rounded-xl font-mono text-[11px] leading-relaxed text-foreground overflow-x-auto max-h-[360px]">
            {submittedData
              ? JSON.stringify(submittedData, null, 2)
              : JSON.stringify(
                  {
                    status: 'Menunggu submit formulir...',
                    tip: 'Isi form di samping lalu klik tombol simpan untuk melihat data terkirim.',
                  },
                  null,
                  2
                )}
          </pre>
        </div>

        {submittedData && (
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 text-xs space-y-2">
            <span className="font-semibold text-primary block">
              {t('editor.form.quickPreview', 'Ringkasan Render Cepat:')}
            </span>
            <div
              className="prose prose-neutral dark:prose-invert max-w-none text-xs line-clamp-4"
              dangerouslySetInnerHTML={{ __html: submittedData.content }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
