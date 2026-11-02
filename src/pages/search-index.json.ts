import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const prerender = true;

export const GET: APIRoute = async () => {
  const [posts,glossary,atlas,guides,categories] = await Promise.all([
    getCollection('posts', x => !x.data.draft),
    getCollection('glossary', x => !x.data.draft),
    getCollection('atlas', x => !x.data.draft),
    getCollection('labelGuides', x => !x.data.draft),
    getCollection('categories')
  ]);
  const names = new Map(categories.map(x => [x.id.replace(/\.json$/, ''), x.data.name]));
  const slug = (x:{id:string}) => x.id.replace(/\.(mdoc|json)$/, '').split('/').pop();
  const records = [
    ...posts.map(x => ({
      title:x.data.title,excerpt:x.data.excerpt,
      category:names.get(x.data.category) || x.data.category,href:'/yazi/'+slug(x)
    })),
    ...glossary.map(x => ({
      title:x.data.name,excerpt:x.data.definition,
      category:'Eczacılık Sözlüğü',href:'/sozluk/'+slug(x)
    })),
    ...atlas.map(x => ({
      title:x.data.name,excerpt:x.data.summary,
      category:'Bileşen Atlası',href:'/atlas/'+slug(x)
    })),
    ...guides.map(x => ({
      title:x.data.title,excerpt:x.data.summary,
      category:'Etiket Rehberi',href:'/etiket-rehberi/'+slug(x)
    }))
  ];
  return new Response(JSON.stringify(records),{
    headers: {
      'Content-Type':'application/json; charset=utf-8',
      'Cache-Control':'public, max-age=3600',
      'X-Robots-Tag':'noindex'
    }
  });
};
