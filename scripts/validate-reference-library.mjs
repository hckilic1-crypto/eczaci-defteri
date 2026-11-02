import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const root = 'src/content';
const dirs = ['glossary', 'posts', 'atlas', 'label-guides', 'evidence', 'comparisons'];
const names = new Map();
const content = new Map();
let errors = 0;
const fail = (file, message) => { console.error('[Kütüphane] ' + file + ': ' + message); errors++; };

for (const dir of dirs) {
  const files = (await readdir(join(root, dir))).filter(f =>
    f.endsWith(dir === 'posts' ? '.mdoc' : '.json'));
  names.set(dir, new Set(files.map(f => f.replace(/\.(json|mdoc)$/, ''))));
  if (!['glossary', 'posts'].includes(dir)) {
    for (const file of files) {
      const path = join(root, dir, file);
      try {
        const entry = JSON.parse(await readFile(path, 'utf8'));
        content.set(path, { dir, entry });
      } catch (e) { fail(path, 'JSON okunamadı: ' + String(e)); }
    }
  }
}
const required = {
  atlas: ['name','category','summary','mechanism','clinical','evidence','dose','warnings','interactions','labelTip','sourceLabel','sourceUrl'],
  'label-guides': ['title','category','summary','label','meaning','example','pitfall','checklist','sourceLabel','sourceUrl'],
  evidence: ['title','area','claim','verdict','summary','evidence','limits','practical','sourceLabel','sourceUrl'],
  comparisons: ['title','area','summary','leftName','rightName','leftDetail','rightDetail','keyDifference','practical','warning','sourceLabel','sourceUrl']
};
const linked = {
  atlas: { glossarySlug:'glossary', relatedArticleSlug:'posts' },
  'label-guides': { relatedAtlasSlug:'atlas' },
  evidence: { relatedAtlasSlug:'atlas' },
  comparisons: { leftAtlasSlug:'atlas', rightAtlasSlug:'atlas' }
};
for (const [file, { dir, entry }] of content) {
  for (const field of required[dir]) {
    if (typeof entry[field] !== 'string' || !entry[field].trim()) fail(file, 'Eksik veya boş alan: ' + field);
  }
  if (entry.draft !== false && entry.draft !== true) fail(file, 'draft bir boolean olmalı');
  try {
    if (new URL(entry.sourceUrl).protocol !== 'https:') fail(file, 'Kaynak URL HTTPS değil');
  } catch { fail(file, 'Geçersiz kaynak URL'); }
  for (const [field, target] of Object.entries(linked[dir])) {
    if (entry[field] && !names.get(target)?.has(entry[field])) {
      fail(file, field + ': ' + entry[field] + ' hedefi bulunamadı');
    }
  }
}
for (const dir of ['atlas','label-guides','evidence','comparisons']) {
  console.log(dir + ': ' + names.get(dir)?.size + ' kayıt');
}
if (errors) {
  console.error(errors + ' kütüphane doğrulama hatası');
  process.exitCode = 1;
} else {
  console.log('Kütüphane veri şeması ve iç bağlantılar doğrulandı.');
}
