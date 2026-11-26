// «نظرة عامة على الكتاب المقدس»: a hub and nine short pages, each one topic, with simple infographics.
// Content: content/overview.mjs. Every reference must exist and every `has` word must be in that verse (build stops otherwise).
import path from 'node:path';
import { ROOT, books, bookById, bible, ar, esc, parseRef, refLabel, refHref, verseText, normalize, shortName, chapterHref } from '../lib.mjs';
import { IC } from './ui.mjs';

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

const PAGES = [
  ['why', 'لماذا نظرة عامة؟', 'التلسكوب والميكروسكوب، والأبعاد الأربعة'],
  ['books', 'أسفار الكتاب وترتيبها', '٣٩ سفراً و٢٧ سفراً، والترتيب العبري ٢٤ سفراً'],
  ['story', 'قصة العهد القديم في أربعة عصور', 'من آدم إلى سليمان: الشخصيات وأين نجدها'],
  ['split', 'الانقسام والسبي والعودة', 'العصر الخامس: مملكتان، وسبيان، وثلاث عودات'],
  ['prophets', 'الأنبياء الستة عشر', 'أصحاب الأسفار مرتبين حسب الزمن'],
  ['between', 'ما بين العهدين', 'أربع مئة سنة: الفرس واليونان والمكابيون والرومان'],
  ['christ', 'حياة المسيح', 'الأناجيل الأربعة، والخط الزمني، وأسبوع الآلام'],
  ['acts', 'الكنيسة الأولى ورحلات بولس', 'سفر الأعمال في جزأين'],
  ['key', 'الأصحاحات المفتاحية', 'خريطة طريق في العهدين']
];

