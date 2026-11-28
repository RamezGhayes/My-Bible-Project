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
  const PRO = D.prophets.map((p) => ({ ...p, n: shortName(bookById[p.b]) }));
  const ROAD = D.road.map((r) => ({ t: r.t, d: r.d, href: refHref(chk(r.ref, r.has, 'road ' + r.t), depth), label: refLabel(r.ref) }));
  const SUM = D.idea.summary.map((x) => ({ ...x, href: refHref(chk(x.ref, x.has, 'idea'), depth), label: refLabel(x.ref) }));
  const HN = D.hebrew.map((x) => ({ ...x, href: refHref(chk(x.ref, x.has, 'hebrew'), depth), label: refLabel(x.ref) }));
  chk('Lev.19.18', 'قريبك', 'fixes'); chk('Deut.6.5', 'قلبك', 'fixes'); chk('Num.33.3', 'الخامس عشر', 'fixes');

  const DATA = { books: B, groups, units: UN, eras: ERAS, heb: HEB, root: u };
  const bk = (id) => B.find((x) => x.id === id);

  // ---- markup (server side; the script enhances it) ----
  const strip = `<div class="ob-strip" role="list" aria-label="الأسفار الستة والستون، عرض كل سفر بعدد أصحاحاته">${B.map((x, i) => `<a role="listitem" href="#b-${x.id}" data-book="${x.id}" style="flex:${x.ch};--c:${GROUP_COLOR[x.g]};--i:${i}" title="${esc(x.n)} · ${ar(x.ch)}"><span>${esc(x.n)}</span></a>`).join('')}</div>
<div class="ob-strip-k"><span>التكوين</span><span class="mid">ملاخي · ٤٠٠ سنة · متى</span><span>الرؤيا</span></div>`;

  const tile = (x) => `<a class="ob-tile" href="${x.href}" data-book="${x.id}" data-t="${x.t}" data-g="${x.g}" data-q="${esc(normalize(x.full + ' ' + x.n + ' ' + x.ab + ' ' + x.gn))}" style="--c:${GROUP_COLOR[x.g]};--w:${Math.round(Math.sqrt(x.ch) * 100) / 100}"><em>${esc(x.ab)}</em><b>${esc(x.n)}</b><small>${ar(x.ch)}</small><i class="ob-pr" aria-hidden="true"><i></i></i></a>`;

  const ordTile = (id) => { const x = bk(id); return `<span class="ot" data-book="${id}" style="--c:${GROUP_COLOR[x.g]}" role="button" tabindex="0">${esc(x.n)}</span>`; };

  // prophets chart (SVG, server side). Time runs right to left (earlier on the right), as Arabic reads.
  const X0 = 800, X1 = 400, W = 920, H = 34 * PRO.length + 70, L = 20, R = 20;
  const xs = (y) => R + ((X0 - y) / (X0 - X1)) * (W - L - R);
  const xr = (y) => W - xs(y);
  const AUD = { n: ['#34496B', 'إلى الشمال (إسرائيل)'], s: ['#8C2F1E', 'إلى الجنوب (يهوذا)'], x: ['#7A6232', 'إلى الأمم'], e: ['#4B3D63', 'في السبي'], r: ['#4E5D32', 'بعد العودة'] };
  const marks = [[722, 'سقوط السامرة'], [586, 'سقوط أورشليم'], [538, 'أمر كورش'], [445, 'سور نحميا']];
  const chart = `<div class="ob-pch"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="الأنبياء الكتّاب على خط الزمن من ٨٠٠ إلى ٤٠٠ ق.م">
${[800, 750, 700, 650, 600, 550, 500, 450, 400].map((y) => `<g class="obx-ax"><line x1="${xr(y)}" x2="${xr(y)}" y1="24" y2="${H - 22}"/><text x="${xr(y)}" y="${H - 6}">${ar(y)}</text></g>`).join('')}
${marks.map(([y, t]) => `<g class="obx-mk"><line x1="${xr(y)}" x2="${xr(y)}" y1="18" y2="${H - 22}"/><text x="${xr(y)}" y="13">${t} ${ar(y)}</text></g>`).join('')}
${PRO.map((p, i) => { const y = 34 + i * 34, x1 = xr(p.to), w = Math.max(10, xr(p.from) - x1); return `<g class="obx-pb" data-book="${p.b}" tabindex="0" role="button" aria-label="${esc(p.n)}: ${esc(p.note)}"><rect x="${x1}" y="${y}" width="${w}" height="22" rx="6" style="fill:${AUD[p.aud][0]};--i:${i}"/><text x="${x1 - 8}" y="${y + 16}" class="obx-nm">${esc(p.n)}</text><title>${esc(p.n)}: ${esc(p.note)}</title></g>`; }).join('')}
</svg></div>
<div class="ob-pkey">${Object.values(AUD).map(([c, t]) => `<span><i style="background:${c}"></i>${t}</span>`).join('')}</div>
<div class="ob-und">${D.undated.map((x) => `<button type="button" data-book="${x.b}"><b>${esc(shortName(bookById[x.b]))}</b> ${tag('debated')}<small>${esc(x.note)}</small></button>`).join('')}</div>`;

  const groupBars = (t) => groups.filter((g) => g.t === t).map((g) => `<div class="ob-gbar" data-ch="${g.ch}" data-vs="${g.vs}" style="--c:${g.c}"><b>${esc(g.n)} <small>${ar(g.b)}</small></b><span class="tr"><i></i></span><em data-num>${ar(g.ch)}</em></div>`).join('');
  const maxG = Math.max(...groups.map((g) => g.vs));

  const unitCard = (U) => `<a class="ob-unit${U.img ? '' : ' tx'}" href="#u-${U.id}" data-unit="${U.id}" style="--c:${GROUP_COLOR[bookById[U.books[0]]?.group] || '#5A4A2E'}">
<span class="im">${U.img ? `<img src="${U.img}" alt="" loading="lazy">` : `<span class="ob-glyph" aria-hidden="true">${U.books.length ? U.books.slice(0, 4).map((id) => `<i>${esc(bookById[id].abbr)}</i>`).join('') : '<i>٤٠٠</i>'}</span>`}<span class="done" aria-hidden="true">${IC.check}</span></span>
<span class="tx"><small>${U.books.length ? `${U.books.length === 1 ? 'سفر واحد' : U.books.length === 2 ? 'سفران' : ar(U.books.length) + (U.books.length <= 10 ? ' أسفار' : ' سفراً')} · ${ar(U.ch)} ${U.ch <= 10 ? 'أصحاحات' : 'أصحاحاً'}` : 'جسر تاريخي'}</small><b>${esc(U.t)}</b><span>${esc(U.sub)}</span></span></a>`;

  const TOC = [['ob-idea', 'الفكرة'], ['ob-library', 'المكتبة'], ['ob-orders', 'ترتيبان'], ['ob-story', 'القصة الواحدة'], ['ob-units', 'الأقسام الكبرى'], ['ob-numbers', 'بالأرقام'], ['ob-road', 'خريطة الطريق']];

  const html = `<section class="ob-hero"><div class="in">
<a class="back5 lt" href="../overview.html"><span class="arw" aria-hidden="true">→</span> العودة إلى نظرة عامة</a>
<span class="ey">نظرة عامة على الكتاب المقدس</span>
<h1>نظرة عامة على أسفار الكتاب المقدس</h1>
<p>مكتبة واحدة، وقصة واحدة. افتح أي سفر لترى مكانه في القصة، ومن كتبه، وأهم أصحاحاته، وكيف يقود إلى المسيح.</p>
<div class="ob-stats"><div><b data-count="${ALL.b}">${ar(ALL.b)}</b><small>سفراً</small></div><div><b data-count="${ALL.ch}">${ar(ALL.ch)}</b><small>أصحاحاً</small></div><div><b data-count="${ALL.vs}">${ar(ALL.vs)}</b><small>آية في فاندايك</small></div><div class="me" hidden><b data-read>٠</b><small>أصحاحاً قرأتها</small></div></div>
${strip}
<p class="ob-hint">كل لون مجموعة، وعرض كل سفر بعدد أصحاحاته. اضغط على أي سفر.</p>
</div></section>
<nav class="ob-toc" aria-label="أقسام الصفحة"><div>${TOC.map(([id, t]) => `<a href="#${id}">${t}</a>`).join('')}</div></nav>
<div class="ob-w">

<section id="ob-idea" class="ob-sec">
<header class="ob-h"><span>الفكرة الرئيسية</span><h2>مكتبة من ستة وستين سفراً تروي قصة واحدة</h2></header>
<p class="ob-lead">${esc(D.idea.lead)}</p>
<div class="ob-pair">${D.idea.howto.map((x, i) => `<div><span class="ic2" aria-hidden="true">${i ? '<svg viewBox="0 0 48 48"><circle cx="22" cy="18" r="8"/><path d="M22 26v8M14 40h20M28 12l8-6"/></svg>' : '<svg viewBox="0 0 48 48"><path d="M6 30l26-14 4 8-26 14z"/><path d="M36 24l6-3M20 34l-4 10M20 34l6 10"/></svg>'}</span><b>${esc(x.t)}</b><p>${esc(x.d)}</p></div>`).join('')}</div>
<h3 class="ob-h3">الكتاب يلخّص نفسه</h3>
<div class="ob-sum">${SUM.map((x, i) => `<div><em>${ar(i + 1)}</em><b>${esc(x.t)}</b><p>${esc(x.d)}</p><a class="r" href="${x.href}">${x.label}</a></div>`).join('')}</div>
</section>

<section id="ob-library" class="ob-sec">
<header class="ob-h"><span>المكتبة</span><h2>الأسفار الستة والستون</h2><p>حجم كل سفر بعدد أصحاحاته. صفِّ حسب العهد أو المجموعة، أو ابحث، ثم افتح أي سفر.</p></header>
<div class="ob-filt" hidden>
<div class="seg" role="group" aria-label="العهد"><button type="button" data-ft="all" aria-pressed="true">الكل <small>${ar(ALL.b)}</small></button><button type="button" data-ft="ot" aria-pressed="false">العهد القديم <small>${ar(OT.b)}</small></button><button type="button" data-ft="nt" aria-pressed="false">العهد الجديد <small>${ar(NT.b)}</small></button></div>
<label class="ob-ql">${IC.search}<input type="search" id="obq" placeholder="ابحث عن سفر" autocomplete="off"></label>
<button type="button" class="sort" data-sort aria-pressed="false">الأطول أولاً</button>
</div>
<div class="ob-chips" hidden>${groups.map((g) => `<button type="button" data-fg="${g.g}" data-t="${g.t}" aria-pressed="false" style="--c:${g.c}"><i></i>${esc(g.n)}</button>`).join('')}</div>
<div class="ob-lib" id="oblib">${B.map(tile).join('')}</div>
<p class="ob-empty" hidden>لا يوجد سفر بهذا الاسم.</p>
</section>

<section id="ob-orders" class="ob-sec">
<header class="ob-h"><span>ترتيبان</span><h2>نفس الأسفار في ترتيبين</h2><p>نرتب العهد القديم في خمس مجموعات (٣٩ سفراً). أما الكتاب العبري فيعدّ نفس الأسفار ٢٤ سفراً في ثلاثة أقسام، لأنه يجمع صموئيل والملوك وأخبار الأيام وعزرا ونحميا والأنبياء الاثني عشر. المحتوى واحد، والترتيب مختلف.</p></header>
<div class="ob-seg2" role="group" aria-label="الترتيب"><button type="button" data-ord="ours" aria-pressed="true">ترتيبنا: ٣٩ سفراً</button><button type="button" data-ord="heb" aria-pressed="false">الترتيب العبري: ٢٤ سفراً</button></div>
<div class="ob-ord" id="obord" data-mode="ours">${groups.filter((g) => g.t === 'ot').map((g) => `<div class="oc"><h4 style="--c:${g.c}">${esc(g.n)}<small>${ar(g.b)}</small></h4><div class="os">${B.filter((x) => x.g === g.g).map((x) => `<div class="slot">${ordTile(x.id)}</div>`).join('')}</div></div>`).join('')}</div>
<p class="ob-tot" data-ord-tot>٥ + ١٢ + ٥ + ٥ + ١٢ = ٣٩ سفراً</p>
<div class="ob-notes">${HN.map((x) => `<div><a class="r" href="${x.href}">${x.label}</a> ${tag(x.tag)}<p>${esc(x.d)}</p></div>`).join('')}</div>
</section>

</div>
<section id="ob-story" class="ob-sec ob-band">
<header class="ob-h"><span>القصة الواحدة</span><h2>من الخلق إلى السماء الجديدة</h2><p>أحد عشر مشهداً. اسحب أو استعمل الأسهم، واضغط على أي قسم أو سفر.</p></header>
<div class="ob-eras"><button type="button" class="nv prev" aria-label="المشهد السابق">${IC.back}</button><div class="track" id="obtrack">${ERAS.map((E, i) => `<article class="era" id="era-${E.id}"><span class="n">${ar(i + 1)}</span><h3>${esc(E.t)}</h3><p class="w">${esc(E.when)} ${tag(E.tag)}</p><p>${esc(E.d)}</p><div class="eu">${E.units.map((id) => { const U = UN.find((x) => x.id === id); return `<a href="#u-${id}" data-unit="${id}">${U.img ? `<img src="${U.img}" alt="" loading="lazy">` : ''}<span>${esc(U.t)}</span></a>`; }).join('')}</div><div class="eb">${[...new Set(E.units.flatMap((id) => UN.find((x) => x.id === id).books))].map((id) => `<a href="${bk(id).href}" data-book="${id}" style="--c:${GROUP_COLOR[bk(id).g]}">${esc(bk(id).n)}</a>`).join('')}</div></article>`).join('')}</div><button type="button" class="nv next" aria-label="المشهد التالي">${IC.chev}</button></div>
<div class="ob-dots" aria-hidden="true">${ERAS.map((E, i) => `<i data-i="${i}"></i>`).join('')}</div>
<div class="ob-w2">
<h3 class="ob-h3">الأنبياء الكتّاب على خط الزمن</h3>
<p class="ob-p">ستة عشر نبياً في سبعة عشر سفراً (إرميا كتب سفرين). اقرأ كل نبي مع ملوك زمنه في سفري الملوك وأخبار الأيام. السنوات تقريبية.</p>
${chart}
</div>
</section>
<div class="ob-w">

<section id="ob-units" class="ob-sec">
<header class="ob-h"><span>الأقسام الكبرى</span><h2>${ar(UN.length)} وحدة دراسية</h2><p>كل وحدة تجمع أسفاراً متجاورة في القصة: الهيكل، والأصحاحات المفتاحية، والشخصيات، والمسيح في النص، وتطبيق. علّم ما درسته، واكتب ملاحظاتك (تُحفظ في متصفحك).</p></header>
<div class="ob-prog" hidden><span>درست <b data-udone>٠</b> من ${ar(UN.length)}</span><i><i></i></i><button type="button" data-export>تنزيل ملاحظاتي</button></div>
<div class="ob-units">${UN.map(unitCard).join('')}</div>
</section>

<section id="ob-numbers" class="ob-sec">
<header class="ob-h"><span>بالأرقام</span><h2>أين تقع المساحة في الكتاب؟</h2><p>المجموعات بحسب عدد الأصحاحات أو الآيات في فاندايك.</p></header>
<div class="ob-seg2 sm" role="group" aria-label="المقياس"><button type="button" data-metric="ch" aria-pressed="true">الأصحاحات</button><button type="button" data-metric="vs" aria-pressed="false">الآيات</button></div>
<div class="ob-bars" data-max-ch="${Math.max(...groups.map((g) => g.ch))}" data-max-vs="${maxG}"><div><h4>العهد القديم <small>${ar(OT.ch)} أصحاحاً · ${ar(OT.vs)} آية</small></h4>${groupBars('ot')}</div><div><h4>العهد الجديد <small>${ar(NT.ch)} أصحاحاً · ${ar(NT.vs)} آية</small></h4>${groupBars('nt')}</div></div>
<div class="ob-facts">
<div><b>${esc(bk('Ps').n)}</b><span>أطول سفر: ${ar(bk('Ps').ch)} مزموراً</span></div>
<div><b>${esc(bk('Obad').n)}</b><span>أقصر سفر في القديم: أصحاح واحد، ${ar(bk('Obad').vs)} آية</span></div>
<div><b>${esc(bk('3John').n)}</b><span>أقصر سفر في الجديد: ${ar(bk('3John').vs)} آية</span></div>
<div><b>${Math.round((NT.ch / ALL.ch) * 100).toLocaleString('ar-EG')}٪</b><span>نصيب العهد الجديد من الأصحاحات</span></div>
</div>
</section>

<section id="ob-road" class="ob-sec">
<header class="ob-h"><span>خريطة الطريق</span><h2>${ar(ROAD.length)} محطة تربط القصة كلها</h2><p>إن قرأت هذه الأصحاحات بالترتيب، عرفت الهيكل العظمي للكتاب. اضغط على الشاهد لتقرأه.</p></header>
<ol class="ob-road">${ROAD.map((r, i) => `<li style="--i:${i}"><span class="ob-dot">${ar(i + 1)}</span><div><b>${esc(r.t)}</b><p>${esc(r.d)}</p><a class="r" href="${r.href}">${r.label}</a></div></li>`).join('')}</ol>
</section>

<section class="ob-sec" id="ob-fixes">
<details class="ob-fixes"><summary>ماذا راجعنا وصحّحنا؟ <small>${ar(D.fixes.length + D.units.reduce((n, U) => n + (U.fixes || []).length, 0))} ملاحظة</small></summary>
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

// small strip for the home page: the 66 books in one bar, each linking to its card on the books overview
export function booksStrip(depth = 0) {
  const u = '../'.repeat(depth);
  return `<div class="ob-strip home" role="list" aria-label="الأسفار الستة والستون">${books.map((b, i) => `<a role="listitem" href="${u}overview/books.html#b-${b.id}" style="flex:${b.chapters};--c:${GROUP_COLOR[b.group]};--i:${i}" title="${esc(shortName(b))} · ${ar(b.chapters)}"><span>${esc(shortName(b))}</span></a>`).join('')}</div>`;
}
