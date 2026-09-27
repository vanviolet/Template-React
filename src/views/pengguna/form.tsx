import { useForm } from '@tanstack/react-form';
import { useTranslation } from 'react-i18next';
import { UserDTO } from '@/services/api-generated';
import { getUserFormSchema } from './schema';
import { DEFAULT_FORM_VALUES, FORM_ROLE_OPTIONS } from './constants';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { RupiahInput, PhoneInput, NikInput } from '@/components/form/number.input';
import { CheckCircle2, ShieldAlert } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface PenggunaFormProps {
  initialData?: UserDTO | null;
  onSubmit: (values: any) => Promise<void>;
  isLoading?: boolean;
  onCancel: () => void;
}

// Helper to extract clean error message string using dynamic i18n schema
function getFieldError(
  schema: ReturnType<typeof getUserFormSchema>,
  fieldName: keyof ReturnType<typeof getUserFormSchema>['shape'],
  value: any,
  metaErrors: any[]
): string | undefined {
  if (value !== undefined && value !== null && value !== '') {
    const fieldSchema = schema.shape[fieldName];
    if (fieldSchema) {
      const res = fieldSchema.safeParse(value);
      if (!res.success && res.error) {
        const issue = res.error?.issues?.[0] || res.error?.errors?.[0];
        if (issue?.message) {
          return issue.message;
        }
      }
    }
  }

  if (Array.isArray(metaErrors) && metaErrors.length > 0) {
    const err = metaErrors[0];
    if (typeof err === 'string') return err;
    if (err && typeof err === 'object' && 'message' in err && err.message) {
      return String(err.message);
    }
    if (err !== undefined && err !== null) {
      return String(err);
    }
  }

  return undefined;
}

