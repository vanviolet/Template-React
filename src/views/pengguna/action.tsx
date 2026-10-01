import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { usePenggunaDialogStore } from './store';
import { Button } from '@/components/ui/button';
import { TableViewHeader } from '@/components/ui/table.view.template';

export function PenggunaAction() {
  const { t } = useTranslation();
  const openDialog = usePenggunaDialogStore((s) => s.openDialog);

  return (
    <TableViewHeader
      title={t('pengguna.title')}
      description={t('pengguna.description')}
      actionButton={
        <Button
          onClick={() => openDialog('create')}
          size="default"
          className="h-9 px-3.5 rounded-lg shadow-xs font-medium text-xs cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5 mr-1.5" />
          <span>{t('pengguna.addTitle')}</span>
        </Button>
      }
    />
  );
}
