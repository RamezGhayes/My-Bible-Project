// «نظرة عامة على الكتاب المقدس»: a hub and nine short pages, each one topic, with simple infographics.
// Content: content/overview.mjs. Every reference must exist and every `has` word must be in that verse (build stops otherwise).
import path from 'node:path';
import fs from 'node:fs';
import { ROOT, books, bookById, bible, ar, esc, parseRef, refLabel, refHref, verseText, normalize, shortName, chapterHref } from '../lib.mjs';
import { IC } from './ui.mjs';
import { buildBooksAtlas, GROUP_COLOR, prophetsChart, roadMap } from './booksatlas.mjs';

const O = (await import(path.join(ROOT, 'content/overview.mjs'))).default;
const BACK = '<span class="arw" aria-hidden="true">→</span>';
const FWD = '<span class="arw" aria-hidden="true">←</span>';
const TAGS = { agreed: 'متفق عليه', likely: 'راجح', debated: 'مختلف عليه' };
const tag = (t) => (t && TAGS[t] ? `<span class="dtag ${t}">${TAGS[t]}</span>` : '');

// verse checks
const chk = (ref, has, where) => {
  const t = normalize(verseText(ref));
  if (has && !t.includes(normalize(has))) throw new Error(`Overview ${where}: "${has}" is not in ${ref}`);
  return ref;
};
const a = (ref, d, label) => `<a class="r" href="${refHref(ref, d)}">${label || refLabel(ref)}</a>`;
const span = (from, to, d) => {
  const f = parseRef(from), t = parseRef(to);
  const right = f.book.id === t.book.id ? ar(`${t.ch}: ${t.vs}`) : refLabel(to);
  return `<a class="r" href="${refHref(from, d)}">${refLabel(from)} – ${right}</a>`;
};

// Built-in pages (custom layouts below) and generic pages (content/overview/<id>.mjs), in reading order, by part.
const BUILTIN = {
  why: ['لماذا نظرة عامة؟', 'التلسكوب والميكروسكوب، والأبعاد الأربعة'],
  books: ['نظرة عامة على أسفار الكتاب المقدس', 'الأسفار الستة والستون: مكانها في القصة، وترتيبها، وأهم أصحاحاتها'],
  story: ['قصة العهد القديم في أربعة عصور', 'من آدم إلى سليمان: الشخصيات وأين نجدها'],
  split: ['الانقسام والسبي والعودة', 'العصر الخامس: مملكتان، وسبيان، وثلاث عودات'],
  prophets: ['الأنبياء الستة عشر', 'أصحاب الأسفار مرتبين حسب الزمن'],
  between: ['ما بين العهدين', 'أربع مئة سنة: الفرس واليونان والمكابيون والرومان'],
  christ: ['حياة المسيح', 'الأناجيل الأربعة، والخط الزمني، وأسبوع الآلام'],
  acts: ['الكنيسة الأولى ورحلات بولس', 'سفر الأعمال في جزأين'],
  key: ['الأصحاحات المفتاحية', 'خريطة طريق في العهدين']
};
const PARTS = [
  ['intro', 'ابدأ هنا', 'لماذا النظرة العامة، وكيف رُتّبت الأسفار'],
  ['oth', 'تاريخ العهد القديم', 'العصور الخمسة من الخلق إلى العودة من السبي'],
  ['otp', 'شخصيات العهد القديم بالتفصيل', 'كل شخصية: سنوات عمرها، ومن حولها، وأحداثها، وأماكنها'],
  ['geo', 'الأرض والخرائط', 'أين جرت القصة'],
  ['pro', 'الأنبياء', 'من هم، ومتى تنبؤوا، وما رسالة كل واحد'],
  ['bt', 'بين العهدين', 'أربع مئة سنة صنعت عالم العهد الجديد'],
  ['nt', 'العهد الجديد', 'حياة المسيح، والكنيسة الأولى، ورحلات بولس وطريقته في الكرازة'],
  ['end', 'الخلاصة', 'الأصحاحات المفتاحية التي تربط القصة كلها']
];
const ORDER = [
  ['why', 'intro'], ['books', 'intro'],
  ['story', 'oth'], ['split', 'oth'], ['kings', 'oth'],
  ['abraham', 'otp'], ['isaac', 'otp'], ['jacob', 'otp'], ['joseph', 'otp'], ['moses', 'otp'], ['joshua', 'otp'], ['judges', 'otp'], ['samuel-saul', 'otp'], ['david', 'otp'], ['solomon', 'otp'], ['ezra-nehemiah', 'otp'],
  ['land-ot', 'geo'], ['exodus', 'geo'], ['land-nt', 'geo'], ['med', 'geo'],
  ['prophets', 'pro'], ['prophets-message', 'pro'],
  ['between', 'bt'], ['between-world', 'bt'],
  ['christ', 'nt'], ['christ-years', 'nt'], ['passion', 'nt'], ['acts', 'nt'], ['church', 'nt'], ['paul', 'nt'], ['journeys', 'nt'], ['lessons', 'nt'],
  ['key', 'end']
];
const GEN = {};
{
  const dir = path.join(ROOT, 'content/overview');
  if (fs.existsSync(dir)) for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.mjs'))) { const m = (await import(path.join(dir, f))).default; GEN[m.id] = m; }
}
const PAGES = ORDER.filter(([id]) => BUILTIN[id] || GEN[id]).map(([id, part]) => [id, ...(BUILTIN[id] || [GEN[id].t, GEN[id].sub]), part]);

