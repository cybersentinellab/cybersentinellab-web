import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Fields shared by every editorial collection (matches /admin CMS config)
const editorial = ({ image }: { image: () => z.ZodTypeAny }) =>
  z.object({
    title: z.string(),
    date: z.coerce.date(),
    author: z.string().default('Cyber Sentinel Lab'),
    cover: image().optional(),
    coverAlt: z.string().optional(),
    excerpt: z.string(),
    tags: z.array(z.string()).default([]),
    seoTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    draft: z.boolean().default(false),
  });

const md = (dir: string) => glob({ pattern: '**/*.{md,mdx}', base: `./src/content/${dir}` });

const blog = defineCollection({ loader: md('blog'), schema: editorial });
const articles = defineCollection({ loader: md('articles'), schema: editorial });
const news = defineCollection({ loader: md('news'), schema: editorial });
const caseStudies = defineCollection({
  loader: md('case-studies'),
  schema: ({ image }) =>
    editorial({ image }).extend({ client: z.string().optional(), industry: z.string().optional() }),
});

const services = defineCollection({
  loader: md('services'),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      titleAccent: z.string().optional(), // word(s) shown in italic serif
      order: z.number().default(99),
      icon: z.string().default('shield'),
      summary: z.string(),
      intro: z.string(),
      date: z.coerce.date().optional(),
      author: z.string().optional(),
      cover: image().optional(),
      excerpt: z.string().optional(),
      tags: z.array(z.string()).default([]),
      features: z.array(z.object({ title: z.string(), text: z.string() })).default([]),
      steps: z.array(z.object({ title: z.string(), text: z.string() })).default([]),
      outcomes: z.array(z.string()).default([]),
      faqs: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
      seoTitle: z.string().optional(),
      metaDescription: z.string().optional(),
    }),
});

const team = defineCollection({
  loader: md('team'),
  schema: ({ image }) =>
    z.object({
      title: z.string(), // person's name
      role: z.string(),
      order: z.number().default(99),
      photo: image().optional(),
      linkedin: z.string().url().optional(),
      excerpt: z.string().optional(),
      date: z.coerce.date().optional(),
    }),
});

const testimonials = defineCollection({
  loader: md('testimonials'),
  schema: z.object({
    title: z.string(), // person's name
    role: z.string().optional(),
    company: z.string().optional(),
    quote: z.string(),
    date: z.coerce.date().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog, articles, news, caseStudies, services, team, testimonials };
