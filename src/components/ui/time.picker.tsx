import * as React from 'react';
import { Clock, ChevronDown, Check, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/utils/cn';

export interface TimePickerProps {
  value?: string; // e.g. "09:30 AM" or "14:30"
  onChange?: (time: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  defaultFormat?: '12' | '24';
  stepMinutes?: number;
  className?: string;
  triggerClassName?: string;
  align?: 'start' | 'center' | 'end';
}

function parseHourMinute(timeStr: string): { hour: number; minute: number; period: 'AM' | 'PM' } {
  if (!timeStr) {
    const now = new Date();
    const h = now.getHours();
    return {
      hour: h % 12 === 0 ? 12 : h % 12,
      minute: Math.floor(now.getMinutes() / 15) * 15,
      period: h < 12 ? 'AM' : 'PM',
    };
  }

  const match12 = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (match12) {
    return {
      hour: parseInt(match12[1], 10),
      minute: parseInt(match12[2], 10),
      period: match12[3].toUpperCase() as 'AM' | 'PM',
    };
  }

  const match24 = timeStr.match(/^(\d{1,2}):(\d{2})$/);
  if (match24) {
    const h = parseInt(match24[1], 10);
    return {
      hour: h % 12 === 0 ? 12 : h % 12,
      minute: parseInt(match24[2], 10),
      period: h < 12 ? 'AM' : 'PM',
    };
  }

  return { hour: 9, minute: 0, period: 'AM' };
}

export function TimePicker({
  value = '',
  onChange,
  label,
  placeholder,
  disabled = false,
  defaultFormat = '12',
  stepMinutes = 30,
  className,
  triggerClassName,
  align = 'start',
}: TimePickerProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = React.useState(false);
  const [formatMode, setFormatMode] = React.useState<'12' | '24'>(() => {
    // If value has AM/PM, default to 12
    if (value && /AM|PM/i.test(value)) return '12';
    // If value is 24h format like "14:30", default to 24
    if (value && /^\d{2}:\d{2}$/.test(value)) return '24';
    return defaultFormat;
  });

  const [activePeriod, setActivePeriod] = React.useState<'AM' | 'PM'>(() => {
    return parseHourMinute(value).period;
  });

  // Generate slots for 12H mode based on active period (AM or PM)
  const slots12H = React.useMemo(() => {
    const slots: string[] = [];
    for (let h = 0; h < 12; h++) {
      const displayH = h === 0 ? 12 : h;
      const padH = String(displayH).padStart(2, '0');
      for (let m = 0; m < 60; m += stepMinutes) {
        const padM = String(m).padStart(2, '0');
        slots.push(`${padH}:${padM} ${activePeriod}`);
      }
    }
    return slots;
  }, [activePeriod, stepMinutes]);

  // Generate slots for 24H mode (00:00 to 23:30)
  const slots24H = React.useMemo(() => {
    const slots: string[] = [];
    for (let h = 0; h < 24; h++) {
      const padH = String(h).padStart(2, '0');
      for (let m = 0; m < 60; m += stepMinutes) {
        const padM = String(m).padStart(2, '0');
        slots.push(`${padH}:${padM}`);
      }
    }
    return slots;
  }, [stepMinutes]);

  const handleSelectSlot = (slot: string) => {
    onChange?.(slot);
    setIsOpen(false);
  };

  const handleSelectNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    const now = new Date();
    const hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');

    if (formatMode === '12') {
      const period = hours < 12 ? 'AM' : 'PM';
      const h12 = hours % 12 === 0 ? 12 : hours % 12;
      const formatted = `${String(h12).padStart(2, '0')}:${minutes} ${period}`;
      onChange?.(formatted);
    } else {
      const formatted = `${String(hours).padStart(2, '0')}:${minutes}`;
      onChange?.(formatted);
    }
    setIsOpen(false);
  };

  const displayTime = value || placeholder || '--:--';

  return (
    <div className={cn('relative w-full', className)}>
      {label && (
        <label className="text-xs font-medium text-foreground block mb-1.5 leading-none">
          {label}
        </label>
      )}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild disabled={disabled}>
          <button
            type="button"
            className={cn(
              'group flex h-9 w-full items-center justify-between rounded-lg border border-input bg-background px-3 py-1 text-xs shadow-2xs transition-all duration-150',
              'hover:bg-accent/40 hover:border-accent-foreground/20 focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring',
              isOpen && 'border-primary ring-1 ring-primary/20',
              disabled && 'cursor-not-allowed opacity-50 hover:border-input hover:bg-background',
              triggerClassName
            )}
          >
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <Clock className="h-3.5 w-3.5 shrink-0 text-muted-foreground group-hover:text-foreground transition-colors" />
              <span
                className={cn(
                  'truncate text-xs',
                  value ? 'text-foreground font-medium' : 'text-muted-foreground font-normal'
                )}
              >
                {displayTime}
              </span>
            </div>
            <ChevronDown
              className={cn(
                'h-3.5 w-3.5 opacity-60 group-hover:opacity-100 transition-transform duration-200',
                isOpen && 'rotate-180 text-primary opacity-100'
              )}
            />
          </button>
        </PopoverTrigger>

        <PopoverContent
          align={align}
          sideOffset={8}
          className="w-56 overflow-hidden rounded-2xl border border-border/80 bg-card p-3 shadow-2xl"
        >
          {/* Header: 12H vs 24H Toggle */}
          <div className="flex items-center justify-between gap-1 pb-2.5 border-b border-border/50">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Format
            </span>
            <div className="flex items-center rounded-lg bg-muted p-0.5">
              <button
                type="button"
                onClick={() => setFormatMode('12')}
                className={cn(
                  'px-2 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer',
                  formatMode === '12'
                    ? 'bg-card text-foreground shadow-2xs font-extrabold'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                12 Jam
              </button>
              <button
                type="button"
                onClick={() => setFormatMode('24')}
                className={cn(
                  'px-2 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer',
                  formatMode === '24'
                    ? 'bg-card text-foreground shadow-2xs font-extrabold'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                24 Jam
              </button>
            </div>
          </div>

          {/* If 12H mode: show AM / PM Segment Switch */}
          {formatMode === '12' && (
            <div className="my-2 grid grid-cols-2 gap-1 rounded-xl bg-muted/60 p-1">
              <button
                type="button"
                onClick={() => setActivePeriod('AM')}
                className={cn(
                  'py-1 text-xs font-bold rounded-lg transition-all cursor-pointer text-center',
                  activePeriod === 'AM'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                AM
              </button>
              <button
                type="button"
                onClick={() => setActivePeriod('PM')}
                className={cn(
                  'py-1 text-xs font-bold rounded-lg transition-all cursor-pointer text-center',
                  activePeriod === 'PM'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                PM
              </button>
            </div>
          )}

          {/* Time Slots List */}
          <div className="max-h-52 overflow-y-auto py-1 space-y-0.5 scrollbar-thin">
            {(formatMode === '12' ? slots12H : slots24H).map((slot) => {
              const isSelected = value?.trim().toLowerCase() === slot.trim().toLowerCase();

              return (
                <button
                  key={slot}
                  type="button"
                  onClick={() => handleSelectSlot(slot)}
                  className={cn(
                    'flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors text-left cursor-pointer',
                    isSelected
                      ? 'bg-blue-600 text-white font-semibold shadow-xs'
                      : 'text-foreground hover:bg-muted/70 hover:text-foreground'
                  )}
                >
                  <span className="tabular-nums font-semibold">{slot}</span>
                  {isSelected && <Check className="h-3.5 w-3.5 stroke-[2.5]" />}
                </button>
              );
            })}
          </div>

          {/* Bottom Action: Sekarang / Now */}
          <div className="pt-2 mt-1 border-t border-border/50">
            <button
              type="button"
              onClick={handleSelectNow}
              className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-muted/70 hover:bg-muted text-foreground py-1.5 px-3 text-xs font-semibold transition-all cursor-pointer"
            >
              <Clock className="h-3 w-3 text-primary" />
              <span>{t('datepicker.now', 'Sekarang')}</span>
            </button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
