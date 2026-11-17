// «عِش النص»: تطبيقات عملية في آخر الأصحاح، من مصادر مُصلحة معروفة، مع أمثلة من حياتنا اليوم.
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, verseText, esc, ar, refLabel, refHref, bookById } from '../lib.mjs';
import { IC } from './ui.mjs';
import { glyph } from './explain.mjs';

const W = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/sources/westminster.json'), 'utf8'));
const mhc = (f) => fs.readFileSync(path.join(ROOT, 'data/sources/mhc', `${f}.md`), 'utf8');
const ARENA = { home: ['البيت والعائلة', 'house'], work: ['الشغل والدراسة', 'bag'], online: ['الموبايل والسوشيال', 'phone'], church: ['الكنيسة', 'people'] };
const flat = (s) => s.replace(/\s+/g, ' ');

// Voice labels and links (all public domain, original text kept in data/sources).
const MH_SEC = { 'Gen.12': [[1, 3], [4, 5], [6, 9], [10, 13], [14, 20]] };
function voice(v, ref) {
  if (v.k === 'mhc') {
    const [b, c, vs] = ref.split('.'); const sec = (MH_SEC[`${b}.${c}`] || []).find(([a, z]) => +vs >= a && +vs <= z);
    return { n: 'ماثيو هنري', d: 'خادم مشيخي إنجليزي (1662–1714)', w: 'تفسير الكتاب المقدس', u: `https://www.biblegateway.com/resources/matthew-henry/${sec ? `${b}.${c}.${sec[0]}-${b}.${c}.${sec[1]}` : `${b}.${c}`}`, i: 'هـ' };
  }
  if (v.k === 'wcf') return { n: 'إقرار إيمان وستمنستر', d: '1647', w: `الفصل ${v.at.replace('.', '، الفقرة ')}`, u: 'https://www.pcaac.org/resources/wcf/', i: 'و' };
  if (v.k === 'wlc') return { n: 'التعليم المسيحي الكبير لوستمنستر', d: '1647', w: `السؤال ${v.at}`, u: 'https://ccel.org/ccel/anonymous/westminster2', i: 'و' };
  throw new Error('unknown voice ' + v.k);
}
const sourceText = (v) => v.k === 'mhc' ? mhc(v.file) : v.k === 'wcf' ? W.wcf[v.at] : W.wlc[v.at];

// Literal Van Dyck words for a cut (letters only, no vowel marks); the build stops if they are not in the verse.
const norm = (w) => w.replace(/[ً-ْٰـ]/g, '').replace(/[ٱأإآ]/g, 'ا').replace(/[.،:؛,«»!؟]/g, '');
function piece(ref, cut) {
  const vw = verseText(ref).split(/\s+/), tw = cut.split(/\s+/).map(norm);
  for (let i = 0; i + tw.length <= vw.length; i++) if (tw.every((w, j) => norm(vw[i + j]) === w)) return vw.slice(i, i + tw.length).join(' ').replace(/[«»]/g, '').replace(/[.،:؛,]$/, '');
  throw new Error(`Apply: "${cut}" not in ${ref}`);
}

// Load and check every content/apply/*.mjs
export const APPLY = {};
const dir = path.join(ROOT, 'content/apply');
for (const f of fs.existsSync(dir) ? fs.readdirSync(dir).filter((x) => x.endsWith('.mjs')) : []) {
  const A = (await import(path.join(dir, f))).default;
  const check = (v, where) => { const S = flat(sourceText(v)); for (const b of v.basis) if (!S.includes(flat(b))) throw new Error(`Apply ${f} ${where}: basis not word for word in source: "${b}"`); };
  for (const it of A.items) {
    check(it.by, it.id); if (it.also) check(it.also, it.id + '/also');
    it.q = piece(it.ref, it.cut);
    for (const a of it.arenas) if (!ARENA[a]) throw new Error(`Apply ${f}: unknown arena ${a}`);
    for (const k of ['t', 'p', 'today', 'ask', 'step']) if (/[«»]|—/.test(it[k] + (it.also?.p || ''))) throw new Error(`Apply ${f} ${it.id}: no «» or em dash in ${k}`);
  }
  check(A.christ.by, 'christ'); A.christ.q = piece(A.christ.ref, A.christ.cut); if (A.christ.also) verseText(A.christ.also);
  APPLY[`${A.book}.${A.ch}`] = A;
}

