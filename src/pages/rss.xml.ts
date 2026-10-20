import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPosts, postUrl } from '../lib/posts';
import { site } from '../data/site';

export async function GET(context: APIContext) {
  const posts = (await getPosts()).filter((p) => !p.data.draft);
  return rss({
    title: `${site.name} — Insights`,
    description: 'Cybersecurity guidance, analysis and news from Cyber Sentinel Lab.',
    site: context.site!,
    items: posts.map((p) => ({ title: p.data.title, description: p.data.excerpt, pubDate: p.data.date, link: postUrl(p), categories: p.data.tags, author: p.data.author })),
    customData: '<language>en</language>',
  });
}
