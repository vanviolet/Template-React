export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface FilterParams {
  search?: string;
  role?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
  action?: string;
}

export interface SelectOption {
  label: string;
  value: string;
  description?: string;
  disabled?: boolean;
  badge?: string;
  data?: any;
}

export type ComboboxOption = SelectOption;

export type ThemeMode = 'light' | 'dark' | 'system';
