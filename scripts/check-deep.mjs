// Checks deep-study files (content/books/<slug>/deep/<n>.mjs).
// - every verse of the chapter is covered exactly once by verses[].r
// - every «quote» (any length) is verbatim Van Dyck
// - tags are agreed|likely|debated
// - with a MorphGNT checkout (GNT_DIR, default /home/claude/gk/sblgnt): every Greek word g is a form found in
//   the verse range, and its lemma l matches that form's lemma.
// Usage: node scripts/check-deep.mjs [files or folders]  (default: all deep files)
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, books, bookBySlug, bible, normalize } from '../src/lib.mjs';

const all = normalize(books.map((b) => bible(b.id).chapters.map((c) => c.verses.map((v) => v.text).join(' ')).join(' ')).join(' '));
const GNT = process.env.GNT_DIR || [path.join(ROOT, '.gk/sblgnt'), '/home/claude/gk/sblgnt'].find((d) => fs.existsSync(d)) || path.join(ROOT, '.gk/sblgnt');
const GNUM = { Matt: 61, Mark: 62, Luke: 63, John: 64, Acts: 65, Rom: 66, '1Cor': 67, '2Cor': 68, Gal: 69, Eph: 70, Phil: 71, Col: 72, '1Thess': 73, '2Thess': 74, '1Tim': 75, '2Tim': 76, Titus: 77, Phlm: 78, Heb: 79, Jas: 80, '1Pet': 81, '2Pet': 82, '1John': 83, '2John': 84, '3John': 85, Jude: 86, Rev: 87 };
const strip = (s) => s.normalize('NFD').replace(/\p{Mn}/gu, '').replace(/[^\p{L}]/gu, '').toLowerCase();
const gcache = {};
const greek = (id) => {
  if (gcache[id] !== undefined) return gcache[id];
  if (!GNUM[id] || !fs.existsSync(GNT)) return (gcache[id] = null);
  const f = fs.readdirSync(GNT).find((x) => x.startsWith(GNUM[id] + '-'));
  const m = {};
  for (const l of fs.readFileSync(path.join(GNT, f), 'utf8').split('\n')) {
    if (!l) continue;
    const p = l.split(' ');
    const k = +p[0].slice(2, 4) + ':' + +p[0].slice(4, 6);
    (m[k] = m[k] || []).push({ w: strip(p[4]), l: strip(p[6]), raw: p[6] });
  }
  return (gcache[id] = m);
};
// Standard dictionary forms that MorphGNT lists under a variant lemma.
const EQUIV = { ελεεω: 'ελεαω', δεομαι: 'δεω', πετρωδης: 'πετρωδες', δει: 'δεω' };
// Hebrew (OT): .gk/heb/<Book>.json from tools/deep/heb-setup.mjs (OSHB/WLC, KJV verse numbers).
// A Hebrew g must match (by consonants) a word in the verse range, or failing that, in the chapter or the
// next/previous chapter (versification shifts); l must be that word's Strong's lemma (by consonants).
const HEB = path.join(ROOT, '.gk/heb');
const hcache = {};
const hebrew = (id) => {
  if (hcache[id] !== undefined) return hcache[id];
  const f = path.join(HEB, id + '.json');
  return (hcache[id] = fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : null);
};
const hcons = (s) => s.normalize('NFD').replace(/[\u0591-\u05C7]/g, '').replace(/[^\u05D0-\u05EA]/g, '');
const isHeb = (s) => /[\u05D0-\u05EA]/.test(s);
const span = (r) => String(r).split(/[;,]/).flatMap((part) => { const [a, z] = part.trim().split(/[-–]/).map(Number); const o = []; for (let i = a; i <= (z || a); i++) o.push(i); return o; });

const FIX = process.argv.includes('--fix');
const args = process.argv.slice(2).filter((a) => a !== '--fix');
const files = [];
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).forEach((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : e.name.endsWith('.mjs') && d.endsWith('deep') && files.push(path.join(d, e.name))));
if (args.length) for (const a of args) fs.statSync(a).isDirectory() ? walk(a) : files.push(a); else walk(path.join(ROOT, 'content/books'));

