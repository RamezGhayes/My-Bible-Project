// Pull the Scripture references a deep study cites for each verse, with the sentence that cites them (the "why").
// Only references that exist in Van Dyck are kept. A bare "١٥: ٣٩" means the same book.
import { books, bible } from '../lib.mjs';

const toN = (s) => +String(s).replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));
const DIG = { '١': 1, '٢': 2, '٣': 3 };
const ALIAS = {};
for (const b of books) {
  const add = (k) => { if (k) ALIAS[k] = b.id; };
  add(b.abbr); add(b.name); add(b.name.replace(/^ال/, '')); add(b.name.replace(/^إنجيل /, ''));
  const m = b.abbr.match(/^([١٢٣])(.+)$/); if (m) { add(m[1] + ' ' + m[2]); }
}
Object.assign(ALIAS, { 'يوء': 'Joel', 'مزمور': 'Ps', 'مز': 'Ps', 'إشعياء': 'Isa', 'إرميا': 'Jer', 'تكوين': 'Gen', 'خروج': 'Exod', 'حزقيال': 'Ezek', 'دانيال': 'Dan', 'هوشع': 'Hos', 'ملاخي': 'Mal', 'زكريا': 'Zech', 'رؤيا': 'Rev', 'أعمال': 'Acts', 'عبرانيين': 'Heb', 'مزامير': 'Ps', 'أمثال': 'Prov' });
delete ALIAS['في']; // "في" is also the preposition "in"; Philippians is matched only as "(في" or "، في" below
const keys = Object.keys(ALIAS).sort((a, b) => b.length - a.length).map((k) => k.replace(/ /g, '\\s?'));
const RE = new RegExp(`(?:(${keys.join('|')})\\s)?([٠-٩]+):\\s?([٠-٩]+)(?:\\s?[–-]\\s?([٠-٩]+))?`, 'g');
const PHIL = /[(،]\s?في\s([٠-٩]+):\s?([٠-٩]+)/g;
const has = (id, c, v) => { const X = bible(id); return !!(X && X.chapters[c - 1] && X.chapters[c - 1].verses[v - 1]); };
const clean = (s) => String(s).replace(/\*\*/g, '').replace(/\s+/g, ' ').trim();

function refsIn(text, self) {
  const out = [];
  const push = (id, c, v, e) => { if (!has(id, c, v)) return; out.push(`${id}.${c}.${v}` + (e && e > v && has(id, c, e) ? `-${e}` : '')); };
  for (const m of text.matchAll(RE)) {
    const name = m[1] ? m[1].replace(/\s/g, ' ') : null;
    if (!name && !/(?:[(،؛]|\sو|^)\s?$/.test(text.slice(Math.max(0, m.index - 3), m.index))) continue; // a bare 'ch: v' only inside a citation list
    let id = name ? (ALIAS[name] || ALIAS[name.replace(' ', '')]) : self;
    if (!id) continue;
    push(id, toN(m[2]), toN(m[3]), m[4] ? toN(m[4]) : 0);
  }
  for (const m of text.matchAll(PHIL)) push('Phil', toN(m[1]), toN(m[2]), 0);
  return out;
}
// sentences of a note, so each reference gets the sentence that mentions it
const sentences = (t) => clean(t).split(/(?<=[.؟!])\s+/);

// deep: the deep-study module of chapter n of book id. Returns { verse: [[ref, why, kind]] }.
export function studyRefs(id, n, deep) {
  const res = {};
  const add = (v, ref, why, kind) => {
    const [b, c, vv] = ref.split('.');
    if (b === id && +c === n && +vv.split('-')[0] === v) return; // the verse itself
    const L = (res[v] ||= []);
    if (L.some((x) => x[0] === ref)) return;
    L.push([ref, why.length > 260 ? why.slice(0, 258).replace(/\s+\S*$/, '') + '…' : why, kind]);
  };
  const span = (r) => { const [a, z] = String(r).split('-').map(Number); return Array.from({ length: (z || a) - a + 1 }, (_, i) => a + i); };
  for (const o of deep.ot || []) {
    if (!o.src || !o.at) continue;
    const why = clean([o.use, o.adds].filter(Boolean).join(' '));
    for (const v of span(o.at)) add(v, o.src.replace(/^(\w+)\.(\d+)\.(\d+)-\1\.\2\.(\d+)$/, '$1.$2.$3-$4'), why || clean(o.ctx || ''), 'ot');
  }
  for (const blk of deep.verses || []) {
    const vs = span(blk.r);
    for (const note of blk.notes || []) for (const s of sentences(note)) for (const r of refsIn(s, id)) for (const v of vs) add(v, r, s, 'note');
  }
  return res;
}
