import React, { useState } from 'react';
import {
  GraduationCap,
  Clock,
  SlidersHorizontal,
  Users,
  FileText,
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/utils/cn';
import { GelombangPendaftaranConfig, TreeNodeItem } from './types';

interface GraphPreviewProps {
  config: GelombangPendaftaranConfig;
  selectedNodeId?: string | null;
  onSelectNode: (node: TreeNodeItem) => void;
  searchQuery?: string;
}

export function GraphPreview({
  config,
  selectedNodeId,
  onSelectNode,
  searchQuery = '',
}: GraphPreviewProps) {
  const [zoom, setZoom] = useState<number>(1);
  const [collapsedBranches, setCollapsedBranches] = useState<Set<string>>(new Set());

  // Quick stats
  let totalKuota = 0;
  let totalShift = 0;
  config.prodi.forEach((p) => {
    p.kuota_shift.forEach((s) => {
      totalShift++;
      totalKuota += (s.jumlah_pendaftar_mahasiswa_n || 0) + (s.jumlah_pendaftar_mahasiswa_d || 0);
    });
  });

  const totalBerkas =
    config.berkas_wajib.untuk_cmaba_n_dan_d.length +
    config.berkas_wajib.untuk_cmaba_non_disabilitas.length +
    config.berkas_wajib.untuk_cmaba_disabilitas.length;

  const toggleBranch = (branchKey: string) => {
    setCollapsedBranches((prev) => {
      const next = new Set(prev);
      if (next.has(branchKey)) next.delete(branchKey);
      else next.add(branchKey);
      return next;
    });
  };

  const handleZoomIn = () => setZoom((prev) => Math.min(1.4, Math.round((prev + 0.1) * 10) / 10));
  const handleZoomOut = () => setZoom((prev) => Math.max(0.6, Math.round((prev - 0.1) * 10) / 10));
  const handleResetZoom = () => setZoom(1);

  const query = searchQuery.trim().toLowerCase();
  const isMatch = (text?: string) => Boolean(query && text && text.toLowerCase().includes(query));

  return (
    <div className="relative w-full rounded-3xl border border-border/70 bg-card overflow-hidden select-none shadow-xs">
      {/* Top Bar: Mini KPI stats & Zoom Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 sm:px-5 border-b border-border/50 bg-muted/40 dark:bg-muted/20 backdrop-blur-xs">
        <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto text-xs scrollbar-none py-0.5">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-muted-foreground">Prodi:</span>
            <span className="font-semibold font-mono text-primary">{config.prodi.length}</span>
          </div>
          <span className="text-border shrink-0">•</span>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-muted-foreground">Shift:</span>
            <span className="font-semibold font-mono text-emerald-600 dark:text-emerald-400">{totalShift}</span>
          </div>
          <span className="text-border shrink-0">•</span>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-muted-foreground">Total Kuota:</span>
            <span className="font-semibold font-mono text-foreground">{totalKuota} Mhs</span>
          </div>
          <span className="text-border shrink-0">•</span>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-muted-foreground">Jalur:</span>
            <span className="font-semibold font-mono text-amber-600 dark:text-amber-400">
              {config.pilihan_jalur_pendaftaran.length}
            </span>
          </div>
          <span className="text-border shrink-0">•</span>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-muted-foreground">Jenis:</span>
            <span className="font-semibold font-mono text-purple-600 dark:text-purple-400">
              {config.pilihan_jenis_pendaftaran.length}
            </span>
          </div>
          <span className="text-border shrink-0">•</span>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-muted-foreground">Berkas:</span>
            <span className="font-semibold font-mono text-rose-600 dark:text-rose-400">{totalBerkas}</span>
          </div>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleZoomOut}
            className="h-7 w-7 text-muted-foreground hover:text-foreground rounded-lg cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="h-3.5 w-3.5" />
          </Button>
          <span className="text-[11px] font-mono font-medium text-muted-foreground w-12 text-center tabular-nums">
            {Math.round(zoom * 100)}%
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleZoomIn}
            className="h-7 w-7 text-muted-foreground hover:text-foreground rounded-lg cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleResetZoom}
            className="h-7 w-7 text-muted-foreground hover:text-foreground rounded-lg cursor-pointer"
            title="Reset Zoom"
          >
            <RotateCcw className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="overflow-auto p-6 sm:p-10 min-h-[560px] max-h-[750px] relative bg-muted/10">
        <div
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: 'top center',
            transition: 'transform 150ms ease-out',
          }}
          className="flex flex-col items-center gap-8 w-max min-w-full pb-8"
        >
          {/* LEVEL 0: ROOT GELOMBANG NODE */}
          <div
            onClick={() =>
              onSelectNode({
                id: 'root-gelombang',
                type: 'gelombang',
                title: config.gelombang_nama,
                subtitle: `Tahun Akademik ${config.tahun_akademik} ${config.semester}`,
                iconName: 'graduation',
                themeColor: 'primary',
                statusActive: true,
                data: config,
              })
            }
            className={cn(
              'group relative flex items-center gap-3.5 p-4 rounded-2xl border-2 transition-all cursor-pointer shadow-md bg-card',
              selectedNodeId === 'root-gelombang'
                ? 'border-primary ring-4 ring-primary/20 bg-primary/5'
                : 'border-primary/40 hover:border-primary hover:shadow-lg',
              isMatch(config.gelombang_nama) && 'ring-4 ring-amber-400/50'
            )}
          >
            <div className="w-11 h-11 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-xs">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-foreground">{config.gelombang_nama}</span>
                <Badge className="text-[10px] bg-primary/10 text-primary border-primary/20 font-mono">
                  Aktif
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Tahun Akademik {config.tahun_akademik} • Semester {config.semester}
              </p>
              <div className="flex items-center gap-2 mt-1.5 text-[11px] font-mono text-muted-foreground">
                <span className="bg-muted px-2 py-0.5 rounded-md font-semibold text-foreground">
                  {totalKuota} Kuota Mahasiswa
                </span>
                <span>•</span>
                <span>{config.prodi.length} Prodi</span>
              </div>
            </div>
          </div>

          {/* SVG Connector Branch Lines (Root to 4 Branches) */}
          <div className="relative w-full flex justify-center -my-4 pointer-events-none">
            <svg className="w-[880px] h-12 overflow-visible">
              <path
                d="M 440 0 L 440 24 M 110 24 L 770 24 M 110 24 L 110 48 M 330 24 L 330 48 M 550 24 L 550 48 M 770 24 L 770 48"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-border"
              />
            </svg>
          </div>

          {/* LEVEL 1: THE 4 MAIN BRANCH COLUMNS */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 w-full max-w-7xl pt-1">
            {/* BRANCH 1: PROGRAM STUDI & KUOTA */}
            <div className="flex flex-col gap-3">
              <div
                onClick={() => toggleBranch('prodi')}
                className={cn(
                  'flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer shadow-xs bg-card',
                  'border-primary/40 hover:border-primary',
                  selectedNodeId === 'branch-prodi' && 'ring-2 ring-primary border-primary'
                )}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <Layers className="h-4 w-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-foreground">Program Studi</h5>
                    <p className="text-[10px] text-muted-foreground">{config.prodi.length} Prodi • {totalShift} Shift</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <Badge variant="outline" className="text-[10px] font-mono text-primary">
                    {totalKuota} Kuota
                  </Badge>
                  {collapsedBranches.has('prodi') ? (
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                  )}
                </div>
              </div>

              {/* Children: Prodi & Shifts */}
              {!collapsedBranches.has('prodi') && (
                <div className="space-y-2.5 pl-3 border-l-2 border-primary/20 ml-4 animate-in fade-in duration-150">
                  {config.prodi.map((p) => {
                    const isSelected = selectedNodeId === `prodi-${p.id}`;
                    let pKuota = 0;
                    p.kuota_shift.forEach((s) => (pKuota += (s.jumlah_pendaftar_mahasiswa_n || 0) + (s.jumlah_pendaftar_mahasiswa_d || 0)));
                    const matched = isMatch(p.nama_prodi) || isMatch(p.kode);

                    return (
                      <div
                        key={p.id}
                        className={cn(
                          'p-2.5 rounded-xl border bg-card/90 transition-all text-xs space-y-2 shadow-2xs',
                          isSelected
                            ? 'border-primary ring-2 ring-primary/20 bg-primary/5'
                            : 'border-border/70 hover:border-border',
                          matched && 'ring-2 ring-amber-400 border-amber-400'
                        )}
                      >
                        <div
                          onClick={() =>
                            onSelectNode({
                              id: `prodi-${p.id}`,
                              type: 'prodi',
                              title: p.nama_prodi || p.id,
                              subtitle: `Kode: ${p.kode} • ${p.kuota_shift.length} Shift`,
                              iconName: 'graduation',
                              themeColor: 'primary',
                              statusActive: true,
                              data: p,
                            })
                          }
                          className="flex items-center justify-between cursor-pointer"
                        >
                          <span className="font-semibold text-foreground truncate">{p.nama_prodi || p.id}</span>
                          <span className="text-[10px] font-mono text-muted-foreground px-1.5 py-0.5 rounded bg-muted">
                            {p.kode}
                          </span>
                        </div>

                        {/* Shift pills */}
                        <div className="space-y-1 pt-1 border-t border-border/40">
                          {p.kuota_shift.map((s) => (
                            <div
                              key={s.id_pilihan_shift}
                              onClick={() =>
                                onSelectNode({
                                  id: `shift-${p.id}-${s.id_pilihan_shift}`,
                                  type: 'shift',
                                  title: s.nama_shift || `Shift ${s.id_pilihan_shift}`,
                                  subtitle: `Reguler: ${s.jumlah_pendaftar_mahasiswa_n} • Disabilitas: ${s.jumlah_pendaftar_mahasiswa_d}`,
                                  iconName: 'clock',
                                  themeColor: 'emerald',
                                  statusActive: true,
                                  data: { prodiId: p.id, prodiName: p.nama_prodi, ...s },
                                })
                              }
                              className={cn(
                                'flex items-center justify-between p-1.5 rounded-lg text-[11px] transition-colors cursor-pointer',
                                selectedNodeId === `shift-${p.id}-${s.id_pilihan_shift}`
                                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-semibold'
                                  : 'bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground'
                              )}
                            >
                              <span className="truncate">{s.nama_shift}</span>
                              <span className="font-mono text-[10px] shrink-0 font-medium">
                                N:{s.jumlah_pendaftar_mahasiswa_n} | D:{s.jumlah_pendaftar_mahasiswa_d}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* BRANCH 2: JALUR PENDAFTARAN */}
            <div className="flex flex-col gap-3">
              <div
                onClick={() => toggleBranch('jalur')}
                className={cn(
                  'flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer shadow-xs bg-card',
                  'border-emerald-500/40 hover:border-emerald-500',
                  selectedNodeId === 'branch-jalur' && 'ring-2 ring-emerald-500 border-emerald-500'
                )}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <SlidersHorizontal className="h-4 w-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-foreground">Jalur Seleksi</h5>
                    <p className="text-[10px] text-muted-foreground">{config.pilihan_jalur_pendaftaran.length} Jalur Pendaftaran</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  {collapsedBranches.has('jalur') ? (
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                  )}
                </div>
              </div>

              {/* Children: Jalur items */}
              {!collapsedBranches.has('jalur') && (
                <div className="space-y-2 pl-3 border-l-2 border-emerald-500/20 ml-4 animate-in fade-in duration-150">
                  {config.pilihan_jalur_pendaftaran.map((j) => {
                    const isSelected = selectedNodeId === `jalur-${j.id}`;
                    const matched = isMatch(j.nama_jalur);
                    return (
                      <div
                        key={j.id}
                        onClick={() =>
                          onSelectNode({
                            id: `jalur-${j.id}`,
                            type: 'jalur',
                            title: j.nama_jalur || `Jalur ${j.id}`,
                            subtitle: `ID: ${j.id}`,
                            iconName: 'sliders',
                            themeColor: 'emerald',
                            statusActive: true,
                            data: j,
                          })
                        }
                        className={cn(
                          'p-2.5 rounded-xl border transition-all cursor-pointer text-xs flex items-center justify-between gap-2 shadow-2xs',
                          isSelected
                            ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-950/20'
                            : 'border-border/70 hover:border-border bg-card/90',
                          matched && 'ring-2 ring-amber-400 border-amber-400'
                        )}
                      >
                        <span className="font-medium text-foreground truncate">{j.nama_jalur}</span>
                        <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 shrink-0">
                          #{j.id}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* BRANCH 3: JENIS PENDAFTARAN */}
            <div className="flex flex-col gap-3">
              <div
                onClick={() => toggleBranch('jenis')}
                className={cn(
                  'flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer shadow-xs bg-card',
                  'border-purple-500/40 hover:border-purple-500',
                  selectedNodeId === 'branch-jenis' && 'ring-2 ring-purple-500 border-purple-500'
                )}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                    <Users className="h-4 w-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-foreground">Jenis Pendaftaran</h5>
                    <p className="text-[10px] text-muted-foreground">{config.pilihan_jenis_pendaftaran.length} Kategori Mahasiswa</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  {collapsedBranches.has('jenis') ? (
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                  )}
                </div>
              </div>

              {/* Children: Jenis items */}
              {!collapsedBranches.has('jenis') && (
                <div className="space-y-2 pl-3 border-l-2 border-purple-500/20 ml-4 animate-in fade-in duration-150">
                  {config.pilihan_jenis_pendaftaran.map((j) => {
                    const isSelected = selectedNodeId === `jenis-${j.id}`;
                    const matched = isMatch(j.nama_jenis);
                    return (
                      <div
                        key={j.id}
                        onClick={() =>
                          onSelectNode({
                            id: `jenis-${j.id}`,
                            type: 'jenis',
                            title: j.nama_jenis || `Jenis ${j.id}`,
                            subtitle: `ID: ${j.id}`,
                            iconName: 'users',
                            themeColor: 'purple',
                            statusActive: true,
                            data: j,
                          })
                        }
                        className={cn(
                          'p-2.5 rounded-xl border transition-all cursor-pointer text-xs flex items-center justify-between gap-2 shadow-2xs',
                          isSelected
                            ? 'border-purple-500 ring-2 ring-purple-500/20 bg-purple-50/50 dark:bg-purple-950/20'
                            : 'border-border/70 hover:border-border bg-card/90',
                          matched && 'ring-2 ring-amber-400 border-amber-400'
                        )}
                      >
                        <span className="font-medium text-foreground truncate">{j.nama_jenis}</span>
                        <span className="text-[10px] font-mono text-purple-600 dark:text-purple-400 font-semibold px-1.5 py-0.5 rounded bg-purple-50 dark:bg-purple-950/40 shrink-0">
                          #{j.id}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* BRANCH 4: PERSYARATAN BERKAS */}
            <div className="flex flex-col gap-3">
              <div
                onClick={() => toggleBranch('berkas')}
                className={cn(
                  'flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer shadow-xs bg-card',
                  'border-rose-500/40 hover:border-rose-500',
                  selectedNodeId === 'branch-berkas' && 'ring-2 ring-rose-500 border-rose-500'
                )}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-foreground">Persyaratan Berkas</h5>
                    <p className="text-[10px] text-muted-foreground">{totalBerkas} Dokumen Wajib</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  {collapsedBranches.has('berkas') ? (
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                  )}
                </div>
              </div>

              {/* Children: Berkas categories & items */}
              {!collapsedBranches.has('berkas') && (
                <div className="space-y-2 pl-3 border-l-2 border-rose-500/20 ml-4 animate-in fade-in duration-150">
                  {/* Common Docs */}
                  {config.berkas_wajib.untuk_cmaba_n_dan_d.map((b) => (
                    <div
                      key={b.id_berkas_pendaftaran}
                      onClick={() =>
                        onSelectNode({
                          id: `berkas-nd-${b.id_berkas_pendaftaran}`,
                          type: 'berkas',
                          title: b.nama_berkas || b.id_berkas_pendaftaran,
                          subtitle: `Umum (N & D) • WNI: ${b.wajib_untuk_wni ? 'Ya' : 'Tidak'} • WNA: ${b.wajib_untuk_wna ? 'Ya' : 'Tidak'}`,
                          iconName: 'file',
                          themeColor: 'rose',
                          statusActive: true,
                          data: { kategori: 'untuk_cmaba_n_dan_d', ...b },
                        })
                      }
                      className={cn(
                        'p-2 rounded-lg border text-xs flex items-center justify-between gap-2 cursor-pointer transition-all shadow-2xs',
                        selectedNodeId === `berkas-nd-${b.id_berkas_pendaftaran}`
                          ? 'border-rose-500 ring-2 ring-rose-500/20 bg-rose-50/40 dark:bg-rose-950/20'
                          : 'border-border/60 hover:border-border bg-card/80',
                        isMatch(b.nama_berkas) && 'ring-2 ring-amber-400 border-amber-400'
                      )}
                    >
                      <span className="font-medium text-foreground truncate">{b.nama_berkas}</span>
                      <span className="text-[9px] font-mono text-muted-foreground px-1 rounded bg-muted shrink-0">
                        Umum
                      </span>
                    </div>
                  ))}

                  {/* Non-Disabilitas Docs */}
                  {config.berkas_wajib.untuk_cmaba_non_disabilitas.map((b) => (
                    <div
                      key={b.id_berkas_pendaftaran}
                      onClick={() =>
                        onSelectNode({
                          id: `berkas-nond-${b.id_berkas_pendaftaran}`,
                          type: 'berkas',
                          title: b.nama_berkas || b.id_berkas_pendaftaran,
                          subtitle: 'Khusus Non-Disabilitas',
                          iconName: 'file',
                          themeColor: 'emerald',
                          statusActive: true,
                          data: { kategori: 'untuk_cmaba_non_disabilitas', ...b },
                        })
                      }
                      className={cn(
                        'p-2 rounded-lg border text-xs flex items-center justify-between gap-2 cursor-pointer transition-all shadow-2xs',
                        selectedNodeId === `berkas-nond-${b.id_berkas_pendaftaran}`
                          ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/40 dark:bg-emerald-950/20'
                          : 'border-border/60 hover:border-border bg-card/80',
                        isMatch(b.nama_berkas) && 'ring-2 ring-amber-400 border-amber-400'
                      )}
                    >
                      <span className="font-medium text-foreground truncate">{b.nama_berkas}</span>
                      <span className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400 px-1 rounded bg-emerald-50 dark:bg-emerald-950/40 shrink-0">
                        Non-D
                      </span>
                    </div>
                  ))}

                  {/* Disabilitas Docs */}
                  {config.berkas_wajib.untuk_cmaba_disabilitas.map((b) => (
                    <div
                      key={b.id_berkas_pendaftaran}
                      onClick={() =>
                        onSelectNode({
                          id: `berkas-d-${b.id_berkas_pendaftaran}`,
                          type: 'berkas',
                          title: b.nama_berkas || b.id_berkas_pendaftaran,
                          subtitle: 'Khusus Disabilitas (Inklusif)',
                          iconName: 'shield',
                          themeColor: 'purple',
                          statusActive: true,
                          data: { kategori: 'untuk_cmaba_disabilitas', ...b },
                        })
                      }
                      className={cn(
                        'p-2 rounded-lg border text-xs flex items-center justify-between gap-2 cursor-pointer transition-all shadow-2xs',
                        selectedNodeId === `berkas-d-${b.id_berkas_pendaftaran}`
                          ? 'border-purple-500 ring-2 ring-purple-500/20 bg-purple-50/40 dark:bg-purple-950/20'
                          : 'border-border/60 hover:border-border bg-card/80',
                        isMatch(b.nama_berkas) && 'ring-2 ring-amber-400 border-amber-400'
                      )}
                    >
                      <span className="font-medium text-foreground truncate">{b.nama_berkas}</span>
                      <span className="text-[9px] font-mono text-purple-600 dark:text-purple-400 px-1 rounded bg-purple-50 dark:bg-purple-950/40 shrink-0">
                        Disabilitas
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
