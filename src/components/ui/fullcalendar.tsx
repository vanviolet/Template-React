import type { ComponentProps } from 'react';
import CalendarComponent from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/react/daygrid';
import timeGridPlugin from '@fullcalendar/react/timegrid';
import listPlugin from '@fullcalendar/react/list';
import interactionPlugin from '@fullcalendar/react/interaction';
import monarchThemePlugin from '@fullcalendar/react/themes/monarch';
import idLocale from '@fullcalendar/react/locales/id';
import '@fullcalendar/react/skeleton.css';
import '@fullcalendar/react/themes/monarch/theme.css';
import '@fullcalendar/react/themes/monarch/palettes/purple.css';
import './fullcalendar.css';

const plugins = [monarchThemePlugin, dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin];

export type FullCalendarProps = Omit<
  ComponentProps<typeof CalendarComponent>,
  'plugins' | 'locales' | 'locale'
> & {
  locale?: 'id' | 'en';
  wrapperClassName?: string;
};

export function FullCalendar({ locale = 'id', wrapperClassName, ...props }: FullCalendarProps) {
  return (
    <div className={['calendar-shell', wrapperClassName].filter(Boolean).join(' ')}>
      <CalendarComponent
        plugins={plugins}
        locales={[idLocale]}
        locale={locale}
        initialView="dayGridMonth"
        height="auto"
        fixedWeekCount={false}
        dayMaxEvents={3}
        navLinks
        {...props}
      />
    </div>
  );
}
