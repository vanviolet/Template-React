import React from 'react';

/* =========================================================================
   Types Konfigurasi Gelombang Pendaftaran Sesuai Spesifikasi JSON Master API
   ========================================================================= */

export interface KuotaShiftItem {
  id_pilihan_shift: number;
  nama_shift?: string;
  jam?: string;
  jumlah_pendaftar_mahasiswa_n: number; // Non-disabilitas
  jumlah_pendaftar_mahasiswa_d: number; // Disabilitas
}

export interface ProdiItem {
  id: string;
  nama_prodi?: string;
  kode?: string;
  fakultas?: string;
  kuota_shift: KuotaShiftItem[];
}

export interface PilihanJenisPendaftaranItem {
  id: number;
  nama_jenis?: string;
  deskripsi?: string;
  untuk_cmaba_non_disabilitas: boolean;
  untuk_cmaba_disabilitas: boolean;
}

export interface PilihanJalurPendaftaranItem {
  id: number;
  nama_jalur?: string;
  deskripsi?: string;
  untuk_cmaba_non_disabilitas: boolean;
  untuk_cmaba_disabilitas: boolean;
}

export interface BerkasRuleItem {
  id_berkas_pendaftaran: string;
  nama_berkas?: string;
  kategori?: string;
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

/* =========================================================================
   Modern Card Tree View Node Representation (Matches Screenshot Layout)
   ========================================================================= */

export type TreeNodeType =
  | 'gelombang'
  | 'branch-prodi'
  | 'prodi'
  | 'shift'
  | 'branch-jalur'
  | 'jalur'
  | 'branch-jenis'
  | 'jenis'
  | 'branch-berkas'
  | 'berkas-category'
  | 'berkas';

export interface TreeNodePill {
  text: string;
  subtext?: string;
  progressPercent?: number; // 0 to 100 for progress fill bar
  variant?: 'primary' | 'emerald' | 'purple' | 'amber' | 'muted';
}

export interface TreeNodeItem {
  id: string;
  type: TreeNodeType;
  title: string;
  subtitle?: string;
  metaBadge?: string;
  iconName: 'graduation' | 'clock' | 'sliders' | 'users' | 'file' | 'shield' | 'layers' | 'check';
  themeColor: 'primary' | 'emerald' | 'purple' | 'amber' | 'rose' | 'blue';
  pill?: TreeNodePill;
  statusActive?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
  canAddChild?: boolean;
  addChildLabel?: string;
  data: any; // Raw payload for inspector & handlers
  children?: TreeNodeItem[];
}

export type TreeTabFilter = 'all' | 'prodi' | 'jalur' | 'jenis' | 'berkas';
export type TreeViewMode = 'tree' | 'graph';

export interface TreeFilterState {
  tab: TreeTabFilter;
  search: string;
  viewMode: TreeViewMode;
}

