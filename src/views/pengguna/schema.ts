import { z } from 'zod';

export const getUserFormSchema = (t: (key: string) => string) =>
  z.object({
    nama: z
      .string()
      .min(3, { message: t('pengguna.validation.namaMin') })
      .max(100, { message: t('pengguna.validation.namaMax') }),
    email: z
      .string()
      .min(1, { message: t('pengguna.validation.emailRequired') })
      .email({ message: t('pengguna.validation.emailInvalid') }),
    noHp: z
      .string()
      .min(10, { message: t('pengguna.validation.noHpInvalid') })
      .max(15, { message: t('pengguna.validation.noHpInvalid') }),
    nik: z
      .string()
      .length(16, { message: t('pengguna.validation.nikInvalid') }),
    gaji: z
      .number()
      .min(1000000, { message: t('pengguna.validation.gajiMin') }),
    role: z.enum(['admin', 'manager', 'staff', 'user'], {
      required_error: t('pengguna.validation.roleRequired'),
    }),
    status: z.enum(['active', 'inactive'], {
      required_error: t('pengguna.validation.statusRequired'),
    }),
    kota: z
      .string()
      .min(1, { message: t('pengguna.validation.kotaRequired') })
      .default('Jakarta Selatan'),
    verified: z.boolean().default(false),
  });

// Fallback default schema for direct typing
export const userFormSchema = getUserFormSchema((key) => key);
