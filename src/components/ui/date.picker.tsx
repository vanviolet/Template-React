import * as React from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, ChevronDown, X, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  formatDate,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  DATE_FORMATS,
  getDateFnsLocale,
} from '@/utils/date';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/utils/cn';

function toDate(val: Date | string | null | undefined): Date | null {
  if (!val) return null;
  if (val instanceof Date) {
    return isNaN(val.getTime()) ? null : val;
  }
  if (typeof val === 'string') {
    const parsed = new Date(val);
    return isNaN(parsed.getTime()) ? null : parsed;
  }
  return null;
}

export interface DatePickerProps {
  value?: Date | string | null;
  onChange?: (date: Date | null) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  minDate?: Date | string;
  maxDate?: Date | string;
  clearable?: boolean;
  formatStr?: string;
  className?: string;
  triggerClassName?: string;
  align?: 'start' | 'center' | 'end';
}

export function DatePicker({
  value,
  onChange,
  label,
  placeholder,
  disabled = false,
  minDate,
  maxDate,
  clearable = true,
  formatStr = DATE_FORMATS.dot,
  className,
  triggerClassName,
  align = 'start',
}: DatePickerProps) {
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage || 'id';
  const [isOpen, setIsOpen] = React.useState(false);

  const initialDate = React.useMemo(() => toDate(value), [value]);
  const [currentMonth, setCurrentMonth] = React.useState<Date>(() => initialDate || new Date());
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(initialDate);

  // Sync internal state when external value changes
  React.useEffect(() => {
    const valid = toDate(value);
    setSelectedDate(valid);
    if (valid) {
      setCurrentMonth(valid);
    }
  }, [value]);

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentMonth((prev) => subMonths(prev, 1));
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentMonth((prev) => addMonths(prev, 1));
  };

  // Instant date selection: clicking a day selects it and closes the popover
  const handleSelectDay = (day: Date) => {
    setSelectedDate(day);
    onChange?.(day);
    setIsOpen(false);
  };

  // "Now / Hari Ini" button selects today immediately
  const handleSelectToday = (e: React.MouseEvent) => {
    e.stopPropagation();
    const today = new Date();
    setSelectedDate(today);
    setCurrentMonth(today);
    onChange?.(today);
    setIsOpen(false);
  };

  // "Clear / Hapus" button clears the selected date
  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedDate(null);
    onChange?.(null);
    setIsOpen(false);
  };

  // Month change from select
  const safeMonth = React.useMemo(() => {
    return currentMonth instanceof Date && !isNaN(currentMonth.getTime())
      ? currentMonth
      : new Date();
  }, [currentMonth]);

  const handleMonthSelect = (monthIndex: number) => {
    const updated = new Date(safeMonth);
    updated.setMonth(monthIndex);
    setCurrentMonth(updated);
  };

  // Year change from select
  const handleYearSelect = (year: number) => {
    const updated = new Date(safeMonth);
    updated.setFullYear(year);
    setCurrentMonth(updated);
  };

  // Calendar days calculation
  const monthStart = startOfMonth(safeMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  // Weekday abbreviations
  const localeObj = getDateFnsLocale(lang);
  const weekDays = React.useMemo(() => {
    const sampleWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(sampleWeekStart);
      d.setDate(d.getDate() + i);
      const name = localeObj.localize?.day(d.getDay(), { width: 'narrow' }) || '';
      return { index: i, name };
    });
  }, [localeObj]);

  // Generate Month list
  const monthOptions = React.useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const d = new Date(2026, i, 1);
      const label = localeObj.localize?.month(i, { width: 'wide' }) || formatDate(d, 'MMMM', lang);
      return { value: i, label };
    });
  }, [localeObj, lang]);

  // Generate Year list: 2020 through 2035
  const yearOptions = React.useMemo(() => {
    const currentYr = new Date().getFullYear();
    const startYr = currentYr - 8;
    const endYr = currentYr + 10;
    const years: number[] = [];
    for (let y = startYr; y <= endYr; y++) {
      years.push(y);
    }
    return years;
  }, []);

  const displayLabel = label ?? t('datepicker.selectDay', 'Select a day');
  const displayPlaceholder = placeholder ?? t('datepicker.placeholder', 'DD.MM.YYYY');

  return (
    <div className={cn('relative inline-block w-full max-w-xs', className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild disabled={disabled}>
          <button
            type="button"
            className={cn(
              'group relative flex w-full flex-col justify-center rounded-xl border border-input bg-card px-3.5 py-2 text-left shadow-xs transition-all duration-150 outline-none cursor-pointer select-none',
              'hover:border-primary/50 hover:bg-accent/20 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20',
              isOpen && 'border-primary ring-2 ring-primary/20 shadow-sm',
              disabled && 'cursor-not-allowed opacity-50 hover:border-input hover:bg-card',
              triggerClassName
            )}
          >
            {/* Top tiny label - positioned cleanly inside with no overflow */}
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground group-hover:text-primary transition-colors block truncate leading-tight">
              {displayLabel}
            </span>

            {/* Input row */}
            <div className="mt-1 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <CalendarIcon className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
                <span
                  className={cn(
                    'truncate text-sm font-semibold tracking-tight',
                    value ? 'text-foreground' : 'text-muted-foreground'
                  )}
                >
                  {value ? formatDate(value, formatStr, lang) : displayPlaceholder}
                </span>
              </div>

              <div className="flex items-center gap-1">
                {clearable && value && !disabled && (
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={handleRemove}
                    onKeyDown={(e) => e.key === 'Enter' && handleRemove(e as unknown as React.MouseEvent)}
                    className="rounded-full p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                    title={t('datepicker.remove', 'Remove')}
                  >
                    <X className="h-3 w-3" />
                  </span>
                )}
                <ChevronDown
                  className={cn(
                    'h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200',
                    isOpen && 'rotate-180 text-primary'
                  )}
                />
              </div>
            </div>
          </button>
        </PopoverTrigger>

        <PopoverContent
          align={align}
          sideOffset={8}
          className="w-80 rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-2xl"
        >
          {/* Calendar Header with Month & Year Selectors */}
          <div className="flex items-center justify-between gap-1 pb-3 border-b border-border/50">
            {/* Month & Year Autocomplete / Dropdown Selectors */}
            <div className="flex items-center gap-1.5 min-w-0">
              {/* Month Select */}
              <div className="relative">
                <select
                  value={safeMonth.getMonth()}
                  onChange={(e) => handleMonthSelect(Number(e.target.value))}
                  className="appearance-none bg-muted/60 hover:bg-muted font-bold text-xs text-foreground rounded-lg pl-2 pr-6 py-1.5 cursor-pointer outline-none border border-border/60 transition-colors capitalize focus:ring-1 focus:ring-primary"
                >
                  {monthOptions.map((opt) => (
                    <option key={opt.value} value={opt.value} className="bg-popover text-foreground capitalize">
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
              </div>

              {/* Year Select */}
              <div className="relative">
                <select
                  value={safeMonth.getFullYear()}
                  onChange={(e) => handleYearSelect(Number(e.target.value))}
                  className="appearance-none bg-muted/60 hover:bg-muted font-bold text-xs text-foreground rounded-lg pl-2 pr-6 py-1.5 cursor-pointer outline-none border border-border/60 transition-colors focus:ring-1 focus:ring-primary"
                >
                  {yearOptions.map((yr) => (
                    <option key={yr} value={yr} className="bg-popover text-foreground">
                      {yr}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
              </div>
            </div>

            {/* Prev & Next Month arrow buttons */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={handlePrevMonth}
                aria-label="Previous month"
                className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground active:scale-95 transition-all cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                aria-label="Next month"
                className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground active:scale-95 transition-all cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Weekday headers: M T W T F S S */}
          <div className="grid grid-cols-7 gap-1 text-center py-2.5">
            {weekDays.map((day) => (
              <span
                key={day.index}
                className="text-[11px] font-bold text-muted-foreground uppercase"
              >
                {day.name}
              </span>
            ))}
          </div>

          {/* Days Grid - every day has cursor-pointer and instant select */}
          <div className="grid grid-cols-7 gap-y-1.5 gap-x-1 py-1">
            {calendarDays.map((day, idx) => {
              const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
              const isCurrentMonth = isSameMonth(day, currentMonth);
              const isTodayDate = isToday(day);
              const isDisabled =
                (minDate && day < minDate) || (maxDate && day > maxDate);

              return (
                <div key={idx} className="flex items-center justify-center">
                  <button
                    type="button"
                    disabled={isDisabled}
                    onClick={() => handleSelectDay(day)}
                    className={cn(
                      'relative flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium transition-all duration-150 cursor-pointer select-none',
                      // Not in current month
                      !isCurrentMonth && 'text-muted-foreground/35',
                      // In current month
                      isCurrentMonth && !isSelected && 'text-foreground hover:bg-muted hover:text-foreground hover:scale-105',
                      // Today not selected
                      isTodayDate && !isSelected && 'text-primary font-bold hover:bg-primary/10 ring-1 ring-primary/40',
                      // Selected state: vibrant blue circle with soft glow
                      isSelected &&
                        'bg-blue-600 text-white font-semibold shadow-md shadow-blue-500/35 hover:bg-blue-600 scale-105',
                      // Disabled state
                      isDisabled && 'opacity-25 cursor-not-allowed hover:bg-transparent'
                    )}
                  >
                    {day.getDate()}
                    {isTodayDate && !isSelected && (
                      <span className="absolute bottom-1 h-1 w-1 rounded-full bg-primary" />
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Bottom Actions: Clear / Hapus & Now / Hari Ini */}
          <div className="mt-3 flex items-center justify-between pt-3 border-t border-border/50 gap-2">
            <button
              type="button"
              onClick={handleRemove}
              className="flex-1 rounded-xl bg-muted/80 hover:bg-muted text-muted-foreground hover:text-foreground py-2 px-3 text-xs font-semibold tracking-wide transition-all active:scale-98 text-center cursor-pointer"
            >
              {t('datepicker.remove', 'Remove')}
            </button>
            <button
              type="button"
              onClick={handleSelectToday}
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 text-xs font-semibold tracking-wide transition-all shadow-md shadow-blue-500/25 active:scale-98 text-center cursor-pointer"
            >
              <Clock className="h-3.5 w-3.5" />
              <span>{t('datepicker.now', 'Now')}</span>
            </button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
