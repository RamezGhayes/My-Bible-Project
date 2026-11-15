// Quick self-check for edited content files (no build needed).
// Usage: node scripts/review-check.mjs content/books/matthew/chapters/1.mjs [more files or a book folder]
import fs from 'node:fs';
import path from 'node:path';
import { books, bible, normalize, parseRef, verseText } from '../src/lib.mjs';

const all = normalize(books.map((b) => bible(b.id).chapters.map((c) => c.verses.map((v) => v.text).join(' ')).join(' ')).join(' '));
const args = process.argv.slice(2);
const files = [];
for (const a of args) {
  if (fs.statSync(a).isDirectory()) {
    const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).forEach((e) => e.isDirectory() ? walk(path.join(d, e.name)) : e.name.endsWith('.mjs') && files.push(path.join(d, e.name)));
    walk(a);
  } else files.push(a);
}
let problems = 0;
const say = (f, m) => { problems++; console.log(`✗ ${f}: ${m}`); };
const REFKEYS = new Set(['ref', 'src', 'keyVerse']);
const refsIn = (o, out = []) => {
  if (Array.isArray(o)) o.forEach((x) => refsIn(x, out));
  else if (o && typeof o === 'object') for (const [k, v] of Object.entries(o)) { if (REFKEYS.has(k) && typeof v === 'string' && /^[1-3]?[A-Z][a-z]+\./.test(v)) out.push(v); else refsIn(v, out); }
  return out;
};
for (const f of files) {
  const src = fs.readFileSync(f, 'utf8');
  let mod;
  try { mod = (await import(path.resolve(f) + '?t=' + Date.now())).default; } catch (e) { say(f, 'does not load: ' + e.message); continue; }
  if (src.includes('—')) say(f, 'contains an em dash (—)');
  for (const m of src.matchAll(/«([^»]+)»/g)) {
    const q = normalize(m[1]);
    if (q.split(' ').length >= 3 && !all.includes(q)) say(f, `quote not verbatim Van Dyck: «${m[1]}»`);
  }
  for (const r of refsIn(mod)) {
    try { parseRef(r); if (!verseText(r)) say(f, `ref has no text: ${r}`); } catch (e) { say(f, `bad ref ${r}: ${e.message}`); }
  }
  if (mod && f.includes('/chapters/')) {
    for (const h of mod.hard || []) if (!['agreed', 'debated', 'likely'].includes(h.tag)) say(f, `hard tag "${h.tag}" must be agreed|debated|likely`);
    for (const v of mod.voices || []) if (!v.n || !v.w || !v.b) say(f, `voice missing n/w/b: ${JSON.stringify(v).slice(0, 80)}`);
  }
}
console.log(`${files.length} files checked, ${problems} problems`);
process.exitCode = problems ? 1 : 0;
