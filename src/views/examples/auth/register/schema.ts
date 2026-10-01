import { z } from 'zod';

export const createRegisterSchema = (t: (key: string) => string) =>
  z
    .object({
      username: z
        .string()
        .min(3, { message: t('auth.validation.usernameMin') || 'Username minimal 3 karakter' })
        .max(30, { message: 'Username maksimal 30 karakter' })
        .regex(/^[a-zA-Z0-9_]+$/, { message: 'Username hanya boleh huruf, angka, dan underscore (_)' }),
      email: z
        .string()
        .min(1, { message: t('auth.validation.emailRequired') })
        .email({ message: t('auth.validation.emailInvalid') }),
      password: z
        .string()
        .min(1, { message: t('auth.validation.passwordRequired') })
        .min(6, { message: t('auth.validation.passwordMin') }),
      password_confirm: z
        .string()
        .min(1, { message: 'Konfirmasi kata sandi wajib diisi' }),
    })
    .refine((data) => data.password === data.password_confirm, {
      message: 'Konfirmasi kata sandi tidak cocok',
      path: ['password_confirm'],
    });

export type RegisterFormData = z.infer<ReturnType<typeof createRegisterSchema>>;

export const verificationSchema = z.object({
  code: z
    .string()
    .length(6, { message: 'Kode verifikasi harus 6 digit angka' })
    .regex(/^\d+$/, { message: 'Kode verifikasi hanya boleh terdiri dari angka' }),
});
