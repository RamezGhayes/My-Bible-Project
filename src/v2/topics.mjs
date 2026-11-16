// Biblical topics: data loading, validation, index page, topic pages, and
// reverse links (chapter -> topics).
import { ar, esc, md, up, parseRef, refLabel, refHref, verseText, shortName, chapterHref } from '../lib.mjs';
import { header, IC } from './ui.mjs';
import { workId } from './library.mjs';
import F from '../../content/topics/foundations.mjs';
import S from '../../content/topics/salvation.mjs';
import L from '../../content/topics/life.mjs';
import C from '../../content/topics/church.mjs';
import WA from '../../content/topics/wcf-a.mjs';
import WB from '../../content/topics/wcf-b.mjs';
import WC from '../../content/topics/wcf-c.mjs';
import WD from '../../content/topics/wcf-d.mjs';
import WCF from '../../content/topics/wcf.mjs';

export const GROUPS = { 1: 'الأسس', 2: 'الخلاص', 3: 'حياة المؤمن', 4: 'الكنيسة والعبادة', 5: 'الأمور الأخيرة' };
// Supplementary topics, studied after the Confession's 33 chapters.
export const EXTRA = ['glory', 'promise', 'grace', 'atonement', 'redemption', 'salvation', 'holy-spirit', 'new-covenant', 'law-of-christ', 'prayer', 'lords-day', 'kingdom'];
export const PATH = [...new Set(WCF.map((c) => c.id)), ...EXTRA];
export { WCF };

export const TOPICS = [...F, ...S, ...L, ...C, ...WA, ...WB, ...WC, ...WD].sort((a, b) => a.group - b.group || a.order - b.order);
export const topicById = Object.fromEntries(TOPICS.map((t) => [t.id, t]));
// validation: ids, related ids, references
{
  const seen = new Set();
  for (const t of TOPICS) {
    if (seen.has(t.id)) throw new Error('Duplicate topic id ' + t.id);
    seen.add(t.id);
    for (const r of t.related) if (!topicById[r.id]) throw new Error(`Topic ${t.id}: unknown related ${r.id}`);
    for (const r of [...t.keys, ...t.chapters.map((c) => c.ref)]) parseRef(r);
  }
  for (const id of PATH) if (!topicById[id]) throw new Error('PATH unknown ' + id);
  for (const c of WCF) { if (!topicById[c.id]) throw new Error('WCF unknown ' + c.id); for (const sct of c.secs) for (const r of sct.refs) parseRef(r); }
  if (new Set(PATH).size !== PATH.length) throw new Error('PATH duplicate');
}
// topic id -> Confession chapters it expounds
export const wcfFor = {};
for (const c of WCF) { (wcfFor[c.id] ||= []).push(c); if (c.also) (wcfFor[c.also] ||= []).push(c); }

const anchor = (ref) => 'c-' + ref.replace(/[^A-Za-z0-9]+/g, '-');
export const topicHref = (t, depth, from) => `${up(depth)}topics/${t.id}.html${from ? '?from=' + encodeURIComponent(from) : ''}`;

// chapter (bookId:ch) -> [{t, c}]
export function topicLinks() {
  const m = {};
  for (const t of TOPICS) for (const c of t.chapters) {
    const r = parseRef(c.ref);
    (m[r.book.id + ':' + r.ch] ||= []).push({ t, c });
  }
  return m;
}

export function chapterTopicsBlock(list, b, n, depth) {
  if (!list?.length) return '';
  return `<div class="blk"><h3>موضوعات كتابية</h3>${list.map(({ t, c }) => `<p><a class="r" href="${topicHref(t, depth, `${b.slug}/${n}`)}#${anchor(c.ref)}">${esc(t.ar)}</a> <small class="tref">(${refLabel(c.ref)})</small>: ${md(c.why)}</p>`).join('')}</div>`;
}

