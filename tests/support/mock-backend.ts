import { makeBundle, makeCard, makeStory, testUser } from '../fixtures/data';
import { apiSecret } from './environment';
import type { UserData } from '@/lib/schemas';

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
  hostname: '127.0.0.1', port: 4100,
  async fetch(request) {
    const path = new URL(request.url).pathname;
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
      '/api/stories/featured': bundle.featuredStories, '/api/stories/weekly': null, '/api/recommendations': [],
    };
    if (path in references) return ok(references[path]);
    if (path === '/api/stories/search' && request.method === 'POST') {
      const params = body as { q?: string; page?: number; limit?: number };
      if (params.q === 'שגיאה') return fail('Search unavailable', 503);
      if (params.q === 'לא תקין') return ok({ stories: 'invalid' });
      if (params.q === 'איטי') await Bun.sleep(800);
      const total = params.q === 'ללא תוצאות' ? 0 : 12;
      const page = params.page ?? 1; const limit = params.limit ?? 10;
      const cards = Array.from({ length: total }, (_, index) => makeCard(index + 1));
      return ok({ stories: cards.slice((page - 1) * limit, page * limit), total, page, limit });
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
