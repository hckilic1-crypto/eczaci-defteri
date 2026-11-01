import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

// Generated with each deployment. No unpublished article content is exposed.
export const prerender = true;

export const GET: APIRoute = async () => {
  const [entries, categories] = await Promise.all([
    getCollection('posts'),
    getCollection('categories')
  ]);
  const categoryNames = new Map(
    categories.map(c => [c.id.replace(/\.json$/, '').split('/').pop() || c.id, c.data.name])
  );
  const published = entries.filter(p => !p.data.draft);
  const draftCount = entries.length - published.length;
  const categoryTotals = new Map<string, number>();
  const summary = {
    total: entries.length,
    published: published.length,
    draft: draftCount,
    cover: 0,
    customSeoTitle: 0,
    customSeoDescription: 0,
    references: 0,
    contextualLinks: 0,
  };

  const articles = published.map(p => {
    const d = p.data;
    const cover = Boolean(d.coverImage?.trim());
    const seoTitle = Boolean(d.seoTitle?.trim());
    const seoDescription = Boolean(d.seoDescription?.trim());
    const references = d.references?.length ?? 0;
    // With Astro's glob loader Markdoc source is kept in entry.body.
    const body = 'body' in p && typeof p.body === 'string' ? p.body : '';
    const contextualLinks = (body.match(/\]\(\/(?:yazi|kategori)\//g) ?? []).length;
    const category = categoryNames.get(d.category) || d.category;
    categoryTotals.set(category, (categoryTotals.get(category) || 0) + 1);

    if (cover) summary.cover++;
    if (seoTitle) summary.customSeoTitle++;
    if (seoDescription) summary.customSeoDescription++;
    if (references > 0) summary.references++;
    if (contextualLinks > 0) summary.contextualLinks++;

    return {
      slug: p.id.replace(/\.mdoc$/, ''),
      title: d.title,
      excerpt: d.excerpt,
      category,
      publishedAt: d.publishedAt.toISOString().slice(0, 10),
      cover,
      seoTitle,
      seoDescription,
      references,
      contextualLinks
    };
  }).sort((a, b) => b.publishedAt.localeCompare(a.publishedAt) || a.title.localeCompare(b.title, 'tr'));

  const result = {
    generatedAt: new Date().toISOString(),
    scope: 'repository-build',
    summary,
    categories: Array.from(categoryTotals, ([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'tr')),
    articles
  };

  return new Response(JSON.stringify(result), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
      'X-Robots-Tag': 'noindex'
    }
  });
};