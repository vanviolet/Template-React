import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  TreeRoot,
  TreeHeader,
  TreeContent,
  TreeFooter,
  GenericTreeNode,
} from '@/components/ui/tree.view';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Combobox } from '@/components/ui/combobox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  GraduationCap,
  Layers,
  Clock,
  Users,
  FileCheck2,
  FileSpreadsheet,
  FileText,
  Plus,
  FolderTree,
  ShieldCheck,
  CheckCircle2,
  Info,
  SlidersHorizontal,
  RefreshCw,
  Trash2,
  AlertCircle,
  Check,
  X,
  Link as LinkIcon,
  ToggleLeft,
  ToggleRight,
  Globe,
  Sliders,
  CheckSquare,
  XSquare,
  Square,
  Power,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { toast } from '@/components/ui/toast';

import {
  MASTER_PRODI_LIST,
  MASTER_SHIFT_LIST,
  MASTER_JALUR_LIST,
  MASTER_JENIS_LIST,
  MASTER_BERKAS_LIST,
  MASTER_GELOMBANG_LIST,
  MasterProdi,
  MasterShift,
  MasterJalur,
  MasterJenis,
  MasterBerkas,
} from '@/services/pmb.api.dummy';

/* =========================================================================
   Types Konfigurasi Gelombang Pendaftaran Sesuai Spesifikasi JSON
   ========================================================================= */

export interface KuotaShiftItem {
  id_pilihan_shift: number;
  nama_shift?: string;
  jumlah_pendaftar_mahasiswa_n: number; // Non-disabilitas
  jumlah_pendaftar_mahasiswa_d: number; // Disabilitas
}

export interface ProdiItem {
  id: string;
  nama_prodi?: string;
  kode?: string;
  kuota_shift: KuotaShiftItem[];
}

export interface PilihanJenisPendaftaranItem {
  id: number;
  nama_jenis?: string;
  untuk_cmaba_non_disabilitas: boolean;
  untuk_cmaba_disabilitas: boolean;
}

export interface PilihanJalurPendaftaranItem {
  id: number;
  nama_jalur?: string;
  untuk_cmaba_non_disabilitas: boolean;
  untuk_cmaba_disabilitas: boolean;
}

export interface BerkasRuleItem {
  id_berkas_pendaftaran: string;
  nama_berkas?: string;
  wajib_untuk_wni: boolean;
  wajib_untuk_wna: boolean;
  untuk_jenis_pendaftaran: number[];
  untuk_jalur_pendaftaran: number[];
  untuk_pilihan_shift_pendaftaran: number[];
}

export interface GelombangPendaftaranConfig {
  id_gelombang: string;
  gelombang_nama: string;
  tahun_akademik: string;
  semester: string;
  prodi: ProdiItem[];
  pilihan_jenis_pendaftaran: PilihanJenisPendaftaranItem[];
  pilihan_jalur_pendaftaran: PilihanJalurPendaftaranItem[];
  berkas_wajib: {
    untuk_cmaba_n_dan_d: BerkasRuleItem[];
    untuk_cmaba_non_disabilitas: BerkasRuleItem[];
    untuk_cmaba_disabilitas: BerkasRuleItem[];
  };
}

// Data awal: Kuota default 0, Akses default Disable, Relasi default Kosong
const INITIAL_CONFIG: GelombangPendaftaranConfig = {
  id_gelombang: 'gel-1-2026-genap',
  gelombang_nama: 'Gelombang 1 2026 Genap',
  tahun_akademik: '2026',
  semester: 'Genap',
  prodi: [
    {
      id: 'ti-s1',
      nama_prodi: 'S1 Teknik Informatika',
      kode: 'TI-01',
      kuota_shift: [
        {
          id_pilihan_shift: 1,
          nama_shift: 'Reguler Pagi (Shift 1)',
          jumlah_pendaftar_mahasiswa_n: 0,
          jumlah_pendaftar_mahasiswa_d: 0,
        },
        {
          id_pilihan_shift: 2,
          nama_shift: 'Reguler Malam (Shift 2)',
          jumlah_pendaftar_mahasiswa_n: 0,
          jumlah_pendaftar_mahasiswa_d: 0,
        },
      ],
    },
    {
      id: 'si-s1',
      nama_prodi: 'S1 Sistem Informasi',
      kode: 'SI-02',
      kuota_shift: [
        {
          id_pilihan_shift: 1,
          nama_shift: 'Reguler Pagi (Shift 1)',
          jumlah_pendaftar_mahasiswa_n: 0,
          jumlah_pendaftar_mahasiswa_d: 0,
        },
      ],
    },
  ],
  pilihan_jenis_pendaftaran: [
    {
      id: 1,
      nama_jenis: 'Mahasiswa Baru Reguler',
      untuk_cmaba_non_disabilitas: false,
      untuk_cmaba_disabilitas: false,
    },
    {
      id: 2,
      nama_jenis: 'Pindahan / Transfer Kredit Antar Kampus',
      untuk_cmaba_non_disabilitas: false,
      untuk_cmaba_disabilitas: false,
    },
  ],
  pilihan_jalur_pendaftaran: [
    {
      id: 101,
      nama_jalur: 'Jalur Prestasi Akademik (SNBP / Rapor)',
      untuk_cmaba_non_disabilitas: false,
      untuk_cmaba_disabilitas: false,
    },
    {
      id: 102,
      nama_jalur: 'Jalur Beasiswa KIP Kuliah & Kemitraan',
      untuk_cmaba_non_disabilitas: false,
      untuk_cmaba_disabilitas: false,
    },
    {
      id: 104,
      nama_jalur: 'Jalur Afirmasi Khusus Disabilitas',
      untuk_cmaba_non_disabilitas: false,
      untuk_cmaba_disabilitas: false,
    },
  ],
  berkas_wajib: {
    untuk_cmaba_n_dan_d: [
      {
        id_berkas_pendaftaran: 'doc-ktp',
        nama_berkas: 'Kartu Tanda Penduduk (KTP) / Paspor',
        wajib_untuk_wni: false,
        wajib_untuk_wna: false,
        untuk_jenis_pendaftaran: [],
        untuk_jalur_pendaftaran: [],
        untuk_pilihan_shift_pendaftaran: [],
      },
      {
        id_berkas_pendaftaran: 'doc-ijazah',
        nama_berkas: 'Ijazah / SKL Legalisir',
        wajib_untuk_wni: false,
        wajib_untuk_wna: false,
        untuk_jenis_pendaftaran: [],
        untuk_jalur_pendaftaran: [],
        untuk_pilihan_shift_pendaftaran: [],
      },
    ],
    untuk_cmaba_non_disabilitas: [
      {
        id_berkas_pendaftaran: 'doc-sehat',
        nama_berkas: 'Surat Keterangan Sehat Bebas Narkoba',
        wajib_untuk_wni: false,
        wajib_untuk_wna: false,
        untuk_jenis_pendaftaran: [],
        untuk_jalur_pendaftaran: [],
        untuk_pilihan_shift_pendaftaran: [],
      },
    ],
    untuk_cmaba_disabilitas: [
      {
        id_berkas_pendaftaran: 'doc-disabilitas',
        nama_berkas: 'Surat Asesmen Dokter Spesialis Disabilitas',
        wajib_untuk_wni: false,
        wajib_untuk_wna: false,
        untuk_jenis_pendaftaran: [],
        untuk_jalur_pendaftaran: [],
        untuk_pilihan_shift_pendaftaran: [],
      },
    ],
  },
};

// Safe stringifier for Inspector
function safeStringify(data: any): string {
  try {
    const seen = new WeakSet();
    return JSON.stringify(
      data,
      (key, value) => {
        if (typeof value === 'object' && value !== null) {
          if (seen.has(value)) return '[Circular]';
          if (value.$$typeof) return '[ReactElement]';
          seen.add(value);
        }
        return value;
      },
      2
    );
  } catch (err) {
    return String(data);
  }
}

