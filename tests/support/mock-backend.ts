import { makeBundle, makeCard, makeStory, testUser } from '../fixtures/data';
import { apiSecret, backendPort } from './environment';
import type { UserData } from '@/lib/schemas';
import { cursorSearchBodySchema } from '@/lib/schemas/search';

let users = new Map<string, UserData>();
let requests: { method: string; path: string; body: unknown }[] = [];
let contactFailure = false;
let userFailure = false;
function reset() {
  users = new Map([[testUser.googleId, structuredClone(testUser)]]);
  requests = []; contactFailure = false; userFailure = false;
}
reset();
const ok = (data: unknown) => Response.json({ success: true, data });
const fail = (error: string, status: number) => Response.json({ success: false, error }, { status });
const bundle = makeBundle();

const server = Bun.serve({
  hostname: '127.0.0.1', port: backendPort,
  async fetch(request) {
    const url = new URL(request.url);
    const path = url.pathname;
    if (path === '/health') return new Response('ready');
    if (request.headers.get('x-api-secret') !== apiSecret) return fail('Unauthorized', 401);
    if (path === '/__test/reset' && request.method === 'POST') { reset(); return ok(null); }
    if (path === '/__test/requests') return ok(requests);
    if (path === '/__test/contact-failure' && request.method === 'POST') { contactFailure = true; return ok(null); }
    if (path === '/__test/user-failure' && request.method === 'POST') { userFailure = true; return ok(null); }
    const body = request.method === 'GET' ? null : await request.json().catch(() => null);
    requests.push({ method: request.method, path, body });
    const references: Record<string, unknown> = {
      '/api/reference/masechtot': bundle.masechtot, '/api/reference/shu-sections': bundle.shuSections,
      '/api/reference/topics': bundle.topics, '/api/reference/books': bundle.books,
      '/api/stories/featured': bundle.featuredStories, '/api/stories/weekly': bundle.weeklyStory, '/api/recommendations': [],
    };
    if (path in references) return ok(references[path]);
    if (path === '/api/stories/sitemap' && request.method === 'GET') {
      const page = Number(url.searchParams.get('page') ?? 1);
      const limit = Number(url.searchParams.get('limit') ?? 50);
      const ids = Array.from({ length: 12 }, (_, index) => ({ id: makeCard(index + 1).id }));
      return ok({ stories: ids.slice((page - 1) * limit, page * limit), hasMore: page * limit < ids.length });
    }
    if (path === '/api/stories/search' && request.method === 'POST') {
      const parsed = cursorSearchBodySchema.safeParse(body);
      if (!parsed.success) return fail('Invalid search request', 422);
      if (!request.headers.has('x-search-account')) return fail('Missing search account', 401);
      const cursor = 'cursor' in parsed.data ? parsed.data.cursor : undefined;
      const q = 'cursor' in parsed.data ? undefined : parsed.data.q;
      if (q === 'שגיאה') return fail('Search unavailable', 503);
      if (q === 'לא תקין') return ok({ stories: 'invalid' });
      if (q === 'איטי') await Bun.sleep(800);
      const total = q === 'ללא תוצאות' ? 0 : 12;
      const cards = Array.from({ length: total }, (_, index) => makeCard(index + 1));
      if (cursor?.resultSetId === '827e2261-2c40-4dec-b4c5-5b63f0b4c0fe') return fail('search_expired', 410);
      const offset = cursor?.offset ?? 0;
      const resultSetId = q === 'פג תוקף' ? '827e2261-2c40-4dec-b4c5-5b63f0b4c0fe' : '8de628de-e275-416f-b8c1-2b492ad10876';
      return ok({
        stories: cards.slice(offset, offset + 10), total, pageSize: 10,
        nextCursor: offset + 10 < total ? { resultSetId, offset: offset + 10 } : null,
        searchMeta: { status: total ? 'complete' : 'no_useful_match', matches: {} },
      });
    }
    if (/^\/api\/stories\/story-\d+$/.test(path)) {
      const id = Number(path.split('-').at(-1));
      return id > 0 && id <= 12 ? ok(makeStory(id)) : fail('Not found', 404);
    }
    if (path.startsWith('/api/users/google/')) {
      const user = users.get(decodeURIComponent(path.slice('/api/users/google/'.length)));
      return user ? ok(user) : fail('Not found', 404);
    }
    if (path === '/api/users' && request.method === 'POST') {
      if (userFailure) return fail('User mutation unavailable', 503);
      const user = { ...(body as Omit<UserData, 'id'>), id: 'user-new' };
      users.set(user.googleId, user); return ok(user);
    }
    if (path.startsWith('/api/users/profile/') && request.method === 'PATCH') {
      if (userFailure) return fail('User mutation unavailable', 503);
      const found = [...users.values()].find(user => path.endsWith('/' + user.id));
      if (!found) return fail('Not found', 404);
      const user = { ...found, ...(body as Partial<UserData>) };
      users.set(user.googleId, user); return ok(user);
    }
    if (path === '/api/contact' && request.method === 'POST') return contactFailure ? fail('Contact unavailable', 503) : ok(null);
    // Unknown endpoints fail: the mock cannot silently make an integration pass.
    return fail('Unimplemented mock endpoint: ' + path, 404);
  },
});
console.log(`Mock Core API listening on ${server.url}`);
process.on('SIGTERM', () => { server.stop(true); process.exit(0); });
process.on('SIGINT', () => { server.stop(true); process.exit(0); });
