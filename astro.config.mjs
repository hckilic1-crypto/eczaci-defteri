import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import sitemap from '@astrojs/sitemap';
import keystatic from '@keystatic/astro';
import node from '@astrojs/node';

const enableKeystatic =
  process.env.ENABLE_KEYSTATIC !== 'false';

export default defineConfig({
  site: 'https://eczacidefteri.com',

  output: 'server',

  adapter: node({
    mode: 'standalone'
  }),

  integrations: [
    react(),
    markdoc(),

    sitemap({
      filter: (page) =>
        !page.includes('/keystatic')
    }),

    ...(enableKeystatic
      ? [keystatic()]
      : [])
  ],

  trailingSlash: 'never'
});