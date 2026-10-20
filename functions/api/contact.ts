// Contact form handler: honeypot + Cloudflare Turnstile, then sends the enquiry
// through Microsoft 365 (Microsoft Graph sendMail) so no extra email service is needed.
// Env: TURNSTILE_SECRET, MS_TENANT_ID, MS_CLIENT_ID, MS_CLIENT_SECRET, MAIL_FROM, MAIL_TO
interface Env {
  TURNSTILE_SECRET?: string;
  MS_TENANT_ID: string; MS_CLIENT_ID: string; MS_CLIENT_SECRET: string;
  MAIL_FROM: string; // M365 mailbox that sends, e.g. website@cybersentinellab.com or info@cybersentinellab.com
  MAIL_TO?: string;  // defaults to MAIL_FROM
}

const json = (body: object, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
const clip = (v: FormDataEntryValue | null, n: number) => String(v ?? '').trim().slice(0, n);

export const onRequestPost = async ({ request, env }: { request: Request; env: Env }) => {
  let f: FormData;
  try { f = await request.formData(); } catch { return json({ error: 'Invalid request.' }, 400); }

  // Honeypot: bots fill hidden fields. Pretend success.
  if (clip(f.get('website'), 200)) return json({ ok: true });

  const name = clip(f.get('name'), 120), email = clip(f.get('email'), 160), company = clip(f.get('company'), 160);
  const phone = clip(f.get('phone'), 40), service = clip(f.get('service'), 80), message = clip(f.get('message'), 5000);
  if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ error: 'Please fill in your name, a valid email and a message.' }, 400);
  if (!f.get('consent')) return json({ error: 'Please accept the privacy notice.' }, 400);

  if (env.TURNSTILE_SECRET) {
    const body = new FormData();
    body.append('secret', env.TURNSTILE_SECRET);
    body.append('response', clip(f.get('cf-turnstile-response'), 2048));
    body.append('remoteip', request.headers.get('CF-Connecting-IP') ?? '');
    const v = (await (await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body })).json()) as { success: boolean };
    if (!v.success) return json({ error: 'Spam check failed. Please refresh the page and try again.' }, 400);
  }

  // Microsoft Graph app-only token
  const tok = await fetch(`https://login.microsoftonline.com/${env.MS_TENANT_ID}/oauth2/v2.0/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ client_id: env.MS_CLIENT_ID, client_secret: env.MS_CLIENT_SECRET, scope: 'https://graph.microsoft.com/.default', grant_type: 'client_credentials' }),
  });
  const { access_token } = (await tok.json()) as { access_token?: string };
  if (!access_token) return json({ error: 'Our mail service is unavailable right now.' }, 502);

  const rows = [['Name', name], ['Email', email], ['Company', company], ['Phone', phone], ['Service', service]]
    .filter(([, v]) => v).map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#666">${k}</td><td>${esc(v)}</td></tr>`).join('');
  const html = `<h2 style="font-family:Arial">New website enquiry</h2><table style="font-family:Arial;font-size:14px">${rows}</table>
    <p style="font-family:Arial;font-size:14px;white-space:pre-wrap;border-top:1px solid #ddd;padding-top:12px">${esc(message)}</p>`;

  const send = await fetch(`https://graph.microsoft.com/v1.0/users/${encodeURIComponent(env.MAIL_FROM)}/sendMail`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${access_token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: {
        subject: `Website enquiry: ${name}${company ? ` (${company})` : ''}`,
        body: { contentType: 'HTML', content: html },
        toRecipients: [{ emailAddress: { address: env.MAIL_TO || env.MAIL_FROM } }],
        replyTo: [{ emailAddress: { address: email, name } }],
      },
      saveToSentItems: false,
    }),
  });
  if (!send.ok) return json({ error: 'We could not send your message.' }, 502);
  return json({ ok: true });
};
