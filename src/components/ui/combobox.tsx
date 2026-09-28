import * as React from 'react';
import { Check, ChevronsUpDown, Loader2, Search, X } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/utils/cn';
import { ComboboxOption } from '@/types/common';
import { useTranslation } from 'react-i18next';

export interface ComboboxProps {
  options?: ComboboxOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string, option?: ComboboxOption) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  className?: string;
  triggerClassName?: string;
  wrapperClassName?: string;
  popoverClassName?: string;
  disabled?: boolean;
  error?: boolean;
  clearable?: boolean;
  searchable?: boolean;

  // Async / Controlled Mode
  async?: boolean;
  isLoading?: boolean;
  isLoadingMore?: boolean;
  hasMore?: boolean;
  onSearchChange?: (search: string) => void;
  onLoadMore?: () => void;
  totalCount?: number;

  // Self-contained Async Fetcher
  loadOptions?: (params: {
    search: string;
    page: number;
    pageSize: number;
  }) => Promise<{
    options: ComboboxOption[];
    hasMore: boolean;
    total?: number;
  }>;
  pageSize?: number;
  debounceMs?: number;

  // Initial / Selected Option for Async display
  selectedOption?: ComboboxOption;
  initialLabel?: string;

  // Custom Rendering
  renderItem?: (option: ComboboxOption, isSelected: boolean, isHighlighted: boolean) => React.ReactNode;
}

