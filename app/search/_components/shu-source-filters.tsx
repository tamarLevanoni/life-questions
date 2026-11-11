'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toHebrewNumeral } from '@/lib/hebrew-numerals';
import type { ShuSectionWithSimanim } from '@/lib/schemas';
import type { UiShuRef } from '@/lib/types';
import { ShulchanAruchSubFilters } from './shulchan-aruch-sub-filters';
import styles from './search-layout.module.css';

interface ShuSourceFiltersProps {
  shuSections: ShuSectionWithSimanim[];
  sources: UiShuRef[];
  onChange: (sources: UiShuRef[]) => void;
}

export function ShuSourceFilters({ shuSections, sources, onChange }: ShuSourceFiltersProps) {
  const selectedSimanim = sources.flatMap((source) =>
    source.shuSectionId && source.simanId
      ? [{ id: source.id, shuSectionId: source.shuSectionId, simanId: source.simanId }]
      : []
  );
  const addSource = () => onChange([...sources, { id: crypto.randomUUID() }]);
  const updateSource = (updated: UiShuRef) => {
    onChange(sources.map((source) => source.id === updated.id ? updated : source));
  };
  const removeSource = (index: number, button: HTMLButtonElement) => {
    const card = button.closest('[data-source-card]');
    const buttons = card?.querySelectorAll<HTMLButtonElement>('[data-remove-source]');
    const target = buttons?.[index + 1] ?? buttons?.[index - 1]
      ?? card?.querySelector<HTMLButtonElement>('[data-add-source]');
    target?.focus({ preventScroll: true });
    onChange(sources.filter((source) => source.id !== sources[index].id));
  };

  return (
    <section aria-labelledby="shu-filter-heading" data-source-card className="min-w-0 rounded-[0.5rem] border border-border bg-card px-1.5 py-1 md:rounded-2xl md:p-2">
      <div className="mb-0.5 flex flex-wrap items-center justify-between gap-2 border-b border-border pb-0.5 md:mb-1.5 md:pb-1">
        <h2 id="shu-filter-heading" className="flex items-center gap-2 text-[0.6875rem] font-semibold leading-(--text-sm--line-height) md:text-[0.8125rem] md:leading-normal">שולחן ערוך</h2>
        <Button data-add-source type="button" variant="outline" onClick={addSource} className="h-6.5 px-2 text-[0.625rem] leading-(--text-sm--line-height) text-primary hover:bg-muted hover:text-primary md:h-8 md:text-xs">
          הוספת מקור
        </Button>
      </div>
      <div data-source-rows className={cn(styles.sourceRows, 'space-y-3')}>
        {!sources.length && <p className="py-1.5 text-center text-xs leading-(--text-sm--line-height) text-muted-foreground">הוספת חלק או סימן</p>}
        {sources.map((source, index) => {
          const section = shuSections.find((section) => section.id === source.shuSectionId);
          const siman = section?.simanim.find((siman) => siman.id === source.simanId);
          const simanLabel = siman ? ' סימן ' + toHebrewNumeral(siman.siman) : '';
          const removeLabel = 'הסרת סימן ' + (index + 1) + (section ? ': ' + section.name + simanLabel : '');
          const usedSimanim = selectedSimanim.filter((selected) => selected.id !== source.id);
          return (
            <div key={source.id} className="flex items-end gap-1 rounded-xl border border-transparent p-0 md:border-border md:bg-background/40 md:p-1">
              <ShulchanAruchSubFilters
                shuSections={shuSections} sourceRef={source} onRefChange={updateSource}
                usedSimanim={usedSimanim} className="grid min-w-0 flex-1 grid-cols-2 gap-2"
              />
              <Button
                data-remove-source
                type="button" variant="ghost" aria-label={removeLabel}
                onClick={(event) => removeSource(index, event.currentTarget)}
                className="h-6.5 px-2 text-[0.6875rem] leading-(--text-xs--line-height) text-muted-foreground hover:bg-destructive/10 hover:text-destructive md:h-8 md:text-xs"
              >
                הסר
              </Button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
