// Hebrew (WLC via OSHB) lookup for OT deep studies. Needs .gk/heb (node tools/deep/heb-setup.mjs).
//   node tools/deep/heb.mjs Gen 1 [from] [to]     -> one line per word: form lemma H#### morph   (KJV verse numbers)
//   node tools/deep/heb.mjs count <lemma|H####> [Book]  -> occurrences in the OT (per book, with references)
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..');
const DIR = path.join(ROOT, '.gk/heb');
const load = (id) => JSON.parse(fs.readFileSync(path.join(DIR, id + '.json'), 'utf8'));
const cons = (s) => s.normalize('NFD').replace(/[֑-ׇ]/g, '').replace(/[^א-ת]/g, '');
const [a, b, c, d] = process.argv.slice(2);
const ORDER = ['Gen', 'Exod', 'Lev', 'Num', 'Deut', 'Josh', 'Judg', 'Ruth', '1Sam', '2Sam', '1Kgs', '2Kgs', '1Chr', '2Chr', 'Ezra', 'Neh', 'Esth', 'Job', 'Ps', 'Prov', 'Eccl', 'Song', 'Isa', 'Jer', 'Lam', 'Ezek', 'Dan', 'Hos', 'Joel', 'Amos', 'Obad', 'Jonah', 'Mic', 'Nah', 'Hab', 'Zeph', 'Hag', 'Zech', 'Mal'];
if (a === 'count') {
  const s = /^H\d+$/.test(b) ? +b.slice(1) : null;
  let total = 0; const lines = [];
  for (const id of c ? [c] : ORDER) {
    const B = load(id); const refs = [];
    for (const [k, ws] of Object.entries(B)) for (const w of ws) if (s ? w.s === s : cons(w.l) === cons(b)) refs.push(k);
    if (refs.length) { total += refs.length; lines.push(`${id} ${refs.length} ${refs.join(' ')}`); }
  }
  console.log('total', total); lines.forEach((l) => console.log(l));
} else {
  const B = load(a); const ch = +b;
  const keys = Object.keys(B).filter((k) => +k.split(':')[0] === ch).sort((x, y) => +x.split(':')[1] - +y.split(':')[1]);
  for (const k of keys) {
    const v = +k.split(':')[1];
    if (c && (v < +c || v > +(d || c))) continue;
    console.log('== ' + k);
    for (const w of B[k]) console.log(`${w.w} ${w.l} H${w.s} ${w.m}`);
  }
}
