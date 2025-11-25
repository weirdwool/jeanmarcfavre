// @ts-check
import { defineConfig } from 'astro/config';
import react from "@astrojs/react";
import sitemap from '@astrojs/sitemap';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  site: 'https://jeanmarcfavre.com',
  output: 'server', // Server mode to support API routes
  adapter: node({
    mode: 'standalone'
  }),
  publicDir: 'public',
  integrations: [
    react(),
    sitemap({
      filter: (page) => !page.includes('/api/') && !page.includes('/docs/'),
      customPages: [],
    })
  ],
  markdown: {
    // You can add options here if needed, like:
    // syntaxHighlight: 'shiki', // Or 'prism'
    // remarkPlugins: [],
    // rehypePlugins: [],
  }
});