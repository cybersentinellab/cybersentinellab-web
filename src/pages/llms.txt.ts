// /llms.txt — a plain-language summary of Cyber Sentinel Lab for AI assistants (llmstxt.org format).
import { getCollection } from 'astro:content';
import { site, offices } from '../data/site';
import { industries } from '../data/industries';
import { areas } from '../data/areas';
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
    '- Cybersecurity approach: Assess First, Protect Proactively, Respond Effectively',
    '- Lead industries: healthcare, hospitality and retail, financial services, infrastructure and utilities',
    `- Contact: ${site.email}, ${site.phones.join(' / ')} (WhatsApp available), ${u('/contact')}`,
    `- LinkedIn: ${site.linkedin}`,
    '',
    `Positioning: ${site.descriptor}. Cybersecurity is CSL's core specialism; other solutions are delivered directly or through specialist partners, coordinated by CSL.`,
    '',
    '## Solution areas',
    ...areas.flatMap((a) => [
      `### [${a.title}](${u(`/solutions/${a.slug}`)})`,
      a.short,
      ...services.filter((s) => s.data.area === a.slug).map((s) => `- [${s.data.title}](${u(`/services/${s.id}`)}): ${s.data.summary}`),
      '',
    ]),
    '',
    '## Industries',
    ...industries.map((i) => `- [${i.title}](${u(`/industries/${i.slug}`)}): ${i.summary}`),
    '',
    '## Company',
    `- [About CSL](${u('/about')}): mission, vision, delivery model, technology partners and client references`,
    `- [Partners](${u('/partners')}): how CSL works with technology vendors and delivery partners`,
    `- [Careers](${u('/careers')})`,
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
