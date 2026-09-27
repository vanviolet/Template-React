import { useLocation, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Building2,
  X,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { useSidebarStore } from '@/app/store/sidebar.store';
import { useIsMobile } from '@/hooks/use.mobile';
import { cn } from '@/utils/cn';
import { Button } from '@/components/ui/button';

export function AppSidebar() {
  const { t } = useTranslation();
  const location = useLocation();
  const isMobile = useIsMobile();
  const { isCollapsed, toggleCollapse, isMobileOpen, setMobileOpen } = useSidebarStore();

  const navItems = [
    {
      group: t('nav.mainMenu'),
      items: [
        {
          label: t('nav.dashboard'),
          path: '/dashboard',
          icon: LayoutDashboard,
        },
        {
          label: t('nav.pengguna'),
          path: '/pengguna',
          icon: Users,
        },
        {
          label: t('nav.analitik'),
          path: '/analitik',
          icon: BarChart3,
        },
      ],
    },
    {
      group: t('nav.systemMenu'),
      items: [
        {
          label: t('nav.pengaturan'),
          path: '/pengaturan',
          icon: Settings,
        },
      ],
    },
  ];

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between bg-card text-card-foreground border-r border-border transition-all duration-300">
      <div>
        {/* Sidebar Header / Brand - Clean Header */}
        <div
          className={cn(
            'flex h-16 items-center border-b border-border px-4 transition-all duration-300',
            isCollapsed && !isMobile ? 'justify-center px-2' : 'justify-between'
          )}
        >
          <Link
            to="/dashboard"
            className={cn(
              'flex items-center gap-2.5 min-w-0',
              isCollapsed && !isMobile && 'justify-center'
            )}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold shadow-xs">
              <Building2 className="h-5 w-5" />
            </div>
            {(!isCollapsed || isMobile) && (
              <div className="flex flex-col min-w-0 overflow-hidden">
                <span className="truncate text-sm font-bold tracking-tight text-foreground">
                  {t('app.title')}
                </span>
                <span className="truncate text-[10px] text-muted-foreground font-medium">
                  {t('app.subTitle')}
                </span>
              </div>
            )}
          </Link>

          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileOpen(false)}
              className="h-8 w-8 text-muted-foreground hover:text-foreground shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Navigation Items */}
        <div className="p-2.5 space-y-5 overflow-y-auto max-h-[calc(100vh-8rem)]">
          {navItems.map((group, groupIdx) => (
            <div key={groupIdx} className="space-y-1">
              {(!isCollapsed || isMobile) && (
                <p className="px-2 pb-1 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                  {group.group}
                </p>
              )}
              {group.items.map((item) => {
                const isActive =
                  location.pathname === item.path ||
                  (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
                const Icon = item.icon;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => isMobile && setMobileOpen(false)}
                    className={cn(
                      'flex items-center gap-3 rounded-lg text-xs font-medium transition-colors relative group',
                      isCollapsed && !isMobile
                        ? 'h-9 w-9 justify-center mx-auto'
                        : 'px-2.5 py-2',
                      isActive
                        ? 'bg-primary text-primary-foreground font-semibold shadow-2xs'
                        : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground'
                    )}
                    title={isCollapsed && !isMobile ? item.label : undefined}
                  >
                    <Icon
                      className={cn(
                        'h-4 w-4 shrink-0',
                        isActive
                          ? 'text-primary-foreground'
                          : 'text-muted-foreground group-hover:text-foreground'
                      )}
                    />
                    {(!isCollapsed || isMobile) && <span className="truncate">{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Permanently Positioned Toggle Button at the Bottom for Desktop */}
      {!isMobile && (
        <div className="p-2 border-t border-border mt-auto">
          {isCollapsed ? (
            <button
              type="button"
              onClick={toggleCollapse}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors mx-auto cursor-pointer"
              title="Perluas Sidebar"
            >
              <PanelLeftOpen className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={toggleCollapse}
              className="flex items-center justify-between w-full px-2.5 py-2 text-xs font-medium rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <PanelLeftClose className="h-4 w-4 shrink-0" />
                <span>Ciutkan Sidebar</span>
              </span>
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      )}
    </div>
  );

  if (isMobile) {
    if (!isMobileOpen) return null;
    return (
      <div className="fixed inset-0 z-50 flex lg:hidden">
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
        <div className="relative z-50 w-64 max-w-[80vw] h-full shadow-xl">
          {sidebarContent}
        </div>
      </div>
    );
  }

  return (
    <aside
      className={cn(
        'fixed top-0 left-0 z-30 h-screen transition-all duration-300 hidden lg:block',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {sidebarContent}
    </aside>
  );
}
