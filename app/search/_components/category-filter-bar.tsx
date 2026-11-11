'use client';

import { Tabs } from 'radix-ui';
import { cn } from '@/lib/utils';
import type { CategoryFilterBarProps } from '@/lib/types';
import { selectBooks, type SearchTab } from './search-filter-utils';
import { ShasSourceFilters } from './shas-source-filters';
import { ShuSourceFilters } from './shu-source-filters';
import { FilterCheckList } from './filter-check-list';
import styles from './search-layout.module.css';

interface Props extends CategoryFilterBarProps {
  activeTab: SearchTab;
  onTabChange: (value: SearchTab) => void;
}

const tabClass = 'flex min-h-7 min-w-0 flex-1 items-center justify-center gap-2 rounded-[0.375rem] px-2 py-0.5 text-[0.6875rem] font-semibold leading-4 text-muted-foreground transition-colors data-[state=active]:bg-primary/8 data-[state=active]:text-primary md:min-h-9 md:rounded-xl md:py-1.5 md:text-xs md:leading-6';
const headingClass = 'flex min-h-6 shrink-0 flex-wrap items-center justify-between gap-1 border-b border-border px-1.5 py-0.5 md:min-h-9 md:px-2 md:py-1.5';

export function CategoryFilterBar({ masechtot, shuSections, topics, books, activeFilters, onFiltersChange, activeTab, onTabChange, className }: Props) {
  const { bookIds = [], topicIds = [], shasRefs = [], shuRefs = [] } = activeFilters;
  const bookOptions = books.map((book) => ({ value: book.id, label: book.name }));
  const availableTopics = bookIds.length ? topics.filter((topic) => bookIds.includes(topic.bookId)) : topics;
  const topicOptions = availableTopics.map((topic) => ({ value: topic.id, label: topic.name }));
  const changeTab = (value: string) => {
    if (value === 'book-topic' || value === 'sources') onTabChange(value);
  };
  const toggleBook = (id: string) => {
    const selected = bookIds.includes(id) ? bookIds.filter((bookId) => bookId !== id) : [...bookIds, id];
    onFiltersChange(selectBooks(activeFilters, selected, topics));
  };
  const toggleTopic = (id: string) => {
    const selected = topicIds.includes(id) ? topicIds.filter((topicId) => topicId !== id) : [...topicIds, id];
    onFiltersChange({ ...activeFilters, topicIds: selected.length ? selected : undefined });
  };

  return (
    <Tabs.Root data-category-tabs dir="rtl" value={activeTab} onValueChange={changeTab} className={cn(styles.categoryTabs, className)}>
      <Tabs.List aria-label="מסלול סינון" className="flex gap-1 rounded-[0.5rem] border border-border bg-muted/40 p-0.5 md:gap-2 md:rounded-2xl md:bg-card">
        <Tabs.Trigger value="book-topic" className={tabClass}>ספר ונושא</Tabs.Trigger>
        <Tabs.Trigger value="sources" className={tabClass}>מקורות (שו״ע וש״ס)</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="book-topic" className="rounded-2xl focus-visible:outline-offset-4">
        <div data-book-topic className={cn(styles.bookTopic, 'grid grid-cols-2 overflow-hidden rounded-[0.5rem] border border-border bg-card md:rounded-2xl')}>
          <section aria-labelledby="book-filter-heading" className="flex min-h-0 min-w-0 flex-col border-b border-border md:border-e md:border-b-0">
            <div className={headingClass}>
              <h2 id="book-filter-heading" className="flex items-center gap-1.5 text-[0.6875rem] font-medium leading-(--text-xs--line-height) md:text-xs md:font-semibold md:leading-normal">בחירת ספר</h2>
              <span className="text-[11px] text-muted-foreground md:text-xs">{bookIds.length} נבחרו</span>
            </div>
            <FilterCheckList
              options={bookOptions} selected={bookIds} onToggle={toggleBook}
              listClassName={cn(styles.bookList, 'min-h-0 flex-1')} label="ספרים"
            />
          </section>
          <section aria-labelledby="topic-filter-heading" className="flex min-h-0 min-w-0 flex-col">
            <div className={headingClass}>
              <h2 id="topic-filter-heading" className="flex items-center gap-1.5 text-[0.6875rem] font-medium leading-(--text-xs--line-height) md:text-xs md:font-semibold md:leading-normal">בחירת נושא</h2>
              <span className="text-[11px] text-muted-foreground md:text-xs">{topicIds.length} נבחרו</span>
            </div>
            <FilterCheckList
              options={topicOptions} selected={topicIds} onToggle={toggleTopic}
              listClassName="min-h-0 flex-1" searchable label="נושאים"
            />
          </section>
        </div>
      </Tabs.Content>
      <Tabs.Content value="sources" className="rounded-2xl focus-visible:outline-offset-4">
        <div className="grid gap-2 md:grid-cols-2">
          <ShuSourceFilters
            shuSections={shuSections} sources={shuRefs}
            onChange={(sources) => onFiltersChange({ ...activeFilters, shuRefs: sources })}
          />
          <ShasSourceFilters
            masechtot={masechtot} sources={shasRefs}
            onChange={(sources) => onFiltersChange({ ...activeFilters, shasRefs: sources })}
          />
        </div>
      </Tabs.Content>
    </Tabs.Root>
  );
}
