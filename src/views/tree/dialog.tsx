import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
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
import { Combobox } from '@/components/ui/combobox';
import {
  GraduationCap,
  Clock,
  SlidersHorizontal,
  Users,
  FileSpreadsheet,
  Sliders,
  AlertCircle,
  Trash2,
  Check,
  Plus,
} from 'lucide-react';
import {
  MASTER_PRODI_LIST,
  MASTER_SHIFT_LIST,
  MASTER_JALUR_LIST,
  MASTER_JENIS_LIST,
  MASTER_BERKAS_LIST,
} from '@/services/pmb.api.dummy';

/* =========================================================================
   1. MODAL BATCH KUOTA
   ========================================================================= */

interface BatchKuotaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  targetProdiId: string | null;
  targetProdiName: string;
  onApply: (prodiId: string | null, kuotaN: number, kuotaD: number) => void;
}

export function BatchKuotaModal({
  open,
  onOpenChange,
  targetProdiId,
  targetProdiName,
  onApply,
}: BatchKuotaModalProps) {
  const { t } = useTranslation();
  const [kuotaN, setKuotaN] = useState<number>(50);
  const [kuotaD, setKuotaD] = useState<number>(10);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApply(targetProdiId, kuotaN, kuotaD);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <Sliders className="h-5 w-5 text-primary" />
              <span>{t('tree.batchQuotaTitle', 'Pengaturan Batch Kuota Shift Perkuliahan')}</span>
            </DialogTitle>
            <DialogDescription className="text-xs">
              {targetProdiId === null
                ? 'Terapkan kuota pendaftar Non-Disabilitas & Disabilitas secara serentak ke seluruh program studi.'
                : `Terapkan kuota pendaftar untuk seluruh shift pada program studi ${targetProdiName}.`}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Kuota Reguler / Non-Disabilitas (N)
                </label>
                <Input
                  type="number"
                  min="0"
                  value={kuotaN}
                  onChange={(e) => setKuotaN(Number(e.target.value))}
                  className="h-8 text-xs font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Kuota Inklusif / Disabilitas (D)
                </label>
                <Input
                  type="number"
                  min="0"
                  value={kuotaD}
                  onChange={(e) => setKuotaD(Number(e.target.value))}
                  className="h-8 text-xs font-mono"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="text-xs cursor-pointer"
            >
              {t('common.cancel', 'Batal')}
            </Button>
            <Button
              type="submit"
              size="sm"
              className="text-xs bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer"
            >
              <Check className="h-3.5 w-3.5 mr-1" />
              <span>{t('tree.applyBatch', 'Terapkan Batch Kuota')}</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* =========================================================================
   2. MODAL TAMBAH PRODI
   ========================================================================= */

interface AddProdiDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingProdiIds: string[];
  onAdd: (prodiId: string) => void;
}

