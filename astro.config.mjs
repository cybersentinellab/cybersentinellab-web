import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://cybersentinellab.com',
  trailingSlash: 'never',
  build: { format: 'directory' },
  integrations: [react(), mdx(), sitemap({ filter: (p) => !p.includes('/admin') })],
});
