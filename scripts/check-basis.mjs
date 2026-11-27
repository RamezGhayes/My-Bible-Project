// Quick check (same rules as the build) that every `basis` phrase of calvin/mhc voices is word for word in data/sources.
// usage: node scripts/check-basis.mjs <slug> [n]
import fs from 'fs'; import path from 'path';
const [slug, only] = process.argv.slice(2); const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const dir = path.join(ROOT, 'content/books', slug, 'voices'); const flat = (x) => x.replace(/\s+/g, ' '); let bad = 0, n = 0;
for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.mjs') && (!only || x === `${only}.mjs`))) {
  const ch = f.replace('.mjs', ''); const list = (await import(path.join(dir, f))).default;
  for (const v of list) {
    let src = null;
    if (v.k === 'mhc') src = fs.readFileSync(path.join(ROOT, 'data/sources/mhc', `${slug}-${ch}.md`), 'utf8').replace(/[*_]/g, '').replace(/\\/g, '');
    else if (v.k === 'calvin') { const J = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/sources/calvin', `${slug}-${ch}.json`), 'utf8')); src = v.at ? J[v.at] : Object.values(J).join('\n'); if (!src) { console.log(`${slug} ${ch} ${v.r}: no calvin key ${v.at}`); bad++; continue; } }
    if (src == null) continue; const S = flat(src);
    for (const x of v.basis || []) { n++; if (!S.includes(flat(x))) { bad++; console.log(`${slug} ${ch} ${v.r} ${v.k}: NOT FOUND: ${x}`); } if (x.split(/\s+/).length > 40) { bad++; console.log('too long', x); } }
    if (/—/.test(v.p)) { bad++; console.log(`${slug} ${ch} ${v.r}: em dash`); }
  }
}
console.log(`${n} basis phrases, ${bad} problems`);