export function PenggunaForm({
  initialData,
  onSubmit,
  isLoading = false,
  onCancel,
}: PenggunaFormProps) {
  const { t } = useTranslation();
  const schema = getUserFormSchema(t);

  const form = useForm({
    defaultValues: initialData
      ? {
          nama: initialData.nama,
          email: initialData.email,
          noHp: initialData.noHp,
          nik: initialData.nik,
          gaji: initialData.gaji,
          role: initialData.role,
          status: initialData.status,
          verified: initialData.verified,
        }
      : DEFAULT_FORM_VALUES,
    onSubmit: async ({ value }) => {
      const result = schema.safeParse(value);
      if (result.success) {
        await onSubmit(result.data);
      }
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-4"
    >
      {/* Field: Nama Lengkap */}
      <form.Field
        name="nama"
        validators={{
          onChange: ({ value }) => {
            const res = schema.shape.nama.safeParse(value);
            if (!res.success && res.error) {
              return res.error?.issues?.[0]?.message || res.error?.errors?.[0]?.message;
            }
            return undefined;
          },
        }}
      >
        {(field) => {
          const errorMessage = getFieldError(schema, 'nama', field.state.value, field.state.meta.errors);
          return (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">
                {t('pengguna.fields.nama')} <span className="text-destructive">*</span>
              </label>
              <Input
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder={t('pengguna.placeholders.nama')}
                error={Boolean(errorMessage)}
              />
              {errorMessage && (
                <p className="text-[11px] text-destructive font-medium mt-1">
                  {errorMessage}
                </p>
              )}
            </div>
          );
        }}
      </form.Field>

      {/* Grid: Email & No HP */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Field: Email */}
        <form.Field
          name="email"
          validators={{
            onChange: ({ value }) => {
              const res = schema.shape.email.safeParse(value);
              if (!res.success && res.error) {
                return res.error?.issues?.[0]?.message || res.error?.errors?.[0]?.message;
              }
              return undefined;
            },
          }}
        >
          {(field) => {
            const errorMessage = getFieldError(schema, 'email', field.state.value, field.state.meta.errors);
            return (
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">
                  {t('pengguna.fields.email')} <span className="text-destructive">*</span>
                </label>
                <Input
                  name={field.name}
                  type="text"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder={t('pengguna.placeholders.email')}
                  error={Boolean(errorMessage)}
                />
                {errorMessage && (
                  <p className="text-[11px] text-destructive font-medium mt-1">
                    {errorMessage}
                  </p>
                )}
              </div>
            );
          }}
        </form.Field>

        {/* Field: No HP */}
        <form.Field
          name="noHp"
          validators={{
            onChange: ({ value }) => {
              const res = schema.shape.noHp.safeParse(value);
              if (!res.success && res.error) {
                return res.error?.issues?.[0]?.message || res.error?.errors?.[0]?.message;
              }
              return undefined;
            },
          }}
        >
          {(field) => {
            const errorMessage = getFieldError(schema, 'noHp', field.state.value, field.state.meta.errors);
            return (
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">
                  {t('pengguna.fields.noHp')} <span className="text-destructive">*</span>
                </label>
                <PhoneInput
                  value={field.state.value}
                  onValueChangeCustom={(val) => field.handleChange(val)}
                  placeholder={t('pengguna.placeholders.noHp')}
                  error={Boolean(errorMessage)}
                />
                {errorMessage && (
                  <p className="text-[11px] text-destructive font-medium mt-1">
                    {errorMessage}
                  </p>
                )}
              </div>
            );
          }}
        </form.Field>
      </div>

      {/* Grid: NIK & Gaji */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Field: NIK */}
        <form.Field
          name="nik"
          validators={{
            onChange: ({ value }) => {
              const res = schema.shape.nik.safeParse(value);
              if (!res.success && res.error) {
                return res.error?.issues?.[0]?.message || res.error?.errors?.[0]?.message;
              }
              return undefined;
            },
          }}
        >
          {(field) => {
            const errorMessage = getFieldError(schema, 'nik', field.state.value, field.state.meta.errors);
            return (
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">
                  {t('pengguna.fields.nik')} <span className="text-destructive">*</span>
                </label>
                <NikInput
                  value={field.state.value}
                  onValueChangeCustom={(val) => field.handleChange(val)}
                  placeholder={t('pengguna.placeholders.nik')}
                  error={Boolean(errorMessage)}
                />
                {errorMessage && (
                  <p className="text-[11px] text-destructive font-medium mt-1">
                    {errorMessage}
                  </p>
                )}
              </div>
            );
          }}
        </form.Field>

        {/* Field: Ekspektasi Gaji (Rupiah) */}
        <form.Field
          name="gaji"
          validators={{
            onChange: ({ value }) => {
              const res = schema.shape.gaji.safeParse(value);
              if (!res.success && res.error) {
                return res.error?.issues?.[0]?.message || res.error?.errors?.[0]?.message;
              }
              return undefined;
            },
          }}
        >
          {(field) => {
            const errorMessage = getFieldError(schema, 'gaji', field.state.value, field.state.meta.errors);
            return (
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">
                  {t('pengguna.fields.gaji')} <span className="text-destructive">*</span>
                </label>
                <RupiahInput
                  value={field.state.value}
                  onValueChangeCustom={(val) => field.handleChange(val || 0)}
                  placeholder={t('pengguna.placeholders.gaji')}
                  error={Boolean(errorMessage)}
                />
                {errorMessage && (
                  <p className="text-[11px] text-destructive font-medium mt-1">
                    {errorMessage}
                  </p>
                )}
              </div>
            );
          }}
        </form.Field>
      </div>

      {/* Grid: Role & Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Field: Role */}
        <form.Field name="role">
          {(field) => (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">
                {t('pengguna.fields.role')}
              </label>
              <Select
                options={FORM_ROLE_OPTIONS}
                value={field.state.value}
                onChange={(val) => field.handleChange(val as any)}
              />
            </div>
          )}
        </form.Field>

        {/* Field: Status */}
        <form.Field name="status">
          {(field) => (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">
                {t('pengguna.fields.status')}
              </label>
              <Select
                options={[
                  { label: t('common.active'), value: 'active' },
                  { label: t('common.inactive'), value: 'inactive' },
                ]}
                value={field.state.value}
                onChange={(val) => field.handleChange(val as any)}
              />
            </div>
          )}
        </form.Field>
      </div>

      {/* Boolean Radio Group Cards */}
      <form.Field name="verified">
        {(field) => (
          <div className="space-y-2 pt-1">
            <label className="text-xs font-semibold text-foreground">
              {t('pengguna.fields.verified')}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Option 1: True */}
              <button
                type="button"
                onClick={() => field.handleChange(true)}
                className={cn(
                  'flex items-start gap-3 p-3 rounded-lg border text-left transition-all cursor-pointer',
                  field.state.value
                    ? 'border-primary bg-primary/5 ring-1 ring-primary'
                    : 'border-border bg-card hover:bg-muted/40'
                )}
              >
                <CheckCircle2
                  className={cn(
                    'h-4 w-4 shrink-0 mt-0.5',
                    field.state.value ? 'text-primary' : 'text-muted-foreground'
                  )}
                />
                <div className="text-xs">
                  <p className="font-semibold text-foreground">Terverifikasi</p>
                  <p className="text-[11px] text-muted-foreground leading-snug">
                    Akun telah divalidasi dokumen KTP & nomor rekening resmi.
                  </p>
                </div>
              </button>

              {/* Option 2: False */}
              <button
                type="button"
                onClick={() => field.handleChange(false)}
                className={cn(
                  'flex items-start gap-3 p-3 rounded-lg border text-left transition-all cursor-pointer',
                  !field.state.value
                    ? 'border-primary bg-primary/5 ring-1 ring-primary'
                    : 'border-border bg-card hover:bg-muted/40'
                )}
              >
                <ShieldAlert
                  className={cn(
                    'h-4 w-4 shrink-0 mt-0.5',
                    !field.state.value ? 'text-primary' : 'text-muted-foreground'
                  )}
                />
                <div className="text-xs">
                  <p className="font-semibold text-foreground">Belum Verifikasi</p>
                  <p className="text-[11px] text-muted-foreground leading-snug">
                    Membutuhkan peninjauan dokumen tambahan oleh admin.
                  </p>
                </div>
              </button>
            </div>
          </div>
        )}
      </form.Field>

      {/* Form Action Buttons */}
      <div className="flex items-center justify-end gap-2 pt-4 border-t border-border">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          {t('common.cancel')}
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {t('common.save')}
        </Button>
      </div>
    </form>
  );
}