export function Combobox({
  options: externalOptions,
  value: controlledValue,
  defaultValue,
  onChange,
  placeholder,
  searchPlaceholder,
  emptyText,
  className,
  triggerClassName,
  wrapperClassName,
  popoverClassName,
  disabled = false,
  error = false,
  clearable = false,
  searchable,
  async = false,
  isLoading: externalIsLoading,
  isLoadingMore: externalIsLoadingMore,
  hasMore: externalHasMore,
  onSearchChange,
  onLoadMore,
  totalCount: externalTotalCount,
  loadOptions,
  pageSize = 10,
  debounceMs = 300,
  selectedOption: controlledSelectedOption,
  initialLabel,
  renderItem,
}: ComboboxProps) {
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);

  // Value state (uncontrolled fallback)
  const [internalValue, setInternalValue] = React.useState<string>(defaultValue || '');
  const currentValue = controlledValue !== undefined ? controlledValue : internalValue;

  // Search state
  const [searchQuery, setSearchQuery] = React.useState('');
  const [debouncedSearch, setDebouncedSearch] = React.useState('');

  // Keyboard navigation active index (like cmdk)
  const [highlightedIndex, setHighlightedIndex] = React.useState<number>(0);

  // Internal Async State (when loadOptions is provided)
  const [internalOptions, setInternalOptions] = React.useState<ComboboxOption[]>([]);
  const [page, setPage] = React.useState(1);
  const [internalHasMore, setInternalHasMore] = React.useState(false);
  const [internalIsLoading, setInternalIsLoading] = React.useState(false);
  const [internalIsLoadingMore, setInternalIsLoadingMore] = React.useState(false);
  const [internalTotal, setInternalTotal] = React.useState<number | undefined>(undefined);
  const [cachedSelectedOption, setCachedSelectedOption] = React.useState<ComboboxOption | undefined>(
    controlledSelectedOption
  );

  // References
  const listContainerRef = React.useRef<HTMLDivElement>(null);
  const loadMoreObserverRef = React.useRef<HTMLDivElement>(null);
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  const isSelfManagedAsync = Boolean(loadOptions);
  const isAsyncMode = async || isSelfManagedAsync;

  // Active options pool
  const rawOptions = isSelfManagedAsync ? internalOptions : externalOptions || [];

  // Determine whether search input should be visible (always true by default, even for 2 options)
  const isSearchable = searchable !== undefined ? searchable : true;

  // Debounce search input
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      if (onSearchChange) {
        onSearchChange(searchQuery);
      }
    }, debounceMs);

    return () => clearTimeout(handler);
  }, [searchQuery, debounceMs, onSearchChange]);

  // Self-managed Async fetching on initial open or search query change
  React.useEffect(() => {
    if (!isSelfManagedAsync || !loadOptions) return;
    if (!open) return;

    let isSubscribed = true;
    setInternalIsLoading(true);
    setPage(1);

    loadOptions({ search: debouncedSearch, page: 1, pageSize })
      .then((res) => {
        if (!isSubscribed) return;
        setInternalOptions(res.options);
        setInternalHasMore(res.hasMore);
        setInternalTotal(res.total);
        // Reset highlighted index on new search results
        setHighlightedIndex(0);
      })
      .catch((err) => {
        console.error('Failed to load combobox options:', err);
      })
      .finally(() => {
        if (isSubscribed) setInternalIsLoading(false);
      });

    return () => {
      isSubscribed = false;
    };
  }, [isSelfManagedAsync, loadOptions, debouncedSearch, pageSize, open]);

  // Load more handler for self-managed async
  const handleLoadMoreSelf = React.useCallback(async () => {
    if (!isSelfManagedAsync || !loadOptions) return;
    if (internalIsLoading || internalIsLoadingMore || !internalHasMore) return;

    const nextPage = page + 1;
    setInternalIsLoadingMore(true);

    try {
      const res = await loadOptions({ search: debouncedSearch, page: nextPage, pageSize });
      setInternalOptions((prev) => {
        const existingValues = new Set(prev.map((o) => o.value));
        const newOptions = res.options.filter((o) => !existingValues.has(o.value));
        return [...prev, ...newOptions];
      });
      setPage(nextPage);
      setInternalHasMore(res.hasMore);
      setInternalTotal(res.total);
    } catch (err) {
      console.error('Failed to load more options:', err);
    } finally {
      setInternalIsLoadingMore(false);
    }
  }, [
    isSelfManagedAsync,
    loadOptions,
    internalIsLoading,
    internalIsLoadingMore,
    internalHasMore,
    page,
    debouncedSearch,
    pageSize,
  ]);

  // Intersection observer for Infinite Scroll
  React.useEffect(() => {
    if (!open) return;
    const hasMoreItems = isSelfManagedAsync ? internalHasMore : externalHasMore;
    const isLoadingItems = isSelfManagedAsync
      ? internalIsLoading || internalIsLoadingMore
      : externalIsLoading || externalIsLoadingMore;

    if (!hasMoreItems || isLoadingItems) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          if (isSelfManagedAsync) {
            handleLoadMoreSelf();
          } else if (onLoadMore) {
            onLoadMore();
          }
        }
      },
      {
        root: listContainerRef.current,
        threshold: 0.1,
      }
    );

    const target = loadMoreObserverRef.current;
    if (target) {
      observer.observe(target);
    }

    return () => {
      if (target) observer.unobserve(target);
      observer.disconnect();
    };
  }, [
    open,
    isSelfManagedAsync,
    internalHasMore,
    externalHasMore,
    internalIsLoading,
    internalIsLoadingMore,
    externalIsLoading,
    externalIsLoadingMore,
    handleLoadMoreSelf,
    onLoadMore,
  ]);

  // Scroll listener as fallback for infinite scroll
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const hasMoreItems = isSelfManagedAsync ? internalHasMore : externalHasMore;
    const isLoadingItems = isSelfManagedAsync
      ? internalIsLoading || internalIsLoadingMore
      : externalIsLoading || externalIsLoadingMore;

    if (
      hasMoreItems &&
      !isLoadingItems &&
      target.scrollTop + target.clientHeight >= target.scrollHeight - 30
    ) {
      if (isSelfManagedAsync) {
        handleLoadMoreSelf();
      } else if (onLoadMore) {
        onLoadMore();
      }
    }
  };

  // Client-side filtering when not in async mode
  const displayedOptions = React.useMemo(() => {
    if (isAsyncMode) {
      return rawOptions;
    }
    if (!searchQuery.trim()) {
      return rawOptions;
    }
    const q = searchQuery.toLowerCase().trim();
    return rawOptions.filter(
      (opt) =>
        opt.label.toLowerCase().includes(q) ||
        (opt.description && opt.description.toLowerCase().includes(q)) ||
        (opt.badge && opt.badge.toLowerCase().includes(q))
    );
  }, [rawOptions, searchQuery, isAsyncMode]);

  // Reset highlightedIndex if filtered list changes
  React.useEffect(() => {
    setHighlightedIndex(0);
  }, [displayedOptions.length]);

  // Determine current selected option object
  const currentSelectedOption = React.useMemo(() => {
    if (!currentValue) return undefined;
    if (controlledSelectedOption && controlledSelectedOption.value === currentValue) {
      return controlledSelectedOption;
    }
    const found = rawOptions.find((opt) => opt.value === currentValue);
    if (found) return found;
    if (cachedSelectedOption && cachedSelectedOption.value === currentValue) {
      return cachedSelectedOption;
    }
    return undefined;
  }, [currentValue, rawOptions, controlledSelectedOption, cachedSelectedOption]);

  // Keep cachedSelectedOption updated if found
  React.useEffect(() => {
    if (currentValue && !cachedSelectedOption) {
      const found = rawOptions.find((opt) => opt.value === currentValue);
      if (found) setCachedSelectedOption(found);
    }
  }, [currentValue, rawOptions, cachedSelectedOption]);

  // Scroll highlighted item into view if keyboard navigated
  const scrollItemIntoView = (index: number) => {
    const container = listContainerRef.current;
    if (!container) return;
    const item = container.querySelector(`[data-index="${index}"]`) as HTMLElement | null;
    if (item) {
      item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  };

  const handleSelect = React.useCallback((option: ComboboxOption) => {
    if (option.disabled) return;
    setInternalValue(option.value);
    setCachedSelectedOption(option);
    onChange?.(option.value, option);
    setOpen(false);
    setSearchQuery('');
    // Return focus to trigger button
    triggerRef.current?.focus();
  }, [onChange]);

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setInternalValue('');
    setCachedSelectedOption(undefined);
    onChange?.('', undefined);
    setSearchQuery('');
  };

  // Keyboard navigation handler for the Search Input (cmdk UX style)
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (displayedOptions.length === 0) {
      if (e.key === 'Escape') {
        e.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => {
        let nextIndex = prev + 1;
        // Loop down or clamp
        if (nextIndex >= displayedOptions.length) {
          nextIndex = 0;
        }
        // Skip disabled items if possible
        while (nextIndex < displayedOptions.length && displayedOptions[nextIndex]?.disabled) {
          nextIndex++;
        }
        if (nextIndex >= displayedOptions.length) {
          nextIndex = 0;
        }
        scrollItemIntoView(nextIndex);
        return nextIndex;
      });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => {
        let nextIndex = prev - 1;
        if (nextIndex < 0) {
          nextIndex = displayedOptions.length - 1;
        }
        while (nextIndex >= 0 && displayedOptions[nextIndex]?.disabled) {
          nextIndex--;
        }
        if (nextIndex < 0) {
          nextIndex = displayedOptions.length - 1;
        }
        scrollItemIntoView(nextIndex);
        return nextIndex;
      });
    } else if (e.key === 'Enter') {
      // If there's an active highlighted item, select it while focus is still in input
      e.preventDefault();
      const targetOption = displayedOptions[highlightedIndex];
      if (targetOption && !targetOption.disabled) {
        handleSelect(targetOption);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setOpen(false);
      triggerRef.current?.focus();
    } else if (e.key === 'Tab') {
      // Select active or just close
      setOpen(false);
    }
  };

  // Focus search input when popover opens, and sync initial highlightedIndex with selected item
  React.useEffect(() => {
    if (open) {
      // Find initial highlighted index
      const activeIdx = displayedOptions.findIndex((opt) => opt.value === currentValue);
      setHighlightedIndex(activeIdx >= 0 ? activeIdx : 0);

      if (isSearchable) {
        const timer = setTimeout(() => {
          searchInputRef.current?.focus();
        }, 30);
        return () => clearTimeout(timer);
      }
    } else {
      setSearchQuery('');
      setHighlightedIndex(0);
    }
  }, [open, isSearchable, currentValue]);

  const isLoading = isSelfManagedAsync ? internalIsLoading : externalIsLoading;
  const isLoadingMore = isSelfManagedAsync ? internalIsLoadingMore : externalIsLoadingMore;
  const hasMore = isSelfManagedAsync ? internalHasMore : externalHasMore;
  const totalCount = isSelfManagedAsync ? internalTotal : externalTotalCount;

  const displayLabel = currentSelectedOption?.label || initialLabel || placeholder || t('common.select', 'Pilih...');
  const isSelected = Boolean(currentSelectedOption || initialLabel || currentValue);

  return (
    <div className={cn('relative w-full', wrapperClassName)}>
      <Popover open={open} onOpenChange={disabled ? undefined : setOpen}>
        <PopoverTrigger asChild>
          <button
            ref={triggerRef}
            type="button"
            role="combobox"
            aria-expanded={open}
            aria-haspopup="listbox"
            disabled={disabled}
            className={cn(
              'group flex h-9 w-full items-center justify-between rounded-lg border border-input bg-background px-3 py-1 text-xs shadow-2xs transition-all duration-150',
              'hover:bg-accent/40 hover:border-accent-foreground/20 focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring',
              'disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-background cursor-pointer text-left',
              error && 'border-destructive focus:ring-destructive focus:border-destructive',
              className,
              triggerClassName
            )}
          >
            <span
              className={cn(
                'truncate flex-1 pr-2',
                !isSelected && 'text-muted-foreground font-normal'
              )}
            >
              {displayLabel}
            </span>

            <div className="flex items-center gap-1 shrink-0 text-muted-foreground">
              {clearable && isSelected && !disabled && (
                <span
                  role="button"
                  tabIndex={0}
                  onClick={handleClear}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleClear(e as any);
                    }
                  }}
                  className="rounded-full p-0.5 hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                  title={t('common.clear', 'Hapus')}
                >
                  <X className="h-3 w-3" />
                </span>
              )}
              <ChevronsUpDown className="h-3.5 w-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
            </div>
          </button>
        </PopoverTrigger>

        <PopoverContent
          align="start"
          sideOffset={4}
          onOpenAutoFocus={(e) => {
            // Prevent auto-focusing the popover container so the search input gets immediate focus
            e.preventDefault();
            searchInputRef.current?.focus();
          }}
          className={cn(
            'w-[var(--radix-popover-trigger-width)] min-w-[220px] max-w-md p-0 rounded-xl border border-border bg-popover text-popover-foreground shadow-lg overflow-hidden',
            popoverClassName
          )}
        >
          {/* Search Box Header (cmdk style with keyboard navigation) */}
          {isSearchable && (
            <div className="flex items-center border-b border-border/80 px-2.5 py-1.5 bg-muted/20">
              <Search className="mr-2 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleInputKeyDown}
                placeholder={
                  searchPlaceholder || t('common.searchPlaceholder', 'Cari pilihan...')
                }
                aria-autocomplete="list"
                className="flex h-7 w-full rounded-md bg-transparent text-xs text-foreground placeholder:text-muted-foreground outline-none border-none focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <div className="flex items-center gap-1 shrink-0">
                {searchQuery ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      searchInputRef.current?.focus();
                    }}
                    className="rounded-full p-0.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                  >
                    <X className="h-3 w-3" />
                  </button>
                ) : (
                  <kbd className="hidden sm:inline-flex items-center justify-center h-4 px-1 text-[9px] font-mono text-muted-foreground/80 bg-muted border border-border/60 rounded select-none">
                    ↑↓ ↵
                  </kbd>
                )}
              </div>
            </div>
          )}

          {/* Options List Container */}
          <div
            ref={listContainerRef}
            onScroll={handleScroll}
            role="listbox"
            className="max-h-60 overflow-y-auto p-1 text-xs divide-y divide-border/20 scrollbar-thin"
          >
            {/* Loading Initial Skeleton */}
            {isLoading ? (
              <div className="space-y-1.5 p-2">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="flex items-center gap-2 p-1.5 animate-pulse">
                    <div className="h-3.5 w-3.5 rounded bg-muted/80" />
                    <div className="space-y-1 flex-1">
                      <div className="h-3 w-3/4 rounded bg-muted/80" />
                      <div className="h-2 w-1/2 rounded bg-muted/50" />
                    </div>
                  </div>
                ))}
                <div className="flex items-center justify-center gap-1.5 pt-2 text-[11px] text-muted-foreground">
                  <Loader2 className="h-3 w-3 animate-spin text-primary" />
                  <span>{t('common.loading', 'Memuat data...')}</span>
                </div>
              </div>
            ) : displayedOptions.length === 0 ? (
              /* Empty State */
              <div className="py-6 px-3 text-center">
                <Search className="h-6 w-6 mx-auto mb-1.5 text-muted-foreground/40" />
                <p className="text-xs font-medium text-foreground">
                  {emptyText || t('common.notFoundTitle', 'Tidak ada data')}
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {searchQuery
                    ? `${t('common.notFoundDesc', 'Tidak ditemukan hasil untuk')} "${searchQuery}"`
                    : t('common.emptyDataDesc', 'Data tidak tersedia')}
                </p>
              </div>
            ) : (
              /* Options List */
              displayedOptions.map((opt, idx) => {
                const isItemActive = opt.value === currentValue;
                const isItemHighlighted = idx === highlightedIndex;

                if (renderItem) {
                  return (
                    <div
                      key={opt.value}
                      data-index={idx}
                      onClick={() => handleSelect(opt)}
                      onMouseEnter={() => setHighlightedIndex(idx)}
                      className={cn(
                        'cursor-pointer',
                        opt.disabled && 'cursor-not-allowed opacity-50'
                      )}
                    >
                      {renderItem(opt, isItemActive, isItemHighlighted)}
                    </div>
                  );
                }

                return (
                  <button
                    key={opt.value}
                    data-index={idx}
                    type="button"
                    role="option"
                    aria-selected={isItemActive}
                    disabled={opt.disabled}
                    onClick={() => handleSelect(opt)}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                    className={cn(
                      'group relative flex w-full cursor-pointer select-none items-center justify-between rounded-lg px-2.5 py-1.5 text-xs text-left transition-colors',
                      // cmdk-style active highlighted state (from arrow keys or mouse hover)
                      isItemHighlighted && !isItemActive && 'bg-accent/80 text-accent-foreground',
                      isItemActive && 'bg-primary/10 text-primary font-medium',
                      isItemActive && isItemHighlighted && 'bg-primary/15 text-primary',
                      opt.disabled && 'cursor-not-allowed opacity-40 hover:bg-transparent'
                    )}
                  >
                    <div className="flex flex-col min-w-0 pr-2">
                      <span
                        className={cn(
                          'truncate text-xs',
                          isItemActive
                            ? 'font-medium text-primary'
                            : 'font-normal text-foreground group-hover:text-accent-foreground'
                        )}
                      >
                        {opt.label}
                      </span>
                      {opt.description && (
                        <span className="truncate text-[10px] text-muted-foreground">
                          {opt.description}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {opt.badge && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-mono">
                          {opt.badge}
                        </span>
                      )}
                      {isItemActive && (
                        <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                      )}
                    </div>
                  </button>
                );
              })
            )}

            {/* Infinite Scroll Trigger & Bottom Loading Indicator */}
            {hasMore && (
              <div
                ref={loadMoreObserverRef}
                className="py-2.5 px-3 flex items-center justify-center gap-2 text-[11px] text-muted-foreground border-t border-border/40"
              >
                {isLoadingMore ? (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin text-primary" />
                    <span>{t('common.loadingMore', 'Memuat lebih banyak...')}</span>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isSelfManagedAsync) handleLoadMoreSelf();
                      else if (onLoadMore) onLoadMore();
                    }}
                    className="text-[11px] text-primary hover:underline font-medium cursor-pointer"
                  >
                    {t('common.loadMore', 'Muat lebih banyak')}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Footer Info: Display total & clean keyboard shortcut hints if available */}
          <div className="px-3 py-1.5 border-t border-border/60 bg-muted/30 flex items-center justify-between text-[10px] text-muted-foreground">
            {totalCount !== undefined && totalCount > 0 ? (
              <span>
                {displayedOptions.length} / {totalCount} data
              </span>
            ) : (
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <div className="flex items-center gap-1 font-mono text-[10px]">
                  <kbd className="px-1.5 py-0.5 rounded bg-muted/80 text-foreground font-mono text-[9px] border border-border/70 shadow-2xs font-semibold">
                    ↑
                  </kbd>
                  <kbd className="px-1.5 py-0.5 rounded bg-muted/80 text-foreground font-mono text-[9px] border border-border/70 shadow-2xs font-semibold">
                    ↓
                  </kbd>
                  <span className="text-[10px] text-muted-foreground/60 px-0.5">•</span>
                  <kbd className="px-1.5 py-0.5 rounded bg-muted/80 text-foreground font-mono text-[9px] border border-border/70 shadow-2xs font-semibold">
                    ↵ Enter
                  </kbd>
                  <span className="text-[10px] text-muted-foreground/60 px-0.5">•</span>
                  <kbd className="px-1.5 py-0.5 rounded bg-muted/80 text-foreground font-mono text-[9px] border border-border/70 shadow-2xs font-semibold">
                    Esc
                  </kbd>
                </div>
              </div>
            )}

            {hasMore ? (
              <span className="text-[9px] text-muted-foreground/80">Scroll untuk lanjut</span>
            ) : totalCount !== undefined && totalCount > 0 ? (
              <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-medium">
                {t('common.allLoaded', 'Semua data telah dimuat')}
              </span>
            ) : null}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
