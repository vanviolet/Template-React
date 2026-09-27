import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import {
  ChevronLeft,
  ChevronRight,
  UserX,
  SearchX,
  CheckCircle2,
} from 'lucide-react';
import { ApiClient } from '@/services/api-generated';
import { queryKeys } from '@/services/query.keys';
import { useTableSearchParams } from '@/hooks/use.search.params';
import { formatRupiah, formatPhoneNumber, formatNik } from '@/utils/format';
import { getRoleBadgeVariant } from './utils';
import { PenggunaActionTable } from './action.table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CubeSpinner } from '@/components/ui/cube.spinner';
import { PAGE_SIZE_OPTIONS } from '@/constants/app';
import { Select } from '@/components/ui/select';

export function PenggunaTable() {
  const { t } = useTranslation();
  const { filterParams, updateParams, resetFilters, hasActiveFilters } = useTableSearchParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: queryKeys.users.list(filterParams),
    queryFn: () => ApiClient.getUsers(filterParams),
  });

  const users = data?.data || [];
  const total = data?.total || 0;
  const page = data?.page || 1;
  const pageSize = data?.pageSize || 10;
  const totalPages = data?.totalPages || 1;

  if (isError) {
    return (
      <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-6 text-center text-xs text-destructive">
        {t('common.error')}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Table Container with Sticky Header and Centered Body Loading */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12 text-center">{t('common.no')}</TableHead>
            <TableHead className="min-w-[180px]">{t('pengguna.fields.nama')}</TableHead>
            <TableHead className="min-w-[160px]">{t('pengguna.fields.noHp')} & NIK</TableHead>
            <TableHead className="min-w-[140px]">{t('pengguna.fields.role')}</TableHead>
            <TableHead className="min-w-[140px]">{t('pengguna.fields.gaji')}</TableHead>
            <TableHead className="min-w-[120px]">{t('pengguna.fields.status')}</TableHead>
            <TableHead isPinnedRight className="w-20">
              {t('common.action')}
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading ? (
            /* 3D Cube Loader centered inside TableBody while preserving Header */
            <TableRow>
              <TableCell colSpan={7} className="h-72 text-center align-middle">
                <div className="flex flex-col items-center justify-center space-y-4 py-8">
                  <CubeSpinner size={44} />
                  <p className="text-xs font-medium text-muted-foreground animate-pulse">
                    {t('common.loading')}
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-64 text-center">
                <div className="flex flex-col items-center justify-center space-y-2 py-6">
                  <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                    {hasActiveFilters ? <SearchX className="h-6 w-6" /> : <UserX className="h-6 w-6" />}
                  </div>
                  <h3 className="text-sm font-semibold text-foreground">
                    {hasActiveFilters ? t('common.notFoundTitle') : t('common.emptyDataTitle')}
                  </h3>
                  <p className="text-xs text-muted-foreground max-w-sm">
                    {hasActiveFilters ? t('common.notFoundDesc') : t('common.emptyDataDesc')}
                  </p>
                  {hasActiveFilters && (
                    <Button variant="outline" size="sm" onClick={resetFilters} className="mt-2">
                      {t('common.clearFilter')}
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ) : (
            users.map((user, index) => {
              const rowNumber = (page - 1) * pageSize + index + 1;
              return (
                <TableRow key={user.id}>
                  <TableCell className="font-mono text-center text-muted-foreground font-medium">
                    {rowNumber}
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5 font-medium text-foreground">
                        <span>{user.nama}</span>
                        {user.verified && (
                          <span title="Verifikasi Kemitraan">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-muted-foreground font-mono">{user.email}</span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-col text-[11px]">
                      <span className="font-mono text-foreground">{formatPhoneNumber(user.noHp)}</span>
                      <span className="font-mono text-muted-foreground">{formatNik(user.nik)}</span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge variant={getRoleBadgeVariant(user.role)}>
                      {t(`pengguna.roles.${user.role}`)}
                    </Badge>
                  </TableCell>

                  <TableCell className="font-mono text-foreground font-medium">
                    {formatRupiah(user.gaji)}
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          user.status === 'active' ? 'bg-emerald-500' : 'bg-muted-foreground/50'
                        }`}
                      />
                      <span className="text-xs font-medium text-foreground">
                        {t(`common.${user.status}`)}
                      </span>
                    </div>
                  </TableCell>

                  {/* Action Column - Sticky Pinned & Centered */}
                  <TableCell isPinnedRight>
                    <PenggunaActionTable user={user} />
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>

      {/* Pagination Bar */}
      {!isLoading && users.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-card p-3 rounded-xl border border-border text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>{t('common.itemsPerPage')}:</span>
            <div className="w-20">
              <Select
                options={PAGE_SIZE_OPTIONS.map((size) => ({
                  label: String(size),
                  value: String(size),
                }))}
                value={String(pageSize)}
                onChange={(val) => updateParams({ pageSize: Number(val), page: 1 })}
              />
            </div>
            <span>
              Total <strong className="text-foreground font-mono">{total}</strong> data
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span>
              {t('common.page')} <strong className="text-foreground font-mono">{page}</strong> {t('common.of')}{' '}
              <strong className="text-foreground font-mono">{totalPages}</strong>
            </span>

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                disabled={page <= 1}
                onClick={() => updateParams({ page: page - 1 })}
                className="h-8 w-8"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                disabled={page >= totalPages}
                onClick={() => updateParams({ page: page + 1 })}
                className="h-8 w-8"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