export function applySection(b, n, depth) {
  const A = APPLY[`${b.id}.${n}`];
  if (!A) return '';
  const used = [...new Set(A.items.flatMap((x) => x.arenas))];
  const vchip = (v, ref) => { const V = voice(v, ref); return `<span class="l3vc"><i>${V.i}</i><span><b>${V.n}</b><small>${V.d} · ${V.w}</small></span></span>`; };
  const srcBox = (it) => { const vs = [it.by, ...(it.also ? [it.also] : [])]; return `<details class="l3src"><summary>المصادر والنص الأصلي</summary>${vs.map((v) => { const V = voice(v, it.ref); return `<div><b>${V.n}، ${V.w}</b>${v.basis.map((x) => `<blockquote dir="ltr" lang="en">${esc(x.replace(/\*/g, ''))}</blockquote>`).join('')}<a href="${V.u}" rel="noopener">افتح المصدر</a></div>`; }).join('')}<p class="l3nt">المبدأ ملخص أمين لكلام المصدر. أما المثال من حياتنا فمن إعداد الموقع، لتقريب المبدأ ليومنا.</p></details>`; };
  const card = (it, i) => `<article class="lv3c" data-arenas="${it.arenas.join(' ')}" style="--d:${(i * 0.08).toFixed(2)}s">
<span class="l3no" aria-hidden="true">${ar(i + 1)}</span>
<h3>${esc(it.t)}</h3>
<blockquote class="l3vq"><span>${esc(it.q)}</span><a href="${refHref(it.ref, depth)}">${refLabel(it.ref)}</a></blockquote>
<div class="l3p"><small>المبدأ</small><p>${esc(it.p)}</p>${vchip(it.by, it.ref)}${it.also ? `<p class="l3al">${esc(it.also.p)}</p>${vchip(it.also, it.ref)}` : ''}</div>
<div class="l3td"><small><span class="l3ics">${it.arenas.map((a) => glyph(ARENA[a][1], 18)).join('')}</span>مثال من حياتنا في 2026</small><p>${esc(it.today)}</p></div>
<div class="l3ak"><small>اسأل نفسك</small><p>${esc(it.ask)}</p></div>
<div class="l3st"><small>خطوة هذا الأسبوع</small><p>${esc(it.step)}</p><button type="button" aria-pressed="false" data-pick="${it.id}">${IC.list}<span>اخترها لهذا الأسبوع</span></button></div>
${srcBox(it)}
</article>`;
  const C = A.christ;
  return `<section class="lv3" id="live3" aria-labelledby="lv3t">
<div class="l3hd"><span class="l3ey">من النص إلى حياتك</span><h2 id="lv3t">عِش ${esc(bookById[A.book].name)} ${ar(A.ch)}</h2><p>${esc(A.lead)}</p>
<div class="h3g ar3" role="tablist" aria-label="أين تعيش هذا؟"><button type="button" role="tab" aria-selected="true" data-arena="all">الكل</button>${used.map((a) => `<button type="button" role="tab" aria-selected="false" data-arena="${a}">${glyph(ARENA[a][1], 18)}${ARENA[a][0]}</button>`).join('')}</div></div>
<div class="l3path">${A.items.map(card).join('')}</div>
<article class="lv3x"><small>قبل كل شيء</small><h3>${esc(C.t)}</h3><blockquote class="l3vq"><span>${esc(C.q)}</span><a href="${refHref(C.ref, depth)}">${refLabel(C.ref)}</a></blockquote><p>${esc(C.p)}</p>${vchip(C.by, C.ref)}${C.also ? `<a class="l3also" href="${refHref(C.also, depth)}">وانظر كيف يقرأ بولس هذا الوعد: ${refLabel(C.also)}</a>` : ''}</article>
<aside class="lv3m" data-commit aria-live="polite"><div class="l3in"><small>التزامي هذا الأسبوع</small><h3>${esc(bookById[A.book].name)} ${ar(A.ch)}</h3><ol data-list><li class="l3em">اختر خطوة أو اثنتين من البطاقات أعلاه.</li></ol><div class="l3bt"><button type="button" data-cimg disabled>احفظها صورة</button><button type="button" data-cprint disabled>اطبعها</button></div><p class="l3nt">لا يُحفظ شيء على الموقع. احفظ الصورة أو اطبعها لتتذكرها.</p></div></aside>
<template data-steps>${A.items.map((it) => `<i data-id="${it.id}" data-t="${esc(it.t)}" data-s="${esc(it.step)}" data-r="${refLabel(it.ref)}"></i>`).join('')}</template>
</section>`;
}
