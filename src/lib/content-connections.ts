import type { CollectionEntry } from 'astro:content';

type Term = CollectionEntry<'glossary'>;
type Atlas = CollectionEntry<'atlas'>;
type Post = CollectionEntry<'posts'>;
type Guide = CollectionEntry<'labelGuides'>;

export type ContentLink = { title: string; description: string; href: string };
export type ContentLinkGroup = { label: string; title: string; links: ContentLink[] };

const slug = (entry: { id: string }) =>
  entry.id.replace(/\.(json|mdoc)$/, '').split('/').pop() || '';
const path = {
  glossary: (item: Term) => '/sozluk/' + slug(item),
  atlas: (item: Atlas) => '/atlas/' + slug(item),
  post: (item: Post) => '/yazi/' + slug(item),
  guide: (item: Guide) => '/etiket-rehberi/' + slug(item)
};

const normalize = (s: string) => s.toLocaleLowerCase('tr-TR')
  .replace(/ı/g, 'i')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9]+/g, ' ')
  .trim().replace(/\s+/g, ' ');

const contains = (haystack: string, needle: string) =>
  (' ' + haystack + ' ').includes(' ' + needle + ' ');

/** Approved concept variants. No broad substring matching ('alt' in 'alternatif'). */
const variants: Record<string, string[]> = {
  '5-htp':['5-htp','5 hidroksitriptofan'],
  'ashwagandha':['ashwagandha','withania somnifera'],
  'azelaik-asit':['azelaik asit'],
  'b12-vitamini':['b12','b12 vitamini','kobalamin','siyanokobalamin','metilkobalamin'],
  'bakuchiol':['bakuchiol'],
  'beta-glukan':['beta glukan'],
  'c-vitamini':['c vitamini','askorbik asit'],
  'cinko':['cinko','cinko pikolinat','cinko bisglisinat'],
  'd-vitamini':['d vitamini','d3 vitamini','d2 vitamini','kolekalsiferol','ergokalsiferol'],
  'demir':['demir','ferroz','ferrik','ferritin'],
  'ginseng':['panax ginseng','ginseng','ginsenozit'],
  'glukozamin':['glukozamin','glukozamin sulfat'],
  'gunes-koruyucu':['gunes koruyucu','gunes kremi','spf','uva','uvb'],
  'hyaluronik-asit':['hyaluronik asit','sodyum hyaluronat'],
  'k2-vitamini':['k2 vitamini','mk 7','mk 4','menakinon'],
  'kollajen':['kollajen','kolajen peptitleri','kolajen'],
  'kreatin':['kreatin','kreatin monohidrat'],
  'kurkumin':['kurkumin','zerdecal'],
  'l-karnitin':['l karnitin','karnitin'],
  'l-teanin':['l teanin','teanin'],
  'lutein':['lutein','zeaksantin'],
  'magnezyum':['magnezyum','magnezyum bisglisinat','magnezyum sitrat'],
  'melatonin':['melatonin','sirkadiyen'],
  'nane-yagi':['nane yagi','mentol','peppermint'],
  'niasinamid':['niasinamid','nikotinamid'],
  'omega-3':['omega 3','balik yagi','epa','dha'],
  'pantenol':['pantenol','panthenol','provitamin b5'],
  'prebiyotik':['prebiyotik','sinbiyotik','postbiyotik','inulin','fos','gos'],
  'probiyotik':['probiyotik','cfu','probiyotik sus','saccharomyces boulardii'],
  'psyllium':['psyllium','karniyarik otu'],
  'retinal':['retinal','retinaldehit'],
  'retinol':['retinol','retinil palmitat'],
  'salisilik-asit':['salisilik asit','bha'],
  'seramid':['seramid','seramidler','seramid np'],
  'traneksamik-asit':['traneksamik asit']
};

const atlasPhrases = (item: Atlas) => {
  const name = item.data.name.split('(')[0];
  const words = [slug(item).replace(/-/g, ' '), name, ...(variants[slug(item)] || [])]
    .map(normalize).filter(x => x.length >= 3);
  return [...new Set(words)];
};

const matchAtlas = (item: Atlas, title: string, summary = '') => {
  const t = normalize(title), s = normalize(summary);
  return Math.max(0, ...atlasPhrases(item).map(phrase =>
    contains(t, phrase) ? 20 : contains(s, phrase) ? 6 : 0
  ));
};

const approved = <T extends { data: { draft?: boolean } }>(entries: T[]) =>
  entries.filter(x => !x.data.draft);

const rank = <T>(items: T[], score: (item: T) => number, limit: number) =>
  items.map(item => ({item, score: score(item)})).filter(x => x.score > 0)
    .sort((a,b) => b.score-a.score)
    .slice(0,limit).map(x => x.item);

