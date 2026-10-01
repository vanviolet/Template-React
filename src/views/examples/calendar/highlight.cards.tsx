import * as React from 'react';
import { ChevronDown, Video, AlertCircle, Clock, CalendarCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { CalendarDemoEvent } from './events';
import { formatDate } from '@/utils/date';
import { cn } from '@/utils/cn';

interface HighlightCardsProps {
  events: CalendarDemoEvent[];
  onSelectEvent: (event: CalendarDemoEvent) => void;
}

export function HighlightCards({ events, onSelectEvent }: HighlightCardsProps) {
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage || 'id';

  // Highlight key events (e.g. today's meetings or conflicted events)
  const highlighted = React.useMemo(() => {
    return events.filter(
      (e) => e.statusBadge === 'today' || e.statusBadge === 'conflicted' || e.statusBadge === 'upcoming'
    ).slice(0, 3);
  }, [events]);

  if (highlighted.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
      {highlighted.map((event) => {
        const startDate = new Date(event.start);
        const endDate = new Date(event.end);
        const timeRange = `${formatDate(startDate, 'hh:mm a', lang)} - ${formatDate(endDate, 'hh:mm a', lang)}`;
        const isConflicted = event.statusBadge === 'conflicted';

        return (
          <div
            key={event.id}
            onClick={() => onSelectEvent(event)}
            className={cn(
              'group relative flex flex-col justify-between rounded-2xl border bg-card p-4 transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md hover:border-primary/40',
              isConflicted
                ? 'border-amber-200/80 dark:border-amber-900/60 bg-gradient-to-br from-amber-500/5 to-transparent'
                : 'border-border/80 hover:bg-accent/15'
            )}
          >
            {/* Header: Title + Chevron */}
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h4 className="text-sm font-semibold tracking-tight text-foreground truncate group-hover:text-primary transition-colors">
                  {event.title}
                </h4>
                <p className="mt-1 text-xs font-medium text-muted-foreground">
                  {timeRange}
                </p>
              </div>
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-muted-foreground group-hover:bg-muted group-hover:text-foreground transition-all">
                <ChevronDown className="h-4 w-4" />
              </span>
            </div>

            {/* Bottom Row: Status Badge + Action CTA */}
            <div
              className={cn(
                'mt-4 flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold',
                isConflicted
                  ? 'bg-amber-100/70 text-amber-900 dark:bg-amber-950/50 dark:text-amber-200'
                  : 'bg-emerald-100/70 text-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-200'
              )}
            >
              {/* Badge */}
              <div className="flex items-center gap-1.5">
                {isConflicted ? (
                  <>
                    <AlertCircle className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                    <span>
                      {event.conflictCount ?? 2} {t('calendar.conflicted', 'Conflicted')}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>{t('datepicker.today', 'Today')}</span>
                  </>
                )}
              </div>

              {/* Action Button */}
              {isConflicted ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectEvent(event);
                  }}
                  className="font-semibold text-amber-700 hover:text-amber-900 dark:text-amber-300 dark:hover:text-amber-100 underline-offset-2 hover:underline transition-colors"
                >
                  {t('calendar.seeConflict', 'See Conflict')}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (event.meetingUrl) window.open(event.meetingUrl, '_blank');
                    else onSelectEvent(event);
                  }}
                  className="font-semibold text-emerald-700 hover:text-emerald-900 dark:text-emerald-300 dark:hover:text-emerald-100 underline-offset-2 hover:underline transition-colors inline-flex items-center gap-1"
                >
                  <Video className="h-3 w-3" />
                  {t('calendar.joinMeeting', 'Join Meeting')}
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
