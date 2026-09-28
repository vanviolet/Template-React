import { SelectOption } from '@/types/common';

export const ROLE_OPTIONS: SelectOption[] = [
  { label: 'Semua Peran', value: 'all' },
  { label: 'Administrator Utama', value: 'admin' },
  { label: 'Manajer Operasional', value: 'manager' },
  { label: 'Staf Eksekutif', value: 'staff' },
  { label: 'Pengguna Biasa', value: 'user' },
];

export const FORM_ROLE_OPTIONS: SelectOption[] = [
  { label: 'Administrator Utama', value: 'admin' },
  { label: 'Manajer Operasional', value: 'manager' },
  { label: 'Staf Eksekutif', value: 'staff' },
  { label: 'Pengguna Biasa', value: 'user' },
];

export const STATUS_OPTIONS: SelectOption[] = [
  { label: 'Semua Status', value: 'all' },
  { label: 'Aktif', value: 'active' },
  { label: 'Nonaktif', value: 'inactive' },
];

export const DEFAULT_FORM_VALUES = {
  nama: '',
  email: '',
  noHp: '',
  nik: '',
  gaji: 8000000,
  role: 'staff' as const,
  status: 'active' as const,
  kota: '',
  verified: true,
};
