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

// Voice labels and links. Henry and Calvin are public domain, kept whole in data/sources.
// Sproul, Piper and Keller are under copyright: only one short quotation (at most 15 words) from a page on
// their own ministry's site, stored in data/sources/modern.json with its address; the rest is our own wording.
const MH_SEC = { 'Gen.12': [[1, 3], [4, 5], [6, 9], [10, 13], [14, 20]] };
const MODERN = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/sources/modern.json'), 'utf8'));
const WHO = {
  sproul: { n: 'آر. سي. سبرول', d: 'لاهوتي مشيخي أمريكي (1939–2017)', i: 'س' },
  piper: { n: 'جون بايبر', d: 'خادم معمداني مُصلَح أمريكي، مؤسس خدمة Desiring God', i: 'ب' },
  keller: { n: 'تيم كيلر', d: 'خادم مشيخي أمريكي في نيويورك (1950–2023)', i: 'ت' }
};
const slugOf = (b) => bookById[b].slug;
const lastVerse = (b, c) => { for (let v = 200; v > 0; v--) { try { verseText(`${b}.${c}.${v}`); return v; } catch { /* keep looking */ } } return 1; };
const NT_LATE = ['Rom', '1Cor', '2Cor', 'Gal', 'Eph', 'Phil', 'Col', '1Thess', '2Thess', '1Tim', '2Tim', 'Titus', 'Phlm', 'Heb', 'Jas', '1Pet', '2Pet', '1John', '2John', '3John', 'Jude', 'Rev'];
function voice(v, ref) {
  const [b, c, vs] = ref.split('.');
  if (v.k === 'mhc') {
    const sec = (MH_SEC[`${b}.${c}`] || []).find(([a, z]) => +vs >= a && +vs <= z) || [1, lastVerse(b, c)];
    const late = NT_LATE.includes(b);
    return { n: late ? 'تفسير ماثيو هنري (التكملة)' : 'ماثيو هنري', d: late ? 'مات هنري سنة 1714 بعد أعمال الرسل، وأكمل التفسير خدام مشيخيون بعده' : 'خادم مشيخي إنجليزي (1662–1714)', w: 'تفسير الكتاب المقدس', u: `https://www.biblegateway.com/resources/matthew-henry/${b}.${c}.${sec[0]}-${b}.${c}.${sec[1]}`, i: 'هـ' };
  }
  if (v.k === 'calvin') return { n: 'جون كالفن', d: 'مُصلِح في جنيف (1509–1564)', w: 'تفسير', u: `https://biblehub.com/commentaries/calvin/${slugOf(b).replace(/-/g, '_')}/${c}.htm`, i: 'ك' };
  if (WHO[v.k]) { const M = MODERN[v.id]; return { ...WHO[v.k], w: M.title, u: M.url }; }
  if (v.k === 'wcf') return { n: 'إقرار إيمان وستمنستر', d: '1647', w: `الفصل ${v.at.replace('.', '، الفقرة ')}`, u: 'https://www.pcaac.org/resources/wcf/', i: 'و' };
  if (v.k === 'wlc') return { n: 'التعليم المسيحي الكبير لوستمنستر', d: '1647', w: `السؤال ${v.at}`, u: 'https://ccel.org/ccel/anonymous/westminster2', i: 'و' };
  throw new Error('unknown voice ' + v.k);
}
const fileOf = (v, ref) => { const [b, c] = ref.split('.'); return v.file || `${slugOf(b)}-${c}`; };
function sourceText(v, ref) {
  if (v.k === 'mhc') return mhc(fileOf(v, ref));
  if (v.k === 'calvin') return Object.values(JSON.parse(fs.readFileSync(path.join(ROOT, 'data/sources/calvin', `${fileOf(v, ref)}.json`), 'utf8'))).join('\n');
  if (WHO[v.k]) {
    const M = MODERN[v.id]; if (!M || M.who !== v.k) throw new Error(`Apply: no ${v.k} entry ${v.id} in modern.json`);
    if (M.quote.split(/\s+/).length > 15) throw new Error(`Apply: ${v.id} quotation over 15 words`);
    if (v.basis.length !== 1) throw new Error(`Apply: ${v.id} one quotation only`);
    return M.quote;
  }
  return v.k === 'wcf' ? W.wcf[v.at] : W.wlc[v.at];
}

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
for (const f of fs.existsSync(dir) ? fs.readdirSync(dir).filter((x) => x.endsWith('.mjs') && !x.startsWith('_')) : []) {
  const mod = (await import(path.join(dir, f))).default;
  for (const A of Array.isArray(mod) ? mod : [mod]) {
  const check = (v, where, ref) => { if (v.basis.some((b) => b.includes('—'))) throw new Error(`Apply ${f} ${where}: no em dash in basis`); const S = flat(sourceText(v, ref)); for (const b of v.basis) if (!S.includes(flat(b))) throw new Error(`Apply ${f} ${where}: basis not word for word in source: "${b}"`); };
  for (const it of A.items) {
    check(it.by, it.id, it.ref); if (it.also) check(it.also, it.id + '/also', it.ref);
    it.q = piece(it.ref, it.cut);
    if (it.also && it.also.p && it.p.includes(it.also.p.replace(/^[^:]*: /, '').slice(0, 30))) throw new Error(`Apply ${f} ${it.id}: the second voice is repeated in p`);
    for (const a of it.arenas) if (!ARENA[a]) throw new Error(`Apply ${f}: unknown arena ${a}`);
    for (const k of ['t', 'p', 'today', 'ask', 'step']) if (/[«»]|—/.test(it[k] + (it.also?.p || ''))) throw new Error(`Apply ${f} ${it.id}: no «» or em dash in ${k}`);
  }
  if (A.christ) { check(A.christ.by, 'christ', A.christ.ref); A.christ.q = piece(A.christ.ref, A.christ.cut); if (A.christ.also) verseText(A.christ.also); }
  if (APPLY[`${A.book}.${A.ch}`]) throw new Error(`Apply: ${A.book} ${A.ch} twice`);
  if (A.items.length < 2 || new Set(A.items.map((x) => x.id)).size !== A.items.length) throw new Error(`Apply ${A.book} ${A.ch}: needs 2+ items with distinct ids`);
  for (const it of A.items) if (it.ref.split('.').slice(0, 2).join('.') !== `${A.book}.${A.ch}`) throw new Error(`Apply ${A.book} ${A.ch}: ${it.ref} is outside the chapter`);
  APPLY[`${A.book}.${A.ch}`] = A;
  }
}

