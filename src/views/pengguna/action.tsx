import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { usePenggunaDialogStore } from './store';
import { Button } from '@/components/ui/button';

export function PenggunaAction() {
  const { t } = useTranslation();
  const openDialog = usePenggunaDialogStore((s) => s.openDialog);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-foreground">{t('pengguna.title')}</h1>
        <p className="text-xs text-muted-foreground mt-0.5">{t('pengguna.description')}</p>
      </div>

      <Button
        onClick={() => openDialog('create')}
        size="sm"
        className="h-10 px-4 rounded-xl shadow-xs font-medium text-xs shrink-0 self-start sm:self-auto"
      >
        <Plus className="h-4 w-4 mr-1.5" />
        <span>{t('pengguna.addTitle')}</span>
      </Button>
    </div>
  );
}
