import { z } from 'zod';

export const createLoginSchema = (t: (key: string) => string) =>
  z.object({
    email: z
      .string()
      .min(1, { message: t('auth.validation.emailRequired') })
      .email({ message: t('auth.validation.emailInvalid') }),
    password: z
      .string()
      .min(1, { message: t('auth.validation.passwordRequired') })
      .min(6, { message: t('auth.validation.passwordMin') }),
    rememberMe: z.boolean().default(false),
  });

export type LoginFormData = z.infer<ReturnType<typeof createLoginSchema>>;
