import React, { lazy, Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  FolderTree,
  Calendar as CalendarIcon,
  PenTool,
  Sliders,
  ListOrdered,
  BarChart3,
  Layers,
  Sparkles,
  ArrowRight,
  Flame,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/utils/cn';
import { LazySection } from './lazy.section';

// Dynamic code splitting for all example modules to keep bundle ultra-light
const InputsExample = lazy(() => import('./inputs/view'));
const TreeExample = lazy(() => import('./tree/view'));
const CalendarExample = lazy(() => import('./calendar/view'));
const EditorExample = lazy(() => import('./editor/view'));
const WizardExample = lazy(() => import('./wizard/view'));
const AnalitikExample = lazy(() => import('./analitik/view'));

type ExampleTab = 'all' | 'inputs' | 'tree' | 'calendar' | 'editor' | 'wizard' | 'analitik';

interface TabConfig {
  key: ExampleTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeColor?: string;
}

const TABS: TabConfig[] = [
  { key: 'all', label: 'Semua (Scroll Lazy)', icon: Layers },
  { key: 'inputs', label: 'Input & Form', icon: Sliders, badge: 'Numeric' },
  { key: 'tree', label: 'Tree View & Graph', icon: FolderTree, badge: 'Network' },
  { key: 'calendar', label: 'Kalender Interaktif', icon: CalendarIcon },
  { key: 'editor', label: 'Rich Text Editor', icon: PenTool, badge: 'Lexical' },
  { key: 'wizard', label: 'Wizard & Steps', icon: ListOrdered },
  { key: 'analitik', label: 'Analitik & Grafik', icon: BarChart3 },
];

export default function ExamplesView() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromUrl = (searchParams.get('tab') as ExampleTab) || 'all';

  const [activeTab, setActiveTab] = useState<ExampleTab>(
    TABS.some((t) => t.key === tabFromUrl) ? tabFromUrl : 'all'
  );

  const handleTabChange = (tab: ExampleTab) => {
    setActiveTab(tab);
    if (tab === 'all') {
      searchParams.delete('tab');
      setSearchParams(searchParams, { replace: true });
    } else {
      setSearchParams({ tab }, { replace: true });
    }
  };

  // Sync state if URL changes externally
  useEffect(() => {
    const current = (searchParams.get('tab') as ExampleTab) || 'all';
    if (current !== activeTab && TABS.some((t) => t.key === current)) {
      setActiveTab(current);
    }
  }, [searchParams]);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-20">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center shrink-0 shadow-xs">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground font-sans">
                Showcase & Examples Hub
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Koleksi komponen contoh implementasi: Kalender, Tree View & Network Graph, Rich Editor, Form Inputs, Wizard, dan Analitik.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs font-mono py-1 px-2.5 bg-card">
            On-Demand Lazy Mount
          </Badge>
        </div>
      </div>

      {/* Sticky Tab / Filter Bar */}
      <div className="sticky top-16 z-20 py-2 -my-2 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none p-1 bg-muted/60 dark:bg-muted/30 rounded-2xl border border-border/60">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => handleTabChange(tab.key)}
                className={cn(
                  'flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-150 cursor-pointer select-none',
                  isActive
                    ? 'bg-card text-foreground shadow-xs border border-border/80 font-semibold'
                    : 'text-muted-foreground hover:text-foreground hover:bg-card/40'
                )}
              >
                <Icon className={cn('h-3.5 w-3.5', isActive ? 'text-primary' : 'text-muted-foreground')} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={cn(
                      'text-[9px] px-1.5 py-0.2 rounded font-mono',
                      isActive
                        ? 'bg-primary/15 text-primary font-bold'
                        : 'bg-muted text-muted-foreground'
                    )}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main View Area: Either Single Tab or Full Lazy Scroll Feed */}
      <div className="space-y-12">
        {/* 1. INPUTS & FORM SECTION */}
        {(activeTab === 'all' || activeTab === 'inputs') && (
          <LazySection
            id="section-inputs"
            title="Form Inputs & Number Formats"
            subtitle="Rupiah Currency (Rp), Nomor Handphone Indonesia, NIK KTP, Searchable Combobox, Date/Time Picker."
            icon={Sliders}
            badge="Inputs"
            forceMount={activeTab === 'inputs'}
            minHeight="350px"
          >
            <Suspense fallback={<SectionSkeleton height="350px" />}>
              <InputsExample />
            </Suspense>
          </LazySection>
        )}

        {/* 2. TREE VIEW & NETWORK GRAPH SECTION */}
        {(activeTab === 'all' || activeTab === 'tree') && (
          <LazySection
            id="section-tree"
            title="Tree View & Network Diagram Topology"
            subtitle="Hierarki Konfigurasi Gelombang PMB, Floating Cards, dan Interactive 2D Network Diagram Canvas."
            icon={FolderTree}
            badge="Hierarki & Relasi"
            badgeColor="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
            forceMount={activeTab === 'tree'}
            minHeight="520px"
          >
            <Suspense fallback={<SectionSkeleton height="520px" />}>
              <TreeExample />
            </Suspense>
          </LazySection>
        )}

        {/* 3. KALENDER INTERAKTIF SECTION */}
        {(activeTab === 'all' || activeTab === 'calendar') && (
          <LazySection
            id="section-calendar"
            title="Kalender Interaktif & Agenda"
            subtitle="FullCalendar v7 dengan multi-view (Month, Week, Day, List), filter event category, dan manajemen agenda."
            icon={CalendarIcon}
            badge="FullCalendar v7"
            badgeColor="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
            forceMount={activeTab === 'calendar'}
            minHeight="600px"
          >
            <Suspense fallback={<SectionSkeleton height="600px" />}>
              <CalendarExample />
            </Suspense>
          </LazySection>
        )}

        {/* 4. RICH TEXT EDITOR SECTION */}
        {(activeTab === 'all' || activeTab === 'editor') && (
          <LazySection
            id="section-editor"
            title="Rich Text Editor (Lexical)"
            subtitle="Editor dokumen WYSIWYG berbasis Lexical dengan tabel, upload gambar, format typography, dan live HTML export."
            icon={PenTool}
            badge="Lexical WYSIWYG"
            badgeColor="bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20"
            forceMount={activeTab === 'editor'}
            minHeight="500px"
          >
            <Suspense fallback={<SectionSkeleton height="500px" />}>
              <EditorExample />
            </Suspense>
          </LazySection>
        )}

        {/* 5. WIZARD & STEPS SECTION */}
        {(activeTab === 'all' || activeTab === 'wizard') && (
          <LazySection
            id="section-wizard"
            title="Wizard & Step Showcase"
            subtitle="Alur multistep interaktif dengan stepper progress, validasi data Zod per tahap, dan ringkasan submission."
            icon={ListOrdered}
            badge="Multistep Flow"
            badgeColor="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
            forceMount={activeTab === 'wizard'}
            minHeight="480px"
          >
            <Suspense fallback={<SectionSkeleton height="480px" />}>
              <WizardExample />
            </Suspense>
          </LazySection>
        )}

        {/* 6. ANALITIK & GRAFIK SECTION */}
        {(activeTab === 'all' || activeTab === 'analitik') && (
          <LazySection
            id="section-analitik"
            title="Analitik & Grafik Performa"
            subtitle="Dashboard analitik performa, visualisasi metrik utama, dan distribusi data registrasi."
            icon={BarChart3}
            badge="Charts & KPIs"
            badgeColor="bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
            forceMount={activeTab === 'analitik'}
            minHeight="450px"
          >
            <Suspense fallback={<SectionSkeleton height="450px" />}>
              <AnalitikExample />
            </Suspense>
          </LazySection>
        )}
      </div>
    </div>
  );
}

function SectionSkeleton({ height }: { height: string }) {
  return (
    <div
      style={{ height }}
      className="w-full rounded-3xl border border-border/60 bg-card/60 p-6 flex flex-col justify-center items-center space-y-4 animate-pulse"
    >
      <div className="w-12 h-12 rounded-2xl bg-muted/60" />
      <div className="w-48 h-4 rounded-full bg-muted/60" />
      <div className="w-72 h-3 rounded-full bg-muted/40" />
    </div>
  );
}
