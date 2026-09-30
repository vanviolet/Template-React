import React, { useState, useRef } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $insertNodes } from 'lexical';
import { useTranslation } from 'react-i18next';
import {
  Image as ImageIcon,
  Upload,
  Link,
  Sparkles,
  Check,
  X,
  FileImage,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { $createImageNode } from '../nodes/image.node';
import { cn } from '@/utils/cn';

interface InsertImageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SAMPLE_IMAGES = [
  {
    title: 'Dashboard & Analitik Data',
    url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    alt: 'Ilustrasi grafik analitik digital',
  },
  {
    title: 'Kolaborasi & Diskusi Tim',
    url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    alt: 'Tim sedang berdiskusi proyek',
  },
  {
    title: 'Arsitektur Sistem & Cloud',
    url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    alt: 'Jaringan koneksi digital global',
  },
  {
    title: 'Workspace & Ruang Kerja',
    url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    alt: 'Ruang kerja kantor modern dan rapi',
  },
];

export function InsertImageDialog({ open, onOpenChange }: InsertImageDialogProps) {
  const [editor] = useLexicalComposerContext();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'upload' | 'url' | 'presets'>('upload');

  const [imageUrl, setImageUrl] = useState('');
  const [altText, setAltText] = useState('');
  const [caption, setCaption] = useState('');
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!altText) setAltText(file.name.replace(/\.[^/.]+$/, ''));
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setPreviewSrc(result);
        setImageUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectPreset = (preset: typeof SAMPLE_IMAGES[0]) => {
    setImageUrl(preset.url);
    setPreviewSrc(preset.url);
    setAltText(preset.alt);
    setCaption(preset.title);
  };

  const handleInsert = () => {
    const finalSrc = previewSrc || imageUrl.trim();
    if (!finalSrc) return;

    editor.update(() => {
      const imageNode = $createImageNode({
        src: finalSrc,
        altText: altText.trim() || 'Gambar terlampir',
        caption: caption.trim() || undefined,
        width: '75%',
        alignment: 'center',
      });
      $insertNodes([imageNode]);
    });

    // Reset and close
    setPreviewSrc(null);
    setImageUrl('');
    setAltText('');
    setCaption('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg p-5" requireDoubleClickOutside={false}>
        <DialogHeader className="space-y-1">
          <div className="flex items-center gap-2 text-primary">
            <ImageIcon className="h-4 w-4" />
            <DialogTitle className="text-base font-semibold text-foreground">
              {t('editor.image.dialogTitle', 'Sisipkan Gambar ke Dokumen')}
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground">
            {t(
              'editor.image.dialogDesc',
              'Unggah berkas lokal, masukkan tautan URL web, atau gunakan galeri foto contoh.'
            )}
          </DialogDescription>
        </DialogHeader>

        {/* Tab switch */}
        <div className="flex items-center p-1 bg-muted/60 rounded-xl border border-border text-xs gap-1 my-2">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={cn(
              'flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg font-medium transition-all cursor-pointer',
              activeTab === 'upload'
                ? 'bg-card text-foreground shadow-2xs'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Upload className="h-3.5 w-3.5" />
            <span>{t('editor.image.tabUpload', 'Unggah Berkas')}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={cn(
              'flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg font-medium transition-all cursor-pointer',
              activeTab === 'url'
                ? 'bg-card text-foreground shadow-2xs'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Link className="h-3.5 w-3.5" />
            <span>{t('editor.image.tabUrl', 'Tautan Web')}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('presets')}
            className={cn(
              'flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg font-medium transition-all cursor-pointer',
              activeTab === 'presets'
                ? 'bg-card text-foreground shadow-2xs'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>{t('editor.image.tabPresets', 'Galeri Contoh')}</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="space-y-3 py-1">
          {activeTab === 'upload' && (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-border/80 hover:border-primary/70 rounded-xl p-5 text-center cursor-pointer transition-colors bg-muted/20 hover:bg-muted/40"
              >
                <FileImage className="h-8 w-8 mx-auto text-primary/70 mb-2" />
                <p className="text-xs font-medium text-foreground">
                  {t('editor.image.dropzone', 'Klik untuk memilih file gambar dari komputer')}
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Mendukung format PNG, JPG, WebP, GIF, SVG
                </p>
              </div>
            </div>
          )}

          {activeTab === 'url' && (
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                {t('editor.image.urlLabel', 'Alamat URL Gambar')}
              </label>
              <Input
                value={imageUrl}
                onChange={(e) => {
                  setImageUrl(e.target.value);
                  setPreviewSrc(e.target.value);
                }}
                placeholder="https://images.unsplash.com/photo-..."
                className="text-xs"
              />
            </div>
          )}

          {activeTab === 'presets' && (
            <div className="grid grid-cols-2 gap-2">
              {SAMPLE_IMAGES.map((preset, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSelectPreset(preset)}
                  className={cn(
                    'group relative rounded-xl overflow-hidden border cursor-pointer transition-all hover:scale-[1.02]',
                    previewSrc === preset.url
                      ? 'border-primary ring-2 ring-primary/30'
                      : 'border-border/80'
                  )}
                >
                  <img
                    src={preset.url}
                    alt={preset.alt}
                    className="w-full h-20 object-cover"
                  />
                  <div className="p-1.5 bg-card/95 text-[11px] font-medium text-foreground truncate">
                    {preset.title}
                  </div>
                  {previewSrc === preset.url && (
                    <div className="absolute top-1.5 right-1.5 p-1 bg-primary text-primary-foreground rounded-full">
                      <Check className="h-2.5 w-2.5" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Live Preview if an image is selected */}
          {previewSrc && (
            <div className="relative rounded-xl border border-border p-2 bg-muted/30 flex items-center justify-center max-h-36 overflow-hidden">
              <img
                src={previewSrc}
                alt="Preview"
                className="max-h-32 rounded-lg object-contain"
              />
              <button
                type="button"
                onClick={() => {
                  setPreviewSrc(null);
                  setImageUrl('');
                }}
                className="absolute top-2 right-2 p-1 bg-background/80 hover:bg-background rounded-full text-foreground shadow-xs"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}

          {/* Alt text and Caption inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-foreground">
                {t('editor.image.altLabel', 'Teks Alternatif (Alt Text)')}
              </label>
              <Input
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                placeholder="Deskripsi singkat gambar..."
                className="text-xs h-8"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-foreground">
                {t('editor.image.captionLabel', 'Keterangan Bawah (Caption)')}
              </label>
              <Input
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Contoh: Gambar 1.1 Diagram Alur"
                className="text-xs h-8"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-row items-center justify-end gap-2 pt-2 border-t border-border/80">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="h-8 text-xs"
          >
            {t('common.cancel', 'Batal')}
          </Button>
          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={handleInsert}
            disabled={!previewSrc && !imageUrl.trim()}
            className="h-8 text-xs gap-1.5"
          >
            <ImageIcon className="h-3.5 w-3.5" />
            <span>{t('editor.image.insertBtn', 'Sisipkan Gambar')}</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
