import assert from 'node:assert/strict';
import { test } from 'node:test';
import { StrictMode, Suspense, use } from 'react';
import { renderToReadableStream, renderToString } from 'react-dom/server';
import { AppDataHydrator } from './app-data-hydrator';
import { useAppDataStore } from '@/lib/stores/app-data-store';
import type { AppDataBundle } from '@/lib/types';

function bundle(name: string): AppDataBundle {
  return {
    masechtot: [],
    shuSections: [],
    topics: [{ id: name, bookId: 'book', name, orderIndex: 0 }],
    books: [],
    featuredStories: [],
    weeklyStory: null,
  };
}

function Topics() {
  const topics = useAppDataStore((state) => state.topics);
  return <span>{topics.map((topic) => topic.name).join(',')}</span>;
}

test('consumers see the server bundle on their first render', () => {
  const html = renderToString(
    <StrictMode>
      <AppDataHydrator data={bundle('initial')}>
        <Topics />
      </AppDataHydrator>
    </StrictMode>
  );
  assert.equal(html, '<span>initial</span>');
});

test('a nested provider does not overwrite another provider', () => {
  const html = renderToString(
    <AppDataHydrator data={bundle('outer')}>
      <Topics />
      <AppDataHydrator data={bundle('inner')}>
        <Topics />
      </AppDataHydrator>
      <Topics />
    </AppDataHydrator>
  );
  assert.equal(html, '<span>outer</span><span>inner</span><span>outer</span>');
});

test('a suspended SSR consumer keeps its own bundle while another request renders', async () => {
  let resume!: () => void;
  const gate = new Promise<void>((resolve) => { resume = resolve; });
  function DelayedTopics() {
    use(gate);
    return <Topics />;
  }

  const stream = await renderToReadableStream(
    <AppDataHydrator data={bundle('first-request')}>
      <Suspense fallback={<span>loading</span>}>
        <DelayedTopics />
      </Suspense>
    </AppDataHydrator>
  );
  try {
    assert.equal(renderToString(
      <AppDataHydrator data={bundle('second-request')}>
        <Topics />
      </AppDataHydrator>
    ), '<span>second-request</span>');
  } finally {
    resume();
  }
  await stream.allReady;
  const html = await new Response(stream).text();
  assert.ok(html.includes('<span>first-request</span>'));
  assert.ok(!html.includes('second-request'));
});
