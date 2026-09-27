import * as React from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  error?: boolean;
}

export function Select({
  options,
  value,
  onChange,
  placeholder = 'Pilih...',
  className,
  disabled = false,
  error = false,
}: SelectProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={containerRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          'flex h-9 w-full items-center justify-between rounded-lg border border-input bg-background px-3 py-1 text-xs shadow-2xs transition-colors focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer',
          error && 'border-destructive focus:ring-destructive',
          className
        )}
      >
        <span className={cn('truncate', !selectedOption && 'text-muted-foreground')}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={cn('h-3.5 w-3.5 shrink-0 opacity-50 transition-transform duration-200', isOpen && 'rotate-180')} />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-80">
          {options.length === 0 ? (
            <div className="py-2 text-center text-xs text-muted-foreground">Tidak ada pilihan</div>
          ) : (
            options.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange?.(opt.value);
                    setIsOpen(false);
                  }}
                  className={cn(
                    'relative flex w-full cursor-pointer select-none items-center rounded-md px-2 py-1.5 text-xs outline-none transition-colors hover:bg-accent hover:text-accent-foreground justify-between',
                    isSelected && 'bg-accent/60 font-medium text-foreground'
                  )}
                >
                  <span className="truncate">{opt.label}</span>
                  {isSelected && <Check className="h-3.5 w-3.5 shrink-0 text-primary" />}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
