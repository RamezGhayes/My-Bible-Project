// «نظرة عامة على أسفار الكتاب المقدس» (overview/books.html): one long interactive page in the BibleProject manner:
// a hero with the 66 books as one strip, a table of contents, then sections: the main idea, the library (filter, open a
// book), two orders (39 / 24, animated), the one story (eras + the prophets on a time line), the study units
// ("collections" with pictures), the numbers, and the road of key chapters. Data: content/overview-books.mjs.
// Every ref/has is checked against Van Dyck at build time. Interactivity: assets/ovbooks.js, styles: assets/ovbooks.css.
import path from 'node:path';
import fs from 'node:fs';
import { ROOT, books, bookById, bible, ar, esc, refLabel, refHref, verseText, normalize, shortName, chapterHref, parseRef } from '../lib.mjs';
import { IC, firstSentences, plain } from './ui.mjs';

const D = (await import(path.join(ROOT, 'content/overview-books.mjs'))).default;

export const GROUP_COLOR = { torah: '#8C2F1E', history: '#9A5A24', poetry: '#B39459', major: '#4E5D32', minor: '#6B7A4A', gospels: '#1F2A44', acts: '#34496B', paul: '#4B3D63', general: '#5A6B8C', prophecy: '#7A6232' };
const TAGS = { agreed: 'متفق عليه', likely: 'راجح', debated: 'مختلف عليه' };
const tag = (t) => (t && TAGS[t] ? `<span class="dtag ${t}">${TAGS[t]}</span>` : '');

const chk = (ref, has, where) => {
  const t = normalize(verseText(ref));
  if (!t) throw new Error(`Books overview ${where}: ${ref} not found`);
  if (has && !t.includes(normalize(has))) throw new Error(`Books overview ${where}: "${has}" is not in ${ref}`);
  return ref;
};
const versesOf = (b) => bible(b.id).chapters.reduce((n, c) => n + c.verses.length, 0);
const studied = (b) => {
  const dir = path.join(ROOT, 'content/books', b.slug, 'chapters');
  return fs.existsSync(dir) ? fs.readdirSync(dir).map((f) => parseInt(f, 10)).filter(Boolean).sort((x, y) => x - y) : [];
};
const intro = async (b) => {
  const f = path.join(ROOT, 'content/books', b.slug, 'intro.mjs');
  return fs.existsSync(f) ? (await import(f)).default : null;
};
const fact = (I, ks) => I && ks.map((k) => (I.facts || []).find((x) => x.k === k)).find(Boolean);
const short = (s, n = 120) => { s = plain(s).replace(/\s*\([^)]*\)/g, ''); return s.length > n ? s.slice(0, n).replace(/[،,]?\s+\S*$/, '') + '…' : s; };

// Hebrew order (Law 5, Prophets 8, Writings 11): each slot is one Hebrew book, possibly several of ours.
const HEB = [
  ['التوراة', [['Gen'], ['Exod'], ['Lev'], ['Num'], ['Deut']]],
  ['الأنبياء', [['Josh'], ['Judg'], ['1Sam', '2Sam'], ['1Kgs', '2Kgs'], ['Isa'], ['Jer'], ['Ezek'], ['Hos', 'Joel', 'Amos', 'Obad', 'Jonah', 'Mic', 'Nah', 'Hab', 'Zeph', 'Hag', 'Zech', 'Mal']]],
  ['الكتب', [['Ps'], ['Prov'], ['Job'], ['Song'], ['Ruth'], ['Lam'], ['Eccl'], ['Esth'], ['Dan'], ['Ezra', 'Neh'], ['1Chr', '2Chr']]]
];

