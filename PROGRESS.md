# PROGRESS

## Current phase
Phase 0 — Design directions (awaiting CSL choice)

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
- Denmark postcode: 9400 (profile PDF) or 9430 (brief)? Using 9400 for now.
- GitHub repo: create an empty private repo (e.g. `cybersentinellab-web`) and share its name so code can be pushed.
- Partner/client logo files: higher-res versions would help (currently cropping from the profile PDF).

## Done
- Plan written
- Logo assets: white wordmark + transparent icon (design/assets). Clean SVG trace planned for Phase 2
- Design directions rendered: design/out-*.png (A Command Center, B Sentinel Editorial)

## Notes
- Contact form email: Cloudflare Email Routing would take over MX and break M365, so the form will send through Microsoft Graph (M365 app registration, Mail.Send). Setup in README.
