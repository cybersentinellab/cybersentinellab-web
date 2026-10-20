# PROGRESS

## Current phase
Phase 0 — awaiting CSL's choice of design direction (A or B). Phase 1 scaffold done.

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

## Done
- Plan written
- Logo assets: white wordmark + transparent icon (design/assets). Clean SVG trace planned for Phase 2
- Design directions rendered: design/out-*.png (A Command Center, B Sentinel Editorial)

- Phase 1: Astro 7 + React + Motion + MDX + sitemap + RSS installed; base layout; build passes

## Notes
- Contact form email: Cloudflare Email Routing would take over MX and break M365, so the form will send through Microsoft Graph (M365 app registration, Mail.Send). Setup in README.
