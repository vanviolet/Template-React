import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PenggunaAction } from './action';
import { PenggunaTable } from './table';
import { PenggunaDialog } from './dialog';
import { usePenggunaDialogStore } from './store';

export default function PenggunaView() {
  const [searchParams] = useSearchParams();
  const openDialog = usePenggunaDialogStore((s) => s.openDialog);

  useEffect(() => {
    if (searchParams.get('action') === 'add') {
      openDialog('create');
    }
  }, [searchParams, openDialog]);

  return (
    <div className="space-y-6">
      <PenggunaAction />
      <PenggunaTable />
      <PenggunaDialog />
    </div>
  );
}
