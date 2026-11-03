/**
 * Generate responsive derivatives for real article covers before Astro builds.
 * Sources are left untouched; small listing images do not download 1200px covers.
 */
import { readdir, mkdir, stat, access, writeFile } from 'node:fs/promises';
import { join, relative, extname, basename, dirname, resolve } from 'node:path';
import sharp from 'sharp';

const root = resolve('public');
const postsDir = join(root, 'images', 'posts');
const manifestPath = resolve('src/generated/cover-variants.json');
const widths = [480, 800, 1200];
const supported = new Set(['.webp', '.jpg', '.jpeg', '.png']);
const variants = Object.create(null);
let savedBytes = 0;
let originalBytes = 0;
let sourceCount = 0;

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(path));
    else if (entry.isFile() && /^coverImage\.(webp|png|jpe?g)$/i.test(entry.name)) files.push(path);
  }
  return files;
}

try { await access(postsDir); }
catch {
  console.warn('[covers] No public/images/posts directory; skipping.');
  await mkdir(dirname(manifestPath), { recursive: true });
  await writeFile(manifestPath, '{}\n');
  process.exit(0);
}

const files = await walk(postsDir);
for (const source of files) {
  if (!supported.has(extname(source).toLowerCase())) continue;
  const meta = await sharp(source).metadata();
  if (!meta.width || !meta.height) {
    console.warn('[covers] Unknown dimensions; retaining original:', source);
    continue;
  }
  const input = await stat(source);
  const path = '/' + relative(root, source).split('\\').join('/');
  const candidates = [];
  for (const width of widths) {
    // Never upscale small images or publish misleading width descriptors.
    if (width > meta.width) continue;
    const destination = join(dirname(source), `${basename(source, extname(source))}-${width}.webp`);
    const destinationStat = await stat(destination).catch(() => null);
    if (!destinationStat || destinationStat.mtimeMs < input.mtimeMs) {
      await sharp(source)
        .rotate()
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: width === 1200 ? 78 : 75, effort: 4 })
        .toFile(destination);
    }
    const size = (await stat(destination)).size;
    savedBytes += size;
    candidates.push({ width, url: '/' + relative(root, destination).split('\\').join('/') });
  }
  if (candidates.length) {
    variants[path] = candidates;
    sourceCount++;
    originalBytes += input.size;
  }
}

await mkdir(dirname(manifestPath), { recursive: true });
await writeFile(manifestPath, JSON.stringify(variants, null, 2) + '\n');
console.log(`[covers] ${sourceCount} covers; ${Object.values(variants).reduce((n,a) => n+a.length,0)} responsive images generated (originals unchanged).`);
console.log(`[covers] Source covers: ${Math.round(originalBytes / 1024)} KiB; responsive variants total: ${Math.round(savedBytes / 1024)} KiB.`);
