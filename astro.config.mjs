import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

export default defineConfig({
  // Preview URL until launch. At launch set build variable SITE_URL=https://cybersentinellab.com
  site: process.env.SITE_URL || 'https://v3.cybersentinellab-web-v2.pages.dev',
  trailingSlash: 'never',
  build: { format: 'directory' },
  integrations: [react(), mdx(), sitemap({ filter: (p) => !p.includes('/admin') })],
});
