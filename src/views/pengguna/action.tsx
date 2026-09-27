import { useTranslation } from 'react-i18next';
import { Search, Plus, X, RotateCcw } from 'lucide-react';
import { useTableSearchParams } from '@/hooks/use.search.params';
import { usePenggunaDialogStore } from './store';
import { ROLE_OPTIONS, STATUS_OPTIONS } from './constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

export function PenggunaAction() {
  const { t } = useTranslation();
  const { filterParams, updateParams, resetFilters, removeSingleFilter, hasActiveFilters } =
    useTableSearchParams();
  const openDialog = usePenggunaDialogStore((s) => s.openDialog);

  return (
    <div className="space-y-4">
      {/* Top Header & Primary Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">{t('pengguna.title')}</h1>
          <p className="text-xs text-muted-foreground mt-0.5">{t('pengguna.description')}</p>
        </div>

        <Button onClick={() => openDialog('create')} size="sm">
          <Plus className="h-3.5 w-3.5 mr-1.5" />
          <span>{t('pengguna.addTitle')}</span>
        </Button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-card p-3 rounded-xl border border-border shadow-2xs">
        {/* Search Field */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            type="text"
            placeholder={t('pengguna.placeholders.search')}
            value={filterParams.search || ''}
            onChange={(e) => updateParams({ search: e.target.value })}
            className="pl-9 h-9"
          />
        </div>

        {/* Select Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="w-40">
            <Select
              options={ROLE_OPTIONS}
              value={filterParams.role || 'all'}
              onChange={(val) => updateParams({ role: val })}
              placeholder={t('pengguna.placeholders.role')}
            />
          </div>

          <div className="w-36">
            <Select
              options={STATUS_OPTIONS}
              value={filterParams.status || 'all'}
              onChange={(val) => updateParams({ status: val })}
            />
          </div>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="text-xs text-muted-foreground hover:text-foreground h-9"
              title={t('common.reset')}
            >
              <RotateCcw className="h-3.5 w-3.5 mr-1" />
              <span>{t('common.reset')}</span>
            </Button>
          )}
        </div>
      </div>

      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground pt-1">
          <span className="font-medium">{t('common.activeFilters')}</span>

          {filterParams.search && (
            <Badge variant="secondary" className="gap-1 pr-1">
              <span>Pencarian: "{filterParams.search}"</span>
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
            <Badge variant="secondary" className="gap-1 pr-1">
              <span>Peran: {t(`pengguna.roles.${filterParams.role}`)}</span>
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
            <Badge variant="secondary" className="gap-1 pr-1">
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
    </div>
  );
}