export function AddProdiDialog({
  open,
  onOpenChange,
  existingProdiIds,
  onAdd,
}: AddProdiDialogProps) {
  const { t } = useTranslation();
  const [selectedProdi, setSelectedProdi] = useState('');

  const existingSet = new Set(existingProdiIds);
  const options = MASTER_PRODI_LIST.filter((p) => !existingSet.has(p.id)).map((p) => ({
    label: `${p.nama} (${p.kode}) - ${p.fakultas}`,
    value: p.id,
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProdi) return;
    onAdd(selectedProdi);
    setSelectedProdi('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <GraduationCap className="h-5 w-5 text-primary" />
              <span>{t('tree.addProdiTitle', 'Tambah Program Studi ke Gelombang')}</span>
            </DialogTitle>
            <DialogDescription className="text-xs">
              Pilih program studi dari Master API untuk ditambahkan ke konfigurasi gelombang ini.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-3 text-xs">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Pilih Program Studi (Master API) *
              </label>
              {options.length === 0 ? (
                <div className="p-3 rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 text-xs flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>Semua Program Studi dari Master API sudah terdaftar di gelombang ini!</span>
                </div>
              ) : (
                <Combobox
                  options={options}
                  value={selectedProdi}
                  onChange={(val) => setSelectedProdi(val)}
                  placeholder="Pilih program studi..."
                />
              )}
            </div>

            <div className="p-3 rounded-lg bg-muted/60 text-muted-foreground text-[11px] leading-relaxed">
              Program studi yang ditambahkan otomatis akan dibuatkan shift perkuliahan default dengan kuota 0.
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="text-xs cursor-pointer"
            >
              {t('common.cancel', 'Batal')}
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={!selectedProdi}
              className="text-xs bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              <span>Tambah ke Gelombang</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* =========================================================================
   3. MODAL TAMBAH SHIFT KE PRODI
   ========================================================================= */

interface AddShiftDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prodiId: string;
  prodiName: string;
  existingShiftIds: number[];
  onAdd: (shiftId: number, kuotaN: number, kuotaD: number) => void;
}

export function AddShiftDialog({
  open,
  onOpenChange,
  prodiName,
  existingShiftIds,
  onAdd,
}: AddShiftDialogProps) {
  const { t } = useTranslation();
  const [selectedShift, setSelectedShift] = useState('');
  const [kuotaN, setKuotaN] = useState<number>(30);
  const [kuotaD, setKuotaD] = useState<number>(5);

  const existingSet = new Set(existingShiftIds);
  const options = MASTER_SHIFT_LIST.filter((s) => !existingSet.has(s.id)).map((s) => ({
    label: `${s.nama} (${s.jam})`,
    value: String(s.id),
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedShift) return;
    onAdd(Number(selectedShift), kuotaN, kuotaD);
    setSelectedShift('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <Clock className="h-5 w-5 text-emerald-500" />
              <span>Tambah Shift Perkuliahan</span>
            </DialogTitle>
            <DialogDescription className="text-xs">
              Tambahkan pilihan waktu kuliah untuk program studi &quot;{prodiName}&quot;.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-3 text-xs">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Pilih Shift Perkuliahan (Master API) *
              </label>
              {options.length === 0 ? (
                <div className="p-3 rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 text-xs flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>Semua shift Master API sudah terdaftar untuk program studi ini!</span>
                </div>
              ) : (
                <Combobox
                  options={options}
                  value={selectedShift}
                  onChange={(val) => setSelectedShift(val)}
                  placeholder="Pilih shift..."
                />
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Kuota Non-Disabilitas (N)
                </label>
                <Input
                  type="number"
                  min="0"
                  value={kuotaN}
                  onChange={(e) => setKuotaN(Number(e.target.value))}
                  className="h-8 text-xs font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Kuota Disabilitas (D)
                </label>
                <Input
                  type="number"
                  min="0"
                  value={kuotaD}
                  onChange={(e) => setKuotaD(Number(e.target.value))}
                  className="h-8 text-xs font-mono"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="text-xs cursor-pointer"
            >
              {t('common.cancel', 'Batal')}
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={!selectedShift}
              className="text-xs bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer"
            >
              <Check className="h-3.5 w-3.5 mr-1" />
              <span>Simpan Shift</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* =========================================================================
   4. MODAL EDIT KUOTA SHIFT (SINGLE)
   ========================================================================= */

interface EditKuotaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shiftData: {
    prodiId: string;
    shiftId: number;
    currentN: number;
    currentD: number;
  } | null;
  onSave: (prodiId: string, shiftId: number, newN: number, newD: number) => void;
}

export function EditKuotaDialog({
  open,
  onOpenChange,
  shiftData,
  onSave,
}: EditKuotaDialogProps) {
  const { t } = useTranslation();
  const [kuotaN, setKuotaN] = useState<number>(0);
  const [kuotaD, setKuotaD] = useState<number>(0);

  useEffect(() => {
    if (shiftData) {
      setKuotaN(shiftData.currentN);
      setKuotaD(shiftData.currentD);
    }
  }, [shiftData, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shiftData) return;
    onSave(shiftData.prodiId, shiftData.shiftId, kuotaN, kuotaD);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <Clock className="h-5 w-5 text-emerald-500" />
              <span>Ubah Kuota Penerimaan Shift</span>
            </DialogTitle>
            <DialogDescription className="text-xs">
              Sesuaikan kuota pendaftar reguler dan disabilitas untuk shift ini.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Kuota Reguler / Non-D (N)
                </label>
                <Input
                  type="number"
                  min="0"
                  value={kuotaN}
                  onChange={(e) => setKuotaN(Number(e.target.value))}
                  className="h-8 text-xs font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Kuota Disabilitas (D)
                </label>
                <Input
                  type="number"
                  min="0"
                  value={kuotaD}
                  onChange={(e) => setKuotaD(Number(e.target.value))}
                  className="h-8 text-xs font-mono"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="text-xs cursor-pointer"
            >
              {t('common.cancel', 'Batal')}
            </Button>
            <Button
              type="submit"
              size="sm"
              className="text-xs bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer"
            >
              <Check className="h-3.5 w-3.5 mr-1" />
              <span>Simpan Perubahan</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* =========================================================================
   5. MODAL TAMBAH JALUR
   ========================================================================= */

interface AddJalurDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingJalurIds: number[];
  onAdd: (jalurId: number) => void;
}

export function AddJalurDialog({
  open,
  onOpenChange,
  existingJalurIds,
  onAdd,
}: AddJalurDialogProps) {
  const { t } = useTranslation();
  const [selectedJalur, setSelectedJalur] = useState('');

  const existingSet = new Set(existingJalurIds);
  const options = MASTER_JALUR_LIST.filter((j) => !existingSet.has(j.id)).map((j) => ({
    label: `${j.nama}`,
    value: String(j.id),
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJalur) return;
    onAdd(Number(selectedJalur));
    setSelectedJalur('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <SlidersHorizontal className="h-5 w-5 text-emerald-500" />
              <span>{t('tree.addJalurTitle', 'Tambah Jalur Pendaftaran')}</span>
            </DialogTitle>
            <DialogDescription className="text-xs">
              Pilih jalur seleksi penerimaan dari Master API. Status awal akan aktif otomatis.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-3 text-xs">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Pilih Jalur Pendaftaran *
              </label>
              {options.length === 0 ? (
                <div className="p-3 rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 text-xs flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>Semua Jalur dari Master API sudah terdaftar pada gelombang ini!</span>
                </div>
              ) : (
                <Combobox
                  options={options}
                  value={selectedJalur}
                  onChange={(val) => setSelectedJalur(val)}
                  placeholder="Pilih jalur..."
                />
              )}
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="text-xs cursor-pointer"
            >
              {t('common.cancel', 'Batal')}
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={!selectedJalur}
              className="text-xs bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              <span>Tambah Jalur</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* =========================================================================
   6. MODAL TAMBAH JENIS
   ========================================================================= */

interface AddJenisDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingJenisIds: number[];
  onAdd: (jenisId: number) => void;
}

export function AddJenisDialog({
  open,
  onOpenChange,
  existingJenisIds,
  onAdd,
}: AddJenisDialogProps) {
  const { t } = useTranslation();
  const [selectedJenis, setSelectedJenis] = useState('');

  const existingSet = new Set(existingJenisIds);
  const options = MASTER_JENIS_LIST.filter((j) => !existingSet.has(j.id)).map((j) => ({
    label: `${j.nama}`,
    value: String(j.id),
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJenis) return;
    onAdd(Number(selectedJenis));
    setSelectedJenis('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <Users className="h-5 w-5 text-purple-500" />
              <span>{t('tree.addJenisTitle', 'Tambah Jenis Pendaftaran')}</span>
            </DialogTitle>
            <DialogDescription className="text-xs">
              Pilih kategori calon mahasiswa dari Master API.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-3 text-xs">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Pilih Jenis Pendaftaran *
              </label>
              {options.length === 0 ? (
                <div className="p-3 rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 text-xs flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>Semua Jenis Pendaftaran dari Master API sudah terdaftar!</span>
                </div>
              ) : (
                <Combobox
                  options={options}
                  value={selectedJenis}
                  onChange={(val) => setSelectedJenis(val)}
                  placeholder="Pilih jenis..."
                />
              )}
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="text-xs cursor-pointer"
            >
              {t('common.cancel', 'Batal')}
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={!selectedJenis}
              className="text-xs bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              <span>Tambah Jenis</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* =========================================================================
   7. MODAL TAMBAH DOKUMEN BERKAS
   ========================================================================= */

interface AddDokumenDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingDocIds: string[];
  onAdd: (
    docId: string,
    kategori: 'untuk_cmaba_n_dan_d' | 'untuk_cmaba_non_disabilitas' | 'untuk_cmaba_disabilitas'
  ) => void;
}

export function AddDokumenDialog({
  open,
  onOpenChange,
  existingDocIds,
  onAdd,
}: AddDokumenDialogProps) {
  const { t } = useTranslation();
  const [selectedDoc, setSelectedDoc] = useState('');
  const [kategori, setKategori] = useState<
    'untuk_cmaba_n_dan_d' | 'untuk_cmaba_non_disabilitas' | 'untuk_cmaba_disabilitas'
  >('untuk_cmaba_n_dan_d');

  const existingSet = new Set(existingDocIds);
  const options = MASTER_BERKAS_LIST.filter((b) => !existingSet.has(b.id)).map((b) => ({
    label: `${b.nama} (${b.kategori})`,
    value: b.id,
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoc) return;
    onAdd(selectedDoc, kategori);
    setSelectedDoc('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <FileSpreadsheet className="h-5 w-5 text-rose-500" />
              <span>{t('tree.addDokumenTitle', 'Tambah Dokumen Berkas Pendaftaran')}</span>
            </DialogTitle>
            <DialogDescription className="text-xs">
              Pilih berkas persyaratan dari Master API dan tetapkan kategori aturannya.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-3 text-xs">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Pilih Dokumen Berkas *
              </label>
              {options.length === 0 ? (
                <div className="p-3 rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 text-xs flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>Semua Dokumen Berkas dari Master API sudah terdaftar!</span>
                </div>
              ) : (
                <Combobox
                  options={options}
                  value={selectedDoc}
                  onChange={(val) => setSelectedDoc(val)}
                  placeholder="Pilih berkas..."
                />
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Kategori Penempatan Berkas
              </label>
              <select
                value={kategori}
                onChange={(e) =>
                  setKategori(
                    e.target.value as
                      | 'untuk_cmaba_n_dan_d'
                      | 'untuk_cmaba_non_disabilitas'
                      | 'untuk_cmaba_disabilitas'
                  )
                }
                className="w-full h-9 rounded-xl border border-input bg-background px-3 py-1 text-xs shadow-2xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="untuk_cmaba_n_dan_d">Umum (Non-Disabilitas & Disabilitas)</option>
                <option value="untuk_cmaba_non_disabilitas">Khusus CMABA Non-Disabilitas</option>
                <option value="untuk_cmaba_disabilitas">Khusus CMABA Disabilitas (Inklusif)</option>
              </select>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="text-xs cursor-pointer"
            >
              {t('common.cancel', 'Batal')}
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={!selectedDoc}
              className="text-xs bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              <span>Simpan Dokumen</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* =========================================================================
   8. UNIFIED CONFIRMATION MODAL
   ========================================================================= */

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  actionLabel?: string;
  actionVariant?: 'default' | 'destructive';
  onConfirm: () => void;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  actionLabel = 'Ya, Lanjutkan',
  actionVariant = 'default',
  onConfirm,
}: ConfirmDialogProps) {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            {actionVariant === 'destructive' ? (
              <Trash2 className="h-5 w-5 text-destructive" />
            ) : (
              <AlertCircle className="h-5 w-5 text-primary" />
            )}
            <span>{title}</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground leading-relaxed pt-1">
            {description}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:gap-0 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-xs cursor-pointer"
          >
            {t('common.cancel', 'Batal')}
          </Button>
          <Button
            size="sm"
            variant={actionVariant}
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
            className="text-xs cursor-pointer"
          >
            {actionLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
