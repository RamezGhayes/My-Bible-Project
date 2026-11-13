// Checks every «quoted» phrase in authored content against the Van Dyck text.
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, books, bible, normalize } from '../src/lib.mjs';
const all = normalize(books.map((b) => bible(b.id).chapters.map((c) => c.verses.map((v) => v.text).join(' ')).join(' ')).join(' '));
const files = [];
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).forEach((e) => e.isDirectory() ? walk(path.join(d, e.name)) : e.name.endsWith('.mjs') && files.push(path.join(d, e.name)));
walk(path.join(ROOT, 'content'));
let bad = 0, total = 0;
for (const f of files) {
  const src = fs.readFileSync(f, 'utf8');
  for (const m of src.matchAll(/«([^»]+)»/g)) {
    const q = normalize(m[1]);
    if (q.split(' ').length < 3) continue; // single words / names
    total++;
    if (!all.includes(q)) { bad++; console.log('✗', path.relative(ROOT, f), '«' + m[1] + '»'); }
  }
}
console.log(`checked ${total} quotations, ${bad} not found verbatim`);
