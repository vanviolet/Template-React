import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  MoreVertical,
  Sliders,
  Clock,
  Eye,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown.menu';
import { Button } from '@/components/ui/button';
import { TreeNodeItem } from './types';

interface ActionRowProps {
  node: TreeNodeItem;
  onInspect: (node: TreeNodeItem) => void;
  onBatchKuotaProdi?: (prodiId: string, prodiName: string) => void;
  onGenShiftProdi?: (prodiId: string, prodiName: string) => void;
}

export function ActionRow({
  node,
  onInspect,
  onBatchKuotaProdi,
  onGenShiftProdi,
}: ActionRowProps) {
  const { t } = useTranslation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground hover:text-foreground rounded-lg cursor-pointer transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          <MoreVertical className="h-3.5 w-3.5" />
          <span className="sr-only">Aksi Lainnya</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 text-xs">
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            onInspect(node);
          }}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Eye className="h-3.5 w-3.5 text-muted-foreground" />
          <span>Lihat Detail Elemen</span>
        </DropdownMenuItem>

        {node.type === 'prodi' && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onBatchKuotaProdi?.(node.data.id, node.title);
              }}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Sliders className="h-3.5 w-3.5 text-primary" />
              <span>Set Kuota Serentak</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onGenShiftProdi?.(node.data.id, node.title);
              }}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Clock className="h-3.5 w-3.5 text-blue-500" />
              <span>Gen Semua Shift Master</span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
