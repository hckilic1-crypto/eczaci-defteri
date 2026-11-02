import { readdir, readFile, mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const root = 'src/content';
const list = async dir => (await readdir(join(root,dir))).filter(f => f.endsWith(dir === 'posts' ? '.mdoc' : '.json'));
const json = async (dir,file) => JSON.parse(await readFile(join(root,dir,file),'utf8'));
const normalize = s => String(s||'').toLocaleLowerCase('tr-TR')
  .replace(/[ıİ]/g,'i').replace(/ğ/g,'g').replace(/ş/g,'s')
  .replace(/ç/g,'c').replace(/ö/g,'o').replace(/ü/g,'u')
  .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
  .replace(/[^\p{L}\p{N}]+/gu,' ').trim();

function frontmatter(source) {
  const text = source.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] || '';
  const lines = text.split(/\r?\n/);
  const values = {};
  let key = '';
  for (const line of lines) {
    const m = line.match(/^([a-zA-Z][a-zA-Z0-9]*):\s*(.*)$/);
    if (m) {
      key=m[1]; values[key]=m[2].trim();
    } else if (key && /^\s+\S/.test(line)) {
      if (['excerpt','seoDescription','seoTitle','title'].includes(key))
        values[key]+=' '+line.trim();
    } else if (line.trim()) key='';
  }
  for (const field of ['title','seoTitle','seoDescription','excerpt']) {
    if (values[field]) values[field]=values[field].replace(/^['"]|['"]$/g,'').replace(/^>-\s*/,'').trim();
  }
  return values;
}

const [termFiles,atlasFiles,guideFiles,postFiles] = await Promise.all([
  list('glossary'),list('atlas'),list('label-guides'),list('posts')
]);
const [terms,atlas,guides,posts] = await Promise.all([
  Promise.all(termFiles.map(async file => ({file,...await json('glossary',file)}))),
  Promise.all(atlasFiles.map(async file => ({file,...await json('atlas',file)}))),
  Promise.all(guideFiles.map(async file => ({file,...await json('label-guides',file)}))),
  Promise.all(postFiles.map(async file => {
    const source=await readFile(join(root,'posts',file),'utf8');
    return {file,...frontmatter(source),
      bodyWords: (source.replace(/^---\r?\n[\s\S]*?\r?\n---/, '')
        .replace(/[{}#*_[\]()]/g,' ').match(/\S+/g)||[]).length};
  }))
]);

const warnings=[];
const issue=(type,file,message)=>warnings.push({type,file,message});
const checkUnique=(items,field,type)=>{
  const seen=new Map();
  for(const d of items){
    if (d.draft === true || d.draft === 'true') continue;
    const key=normalize(d[field]);
    if(!key) continue;
    if(seen.has(key)) issue('duplicate',d.file,'Aynı '+type+': '+seen.get(key));
    else seen.set(key,d.file);
  }
};
checkUnique(terms,'name','sözlük adı');
checkUnique(atlas,'name','Atlas adı');
checkUnique(guides,'title','rehber başlığı');
checkUnique(posts,'seoTitle','SEO başlığı');
const definitions=new Map();
for(const t of terms.filter(x=>x.draft!==true)){
  if(!t.sourceUrl) issue('source',t.file,'Kaynak URL yok');
  if((t.definition||'').length<95) issue('thin-glossary',t.file,'Tanım kısa ('+(t.definition||'').length+' karakter); gözden geçirin');
  const body=normalize(t.definition);
  if(body.length<25) continue;
  if(definitions.has(body)) issue('duplicate-text',t.file,'Aynı tanım: '+definitions.get(body));
  else definitions.set(body,t.file);
}
for(const x of atlas.filter(x=>x.draft!==true)){
  const important=['mechanism','clinical','evidence','dose','warnings','interactions'];
  const short=important.filter(k=>(x[k]||'').trim().length<100);
  if(short.length) issue('atlas-depth',x.file,'Genişletilecek alanlar: '+short.join(', '));
  if(!x.sourceUrl||!x.sourceLabel) issue('source',x.file,'Bilimsel kaynak yok');
}
for(const x of guides.filter(x=>x.draft!==true)){
  if(!x.calculation||!x.safetyNote) issue('guide-depth',x.file,'Hesap örneği veya güvenlilik bölümü eksik');
}
for(const x of posts.filter(x=>x.draft!=='true')){
  if(!x.seoTitle || !x.seoDescription) issue('metadata',x.file,'Özel SEO başlığı veya açıklaması eksik');
  if(x.bodyWords<350) issue('article-depth',x.file,'Yazı kısa görünüyor (~'+x.bodyWords+' sözcük); gözden geçirin');
}
const summary={
  generatedAt:new Date().toISOString(),
  scope:'GitHub içerik deposu; canlı Google indeks verisi değil',
  counts:{glossary:terms.filter(x=>x.draft!==true).length,
    atlas:atlas.filter(x=>x.draft!==true).length,
    labelGuides:guides.filter(x=>x.draft!==true).length,
    posts:posts.filter(x=>x.draft!=='true').length},
  warningCount:warnings.length,
  types:Object.fromEntries([...new Set(warnings.map(w=>w.type))]
    .sort().map(k=>[k,warnings.filter(x=>x.type===k).length]))
};
await mkdir('reports',{recursive:true});
await writeFile('reports/seo-audit.json',JSON.stringify({summary,warnings},null,2)+'\n','utf8');
const md=[
  '# Eczacı Defteri — SEO İçerik Kontrolü',
  '',
  '> Otomatik denetimdir. Google Search Console, indeks sayısı, trafik, sorgu hacmi veya bilimsel hakem değerlendirmesi değildir.',
  '',
  '## Kapsam',
  ...Object.entries(summary.counts).map(([k,v])=>'- '+k+': '+v),
  '',
  '## İyileştirme adayları',
  ...Object.entries(summary.types).map(([k,v])=>'- '+k+': '+v),
  '',
  '## İlk 80 kayıt',
  ...warnings.slice(0,80).map(w=>'- **'+w.type+'** — '+w.file+': '+w.message),
  '',
  warnings.length>80?'Ek '+(warnings.length-80)+' uyarı JSON raporunda mevcuttur.':'Tüm uyarılar listelendi.',
  '',
  '## Yöntem',
  'Kaynak URL varlığı, eş başlıklar, sözcük/alan derinliği, kısa tanımlar ve eksik SEO alanları kontrol edildi.',
  'Uyarılar, otomatik olarak noindex veya silme kararı anlamına gelmez. Klinik ve bilimsel doğruluk ayrı denetlenmelidir.'
].join('\n');
await writeFile('reports/seo-audit.md',md+'\n','utf8');
console.log(JSON.stringify(summary,null,2));
console.log('Denetim raporları: reports/seo-audit.md ve reports/seo-audit.json');
