import * as React from 'react';
import { Command } from 'cmdk';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Search,
  LayoutDashboard,
  Users,
  BarChart3,
  Settings,
  PlusCircle,
  Sun,
  Moon,
  Globe,
} from 'lucide-react';
import { useThemeStore } from '@/app/store/theme.store';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

interface CommandDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandSearchDialog({ open, onOpenChange }: CommandDialogProps) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useThemeStore();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [open, onOpenChange]);

  const handleSelect = (callback: () => void) => {
    onOpenChange(false);
    callback();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent requireDoubleClickOutside={false} className="p-0 max-w-xl overflow-hidden border-border bg-card shadow-2xl [&>button]:hidden">
        <Command className="flex flex-col w-full overflow-hidden rounded-xl bg-card">
          <div className="flex items-center border-b border-border px-3.5">
            <Search className="mr-2.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <Command.Input
              placeholder={t('app.searchPlaceholder')}
              className="flex h-11 w-full rounded-md bg-transparent text-xs text-foreground placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            />
            <Badge variant="outline" className="font-mono text-[10px] text-muted-foreground shrink-0 ml-2">
              ESC
            </Badge>
          </div>

          <Command.List className="max-h-[300px] overflow-y-auto p-2 space-y-2 text-xs">
            <Command.Empty className="py-6 text-center text-xs text-muted-foreground">
              {t('common.notFoundTitle')}
            </Command.Empty>

            {/* Group Navigasi */}
            <Command.Group heading={t('nav.mainMenu')} className="text-[11px] font-semibold text-muted-foreground px-2 py-1 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group-heading]]:pb-1">
              <Command.Item
                onSelect={() => handleSelect(() => navigate('/dashboard'))}
                className="flex items-center gap-2 px-2.5 py-2 rounded-lg cursor-pointer text-foreground hover:bg-accent data-[selected=true]:bg-primary data-[selected=true]:text-primary-foreground transition-colors"
              >
                <LayoutDashboard className="h-4 w-4 shrink-0" />
                <span>{t('nav.dashboard')}</span>
              </Command.Item>

              <Command.Item
                onSelect={() => handleSelect(() => navigate('/pengguna'))}
                className="flex items-center gap-2 px-2.5 py-2 rounded-lg cursor-pointer text-foreground hover:bg-accent data-[selected=true]:bg-primary data-[selected=true]:text-primary-foreground transition-colors"
              >
                <Users className="h-4 w-4 shrink-0" />
                <span>{t('nav.pengguna')}</span>
              </Command.Item>

              <Command.Item
                onSelect={() => handleSelect(() => navigate('/analitik'))}
                className="flex items-center gap-2 px-2.5 py-2 rounded-lg cursor-pointer text-foreground hover:bg-accent data-[selected=true]:bg-primary data-[selected=true]:text-primary-foreground transition-colors"
              >
                <BarChart3 className="h-4 w-4 shrink-0" />
                <span>{t('nav.analitik')}</span>
              </Command.Item>

              <Command.Item
                onSelect={() => handleSelect(() => navigate('/pengaturan'))}
                className="flex items-center gap-2 px-2.5 py-2 rounded-lg cursor-pointer text-foreground hover:bg-accent data-[selected=true]:bg-primary data-[selected=true]:text-primary-foreground transition-colors"
              >
                <Settings className="h-4 w-4 shrink-0" />
                <span>{t('nav.pengaturan')}</span>
              </Command.Item>
            </Command.Group>

            {/* Group Aksi Cepat */}
            <Command.Group heading="Aksi Cepat" className="text-[11px] font-semibold text-muted-foreground px-2 py-1 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group-heading]]:pb-1">
              <Command.Item
                onSelect={() => handleSelect(() => navigate('/pengguna?action=add'))}
                className="flex items-center gap-2 px-2.5 py-2 rounded-lg cursor-pointer text-foreground hover:bg-accent data-[selected=true]:bg-primary data-[selected=true]:text-primary-foreground transition-colors"
              >
                <PlusCircle className="h-4 w-4 shrink-0" />
                <span>{t('pengguna.addTitle')}</span>
              </Command.Item>

              <Command.Item
                onSelect={() => handleSelect(() => toggleTheme())}
                className="flex items-center gap-2 px-2.5 py-2 rounded-lg cursor-pointer text-foreground hover:bg-accent data-[selected=true]:bg-primary data-[selected=true]:text-primary-foreground transition-colors"
              >
                {theme === 'dark' ? <Sun className="h-4 w-4 shrink-0" /> : <Moon className="h-4 w-4 shrink-0" />}
                <span>{theme === 'dark' ? t('pengaturan.themeLight') : t('pengaturan.themeDark')}</span>
              </Command.Item>

              <Command.Item
                onSelect={() =>
                  handleSelect(() => {
                    const nextLang = i18n.language === 'id' ? 'en' : 'id';
                    i18n.changeLanguage(nextLang);
                    localStorage.setItem('app_language', nextLang);
                  })
                }
                className="flex items-center gap-2 px-2.5 py-2 rounded-lg cursor-pointer text-foreground hover:bg-accent data-[selected=true]:bg-primary data-[selected=true]:text-primary-foreground transition-colors"
              >
                <Globe className="h-4 w-4 shrink-0" />
                <span>Ganti Bahasa ({i18n.language === 'id' ? 'English' : 'Bahasa Indonesia'})</span>
              </Command.Item>
            </Command.Group>
          </Command.List>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
