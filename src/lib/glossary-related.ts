import type { CollectionEntry } from 'astro:content';

type Term = CollectionEntry<'glossary'>;
type Post = CollectionEntry<'posts'>;

export const glossarySlug = (term: Term) => term.id.replace(/\.json$/, '').split('/').pop() || '';
export const articleSlug = (post: Post) => post.id.replace(/\.mdoc$/, '').split('/').pop() || '';

/* Prioritise full words and editorially reviewed variants to avoid accidental
   matches, e.g. 'alt' inside 'alternatif'. */
const aliases: Record<string, string[]> = {
  'seramid': ['seramidler', 'seramidli'],
  'omega-3-yag-asitleri': ['omega-3', 'omega 3'],
  'probiyotik': ['probiyotikler'],
  'probiyotik-sus': ['probiyotik suş'],
  'sinbiyotik': ['sinbiyotikler'],
  'postbiyotik': ['postbiyotikler'],
  'prebiyotik': ['prebiyotikler'],
  'magnezyum-bisglisinat': ['magnezyum bisglisinat'],
  'd-vitamini': ['d vitamini'],
  'vitamin-d3': ['d3 vitamini', 'vitamin d3'],
  'spf': ['spf']
};

const normalize = (text: string) =>
  text.toLocaleLowerCase('tr-TR')
    .replace(/[ıİ]/g, 'i')
  .replace(/ğ/g, 'g').replace(/ş/g, 's').replace(/ç/g, 'c')
  .replace(/ö/g, 'o').replace(/ü/g, 'u')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');

const phrases = (term: Term): string[] =>
  [...new Set([term.data.name.split('(')[0].trim(),
    ...(aliases[glossarySlug(term)] || [])].map(normalize).filter(x => x.length >= 3))];

const contains = (text: string, term: string) =>
  (' ' + text + ' ').includes(' ' + term + ' ');

const relevance = (term: Term, post: Post) => {
  const title = normalize(post.data.title);
  const excerpt = normalize(post.data.excerpt);
  const options = phrases(term);
  return options.length ? Math.max(...options.map(p =>
    contains(title, p) ? 12 : contains(excerpt, p) ? 5 : 0)) : 0;
};

/* Only associate an article with a term if its title or summary mentions
   the exact concept; an unrelated article is worse than no article link. */
export const relatedTermsForPost = (post: Post, terms: Term[], limit = 9): Term[] =>
  terms.filter(t => !t.data.draft)
    .map(term => ({ term, score: relevance(term, post) }))
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score || a.term.data.name.localeCompare(b.term.data.name, 'tr'))
    .slice(0, limit).map(x => x.term);

export const relatedPostsForTerm = (term: Term, posts: Post[], limit = 4): Post[] =>
  posts.filter(p => !p.data.draft)
    .map(post => ({ post, score: relevance(term, post) }))
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score ||
      b.post.data.publishedAt.valueOf() - a.post.data.publishedAt.valueOf())
    .slice(0, limit).map(x => x.post);

export const relatedTermsForTerm = (term: Term, terms: Term[], limit = 6): Term[] => {
  const body = normalize(term.data.definition + ' ' + (term.data.explanation || ''));
  const own = phrases(term);
  return terms.filter(t => !t.data.draft && glossarySlug(t) !== glossarySlug(term))
    .map(other => {
      const otherBody = normalize(other.data.definition + ' ' + (other.data.explanation || ''));
      const direct = phrases(other).some(p => contains(body, p)) ? 20 : 0;
      const reverse = own.some(p => contains(otherBody, p)) ? 14 : 0;
      // Sharing a broad category alone is not a meaningful editorial link.
      return { other, score: direct + reverse };
    })
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score || a.other.data.name.localeCompare(b.other.data.name, 'tr'))
    .slice(0, limit).map(x => x.other);
};
