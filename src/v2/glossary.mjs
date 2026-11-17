// القاموس: التحقق من المصادر، والإحصاءات من نص فاندايك، وتعليم الكلمات في القارئ، وصفحة القاموس.
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, books, bookById, bible, verseText, esc, ar, refLabel, refHref, shortName } from '../lib.mjs';
import { header, IC } from './ui.mjs';
import { glyph } from './explain.mjs';
import { GLOSSARY, CATS } from '../../content/glossary.mjs';

const EASTON = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/sources/easton-glossary.json'), 'utf8'));
const WSC = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/sources/wsc.json'), 'utf8'));
const CAT = Object.fromEntries(CATS.map((c) => [c.id, c]));

// Text without vowel marks; ٱ becomes ا. Hamza forms and ة stay as they are, so آمين ≠ أمين and وزنة ≠ وزنه.
const MARKS = /[ً-ْٰـ]/;
const norm = (s) => s.replace(/[ً-ْٰـ]/g, '').replace(/ٱ/g, 'ا');
// Normalised text plus a map back to the original string, so a match can be wrapped in the real text.
function normMap(s) {
  let t = ''; const at = [];
  for (let i = 0; i < s.length; i++) { const c = s[i]; if (MARKS.test(c)) continue; t += c === 'ٱ' ? 'ا' : c; at.push(i); }
  at.push(s.length);
  return { t, at };
}
const PRE = '(?:وبال|وال|فال|بال|كال|ولل|لل|ال|وب|ول|فب|فل|وك|و|ف|ب|ل|ك)?';
const reFor = (p) => { const stem = p.endsWith('*'); const core = p.replace('*', '').replace(/ /g, '\\s+'); return new RegExp(`(?<![\\p{L}])${PRE}${core}${stem ? '\\p{L}*' : 'ا?'}(?![\\p{L}])`, 'gu'); };
const sourceText = (e) => e.src.k === 'easton' ? EASTON.entries[e.src.t].join('\n') : `${WSC.qa[e.src.q].q} ${WSC.qa[e.src.q].a}`;
export const sourceLink = (e) => e.src.k === 'easton'
  ? { t: `قاموس إيستون للكتاب المقدس (1897)، مادة ${e.src.t}`, u: `https://ccel.org/ccel/easton/ebd2.html?term=${encodeURIComponent(e.src.t)}` }
  : { t: `التعليم المسيحي المختصر لوستمنستر (1647)، السؤال ${e.src.q}`, u: 'https://ccel.org/creeds/westminster-shorter-cat.html' };

// ---------- checks: the build stops on any of these ----------
for (const e of GLOSSARY) {
  if (!CAT[e.cat]) throw new Error(`Glossary ${e.id}: unknown category ${e.cat}`);
  const S = sourceText(e).replace(/\s+/g, ' ');
  for (const b of e.basis) if (!S.includes(b.replace(/\s+/g, ' '))) throw new Error(`Glossary ${e.id}: basis not found word for word in ${e.src.k} ${e.src.t || e.src.q}: "${b}"`);
  const fold = (x) => norm(x).replace(/[أإآ]/g, 'ا').replace(/[.,،:؛!؟?()«»]/g, '').replace(/\s+/g, ' ');
  for (const [ref, phrase] of e.checks || []) if (!fold(verseText(ref)).includes(fold(phrase))) throw new Error(`Glossary ${e.id}: "${phrase}" not in ${ref}`);
  for (const ref of e.refs) verseText(ref); // throws on a bad reference
  if (/[«»]|—/.test(e.d + (e.more || ''))) throw new Error(`Glossary ${e.id}: no «» or em dash in definitions`);
  e.re = e.find.map(reFor);
}

