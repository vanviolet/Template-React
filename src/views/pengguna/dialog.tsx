import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from '@/components/ui/toast';
import { ApiClient } from '@/services/api-generated';
import { queryKeys } from '@/services/query.keys';
import { usePenggunaDialogStore } from './store';
import { useLoadingStore } from '@/app/store/loading.store';
import { PenggunaForm } from './form';
import { formatRupiah, formatPhoneNumber, formatNik, formatDate } from '@/utils/format';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSearchParams } from 'react-router-dom';
import { useTableSearchParams } from '@/hooks/use.search.params';

export function PenggunaDialog() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { dialogMode, selectedUser, closeDialog: closePenggunaDialog } = usePenggunaDialogStore();
  const { showLoading, hideLoading } = useLoadingStore();
  const {removeSingleFilter} = useTableSearchParams();
function closeDialog() {
    removeSingleFilter('action'); // Remove the "action" search parameter
    closePenggunaDialog();
  }
  const createMutation = useMutation({
    mutationFn: async (values: any) => {
      showLoading('Menambahkan pengguna baru...');
      return await ApiClient.createUser(values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      toast.success(t('pengguna.messages.createSuccess'));
      closeDialog();
    },
    onError: (err: any) => {
      toast.error(err.message || t('common.error'));
    },
    onSettled: () => {
      hideLoading();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (values: any) => {
      showLoading('Memperbarui data pengguna...');
      return await ApiClient.updateUser(selectedUser!.id, values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      toast.success(t('pengguna.messages.updateSuccess'));
      closeDialog();
    },
    onError: (err: any) => {
      toast.error(err.message || t('common.error'));
    },
    onSettled: () => {
      hideLoading();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      showLoading('Menghapus data pengguna...');
      return await ApiClient.deleteUser(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      toast.success(t('pengguna.messages.deleteSuccess'));
      closeDialog();
    },
    onError: (err: any) => {
      toast.error(err.message || t('common.error'));
    },
    onSettled: () => {
      hideLoading();
    },
  });

  const isOpen = dialogMode !== null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        closeDialog();
        
      }
    }}>
      <DialogContent className={dialogMode === 'delete' ? 'max-w-md' : 'max-w-xl'}>
        {/* Mode: Create */}
        {dialogMode === 'create' && (
          <>
            <DialogHeader>
              <DialogTitle>{t('pengguna.addTitle')}</DialogTitle>
              <DialogDescription>{t('pengguna.description')}</DialogDescription>
            </DialogHeader>
            <PenggunaForm
              onSubmit={async (val) => {
                await createMutation.mutateAsync(val);
              }}
              isLoading={createMutation.isPending}
              onCancel={closeDialog}
            />
          </>
        )}

        {/* Mode: Edit */}
        {dialogMode === 'edit' && selectedUser && (
          <>
            <DialogHeader>
              <DialogTitle>{t('pengguna.editTitle')}</DialogTitle>
              <DialogDescription>{t('pengguna.description')}</DialogDescription>
            </DialogHeader>
            <PenggunaForm
              initialData={selectedUser}
              onSubmit={async (val) => {
                await updateMutation.mutateAsync(val);
              }}
              isLoading={updateMutation.isPending}
              onCancel={closeDialog}
            />
          </>
        )}

        {/* Mode: Detail */}
        {dialogMode === 'detail' && selectedUser && (
          <>
            <DialogHeader>
              <DialogTitle>{t('pengguna.detailTitle')}</DialogTitle>
              <DialogDescription>ID Akun: {selectedUser.id}</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 text-xs py-2">
              <div className="grid grid-cols-2 gap-4 p-3 bg-muted/30 rounded-lg border border-border">
                <div>
                  <span className="text-muted-foreground block text-[11px]">
                    {t('pengguna.fields.nama')}
                  </span>
                  <span className="font-semibold text-foreground text-sm">{selectedUser.nama}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">
                    {t('pengguna.fields.email')}
                  </span>
                  <span className="font-mono text-foreground">{selectedUser.email}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-muted-foreground block text-[11px]">
                    {t('pengguna.fields.noHp')}
                  </span>
                  <span className="font-mono text-foreground font-medium">
                    {formatPhoneNumber(selectedUser.noHp)}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">
                    {t('pengguna.fields.nik')}
                  </span>
                  <span className="font-mono text-foreground font-medium">
                    {formatNik(selectedUser.nik)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-muted-foreground block text-[11px]">
                    {t('pengguna.fields.gaji')}
                  </span>
                  <span className="font-mono font-semibold text-foreground text-sm">
                    {formatRupiah(selectedUser.gaji)}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">
                    {t('pengguna.fields.role')}
                  </span>
                  <Badge variant="secondary" className="mt-0.5">
                    {t(`pengguna.roles.${selectedUser.role}`)}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
                <div>
                  <span className="text-muted-foreground block text-[11px]">
                    {t('pengguna.fields.kota')}
                  </span>
                  <span className="font-medium text-foreground text-xs">
                    {selectedUser.kota || '-'}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">
                    {t('pengguna.fields.status')}
                  </span>
                  <Badge
                    variant={selectedUser.status === 'active' ? 'success' : 'secondary'}
                    className="mt-0.5"
                  >
                    {t(`common.${selectedUser.status}`)}
                  </Badge>
                </div>
              </div>

              <div className="pt-2 border-t border-border flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground">Terdaftar Sejak</span>
                <span className="font-mono text-muted-foreground">
                  {formatDate(selectedUser.createdAt)}
                </span>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={closeDialog}>
                Tutup
              </Button>
            </DialogFooter>
          </>
        )}

        {/* Mode: Delete Confirm */}
        {dialogMode === 'delete' && selectedUser && (
          <>
            <DialogHeader>
              <DialogTitle>{t('pengguna.deleteConfirmTitle')}</DialogTitle>
              <DialogDescription>
                {t('pengguna.deleteConfirmDesc', { name: selectedUser.nama })}
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className="pt-2">
              <Button variant="outline" onClick={closeDialog} disabled={deleteMutation.isPending}>
                {t('common.cancel')}
              </Button>
              <Button
                variant="destructive"
                isLoading={deleteMutation.isPending}
                onClick={async () => {
                  await deleteMutation.mutateAsync(selectedUser.id);
                }}
              >
                {t('common.delete')}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
