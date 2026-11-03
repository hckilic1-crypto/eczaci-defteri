import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import type { TopicHub } from './topic-hubs';

type Post = CollectionEntry<'posts'>;
type Atlas = CollectionEntry<'atlas'>;
type Term = CollectionEntry<'glossary'>;
type Guide = CollectionEntry<'labelGuides'>;
type Entry = Post | Atlas | Term | Guide;
const slugOf = (e:Entry) => e.id.replace(/\.(mdoc|json)$/, '').split('/').pop() || '';

export interface HubEntry { title:string; excerpt:string; href:string; section:string }
export interface HubResources {
  posts:HubEntry[]; atlas:HubEntry[]; glossary:HubEntry[]; guides:HubEntry[];
  total:number;
}
export async function resourcesForHub(hub:TopicHub):Promise<HubResources> {
  const [posts,atlas,glossary,guides] = await Promise.all([
    getCollection('posts',x=>!x.data.draft),
    getCollection('atlas',x=>!x.data.draft),
    getCollection('glossary',x=>!x.data.draft),
    getCollection('labelGuides',x=>!x.data.draft)
  ]);
  const ordered = <T extends Entry>(items:T[], keys:string[], format:(item:T)=>HubEntry) => {
    const byId = new Map(items.map(item=>[slugOf(item),item]));
    return keys.map(k=>byId.get(k)).filter((x):x is T=>!!x).map(format);
  };
  const groups={
    posts:ordered(posts,hub.posts,x=>({title:x.data.title,excerpt:x.data.excerpt,href:'/yazi/'+slugOf(x),section:'YAZI'})),
    atlas:ordered(atlas,hub.atlas,x=>({title:x.data.name,excerpt:x.data.summary,href:'/atlas/'+slugOf(x),section:'ATLAS'})),
    glossary:ordered(glossary,hub.glossary,x=>({title:x.data.name,excerpt:x.data.definition,href:'/sozluk/'+slugOf(x),section:'SÖZLÜK'})),
    guides:ordered(guides,hub.guides,x=>({title:x.data.title,excerpt:x.data.summary,href:'/etiket-rehberi/'+slugOf(x),section:'REHBER'}))
  };
  return {...groups,total:groups.posts.length+groups.atlas.length+groups.glossary.length+groups.guides.length};
}
