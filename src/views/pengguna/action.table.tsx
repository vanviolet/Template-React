import { useTranslation } from 'react-i18next';
import { MoreHorizontal, Eye, Edit3, Trash2 } from 'lucide-react';
import { UserDTO } from '@/services/api-generated';
import { usePenggunaDialogStore } from './store';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown.menu';

export function PenggunaActionTable({ user }: { user: UserDTO }) {
  const { t } = useTranslation();
  const openDialog = usePenggunaDialogStore((s) => s.openDialog);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">{t('common.action')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36">
        <DropdownMenuLabel>{t('common.action')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => openDialog('detail', user)}>
          <Eye className="h-3.5 w-3.5 text-sky-500" />
          <span>{t('common.detail')}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => openDialog('edit', user)}>
          <Edit3 className="h-3.5 w-3.5 text-amber-500" />
          <span>{t('common.edit')}</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => openDialog('delete', user)}
          className="text-destructive focus:bg-destructive/10 focus:text-destructive"
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span>{t('common.delete')}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
