// Checks Guzik/MacArthur voices without building the site (safe to run while others build).
// Usage: node scripts/check-voices.mjs [slug] [chapter]
// Same rules as src/build.mjs: section/sermon registered, verses inside the sermon, reading notes exist,
// no basis for copyrighted voices, no em dash, every «» is Van Dyck text of the chapter.
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, books, bible } from '../src/lib.mjs';

const [onlySlug, onlyCh] = process.argv.slice(2);
const CMT = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/sources/commentary.json'), 'utf8'));
const vspan = (r) => String(r).split(/[;,]/).flatMap((p) => { const [a, z] = p.trim().split(/[-–]/).map(Number); const o = []; for (let i = a; i <= (z || a); i++) o.push(i); return o; });
const EN = { Matt: 'Matthew', Mark: 'Mark', Luke: 'Luke', John: 'John', Acts: 'Acts', Rom: 'Romans', '1Cor': '1 Corinthians', '2Cor': '2 Corinthians', Gal: 'Galatians', Eph: 'Ephesians', Phil: 'Philippians', Col: 'Colossians', '1Thess': '1 Thessalonians', '2Thess': '2 Thessalonians', '1Tim': '1 Timothy', '2Tim': '2 Timothy', Titus: 'Titus', Phlm: 'Philemon', Heb: 'Hebrews', Jas: 'James', '1Pet': '1 Peter', '2Pet': '2 Peter', '1John': '1 John', '2John': '2 John', '3John': '3 John', Jude: 'Jude', Rev: 'Revelation' };
const nz = (t) => t.replace(/[ً-ْٰـ]/g, '').replace(/[ٱأإآ]/g, 'ا').replace(/[.،:؛,!؟«»"]/g, '').replace(/\s+/g, ' ').trim();
let problems = 0, n0 = 0;
const bad = (m) => { problems++; console.log('✗ ' + m); };
for (const b of books) {
  if (onlySlug && b.slug !== onlySlug) continue;
  const dir = path.join(ROOT, 'content/books', b.slug, 'voices');
  if (!fs.existsSync(dir)) continue;
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.mjs'))) {
    const n = +f.replace('.mjs', '');
    if (onlyCh && n !== +onlyCh) continue;
    let list;
    try { list = (await import(path.join(dir, f) + '?t=' + Date.now())).default; } catch (e) { bad(`${b.slug} ${n}: does not load: ${e.message}`); continue; }
    const chText = nz(bible(b.id).chapters[n - 1].verses.map((x) => x.text).join(' '));
    const last = bible(b.id).chapters[n - 1].verses.length;
    for (const v of list) {
      n0++;
      const id = `${b.slug} ${n} (${v.r} ${v.k})`;
      const sp = vspan(v.r);
      if (!sp.length || sp.some((x) => !(x >= 1 && x <= last))) bad(`${id}: bad range`);
      if (v.k === 'guzik') {
        const C = CMT.guzik.chapters[`${b.slug}-${n}`];
        if (!C || !C.secs[v.sec]) bad(`${id}: Guzik section "${v.sec}" not in commentary.json`);
        if (!fs.existsSync(path.join(ROOT, 'data/sources/guzik', `${b.slug}-${n}.md`))) bad(`${id}: no Guzik reading notes`);
      } else if (v.k === 'mac') {
        const M = CMT.mac.sermons[v.ser];
        if (!M) bad(`${id}: sermon ${v.ser} not in commentary.json`);
        else if ((M.book !== b.name && M.book !== (EN[b.id] || b.id)) || M.ch !== n || sp[0] < M.v[0] || sp[sp.length - 1] > M.v[1]) bad(`${id}: outside sermon ${v.ser} (${M.book} ${M.ch}:${M.v.join('-')})`);
        if (!fs.existsSync(path.join(ROOT, 'data/sources/mac', `${b.slug}-${n}.md`))) bad(`${id}: no MacArthur reading notes`);
      } else if (v.k !== 'calvin' && v.k !== 'mhc') bad(`${id}: unknown voice`);
      if ((v.k === 'guzik' || v.k === 'mac') && v.basis) bad(`${id}: no basis for copyrighted voices`);
      if (/—/.test(v.p || '')) bad(`${id}: em dash`);
      for (const m of String(v.p || '').matchAll(/«([^»]+)»/g)) if (!chText.includes(nz(m[1]))) bad(`${id}: «${m[1]}» not Van Dyck text of this chapter`);
    }
  }
}
console.log(`${n0} entries, ${problems} problems`);
process.exit(problems ? 1 : 0);
