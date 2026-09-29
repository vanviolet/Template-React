import * as React from 'react';
import type CalendarComponent from '@fullcalendar/react';
import type { DateClickInfo, EventClickInfo } from '@fullcalendar/react';
import { useTranslation } from 'react-i18next';
import { FullCalendar } from '@/components/ui/fullcalendar';
import { CalendarAgenda } from './agenda';
import { CalendarToolbar } from './toolbar';
import { FilterTabs } from './filter.tabs';
import { HighlightCards } from './highlight.cards';
import { CreateEventDialog, EventDetailDialog } from './dialog';
import { PickerShowcase } from './picker.showcase';
import {
  createCalendarDemoEvents,
  type CalendarDemoEvent,
  type CalendarCategory,
} from './events';
import { isSameDay } from '@/utils/date';

export default function CalendarView() {
  const { t, i18n } = useTranslation();
  const locale = i18n.resolvedLanguage?.startsWith('en') ? 'en' : 'id';

  const calendarRef = React.useRef<CalendarComponent>(null);

  // Active dates and views
  const [currentDate, setCurrentDate] = React.useState<Date>(() => new Date());
  const [currentView, setCurrentView] = React.useState<string>('timeGridWeek');
  const [selectedCategory, setSelectedCategory] = React.useState<CalendarCategory>('all');

  // Events dataset
  const [events, setEvents] = React.useState<CalendarDemoEvent[]>(() =>
    createCalendarDemoEvents((key) => t(key))
  );

  // Dialog states
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [createInitialDate, setCreateInitialDate] = React.useState<Date>(new Date());
  const [activeEvent, setActiveEvent] = React.useState<CalendarDemoEvent | null>(null);
  const [isDetailOpen, setIsDetailOpen] = React.useState(false);

  // Sync calendar with external controls (memoized to eliminate lag)
  const handleDateChange = React.useCallback((date: Date) => {
    setCurrentDate(date);
    const api = calendarRef.current?.getApi();
    if (api) {
      api.gotoDate(date);
    }
  }, []);

  const handleViewChange = React.useCallback((view: string) => {
    setCurrentView(view);
    const api = calendarRef.current?.getApi();
    if (api) {
      api.changeView(view);
    }
  }, []);

  const handlePrev = React.useCallback(() => {
    const api = calendarRef.current?.getApi();
    if (api) {
      api.prev();
      setCurrentDate(api.getDate());
    }
  }, []);

  const handleNext = React.useCallback(() => {
    const api = calendarRef.current?.getApi();
    if (api) {
      api.next();
      setCurrentDate(api.getDate());
    }
  }, []);

  const handleToday = React.useCallback(() => {
    const today = new Date();
    setCurrentDate(today);
    const api = calendarRef.current?.getApi();
    if (api) {
      api.today();
    }
  }, []);

  // FullCalendar event & date click handlers (memoized)
  const handleDateClick = React.useCallback((info: DateClickInfo) => {
    setCurrentDate(info.date);
    setCreateInitialDate(info.date);
    setIsCreateOpen(true);
  }, []);

  const handleEventClick = React.useCallback((info: EventClickInfo) => {
    const eventId = info.event.id;
    setEvents((currentEvents) => {
      const found = currentEvents.find((e) => e.id === eventId);
      if (found) {
        setActiveEvent(found);
        setIsDetailOpen(true);
        setCurrentDate(new Date(found.start));
      }
      return currentEvents;
    });
  }, []);

  const handleSelectEventFromRibbon = React.useCallback((event: CalendarDemoEvent) => {
    setActiveEvent(event);
    setIsDetailOpen(true);
    setCurrentDate(new Date(event.start));
    calendarRef.current?.getApi()?.gotoDate(new Date(event.start));
  }, []);

  const handleAddEvent = React.useCallback((newEvent: CalendarDemoEvent) => {
    setEvents((prev) => [newEvent, ...prev]);
  }, []);

  const handleDeleteEvent = React.useCallback((id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  }, []);

  // Filter events according to selected tab
  const filteredEvents = React.useMemo(() => {
    if (selectedCategory === 'all') return events;
    return events.filter((e) => e.category === selectedCategory);
  }, [events, selectedCategory]);

  // Counts for tabs
  const counts = React.useMemo(() => {
    return {
      all: events.length,
      meetings: events.filter((e) => e.category === 'meetings').length,
      events: events.filter((e) => e.category === 'events').length,
      holidays: events.filter((e) => e.category === 'holidays').length,
      timeoff: events.filter((e) => e.category === 'timeoff').length,
    };
  }, [events]);

  // Today's summary counts
  const todaySummary = React.useMemo(() => {
    const today = new Date();
    const todayEvents = events.filter((e) => isSameDay(new Date(e.start), today));
    return {
      meetings: todayEvents.filter((e) => e.category === 'meetings').length,
      events: todayEvents.filter((e) => e.category !== 'meetings').length,
    };
  }, [events]);

  // Agenda events for currently selected date
  const agendaEvents = React.useMemo(() => {
    return events.filter((e) => isSameDay(new Date(e.start), currentDate));
  }, [events, currentDate]);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Toolbar matching Fullcalendar2.jpg */}
      <CalendarToolbar
        currentDate={currentDate}
        onDateChange={handleDateChange}
        currentView={currentView}
        onViewChange={handleViewChange}
        onPrev={handlePrev}
        onNext={handleNext}
        onToday={handleToday}
        onOpenCreate={() => {
          setCreateInitialDate(currentDate);
          setIsCreateOpen(true);
        }}
        meetingCount={todaySummary.meetings}
        eventCount={todaySummary.events}
      />

      {/* Filter Tabs matching Fullcalendar2.jpg: All Scheduled, Meetings, Events, Holidays, Time Off */}
      <FilterTabs
        selected={selectedCategory}
        onSelect={setSelectedCategory}
        counts={counts}
      />

      {/* Top Highlight Cards Banner: Weekly Team Meeting (Today / Join), Product Launch Event (Conflicted) */}
      <HighlightCards
        events={events}
        onSelectEvent={handleSelectEventFromRibbon}
      />

      {/* Main Calendar Grid & Agenda Sidebar */}
      <div className="grid min-w-0 grid-cols-1 items-start gap-4 xl:grid-cols-[minmax(0,1fr)_19rem]">
        {/* FullCalendar Card */}
        <section
          aria-label={t('calendar.title')}
          className="min-w-0 rounded-2xl border border-border/90 bg-card p-3 sm:p-5 shadow-xs transition-shadow"
        >
          <FullCalendar
            ref={calendarRef}
            locale={locale}
            events={filteredEvents}
            dateClick={handleDateClick}
            eventClick={handleEventClick}
            headerToolbar={false}
          />
        </section>

        {/* Agenda for Selected Date */}
        <CalendarAgenda
          date={currentDate}
          events={agendaEvents}
          onSelectEvent={handleSelectEventFromRibbon}
        />
      </div>

      {/* Interactive DatePicker & DateTimePicker Showcase */}
      <div className="pt-2">
        <PickerShowcase />
      </div>

      {/* Modals for Create and Detail */}
      <CreateEventDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        initialDate={createInitialDate}
        onSave={handleAddEvent}
      />

      <EventDetailDialog
        event={activeEvent}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        onDelete={handleDeleteEvent}
      />
    </div>
  );
}
