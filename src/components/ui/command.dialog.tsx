import * as React from 'react';
import { Command } from 'cmdk';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';
import { useThemeStore } from '@/app/store/theme.store';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { APP_NAV_GROUPS, QUICK_ACTIONS_REGISTRY } from '@/constants/navigation';

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
      <DialogContent
        requireDoubleClickOutside={false}
        className="p-0 max-w-xl overflow-hidden border-border bg-card shadow-2xl [&>button]:hidden"
      >
        <Command className="flex flex-col w-full overflow-hidden rounded-xl bg-card">
          <div className="flex items-center border-b border-border px-3.5">
            <Search className="mr-2.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <Command.Input
              placeholder={t('app.searchPlaceholder', 'Ketik perintah atau cari modul...')}
              className="flex h-11 w-full rounded-md bg-transparent text-xs text-foreground placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            />
            <Badge
              variant="outline"
              className="font-mono text-[10px] text-muted-foreground shrink-0 ml-2"
            >
              ESC
            </Badge>
          </div>

          <Command.List className="max-h-[300px] overflow-y-auto p-2 space-y-2 text-xs">
            <Command.Empty className="py-6 text-center text-xs text-muted-foreground">
              {t('common.notFoundTitle', 'Tidak ada data')}
            </Command.Empty>

            {/* Navigation Groups from shared APP_NAV_GROUPS */}
            {APP_NAV_GROUPS.map((group) => {
              // Only show active/enabled items in cmdk
              const activeItems = group.items.filter((item) => !item.disabled);
              if (activeItems.length === 0) return null;

              const headingText = group.groupKey
                ? t(group.groupKey, group.group)
                : group.group;

              return (
                <Command.Group
                  key={group.group}
                  heading={headingText}
                  className="text-[11px] font-semibold text-muted-foreground px-2 py-1 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group-heading]]:pb-1"
                >
                  {activeItems.map((item) => {
                    const Icon = item.icon;
                    const itemLabel = t(item.labelKey, item.defaultLabel);
                    return (
                      <Command.Item
                        key={item.id}
                        value={`${itemLabel} ${item.path} ${(item.keywords || []).join(' ')}`}
                        onSelect={() => handleSelect(() => navigate(item.path))}
                        className="flex items-center justify-between px-2.5 py-2 rounded-lg cursor-pointer text-foreground hover:bg-accent data-[selected=true]:bg-primary data-[selected=true]:text-primary-foreground transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4 shrink-0" />
                          <span>{itemLabel}</span>
                        </div>
                        <span className="font-mono text-[10px] opacity-60">
                          {item.path}
                        </span>
                      </Command.Item>
                    );
                  })}
                </Command.Group>
              );
            })}

            {/* Quick Actions from shared QUICK_ACTIONS_REGISTRY */}
            <Command.Group
              heading="Aksi Cepat"
              className="text-[11px] font-semibold text-muted-foreground px-2 py-1 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group-heading]]:pb-1"
            >
              {QUICK_ACTIONS_REGISTRY.map((actionItem) => {
                const Icon = actionItem.icon;
                const actionTitle = t(actionItem.titleKey, actionItem.defaultTitle);
                return (
                  <Command.Item
                    key={actionItem.id}
                    value={`${actionTitle} ${(actionItem.keywords || []).join(' ')}`}
                    onSelect={() =>
                      handleSelect(() =>
                        actionItem.action({
                          navigate,
                          toggleTheme,
                          currentTheme: theme,
                          changeLanguage: (nextLang) => {
                            i18n.changeLanguage(nextLang);
                            localStorage.setItem('app_language', nextLang);
                          },
                          currentLanguage: i18n.language || 'id',
                        })
                      )
                    }
                    className="flex items-center gap-2 px-2.5 py-2 rounded-lg cursor-pointer text-foreground hover:bg-accent data-[selected=true]:bg-primary data-[selected=true]:text-primary-foreground transition-colors"
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{actionTitle}</span>
                  </Command.Item>
                );
              })}
            </Command.Group>
          </Command.List>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
