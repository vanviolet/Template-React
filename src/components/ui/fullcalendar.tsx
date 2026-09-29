import * as React from 'react';
import type { ComponentProps } from 'react';
import CalendarComponent from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/react/daygrid';
import timeGridPlugin from '@fullcalendar/react/timegrid';
import listPlugin from '@fullcalendar/react/list';
import interactionPlugin from '@fullcalendar/react/interaction';
import classicPlugin from '@fullcalendar/react/themes/classic';
import idLocale from '@fullcalendar/react/locales/id';

import '@fullcalendar/react/skeleton.css';
import '@fullcalendar/react/themes/classic/theme.css';
import '@fullcalendar/react/themes/classic/palette.css';
import './fullcalendar.css';

import type { CalendarDemoEvent, CalendarEventTone } from '@/views/calendar/events';
import { cn } from '@/utils/cn';

const plugins = [
  dayGridPlugin,
  timeGridPlugin,
  listPlugin,
  interactionPlugin,
  classicPlugin,
];

export type FullCalendarProps = Omit<
  ComponentProps<typeof CalendarComponent>,
  'plugins' | 'locales' | 'locale'
> & {
  locale?: 'id' | 'en';
  wrapperClassName?: string;
  onCalendarReady?: (api: any) => void;
};

// Elegant, ultra-clean tone styling matching modern SaaS & Fullcalendar2.jpg
const TONE_CLASSES: Record<
  CalendarEventTone,
  {
    card: string;
    dot: string;
    sub: string;
  }
> = {
  primary: {
    // Soft Blue (Meetings, Reviews, Team Syncs)
    card: 'bg-blue-50/95 text-blue-950 border border-blue-200/70 shadow-2xs hover:bg-blue-100/70 hover:border-blue-300/80 dark:bg-blue-950/50 dark:text-blue-100 dark:border-blue-900/60',
    dot: 'bg-blue-500 dark:bg-blue-400',
    sub: 'text-blue-600/90 dark:text-blue-300/80',
  },
  amber: {
    // Warm Peach / Apricot (Workshops, Keynotes)
    card: 'bg-amber-50/95 text-amber-950 border border-amber-200/70 shadow-2xs hover:bg-amber-100/70 hover:border-amber-300/80 dark:bg-amber-950/50 dark:text-amber-100 dark:border-amber-900/60',
    dot: 'bg-amber-500 dark:bg-amber-400',
    sub: 'text-amber-700/90 dark:text-amber-300/80',
  },
  info: {
    // Clean Slate / Neutral (Brainstorming, 1-on-1s)
    card: 'bg-slate-50/95 text-slate-800 border border-slate-200/80 shadow-2xs hover:bg-slate-100/80 hover:border-slate-300/80 dark:bg-slate-900/60 dark:text-slate-100 dark:border-slate-800/70',
    dot: 'bg-slate-400 dark:bg-slate-400',
    sub: 'text-slate-500 dark:text-slate-400',
  },
  purple: {
    // Soft Lilac / Violet (Summit, Strategy)
    card: 'bg-purple-50/95 text-purple-950 border border-purple-200/70 shadow-2xs hover:bg-purple-100/70 hover:border-purple-300/80 dark:bg-purple-950/50 dark:text-purple-100 dark:border-purple-900/60',
    dot: 'bg-purple-500 dark:bg-purple-400',
    sub: 'text-purple-600/90 dark:text-purple-300/80',
  },
  success: {
    // Soft Mint / Emerald (Holidays, Wellness)
    card: 'bg-emerald-50/95 text-emerald-950 border border-emerald-200/70 shadow-2xs hover:bg-emerald-100/70 hover:border-emerald-300/80 dark:bg-emerald-950/50 dark:text-emerald-100 dark:border-emerald-900/60',
    dot: 'bg-emerald-500 dark:bg-emerald-400',
    sub: 'text-emerald-600/90 dark:text-emerald-300/80',
  },
  warning: {
    // Soft Warm Yellow (Urgent, Conflicted)
    card: 'bg-yellow-50/95 text-yellow-950 border border-yellow-200/70 shadow-2xs hover:bg-yellow-100/70 hover:border-yellow-300/80 dark:bg-yellow-950/50 dark:text-yellow-100 dark:border-yellow-900/60',
    dot: 'bg-yellow-500 dark:bg-yellow-400',
    sub: 'text-yellow-700/90 dark:text-yellow-300/80',
  },
};

