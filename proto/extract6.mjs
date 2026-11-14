import fs from 'node:fs';
import { books, verseText, refLabel, ROOT } from '../src/lib.mjs';
const d = JSON.parse(fs.readFileSync('proto/data3.json','utf8'));
const chs=[];
for(let i=1;i<=50;i++){ const c=(await import(`../content/books/genesis/chapters/${i}.mjs`)).default;
  const ss = c.where.split(/(?<=[.!؟])\s/); let first=''; for(const x of ss){ if(first.length>80) break; first += (first?' ':'')+x; }
  chs.push({t:c.title, sec:c.section.replace(/\s*\(.*\)\s*$/,''), w:first.length>190? first.slice(0,185)+'…':first, kv:verseText(c.keyVerse), kl:refLabel(c.keyVerse), pp:c.people.slice(0,3).map(p=>p.n), v:books[0].verses[i-1]});
}
d.chs=chs;
d.books=books.map(b=>({id:b.id,slug:b.slug,name:b.name,t:b.testament,g:b.group,gn:b.groupName,n:b.chapters,done:fs.existsSync(`${ROOT}/content/books/${b.slug}/intro.mjs`)}));
const intro=(await import('../content/books/genesis/intro.mjs')).default;
d.gsum=intro.summary;
fs.writeFileSync('proto/data6.json', JSON.stringify(d));
console.log(chs[11], [...new Set(books.map(b=>b.groupName))]);
