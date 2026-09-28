import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Clock, MapPin, Video, Calendar as CalendarIcon } from 'lucide-react';
import type { CalendarDemoEvent } from './events';
import { formatDate, DATE_FORMATS } from '@/utils/date';
import { cn } from '@/utils/cn';

interface CalendarAgendaProps {
  date: Date;
  events: CalendarDemoEvent[];
  onSelectEvent?: (event: CalendarDemoEvent) => void;
}

export function CalendarAgenda({ date, events, onSelectEvent }: CalendarAgendaProps) {
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage || 'id';

  const dateLabel = formatDate(date, DATE_FORMATS.long, lang);

  return (
    <aside className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-xs">
      <div className="border-b border-border/80 pb-3">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          <CalendarIcon className="h-3.5 w-3.5 text-primary" />
          <span>{t('calendar.agenda', 'Agenda')}</span>
        </div>
        <h2 className="mt-1 text-sm font-bold capitalize tracking-tight text-foreground truncate">
          {dateLabel}
        </h2>
      </div>

      {events.length ? (
        <ul className="divide-y divide-border/60">
          {events.map((event) => {
            const startDate = new Date(event.start);
            const endDate = new Date(event.end);
            const timeRange = event.allDay
              ? t('timepicker.allDay', 'All day')
              : `${formatDate(startDate, 'hh:mm a', lang)} - ${formatDate(endDate, 'hh:mm a', lang)}`;

            return (
              <li
                key={event.id}
                onClick={() => onSelectEvent?.(event)}
                className="group flex cursor-pointer gap-3 py-3 transition-colors hover:bg-muted/40 rounded-lg px-2 -mx-2"
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    'mt-1 h-2.5 w-2.5 shrink-0 rounded-full',
                    event.tone === 'amber'
                      ? 'bg-amber-500'
                      : event.tone === 'success'
                      ? 'bg-emerald-500'
                      : event.tone === 'purple'
                      ? 'bg-purple-500'
                      : 'bg-blue-500'
                  )}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                    {event.title}
                  </p>
                  <div className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {timeRange}
                    </span>
                    {event.location && (
                      <span className="flex items-center gap-1 truncate">
                        {event.location.toLowerCase().includes('zoom') ? (
                          <Video className="h-3 w-3 text-blue-500" />
                        ) : (
                          <MapPin className="h-3 w-3" />
                        )}
                        <span className="truncate">{event.location}</span>
                      </span>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="py-8 text-center text-xs leading-relaxed text-muted-foreground">
          <CalendarIcon className="mx-auto h-8 w-8 stroke-1 text-muted-foreground/50 mb-2" />
          <p>{t('calendar.emptyDay', 'There are no events on this date.')}</p>
        </div>
      )}
    </aside>
  );
}
