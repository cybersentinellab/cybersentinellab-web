# PROGRESS

## Current phase
Phase 9 — SEO / AI-SEO

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

## Notes
- Contact form email: Cloudflare Email Routing would take over MX and break M365, so the form will send through Microsoft Graph (M365 app registration, Mail.Send). Setup in README.
