import * as React from 'react';
import type { ComponentProps } from 'react';
import CalendarComponent from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/react/daygrid';
import timeGridPlugin from '@fullcalendar/react/timegrid';
import listPlugin from '@fullcalendar/react/list';
import interactionPlugin from '@fullcalendar/react/interaction';
import idLocale from '@fullcalendar/react/locales/id';
import '@fullcalendar/react/skeleton.css';
import './fullcalendar.css';
import type { CalendarDemoEvent } from '@/views/calendar/events';
import { cn } from '@/utils/cn';

const plugins = [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin];

export type FullCalendarProps = Omit<
  ComponentProps<typeof CalendarComponent>,
  'plugins' | 'locales' | 'locale'
> & {
  locale?: 'id' | 'en';
  wrapperClassName?: string;
  onCalendarReady?: (api: any) => void;
};

export const FullCalendar = React.forwardRef<CalendarComponent, FullCalendarProps>(
  ({ locale = 'id', wrapperClassName, eventContent, ...props }, ref) => {
    // Custom event renderer matching Fullcalendar2.jpg floating SaaS cards
    const defaultEventContent = (eventInfo: any) => {
      const event = eventInfo.event;
      const extendedProps = event.extendedProps as Partial<CalendarDemoEvent>;
      const viewType = eventInfo.view.type;

      const timeText = eventInfo.timeText;
      const title = event.title;
      const location = extendedProps.location;
      const attendeeCount = extendedProps.attendeeCount;
      const participants = extendedProps.participants || [];
      const isMultiDay = extendedProps.isMultiDay || event.allDay;

      // Day grid month view (compact pill card)
      if (viewType === 'dayGridMonth') {
        return (
          <div className="flex w-full items-center gap-1.5 px-2 py-1 text-[11px] font-semibold leading-tight truncate rounded-lg cursor-pointer">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-80" />
            {timeText && <span className="text-[10px] font-bold opacity-75">{timeText}</span>}
            <span className="truncate">{title}</span>
          </div>
        );
      }

      // Multi-Day / All-Day event in TimeGrid header
      if (event.allDay || isMultiDay) {
        return (
          <div className="flex w-full items-center justify-between px-2.5 py-1 text-xs font-semibold leading-tight rounded-lg cursor-pointer shadow-xs">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="h-2 w-2 shrink-0 rounded-full bg-current opacity-80" />
              <span className="truncate font-bold tracking-tight">{title}</span>
            </div>
            {location && (
              <span className="ml-2 text-[10px] font-medium opacity-80 shrink-0 truncate hidden sm:inline">
                {location}
              </span>
            )}
          </div>
        );
      }

      // Timed Event in TimeGrid view (Week / Day) - exact card aesthetic in Fullcalendar2.jpg
      return (
        <div className="flex h-full w-full flex-col justify-between p-2.5 text-left leading-tight rounded-xl cursor-pointer overflow-hidden">
          <div className="min-w-0">
            <h4 className="text-xs font-bold tracking-tight text-inherit line-clamp-2">
              {title}
            </h4>
            {timeText && (
              <p className="mt-0.5 text-[10px] font-semibold opacity-85">{timeText}</p>
            )}
          </div>

          {/* Bottom Card Footer: Avatars stack & Platform / Location */}
          {(participants.length > 0 || attendeeCount || location) && (
            <div className="mt-1.5 flex items-center justify-between gap-1 pt-1 border-t border-current/15 text-[10px]">
              {/* Avatars Stack matching Fullcalendar2.jpg */}
              <div className="flex items-center -space-x-1.5">
                {participants.slice(0, 2).map((p, i) => (
                  <div
                    key={i}
                    title={p.name}
                    className="flex h-4.5 w-4.5 items-center justify-center rounded-full bg-card ring-1.5 ring-background text-[8px] font-extrabold text-foreground overflow-hidden shadow-2xs"
                  >
                    {p.initials || p.name.charAt(0)}
                  </div>
                ))}
                {attendeeCount && attendeeCount > 2 && (
                  <span className="flex h-4.5 min-w-4.5 px-1 items-center justify-center rounded-full bg-card/95 ring-1.5 ring-background text-[8px] font-extrabold text-foreground shadow-2xs">
                    +{attendeeCount - 2}
                  </span>
                )}
              </div>

              {/* Location Tag */}
              {location && (
                <span className="truncate text-[9px] font-semibold opacity-80">
                  {location}
                </span>
              )}
            </div>
          )}
        </div>
      );
    };

    return (
      <div className={cn('calendar-shell', wrapperClassName)}>
        <CalendarComponent
          ref={ref}
          plugins={plugins}
          locales={[idLocale]}
          locale={locale}
          initialView="timeGridWeek"
          height="auto"
          fixedWeekCount={false}
          dayMaxEvents={3}
          navLinks
          nowIndicator
          slotMinTime="08:00:00"
          slotMaxTime="20:00:00"
          slotDuration="00:30:00"
          allDaySlot={true}
          allDayText="ALL-DAY"
          dayHeaderFormat={{
            day: '2-digit',
            weekday: 'short',
            omitCommas: true,
          }}
          slotLabelFormat={{
            hour: 'numeric',
            meridiem: 'short',
            hour12: true,
          }}
          eventContent={eventContent || defaultEventContent}
          {...props}
        />
      </div>
    );
  }
);

FullCalendar.displayName = 'FullCalendar';
