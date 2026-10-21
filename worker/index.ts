// Worker entry: routes /api/* to the handlers in functions/api, everything else to the static site.
import { onRequestGet as auth } from '../functions/api/auth';
import { onRequestGet as callback } from '../functions/api/callback';
import { onRequestPost as contact } from '../functions/api/contact';

interface Env { ASSETS: { fetch: (r: Request) => Promise<Response> }; [k: string]: unknown }

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(request.url);
    const ctx = { request, env: env as any };
    if (pathname === '/api/auth' && request.method === 'GET') return auth(ctx);
    if (pathname === '/api/callback' && request.method === 'GET') return callback(ctx);
    if (pathname === '/api/contact' && request.method === 'POST') return contact(ctx);
    if (pathname.startsWith('/api/')) return new Response('Not found', { status: 404 });
    return env.ASSETS.fetch(request);
  },
};
