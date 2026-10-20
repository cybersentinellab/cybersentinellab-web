# Cyber Sentinel Lab — website

The website for **cybersentinellab.com**. It is a fast static site with a free content manager, and it costs nothing to host.

| Part | What it is |
|---|---|
| Site | [Astro](https://astro.build) static site, with React/Motion only where animation is needed |
| Hosting | Cloudflare Pages (free), which rebuilds automatically on every change to `main` |
| CMS | [Decap CMS](https://decapcms.org) at `/admin`, using a GitHub sign-in and an editorial workflow |
| Contact form | Cloudflare Pages Function, protected by Turnstile and a honeypot, which sends through Microsoft 365 |
| Analytics | Cloudflare Web Analytics, which uses no cookies |

---

## 1. Put the site online (Cloudflare Pages)

1. Create a free account at **dash.cloudflare.com**.
2. Go to **Workers & Pages → Create → Pages → Connect to Git**, authorise GitHub, and pick **cybersentinellab/cybersentinellab-web**.
3. Enter these build settings:
   - Framework preset: **Astro**
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Environment variable: `NODE_VERSION` = `22`
4. Click **Save and Deploy**. After about 2 minutes the site is live at `https://<project>.pages.dev`.
   - This is your **preview URL**. Share it for review before the domain is switched.
   - Every other branch or pull request gets its own preview URL.
   - Draft posts are shown on preview branches and hidden on `main`.

## 2. Environment variables

Set these in **Pages → Settings → Variables and secrets**. Add each one to **Production** (and to Preview where you want it there too).

| Name | Used for | Where to get it |
|---|---|---|
| `NODE_VERSION` | Build | `22` |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` | CMS sign-in | Step 3 |
| `PUBLIC_TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET` | Contact-form spam protection | Step 5 |
| `MS_TENANT_ID` / `MS_CLIENT_ID` / `MS_CLIENT_SECRET` | Sending form emails through Microsoft 365 | Step 4 |
| `MAIL_FROM` | M365 mailbox the form sends from, e.g. `info@cybersentinellab.com` | — |
| `MAIL_TO` | (Optional) Where enquiries arrive. Defaults to `MAIL_FROM` | — |
| `PUBLIC_CF_BEACON` | Web Analytics token | Step 6 |

Mark the secrets (`*_SECRET`) as **Encrypted**. After changing variables, go to **Deployments → Retry deployment** so they take effect.

## 3. Content manager (CMS) sign-in

The CMS lives at **`/admin`**, and editors sign in with their own GitHub account.

1. Logged in to GitHub as **cybersentinellab**, go to **Settings → Developer settings → OAuth Apps → New OAuth App**. Fill in:
   - Application name: `CSL Website CMS`
   - Homepage URL: `https://cybersentinellab.com`
   - Authorization callback URL: `https://cybersentinellab.com/api/callback`
     - Before the domain is switched, use `https://<project>.pages.dev/api/callback` instead, and change it at launch.
2. Copy the **Client ID**. Then generate a **Client secret** and copy it too.
3. In Cloudflare, add both as `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`, then redeploy.
4. Open `https://<your-site>/admin` and click **Login with GitHub**.

### Adding editors

1. In GitHub, open the repo and go to **Settings → Collaborators → Add people**. Invite the editor's GitHub account with the **Write** role.
2. Once they accept, they can sign in at `/admin` and write blog posts, articles, news and case studies.

### Approval workflow (Draft → In Review → Ready)

- When an editor saves, the post becomes a **Draft**. Moving it to **In Review** opens a GitHub pull request.
- **Email notifications:** GitHub emails the admin (vishalfeel@gmail.com, or whichever GitHub account owns the repo) for every new pull request.
  - Make sure **GitHub → Settings → Notifications → Email** is on, and that you are **Watching** the repo (Watch → All activity).
- Only the admin should publish. To enforce that, open the repo and go to **Settings → Branches → Add branch protection rule**:
  - Branch name pattern: `main`
  - Turn on **Require a pull request before merging** and **Require approvals (1)**.
  - Under the bypass list, allow only the admin.
- The admin publishes by clicking **Publish** in `/admin`, or **Merge** on the pull request. The site rebuilds in about 2 minutes.

The three starter blog posts are marked **"Hide from site (draft)"**. To publish one, open it in `/admin`, untick that box and publish.

## 4. Contact form email (Microsoft 365)

Cloudflare's own email sending would require moving your MX records away from Microsoft 365. So the form sends through your existing M365 mailbox instead, using a free app registration:

1. Go to **entra.microsoft.com → App registrations → New registration**. Name it `CSL Website Form` (single tenant), then register.
2. Copy the **Directory (tenant) ID** into `MS_TENANT_ID`, and the **Application (client) ID** into `MS_CLIENT_ID`.
3. Go to **Certificates & secrets → New client secret** and copy the **Value** into `MS_CLIENT_SECRET`. Note its expiry date in your calendar.
4. Go to **API permissions → Add → Microsoft Graph → Application permissions → Mail.Send → Add**, then **Grant admin consent**.
5. *(Recommended)* Limit the app so it can only send as one mailbox. As an Exchange admin in PowerShell:
   ```powershell
   New-ApplicationAccessPolicy -AppId <MS_CLIENT_ID> -PolicyScopeGroupId info@cybersentinellab.com -AccessRight RestrictAccess -Description "Website form"
   ```
6. Set `MAIL_FROM` to that mailbox, then redeploy. Submit a test enquiry on `/contact`.

## 5. Spam protection (Turnstile)

1. In Cloudflare, go to **Turnstile → Add widget**. Name it `CSL website` and add hostnames `cybersentinellab.com` and `<project>.pages.dev`. Choose the **Managed** mode.
2. Copy the **Site key** into `PUBLIC_TURNSTILE_SITE_KEY`, and the **Secret key** into `TURNSTILE_SECRET`. Then redeploy.

## 6. Analytics

Go to **Cloudflare → Analytics & Logs → Web Analytics → Add a site**. Choose the manual JS snippet and copy the `token` value into `PUBLIC_CF_BEACON`. No cookie banner is needed.

## 7. Move DNS from GoDaddy to Cloudflare (keeping Microsoft 365 email)

Do this once, ideally a day before launch:

1. In Cloudflare, go to **Add a site** and enter `cybersentinellab.com` on the **Free** plan.
2. In GoDaddy, go to **DNS → ⋯ → Export zone file**. In Cloudflare, go to **DNS → Records → Import** and upload that file.
3. Check that these records exist in Cloudflare with the cloud set to **DNS only** (grey):
   - **MX** pointing to `…mail.protection.outlook.com`
   - **TXT** SPF containing `include:spf.protection.outlook.com`
   - **TXT** `MS=…` verification
   - **CNAME** `autodiscover` pointing to `autodiscover.outlook.com`
   - Any `selector1._domainkey` / `selector2._domainkey` DKIM CNAMEs
   - Any Teams/Skype `_sip`, `_sipfederationtls`, `lyncdiscover` and `sip` records
4. In GoDaddy, switch **DNSSEC off** if it is on. Then go to **Domain → Nameservers → Change → "I'll use my own nameservers"** and enter the two Cloudflare nameservers.
5. Wait for Cloudflare's "site is active" email. Then send and receive a test email, and check that **M365 admin → Settings → Domains** shows no errors.

The current website keeps working during this step.

## 8. Launch: point cybersentinellab.com to the new site

1. Go to **Pages → your project → Custom domains → Set up a domain**. Add `cybersentinellab.com`, then add `www.cybersentinellab.com`. Cloudflare creates the DNS records for you.
2. Go to **Rules → Redirect Rules** and add a rule that redirects `www` to the apex domain (301).
3. Update the GitHub OAuth app callback URL to `https://cybersentinellab.com/api/callback`.
4. In **Google Search Console**, add the domain and submit `https://cybersentinellab.com/sitemap-index.xml`.

---

## Editing the site

- **Blog, articles, news, case studies, team, testimonials, services:** use `/admin`.
- **Offices, phone numbers, WhatsApp, navigation:** edit `src/data/site.ts`.
- **Industries:** edit `src/data/industries.ts`.
- **Client and partner logos:** add images to `public/images/logos/` and list them in `src/data/logos.ts`.
- **Colours and fonts (re-skin the whole site):** edit the tokens at the top of `src/styles/global.css` (`--bg`, `--accent`, `--deep`…). The hero animations read the same colours.
- **Hero animations:** live in `src/components/hero/`. One is picked at random on each visit. To preview a specific one, add `?hero=dome`, `?hero=globe`, `?hero=network` or `?hero=fortress` to the URL.

## SEO and AI search

- Every page has a unique title and meta description, a canonical URL, and Open Graph and Twitter cards.
- JSON-LD covers Organization, ProfessionalService (Dubai), Service, FAQPage, BlogPosting and BreadcrumbList.
- The site includes `sitemap-index.xml`, `rss.xml`, a `robots.txt` that allows GPTBot, ClaudeBot, PerplexityBot and Google-Extended, and an auto-generated `/llms.txt`.
- Each service page has an FAQ section written to be quoted by AI answer engines.

## Local development

```bash
npm install
npm run dev               # http://localhost:4321 (drafts visible)
SHOW_DRAFTS=1 npm run build && npm run preview
```

Plan and progress logs are in [PLAN.md](PLAN.md) and [PROGRESS.md](PROGRESS.md).