function conceptMap(t, depth) {
  const rel = t.related.slice(0, 6);
  const W = 360, H = 300, cx = W / 2, cy = H / 2, R = 112;
  const nodes = rel.map((r, i) => { const a = -Math.PI / 2 + (i * 2 * Math.PI) / rel.length; return { r, x: cx + R * Math.cos(a) * 1.18, y: cy + R * Math.sin(a) }; });
  return `<svg class="cmap" viewBox="0 0 ${W} ${H}" role="img" aria-label="خريطة المفاهيم: ${esc(t.ar)} والموضوعات المرتبطة">
${nodes.map((n) => `<line x1="${cx}" y1="${cy}" x2="${n.x.toFixed(1)}" y2="${n.y.toFixed(1)}"/>`).join('')}
<g class="cn c0"><circle cx="${cx}" cy="${cy}" r="44"/><text x="${cx}" y="${cy + 5}">${esc(t.ar)}</text></g>
${nodes.map((n) => { const o = topicById[n.r.id]; return `<a href="${topicHref(o, depth)}"><g class="cn g${o.group}"><circle cx="${n.x.toFixed(1)}" cy="${n.y.toFixed(1)}" r="33"/><text x="${n.x.toFixed(1)}" y="${(n.y + 4).toFixed(1)}">${esc(o.ar.length > 11 ? o.ar.split(' ')[0] : o.ar)}</text></g></a>`; }).join('')}
</svg>`;
}

const card = (t, depth) => `<a class="tpc g${t.group}" href="${topicHref(t, depth)}" data-q="${esc((t.ar + ' ' + t.en + ' ' + t.short).toLowerCase())}" data-g="${t.group}"><small>${GROUPS[t.group]}</small><b>${esc(t.ar)}</b><span>${esc(t.short)}</span><em>${ar(t.chapters.length)} أصحاحاً مرتبطاً · ${ar(t.related.length)} موضوعات مرتبطة</em></a>`;

export function topicsIndex(depth = 0) {
  const byGroup = Object.entries(GROUPS).map(([g, name]) => `<section class="tgrp" data-g="${g}"><h2 class="lsec">${ar(g)}. ${name}</h2><div class="tgrid">${TOPICS.filter((t) => t.group === +g).map((t) => card(t, depth)).join('')}</div></section>`).join('');
  const alpha = [...TOPICS].sort((a, b) => a.ar.replace(/^ال/, '').localeCompare(b.ar.replace(/^ال/, ''), 'ar'));
  const nLinks = TOPICS.reduce((a, t) => a + t.chapters.length, 0);
  return `${header({ back: 'index.html', title: 'موضوعات كتابية' })}
<div class="lib topics">
<p class="lead">اكتشف الموضوعات الكتابية واللاهوتية، وتتبع ارتباطها عبر أسفار الكتاب المقدس. كل موضوع يبدأ من النص، ويتتبع الفكرة من العهد القديم إلى المسيح، ويربطك بالأصحاحات التي تشرحها.</p>
<div class="lstats"><div><b>${ar(WCF.length)}</b><span>فصلاً من الإقرار</span></div><div><b>${ar(TOPICS.length)}</b><span>موضوعاً</span></div><div><b>${ar(nLinks)}</b><span>رابطاً بالأصحاحات</span></div></div>
<section class="wcfi" id="wcf"><h2 class="lsec">على ترتيب إقرار إيمان وستمنستر</h2><p class="lnote">إقرار وستمنستر (1647) من أوضح الملخصات المُصلحة للتعليم الكتابي، وهو مرتب في ٣٣ فصلاً تبدأ بالكتاب المقدس وتنتهي بالدينونة الأخيرة. كل فصل هنا له صفحة تشرح ما يعلّمه الإقرار بلغة بسيطة، مع الشواهد، ثم تتعمق في الموضوع من الكتاب كله.</p><ol class="wcfl">${WCF.map((c) => { const t = topicById[c.id]; return `<li><a class="g${t.group}" href="${topicHref(t, depth)}"><span>${ar(c.n)}</span><b>${esc(c.ar)}</b>${t.ar !== c.ar ? `<small>${esc(t.ar)}</small>` : ''}</a></li>`; }).join('')}</ol>
<h3 class="tsub">موضوعات مكمّلة</h3><p class="lnote">موضوعات كتابية تتقاطع مع فصول الإقرار وتعمّقها.</p><div class="wcfx">${EXTRA.map((id) => `<a class="g${topicById[id].group}" href="${topicHref(topicById[id], depth)}">${esc(topicById[id].ar)}</a>`).join('')}</div></section>
<h2 class="lsec">كل الموضوعات</h2>
<div class="lfilters"><input type="search" id="tq" placeholder="ابحث عن موضوع" aria-label="بحث في الموضوعات"><div class="tseg" role="tablist"><button type="button" class="on" data-view="g">حسب المجموعات</button><button type="button" data-view="a">أبجدياً</button></div></div>
<div id="tviewg">${byGroup}</div>
<div id="tviewa" hidden><div class="tgrid">${alpha.map((t) => card(t, depth)).join('')}</div></div>
</div>`;
}

