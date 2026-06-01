'use client';

import { useState } from 'react';
import type { CategoryFilterBarProps, UiShuRef } from '@/lib/types';
import { toHebrewNumeral } from '@/lib/hebrew-numerals';
import { SearchCombobox, type FilterOption } from './search-combobox';

type ShuSubProps = {
  shuSections: CategoryFilterBarProps['shuSections'];
  sourceRef: UiShuRef;
  onRefChange: (updated: UiShuRef) => void;
  usedSimanim?: { shuSectionId: string; simanId: string }[];
  className?: string;
};

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
        fieldLabel="חלק" label={activeSectionLabel ?? 'בחרו חלק...'} activeValue={activeSection}
        onClear={() => handleSectionSelect(activeSection!)}
        options={sectionOptions} onSelect={handleSectionSelect}
        placeholder="חיפוש חלק..." popoverWidth="w-[250px]" fullWidth
      />
      <SearchCombobox
        open={simanOpen} onOpenChange={setSimanOpen}
        fieldLabel="סימן" label={activeSimanLabel ?? 'בחרו סימן...'} activeValue={activeSiman}
        onClear={() => handleSimanSelect(activeSiman!)}
        options={activeSection ? simanOptions : []} onSelect={handleSimanSelect}
        placeholder="חיפוש סימן..." popoverWidth="w-[280px]" fullWidth
      />
    </div>
  );
}
