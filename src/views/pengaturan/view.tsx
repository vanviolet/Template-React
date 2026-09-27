import { useTranslation } from 'react-i18next';
import { useThemeStore } from '@/app/store/theme.store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LANGUAGE_OPTIONS } from '@/constants/app';
import { Sun, Moon, Laptop, Globe, Check } from 'lucide-react';
import { cn } from '@/utils/cn';

export default function PengaturanView() {
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useThemeStore();

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem('app_language', langCode);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="border-b border-border pb-4">
        <h1 className="text-xl font-bold tracking-tight text-foreground">{t('pengaturan.title')}</h1>
        <p className="text-xs text-muted-foreground mt-0.5">{t('pengaturan.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
        {/* Card 1: Theme Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">{t('pengaturan.appearance')}</CardTitle>
            <CardDescription>Pilih tema tampilan untuk antarmuka dashboard</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-3 gap-3">
              {/* Light Mode */}
              <button
                type="button"
                onClick={() => setTheme('light')}
                className={cn(
                  'flex flex-col items-center justify-center p-3 rounded-lg border text-xs gap-2 transition-all cursor-pointer',
                  theme === 'light'
                    ? 'border-primary bg-primary/5 ring-1 ring-primary font-semibold text-foreground'
                    : 'border-border bg-card text-muted-foreground hover:bg-muted/40'
                )}
              >
                <Sun className="h-5 w-5 text-amber-500" />
                <span>{t('pengaturan.themeLight')}</span>
              </button>

              {/* Dark Mode */}
              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={cn(
                  'flex flex-col items-center justify-center p-3 rounded-lg border text-xs gap-2 transition-all cursor-pointer',
                  theme === 'dark'
                    ? 'border-primary bg-primary/5 ring-1 ring-primary font-semibold text-foreground'
                    : 'border-border bg-card text-muted-foreground hover:bg-muted/40'
                )}
              >
                <Moon className="h-5 w-5 text-sky-400" />
                <span>{t('pengaturan.themeDark')}</span>
              </button>

              {/* System Mode */}
              <button
                type="button"
                onClick={() => setTheme('system')}
                className={cn(
                  'flex flex-col items-center justify-center p-3 rounded-lg border text-xs gap-2 transition-all cursor-pointer',
                  theme === 'system'
                    ? 'border-primary bg-primary/5 ring-1 ring-primary font-semibold text-foreground'
                    : 'border-border bg-card text-muted-foreground hover:bg-muted/40'
                )}
              >
                <Laptop className="h-5 w-5 text-purple-500" />
                <span>OS System</span>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Language Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary" />
              <span>{t('pengaturan.language')}</span>
            </CardTitle>
            <CardDescription>Pilih bahasa internasional untuk semua teks UI</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {LANGUAGE_OPTIONS.map((lang) => {
              const isSelected = i18n.language === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleLanguageChange(lang.code)}
                  className={cn(
                    'flex items-center justify-between w-full p-3 rounded-lg border text-xs transition-all cursor-pointer',
                    isSelected
                      ? 'border-primary bg-primary/5 ring-1 ring-primary font-semibold text-foreground'
                      : 'border-border bg-card text-muted-foreground hover:bg-muted/40'
                  )}
                >
                  <span className="flex items-center gap-2.5">
                    <span className="text-lg">{lang.flag}</span>
                    <span>{lang.label}</span>
                  </span>
                  {isSelected && <Check className="h-4 w-4 text-primary shrink-0" />}
                </button>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
