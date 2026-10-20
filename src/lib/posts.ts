import { getCollection, type CollectionEntry } from 'astro:content';

export type Kind = 'blog' | 'articles' | 'news' | 'caseStudies';
export type Post = CollectionEntry<Kind>;

// Drafts are visible on preview builds (non-main branches) and when SHOW_DRAFTS=1.
const showDrafts =
  process.env.SHOW_DRAFTS === '1' || (!!process.env.CF_PAGES_BRANCH && process.env.CF_PAGES_BRANCH !== 'main') || import.meta.env.DEV;

export const kindMeta: Record<Kind, { label: string; path: string }> = {
  blog: { label: 'Blog', path: 'blog' },
  articles: { label: 'Article', path: 'articles' },
  news: { label: 'News', path: 'news' },
  caseStudies: { label: 'Case study', path: 'case-studies' },
};

export async function getPosts(kinds: Kind[] = ['blog', 'articles', 'news', 'caseStudies']) {
  const all = (await Promise.all(kinds.map((k) => getCollection(k)))).flat() as Post[];
  return all.filter((p) => showDrafts || !p.data.draft).sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export const postUrl = (p: Post) => `/insights/${kindMeta[p.collection as Kind].path}/${p.id}`;
export const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
export const fmtDate = (d: Date) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
