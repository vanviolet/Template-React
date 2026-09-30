import {
  GelombangPendaftaranConfig,
  TreeNodeItem,
  TreeFilterState,
  ProdiItem,
  PilihanJalurPendaftaranItem,
  PilihanJenisPendaftaranItem,
  BerkasRuleItem,
} from './types';
import {
  MASTER_PRODI_LIST,
  MASTER_SHIFT_LIST,
  MASTER_JALUR_LIST,
  MASTER_JENIS_LIST,
  MASTER_BERKAS_LIST,
} from '@/services/pmb.api.dummy';

/**
 * Builds the modern card-tree structure from the GelombangPendaftaranConfig
 */
export function buildGelombangTree(config: GelombangPendaftaranConfig): TreeNodeItem[] {
  // 1. Calculate overall metrics
  let totalProdiKuota = 0;
  let totalShiftCount = 0;
  config.prodi.forEach((p) => {
    p.kuota_shift.forEach((s) => {
      totalShiftCount++;
      totalProdiKuota += (s.jumlah_pendaftar_mahasiswa_n || 0) + (s.jumlah_pendaftar_mahasiswa_d || 0);
    });
  });

  const totalJalur = config.pilihan_jalur_pendaftaran.length;
  const activeJalur = config.pilihan_jalur_pendaftaran.filter(
    (j) => j.untuk_cmaba_non_disabilitas || j.untuk_cmaba_disabilitas
  ).length;

  const totalJenis = config.pilihan_jenis_pendaftaran.length;
  const activeJenis = config.pilihan_jenis_pendaftaran.filter(
    (j) => j.untuk_cmaba_non_disabilitas || j.untuk_cmaba_disabilitas
  ).length;

  const allDocs = [
    ...config.berkas_wajib.untuk_cmaba_n_dan_d,
    ...config.berkas_wajib.untuk_cmaba_non_disabilitas,
    ...config.berkas_wajib.untuk_cmaba_disabilitas,
  ];
  const totalBerkas = allDocs.length;

  // Build Branches
  // Branch A: Program Studi & Kuota Shift
  const prodiChildren: TreeNodeItem[] = config.prodi.map((p) => {
    const master = MASTER_PRODI_LIST.find((m) => m.id === p.id);
    const prodiName = p.nama_prodi || master?.nama || p.id;
    const prodiKode = p.kode || master?.kode || '';
    const prodiFakultas = p.fakultas || master?.fakultas || 'Fakultas';

    let prodiTotalKuota = 0;
    p.kuota_shift.forEach((s) => {
      prodiTotalKuota += (s.jumlah_pendaftar_mahasiswa_n || 0) + (s.jumlah_pendaftar_mahasiswa_d || 0);
    });

    const shiftChildren: TreeNodeItem[] = p.kuota_shift.map((s) => {
      const shiftMaster = MASTER_SHIFT_LIST.find((m) => m.id === s.id_pilihan_shift);
      const shiftName = s.nama_shift || shiftMaster?.nama || `Shift ${s.id_pilihan_shift}`;
      const shiftJam = s.jam || shiftMaster?.jam || 'Waktu Fleksibel';
      const shiftKuotaTotal = (s.jumlah_pendaftar_mahasiswa_n || 0) + (s.jumlah_pendaftar_mahasiswa_d || 0);

      // Progress ratio (out of 100 for visual pill)
      const progressPercent = Math.min(100, Math.round((shiftKuotaTotal / 100) * 100));

      return {
        id: `shift-${p.id}-${s.id_pilihan_shift}`,
        type: 'shift',
        title: shiftName,
        subtitle: `${shiftJam} • Kuota Reguler (N): ${s.jumlah_pendaftar_mahasiswa_n} • Disabilitas (D): ${s.jumlah_pendaftar_mahasiswa_d}`,
        iconName: 'clock',
        themeColor: 'emerald',
        pill: {
          text: `${shiftKuotaTotal} Kuota`,
          subtext: `N:${s.jumlah_pendaftar_mahasiswa_n} D:${s.jumlah_pendaftar_mahasiswa_d}`,
          progressPercent,
          variant: 'emerald',
        },
        statusActive: shiftKuotaTotal > 0,
        canEdit: true,
        canDelete: true,
        canAddChild: false,
        data: {
          prodiId: p.id,
          prodiName,
          shiftId: s.id_pilihan_shift,
          shiftName,
          shift: s,
          ...s,
        },
      };
    });

    return {
      id: `prodi-${p.id}`,
      type: 'prodi',
      title: prodiName,
      subtitle: `Kode: ${prodiKode} • ${prodiFakultas} • ${p.kuota_shift.length} Pilihan Shift`,
      metaBadge: prodiKode,
      iconName: 'graduation',
      themeColor: 'primary',
      pill: {
        text: `${prodiTotalKuota} Kuota Total`,
        subtext: `${p.kuota_shift.length} shift`,
        progressPercent: Math.min(100, Math.round((prodiTotalKuota / 200) * 100)),
        variant: 'primary',
      },
      statusActive: p.kuota_shift.length > 0,
      canEdit: true,
      canDelete: true,
      canAddChild: true,
      addChildLabel: 'Tambah Shift',
      data: { ...p, nama_prodi: prodiName, kode: prodiKode },
      children: shiftChildren,
    };
  });

  const branchProdi: TreeNodeItem = {
    id: 'branch-prodi',
    type: 'branch-prodi',
    title: 'Program Studi & Kuota Shift',
    subtitle: `${config.prodi.length} Prodi Terdaftar • ${totalShiftCount} Shift Aktif • ${totalProdiKuota} Total Kuota Penerimaan`,
    iconName: 'layers',
    themeColor: 'primary',
    pill: {
      text: `${config.prodi.length} Program Studi`,
      subtext: `${totalProdiKuota} Kuota`,
      progressPercent: 75,
      variant: 'primary',
    },
    statusActive: config.prodi.length > 0,
    canEdit: false,
    canDelete: false,
    canAddChild: true,
    addChildLabel: 'Tambah Prodi',
    data: { branch: 'prodi', count: config.prodi.length, kuota: totalProdiKuota },
    children: prodiChildren,
  };

  // Branch B: Pilihan Jalur Pendaftaran
  const jalurChildren: TreeNodeItem[] = config.pilihan_jalur_pendaftaran.map((j) => {
    const master = MASTER_JALUR_LIST.find((m) => m.id === j.id);
    const jalurName = j.nama_jalur || master?.nama || `Jalur ${j.id}`;
    const jalurDesc = j.deskripsi || master?.deskripsi || 'Jalur seleksi penerimaan mahasiswa baru';

    return {
      id: `jalur-${j.id}`,
      type: 'jalur',
      title: jalurName,
      subtitle: `${jalurDesc} • ID: ${j.id}`,
      iconName: 'sliders',
      themeColor: 'emerald',
      pill: {
        text: `Jalur #${j.id}`,
        variant: 'emerald',
      },
      statusActive: true,
      canEdit: false,
      canDelete: true,
      canAddChild: false,
      data: { ...j, nama_jalur: jalurName },
    };
  });

  const branchJalur: TreeNodeItem = {
    id: 'branch-jalur',
    type: 'branch-jalur',
    title: 'Pilihan Jalur Pendaftaran',
    subtitle: `${totalJalur} Jalur Seleksi Terdaftar`,
    iconName: 'sliders',
    themeColor: 'emerald',
    pill: {
      text: `${totalJalur} Jalur Terdaftar`,
      variant: 'emerald',
    },
    statusActive: true,
    canEdit: false,
    canDelete: false,
    canAddChild: true,
    addChildLabel: 'Tambah Jalur',
    data: { branch: 'jalur', total: totalJalur },
    children: jalurChildren,
  };

  // Branch C: Pilihan Jenis Pendaftaran
  const jenisChildren: TreeNodeItem[] = config.pilihan_jenis_pendaftaran.map((j) => {
    const master = MASTER_JENIS_LIST.find((m) => m.id === j.id);
    const jenisName = j.nama_jenis || master?.nama || `Jenis ${j.id}`;
    const jenisDesc = j.deskripsi || master?.deskripsi || 'Kategori mahasiswa pendaftar';

    return {
      id: `jenis-${j.id}`,
      type: 'jenis',
      title: jenisName,
      subtitle: `${jenisDesc} • ID: ${j.id}`,
      iconName: 'users',
      themeColor: 'purple',
      pill: {
        text: `Jenis #${j.id}`,
        variant: 'purple',
      },
      statusActive: true,
      canEdit: false,
      canDelete: true,
      canAddChild: false,
      data: { ...j, nama_jenis: jenisName },
    };
  });

  const branchJenis: TreeNodeItem = {
    id: 'branch-jenis',
    type: 'branch-jenis',
    title: 'Pilihan Jenis Pendaftaran',
    subtitle: `${totalJenis} Jenis Pendaftaran Terdaftar`,
    iconName: 'users',
    themeColor: 'purple',
    pill: {
      text: `${totalJenis} Jenis Terdaftar`,
      variant: 'purple',
    },
    statusActive: true,
    canEdit: false,
    canDelete: false,
    canAddChild: true,
    addChildLabel: 'Tambah Jenis',
    data: { branch: 'jenis', total: totalJenis },
    children: jenisChildren,
  };

  // Branch D: Persyaratan Berkas Wajib
  const mapBerkasItems = (
    list: BerkasRuleItem[],
    kategoriKey: 'untuk_cmaba_n_dan_d' | 'untuk_cmaba_non_disabilitas' | 'untuk_cmaba_disabilitas'
  ): TreeNodeItem[] => {
    return list.map((b) => {
      const master = MASTER_BERKAS_LIST.find((m) => m.id === b.id_berkas_pendaftaran);
      const docName = b.nama_berkas || master?.nama || b.id_berkas_pendaftaran;
      const totalRelasi =
        b.untuk_jenis_pendaftaran.length +
        b.untuk_jalur_pendaftaran.length +
        b.untuk_pilihan_shift_pendaftaran.length;
      const isCitizenshipActive = b.wajib_untuk_wni || b.wajib_untuk_wna;

      return {
        id: `berkas-${kategoriKey}-${b.id_berkas_pendaftaran}`,
        type: 'berkas',
        title: docName,
        subtitle: `ID: ${b.id_berkas_pendaftaran} • WNI: ${b.wajib_untuk_wni ? 'Wajib' : 'Tidak'} • WNA: ${b.wajib_untuk_wna ? 'Wajib' : 'Tidak'} • ${totalRelasi} Relasi Aktif`,
        iconName: 'file',
        themeColor: isCitizenshipActive ? 'rose' : 'muted' as any,
        pill: {
          text: `${totalRelasi} Relasi Aktif`,
          subtext: b.wajib_untuk_wni && b.wajib_untuk_wna ? 'WNI & WNA' : b.wajib_untuk_wni ? 'WNI' : 'WNA',
          progressPercent: Math.min(100, totalRelasi * 20),
          variant: totalRelasi > 0 ? 'purple' : 'muted',
        },
        statusActive: isCitizenshipActive || totalRelasi > 0,
        canEdit: true,
        canDelete: true,
        canAddChild: false,
        data: {
          kategori: kategoriKey,
          docId: b.id_berkas_pendaftaran,
          docName,
          berkas: b,
        },
      };
    });
  };

  const branchBerkas: TreeNodeItem = {
    id: 'branch-berkas',
    type: 'branch-berkas',
    title: 'Persyaratan Berkas Wajib & Relasi',
    subtitle: `${totalBerkas} Dokumen Persyaratan Terkonfigurasi Matriks`,
    iconName: 'shield',
    themeColor: 'rose',
    pill: {
      text: `${totalBerkas} Dokumen`,
      progressPercent: 80,
      variant: 'primary',
    },
    statusActive: totalBerkas > 0,
    canEdit: false,
    canDelete: false,
    canAddChild: true,
    addChildLabel: 'Tambah Dokumen',
    data: { branch: 'berkas', total: totalBerkas },
    children: [
      {
        id: 'berkas-cat-nd',
        type: 'berkas-category',
        title: 'Untuk Calon Mahasiswa Umum (Non-Disabilitas & Disabilitas)',
        subtitle: `${config.berkas_wajib.untuk_cmaba_n_dan_d.length} Dokumen Persyaratan Standar`,
        iconName: 'file',
        themeColor: 'primary',
        pill: {
          text: `${config.berkas_wajib.untuk_cmaba_n_dan_d.length} Dokumen`,
          variant: 'primary',
        },
        data: { category: 'untuk_cmaba_n_dan_d' },
        children: mapBerkasItems(config.berkas_wajib.untuk_cmaba_n_dan_d, 'untuk_cmaba_n_dan_d'),
      },
      {
        id: 'berkas-cat-nond',
        type: 'berkas-category',
        title: 'Khusus Calon Mahasiswa Non-Disabilitas',
        subtitle: `${config.berkas_wajib.untuk_cmaba_non_disabilitas.length} Dokumen Khusus`,
        iconName: 'file',
        themeColor: 'emerald',
        pill: {
          text: `${config.berkas_wajib.untuk_cmaba_non_disabilitas.length} Dokumen`,
          variant: 'emerald',
        },
        data: { category: 'untuk_cmaba_non_disabilitas' },
        children: mapBerkasItems(config.berkas_wajib.untuk_cmaba_non_disabilitas, 'untuk_cmaba_non_disabilitas'),
      },
      {
        id: 'berkas-cat-d',
        type: 'berkas-category',
        title: 'Khusus Calon Mahasiswa Disabilitas (Inklusif)',
        subtitle: `${config.berkas_wajib.untuk_cmaba_disabilitas.length} Dokumen Pendukung Asesmen`,
        iconName: 'shield',
        themeColor: 'purple',
        pill: {
          text: `${config.berkas_wajib.untuk_cmaba_disabilitas.length} Dokumen`,
          variant: 'purple',
        },
        data: { category: 'untuk_cmaba_disabilitas' },
        children: mapBerkasItems(config.berkas_wajib.untuk_cmaba_disabilitas, 'untuk_cmaba_disabilitas'),
      },
    ],
  };

  // Root Gelombang Node
  const rootNode: TreeNodeItem = {
    id: 'root-gelombang',
    type: 'gelombang',
    title: `${config.gelombang_nama} (${config.tahun_akademik} ${config.semester})`,
    subtitle: `Tahun Akademik ${config.tahun_akademik} • Semester ${config.semester} • Live Master API Terkoneksi`,
    iconName: 'graduation',
    themeColor: 'primary',
    pill: {
      text: 'Gelombang Aktif',
      subtext: `${totalProdiKuota} Total Kuota`,
      progressPercent: 90,
      variant: 'primary',
    },
    statusActive: true,
    canEdit: false,
    canDelete: false,
    canAddChild: false,
    data: config,
    children: [branchProdi, branchJalur, branchJenis, branchBerkas],
  };

  return [rootNode];
}

