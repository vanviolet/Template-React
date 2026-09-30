import React from 'react';
import {
  ChevronRight,
  GraduationCap,
  Clock,
  SlidersHorizontal,
  Users,
  FileText,
  ShieldCheck,
  Layers,
  Trash2,
  Edit2,
  Plus,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { Button } from '@/components/ui/button';
import { TreeNodeItem } from './types';
import { ActionRow } from './action.row';

interface NodeCardProps {
  node: TreeNodeItem;
  depth?: number;
  isExpanded: boolean;
  isSelected?: boolean;
  onToggleExpand: (id: string) => void;
  onSelectNode: (node: TreeNodeItem) => void;
  onInspect: (node: TreeNodeItem) => void;
  onEditShift?: (prodiId: string, shiftId: number, currentN: number, currentD: number) => void;
  onAddShiftToProdi?: (prodiId: string, prodiName: string) => void;
  onBatchKuotaProdi?: (prodiId: string, prodiName: string) => void;
  onGenShiftProdi?: (prodiId: string, prodiName: string) => void;
  onDeleteProdi?: (prodiId: string, prodiName: string) => void;
  onDeleteShift?: (prodiId: string, shiftId: number, shiftName: string) => void;
  onDeleteJalur?: (jalurId: number, jalurName: string) => void;
  onDeleteJenis?: (jenisId: number, jenisName: string) => void;
  onDeleteBerkas?: (kategori: any, docId: string, docName: string) => void;
  onOpenAddProdi?: () => void;
  onOpenAddJalur?: () => void;
  onOpenAddJenis?: () => void;
  onOpenAddDokumen?: () => void;
}

export function NodeCard({
  node,
  depth = 0,
  isExpanded,
  isSelected,
  onToggleExpand,
  onSelectNode,
  onInspect,
  onEditShift,
  onAddShiftToProdi,
  onBatchKuotaProdi,
  onGenShiftProdi,
  onDeleteProdi,
  onDeleteShift,
  onDeleteJalur,
  onDeleteJenis,
  onDeleteBerkas,
  onOpenAddProdi,
  onOpenAddJalur,
  onOpenAddJenis,
  onOpenAddDokumen,
}: NodeCardProps) {
  const hasChildren = Boolean(node.children && node.children.length > 0);

  // Render proper icon based on node iconName
  const renderIcon = () => {
    switch (node.iconName) {
      case 'graduation':
        return <GraduationCap className="h-4.5 w-4.5" />;
      case 'clock':
        return <Clock className="h-4.5 w-4.5" />;
      case 'sliders':
        return <SlidersHorizontal className="h-4.5 w-4.5" />;
      case 'users':
        return <Users className="h-4.5 w-4.5" />;
      case 'shield':
        return <ShieldCheck className="h-4.5 w-4.5" />;
      case 'layers':
        return <Layers className="h-4.5 w-4.5" />;
      case 'file':
      default:
        return <FileText className="h-4.5 w-4.5" />;
    }
  };

  // Squircle color badge based on themeColor
  const getIconBadgeClass = () => {
    switch (node.themeColor) {
      case 'primary':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'emerald':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case 'purple':
        return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20';
      case 'amber':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      case 'rose':
        return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
      case 'blue':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
      default:
        return 'bg-muted text-muted-foreground border-border/50';
    }
  };

  // Pill styling
  const getPillClass = () => {
    const variant = node.pill?.variant || 'primary';
    switch (variant) {
      case 'emerald':
        return 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'purple':
        return 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      case 'amber':
        return 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'muted':
        return 'bg-muted/70 text-muted-foreground/80 border-border/60';
      case 'primary':
      default:
        return 'bg-primary/10 text-primary border-primary/20';
    }
  };

  return (
    <div
      onClick={() => {
        onSelectNode(node);
        // Automatically open/close children on card click!
        if (hasChildren) {
          onToggleExpand(node.id);
        }
      }}
      className={cn(
        'group relative flex flex-col sm:flex-row sm:items-center justify-between',
        'p-3 sm:px-4 sm:py-3 rounded-2xl border transition-all duration-200 cursor-pointer',
        'bg-card hover:bg-card/90 border-border/70 hover:border-border hover:shadow-xs shadow-[0_1px_3px_rgba(0,0,0,0.02)]',
        'gap-2.5 sm:gap-4 select-none mb-2',
        isSelected && 'ring-2 ring-primary/40 border-primary bg-primary/5'
      )}
    >
      {/* Left Zone: Chevron, Squircle Badge, Title & Meta */}
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
        {/* Chevron expand/collapse button */}
        {hasChildren ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand(node.id);
            }}
            className="h-6 w-6 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition-transform shrink-0 cursor-pointer"
            aria-label={isExpanded ? 'Tutup Hierarki' : 'Buka Hierarki'}
          >
            <ChevronRight
              className={cn(
                'h-4 w-4 transition-transform duration-200',
                isExpanded && 'rotate-90'
              )}
            />
          </button>
        ) : (
          <span className="w-6 shrink-0" />
        )}

        {/* Squircle Badge */}
        <div
          className={cn(
            'w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border shadow-2xs transition-colors',
            getIconBadgeClass()
          )}
        >
          {renderIcon()}
        </div>

        {/* Title and metadata */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h4
              className="text-xs sm:text-[13px] font-semibold tracking-tight text-foreground truncate"
              title={node.title}
            >
              {node.title}
            </h4>

            {node.metaBadge && (
              <span className="text-[10px] px-1.5 py-0.2 rounded font-mono font-medium bg-muted text-muted-foreground border border-border/60 shrink-0">
                {node.metaBadge}
              </span>
            )}
          </div>

          {/* Subtitle */}
          {node.subtitle && (
            <p className="text-[11px] text-muted-foreground/80 mt-0.5 truncate" title={node.subtitle}>
              {node.subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Right Zone: Progress / Metric Capsule, and Direct Action Buttons */}
      <div
        className="flex items-center justify-between sm:justify-end gap-2 sm:gap-2.5 shrink-0 pt-1 sm:pt-0 border-t sm:border-t-0 border-border/30"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Pill Progress / Status Capsule matching the screenshot */}
        {node.pill && (
          <div
            className={cn(
              'relative px-3 py-1 rounded-full text-[11px] font-medium font-mono tabular-nums overflow-hidden select-none border shadow-2xs flex items-center gap-1.5',
              getPillClass()
            )}
          >
            {node.pill.progressPercent !== undefined && node.pill.progressPercent > 0 && (
              <div
                className="absolute inset-y-0 left-0 bg-primary/15 dark:bg-primary/25 pointer-events-none transition-all duration-300"
                style={{ width: `${node.pill.progressPercent}%` }}
              />
            )}
            <span className="relative z-10 whitespace-nowrap">{node.pill.text}</span>
            {node.pill.subtext && (
              <span className="relative z-10 text-[10px] opacity-70 hidden sm:inline">
                ({node.pill.subtext})
              </span>
            )}
          </div>
        )}

        {/* DIRECT ACTION BUTTONS (Tanpa Burger Menu jika aksi tunggal!) */}

        {/* 1. Branch Add Buttons directly on row */}
        {node.type === 'branch-prodi' && (
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              onOpenAddProdi?.();
            }}
            className="h-7 text-xs px-2.5 rounded-lg border-border hover:bg-muted cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            <span>Tambah Prodi</span>
          </Button>
        )}

        {node.type === 'branch-jalur' && (
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              onOpenAddJalur?.();
            }}
            className="h-7 text-xs px-2.5 rounded-lg border-border hover:bg-muted cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            <span>Tambah Jalur</span>
          </Button>
        )}

        {node.type === 'branch-jenis' && (
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              onOpenAddJenis?.();
            }}
            className="h-7 text-xs px-2.5 rounded-lg border-border hover:bg-muted cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            <span>Tambah Jenis</span>
          </Button>
        )}

        {node.type === 'branch-berkas' && (
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              onOpenAddDokumen?.();
            }}
            className="h-7 text-xs px-2.5 rounded-lg border-border hover:bg-muted cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            <span>Tambah Dokumen</span>
          </Button>
        )}

        {/* 2. Program Studi: Direct + Shift button & Direct Delete button, plus dropdown for batch */}
        {node.type === 'prodi' && (
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onAddShiftToProdi?.(node.data.id, node.title);
              }}
              className="h-7 text-xs px-2 rounded-lg border-border hover:bg-muted cursor-pointer flex items-center gap-1"
              title="Tambah Shift"
            >
              <Plus className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Shift</span>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteProdi?.(node.data.id, node.title);
              }}
              className="h-7 w-7 text-destructive/80 hover:text-destructive hover:bg-destructive/10 rounded-lg cursor-pointer"
              title="Hapus Program Studi"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>

            <ActionRow
              node={node}
              onInspect={onInspect}
              onBatchKuotaProdi={onBatchKuotaProdi}
              onGenShiftProdi={onGenShiftProdi}
            />
          </div>
        )}

        {/* 3. Shift: Direct Edit Kuota & Direct Delete button (NO burger menu!) */}
        {node.type === 'shift' && (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onEditShift?.(
                  node.data.prodiId,
                  node.data.shiftId,
                  node.data.jumlah_pendaftar_mahasiswa_n,
                  node.data.jumlah_pendaftar_mahasiswa_d
                );
              }}
              className="h-7 w-7 text-primary hover:bg-primary/10 rounded-lg cursor-pointer"
              title="Ubah Kuota Shift"
            >
              <Edit2 className="h-3.5 w-3.5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteShift?.(node.data.prodiId, node.data.shiftId, node.title);
              }}
              className="h-7 w-7 text-destructive/80 hover:text-destructive hover:bg-destructive/10 rounded-lg cursor-pointer"
              title="Hapus Shift"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}

        {/* 4. Jalur: Direct Delete button (Aksi Tunggal -> Langsung muncul tanpa burger menu!) */}
        {node.type === 'jalur' && (
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteJalur?.(node.data.id, node.title);
            }}
            className="h-7 w-7 text-destructive/80 hover:text-destructive hover:bg-destructive/10 rounded-lg cursor-pointer transition-colors"
            title="Hapus Jalur"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        )}

        {/* 5. Jenis: Direct Delete button (Aksi Tunggal -> Langsung muncul tanpa burger menu!) */}
        {node.type === 'jenis' && (
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteJenis?.(node.data.id, node.title);
            }}
            className="h-7 w-7 text-destructive/80 hover:text-destructive hover:bg-destructive/10 rounded-lg cursor-pointer transition-colors"
            title="Hapus Jenis"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        )}

        {/* 6. Berkas: Direct Delete button (Aksi Tunggal -> Langsung muncul tanpa burger menu!) */}
        {node.type === 'berkas' && (
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteBerkas?.(node.data.kategori, node.data.docId, node.title);
            }}
            className="h-7 w-7 text-destructive/80 hover:text-destructive hover:bg-destructive/10 rounded-lg cursor-pointer transition-colors"
            title="Hapus Dokumen Berkas"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
    </div>
  );
}
