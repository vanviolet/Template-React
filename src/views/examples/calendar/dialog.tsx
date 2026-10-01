import * as React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Combobox } from '@/components/ui/combobox';
import { ScheduleRangePicker, type ScheduleRangeValue } from '@/components/ui/date.time.picker';
import type { CalendarDemoEvent, CalendarCategory, CalendarEventTone } from './events';
import { formatDate, DATE_FORMATS } from '@/utils/date';
import { Video, MapPin, Users, Trash2, Calendar as CalendarIcon, Clock } from 'lucide-react';

interface EventFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialDate?: Date;
  onSave: (event: CalendarDemoEvent) => void;
}

export function CreateEventDialog({
  open,
  onOpenChange,
  initialDate,
  onSave,
}: EventFormDialogProps) {
  const { t } = useTranslation();

  const [title, setTitle] = React.useState('');
  const [category, setCategory] = React.useState<CalendarCategory>('meetings');
  const [location, setLocation] = React.useState('on Zoom');
  const [schedule, setSchedule] = React.useState<ScheduleRangeValue>({
    date: initialDate || new Date(),
    startTime: '09:00 AM',
    endTime: '10:00 AM',
    isAllDay: false,
  });

  React.useEffect(() => {
    if (open) {
      setTitle('');
      setCategory('meetings');
      setLocation('on Zoom');
      setSchedule({
        date: initialDate || new Date(),
        startTime: '09:00 AM',
        endTime: '10:00 AM',
        isAllDay: false,
      });
    }
  }, [open, initialDate]);

  const categoryOptions = [
    { label: t('calendar.meetings', 'Meetings'), value: 'meetings' },
    { label: t('calendar.eventsTab', 'Events'), value: 'events' },
    { label: t('calendar.holidays', 'Holidays'), value: 'holidays' },
    { label: t('calendar.timeOff', 'Time Off'), value: 'timeoff' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !schedule.date) return;

    const baseDate = schedule.date;
    const pad = (n: number) => String(n).padStart(2, '0');
    const datePrefix = `${baseDate.getFullYear()}-${pad(baseDate.getMonth() + 1)}-${pad(baseDate.getDate())}`;

    // Helper to convert "09:00 AM" to "09:00:00"
    const convertTo24 = (timeStr: string) => {
      const match = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
      if (match) {
        let h = parseInt(match[1], 10);
        const m = match[2];
        const meridian = match[3].toUpperCase();
        if (meridian === 'PM' && h < 12) h += 12;
        if (meridian === 'AM' && h === 12) h = 0;
        return `${pad(h)}:${m}:00`;
      }
      return '09:00:00';
    };

    const startIso = schedule.isAllDay
      ? `${datePrefix}T00:00:00`
      : `${datePrefix}T${convertTo24(schedule.startTime)}`;
    const endIso = schedule.isAllDay
      ? `${datePrefix}T23:59:59`
      : `${datePrefix}T${convertTo24(schedule.endTime)}`;

    const toneMap: Record<CalendarCategory, CalendarEventTone> = {
      all: 'primary',
      meetings: 'primary',
      events: 'amber',
      holidays: 'success',
      timeoff: 'info',
    };

    const newEvent: CalendarDemoEvent = {
      id: `custom-event-${Date.now()}`,
      title: title.trim(),
      start: startIso,
      end: endIso,
      category: category === 'all' ? 'meetings' : category,
      tone: toneMap[category],
      location: location.trim(),
      allDay: schedule.isAllDay,
      attendeeCount: 3,
      participants: [
        { name: 'You', initials: 'ME' },
        { name: 'Colleague', initials: 'CL' },
      ],
      classNames: [`fc-event-${toneMap[category]}`],
    };

    onSave(newEvent);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-6">
        <DialogHeader>
          <DialogTitle className="text-base font-bold text-foreground">
            {t('calendar.addEventTitle', 'Create New Schedule')}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {t('calendar.description')}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Title */}
          <div>
            <label className="text-xs font-semibold text-foreground">
              {t('calendar.eventTitle', 'Event Title')}
            </label>
            <Input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Design Sync / Product Demo"
              className="mt-1"
            />
          </div>

          {/* Category */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-foreground">
                {t('calendar.eventCategory', 'Category')}
              </label>
              <div className="mt-1">
                <Combobox
                  options={categoryOptions}
                  value={category}
                  onChange={(val) => setCategory(val as CalendarCategory)}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground">
                {t('calendar.eventLocation', 'Location / Platform')}
              </label>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. on Zoom, Room A"
                className="mt-1"
              />
            </div>
          </div>

          {/* Schedule Range: Date + Start Time + End Time + All Day matching datepicker.jpg */}
          <div>
            <label className="text-xs font-semibold text-foreground mb-2 block">
              {t('calendar.agenda', 'Schedule & Time')}
            </label>
            <div className="rounded-xl border border-border/80 bg-muted/20 p-3">
              <ScheduleRangePicker value={schedule} onChange={setSchedule} />
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {t('common.cancel', 'Cancel')}
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
              {t('common.save', 'Save')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface EventDetailDialogProps {
  event: CalendarDemoEvent | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete?: (id: string) => void;
}

export function EventDetailDialog({
  event,
  open,
  onOpenChange,
  onDelete,
}: EventDetailDialogProps) {
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage || 'id';

  if (!event) return null;

  const startDate = new Date(event.start);
  const endDate = new Date(event.end);
  const formattedDate = formatDate(startDate, DATE_FORMATS.long, lang);
  const formattedTime = event.allDay
    ? t('timepicker.allDay', 'All day')
    : `${formatDate(startDate, 'hh:mm a', lang)} - ${formatDate(endDate, 'hh:mm a', lang)}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-6">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                event.tone === 'amber'
                  ? 'bg-amber-500'
                  : event.tone === 'success'
                  ? 'bg-emerald-500'
                  : event.tone === 'purple'
                  ? 'bg-purple-500'
                  : 'bg-blue-500'
              }`}
            />
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              {t(`calendar.${event.category === 'meetings' ? 'meetings' : event.category === 'events' ? 'eventsTab' : 'holidays'}`, event.category)}
            </span>
          </div>
          <DialogTitle className="text-lg font-bold text-foreground tracking-tight">
            {event.title}
          </DialogTitle>
          {event.description && (
            <DialogDescription className="text-xs text-muted-foreground pt-1">
              {event.description}
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="space-y-3 py-3 text-xs border-y border-border">
          <div className="flex items-center gap-2.5 text-foreground">
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{formattedDate}</span>
          </div>

          <div className="flex items-center gap-2.5 text-foreground">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{formattedTime}</span>
          </div>

          {event.location && (
            <div className="flex items-center gap-2.5 text-foreground">
              {event.location.toLowerCase().includes('zoom') || event.location.toLowerCase().includes('meet') ? (
                <Video className="h-4 w-4 text-blue-500" />
              ) : (
                <MapPin className="h-4 w-4 text-muted-foreground" />
              )}
              <span className="font-medium">{event.location}</span>
            </div>
          )}

          {event.participants && event.participants.length > 0 && (
            <div className="flex items-center gap-2.5 text-foreground">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>
                {event.participants.map((p) => p.name).join(', ')}
                {event.attendeeCount && event.attendeeCount > event.participants.length && (
                  <span className="ml-1 text-muted-foreground font-semibold">
                    (+{event.attendeeCount - event.participants.length} more)
                  </span>
                )}
              </span>
            </div>
          )}
        </div>

        <DialogFooter className="flex items-center justify-between sm:justify-between pt-2">
          {onDelete ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                onDelete(event.id);
                onOpenChange(false);
              }}
              className="text-destructive hover:bg-destructive/10 border-destructive/30"
            >
              <Trash2 className="h-3.5 w-3.5 mr-1" />
              {t('calendar.deleteEvent', 'Delete Event')}
            </Button>
          ) : (
            <div />
          )}

          {event.meetingUrl ? (
            <a
              href={event.meetingUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 shadow-sm"
            >
              <Video className="h-3.5 w-3.5 mr-1.5" />
              {t('calendar.joinMeeting', 'Join Meeting')}
            </a>
          ) : (
            <Button type="button" onClick={() => onOpenChange(false)}>
              {t('datepicker.done', 'Done')}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
