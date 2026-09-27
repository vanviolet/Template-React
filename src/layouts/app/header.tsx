import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Menu,
  Sun,
  Moon,
  Globe,
  Bell,
  Search,
  User,
  Settings,
  LogOut,
  Check,
  ShieldCheck,
} from 'lucide-react';
import { useSidebarStore } from '@/app/store/sidebar.store';
import { useThemeStore } from '@/app/store/theme.store';
import { useIsMobile } from '@/hooks/use.mobile';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown.menu';
import { LANGUAGE_OPTIONS } from '@/constants/app';
import { CommandSearchDialog } from '@/components/ui/command.dialog';
import { cn } from '@/utils/cn';

export function AppHeader() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { isCollapsed, toggleMobileOpen } = useSidebarStore();
  const { theme, setTheme } = useThemeStore();
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getBreadcrumbTitle = () => {
    if (location.pathname.startsWith('/pengguna')) return t('nav.pengguna');
    if (location.pathname.startsWith('/analitik')) return t('nav.analitik');
    if (location.pathname.startsWith('/pengaturan')) return t('nav.pengaturan');
    return t('nav.dashboard');
  };

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem('app_language', langCode);
  };

  return (
    <>
      <header
        className={cn(
          'fixed z-20 transition-all duration-300 flex items-center justify-between',
          isMobile ? 'left-0 right-0' : isCollapsed ? 'left-16 right-0' : 'left-64 right-0',
          isScrolled
            ? 'top-2 mx-3 sm:mx-4 lg:mx-6 h-14 rounded-xl border border-border/80 bg-card/85 backdrop-blur-md shadow-md px-4'
            : 'top-0 h-16 border-b-0 bg-transparent px-4 lg:px-6 shadow-none'
        )}
      >
        {/* Left Zone: Sidebar Toggle & Page Title */}
        <div className="flex items-center gap-3">
          {isMobile && (
            <Button
              variant="outline"
              size="icon"
              onClick={toggleMobileOpen}
              className="h-8 w-8 text-foreground"
            >
              <Menu className="h-4 w-4" />
            </Button>
          )}

          <div className="flex flex-col">
            <span className="text-xs font-semibold text-foreground tracking-tight">
              {getBreadcrumbTitle()}
            </span>
            <span className="text-[10px] text-muted-foreground hidden sm:inline-block">
              {t('app.title')} / {getBreadcrumbTitle()}
            </span>
          </div>
        </div>

        {/* Center Zone: CMDK Command Search Bar */}
        <button
          type="button"
          onClick={() => setIsCommandOpen(true)}
          className="hidden md:flex items-center justify-between w-60 lg:w-80 h-8 px-3 rounded-lg border border-input bg-muted/30 hover:bg-muted/60 text-xs text-muted-foreground transition-colors cursor-pointer select-none"
        >
          <div className="flex items-center gap-2">
            <Search className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{t('app.searchPlaceholder')}</span>
          </div>
          <Badge variant="outline" className="font-mono text-[9px] px-1 py-0 h-4 bg-card text-muted-foreground">
            Ctrl K
          </Badge>
        </button>

        {/* Right Zone: Actions (Language, Theme, Notifications, User Profile) */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Mobile Search Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCommandOpen(true)}
            className="md:hidden h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            <Search className="h-4 w-4" />
          </Button>

          {/* Language Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                <Globe className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuLabel>{t('pengaturan.language')}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {LANGUAGE_OPTIONS.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className="justify-between"
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

          {/* Theme Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                {theme === 'dark' ? <Moon className="h-4 w-4 text-sky-400" /> : <Sun className="h-4 w-4 text-amber-500" />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36">
              <DropdownMenuLabel>{t('pengaturan.appearance')}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setTheme('light')} className="justify-between">
                <span>{t('pengaturan.themeLight')}</span>
                {theme === 'light' && <Check className="h-3.5 w-3.5 text-primary" />}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('dark')} className="justify-between">
                <span>{t('pengaturan.themeDark')}</span>
                {theme === 'dark' && <Check className="h-3.5 w-3.5 text-primary" />}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('system')} className="justify-between">
                <span>{t('pengaturan.themeSystem')}</span>
                {theme === 'system' && <Check className="h-3.5 w-3.5 text-primary" />}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notification Icon */}
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground relative">
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive animate-pulse" />
          </Button>

          {/* User Profile Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 p-1 gap-2 rounded-full hover:bg-muted">
                <Avatar className="h-7 w-7">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                    AD
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal p-3">
                <div className="flex items-start gap-3">
                  <Avatar className="h-9 w-9 shrink-0">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                      AD
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col min-w-0 flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-1">
                      <p className="text-xs font-bold leading-none text-foreground truncate">
                        Admin User
                      </p>
                      <Badge variant="success" className="px-1 text-[9px] h-4 font-mono">
                        PRO
                      </Badge>
                    </div>
                    <p className="text-[11px] leading-none text-muted-foreground font-mono truncate">
                      admin@company.com
                    </p>
                    <p className="text-[10px] text-muted-foreground flex items-center gap-1 pt-1">
                      <ShieldCheck className="h-3 w-3 text-emerald-500 shrink-0" />
                      <span>Superadmin</span>
                    </p>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="h-3.5 w-3.5" />
                <span>{t('app.profile')}</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="h-3.5 w-3.5" />
                <span>{t('app.settings')}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => navigate('/login')}
                className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>{t('app.logout')}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* CMDK Palette Dialog */}
      <CommandSearchDialog open={isCommandOpen} onOpenChange={setIsCommandOpen} />
    </>
  );
}