const TAGS = new Set(['agreed', 'likely', 'debated']);
let problems = 0, words = 0;
const say = (f, m) => { problems++; console.log(`✗ ${path.relative(ROOT, f)}: ${m}`); };
for (const f of files) {
  const slug = path.basename(path.dirname(path.dirname(f)));
  const b = bookBySlug[slug];
  const n = +path.basename(f, '.mjs');
  const src = fs.readFileSync(f, 'utf8');
  let D;
  try { D = (await import(path.resolve(f) + '?t=' + Date.now())).default; } catch (e) { say(f, 'does not load: ' + e.message); continue; }
  if (src.includes('—')) say(f, 'em dash');
  for (const m of src.matchAll(/[\u0590-\u05FF]+[\u0600-\u06FF]+[\u0590-\u05FF]*|[\u0600-\u06FF]+[\u0590-\u05FF]+/g)) say(f, `Hebrew and Arabic letters mixed in one word: ${m[0]}`);
  const fixes = [];
  const ok = (q) => all.includes(normalize(q));
  for (const m of src.matchAll(/«([^»]+)»/g)) {
    // "..." / "…" inside «» is never allowed (normalize() would hide it)
    if (/\.\.\.|…/.test(m[1])) {
      say(f, `ellipsis inside quote: «${m[1]}»`);
      if (FIX) {
        const parts = m[1].split(/\s*(?:\.\.\.|…)\s*/).filter((x) => x.trim());
        fixes.push([m[0], parts.every(ok) ? parts.map((x) => `«${x}»`).join(' و') : `"${m[1]}"`]);
      }
      continue;
    }
    if (ok(m[1])) continue;
    say(f, `quote not verbatim: «${m[1]}»`);
    if (!FIX) continue;
    const parts = m[1].split(/\s*(?:\.\.\.|…)\s*/).filter((x) => x.trim());
    fixes.push([m[0], parts.length > 1 && parts.every(ok) ? parts.map((x) => `«${x}»`).join(' و') : `"${m[1]}"`]);
  }
  // a verbatim «quote» followed by a (reference) must be found inside that reference
  const AB = Object.fromEntries(books.map((x) => [x.abbr.replace(/\s/g, ''), x.id]));
  const dig = (t) => t.replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));
  for (const m of src.matchAll(/«([^»]+)»[\s،.:!؟]{0,3}\(([^)]+)\)(\s*«)?/g)) {
    if (!ok(m[1])) continue;
    if (m[3] && /^[٠-٩]$/.test(m[2].trim())) continue; // (١) «...» is a list marker
    let bk = b.id, ch = n, texts = [], valid = true;
    for (let piece of dig(m[2]).split(/[،,;]/)) {
      piece = piece.trim();
      const mm = piece.match(/^(?:(\d?\s*[\u0600-\u06FF]+)\s+)?(?:(\d+):\s*)?(\d+)(?:\s*[–-]\s*(\d+))?$/);
      if (!mm) { valid = false; break; }
      if (mm[1]) { const id = AB[mm[1].replace(/\s/g, '').replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[d])]; if (!id) { valid = false; break; } bk = id; ch = null; }
      if (mm[2]) ch = +mm[2];
      if (ch == null) { valid = false; break; }
      const C = bible(bk).chapters[ch - 1]; if (!C) { valid = false; break; }
      for (let i = +mm[3]; i <= +(mm[4] || mm[3]); i++) if (C.verses[i - 1]) texts.push(C.verses[i - 1].text);
    }
    if (valid && texts.length && !normalize(texts.join(' ')).replace(/\s/g, '').includes(normalize(m[1]).replace(/\s/g, ''))) say(f, `quote not in cited (${m[2]}): «${m[1]}»`);
  }
  const total = bible(b.id).chapters[n - 1].verses.length;
  const seen = new Array(total + 1).fill(0);
  for (const v of D.verses || []) for (const i of span(v.r)) { if (i < 1 || i > total) say(f, `verse ${i} out of range`); else seen[i]++; }
  for (let i = 1; i <= total; i++) if (seen[i] !== 1) say(f, `verse ${i} covered ${seen[i]} times`);
  const tagged = [...(D.verses || []).flatMap((v) => [v, ...(v.views || []), v.extra].filter(Boolean)), ...(D.background || []), ...(D.ot || []), ...(D.issues || [])];
  for (const x of tagged) if (x.tag && !TAGS.has(x.tag)) say(f, `bad tag ${x.tag}`);
  for (const v of D.verses || []) if (v.viewsTag && !TAGS.has(v.viewsTag)) say(f, `bad viewsTag ${v.viewsTag}`);
  const G = greek(b.id);
  if (G) for (const v of D.verses || []) for (const w of v.words || []) {
    words++;
    const toks = span(v.r).flatMap((i) => G[n + ':' + i] || []);
    const forms = strip(w.g).length ? w.g.split(/\s+/) : [];
    for (const fm of forms) { const t = toks.find((x) => x.w === strip(fm)); if (!t) say(f, `Greek "${fm}" not in ${n}:${v.r}`); }
    if (w.l) { const t = toks.find((x) => x.w === strip(forms[0] || '')); if (t && t.l !== strip(w.l) && EQUIV[strip(w.l)] !== t.l) { say(f, `lemma of ${w.g} is not ${w.l} (MorphGNT: ${t.raw})`); if (FIX) fixes.push([`l: '${w.l}'`, `l: '${t.raw}'`]); } }
  }
  const H = hebrew(b.id);
  if (H) for (const v of D.verses || []) for (const w of v.words || []) {
    if (!isHeb(w.g || '')) { say(f, `word "${w.g}" is not Hebrew`); continue; }
    words++;
    const inRange = span(v.r).flatMap((i) => H[n + ':' + i] || []);
    const near = Object.entries(H).filter(([k]) => Math.abs(+k.split(':')[0] - n) <= 1).flatMap(([, x]) => x);
    const g = hcons(w.g);
    let hits = inRange.filter((t) => hcons(t.w) === g);
    if (!hits.length) hits = near.filter((t) => hcons(t.w) === g);
    if (!hits.length) { say(f, `Hebrew "${w.g}" not in ${n}:${v.r}`); continue; }
    if (w.l && !hits.some((t) => hcons(t.l) === hcons(w.l))) say(f, `lemma of ${w.g} is not ${w.l} (OSHB: ${[...new Set(hits.map((t) => t.l + ' H' + t.s))].join(', ')})`);
  }
  if (FIX && fixes.length) { let t = fs.readFileSync(f, 'utf8'); for (const [a, z] of fixes) { t = t.split(a).join(z); console.log(`  fix: ${a} → ${z}`); } fs.writeFileSync(f, t); }
}
console.log(`${files.length} deep files, ${words} Greek/Hebrew words checked, ${problems} problems`);
process.exitCode = problems ? 1 : 0;
