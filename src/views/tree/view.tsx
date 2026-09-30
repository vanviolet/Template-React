import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from '@/components/ui/toast';
import { Combobox } from '@/components/ui/combobox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FolderTree, Info, X } from 'lucide-react';
import {
  GelombangPendaftaranConfig,
  TreeNodeItem,
  TreeFilterState,
  TreeTabFilter,
  ProdiItem,
  KuotaShiftItem,
  PilihanJalurPendaftaranItem,
  PilihanJenisPendaftaranItem,
  BerkasRuleItem,
} from './types';
import { INITIAL_CONFIG } from './constants';
import {
  buildGelombangTree,
  filterTree,
  getAllNodeIds,
} from './utils';
import { FilterTabs } from './filter.tabs';
import { TreeAction } from './action';
import { TreeList } from './tree.list';
import { GraphPreview } from './graph.preview';
import {
  BatchKuotaModal,
  AddProdiDialog,
  AddShiftDialog,
  EditKuotaDialog,
  AddJalurDialog,
  AddJenisDialog,
  AddDokumenDialog,
  ConfirmDialog,
} from './dialog';
import {
  MASTER_GELOMBANG_LIST,
  MASTER_PRODI_LIST,
  MASTER_SHIFT_LIST,
  MASTER_JALUR_LIST,
  MASTER_JENIS_LIST,
  MASTER_BERKAS_LIST,
} from '@/services/pmb.api.dummy';

