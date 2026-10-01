import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useThemeStore } from '@/app/store/theme.store';
import { useTypographyStore, FontFamilyChoice, FontScaleChoice } from '@/app/store/typography.store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox';
import { ApiClient } from '@/services/api-generated';
import { LANGUAGE_OPTIONS } from '@/constants/app';
import {
  Sun,
  Moon,
  Laptop,
  Globe,
  Check,
  MapPin,
  Sparkles,
  Filter,
  Type,
  CheckCircle2,
  Sliders,
  ShieldCheck,
} from 'lucide-react';
import { cn } from '@/utils/cn';

export default function PengaturanView() {
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useThemeStore();
  const { fontFamily, setFontFamily, fontScale, setFontScale } = useTypographyStore();
  const [selectedDemoCity, setSelectedDemoCity] = useState('Bandung');
  const [selectedDemoRole, setSelectedDemoRole] = useState('admin');

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem('app_language', langCode);
  };

  const FONT_OPTIONS: Array<{
    id: FontFamilyChoice;
    name: string;
    description: string;
    designer: string;
    weights: string;
  }> = [
    {
      id: 'plus-jakarta',
      name: t('pengaturan.fontJakarta'),
      description: t('pengaturan.fontJakartaDesc'),
      designer: 'Tokotype (Jakarta)',
      weights: '200–800',
    },
    {
      id: 'inter',
      name: t('pengaturan.fontInter'),
      description: t('pengaturan.fontInterDesc'),
      designer: 'Rasmus Andersson',
      weights: '100–900',
    },
    {
      id: 'geist',
      name: t('pengaturan.fontGeist'),
      description: t('pengaturan.fontGeistDesc'),
      designer: 'Vercel Design',
      weights: '100–900',
    },
  ];

  const SCALE_OPTIONS: Array<{
    id: FontScaleChoice;
    label: string;
    size: string;
  }> = [
    { id: 'compact', label: t('pengaturan.fontScaleCompact'), size: '14.5px' },
    { id: 'normal', label: t('pengaturan.fontScaleNormal'), size: '16px' },
    { id: 'relaxed', label: t('pengaturan.fontScaleRelaxed'), size: '17px' },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="border-b border-border pb-4">
        <h1 className="text-xl font-bold tracking-tight text-foreground">{t('pengaturan.title')}</h1>
        <p className="text-xs text-muted-foreground mt-0.5">{t('pengaturan.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl">
        {/* Card 1: Theme Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">{t('pengaturan.appearance')}</CardTitle>
            <CardDescription>Pilih tema tampilan untuk antarmuka dashboard</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-3 gap-3">
              {/* Light Mode */}
              <button
                type="button"
                onClick={() => setTheme('light')}
                className={cn(
                  'flex flex-col items-center justify-center p-3 rounded-lg border text-xs gap-2 transition-all cursor-pointer',
                  theme === 'light'
                    ? 'border-primary bg-primary/5 ring-1 ring-primary font-semibold text-foreground'
                    : 'border-border bg-card text-muted-foreground hover:bg-muted/40'
                )}
              >
                <Sun className="h-5 w-5 text-amber-500" />
                <span>{t('pengaturan.themeLight')}</span>
              </button>

              {/* Dark Mode */}
              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={cn(
                  'flex flex-col items-center justify-center p-3 rounded-lg border text-xs gap-2 transition-all cursor-pointer',
                  theme === 'dark'
                    ? 'border-primary bg-primary/5 ring-1 ring-primary font-semibold text-foreground'
                    : 'border-border bg-card text-muted-foreground hover:bg-muted/40'
                )}
              >
                <Moon className="h-5 w-5 text-sky-400" />
                <span>{t('pengaturan.themeDark')}</span>
              </button>

              {/* System Mode */}
              <button
                type="button"
                onClick={() => setTheme('system')}
                className={cn(
                  'flex flex-col items-center justify-center p-3 rounded-lg border text-xs gap-2 transition-all cursor-pointer',
                  theme === 'system'
                    ? 'border-primary bg-primary/5 ring-1 ring-primary font-semibold text-foreground'
                    : 'border-border bg-card text-muted-foreground hover:bg-muted/40'
                )}
              >
                <Laptop className="h-5 w-5 text-purple-500" />
                <span>OS System</span>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Language Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary" />
              <span>{t('pengaturan.language')}</span>
            </CardTitle>
            <CardDescription>Pilih bahasa internasional untuk semua teks UI</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {LANGUAGE_OPTIONS.map((lang) => {
              const isSelected = i18n.language === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleLanguageChange(lang.code)}
                  className={cn(
                    'flex items-center justify-between w-full p-3 rounded-lg border text-xs transition-all cursor-pointer',
                    isSelected
                      ? 'border-primary bg-primary/5 ring-1 ring-primary font-semibold text-foreground'
                      : 'border-border bg-card text-muted-foreground hover:bg-muted/40'
                  )}
                >
                  <span className="flex items-center gap-2.5">
                    <span className="text-lg">{lang.flag}</span>
                    <span>{lang.label}</span>
                  </span>
                  {isSelected && <Check className="h-4 w-4 text-primary shrink-0" />}
                </button>
              );
            })}
          </CardContent>
        </Card>

        {/* Card 3: Typography & Font Preferences (Full Width) */}
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Type className="h-4 w-4 text-primary" />
                <span>{t('pengaturan.typography')}</span>
              </CardTitle>
              <div className="flex items-center gap-1.5 text-[11px] bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-medium px-2.5 py-1 rounded-md border border-emerald-500/20">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Anti-Blur Engine & Real Vector Font Weights (300–800)</span>
              </div>
            </div>
            <CardDescription>{t('pengaturan.typographyDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Font Family Selection */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground">
                {t('pengaturan.fontFamily')}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {FONT_OPTIONS.map((font) => {
                  const isSelected = fontFamily === font.id;
                  return (
                    <button
                      key={font.id}
                      type="button"
                      onClick={() => setFontFamily(font.id)}
                      className={cn(
                        'flex flex-col text-left p-3.5 rounded-xl border text-xs transition-all cursor-pointer relative group',
                        isSelected
                          ? 'border-primary bg-primary/5 ring-2 ring-primary/40 shadow-xs'
                          : 'border-border bg-card hover:bg-muted/30 hover:border-border/80'
                      )}
                    >
                      <div className="flex items-center justify-between w-full mb-1.5">
                        <span className="font-semibold text-foreground text-sm tracking-tight">
                          {font.name}
                        </span>
                        {isSelected ? (
                          <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                        ) : (
                          <span className="text-[10px] text-muted-foreground font-mono">
                            {font.weights}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-relaxed flex-1">
                        {font.description}
                      </p>
                      <div className="mt-3 pt-2 border-t border-border/50 flex items-center justify-between text-[10px] text-muted-foreground">
                        <span>{font.designer}</span>
                        {isSelected && (
                          <span className="text-primary font-medium">{t('pengaturan.activeFont')}</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Font Scale Selection */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Sliders className="h-3.5 w-3.5 text-primary" />
                  <span>{t('pengaturan.fontScale')}</span>
                </label>
                <span className="text-[11px] text-muted-foreground font-mono">
                  Active: {SCALE_OPTIONS.find((s) => s.id === fontScale)?.size}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {SCALE_OPTIONS.map((scale) => {
                  const isSelected = fontScale === scale.id;
                  return (
                    <button
                      key={scale.id}
                      type="button"
                      onClick={() => setFontScale(scale.id)}
                      className={cn(
                        'p-2.5 rounded-lg border text-xs font-medium text-center transition-all cursor-pointer',
                        isSelected
                          ? 'border-primary bg-primary/10 text-primary font-semibold ring-1 ring-primary'
                          : 'border-border bg-card text-muted-foreground hover:bg-muted/30'
                      )}
                    >
                      {scale.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Live Typography Specimen & Sharpness Test */}
            <div className="p-4 rounded-xl border border-border/80 bg-muted/20 space-y-3">
              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <span className="text-xs font-semibold text-foreground">
                  {t('pengaturan.typographyPreview')}
                </span>
                <span className="text-[10px] font-mono text-muted-foreground">
                  CSS Subpixel Hinting • Optical Kerning Active
                </span>
              </div>

              <div className="space-y-2">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-foreground tracking-tight">
                    {t('pengaturan.typographyPreviewText')}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    Setiap karakter huruf latin, tanda baca, simbol mata uang, serta angka dirancang presisi dengan ketajaman optis tinggi tanpa efek faux-bold atau blur pada rendering browser.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs">
                  <div className="p-2 rounded-lg bg-card border border-border/60">
                    <span className="text-[10px] text-muted-foreground block uppercase tracking-wider font-medium">Regular (400)</span>
                    <span className="font-normal text-foreground mt-0.5 block">Keluarga Font Asli</span>
                  </div>
                  <div className="p-2 rounded-lg bg-card border border-border/60">
                    <span className="text-[10px] text-muted-foreground block uppercase tracking-wider font-medium">Medium (500)</span>
                    <span className="font-medium text-foreground mt-0.5 block">Interaktif & Tombol</span>
                  </div>
                  <div className="p-2 rounded-lg bg-card border border-border/60">
                    <span className="text-[10px] text-muted-foreground block uppercase tracking-wider font-medium">Semibold (600)</span>
                    <span className="font-semibold text-foreground mt-0.5 block">Judul & Tabel Header</span>
                  </div>
                  <div className="p-2 rounded-lg bg-card border border-border/60">
                    <span className="text-[10px] text-muted-foreground block uppercase tracking-wider font-medium">Bold Tabular (700)</span>
                    <span className="font-bold text-primary tabular-nums mt-0.5 block">Rp 248.500.000</span>
                  </div>
                </div>

                <p className="text-[10px] text-muted-foreground/80 leading-relaxed pt-1">
                  {t('pengaturan.typographyFixNotice')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 4: Showcase Select & Combobox (Full Width) */}
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span>Showcase Komponen Combobox & Async Select (shadcn/ui)</span>
              </CardTitle>
              <span className="text-[10px] bg-primary/10 text-primary font-mono px-2 py-0.5 rounded-full font-semibold">
                Debounce 300ms • Infinite Scroll
              </span>
            </div>
            <CardDescription>
              Komponen input Select modern berbasis Combobox dengan pencarian interaktif, lazy pagination, dan debounce pada API server.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Example 1: Async Indonesia City Select */}
              <div className="space-y-1.5 p-3.5 rounded-xl border border-border/70 bg-card/60">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-primary" />
                    <span>Pilih Kota di Indonesia (API Async)</span>
                  </label>
                  <span className="text-[10px] text-muted-foreground font-mono">
                    99+ Kota & Kabupaten
                  </span>
                </div>
                <Combobox
                  async
                  loadOptions={async ({ search, page, pageSize }) => {
                    const res = await ApiClient.getCities({ search, page, pageSize });
                    return {
                      options: res.data.map((c) => ({
                        label: `${c.name} (${c.type})`,
                        value: c.name,
                        description: c.province,
                        badge: c.type,
                      })),
                      hasMore: page < res.totalPages,
                      total: res.total,
                    };
                  }}
                  value={selectedDemoCity}
                  onChange={(val) => setSelectedDemoCity(val)}
                  placeholder="Pilih kota di Indonesia..."
                  searchPlaceholder="Ketik untuk mencari kota..."
                  clearable
                />
                <div className="flex items-center justify-between pt-1 text-[11px] text-muted-foreground">
                  <span>Pilihan saat ini:</span>
                  <span className="font-semibold text-foreground font-mono">
                    {selectedDemoCity || '(Belum dipilih)'}
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed pt-1">
                  Mendukung server-side debounced search saat mengetik, dan memuat halaman berikutnya secara otomatis saat scroll ke bawah (infinity scroll).
                </p>
              </div>

              {/* Example 2: Synchronous Local Combobox */}
              <div className="space-y-1.5 p-3.5 rounded-xl border border-border/70 bg-card/60">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <Filter className="h-3.5 w-3.5 text-primary" />
                    <span>Pilih Peran Sistem (Sinkron/Lokal)</span>
                  </label>
                  <span className="text-[10px] text-muted-foreground font-mono">
                    Local Instant Search
                  </span>
                </div>
                <Combobox
                  options={[
                    {
                      label: 'Administrator Utama',
                      value: 'admin',
                      description: 'Akses penuh ke semua modul sistem',
                      badge: 'Full Access',
                    },
                    {
                      label: 'Manajer Operasional',
                      value: 'manager',
                      description: 'Kelola alur kerja dan persetujuan staf',
                      badge: 'Manager',
                    },
                    {
                      label: 'Staf Eksekutif',
                      value: 'staff',
                      description: 'Entri transaksi harian dan laporan',
                      badge: 'Staff',
                    },
                    {
                      label: 'Pengguna Biasa',
                      value: 'user',
                      description: 'Akses baca dan profil pribadi',
                      badge: 'User',
                    },
                  ]}
                  value={selectedDemoRole}
                  onChange={(val) => setSelectedDemoRole(val)}
                  placeholder="Pilih peran pengguna..."
                  searchPlaceholder="Cari peran..."
                  clearable
                />
                <div className="flex items-center justify-between pt-1 text-[11px] text-muted-foreground">
                  <span>Pilihan saat ini:</span>
                  <span className="font-semibold text-foreground font-mono">
                    {selectedDemoRole || '(Belum dipilih)'}
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed pt-1">
                  Combobox shadcn dengan input pencarian instan, checkmark visual, badge status, dan deskripsi detail per opsi.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
