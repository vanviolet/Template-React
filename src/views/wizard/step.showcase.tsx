import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Sparkles,
  Layers,
  Check,
  Code2,
  Copy,
  CheckCheck,
  FileText,
  User,
  CreditCard,
  Send,
  ShieldCheck,
  AlertCircle,
  Play,
  RotateCcw,
  BellRing,
  Info,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { Stepper, StepItem } from '@/components/ui/stepper';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ToastCard, showToast } from '@/components/ui/toast';

export function StepShowcase() {
  const { t } = useTranslation();

  const [activeStep, setActiveStep] = useState<number>(1);
  const [orientation, setOrientation] = useState<'vertical' | 'horizontal'>('vertical');
  const [variant, setVariant] = useState<'double-ring' | 'solid' | 'minimal'>('double-ring');
  const [size, setSize] = useState<'sm' | 'default' | 'lg'>('default');
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [clickable, setClickable] = useState<boolean>(true);
  const [hasErrorOnStep3, setHasErrorOnStep3] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [toastCodeCopied, setToastCodeCopied] = useState<boolean>(false);

  const sampleSteps: StepItem[] = [
    {
      id: 'step-1',
      title: 'Informasi Akun',
      subtitle: 'Tahap 1',
      description: 'Lengkapi username & kata sandi',
      icon: User,
    },
    {
      id: 'step-2',
      title: 'Biodata & Identitas',
      subtitle: 'Tahap 2',
      description: 'Isi NIK, nama lengkap & alamat',
      icon: FileText,
    },
    {
      id: 'step-3',
      title: 'Metode Pembayaran',
      subtitle: 'Tahap 3',
      description: 'Pilih virtual account atau e-wallet',
      icon: CreditCard,
      status: hasErrorOnStep3 ? 'error' : undefined,
    },
    {
      id: 'step-4',
      title: 'Verifikasi Keamanan',
      subtitle: 'Tahap 4',
      description: 'Autentikasi dua faktor (2FA)',
      icon: ShieldCheck,
      optional: true,
    },
    {
      id: 'step-5',
      title: 'Aktivasi Layanan',
      subtitle: 'Tahap 5',
      description: 'Konfirmasi dan kirim permohonan',
      icon: Send,
    },
  ];

  const codeString = `<Stepper
  steps={[
    { title: 'Informasi Akun', subtitle: 'Tahap 1', description: 'Username & Sandi', icon: User },
    { title: 'Biodata & Identitas', subtitle: 'Tahap 2', description: 'Data Diri', icon: FileText },
    { title: 'Metode Pembayaran', subtitle: 'Tahap 3', description: 'Pilih Rekening', icon: CreditCard },
    { title: 'Verifikasi Keamanan', subtitle: 'Tahap 4', description: '2FA', optional: true },
    { title: 'Aktivasi Layanan', subtitle: 'Tahap 5', description: 'Konfirmasi Akhir', icon: Send }
  ]}
  currentStep={${activeStep}}
  orientation="${orientation}"
  variant="${variant}"
  size="${size}"
  showLabels={${showLabels}}
  clickable={${clickable}}
  onStepClick={(index) => setActiveStep(index)}
/>`;

  const toastSnippet = `// Reusable Toast Notifications matching toast.jpg design
import { showToast } from '@/components/ui/toast';

showToast.info('Anyone with a link can now view this file.');
showToast.success('Anyone with a link can now view this file.');
showToast.warning('Anyone with a link can now view this file.');
showToast.error('Anyone with a link can now view this file.');`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(codeString);
    setCopied(true);
    showToast.success('Kode komponen stepper berhasil disalin ke clipboard!', {
      title: 'Success',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyToastCode = () => {
    navigator.clipboard.writeText(toastSnippet);
    setToastCodeCopied(true);
    showToast.success('Kode komponen toast berhasil disalin!', {
      title: 'Success',
    });
    setTimeout(() => setToastCodeCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* 1. Interactive Stepper Configuration & Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Configuration Controls */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Layers className="h-4 w-4 text-primary shrink-0" />
                <span>Pengaturan Component Stepper</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Ubah parameter di bawah ini untuk melihat adaptasi tampilan secara realtime.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              {/* Orientation */}
              <div className="space-y-1.5">
                <label className="font-semibold text-foreground block">Orientasi</label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant={orientation === 'vertical' ? 'default' : 'outline'}
                    onClick={() => setOrientation('vertical')}
                    className="w-full text-xs px-2 truncate cursor-pointer"
                  >
                    Vertical
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={orientation === 'horizontal' ? 'default' : 'outline'}
                    onClick={() => setOrientation('horizontal')}
                    className="w-full text-xs px-2 truncate cursor-pointer"
                  >
                    Horizontal
                  </Button>
                </div>
              </div>

              {/* Variant */}
              <div className="space-y-1.5">
                <label className="font-semibold text-foreground block">Gaya Cincin (Variant)</label>
                <div className="grid grid-cols-3 gap-1.5">
                  <Button
                    type="button"
                    size="sm"
                    variant={variant === 'double-ring' ? 'default' : 'outline'}
                    className="text-[11px] px-1 truncate cursor-pointer"
                    onClick={() => setVariant('double-ring')}
                  >
                    Double
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={variant === 'solid' ? 'default' : 'outline'}
                    className="text-[11px] px-1 truncate cursor-pointer"
                    onClick={() => setVariant('solid')}
                  >
                    Solid
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={variant === 'minimal' ? 'default' : 'outline'}
                    className="text-[11px] px-1 truncate cursor-pointer"
                    onClick={() => setVariant('minimal')}
                  >
                    Minimal
                  </Button>
                </div>
              </div>

              {/* Size */}
              <div className="space-y-1.5">
                <label className="font-semibold text-foreground block">Ukuran (Size)</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['sm', 'default', 'lg'] as const).map((s) => (
                    <Button
                      key={s}
                      type="button"
                      size="sm"
                      variant={size === s ? 'default' : 'outline'}
                      className="text-xs uppercase cursor-pointer"
                      onClick={() => setSize(s)}
                    >
                      {s === 'default' ? 'MD' : s}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-2.5 pt-2 border-t border-border">
                <label className="flex items-center justify-between cursor-pointer text-xs">
                  <span className="font-semibold text-foreground">Tampilkan Label</span>
                  <input
                    type="checkbox"
                    checked={showLabels}
                    onChange={(e) => setShowLabels(e.target.checked)}
                    className="h-4 w-4 rounded border-input text-primary focus:ring-primary cursor-pointer shrink-0"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer text-xs">
                  <span className="font-semibold text-foreground">Interaktif / Klik Node</span>
                  <input
                    type="checkbox"
                    checked={clickable}
                    onChange={(e) => setClickable(e.target.checked)}
                    className="h-4 w-4 rounded border-input text-primary focus:ring-primary cursor-pointer shrink-0"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer text-xs">
                  <span className="font-semibold text-foreground">Simulasi Error (Step 3)</span>
                  <input
                    type="checkbox"
                    checked={hasErrorOnStep3}
                    onChange={(e) => setHasErrorOnStep3(e.target.checked)}
                    className="h-4 w-4 rounded border-input text-destructive focus:ring-destructive cursor-pointer shrink-0"
                  />
                </label>
              </div>

              {/* Step Navigation Slider / Buttons */}
              <div className="space-y-2 pt-2 border-t border-border">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-foreground">Langkah Aktif</span>
                  <Badge variant="secondary" className="font-mono text-[10px]">
                    Step {activeStep + 1} / {sampleSteps.length}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={activeStep <= 0}
                    onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
                    className="flex-1 cursor-pointer text-xs"
                  >
                    Prev
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="default"
                    disabled={activeStep >= sampleSteps.length - 1}
                    onClick={() => setActiveStep((prev) => Math.min(sampleSteps.length - 1, prev + 1))}
                    className="flex-1 cursor-pointer text-xs"
                  >
                    Next
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => setActiveStep(0)}
                    title="Reset to step 1"
                    className="cursor-pointer"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Live Component Canvas */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-4">
          <Card className="min-h-[380px] flex flex-col justify-between">
            <CardHeader className="border-b border-border pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-bold">Live Preview Canvas</CardTitle>
                  <CardDescription className="text-xs">
                    Komponen bereaksi langsung terhadap prop dan event klik.
                  </CardDescription>
                </div>
                <Badge variant="outline" className="text-primary border-primary/30 text-xs">
                  {orientation === 'vertical' ? 'Vertical Rail' : 'Horizontal Bar'}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="p-4 sm:p-8 flex items-center justify-center min-h-[260px]">
              <div
                className={
                  orientation === 'vertical'
                    ? 'w-full max-w-sm py-2'
                    : 'w-full max-w-xl py-4'
                }
              >
                <Stepper
                  steps={sampleSteps}
                  currentStep={activeStep}
                  orientation={orientation}
                  variant={variant}
                  size={size}
                  showLabels={showLabels}
                  clickable={clickable}
                  onStepClick={(index) => setActiveStep(index)}
                />
              </div>
            </CardContent>

            <div className="p-3 sm:p-4 bg-muted/20 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
              <span>Klik lingkaran step untuk berpindah tahapan.</span>
              <span className="font-mono text-[11px] capitalize">{orientation} mode</span>
            </div>
          </Card>

          {/* Copyable Code Snippet */}
          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <Code2 className="h-4 w-4 text-primary shrink-0" />
                <CardTitle className="text-xs font-mono">Kode Integrasi Stepper</CardTitle>
              </div>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={handleCopyCode}
                className="h-7 text-xs cursor-pointer"
              >
                {copied ? (
                  <>
                    <CheckCheck className="h-3 w-3 mr-1 text-emerald-500" />
                    Tersalin
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3 mr-1" />
                    Salin Kode
                  </>
                )}
              </Button>
            </CardHeader>
            <CardContent>
              <pre className="p-3 rounded-lg bg-muted text-[11px] font-mono overflow-x-auto text-foreground border border-border">
                {codeString}
              </pre>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 2. Toast Component Showcase (Matching user image toast.jpg!) */}
      <div className="space-y-4 pt-4 border-t border-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <BellRing className="h-4 w-4 text-primary shrink-0" />
              <h3 className="text-base font-bold text-foreground">
                Tampilan Toast Component (Sesuai Referensi Gambar)
              </h3>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Desain kartu modern dengan efek soft glow gradient, ikon squircle, dan tombol close di sudut kanan atas.
            </p>
          </div>

          {/* Trigger live notification buttons (responsive 2-col or flex) */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                showToast.info('Anyone with a link can now view this file.', {
                  title: 'Information',
                })
              }
              className="text-xs text-sky-600 border-sky-200 hover:bg-sky-50 dark:border-sky-900 dark:hover:bg-sky-950/50 cursor-pointer justify-center"
            >
              <Info className="h-3.5 w-3.5 mr-1 text-sky-500 shrink-0" />
              <span>Test Info</span>
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                showToast.success('Anyone with a link can now view this file.', {
                  title: 'Success',
                })
              }
              className="text-xs text-emerald-600 border-emerald-200 hover:bg-emerald-50 dark:border-emerald-900 dark:hover:bg-emerald-950/50 cursor-pointer justify-center"
            >
              <CheckCircle2 className="h-3.5 w-3.5 mr-1 text-emerald-500 shrink-0" />
              <span>Test Success</span>
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                showToast.warning('Anyone with a link can now view this file.', {
                  title: 'Warning',
                })
              }
              className="text-xs text-amber-600 border-amber-200 hover:bg-amber-50 dark:border-amber-900 dark:hover:bg-amber-950/50 cursor-pointer justify-center"
            >
              <AlertTriangle className="h-3.5 w-3.5 mr-1 text-amber-500 shrink-0" />
              <span>Test Warning</span>
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                showToast.error('Anyone with a link can now view this file.', {
                  title: 'Error',
                })
              }
              className="text-xs text-rose-600 border-rose-200 hover:bg-rose-50 dark:border-rose-900 dark:hover:bg-rose-950/50 cursor-pointer justify-center"
            >
              <AlertCircle className="h-3.5 w-3.5 mr-1 text-rose-500 shrink-0" />
              <span>Test Error</span>
            </Button>
          </div>
        </div>

        {/* 4 Cards Grid - Replicating toast.jpg visually in canvas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 sm:p-6 rounded-2xl bg-muted/20 border border-border">
          {/* Card 1: Information */}
          <ToastCard
            type="info"
            title="Information"
            description="Anyone with a link can now view this file."
            onDismiss={() =>
              showToast.info('Contoh trigger toast information', { title: 'Information' })
            }
          />

          {/* Card 2: Success */}
          <ToastCard
            type="success"
            title="Success"
            description="Anyone with a link can now view this file."
            onDismiss={() =>
              showToast.success('Contoh trigger toast success', { title: 'Success' })
            }
          />

          {/* Card 3: Warning */}
          <ToastCard
            type="warning"
            title="Warning"
            description="Anyone with a link can now view this file."
            onDismiss={() =>
              showToast.warning('Contoh trigger toast warning', { title: 'Warning' })
            }
          />

          {/* Card 4: Error */}
          <ToastCard
            type="error"
            title="Error"
            description="Anyone with a link can now view this file."
            onDismiss={() =>
              showToast.error('Contoh trigger toast error', { title: 'Error' })
            }
          />
        </div>

        {/* Toast Code Integration */}
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Code2 className="h-4 w-4 text-primary shrink-0" />
              <CardTitle className="text-xs font-mono">Kode Penggunaan Toast</CardTitle>
            </div>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleCopyToastCode}
              className="h-7 text-xs cursor-pointer"
            >
              {toastCodeCopied ? (
                <>
                  <CheckCheck className="h-3 w-3 mr-1 text-emerald-500" />
                  Tersalin
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3 mr-1" />
                  Salin Kode
                </>
              )}
            </Button>
          </CardHeader>
          <CardContent>
            <pre className="p-3 rounded-lg bg-muted text-[11px] font-mono overflow-x-auto text-foreground border border-border">
              {toastSnippet}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
