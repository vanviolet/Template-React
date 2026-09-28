/**
 * Master Data Dummy API & Types untuk Modul Penerimaan Mahasiswa Baru (PMB)
 */

export interface MasterProdi {
  id: string;
  kode: string;
  nama: string;
  jenjang: 'D3' | 'S1' | 'S2';
  fakultas: string;
}

export interface MasterShift {
  id: number;
  nama: string;
  jam: string;
  keterangan: string;
}

export interface MasterJalur {
  id: number;
  nama: string;
  deskripsi: string;
}

export interface MasterJenis {
  id: number;
  nama: string;
  deskripsi: string;
}

export interface MasterBerkas {
  id: string;
  nama: string;
  kategori: string;
}

export interface GelombangItem {
  id: string;
  nama: string;
  tahun: string;
  semester: string;
  status: 'Aktif' | 'Draft' | 'Selesai';
}

// 1. Master List Program Studi yang tersedia di Universitas
export const MASTER_PRODI_LIST: MasterProdi[] = [
  { id: 'ti-s1', kode: 'TI-01', nama: 'S1 Teknik Informatika', jenjang: 'S1', fakultas: 'Fakultas Teknologi Informasi' },
  { id: 'si-s1', kode: 'SI-02', nama: 'S1 Sistem Informasi', jenjang: 'S1', fakultas: 'Fakultas Teknologi Informasi' },
  { id: 'dkv-s1', kode: 'DKV-03', nama: 'S1 Desain Komunikasi Visual', jenjang: 'S1', fakultas: 'Fakultas Seni & Desain' },
  { id: 'bd-s1', kode: 'BD-04', nama: 'S1 Bisnis Digital', jenjang: 'S1', fakultas: 'Fakultas Ekonomi & Bisnis' },
  { id: 'mn-s1', kode: 'MN-05', nama: 'S1 Manajemen', jenjang: 'S1', fakultas: 'Fakultas Ekonomi & Bisnis' },
  { id: 'ak-s1', kode: 'AK-06', nama: 'S1 Akuntansi', jenjang: 'S1', fakultas: 'Fakultas Ekonomi & Bisnis' },
  { id: 'hk-s1', kode: 'HK-07', nama: 'S1 Ilmu Hukum', jenjang: 'S1', fakultas: 'Fakultas Hukum' },
  { id: 'ilkom-s1', kode: 'IK-08', nama: 'S1 Ilmu Komunikasi', jenjang: 'S1', fakultas: 'Fakultas Ilmu Sosial' },
  { id: 'ti-d3', kode: 'D3TI-09', nama: 'D3 Teknik Informatika', jenjang: 'D3', fakultas: 'Fakultas Vokasi' },
];

// 2. Master List Pilihan Shift Perkuliahan
export const MASTER_SHIFT_LIST: MasterShift[] = [
  { id: 1, nama: 'Reguler Pagi (Shift 1)', jam: '08:00 - 15:30', keterangan: 'Perkuliahan tatap muka Senin - Jumat pagi' },
  { id: 2, nama: 'Reguler Malam (Shift 2)', jam: '17:00 - 21:30', keterangan: 'Perkuliahan malam untuk pekerja' },
  { id: 3, nama: 'Kelas Eksekutif / Weekend (Shift 3)', jam: 'Sabtu 08:00 - 17:00', keterangan: 'Khusus profesional & blended learning' },
  { id: 4, nama: 'Kelas Online / E-Learning (Shift 4)', jam: 'Asinkronus & Fleksibel', keterangan: 'Kuliah jarak jauh terakreditasi' },
];

// 3. Master List Jalur Pendaftaran
export const MASTER_JALUR_LIST: MasterJalur[] = [
  { id: 101, nama: 'Jalur Prestasi Akademik (SNBP / Rapor)', deskripsi: 'Seleksi berdasarkan nilai rapor & sertifikat akademik' },
  { id: 102, nama: 'Jalur Beasiswa KIP Kuliah & Kemitraan', deskripsi: 'Bantuan biaya kuliah untuk mahasiswa berprestasi kurang mampu' },
  { id: 103, nama: 'Jalur Tes Potensi Skolastik (UTBK / Mandiri)', deskripsi: 'Ujian saringan masuk tertulis berbasis komputer' },
  { id: 104, nama: 'Jalur Afirmasi Khusus Disabilitas', deskripsi: 'Jalur inklusif ramah disabilitas dengan tes adaptif' },
  { id: 105, nama: 'Jalur Minat Bakat Olahraga & Seni', deskripsi: 'Seleksi portofolio atlet & talenta seni berprestasi' },
];

// 4. Master List Pilihan Jenis Pendaftaran
export const MASTER_JENIS_LIST: MasterJenis[] = [
  { id: 1, nama: 'Mahasiswa Baru Reguler', deskripsi: 'Lulusan SMA/SMK/MA sederajat' },
  { id: 2, nama: 'Pindahan / Transfer Kredit Antar Kampus', deskripsi: 'Mahasiswa transfer dari perguruan tinggi lain' },
  { id: 3, nama: 'RPL (Rekognisi Pembelajaran Lampau)', deskripsi: 'Konversi pengalaman kerja menjadi SKS perkuliahan' },
  { id: 4, nama: 'Mahasiswa Asing / Internasional (WNA)', deskripsi: 'Calon mahasiswa berkewarganegaraan asing' },
];

// 5. Master List Persyaratan Berkas
export const MASTER_BERKAS_LIST: MasterBerkas[] = [
  { id: 'doc-ktp', nama: 'Kartu Tanda Penduduk (KTP) / Paspor', kategori: 'Identitas' },
  { id: 'doc-ijazah', nama: 'Ijazah / SKL Legalisir', kategori: 'Akademik' },
  { id: 'doc-rapor', nama: 'Transkrip Nilai / Rapor Semester 1-5', kategori: 'Akademik' },
  { id: 'doc-sehat', nama: 'Surat Keterangan Sehat Bebas Narkoba', kategori: 'Kesehatan' },
  { id: 'doc-disabilitas', nama: 'Surat Asesmen Dokter Spesialis Disabilitas', kategori: 'Aksesibilitas' },
  { id: 'doc-akomodasi', nama: 'Formulir Kebutuhan Fasilitas Aksesibilitas', kategori: 'Aksesibilitas' },
];

// 6. Master List Gelombang Pendaftaran
export const MASTER_GELOMBANG_LIST: GelombangItem[] = [
  { id: 'gel-1-2026-genap', nama: 'Gelombang 1 2026 Genap', tahun: '2026', semester: 'Genap', status: 'Aktif' },
  { id: 'gel-2-2026-genap', nama: 'Gelombang 2 2026 Genap', tahun: '2026', semester: 'Genap', status: 'Draft' },
  { id: 'gel-1-2026-ganjil', nama: 'Gelombang 1 2026 Ganjil', tahun: '2026', semester: 'Ganjil', status: 'Draft' },
];
