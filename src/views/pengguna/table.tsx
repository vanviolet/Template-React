import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import {
  Search,
  RotateCcw,
  X,
  ChevronLeft,
  ChevronRight,
  UserX,
  SearchX,
  CheckCircle2,
  SlidersHorizontal,
  MapPin,
} from 'lucide-react';
import { ApiClient } from '@/services/api-generated';
import { queryKeys } from '@/services/query.keys';
import { useTableSearchParams } from '@/hooks/use.search.params';
import { formatRupiah, formatPhoneNumber, formatNik } from '@/utils/format';
import { getRoleBadgeVariant } from './utils';
import { PenggunaActionTable } from './action.table';
import { ROLE_OPTIONS, STATUS_OPTIONS } from './constants';
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
import { Input } from '@/components/ui/input';
import { Combobox } from '@/components/ui/combobox';
import { Checkbox } from '@/components/ui/checkbox';
import { CubeSpinner } from '@/components/ui/cube.spinner';
import { TablePagination, TableViewCard } from '@/components/ui/table.view.template';

export function PenggunaTable() {
  const { t } = useTranslation();
  const { filterParams, updateParams, resetFilters, removeSingleFilter, hasActiveFilters } =
    useTableSearchParams();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const { data, isLoading, isError } = useQuery({
    queryKey: queryKeys.users.list(filterParams),
    queryFn: () => ApiClient.getUsers(filterParams),
  });

  const users = data?.data || [];
  const total = data?.total || 0;
  const page = data?.page || 1;
  const pageSize = data?.pageSize || 10;
  const totalPages = data?.totalPages || 1;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(users.map((u) => u.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((item) => item !== id));
    }
  };

  if (isError) {
    return (
      <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-6 text-center text-xs text-destructive">
        {t('common.error')}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border/60 bg-card shadow-xs overflow-hidden">
      {/* 1. Integrated Card Top Bar: Search, Filters & Action Button */}
      <div className="p-4 sm:p-5 bg-card flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Materio Style Pill Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/80" />
          <Input
            type="text"
            placeholder={t('pengguna.placeholders.search')}
            value={filterParams.search || ''}
            onChange={(e) => updateParams({ search: e.target.value })}
            className="pl-10 h-10 rounded-full bg-muted/40 border-border/50 focus:bg-background transition-all text-xs"
          />
        </div>

        {/* Filter Controls & Add Button */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="w-36">
            <Combobox
              options={ROLE_OPTIONS}
              value={filterParams.role || 'all'}
              onChange={(val) => updateParams({ role: val })}
              placeholder={t('pengguna.placeholders.role')}
            />
          </div>

          <div className="w-32">
            <Combobox
              options={STATUS_OPTIONS}
              value={filterParams.status || 'all'}
              onChange={(val) => updateParams({ status: val })}
            />
          </div>

          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={resetFilters}
              className="text-xs h-10 rounded-xl text-muted-foreground hover:text-foreground"
              title={t('common.reset')}
            >
              <RotateCcw className="h-3.5 w-3.5 mr-1" />
              <span>{t('common.reset')}</span>
            </Button>
          )}
        </div>
      </div>

      {/* Active Filter Chips Bar */}
      {hasActiveFilters && (
        <div className="px-5 py-2.5 border-t border-b border-border/40 bg-muted/20 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span className="font-semibold text-[11px] uppercase tracking-wider text-muted-foreground flex items-center gap-1">
            <SlidersHorizontal className="h-3 w-3" />
            Filter Aktif:
          </span>

          {filterParams.search && (
            <Badge variant="secondary" className="gap-1 pr-1 font-mono text-[11px]">
              <span>Search: "{filterParams.search}"</span>
              <button
                type="button"
                onClick={() => removeSingleFilter('search')}
                className="hover:bg-muted p-0.5 rounded-full cursor-pointer"
              >
                <X className="h-3 w-3 text-muted-foreground" />
              </button>
            </Badge>
          )}

          {filterParams.role && filterParams.role !== 'all' && (
            <Badge variant="secondary" className="gap-1 pr-1 text-[11px]">
              <span>Role: {t(`pengguna.roles.${filterParams.role}`)}</span>
              <button
                type="button"
                onClick={() => removeSingleFilter('role')}
                className="hover:bg-muted p-0.5 rounded-full cursor-pointer"
              >
                <X className="h-3 w-3 text-muted-foreground" />
              </button>
            </Badge>
          )}

          {filterParams.status && filterParams.status !== 'all' && (
            <Badge variant="secondary" className="gap-1 pr-1 text-[11px]">
              <span>Status: {t(`common.${filterParams.status}`)}</span>
              <button
                type="button"
                onClick={() => removeSingleFilter('status')}
                className="hover:bg-muted p-0.5 rounded-full cursor-pointer"
              >
                <X className="h-3 w-3 text-muted-foreground" />
              </button>
            </Badge>
          )}
        </div>
      )}

      {/* 2. Seamless Table Element */}
      <Table>
        <TableHeader className="bg-slate-50/80 dark:bg-slate-900/30">
          <TableRow className="border-t border-b border-border/50">
            <TableHead className="w-10 text-center">
              <Checkbox
                checked={users.length > 0 && selectedIds.length === users.length}
                onCheckedChange={handleSelectAll}
                aria-label="Pilih semua"
              />
            </TableHead>
            <TableHead className="w-12 text-center text-[11px] font-bold tracking-wider uppercase text-muted-foreground/80">
              {t('common.no')}
            </TableHead>
            <TableHead className="min-w-[180px] text-[11px] font-bold tracking-wider uppercase text-muted-foreground/80">
              {t('pengguna.fields.nama')}
            </TableHead>
            <TableHead className="min-w-[160px] text-[11px] font-bold tracking-wider uppercase text-muted-foreground/80">
              {t('pengguna.fields.noHp')} & NIK
            </TableHead>
            <TableHead className="min-w-[130px] text-[11px] font-bold tracking-wider uppercase text-muted-foreground/80">
              {t('pengguna.fields.role')}
            </TableHead>
            <TableHead className="min-w-[130px] text-[11px] font-bold tracking-wider uppercase text-muted-foreground/80">
              {t('pengguna.fields.gaji')}
            </TableHead>
            <TableHead className="min-w-[120px] text-[11px] font-bold tracking-wider uppercase text-muted-foreground/80">
              {t('pengguna.fields.status')}
            </TableHead>
            <TableHead isPinnedRight className="w-20 text-[11px] font-bold tracking-wider uppercase text-muted-foreground/80">
              {t('common.action')}
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={8} className="h-72 text-center align-middle">
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
              <TableCell colSpan={8} className="h-64 text-center">
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
                    <Button variant="outline" size="sm" onClick={resetFilters} className="mt-2 rounded-lg">
                      {t('common.clearFilter')}
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ) : (
            users.map((user, index) => {
              const rowNumber = (page - 1) * pageSize + index + 1;
              const isSelected = selectedIds.includes(user.id);

              return (
                <TableRow
                  key={user.id}
                  className={`border-b border-border/40 last:border-b-0 hover:bg-muted/30 transition-colors ${
                    isSelected ? 'bg-primary/5' : ''
                  }`}
                >
                  <TableCell className="text-center">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={(checked) => handleSelectOne(user.id, !!checked)}
                      aria-label={`Pilih ${user.nama}`}
                    />
                  </TableCell>

                  <TableCell className="font-mono text-center text-muted-foreground text-xs font-medium">
                    {rowNumber}
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5 font-medium text-foreground text-xs">
                        <span>{user.nama}</span>
                        {user.verified && (
                          <span title="Verifikasi Kemitraan">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] text-muted-foreground font-mono">{user.email}</span>
                        {user.kota && (
                          <span className="inline-flex items-center gap-1 text-[10px] text-primary bg-primary/10 px-1.5 py-0.5 rounded font-medium">
                            <MapPin className="h-2.5 w-2.5 shrink-0" />
                            <span>{user.kota}</span>
                          </span>
                        )}
                      </div>
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

                  <TableCell className="font-mono text-foreground font-medium text-xs">
                    {formatRupiah(user.gaji)}
                  </TableCell>

                  <TableCell>
                    {user.status === 'active' ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        ACTIVE
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-muted text-muted-foreground">
                        INACTIVE
                      </span>
                    )}
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

      {/* 3. Integrated Card Footer: Reusable TablePagination */}
      {!isLoading && users.length > 0 && (
        <TablePagination
          page={page}
          pageSize={pageSize}
          total={total}
          totalPages={totalPages}
          onPageChange={(newPage) => updateParams({ page: newPage })}
          onPageSizeChange={(newPageSize) => updateParams({ pageSize: newPageSize, page: 1 })}
        />
      )}
    </div>
  );
}
