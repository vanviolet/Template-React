import React from 'react';
import { Search, FolderTree } from 'lucide-react';
import { TreeNodeItem } from './types';
import { NodeCard } from './node.card';

interface TreeListProps {
  nodes: TreeNodeItem[];
  expandedIds: Set<string>;
  selectedNodeId?: string | null;
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
  isSearchActive?: boolean;
}

export function TreeList({
  nodes,
  expandedIds,
  selectedNodeId,
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
  isSearchActive = false,
}: TreeListProps) {
  if (nodes.length === 0) {
    return (
      <div className="py-16 px-4 text-center border border-dashed border-border/70 rounded-2xl bg-card/40 my-4">
        <div className="w-12 h-12 rounded-2xl bg-muted/60 text-muted-foreground mx-auto flex items-center justify-center mb-3">
          {isSearchActive ? (
            <Search className="h-6 w-6 stroke-[1.8]" />
          ) : (
            <FolderTree className="h-6 w-6 stroke-[1.8]" />
          )}
        </div>
        <h3 className="text-sm font-semibold text-foreground">
          {isSearchActive ? 'Tidak ada hasil hierarki yang cocok' : 'Hierarki gelombang pendaftaran kosong'}
        </h3>
        <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
          {isSearchActive
            ? 'Coba ubah kata kunci pencarian atau sesuaikan filter status.'
            : 'Gunakan tombol Generate di atas untuk mengisi data dari Master API.'}
        </p>
      </div>
    );
  }

  // Recursive renderer
  const renderNode = (node: TreeNodeItem, depth = 0) => {
    const isExpanded = expandedIds.has(node.id);
    const isSelected = selectedNodeId === node.id;
    const hasChildren = Boolean(node.children && node.children.length > 0);

    return (
      <div key={node.id} className="relative">
        <div
          style={{
            paddingLeft: depth > 0 ? `${Math.min(depth * 28, 120)}px` : '0px',
          }}
          className="transition-all duration-200"
        >
          <NodeCard
            node={node}
            depth={depth}
            isExpanded={isExpanded}
            isSelected={isSelected}
            onToggleExpand={onToggleExpand}
            onSelectNode={onSelectNode}
            onInspect={onInspect}
            onEditShift={onEditShift}
            onAddShiftToProdi={onAddShiftToProdi}
            onBatchKuotaProdi={onBatchKuotaProdi}
            onGenShiftProdi={onGenShiftProdi}
            onDeleteProdi={onDeleteProdi}
            onDeleteShift={onDeleteShift}
            onDeleteJalur={onDeleteJalur}
            onDeleteJenis={onDeleteJenis}
            onDeleteBerkas={onDeleteBerkas}
            onOpenAddProdi={onOpenAddProdi}
            onOpenAddJalur={onOpenAddJalur}
            onOpenAddJenis={onOpenAddJenis}
            onOpenAddDokumen={onOpenAddDokumen}
          />
        </div>

        {/* Children sub-tree */}
        {hasChildren && isExpanded && (
          <div className="relative">
            {/* Guide line */}
            <div
              className="absolute top-0 bottom-4 w-px bg-border/40 pointer-events-none"
              style={{
                left: `${depth * 28 + 18}px`,
              }}
            />
            {node.children!.map((child) => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="relative w-full">
      {/* Background timeline / column gridlines matching the screenshot */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none flex justify-between z-0 opacity-40">
        <div className="h-full border-r border-border/25 w-1/12" />
        <div className="h-full border-r border-border/25 w-1/12" />
        <div className="h-full border-r border-border/25 w-1/12" />
        <div className="h-full border-r border-border/25 w-1/12" />
        <div className="h-full border-r border-border/25 w-1/12" />
        <div className="h-full border-r border-border/25 w-1/12" />
        <div className="h-full border-r border-border/25 w-1/12" />
        <div className="h-full border-r border-border/25 w-1/12" />
        <div className="h-full border-r border-border/25 w-1/12" />
        <div className="h-full border-r border-border/25 w-1/12" />
        <div className="h-full border-r border-border/25 w-1/12" />
        <div className="h-full border-r border-border/25 w-1/12" />
      </div>

      {/* Nodes list on top */}
      <div className="relative z-10 space-y-1">
        {nodes.map((node) => renderNode(node, 0))}
      </div>
    </div>
  );
}
