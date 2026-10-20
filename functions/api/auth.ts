// Decap CMS → GitHub OAuth, step 1: send the editor to GitHub to sign in.
// Env: GITHUB_CLIENT_ID (Cloudflare Pages → Settings → Environment variables)
interface Env { GITHUB_CLIENT_ID: string }

export const onRequestGet = async ({ request, env }: { request: Request; env: Env }) => {
  const url = new URL(request.url);
  const state = crypto.randomUUID();
  const gh = new URL('https://github.com/login/oauth/authorize');
  gh.searchParams.set('client_id', env.GITHUB_CLIENT_ID);
  gh.searchParams.set('redirect_uri', `${url.origin}/api/callback`);
  gh.searchParams.set('scope', 'repo,user');
  gh.searchParams.set('state', state);
  return new Response(null, {
    status: 302,
    headers: {
      Location: gh.toString(),
      'Set-Cookie': `csl_oauth_state=${state}; Path=/api; HttpOnly; Secure; SameSite=Lax; Max-Age=600`,
    },
  });
};