export function topicPage(t, depth = 1) {
  const sec = (id, title, html) => html ? `<section class="tsec" id="${id}"><h2>${title}</h2>${html}</section>` : '';
  const paras = (a) => (a || []).map((p) => `<p>${md(p)}</p>`).join('');
  const i = PATH.indexOf(t.id), prev = PATH[i - 1] && topicById[PATH[i - 1]], next = PATH[i + 1] && topicById[PATH[i + 1]];
  const W = wcfFor[t.id] || [];
  const wcfHtml = W.map((c) => `<div class="wch"><div class="wchh"><span>الفصل ${ar(c.n)}</span><b>${esc(c.ar)}</b><small dir="ltr">${esc(c.en)}</small></div><ol class="wsec">${c.secs.map((x) => { const rs = [...new Set(x.refs)], chip = (r) => `<a href="${refHref(r, depth)}">${refLabel(r)}</a>`; return `<li><p>${md(x.t)}</p><div class="wrefs">${rs.slice(0, 5).map(chip).join('')}${rs.length > 5 ? `<details><summary>+${ar(rs.length - 5)} شواهد</summary>${rs.slice(5).map(chip).join('')}</details>` : ''}</div></li>`; }).join('')}</ol></div>`).join('');
  const toc = [['t-wcf', W.length ? 'الإقرار' : ''], ['t-def', 'التعريف'], ['t-keys', 'نصوص مفتاحية'], ['t-ot', 'في العهد القديم'], ['t-nt', 'في العهد الجديد'], ['t-christ', 'والمسيح'], ['t-ref', 'الرؤية المُصلحة'], ['t-views', t.views.length ? 'اختلافات تفسيرية' : ''], ['t-rel', 'موضوعات مرتبطة'], ['t-ch', 'في الأصحاحات'], ['t-q', 'للتأمل'], ['t-src', 'المراجع']].filter((x) => x[1]);
  const body = `${header({ back: '../topics.html', title: t.ar, backLabel: 'الموضوعات' })}
<article class="topic g${t.group}">
<nav class="crumbs" aria-label="مسار التنقل"><a href="${up(depth)}index.html">الرئيسية</a><span>›</span><a href="${up(depth)}topics.html">الموضوعات</a><span>›</span><a href="${up(depth)}topics.html#g${t.group}">${GROUPS[t.group]}</a><span>›</span><b>${esc(t.ar)}</b></nav>
<a class="tback" id="tback" hidden href="#">${IC.back}<span>رجوع إلى الأصحاح</span></a>
<header class="thero"><small>${W.length ? `إقرار وستمنستر · الفصل ${W.map((c) => ar(c.n)).join(' و')}` : `${GROUPS[t.group]} · موضوع مكمّل`} · <span dir="ltr">${esc(t.en)}</span></small><h1>${esc(t.ar)}</h1><p>${esc(t.short)}</p></header>
<nav class="ttoc" aria-label="أقسام الموضوع">${toc.map(([h, l]) => `<a href="#${h}">${l}</a>`).join('')}</nav>
${sec('t-wcf', 'ماذا يعلّم إقرار وستمنستر؟', wcfHtml && wcfHtml + '<p class="note">صياغة مبسطة بتصرّف لنص الإقرار (1647)، فقرة فقرة، مع مختارات من الشواهد التي وضعها واضعوه. اضغط على أي شاهد لتقرأه في سياقه.</p>')}
${sec('t-def', 'التعريف الكتابي واللاهوتي', paras(t.def) + `<div class="tterms">${t.term.map((w) => `<div><b>${esc(w.w)}</b> <span class="orig">${esc(w.orig)}</span><p>${md(w.d)}</p></div>`).join('')}</div>`)}
${sec('t-keys', 'نصوص مفتاحية', `<div class="tkeys">${t.keys.map((k) => { const tx = verseText(k); return `<a href="${refHref(k, depth)}"><b>${refLabel(k)}</b><span>${esc(tx.length > 170 ? tx.slice(0, 168).replace(/\s+\S*$/, '') + '…' : tx)}</span></a>`; }).join('')}</div>`)}
${sec('t-ot', 'في العهد القديم', paras(t.ot))}
${sec('t-nt', 'في العهد الجديد', paras(t.nt))}
${sec('t-hist', 'عبر تاريخ الخلاص', paras(t.history))}
${sec('t-christ', 'علاقته بالمسيح', `<div class="tchrist">${paras(t.christ)}</div>`)}
${sec('t-ref', 'الرؤية المُصلحة', paras(t.reformed) + (t.voices.length ? `<h3 class="tsub">أصوات مُصلحة</h3>${t.voices.map((v) => `<div class="blk"><h3>${md(v.n)}</h3><span class="who2">${md(v.y || '')} · <a href="${up(depth)}library.html#${workId(v.n, v.w)}">${md(v.w)}</a></span><p>${md(v.b)}</p></div>`).join('')}<p class="note">ملخصات بتصرّف لأفكارهم، وليست اقتباسات حرفية.</p>` : ''))}
${sec('t-views', 'اختلافات تفسيرية', t.views.map((v) => `<div class="tview"><h3>${md(v.q)} <span class="tag ${v.tag}">${v.tag === 'debated' ? 'موضع اختلاف' : 'محل اتفاق'}</span></h3>${v.a.map((p) => `<p>${md(p)}</p>`).join('')}</div>`).join(''))}
${sec('t-rel', 'موضوعات مرتبطة', conceptMap(t, depth) + `<div class="trel">${t.related.map((r) => { const o = topicById[r.id]; return `<a class="g${o.group}" href="${topicHref(o, depth)}"><b>${esc(o.ar)}</b><span>${md(r.why)}</span></a>`; }).join('')}</div>`)}
${sec('t-ch', 'الموضوع في الأصحاحات', `<p class="lnote">كل رابط يأخذك إلى الآية في دراسة الأصحاح، ومن هناك تجد طريق العودة إلى هذا الموضوع.</p><ol class="tch">${t.chapters.map((c) => { const r = parseRef(c.ref); return `<li id="${anchor(c.ref)}"><a href="${refHref(c.ref, depth)}"><b>${refLabel(c.ref)}</b></a><span>${md(c.why)}</span></li>`; }).join('')}</ol>`)}
${sec('t-q', 'أسئلة للتأمل', `<ol class="tq">${t.questions.map((q) => `<li>${md(q)}</li>`).join('')}</ol>`)}
${sec('t-src', 'المراجع', `<ul class="tsrc">${t.voices.map((v) => `<li><a href="${up(depth)}library.html#${workId(v.n, v.w)}">${esc(v.n)}، ${esc(v.w)}</a></li>`).join('')}</ul><p class="note">الكتاب المقدس (ترجمة فاندايك) هو المرجع الأول. الأعمال أعلاه مقترحة للتوسع؛ راجع <a href="${up(depth)}library.html">المكتبة اللاهوتية</a> لحالة كل مصدر.</p>`)}
<nav class="tnext">${prev ? `<a href="${topicHref(prev, depth)}"><small>${W.length && prev && wcfFor[prev.id] ? 'الفصل السابق في الإقرار' : 'السابق'}</small><b>${esc(prev.ar)}</b></a>` : '<span></span>'}${next ? `<a href="${topicHref(next, depth)}"><small>${next && wcfFor[next.id] ? 'الفصل التالي في الإقرار' : 'التالي'}</small><b>${esc(next.ar)}</b></a>` : '<span></span>'}</nav>
</article>`;
  return body;
}

export function topicsHomeSection(depth = 0) {
  const pick = ['scripture', 'god', 'christ-mediator', 'justification', 'covenant', 'judgment'].map((id) => topicById[id]);
  return `<h2 class="hsec"><span>موضوعات كتابية</span></h2><p class="hsub">فصول إقرار إيمان وستمنستر الـ٣٣ مشروحة بعمق، وموضوعات كتابية مرتبطة بالأصحاحات.</p><div class="trow">${pick.map((t) => `<a class="tmini g${t.group}" href="${topicHref(t, depth)}"><small>${GROUPS[t.group]}</small><b>${esc(t.ar)}</b></a>`).join('')}<a class="tmini all" href="${up(depth)}topics.html"><small>${ar(TOPICS.length)} موضوعاً</small><b>كل الموضوعات</b></a></div>`;
}
