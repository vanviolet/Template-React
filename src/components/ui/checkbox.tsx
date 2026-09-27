import * as React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked = false, onCheckedChange, disabled, ...props }, ref) => {
    return (
      <label className="inline-flex items-center justify-center cursor-pointer select-none">
        <input
          type="checkbox"
          ref={ref}
          checked={checked}
          disabled={disabled}
          onChange={(e) => onCheckedChange?.(e.target.checked)}
          className="sr-only peer"
          {...props}
        />
        <span
          className={cn(
            'h-4 w-4 shrink-0 rounded-xs border border-input transition-all flex items-center justify-center',
            'peer-focus-visible:ring-1 peer-focus-visible:ring-ring',
            'peer-checked:bg-primary peer-checked:text-primary-foreground peer-checked:border-primary',
            'peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
            className
          )}
        >
          {checked && <Check className="h-3 w-3 stroke-[3]" />}
        </span>
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';
