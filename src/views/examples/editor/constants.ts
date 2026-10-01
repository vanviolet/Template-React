export interface DocumentTemplate {
  id: string;
  titleKey: string;
  defaultTitle: string;
  descriptionKey: string;
  defaultDescription: string;
  badge: string;
  htmlContent: string;
}

export const SAMPLE_TEMPLATES: DocumentTemplate[] = [
  {
    id: 'announcement',
    titleKey: 'editor.templates.announcementTitle',
    defaultTitle: 'Surat Edaran & Pengumuman Resmi',
    descriptionKey: 'editor.templates.announcementDesc',
    defaultDescription: 'Format standar edaran resmi perusahaan atau institusi.',
    badge: 'Formal',
    htmlContent: `
<h1>PENGUMUMAN IMPLEMENTASI SISTEM TERPADU 2026</h1>
<p>Kepada Seluruh Rekan Tim dan Karyawan,</p>
<p>Sehubungan dengan peningkatan infrastruktur digital di lingkungan operasional, kami dengan bangga mengumumkan rilis versi terbaru platform manajemen terpadu yang dilengkapi dengan <strong>Rich Text Editor bertenaga Lexical</strong>.</p>
<hr>
<h2>1. Pokok Perubahan & Inovasi</h2>
<p>Pembaruan ini mencakup berbagai peningkatan performa dan kemudahan penggunaan:</p>
<ul>
  <li><strong>Dukungan Markdown Otomatis:</strong> Ketik simbol heading atau list langsung di kanvas.</li>
  <li><strong>Floating Selection Bar:</strong> Toolbar instan saat Anda menyeleksi kata atau kalimat.</li>
  <li><strong>Ekspor Fleksibel:</strong> Simpan hasil ketikan sebagai HTML bersih atau file Markdown (.md).</li>
  <li><strong>Perlindungan Mode Baca:</strong> Kunci dokumen sewaktu-waktu untuk mencegah salah ubah.</li>
</ul>
<hr>
<h2>2. Jadwal Sosialisasi & Implementasi</h2>
<table style="width: 100%; border-collapse: collapse;">
  <thead>
    <tr>
      <th style="padding: 8px; border: 1px solid #cbd5e1; background-color: rgba(148, 163, 184, 0.15); text-align: left;">Tahapan Pelaksanaan</th>
      <th style="padding: 8px; border: 1px solid #cbd5e1; background-color: rgba(148, 163, 184, 0.15); text-align: left;">Tanggal Rencana</th>
      <th style="padding: 8px; border: 1px solid #cbd5e1; background-color: rgba(148, 163, 184, 0.15); text-align: left;">Penanggung Jawab</th>
      <th style="padding: 8px; border: 1px solid #cbd5e1; background-color: rgba(148, 163, 184, 0.15); text-align: left;">Status</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 8px; border: 1px solid #cbd5e1;">Sosialisasi Internal & Pelatihan</td>
      <td style="padding: 8px; border: 1px solid #cbd5e1;">Senin, 05 Okt 2026</td>
      <td style="padding: 8px; border: 1px solid #cbd5e1;">Divisi IT & Kepegawaian</td>
      <td style="padding: 8px; border: 1px solid #cbd5e1;">Terjadwal</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #cbd5e1;">Uji Coba Lapangan (Staging)</td>
      <td style="padding: 8px; border: 1px solid #cbd5e1;">Jumat, 09 Okt 2026</td>
      <td style="padding: 8px; border: 1px solid #cbd5e1;">Tim QA & Manajer Unit</td>
      <td style="padding: 8px; border: 1px solid #cbd5e1;">Dalam Proses</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #cbd5e1;">Penerapan Penuh Sistem (Go Live)</td>
      <td style="padding: 8px; border: 1px solid #cbd5e1;">Kamis, 15 Okt 2026</td>
      <td style="padding: 8px; border: 1px solid #cbd5e1;">Direksi Operasional</td>
      <td style="padding: 8px; border: 1px solid #cbd5e1;">Disetujui</td>
    </tr>
  </tbody>
</table>
<figure style="text-align: center; margin: 1.5rem 0;">
  <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80" alt="Dashboard Analitik" style="max-width: 100%; width: 75%; border-radius: 0.75rem; display: inline-block;" />
  <figcaption style="font-size: 0.75rem; color: #64748b; margin-top: 0.5rem; font-style: italic;">Gambar 1: Antarmuka Dashboard Digital Operasional 2026</figcaption>
</figure>
<blockquote>"Kerapian dokumentasi adalah cermin kedisiplinan dan keunggulan operasional sebuah organisasi."</blockquote>
<p>Demikian pengumuman ini disampaikan untuk diketahui dan dilaksanakan dengan sebaik-baiknya.</p>
    `.trim(),
  },
  {
    id: 'meeting-notes',
    titleKey: 'editor.templates.meetingTitle',
    defaultTitle: 'Notulen Rapat (Meeting Minutes)',
    descriptionKey: 'editor.templates.meetingDesc',
    defaultDescription: 'Catatan ringkas agenda, hasil diskusi, dan daftar aksi tindak lanjut.',
    badge: 'Produktivitas',
    htmlContent: `
<h1>NOTULEN RAPAT KOORDINASI MINGGUAN (SPRINT REVIEW)</h1>
<p><strong>Tanggal:</strong> 30 September 2026 | <strong>Pukul:</strong> 14:00 - 15:30 WIB | <strong>Lokasi:</strong> Ruang Kolaborasi 4A</p>
<hr>
<h2>Agenda Utama</h2>
<ul>
  <li>Evaluasi pencapaian sprint release fitur Rich Text Editor.</li>
  <li>Uji kompatibilitas Dark & Light Theme pada komponen antarmuka.</li>
  <li>Sinkronisasi validasi TanStack Form + Zod.</li>
</ul>
<hr>
<h2>Ringkasan Keputusan</h2>
<p>Seluruh tim sepakat bahwa komponen Rich Editor menggunakan <strong>Lexical</strong> memberikan fleksibilitas performa tinggi dan bebas dari dependensi rentan.</p>
<blockquote>Poin penting: Pastikan semua teks UI terintegrasi dengan i18n dwibahasa (Indonesia & Inggris).</blockquote>
<hr>
<h2>Daftar Tindak Lanjut (Action Items)</h2>
<ol>
  <li>Tim Frontend: Menyelesaikan styling floating toolbar dan status bar kata.</li>
  <li>Tim QA: Pengujian interaksi di perangkat mobile dan tablet.</li>
  <li>Tim Desain: Penyelarasan palet warna sorotan teks (highlight).</li>
</ol>
    `.trim(),
  },
  {
    id: 'tech-sop',
    titleKey: 'editor.templates.sopTitle',
    defaultTitle: 'SOP & Dokumentasi Teknis',
    descriptionKey: 'editor.templates.sopDesc',
    defaultDescription: 'Panduan teknis arsitektur, panduan konfigurasi, dan best practices.',
    badge: 'Teknis',
    htmlContent: `
<h1>STANDAR OPERASIONAL PROSEDUR: INTEGRASI KOMPONEN LEXICAL</h1>
<p>Dokumen ini mengatur tata cara penggunaan komponen Rich Editor dalam ekosistem aplikasi.</p>
<hr>
<h2>Spesifikasi Arsitektur</h2>
<p>Komponen dibangun di atas <code>@lexical/react</code> dengan arsitektur headless yang bersih:</p>
<pre><code>import { RichEditor } from '@/components/ui/rich.editor';

export function ContohPenggunaan() {
  const [content, setContent] = useState('&lt;p&gt;Halo Dunia&lt;/p&gt;');
  return (
    &lt;RichEditor
      value={content}
      onChange={(html) =&gt; setContent(html)}
      placeholder="Tulis artikel Anda..."
    /&gt;
  );
}</code></pre>
<hr>
<h2>Ketentuan Validasi</h2>
<ul>
  <li>Teks minimal terdiri dari <strong>10 karakter</strong> sebelum dapat disimpan.</li>
  <li>Semua tautan hyperlink wajib memiliki protokol valid (<code>https://</code> atau <code>mailto:</code>).</li>
</ul>
    `.trim(),
  },
];

export const MARKDOWN_CHEATSHEET = [
  { trigger: '# [spasi]', result: 'Heading 1', example: '# Judul Utama' },
  { trigger: '## [spasi]', result: 'Heading 2', example: '## Sub Judul' },
  { trigger: '### [spasi]', result: 'Heading 3', example: '### Topik Kecil' },
  { trigger: '- [spasi]', result: 'Bullet List', example: '- Poin pertama' },
  { trigger: '1. [spasi]', result: 'Numbered List', example: '1. Langkah kesatu' },
  { trigger: '> [spasi]', result: 'Kutipan / Blockquote', example: '> Kata mutiara penting' },
  { trigger: '``` [spasi]', result: 'Code Block', example: '``` (Blok Kode Otomatis)' },
  { trigger: '--- [enter]', result: 'Garis Pembatas', example: 'Garis horizontal' },
];
