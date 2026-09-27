import { useTranslation } from 'react-i18next';
import type { CalendarDemoEvent } from './events';

interface CalendarAgendaProps {
  date: Date;
  events: CalendarDemoEvent[];
  locale: 'id' | 'en';
}

export function CalendarAgenda({ date, events, locale }: CalendarAgendaProps) {
  const { t } = useTranslation();
  const languageTag = locale === 'en' ? 'en-US' : 'id-ID';
  const dateLabel = new Intl.DateTimeFormat(languageTag, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(date);

  return (
    <aside className="h-fit rounded-xl border border-border bg-card p-4 sm:p-5">
      <div className="border-b border-border pb-4">
        <p className="text-xs font-medium text-muted-foreground">{t('calendar.agenda')}</p>
        <h2 className="mt-1 text-sm font-semibold text-foreground">
          {t('calendar.selectedDate', { date: dateLabel })}
        </h2>
      </div>

      {events.length ? (
        <ul className="divide-y divide-border">
          {events.map((event) => (
            <li key={event.id} className="flex gap-3 py-3.5 last:pb-0">
              <span
                aria-hidden="true"
                className={`calendar-agenda-dot-${event.tone} mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full`}
              />
              <div className="min-w-0">
                <p className="truncate text-xs font-medium text-foreground">{event.title}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {new Intl.DateTimeFormat(languageTag, {
                    hour: 'numeric',
                    minute: '2-digit',
                  }).format(new Date(event.start))}
                </p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="py-5 text-xs leading-relaxed text-muted-foreground">{t('calendar.emptyDay')}</p>
      )}
    </aside>
  );
}
