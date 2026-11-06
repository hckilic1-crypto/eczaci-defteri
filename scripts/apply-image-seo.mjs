/**
 * Build-time image SEO aliases.
 * Original files stay available so old image URLs and Markdoc links do not break.
 * Records are edited in Keystatic > Görsel SEO Yönetimi.
 */
import { readdir, readFile, copyFile, mkdir, writeFile, stat } from 'node:fs/promises';
import { resolve, join, extname, dirname, relative, sep } from 'node:path';
import sharp from 'sharp';

const publicDir = resolve('public');
const metadataDir = resolve('src/content/image-seo');
const manifestPath = resolve('src/generated/image-seo.json');
const roots = ['/images/posts/', '/uploads/'];
const types = new Set(['.webp', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.avif']);
const optimizeTypes = new Set(['.webp', '.png', '.jpg', '.jpeg', '.avif']);
const widths = [480, 800, 1200];
const manifest = Object.create(null);

const slug = text => String(text || '').trim().toLocaleLowerCase('tr-TR')
  .replace(/ı/g,'i').replace(/ğ/g,'g').replace(/ü/g,'u')
  .replace(/ş/g,'s').replace(/ö/g,'o').replace(/ç/g,'c')
  .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
  .replace(/[^a-z0-9-]+/g,'-').replace(/^-+|-+$/g,'').replace(/-+/g,'-');

let files = [];
try { files = (await readdir(metadataDir)).filter(f => f.endsWith('.json')); }
catch (error) { if (error.code !== 'ENOENT') throw error; }
const destinations = new Set();
for (const file of files) {
  const data = JSON.parse(await readFile(join(metadataDir, file), 'utf8'));
  const source = String(data.sourcePath || '').trim();
  if (!roots.some(prefix => source.startsWith(prefix)) ||
      source.includes('..') || source.includes('\\') || source.includes('?') || source.includes('#')) {
    throw new Error('[image-seo] Geçersiz kaynak yolu (' + file + '): ' + source);
  }
  const extension = extname(source).toLowerCase();
  if (!types.has(extension)) throw new Error('[image-seo] Desteklenmeyen uzantı: ' + source);
  const folder = slug(data.folder), name = slug(data.fileName);
  if (!folder || !name || !String(data.alt || '').trim()) {
    throw new Error('[image-seo] Klasör, dosya adı ve ALT zorunludur: ' + file);
  }
  const destUrl = '/images/seo/' + folder + '/' + name + extension;
  if (destinations.has(destUrl)) throw new Error('[image-seo] Çakışan hedef yol: ' + destUrl);
  destinations.add(destUrl);
  const sourceFile = resolve(publicDir, '.' + source);
  const destFile = resolve(publicDir, '.' + destUrl);
  const sourceStats = await stat(sourceFile).catch(() => null);
  if (!sourceStats?.isFile()) throw new Error('[image-seo] Görsel dosyası yok: ' + source);
  await mkdir(dirname(destFile), { recursive: true });
  await copyFile(sourceFile, destFile);
  const variants = [];
  if (optimizeTypes.has(extension)) {
    const meta = await sharp(sourceFile).metadata();
    for (const width of widths) {
      if (!meta.width || meta.width < width) continue;
      const variantUrl = '/images/seo/' + folder + '/' + name + '-' + width + '.webp';
      const variantFile = resolve(publicDir, '.' + variantUrl);
      await sharp(sourceFile).rotate().resize({ width, withoutEnlargement:true })
        .webp({ quality: width >= 1200 ? 78 : 75, effort: 4 }).toFile(variantFile);
      variants.push({ width, url: variantUrl });
    }
  }
  manifest[source] = {
    src: destUrl,
    alt: String(data.alt).trim(),
    title: String(data.seoTitle || '').trim(),
    description: String(data.description || '').trim(),
    variants
  };
}
await mkdir(dirname(manifestPath), { recursive:true });
await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
console.log('[image-seo] ' + files.length + ' görsel SEO kaydı işlendi. Orijinal yollar korundu.');
