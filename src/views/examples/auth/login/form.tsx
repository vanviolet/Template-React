import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from '@tanstack/react-form';
import { Mail, Lock, Eye, EyeOff, Globe, Check, ArrowRight } from 'lucide-react';
import { MaterioLogo } from '@/layouts/app/sidebar';
import { createLoginSchema } from './schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown.menu';
import { LANGUAGE_OPTIONS } from '@/constants/app';
import { CubeSpinner } from '@/components/ui/cube.spinner';
import LangSwitcher from '@/i18n/lang.switcher';

export function LoginForm() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const loginSchema = createLoginSchema(t);

  const form = useForm({
    defaultValues: {
      email: 'admin@company.com',
      password: 'password123',
      rememberMe: true,
    },
    onSubmit: async ({ value }) => {
      setFormError(null);
      const res = loginSchema.safeParse(value);

      if (!res.success) {
        const issue = res.error.issues[0];
        setFormError(issue?.message || t('common.error'));
        return;
      }

      setIsSubmitting(true);
      // Simulate authentication request
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsSubmitting(false);
      localStorage.setItem('auth_token', 'mock_jwt_token_12345');
      navigate('/dashboard');
    },
  });

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem('app_language', langCode);
  };

  return (
    <div className="flex flex-col justify-between h-full p-6 sm:p-8 lg:p-10 bg-card text-card-foreground">
      {/* Top Bar: Brand Logo & Language Switcher */}
      <div className="flex items-center justify-between pb-6">
        <Link to="/" className="flex items-center gap-2.5 group">
          <MaterioLogo className="h-7 w-auto transition-transform group-hover:scale-105" />
          <span className="text-base font-extrabold tracking-wider text-foreground uppercase font-sans">
            MATERIO
          </span>
        </Link>

        {/* Language Switcher Button */}
      <LangSwitcher/>
      </div>

      {/* Main Form Section */}
      <div className="my-auto py-4 space-y-6 max-w-sm mx-auto w-full">
        {/* Header Titles */}
        <div className="text-center sm:text-left space-y-1.5">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            {t('auth.greeting')} 👋
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {t('auth.welcomeSub')}
          </p>
        </div>

        {formError && (
          <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-xs text-destructive font-medium">
            {formError}
          </div>
        )}

        {/* Login Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          {/* Email Field */}
          <form.Field
            name="email"
            children={(field) => {
              const parseResult = loginSchema.shape.email.safeParse(field.state.value);
              const fieldError = !parseResult.success ? parseResult.error.issues[0]?.message : undefined;

              return (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{t('auth.emailLabel')}</span>
                  </label>
                  <Input
                    type="email"
                    placeholder={t('auth.emailPlaceholder')}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="h-10 rounded-xl bg-muted/30 border-border/70 focus:bg-background text-xs px-3.5"
                  />
                  {field.state.meta.isTouched && fieldError && (
                    <p className="text-[11px] font-medium text-destructive pt-0.5">
                      {fieldError}
                    </p>
                  )}
                </div>
              );
            }}
          />

          {/* Password Field */}
          <form.Field
            name="password"
            children={(field) => {
              const parseResult = loginSchema.shape.password.safeParse(field.state.value);
              const fieldError = !parseResult.success ? parseResult.error.issues[0]?.message : undefined;

              return (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>{t('auth.passwordLabel')}</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => {}}
                      className="text-[11px] font-semibold text-primary hover:underline cursor-pointer"
                    >
                      {t('auth.forgotPassword')}
                    </button>
                  </div>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder={t('auth.passwordPlaceholder')}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="h-10 rounded-xl bg-muted/30 border-border/70 focus:bg-background text-xs pl-3.5 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {field.state.meta.isTouched && fieldError && (
                    <p className="text-[11px] font-medium text-destructive pt-0.5">
                      {fieldError}
                    </p>
                  )}
                </div>
              );
            }}
          />

          {/* Remember Me */}
          <form.Field
            name="rememberMe"
            children={(field) => (
              <div className="flex items-center gap-2 pt-1 pb-2">
                <Checkbox
                  id="rememberMe"
                  checked={field.state.value}
                  onCheckedChange={(val) => field.handleChange(!!val)}
                />
                <label
                  htmlFor="rememberMe"
                  className="text-xs text-muted-foreground cursor-pointer select-none"
                >
                  {t('auth.rememberMe')}
                </label>
              </div>
            )}
          />

          {/* Primary Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-10 rounded-xl font-bold text-xs shadow-md shadow-primary/25 gap-2 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <CubeSpinner size={16} />
                <span>{t('common.processing')}</span>
              </>
            ) : (
              <>
                <span>{t('auth.loginButton')}</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </form>

        {/* Footer Link: Sign Up */}
        <p className="text-center text-xs text-muted-foreground pt-2">
          {t('auth.noAccount')}{' '}
          <Link to="/register" className="font-bold text-primary hover:underline">
            {t('auth.signUp')}
          </Link>
        </p>
      </div>

      {/* Social Footer */}
      <div className="pt-6 border-t border-border/40 text-center text-[11px] text-muted-foreground">
        <p>{t('app.copyright')}</p>
      </div>
    </div>
  );
}