// ---------- where each word appears in Van Dyck ----------
const allowed = (e, bid) => !e.books || e.books.includes(bid);
const firstHit = (e, text) => { if (e.not && e.not.some((p) => text.includes(p))) return null; for (const re of e.re) { re.lastIndex = 0; const m = re.exec(text); if (m) return m; } return null; };
export const STATS = {};
for (const e of GLOSSARY) STATS[e.id] = { n: 0, per: {}, first: null };
for (const b of books) {
  const B = bible(b.id);
  B.chapters.forEach((ch, ci) => ch.verses.forEach((v) => {
    const t = norm(v.text);
    for (const e of GLOSSARY) {
      if (!allowed(e, b.id)) continue;
      if (firstHit(e, t)) { const s = STATS[e.id]; s.n++; s.per[b.id] = (s.per[b.id] || 0) + 1; if (!s.first) s.first = `${b.id}.${ci + 1}.${v.number}`; }
    }
  }));
}
for (const e of GLOSSARY) if (!STATS[e.id].n) throw new Error(`Glossary ${e.id}: no occurrence of ${e.find.join(' / ')} in Van Dyck`);

// ---------- reader: mark the first occurrence of each word in a chapter (at most 8 words) ----------
export function glossChapter(bid, verses) {
  const marks = {}, used = [];
  for (const v of verses) {
    const { t, at } = normMap(v.text);
    for (const e of GLOSSARY) {
      if (e.auto === false || used.includes(e) || used.length >= 8 || !allowed(e, bid)) continue;
      const m = firstHit(e, t);
      if (!m) continue;
      const a = at[m.index], z = at[m.index + m[0].length - 1] + 1;
      let zz = z; while (zz < v.text.length && MARKS.test(v.text[zz])) zz++; // keep trailing vowel marks inside
      const list = (marks[v.number] ||= []);
      if (list.some(([x, y]) => a < y && zz > x)) continue;
      list.push([a, zz, e.id]); used.push(e);
    }
  }
  const html = (v) => {
    const list = (marks[v.number] || []).sort((p, q) => p[0] - q[0]);
    let out = '', i = 0;
    for (const [a, z, id] of list) { out += esc(v.text.slice(i, a)) + `<button type="button" class="gw" data-g="${id}">${esc(v.text.slice(a, z))}</button>`; i = z; }
    return out + esc(v.text.slice(i));
  };
  const cards = used.length ? `<template id="glcards">${used.map((e) => `<div data-g="${e.id}"><small>${esc(CAT[e.cat].t)}</small><b>${esc(e.w)}</b><p>${esc(e.d)}</p><a href="${'../../'}glossary.html#${e.id}">في القاموس: المصدر والشواهد</a></div>`).join('')}</template>` : '';
  return { html, cards };
}

