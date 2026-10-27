import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

export default defineConfig({
  // Live domain. Test branches (v1, v2) keep their own preview addresses.
  site: process.env.SITE_URL || 'https://cybersentinellab.com',
  trailingSlash: 'never',
  build: { format: 'directory' },
  integrations: [react(), mdx(), sitemap({ filter: (p) => !p.includes('/admin') })],
});
