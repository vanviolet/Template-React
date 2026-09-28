import { useLocation, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  X,
} from 'lucide-react';
import { useSidebarStore } from '@/app/store/sidebar.store';
import { useIsMobile } from '@/hooks/use.mobile';
import { cn } from '@/utils/cn';
import { Button } from '@/components/ui/button';
import { APP_NAV_GROUPS } from '@/constants/navigation';

export function MaterioLogo({ className }: { className?: string }) {
  return (
    <svg
      width="30"
      height="24"
      viewBox="0 0 30 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M13.52 0C11.83 0 10.25 0.77 9.21 2.09L1.13 12.37C0.32 13.4 -0.12 14.67 0.03 15.96C0.28 18.23 2.18 20 4.47 20H8.35L13.52 13.43V0Z"
        fill="url(#materio_grad_1)"
      />
      <path
        d="M16.48 0C18.17 0 19.75 0.77 20.79 2.09L28.87 12.37C29.68 13.4 30.12 14.67 29.97 15.96C29.72 18.23 27.82 20 25.53 20H21.65L16.48 13.43V0Z"
        fill="url(#materio_grad_2)"
      />
      <path
        d="M15 11.5L9 19.5H21L15 11.5Z"
        fill="var(--primary)"
      />
      <defs>
        <linearGradient
          id="materio_grad_1"
          x1="0"
          y1="0"
          x2="13.52"
          y2="20"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="var(--primary)" />
          <stop offset="1" stopColor="var(--accent)" />
        </linearGradient>
        <linearGradient
          id="materio_grad_2"
          x1="30"
          y1="0"
          x2="16.48"
          y2="20"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="var(--primary)" />
          <stop offset="1" stopColor="var(--accent)" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function AppSidebar() {
  const { t } = useTranslation();
  const location = useLocation();
  const isMobile = useIsMobile();
  const { isCollapsed, toggleCollapse, isMobileOpen, setMobileOpen } = useSidebarStore();
  
  const navGroups = APP_NAV_GROUPS.map((g) => ({
    group: g.groupKey ? t(g.groupKey, g.group) : g.group,
    items: g.items.map((item) => ({
      ...item,
      label: t(item.labelKey, item.defaultLabel),
    })),
  }));

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between bg-card text-card-foreground border-r border-border transition-all duration-300 select-none">
      <div className="flex-1 flex flex-col min-h-0">
        {/* Materio Sidebar Clean Brand Header without clutter */}
        <div
          className={cn(
            'flex h-16 shrink-0 items-center px-4 transition-all duration-300 border-b border-border/40',
            isCollapsed && !isMobile ? 'justify-center px-2' : 'justify-between'
          )}
        >
          <Link
            to="/dashboard"
            className={cn(
              'flex items-center gap-3 min-w-0 group',
              isCollapsed && !isMobile && 'justify-center'
            )}
          >
            <div className="flex shrink-0 items-center justify-center">
              <MaterioLogo className="h-7 w-auto transition-transform duration-200 group-hover:scale-105" />
            </div>
            {(!isCollapsed || isMobile) && (
              <span className="truncate text-lg font-extrabold tracking-wider text-foreground font-sans uppercase">
                MATERIO
              </span>
            )}
          </Link>

          {/* Mobile Close Button */}
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileOpen(false)}
              className="h-8 w-8 text-muted-foreground hover:text-foreground shrink-0 rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Materio Navigation Menu List */}
        <div className="flex-1 pt-3 pb-4 space-y-4 overflow-y-auto">
          {navGroups.map((group, groupIdx) => (
            <div key={groupIdx} className="space-y-1">
              {(!isCollapsed || isMobile) && (
                <p className="px-5 py-1.5 text-[10px] font-bold tracking-widest text-muted-foreground/70 uppercase">
                  {group.group}
                </p>
              )}

              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive =
                    location.pathname === item.path ||
                    (item.path !== '/dashboard' &&
                      item.path !== '/email' &&
                      location.pathname.startsWith(item.path));

                  const Icon = item.icon;

                  if (isCollapsed && !isMobile) {
                    return (
                      <Link
                        key={item.path}
                        to={item.disabled ? '#' : item.path}
                        onClick={(e) => {
                          if (item.disabled) e.preventDefault();
                        }}
                        className={cn(
                          'flex h-10 w-10 items-center justify-center mx-auto my-1 transition-all duration-200 relative group',
                          isActive
                            ? 'bg-primary text-primary-foreground shadow-md shadow-primary/30 rounded-full'
                            : item.disabled
                            ? 'text-muted-foreground/40 cursor-not-allowed'
                            : 'text-foreground/70 hover:bg-accent/60 hover:text-primary rounded-full'
                        )}
                        title={item.label}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                      </Link>
                    );
                  }

                  return (
                    <Link
                      key={item.path}
                      to={item.disabled ? '#' : item.path}
                      onClick={(e) => {
                        if (item.disabled) {
                          e.preventDefault();
                          return;
                        }
                        if (isMobile) setMobileOpen(false);
                      }}
                      className={cn(
                        'group flex items-center justify-between pl-5 pr-4 py-2.5 my-0.5 text-xs font-medium transition-all duration-150 relative cursor-pointer',
                        // Materio Signature Pill Shape: Rounded on right
                        'mr-3 rounded-r-full',
                        isActive
                          ? 'bg-primary text-primary-foreground font-semibold shadow-md shadow-primary/25'
                          : item.disabled
                          ? 'text-muted-foreground/40 cursor-not-allowed'
                          : 'text-foreground/80 hover:bg-accent/60 hover:text-primary'
                      )}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Icon
                          className={cn(
                            'h-4 w-4 shrink-0 transition-colors',
                            isActive
                              ? 'text-primary-foreground'
                              : item.disabled
                              ? 'text-muted-foreground/40'
                              : 'text-muted-foreground group-hover:text-primary'
                          )}
                        />
                        <span className="truncate">{item.label}</span>
                      </div>

                      {/* Right Chevron / Badge / Indicators */}
                      {item.hasChevron && (
                        <ChevronRight
                          className={cn(
                            'h-3.5 w-3.5 shrink-0 transition-transform',
                            item.disabled ? 'text-muted-foreground/30' : 'text-muted-foreground/60'
                          )}
                        />
                      )}

                      {item.badge && !isActive && (
                        <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-primary/10 text-primary rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Footer Section: Sidebar Collapse Toggle Button */}
      {!isMobile && (
        <div className="shrink-0 p-3 border-t border-border/50 bg-muted/20">
          <button
            type="button"
            onClick={toggleCollapse}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent/70 transition-all cursor-pointer',
              isCollapsed && 'justify-center px-0'
            )}
            title={isCollapsed ? 'Perluas Sidebar' : 'Ciutkan Sidebar'}
          >
            {isCollapsed ? (
              <PanelLeftOpen className="h-4 w-4 text-primary shrink-0 transition-transform" />
            ) : (
              <>
                <PanelLeftClose className="h-4 w-4 text-muted-foreground group-hover:text-primary shrink-0 transition-colors" />
                <span className="truncate text-foreground/80">Ciutkan Sidebar</span>
              </>
            )}
          </button>
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
        <div className="relative z-50 w-64 max-w-[80vw] h-full shadow-2xl">
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
