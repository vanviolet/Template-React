import React, { useState, useRef, useMemo, useEffect, useCallback } from 'react';
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
  Maximize2,
  Minimize2,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Move,
  Info,
  Check,
  X,
  Compass,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Combobox } from '@/components/ui/combobox';
import { cn } from '@/utils/cn';
import { GelombangPendaftaranConfig, TreeNodeItem, BerkasRuleItem } from './types';

interface GraphPreviewProps {
  config: GelombangPendaftaranConfig;
  selectedNodeId?: string | null;
  onSelectNode: (node: TreeNodeItem) => void;
  searchQuery?: string;
}

interface NetworkNode {
  id: string;
  type: 'gelombang' | 'prodi' | 'shift' | 'jalur' | 'jenis' | 'berkas';
  title: string;
  subtitle?: string;
  badge?: string;
  color: 'primary' | 'blue' | 'emerald' | 'amber' | 'purple' | 'rose';
  icon: 'graduation' | 'prodi' | 'clock' | 'sliders' | 'users' | 'file';
  x: number;
  y: number;
  width: number;
  height: number;
  data: any;
  // Relationship IDs for quick lookup
  connectedTo: string[];
}

interface NetworkEdge {
  id: string;
  from: string;
  to: string;
  label?: string;
  type: 'hierarchy' | 'relation-jenis' | 'relation-jalur' | 'relation-shift';
  color: string;
}

