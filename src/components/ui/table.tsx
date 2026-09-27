import * as React from 'react';
import { cn } from '@/utils/cn';

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-x-auto rounded-lg border border-border bg-card">
    <table
      ref={ref}
      className={cn('w-full caption-bottom text-xs border-collapse', className)}
      {...props}
    />
  </div>
));
Table.displayName = 'Table';

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn('bg-muted/50 [&_tr]:border-b border-border', className)} {...props} />
));
TableHeader.displayName = 'TableHeader';

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn('[&_tr:last-child]:border-0', className)}
    {...props}
  />
));
TableBody.displayName = 'TableBody';

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      'border-t border-border bg-muted/50 font-medium [&>tr]:last-child:border-b-0',
      className
    )}
    {...props}
  />
));
TableFooter.displayName = 'TableFooter';

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      'group border-b border-border transition-colors hover:bg-muted/40 data-[state=selected]:bg-muted',
      className
    )}
    {...props}
  />
));
TableRow.displayName = 'TableRow';

export interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  isPinnedRight?: boolean;
}

const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, isPinnedRight, ...props }, ref) => (
    <th
      ref={ref}
      className={cn(
        'h-10 px-3 text-left align-middle font-semibold text-muted-foreground [&:has([role=checkbox])]:pr-0 whitespace-nowrap',
        isPinnedRight &&
          'sticky right-0 z-10 text-center bg-muted/90 backdrop-blur-xs border-l border-border shadow-[-4px_0_12px_rgba(0,0,0,0.06)]',
        className
      )}
      {...props}
    />
  )
);
TableHead.displayName = 'TableHead';

export interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  isPinnedRight?: boolean;
}

const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, isPinnedRight, ...props }, ref) => (
    <td
      ref={ref}
      className={cn(
        'p-3 align-middle [&:has([role=checkbox])]:pr-0',
        isPinnedRight &&
          'sticky right-0 z-10 text-center bg-card group-hover:bg-muted/80 transition-colors border-l border-border shadow-[-4px_0_12px_rgba(0,0,0,0.06)]',
        className
      )}
      {...props}
    />
  )
);
TableCell.displayName = 'TableCell';

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn('mt-4 text-xs text-muted-foreground', className)}
    {...props}
  />
));
TableCaption.displayName = 'TableCaption';

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