export default function TreeViewPage() {
  const { t } = useTranslation();

  // Selected Gelombang
  const [selectedGelombangId, setSelectedGelombangId] = useState<string>('gel-1-2026-genap');

  // Master Configuration State
  const [config, setConfig] = useState<GelombangPendaftaranConfig>(INITIAL_CONFIG);

  // Expanded Nodes (Default expand Root and Branches)
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    () => new Set(['root-gelombang', 'branch-prodi', 'branch-jalur', 'branch-jenis', 'branch-berkas', 'berkas-cat-nd', 'prodi-ti-s1'])
  );

  // Selected node for Inspector
  const [selectedNode, setSelectedNode] = useState<TreeNodeItem | null>(null);

  // Filters State
  const [filters, setFilters] = useState<TreeFilterState>({
    tab: 'all',
    search: '',
    viewMode: 'tree',
  });

  // Modal States
  const [batchKuotaModal, setBatchKuotaModal] = useState<{
    open: boolean;
    prodiId: string | null;
    prodiName: string;
  }>({
    open: false,
    prodiId: null,
    prodiName: '',
  });

  const [openAddProdi, setOpenAddProdi] = useState(false);

  const [addShiftModal, setAddShiftModal] = useState<{
    open: boolean;
    prodiId: string;
    prodiName: string;
  }>({
    open: false,
    prodiId: '',
    prodiName: '',
  });

  const [editShiftModal, setEditShiftModal] = useState<{
    open: boolean;
    prodiId: string;
    shiftId: number;
    currentN: number;
    currentD: number;
  }>({
    open: false,
    prodiId: '',
    shiftId: 0,
    currentN: 0,
    currentD: 0,
  });

  const [openAddJalur, setOpenAddJalur] = useState(false);
  const [openAddJenis, setOpenAddJenis] = useState(false);
  const [openAddDokumen, setOpenAddDokumen] = useState(false);

  // Confirmation Modal
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    description: string;
    actionLabel?: string;
    actionVariant?: 'default' | 'destructive';
    onConfirm: () => void;
  }>({
    open: false,
    title: '',
    description: '',
    actionLabel: 'Ya, Lanjutkan',
    actionVariant: 'default',
    onConfirm: () => {},
  });

  const openConfirmation = (
    title: string,
    description: string,
    onConfirm: () => void,
    actionLabel = 'Ya, Lanjutkan',
    actionVariant: 'default' | 'destructive' = 'default'
  ) => {
    setConfirmDialog({
      open: true,
      title,
      description,
      actionLabel,
      actionVariant,
      onConfirm,
    });
  };

  // Convert raw config to modern Card Tree
  const fullTree = useMemo(() => buildGelombangTree(config), [config]);

  // Filter tree
  const filteredTree = useMemo(() => filterTree(fullTree, filters), [fullTree, filters]);

  // Compute counts for tabs
  const tabCounts = useMemo(() => {
    const totalBerkas =
      config.berkas_wajib.untuk_cmaba_n_dan_d.length +
      config.berkas_wajib.untuk_cmaba_non_disabilitas.length +
      config.berkas_wajib.untuk_cmaba_disabilitas.length;

    let totalShift = 0;
    config.prodi.forEach((p) => {
      totalShift += p.kuota_shift.length;
    });

    return {
      all: config.prodi.length + totalShift + config.pilihan_jalur_pendaftaran.length + config.pilihan_jenis_pendaftaran.length + totalBerkas,
      prodi: config.prodi.length,
      jalur: config.pilihan_jalur_pendaftaran.length,
      jenis: config.pilihan_jenis_pendaftaran.length,
      berkas: totalBerkas,
    };
  }, [config]);

  const allNodeIds = useMemo(() => getAllNodeIds(fullTree), [fullTree]);
  const isAllExpanded = expandedIds.size >= allNodeIds.length && allNodeIds.length > 0;

  // Expand / collapse handlers
  const handleToggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleExpandAll = () => setExpandedIds(new Set(allNodeIds));
  const handleCollapseAll = () => setExpandedIds(new Set());

  /* =========================================================================
     BATCH & MUTATION HANDLERS
     ========================================================================= */

  const handleApplyBatchKuota = (prodiId: string | null, kuotaN: number, kuotaD: number) => {
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

    toast.success(
      prodiId === null
        ? `Batch kuota diterapkan ke semua prodi (N: ${n}, D: ${d})`
        : `Batch kuota diterapkan ke prodi ${batchKuotaModal.prodiName} (N: ${n}, D: ${d})`
    );
  };

  const handleGenerateAllProdi = () => {
    openConfirmation(
      'Generate Semua Program Studi?',
      `Tindakan ini akan mengenerate seluruh ${MASTER_PRODI_LIST.length} Prodi dari Master Data API dengan kuota default 0.`,
      () => {
        const existingMap = new Map(config.prodi.map((p) => [p.id, p]));
        const defaultShift = MASTER_SHIFT_LIST[0];

        const updated: ProdiItem[] = MASTER_PRODI_LIST.map((m) => {
          if (existingMap.has(m.id)) return existingMap.get(m.id)!;
          return {
            id: m.id,
            nama_prodi: m.nama,
            kode: m.kode,
            fakultas: m.fakultas,
            kuota_shift: [
              {
                id_pilihan_shift: defaultShift.id,
                nama_shift: defaultShift.nama,
                jam: defaultShift.jam,
                jumlah_pendaftar_mahasiswa_n: 0,
                jumlah_pendaftar_mahasiswa_d: 0,
              },
            ],
          };
        });

        setConfig((prev) => ({ ...prev, prodi: updated }));
        toast.success('Seluruh program studi berhasil digenerate');
      }
    );
  };

  const handleGenerateAllShifts = () => {
    if (config.prodi.length === 0) {
      toast.error('Belum ada program studi terdaftar.');
      return;
    }
    openConfirmation(
      'Generate Semua Shift Perkuliahan?',
      `Tindakan ini akan menambahkan seluruh ${MASTER_SHIFT_LIST.length} shift Master API ke semua prodi.`,
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
                jam: m.jam,
                jumlah_pendaftar_mahasiswa_n: 0,
                jumlah_pendaftar_mahasiswa_d: 0,
              };
            });
            return { ...p, kuota_shift: fullShifts };
          }),
        }));
        toast.success('Semua shift berhasil digenerate');
      }
    );
  };

  const handleGenShiftProdi = (prodiId: string, prodiName: string) => {
    openConfirmation(
      `Generate Shift untuk ${prodiName}?`,
      `Seluruh ${MASTER_SHIFT_LIST.length} pilihan shift Master API akan ditambahkan ke ${prodiName}.`,
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
                jam: m.jam,
                jumlah_pendaftar_mahasiswa_n: 0,
                jumlah_pendaftar_mahasiswa_d: 0,
              };
            });
            return { ...p, kuota_shift: fullShifts };
          }),
        }));
        toast.success(`Shift berhasil digenerate untuk ${prodiName}`);
      }
    );
  };

  const handleGenerateAllJalur = () => {
    openConfirmation(
      'Generate Semua Jalur Pendaftaran?',
      `Tindakan ini akan mengenerate seluruh ${MASTER_JALUR_LIST.length} Jalur Pendaftaran Master API.`,
      () => {
        const existingMap = new Map(config.pilihan_jalur_pendaftaran.map((j) => [j.id, j]));
        const updated: PilihanJalurPendaftaranItem[] = MASTER_JALUR_LIST.map((m) => {
          if (existingMap.has(m.id)) return existingMap.get(m.id)!;
          return {
            id: m.id,
            nama_jalur: m.nama,
            deskripsi: m.deskripsi,
            untuk_cmaba_non_disabilitas: true,
            untuk_cmaba_disabilitas: true,
          };
        });
        setConfig((prev) => ({ ...prev, pilihan_jalur_pendaftaran: updated }));
        toast.success('Seluruh jalur berhasil digenerate');
      }
    );
  };

  const handleGenerateAllJenis = () => {
    openConfirmation(
      'Generate Semua Jenis Pendaftaran?',
      `Tindakan ini akan mengenerate seluruh ${MASTER_JENIS_LIST.length} Jenis Pendaftaran Master API.`,
      () => {
        const existingMap = new Map(config.pilihan_jenis_pendaftaran.map((j) => [j.id, j]));
        const updated: PilihanJenisPendaftaranItem[] = MASTER_JENIS_LIST.map((m) => {
          if (existingMap.has(m.id)) return existingMap.get(m.id)!;
          return {
            id: m.id,
            nama_jenis: m.nama,
            deskripsi: m.deskripsi,
            untuk_cmaba_non_disabilitas: true,
            untuk_cmaba_disabilitas: true,
          };
        });
        setConfig((prev) => ({ ...prev, pilihan_jenis_pendaftaran: updated }));
        toast.success('Seluruh jenis berhasil digenerate');
      }
    );
  };

  const handleGenerateAllBerkas = () => {
    openConfirmation(
      'Generate Semua Dokumen Persyaratan Berkas?',
      'Tindakan ini akan memuat seluruh dokumen standar Master API beserta aktivasinya.',
      () => {
        const commonDocs: BerkasRuleItem[] = [
          {
            id_berkas_pendaftaran: 'doc-ktp',
            nama_berkas: 'Kartu Tanda Penduduk (KTP) / Paspor',
            wajib_untuk_wni: true,
            wajib_untuk_wna: true,
            untuk_jenis_pendaftaran: config.pilihan_jenis_pendaftaran.map((j) => j.id),
            untuk_jalur_pendaftaran: config.pilihan_jalur_pendaftaran.map((j) => j.id),
            untuk_pilihan_shift_pendaftaran: [1, 2],
          },
          {
            id_berkas_pendaftaran: 'doc-ijazah',
            nama_berkas: 'Ijazah / SKL Legalisir',
            wajib_untuk_wni: true,
            wajib_untuk_wna: true,
            untuk_jenis_pendaftaran: config.pilihan_jenis_pendaftaran.map((j) => j.id),
            untuk_jalur_pendaftaran: config.pilihan_jalur_pendaftaran.map((j) => j.id),
            untuk_pilihan_shift_pendaftaran: [1, 2],
          },
          {
            id_berkas_pendaftaran: 'doc-rapor',
            nama_berkas: 'Transkrip Nilai / Rapor Semester 1-5',
            wajib_untuk_wni: true,
            wajib_untuk_wna: false,
            untuk_jenis_pendaftaran: [1],
            untuk_jalur_pendaftaran: [101],
            untuk_pilihan_shift_pendaftaran: [1],
          },
        ];

        const nonDisDocs: BerkasRuleItem[] = [
          {
            id_berkas_pendaftaran: 'doc-sehat',
            nama_berkas: 'Surat Keterangan Sehat Bebas Narkoba',
            wajib_untuk_wni: true,
            wajib_untuk_wna: true,
            untuk_jenis_pendaftaran: [1, 2],
            untuk_jalur_pendaftaran: [101, 102],
            untuk_pilihan_shift_pendaftaran: [1, 2],
          },
        ];

        const disDocs: BerkasRuleItem[] = [
          {
            id_berkas_pendaftaran: 'doc-disabilitas',
            nama_berkas: 'Surat Asesmen Dokter Spesialis Disabilitas',
            wajib_untuk_wni: true,
            wajib_untuk_wna: true,
            untuk_jenis_pendaftaran: [1],
            untuk_jalur_pendaftaran: [104],
            untuk_pilihan_shift_pendaftaran: [1],
          },
        ];

        setConfig((prev) => ({
          ...prev,
          berkas_wajib: {
            untuk_cmaba_n_dan_d: commonDocs,
            untuk_cmaba_non_disabilitas: nonDisDocs,
            untuk_cmaba_disabilitas: disDocs,
          },
        }));
        toast.success('Seluruh berkas persyaratan berhasil digenerate');
      }
    );
  };

  /* =========================================================================
     ADD HANDLERS
     ========================================================================= */

  const handleAddProdiSubmit = (prodiId: string) => {
    const master = MASTER_PRODI_LIST.find((p) => p.id === prodiId);
    if (!master) return;
    const defaultShift = MASTER_SHIFT_LIST[0];

    const newProdi: ProdiItem = {
      id: master.id,
      nama_prodi: master.nama,
      kode: master.kode,
      fakultas: master.fakultas,
      kuota_shift: [
        {
          id_pilihan_shift: defaultShift.id,
          nama_shift: defaultShift.nama,
          jam: defaultShift.jam,
          jumlah_pendaftar_mahasiswa_n: 30,
          jumlah_pendaftar_mahasiswa_d: 5,
        },
      ],
    };

    setConfig((prev) => ({ ...prev, prodi: [...prev.prodi, newProdi] }));
    toast.success(`${master.nama} ditambahkan ke gelombang`);
  };

  const handleAddShiftSubmit = (shiftId: number, kuotaN: number, kuotaD: number) => {
    const shiftMaster = MASTER_SHIFT_LIST.find((s) => s.id === shiftId);
    if (!shiftMaster) return;

    setConfig((prev) => ({
      ...prev,
      prodi: prev.prodi.map((p) => {
        if (p.id !== addShiftModal.prodiId) return p;
        if (p.kuota_shift.some((s) => s.id_pilihan_shift === shiftId)) {
          toast.error(`${shiftMaster.nama} sudah ada pada prodi ini`);
          return p;
        }
        return {
          ...p,
          kuota_shift: [
            ...p.kuota_shift,
            {
              id_pilihan_shift: shiftMaster.id,
              nama_shift: shiftMaster.nama,
              jam: shiftMaster.jam,
              jumlah_pendaftar_mahasiswa_n: Number(kuotaN) || 0,
              jumlah_pendaftar_mahasiswa_d: Number(kuotaD) || 0,
            },
          ],
        };
      }),
    }));

    toast.success(`${shiftMaster.nama} berhasil ditambahkan`);
  };

  const handleSaveShiftKuota = (prodiId: string, shiftId: number, newN: number, newD: number) => {
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
              jumlah_pendaftar_mahasiswa_n: Math.max(0, newN),
              jumlah_pendaftar_mahasiswa_d: Math.max(0, newD),
            };
          }),
        };
      }),
    }));
    toast.success('Kuota shift diperbarui');
  };

  const handleAddJalurSubmit = (jalurId: number) => {
    const master = MASTER_JALUR_LIST.find((j) => j.id === jalurId);
    if (!master) return;
    const newJalur: PilihanJalurPendaftaranItem = {
      id: master.id,
      nama_jalur: master.nama,
      deskripsi: master.deskripsi,
      untuk_cmaba_non_disabilitas: true,
      untuk_cmaba_disabilitas: true,
    };
    setConfig((prev) => ({
      ...prev,
      pilihan_jalur_pendaftaran: [...prev.pilihan_jalur_pendaftaran, newJalur],
    }));
    toast.success(`${master.nama} berhasil ditambahkan`);
  };

  const handleAddJenisSubmit = (jenisId: number) => {
    const master = MASTER_JENIS_LIST.find((j) => j.id === jenisId);
    if (!master) return;
    const newJenis: PilihanJenisPendaftaranItem = {
      id: master.id,
      nama_jenis: master.nama,
      deskripsi: master.deskripsi,
      untuk_cmaba_non_disabilitas: true,
      untuk_cmaba_disabilitas: true,
    };
    setConfig((prev) => ({
      ...prev,
      pilihan_jenis_pendaftaran: [...prev.pilihan_jenis_pendaftaran, newJenis],
    }));
    toast.success(`${master.nama} berhasil ditambahkan`);
  };

  const handleAddDokumenSubmit = (
    docId: string,
    kategori: 'untuk_cmaba_n_dan_d' | 'untuk_cmaba_non_disabilitas' | 'untuk_cmaba_disabilitas'
  ) => {
    const master = MASTER_BERKAS_LIST.find((b) => b.id === docId);
    if (!master) return;
    const newDoc: BerkasRuleItem = {
      id_berkas_pendaftaran: master.id,
      nama_berkas: master.nama,
      kategori: master.kategori,
      wajib_untuk_wni: true,
      wajib_untuk_wna: true,
      untuk_jenis_pendaftaran: config.pilihan_jenis_pendaftaran.map((j) => j.id),
      untuk_jalur_pendaftaran: config.pilihan_jalur_pendaftaran.map((j) => j.id),
      untuk_pilihan_shift_pendaftaran: [1, 2],
    };

    setConfig((prev) => ({
      ...prev,
      berkas_wajib: {
        ...prev.berkas_wajib,
        [kategori]: [...prev.berkas_wajib[kategori], newDoc],
      },
    }));
    toast.success(`${master.nama} berhasil ditambahkan`);
  };

  /* =========================================================================
     DELETE HANDLERS
     ========================================================================= */

  const handleDeleteProdi = (prodiId: string, prodiName: string) => {
    openConfirmation(
      `Hapus ${prodiName}?`,
      'Program studi dan seluruh kuota shift terkait akan dihapus dari gelombang ini.',
      () => {
        setConfig((prev) => ({
          ...prev,
          prodi: prev.prodi.filter((p) => p.id !== prodiId),
        }));
        toast.success(`${prodiName} dihapus`);
      },
      'Hapus',
      'destructive'
    );
  };

  const handleDeleteShift = (prodiId: string, shiftId: number, shiftName: string) => {
    openConfirmation(
      `Hapus ${shiftName}?`,
      'Pilihan shift ini akan dihapus dari program studi.',
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
        toast.success(`${shiftName} dihapus`);
      },
      'Hapus',
      'destructive'
    );
  };

  const handleDeleteJalur = (jalurId: number, jalurName: string) => {
    openConfirmation(
      `Hapus ${jalurName}?`,
      'Jalur seleksi ini akan dihapus dari konfigurasi gelombang.',
      () => {
        setConfig((prev) => ({
          ...prev,
          pilihan_jalur_pendaftaran: prev.pilihan_jalur_pendaftaran.filter((j) => j.id !== jalurId),
        }));
        toast.success(`${jalurName} dihapus`);
      },
      'Hapus',
      'destructive'
    );
  };

  const handleDeleteJenis = (jenisId: number, jenisName: string) => {
    openConfirmation(
      `Hapus ${jenisName}?`,
      'Kategori jenis pendaftaran ini akan dihapus dari konfigurasi gelombang.',
      () => {
        setConfig((prev) => ({
          ...prev,
          pilihan_jenis_pendaftaran: prev.pilihan_jenis_pendaftaran.filter((j) => j.id !== jenisId),
        }));
        toast.success(`${jenisName} dihapus`);
      },
      'Hapus',
      'destructive'
    );
  };

  const handleDeleteBerkas = (
    kategori: 'untuk_cmaba_n_dan_d' | 'untuk_cmaba_non_disabilitas' | 'untuk_cmaba_disabilitas',
    docId: string,
    docName: string
  ) => {
    openConfirmation(
      `Hapus ${docName}?`,
      'Dokumen persyaratan ini akan dihapus dari daftar berkas wajib gelombang ini.',
      () => {
        setConfig((prev) => ({
          ...prev,
          berkas_wajib: {
            ...prev.berkas_wajib,
            [kategori]: prev.berkas_wajib[kategori].filter(
              (b) => b.id_berkas_pendaftaran !== docId
            ),
          },
        }));
        toast.success(`${docName} dihapus`);
      },
      'Hapus',
      'destructive'
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-4 pb-16">
      {/* Top Header & Gelombang Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center shrink-0 shadow-xs">
              <FolderTree className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground font-sans">
                {config.gelombang_nama}
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Hierarki Konfigurasi Gelombang PMB • Tahun Akademik {config.tahun_akademik} {config.semester}
              </p>
            </div>
          </div>
        </div>

        {/* Gelombang Selector Combobox */}
        <div className="w-full sm:w-72">
          <Combobox
            options={MASTER_GELOMBANG_LIST.map((g) => ({
              label: `${g.nama} (${g.status})`,
              value: g.id,
            }))}
            value={selectedGelombangId}
            onChange={(val) => {
              setSelectedGelombangId(val);
              const found = MASTER_GELOMBANG_LIST.find((g) => g.id === val);
              if (found) {
                setConfig((prev) => ({
                  ...prev,
                  id_gelombang: found.id,
                  gelombang_nama: found.nama,
                  tahun_akademik: found.tahun,
                  semester: found.semester,
                }));
                toast.info(`Gelombang aktif: ${found.nama}`);
              }
            }}
            placeholder="Pilih Gelombang..."
          />
        </div>
      </div>

      {/* Filter Tabs & Toolbar Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-1">
        {/* Left: Filter Tabs */}
        <FilterTabs
          currentTab={filters.tab}
          onTabChange={(tab) => setFilters((prev) => ({ ...prev, tab }))}
          counts={tabCounts}
        />

        {/* Right: Search, View Switcher, Batch Actions, and + Tambah Dropdown */}
        <TreeAction
          filters={filters}
          onFilterChange={setFilters}
          onExpandAll={handleExpandAll}
          onCollapseAll={handleCollapseAll}
          isAllExpanded={isAllExpanded}
          onOpenBatchKuota={() =>
            setBatchKuotaModal({
              open: true,
              prodiId: null,
              prodiName: '',
            })
          }
          onGenerateAllShifts={handleGenerateAllShifts}
          onGenerateAllProdi={handleGenerateAllProdi}
          onGenerateAllJalur={handleGenerateAllJalur}
          onGenerateAllJenis={handleGenerateAllJenis}
          onGenerateAllBerkas={handleGenerateAllBerkas}
          onOpenAddProdi={() => setOpenAddProdi(true)}
          onOpenAddJalur={() => setOpenAddJalur(true)}
          onOpenAddJenis={() => setOpenAddJenis(true)}
          onOpenAddDokumen={() => setOpenAddDokumen(true)}
        />
      </div>

      {/* Active Filter Chips (if search or non-all tab is selected) */}
      {(filters.search || filters.tab !== 'all') && (
        <div className="flex items-center gap-2 flex-wrap text-xs text-muted-foreground pt-0.5">
          <span className="text-[11px] font-medium">Filter Aktif:</span>

          {filters.tab !== 'all' && (
            <Badge
              variant="secondary"
              className="gap-1 text-xs px-2 py-0.5 rounded-lg bg-primary/10 text-primary border border-primary/20"
            >
              <span>Kategori: {filters.tab.toUpperCase()}</span>
              <button
                type="button"
                onClick={() => setFilters((prev) => ({ ...prev, tab: 'all' }))}
                className="hover:text-foreground cursor-pointer"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {filters.search && (
            <Badge
              variant="secondary"
              className="gap-1 text-xs px-2 py-0.5 rounded-lg bg-muted text-foreground border border-border"
            >
              <span>Pencarian: "{filters.search}"</span>
              <button
                type="button"
                onClick={() => setFilters((prev) => ({ ...prev, search: '' }))}
                className="hover:text-destructive cursor-pointer"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setFilters({ tab: 'all', search: '', viewMode: filters.viewMode })}
            className="h-6 px-2 text-[11px] text-muted-foreground hover:text-foreground"
          >
            Reset Filter
          </Button>
        </div>
      )}

      {/* Main View Area: Tree List vs Graph Preview */}
      {filters.viewMode === 'graph' ? (
        <GraphPreview
          config={config}
          selectedNodeId={selectedNode?.id}
          onSelectNode={(node) => setSelectedNode(node)}
          searchQuery={filters.search}
        />
      ) : (
        <div className="rounded-3xl border border-border/70 bg-card/60 p-3 sm:p-5 shadow-xs overflow-hidden">
          <TreeList
            nodes={filteredTree}
            expandedIds={expandedIds}
            selectedNodeId={selectedNode?.id}
            onToggleExpand={handleToggleExpand}
            onSelectNode={(node) => setSelectedNode(node)}
            onInspect={(node) => setSelectedNode(node)}
            onEditShift={(prodiId, shiftId, currentN, currentD) =>
              setEditShiftModal({
                open: true,
                prodiId,
                shiftId,
                currentN,
                currentD,
              })
            }
            onAddShiftToProdi={(prodiId, prodiName) =>
              setAddShiftModal({
                open: true,
                prodiId,
                prodiName,
              })
            }
            onBatchKuotaProdi={(prodiId, prodiName) =>
              setBatchKuotaModal({
                open: true,
                prodiId,
                prodiName,
              })
            }
            onGenShiftProdi={handleGenShiftProdi}
            onDeleteProdi={handleDeleteProdi}
            onDeleteShift={handleDeleteShift}
            onDeleteJalur={handleDeleteJalur}
            onDeleteJenis={handleDeleteJenis}
            onDeleteBerkas={handleDeleteBerkas}
            onOpenAddProdi={() => setOpenAddProdi(true)}
            onOpenAddJalur={() => setOpenAddJalur(true)}
            onOpenAddJenis={() => setOpenAddJenis(true)}
            onOpenAddDokumen={() => setOpenAddDokumen(true)}
            isSearchActive={Boolean(filters.search)}
          />
        </div>
      )}

      {/* Selected Node Details & Quick Inspector Footer */}
      {selectedNode && (
        <Card className="rounded-2xl border-border/70 shadow-xs bg-muted/20 animate-in fade-in duration-200">
          <CardHeader className="pb-2.5 pt-3.5 px-4 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xs sm:text-sm font-semibold flex items-center gap-2">
                <Info className="h-4 w-4 text-primary" />
                <span>Detail Elemen Terpilih: {selectedNode.title}</span>
                <Badge variant="outline" className="text-[10px] font-mono">
                  {selectedNode.id}
                </Badge>
              </CardTitle>
              <CardDescription className="text-xs mt-0.5">
                {selectedNode.subtitle || 'Payload data hierarki gelombang pendaftaran'}
              </CardDescription>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedNode(null)}
                className="h-6 w-6 text-muted-foreground hover:text-foreground"
                title="Tutup Panel Detail"
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          </CardHeader>

          {selectedNode.data && (
            <CardContent className="pt-0 px-4 pb-3.5">
              <pre className="p-3 rounded-xl bg-background text-[11px] font-mono overflow-x-auto text-foreground/90 border border-border/60">
                {JSON.stringify(selectedNode.data, null, 2)}
              </pre>
            </CardContent>
          )}
        </Card>
      )}

      {/* =========================================================================
         ALL DIALOGS
         ========================================================================= */}

      {/* 1. Batch Kuota Modal */}
      <BatchKuotaModal
        open={batchKuotaModal.open}
        onOpenChange={(open) => setBatchKuotaModal((prev) => ({ ...prev, open }))}
        targetProdiId={batchKuotaModal.prodiId}
        targetProdiName={batchKuotaModal.prodiName}
        onApply={handleApplyBatchKuota}
      />

      {/* 2. Tambah Prodi Modal */}
      <AddProdiDialog
        open={openAddProdi}
        onOpenChange={setOpenAddProdi}
        existingProdiIds={config.prodi.map((p) => p.id)}
        onAdd={handleAddProdiSubmit}
      />

      {/* 3. Tambah Shift Modal */}
      <AddShiftDialog
        open={addShiftModal.open}
        onOpenChange={(open) => setAddShiftModal((prev) => ({ ...prev, open }))}
        prodiId={addShiftModal.prodiId}
        prodiName={addShiftModal.prodiName}
        existingShiftIds={
          config.prodi
            .find((p) => p.id === addShiftModal.prodiId)
            ?.kuota_shift.map((s) => s.id_pilihan_shift) || []
        }
        onAdd={handleAddShiftSubmit}
      />

      {/* 4. Edit Kuota Shift Modal */}
      <EditKuotaDialog
        open={editShiftModal.open}
        onOpenChange={(open) => setEditShiftModal((prev) => ({ ...prev, open }))}
        shiftData={
          editShiftModal.open
            ? {
                prodiId: editShiftModal.prodiId,
                shiftId: editShiftModal.shiftId,
                currentN: editShiftModal.currentN,
                currentD: editShiftModal.currentD,
              }
            : null
        }
        onSave={handleSaveShiftKuota}
      />

      {/* 5. Tambah Jalur Modal */}
      <AddJalurDialog
        open={openAddJalur}
        onOpenChange={setOpenAddJalur}
        existingJalurIds={config.pilihan_jalur_pendaftaran.map((j) => j.id)}
        onAdd={handleAddJalurSubmit}
      />

      {/* 6. Tambah Jenis Modal */}
      <AddJenisDialog
        open={openAddJenis}
        onOpenChange={setOpenAddJenis}
        existingJenisIds={config.pilihan_jenis_pendaftaran.map((j) => j.id)}
        onAdd={handleAddJenisSubmit}
      />

      {/* 7. Tambah Dokumen Berkas Modal */}
      <AddDokumenDialog
        open={openAddDokumen}
        onOpenChange={setOpenAddDokumen}
        existingDocIds={[
          ...config.berkas_wajib.untuk_cmaba_n_dan_d.map((b) => b.id_berkas_pendaftaran),
          ...config.berkas_wajib.untuk_cmaba_non_disabilitas.map((b) => b.id_berkas_pendaftaran),
          ...config.berkas_wajib.untuk_cmaba_disabilitas.map((b) => b.id_berkas_pendaftaran),
        ]}
        onAdd={handleAddDokumenSubmit}
      />

      {/* 8. Unified Confirmation Modal */}
      <ConfirmDialog
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog((prev) => ({ ...prev, open }))}
        title={confirmDialog.title}
        description={confirmDialog.description}
        actionLabel={confirmDialog.actionLabel}
        actionVariant={confirmDialog.actionVariant}
        onConfirm={confirmDialog.onConfirm}
      />
    </div>
  );
}
