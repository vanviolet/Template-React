import React, { useState, useEffect, useRef, ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/utils/cn';

interface LazySectionProps {
  id: string;
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  badge?: string;
  badgeColor?: string;
  children: ReactNode;
  minHeight?: string;
  forceMount?: boolean;
  className?: string;
}

export function LazySection({
  id,
  title,
  subtitle,
  icon: Icon,
  badge,
  badgeColor = 'bg-primary/10 text-primary border-primary/20',
  children,
  minHeight = '420px',
  forceMount = false,
  className,
}: LazySectionProps) {
  const [hasEnteredViewport, setHasEnteredViewport] = useState(forceMount);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (forceMount) {
      setHasEnteredViewport(true);
      return;
    }

    if (hasEnteredViewport) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // When section comes within 300px of viewport, trigger mount
        if (entry.isIntersecting) {
          setHasEnteredViewport(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '300px 0px 300px 0px',
        threshold: 0.01,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [forceMount, hasEnteredViewport]);

  return (
    <section id={id} ref={containerRef} className={cn('scroll-mt-24 space-y-3', className)}>
      {/* Section Header */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2.5">
          {Icon && (
            <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center shrink-0 shadow-2xs">
              <Icon className="h-4 w-4" />
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold tracking-tight text-foreground">
                {title}
              </h2>
              {badge && (
                <span
                  className={cn(
                    'text-[10px] px-2 py-0.5 rounded-md font-mono font-medium border',
                    badgeColor
                  )}
                >
                  {badge}
                </span>
              )}
            </div>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>
      </div>

      {/* Content or Placeholder */}
      <div style={{ minHeight }} className="relative transition-all duration-300">
        {hasEnteredViewport ? (
          <div className="animate-in fade-in duration-300">
            {children}
          </div>
        ) : (
          <Card className="rounded-3xl border border-dashed border-border/80 bg-card/40 p-6 flex flex-col justify-center items-center h-full min-h-[360px] text-center">
            <div className="w-12 h-12 rounded-2xl bg-muted/60 text-muted-foreground flex items-center justify-center mb-3">
              {Icon ? <Icon className="h-6 w-6 stroke-[1.8]" /> : null}
            </div>
            <h3 className="text-sm font-semibold text-foreground">
              Memuat Komponen {title}...
            </h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm">
              Komponen akan di-render otomatis secara on-demand saat memasuki viewport.
            </p>
            <div className="w-48 mt-4 space-y-2">
              <Skeleton className="h-2 w-full rounded-full" />
              <Skeleton className="h-2 w-3/4 mx-auto rounded-full" />
            </div>
          </Card>
        )}
      </div>
    </section>
  );
}
