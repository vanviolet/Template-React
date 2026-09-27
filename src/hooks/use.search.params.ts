import { useSearchParams } from 'react-router-dom';
import { useCallback } from 'react';
import { FilterParams } from '@/types/common';
import { DEFAULT_PAGE_SIZE } from '@/constants/app';

export function useTableSearchParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get('search') || '';
  const role = searchParams.get('role') || 'all';
  const status = searchParams.get('status') || 'all';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = parseInt(searchParams.get('pageSize') || String(DEFAULT_PAGE_SIZE), 10);
  const sortBy = searchParams.get('sortBy') || 'createdAt';
  const sortOrder = (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc';

  const filterParams: FilterParams = {
    search,
    role,
    status,
    page,
    pageSize,
    sortBy,
    sortOrder,
  };

  const updateParams = useCallback(
    (newParams: Partial<FilterParams>) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          Object.entries(newParams).forEach(([key, value]) => {
            if (value === undefined || value === null || value === '' || value === 'all') {
              next.delete(key);
            } else {
              next.set(key, String(value));
            }
          });

          // Reset page to 1 when search or filter changes (unless page was explicitly updated)
          if (
            ('search' in newParams || 'role' in newParams || 'status' in newParams) &&
            !('page' in newParams)
          ) {
            next.set('page', '1');
          }

          return next;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  const resetFilters = useCallback(() => {
    setSearchParams(new URLSearchParams(), { replace: true });
  }, [setSearchParams]);

  const removeSingleFilter = useCallback(
    (key: keyof FilterParams) => {
      updateParams({ [key]: undefined });
    },
    [updateParams]
  );

  return {
    filterParams,
    updateParams,
    resetFilters,
    removeSingleFilter,
    hasActiveFilters: Boolean(search || role !== 'all' || status !== 'all'),
  };
}
