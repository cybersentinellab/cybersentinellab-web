// Decap CMS → GitHub OAuth, step 2: exchange the code for a token and hand it back to the CMS window.
// Env: GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET
interface Env { GITHUB_CLIENT_ID: string; GITHUB_CLIENT_SECRET: string }

const page = (status: 'success' | 'error', content: object) => {
  const msg = JSON.stringify(`authorization:github:${status}:${JSON.stringify(content)}`);
  return new Response(
    `<!doctype html><html><body><p>Signing you in…</p><script>
      (function () {
        function receive(e) { window.opener.postMessage(${msg}, e.origin); window.removeEventListener('message', receive); }
        window.addEventListener('message', receive, false);
        window.opener.postMessage('authorizing:github', '*');
      })();
    </script></body></html>`,
    { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } },
  );
};

export const onRequestGet = async ({ request, env }: { request: Request; env: Env }) => {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const cookie = request.headers.get('Cookie') ?? '';
  const saved = /csl_oauth_state=([^;]+)/.exec(cookie)?.[1];
  if (!code || !state || state !== saved) return page('error', { message: 'Invalid sign-in request. Please try again.' });

  const r = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json', 'User-Agent': 'csl-cms' },
    body: JSON.stringify({ client_id: env.GITHUB_CLIENT_ID, client_secret: env.GITHUB_CLIENT_SECRET, code, redirect_uri: `${url.origin}/api/callback` }),
  });
  const data = (await r.json()) as { access_token?: string; error_description?: string };
  if (!data.access_token) return page('error', { message: data.error_description ?? 'GitHub sign-in failed.' });
  return page('success', { token: data.access_token, provider: 'github' });
};
