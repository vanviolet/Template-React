import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from '@tanstack/react-form';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Globe,
  Check,
  ArrowRight,
  ShieldCheck,
  ArrowLeft,
  KeyRound,
  RotateCcw,
} from 'lucide-react';
import { MaterioLogo } from '@/layouts/app/sidebar';
import { createRegisterSchema, verificationSchema } from './schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown.menu';
import { LANGUAGE_OPTIONS } from '@/constants/app';
import { CubeSpinner } from '@/components/ui/cube.spinner';

export function RegisterForm() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  // Wizard state: 'register' -> 'verify'
  const [step, setStep] = useState<'register' | 'verify'>('register');
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // OTP state for 6 boxes
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const registerSchema = createRegisterSchema(t);

  const form = useForm({
    defaultValues: {
      username: '',
      email: '',
      password: '',
      password_confirm: '',
    },
    onSubmit: async ({ value }) => {
      setFormError(null);
      const parseResult = registerSchema.safeParse(value);

      if (!parseResult.success) {
        const firstIssue = parseResult.error.issues[0];
        setFormError(firstIssue?.message || t('common.error'));
        return;
      }

      setIsSubmitting(true);
      // Simulate registration request
      await new Promise((resolve) => setTimeout(resolve, 800));
      setIsSubmitting(false);

      setRegisteredEmail(value.email);
      setStep('verify');
    },
  });

  // Countdown timer for OTP Resend
  useEffect(() => {
    let interval: any = null;
    if (step === 'verify' && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem('app_language', langCode);
  };

  const handleOtpChange = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return;

    const newOtp = [...otp];
    newOtp[index] = val.slice(-1); // Take last digit
    setOtp(newOtp);

    // Auto-advance focus to next input box
    if (val && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split('');
      setOtp(digits);
      otpInputRefs.current[5]?.focus();
    }
  };

  const handleResendCode = () => {
    setResendTimer(60);
    setCanResend(false);
    setOtp(['', '', '', '', '', '']);
    otpInputRefs.current[0]?.focus();
  };

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const codeString = otp.join('');
    const parseRes = verificationSchema.safeParse({ code: codeString });

    if (!parseRes.success) {
      setFormError(parseRes.error.issues[0]?.message || 'Kode verifikasi tidak valid');
      return;
    }

    setFormError(null);
    setIsSubmitting(true);

    // Simulate code verification
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);

    localStorage.setItem('auth_token', 'mock_verified_token_999');
    navigate('/dashboard');
  };

  return (
    <div className="flex flex-col justify-between h-full p-6 sm:p-8 lg:p-10 bg-card text-card-foreground">
      {/* Top Bar: Brand Logo & Language Switcher */}
      <div className="flex items-center justify-between pb-4">
        <Link to="/" className="flex items-center gap-2.5 group">
          <MaterioLogo className="h-7 w-auto transition-transform group-hover:scale-105" />
          <span className="text-base font-extrabold tracking-wider text-foreground uppercase font-sans">
            MATERIO
          </span>
        </Link>

        {/* Language Switcher */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 rounded-full text-xs font-medium border-border/80 bg-muted/30 hover:bg-muted cursor-pointer"
            >
              <Globe className="h-3.5 w-3.5 text-muted-foreground" />
              <span>{i18n.language.toUpperCase()}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36">
            {LANGUAGE_OPTIONS.map((lang) => (
              <DropdownMenuItem
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className="justify-between text-xs cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <span>{lang.flag}</span>
                  <span>{lang.label}</span>
                </span>
                {i18n.language === lang.code && <Check className="h-3.5 w-3.5 text-primary" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* STEP 1: Registration Form */}
      {step === 'register' && (
        <div className="my-auto py-2 space-y-5 max-w-sm mx-auto w-full">
          {/* Header */}
          <div className="text-center sm:text-left space-y-1">
            <h2 className="text-2xl font-extrabold tracking-tight text-foreground">
              Buat Akun Baru 🚀
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Bergabung bersama platform Materio Education Hub
            </p>
          </div>

          {formError && (
            <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-xs text-destructive font-medium">
              {formError}
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="space-y-3.5"
          >
            {/* Username Field */}
            <form.Field
              name="username"
              children={(field) => {
                const parseRes = registerSchema.shape.username.safeParse(field.state.value);
                const fieldErr = !parseRes.success ? parseRes.error.issues[0]?.message : undefined;

                return (
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>Username</span>
                    </label>
                    <Input
                      type="text"
                      placeholder="contoh_user123"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="h-9 rounded-xl bg-muted/30 border-border/70 focus:bg-background text-xs px-3.5 font-mono"
                    />
                    {field.state.meta.isTouched && fieldErr && (
                      <p className="text-[11px] font-medium text-destructive pt-0.5">{fieldErr}</p>
                    )}
                  </div>
                );
              }}
            />

            {/* Email Field */}
            <form.Field
              name="email"
              children={(field) => {
                const parseRes = registerSchema.shape.email.safeParse(field.state.value);
                const fieldErr = !parseRes.success ? parseRes.error.issues[0]?.message : undefined;

                return (
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>Email</span>
                    </label>
                    <Input
                      type="email"
                      placeholder="nama@email.com"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="h-9 rounded-xl bg-muted/30 border-border/70 focus:bg-background text-xs px-3.5"
                    />
                    {field.state.meta.isTouched && fieldErr && (
                      <p className="text-[11px] font-medium text-destructive pt-0.5">{fieldErr}</p>
                    )}
                  </div>
                );
              }}
            />

            {/* Password Field */}
            <form.Field
              name="password"
              children={(field) => {
                const parseRes = registerSchema.shape.password.safeParse(field.state.value);
                const fieldErr = !parseRes.success ? parseRes.error.issues[0]?.message : undefined;

                return (
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>Kata Sandi</span>
                    </label>
                    <div className="relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="h-9 rounded-xl bg-muted/30 border-border/70 focus:bg-background text-xs pl-3.5 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {field.state.meta.isTouched && fieldErr && (
                      <p className="text-[11px] font-medium text-destructive pt-0.5">{fieldErr}</p>
                    )}
                  </div>
                );
              }}
            />

            {/* Password Confirm Field */}
            <form.Field
              name="password_confirm"
              children={(field) => {
                const isMatch = field.state.value === form.getFieldValue('password');
                const showErr = field.state.meta.isTouched && !isMatch && field.state.value.length > 0;

                return (
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <ShieldCheck className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>Konfirmasi Kata Sandi</span>
                    </label>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="h-9 rounded-xl bg-muted/30 border-border/70 focus:bg-background text-xs pl-3.5 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {showErr && (
                      <p className="text-[11px] font-medium text-destructive pt-0.5">
                        Konfirmasi kata sandi tidak cocok
                      </p>
                    )}
                  </div>
                );
              }}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-10 rounded-xl font-bold text-xs shadow-md shadow-primary/25 gap-2 cursor-pointer mt-2"
            >
              {isSubmitting ? (
                <>
                  <CubeSpinner size={16} />
                  <span>{t('common.processing')}</span>
                </>
              ) : (
                <>
                  <span>Daftar & Kirim Kode</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          {/* Footer Link: Login */}
          <p className="text-center text-xs text-muted-foreground pt-1">
            Sudah memiliki akun?{' '}
            <Link to="/login" className="font-bold text-primary hover:underline">
              Masuk Sekarang
            </Link>
          </p>
        </div>
      )}

      {/* STEP 2: Email Verification Code Screen */}
      {step === 'verify' && (
        <div className="my-auto py-2 space-y-6 max-w-sm mx-auto w-full">
          {/* Back to Edit Registration */}
          <button
            type="button"
            onClick={() => {
              setStep('register');
              setFormError(null);
            }}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Kembali ke Pendaftaran</span>
          </button>

          {/* Verification Header */}
          <div className="text-center space-y-2">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary mx-auto flex items-center justify-center shadow-xs">
              <KeyRound className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight text-foreground">
              Masukan Kode Verifikasi 🔑
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Kami telah mengirimkan 6 digit kode verifikasi ke email{' '}
              <strong className="text-foreground font-mono">{registeredEmail}</strong>
            </p>
          </div>

          {formError && (
            <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-xs text-destructive font-medium text-center">
              {formError}
            </div>
          )}

          {/* OTP Input Form */}
          <form onSubmit={handleVerifySubmit} className="space-y-6">
            <div className="flex items-center justify-between gap-2" onPaste={handleOtpPaste}>
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => {
                    otpInputRefs.current[idx] = el;
                  }}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                  className="h-12 w-11 sm:w-12 text-center text-lg font-extrabold font-mono rounded-xl border border-input bg-muted/20 focus:bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-hidden text-foreground"
                />
              ))}
            </div>

            {/* Resend Timer / Button */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Tidak menerima kode?</span>
              {canResend ? (
                <button
                  type="button"
                  onClick={handleResendCode}
                  className="font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Kirim Ulang Kode</span>
                </button>
              ) : (
                <span className="font-mono text-muted-foreground/80">
                  Kirim Ulang ({resendTimer}s)
                </span>
              )}
            </div>

            {/* Submit Verification */}
            <Button
              type="submit"
              disabled={isSubmitting || otp.join('').length < 6}
              className="w-full h-11 rounded-xl font-bold text-xs shadow-md shadow-primary/25 gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <CubeSpinner size={16} />
                  <span>Verifikasi Data...</span>
                </>
              ) : (
                <>
                  <span>Verifikasi & Masuk</span>
                  <Check className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </div>
      )}

      {/* Social Footer */}
      <div className="pt-4 border-t border-border/40 text-center text-[11px] text-muted-foreground">
        <p>{t('app.copyright')}</p>
      </div>
    </div>
  );
}