/**
 * Filter tree items recursively
 */
export function filterTree(
  nodes: TreeNodeItem[],
  filters: TreeFilterState
): TreeNodeItem[] {
  const query = filters.search.trim().toLowerCase();

  return nodes
    .map((node) => {
      // Tab filtering at branch level
      if (node.type === 'gelombang') {
        // If tab is not 'all', filter the branches
        let branchChildren = node.children || [];
        if (filters.tab === 'prodi') {
          branchChildren = branchChildren.filter((b) => b.id === 'branch-prodi');
        } else if (filters.tab === 'jalur') {
          branchChildren = branchChildren.filter((b) => b.id === 'branch-jalur');
        } else if (filters.tab === 'jenis') {
          branchChildren = branchChildren.filter((b) => b.id === 'branch-jenis');
        } else if (filters.tab === 'berkas') {
          branchChildren = branchChildren.filter((b) => b.id === 'branch-berkas');
        }

        const filteredBranches = filterTree(branchChildren, filters);
        return {
          ...node,
          children: filteredBranches,
        };
      }

      // Check search match
      const matchSearch =
        !query ||
        node.title.toLowerCase().includes(query) ||
        (node.subtitle && node.subtitle.toLowerCase().includes(query)) ||
        (node.pill && node.pill.text.toLowerCase().includes(query));

      const matchSelf = matchSearch;

      // Filter children
      let filteredChildren: TreeNodeItem[] = [];
      if (node.children && node.children.length > 0) {
        filteredChildren = filterTree(node.children, filters);
      }

      if (matchSelf || filteredChildren.length > 0) {
        return {
          ...node,
          children: filteredChildren,
        };
      }

      return null;
    })
    .filter(Boolean) as TreeNodeItem[];
}

/**
 * Extracts all folder and item IDs for expand all
 */
export function getAllNodeIds(nodes: TreeNodeItem[]): string[] {
  let ids: string[] = [];
  for (const n of nodes) {
    ids.push(n.id);
    if (n.children && n.children.length > 0) {
      ids = ids.concat(getAllNodeIds(n.children));
    }
  }
  return ids;
}
