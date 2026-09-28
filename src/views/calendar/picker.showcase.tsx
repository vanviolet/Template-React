import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar as CalendarIcon, Clock, Sparkles } from 'lucide-react';
import { DatePicker } from '@/components/ui/date.picker';
import { TimePicker } from '@/components/ui/time.picker';
import { DateTimePicker, ScheduleRangePicker, type ScheduleRangeValue } from '@/components/ui/date.time.picker';
import {
  formatDate,
  formatDateTime,
  formatDistance,
  formatRelativeTime,
  DATE_FORMATS,
  addDays,
  subDays,
} from '@/utils/date';

export function PickerShowcase() {
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage || 'id';

  // State 1: Standalone Date Picker
  const [singleDate, setSingleDate] = React.useState<Date | null>(() => new Date(2021, 8, 27)); // 27.09.2021 as in screenshot

  // State 2: Standalone Time Picker
  const [singleTime, setSingleTime] = React.useState('09:30 AM');

  // State 3: Combined DateTimePicker
  const [dateTimeValue, setDateTimeValue] = React.useState<Date | null>(() => new Date());

  // State 4: ScheduleRangePicker exactly matching right side of datepicker.jpg
  const [scheduleValue, setScheduleValue] = React.useState<ScheduleRangeValue>({
    date: new Date(2021, 8, 27),
    startTime: '00:00 AM',
    endTime: '01:30 AM',
    isAllDay: false,
  });

  return (
    <div className="space-y-6 rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-border/70 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-blue-500" />
            <h2 className="text-base font-bold text-foreground tracking-tight">
              Date & Time Picker Component
            </h2>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Komponen interaktif DatePicker & TimePicker sesuai desain referensi (termasuk kalkulasi date-fns).
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card 1: Standalone DatePicker matching datepicker.jpg left */}
        <div className="rounded-xl border border-border/70 bg-muted/20 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-foreground">
              1. Standalone Date Picker
            </span>
            <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold text-blue-600 dark:text-blue-400">
              datepicker.jpg
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Pop-up kalender modern dengan pemilihan hari, indikator tanggal hari ini, tombol Remove dan Done.
          </p>

          <DatePicker
            value={singleDate}
            onChange={setSingleDate}
            label={t('datepicker.selectDay', 'Select a day')}
            placeholder="27.09.2021"
            formatStr={DATE_FORMATS.dot}
          />

          <div className="rounded-lg bg-card p-2.5 text-[11px] border border-border/60 space-y-1">
            <div className="text-muted-foreground">Nilai terpilih:</div>
            <div className="font-semibold text-foreground">
              {singleDate ? formatDate(singleDate, DATE_FORMATS.long, lang) : '-'}
            </div>
            <div className="text-[10px] text-muted-foreground font-mono">
              Dot: {singleDate ? formatDate(singleDate, DATE_FORMATS.dot, lang) : '-'} | ISO:{' '}
              {singleDate ? formatDate(singleDate, DATE_FORMATS.iso, lang) : '-'}
            </div>
          </div>
        </div>

        {/* Card 2: Date + Time Picker (Single Value) */}
        <div className="rounded-xl border border-border/70 bg-muted/20 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-foreground">
              2. Date & Time Picker
            </span>
            <span className="rounded-full bg-purple-500/10 px-2 py-0.5 text-[10px] font-semibold text-purple-600 dark:text-purple-400">
              Single Value
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Menggabungkan DatePicker dan TimePicker ke dalam satu objek Date JavaScript utuh.
          </p>

          <DateTimePicker
            value={dateTimeValue}
            onChange={setDateTimeValue}
            dateLabel={t('datepicker.selectDay', 'Select a day')}
            timeLabel={t('timepicker.selectTime', 'Select time')}
          />

          <div className="rounded-lg bg-card p-2.5 text-[11px] border border-border/60 space-y-1">
            <div className="text-muted-foreground">Format Output:</div>
            <div className="font-semibold text-foreground">
              {dateTimeValue ? formatDateTime(dateTimeValue, DATE_FORMATS.dateTimeShort12, lang) : '-'}
            </div>
            <div className="text-[10px] text-muted-foreground font-mono">
              Relative: {dateTimeValue ? formatDistance(dateTimeValue, lang) : '-'}
            </div>
          </div>
        </div>

        {/* Card 3: Schedule Range Picker matching datepicker.jpg right */}
        <div className="rounded-xl border border-border/70 bg-muted/20 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-foreground">
              3. Schedule / Event Range
            </span>
            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
              Start & End Time
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Persis seperti sisi kanan gambar: Select day, Start with, End with, dan opsi All day.
          </p>

          <ScheduleRangePicker
            value={scheduleValue}
            onChange={setScheduleValue}
          />

          <div className="rounded-lg bg-card p-2.5 text-[11px] border border-border/60 space-y-1">
            <div className="text-muted-foreground">Jadwal:</div>
            <div className="font-semibold text-foreground">
              {scheduleValue.date ? formatDate(scheduleValue.date, DATE_FORMATS.short, lang) : '-'}
              {' • '}
              {scheduleValue.isAllDay
                ? t('timepicker.allDay', 'All day')
                : `${scheduleValue.startTime || '--'} s/d ${scheduleValue.endTime || '--'}`}
            </div>
          </div>
        </div>
      </div>

      {/* Global date-fns utility features banner */}
      <div className="rounded-xl border border-border/70 bg-muted/10 p-4">
        <h3 className="text-xs font-bold text-foreground mb-2 flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5 text-primary" />
          Global date-fns Utilities (`src/utils/date.ts`)
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="rounded-lg bg-card p-2 border border-border/50">
            <span className="text-[10px] text-muted-foreground block">formatDate (long)</span>
            <span className="font-semibold capitalize text-[11px] truncate block">
              {formatDate(new Date(), DATE_FORMATS.long, lang)}
            </span>
          </div>
          <div className="rounded-lg bg-card p-2 border border-border/50">
            <span className="text-[10px] text-muted-foreground block">formatDate (dot)</span>
            <span className="font-semibold text-[11px] font-mono block">
              {formatDate(new Date(), DATE_FORMATS.dot, lang)}
            </span>
          </div>
          <div className="rounded-lg bg-card p-2 border border-border/50">
            <span className="text-[10px] text-muted-foreground block">formatRelative (Yesterday)</span>
            <span className="font-semibold capitalize text-[11px] truncate block">
              {formatRelativeTime(subDays(new Date(), 1), new Date(), lang)}
            </span>
          </div>
          <div className="rounded-lg bg-card p-2 border border-border/50">
            <span className="text-[10px] text-muted-foreground block">formatDistance (In 3 days)</span>
            <span className="font-semibold text-[11px] truncate block">
              {formatDistance(addDays(new Date(), 3), lang)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
