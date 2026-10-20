# CSL Website — Build Plan

Astro static site · React islands only for animation · Motion · Decap CMS (GitHub backend, editorial workflow) · Cloudflare Pages + Pages Functions · Cloudflare Web Analytics · English (Arabic-ready structure).

Each phase ends with: PROGRESS.md updated + git commit.

| # | Phase | Output |
|---|-------|--------|
| 0 | Design directions | 2 visual directions (home + service page) as images → CSL picks one |
| 1 | Project setup | Astro + React + Motion, Tailwind-free CSS tokens, folder structure, lint, base layout, git |
| 2 | Design system | Colours, type scale, spacing, buttons, cards, header/nav (mobile menu), footer, logo SVGs |
| 3 | Hero animations | 4 SVG/Canvas + Motion heroes (shield dome, globe intercept, node constellation, binary fortress), random pick, lazy-loaded, reduced-motion static fallback |
| 4 | Core pages | Home, About, Industries (9), Contact (offices, WhatsApp, form UI), Privacy, Terms, 404 |
| 5 | Services | Read Google Sheet → services overview + one page per service (club where sensible), FAQ per service |
| 6 | CMS | Decap at /admin, collections (blog, articles, news, case studies, team, testimonials, services), editorial workflow, 3 draft blog posts |
| 7 | Blog / Insights | List + detail pages, tags, client-side search (Pagefind), RSS |
| 8 | Contact backend | Pages Function + Turnstile + honeypot → email to info@ |
| 9 | SEO / AI-SEO | Meta, OG/Twitter, canonicals, JSON-LD (Organization, LocalBusiness, Service, BlogPosting, FAQPage, BreadcrumbList), sitemap, robots.txt (AI crawlers allowed), /llms.txt |
| 10 | Polish & testing | Scroll animations, counters, image pipeline (WebP), accessibility pass, Lighthouse 95+ on all 4 |
| 11 | Deploy guide | README: GitHub repo, Cloudflare Pages, DNS move from GoDaddy (keep M365 email), CMS login, adding editors, branch protection |
