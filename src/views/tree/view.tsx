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
  Sparkles,
  Users,
  FileCheck2,
  FileSpreadsheet,
  Plus,
  FolderTree,
  ShieldCheck,
  CheckCircle2,
  Info,
  Code2,
  FileText,
  SlidersHorizontal,
  RefreshCw,
  Edit,
  Trash2,
  AlertCircle,
  Settings2,
  Check,
  X,
} from 'lucide-react';
import { toast } from 'sonner';

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
   Types Konfigurasi Gelombang Pendaftaran
   ========================================================================= */

export interface KuotaShiftItem {
  id_pilihan_shift: number;
  nama_shift: string;
  jumlah_pendaftar_mahasiswa_n: number; // Non-disabilitas
  jumlah_pendaftar_mahasiswa_d: number; // Disabilitas
}

export interface ProdiItem {
  id: string;
  nama_prodi: string;
  kode: string;
  kuota_shift: KuotaShiftItem[];
}

export interface PilihanJenisPendaftaranItem {
  id: number;
  nama_jenis: string;
  untuk_cmaba_non_disabilitas: boolean;
  untuk_cmaba_disabilitas: boolean;
}

export interface PilihanJalurPendaftaranItem {
  id: number;
  nama_jalur: string;
  untuk_cmaba_non_disabilitas: boolean;
  untuk_cmaba_disabilitas: boolean;
}

export interface BerkasRuleItem {
  id_berkas_pendaftaran: string;
  nama_berkas: string;
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

// Initial state data konfigurasi per gelombang
const DEFAULT_CONFIG: GelombangPendaftaranConfig = {
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
          jumlah_pendaftar_mahasiswa_n: 120,
          jumlah_pendaftar_mahasiswa_d: 15,
        },
        {
          id_pilihan_shift: 2,
          nama_shift: 'Reguler Malam (Shift 2)',
          jumlah_pendaftar_mahasiswa_n: 80,
          jumlah_pendaftar_mahasiswa_d: 10,
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
          jumlah_pendaftar_mahasiswa_n: 90,
          jumlah_pendaftar_mahasiswa_d: 10,
        },
      ],
    },
  ],
  pilihan_jenis_pendaftaran: [
    {
      id: 1,
      nama_jenis: 'Mahasiswa Baru Reguler',
      untuk_cmaba_non_disabilitas: true,
      untuk_cmaba_disabilitas: true,
    },
    {
      id: 2,
      nama_jenis: 'Pindahan / Transfer Kredit Antar Kampus',
      untuk_cmaba_non_disabilitas: true,
      untuk_cmaba_disabilitas: false,
    },
  ],
  pilihan_jalur_pendaftaran: [
    {
      id: 101,
      nama_jalur: 'Jalur Prestasi Akademik (SNBP / Rapor)',
      untuk_cmaba_non_disabilitas: true,
      untuk_cmaba_disabilitas: true,
    },
    {
      id: 102,
      nama_jalur: 'Jalur Beasiswa KIP Kuliah & Kemitraan',
      untuk_cmaba_non_disabilitas: true,
      untuk_cmaba_disabilitas: true,
    },
    {
      id: 104,
      nama_jalur: 'Jalur Afirmasi Khusus Disabilitas',
      untuk_cmaba_non_disabilitas: false,
      untuk_cmaba_disabilitas: true,
    },
  ],
  berkas_wajib: {
    untuk_cmaba_n_dan_d: [
      {
        id_berkas_pendaftaran: 'doc-ktp',
        nama_berkas: 'Kartu Tanda Penduduk (KTP) / Paspor',
        wajib_untuk_wni: true,
        wajib_untuk_wna: true,
        untuk_jenis_pendaftaran: [1, 2],
        untuk_jalur_pendaftaran: [101, 102, 104],
        untuk_pilihan_shift_pendaftaran: [1, 2],
      },
      {
        id_berkas_pendaftaran: 'doc-ijazah',
        nama_berkas: 'Ijazah / SKL Legalisir',
        wajib_untuk_wni: true,
        wajib_untuk_wna: true,
        untuk_jenis_pendaftaran: [1, 2],
        untuk_jalur_pendaftaran: [101, 102],
        untuk_pilihan_shift_pendaftaran: [1],
      },
    ],
    untuk_cmaba_non_disabilitas: [
      {
        id_berkas_pendaftaran: 'doc-sehat',
        nama_berkas: 'Surat Keterangan Sehat Bebas Narkoba',
        wajib_untuk_wni: true,
        wajib_untuk_wna: false,
        untuk_jenis_pendaftaran: [1],
        untuk_jalur_pendaftaran: [101],
        untuk_pilihan_shift_pendaftaran: [1],
      },
    ],
    untuk_cmaba_disabilitas: [
      {
        id_berkas_pendaftaran: 'doc-disabilitas',
        nama_berkas: 'Surat Asesmen Dokter Spesialis Disabilitas',
        wajib_untuk_wni: true,
        wajib_untuk_wna: true,
        untuk_jenis_pendaftaran: [1],
        untuk_jalur_pendaftaran: [104],
        untuk_pilihan_shift_pendaftaran: [1],
      },
    ],
  },
};

