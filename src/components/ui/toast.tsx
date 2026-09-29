import * as React from 'react';
import { toast as sonnerToast } from 'sonner';
import { Info, CheckCircle2, AlertTriangle, AlertCircle, X } from 'lucide-react';
import { cn } from '@/utils/cn';

export type ToastType = 'info' | 'success' | 'warning' | 'error';

export interface ToastProps {
  id?: string | number;
  type?: ToastType;
  title?: string;
  description?: React.ReactNode;
  onDismiss?: () => void;
  className?: string;
}

export function ToastCard({
  id,
  type = 'info',
  title,
  description,
  onDismiss,
  className,
}: ToastProps) {
  const handleClose = () => {
    if (onDismiss) {
      onDismiss();
    } else if (id !== undefined) {
      sonnerToast.dismiss(id);
    }
  };

  const config = {
    info: {
      defaultTitle: 'Information',
      icon: Info,
      gradient:
        'bg-[radial-gradient(ellipse_at_left,_rgba(186,230,253,0.7),_rgba(240,249,255,0.4)_40%,_transparent_75%)] dark:bg-[radial-gradient(ellipse_at_left,_rgba(14,165,233,0.25),_transparent_75%)]',
      borderBox: 'border-sky-200/80 dark:border-sky-800/50 bg-white dark:bg-card text-sky-500 shadow-2xs',
      iconColor: 'text-sky-500',
    },
    success: {
      defaultTitle: 'Success',
      icon: CheckCircle2,
      gradient:
        'bg-[radial-gradient(ellipse_at_left,_rgba(167,243,208,0.7),_rgba(236,253,245,0.4)_40%,_transparent_75%)] dark:bg-[radial-gradient(ellipse_at_left,_rgba(16,185,129,0.25),_transparent_75%)]',
      borderBox: 'border-emerald-200/80 dark:border-emerald-800/50 bg-white dark:bg-card text-emerald-500 shadow-2xs',
      iconColor: 'text-emerald-500',
    },
    warning: {
      defaultTitle: 'Warning',
      icon: AlertTriangle,
      gradient:
        'bg-[radial-gradient(ellipse_at_left,_rgba(254,240,138,0.75),_rgba(254,252,232,0.4)_40%,_transparent_75%)] dark:bg-[radial-gradient(ellipse_at_left,_rgba(234,179,8,0.25),_transparent_75%)]',
      borderBox: 'border-amber-200/80 dark:border-amber-800/50 bg-white dark:bg-card text-amber-500 shadow-2xs',
      iconColor: 'text-amber-500',
    },
    error: {
      defaultTitle: 'Error',
      icon: AlertCircle,
      gradient:
        'bg-[radial-gradient(ellipse_at_left,_rgba(254,205,211,0.75),_rgba(255,241,242,0.4)_40%,_transparent_75%)] dark:bg-[radial-gradient(ellipse_at_left,_rgba(239,68,68,0.25),_transparent_75%)]',
      borderBox: 'border-rose-200/80 dark:border-rose-800/50 bg-white dark:bg-card text-rose-500 shadow-2xs',
      iconColor: 'text-rose-500',
    },
  }[type];

  const IconComponent = config.icon;
  const displayTitle = title || config.defaultTitle;

  return (
    <div
      role="alert"
      data-custom-toast="true"
      className={cn(
        'relative isolate overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.1)] dark:shadow-[0_10px_30px_-5px_rgba(0,0,0,0.5)] p-4 pr-10 flex items-start gap-3.5 w-full max-w-[390px] select-none pointer-events-auto',
        className
      )}
    >
      {/* Background Soft Glow Wash (strictly contained inside the card) */}
      <div
        className={cn('absolute inset-0 pointer-events-none -z-10', config.gradient)}
        aria-hidden="true"
      />

      {/* Left Icon Squircle Box (Clean white rounded box with subtle colored border) */}
      <div
        className={cn(
          'h-10 w-10 shrink-0 rounded-xl border flex items-center justify-center transition-transform',
          config.borderBox
        )}
      >
        <IconComponent className={cn('h-5 w-5 stroke-[2.2]', config.iconColor)} />
      </div>

      {/* Message content */}
      <div className="flex-1 min-w-0 pt-0.5">
        <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-tight">
          {displayTitle}
        </h4>
        {description && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed break-words">
            {description}
          </p>
        )}
      </div>

      {/* Top right close button */}
      <button
        type="button"
        onClick={handleClose}
        aria-label="Close notification"
        className="absolute top-3.5 right-3.5 p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-zinc-800/80 transition-colors cursor-pointer"
      >
        <X className="h-3.5 w-3.5 stroke-[2.5]" />
      </button>
    </div>
  );
}

export interface ShowToastOptions {
  id?: string | number;
  title?: string;
  duration?: number;
}

/**
 * Toast helper implementation with complete type variations matching toast.jpg
 */
const toastFunction = (description: React.ReactNode, options?: ShowToastOptions) => {
  return showToast.info(description, options);
};

export const showToast = {
  info: (description: React.ReactNode, options?: ShowToastOptions) => {
    return sonnerToast.custom(
      (id) => (
        <ToastCard
          id={options?.id ?? id}
          type="info"
          title={options?.title}
          description={description}
          onDismiss={() => sonnerToast.dismiss(options?.id ?? id)}
        />
      ),
      { id: options?.id, duration: options?.duration ?? 4000, unstyled: true }
    );
  },

  success: (description: React.ReactNode, options?: ShowToastOptions) => {
    return sonnerToast.custom(
      (id) => (
        <ToastCard
          id={options?.id ?? id}
          type="success"
          title={options?.title}
          description={description}
          onDismiss={() => sonnerToast.dismiss(options?.id ?? id)}
        />
      ),
      { id: options?.id, duration: options?.duration ?? 4000, unstyled: true }
    );
  },

  warning: (description: React.ReactNode, options?: ShowToastOptions) => {
    return sonnerToast.custom(
      (id) => (
        <ToastCard
          id={options?.id ?? id}
          type="warning"
          title={options?.title}
          description={description}
          onDismiss={() => sonnerToast.dismiss(options?.id ?? id)}
        />
      ),
      { id: options?.id, duration: options?.duration ?? 4000, unstyled: true }
    );
  },

  error: (description: React.ReactNode, options?: ShowToastOptions) => {
    return sonnerToast.custom(
      (id) => (
        <ToastCard
          id={options?.id ?? id}
          type="error"
          title={options?.title}
          description={description}
          onDismiss={() => sonnerToast.dismiss(options?.id ?? id)}
        />
      ),
      { id: options?.id, duration: options?.duration ?? 4000, unstyled: true }
    );
  },

  custom: sonnerToast.custom,
  dismiss: (id?: string | number) => sonnerToast.dismiss(id),
};

export const toast = Object.assign(toastFunction, showToast);
