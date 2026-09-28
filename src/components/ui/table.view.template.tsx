import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox';
import { PAGE_SIZE_OPTIONS } from '@/constants/app';
import { cn } from '@/utils/cn';

export interface TablePaginationProps {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
  onPageSizeChange: (newPageSize: number) => void;
  pageSizeOptions?: number[];
  className?: string;
  showTotalText?: boolean;
}

export function TablePagination({
  page,
  pageSize,
  total,
  totalPages,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = PAGE_SIZE_OPTIONS,
  className,
  showTotalText = true,
}: TablePaginationProps) {
  const { t } = useTranslation();

  return (
    <div
      className={cn(
        'px-5 py-3.5 border-t border-border/50 bg-card flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground',
        className
      )}
    >
      {/* Left: Page size dropdown & Total counter */}
      <div className="flex items-center gap-3">
        <span>{t('common.itemsPerPage', 'Baris per halaman')}:</span>
        <div className="w-20">
          <Combobox
            options={pageSizeOptions.map((size) => ({
              label: String(size),
              value: String(size),
            }))}
            value={String(pageSize)}
            onChange={(val) => onPageSizeChange(Number(val))}
            searchable={false}
            className="h-8"
          />
        </div>
        {showTotalText && (
          <span>
            Total <strong className="text-foreground font-mono">{total}</strong> data
          </span>
        )}
      </div>

      {/* Right: Page status & Navigation buttons */}
      <div className="flex items-center gap-3">
        <span>
          {t('common.page', 'Halaman')}{' '}
          <strong className="text-foreground font-mono">{page}</strong> {t('common.of', 'dari')}{' '}
          <strong className="text-foreground font-mono">{totalPages || 1}</strong>
        </span>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            className="h-8 w-8 rounded-lg cursor-pointer"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            disabled={page >= totalPages || totalPages === 0}
            onClick={() => onPageChange(page + 1)}
            className="h-8 w-8 rounded-lg cursor-pointer"
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export interface TableViewCardProps {
  children: ReactNode;
  topBar?: ReactNode;
  filterChipsBar?: ReactNode;
  pagination?: ReactNode;
  className?: string;
}

export function TableViewCard({
  children,
  topBar,
  filterChipsBar,
  pagination,
  className,
}: TableViewCardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-border/60 bg-card shadow-xs overflow-hidden flex flex-col',
        className
      )}
    >
      {topBar && (
        <div className="p-4 sm:p-5 bg-card flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 border-b border-border/30">
          {topBar}
        </div>
      )}

      {filterChipsBar}

      <div className="overflow-x-auto flex-1">{children}</div>

      {pagination}
    </div>
  );
}

export interface TableViewHeaderProps {
  title: string;
  description?: string;
  actionButton?: ReactNode;
  className?: string;
}

export function TableViewHeader({
  title,
  description,
  actionButton,
  className,
}: TableViewHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row sm:items-center justify-between gap-4',
        className
      )}
    >
      <div>
        <h1 className="text-xl font-bold tracking-tight text-foreground">{title}</h1>
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>

      {actionButton && <div className="shrink-0 self-start sm:self-auto">{actionButton}</div>}
    </div>
  );
}