export default function TreeViewPage() {
  const { t } = useTranslation();

  // Selected Gelombang
  const [selectedGelombangId, setSelectedGelombangId] = useState<string>('gel-1-2026-genap');

  // Master configuration state
  const [config, setConfig] = useState<GelombangPendaftaranConfig>(INITIAL_CONFIG);

  // Inspector / Selected node state
  const [selectedNode, setSelectedNode] = useState<GenericTreeNode | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Dialog State: Confirmation Modal for all Generates & Deletes
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    description: string;
    actionLabel: string;
    actionVariant?: 'default' | 'destructive';
    onConfirm: () => void;
  }>({
    open: false,
    title: '',
    description: '',
    actionLabel: t('tree.confirmYes'),
    actionVariant: 'default',
    onConfirm: () => {},
  });

  const openConfirmation = (
    title: string,
    description: string,
    onConfirm: () => void,
    actionLabel = t('tree.confirmYes'),
    actionVariant: 'default' | 'destructive' = 'default'
  ) => {
    setConfirmDialog({
      open: true,
      title,
      description,
      actionLabel,
      actionVariant,
      onConfirm: () => {
        onConfirm();
        setConfirmDialog((prev) => ({ ...prev, open: false }));
      },
    });
  };

  // Dialog State: Batch Kuota Modal (Global atau per-Prodi)
  const [batchKuotaModal, setBatchKuotaModal] = useState<{
    open: boolean;
    prodiId: string | null;
    prodiName: string;
    kuotaN: number;
    kuotaD: number;
  }>({
    open: false,
    prodiId: null,
    prodiName: '',
    kuotaN: 50,
    kuotaD: 10,
  });

  // Dialog State: Tambah Prodi
  const [openAddProdiDialog, setOpenAddProdiDialog] = useState(false);
  const [selectedProdiToAdd, setSelectedProdiToAdd] = useState<string>('');

  // Dialog State: Tambah Shift ke Prodi
  const [openAddShiftDialog, setOpenAddShiftDialog] = useState(false);
  const [targetProdiForShift, setTargetProdiForShift] = useState<string>('');
  const [selectedShiftToAdd, setSelectedShiftToAdd] = useState<string>('');
  const [kuotaN, setKuotaN] = useState<number>(0);
  const [kuotaD, setKuotaD] = useState<number>(0);

  // Dialog State: Tambah Jalur
  const [openAddJalurDialog, setOpenAddJalurDialog] = useState(false);
  const [selectedJalurToAdd, setSelectedJalurToAdd] = useState<string>('');

  // Dialog State: Tambah Jenis
  const [openAddJenisDialog, setOpenAddJenisDialog] = useState(false);
  const [selectedJenisToAdd, setSelectedJenisToAdd] = useState<string>('');

  // Dialog State: Tambah Dokumen Berkas
  const [openAddDokumenDialog, setOpenAddDokumenDialog] = useState(false);
  const [selectedDokumenToAdd, setSelectedDokumenToAdd] = useState<string>('');
  const [targetKategoriDoc, setTargetKategoriDoc] = useState<
    'untuk_cmaba_n_dan_d' | 'untuk_cmaba_non_disabilitas' | 'untuk_cmaba_disabilitas'
  >('untuk_cmaba_n_dan_d');

  /* =========================================================================
     MASTER LIST TERDAFTAR DI GELOMBANG INI
     ========================================================================= */

  const registeredShiftsInGelombang = useMemo(() => {
    const shiftMap = new Map<number, string>();
    for (const p of config.prodi) {
      for (const s of p.kuota_shift) {
        if (!shiftMap.has(s.id_pilihan_shift)) {
          const shiftMaster = MASTER_SHIFT_LIST.find((m) => m.id === s.id_pilihan_shift);
          shiftMap.set(
            s.id_pilihan_shift,
            s.nama_shift || shiftMaster?.nama || `Shift ${s.id_pilihan_shift}`
          );
        }
      }
    }
    return Array.from(shiftMap.entries()).map(([id, nama]) => ({ id, nama }));
  }, [config.prodi]);

  const registeredJalurInGelombang = useMemo(() => {
    return config.pilihan_jalur_pendaftaran.map((j) => {
      const master = MASTER_JALUR_LIST.find((m) => m.id === j.id);
      return { id: j.id, nama: j.nama_jalur || master?.nama || `Jalur ${j.id}` };
    });
  }, [config.pilihan_jalur_pendaftaran]);

  const registeredJenisInGelombang = useMemo(() => {
    return config.pilihan_jenis_pendaftaran.map((j) => {
      const master = MASTER_JENIS_LIST.find((m) => m.id === j.id);
      return { id: j.id, nama: j.nama_jenis || master?.nama || `Jenis ${j.id}` };
    });
  }, [config.pilihan_jenis_pendaftaran]);

  const availableProdiOptions = useMemo(() => {
    const existingProdiIds = new Set(config.prodi.map((p) => p.id));
    return MASTER_PRODI_LIST.filter((p) => !existingProdiIds.has(p.id)).map((p) => ({
      label: `${p.nama} (${p.kode}) - ${p.fakultas}`,
      value: p.id,
    }));
  }, [config.prodi]);

  const availableJalurOptions = useMemo(() => {
    const existingJalurIds = new Set(config.pilihan_jalur_pendaftaran.map((j) => j.id));
    return MASTER_JALUR_LIST.filter((j) => !existingJalurIds.has(j.id)).map((j) => ({
      label: `${j.nama}`,
      value: String(j.id),
    }));
  }, [config.pilihan_jalur_pendaftaran]);

  const availableJenisOptions = useMemo(() => {
    const existingJenisIds = new Set(config.pilihan_jenis_pendaftaran.map((j) => j.id));
    return MASTER_JENIS_LIST.filter((j) => !existingJenisIds.has(j.id)).map((j) => ({
      label: `${j.nama}`,
      value: String(j.id),
    }));
  }, [config.pilihan_jenis_pendaftaran]);

  const availableDokumenOptions = useMemo(() => {
    const existingDocIds = new Set([
      ...config.berkas_wajib.untuk_cmaba_n_dan_d.map((b) => b.id_berkas_pendaftaran),
      ...config.berkas_wajib.untuk_cmaba_non_disabilitas.map((b) => b.id_berkas_pendaftaran),
      ...config.berkas_wajib.untuk_cmaba_disabilitas.map((b) => b.id_berkas_pendaftaran),
    ]);
    return MASTER_BERKAS_LIST.filter((b) => !existingDocIds.has(b.id)).map((b) => ({
      label: `${b.nama} (${b.kategori})`,
      value: b.id,
    }));
  }, [config.berkas_wajib]);

  /* =========================================================================
     BATCH ACTIONS
     ========================================================================= */

  const handleApplyBatchKuota = () => {
    const { prodiId, kuotaN, kuotaD, prodiName } = batchKuotaModal;
    const n = Math.max(0, Number(kuotaN) || 0);
    const d = Math.max(0, Number(kuotaD) || 0);

    setConfig((prev) => ({
      ...prev,
      prodi: prev.prodi.map((p) => {
        if (prodiId !== null && p.id !== prodiId) return p;
        return {
          ...p,
          kuota_shift: p.kuota_shift.map((s) => ({
            ...s,
            jumlah_pendaftar_mahasiswa_n: n,
            jumlah_pendaftar_mahasiswa_d: d,
          })),
        };
      }),
    }));

    setBatchKuotaModal((prev) => ({ ...prev, open: false }));
    toast.success(
      prodiId === null
        ? `${t('tree.batchKuotaAllProdi')} (N: ${n}, D: ${d})`
        : `${t('tree.batchKuotaProdi')} ${prodiName} (N: ${n}, D: ${d})`
    );
  };

  const handleBatchAksesJalurGlobal = (enable: boolean) => {
    openConfirmation(
      `${enable ? t('tree.enableAllJalur') : t('tree.disableAllJalur')}?`,
      `Tindakan ini akan me-${enable ? 'enable' : 'disable'} seluruh akses untuk semua jalur.`,
      () => {
        setConfig((prev) => ({
          ...prev,
          pilihan_jalur_pendaftaran: prev.pilihan_jalur_pendaftaran.map((j) => ({
            ...j,
            untuk_cmaba_non_disabilitas: enable,
            untuk_cmaba_disabilitas: enable,
          })),
        }));
        toast.success(enable ? t('tree.enableAllJalur') : t('tree.disableAllJalur'));
      }
    );
  };

  const handleBatchAksesPerJalur = (jalurId: number, enable: boolean) => {
    setConfig((prev) => ({
      ...prev,
      pilihan_jalur_pendaftaran: prev.pilihan_jalur_pendaftaran.map((j) => {
        if (j.id !== jalurId) return j;
        return {
          ...j,
          untuk_cmaba_non_disabilitas: enable,
          untuk_cmaba_disabilitas: enable,
        };
      }),
    }));
    toast.success(enable ? t('tree.enableJalur') : t('tree.disableJalur'));
  };

  const handleBatchAksesJenisGlobal = (enable: boolean) => {
    openConfirmation(
      `${enable ? t('tree.enableAllJenis') : t('tree.disableAllJenis')}?`,
      `Tindakan ini akan me-${enable ? 'enable' : 'disable'} seluruh akses untuk semua jenis.`,
      () => {
        setConfig((prev) => ({
          ...prev,
          pilihan_jenis_pendaftaran: prev.pilihan_jenis_pendaftaran.map((j) => ({
            ...j,
            untuk_cmaba_non_disabilitas: enable,
            untuk_cmaba_disabilitas: enable,
          })),
        }));
        toast.success(enable ? t('tree.enableAllJenis') : t('tree.disableAllJenis'));
      }
    );
  };

  const handleBatchAksesPerJenis = (jenisId: number, enable: boolean) => {
    setConfig((prev) => ({
      ...prev,
      pilihan_jenis_pendaftaran: prev.pilihan_jenis_pendaftaran.map((j) => {
        if (j.id !== jenisId) return j;
        return {
          ...j,
          untuk_cmaba_non_disabilitas: enable,
          untuk_cmaba_disabilitas: enable,
        };
      }),
    }));
    toast.success(enable ? t('tree.enableJenis') : t('tree.disableJenis'));
  };

  const handleBatchRelasiBerkasGlobal = (enable: boolean) => {
    const validJenisIds = enable ? config.pilihan_jenis_pendaftaran.map((j) => j.id) : [];
    const validJalurIds = enable ? config.pilihan_jalur_pendaftaran.map((j) => j.id) : [];
    const validShiftIds = enable ? registeredShiftsInGelombang.map((s) => s.id) : [];

    openConfirmation(
      `${enable ? t('tree.enableAllRelasi') : t('tree.disableAllRelasi')}?`,
      `Tindakan ini akan me-${enable ? 'enable' : 'disable'} relasi semua dokumen berkas ke jalur/jenis/shift.`,
      () => {
        const updateBatchDoc = (list: BerkasRuleItem[]) =>
          list.map((doc) => ({
            ...doc,
            wajib_untuk_wni: enable,
            wajib_untuk_wna: enable,
            untuk_jenis_pendaftaran: [...validJenisIds],
            untuk_jalur_pendaftaran: [...validJalurIds],
            untuk_pilihan_shift_pendaftaran: [...validShiftIds],
          }));

        setConfig((prev) => ({
          ...prev,
          berkas_wajib: {
            untuk_cmaba_n_dan_d: updateBatchDoc(prev.berkas_wajib.untuk_cmaba_n_dan_d),
            untuk_cmaba_non_disabilitas: updateBatchDoc(prev.berkas_wajib.untuk_cmaba_non_disabilitas),
            untuk_cmaba_disabilitas: updateBatchDoc(prev.berkas_wajib.untuk_cmaba_disabilitas),
          },
        }));
        toast.success(enable ? t('tree.enableAllRelasi') : t('tree.disableAllRelasi'));
      }
    );
  };

  const handleBatchRelasiPerBerkas = (
    kategori: 'untuk_cmaba_n_dan_d' | 'untuk_cmaba_non_disabilitas' | 'untuk_cmaba_disabilitas',
    docId: string,
    enable: boolean
  ) => {
    const validJenisIds = enable ? config.pilihan_jenis_pendaftaran.map((j) => j.id) : [];
    const validJalurIds = enable ? config.pilihan_jalur_pendaftaran.map((j) => j.id) : [];
    const validShiftIds = enable ? registeredShiftsInGelombang.map((s) => s.id) : [];

    setConfig((prev) => ({
      ...prev,
      berkas_wajib: {
        ...prev.berkas_wajib,
        [kategori]: prev.berkas_wajib[kategori].map((doc) => {
          if (doc.id_berkas_pendaftaran !== docId) return doc;
          return {
            ...doc,
            wajib_untuk_wni: enable,
            wajib_untuk_wna: enable,
            untuk_jenis_pendaftaran: [...validJenisIds],
            untuk_jalur_pendaftaran: [...validJalurIds],
            untuk_pilihan_shift_pendaftaran: [...validShiftIds],
          };
        }),
      },
    }));
    toast.success(enable ? t('tree.enableRelasi') : t('tree.disableRelasi'));
  };

  /* =========================================================================
     INLINE DIRECT MUTATORS
     ========================================================================= */

  const handleUpdateKuotaDirect = (
    prodiId: string,
    shiftId: number,
    field: 'n' | 'd',
    value: number
  ) => {
    const num = Math.max(0, isNaN(value) ? 0 : value);
    setConfig((prev) => ({
      ...prev,
      prodi: prev.prodi.map((p) => {
        if (p.id !== prodiId) return p;
        return {
          ...p,
          kuota_shift: p.kuota_shift.map((s) => {
            if (s.id_pilihan_shift !== shiftId) return s;
            return {
              ...s,
              jumlah_pendaftar_mahasiswa_n: field === 'n' ? num : s.jumlah_pendaftar_mahasiswa_n,
              jumlah_pendaftar_mahasiswa_d: field === 'd' ? num : s.jumlah_pendaftar_mahasiswa_d,
            };
          }),
        };
      }),
    }));
  };

  const handleToggleAksesJalur = (jalurId: number, field: 'n' | 'd') => {
    setConfig((prev) => ({
      ...prev,
      pilihan_jalur_pendaftaran: prev.pilihan_jalur_pendaftaran.map((j) => {
        if (j.id !== jalurId) return j;
        return {
          ...j,
          untuk_cmaba_non_disabilitas:
            field === 'n' ? !j.untuk_cmaba_non_disabilitas : j.untuk_cmaba_non_disabilitas,
          untuk_cmaba_disabilitas:
            field === 'd' ? !j.untuk_cmaba_disabilitas : j.untuk_cmaba_disabilitas,
        };
      }),
    }));
  };

  const handleToggleAksesJenis = (jenisId: number, field: 'n' | 'd') => {
    setConfig((prev) => ({
      ...prev,
      pilihan_jenis_pendaftaran: prev.pilihan_jenis_pendaftaran.map((j) => {
        if (j.id !== jenisId) return j;
        return {
          ...j,
          untuk_cmaba_non_disabilitas:
            field === 'n' ? !j.untuk_cmaba_non_disabilitas : j.untuk_cmaba_non_disabilitas,
          untuk_cmaba_disabilitas:
            field === 'd' ? !j.untuk_cmaba_disabilitas : j.untuk_cmaba_disabilitas,
        };
      }),
    }));
  };

  const handleToggleRelasiBerkasDirect = (
    kategori: 'untuk_cmaba_n_dan_d' | 'untuk_cmaba_non_disabilitas' | 'untuk_cmaba_disabilitas',
    docId: string,
    relasiType: 'jenis' | 'jalur' | 'shift' | 'wni' | 'wna',
    targetId?: number
  ) => {
    setConfig((prev) => ({
      ...prev,
      berkas_wajib: {
        ...prev.berkas_wajib,
        [kategori]: prev.berkas_wajib[kategori].map((doc) => {
          if (doc.id_berkas_pendaftaran !== docId) return doc;
          if (relasiType === 'wni') return { ...doc, wajib_untuk_wni: !doc.wajib_untuk_wni };
          if (relasiType === 'wna') return { ...doc, wajib_untuk_wna: !doc.wajib_untuk_wna };
          if (targetId === undefined) return doc;

          if (relasiType === 'jenis') {
            const has = doc.untuk_jenis_pendaftaran.includes(targetId);
            return {
              ...doc,
              untuk_jenis_pendaftaran: has
                ? doc.untuk_jenis_pendaftaran.filter((x) => x !== targetId)
                : [...doc.untuk_jenis_pendaftaran, targetId],
            };
          }
          if (relasiType === 'jalur') {
            const has = doc.untuk_jalur_pendaftaran.includes(targetId);
            return {
              ...doc,
              untuk_jalur_pendaftaran: has
                ? doc.untuk_jalur_pendaftaran.filter((x) => x !== targetId)
                : [...doc.untuk_jalur_pendaftaran, targetId],
            };
          }
          if (relasiType === 'shift') {
            const has = doc.untuk_pilihan_shift_pendaftaran.includes(targetId);
            return {
              ...doc,
              untuk_pilihan_shift_pendaftaran: has
                ? doc.untuk_pilihan_shift_pendaftaran.filter((x) => x !== targetId)
                : [...doc.untuk_pilihan_shift_pendaftaran, targetId],
            };
          }
          return doc;
        }),
      },
    }));
  };

  /* =========================================================================
     GENERATORS DEFAULT 0 KUOTA & DISABLE AKSES
     ========================================================================= */

  const handleGenerateAllProdi = () => {
    openConfirmation(
      `${t('tree.generateAllProdi')}?`,
      `Tindakan ini akan mengenerate seluruh ${MASTER_PRODI_LIST.length} Program Studi dari Master API ke gelombang ini dengan default kuota 0.`,
      () => {
        const existingMap = new Map(config.prodi.map((p) => [p.id, p]));
        const defaultShift1 = MASTER_SHIFT_LIST[0];

        const updatedProdiList: ProdiItem[] = MASTER_PRODI_LIST.map((master) => {
          if (existingMap.has(master.id)) {
            return existingMap.get(master.id)!;
          }
          return {
            id: master.id,
            nama_prodi: master.nama,
            kode: master.kode,
            kuota_shift: [
              {
                id_pilihan_shift: defaultShift1.id,
                nama_shift: defaultShift1.nama,
                jumlah_pendaftar_mahasiswa_n: 0,
                jumlah_pendaftar_mahasiswa_d: 0,
              },
            ],
          };
        });

        setConfig((prev) => ({ ...prev, prodi: updatedProdiList }));
        toast.success(t('tree.generateAllProdi'));
      }
    );
  };

  const handleGenerateAllShiftsGlobal = () => {
    if (config.prodi.length === 0) {
      toast.error('Belum ada prodi terdaftar.');
      return;
    }
    openConfirmation(
      `${t('tree.generateAllShifts')}?`,
      `Tindakan ini akan menambahkan seluruh ${MASTER_SHIFT_LIST.length} pilihan shift Master API ke semua prodi dengan default kuota 0.`,
      () => {
        setConfig((prev) => ({
          ...prev,
          prodi: prev.prodi.map((p) => {
            const existingShifts = new Map(p.kuota_shift.map((s) => [s.id_pilihan_shift, s]));
            const fullShifts: KuotaShiftItem[] = MASTER_SHIFT_LIST.map((m) => {
              if (existingShifts.has(m.id)) return existingShifts.get(m.id)!;
              return {
                id_pilihan_shift: m.id,
                nama_shift: m.nama,
                jumlah_pendaftar_mahasiswa_n: 0,
                jumlah_pendaftar_mahasiswa_d: 0,
              };
            });
            return { ...p, kuota_shift: fullShifts };
          }),
        }));
        toast.success(t('tree.generateAllShifts'));
      }
    );
  };

  const handleGenerateShiftsPerProdi = (prodiId: string, prodiName: string) => {
    openConfirmation(
      `${t('tree.genShiftProdi')} ${prodiName}?`,
      `Tindakan ini akan menambahkan seluruh ${MASTER_SHIFT_LIST.length} pilihan shift Master API ke program studi ${prodiName} dengan default kuota 0.`,
      () => {
        setConfig((prev) => ({
          ...prev,
          prodi: prev.prodi.map((p) => {
            if (p.id !== prodiId) return p;
            const existingShifts = new Map(p.kuota_shift.map((s) => [s.id_pilihan_shift, s]));
            const fullShifts: KuotaShiftItem[] = MASTER_SHIFT_LIST.map((m) => {
              if (existingShifts.has(m.id)) return existingShifts.get(m.id)!;
              return {
                id_pilihan_shift: m.id,
                nama_shift: m.nama,
                jumlah_pendaftar_mahasiswa_n: 0,
                jumlah_pendaftar_mahasiswa_d: 0,
              };
            });
            return { ...p, kuota_shift: fullShifts };
          }),
        }));
        toast.success(`${t('tree.genShiftProdi')} ${prodiName}`);
      }
    );
  };

  const handleGenerateAllJalur = () => {
    openConfirmation(
      `${t('tree.generateAllJalur')}?`,
      `Tindakan ini akan mengenerate seluruh ${MASTER_JALUR_LIST.length} Jalur Pendaftaran dari Master API dengan default status Non-Aktif (Disable).`,
      () => {
        const existingMap = new Map(config.pilihan_jalur_pendaftaran.map((j) => [j.id, j]));
        const updatedJalur: PilihanJalurPendaftaranItem[] = MASTER_JALUR_LIST.map((m) => {
          if (existingMap.has(m.id)) return existingMap.get(m.id)!;
          return {
            id: m.id,
            nama_jalur: m.nama,
            untuk_cmaba_non_disabilitas: false,
            untuk_cmaba_disabilitas: false,
          };
        });

        setConfig((prev) => ({ ...prev, pilihan_jalur_pendaftaran: updatedJalur }));
        toast.success(t('tree.generateAllJalur'));
      }
    );
  };

  const handleGenerateAllJenis = () => {
    openConfirmation(
      `${t('tree.generateAllJenis')}?`,
      `Tindakan ini akan mengenerate seluruh ${MASTER_JENIS_LIST.length} Jenis Pendaftaran dari Master API dengan default status Non-Aktif (Disable).`,
      () => {
        const updatedJenis: PilihanJenisPendaftaranItem[] = MASTER_JENIS_LIST.map((m) => ({
          id: m.id,
          nama_jenis: m.nama,
          untuk_cmaba_non_disabilitas: false,
          untuk_cmaba_disabilitas: false,
        }));

        setConfig((prev) => ({ ...prev, pilihan_jenis_pendaftaran: updatedJenis }));
        toast.success(t('tree.generateAllJenis'));
      }
    );
  };

  const handleGenerateAllBerkas = () => {
    openConfirmation(
      `${t('tree.generateAllBerkas')}?`,
      'Tindakan ini akan mengenerate dokumen berkas standar lengkap dari Master API dengan default status Non-Aktif (Disable).',
      () => {
        const commonDocs: BerkasRuleItem[] = [
          {
            id_berkas_pendaftaran: 'doc-ktp',
            nama_berkas: 'Kartu Tanda Penduduk (KTP) / Paspor',
            wajib_untuk_wni: false,
            wajib_untuk_wna: false,
            untuk_jenis_pendaftaran: [],
            untuk_jalur_pendaftaran: [],
            untuk_pilihan_shift_pendaftaran: [],
          },
          {
            id_berkas_pendaftaran: 'doc-ijazah',
            nama_berkas: 'Ijazah / SKL Legalisir',
            wajib_untuk_wni: false,
            wajib_untuk_wna: false,
            untuk_jenis_pendaftaran: [],
            untuk_jalur_pendaftaran: [],
            untuk_pilihan_shift_pendaftaran: [],
          },
          {
            id_berkas_pendaftaran: 'doc-rapor',
            nama_berkas: 'Transkrip Nilai / Rapor Semester 1-5',
            wajib_untuk_wni: false,
            wajib_untuk_wna: false,
            untuk_jenis_pendaftaran: [],
            untuk_jalur_pendaftaran: [],
            untuk_pilihan_shift_pendaftaran: [],
          },
        ];

        const nonDisabilitasDocs: BerkasRuleItem[] = [
          {
            id_berkas_pendaftaran: 'doc-sehat',
            nama_berkas: 'Surat Keterangan Sehat Bebas Narkoba',
            wajib_untuk_wni: false,
            wajib_untuk_wna: false,
            untuk_jenis_pendaftaran: [],
            untuk_jalur_pendaftaran: [],
            untuk_pilihan_shift_pendaftaran: [],
          },
        ];

        const disabilitasDocs: BerkasRuleItem[] = [
          {
            id_berkas_pendaftaran: 'doc-disabilitas',
            nama_berkas: 'Surat Asesmen Dokter Spesialis Disabilitas',
            wajib_untuk_wni: false,
            wajib_untuk_wna: false,
            untuk_jenis_pendaftaran: [],
            untuk_jalur_pendaftaran: [],
            untuk_pilihan_shift_pendaftaran: [],
          },
          {
            id_berkas_pendaftaran: 'doc-akomodasi',
            nama_berkas: 'Formulir Kebutuhan Fasilitas Aksesibilitas',
            wajib_untuk_wni: false,
            wajib_untuk_wna: false,
            untuk_jenis_pendaftaran: [],
            untuk_jalur_pendaftaran: [],
            untuk_pilihan_shift_pendaftaran: [],
          },
        ];

        setConfig((prev) => ({
          ...prev,
          berkas_wajib: {
            untuk_cmaba_n_dan_d: commonDocs,
            untuk_cmaba_non_disabilitas: nonDisabilitasDocs,
            untuk_cmaba_disabilitas: disabilitasDocs,
          },
        }));
        toast.success(t('tree.generateAllBerkas'));
      }
    );
  };

  /* =========================================================================
     DELETE CONFIRMATIONS
     ========================================================================= */

  const confirmDeleteProdi = (prodiId: string, prodiName: string) => {
    openConfirmation(
      `${t('tree.delete')} ${prodiName}?`,
      `Program studi beserta seluruh kuota shift terkait akan dihapus dari gelombang ini.`,
      () => {
        setConfig((prev) => ({
          ...prev,
          prodi: prev.prodi.filter((p) => p.id !== prodiId),
        }));
        toast.success(`${prodiName} ${t('common.delete')} ${t('common.success')}`);
      },
      t('tree.delete'),
      'destructive'
    );
  };

  const confirmDeleteShift = (prodiId: string, shiftId: number, shiftName: string) => {
    openConfirmation(
      `${t('tree.delete')} ${shiftName}?`,
      `Pilihan shift ini akan dihapus dari program studi tersebut.`,
      () => {
        setConfig((prev) => ({
          ...prev,
          prodi: prev.prodi.map((p) => {
            if (p.id !== prodiId) return p;
            return {
              ...p,
              kuota_shift: p.kuota_shift.filter((s) => s.id_pilihan_shift !== shiftId),
            };
          }),
        }));
        toast.success(`${shiftName} ${t('common.delete')} ${t('common.success')}`);
      },
      t('tree.delete'),
      'destructive'
    );
  };

  const confirmDeleteJalur = (jalurId: number, jalurName: string) => {
    openConfirmation(
      `${t('tree.delete')} ${jalurName}?`,
      `Jalur seleksi ini akan dihapus dari gelombang pendaftaran.`,
      () => {
        setConfig((prev) => ({
          ...prev,
          pilihan_jalur_pendaftaran: prev.pilihan_jalur_pendaftaran.filter((j) => j.id !== jalurId),
        }));
        toast.success(`${jalurName} ${t('common.delete')} ${t('common.success')}`);
      },
      t('tree.delete'),
      'destructive'
    );
  };

  const confirmDeleteJenis = (jenisId: number, jenisName: string) => {
    openConfirmation(
      `${t('tree.delete')} ${jenisName}?`,
      `Kategori jenis pendaftaran ini akan dihapus dari gelombang pendaftaran.`,
      () => {
        setConfig((prev) => ({
          ...prev,
          pilihan_jenis_pendaftaran: prev.pilihan_jenis_pendaftaran.filter((j) => j.id !== jenisId),
        }));
        toast.success(`${jenisName} ${t('common.delete')} ${t('common.success')}`);
      },
      t('tree.delete'),
      'destructive'
    );
  };

  const confirmDeleteDokumen = (
    kategori: 'untuk_cmaba_n_dan_d' | 'untuk_cmaba_non_disabilitas' | 'untuk_cmaba_disabilitas',
    docId: string,
    docName: string
  ) => {
    openConfirmation(
      `${t('tree.delete')} ${docName}?`,
      `Dokumen persyaratan ini akan dihapus dari daftar berkas wajib gelombang pendaftaran.`,
      () => {
        setConfig((prev) => ({
          ...prev,
          berkas_wajib: {
            ...prev.berkas_wajib,
            [kategori]: prev.berkas_wajib[kategori].filter(
              (d) => d.id_berkas_pendaftaran !== docId
            ),
          },
        }));
        toast.success(`${docName} ${t('common.delete')} ${t('common.success')}`);
      },
      t('tree.delete'),
      'destructive'
    );
  };

  /* =========================================================================
     ADD HANDLERS
     ========================================================================= */

  const handleAddProdiSubmit = () => {
    if (!selectedProdiToAdd) {
      toast.error(t('tree.selectProdi'));
      return;
    }

    const master = MASTER_PRODI_LIST.find((p) => p.id === selectedProdiToAdd);
    if (!master) return;

    if (config.prodi.some((p) => p.id === master.id)) {
      toast.error(`${master.nama} sudah ada di gelombang ini!`);
      return;
    }

    const defaultShift = MASTER_SHIFT_LIST[0];
    const newProdi: ProdiItem = {
      id: master.id,
      nama_prodi: master.nama,
      kode: master.kode,
      kuota_shift: [
        {
          id_pilihan_shift: defaultShift.id,
          nama_shift: defaultShift.nama,
          jumlah_pendaftar_mahasiswa_n: 0,
          jumlah_pendaftar_mahasiswa_d: 0,
        },
      ],
    };

    setConfig((prev) => ({ ...prev, prodi: [...prev.prodi, newProdi] }));
    setSelectedProdiToAdd('');
    setOpenAddProdiDialog(false);
    toast.success(`${master.nama} ${t('common.success')}`);
  };

  const handleAddShiftSubmit = () => {
    if (!selectedShiftToAdd) {
      toast.error(t('tree.selectShift'));
      return;
    }

    const shiftMaster = MASTER_SHIFT_LIST.find((s) => String(s.id) === selectedShiftToAdd);
    if (!shiftMaster) return;

    setConfig((prev) => ({
      ...prev,
      prodi: prev.prodi.map((p) => {
        if (p.id !== targetProdiForShift) return p;
        if (p.kuota_shift.some((s) => s.id_pilihan_shift === shiftMaster.id)) {
          toast.error(`${shiftMaster.nama} sudah ada di prodi ini!`);
          return p;
        }
        return {
          ...p,
          kuota_shift: [
            ...p.kuota_shift,
            {
              id_pilihan_shift: shiftMaster.id,
              nama_shift: shiftMaster.nama,
              jumlah_pendaftar_mahasiswa_n: Number(kuotaN) || 0,
              jumlah_pendaftar_mahasiswa_d: Number(kuotaD) || 0,
            },
          ],
        };
      }),
    }));

    setOpenAddShiftDialog(false);
    toast.success(`${shiftMaster.nama} ${t('common.success')}`);
  };

  const handleAddJalurSubmit = () => {
    if (!selectedJalurToAdd) {
      toast.error(t('tree.selectJalur'));
      return;
    }

    const master = MASTER_JALUR_LIST.find((j) => String(j.id) === selectedJalurToAdd);
    if (!master) return;

    if (config.pilihan_jalur_pendaftaran.some((j) => j.id === master.id)) {
      toast.error('Jalur pendaftaran ini sudah terdaftar');
      return;
    }

    const newJalur: PilihanJalurPendaftaranItem = {
      id: master.id,
      nama_jalur: master.nama,
      untuk_cmaba_non_disabilitas: false,
      untuk_cmaba_disabilitas: false,
    };

    setConfig((prev) => ({
      ...prev,
      pilihan_jalur_pendaftaran: [...prev.pilihan_jalur_pendaftaran, newJalur],
    }));

    setSelectedJalurToAdd('');
    setOpenAddJalurDialog(false);
    toast.success(`${master.nama} ${t('common.success')}`);
  };

  const handleAddJenisSubmit = () => {
    if (!selectedJenisToAdd) {
      toast.error(t('tree.selectJenis'));
      return;
    }

    const master = MASTER_JENIS_LIST.find((j) => String(j.id) === selectedJenisToAdd);
    if (!master) return;

    if (config.pilihan_jenis_pendaftaran.some((j) => j.id === master.id)) {
      toast.error('Jenis pendaftaran ini sudah terdaftar');
      return;
    }

    const newJenis: PilihanJenisPendaftaranItem = {
      id: master.id,
      nama_jenis: master.nama,
      untuk_cmaba_non_disabilitas: false,
      untuk_cmaba_disabilitas: false,
    };

    setConfig((prev) => ({
      ...prev,
      pilihan_jenis_pendaftaran: [...prev.pilihan_jenis_pendaftaran, newJenis],
    }));

    setSelectedJenisToAdd('');
    setOpenAddJenisDialog(false);
    toast.success(`${master.nama} ${t('common.success')}`);
  };

  const handleAddDokumenSubmit = () => {
    if (!selectedDokumenToAdd) {
      toast.error(t('tree.selectDokumen'));
      return;
    }

    const master = MASTER_BERKAS_LIST.find((b) => b.id === selectedDokumenToAdd);
    if (!master) return;

    const newDoc: BerkasRuleItem = {
      id_berkas_pendaftaran: master.id,
      nama_berkas: master.nama,
      wajib_untuk_wni: false,
      wajib_untuk_wna: false,
      untuk_jenis_pendaftaran: [],
      untuk_jalur_pendaftaran: [],
      untuk_pilihan_shift_pendaftaran: [],
    };

    setConfig((prev) => ({
      ...prev,
      berkas_wajib: {
        ...prev.berkas_wajib,
        [targetKategoriDoc]: [...prev.berkas_wajib[targetKategoriDoc], newDoc],
      },
    }));

    setSelectedDokumenToAdd('');
    setOpenAddDokumenDialog(false);
    toast.success(`${master.nama} ${t('common.success')}`);
  };

  /* =========================================================================
     BUILD COMPREHENSIVE TREE WITH EXPLICIT DISABLE VISUALS & CHILDREN
     ========================================================================= */

  const treeData = useMemo<GenericTreeNode[]>(() => {
    return [
      {
        id: 'root-gelombang',
        label: `${config.gelombang_nama} (${config.tahun_akademik} ${config.semester})`,
        subtitle: t('tree.matrixDesc'),
        icon: <GraduationCap className="h-4 w-4 text-primary shrink-0" />,
        badge: (
          <Badge className="text-[10px] bg-primary/10 text-primary border-primary/20 shrink-0">
            {t('common.active')}
          </Badge>
        ),
        nonEditable: true,
        nonDuplicable: true,
        nonDeletable: true,
        children: [
          /* 1. Branch Program Studi & Kuota Shift */
          {
            id: 'branch-prodi',
            label: `${t('tree.branchProdi')} (${config.prodi.length} Prodi)`,
            subtitle: t('tree.branchProdiDesc'),
            icon: <Layers className="h-4 w-4 text-amber-500 shrink-0" />,
            badge: (
              <Badge variant="outline" className="text-[9px] font-mono text-amber-600 dark:text-amber-400 shrink-0">
                {config.prodi.length} Prodi
              </Badge>
            ),
            nonEditable: true,
            nonDuplicable: true,
            nonDeletable: true,
            children: config.prodi.map((p) => {
              const master = MASTER_PRODI_LIST.find((m) => m.id === p.id);
              const prodiName = p.nama_prodi || master?.nama || p.id;
              const kodeProdi = p.kode || master?.kode || p.id;

              return {
                id: `prodi-${p.id}`,
                label: prodiName,
                subtitle: `Kode: ${kodeProdi} • ${p.kuota_shift.length} Shift`,
                icon: <GraduationCap className="h-3.5 w-3.5 text-blue-500 shrink-0" />,
                badge: (
                  <Badge variant="outline" className="font-mono text-[9px] text-muted-foreground shrink-0">
                    {kodeProdi}
                  </Badge>
                ),
                nonEditable: true,
                nonDuplicable: true,
                nonDeletable: false,
                data: { ...p, nama_prodi: prodiName, kode: kodeProdi },
                children: p.kuota_shift.map((shift) => {
                  const shiftMaster = MASTER_SHIFT_LIST.find((m) => m.id === shift.id_pilihan_shift);
                  const shiftName = shift.nama_shift || shiftMaster?.nama || `Shift ${shift.id_pilihan_shift}`;

                  return {
                    id: `shift-${p.id}-${shift.id_pilihan_shift}`,
                    label: shiftName,
                    subtitle: `N: ${shift.jumlah_pendaftar_mahasiswa_n} | D: ${shift.jumlah_pendaftar_mahasiswa_d}`,
                    icon: <Clock className="h-3.5 w-3.5 text-emerald-500 shrink-0" />,
                    badge: (
                      <div className="flex items-center gap-1 shrink-0">
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-medium ${
                            shift.jumlah_pendaftar_mahasiswa_n > 0
                              ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400'
                              : 'bg-muted text-muted-foreground/50'
                          }`}
                        >
                          N: {shift.jumlah_pendaftar_mahasiswa_n}
                        </span>
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-medium ${
                            shift.jumlah_pendaftar_mahasiswa_d > 0
                              ? 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400'
                              : 'bg-muted text-muted-foreground/50'
                          }`}
                        >
                          D: {shift.jumlah_pendaftar_mahasiswa_d}
                        </span>
                      </div>
                    ),
                    nonEditable: true,
                    nonDuplicable: true,
                    nonDeletable: false,
                    data: {
                      prodiId: p.id,
                      prodiNama: prodiName,
                      ...shift,
                      nama_shift: shiftName,
                    },
                    children: [
                      {
                        id: `kuota-n-${p.id}-${shift.id_pilihan_shift}`,
                        label: t('tree.quotaNonDis'),
                        subtitle: t('tree.quotaNonDisDesc'),
                        icon: <Users className="h-3 w-3 text-blue-500 shrink-0" />,
                        badge: (
                          <span
                            className={`text-[9px] font-mono ${
                              shift.jumlah_pendaftar_mahasiswa_n === 0
                                ? 'text-muted-foreground/50'
                                : 'text-blue-600 dark:text-blue-400 font-semibold'
                            }`}
                          >
                            {shift.jumlah_pendaftar_mahasiswa_n} {t('tree.person')}
                          </span>
                        ),
                        nonEditable: true,
                        nonDuplicable: true,
                        nonDeletable: true,
                        data: {
                          type: 'kuota-input-n',
                          prodiId: p.id,
                          shiftId: shift.id_pilihan_shift,
                          value: shift.jumlah_pendaftar_mahasiswa_n,
                          disabled: shift.jumlah_pendaftar_mahasiswa_n === 0,
                        },
                      },
                      {
                        id: `kuota-d-${p.id}-${shift.id_pilihan_shift}`,
                        label: t('tree.quotaDis'),
                        subtitle: t('tree.quotaDisDesc'),
                        icon: <ShieldCheck className="h-3 w-3 text-purple-500 shrink-0" />,
                        badge: (
                          <span
                            className={`text-[9px] font-mono ${
                              shift.jumlah_pendaftar_mahasiswa_d === 0
                                ? 'text-muted-foreground/50'
                                : 'text-purple-600 dark:text-purple-400 font-semibold'
                            }`}
                          >
                            {shift.jumlah_pendaftar_mahasiswa_d} {t('tree.person')}
                          </span>
                        ),
                        nonEditable: true,
                        nonDuplicable: true,
                        nonDeletable: true,
                        data: {
                          type: 'kuota-input-d',
                          prodiId: p.id,
                          shiftId: shift.id_pilihan_shift,
                          value: shift.jumlah_pendaftar_mahasiswa_d,
                          disabled: shift.jumlah_pendaftar_mahasiswa_d === 0,
                        },
                      },
                    ],
                  };
                }),
              };
            }),
          },

          /* 2. Branch Pilihan Jalur Pendaftaran */
          {
            id: 'branch-jalur',
            label: `${t('tree.branchJalur')} (${config.pilihan_jalur_pendaftaran.length} Jalur)`,
            subtitle: t('tree.branchJalurDesc'),
            icon: <SlidersHorizontal className="h-4 w-4 text-emerald-500 shrink-0" />,
            badge: (
              <Badge variant="outline" className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400 shrink-0">
                {config.pilihan_jalur_pendaftaran.length} Jalur
              </Badge>
            ),
            nonEditable: true,
            nonDuplicable: true,
            nonDeletable: true,
            children: config.pilihan_jalur_pendaftaran.map((jalur) => {
              const master = MASTER_JALUR_LIST.find((m) => m.id === jalur.id);
              const jalurName = jalur.nama_jalur || master?.nama || `Jalur ${jalur.id}`;
              const isAllDisabled = !jalur.untuk_cmaba_non_disabilitas && !jalur.untuk_cmaba_disabilitas;

              return {
                id: `jalur-${jalur.id}`,
                label: jalurName,
                subtitle: `ID: ${jalur.id}`,
                icon: <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />,
                badge: (
                  <div className="flex items-center gap-1 text-[9px] font-mono shrink-0">
                    <span
                      className={`px-1.5 py-0.5 rounded ${
                        jalur.untuk_cmaba_non_disabilitas
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
                          : 'bg-muted/70 text-muted-foreground/50'
                      }`}
                    >
                      Non-D: {jalur.untuk_cmaba_non_disabilitas ? t('tree.enabled') : t('tree.disabled')}
                    </span>
                    <span
                      className={`px-1.5 py-0.5 rounded ${
                        jalur.untuk_cmaba_disabilitas
                          ? 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400'
                          : 'bg-muted/70 text-muted-foreground/50'
                      }`}
                    >
                      Disabilitas: {jalur.untuk_cmaba_disabilitas ? t('tree.enabled') : t('tree.disabled')}
                    </span>
                  </div>
                ),
                nonEditable: true,
                nonDuplicable: true,
                nonDeletable: false,
                data: { ...jalur, nama_jalur: jalurName, disabled: isAllDisabled },
                children: [
                  {
                    id: `akses-jalur-n-${jalur.id}`,
                    label: t('tree.accessNonDis'),
                    subtitle: t('tree.accessNonDisDesc'),
                    icon: <Users className="h-3 w-3 text-emerald-500 shrink-0" />,
                    nonEditable: true,
                    nonDuplicable: true,
                    nonDeletable: true,
                    data: {
                      type: 'toggle-akses-jalur',
                      jalurId: jalur.id,
                      field: 'n',
                      active: jalur.untuk_cmaba_non_disabilitas,
                      disabled: !jalur.untuk_cmaba_non_disabilitas,
                    },
                  },
                  {
                    id: `akses-jalur-d-${jalur.id}`,
                    label: t('tree.accessDis'),
                    subtitle: t('tree.accessDisDesc'),
                    icon: <ShieldCheck className="h-3 w-3 text-purple-500 shrink-0" />,
                    nonEditable: true,
                    nonDuplicable: true,
                    nonDeletable: true,
                    data: {
                      type: 'toggle-akses-jalur',
                      jalurId: jalur.id,
                      field: 'd',
                      active: jalur.untuk_cmaba_disabilitas,
                      disabled: !jalur.untuk_cmaba_disabilitas,
                    },
                  },
                ],
              };
            }),
          },

          /* 3. Branch Pilihan Jenis Pendaftaran */
          {
            id: 'branch-jenis',
            label: `${t('tree.branchJenis')} (${config.pilihan_jenis_pendaftaran.length} Jenis)`,
            subtitle: t('tree.branchJenisDesc'),
            icon: <Users className="h-4 w-4 text-purple-500 shrink-0" />,
            badge: (
              <Badge variant="outline" className="text-[9px] font-mono text-purple-600 dark:text-purple-400 shrink-0">
                {config.pilihan_jenis_pendaftaran.length} Jenis
              </Badge>
            ),
            nonEditable: true,
            nonDuplicable: true,
            nonDeletable: true,
            children: config.pilihan_jenis_pendaftaran.map((jenis) => {
              const master = MASTER_JENIS_LIST.find((m) => m.id === jenis.id);
              const jenisName = jenis.nama_jenis || master?.nama || `Jenis ${jenis.id}`;
              const isAllDisabled = !jenis.untuk_cmaba_non_disabilitas && !jenis.untuk_cmaba_disabilitas;

              return {
                id: `jenis-${jenis.id}`,
                label: jenisName,
                subtitle: `ID: ${jenis.id}`,
                icon: <CheckCircle2 className="h-3.5 w-3.5 text-purple-500 shrink-0" />,
                badge: (
                  <div className="flex items-center gap-1 text-[9px] font-mono shrink-0">
                    <span
                      className={`px-1.5 py-0.5 rounded ${
                        jenis.untuk_cmaba_non_disabilitas
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
                          : 'bg-muted/70 text-muted-foreground/50'
                      }`}
                    >
                      Non-D: {jenis.untuk_cmaba_non_disabilitas ? t('tree.enabled') : t('tree.disabled')}
                    </span>
                    <span
                      className={`px-1.5 py-0.5 rounded ${
                        jenis.untuk_cmaba_disabilitas
                          ? 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400'
                          : 'bg-muted/70 text-muted-foreground/50'
                      }`}
                    >
                      Disabilitas: {jenis.untuk_cmaba_disabilitas ? t('tree.enabled') : t('tree.disabled')}
                    </span>
                  </div>
                ),
                nonEditable: true,
                nonDuplicable: true,
                nonDeletable: false,
                data: { ...jenis, nama_jenis: jenisName, disabled: isAllDisabled },
                children: [
                  {
                    id: `akses-jenis-n-${jenis.id}`,
                    label: t('tree.accessNonDis'),
                    subtitle: t('tree.accessNonDisDesc'),
                    icon: <Users className="h-3 w-3 text-purple-500 shrink-0" />,
                    nonEditable: true,
                    nonDuplicable: true,
                    nonDeletable: true,
                    data: {
                      type: 'toggle-akses-jenis',
                      jenisId: jenis.id,
                      field: 'n',
                      active: jenis.untuk_cmaba_non_disabilitas,
                      disabled: !jenis.untuk_cmaba_non_disabilitas,
                    },
                  },
                  {
                    id: `akses-jenis-d-${jenis.id}`,
                    label: t('tree.accessDis'),
                    subtitle: t('tree.accessDisDesc'),
                    icon: <ShieldCheck className="h-3 w-3 text-purple-500 shrink-0" />,
                    nonEditable: true,
                    nonDuplicable: true,
                    nonDeletable: true,
                    data: {
                      type: 'toggle-akses-jenis',
                      jenisId: jenis.id,
                      field: 'd',
                      active: jenis.untuk_cmaba_disabilitas,
                      disabled: !jenis.untuk_cmaba_disabilitas,
                    },
                  },
                ],
              };
            }),
          },

          /* 4. Branch Persyaratan Berkas Wajib */
          {
            id: 'branch-berkas',
            label: `${t('tree.branchBerkas')} (${
              config.berkas_wajib.untuk_cmaba_n_dan_d.length +
              config.berkas_wajib.untuk_cmaba_non_disabilitas.length +
              config.berkas_wajib.untuk_cmaba_disabilitas.length
            } Dokumen)`,
            subtitle: t('tree.branchBerkasDesc'),
            icon: <FileCheck2 className="h-4 w-4 text-rose-500 shrink-0" />,
            nonEditable: true,
            nonDuplicable: true,
            nonDeletable: true,
            children: [
              /* Sub-kategori: Umum N & D */
              {
                id: 'berkas-nd',
                label: `${t('tree.berkasCommon')} (${config.berkas_wajib.untuk_cmaba_n_dan_d.length} Dokumen)`,
                icon: <FileText className="h-3.5 w-3.5 text-blue-500 shrink-0" />,
                nonEditable: true,
                nonDuplicable: true,
                nonDeletable: true,
                children: config.berkas_wajib.untuk_cmaba_n_dan_d.map((b) =>
                  renderBerkasNode('untuk_cmaba_n_dan_d', b)
                ),
              },
              /* Sub-kategori: Khusus Non-D */
              {
                id: 'berkas-non-disabilitas',
                label: `${t('tree.berkasNonDis')} (${config.berkas_wajib.untuk_cmaba_non_disabilitas.length} Dokumen)`,
                icon: <FileText className="h-3.5 w-3.5 text-emerald-500 shrink-0" />,
                nonEditable: true,
                nonDuplicable: true,
                nonDeletable: true,
                children: config.berkas_wajib.untuk_cmaba_non_disabilitas.map((b) =>
                  renderBerkasNode('untuk_cmaba_non_disabilitas', b)
                ),
              },
              /* Sub-kategori: Khusus D */
              {
                id: 'berkas-disabilitas',
                label: `${t('tree.berkasDis')} (${config.berkas_wajib.untuk_cmaba_disabilitas.length} Dokumen)`,
                icon: <ShieldCheck className="h-3.5 w-3.5 text-purple-500 shrink-0" />,
                nonEditable: true,
                nonDuplicable: true,
                nonDeletable: true,
                children: config.berkas_wajib.untuk_cmaba_disabilitas.map((b) =>
                  renderBerkasNode('untuk_cmaba_disabilitas', b)
                ),
              },
            ],
          },
        ],
      },
    ];

    // Helper untuk merender Node Berkas beserta sub-relasinya
    function renderBerkasNode(
      kategori: 'untuk_cmaba_n_dan_d' | 'untuk_cmaba_non_disabilitas' | 'untuk_cmaba_disabilitas',
      b: BerkasRuleItem
    ): GenericTreeNode {
      const master = MASTER_BERKAS_LIST.find((m) => m.id === b.id_berkas_pendaftaran);
      const docName = b.nama_berkas || master?.nama || b.id_berkas_pendaftaran;
      const totalRelasi =
        b.untuk_jenis_pendaftaran.length +
        b.untuk_jalur_pendaftaran.length +
        b.untuk_pilihan_shift_pendaftaran.length;
      const isAllDisabled = totalRelasi === 0 && !b.wajib_untuk_wni && !b.wajib_untuk_wna;

      return {
        id: `berkas-${kategori}-${b.id_berkas_pendaftaran}`,
        label: docName,
        subtitle: `ID: ${b.id_berkas_pendaftaran} • ${totalRelasi} Relasi Aktif`,
        icon: <FileSpreadsheet className="h-3.5 w-3.5 text-rose-500 shrink-0" />,
        badge: (
          <div className="flex items-center gap-1 text-[9px] font-mono shrink-0">
            <span
              className={`px-1.5 py-0.5 rounded ${
                b.wajib_untuk_wni
                  ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400'
                  : 'bg-muted/70 text-muted-foreground/50'
              }`}
            >
              WNI: {b.wajib_untuk_wni ? t('tree.enabled') : t('tree.disabled')}
            </span>
            <span
              className={`px-1.5 py-0.5 rounded ${
                b.wajib_untuk_wna
                  ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400'
                  : 'bg-muted/70 text-muted-foreground/50'
              }`}
            >
              WNA: {b.wajib_untuk_wna ? t('tree.enabled') : t('tree.disabled')}
            </span>
            <span
              className={`px-1.5 py-0.5 rounded ${
                totalRelasi > 0
                  ? 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 font-semibold'
                  : 'bg-muted/70 text-muted-foreground/50'
              }`}
            >
              {totalRelasi} Relasi
            </span>
          </div>
        ),
        nonEditable: true,
        nonDuplicable: true,
        nonDeletable: false,
        data: {
          type: 'berkas-item',
          kategori,
          docId: b.id_berkas_pendaftaran,
          docName,
          berkas: b,
          disabled: isAllDisabled,
        },
        children: [
          /* Syarat Kewarganegaraan */
          {
            id: `kewarganegaraan-${kategori}-${b.id_berkas_pendaftaran}`,
            label: t('tree.citizenship'),
            subtitle: 'WNI / WNA',
            icon: <Globe className="h-3 w-3 text-blue-500 shrink-0" />,
            nonEditable: true,
            nonDuplicable: true,
            nonDeletable: true,
            children: [
              {
                id: `wni-${kategori}-${b.id_berkas_pendaftaran}`,
                label: t('tree.reqWni'),
                subtitle: b.wajib_untuk_wni ? 'Berkas aktif untuk WNI' : 'Berkas tidak aktif untuk WNI',
                icon: <CheckCircle2 className="h-3 w-3 text-blue-500 shrink-0" />,
                nonEditable: true,
                nonDuplicable: true,
                nonDeletable: true,
                data: {
                  type: 'toggle-relasi-direct',
                  kategori,
                  docId: b.id_berkas_pendaftaran,
                  relasiType: 'wni',
                  active: b.wajib_untuk_wni,
                  disabled: !b.wajib_untuk_wni,
                },
              },
              {
                id: `wna-${kategori}-${b.id_berkas_pendaftaran}`,
                label: t('tree.reqWna'),
                subtitle: b.wajib_untuk_wna ? 'Berkas aktif untuk WNA' : 'Berkas tidak aktif untuk WNA',
                icon: <CheckCircle2 className="h-3 w-3 text-blue-500 shrink-0" />,
                nonEditable: true,
                nonDuplicable: true,
                nonDeletable: true,
                data: {
                  type: 'toggle-relasi-direct',
                  kategori,
                  docId: b.id_berkas_pendaftaran,
                  relasiType: 'wna',
                  active: b.wajib_untuk_wna,
                  disabled: !b.wajib_untuk_wna,
                },
              },
            ],
          },

          /* Relasi Pilihan Jenis Pendaftaran */
          {
            id: `relasi-jenis-${kategori}-${b.id_berkas_pendaftaran}`,
            label: `${t('tree.forJenis')} (${b.untuk_jenis_pendaftaran.length}/${registeredJenisInGelombang.length})`,
            subtitle: 'Aktivasi berkas sesuai jenis pendaftaran',
            icon: <Users className="h-3 w-3 text-purple-500 shrink-0" />,
            nonEditable: true,
            nonDuplicable: true,
            nonDeletable: true,
            children: registeredJenisInGelombang.map((jenis) => {
              const isRequired = b.untuk_jenis_pendaftaran.includes(jenis.id);
              return {
                id: `relasi-jenis-${kategori}-${b.id_berkas_pendaftaran}-${jenis.id}`,
                label: jenis.nama,
                subtitle: isRequired ? 'Berkas aktif di jenis ini' : 'Berkas tidak aktif di jenis ini',
                icon: <Users className="h-3 w-3 text-purple-400 shrink-0" />,
                nonEditable: true,
                nonDuplicable: true,
                nonDeletable: true,
                data: {
                  type: 'toggle-relasi-direct',
                  kategori,
                  docId: b.id_berkas_pendaftaran,
                  relasiType: 'jenis',
                  targetId: jenis.id,
                  active: isRequired,
                  disabled: !isRequired,
                },
              };
            }),
          },

          /* Relasi Pilihan Jalur Pendaftaran */
          {
            id: `relasi-jalur-${kategori}-${b.id_berkas_pendaftaran}`,
            label: `${t('tree.forJalur')} (${b.untuk_jalur_pendaftaran.length}/${registeredJalurInGelombang.length})`,
            subtitle: 'Aktivasi berkas sesuai jalur seleksi',
            icon: <SlidersHorizontal className="h-3 w-3 text-emerald-500 shrink-0" />,
            nonEditable: true,
            nonDuplicable: true,
            nonDeletable: true,
            children: registeredJalurInGelombang.map((jalur) => {
              const isRequired = b.untuk_jalur_pendaftaran.includes(jalur.id);
              return {
                id: `relasi-jalur-${kategori}-${b.id_berkas_pendaftaran}-${jalur.id}`,
                label: jalur.nama,
                subtitle: isRequired ? 'Berkas aktif di jalur ini' : 'Berkas tidak aktif di jalur ini',
                icon: <CheckCircle2 className="h-3 w-3 text-emerald-400 shrink-0" />,
                nonEditable: true,
                nonDuplicable: true,
                nonDeletable: true,
                data: {
                  type: 'toggle-relasi-direct',
                  kategori,
                  docId: b.id_berkas_pendaftaran,
                  relasiType: 'jalur',
                  targetId: jalur.id,
                  active: isRequired,
                  disabled: !isRequired,
                },
              };
            }),
          },

          /* Relasi Pilihan Shift Perkuliahan */
          {
            id: `relasi-shift-${kategori}-${b.id_berkas_pendaftaran}`,
            label: `${t('tree.forShift')} (${b.untuk_pilihan_shift_pendaftaran.length}/${registeredShiftsInGelombang.length})`,
            subtitle: 'Aktivasi berkas sesuai shift perkuliahan',
            icon: <Clock className="h-3 w-3 text-blue-500 shrink-0" />,
            nonEditable: true,
            nonDuplicable: true,
            nonDeletable: true,
            children: registeredShiftsInGelombang.map((shift) => {
              const isRequired = b.untuk_pilihan_shift_pendaftaran.includes(shift.id);
              return {
                id: `relasi-shift-${kategori}-${b.id_berkas_pendaftaran}-${shift.id}`,
                label: shift.nama,
                subtitle: isRequired ? 'Berkas aktif di shift ini' : 'Berkas tidak aktif di shift ini',
                icon: <Clock className="h-3 w-3 text-blue-400 shrink-0" />,
                nonEditable: true,
                nonDuplicable: true,
                nonDeletable: true,
                data: {
                  type: 'toggle-relasi-direct',
                  kategori,
                  docId: b.id_berkas_pendaftaran,
                  relasiType: 'shift',
                  targetId: shift.id,
                  active: isRequired,
                  disabled: !isRequired,
                },
              };
            }),
          },
        ],
      };
    }
  }, [
    config,
    registeredShiftsInGelombang,
    registeredJalurInGelombang,
    registeredJenisInGelombang,
    t,
  ]);

  /* =========================================================================
     ROW ACTION RENDERER (ALL BUTTONS CONSISTENTLY ON THE FAR RIGHT)
     ========================================================================= */

  const renderRowActions = ({ node }: { node: GenericTreeNode }) => {
    // 1. Branch Program Studi
    if (node.id === 'branch-prodi') {
      return (
        <div className="flex items-center gap-1 ml-auto shrink-0" onClick={(e) => e.stopPropagation()}>
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              setBatchKuotaModal({
                open: true,
                prodiId: null,
                prodiName: '',
                kuotaN: 50,
                kuotaD: 10,
              })
            }
            className="h-6 text-[10px] px-2 rounded-md border-primary/30 text-primary hover:bg-primary/10 cursor-pointer"
            title={t('tree.batchKuotaAllProdi')}
          >
            <Sliders className="h-3 w-3 mr-1" />
            {t('tree.batchKuotaAllProdi')}
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={handleGenerateAllShiftsGlobal}
            className="h-6 text-[10px] px-2 rounded-md border-blue-300 dark:border-blue-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 cursor-pointer"
            title={t('tree.generateAllShifts')}
          >
            <Clock className="h-3 w-3 mr-1" />
            {t('tree.generateAllShifts')}
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={handleGenerateAllProdi}
            className="h-6 text-[10px] px-2 rounded-md border-amber-300 dark:border-amber-800 text-amber-600 dark:text-amber-400 hover:bg-amber-50 cursor-pointer"
            title={t('tree.generateAllProdi')}
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            {t('tree.generateAllProdi')}
          </Button>

          <Button
            size="sm"
            onClick={() => {
              setSelectedProdiToAdd('');
              setOpenAddProdiDialog(true);
            }}
            className="h-6 text-[10px] px-2 rounded-md cursor-pointer"
          >
            <Plus className="h-3 w-3 mr-1" />
            {t('tree.addProdi')}
          </Button>
        </div>
      );
    }

    // 2. Baris Prodi Tertentu
    if (node.id.startsWith('prodi-')) {
      const prodiId = node.data?.id;
      const prodiName = node.data?.nama_prodi || node.label;
      return (
        <div className="flex items-center gap-1 ml-auto shrink-0" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setBatchKuotaModal({
                open: true,
                prodiId,
                prodiName,
                kuotaN: 50,
                kuotaD: 10,
              })
            }
            className="h-6 text-[10px] px-2 rounded-md border-primary/30 text-primary hover:bg-primary/10 cursor-pointer"
            title={t('tree.batchKuotaProdi')}
          >
            <Sliders className="h-3 w-3 mr-1" />
            {t('tree.batchKuotaProdi')}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handleGenerateShiftsPerProdi(prodiId, prodiName)}
            className="h-6 text-[10px] px-2 rounded-md border-blue-300 dark:border-blue-800 text-blue-600 hover:bg-blue-50 cursor-pointer"
            title={t('tree.genShiftProdi')}
          >
            <Clock className="h-3 w-3 mr-1" />
            {t('tree.genShiftProdi')}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setTargetProdiForShift(prodiId);
              setSelectedShiftToAdd('');
              setKuotaN(0);
              setKuotaD(0);
              setOpenAddShiftDialog(true);
            }}
            className="h-6 text-[10px] px-2 rounded-md cursor-pointer hover:bg-accent"
          >
            <Plus className="h-3 w-3 mr-1 text-emerald-500" />
            {t('tree.addShift')}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => confirmDeleteProdi(prodiId, prodiName)}
            className="h-6 w-6 text-destructive/80 hover:text-destructive hover:bg-destructive/10 cursor-pointer"
            title={t('tree.delete')}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      );
    }

    // 3. Baris Shift Tertentu
    if (node.id.startsWith('shift-') && !node.id.startsWith('shift-kuota-')) {
      const data = node.data;
      if (data && data.prodiId) {
        return (
          <div className="flex items-center gap-1 ml-auto shrink-0" onClick={(e) => e.stopPropagation()}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => confirmDeleteShift(data.prodiId, data.id_pilihan_shift, data.nama_shift || node.label)}
              className="h-6 w-6 text-destructive/80 hover:text-destructive hover:bg-destructive/10 cursor-pointer"
              title={t('tree.delete')}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        );
      }
    }

    // 4. Baris Sub-node Input Langsung Kuota (N & D)
    if (node.data?.type === 'kuota-input-n' || node.data?.type === 'kuota-input-d') {
      const { prodiId, shiftId, type, value } = node.data;
      const field = type === 'kuota-input-n' ? 'n' : 'd';

      return (
        <div className="flex items-center gap-1.5 ml-auto shrink-0" onClick={(e) => e.stopPropagation()}>
          <span className="text-[9px] text-muted-foreground font-mono">{t('tree.quotaInput')}</span>
          <Input
            type="number"
            min="0"
            value={value}
            onChange={(e) => handleUpdateKuotaDirect(prodiId, shiftId, field, parseInt(e.target.value, 10))}
            className="h-6 w-16 text-[10px] px-1.5 py-0 font-mono rounded-md bg-background text-right"
          />
          <span className="text-[9px] text-muted-foreground">{t('tree.person')}</span>
        </div>
      );
    }

    // 5. Branch Pilihan Jalur Pendaftaran
    if (node.id === 'branch-jalur') {
      const isAllJalurActive =
        config.pilihan_jalur_pendaftaran.length > 0 &&
        config.pilihan_jalur_pendaftaran.every(
          (j) => j.untuk_cmaba_non_disabilitas && j.untuk_cmaba_disabilitas
        );

      return (
        <div className="flex items-center gap-1 ml-auto shrink-0" onClick={(e) => e.stopPropagation()}>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleBatchAksesJalurGlobal(!isAllJalurActive)}
            className={cn(
              'h-6 text-[10px] px-2 rounded-md cursor-pointer transition-colors',
              isAllJalurActive
                ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100/50'
                : 'border-muted text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
            title={isAllJalurActive ? t('tree.disableAllJalur') : t('tree.enableAllJalur')}
          >
            {isAllJalurActive ? (
              <>
                <CheckSquare className="h-3 w-3 mr-1 text-emerald-600 dark:text-emerald-400" />
                {t('tree.disableAllJalur')}
              </>
            ) : (
              <>
                <Square className="h-3 w-3 mr-1 text-muted-foreground" />
                {t('tree.enableAllJalur')}
              </>
            )}
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={handleGenerateAllJalur}
            className="h-6 text-[10px] px-2 rounded-md border-emerald-300 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 cursor-pointer"
            title={t('tree.generateAllJalur')}
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            {t('tree.generateAllJalur')}
          </Button>

          <Button
            size="sm"
            onClick={() => {
              setSelectedJalurToAdd('');
              setOpenAddJalurDialog(true);
            }}
            className="h-6 text-[10px] px-2 rounded-md cursor-pointer"
          >
            <Plus className="h-3 w-3 mr-1" />
            {t('tree.addJalur')}
          </Button>
        </div>
      );
    }

    // 6. Baris Jalur Tertentu (1 Single Toggle Button)
    if (node.id.startsWith('jalur-') && !node.id.startsWith('akses-jalur-')) {
      const jalur = node.data as PilihanJalurPendaftaranItem;
      const isJalurActive = jalur.untuk_cmaba_non_disabilitas && jalur.untuk_cmaba_disabilitas;

      return (
        <div className="flex items-center gap-1 ml-auto shrink-0" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleBatchAksesPerJalur(jalur.id, !isJalurActive)}
            className={cn(
              'h-6 text-[10px] px-2 rounded-md cursor-pointer transition-colors',
              isJalurActive
                ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-medium'
                : 'border-border text-muted-foreground/60 hover:text-foreground hover:bg-muted'
            )}
            title={isJalurActive ? t('tree.disableJalur') : t('tree.enableJalur')}
          >
            {isJalurActive ? (
              <>
                <Check className="h-3 w-3 mr-1 text-emerald-600" />
                {t('tree.disableJalur')}
              </>
            ) : (
              <>
                <Power className="h-3 w-3 mr-1 text-muted-foreground/50" />
                {t('tree.enableJalur')}
              </>
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => confirmDeleteJalur(jalur.id, jalur.nama_jalur || node.label)}
            className="h-6 w-6 text-destructive/80 hover:text-destructive hover:bg-destructive/10 cursor-pointer"
            title={t('tree.delete')}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      );
    }

    // 7. Baris Sub-node Toggle Akses Jalur (N / D) (1 Single Toggle Button)
    if (node.data?.type === 'toggle-akses-jalur') {
      const { jalurId, field, active } = node.data;
      return (
        <div className="flex items-center gap-1.5 ml-auto shrink-0" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => handleToggleAksesJalur(jalurId, field)}
            className={cn(
              'flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-medium transition-colors cursor-pointer border',
              active
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 text-emerald-700 dark:text-emerald-300 font-semibold shadow-2xs'
                : 'bg-muted/40 border-border/60 text-muted-foreground/50 hover:bg-muted/70 hover:text-muted-foreground/70'
            )}
          >
            {active ? (
              <>
                <Check className="h-3 w-3 text-emerald-600" />
                <span>{t('tree.enabled')}</span>
              </>
            ) : (
              <>
                <X className="h-3 w-3 text-muted-foreground/40" />
                <span>{t('tree.enable')}</span>
              </>
            )}
          </button>
        </div>
      );
    }

    // 8. Branch Pilihan Jenis Pendaftaran
    if (node.id === 'branch-jenis') {
      const isAllJenisActive =
        config.pilihan_jenis_pendaftaran.length > 0 &&
        config.pilihan_jenis_pendaftaran.every(
          (j) => j.untuk_cmaba_non_disabilitas && j.untuk_cmaba_disabilitas
        );

      return (
        <div className="flex items-center gap-1 ml-auto shrink-0" onClick={(e) => e.stopPropagation()}>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleBatchAksesJenisGlobal(!isAllJenisActive)}
            className={cn(
              'h-6 text-[10px] px-2 rounded-md cursor-pointer transition-colors',
              isAllJenisActive
                ? 'border-purple-300 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 hover:bg-purple-100/50'
                : 'border-muted text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
            title={isAllJenisActive ? t('tree.disableAllJenis') : t('tree.enableAllJenis')}
          >
            {isAllJenisActive ? (
              <>
                <CheckSquare className="h-3 w-3 mr-1 text-purple-600 dark:text-purple-400" />
                {t('tree.disableAllJenis')}
              </>
            ) : (
              <>
                <Square className="h-3 w-3 mr-1 text-muted-foreground" />
                {t('tree.enableAllJenis')}
              </>
            )}
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={handleGenerateAllJenis}
            className="h-6 text-[10px] px-2 rounded-md border-purple-300 dark:border-purple-800 text-purple-600 dark:text-purple-400 hover:bg-purple-50 cursor-pointer"
            title={t('tree.generateAllJenis')}
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            {t('tree.generateAllJenis')}
          </Button>

          <Button
            size="sm"
            onClick={() => {
              setSelectedJenisToAdd('');
              setOpenAddJenisDialog(true);
            }}
            className="h-6 text-[10px] px-2 rounded-md cursor-pointer"
          >
            <Plus className="h-3 w-3 mr-1" />
            {t('tree.addJenis')}
          </Button>
        </div>
      );
    }

    // 9. Baris Jenis Tertentu (1 Single Toggle Button)
    if (node.id.startsWith('jenis-') && !node.id.startsWith('akses-jenis-')) {
      const jenis = node.data as PilihanJenisPendaftaranItem;
      const isJenisActive = jenis.untuk_cmaba_non_disabilitas && jenis.untuk_cmaba_disabilitas;

      return (
        <div className="flex items-center gap-1 ml-auto shrink-0" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleBatchAksesPerJenis(jenis.id, !isJenisActive)}
            className={cn(
              'h-6 text-[10px] px-2 rounded-md cursor-pointer transition-colors',
              isJenisActive
                ? 'border-purple-300 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-medium'
                : 'border-border text-muted-foreground/60 hover:text-foreground hover:bg-muted'
            )}
            title={isJenisActive ? t('tree.disableJenis') : t('tree.enableJenis')}
          >
            {isJenisActive ? (
              <>
                <Check className="h-3 w-3 mr-1 text-purple-600" />
                {t('tree.disableJenis')}
              </>
            ) : (
              <>
                <Power className="h-3 w-3 mr-1 text-muted-foreground/50" />
                {t('tree.enableJenis')}
              </>
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => confirmDeleteJenis(jenis.id, jenis.nama_jenis || node.label)}
            className="h-6 w-6 text-destructive/80 hover:text-destructive hover:bg-destructive/10 cursor-pointer"
            title={t('tree.delete')}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      );
    }

    // 10. Baris Sub-node Toggle Akses Jenis (N / D) (1 Single Toggle Button)
    if (node.data?.type === 'toggle-akses-jenis') {
      const { jenisId, field, active } = node.data;
      return (
        <div className="flex items-center gap-1.5 ml-auto shrink-0" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => handleToggleAksesJenis(jenisId, field)}
            className={cn(
              'flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-medium transition-colors cursor-pointer border',
              active
                ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-300 text-purple-700 dark:text-purple-300 font-semibold shadow-2xs'
                : 'bg-muted/40 border-border/60 text-muted-foreground/50 hover:bg-muted/70 hover:text-muted-foreground/70'
            )}
          >
            {active ? (
              <>
                <Check className="h-3 w-3 text-purple-600" />
                <span>{t('tree.enabled')}</span>
              </>
            ) : (
              <>
                <X className="h-3 w-3 text-muted-foreground/40" />
                <span>{t('tree.enable')}</span>
              </>
            )}
          </button>
        </div>
      );
    }

    // 11. Branch Persyaratan Berkas Wajib
    if (node.id === 'branch-berkas') {
      const allDocs = [
        ...config.berkas_wajib.untuk_cmaba_n_dan_d,
        ...config.berkas_wajib.untuk_cmaba_non_disabilitas,
        ...config.berkas_wajib.untuk_cmaba_disabilitas,
      ];
      const isAllBerkasActive =
        allDocs.length > 0 &&
        allDocs.every(
          (b) =>
            b.wajib_untuk_wni &&
            b.wajib_untuk_wna &&
            b.untuk_jenis_pendaftaran.length === registeredJenisInGelombang.length &&
            b.untuk_jalur_pendaftaran.length === registeredJalurInGelombang.length &&
            b.untuk_pilihan_shift_pendaftaran.length === registeredShiftsInGelombang.length
        );

      return (
        <div className="flex items-center gap-1 ml-auto shrink-0" onClick={(e) => e.stopPropagation()}>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleBatchRelasiBerkasGlobal(!isAllBerkasActive)}
            className={cn(
              'h-6 text-[10px] px-2 rounded-md cursor-pointer transition-colors',
              isAllBerkasActive
                ? 'border-indigo-300 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100/50'
                : 'border-muted text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
            title={isAllBerkasActive ? t('tree.disableAllRelasi') : t('tree.enableAllRelasi')}
          >
            {isAllBerkasActive ? (
              <>
                <CheckSquare className="h-3 w-3 mr-1 text-indigo-600 dark:text-indigo-400" />
                {t('tree.disableAllRelasi')}
              </>
            ) : (
              <>
                <Square className="h-3 w-3 mr-1 text-muted-foreground" />
                {t('tree.enableAllRelasi')}
              </>
            )}
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={handleGenerateAllBerkas}
            className="h-6 text-[10px] px-2 rounded-md border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400 hover:bg-rose-50 cursor-pointer"
            title={t('tree.generateAllBerkas')}
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            {t('tree.generateAllBerkas')}
          </Button>

          <Button
            size="sm"
            onClick={() => {
              setSelectedDokumenToAdd('');
              setTargetKategoriDoc('untuk_cmaba_n_dan_d');
              setOpenAddDokumenDialog(true);
            }}
            className="h-6 text-[10px] px-2 rounded-md cursor-pointer"
          >
            <Plus className="h-3 w-3 mr-1" />
            {t('tree.addDokumen')}
          </Button>
        </div>
      );
    }

    // 12. Baris Dokumen Berkas Tertentu (1 Single Toggle Button)
    if (node.data?.type === 'berkas-item') {
      const { kategori, docId, docName, berkas } = node.data;
      const b = berkas as BerkasRuleItem;
      const isDocActive =
        b &&
        (b.wajib_untuk_wni ||
          b.wajib_untuk_wna ||
          b.untuk_jenis_pendaftaran.length > 0 ||
          b.untuk_jalur_pendaftaran.length > 0 ||
          b.untuk_pilihan_shift_pendaftaran.length > 0);

      return (
        <div className="flex items-center gap-1 ml-auto shrink-0" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleBatchRelasiPerBerkas(kategori, docId, !isDocActive)}
            className={cn(
              'h-6 text-[10px] px-2 rounded-md cursor-pointer transition-colors',
              isDocActive
                ? 'border-indigo-300 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-medium'
                : 'border-border text-muted-foreground/60 hover:text-foreground hover:bg-muted'
            )}
            title={isDocActive ? t('tree.disableRelasi') : t('tree.enableRelasi')}
          >
            {isDocActive ? (
              <>
                <Check className="h-3 w-3 mr-1 text-indigo-600" />
                {t('tree.disableRelasi')}
              </>
            ) : (
              <>
                <Power className="h-3 w-3 mr-1 text-muted-foreground/50" />
                {t('tree.enableRelasi')}
              </>
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => confirmDeleteDokumen(kategori, docId, docName || node.label)}
            className="h-6 w-6 text-destructive/80 hover:text-destructive hover:bg-destructive/10 cursor-pointer"
            title={t('tree.delete')}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      );
    }

    // 13. Baris Sub-node Toggle Relasi Berkas (WNI, WNA, Jenis, Jalur, Shift) (1 Single Toggle Button)
    if (node.data?.type === 'toggle-relasi-direct') {
      const { kategori, docId, relasiType, targetId, active } = node.data;
      return (
        <div className="flex items-center gap-1.5 ml-auto shrink-0" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => handleToggleRelasiBerkasDirect(kategori, docId, relasiType, targetId)}
            className={cn(
              'flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-medium transition-colors cursor-pointer border',
              active
                ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-300 text-indigo-700 dark:text-indigo-300 font-semibold shadow-2xs'
                : 'bg-muted/40 border-border/60 text-muted-foreground/50 hover:bg-muted/70 hover:text-muted-foreground/70'
            )}
          >
            {active ? (
              <>
                <Check className="h-3 w-3 text-indigo-600" />
                <span>{t('tree.enabled')}</span>
              </>
            ) : (
              <>
                <X className="h-3 w-3 text-muted-foreground/40" />
                <span>{t('tree.enable')}</span>
              </>
            )}
          </button>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="w-full space-y-6 pb-12">
      {/* Top Header & Gelombang Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <FolderTree className="h-6 w-6 text-primary" />
              <span>{t('tree.pageTitle')}</span>
            </h1>
            <Badge className="bg-primary/10 text-primary border-primary/20 text-xs font-mono">
              {t('tree.liveMasterApi')}
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            {t('tree.pageSubtitle')}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-72">
            <Combobox
              options={MASTER_GELOMBANG_LIST.map((g) => ({
                label: `${g.nama} (${g.status})`,
                value: g.id,
              }))}
              value={selectedGelombangId}
              onChange={(val) => {
                setSelectedGelombangId(val);
                const gelItem = MASTER_GELOMBANG_LIST.find((g) => g.id === val);
                if (gelItem) {
                  setConfig((prev) => ({
                    ...prev,
                    id_gelombang: gelItem.id,
                    gelombang_nama: gelItem.nama,
                    tahun_akademik: gelItem.tahun,
                    semester: gelItem.semester,
                  }));
                  toast.info(`${gelItem.nama}`);
                }
              }}
              placeholder={t('tree.selectGelombang')}
            />
          </div>
        </div>
      </div>

      {/* Tampilan TreeView Full-Width Memanjang Tanpa Internal Scrollbar (Scroll di Body) */}
      <div className="w-full space-y-5">
        <TreeRoot
          data={treeData}
          selectedId={selectedNode?.id}
          onSelect={(node) => setSelectedNode(node)}
          selectedIds={selectedIds}
          onMultiSelectChange={(ids) => setSelectedIds(ids)}
          defaultExpandedIds={['root-gelombang', 'branch-prodi', 'branch-jalur', 'branch-jenis', 'branch-berkas']}
          editable={true}
          multiSelect={true}
          dragAndDrop={false}
          renderActions={renderRowActions}
          className="border border-border/80 shadow-sm"
        >
          {/* Header Toolbar */}
          <TreeHeader
            title={
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-foreground">
                  {config.gelombang_nama} - {t('tree.matrixTitle')}
                </span>
                <Badge variant="secondary" className="font-mono text-[10px]">
                  {t('tree.apiSynced')}
                </Badge>
              </div>
            }
            description={t('tree.matrixDesc')}
            searchPlaceholder={t('tree.searchPlaceholder')}
            extraActions={
              <div className="flex items-center gap-2 flex-wrap">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setBatchKuotaModal({
                      open: true,
                      prodiId: null,
                      prodiName: '',
                      kuotaN: 50,
                      kuotaD: 10,
                    })
                  }
                  className="h-8 text-xs px-3 rounded-lg border-primary/30 text-primary hover:bg-primary/10 cursor-pointer"
                >
                  <Sliders className="h-3.5 w-3.5 mr-1.5" />
                  {t('tree.batchKuotaAllProdi')}
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleGenerateAllShiftsGlobal}
                  className="h-8 text-xs px-3 rounded-lg border-blue-300 dark:border-blue-800 text-blue-700 dark:text-blue-300 hover:bg-blue-50 cursor-pointer"
                >
                  <Clock className="h-3.5 w-3.5 mr-1.5" />
                  {t('tree.generateAllShifts')}
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleGenerateAllProdi}
                  className="h-8 text-xs px-3 rounded-lg border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-300 hover:bg-amber-50 cursor-pointer"
                >
                  <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                  {t('tree.generateAllProdi')}
                </Button>

                <Button
                  size="sm"
                  onClick={() => {
                    setSelectedProdiToAdd('');
                    setOpenAddProdiDialog(true);
                  }}
                  className="h-8 text-xs px-3.5 rounded-lg shadow-2xs cursor-pointer"
                >
                  <Plus className="h-4 w-4 mr-1.5" />
                  {t('tree.addProdi')}
                </Button>
              </div>
            }
          />

          {/* Tree Content List: Memanjang ke bawah tanpa max-height & tanpa internal scroll */}
          <TreeContent />

          {/* Tree Footer */}
          <TreeFooter />
        </TreeRoot>

        {/* Selected Node Details & Quick Inspector Footer */}
        {selectedNode && (
          <Card className="rounded-2xl border-border/70 shadow-xs bg-muted/20">
            <CardHeader className="pb-2.5 pt-3.5 px-4 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xs sm:text-sm font-semibold flex items-center gap-2">
                  <Info className="h-4 w-4 text-primary" />
                  <span>{t('tree.selectedElement')} {selectedNode.label}</span>
                  <Badge variant="outline" className="text-[10px] font-mono">
                    {selectedNode.id}
                  </Badge>
                </CardTitle>
                <CardDescription className="text-xs mt-0.5">
                  {typeof selectedNode.subtitle === 'string'
                    ? selectedNode.subtitle
                    : t('tree.matrixDesc')}
                </CardDescription>
              </div>

              {selectedNode.data && (
                <Badge variant="secondary" className="font-mono text-[10px]">
                  {t('tree.payloadActive')}
                </Badge>
              )}
            </CardHeader>

            {selectedNode.data && (
              <CardContent className="pt-0 px-4 pb-3.5">
                <pre className="p-3 rounded-xl bg-background text-[11px] font-mono overflow-x-auto text-foreground/90 border border-border/60">
                  {safeStringify(selectedNode.data)}
                </pre>
              </CardContent>
            )}
          </Card>
        )}
      </div>

      {/* =========================================================================
         MODAL: KONFIRMASI GLOBAL UNTUK SEMUA AKSI GENERATE & HAPUS
         ========================================================================= */}
      <Dialog
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog((prev) => ({ ...prev, open }))}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              {confirmDialog.actionVariant === 'destructive' ? (
                <Trash2 className="h-5 w-5 text-destructive" />
              ) : (
                <AlertCircle className="h-5 w-5 text-primary" />
              )}
              <span>{confirmDialog.title}</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground leading-relaxed pt-1">
              {confirmDialog.description}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setConfirmDialog((prev) => ({ ...prev, open: false }))}
              className="text-xs cursor-pointer"
            >
              {t('tree.cancel')}
            </Button>
            <Button
              size="sm"
              variant={confirmDialog.actionVariant || 'default'}
              onClick={confirmDialog.onConfirm}
              className="text-xs cursor-pointer"
            >
              {confirmDialog.actionLabel}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* =========================================================================
         MODAL: PENGATURAN BATCH KUOTA (GLOBAL / PER-PRODI)
         ========================================================================= */}
      <Dialog
        open={batchKuotaModal.open}
        onOpenChange={(open) => setBatchKuotaModal((prev) => ({ ...prev, open }))}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <Sliders className="h-5 w-5 text-primary" />
              <span>{t('tree.batchQuotaTitle')}</span>
            </DialogTitle>
            <DialogDescription className="text-xs">
              {t('tree.batchQuotaDesc')} (
              {batchKuotaModal.prodiId === null
                ? t('tree.targetAllProdi')
                : `${t('tree.targetSpecificProdi')} ${batchKuotaModal.prodiName}`}
              ).
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  {t('tree.quotaNLabel')}
                </label>
                <Input
                  type="number"
                  min="0"
                  value={batchKuotaModal.kuotaN}
                  onChange={(e) =>
                    setBatchKuotaModal((prev) => ({
                      ...prev,
                      kuotaN: Number(e.target.value),
                    }))
                  }
                  className="h-8 text-xs font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  {t('tree.quotaDLabel')}
                </label>
                <Input
                  type="number"
                  min="0"
                  value={batchKuotaModal.kuotaD}
                  onChange={(e) =>
                    setBatchKuotaModal((prev) => ({
                      ...prev,
                      kuotaD: Number(e.target.value),
                    }))
                  }
                  className="h-8 text-xs font-mono"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setBatchKuotaModal((prev) => ({ ...prev, open: false }))}
              className="text-xs cursor-pointer"
            >
              {t('tree.cancel')}
            </Button>
            <Button
              size="sm"
              onClick={handleApplyBatchKuota}
              className="text-xs cursor-pointer"
            >
              <Check className="h-3.5 w-3.5 mr-1" />
              {t('tree.applyBatch')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* =========================================================================
         DIALOG: TAMBAH PRODI
         ========================================================================= */}
      <Dialog open={openAddProdiDialog} onOpenChange={setOpenAddProdiDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <GraduationCap className="h-5 w-5 text-primary" />
              <span>{t('tree.addProdiTitle')}</span>
            </DialogTitle>
            <DialogDescription className="text-xs">
              {t('tree.addProdiDesc')}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                {t('tree.selectProdi')}
              </label>
              {availableProdiOptions.length === 0 ? (
                <div className="p-3 rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 text-xs flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{t('tree.allProdiRegistered')}</span>
                </div>
              ) : (
                <Combobox
                  options={availableProdiOptions}
                  value={selectedProdiToAdd}
                  onChange={(val) => setSelectedProdiToAdd(val)}
                  placeholder={t('common.select')}
                />
              )}
            </div>

            <div className="p-3 rounded-lg bg-muted/60 text-muted-foreground text-[11px] leading-relaxed">
              {t('tree.addProdiHint')}
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setOpenAddProdiDialog(false)}
              className="text-xs cursor-pointer"
            >
              {t('tree.cancel')}
            </Button>
            <Button
              size="sm"
              onClick={handleAddProdiSubmit}
              disabled={!selectedProdiToAdd}
              className="text-xs cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              {t('tree.addToGelombang')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* =========================================================================
         DIALOG: TAMBAH SHIFT KE PRODI
         ========================================================================= */}
      <Dialog open={openAddShiftDialog} onOpenChange={setOpenAddShiftDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <Clock className="h-5 w-5 text-emerald-500" />
              <span>{t('tree.addShiftTitle')}</span>
            </DialogTitle>
            <DialogDescription className="text-xs">
              {t('tree.addShiftDesc')}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                {t('tree.selectShift')}
              </label>
              <Combobox
                options={MASTER_SHIFT_LIST.map((s) => ({
                  label: `${s.nama} (${s.jam})`,
                  value: String(s.id),
                }))}
                value={selectedShiftToAdd}
                onChange={(val) => setSelectedShiftToAdd(val)}
                placeholder={t('common.select')}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  {t('tree.quotaNLabel')}
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
                  {t('tree.quotaDLabel')}
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

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setOpenAddShiftDialog(false)}
              className="text-xs cursor-pointer"
            >
              {t('tree.cancel')}
            </Button>
            <Button
              size="sm"
              onClick={handleAddShiftSubmit}
              disabled={!selectedShiftToAdd}
              className="text-xs cursor-pointer"
            >
              {t('tree.saveShift')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* =========================================================================
         DIALOG: TAMBAH JALUR PENDAFTARAN
         ========================================================================= */}
      <Dialog open={openAddJalurDialog} onOpenChange={setOpenAddJalurDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <SlidersHorizontal className="h-5 w-5 text-emerald-500" />
              <span>{t('tree.addJalurTitle')}</span>
            </DialogTitle>
            <DialogDescription className="text-xs">
              {t('tree.addJalurDesc')}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                {t('tree.selectJalur')}
              </label>
              {availableJalurOptions.length === 0 ? (
                <div className="p-3 rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 text-xs flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{t('tree.allJalurRegistered')}</span>
                </div>
              ) : (
                <Combobox
                  options={availableJalurOptions}
                  value={selectedJalurToAdd}
                  onChange={(val) => setSelectedJalurToAdd(val)}
                  placeholder={t('common.select')}
                />
              )}
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setOpenAddJalurDialog(false)}
              className="text-xs cursor-pointer"
            >
              {t('tree.cancel')}
            </Button>
            <Button
              size="sm"
              onClick={handleAddJalurSubmit}
              disabled={!selectedJalurToAdd}
              className="text-xs cursor-pointer"
            >
              {t('tree.addJalur')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* =========================================================================
         DIALOG: TAMBAH JENIS PENDAFTARAN (1 PER 1)
         ========================================================================= */}
      <Dialog open={openAddJenisDialog} onOpenChange={setOpenAddJenisDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <Users className="h-5 w-5 text-purple-500" />
              <span>{t('tree.addJenisTitle')}</span>
            </DialogTitle>
            <DialogDescription className="text-xs">
              {t('tree.addJenisDesc')}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                {t('tree.selectJenis')}
              </label>
              {availableJenisOptions.length === 0 ? (
                <div className="p-3 rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 text-xs flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{t('tree.allJenisRegistered')}</span>
                </div>
              ) : (
                <Combobox
                  options={availableJenisOptions}
                  value={selectedJenisToAdd}
                  onChange={(val) => setSelectedJenisToAdd(val)}
                  placeholder={t('common.select')}
                />
              )}
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setOpenAddJenisDialog(false)}
              className="text-xs cursor-pointer"
            >
              {t('tree.cancel')}
            </Button>
            <Button
              size="sm"
              onClick={handleAddJenisSubmit}
              disabled={!selectedJenisToAdd}
              className="text-xs cursor-pointer"
            >
              {t('tree.addJenis')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* =========================================================================
         DIALOG: TAMBAH DOKUMEN BERKAS (1 PER 1)
         ========================================================================= */}
      <Dialog open={openAddDokumenDialog} onOpenChange={setOpenAddDokumenDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <FileSpreadsheet className="h-5 w-5 text-rose-500" />
              <span>{t('tree.addDokumenTitle')}</span>
            </DialogTitle>
            <DialogDescription className="text-xs">
              {t('tree.addDokumenDesc')}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                {t('tree.selectDokumen')}
              </label>
              {availableDokumenOptions.length === 0 ? (
                <div className="p-3 rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 text-xs flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{t('tree.allDokumenRegistered')}</span>
                </div>
              ) : (
                <Combobox
                  options={availableDokumenOptions}
                  value={selectedDokumenToAdd}
                  onChange={(val) => setSelectedDokumenToAdd(val)}
                  placeholder={t('common.select')}
                />
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                {t('tree.selectKategoriDoc')}
              </label>
              <select
                value={targetKategoriDoc}
                onChange={(e) =>
                  setTargetKategoriDoc(
                    e.target.value as
                      | 'untuk_cmaba_n_dan_d'
                      | 'untuk_cmaba_non_disabilitas'
                      | 'untuk_cmaba_disabilitas'
                  )
                }
                className="w-full h-9 rounded-xl border border-input bg-background px-3 py-1 text-xs shadow-2xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="untuk_cmaba_n_dan_d">{t('tree.berkasCommon')}</option>
                <option value="untuk_cmaba_non_disabilitas">{t('tree.berkasNonDis')}</option>
                <option value="untuk_cmaba_disabilitas">{t('tree.berkasDis')}</option>
              </select>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setOpenAddDokumenDialog(false)}
              className="text-xs cursor-pointer"
            >
              {t('tree.cancel')}
            </Button>
            <Button
              size="sm"
              onClick={handleAddDokumenSubmit}
              disabled={!selectedDokumenToAdd}
              className="text-xs cursor-pointer"
            >
              {t('tree.saveDokumen')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