export function GraphPreview({
  config,
  selectedNodeId,
  onSelectNode,
  searchQuery = '',
}: GraphPreviewProps) {
  // Canvas Transform State: Pan (x, y) and Zoom
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 80, y: 50 });
  const [zoom, setZoom] = useState<number>(0.85);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const panStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Selected & Hovered Node IDs
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [activeFocusedId, setActiveFocusedId] = useState<string | null>(selectedNodeId || null);

  // Simulation Filter states
  const [simulasiJalurId, setSimulasiJalurId] = useState<string>('all');
  const [simulasiJenisId, setSimulasiJenisId] = useState<string>('all');

  // Flatten all berkas rules
  const allBerkasRules = useMemo(() => {
    const list: (BerkasRuleItem & { kategoriLabel: string; kategoriKey: string })[] = [];
    config.berkas_wajib.untuk_cmaba_n_dan_d.forEach((b) =>
      list.push({ ...b, kategoriLabel: 'Umum (N & D)', kategoriKey: 'untuk_cmaba_n_dan_d' })
    );
    config.berkas_wajib.untuk_cmaba_non_disabilitas.forEach((b) =>
      list.push({ ...b, kategoriLabel: 'Non-Disabilitas', kategoriKey: 'untuk_cmaba_non_disabilitas' })
    );
    config.berkas_wajib.untuk_cmaba_disabilitas.forEach((b) =>
      list.push({ ...b, kategoriLabel: 'Disabilitas', kategoriKey: 'untuk_cmaba_disabilitas' })
    );
    return list;
  }, [config]);

  // Overall quick metrics
  const totalKuota = useMemo(() => {
    let total = 0;
    config.prodi.forEach((p) => {
      p.kuota_shift.forEach((s) => {
        total += (s.jumlah_pendaftar_mahasiswa_n || 0) + (s.jumlah_pendaftar_mahasiswa_d || 0);
      });
    });
    return total;
  }, [config]);

  /* =========================================================================
     COMPUTE NETWORK GRAPH NODES & POSITIONS (2D Topological Network)
     ========================================================================= */
  const { nodes, edges, nodeMap } = useMemo(() => {
    const calculatedNodes: NetworkNode[] = [];
    const calculatedEdges: NetworkEdge[] = [];

    // Layout configuration coordinates
    const X_GELOMBANG = 80;
    const X_PRODI = 420;
    const X_SHIFT = 760;
    const X_JALUR = 1100;
    const X_JENIS = 1460;
    const X_BERKAS = 1820;

    // 1. Root Node: Gelombang
    const rootNodeId = 'root-gelombang';
    calculatedNodes.push({
      id: rootNodeId,
      type: 'gelombang',
      title: config.gelombang_nama,
      subtitle: `T.A. ${config.tahun_akademik} ${config.semester} • ${totalKuota} Kuota Total`,
      badge: 'Aktif',
      color: 'primary',
      icon: 'graduation',
      x: X_GELOMBANG,
      y: 280,
      width: 240,
      height: 96,
      data: config,
      connectedTo: [],
    });

    // 2. Prodi & Shift Nodes
    let currentProdiY = 80;
    let currentShiftY = 80;

    config.prodi.forEach((p) => {
      const prodiNodeId = `prodi-${p.id}`;
      let pKuota = 0;
      p.kuota_shift.forEach((s) => (pKuota += (s.jumlah_pendaftar_mahasiswa_n || 0) + (s.jumlah_pendaftar_mahasiswa_d || 0)));

      calculatedNodes.push({
        id: prodiNodeId,
        type: 'prodi',
        title: p.nama_prodi || p.id,
        subtitle: `Kode: ${p.kode} • ${p.fakultas}`,
        badge: `${pKuota} Kuota`,
        color: 'blue',
        icon: 'prodi',
        x: X_PRODI,
        y: currentProdiY,
        width: 220,
        height: 84,
        data: p,
        connectedTo: [rootNodeId],
      });

      // Edge from Root to Prodi
      calculatedEdges.push({
        id: `edge-${rootNodeId}-${prodiNodeId}`,
        from: rootNodeId,
        to: prodiNodeId,
        type: 'hierarchy',
        color: 'var(--primary)',
      });

      // Shifts under this prodi
      p.kuota_shift.forEach((s) => {
        const shiftNodeId = `shift-${p.id}-${s.id_pilihan_shift}`;
        calculatedNodes.push({
          id: shiftNodeId,
          type: 'shift',
          title: s.nama_shift || `Shift ${s.id_pilihan_shift}`,
          subtitle: `${s.jam || ''} • N:${s.jumlah_pendaftar_mahasiswa_n} D:${s.jumlah_pendaftar_mahasiswa_d}`,
          badge: `ID #${s.id_pilihan_shift}`,
          color: 'emerald',
          icon: 'clock',
          x: X_SHIFT,
          y: currentShiftY,
          width: 210,
          height: 76,
          data: { prodiId: p.id, prodiName: p.nama_prodi, ...s },
          connectedTo: [prodiNodeId],
        });

        // Edge from Prodi to Shift
        calculatedEdges.push({
          id: `edge-${prodiNodeId}-${shiftNodeId}`,
          from: prodiNodeId,
          to: shiftNodeId,
          type: 'hierarchy',
          color: '#10b981',
        });

        currentShiftY += 92;
      });

      currentProdiY += Math.max(105, p.kuota_shift.length * 92);
    });

    // 3. Jalur Pendaftaran Nodes
    let currentJalurY = 80;
    config.pilihan_jalur_pendaftaran.forEach((j) => {
      const jalurNodeId = `jalur-${j.id}`;
      calculatedNodes.push({
        id: jalurNodeId,
        type: 'jalur',
        title: j.nama_jalur,
        subtitle: j.deskripsi || `Jalur seleksi penerimaan #${j.id}`,
        badge: `#${j.id}`,
        color: 'amber',
        icon: 'sliders',
        x: X_JALUR,
        y: currentJalurY,
        width: 230,
        height: 84,
        data: j,
        connectedTo: [rootNodeId],
      });

      // Edge from Root to Jalur
      calculatedEdges.push({
        id: `edge-${rootNodeId}-${jalurNodeId}`,
        from: rootNodeId,
        to: jalurNodeId,
        type: 'hierarchy',
        color: '#f59e0b',
      });

      currentJalurY += 105;
    });

    // 4. Jenis Pendaftaran Nodes
    let currentJenisY = 80;
    config.pilihan_jenis_pendaftaran.forEach((j) => {
      const jenisNodeId = `jenis-${j.id}`;
      calculatedNodes.push({
        id: jenisNodeId,
        type: 'jenis',
        title: j.nama_jenis,
        subtitle: j.deskripsi || `Kategori pendaftaran #${j.id}`,
        badge: `#${j.id}`,
        color: 'purple',
        icon: 'users',
        x: X_JENIS,
        y: currentJenisY,
        width: 230,
        height: 84,
        data: j,
        connectedTo: [rootNodeId],
      });

      // Edge from Root to Jenis
      calculatedEdges.push({
        id: `edge-${rootNodeId}-${jenisNodeId}`,
        from: rootNodeId,
        to: jenisNodeId,
        type: 'hierarchy',
        color: '#a855f7',
      });

      currentJenisY += 115;
    });

    // 5. Berkas Persyaratan Nodes & Live Relational Connectors to Jenis, Jalur, and Shifts
    let currentBerkasY = 60;
    allBerkasRules.forEach((b) => {
      const berkasNodeId = `berkas-${b.kategoriKey}-${b.id_berkas_pendaftaran}`;
      const connectedTo: string[] = [];

      calculatedNodes.push({
        id: berkasNodeId,
        type: 'berkas',
        title: b.nama_berkas,
        subtitle: `${b.kategoriLabel} • WNI: ${b.wajib_untuk_wni ? 'Wajib' : 'Tidak'} • WNA: ${b.wajib_untuk_wna ? 'Wajib' : 'Tidak'}`,
        badge: b.kategori || 'Berkas',
        color: 'rose',
        icon: 'file',
        x: X_BERKAS,
        y: currentBerkasY,
        width: 250,
        height: 94,
        data: b,
        connectedTo,
      });

      // EXPLICIT RELATIONAL EDGES:
      // (a) Berkas to Connected Jenis
      b.untuk_jenis_pendaftaran.forEach((jnId) => {
        const targetJenisNodeId = `jenis-${jnId}`;
        connectedTo.push(targetJenisNodeId);
        calculatedEdges.push({
          id: `edge-${targetJenisNodeId}-${berkasNodeId}`,
          from: targetJenisNodeId,
          to: berkasNodeId,
          label: 'Wajib Jenis',
          type: 'relation-jenis',
          color: '#a855f7',
        });
      });

      // (b) Berkas to Connected Jalur
      b.untuk_jalur_pendaftaran.forEach((jId) => {
        const targetJalurNodeId = `jalur-${jId}`;
        connectedTo.push(targetJalurNodeId);
        calculatedEdges.push({
          id: `edge-${targetJalurNodeId}-${berkasNodeId}`,
          from: targetJalurNodeId,
          to: berkasNodeId,
          label: 'Wajib Jalur',
          type: 'relation-jalur',
          color: '#f59e0b',
        });
      });

      currentBerkasY += 120;
    });

    const map = new Map<string, NetworkNode>();
    calculatedNodes.forEach((n) => map.set(n.id, n));

    return {
      nodes: calculatedNodes,
      edges: calculatedEdges,
      nodeMap: map,
    };
  }, [config, allBerkasRules, totalKuota]);

  /* =========================================================================
     COMPUTE ACTIVE RELATION HIGHLIGHTS & SIMULATION
     ========================================================================= */
  const activeFocusId = hoveredNodeId || activeFocusedId;

  const { highlightedNodeIds, highlightedEdgeIds } = useMemo(() => {
    const nodeIds = new Set<string>();
    const edgeIds = new Set<string>();

    // 1. Simulation Match Highlighting
    const isSimulating = simulasiJalurId !== 'all' || simulasiJenisId !== 'all';
    if (isSimulating) {
      const sJalurId = simulasiJalurId === 'all' ? null : Number(simulasiJalurId);
      const sJenisId = simulasiJenisId === 'all' ? null : Number(simulasiJenisId);

      nodeIds.add('root-gelombang');
      if (sJalurId !== null) nodeIds.add(`jalur-${sJalurId}`);
      if (sJenisId !== null) nodeIds.add(`jenis-${sJenisId}`);

      allBerkasRules.forEach((b) => {
        const matchJalur = sJalurId === null || b.untuk_jalur_pendaftaran.includes(sJalurId);
        const matchJenis = sJenisId === null || b.untuk_jenis_pendaftaran.includes(sJenisId);
        if (matchJalur && matchJenis) {
          const docNodeId = `berkas-${b.kategoriKey}-${b.id_berkas_pendaftaran}`;
          nodeIds.add(docNodeId);
          if (sJalurId !== null) edgeIds.add(`edge-jalur-${sJalurId}-${docNodeId}`);
          if (sJenisId !== null) edgeIds.add(`edge-jenis-${sJenisId}-${docNodeId}`);
        }
      });
    }

    // 2. Direct Node Click or Hover Focus Highlighting
    if (activeFocusId && nodeMap.has(activeFocusId)) {
      nodeIds.add(activeFocusId);

      // Find all directly connected edges & peer nodes
      edges.forEach((edge) => {
        if (edge.from === activeFocusId || edge.to === activeFocusId) {
          edgeIds.add(edge.id);
          nodeIds.add(edge.from);
          nodeIds.add(edge.to);
        }
      });
    }

    return {
      highlightedNodeIds: nodeIds,
      highlightedEdgeIds: edgeIds,
    };
  }, [activeFocusId, simulasiJalurId, simulasiJenisId, edges, nodeMap, allBerkasRules]);

  /* =========================================================================
     INTERACTIVE PAN & ZOOM MOUSE HANDLERS
     ========================================================================= */
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left mouse button
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    panStartRef.current = { x: pan.x, y: pan.y };
  };

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;
      setPan({
        x: panStartRef.current.x + dx,
        y: panStartRef.current.y + dy,
      });
    },
    [isDragging]
  );

  const handleMouseUp = () => setIsDragging(false);

  // Wheel zoom centered on pointer
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
    setZoom((prev) => Math.min(1.8, Math.max(0.35, prev * zoomFactor)));
  };

  // Auto Fit / Center Viewport
  const handleFitToScreen = () => {
    setPan({ x: 60, y: 40 });
    setZoom(0.68);
  };

  const handleReset = () => {
    setPan({ x: 80, y: 50 });
    setZoom(0.85);
  };

  // Node Click Selection
  const handleNodeClick = (node: NetworkNode, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveFocusedId(node.id);
    onSelectNode({
      id: node.id,
      type: node.type as any,
      title: node.title,
      subtitle: node.subtitle,
      iconName: (node.icon === 'prodi' ? 'graduation' : node.icon) as any,
      themeColor: (node.color === 'blue' ? 'primary' : node.color) as any,
      statusActive: true,
      data: node.data,
    });
  };

  // Render SVG Bezier Curve between two nodes
  const renderEdgePath = (edge: NetworkEdge) => {
    const fromNode = nodeMap.get(edge.from);
    const toNode = nodeMap.get(edge.to);
    if (!fromNode || !toNode) return null;

    // Start point: right side middle of fromNode
    const x1 = fromNode.x + fromNode.width;
    const y1 = fromNode.y + fromNode.height / 2;

    // End point: left side middle of toNode
    const x2 = toNode.x;
    const y2 = toNode.y + toNode.height / 2;

    const dx = Math.abs(x2 - x1) * 0.5;
    const pathD = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;

    const isHighlighted = highlightedEdgeIds.has(edge.id);
    const isAnyActive = highlightedNodeIds.size > 0;
    const opacity = isHighlighted ? 1 : isAnyActive ? 0.12 : 0.35;
    const strokeWidth = isHighlighted ? 3 : 1.5;

    return (
      <g key={edge.id} className="transition-all duration-200">
        {/* Glow Shadow when highlighted */}
        {isHighlighted && (
          <path
            d={pathD}
            fill="none"
            stroke={edge.color}
            strokeWidth={strokeWidth + 4}
            strokeOpacity={0.4}
            strokeLinecap="round"
          />
        )}
        <path
          d={pathD}
          fill="none"
          stroke={edge.color}
          strokeWidth={strokeWidth}
          strokeOpacity={opacity}
          strokeDasharray={edge.type.startsWith('relation') ? (isHighlighted ? undefined : '5,5') : undefined}
          strokeLinecap="round"
        />
      </g>
    );
  };

  // Node Color Stylings
  const getNodeColorClass = (color: NetworkNode['color'], isHighlighted: boolean, isDimmed: boolean) => {
    if (isHighlighted) {
      switch (color) {
        case 'primary':
        case 'blue':
          return 'border-primary ring-4 ring-primary/25 bg-card shadow-lg';
        case 'emerald':
          return 'border-emerald-500 ring-4 ring-emerald-500/25 bg-emerald-50/70 dark:bg-emerald-950/40 shadow-lg';
        case 'amber':
          return 'border-amber-500 ring-4 ring-amber-500/25 bg-amber-50/70 dark:bg-amber-950/40 shadow-lg';
        case 'purple':
          return 'border-purple-500 ring-4 ring-purple-500/25 bg-purple-50/70 dark:bg-purple-950/40 shadow-lg';
        case 'rose':
          return 'border-rose-500 ring-4 ring-rose-500/25 bg-rose-50/70 dark:bg-rose-950/40 shadow-lg';
      }
    }

    if (isDimmed) {
      return 'opacity-25 border-border/50 bg-card/60';
    }

    return 'border-border/80 bg-card hover:border-foreground/40 hover:shadow-md';
  };

  const getIconContainerClass = (color: NetworkNode['color']) => {
    switch (color) {
      case 'primary':
      case 'blue':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'emerald':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case 'amber':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      case 'purple':
        return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20';
      case 'rose':
        return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
    }
  };

  return (
    <div className="relative w-full rounded-3xl border border-border/70 bg-card overflow-hidden select-none shadow-xs">
      {/* 1. Network Toolbar with Simulation, Info, and Pan/Zoom Controls */}
      <div className="p-3 sm:px-5 border-b border-border/60 bg-muted/30 dark:bg-muted/15 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Left: Network Title & Guide */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center shrink-0">
            <Compass className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs sm:text-sm font-bold text-foreground">
                Network Diagram Topology
              </h3>
              <Badge variant="outline" className="text-[10px] font-mono bg-card">
                Interactive Canvas
              </Badge>
            </div>
            <p className="text-[11px] text-muted-foreground hidden sm:block">
              🖱️ Drag kanvas untuk geser • 🛞 Scroll untuk zoom • 👆 Klik node untuk telusuri relasi
            </p>
          </div>
        </div>

        {/* Right: Simulation Controls & Zoom Action Dock */}
        <div className="flex items-center gap-2 flex-wrap justify-between lg:justify-end">
          {/* Simulation Jalur Selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-muted-foreground whitespace-nowrap hidden sm:inline">
              Simulasi Jalur:
            </span>
            <div className="w-38 sm:w-44">
              <Combobox
                options={[
                  { label: 'Semua Jalur', value: 'all' },
                  ...config.pilihan_jalur_pendaftaran.map((j) => ({
                    label: `#${j.id} ${j.nama_jalur}`,
                    value: String(j.id),
                  })),
                ]}
                value={simulasiJalurId}
                onChange={setSimulasiJalurId}
                placeholder="Pilih Jalur..."
              />
            </div>
          </div>

          {/* Simulation Jenis Selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-muted-foreground whitespace-nowrap hidden sm:inline">
              Jenis:
            </span>
            <div className="w-38 sm:w-44">
              <Combobox
                options={[
                  { label: 'Semua Jenis', value: 'all' },
                  ...config.pilihan_jenis_pendaftaran.map((j) => ({
                    label: `#${j.id} ${j.nama_jenis}`,
                    value: String(j.id),
                  })),
                ]}
                value={simulasiJenisId}
                onChange={setSimulasiJenisId}
                placeholder="Pilih Jenis..."
              />
            </div>
          </div>

          {(simulasiJalurId !== 'all' || simulasiJenisId !== 'all') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSimulasiJalurId('all');
                setSimulasiJenisId('all');
              }}
              className="h-8 px-2 text-xs text-muted-foreground hover:text-destructive cursor-pointer"
              title="Reset Simulasi"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </Button>
          )}

          {/* Zoom & Canvas Actions */}
          <div className="flex items-center gap-0.5 bg-muted/70 rounded-xl p-0.5 border border-border/60">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setZoom((prev) => Math.max(0.35, prev - 0.1))}
              className="h-7 w-7 text-muted-foreground hover:text-foreground rounded-lg cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </Button>
            <span className="text-[11px] font-mono font-semibold text-muted-foreground w-11 text-center tabular-nums">
              {Math.round(zoom * 100)}%
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setZoom((prev) => Math.min(1.8, prev + 0.1))}
              className="h-7 w-7 text-muted-foreground hover:text-foreground rounded-lg cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleFitToScreen}
              className="h-7 w-7 text-muted-foreground hover:text-foreground rounded-lg cursor-pointer"
              title="Fit to Screen"
            >
              <Maximize2 className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleReset}
              className="h-7 w-7 text-muted-foreground hover:text-foreground rounded-lg cursor-pointer"
              title="Reset Posisi"
            >
              <RotateCcw className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>

      {/* 2. Interactive Infinite Canvas Area */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        className={cn(
          'relative w-full h-[640px] sm:h-[720px] overflow-hidden bg-dot-grid cursor-grab active:cursor-grabbing select-none',
          isDragging && 'cursor-grabbing'
        )}
      >
        {/* Layer Group with Pan & Zoom Transform */}
        <div
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: '0 0',
            transition: isDragging ? 'none' : 'transform 100ms ease-out',
            width: '2200px',
            height: '1100px',
          }}
          className="absolute inset-0 pointer-events-none"
        >
          {/* SVG Connector Layer */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-0"
            style={{ width: '2200px', height: '1100px' }}
          >
            <defs>
              <linearGradient id="grad-primary" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.8" />
              </linearGradient>
            </defs>
            {edges.map((edge) => renderEdgePath(edge))}
          </svg>

          {/* HTML Interactive Nodes Layer */}
          <div className="absolute inset-0 w-full h-full z-10">
            {nodes.map((node) => {
              const isHighlighted = highlightedNodeIds.has(node.id);
              const isAnyActive = highlightedNodeIds.size > 0;
              const isDimmed = isAnyActive && !isHighlighted;
              const isSelected = activeFocusedId === node.id;

              return (
                <div
                  key={node.id}
                  onClick={(e) => handleNodeClick(node, e)}
                  onMouseEnter={() => setHoveredNodeId(node.id)}
                  onMouseLeave={() => setHoveredNodeId(null)}
                  style={{
                    left: `${node.x}px`,
                    top: `${node.y}px`,
                    width: `${node.width}px`,
                    height: `${node.height}px`,
                  }}
                  className={cn(
                    'absolute rounded-2xl border p-3 flex flex-col justify-between pointer-events-auto transition-all duration-200 cursor-pointer shadow-xs',
                    getNodeColorClass(node.color, isHighlighted || isSelected, isDimmed)
                  )}
                >
                  {/* Top Node Header: Icon, Title & Badge */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className={cn(
                          'w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 transition-colors',
                          getIconContainerClass(node.color)
                        )}
                      >
                        {node.icon === 'graduation' && <GraduationCap className="h-4 w-4" />}
                        {node.icon === 'prodi' && <Layers className="h-4 w-4" />}
                        {node.icon === 'clock' && <Clock className="h-4 w-4" />}
                        {node.icon === 'sliders' && <SlidersHorizontal className="h-4 w-4" />}
                        {node.icon === 'users' && <Users className="h-4 w-4" />}
                        {node.icon === 'file' && <FileText className="h-4 w-4" />}
                      </div>
                      <h4 className="text-xs font-bold text-foreground truncate">{node.title}</h4>
                    </div>

                    {node.badge && (
                      <span className="text-[9px] font-mono font-medium px-1.5 py-0.5 rounded bg-muted text-muted-foreground shrink-0 border border-border/50">
                        {node.badge}
                      </span>
                    )}
                  </div>

                  {/* Node Subtitle */}
                  {node.subtitle && (
                    <p className="text-[10px] text-muted-foreground truncate leading-relaxed">
                      {node.subtitle}
                    </p>
                  )}

                  {/* Relational Quick Hint Indicator */}
                  {node.type === 'berkas' && (
                    <div className="flex items-center justify-between text-[9px] font-mono text-muted-foreground pt-1 border-t border-border/40">
                      <span>{node.data.untuk_jenis_pendaftaran?.length || 0} Jenis</span>
                      <span>•</span>
                      <span>{node.data.untuk_jalur_pendaftaran?.length || 0} Jalur</span>
                      <span>•</span>
                      <span>{node.data.untuk_pilihan_shift_pendaftaran?.length || 0} Shift</span>
                    </div>
                  )}

                  {node.type === 'jenis' && (
                    <div className="flex items-center justify-between text-[9px] font-mono text-purple-600 dark:text-purple-400 pt-1 border-t border-border/40 font-semibold">
                      <span>Terhubung ke Berkas Wajib</span>
                      <span>→</span>
                    </div>
                  )}

                  {node.type === 'jalur' && (
                    <div className="flex items-center justify-between text-[9px] font-mono text-amber-600 dark:text-amber-400 pt-1 border-t border-border/40 font-semibold">
                      <span>Terhubung ke Berkas Wajib</span>
                      <span>→</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Floating Quick Legend & Status at Bottom-Left */}
        <div className="absolute bottom-4 left-4 p-2.5 rounded-2xl bg-card/90 backdrop-blur-md border border-border/70 shadow-md flex items-center gap-3 text-xs pointer-events-auto">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-primary" />
            <span className="text-[11px] text-muted-foreground">Gelombang</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span className="text-[11px] text-muted-foreground">Prodi</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-[11px] text-muted-foreground">Shift</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-[11px] text-muted-foreground">Jalur</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
            <span className="text-[11px] text-muted-foreground">Jenis</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span className="text-[11px] text-muted-foreground">Berkas</span>
          </div>
        </div>

        {/* 4. Mini Navigation Compass Reset Button at Bottom-Right */}
        <div className="absolute bottom-4 right-4 flex items-center gap-2 pointer-events-auto">
          {activeFocusedId && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveFocusedId(null)}
              className="h-8 px-2.5 text-xs rounded-xl bg-card/90 shadow-md border-border text-foreground hover:bg-muted cursor-pointer"
            >
              <X className="h-3.5 w-3.5 mr-1" />
              <span>Hapus Fokus</span>
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={handleFitToScreen}
            className="h-8 px-3 text-xs rounded-xl bg-card/90 shadow-md border-border text-foreground hover:bg-muted cursor-pointer font-medium"
          >
            <Move className="h-3.5 w-3.5 mr-1.5 text-primary" />
            <span>Pusatkan Kanvas</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