// Pure memoized Event Card Renderer for high performance without lag
const EventCard = React.memo(({ eventInfo }: { eventInfo: any }) => {
  const event = eventInfo.event;
  const extendedProps = (event.extendedProps || {}) as Partial<CalendarDemoEvent>;
  const toneKey: CalendarEventTone = (extendedProps.tone as CalendarEventTone) || 'primary';
  const tone = TONE_CLASSES[toneKey] || TONE_CLASSES.primary;
  const viewType = eventInfo.view?.type;

  const timeText = eventInfo.timeText;
  const title = event.title || '';
  const location = extendedProps.location;
  const attendeeCount = extendedProps.attendeeCount;
  const participants = extendedProps.participants || [];
  const isMultiDay = extendedProps.isMultiDay || event.allDay;

  // Tooltip content for instant full information without clipping
  const tooltipText = `${title}\n${timeText ? `⏰ ${timeText}` : ''}${
    location ? `\n📍 ${location}` : ''
  }${extendedProps.description ? `\nℹ️ ${extendedProps.description}` : ''}`;

  // 1. DayGrid Month View: Compact soft pill card
  if (viewType === 'dayGridMonth') {
    return (
      <div
        title={tooltipText}
        className={cn(
          'group flex w-full items-center gap-1.5 px-2 py-0.5 text-[11px] font-medium leading-tight rounded-md cursor-pointer transition-all hover:shadow-xs hover:scale-[1.005]',
          tone.card
        )}
      >
        <span className={cn('h-1.5 w-1.5 shrink-0 rounded-full', tone.dot)} />
        {timeText && <span className={cn('text-[10px] font-semibold shrink-0', tone.sub)}>{timeText}</span>}
        <span className="truncate">{title}</span>
      </div>
    );
  }

  // 2. Multi-Day / All-Day Event in TimeGrid Header
  if (event.allDay || isMultiDay) {
    return (
      <div
        title={tooltipText}
        className={cn(
          'group flex w-full items-center justify-between px-2.5 py-1 text-xs font-semibold leading-tight rounded-lg cursor-pointer transition-all hover:shadow-xs hover:scale-[1.003]',
          tone.card
        )}
      >
        <div className="flex items-center gap-1.5 min-w-0">
          <span className={cn('h-2 w-2 shrink-0 rounded-full', tone.dot)} />
          <span className="truncate font-semibold tracking-tight">{title}</span>
        </div>
        {location && (
          <span className={cn('ml-2 text-[10px] font-medium shrink-0 truncate hidden sm:inline opacity-85', tone.sub)}>
            {location}
          </span>
        )}
      </div>
    );
  }

  // 3. Timed Event in TimeGrid view (Week / Day)
  const startMs = event.start ? new Date(event.start).getTime() : 0;
  const endMs = event.end ? new Date(event.end).getTime() : 0;
  const durationMin = endMs > startMs ? Math.round((endMs - startMs) / 60000) : 60;

  const isShort = durationMin <= 35; // e.g. 30 min (Brainstorming Session, Project Review)
  const isMedium = durationMin > 35 && durationMin <= 60; // 45-60 min
  const isLarge = durationMin > 60; // 90 min - 2h (Weekly Team Meeting, Sales Training, Workshop)

  // Short layout (<= 35 mins): Clean, balanced, never clipped
  if (isShort) {
    return (
      <div
        title={tooltipText}
        className={cn(
          'flex h-full w-full flex-col justify-center px-2 py-1 text-left leading-tight rounded-lg cursor-pointer overflow-hidden transition-all hover:shadow-xs',
          tone.card
        )}
      >
        <div className="flex items-center gap-1.5 min-w-0">
          <span className={cn('h-1.5 w-1.5 shrink-0 rounded-full', tone.dot)} />
          <h4 className="text-[11px] font-semibold tracking-tight truncate leading-tight">
            {title}
          </h4>
        </div>
        {timeText && (
          <p className={cn('text-[10px] font-medium truncate mt-0.5 pl-3', tone.sub)}>
            {timeText}
          </p>
        )}
      </div>
    );
  }

  // Medium layout (40 - 60 mins): Clean 2-line title + time
  if (isMedium) {
    return (
      <div
        title={tooltipText}
        className={cn(
          'flex h-full w-full flex-col justify-between p-2 text-left leading-tight rounded-xl cursor-pointer overflow-hidden transition-all hover:shadow-xs',
          tone.card
        )}
      >
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 min-w-0 mb-0.5">
            <span className={cn('h-1.5 w-1.5 shrink-0 rounded-full', tone.dot)} />
            <h4 className="text-xs font-semibold tracking-tight truncate leading-tight">
              {title}
            </h4>
          </div>
          {timeText && (
            <p className={cn('text-[10px] font-medium truncate pl-3', tone.sub)}>
              {timeText}
            </p>
          )}
        </div>

        {location && (
          <p className={cn('mt-auto pt-1 text-[9px] font-medium opacity-80 truncate border-t border-current/10', tone.sub)}>
            {location}
          </p>
        )}
      </div>
    );
  }

  // Large layout (> 60 mins): Modern SaaS card with avatars & location matching Fullcalendar2.jpg
  return (
    <div
      title={tooltipText}
      className={cn(
        'flex h-full w-full flex-col justify-between p-2.5 text-left leading-tight rounded-xl cursor-pointer overflow-hidden transition-all hover:shadow-xs',
        tone.card
      )}
    >
      <div className="min-w-0">
        <h4 className="text-xs font-semibold tracking-tight line-clamp-2 leading-snug">
          {title}
        </h4>
        {timeText && (
          <p className={cn('mt-0.5 text-[10px] font-medium truncate', tone.sub)}>
            {timeText}
          </p>
        )}
      </div>

      {/* Bottom Card Footer: Avatars stack & Platform / Location */}
      {(participants.length > 0 || attendeeCount || location) && (
        <div className="mt-auto pt-1.5 flex items-center justify-between gap-1 border-t border-current/10 text-[10px] min-w-0">
          {/* Avatars Stack */}
          {participants.length > 0 ? (
            <div className="flex items-center -space-x-1.5 shrink-0">
              {participants.slice(0, 2).map((p, i) => (
                <div
                  key={i}
                  title={p.name}
                  className="flex h-4.5 w-4.5 items-center justify-center rounded-full bg-card ring-1 ring-background text-[8px] font-bold text-foreground overflow-hidden shadow-2xs"
                >
                  {p.initials || p.name.charAt(0)}
                </div>
              ))}
              {attendeeCount && attendeeCount > 2 && (
                <span className="flex h-4.5 min-w-4.5 px-1 items-center justify-center rounded-full bg-card/95 ring-1 ring-background text-[8px] font-bold text-foreground shadow-2xs">
                  +{attendeeCount - 2}
                </span>
              )}
            </div>
          ) : <div />}

          {/* Location Tag */}
          {location && (
            <span className={cn('truncate text-[9px] font-medium opacity-85 ml-1', tone.sub)}>
              {location}
            </span>
          )}
        </div>
      )}
    </div>
  );
});

EventCard.displayName = 'EventCard';

export const FullCalendar = React.forwardRef<CalendarComponent, FullCalendarProps>(
  ({ locale = 'id', wrapperClassName, eventContent, ...props }, ref) => {
    // Memoized custom event renderer to eliminate re-rendering lag
    const defaultEventContent = React.useCallback(
      (eventInfo: any) => <EventCard eventInfo={eventInfo} />,
      []
    );

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
          nowIndicator={false} /* Disabled to keep clean, minimal aesthetic without red lines */
          slotMinTime="08:00:00"
          slotMaxTime="20:00:00"
          slotDuration="00:30:00"
          allDaySlot={true}
          allDayText="ALL-DAY"
          slotEventOverlap={true}
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