export function applySection(b, n, depth) {
  const A = APPLY[`${b.id}.${n}`];
  if (!A) return '';
  const used = [...new Set(A.items.flatMap((x) => x.arenas))];
  const vchip = (v, ref) => { const V = voice(v, ref); return `<span class="l3vc"><i>${V.i}</i><span><b>${V.n}</b><small>${V.d} · <bdi>${V.w}</bdi></small></span></span>`; };
  const srcBox = (it) => { const vs = [it.by, ...(it.also ? [it.also] : [])]; return `<details class="l3src"><summary>المصادر والنص الأصلي</summary>${vs.map((v) => { const V = voice(v, it.ref); return `<div><b>${V.n}، ${V.w}</b>${v.basis.map((x) => `<blockquote dir="ltr" lang="en">${esc(x.replace(/\*/g, ''))}</blockquote>`).join('')}${WHO[v.k] ? '<p class="l3nt">اقتباس قصير. اقرأ الكلام كاملاً في المصدر.</p>' : ''}<a href="${V.u}" rel="noopener">افتح المصدر</a></div>`; }).join('')}<p class="l3nt">المبدأ ملخص أمين لكلام المصدر. أما المثال من حياتنا فمن إعداد الموقع، لتقريب المبدأ ليومنا.</p></details>`; };
  const card = (it, i) => `<article class="lv3c" data-arenas="${it.arenas.join(' ')}" style="--d:${(i * 0.08).toFixed(2)}s">
<span class="l3no" aria-hidden="true">${ar(i + 1)}</span>
<h3>${esc(it.t)}</h3>
<blockquote class="l3vq"><span>${esc(it.q)}</span><a href="${refHref(it.ref, depth)}">${refLabel(it.ref)}</a></blockquote>
<div class="l3p"><small>المبدأ</small><p>${esc(it.p)}</p>${vchip(it.by, it.ref)}${it.also ? `<p class="l3al">${esc(it.also.p)}</p>${vchip(it.also, it.ref)}` : ''}</div>
<div class="l3td"><small><span class="l3ics">${it.arenas.map((a) => glyph(ARENA[a][1], 18)).join('')}</span>مثال من حياتنا الآن</small><p>${esc(it.today)}</p></div>
<div class="l3ak"><small>اسأل نفسك</small><p>${esc(it.ask)}</p></div>
<div class="l3st"><small>خطوة هذا الأسبوع</small><p>${esc(it.step)}</p><button type="button" aria-pressed="false" data-pick="${it.id}">${IC.list}<span>اخترها لهذا الأسبوع</span></button></div>
${srcBox(it)}
</article>`;
  const C = A.christ;
  return `<section class="lv3" id="live3" aria-labelledby="lv3t">
<div class="l3hd"><span class="l3ey">من ${esc(bookById[A.book].name)} ${ar(A.ch)} إلى حياتك</span><h2 id="lv3t">تطبيقات عملية</h2><p>${esc(A.lead)}</p>
<div class="h3g ar3" role="tablist" aria-label="أين تعيش هذا؟"><button type="button" role="tab" aria-selected="true" data-arena="all">الكل</button>${used.map((a) => `<button type="button" role="tab" aria-selected="false" data-arena="${a}">${glyph(ARENA[a][1], 18)}${ARENA[a][0]}</button>`).join('')}</div></div>
<div class="l3path">${A.items.map(card).join('')}</div>
${C ? `<article class="lv3x"><small>قبل كل شيء</small><h3>${esc(C.t)}</h3><blockquote class="l3vq"><span>${esc(C.q)}</span><a href="${refHref(C.ref, depth)}">${refLabel(C.ref)}</a></blockquote><p>${esc(C.p)}</p>${vchip(C.by, C.ref)}${C.also ? `<a class="l3also" href="${refHref(C.also, depth)}">${C.alsoT || 'وانظر أيضاً'}: ${refLabel(C.also)}</a>` : ''}</article>` : ''}
<aside class="lv3m" data-commit aria-live="polite"><div class="l3in"><small>التزامي هذا الأسبوع</small><h3>${esc(bookById[A.book].name)} ${ar(A.ch)}</h3><ol data-list><li class="l3em">اختر خطوة أو اثنتين من البطاقات أعلاه.</li></ol><div class="l3bt"><button type="button" data-cimg disabled>احفظها صورة</button><button type="button" data-cprint disabled>اطبعها</button></div><p class="l3nt">لا يُحفظ شيء على الموقع. احفظ الصورة أو اطبعها لتتذكرها.</p></div></aside>
<template data-steps>${A.items.map((it) => `<i data-id="${it.id}" data-t="${esc(it.t)}" data-s="${esc(it.step)}" data-r="${refLabel(it.ref)}"></i>`).join('')}</template>
</section>`;
}

// For reading plans: the first practical application of a chapter, with the name of the voice it rests on.
export function applyBrief(bookId, n) {
  const A = APPLY[`${bookId}.${n}`];
  if (!A) return null;
  const it = A.items[0];
  return { t: it.t, q: it.q, ref: it.ref, today: it.today, ask: it.ask, step: it.step, by: voice(it.by, it.ref).n };
}
