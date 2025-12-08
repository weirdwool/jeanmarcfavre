// @ts-check
import { defineConfig } from 'astro/config';
import react from "@astrojs/react";
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel/serverless';

// https://astro.build/config
export default defineConfig({
  site: 'https://jeanmarcfavre.com',
  output: 'server', // Server mode to support API routes
  adapter: vercel({
    webAnalytics: {
      enabled: false
    },
    speedInsights: {
      enabled: false
    }
  }),
  publicDir: 'public',
  integrations: [
    react(),
    sitemap({
      filter: (page) => 
        !page.includes('/api/') && 
        !page.includes('/docs/') && 
        !page.includes('/admin-login') && 
        !page.includes('/admin-blog'),
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