const termKeywords = (term: Term) => {
  const label = term.data.name.split('(')[0].trim();
  return normalize(label);
};

export const atlasForTerm = (term: Term, items: Atlas[], limit = 3) =>
  rank(approved(items), item => {
    if (item.data.glossarySlug === slug(term)) return 120;
    const t = termKeywords(term);
    return Math.max(0, ...atlasPhrases(item).map(k =>
      t === k ? 45 : t.startsWith(k + ' ') ? 24 : k.startsWith(t + ' ') && t.length >= 5 ? 15 : 0
    ));
  },limit);

export const atlasForPost = (post: Post, items: Atlas[], limit = 5) =>
  rank(approved(items), item =>
    (item.data.relatedArticleSlug === slug(post) ? 150 : 0) +
    matchAtlas(item, post.data.title,post.data.excerpt),limit);

export const postsForAtlas = (item: Atlas, posts: Post[], limit = 3) =>
  rank(approved(posts), post =>
    (item.data.relatedArticleSlug === slug(post) ? 150 : 0) +
    matchAtlas(item,post.data.title,post.data.excerpt),limit);

const guideAtlasScore = (item: Guide, atlas: Atlas) =>
  (item.data.relatedAtlasSlug === slug(atlas) ? 120 : 0) +
  matchAtlas(atlas,item.data.title,item.data.summary);

export const guidesForAtlas = (atlas: Atlas, guides: Guide[], limit = 4) =>
  rank(approved(guides), guide => guideAtlasScore(guide,atlas),limit);

export const atlasForGuide = (guide: Guide, atlases: Atlas[], limit = 3) =>
  rank(approved(atlases), atlas => guideAtlasScore(guide,atlas),limit);

export const guidesForPost = (post: Post, guides: Guide[], atlases: Atlas[],limit = 3) => {
  const related = atlasForPost(post,atlases,7);
  const keys = new Set(related.map(slug));
  return rank(approved(guides), guide =>
    (guide.data.relatedAtlasSlug && keys.has(guide.data.relatedAtlasSlug) ? 80 : 0) +
    (related.some(atlas => guideAtlasScore(guide,atlas) >= 20) ? 35 : 0) +
    (contains(normalize(post.data.title), normalize(guide.data.title)) ? 20 : 0)
  ,limit);
};

export const postsForGuide = (guide: Guide, posts: Post[], atlases: Atlas[], limit = 3) => {
  const related = atlasForGuide(guide,atlases,3);
  const keys = new Set(related.map(slug));
  return rank(approved(posts), post =>
    (related.some(atlas => atlas.data.relatedArticleSlug === slug(post)) ? 150 : 0) +
    (contains(normalize(post.data.title), normalize(guide.data.title)) ? 40 : 0) +
    (atlasForPost(post,related,3).some(atlas => keys.has(slug(atlas))) ? 8 : 0)
  ,limit);
};

export const termsForAtlas = (atlas: Atlas, terms: Term[], limit = 5) =>
  rank(approved(terms), term => {
    if (atlas.data.glossarySlug === slug(term)) return 150;
    const t = termKeywords(term);
    return Math.max(0,...atlasPhrases(atlas).map(k =>
      t === k ? 60 : t.startsWith(k+' ') ? 30 : k.startsWith(t+' ') && t.length >= 5 ? 16 : 0
    ));
  },limit);

export const termsForGuide = (guide: Guide, terms: Term[], atlases: Atlas[], limit = 4) => {
  const related = atlasForGuide(guide,atlases,3);
  return rank(approved(terms), term => {
    if (related.some(atlas => atlas.data.glossarySlug === slug(term))) return 130;
    const phrase = termKeywords(term);
    return phrase.length >= 4 && contains(normalize(guide.data.title),phrase) ? 35 : 0;
  },limit);
};

export const guidesForTerm = (term: Term, atlases: Atlas[], guides: Guide[], limit=3) => {
  const related = atlasForTerm(term,atlases,3);
  return rank(approved(guides), guide =>
    Math.max(0,...related.map(atlas => guideAtlasScore(guide,atlas))),limit);
};

export const link = {
  term: (item: Term): ContentLink => ({title:item.data.name,description:'Eczacılık sözlüğünde tanım',href:path.glossary(item)}),
  atlas: (item: Atlas): ContentLink => ({title:item.data.name,description:'Bileşen Atlası · Klinik bilgi ve güvenlilik',href:path.atlas(item)}),
  post: (item: Post): ContentLink => ({title:item.data.title,description:'Blog yazısı · Ayrıntılı inceleme',href:path.post(item)}),
  guide: (item: Guide): ContentLink => ({title:item.data.title,description:'Etiket Okuma Rehberi · Uygulamalı örnek',href:path.guide(item)})
};

export const group = (label: string, title: string, links: ContentLink[]): ContentLinkGroup =>
  ({label,title,links});
