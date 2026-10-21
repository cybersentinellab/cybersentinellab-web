import { site, offices } from './site';

const hq = offices[0];

export const orgSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${site.url}/#org`,
      name: site.name,
      legalName: site.legalName,
      alternateName: site.short,
      url: site.url,
      logo: `${site.url}/images/logo-color.svg`,
      slogan: site.tagline,
      description: site.description,
      email: site.email,
      telephone: site.phones[0],
      sameAs: [site.linkedin, 'https://cybersentinel.dk', 'https://infi-pre.com'],
      areaServed: ['AE', 'SA', 'QA', 'KW', 'BH', 'OM', 'DK', 'EU', 'IN'],
    },
    {
      '@type': 'ProfessionalService',
      '@id': `${site.url}/#dubai`,
      name: `${site.name} — Dubai`,
      parentOrganization: { '@id': `${site.url}/#org` },
      url: site.url,
      image: `${site.url}/images/og-default.jpg`,
      email: hq.email,
      telephone: hq.phones?.[0],
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Meydan Road, Nad Al Sheba',
        addressLocality: 'Dubai',
        addressCountry: 'AE',
      },
      areaServed: 'United Arab Emirates',
    },
  ],
};

export const serviceSchema = (s: { title: string; summary: string; slug: string }) => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: s.title,
  description: s.summary,
  url: `${site.url}/services/${s.slug}`,
  serviceType: s.title,
  provider: { '@id': `${site.url}/#org` },
  areaServed: ['United Arab Emirates', 'GCC', 'Europe'],
});

export const faqSchema = (faqs: { q: string; a: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
});

export const articleSchema = (a: { title: string; description: string; url: string; date: Date; author: string; image?: string }) => ({
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: a.title,
  description: a.description,
  url: a.url,
  datePublished: a.date.toISOString(),
  author: { '@type': 'Organization', name: a.author },
  publisher: { '@id': `${site.url}/#org` },
  image: a.image,
  mainEntityOfPage: a.url,
});
