'use client';

import { useState } from 'react';
import type { CategoryFilterBarProps, UiShasRef, UiShuRef } from '@/lib/types';
import { toHebrewNumeral } from '@/lib/hebrew-numerals';
import { SearchCombobox, type FilterOption } from './search-combobox';

type ShasSubProps = {
  masechtot: CategoryFilterBarProps['masechtot'];
  sourceRef: UiShasRef;
  onRefChange: (updated: UiShasRef) => void;
  usedDafs?: { masechetId: string; daf: number }[];
  className?: string;
};

type ShuSubProps = {
  shuSections: CategoryFilterBarProps['shuSections'];
  sourceRef: UiShuRef;
  onRefChange: (updated: UiShuRef) => void;
  usedSimanim?: { shuSectionId: string; simanId: string }[];
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
        fieldLabel="מסכת"
        label={activeMasechetLabel ?? 'בחרו מסכת...'} activeValue={activeMasechet}
        onClear={() => handleMasechetSelect(activeMasechet!)}
        options={masechetOptions} onSelect={handleMasechetSelect}
        placeholder="חיפוש מסכת..." popoverWidth="w-[250px]"
        fullWidth
      />
      <SearchCombobox
        open={dafOpen} onOpenChange={setDafOpen}
        fieldLabel="דף"
        label={activeDafLabel ?? 'בחרו דף...'} activeValue={activeDaf}
        onClear={() => handleDafSelect(activeDaf!)}
        options={activeMasechet ? dafOptions : []} onSelect={handleDafSelect}
        placeholder="חיפוש דף..." popoverWidth="w-[200px]"
        fullWidth
      />
    </div>
  );
}

export function ShulchanAruchSubFilters({ shuSections, sourceRef, onRefChange, usedSimanim = [], className }: ShuSubProps) {
  const [sectionOpen, setSectionOpen] = useState(false);
  const [simanOpen, setSimanOpen] = useState(false);

  const sectionOptions = shuSections.map((s) => ({ value: s.id, label: s.name }));
  const activeSection = sourceRef.shuSectionId;
  const activeSectionLabel = sectionOptions.find((o) => o.value === activeSection)?.label;

  const simanOptions: FilterOption[] = (() => {
    const section = shuSections.find((s) => s.id === activeSection);
    const takenSimanim = new Set(
      usedSimanim.filter((u) => u.shuSectionId === activeSection).map((u) => u.simanId)
    );
    return (section?.simanim ?? [])
      .filter((s) => !takenSimanim.has(s.id))
      .map((s) => ({ value: s.id, label: toHebrewNumeral(s.siman) }));
  })();
  const activeSiman = sourceRef.simanId;
  const activeSimanLabel = simanOptions.find((o) => o.value === activeSiman)?.label;

  const handleSectionSelect = (value: string) => {
    onRefChange({ ...sourceRef, shuSectionId: activeSection === value ? undefined : value, simanId: undefined });
    setSectionOpen(false);
  };
  const handleSimanSelect = (value: string) => {
    onRefChange({ ...sourceRef, simanId: activeSiman === value ? undefined : value });
    setSimanOpen(false);
  };

  return (
    <div className={className ?? 'flex items-center gap-2'}>
      <SearchCombobox
        open={sectionOpen} onOpenChange={setSectionOpen}
        fieldLabel="חלק"
        label={activeSectionLabel ?? 'בחרו חלק...'} activeValue={activeSection}
        onClear={() => handleSectionSelect(activeSection!)}
        options={sectionOptions} onSelect={handleSectionSelect}
        placeholder="חיפוש חלק..." popoverWidth="w-[250px]"
        fullWidth
      />
      <SearchCombobox
        open={simanOpen} onOpenChange={setSimanOpen}
        fieldLabel="סימן"
        label={activeSimanLabel ?? 'בחרו סימן...'} activeValue={activeSiman}
        onClear={() => handleSimanSelect(activeSiman!)}
        options={activeSection ? simanOptions : []} onSelect={handleSimanSelect}
        placeholder="חיפוש סימן..." popoverWidth="w-[280px]"
        fullWidth
      />
    </div>
  );
}
