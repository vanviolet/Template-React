import { useMemo, useState } from 'react';
import type { DateClickInfo, EventClickInfo } from '@fullcalendar/react';
import { useTranslation } from 'react-i18next';
import { FullCalendar } from '@/components/ui/fullcalendar';
import { CalendarAgenda } from './agenda';
import { createCalendarDemoEvents } from './events';

function sameLocalDate(left: Date, right: Date) {
  return left.getFullYear() === right.getFullYear()
    && left.getMonth() === right.getMonth()
    && left.getDate() === right.getDate();
}

export default function CalendarView() {
  const { t, i18n } = useTranslation();
  const locale = i18n.resolvedLanguage?.startsWith('en') ? 'en' : 'id';
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const events = useMemo(() => createCalendarDemoEvents((key) => t(key)), [t]);
  const selectedEvents = events.filter((event) => sameLocalDate(new Date(event.start), selectedDate));

  const handleDateClick = (info: DateClickInfo) => setSelectedDate(info.date);
  const handleEventClick = (info: EventClickInfo) => {
    if (info.event.start) setSelectedDate(info.event.start);
  };

  return (
    <div className="space-y-5">
      <header className="border-b border-border pb-4">
        <h1 className="text-xl font-bold tracking-tight text-foreground">{t('calendar.title')}</h1>
        <p className="mt-1 text-xs text-muted-foreground">{t('calendar.description')}</p>
      </header>

      <div className="grid min-w-0 grid-cols-1 items-start gap-4 xl:grid-cols-[minmax(0,1fr)_18rem]">
        <section
          aria-label={t('calendar.title')}
          className="min-w-0 rounded-xl border border-border bg-card p-3 sm:p-5"
        >
          <FullCalendar
            locale={locale}
            events={events}
            dateClick={handleDateClick}
            eventClick={handleEventClick}
            dayCellClassNames={(info) => (
              sameLocalDate(info.date, selectedDate) ? ['fc-day-selected'] : []
            )}
            headerToolbar={{
              left: 'today prev,next',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
            }}
          />
        </section>

        <CalendarAgenda date={selectedDate} events={selectedEvents} locale={locale} />
      </div>
    </div>
  );
}
