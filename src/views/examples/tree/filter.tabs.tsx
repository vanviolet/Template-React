import React from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/utils/cn';
import { TreeTabFilter } from './types';

interface FilterTabsProps {
  currentTab: TreeTabFilter;
  onTabChange: (tab: TreeTabFilter) => void;
  counts: {
    all: number;
    prodi: number;
    jalur: number;
    jenis: number;
    berkas: number;
  };
}

export function FilterTabs({
  currentTab,
  onTabChange,
  counts,
}: FilterTabsProps) {
  const { t } = useTranslation();

  const tabs: { key: TreeTabFilter; label: string; count: number }[] = [
    { key: 'all', label: 'Semua Hierarki', count: counts.all },
    { key: 'prodi', label: 'Program Studi', count: counts.prodi },
    { key: 'jalur', label: 'Jalur', count: counts.jalur },
    { key: 'jenis', label: 'Jenis', count: counts.jenis },
    { key: 'berkas', label: 'Berkas', count: counts.berkas },
  ];

  return (
    <div className="flex items-center gap-1 p-1 bg-muted/60 dark:bg-muted/30 rounded-2xl border border-border/60 overflow-x-auto scrollbar-none shrink-0 max-w-full">
      {tabs.map((tab) => {
        const isActive = currentTab === tab.key;
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onTabChange(tab.key)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-150 cursor-pointer select-none',
              isActive
                ? 'bg-card text-foreground shadow-xs border border-border/80 font-semibold'
                : 'text-muted-foreground hover:text-foreground hover:bg-card/40'
            )}
          >
            <span>{tab.label}</span>
            <span
              className={cn(
                'text-[10px] px-1.5 py-0.2 rounded-md font-mono tabular-nums transition-colors',
                isActive
                  ? 'bg-primary/15 text-primary font-bold'
                  : 'bg-muted text-muted-foreground/80'
              )}
            >
              {tab.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
