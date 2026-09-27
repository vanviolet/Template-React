import type { EventInput } from '@fullcalendar/react';

export type CalendarEventTone = 'primary' | 'info' | 'success' | 'warning';

export interface CalendarDemoEvent extends EventInput {
  id: string;
  title: string;
  start: string;
  end: string;
  tone: CalendarEventTone;
}

const eventDefinitions = [
  { id: 'team-sync', title: 'calendar.events.teamSync', dayOffset: 0, hour: 9, minute: 30, tone: 'primary' },
  { id: 'design-review', title: 'calendar.events.designReview', dayOffset: 0, hour: 13, minute: 0, tone: 'info' },
  { id: 'product-planning', title: 'calendar.events.productPlanning', dayOffset: 1, hour: 10, minute: 0, tone: 'success' },
  { id: 'client-meeting', title: 'calendar.events.clientMeeting', dayOffset: 3, hour: 14, minute: 0, tone: 'warning' },
  { id: 'sprint-retro', title: 'calendar.events.sprintRetro', dayOffset: 4, hour: 15, minute: 0, tone: 'primary' },
  { id: 'monthly-demo', title: 'calendar.events.monthlyDemo', dayOffset: 6, hour: 11, minute: 0, tone: 'info' },
  { id: 'release-review', title: 'calendar.events.releaseReview', dayOffset: 9, hour: 16, minute: 0, tone: 'success' },
] as const;

function toLocalDateTime(date: Date) {
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:00`;
}

export function createCalendarDemoEvents(translate: (key: string) => string): CalendarDemoEvent[] {
  const today = new Date();

  return eventDefinitions.map((event) => {
    const start = new Date(today.getFullYear(), today.getMonth(), today.getDate() + event.dayOffset, event.hour, event.minute);
    const end = new Date(start.getTime() + 60 * 60 * 1000);

    return {
      id: event.id,
      title: translate(event.title),
      start: toLocalDateTime(start),
      end: toLocalDateTime(end),
      tone: event.tone,
      classNames: [`fc-event-${event.tone}`],
    };
  });
}
