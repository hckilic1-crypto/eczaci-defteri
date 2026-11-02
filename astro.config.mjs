import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import sitemap from '@astrojs/sitemap';
import keystatic from '@keystatic/astro';
import node from '@astrojs/node';
import { readdirSync, readFileSync } from 'node:fs';

// Indexable category pages must match the same published-content logic used by
// /kategori/[slug].astro. Noindex archives should not appear in the sitemap.
const contentRoot = new URL('./src/content/', import.meta.url);
const directory = (path) => readdirSync(new URL(path, contentRoot));
const publishedCategories = new Set();
const categoryParents = new Map();
for (const file of directory('categories/').filter(x => x.endsWith('.json'))) {
  const value = JSON.parse(readFileSync(new URL('categories/'+file,contentRoot),'utf8'));
  categoryParents.set(file.replace(/\.json$/,''),value.parent || null);
}
for (const file of directory('posts/').filter(x => x.endsWith('.mdoc'))) {
  const body = readFileSync(new URL('posts/'+file,contentRoot),'utf8');
  const header = body.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!header || /^draft:\s*true\s*$/m.test(header[1])) continue;
  const match = header[1].match(/^category:\s*['"]?([^\r\n'"]+)['"]?\s*$/m);
  if (!match) continue;
  let category = match[1].trim();
  const visited = new Set();
  while (category && !visited.has(category)) {
    visited.add(category);
    publishedCategories.add(category);
    category = categoryParents.get(category);
  }
}

const enableKeystatic = process.env.ENABLE_KEYSTATIC !== 'false';

export default defineConfig({
  site: 'https://eczacidefteri.com',
  output: 'server',
  security: {
    allowedDomains: [
      { hostname: 'eczacidefteri.com', protocol: 'https' },
      { hostname: 'www.eczacidefteri.com', protocol: 'https' }
    ]
  },
  adapter: node({mode: 'standalone'}),
  integrations: [
    react(),
    markdoc(),
    sitemap({
      filter: (page) => {
        const pathname = new URL(page).pathname.replace(/\/$/, '') || '/';
        if (pathname === '/404' || pathname === '/search-index.json' ||
            pathname.startsWith('/keystatic') || pathname.startsWith('/api/')) return false;
        if (pathname.startsWith('/kategori/')) {
          const name = decodeURIComponent(pathname.slice('/kategori/'.length));
          return publishedCategories.has(name);
        }
        return true;
      }
    }),
    ...(enableKeystatic ? [keystatic()] : [])
  ],
  trailingSlash: 'never'
});