export async function buildOverview({ write, page }) {
  const S = O.source;
  const credit = (eps) => `<p class="ov-src">مبني على سلسلة «${esc(S.series)}» (${ar(S.count)} حلقة) لـ${esc(S.who)}، ${esc(S.role)}${eps ? `، الحلقات ${eps}` : ''}. <a href="${S.url}" rel="noopener" target="_blank">قائمة الحلقات على يوتيوب</a>. كل شاهد هنا مُراجَع على نص فاندايك، وما خالف فيه المحاضرُ النصَّ أو التأريخَ الشائع مكتوب تحت «تصحيح».</p>`;
  const fix = (t, ref) => (t ? `<div class="ov-fix"><b>تصحيح</b><p>${esc(t)}${ref ? ` (${a(ref, 1)})` : ''}</p></div>` : '');
  const shell = (i, inner) => {
    const [id, t, sub] = PAGES[i];
    const prev = PAGES[i - 1], next = PAGES[i + 1];
    return `<section class="ov-h"><div class="in"><a class="back5 lt" href="../overview.html">${BACK} العودة إلى نظرة عامة</a><span class="ey">نظرة عامة على الكتاب المقدس · ${(() => { const J = PAGES.filter((p) => p[0] !== 'books'); const k = J.findIndex((p) => p[0] === PAGES[i][0]); return k < 0 ? 'أداة' : `المحطة ${ar(k + 1)} من ${ar(J.length)}`; })()}</span><h1>${t}</h1><p>${sub}</p></div></section>
<div class="ov-w">${inner}
<nav class="c5ch ov-nav">${prev ? `<a href="${prev[0]}.html"><small>${BACK} السابق</small><b>${prev[1]}</b></a>` : '<a href="../overview.html"><small>' + BACK + ' البداية</small><b>كل الأقسام</b></a>'}${next ? `<a class="nx" href="${next[0]}.html"><small>التالي ${FWD}</small><b>${next[1]}</b></a>` : '<span></span>'}</nav></div>`;
  };
  const idx = (id) => PAGES.findIndex((p) => p[0] === id);
  const out = (id, html, extra = '') => write(`overview/${id}.html`, page({ title: `${PAGES.find((p) => p[0] === id)[1]} · نظرة عامة`, depth: 1, nav: 'overview', body: html, cls: 'v3 v5hub ovp' + extra, head: '<link rel="stylesheet" href="../assets/ovbooks.css">', after: id === 'books' ? '' : '<script src="../assets/ovpeek.js" defer></script><script src="../assets/ovpage.js" defer></script>' }));

  // ---- hub (BibleProject-style collection: pictures, a featured card, parts with picture cards) ----
  const W = O.why;
  const THUMB = { story: 'person-noah', kings: 'person-p1jxvx0j', abraham: 'person-abraham', isaac: 'person-isaac', jacob: 'person-jacob', joseph: 'person-joseph', moses: 'person-moses', joshua: 'person-joshua', david: 'person-pbyh5cb', exodus: 'person-aaron', med: 'place-malta', prophets: 'person-p13x78wo', 'prophets-message': 'person-p1mmagrk', christ: 'person-pd599of', passion: 'place-jerusalem', acts: 'place-antioch', church: 'person-peter', paul: 'person-paul', journeys: 'place-corinth', lessons: 'place-athens' };
  for (const v of Object.values(THUMB)) if (!fs.existsSync(path.join(ROOT, 'src/v2/assets', v + '.webp'))) throw new Error('Overview hub: missing ' + v);

  // The hub is one journey: every step opens in a large window over this page (assets/ovjourney.js), so the reader never leaves it.
  const STEPS = PAGES.filter((p) => p[0] !== 'books');
  const stepNo = (id) => STEPS.findIndex((p) => p[0] === id);
  const row = ([id, t2, sub]) => `<a href="overview/${id}.html" data-step="${id}">${THUMB[id] ? `<img src="assets/${THUMB[id]}.webp" alt="" loading="lazy">` : `<span class="ob-ph">${ar(stepNo(id) + 1)}</span>`}<span><b>${t2}</b><small>${sub}</small></span><span class="ok" aria-hidden="true">${IC.check}</span></a>`;
  const strip = `<div class="ob-strip sm" aria-hidden="true">${books.map((b, i) => `<span style="flex:${b.chapters};--c:${GROUP_COLOR[b.group]};--i:${i}"></span>`).join('')}</div>`;
  const parts = PARTS.filter(([k]) => STEPS.some((p) => p[3] === k));
  const OVJ = { steps: STEPS.map(([id, t, sub, part]) => ({ id, t, sub, part: PARTS.find((x) => x[0] === part)[1] })) };
  write('overview.html', page({ title: 'نظرة عامة على الكتاب المقدس', depth: 0, nav: 'overview', cls: 'v3 v5hub ovp ovh', head: '<link rel="stylesheet" href="assets/ovbooks.css">', body: `<section class="ovh-hero"><div class="in"><a class="ob-back" href="bible.html"><span aria-hidden="true">→</span> الكتاب المقدس</a>
<h1>نظرة عامة على الكتاب المقدس</h1><p>القصة كلها في ${ar(STEPS.length)} محطة قصيرة، من الخلق إلى الكنيسة الأولى.</p>
<div class="ovh-go"><a class="ovh-cta" href="overview/${STEPS[0][0]}.html" data-start><span data-start-l>ابدأ الرحلة</span>${IC.chev}</a><span class="ovh-prog" hidden><i><i></i></i><small data-prog></small></span></div></div></section>
<div class="ovh-w">
<ol class="ovh-path">${parts.map(([k, t, d], n) => `<li class="ovh-part" id="p-${k}"><i>${ar(n + 1)}</i><h2>${t}</h2><p>${d}</p><div class="ovh-list">${STEPS.filter((p) => p[3] === k).map(row).join('')}</div></li>`).join('')}</ol>
<a class="ovh-feat" href="overview/books.html"><span class="tp"><span><small>أداة</small><b>تصفّح الأسفار الستة والستين</b></span><span class="go2">${IC.chev}</span></span>${strip}</a>
${credit('')}</div>
<div class="ob-sheet jm" id="obsheet" hidden role="dialog" aria-modal="true" aria-labelledby="jm-t"><div class="bg" data-close></div><div class="pn" tabindex="-1">
<header class="jm-h"><button type="button" class="x" data-close aria-label="إغلاق">${IC.close}</button><small data-jm-k></small><h2 id="jm-t" data-jm-t></h2><span class="jm-bar"><i data-jm-bar></i></span></header>
<div class="ct" id="jm-c"></div>
<footer class="jm-f"><button type="button" data-jm-prev>${BACK} <span></span></button><button type="button" class="nx" data-jm-next><span></span> ${FWD}</button></footer>
<div class="ob-peek" hidden></div></div></div>
<script>window.OVJ=${JSON.stringify(OVJ).replace(/</g, '\\u003c')};</script>
<script src="assets/ovpeek.js" defer></script><script src="assets/ovjourney.js" defer></script>` }));

  // ---- 1. why ----
  out('why', shell(idx('why'), `<p class="ov-lead">${esc(W.lead)}</p>
<div class="ov-pair">${W.pairs.map((x, i) => `<div class="${i ? 'tel' : 'mic'}"><span class="ov-ico" aria-hidden="true">${i ? '<svg viewBox="0 0 48 48"><path d="M6 30l26-14 4 8-26 14z"/><path d="M36 24l6-3M20 34l-4 10M20 34l6 10"/></svg>' : '<svg viewBox="0 0 48 48"><circle cx="22" cy="18" r="8"/><path d="M22 26v8M14 40h20M28 12l8-6"/></svg>'}</span><b>${esc(x.t)}</b><p>${esc(x.d)}</p></div>`).join('')}</div>
<h2 class="ov-h2">أربعة أبعاد نراها في النظرة العامة</h2>
<div class="ov-dims">${W.dims.map((x, i) => `<div><em>${ar(i + 1)}</em><b>${esc(x.t)}</b><small>${esc(x.d)}</small></div>`).join('')}</div>
<p class="ov-p">والبعد العملي الأهم عند المحاضر هو الشواهد: أن تعرف أين تبدأ كل شخصية في الكتاب وأين تنتهي، فيصير عندك فهرس للقصة كلها.</p>
${credit(W.eps)}`));

  // ---- 2. books: the interactive books overview (booksatlas.mjs) ----
  {
    const i = idx('books'), prev = PAGES[i - 1], next = PAGES[i + 1];
    const navh = `<nav class="c5ch ov-nav">${prev ? `<a href="${prev[0]}.html"><small>${BACK} السابق</small><b>${prev[1]}</b></a>` : '<span></span>'}${next ? `<a class="nx" href="${next[0]}.html"><small>التالي ${FWD}</small><b>${next[1]}</b></a>` : '<span></span>'}</nav>`;
    const pageHref = (id) => { const p = PAGES.find((x) => x[0] === id); return p ? { href: `${id}.html`, t: p[1] } : null; };
    out('books', await buildBooksAtlas({ depth: 1, a, nav: navh, credit: credit('٢، ٣، ١٥، ٧٤'), pageHref }), ' obp');
  }

  // ---- 3. story (eras 1–4) ----
  const person = (p, w) => {
    chk(p.from, p.fromHas, w + ' ' + p.n); chk(p.to, p.toHas, w + ' ' + p.n);
    for (const [, r, h] of p.ev) chk(r, h, w + ' ' + p.n);
    if (p.years) chk(p.years[0], p.years[1], w + ' ' + p.n);
    return `<div class="ov-p5"><div class="hd"><b>${esc(p.n)}</b>${span(p.from, p.to, 1)}</div>${p.years ? `<small class="yr">ملك أربعين سنة (${a(p.years[0], 1)})</small>` : ''}<ul>${p.ev.map(([t, r]) => `<li>${esc(t)} <span>${a(r, 1)}</span></li>`).join('')}</ul></div>`;
  };
  out('story', shell(idx('story'), `<p class="ov-lead">يقسّم المحاضر تاريخ العهد القديم إلى خمسة عصور على ورقتين. الورقة الأولى (هنا) أربعة عصور من آدم إلى سليمان، والورقة الثانية هي «الانقسام والسبي والعودة». لكل شخصية بداية ونهاية في النص: هذا فهرسك للقصة.</p>
<ol class="ov-eras">${O.eras.map((E, i) => `<li id="${E.id}"><div class="ov-era"><em>${ar(i + 1)}</em><div><h2>${esc(E.t)}</h2><p>${esc(E.sub)}</p></div></div>
<div class="ov-people">${E.people.map((p) => person(p, E.id)).join('')}</div>
${(E.notes || []).map((n) => { chk(n.ref, n.has, E.id); return `<div class="ov-note"><b>${esc(n.t)}</b> ${tag(n.tag)}<p>${esc(n.d)} (${a(n.ref, 1)})</p></div>`; }).join('')}</li>`).join('')}</ol>
${credit('٤ – ٦، ٢٩ – ٤٢')}`));

  // ---- 4. split ----
  const P = O.split;
  chk(P.division.ref, P.division.has, 'split'); chk(P.north.end.ref, P.north.end.has, 'split'); chk(P.south.end.ref, P.south.end.has, 'split'); chk(P.fixRef[0], P.fixRef[1], 'split'); chk(P.seventy.ref, P.seventy.has, 'split');
  const span5 = 931 - 586, pos = (y) => (((931 - y) / span5) * 100).toFixed(2);
  const lane = (K, c) => `<div class="ov-lane"><div class="lab"><b>${esc(K.t)}</b><small>العاصمة: ${esc(K.cap)} · ${esc(K.kings)}</small></div><div class="trk"><span style="right:0;width:${pos(K.to)}%;--c:${c}"><em>${ar(K.from)} – ${ar(K.to)} ق.م · نحو ${ar(K.from - K.to)} سنة</em></span></div><p>${esc(K.end.d)} <b>${esc(K.end.y)}</b> (${a(K.end.ref, 1)})</p></div>`;
  out('split', shell(idx('split'), `<div class="ov-note big"><b>${esc(P.division.y)}: انقسام المملكة</b><p>${esc(P.division.d)} (${a(P.division.ref, 1)})</p></div>
<h2 class="ov-h2">مملكتان</h2>
<div class="ov-lanes">${lane(P.north, '#34496B')}${lane(P.south, '#8C2F1E')}<div class="ov-axis"><span style="right:0">٩٣١</span><span style="right:${pos(722)}%">٧٢٢</span><span style="right:100%">٥٨٦ ق.م</span></div></div>
${fix(P.fix, P.fixRef[0])}
<h2 class="ov-h2">السبي البابلي في ثلاث مراحل</h2>
<div class="ov-steps">${P.exile.map((x, i) => { chk(x.ref, x.has, 'split'); return `<div><em>${ar(i + 1)}</em><b>${esc(x.y)}</b><span>الملك: ${esc(x.king)}</span><span>${esc(x.prophet)}</span>${a(x.ref, 1)}</div>`; }).join('')}</div>
<div class="ov-note"><b>سبعون سنة</b><p>${esc(P.seventy.d)} (${a(P.seventy.ref, 1)})</p></div>
<h2 class="ov-h2">العودة في ثلاث مراحل</h2>
<div class="ov-steps ret">${P.ret.map((x, i) => { chk(x.ref, x.has, 'split'); if (x.more) chk(x.more[0], x.more[1], 'split'); return `<div><em>${i ? ar(i) : '★'}</em><b>${esc(x.y)} · ${esc(x.t)}</b><span>${esc(x.who)}</span><small>${esc(x.d)}</small>${a(x.ref, 1)}${x.more ? ' · ' + a(x.more[0], 1) : ''}</div>`; }).join('')}</div>
${credit(P.eps)}`));

  // ---- 5. prophets ----
  const R = O.prophets;
  const REG = (t) => (/الشمال/.test(t) ? 'n' : /الجنوب|يهوذا/.test(t) ? 's' : /بابل|المسبيين/.test(t) ? 'x' : /العائدين/.test(t) ? 'r' : 'f');
  out('prophets', shell(idx('prophets'), `<p class="ov-lead">${esc(R.lead)}</p>
<div class="ov-leg2"><span class="n">إلى الشمال</span><span class="s">إلى الجنوب</span><span class="x">في السبي</span><span class="r">بعد العودة</span><span class="f">إلى أمة أخرى</span></div>
<div class="ov-proph">${R.groups.map((G) => `<div><h2>${esc(G.t)}</h2><small>${esc(G.d)}</small>${G.list.map((p) => { chk(p.ref, p.has, 'prophets ' + p.n); return `<div class="pp ${REG(p.to)}"><b>${esc(p.n)}</b><span>${esc(p.y)}${/مختلف/.test(p.y) ? '' : ' ق.م'}</span><small>${esc(p.to)}</small>${tag(p.tag)}${a(p.ref, 1)}</div>`; }).join('')}</div>`).join('')}</div>
<p class="ov-p">${esc(R.note)}</p>${fix(R.fix)}
<h2 class="ov-h2">على خط الزمن</h2>${prophetsChart(1)}
${credit(R.eps)}`));

  // ---- 6. between ----
  const B = O.between;
  const bspan = 539 - 4, bp = (y) => (((539 - y) / bspan) * 100).toFixed(2);
  out('between', shell(idx('between'), `<p class="ov-lead">${esc(B.lead)}</p>
<div class="ov-tl">${B.periods.map((x) => `<span style="right:${bp(x.from)}%;width:${(bp(x.to) - bp(x.from)).toFixed(2)}%;--c:${x.c}"><b>${esc(x.t)}</b><small>${ar(x.from)} – ${ar(x.to)}</small></span>`).join('')}</div>
<div class="ov-axis2"><span>٥٣٩ ق.م</span><span>٤ ق.م</span></div>
<div class="ov-periods">${B.periods.map((x) => `<div style="--c:${x.c}"><b>${esc(x.t)}</b><small>${ar(x.from)} – ${ar(x.to)} ق.م تقريباً</small><p>${esc(x.d)}</p></div>`).join('')}</div>
<h2 class="ov-h2">آثارها في العهد الجديد</h2>
<div class="ov-links">${B.links.map((x) => { chk(x.ref, x.has, 'between'); return `<div><b>${esc(x.t)}</b><p>${esc(x.d)}</p><q>${esc(verseText(x.ref))}</q>${a(x.ref, 1)}</div>`; }).join('')}</div>
<p class="ov-p">${esc(B.note)}</p>
${credit(B.eps)}`));

  // ---- 7. christ ----
  const C = O.christ;
  out('christ', shell(idx('christ'), `<h2 class="ov-h2">أربعة أناجيل، أربع زوايا</h2>
<div class="ov-gos">${C.gospels.map((g) => { if (g.ref) chk(g.ref, g.has, 'christ'); return `<div><span>${esc(g.n)}</span><b>${esc(g.a)}</b><small>${esc(g.d)}${g.ref ? ` (${a(g.ref, 1)})` : ''}</small></div>`; }).join('')}</div>
<p class="ov-p">${esc(C.gospelsBy)}</p>
<h2 class="ov-h2">الخط الزمني</h2>
<ol class="ov-vt">${C.timeline.map((x) => { chk(x.ref, x.has, 'christ'); return `<li><small>${esc(x.y)}</small><b>${esc(x.t)}</b>${x.d ? `<p>${esc(x.d)}</p>` : ''}${a(x.ref, 1)}</li>`; }).join('')}</ol>
<div class="ov-note"><b>متى صُلب؟</b> ${tag('debated')}<p>${esc(C.when)}</p></div>
<h2 class="ov-h2">أسبوع الآلام في مرقس</h2>
<div class="ov-week">${C.week.map((x) => { chk(x.ref, x.has, 'christ week'); return `<div><span>${esc(x.d)}</span><b>${esc(x.t)}</b>${tag(x.tag)}${a(x.ref, 1)}</div>`; }).join('')}</div>
<p class="ov-p">توزيع أحداث الثلاثاء والأربعاء على الأيام هو الترتيب الشائع، لا نصاً صريحاً لكل يوم.</p>
${credit(C.eps)}`));

  // ---- 8. acts ----
  const A = O.acts;
  chk(A.key.ref, A.key.has, 'acts');
  out('acts', shell(idx('acts'), `<div class="ov-note big"><b>خطة السفر في آية</b><p><q>${esc(verseText(A.key.ref))}</q> ${a(A.key.ref, 1)}</p></div>
<div class="ov-tbl" role="table">${A.table.map((r, i) => `<div role="row" class="${i ? '' : 'h'}">${r.map((c, j) => `<span role="${i ? (j ? 'cell' : 'rowheader') : 'columnheader'}">${esc(c)}</span>`).join('')}</div>`).join('')}</div>
<h2 class="ov-h2">رحلات بولس</h2>
<ol class="ov-vt">${A.journeys.map((j) => { chk(j.from, j.fromHas, 'acts ' + j.t); chk(j.to, j.toHas, 'acts ' + j.t); return `<li><b>${esc(j.t)}</b><p>${esc(j.d)}</p>${span(j.from, j.to, 1)}</li>`; }).join('')}</ol>
<p class="ov-p"><a class="r" href="../maps/paul.html">افتح خريطة رحلات بولس، محطة بعد محطة ${FWD}</a></p>
${credit(A.eps)}`));

  // ---- 9. key chapters ----
  const K = O.keyChapters;
  const chip = ([t, r]) => { const p = parseRef(r); return `<a href="${chapterHref(p.book, p.ch, 1)}"><b>${esc(t)}</b><small>${refLabel(r)}</small></a>`; };
  out('key', shell(idx('key'), `<p class="ov-lead">${esc(K.lead)}</p>
<h2 class="ov-h2">ست عشرة محطة تربط القصة</h2>${roadMap(1)}
<h2 class="ov-h2">العهد القديم <small>${ar(K.ot.length)} أصحاحاً</small></h2><div class="ov-chips">${K.ot.map(chip).join('')}</div>
${fix(K.fix, '1Kgs.8.63')}
<h2 class="ov-h2">العهد الجديد <small>${ar(K.nt.length)} أصحاحاً</small></h2><div class="ov-chips nt">${K.nt.map(chip).join('')}</div>
${credit(K.eps)}`));
  // ---- generic pages (content/overview/<id>.mjs) ----
  const RF = (x, w) => { for (const [r, h] of x.also || []) chk(r, h, w); if (!x.ref) return ''; chk(x.ref, x.has, w); return x.to ? (chk(x.to, x.toHas, w), span(x.ref, x.to, 1)) : a(x.ref, 1); };
  const txt = (s) => esc(s).replace(/«([^»]+)»/g, '«$1»');
  const block = (B, w) => {
    if (B.h) return `<h2 class="ov-h2">${esc(B.h)}${B.small ? ` <small>${esc(B.small)}</small>` : ''}</h2>`;
    if (B.lead) return `<p class="ov-lead">${txt(B.lead)}</p>`;
    if (B.p) return `<p class="ov-p">${txt(B.p)}${B.ref ? ` (${RF(B, w)})` : ''}</p>`;
    if (B.note) return `<div class="ov-note${B.big ? ' big' : ''}"><b>${esc(B.note)}</b> ${tag(B.tag)}<p>${txt(B.d)}${B.ref ? ` (${RF(B, w)})` : ''}</p></div>`;
    if (B.fix) return `<div class="ov-fix"><b>تصحيح</b><p>${txt(B.fix)}${B.ref ? ` (${RF(B, w)})` : ''}</p></div>`;
    if (B.quote) { chk(B.quote, B.has, w); return `<blockquote class="ov-q"><p>${esc(verseText(B.quote))}</p>${a(B.quote, 1)}</blockquote>`; }
    if (B.years) {
      const ys = B.years.map((y) => +y.age);
      const lo = Math.min(...ys), hi = Math.max(...ys);
      return `<div class="ov-age"><div class="ln">${B.years.map((y) => `<span style="right:${(((+y.age - lo) / Math.max(1, hi - lo)) * 100).toFixed(1)}%" title="${esc(y.t)}"><i></i></span>`).join('')}</div>
<ol>${B.years.map((y) => `<li><em>${ar(y.age)}</em><div><b>${esc(y.t)}</b>${y.d ? `<small>${txt(y.d)}</small>` : ''}${RF(y, w)}</div></li>`).join('')}</ol>${B.unit ? `<p class="ov-tot">${esc(B.unit)}</p>` : ''}</div>`;
    }
    if (B.route) return `<ol class="ov-route">${B.route.map((x, i) => `<li><em>${ar(i + 1)}</em><b>${esc(x.n)}</b>${x.d ? `<small>${txt(x.d)}</small>` : ''}${RF(x, w)}</li>`).join('')}</ol>`;
    if (B.steps) return `<ol class="ov-vt">${B.steps.map((x) => `<li>${x.y ? `<small>${esc(x.y)}</small>` : ''}<b>${esc(x.t)}</b> ${tag(x.tag)}${x.d ? `<p>${txt(x.d)}</p>` : ''}${RF(x, w)}</li>`).join('')}</ol>`;
    if (B.cards) return `<div class="ov-cards${B.cols ? ' c' + B.cols : ''}">${B.cards.map((x) => `<div${x.c ? ` style="--c:${x.c}"` : ''}><b>${esc(x.t)}</b> ${tag(x.tag)}${x.s ? `<small>${esc(x.s)}</small>` : ''}${x.d ? `<p>${txt(x.d)}</p>` : ''}${RF(x, w)}</div>`).join('')}</div>`;
    if (B.people) return `<div class="ov-ppl">${B.people.map((x) => `<div><b>${esc(x.n)}</b>${x.d ? `<small>${txt(x.d)}</small>` : ''}${RF(x, w)}</div>`).join('')}</div>`;
    if (B.bars) { const mx = Math.max(...B.bars.map((x) => x.v)); return `<div class="ov-bars">${B.bars.map((x) => `<div><span class="t"><b>${esc(x.t)}</b>${x.s ? `<small>${esc(x.s)}</small>` : ''}</span><span class="b">${((pc) => `<i style="width:${pc.toFixed(1)}%;--c:${x.c || 'var(--gold)'}"></i><em${pc > 80 ? ' class="in"' : ` style="inset-inline-start:calc(${pc.toFixed(1)}% + 6px)"`}>${esc(x.label || ar(x.v))}</em>`)((x.v / mx) * 100)}</span>${RF(x, w)}</div>`).join('')}</div>${B.unit ? `<p class="ov-tot">${esc(B.unit)}</p>` : ''}`; }
    if (B.table) return `<div class="ov-tbl t${B.table.head.length}" role="table"><div role="row" class="h">${B.table.head.map((c) => `<span role="columnheader">${esc(c)}</span>`).join('')}</div>${B.table.rows.map((r) => `<div role="row">${r.c.map((c, j) => `<span role="${j ? 'cell' : 'rowheader'}">${txt(c)}</span>`).join('')}${r.ref ? `<span role="cell">${RF(r, w)}</span>` : ''}</div>`).join('')}</div>`;
    if (B.html) return B.html;
    throw new Error('Overview ' + w + ': unknown block ' + JSON.stringify(B).slice(0, 80));
  };
  for (const G of Object.values(GEN)) {
    if (idx(G.id) < 0) throw new Error('Overview: page ' + G.id + ' is not in ORDER');
    out(G.id, shell(idx(G.id), G.blocks.map((B) => block(B, G.id)).join('\n') + (G.fixes || []).map((x) => block({ fix: x.d, ref: x.ref, has: x.has }, G.id)).join('') + credit(G.eps)));
  }
}
