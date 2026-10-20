// /llms.txt — a plain-language summary of Cyber Sentinel Lab for AI assistants (llmstxt.org format).
import { getCollection } from 'astro:content';
import { site, offices } from '../data/site';
import { industries } from '../data/industries';
import { getPosts, postUrl } from '../lib/posts';

export async function GET() {
  const services = (await getCollection('services')).sort((a, b) => a.data.order - b.data.order);
  const posts = (await getPosts()).filter((p) => !p.data.draft).slice(0, 20);
  const u = (p: string) => `${site.url}${p}`;
  const lines = [
    `# ${site.name}`,
    '',
    `> ${site.description} Tagline: "${site.tagline}". Legal name: ${site.legalName}.`,
    '',
    'Key facts:',
    '- Headquarters: Meydan Road, Nad Al Sheba, Dubai, United Arab Emirates',
    `- Offices: ${offices.map((o) => o.region).join(', ')}`,
    '- Regions served: UAE, GCC and Europe',
    '- 25+ years of combined expertise; 30+ client references',
    '- Approach: Assess First, Protect Proactively, Respond Effectively',
    `- Contact: ${site.email}, ${site.phones.join(' / ')} (WhatsApp available), ${u('/contact')}`,
    `- LinkedIn: ${site.linkedin}`,
    '',
    '## Services',
    ...services.map((s) => `- [${s.data.title}](${u(`/services/${s.id}`)}): ${s.data.summary}`),
    '',
    '## Industries',
    ...industries.map((i) => `- [${i.title}](${u(`/industries/${i.slug}`)}): ${i.summary}`),
    '',
    '## Company',
    `- [About Cyber Sentinel Lab](${u('/about')}): mission, vision, approach, technology partners and client references`,
    `- [Contact](${u('/contact')}): offices in Dubai, Denmark and India`,
    '',
    ...(posts.length ? ['## Insights', ...posts.map((p) => `- [${p.data.title}](${u(postUrl(p))}): ${p.data.excerpt}`), ''] : []),
    '## Optional',
    `- [Privacy policy](${u('/privacy-policy')})`,
    `- [Sitemap](${u('/sitemap-index.xml')})`,
    '',
  ];
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
