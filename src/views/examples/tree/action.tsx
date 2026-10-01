import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Search,
  SlidersHorizontal,
  Clock,
  Plus,
  Maximize2,
  Minimize2,
  X,
  Sliders,
  GraduationCap,
  Users,
  FileSpreadsheet,
  FolderTree,
  Network,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown.menu';
import { cn } from '@/utils/cn';
import { TreeFilterState, TreeViewMode } from './types';

interface TreeActionProps {
  filters: TreeFilterState;
  onFilterChange: (filters: TreeFilterState) => void;
  onExpandAll: () => void;
  onCollapseAll: () => void;
  isAllExpanded?: boolean;
  onOpenBatchKuota: () => void;
  onGenerateAllShifts: () => void;
  onGenerateAllProdi: () => void;
  onGenerateAllJalur: () => void;
  onGenerateAllJenis: () => void;
  onGenerateAllBerkas: () => void;
  onOpenAddProdi: () => void;
  onOpenAddJalur: () => void;
  onOpenAddJenis: () => void;
  onOpenAddDokumen: () => void;
}

export function TreeAction({
  filters,
  onFilterChange,
  onExpandAll,
  onCollapseAll,
  isAllExpanded = false,
  onOpenBatchKuota,
  onGenerateAllShifts,
  onGenerateAllProdi,
  onGenerateAllJalur,
  onGenerateAllJenis,
  onGenerateAllBerkas,
  onOpenAddProdi,
  onOpenAddJalur,
  onOpenAddJenis,
  onOpenAddDokumen,
}: TreeActionProps) {
  const { t } = useTranslation();
  const [isSearchOpen, setIsSearchOpen] = useState(Boolean(filters.search));

  const handleSearchChange = (val: string) => {
    onFilterChange({ ...filters, search: val });
  };

  const handleViewModeChange = (viewMode: TreeViewMode) => {
    onFilterChange({ ...filters, viewMode });
  };

  return (
    <div className="flex items-center gap-2 flex-wrap justify-start sm:justify-end">
      {/* Search Input Box */}
      {isSearchOpen ? (
        <div className="relative flex items-center animate-in fade-in zoom-in-95 duration-150">
          <Search className="absolute left-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            autoFocus
            type="text"
            value={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder={t('tree.searchPlaceholder', 'Cari prodi, shift, jalur...')}
            className="h-8 pl-8 pr-7 text-xs w-48 sm:w-60 rounded-xl bg-card border-border/80"
          />
          <button
            type="button"
            onClick={() => {
              handleSearchChange('');
              setIsSearchOpen(false);
            }}
            className="absolute right-2 text-muted-foreground hover:text-foreground cursor-pointer p-0.5 rounded-sm"
            title="Tutup Pencarian"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsSearchOpen(true)}
          className="h-8 px-2.5 text-xs text-muted-foreground hover:text-foreground rounded-xl border-border/80 bg-card/60 cursor-pointer"
        >
          <Search className="h-3.5 w-3.5 mr-1.5" />
          <span>{t('common.search', 'Cari')}</span>
          {filters.search && (
            <span className="ml-1 w-1.5 h-1.5 rounded-full bg-primary" />
          )}
        </Button>
      )}

      {/* View Switcher: Tree View vs Graph Preview */}
      <div className="flex items-center p-0.5 bg-muted/60 dark:bg-muted/30 rounded-xl border border-border/60">
        <button
          type="button"
          onClick={() => handleViewModeChange('tree')}
          className={cn(
            'flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg transition-all cursor-pointer select-none font-medium',
            filters.viewMode === 'tree'
              ? 'bg-card text-foreground font-semibold shadow-xs border border-border/70'
              : 'text-muted-foreground hover:text-foreground'
          )}
          title="Tampilan Tree Hierarki"
        >
          <FolderTree className="h-3.5 w-3.5 text-primary" />
          <span className="hidden sm:inline">Hierarki</span>
        </button>

        <button
          type="button"
          onClick={() => handleViewModeChange('graph')}
          className={cn(
            'flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg transition-all cursor-pointer select-none font-medium',
            filters.viewMode === 'graph'
              ? 'bg-card text-foreground font-semibold shadow-xs border border-border/70'
              : 'text-muted-foreground hover:text-foreground'
          )}
          title="Tampilan Graph / Diagram Alur"
        >
          <Network className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
          <span className="hidden sm:inline">Graph Preview</span>
        </button>
      </div>

      {/* Batch Actions Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-2.5 text-xs rounded-xl border-border/80 bg-card/60 text-foreground cursor-pointer hover:bg-muted"
          >
            <Sliders className="h-3.5 w-3.5 mr-1.5 text-primary" />
            <span className="hidden sm:inline">Aksi Batch</span>
            <span className="sm:hidden">Batch</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 text-xs">
          <DropdownMenuLabel>Aksi Cepat Kuota</DropdownMenuLabel>
          <DropdownMenuItem onClick={onOpenBatchKuota} className="cursor-pointer gap-2">
            <Sliders className="h-3.5 w-3.5 text-primary" />
            <span>Batch Kuota Semua Prodi</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuLabel>Generate Otomatis Master API</DropdownMenuLabel>
          <DropdownMenuItem onClick={onGenerateAllShifts} className="cursor-pointer gap-2">
            <Clock className="h-3.5 w-3.5 text-emerald-500" />
            <span>Generate Semua Shift</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onGenerateAllProdi} className="cursor-pointer gap-2">
            <GraduationCap className="h-3.5 w-3.5 text-blue-500" />
            <span>Generate Semua Prodi</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onGenerateAllJalur} className="cursor-pointer gap-2">
            <SlidersHorizontal className="h-3.5 w-3.5 text-amber-500" />
            <span>Generate Semua Jalur</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onGenerateAllJenis} className="cursor-pointer gap-2">
            <Users className="h-3.5 w-3.5 text-purple-500" />
            <span>Generate Semua Jenis</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onGenerateAllBerkas} className="cursor-pointer gap-2">
            <FileSpreadsheet className="h-3.5 w-3.5 text-rose-500" />
            <span>Generate Semua Berkas</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Expand / Collapse All (Tree mode only) */}
      {filters.viewMode === 'tree' && (
        <Button
          variant="outline"
          size="icon"
          onClick={isAllExpanded ? onCollapseAll : onExpandAll}
          className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-xl border-border/80 bg-card/60 cursor-pointer"
          title={isAllExpanded ? 'Tutup Semua Hierarki' : 'Buka Semua Hierarki'}
        >
          {isAllExpanded ? (
            <Minimize2 className="h-3.5 w-3.5" />
          ) : (
            <Maximize2 className="h-3.5 w-3.5" />
          )}
        </Button>
      )}

      {/* Primary + Tambah Button with Dropdown matching theme */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="sm"
            className="h-8 px-3 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-xs shadow-xs cursor-pointer flex items-center gap-1.5 transition-all"
          >
            <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
            <span>Tambah</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-50 text-xs">
          <DropdownMenuLabel>Tambah Elemen Hierarki</DropdownMenuLabel>
          <DropdownMenuItem onClick={onOpenAddProdi} className="cursor-pointer gap-2">
            <GraduationCap className="h-3.5 w-3.5 text-blue-500" />
            <span>Tambah Program Studi</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onOpenAddJalur} className="cursor-pointer gap-2">
            <SlidersHorizontal className="h-3.5 w-3.5 text-emerald-500" />
            <span>Tambah Jalur Pendaftaran</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onOpenAddJenis} className="cursor-pointer gap-2">
            <Users className="h-3.5 w-3.5 text-purple-500" />
            <span>Tambah Jenis Pendaftaran</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onOpenAddDokumen} className="cursor-pointer gap-2">
            <FileSpreadsheet className="h-3.5 w-3.5 text-rose-500" />
            <span>Tambah Dokumen Berkas</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
