# PROGRESS

## Current phase
v2 (branch `v2`, Worker `cybersentinellab-web-v2`) — new design built, awaiting CSL review. v1 frozen on branch `v1` (= `main`).

## v2 — "Perimeter" design (21 Oct 2026)
- Light theme so the logo is used exactly as supplied (green wordmark + tri-colour triangle)
- Palette from the logo: green #40870a (+ #2f6a05 for text/buttons), triangle yellow/pink/red mapped to Assess/Protect/Respond; cool paper #f3f6f2, ink #13221a
- One typeface: Archivo variable (125% width bold for display, 100% for reading)
- Hero: the logo triangle as a live perimeter (canvas, src/components/hero/perimeter.ts); threats are caught on the segment they hit. One hero instead of four random ones (single strong idea)
- Services regrouped by phase (new `phase` field): Assess / Protect / Respond / Technology
- Services updated from Google Sheet: GRC → Compliance & Risk Advisory (+UAE IA); infra split into Infrastructure & Technology Services (+hardware, POS, cameras, CCTV AI) and Software & Brand Development; new IT Services & Licensing (Microsoft licensing, Copilot, Acronis, 1Password) and Fintech & Mobility Solutions. Zero Trust and OT/IoT/IoMT kept. 14 services total
- Lighthouse (local): 100/100/100/100 with SITE_URL set to production (preview is noindex by design)

Previous (v1) status: All 11 phases built. Waiting for CSL: Cloudflare Pages setup (README §1) to get the preview URL, then review.

## Decisions (from CSL, 20 Oct 2026)
- Hosting: Cloudflare Pages; DNS moves from GoDaddy to Cloudflare; M365 email records preserved
- Form: Pages Function + Turnstile + honeypot → info@cybersentinellab.com
- WhatsApp: +971 55 881 7003
- Analytics: Cloudflare Web Analytics
- CMS: Decap, editorial workflow, GitHub PR emails as notifications
- Admin: Vishal Sood (vishalfeel@gmail.com); main branch protected
- Collections: blog, articles, news, case studies, team, testimonials, services (empty sections hidden)
- Brand: navy/black + electric cyan; logo tri-colour as subtle accent; white wordmark on dark
- Logos: client + partner logos approved for display
- Industries: 7 from brief + Education, Aviation & Logistics (+ others if relevant)
- Stats: 25+ years, 30+ clients "and growing…" only
- Legal name: Cyber Sentinel Lab LLC FZ; privacy/terms drafted as templates for legal review
- Language: English, Arabic-ready
- 3 starter blog posts as drafts

## Questions for CSL
- (resolved) Denmark postcode is 9400
- GitHub: repo github.com/cybersentinellab/cybersentinellab-web created; Claude needs push access (pending)
- Partner/client logo files: higher-res versions would help (currently cropping from the profile PDF).

- Services Google Sheet: not shared with the Google account connected to Claude (permission denied). Please share it (Viewer) with the connected account, or publish it. Using the services from the company profile meanwhile.

## Done
- Plan written
- Logo assets: white wordmark + transparent icon (design/assets). Clean SVG trace planned for Phase 2
- Design directions rendered: design/out-*.png (A Command Center, B Sentinel Editorial)

- Phase 1: Astro 7 + React + Motion + MDX + sitemap + RSS installed; base layout; build passes
- Phase 2: theme tokens (src/styles/global.css), Header (mobile menu), Footer, Base layout (SEO meta, OG/Twitter, JSON-LD, breadcrumbs, WhatsApp button, scroll reveal, CF analytics via PUBLIC_CF_BEACON), Icon set, traced SVG logos + favicon, content collections config
- 11 service pages' content written (src/content/services) from the company profile, clubbed: OT+IoT+IoMT; pen test; assessment+vuln mgmt; TI+brand protection; EDR/NDR; zero trust; cloud; GRC; IR+forensics; training; infra+software
- Phase 3: 4 canvas hero scenes (src/components/hero), random per visit, ?hero=dome|globe|network|fortress forces one; lazy-loaded after idle; reduced motion = static frame; Motion (motion/mini) for fade-in
- Phase 4: pages — home, about, services (+11), industries (+10), contact, privacy, terms, 404. Client (17) and partner (24) logos cropped from the profile PDF to public/images/logos
- Phase 6: Decap CMS at /admin (editorial workflow; collections blog, articles, news, case studies, services, team, testimonials); GitHub OAuth via Pages Functions /api/auth + /api/callback
- Phase 7: Insights list (search + type filter), post pages, tag pages, RSS; 3 starter blog posts as drafts (draft: true — visible on preview builds only)
- Phase 8: /api/contact — honeypot + Turnstile + Microsoft Graph sendMail; tested locally with mocks
- Phase 9: robots.txt (AI crawlers allowed), /llms.txt (auto), sitemap, RSS, JSON-LD, _headers (CSP, HSTS, caching), OG image
- Phase 10: Lighthouse (mobile, local) 100/100/100/100 on home, services, service, about, contact, industry, insights, post (SEO on draft posts is lower only because drafts are noindex)
- Phase 11: README with Cloudflare Pages, env vars, CMS OAuth, editors, branch protection, M365 mail, Turnstile, analytics, DNS move and launch steps

## Next (needs CSL)
1. Connect repo to Cloudflare Pages → preview URL (README §1)
2. Share the services Google Sheet with the connected Google account → update services
3. Create GitHub OAuth app + env vars (README §3), M365 app (README §4), Turnstile (README §5)
4. Review copy, then legal review of privacy/terms templates
5. Optional: alternative colour schemes (tokens in src/styles/global.css)

## Notes
- Contact form email: Cloudflare Email Routing would take over MX and break M365, so the form will send through Microsoft Graph (M365 app registration, Mail.Send). Setup in README.
