import * as React from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date.picker';
import { Combobox } from '@/components/ui/combobox';
import { formatDate, addDays, DATE_FORMATS } from '@/utils/date';

interface CalendarToolbarProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  currentView: string;
  onViewChange: (view: string) => void;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  onOpenCreate: () => void;
  meetingCount: number;
  eventCount: number;
}

export function CalendarToolbar({
  currentDate,
  onDateChange,
  currentView,
  onViewChange,
  onPrev,
  onNext,
  onToday,
  onOpenCreate,
  meetingCount,
  eventCount,
}: CalendarToolbarProps) {
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage || 'id';

  // Compute 7-day range label for the date picker trigger button
  const endRange = addDays(currentDate, 6);
  const rangeDisplay = `${formatDate(currentDate, 'MMM dd', lang)} - ${formatDate(endRange, 'MMM dd yyyy', lang)}`;
  const todayHeader = formatDate(currentDate, 'MMMM dd, yyyy', lang);

  const viewOptions = [
    { label: t('calendar.views.week', 'Week'), value: 'timeGridWeek' },
    { label: t('calendar.views.day', 'Day'), value: 'timeGridDay' },
    { label: t('calendar.views.month', 'Month'), value: 'dayGridMonth' },
    { label: t('calendar.views.list', 'List'), value: 'listWeek' },
  ];

  return (
    <div className="space-y-4">
      {/* Top Header: Date display + Dynamic summary matching Fullcalendar2.jpg */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-border/80 bg-primary/10 text-primary shadow-xs">
            <CalendarIcon className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground capitalize">
              {todayHeader}
            </h1>
            <p className="text-xs font-medium text-muted-foreground mt-0.5">
              {t('calendar.todaySummary', {
                meetings: meetingCount,
                events: eventCount,
                defaultValue: `You have ${meetingCount} meetings and ${eventCount} events scheduled.`,
              })}
            </p>
          </div>
        </div>

        {/* Create Event Button */}
        <Button
          onClick={onOpenCreate}
          className="self-start sm:self-auto rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/25 px-4 font-semibold text-xs h-10 cursor-pointer"
        >
          <Plus className="h-4 w-4 mr-1.5 stroke-[2.5]" />
          {t('calendar.addEvent', 'New Event')}
        </Button>
      </div>

      {/* Action Row: Today, View Selector, DatePicker Trigger, Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        {/* Left: Quick controls with matching height */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Today Button */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onToday}
            className="h-11 rounded-xl px-4 text-xs font-bold hover:bg-accent/60 cursor-pointer"
          >
            {t('datepicker.today', 'Today')}
          </Button>

          {/* View Mode Selector */}
          <div className="w-32">
            <Combobox
              options={viewOptions}
              value={currentView}
              onChange={onViewChange}
              className="h-11 rounded-xl text-xs font-semibold cursor-pointer"
            />
          </div>

          {/* Date Picker Component with proper comfortable padding and height */}
          <div className="w-64">
            <DatePicker
              value={currentDate}
              onChange={(newDate) => {
                if (newDate) onDateChange(newDate);
              }}
              label={rangeDisplay}
              placeholder={formatDate(currentDate, DATE_FORMATS.dot, lang)}
              triggerClassName="min-h-[44px] py-1.5 px-3.5"
              clearable={false}
            />
          </div>
        </div>

        {/* Right: Prev & Next buttons */}
        <div className="flex items-center gap-1 bg-card border border-border/80 rounded-xl p-1 shadow-2xs">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onPrev}
            aria-label="Previous"
            className="h-9 w-9 p-0 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onNext}
            aria-label="Next"
            className="h-9 w-9 p-0 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
