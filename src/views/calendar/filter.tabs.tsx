import * as React from 'react';
import { LayoutGrid, MessageSquare, Calendar as CalendarIcon, Palmtree, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { CalendarCategory } from './events';
import { cn } from '@/utils/cn';

interface FilterTabsProps {
  selected: CalendarCategory;
  onSelect: (category: CalendarCategory) => void;
  counts: Record<CalendarCategory, number>;
}

export function FilterTabs({ selected, onSelect, counts }: FilterTabsProps) {
  const { t } = useTranslation();

  const tabs: {
    id: CalendarCategory;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    {
      id: 'all',
      label: t('calendar.allScheduled', 'All Scheduled'),
      icon: LayoutGrid,
    },
    {
      id: 'meetings',
      label: `${t('calendar.meetings', 'Meetings')} (${counts.meetings || 0})`,
      icon: MessageSquare,
    },
    {
      id: 'events',
      label: `${t('calendar.eventsTab', 'Events')} (${counts.events || 0})`,
      icon: CalendarIcon,
    },
    {
      id: 'holidays',
      label: `${t('calendar.holidays', 'Holidays')} (${counts.holidays || 0})`,
      icon: Palmtree,
    },
    {
      id: 'timeoff',
      label: `${t('calendar.timeOff', 'Time Off')} (${counts.timeoff || 0})`,
      icon: Clock,
    },
  ];

  return (
    <div className="flex items-center gap-1 overflow-x-auto border-b border-border/80 pb-1 scrollbar-none">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = selected === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onSelect(tab.id)}
            className={cn(
              'group relative flex items-center gap-2 whitespace-nowrap px-3.5 py-2 text-xs font-semibold tracking-tight transition-all duration-150 rounded-lg',
              isActive
                ? 'text-primary'
                : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
            )}
          >
            <Icon
              className={cn(
                'h-3.5 w-3.5 transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
              )}
            />
            <span>{tab.label}</span>

            {/* Bottom active indicator matching Fullcalendar2.jpg */}
            {isActive && (
              <span className="absolute inset-x-2 -bottom-1 h-0.5 rounded-full bg-primary" />
            )}
          </button>
        );
      })}
    </div>
  );
}
