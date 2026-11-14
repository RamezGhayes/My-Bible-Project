import fs from 'node:fs';
import { books, bible, verseText, refLabel, ROOT } from '../src/lib.mjs';
const ch = (await import('../content/books/genesis/chapters/1.mjs')).default;
const ch2 = (await import('../content/books/genesis/chapters/2.mjs')).default;
const intro = (await import('../content/books/genesis/intro.mjs')).default;
const text = bible('Gen').chapters[0].verses;
const links = ch.links.map(l => ({ ...l, label: refLabel(l.ref), text: verseText(l.ref) }));
const fs2 = fs;
const out = {
  books: books.map(b => ({ id: b.id, slug: b.slug, name: b.name, t: b.testament, n: b.chapters, done: fs.existsSync(`${ROOT}/content/books/${b.slug}/intro.mjs`) })),
  ch: { ...ch, links, keyVerseText: verseText(ch.keyVerse), keyVerseLabel: refLabel(ch.keyVerse) },
  text,
  intro: { summary: intro.summary, keys: Object.keys(intro) },
  titles: Array.from({length:50},(_,i)=>{try{return null}catch{return null}})
};
// chapter titles for genesis
const titles=[];
for(let i=1;i<=50;i++){ titles.push((await import(`../content/books/genesis/chapters/${i}.mjs`)).default.title); }
out.titles=titles;
fs.writeFileSync('proto/data.json', JSON.stringify(out));
console.log(Object.keys(ch), out.intro.keys, intro.summary?.slice(0,200));