// ---------- the glossary page ----------
export function glossaryPage(depth = 0) {
  const u = '../'.repeat(depth);
  const OTN = books.filter((b) => b.testament === 'ot').length;
  const spark = (e) => { const s = STATS[e.id]; const mx = Math.max(...Object.values(s.per)); return `<span class="sp" aria-label="عدد المرات في كل سفر">${books.map((b, i) => { const n = s.per[b.id] || 0; return `<i${i === OTN ? ' class="nt"' : ''} style="height:${n ? Math.max(12, Math.round((n / mx) * 100)) : 0}%" title="${esc(shortName(b))}: ${ar(n)}"></i>`; }).join('')}</span>`; };
  const card = (e) => {
    const c = CAT[e.cat], s = STATS[e.id], L = sourceLink(e);
    const first = e.auto === false ? e.refs[0] : s.first;
    return `<article class="gl3c" id="${e.id}" data-cat="${e.cat}" data-k="${esc(norm(e.w + ' ' + e.en).toLowerCase())}" style="--c:${c.c};--k:${c.k}">
<button type="button" class="hd" aria-expanded="false"><span class="ic">${glyph(e.icon, 34)}</span><span class="tt"><b>${esc(e.w)}</b><small dir="ltr">${esc(e.en)}</small></span><span class="ar" aria-hidden="true">${IC.chev}</span></button>
<p class="d">${esc(e.d)}</p>
<div class="mt"><span>${e.auto === false ? 'كلمة لها أكثر من معنى في فاندايك' : `${ar(s.n)} آية · ${ar(Object.keys(s.per).length)} سفراً`}</span>${e.auto === false ? '' : spark(e)}</div>
<div class="gmore" hidden>
${e.more ? `<p>${esc(e.more)}</p>` : ''}
<div class="rf"><small>شواهد</small>${e.refs.map((r) => `<a href="${refHref(r, depth)}">${refLabel(r)}</a>`).join('')}${first && !e.refs.includes(first) ? `<a class="f" href="${refHref(first, depth)}">أول ذكر: ${refLabel(first)}</a>` : ''}</div>
${e.topic ? `<a class="tp" href="${u}topics/${e.topic}.html">اقرأ الموضوع كاملاً ${IC.chev}</a>` : ''}
<details class="src"><summary>المصدر: ${esc(L.t)}</summary><p>النص الأصلي الذي بُني عليه التعريف:</p>${e.basis.map((b) => `<blockquote dir="ltr" lang="en">${esc(b)}</blockquote>`).join('')}<a href="${L.u}" rel="noopener">افتح المصدر</a></details>
</div></article>`;
  };
  const tabs = `<button type="button" role="tab" aria-selected="true" data-gc="all">الكل <span>${ar(GLOSSARY.length)}</span></button>${CATS.map((c) => `<button type="button" role="tab" aria-selected="false" data-gc="${c.id}"><i style="background:${c.c}"></i>${c.t} <span>${ar(GLOSSARY.filter((e) => e.cat === c.id).length)}</span></button>`).join('')}`;
  const sorted = [...GLOSSARY].sort((a, b) => CATS.findIndex((c) => c.id === a.cat) - CATS.findIndex((c) => c.id === b.cat) || a.w.localeCompare(b.w, 'ar'));
  return `${header({ back: 'index.html', title: 'القاموس' })}
<section class="gl3h"><div class="in"><div class="tx"><span class="ey">القاموس</span><h1>كلمات الكتاب الصعبة</h1><p>${ar(GLOSSARY.length)} كلمة من نص فاندايك، كل تعريف مبني على مصدر مُصلَح موثوق، والنص الأصلي للمصدر معروض تحت كل كلمة. وفي القارئ، أول ظهور لكل كلمة في الأصحاح عليه خط منقّط: اضغطه ليظهر التعريف.</p>
<div class="srcs"><span><b>قاموس إيستون للكتاب المقدس</b>(1897) لماثيو جورج إيستون، خادم مشيخي في الكنيسة الحرة الإسكتلندية: للأماكن والأشياء والعادات.</span><span><b>التعليم المسيحي المختصر لوستمنستر</b>(1647): للكلمات العقائدية، مترجماً بأمانة.</span></div></div>
<div class="mo" aria-hidden="true">${CATS.map((c, i) => `<i style="--c:${c.c};--k:${c.k};--d:${(0.1 + i * 0.08).toFixed(2)}s">${glyph(sorted.find((e) => e.cat === c.id).icon, 40)}</i>`).join('')}</div></div></section>
<div class="gl3b">
<div class="gl3f"><label class="q"><span class="ic">${IC.search}</span><input type="search" placeholder="ابحث عن كلمة: تابوت، فصح، تبرير…" aria-label="ابحث في القاموس" data-gq></label><div class="h3g" role="tablist" aria-label="أقسام القاموس">${tabs}</div></div>
<p class="gl3n" data-gnone hidden>لا توجد كلمة بهذا الاسم في القاموس بعد.</p>
<div class="gl3g">${sorted.map(card).join('')}</div>
<p class="gl3x">القاموس يكبر تدريجياً. لا تُضاف كلمة إلا إذا وُجد لها تعريف في مصدر مُصلَح موثوق. إن وجدت خطأ في أي تعريف، فالنص الأصلي للمصدر معروض تحتها للمقارنة.</p>
</div>`;
}
