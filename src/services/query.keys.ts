import { FilterParams } from '@/types/common';

export const queryKeys = {
  users: {
    all: ['users'] as const,
    list: (filters: FilterParams) => ['users', 'list', filters] as const,
    detail: (id: string) => ['users', 'detail', id] as const,
  },
  dashboard: {
    metrics: ['dashboard', 'metrics'] as const,
  },
  analytics: {
    overview: ['analytics', 'overview'] as const,
  },
};
