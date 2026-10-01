import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Sparkles, Layers, ListOrdered, BellRing } from 'lucide-react';
import { EventWizard } from './event.wizard';
import { StepShowcase } from './step.showcase';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/utils/cn';

export default function WizardView() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'event' | 'showcase'>('event');

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              {t('wizard.title', 'Wizard & Step Component')}
            </h1>
            <Badge variant="outline" className="border-primary/40 text-primary bg-primary/5 text-[10px]">
              Modern UI
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {t(
              'wizard.subtitle',
              'Alur tahapan interaktif dengan komponen Step reusable bergaya minimalis, bersih, dan elegan.'
            )}
          </p>
        </div>

        {/* Responsive Tab Switcher */}
        <div className="grid grid-cols-2 sm:flex items-center gap-1.5 p-1 rounded-xl bg-muted/60 border border-border shrink-0 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setActiveTab('event')}
            className={cn(
              'flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer select-none truncate',
              activeTab === 'event'
                ? 'bg-card text-foreground shadow-2xs border border-border/80'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <ListOrdered className="h-3.5 w-3.5 text-primary shrink-0" />
            <span className="truncate">{t('wizard.tabs.eventPlanner', 'Event Planner Wizard')}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('showcase')}
            className={cn(
              'flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer select-none truncate',
              activeTab === 'showcase'
                ? 'bg-card text-foreground shadow-2xs border border-border/80'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Layers className="h-3.5 w-3.5 text-primary shrink-0" />
            <span className="truncate">{t('wizard.tabs.showcase', 'Step & Toast Showcase')}</span>
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'event' ? <EventWizard /> : <StepShowcase />}
    </div>
  );
}
