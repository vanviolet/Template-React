import * as React from 'react';
import { Check, AlertCircle, LucideIcon } from 'lucide-react';
import { cn } from '@/utils/cn';

export type StepState = 'complete' | 'active' | 'upcoming' | 'error';

export interface StepItem {
  id?: string | number;
  title?: string;
  subtitle?: string;
  description?: string;
  icon?: LucideIcon;
  optional?: boolean;
  disabled?: boolean;
  status?: StepState;
}

export interface StepperProps {
  steps: StepItem[];
  currentStep: number; // 0-indexed
  orientation?: 'vertical' | 'horizontal';
  showLabels?: boolean;
  clickable?: boolean;
  onStepClick?: (stepIndex: number) => void;
  size?: 'sm' | 'default' | 'lg';
  variant?: 'double-ring' | 'solid' | 'minimal';
  className?: string;
  itemClassName?: string;
}

export function Stepper({
  steps,
  currentStep,
  orientation = 'vertical',
  showLabels = false,
  clickable = false,
  onStepClick,
  size = 'default',
  variant = 'double-ring',
  className,
  itemClassName,
}: StepperProps) {
  const isVertical = orientation === 'vertical';

  const sizeClasses = {
    sm: {
      node: 'h-7 w-7 text-xs',
      icon: 'h-3.5 w-3.5',
      lineVert: 'w-0.5 min-h-6 my-1',
    },
    default: {
      node: 'h-9 w-9 text-xs',
      icon: 'h-4 w-4',
      lineVert: 'w-0.5 min-h-8 sm:min-h-10 my-1.5',
    },
    lg: {
      node: 'h-11 w-11 text-sm',
      icon: 'h-5 w-5',
      lineVert: 'w-0.5 min-h-12 sm:min-h-14 my-2',
    },
  }[size];

  const getStepStatus = (index: number, step: StepItem): StepState => {
    if (step.status) return step.status;
    if (index < currentStep) return 'complete';
    if (index === currentStep) return 'active';
    return 'upcoming';
  };

  return (
    <nav
      aria-label="Progress Stepper"
      className={cn('relative w-full select-none', className)}
    >
      <ol
        className={cn(
          isVertical ? 'flex flex-col w-full' : 'flex items-start w-full justify-between'
        )}
      >
        {steps.map((step, index) => {
          const status = getStepStatus(index, step);
          const isComplete = status === 'complete';
          const isActive = status === 'active';
          const isError = status === 'error';
          const isUpcoming = status === 'upcoming';
          const isLast = index === steps.length - 1;

          const isNodeClickable =
            clickable && !step.disabled && (isComplete || index <= currentStep || Boolean(onStepClick));

          const IconComponent = step.icon;

          // ========================
          // VERTICAL ORIENTATION
          // ========================
          if (isVertical) {
            return (
              <li
                key={step.id ?? index}
                className={cn('relative flex items-start w-full group', itemClassName)}
              >
                {/* Vertical Rail: Node centered directly above the connector line */}
                <div className="flex flex-col items-center shrink-0">
                  <button
                    type="button"
                    disabled={!isNodeClickable}
                    onClick={() => isNodeClickable && onStepClick?.(index)}
                    className={cn(
                      'relative flex items-center justify-center shrink-0 rounded-full font-semibold transition-all duration-200 outline-none',
                      sizeClasses.node,
                      isNodeClickable
                        ? 'cursor-pointer hover:scale-105 active:scale-95'
                        : 'cursor-default',

                      // Active State (Clean double-ring, no clipped overflow)
                      isActive &&
                        (variant === 'double-ring'
                          ? 'text-primary bg-background ring-2 ring-primary ring-offset-2 ring-offset-background shadow-md shadow-primary/20 font-bold'
                          : 'bg-primary text-primary-foreground shadow-md shadow-primary/30 ring-2 ring-primary font-bold'),

                      // Complete State
                      isComplete &&
                        'bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20 dark:bg-primary/20',

                      // Upcoming State
                      isUpcoming &&
                        'bg-muted/70 text-muted-foreground/80 border border-border/80 hover:border-border',

                      // Error State
                      isError &&
                        'bg-destructive/10 text-destructive border border-destructive/40 ring-2 ring-destructive/20'
                    )}
                    aria-current={isActive ? 'step' : undefined}
                  >
                    {isError ? (
                      <AlertCircle className={cn(sizeClasses.icon, 'text-destructive')} />
                    ) : isComplete ? (
                      <Check className={cn(sizeClasses.icon, 'text-primary stroke-[2.5]')} />
                    ) : IconComponent ? (
                      <IconComponent className={sizeClasses.icon} />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </button>

                  {/* Centered Vertical Connector Line */}
                  {!isLast && (
                    <div
                      className={cn(
                        'transition-colors duration-300 rounded-full shrink-0',
                        sizeClasses.lineVert,
                        index < currentStep ? 'bg-primary' : 'bg-border/80'
                      )}
                      aria-hidden="true"
                    />
                  )}
                </div>

                {/* Optional Title & Description labels */}
                {showLabels && (step.title || step.description) && (
                  <div
                    onClick={() => isNodeClickable && onStepClick?.(index)}
                    className={cn(
                      'ml-3 sm:ml-3.5 text-left pt-1 pb-4 flex-1 min-w-0 transition-colors',
                      isNodeClickable && 'cursor-pointer'
                    )}
                  >
                    {step.subtitle && (
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block truncate">
                        {step.subtitle}
                      </span>
                    )}
                    {step.title && (
                      <div
                        className={cn(
                          'text-xs sm:text-sm font-semibold leading-snug tracking-tight truncate',
                          isActive && 'text-primary font-bold',
                          isComplete && 'text-foreground',
                          isUpcoming && 'text-muted-foreground'
                        )}
                      >
                        {step.title}
                        {step.optional && (
                          <span className="ml-1 text-[10px] font-normal text-muted-foreground">
                            (Opsional)
                          </span>
                        )}
                      </div>
                    )}
                    {step.description && (
                      <p className="text-[11px] text-muted-foreground leading-normal line-clamp-2 mt-0.5">
                        {step.description}
                      </p>
                    )}
                  </div>
                )}
              </li>
            );
          }

          // ========================
          // HORIZONTAL ORIENTATION
          // ========================
          // Clean layout: Line segments on left & right of each circle, labels placed neatly UNDERNEATH the circle
          return (
            <li
              key={step.id ?? index}
              className={cn(
                'relative flex-1 flex flex-col items-center min-w-0 group',
                itemClassName
              )}
            >
              {/* Row with Connector Lines & Node Circle */}
              <div className="flex items-center w-full">
                {/* Left Line Segment */}
                <div
                  className={cn(
                    'h-0.5 flex-1 transition-colors duration-300 rounded-l-full',
                    index === 0
                      ? 'invisible'
                      : index <= currentStep
                      ? 'bg-primary'
                      : 'bg-border/80'
                  )}
                  aria-hidden="true"
                />

                {/* Node Circle */}
                <button
                  type="button"
                  disabled={!isNodeClickable}
                  onClick={() => isNodeClickable && onStepClick?.(index)}
                  className={cn(
                    'relative flex items-center justify-center shrink-0 rounded-full font-semibold transition-all duration-200 outline-none z-10 mx-1',
                    sizeClasses.node,
                    isNodeClickable
                      ? 'cursor-pointer hover:scale-105 active:scale-95'
                      : 'cursor-default',

                    // Active State (Clean double ring, no clipping)
                    isActive &&
                      (variant === 'double-ring'
                        ? 'text-primary bg-background ring-2 ring-primary ring-offset-2 ring-offset-background shadow-md shadow-primary/20 font-bold'
                        : 'bg-primary text-primary-foreground shadow-md shadow-primary/30 ring-2 ring-primary font-bold'),

                    // Complete State
                    isComplete &&
                      'bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20 dark:bg-primary/20',

                    // Upcoming State
                    isUpcoming &&
                      'bg-muted/70 text-muted-foreground/80 border border-border/80 hover:border-border',

                    // Error State
                    isError &&
                      'bg-destructive/10 text-destructive border border-destructive/40 ring-2 ring-destructive/20'
                  )}
                  aria-current={isActive ? 'step' : undefined}
                >
                  {isError ? (
                    <AlertCircle className={cn(sizeClasses.icon, 'text-destructive')} />
                  ) : isComplete ? (
                    <Check className={cn(sizeClasses.icon, 'text-primary stroke-[2.5]')} />
                  ) : IconComponent ? (
                    <IconComponent className={sizeClasses.icon} />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </button>

                {/* Right Line Segment */}
                <div
                  className={cn(
                    'h-0.5 flex-1 transition-colors duration-300 rounded-r-full',
                    isLast
                      ? 'invisible'
                      : index < currentStep
                      ? 'bg-primary'
                      : 'bg-border/80'
                  )}
                  aria-hidden="true"
                />
              </div>

              {/* Labels placed UNDERNEATH the circle node */}
              {showLabels && (step.title || step.subtitle) && (
                <div
                  onClick={() => isNodeClickable && onStepClick?.(index)}
                  className={cn(
                    'mt-2 text-center w-full px-1 transition-colors',
                    isNodeClickable && 'cursor-pointer'
                  )}
                >
                  {step.subtitle && (
                    <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground block truncate">
                      {step.subtitle}
                    </span>
                  )}
                  {step.title && (
                    <span
                      className={cn(
                        'text-[11px] sm:text-xs font-semibold leading-tight line-clamp-2 block mt-0.5',
                        isActive && 'text-primary font-bold',
                        isComplete && 'text-foreground',
                        isUpcoming && 'text-muted-foreground'
                      )}
                    >
                      {step.title}
                    </span>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