export function buildOverview({ write, page }) {
  const S = O.source;
  const credit = (eps) => `<p class="ov-src">مبني على سلسلة «${esc(S.series)}» (${ar(S.count)} حلقة) لـ${esc(S.who)}، ${esc(S.role)}${eps ? `، الحلقات ${eps}` : ''}. <a href="${S.url}" rel="noopener" target="_blank">قائمة الحلقات على يوتيوب</a>. كل شاهد هنا مُراجَع على نص فاندايك، وما خالف فيه المحاضرُ النصَّ أو التأريخَ الشائع مكتوب تحت «تصحيح».</p>`;
  const fix = (t, ref) => (t ? `<div class="ov-fix"><b>تصحيح</b><p>${esc(t)}${ref ? ` (${a(ref, 1)})` : ''}</p></div>` : '');
  const shell = (i, inner) => {
    const [id, t, sub] = PAGES[i];
    const prev = PAGES[i - 1], next = PAGES[i + 1];
    return `<section class="ov-h"><div class="in"><a class="back5 lt" href="../overview.html">${BACK} العودة إلى نظرة عامة</a><span class="ey">نظرة عامة على الكتاب المقدس · ${ar(i + 1)} من ${ar(PAGES.length)}</span><h1>${t}</h1><p>${sub}</p></div></section>
<div class="ov-w">${inner}
<nav class="c5ch ov-nav">${prev ? `<a href="${prev[0]}.html"><small>${BACK} السابق</small><b>${prev[1]}</b></a>` : '<a href="../overview.html"><small>' + BACK + ' البداية</small><b>كل الأقسام</b></a>'}${next ? `<a class="nx" href="${next[0]}.html"><small>التالي ${FWD}</small><b>${next[1]}</b></a>` : '<span></span>'}</nav></div>`;
  };
  const out = (id, html) => write(`overview/${id}.html`, page({ title: `${PAGES.find((p) => p[0] === id)[1]} · نظرة عامة`, depth: 1, nav: 'overview', body: html, cls: 'v3 v5hub ovp' }));

  // ---- hub ----
  const W = O.why;
  write('overview.html', page({ title: 'نظرة عامة على الكتاب المقدس', depth: 0, nav: 'overview', cls: 'v3 v5hub ovp', body: `<section class="ov-h"><div class="in"><a class="back5 lt" href="bible.html">${BACK} العودة إلى الكتاب المقدس</a><span class="ey">من الخلق إلى الكنيسة الأولى</span><h1>نظرة عامة على الكتاب المقدس</h1><p>${esc(W.lead)}</p></div></section>
<div class="ov-w"><div class="ov-dims">${W.dims.map((x, i) => `<div><em>${ar(i + 1)}</em><b>${esc(x.t)}</b><small>${esc(x.d)}</small></div>`).join('')}</div>
<h2 class="ov-h2">الأقسام</h2>
<div class="ov-grid">${PAGES.map(([id, t, sub], i) => `<a href="overview/${id}.html"><em>${ar(i + 1)}</em><span><b>${t}</b><small>${sub}</small></span>${IC.chev}</a>`).join('')}</div>
${credit('')}</div>` }));

  // ---- 1. why ----
  out('why', shell(0, `<p class="ov-lead">${esc(W.lead)}</p>
<div class="ov-pair">${W.pairs.map((x, i) => `<div class="${i ? 'tel' : 'mic'}"><span class="ov-ico" aria-hidden="true">${i ? '<svg viewBox="0 0 48 48"><path d="M6 30l26-14 4 8-26 14z"/><path d="M36 24l6-3M20 34l-4 10M20 34l6 10"/></svg>' : '<svg viewBox="0 0 48 48"><circle cx="22" cy="18" r="8"/><path d="M22 26v8M14 40h20M28 12l8-6"/></svg>'}</span><b>${esc(x.t)}</b><p>${esc(x.d)}</p></div>`).join('')}</div>
<h2 class="ov-h2">أربعة أبعاد نراها في النظرة العامة</h2>
<div class="ov-dims">${W.dims.map((x, i) => `<div><em>${ar(i + 1)}</em><b>${esc(x.t)}</b><small>${esc(x.d)}</small></div>`).join('')}</div>
<p class="ov-p">والبعد العملي الأهم عند المحاضر هو الشواهد: أن تعرف أين تبدأ كل شخصية في الكتاب وأين تنتهي، فيصير عندك فهرس للقصة كلها.</p>
${credit(W.eps)}`));

  // ---- 2. books ----
  const groupBar = (t) => {
    const list = books.filter((b) => b.testament === t);
    const groups = [...new Set(list.map((b) => b.group))].map((g) => ({ g, n: list.find((b) => b.group === g).groupName, bs: list.filter((b) => b.group === g) }));
    const total = list.reduce((s, b) => s + b.chapters, 0);
    const COL = { torah: '#8C2F1E', history: '#9A5A24', poetry: '#B39459', major: '#4E5D32', minor: '#6B7A4A', gospels: '#1F2A44', acts: '#34496B', paul: '#4B3D63', general: '#5A6B8C', prophecy: '#7A6232' };
    return `<div class="ov-bar">${groups.map((x) => { const ch = x.bs.reduce((s, b) => s + b.chapters, 0); return `<span style="flex:${ch};--c:${COL[x.g]}" title="${esc(x.n)}: ${ar(ch)} أصحاحاً"></span>`; }).join('')}</div>
<div class="ov-legend">${groups.map((x) => { const ch = x.bs.reduce((s, b) => s + b.chapters, 0); return `<div style="--c:${COL[x.g]}"><b><i></i>${esc(x.n)} <small>${ar(x.bs.length)} ${x.bs.length > 2 && x.bs.length < 11 ? 'أسفار' : x.bs.length === 1 ? 'سفر' : 'سفراً'} · ${ar(ch)} أصحاحاً</small></b><span>${x.bs.map((b) => `<a href="../book/${b.slug}.html">${esc(shortName(b))}</a>`).join('')}</span></div>`; }).join('')}</div>
<p class="ov-tot">المجموع: ${ar(list.length)} سفراً، ${ar(total)} أصحاحاً، ${ar(list.reduce((s, b) => s + bible(b.id).chapters.reduce((u, c) => u + c.verses.length, 0), 0))} آية في فاندايك. عرض كل لون يتبع عدد أصحاحاته.</p>`;
  };
  const HEB = [
    ['التوراة', 'خمسة أسفار', [['التكوين'], ['الخروج'], ['اللاويين'], ['العدد'], ['التثنية']]],
    ['الأنبياء', 'ثمانية', [['يشوع'], ['القضاة'], ['صموئيل', 'سفر واحد'], ['الملوك', 'سفر واحد'], ['إشعياء'], ['إرميا'], ['حزقيال'], ['الاثنا عشر', 'الأنبياء الصغار في سفر واحد']]],
    ['الكتب', 'أحد عشر', [['المزامير'], ['الأمثال'], ['أيوب'], ['نشيد الأنشاد'], ['راعوث'], ['مراثي إرميا'], ['الجامعة'], ['أستير'], ['دانيال'], ['عزرا ونحميا', 'سفر واحد'], ['أخبار الأيام', 'سفر واحد']]]
  ];
  out('books', shell(1, `<h2 class="ov-h2">العهد القديم: ٣٩ سفراً في خمس مجموعات</h2>${groupBar('ot')}
<h2 class="ov-h2">نفس الأسفار في الترتيب العبري: ٢٤ سفراً</h2>
<p class="ov-p">المحتوى واحد، لكن العبرانيين يعدّون بعض الأسفار المقسومة عندنا سفراً واحداً (صموئيل، والملوك، وأخبار الأيام، وعزرا ونحميا، والأنبياء الاثنا عشر)، ويرتبونها في ثلاثة أقسام. ولهذا قال المسيح «موسى والأنبياء والمزامير» (${a(chk('Luke.24.44', 'المزامير', 'books'), 1)}).</p>
<div class="ov-heb">${HEB.map(([t, n, l]) => `<div><b>${t}</b><small>${n}</small><ol>${l.map(([x, s]) => `<li>${x}${s ? `<small>${s}</small>` : ''}</li>`).join('')}</ol></div>`).join('')}</div>
<p class="ov-tot">٥ + ٨ + ١١ = ٢٤ سفراً عبرياً = ٣٩ سفراً في ترتيبنا.</p>
<h2 class="ov-h2">العهد الجديد: ٢٧ سفراً</h2>${groupBar('nt')}
${credit('٣، ١٥')}`));

  // ---- 3. story (eras 1–4) ----
  const person = (p, w) => {
    chk(p.from, p.fromHas, w + ' ' + p.n); chk(p.to, p.toHas, w + ' ' + p.n);
    for (const [, r, h] of p.ev) chk(r, h, w + ' ' + p.n);
    if (p.years) chk(p.years[0], p.years[1], w + ' ' + p.n);
    return `<div class="ov-p5"><div class="hd"><b>${esc(p.n)}</b>${span(p.from, p.to, 1)}</div>${p.years ? `<small class="yr">ملك أربعين سنة (${a(p.years[0], 1)})</small>` : ''}<ul>${p.ev.map(([t, r]) => `<li>${esc(t)} <span>${a(r, 1)}</span></li>`).join('')}</ul></div>`;
  };
  out('story', shell(2, `<p class="ov-lead">يقسّم المحاضر تاريخ العهد القديم إلى خمسة عصور على ورقتين. الورقة الأولى (هنا) أربعة عصور من آدم إلى سليمان، والورقة الثانية هي «الانقسام والسبي والعودة». لكل شخصية بداية ونهاية في النص: هذا فهرسك للقصة.</p>
<ol class="ov-eras">${O.eras.map((E, i) => `<li id="${E.id}"><div class="ov-era"><em>${ar(i + 1)}</em><div><h2>${esc(E.t)}</h2><p>${esc(E.sub)}</p></div></div>
<div class="ov-people">${E.people.map((p) => person(p, E.id)).join('')}</div>
${(E.notes || []).map((n) => { chk(n.ref, n.has, E.id); return `<div class="ov-note"><b>${esc(n.t)}</b> ${tag(n.tag)}<p>${esc(n.d)} (${a(n.ref, 1)})</p></div>`; }).join('')}</li>`).join('')}</ol>
${credit('٤ – ٦، ٢٩ – ٤٢')}`));

  // ---- 4. split ----
  const P = O.split;
  chk(P.division.ref, P.division.has, 'split'); chk(P.north.end.ref, P.north.end.has, 'split'); chk(P.south.end.ref, P.south.end.has, 'split'); chk(P.fixRef[0], P.fixRef[1], 'split'); chk(P.seventy.ref, P.seventy.has, 'split');
  const span5 = 931 - 586, pos = (y) => (((931 - y) / span5) * 100).toFixed(2);
  const lane = (K, c) => `<div class="ov-lane"><div class="lab"><b>${esc(K.t)}</b><small>العاصمة: ${esc(K.cap)} · ${esc(K.kings)}</small></div><div class="trk"><span style="right:0;width:${pos(K.to)}%;--c:${c}"><em>${ar(K.from)} – ${ar(K.to)} ق.م · نحو ${ar(K.from - K.to)} سنة</em></span></div><p>${esc(K.end.d)} <b>${esc(K.end.y)}</b> (${a(K.end.ref, 1)})</p></div>`;
  out('split', shell(3, `<div class="ov-note big"><b>${esc(P.division.y)}: انقسام المملكة</b><p>${esc(P.division.d)} (${a(P.division.ref, 1)})</p></div>
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
  out('prophets', shell(4, `<p class="ov-lead">${esc(R.lead)}</p>
<div class="ov-leg2"><span class="n">إلى الشمال</span><span class="s">إلى الجنوب</span><span class="x">في السبي</span><span class="r">بعد العودة</span><span class="f">إلى أمة أخرى</span></div>
<div class="ov-proph">${R.groups.map((G) => `<div><h2>${esc(G.t)}</h2><small>${esc(G.d)}</small>${G.list.map((p) => { chk(p.ref, p.has, 'prophets ' + p.n); return `<div class="pp ${REG(p.to)}"><b>${esc(p.n)}</b><span>${esc(p.y)}${/مختلف/.test(p.y) ? '' : ' ق.م'}</span><small>${esc(p.to)}</small>${tag(p.tag)}${a(p.ref, 1)}</div>`; }).join('')}</div>`).join('')}</div>
<p class="ov-p">${esc(R.note)}</p>${fix(R.fix)}
${credit(R.eps)}`));

  // ---- 6. between ----
  const B = O.between;
  const bspan = 539 - 4, bp = (y) => (((539 - y) / bspan) * 100).toFixed(2);
  out('between', shell(5, `<p class="ov-lead">${esc(B.lead)}</p>
<div class="ov-tl">${B.periods.map((x) => `<span style="right:${bp(x.from)}%;width:${(bp(x.to) - bp(x.from)).toFixed(2)}%;--c:${x.c}"><b>${esc(x.t)}</b><small>${ar(x.from)} – ${ar(x.to)}</small></span>`).join('')}</div>
<div class="ov-axis2"><span>٥٣٩ ق.م</span><span>٤ ق.م</span></div>
<div class="ov-periods">${B.periods.map((x) => `<div style="--c:${x.c}"><b>${esc(x.t)}</b><small>${ar(x.from)} – ${ar(x.to)} ق.م تقريباً</small><p>${esc(x.d)}</p></div>`).join('')}</div>
<h2 class="ov-h2">آثارها في العهد الجديد</h2>
<div class="ov-links">${B.links.map((x) => { chk(x.ref, x.has, 'between'); return `<div><b>${esc(x.t)}</b><p>${esc(x.d)}</p><q>${esc(verseText(x.ref))}</q>${a(x.ref, 1)}</div>`; }).join('')}</div>
<p class="ov-p">${esc(B.note)}</p>
${credit(B.eps)}`));

  // ---- 7. christ ----
  const C = O.christ;
  out('christ', shell(6, `<h2 class="ov-h2">أربعة أناجيل، أربع زوايا</h2>
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
  out('acts', shell(7, `<div class="ov-note big"><b>خطة السفر في آية</b><p><q>${esc(verseText(A.key.ref))}</q> ${a(A.key.ref, 1)}</p></div>
<div class="ov-tbl" role="table">${A.table.map((r, i) => `<div role="row" class="${i ? '' : 'h'}">${r.map((c, j) => `<span role="${i ? (j ? 'cell' : 'rowheader') : 'columnheader'}">${esc(c)}</span>`).join('')}</div>`).join('')}</div>
<h2 class="ov-h2">رحلات بولس</h2>
<ol class="ov-vt">${A.journeys.map((j) => { chk(j.from, j.fromHas, 'acts ' + j.t); chk(j.to, j.toHas, 'acts ' + j.t); return `<li><b>${esc(j.t)}</b><p>${esc(j.d)}</p>${span(j.from, j.to, 1)}</li>`; }).join('')}</ol>
<p class="ov-p"><a class="r" href="../maps/paul.html">افتح خريطة رحلات بولس، محطة بعد محطة ${FWD}</a></p>
${credit(A.eps)}`));

  // ---- 9. key chapters ----
  const K = O.keyChapters;
  const chip = ([t, r]) => { const p = parseRef(r); return `<a href="${chapterHref(p.book, p.ch, 1)}"><b>${esc(t)}</b><small>${refLabel(r)}</small></a>`; };
  out('key', shell(8, `<p class="ov-lead">${esc(K.lead)}</p>
<h2 class="ov-h2">العهد القديم <small>${ar(K.ot.length)} أصحاحاً</small></h2><div class="ov-chips">${K.ot.map(chip).join('')}</div>
${fix(K.fix, '1Kgs.8.63')}
<h2 class="ov-h2">العهد الجديد <small>${ar(K.nt.length)} أصحاحاً</small></h2><div class="ov-chips nt">${K.nt.map(chip).join('')}</div>
${credit(K.eps)}`));
}
