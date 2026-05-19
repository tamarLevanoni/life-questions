'use client';

import { useState } from 'react';
import type { CategoryFilterBarProps, UiSearchFilters } from '@/lib/types';
import { toHebrewNumeral } from '@/lib/hebrew-numerals';
import { SearchCombobox, type FilterOption } from './search-combobox';

type SubProps = { activeFilters: UiSearchFilters; onFiltersChange: (f: UiSearchFilters) => void };

export function ShasSubFilters({ masechtot, activeFilters, onFiltersChange }: SubProps & {
  masechtot: CategoryFilterBarProps['masechtot'];
}) {
  const [masechetOpen, setMasechetOpen] = useState(false);
  const [dafOpen, setDafOpen] = useState(false);

  const masechetOptions = masechtot.map((m) => ({ value: m.id, label: m.name }));
  const activeMasechet = activeFilters.masechetId;
  const activeMasechetLabel = masechetOptions.find((o) => o.value === activeMasechet)?.label;

  const dafOptions: FilterOption[] = (() => {
    const pages = masechtot.find((m) => m.id === activeMasechet)?.pages ?? [];
    const seen = new Set<number>();
    return pages.flatMap((p) => {
      if (seen.has(p.daf)) return [];
      seen.add(p.daf);
      return [{ value: String(p.daf), label: `דף ${toHebrewNumeral(p.daf)}` }];
    });
  })();
  const activeDaf = activeFilters.daf !== undefined ? String(activeFilters.daf) : undefined;
  const activeDafLabel = dafOptions.find((o) => o.value === activeDaf)?.label;

  const handleMasechetSelect = (value: string) => {
    onFiltersChange({ ...activeFilters, masechetId: activeMasechet === value ? undefined : value, daf: undefined });
    setMasechetOpen(false);
  };
  const handleDafSelect = (value: string) => {
    onFiltersChange({ ...activeFilters, daf: activeDaf === value ? undefined : Number(value) });
    setDafOpen(false);
  };

  return (
    <>
      <SearchCombobox
        open={masechetOpen} onOpenChange={setMasechetOpen}
        label={activeMasechetLabel ?? 'בחרו מסכת...'} activeValue={activeMasechet}
        onClear={() => handleMasechetSelect(activeMasechet!)}
        options={masechetOptions} onSelect={handleMasechetSelect}
        placeholder="חיפוש מסכת..." popoverWidth="w-[250px]"
      />
      {activeMasechet && (
        <SearchCombobox
          open={dafOpen} onOpenChange={setDafOpen}
          label={activeDafLabel ?? 'בחרו דף...'} activeValue={activeDaf}
          onClear={() => handleDafSelect(activeDaf!)}
          options={dafOptions} onSelect={handleDafSelect}
          placeholder="חיפוש דף..." popoverWidth="w-[280px]"
        />
      )}
    </>
  );
}

export function ShulchanAruchSubFilters({ shuSections, activeFilters, onFiltersChange }: SubProps & {
  shuSections: CategoryFilterBarProps['shuSections'];
}) {
  const [sectionOpen, setSectionOpen] = useState(false);
  const [simanOpen, setSimanOpen] = useState(false);

  const sectionOptions = shuSections.map((s) => ({ value: s.id, label: s.name }));
  const activeSection = activeFilters.shuSectionId;
  const activeSectionLabel = sectionOptions.find((o) => o.value === activeSection)?.label;

  const simanOptions: FilterOption[] = (() => {
    const section = shuSections.find((s) => s.id === activeSection);
    return (section?.simanim ?? []).map((s) => ({
      value: s.id,
      label: `סימן ${toHebrewNumeral(s.siman)}${s.title ? ` – ${s.title}` : ''}`,
    }));
  })();
  const activeSiman = activeFilters.simanId;
  const activeSimanLabel = simanOptions.find((o) => o.value === activeSiman)?.label;

  const handleSectionSelect = (value: string) => {
    onFiltersChange({ ...activeFilters, shuSectionId: activeSection === value ? undefined : value, simanId: undefined });
    setSectionOpen(false);
  };
  const handleSimanSelect = (value: string) => {
    onFiltersChange({ ...activeFilters, simanId: activeSiman === value ? undefined : value });
    setSimanOpen(false);
  };

  return (
    <>
      <SearchCombobox
        open={sectionOpen} onOpenChange={setSectionOpen}
        label={activeSectionLabel ?? 'בחרו חלק...'} activeValue={activeSection}
        onClear={() => handleSectionSelect(activeSection!)}
        options={sectionOptions} onSelect={handleSectionSelect}
        placeholder="חיפוש חלק..." popoverWidth="w-[250px]"
      />
      {activeSection && (
        <SearchCombobox
          open={simanOpen} onOpenChange={setSimanOpen}
          label={activeSimanLabel ?? 'בחרו סימן...'} activeValue={activeSiman}
          onClear={() => handleSimanSelect(activeSiman!)}
          options={simanOptions} onSelect={handleSimanSelect}
          placeholder="חיפוש סימן..." popoverWidth="w-[280px]"
        />
      )}
    </>
  );
}

export function ConceptsSubFilters({ topics, bookId, activeFilters, onFiltersChange }: SubProps & {
  topics: CategoryFilterBarProps['topics'];
  bookId?: string;
}) {
  const [topicOpen, setTopicOpen] = useState(false);

  const topicOptions = (bookId ? topics.filter((t) => t.bookId === bookId) : topics)
    .map((t) => ({ value: t.id, label: t.name }));
  const activeTopic = activeFilters.topicId;
  const activeTopicLabel = topicOptions.find((o) => o.value === activeTopic)?.label;

  const handleTopicSelect = (value: string) => {
    onFiltersChange({ ...activeFilters, topicId: activeTopic === value ? undefined : value });
    setTopicOpen(false);
  };

  return (
    <SearchCombobox
      open={topicOpen} onOpenChange={setTopicOpen}
      label={activeTopicLabel ?? 'בחרו נושא...'} activeValue={activeTopic}
      onClear={() => handleTopicSelect(activeTopic!)}
      options={topicOptions} onSelect={handleTopicSelect}
      placeholder="חיפוש נושא..." popoverWidth="w-[250px]"
    />
  );
}
