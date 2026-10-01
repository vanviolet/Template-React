import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { DatePicker } from '@/components/ui/date.picker';
import { TimePicker } from '@/components/ui/time.picker';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/utils/cn';
import { setHours, setMinutes, parseDate, formatDate, DATE_FORMATS } from '@/utils/date';

export interface DateTimePickerProps {
  value?: Date | string | null;
  onChange?: (date: Date | null) => void;
  dateLabel?: string;
  timeLabel?: string;
  disabled?: boolean;
  clearable?: boolean;
  className?: string;
  align?: 'start' | 'center' | 'end';
}

/**
 * Single DateTimePicker that lets the user choose a Date and a Time,
 * emitting a unified JavaScript Date object.
 */
export function DateTimePicker({
  value,
  onChange,
  dateLabel,
  timeLabel,
  disabled = false,
  clearable = true,
  className,
  align = 'start',
}: DateTimePickerProps) {
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage || 'id';

  const dateValue = React.useMemo(() => {
    if (!value) return null;
    if (value instanceof Date) return isNaN(value.getTime()) ? null : value;
    if (typeof value === 'string') {
      const parsed = new Date(value);
      return isNaN(parsed.getTime()) ? null : parsed;
    }
    return null;
  }, [value]);

  // Parse current hour/minute from Date
  const currentTimeString = React.useMemo(() => {
    if (!dateValue) return '';
    return formatDate(dateValue, 'hh:mm a', lang);
  }, [dateValue, lang]);

  const handleDateChange = (newDate: Date | null) => {
    if (!newDate) {
      onChange?.(null);
      return;
    }
    // Retain existing hour and minute if value existed
    if (dateValue) {
      const merged = new Date(newDate);
      merged.setHours(dateValue.getHours(), dateValue.getMinutes(), 0, 0);
      onChange?.(merged);
    } else {
      // Default to 09:00 AM
      const merged = new Date(newDate);
      merged.setHours(9, 0, 0, 0);
      onChange?.(merged);
    }
  };

  const handleTimeChange = (timeStr: string) => {
    // If no date currently selected, default to today
    const baseDate = value ? new Date(value) : new Date();

    // Parse time string e.g. "09:30 AM" or "14:30"
    let hours = 0;
    let minutes = 0;

    const match12 = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (match12) {
      let h = parseInt(match12[1], 10);
      const m = parseInt(match12[2], 10);
      const meridian = match12[3].toUpperCase();
      if (meridian === 'PM' && h < 12) h += 12;
      if (meridian === 'AM' && h === 12) h = 0;
      hours = h;
      minutes = m;
    } else {
      const match24 = timeStr.match(/^(\d{1,2}):(\d{2})$/);
      if (match24) {
        hours = parseInt(match24[1], 10);
        minutes = parseInt(match24[2], 10);
      }
    }

    const updated = setMinutes(setHours(baseDate, hours), minutes);
    onChange?.(updated);
  };

  return (
    <div className={cn('grid grid-cols-1 sm:grid-cols-2 gap-3', className)}>
      <DatePicker
        value={value}
        onChange={handleDateChange}
        label={dateLabel ?? t('datepicker.selectDay', 'Select a day')}
        disabled={disabled}
        clearable={clearable}
        align={align}
        className="w-full max-w-none"
      />
      <TimePicker
        value={currentTimeString}
        onChange={handleTimeChange}
        label={timeLabel ?? t('timepicker.startWith', 'Start with')}
        disabled={disabled || !value}
        align={align}
        className="w-full max-w-none"
      />
    </div>
  );
}

export interface ScheduleRangeValue {
  date: Date | null;
  startTime: string;
  endTime: string;
  isAllDay: boolean;
}

export interface ScheduleRangePickerProps {
  value: ScheduleRangeValue;
  onChange: (value: ScheduleRangeValue) => void;
  disabled?: boolean;
  className?: string;
}

/**
 * ScheduleRangePicker replicating the exact right-side widget from `datepicker.jpg`:
 * - "Select a day" [27.09.2021 v]
 * - "Start with" [00:00 AM v]  "End with" [ v]
 * - "All day" checkbox
 */
export function ScheduleRangePicker({
  value,
  onChange,
  disabled = false,
  className,
}: ScheduleRangePickerProps) {
  const { t } = useTranslation();

  const handleDateChange = (date: Date | null) => {
    onChange({ ...value, date });
  };

  const handleStartTimeChange = (startTime: string) => {
    onChange({ ...value, startTime });
  };

  const handleEndTimeChange = (endTime: string) => {
    onChange({ ...value, endTime });
  };

  const handleAllDayChange = (checked: boolean) => {
    onChange({ ...value, isAllDay: checked });
  };

  return (
    <div className={cn('space-y-3.5', className)}>
      {/* Top: Select a day */}
      <DatePicker
        value={value.date}
        onChange={handleDateChange}
        label={t('datepicker.selectDay', 'Select a day')}
        placeholder="DD.MM.YYYY"
        formatStr={DATE_FORMATS.dot}
        disabled={disabled}
        className="w-full max-w-none"
      />

      {/* Second row: Start with & End with */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <TimePicker
          value={value.startTime}
          onChange={handleStartTimeChange}
          label={t('timepicker.startWith', 'Start with')}
          placeholder="00:00 AM"
          disabled={disabled || value.isAllDay}
          use12Hours={true}
          className="w-full max-w-none"
        />

        <TimePicker
          value={value.endTime}
          onChange={handleEndTimeChange}
          label={t('timepicker.endWith', 'End with')}
          placeholder="00:00 AM"
          disabled={disabled || value.isAllDay}
          use12Hours={true}
          className="w-full max-w-none"
        />
      </div>

      {/* All day checkbox */}
      <div className="flex items-center space-x-2 pt-1">
        <Checkbox
          id="all-day-checkbox"
          checked={value.isAllDay}
          onCheckedChange={(checked) => handleAllDayChange(Boolean(checked))}
          disabled={disabled}
        />
        <label
          htmlFor="all-day-checkbox"
          className="text-xs font-medium text-foreground cursor-pointer select-none"
        >
          {t('timepicker.allDay', 'All day')}
        </label>
      </div>
    </div>
  );
}
