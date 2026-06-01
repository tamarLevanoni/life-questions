'use client';

import { useState } from 'react';
import type { CategoryFilterBarProps, UiShasRef } from '@/lib/types';
import { toHebrewNumeral } from '@/lib/hebrew-numerals';
import { SearchCombobox, type FilterOption } from './search-combobox';

type ShasSubProps = {
  masechtot: CategoryFilterBarProps['masechtot'];
  sourceRef: UiShasRef;
  onRefChange: (updated: UiShasRef) => void;
  usedDafs?: { masechetId: string; daf: number }[];
  className?: string;
};

export function ShasSubFilters({ masechtot, sourceRef, onRefChange, usedDafs = [], className }: ShasSubProps) {
  const [masechetOpen, setMasechetOpen] = useState(false);
  const [dafOpen, setDafOpen] = useState(false);

  const masechetOptions = masechtot.map((m) => ({ value: m.id, label: m.name }));
  const activeMasechet = sourceRef.masechetId;
  const activeMasechetLabel = masechetOptions.find((o) => o.value === activeMasechet)?.label;

  const dafOptions: FilterOption[] = (() => {
    const pages = masechtot.find((m) => m.id === activeMasechet)?.pages ?? [];
    const takenDafs = new Set(
      usedDafs.filter((u) => u.masechetId === activeMasechet).map((u) => u.daf)
    );
    const seen = new Set<number>();
    return pages.flatMap((p) => {
      if (seen.has(p.daf)) return [];
      seen.add(p.daf);
      if (takenDafs.has(p.daf)) return [];
      return [{ value: String(p.daf), label: toHebrewNumeral(p.daf) }];
    });
  })();
  const activeDaf = sourceRef.daf !== undefined ? String(sourceRef.daf) : undefined;
  const activeDafLabel = dafOptions.find((o) => o.value === activeDaf)?.label;

  const handleMasechetSelect = (value: string) => {
    onRefChange({ ...sourceRef, masechetId: activeMasechet === value ? undefined : value, daf: undefined });
    setMasechetOpen(false);
  };
  const handleDafSelect = (value: string) => {
    onRefChange({ ...sourceRef, daf: activeDaf === value ? undefined : Number(value) });
    setDafOpen(false);
  };

  return (
    <div className={className ?? 'flex items-center gap-2'}>
      <SearchCombobox
        open={masechetOpen} onOpenChange={setMasechetOpen}
        fieldLabel="מסכת" label={activeMasechetLabel ?? 'בחרו מסכת...'} activeValue={activeMasechet}
        onClear={() => handleMasechetSelect(activeMasechet!)}
        options={masechetOptions} onSelect={handleMasechetSelect}
        placeholder="חיפוש מסכת..." popoverWidth="w-[250px]" fullWidth
      />
      <SearchCombobox
        open={dafOpen} onOpenChange={setDafOpen}
        fieldLabel="דף" label={activeDafLabel ?? 'בחרו דף...'} activeValue={activeDaf}
        onClear={() => handleDafSelect(activeDaf!)}
        options={activeMasechet ? dafOptions : []} onSelect={handleDafSelect}
        placeholder="חיפוש דף..." popoverWidth="w-[200px]" fullWidth
      />
    </div>
  );
}
