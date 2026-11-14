import fs from 'node:fs';
import { bible, verseText, refLabel } from '../src/lib.mjs';
const ch = (await import('../content/books/genesis/chapters/12.mjs')).default;
const titles=[]; for(let i=1;i<=50;i++) titles.push((await import(`../content/books/genesis/chapters/${i}.mjs`)).default.title);
const text = bible('Gen').chapters[11].verses;
const out = { ch: { ...ch, links: ch.links.map(l=>({...l,label:refLabel(l.ref)})), keyVerseText: verseText(ch.keyVerse), keyVerseLabel: refLabel(ch.keyVerse) }, text, titles };
fs.writeFileSync('proto/data2.json', JSON.stringify(out));
console.log(ch.keyVerse, ch.places.map(p=>p.n), ch.words.length, ch.hard.length);