export async function buildBooksAtlas({ depth = 1, a, nav, credit, pageHref }) {
  const u = '../'.repeat(depth);
  const unitsOf = {};
  for (const U of D.units) for (const id of U.books) { if (!bookById[id]) throw new Error('Books overview: unknown book ' + id); (unitsOf[id] = unitsOf[id] || []).push(U.id); }
  for (const b of books) if (!unitsOf[b.id]) throw new Error('Books overview: no unit for ' + b.id);

  // ---- book data ----
  const B = [];
  for (const b of books) {
    const I = await intro(b), X = D.books[b.id];
    if (!I && !X) throw new Error('Books overview: no summary for ' + b.id);
    const who = fact(I, ['الكاتب', 'الكتّاب']), when = fact(I, ['التاريخ', 'زمن الكتابة', 'الزمن', 'زمن النبي', 'زمن الأحداث']);
    B.push({
      id: b.id, slug: b.slug, n: shortName(b), full: b.name, ab: b.abbr, g: b.group, gn: b.groupName, t: b.testament, o: b.order,
      ch: b.chapters, vs: versesOf(b),
      s: I ? firstSentences(I.summary, 170) : X.s,
      who: who ? short(who.v, 110) : X?.who || '', whoTag: who ? who.tag : X?.whoTag || '',
      when: when ? short(when.v, 110) : X?.when || '', whenTag: when ? when.tag : X?.whenTag || '',
      units: unitsOf[b.id], st: studied(b), about: !!I,
      href: `${u}book/${b.slug}.html`, ch1: chapterHref(b, 1, depth).replace(/1\.html$/, '')
    });
  }
  const totals = (t) => { const l = B.filter((x) => !t || x.t === t); return { b: l.length, ch: l.reduce((s, x) => s + x.ch, 0), vs: l.reduce((s, x) => s + x.vs, 0) }; };
  const ALL = totals(), OT = totals('ot'), NT = totals('nt');
  const groups = [...new Set(books.map((b) => b.group))].map((g) => { const l = B.filter((x) => x.g === g); return { g, n: l[0].gn, t: l[0].t, c: GROUP_COLOR[g], b: l.length, ch: l.reduce((s, x) => s + x.ch, 0), vs: l.reduce((s, x) => s + x.vs, 0) }; });

  // ---- units ----
  const img = (s) => (s ? `${u}assets/${s}.webp` : '');
  for (const U of D.units) if (U.img && !fs.existsSync(path.join(ROOT, 'src/v2/assets', U.img + '.webp'))) throw new Error('Books overview: missing image ' + U.img);
  const UN = D.units.map((U) => {
    const ub = U.books.map((id) => bookById[id]);
    const ch = ub.reduce((s, b) => s + (U.range && U.range[b.id] ? U.range[b.id][1] - U.range[b.id][0] + 1 : b.chapters), 0);
    return {
      id: U.id, t: U.t, sub: U.sub, era: U.era, books: U.books, img: img(U.img), ch,
      range: U.range ? Object.fromEntries(Object.entries(U.range).map(([k, [f, t]]) => [k, ar(`${f} – ${t}`)])) : null,
      when: U.when, whenTag: U.whenTag || '', place: U.place, outline: U.outline,
      key: U.key.map((k) => ({ href: refHref(chk(k.ref, k.has, U.id), depth), label: refLabel(k.ref), b: parseRef(k.ref).book.id, t: k.t, d: k.d })),
      people: U.people, themes: U.themes, christ: U.christ,
      cref: { href: refHref(chk(U.christRef, U.christHas, U.id + ' christ'), depth), label: refLabel(U.christRef) },
      apply: U.apply, terms: U.terms || [], fixes: U.fixes || [],
      pages: (U.pages || []).map((p) => pageHref(p)).filter(Boolean)
    };
  });

  const ERAS = D.eras.map((E) => {
    for (const id of E.units) if (!UN.find((x) => x.id === id)) throw new Error('Books overview: era unit ' + id);
    return { ...E, tag: E.tag || '' };
  });
  const SUM = D.idea.summary.map((x) => ({ ...x, href: refHref(chk(x.ref, x.has, 'idea'), depth), label: refLabel(x.ref) }));
  const HN = D.hebrew.map((x) => ({ ...x, href: refHref(chk(x.ref, x.has, 'hebrew'), depth), label: refLabel(x.ref) }));
  chk('Lev.19.18', 'قريبك', 'fixes'); chk('Deut.6.5', 'قلبك', 'fixes'); chk('Num.33.3', 'الخامس عشر', 'fixes');

  const DATA = { books: B, groups, units: UN, eras: ERAS, heb: HEB, root: u };
  const bk = (id) => B.find((x) => x.id === id);

  // ---- markup: four calm sections, each with one job ----
  const strip = (cls = '') => `<div class="ob-strip${cls}" role="list" aria-label="الأسفار الستة والستون، عرض كل سفر بعدد أصحاحاته">${B.map((x, i) => `<a role="listitem" href="#b-${x.id}" data-book="${x.id}" style="flex:${x.ch};--c:${GROUP_COLOR[x.g]};--i:${i}" aria-label="${esc(x.n)}"><span>${esc(x.n)} · ${ar(x.ch)}</span></a>`).join('')}</div>`;
  const tile = (x) => `<a class="ob-tile" href="${x.href}" data-book="${x.id}" style="--c:${GROUP_COLOR[x.g]}"><b>${esc(x.n)}</b><small>${ar(x.ch)}</small><i class="ob-pr" aria-hidden="true"></i></a>`;
  const groupRow = (g) => `<div class="ob-grp"><div class="gl"><i style="background:${g.c}"></i><b>${esc(g.n)}</b><small>${ar(g.b)}</small></div><div class="gt">${B.filter((x) => x.g === g.g).map(tile).join('')}</div></div>`;

  const html = `<section class="ob-hero"><div class="in">
<a class="ob-back" href="../overview.html"><span aria-hidden="true">→</span> نظرة عامة</a>
<h1>أسفار الكتاب المقدس</h1>
<p>مكتبة من ${ar(ALL.b)} سفراً تروي قصة واحدة. اختر أي سفر لترى مكانه في القصة.</p>
${strip()}
<div class="ob-legend"><span>التكوين</span><span class="ob-stats"><b data-count="${ALL.ch}">${ar(ALL.ch)}</b> أصحاحاً · <b data-count="${ALL.vs}">${ar(ALL.vs)}</b> آية</span><span>الرؤيا</span></div>
</div></section>

<div class="ob-w">
<section id="ob-library" class="ob-sec">
<header class="ob-h"><h2>المكتبة</h2><p>الأسفار مجمّعة بحسب نوعها.</p></header>
<div class="ob-test" id="ob-ot"><div class="th"><h3>العهد القديم <small>${ar(OT.b)} سفراً</small></h3>
<div class="ob-seg" role="group" aria-label="الترتيب" hidden><button type="button" data-ord="ours" aria-pressed="true">ترتيبنا</button><button type="button" data-ord="heb" aria-pressed="false">الترتيب العبري</button></div></div>
<p class="ob-ordnote" hidden>نفس الأسفار، يعدّها الكتاب العبري ٢٤ سفراً في ثلاثة أقسام، ولهذا قال المسيح «ناموس موسى والأنبياء والمزامير» (<a class="r" href="${HN[0].href}">${HN[0].label}</a>).</p>
<div class="ob-groups" id="obord">${groups.filter((g) => g.t === 'ot').map(groupRow).join('')}</div></div>
<div class="ob-test"><div class="th"><h3>العهد الجديد <small>${ar(NT.b)} سفراً</small></h3></div>
<div class="ob-groups">${groups.filter((g) => g.t === 'nt').map(groupRow).join('')}</div></div>
</section>

<section id="ob-story" class="ob-sec">
<header class="ob-h"><h2>القصة الواحدة</h2><p>أحد عشر مشهداً من الخلق إلى السماء الجديدة.</p></header>
<div class="ob-line" role="tablist" aria-label="مشاهد القصة">${ERAS.map((E, i) => `<button type="button" role="tab" data-era="${i}" aria-selected="${i ? 'false' : 'true'}"><i>${ar(i + 1)}</i><span>${esc(E.t)}</span></button>`).join('')}</div>
<div class="ob-eras">${ERAS.map((E, i) => `<article class="ob-era" data-era-p="${i}"${i ? ' hidden' : ''}><div class="et"><small>${esc(E.when)}${tag(E.tag)}</small><h3>${esc(E.t)}</h3><p>${esc(E.d)}</p></div><div class="eu">${E.units.map((id) => { const U = UN.find((x) => x.id === id); return `<a href="#u-${id}" data-unit="${id}">${U.img ? `<img src="${U.img}" alt="" loading="lazy">` : `<span class="ob-ph">${U.books.length ? esc(bookById[U.books[0]].abbr) : '٤٠٠'}</span>`}<span><b>${esc(U.t)}</b><small>${esc(U.sub)}</small></span></a>`; }).join('')}</div></article>`).join('')}</div>
<div class="ob-step"><button type="button" data-step="-1" aria-label="المشهد السابق">${IC.back}</button><span data-step-n>١ من ${ar(ERAS.length)}</span><button type="button" data-step="1" aria-label="المشهد التالي">${IC.chev}</button></div>
</section>

<section id="ob-idea" class="ob-sec">
<header class="ob-h"><h2>الكتاب يلخّص نفسه</h2><p>ثلاث مرات في العهد الجديد تُختصر القصة كلها.</p></header>
<div class="ob-sum">${SUM.map((x) => `<div><b>${esc(x.t)}</b><p>${esc(x.d)}</p><a class="r" href="${x.href}">${x.label}</a></div>`).join('')}</div>
</section>

<section class="ob-sec ob-end">
<details class="ob-fixes"><summary>ماذا راجعنا وصحّحنا في هذه الصفحة؟</summary>
<ul>${D.fixes.map((f) => `<li>${esc(f)}</li>`).join('')}${D.units.filter((U) => U.fixes).map((U) => U.fixes.map((f) => `<li><b>${esc(U.t)}:</b> ${esc(f)}</li>`).join('')).join('')}</ul></details>
${credit}
</section>
${nav}
</div>
<div class="ob-sheet" id="obsheet" hidden role="dialog" aria-modal="true" aria-labelledby="obsh-t"><div class="bg" data-close></div><div class="pn" tabindex="-1"><button type="button" class="x" data-close aria-label="إغلاق">${IC.close}</button><div class="ct" id="obsh-c"></div></div></div>
<script>window.OVB=${JSON.stringify(DATA).replace(/</g, '\\u003c')};</script>
<script src="${u}assets/ovbooks.js" defer></script>`;
  return html;
}

