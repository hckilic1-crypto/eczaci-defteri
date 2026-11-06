import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { readdir } from 'node:fs/promises';
import { join, relative, resolve, extname } from 'node:path';

export const prerender = true;

const publicRoot = resolve('public');
const mediaDirs = ['images/posts', 'uploads'];
const allowed = new Set(['.webp', '.png', '.jpg', '.jpeg', '.gif', '.avif', '.svg']);
const derived = /-(?:480|800|1200)\.webp$/i;

async function listImages(directory: string): Promise<string[]> {
  const folder = join(publicRoot, directory);
  let entries;
  try { entries = await readdir(folder, { withFileTypes: true }); }
  catch (err: any) {
    if (err?.code === 'ENOENT') return [];
    throw err;
  }
  const result: string[] = [];
  for (const entry of entries) {
    const rel = join(directory, entry.name);
    if (entry.isDirectory()) result.push(...await listImages(rel));
    else if (entry.isFile() && allowed.has(extname(entry.name).toLowerCase()) && !derived.test(entry.name)) {
      result.push('/' + relative(publicRoot, join(publicRoot, rel)).split('\\').join('/'));
    }
  }
  return result;
}

export const GET: APIRoute = async () => {
  const [paths, records] = await Promise.all([
    Promise.all(mediaDirs.map(listImages)).then(groups => groups.flat()),
    getCollection('imageSeo')
  ]);
  const recordMap = new Map(records.map(r => [r.data.sourcePath, r.id.replace(/\.json$/, '')]));
  const items = paths.map(path => ({
    path,
    name: path.split('/').pop(),
    type: path.startsWith('/uploads/') ? 'Yazı içi görsel' : 'Kapak görseli',
    seoSlug: recordMap.get(path) || null
  })).sort((a, b) => a.path.localeCompare(b.path, 'tr'));

  return new Response(JSON.stringify({generatedAt: new Date().toISOString(), total: items.length, items}), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
      'X-Robots-Tag': 'noindex'
    }
  });
};