// Safe stringifier for inspector
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

  // Selected Gelombang filter
  const [selectedGelombangId, setSelectedGelombangId] = useState<string>('gel-1-2026-genap');

  // Master config state
  const [config, setConfig] = useState<GelombangPendaftaranConfig>(DEFAULT_CONFIG);

  // Inspector / Selected node state
  const [selectedNode, setSelectedNode] = useState<GenericTreeNode | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Dialog State: Tambah Prodi
  const [openAddProdiDialog, setOpenAddProdiDialog] = useState(false);
  const [selectedProdiToAdd, setSelectedProdiToAdd] = useState<string>('');

  // Dialog State: Tambah Shift ke Prodi
  const [openAddShiftDialog, setOpenAddShiftDialog] = useState(false);
  const [targetProdiForShift, setTargetProdiForShift] = useState<string>('');
  const [selectedShiftToAdd, setSelectedShiftToAdd] = useState<string>('');
  const [kuotaN, setKuotaN] = useState<number>(100);
  const [kuotaD, setKuotaD] = useState<number>(10);

  // Dialog State: Edit Kuota Shift
  const [openEditShiftDialog, setOpenEditShiftDialog] = useState(false);
  const [editShiftTarget, setEditShiftTarget] = useState<{
    prodiId: string;
    shiftId: number;
    shiftName: string;
    kuotaN: number;
    kuotaD: number;
  } | null>(null);

  // Dialog State: Tambah Jalur
  const [openAddJalurDialog, setOpenAddJalurDialog] = useState(false);
  const [selectedJalurToAdd, setSelectedJalurToAdd] = useState<string>('');
  const [jalurNonDisabilitas, setJalurNonDisabilitas] = useState<boolean>(true);
  const [jalurDisabilitas, setJalurDisabilitas] = useState<boolean>(true);

  // Dialog State: Edit Jalur
  const [openEditJalurDialog, setOpenEditJalurDialog] = useState(false);
  const [editJalurTarget, setEditJalurTarget] = useState<PilihanJalurPendaftaranItem | null>(null);

  // Dialog State: Edit Jenis Pendaftaran
  const [openEditJenisDialog, setOpenEditJenisDialog] = useState(false);
  const [editJenisTarget, setEditJenisTarget] = useState<PilihanJenisPendaftaranItem | null>(null);

  // List prodi yang belum ditambahkan di gelombang aktif
  const availableProdiOptions = useMemo(() => {
    const existingProdiIds = new Set(config.prodi.map((p) => p.id));
    return MASTER_PRODI_LIST.filter((p) => !existingProdiIds.has(p.id)).map((p) => ({
      label: `${p.nama} (${p.kode}) - ${p.fakultas}`,
      value: p.id,
    }));
  }, [config.prodi]);

  // List jalur yang belum ditambahkan di gelombang aktif
  const availableJalurOptions = useMemo(() => {
    const existingJalurIds = new Set(config.pilihan_jalur_pendaftaran.map((j) => j.id));
    return MASTER_JALUR_LIST.filter((j) => !existingJalurIds.has(j.id)).map((j) => ({
      label: `${j.nama}`,
      value: String(j.id),
    }));
  }, [config.pilihan_jalur_pendaftaran]);

  /* =========================================================================
     GENERATORS (Generate All dari Master API)
     ========================================================================= */

  // Generate SEMUA Prodi dari API (tanpa duplikat, mempertahankan kuota yang sudah ada)
  const handleGenerateAllProdi = () => {
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
            jumlah_pendaftar_mahasiswa_n: 80,
            jumlah_pendaftar_mahasiswa_d: 10,
          },
        ],
      };
    });

    setConfig((prev) => ({
      ...prev,
      prodi: updatedProdiList,
    }));
    toast.success(`Berhasil mengenerate seluruh ${MASTER_PRODI_LIST.length} Program Studi dari Master API!`);
  };

  // Generate SEMUA Jalur dari API
  const handleGenerateAllJalur = () => {
    const existingMap = new Map(config.pilihan_jalur_pendaftaran.map((j) => [j.id, j]));
    const updatedJalur: PilihanJalurPendaftaranItem[] = MASTER_JALUR_LIST.map((m) => {
      if (existingMap.has(m.id)) return existingMap.get(m.id)!;
      return {
        id: m.id,
        nama_jalur: m.nama,
        untuk_cmaba_non_disabilitas: m.id !== 104, // Afirmasi disabilitas default false untuk non
        untuk_cmaba_disabilitas: true,
      };
    });

    setConfig((prev) => ({
      ...prev,
      pilihan_jalur_pendaftaran: updatedJalur,
    }));
    toast.success(`Berhasil mengenerate seluruh ${MASTER_JALUR_LIST.length} Jalur Pendaftaran dari API!`);
  };

  // Generate SEMUA Jenis dari API
  const handleGenerateAllJenis = () => {
    const updatedJenis: PilihanJenisPendaftaranItem[] = MASTER_JENIS_LIST.map((m) => ({
      id: m.id,
      nama_jenis: m.nama,
      untuk_cmaba_non_disabilitas: true,
      untuk_cmaba_disabilitas: m.id !== 3,
    }));

    setConfig((prev) => ({
      ...prev,
      pilihan_jenis_pendaftaran: updatedJenis,
    }));
    toast.success(`Berhasil mengenerate ${MASTER_JENIS_LIST.length} Jenis Pendaftaran dari API!`);
  };

  /* =========================================================================
     PRODI ACTIONS (Add, Delete)
     Nama Prodi TIDAK BISA diedit/dicopy (nonEditable: true, nonDuplicable: true)
     ========================================================================= */

  const handleAddProdiSubmit = () => {
    if (!selectedProdiToAdd) {
      toast.error('Pilih Program Studi terlebih dahulu');
      return;
    }

    const master = MASTER_PRODI_LIST.find((p) => p.id === selectedProdiToAdd);
    if (!master) return;

    if (config.prodi.some((p) => p.id === master.id)) {
      toast.error(`Program Studi ${master.nama} sudah ada di gelombang ini!`);
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
          jumlah_pendaftar_mahasiswa_n: 100,
          jumlah_pendaftar_mahasiswa_d: 10,
        },
      ],
    };

    setConfig((prev) => ({
      ...prev,
      prodi: [...prev.prodi, newProdi],
    }));

    setSelectedProdiToAdd('');
    setOpenAddProdiDialog(false);
    toast.success(`Berhasil menambahkan prodi ${master.nama}`);
  };

  const handleDeleteProdi = (prodiId: string) => {
    setConfig((prev) => ({
      ...prev,
      prodi: prev.prodi.filter((p) => p.id !== prodiId),
    }));
    toast.success('Program Studi berhasil dihapus dari gelombang');
  };

  /* =========================================================================
     SHIFT KUOTA ACTIONS (Add Shift to Prodi, Edit Kuota N/D, Delete Shift)
     ========================================================================= */

  const handleOpenAddShift = (prodiId: string) => {
    setTargetProdiForShift(prodiId);
    setSelectedShiftToAdd('');
    setKuotaN(80);
    setKuotaD(10);
    setOpenAddShiftDialog(true);
  };

  const handleAddShiftSubmit = () => {
    if (!selectedShiftToAdd) {
      toast.error('Pilih shift terlebih dahulu');
      return;
    }

    const shiftMaster = MASTER_SHIFT_LIST.find((s) => String(s.id) === selectedShiftToAdd);
    if (!shiftMaster) return;

    setConfig((prev) => ({
      ...prev,
      prodi: prev.prodi.map((p) => {
        if (p.id !== targetProdiForShift) return p;
        if (p.kuota_shift.some((s) => s.id_pilihan_shift === shiftMaster.id)) {
          toast.error(`Shift ${shiftMaster.nama} sudah ada di prodi ini!`);
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
    toast.success(`Shift ${shiftMaster.nama} berhasil ditambahkan`);
  };

  const handleOpenEditShift = (prodiId: string, shift: KuotaShiftItem) => {
    setEditShiftTarget({
      prodiId,
      shiftId: shift.id_pilihan_shift,
      shiftName: shift.nama_shift,
      kuotaN: shift.jumlah_pendaftar_mahasiswa_n,
      kuotaD: shift.jumlah_pendaftar_mahasiswa_d,
    });
    setOpenEditShiftDialog(true);
  };

  const handleSaveEditShift = () => {
    if (!editShiftTarget) return;

    setConfig((prev) => ({
      ...prev,
      prodi: prev.prodi.map((p) => {
        if (p.id !== editShiftTarget.prodiId) return p;
        return {
          ...p,
          kuota_shift: p.kuota_shift.map((s) => {
            if (s.id_pilihan_shift !== editShiftTarget.shiftId) return s;
            return {
              ...s,
              jumlah_pendaftar_mahasiswa_n: Number(editShiftTarget.kuotaN) || 0,
              jumlah_pendaftar_mahasiswa_d: Number(editShiftTarget.kuotaD) || 0,
            };
          }),
        };
      }),
    }));

    setOpenEditShiftDialog(false);
    toast.success('Kuota pendaftar shift berhasil diperbarui');
  };

  const handleDeleteShift = (prodiId: string, shiftId: number) => {
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
    toast.success('Pilihan shift berhasil dihapus');
  };

  /* =========================================================================
     JALUR PENDAFTARAN ACTIONS (Add Jalur, Edit Status Disabilitas N/D, Delete)
     ========================================================================= */

  const handleAddJalurSubmit = () => {
    if (!selectedJalurToAdd) {
      toast.error('Pilih Jalur Pendaftaran terlebih dahulu');
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
      untuk_cmaba_non_disabilitas: jalurNonDisabilitas,
      untuk_cmaba_disabilitas: jalurDisabilitas,
    };

    setConfig((prev) => ({
      ...prev,
      pilihan_jalur_pendaftaran: [...prev.pilihan_jalur_pendaftaran, newJalur],
    }));

    setSelectedJalurToAdd('');
    setOpenAddJalurDialog(false);
    toast.success(`Jalur ${master.nama} berhasil ditambahkan`);
  };

  const handleOpenEditJalur = (jalur: PilihanJalurPendaftaranItem) => {
    setEditJalurTarget({ ...jalur });
    setOpenEditJalurDialog(true);
  };

  const handleSaveEditJalur = () => {
    if (!editJalurTarget) return;

    setConfig((prev) => ({
      ...prev,
      pilihan_jalur_pendaftaran: prev.pilihan_jalur_pendaftaran.map((j) =>
        j.id === editJalurTarget.id ? editJalurTarget : j
      ),
    }));

    setOpenEditJalurDialog(false);
    toast.success('Pengaturan akses jalur berhasil disimpan');
  };

  const handleDeleteJalur = (jalurId: number) => {
    setConfig((prev) => ({
      ...prev,
      pilihan_jalur_pendaftaran: prev.pilihan_jalur_pendaftaran.filter((j) => j.id !== jalurId),
    }));
    toast.success('Jalur pendaftaran berhasil dihapus');
  };

  /* =========================================================================
     JENIS PENDAFTARAN ACTIONS (Edit Status Disabilitas N/D)
     ========================================================================= */

  const handleOpenEditJenis = (jenis: PilihanJenisPendaftaranItem) => {
    setEditJenisTarget({ ...jenis });
    setOpenEditJenisDialog(true);
  };

  const handleSaveEditJenis = () => {
    if (!editJenisTarget) return;

    setConfig((prev) => ({
      ...prev,
      pilihan_jenis_pendaftaran: prev.pilihan_jenis_pendaftaran.map((j) =>
        j.id === editJenisTarget.id ? editJenisTarget : j
      ),
    }));

    setOpenEditJenisDialog(false);
    toast.success('Pengaturan jenis pendaftaran berhasil disimpan');
  };

  /* =========================================================================
     CONVERT CONFIG TO UNIVERSAL TREE DATA (Strictly Non-Editable Names for Master Data)
     ========================================================================= */

  const treeData = useMemo<GenericTreeNode[]>(() => {
    return [
      {
        id: 'root-gelombang',
        label: `${config.gelombang_nama} (${config.tahun_akademik} ${config.semester})`,
        subtitle: 'Konfigurasi Pendaftaran PMB Aktif',
        icon: <GraduationCap className="h-4 w-4 text-primary shrink-0" />,
        badge: (
          <Badge className="text-[10px] bg-primary/10 text-primary border-primary/20">
            Aktif
          </Badge>
        ),
        nonEditable: true,
        nonDuplicable: true,
        nonDeletable: true,
        children: [
          /* 1. Branch Program Studi */
          {
            id: 'branch-prodi',
            label: `Program Studi & Kuota Shift (${config.prodi.length} Prodi Terdaftar)`,
            subtitle: 'Daftar prodi aktif & kuota pendaftar N/D per shift',
            icon: <Layers className="h-4 w-4 text-amber-500 shrink-0" />,
            badge: (
              <Badge variant="outline" className="text-[9px] font-mono text-amber-600 dark:text-amber-400">
                {config.prodi.length} Prodi
              </Badge>
            ),
            nonEditable: true,
            nonDuplicable: true,
            nonDeletable: true,
            children: config.prodi.map((p) => ({
              id: `prodi-${p.id}`,
              label: p.nama_prodi,
              subtitle: `Kode: ${p.kode} • ${p.kuota_shift.length} Shift Aktif`,
              icon: <GraduationCap className="h-4 w-4 text-blue-500 shrink-0" />,
              badge: (
                <Badge variant="outline" className="font-mono text-[9px] text-muted-foreground">
                  {p.kode}
                </Badge>
              ),
              // Nama prodi TIDAK BISA diedit / diduplikat, hanya bisa dihapus
              nonEditable: true,
              nonDuplicable: true,
              nonDeletable: false,
              data: p,
              children: p.kuota_shift.map((shift) => ({
                id: `shift-${p.id}-${shift.id_pilihan_shift}`,
                label: shift.nama_shift,
                subtitle: `Kuota Non-Disabilitas (N): ${shift.jumlah_pendaftar_mahasiswa_n} | Disabilitas (D): ${shift.jumlah_pendaftar_mahasiswa_d}`,
                icon: <Clock className="h-3.5 w-3.5 text-emerald-500 shrink-0" />,
                badge: (
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-mono font-medium">
                      N: {shift.jumlah_pendaftar_mahasiswa_n}
                    </span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 font-mono font-medium">
                      D: {shift.jumlah_pendaftar_mahasiswa_d}
                    </span>
                  </div>
                ),
                nonEditable: true, // Edit kuota melalui form data kuota
                nonDuplicable: true,
                nonDeletable: false,
                data: {
                  prodiId: p.id,
                  prodiNama: p.nama_prodi,
                  ...shift,
                },
              })),
            })),
          },

          /* 2. Branch Pilihan Jalur Pendaftaran */
          {
            id: 'branch-jalur',
            label: `Pilihan Jalur Pendaftaran (${config.pilihan_jalur_pendaftaran.length} Jalur Aktif)`,
            subtitle: 'Jalur seleksi penerimaan & akses disabilitas',
            icon: <SlidersHorizontal className="h-4 w-4 text-emerald-500 shrink-0" />,
            badge: (
              <Badge variant="outline" className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400">
                {config.pilihan_jalur_pendaftaran.length} Jalur
              </Badge>
            ),
            nonEditable: true,
            nonDuplicable: true,
            nonDeletable: true,
            children: config.pilihan_jalur_pendaftaran.map((jalur) => ({
              id: `jalur-${jalur.id}`,
              label: jalur.nama_jalur,
              subtitle: `ID: ${jalur.id} • Akses Disabilitas: ${jalur.untuk_cmaba_disabilitas ? 'Aktif' : 'Non-Aktif'}`,
              icon: <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />,
              badge: (
                <div className="flex items-center gap-1 text-[9px] font-mono">
                  {jalur.untuk_cmaba_non_disabilitas ? (
                    <span className="px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
                      Non-Disabilitas: Ya
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                      Non-Disabilitas: Tidak
                    </span>
                  )}
                  {jalur.untuk_cmaba_disabilitas ? (
                    <span className="px-1.5 py-0.5 rounded bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400">
                      Disabilitas: Ya
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                      Disabilitas: Tidak
                    </span>
                  )}
                </div>
              ),
              nonEditable: true, // Diedit melalui form akses
              nonDuplicable: true,
              nonDeletable: false,
              data: jalur,
            })),
          },

          /* 3. Branch Pilihan Jenis Pendaftaran */
          {
            id: 'branch-jenis',
            label: `Pilihan Jenis Pendaftaran (${config.pilihan_jenis_pendaftaran.length} Jenis)`,
            subtitle: 'Kategori status pendaftaran calon mahasiswa',
            icon: <Users className="h-4 w-4 text-purple-500 shrink-0" />,
            badge: (
              <Badge variant="outline" className="text-[9px] font-mono text-purple-600 dark:text-purple-400">
                {config.pilihan_jenis_pendaftaran.length} Jenis
              </Badge>
            ),
            nonEditable: true,
            nonDuplicable: true,
            nonDeletable: true,
            children: config.pilihan_jenis_pendaftaran.map((jenis) => ({
              id: `jenis-${jenis.id}`,
              label: jenis.nama_jenis,
              subtitle: `ID: ${jenis.id}`,
              icon: <CheckCircle2 className="h-3.5 w-3.5 text-purple-500 shrink-0" />,
              badge: (
                <div className="flex items-center gap-1 text-[9px] font-mono">
                  {jenis.untuk_cmaba_non_disabilitas && (
                    <span className="px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
                      Reguler
                    </span>
                  )}
                  {jenis.untuk_cmaba_disabilitas && (
                    <span className="px-1.5 py-0.5 rounded bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400">
                      Disabilitas
                    </span>
                  )}
                </div>
              ),
              nonEditable: true,
              nonDuplicable: true,
              nonDeletable: false,
              data: jenis,
            })),
          },

          /* 4. Branch Persyaratan Berkas Wajib */
          {
            id: 'branch-berkas',
            label: 'Persyaratan Dokumen & Berkas Wajib',
            subtitle: 'Matriks berkas unggah pendaftaran',
            icon: <FileCheck2 className="h-4 w-4 text-rose-500 shrink-0" />,
            nonEditable: true,
            nonDuplicable: true,
            nonDeletable: true,
            children: [
              {
                id: 'berkas-nd',
                label: `Wajib Untuk CMABA Non-Disabilitas & Disabilitas (${config.berkas_wajib.untuk_cmaba_n_dan_d.length} Dokumen)`,
                icon: <FileText className="h-3.5 w-3.5 text-blue-500 shrink-0" />,
                nonEditable: true,
                nonDuplicable: true,
                nonDeletable: true,
                children: config.berkas_wajib.untuk_cmaba_n_dan_d.map((b) => ({
                  id: `berkas-${b.id_berkas_pendaftaran}`,
                  label: b.nama_berkas,
                  subtitle: `WNI: ${b.wajib_untuk_wni ? 'Wajib' : 'Opsional'} | WNA: ${b.wajib_untuk_wna ? 'Wajib' : 'Opsional'}`,
                  icon: <FileSpreadsheet className="h-3.5 w-3.5 text-muted-foreground shrink-0" />,
                  nonEditable: true,
                  nonDuplicable: true,
                  data: b,
                })),
              },
              {
                id: 'berkas-disabilitas',
                label: `Khusus CMABA Disabilitas (${config.berkas_wajib.untuk_cmaba_disabilitas.length} Dokumen)`,
                icon: <ShieldCheck className="h-3.5 w-3.5 text-purple-500 shrink-0" />,
                nonEditable: true,
                nonDuplicable: true,
                nonDeletable: true,
                children: config.berkas_wajib.untuk_cmaba_disabilitas.map((b) => ({
                  id: `berkas-${b.id_berkas_pendaftaran}`,
                  label: b.nama_berkas,
                  subtitle: 'Asesmen medis / fasilitas akomodasi khusus',
                  icon: <ShieldCheck className="h-3.5 w-3.5 text-purple-500 shrink-0" />,
                  nonEditable: true,
                  nonDuplicable: true,
                  data: b,
                })),
              },
            ],
          },
        ],
      },
    ];
  }, [config]);

  // Handler custom action buttons di setiap row tree
  const renderRowActions = ({ node }: { node: GenericTreeNode }) => {
    // 1. Aksi di branch prodi: Tambah Prodi & Generate All Prodi
    if (node.id === 'branch-prodi') {
      return (
        <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
          <Button
            size="sm"
            variant="outline"
            onClick={handleGenerateAllProdi}
            className="h-6 text-[10px] px-2 rounded-md border-amber-300 dark:border-amber-800 text-amber-600 dark:text-amber-400 hover:bg-amber-50 cursor-pointer"
            title="Generate Semua Prodi dari API"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Generate Semua Prodi
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
            Tambah Prodi
          </Button>
        </div>
      );
    }

    // 2. Aksi di branch jalur: Tambah Jalur & Generate All Jalur
    if (node.id === 'branch-jalur') {
      return (
        <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
          <Button
            size="sm"
            variant="outline"
            onClick={handleGenerateAllJalur}
            className="h-6 text-[10px] px-2 rounded-md border-emerald-300 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 cursor-pointer"
            title="Generate Semua Jalur dari API"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Generate Semua Jalur
          </Button>

          <Button
            size="sm"
            onClick={() => {
              setSelectedJalurToAdd('');
              setJalurNonDisabilitas(true);
              setJalurDisabilitas(true);
              setOpenAddJalurDialog(true);
            }}
            className="h-6 text-[10px] px-2 rounded-md cursor-pointer"
          >
            <Plus className="h-3 w-3 mr-1" />
            Tambah Jalur
          </Button>
        </div>
      );
    }

    // 3. Aksi di branch jenis: Generate All Jenis
    if (node.id === 'branch-jenis') {
      return (
        <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
          <Button
            size="sm"
            variant="outline"
            onClick={handleGenerateAllJenis}
            className="h-6 text-[10px] px-2 rounded-md border-purple-300 dark:border-purple-800 text-purple-600 dark:text-purple-400 hover:bg-purple-50 cursor-pointer"
            title="Generate Semua Jenis dari API"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Generate Semua Jenis
          </Button>
        </div>
      );
    }

    // 4. Aksi di baris Prodi: Tambah Shift ke Prodi ini, Hapus Prodi
    if (node.id.startsWith('prodi-')) {
      const prodiId = node.data?.id;
      return (
        <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleOpenAddShift(prodiId)}
            className="h-6 text-[10px] px-2 rounded-md cursor-pointer hover:bg-accent"
            title="Tambah Shift Perkuliahan ke Prodi ini"
          >
            <Plus className="h-3 w-3 mr-1 text-emerald-500" />
            Tambah Shift
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDeleteProdi(prodiId)}
            className="h-6 w-6 text-destructive/80 hover:text-destructive hover:bg-destructive/10 cursor-pointer"
            title="Hapus Prodi dari Gelombang"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      );
    }

    // 5. Aksi di baris Shift Kuota: Edit kuota N/D, Hapus Shift
    if (node.id.startsWith('shift-')) {
      const data = node.data;
      return (
        <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              handleOpenEditShift(data.prodiId, {
                id_pilihan_shift: data.id_pilihan_shift,
                nama_shift: data.nama_shift,
                jumlah_pendaftar_mahasiswa_n: data.jumlah_pendaftar_mahasiswa_n,
                jumlah_pendaftar_mahasiswa_d: data.jumlah_pendaftar_mahasiswa_d,
              })
            }
            className="h-6 text-[10px] px-2 rounded-md cursor-pointer hover:bg-accent"
            title="Ubah Kuota Mahasiswa N & D"
          >
            <Edit className="h-3 w-3 mr-1 text-blue-500" />
            Ubah Kuota
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDeleteShift(data.prodiId, data.id_pilihan_shift)}
            className="h-6 w-6 text-destructive/80 hover:text-destructive hover:bg-destructive/10 cursor-pointer"
            title="Hapus Shift"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      );
    }

    // 6. Aksi di baris Jalur Pendaftaran: Edit Akses N/D, Hapus Jalur
    if (node.id.startsWith('jalur-')) {
      const jalur = node.data as PilihanJalurPendaftaranItem;
      return (
        <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleOpenEditJalur(jalur)}
            className="h-6 text-[10px] px-2 rounded-md cursor-pointer hover:bg-accent"
            title="Ubah Status Disabilitas / Non-Disabilitas"
          >
            <Settings2 className="h-3 w-3 mr-1 text-emerald-500" />
            Akses Disabilitas
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDeleteJalur(jalur.id)}
            className="h-6 w-6 text-destructive/80 hover:text-destructive hover:bg-destructive/10 cursor-pointer"
            title="Hapus Jalur"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      );
    }

    // 7. Aksi di baris Jenis Pendaftaran: Edit Akses N/D
    if (node.id.startsWith('jenis-')) {
      const jenis = node.data as PilihanJenisPendaftaranItem;
      return (
        <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleOpenEditJenis(jenis)}
            className="h-6 text-[10px] px-2 rounded-md cursor-pointer hover:bg-accent"
            title="Ubah Status Disabilitas / Non-Disabilitas"
          >
            <Settings2 className="h-3 w-3 mr-1 text-purple-500" />
            Ubah Akses
          </Button>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Gelombang Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <FolderTree className="h-5 w-5 text-primary" />
              <span>Hierarki Konfigurasi Gelombang Pendaftaran</span>
            </h1>
            <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] font-mono">
              Live Master Data API
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Data hierarki dinamis terhubung ke Master Data API. Mendukung aksi <strong>Generate Semua</strong>, penambahan item dengan autocomplete Combobox anti-duplikasi, pengaturan kuota shift (N & D), serta aktivasi disabilitas.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Combobox pilihan Gelombang dari API */}
          <div className="w-64">
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
                  toast.info(`Memuat konfigurasi untuk ${gelItem.nama}`);
                }
              }}
              placeholder="Pilih Gelombang..."
            />
          </div>
        </div>
      </div>

      {/* Tampilan TreeView Full-Width (Grid 1 Lebar) Sesuai Permintaan User */}
      <div className="w-full space-y-4">
        <TreeRoot
          data={treeData}
          selectedId={selectedNode?.id}
          onSelect={(node) => setSelectedNode(node)}
          selectedIds={selectedIds}
          onMultiSelectChange={(ids) => setSelectedIds(ids)}
          defaultExpandedIds={['root-gelombang', 'branch-prodi', 'branch-jalur', 'branch-jenis']}
          editable={true}
          multiSelect={true}
          dragAndDrop={true}
          renderActions={renderRowActions}
        >
          {/* Header Toolbar */}
          <TreeHeader
            title={
              <div className="flex items-center gap-2">
                <span className="font-semibold text-xs text-foreground">
                  {config.gelombang_nama} - Matriks Konfigurasi PMB
                </span>
                <Badge variant="secondary" className="font-mono text-[9px]">
                  Master API Synced
                </Badge>
              </div>
            }
            description="Nama Program Studi & Master Data terlindungi dari edit manual / duplikasi. Gunakan tombol 'Generate Semua' atau 'Tambah' untuk menambah item baru."
            searchPlaceholder="Cari program studi, shift perkuliahan, jalur pendaftaran, atau berkas..."
            extraActions={
              <div className="flex items-center gap-1.5">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleGenerateAllProdi}
                  className="h-8 text-xs px-2.5 rounded-lg border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-300 hover:bg-amber-50 cursor-pointer"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Generate Semua Prodi
                </Button>

                <Button
                  size="sm"
                  onClick={() => {
                    setSelectedProdiToAdd('');
                    setOpenAddProdiDialog(true);
                  }}
                  className="h-8 text-xs px-3 rounded-lg shadow-2xs cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Tambah Prodi
                </Button>
              </div>
            }
          />

          {/* Tree Content List */}
          <TreeContent maxHeight="max-h-[680px]" />

          {/* Tree Footer */}
          <TreeFooter />
        </TreeRoot>

        {/* Selected Node Details & Quick Inspector Footer */}
        {selectedNode && (
          <Card className="rounded-2xl border-border/70 shadow-xs bg-muted/20">
            <CardHeader className="pb-2.5 pt-3.5 px-4 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xs font-semibold flex items-center gap-2">
                  <Info className="h-4 w-4 text-primary" />
                  <span>Detail Elemen Terpilih: {selectedNode.label}</span>
                  <Badge variant="outline" className="text-[9px] font-mono">
                    {selectedNode.id}
                  </Badge>
                </CardTitle>
                <CardDescription className="text-[11px] mt-0.5">
                  {typeof selectedNode.subtitle === 'string'
                    ? selectedNode.subtitle
                    : 'Elemen konfigurasi gelombang pendaftaran'}
                </CardDescription>
              </div>

              {selectedNode.data && (
                <Badge variant="secondary" className="font-mono text-[10px]">
                  Payload Ready
                </Badge>
              )}
            </CardHeader>

            {selectedNode.data && (
              <CardContent className="pt-0 px-4 pb-3">
                <pre className="p-2.5 rounded-lg bg-background text-[10px] font-mono overflow-x-auto text-foreground/90 border border-border/60">
                  {safeStringify(selectedNode.data)}
                </pre>
              </CardContent>
            )}
          </Card>
        )}
      </div>

      {/* =========================================================================
         DIALOG: TAMBAH PRODI (DENGAN AUTOCOMPLETE COMBOBOX & VALIDASI ANTI-DUPLIKAT)
         ========================================================================= */}
      <Dialog open={openAddProdiDialog} onOpenChange={setOpenAddProdiDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <GraduationCap className="h-5 w-5 text-primary" />
              <span>Tambah Program Studi ke Gelombang</span>
            </DialogTitle>
            <DialogDescription className="text-xs">
              Pilih program studi dari Master API. Program studi yang sudah terdaftar tidak akan muncul kembali untuk mencegah duplikasi.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Pilih Program Studi (Autocomplete):
              </label>
              {availableProdiOptions.length === 0 ? (
                <div className="p-3 rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 text-xs flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>Semua Program Studi dari Master API sudah terdaftar pada gelombang ini!</span>
                </div>
              ) : (
                <Combobox
                  options={availableProdiOptions}
                  value={selectedProdiToAdd}
                  onChange={(val) => setSelectedProdiToAdd(val)}
                  placeholder="Ketik untuk mencari nama prodi atau kode..."
                />
              )}
            </div>

            <div className="p-3 rounded-lg bg-muted/60 text-muted-foreground text-[11px] leading-relaxed">
              Program studi yang ditambahkan otomatis akan dibuatkan shift default (Reguler Pagi). Anda dapat menambahkan shift lainnya nanti.
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setOpenAddProdiDialog(false)}
              className="text-xs cursor-pointer"
            >
              Batal
            </Button>
            <Button
              size="sm"
              onClick={handleAddProdiSubmit}
              disabled={!selectedProdiToAdd}
              className="text-xs cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              Tambah ke Gelombang
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* =========================================================================
         DIALOG: TAMBAH SHIFT KE PRODI (DENGAN MASTER SHIFT API & KUOTA N/D)
         ========================================================================= */}
      <Dialog open={openAddShiftDialog} onOpenChange={setOpenAddShiftDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <Clock className="h-5 w-5 text-emerald-500" />
              <span>Tambah Shift Perkuliahan</span>
            </DialogTitle>
            <DialogDescription className="text-xs">
              Pilih shift perkuliahan dari Master API dan tetapkan kuota penerimaan untuk mahasiswa Non-Disabilitas & Disabilitas.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Pilihan Shift Perkuliahan:
              </label>
              <Combobox
                options={MASTER_SHIFT_LIST.map((s) => ({
                  label: `${s.nama} (${s.jam})`,
                  value: String(s.id),
                }))}
                value={selectedShiftToAdd}
                onChange={(val) => setSelectedShiftToAdd(val)}
                placeholder="Pilih shift perkuliahan..."
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Kuota Non-Disabilitas (N):
                </label>
                <Input
                  type="number"
                  min="0"
                  value={kuotaN}
                  onChange={(e) => setKuotaN(Number(e.target.value))}
                  className="h-8 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Kuota Disabilitas (D):
                </label>
                <Input
                  type="number"
                  min="0"
                  value={kuotaD}
                  onChange={(e) => setKuotaD(Number(e.target.value))}
                  className="h-8 text-xs"
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
              Batal
            </Button>
            <Button
              size="sm"
              onClick={handleAddShiftSubmit}
              disabled={!selectedShiftToAdd}
              className="text-xs cursor-pointer"
            >
              Simpan Shift
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* =========================================================================
         DIALOG: UBAH KUOTA SHIFT (EDIT KUOTA N & D)
         ========================================================================= */}
      <Dialog open={openEditShiftDialog} onOpenChange={setOpenEditShiftDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <Edit className="h-5 w-5 text-blue-500" />
              <span>Ubah Kuota Pendaftar Shift</span>
            </DialogTitle>
            <DialogDescription className="text-xs">
              Ubah alokasi kuota penerimaan mahasiswa Non-Disabilitas (N) dan Disabilitas (D) untuk shift{' '}
              <strong>{editShiftTarget?.shiftName}</strong>.
            </DialogDescription>
          </DialogHeader>

          {editShiftTarget && (
            <div className="space-y-4 py-2 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Kuota Non-Disabilitas (N):
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={editShiftTarget.kuotaN}
                    onChange={(e) =>
                      setEditShiftTarget({
                        ...editShiftTarget,
                        kuotaN: Number(e.target.value),
                      })
                    }
                    className="h-8 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Kuota Disabilitas (D):
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={editShiftTarget.kuotaD}
                    onChange={(e) =>
                      setEditShiftTarget({
                        ...editShiftTarget,
                        kuotaD: Number(e.target.value),
                      })
                    }
                    className="h-8 text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setOpenEditShiftDialog(false)}
              className="text-xs cursor-pointer"
            >
              Batal
            </Button>
            <Button size="sm" onClick={handleSaveEditShift} className="text-xs cursor-pointer">
              Simpan Perubahan
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
              <span>Tambah Jalur Pendaftaran</span>
            </DialogTitle>
            <DialogDescription className="text-xs">
              Pilih jalur seleksi dari Master API dan tentukan hak akses pendaftaran disabilitas.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Pilih Jalur Seleksi:
              </label>
              {availableJalurOptions.length === 0 ? (
                <div className="p-3 rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 text-xs">
                  Semua Jalur Pendaftaran sudah terdaftar pada gelombang ini.
                </div>
              ) : (
                <Combobox
                  options={availableJalurOptions}
                  value={selectedJalurToAdd}
                  onChange={(val) => setSelectedJalurToAdd(val)}
                  placeholder="Pilih Jalur Pendaftaran..."
                />
              )}
            </div>

            <div className="space-y-2 pt-2 border-t border-border/50">
              <label className="text-xs font-semibold text-foreground block">
                Hak Akses Jalur:
              </label>

              <div className="flex items-center justify-between p-2.5 rounded-lg border border-border/60 bg-muted/20">
                <span>Dapat dipilih oleh Calon Non-Disabilitas</span>
                <input
                  type="checkbox"
                  checked={jalurNonDisabilitas}
                  onChange={(e) => setJalurNonDisabilitas(e.target.checked)}
                  className="h-4 w-4 rounded text-primary focus:ring-primary"
                />
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg border border-border/60 bg-muted/20">
                <span>Dapat dipilih oleh Calon Disabilitas</span>
                <input
                  type="checkbox"
                  checked={jalurDisabilitas}
                  onChange={(e) => setJalurDisabilitas(e.target.checked)}
                  className="h-4 w-4 rounded text-primary focus:ring-primary"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setOpenAddJalurDialog(false)}
              className="text-xs cursor-pointer"
            >
              Batal
            </Button>
            <Button
              size="sm"
              onClick={handleAddJalurSubmit}
              disabled={!selectedJalurToAdd}
              className="text-xs cursor-pointer"
            >
              Simpan Jalur
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* =========================================================================
         DIALOG: UBAH AKSES JALUR PENDAFTARAN (NON-DISABILITAS / DISABILITAS)
         ========================================================================= */}
      <Dialog open={openEditJalurDialog} onOpenChange={setOpenEditJalurDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <Settings2 className="h-5 w-5 text-emerald-500" />
              <span>Pengaturan Akses Jalur Pendaftaran</span>
            </DialogTitle>
            <DialogDescription className="text-xs">
              Ubah konfigurasi hak akses disabilitas untuk jalur{' '}
              <strong>{editJalurTarget?.nama_jalur}</strong>.
            </DialogDescription>
          </DialogHeader>

          {editJalurTarget && (
            <div className="space-y-3 py-2 text-xs">
              <div className="flex items-center justify-between p-3 rounded-lg border border-border/60 bg-muted/20">
                <div>
                  <span className="font-semibold text-foreground block">
                    Calon Mahasiswa Non-Disabilitas
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    Izinkan pendaftar umum memilih jalur ini
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={editJalurTarget.untuk_cmaba_non_disabilitas}
                  onChange={(e) =>
                    setEditJalurTarget({
                      ...editJalurTarget,
                      untuk_cmaba_non_disabilitas: e.target.checked,
                    })
                  }
                  className="h-4 w-4 rounded text-primary focus:ring-primary cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-border/60 bg-muted/20">
                <div>
                  <span className="font-semibold text-foreground block">
                    Calon Mahasiswa Disabilitas
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    Izinkan pendaftar berkebutuhan khusus memilih jalur ini
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={editJalurTarget.untuk_cmaba_disabilitas}
                  onChange={(e) =>
                    setEditJalurTarget({
                      ...editJalurTarget,
                      untuk_cmaba_disabilitas: e.target.checked,
                    })
                  }
                  className="h-4 w-4 rounded text-primary focus:ring-primary cursor-pointer"
                />
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setOpenEditJalurDialog(false)}
              className="text-xs cursor-pointer"
            >
              Batal
            </Button>
            <Button size="sm" onClick={handleSaveEditJalur} className="text-xs cursor-pointer">
              Simpan Akses
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* =========================================================================
         DIALOG: UBAH AKSES JENIS PENDAFTARAN
         ========================================================================= */}
      <Dialog open={openEditJenisDialog} onOpenChange={setOpenEditJenisDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <Settings2 className="h-5 w-5 text-purple-500" />
              <span>Pengaturan Akses Jenis Pendaftaran</span>
            </DialogTitle>
            <DialogDescription className="text-xs">
              Ubah konfigurasi hak akses untuk kategori{' '}
              <strong>{editJenisTarget?.nama_jenis}</strong>.
            </DialogDescription>
          </DialogHeader>

          {editJenisTarget && (
            <div className="space-y-3 py-2 text-xs">
              <div className="flex items-center justify-between p-3 rounded-lg border border-border/60 bg-muted/20">
                <div>
                  <span className="font-semibold text-foreground block">
                    Calon Mahasiswa Non-Disabilitas
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    Aktifkan untuk calon reguler
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={editJenisTarget.untuk_cmaba_non_disabilitas}
                  onChange={(e) =>
                    setEditJenisTarget({
                      ...editJenisTarget,
                      untuk_cmaba_non_disabilitas: e.target.checked,
                    })
                  }
                  className="h-4 w-4 rounded text-primary focus:ring-primary cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-border/60 bg-muted/20">
                <div>
                  <span className="font-semibold text-foreground block">
                    Calon Mahasiswa Disabilitas
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    Aktifkan untuk calon berkebutuhan khusus
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={editJenisTarget.untuk_cmaba_disabilitas}
                  onChange={(e) =>
                    setEditJenisTarget({
                      ...editJenisTarget,
                      untuk_cmaba_disabilitas: e.target.checked,
                    })
                  }
                  className="h-4 w-4 rounded text-primary focus:ring-primary cursor-pointer"
                />
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setOpenEditJenisDialog(false)}
              className="text-xs cursor-pointer"
            >
              Batal
            </Button>
            <Button size="sm" onClick={handleSaveEditJenis} className="text-xs cursor-pointer">
              Simpan Akses
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