// The writing prophets on a time line (used on overview/prophets.html). Time runs right to left, as Arabic reads.
export function prophetsChart(depth = 1) {
  const u = '../'.repeat(depth);
  const PRO = D.prophets.map((p) => ({ ...p, bk: bookById[p.b], n: shortName(bookById[p.b]) }));
  const X0 = 800, X1 = 400, W = 920, H = 30 * PRO.length + 64, P = 24;
  const xr = (y) => W - (P + ((X0 - y) / (X0 - X1)) * (W - 2 * P));
  const AUD = { n: ['#34496B', 'إلى الشمال'], s: ['#8C2F1E', 'إلى الجنوب'], x: ['#7A6232', 'إلى أمة أخرى'], e: ['#4B3D63', 'في السبي'], r: ['#4E5D32', 'بعد العودة'] };
  const marks = [[722, 'سقوط السامرة'], [586, 'سقوط أورشليم'], [538, 'كورش']];
  return `<figure class="ob-chart"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="الأنبياء الكتّاب على خط الزمن من ٨٠٠ إلى ٤٠٠ ق.م">
${[800, 700, 600, 500, 400].map((y) => `<g class="obx-ax"><line x1="${xr(y)}" x2="${xr(y)}" y1="26" y2="${H - 24}"/><text x="${xr(y)}" y="${H - 6}">${ar(y)} ق.م</text></g>`).join('')}
${marks.map(([y, t]) => `<g class="obx-mk"><line x1="${xr(y)}" x2="${xr(y)}" y1="20" y2="${H - 24}"/><text x="${xr(y)}" y="13">${t} ${ar(y)}</text></g>`).join('')}
${PRO.map((p, i) => { const y = 32 + i * 30, x1 = xr(p.to), w = Math.max(8, xr(p.from) - x1); return `<a class="obx-pb" href="${u}book/${p.bk.slug}.html"><rect x="${x1}" y="${y}" width="${w}" height="16" rx="8" style="fill:${AUD[p.aud][0]};--i:${i}"/><text x="${x1 - 8}" y="${y + 13}">${esc(p.n)}</text><title>${esc(p.n)}: ${esc(p.note)}</title></a>`; }).join('')}
</svg><figcaption>${Object.values(AUD).map(([c, t]) => `<span><i style="background:${c}"></i>${t}</span>`).join('')}</figcaption></figure>
<p class="ov-p">${D.undated.map((x) => `<b>${esc(shortName(bookById[x.b]))}:</b> ${esc(x.note)}`).join(' ')}</p>`;
}

// The road of key chapters (used on overview/key.html): a quiet vertical path.
export function roadMap(depth = 1) {
  return `<ol class="ob-road">${D.road.map((r, i) => { chk(r.ref, r.has, 'road ' + r.t); return `<li><i>${ar(i + 1)}</i><div><b>${esc(r.t)}</b><span>${esc(r.d)}</span><a class="r" href="${refHref(r.ref, depth)}">${refLabel(r.ref)}</a></div></li>`; }).join('')}</ol>`;
}

// Strip for the home page: the 66 books in one bar, each opening its card on the books page.
export function booksStrip(depth = 0) {
  const u = '../'.repeat(depth);
  return `<div class="ob-strip sm" role="list" aria-label="الأسفار الستة والستون">${books.map((b, i) => `<a role="listitem" href="${u}overview/books.html#b-${b.id}" style="flex:${b.chapters};--c:${GROUP_COLOR[b.group]};--i:${i}" aria-label="${esc(shortName(b))}"><span>${esc(shortName(b))}</span></a>`).join('')}</div>`;
}
