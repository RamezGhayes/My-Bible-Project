// Visual explainers ("شروح مصوّرة"): colourful, interactive pages that explain a passage
// with diagrams rather than text alone. Data lives in content/explain/*.mjs.
import { esc, md, ar, refLabel, refHref, verseText, bookById, chapterHref } from '../lib.mjs';
import { IC, header } from './ui.mjs';
import plagues from '../../content/explain/plagues.mjs';
import tabernacle from '../../content/explain/tabernacle.mjs';

export const EXPLAINERS = [plagues, tabernacle];
// Uniform "chips" for strips and cards: {id, name, color, ink, icon, ch:[chapters]}
const chips = (x) => x.plagues ? x.plagues.map((p) => ({ id: 'pl' + p.n, name: p.name, color: p.color, ink: p.ink, icon: p.icon, ch: p.n === 10 ? [11, 12] : [p.ch], label: 'الضربة ' + ORD[p.n] })) : x.steps.map((p) => ({ id: 'it-' + p.id, name: p.name, color: p.color, ink: p.ink, icon: p.icon, ch: [p.ch, ...(CH2[p.id] || [])], label: p.name }));
const CH2 = { gate: [38], altar: [38], laver: [38], table: [37], lamp: [37], incense: [37], veil: [36], ark: [37, 40] };
const hereOf = (x, n) => chips(x).filter((c) => c.ch.includes(n));

// Line icons, 64-unit box, drawn with currentColor.
const G = {
  blood: '<path d="M6 40c5-4 9-4 14 0s9 4 14 0 9-4 14 0 9 4 10 2"/><path d="M6 50c5-4 9-4 14 0s9 4 14 0 9-4 14 0 9 4 10 2"/><path d="M32 6c5 8 9 13 9 18a9 9 0 0 1-18 0c0-5 4-10 9-18z" fill="currentColor" fill-opacity=".35"/>',
  frog: '<ellipse cx="32" cy="40" rx="20" ry="13"/><circle cx="22" cy="24" r="6"/><circle cx="42" cy="24" r="6"/><circle cx="22" cy="24" r="2" fill="currentColor"/><circle cx="42" cy="24" r="2" fill="currentColor"/><path d="M24 42q8 5 16 0"/><path d="M12 50l-6 6M52 50l6 6"/>',
  gnats: '<g fill="currentColor"><circle cx="14" cy="16" r="1.8"/><circle cx="24" cy="10" r="1.8"/><circle cx="36" cy="18" r="1.8"/><circle cx="48" cy="12" r="1.8"/><circle cx="18" cy="30" r="1.8"/><circle cx="30" cy="28" r="1.8"/><circle cx="44" cy="30" r="1.8"/><circle cx="54" cy="24" r="1.8"/><circle cx="10" cy="42" r="1.8"/><circle cx="26" cy="40" r="1.8"/><circle cx="40" cy="42" r="1.8"/><circle cx="52" cy="40" r="1.8"/></g><path d="M4 56h56"/><path d="M12 56c2-3 4-3 6 0M28 56c2-3 4-3 6 0M44 56c2-3 4-3 6 0"/>',
  flies: '<ellipse cx="32" cy="38" rx="7" ry="13"/><circle cx="32" cy="22" r="5"/><ellipse cx="20" cy="30" rx="11" ry="6" transform="rotate(-25 20 30)" fill="currentColor" fill-opacity=".2"/><ellipse cx="44" cy="30" rx="11" ry="6" transform="rotate(25 44 30)" fill="currentColor" fill-opacity=".2"/><path d="M27 34h10M26 40h12M27 46h10"/>',
  cattle: '<path d="M10 16c4 6 10 8 14 8M54 16c-4 6-10 8-14 8"/><path d="M22 22h20c3 0 5 3 5 6v12c0 9-7 16-15 16s-15-7-15-16V28c0-3 2-6 5-6z"/><circle cx="25" cy="34" r="2" fill="currentColor"/><circle cx="39" cy="34" r="2" fill="currentColor"/><ellipse cx="32" cy="46" rx="7" ry="5"/>',
  boils: '<path d="M8 50c4-18 14-30 24-30s20 12 24 30z"/><circle cx="22" cy="40" r="4" fill="currentColor" fill-opacity=".35"/><circle cx="34" cy="32" r="3.2" fill="currentColor" fill-opacity=".35"/><circle cx="42" cy="42" r="4.5" fill="currentColor" fill-opacity=".35"/><circle cx="30" cy="45" r="2.5" fill="currentColor" fill-opacity=".35"/>',
  hail: '<path d="M18 30a10 10 0 0 1 2-19 13 13 0 0 1 25 3 8 8 0 0 1 1 16z"/><path d="M34 32l-5 9h7l-5 10" stroke-width="3"/><circle cx="16" cy="42" r="3"/><circle cx="22" cy="54" r="3"/><circle cx="46" cy="44" r="3"/><circle cx="52" cy="56" r="3"/>',
  locust: '<path d="M10 36c8-6 22-8 34-6 6 1 10 4 10 7s-4 5-10 5c-12 1-26-1-34-6z"/><circle cx="50" cy="35" r="1.8" fill="currentColor"/><path d="M18 36c4-10 14-16 26-16" /><path d="M28 42l-6 12M36 42l4 12M44 42l10 6"/><path d="M54 32l6-8"/>',
  gate: '<path d="M6 56V20M58 56V20M6 20h52"/><path d="M20 56V20M44 56V20"/><path d="M20 22c4 10 8 10 12 0s8-10 12 0" fill="currentColor" fill-opacity=".25"/><path d="M20 34c4 10 8 10 12 0s8-10 12 0" fill="currentColor" fill-opacity=".25"/>',
  altar: '<rect x="14" y="24" width="36" height="30" rx="2"/><path d="M14 24l-3-7M50 24l3-7M14 54l-3 4M50 54l3 4"/><path d="M14 38h36" stroke-dasharray="3 3"/><path d="M26 18c2-6 6-6 6-12 3 5 6 7 6 12" fill="currentColor" fill-opacity=".35"/>',
  laver: '<path d="M12 26h40c0 12-9 20-20 20S12 38 12 26z" fill="currentColor" fill-opacity=".2"/><path d="M12 26h40"/><path d="M28 46v8h8v-8M22 58h20"/><path d="M22 32c3 2 6 2 9 0s6-2 9 0"/>',
  table: '<rect x="10" y="22" width="44" height="6" rx="1"/><path d="M14 28v28M50 28v28M14 44h36"/><ellipse cx="22" cy="17" rx="6" ry="3.5" fill="currentColor" fill-opacity=".35"/><ellipse cx="32" cy="15" rx="6" ry="3.5" fill="currentColor" fill-opacity=".35"/><ellipse cx="42" cy="17" rx="6" ry="3.5" fill="currentColor" fill-opacity=".35"/>',
  lamp: '<path d="M32 14v40M22 58h20"/><path d="M32 46c-14 0-20-10-20-28M32 46c14 0 20-10 20-28M32 40c-8 0-12-8-12-22M32 40c8 0 12-8 12-22M32 34c-3 0-5-6-5-16M32 34c3 0 5-6 5-16"/><g fill="currentColor"><path d="M12 10c-2 3-2 5 0 6 2-1 2-3 0-6zM20 10c-2 3-2 5 0 6 2-1 2-3 0-6zM27 12c-2 3-2 5 0 6 2-1 2-3 0-6zM32 8c-2 3-2 5 0 6 2-1 2-3 0-6zM37 12c-2 3-2 5 0 6 2-1 2-3 0-6zM44 10c-2 3-2 5 0 6 2-1 2-3 0-6zM52 10c-2 3-2 5 0 6 2-1 2-3 0-6z"/></g>',
  incense: '<rect x="20" y="30" width="24" height="26" rx="1.5"/><path d="M20 30l-3-5M44 30l3-5"/><path d="M26 22c-4-5 4-7 0-12M32 24c-4-6 4-8 0-14M38 22c-4-5 4-7 0-12" opacity=".8"/>',
  veil: '<path d="M8 8h48"/><path d="M10 8v48M54 8v48"/><path d="M10 8c4 16 2 32 4 48M20 8c3 16 1 32 3 48M30 8c3 16 1 32 3 48M40 8c3 16 1 32 3 48" opacity=".6"/><path d="M26 30c3-4 9-4 12 0-3 4-9 4-12 0z" fill="currentColor" fill-opacity=".3"/>',
  ark: '<rect x="12" y="30" width="40" height="22" rx="1.5" fill="currentColor" fill-opacity=".2"/><rect x="10" y="26" width="44" height="5" rx="1"/><path d="M8 40h48"/><path d="M16 26c-2-8 2-14 10-16M48 26c2-8-2-14-10-16"/><path d="M26 10c2 6 2 10 0 16M38 10c-2 6-2 10 0 16" opacity=".7"/>',
  dark: '<circle cx="32" cy="30" r="16"/><circle cx="38" cy="26" r="15" fill="currentColor"/><path d="M6 56h52"/><path d="M14 48h36" opacity=".5"/>',
  door: '<path d="M16 58V10h32v48"/><path d="M16 10h32" stroke-width="7" style="stroke:#C9473A"/><path d="M16 14v40M48 14v40" stroke-width="4" style="stroke:#C9473A"/><path d="M24 58V20h16v38"/><circle cx="36" cy="40" r="1.6" fill="currentColor"/>'
};
export const glyph = (k, size = 48) => `<svg class="glyph" viewBox="0 0 64 64" width="${size}" height="${size}" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">${G[k] || ''}</svg>`;

const TAGS = { explicit: 'صريح في النص', likely: 'ارتباط راجح', possible: 'اقتراح تفسيري' };
const vq = (ref) => esc(String(verseText(ref) || '').replace(/^«|»$/g, '').replace(/[«»]/g, ''));

export const explainHref = (x, depth, frag = '') => `${'../'.repeat(depth)}explain/${x.id}.html${frag}`;
export const explainersFor = (b, n) => EXPLAINERS.filter((x) => x.book === b.id && x.chapters.includes(n));

// Small colourful card for the chapter story.
export function storyCard(x, b, n, depth) {
  const C = chips(x), here = hereOf(x, n);
  return `<div class="lab" style="color:#D7C49A">شرح مصوّر</div><h2 style="margin-bottom:6px">${esc(x.title)}</h2>
<p style="opacity:.75;font-size:15px;margin-bottom:14px">${here.length ? `في هذا الأصحاح: ${here.map((c) => esc(c.label)).join('، ')}` : esc(x.sub)}</p>
<div class="xstrip">${C.map((c) => `<span class="${!here.length || here.includes(c) ? 'on' : ''}" style="--c:${c.color};--k:${c.ink}">${glyph(c.icon, 26)}</span>`).join('')}</div>
<a class="btn l" style="margin-top:16px" href="${explainHref(x, depth, here[0] ? '#' + here[0].id : '')}">افتح الشرح المصوّر</a>`;
}
export function bentoTile(x, n, depth) {
  const C = chips(x), here = hereOf(x, n);
  return `<a class="tile w t-explain" href="${explainHref(x, depth, here[0] ? '#' + here[0].id : '')}"><span class="tl"><span>شرح مصوّر</span>${IC.chev}</span><span class="xstrip sm">${C.map((c) => `<span class="${!here.length || here.includes(c) ? 'on' : ''}" style="--c:${c.color};--k:${c.ink}">${glyph(c.icon, 20)}</span>`).join('')}</span><span class="tt">${esc(x.title)}: ${x.plagues ? 'المعنى والهدف' : 'خطوة خطوة نحو الحضور'}</span></a>`;
}
export const xCard = (x) => `<a class="mcard xm" href="${explainHref(x, 0)}"><div class="mv xmv${chips(x).length === 8 ? ' c4' : ''}">${chips(x).map((c) => `<span style="--c:${c.color};--k:${c.ink}">${glyph(c.icon, 22)}</span>`).join('')}</div><div class="mt"><small>العهد القديم · ${esc(bookById[x.book].name.replace(/^سفر /, ''))} · شرح مصوّر</small><b>${esc(x.title)}</b><span>${esc(x.sub)}</span></div></a>`;

const ORD = ['', 'الأولى', 'الثانية', 'الثالثة', 'الرابعة', 'الخامسة', 'السادسة', 'السابعة', 'الثامنة', 'التاسعة', 'العاشرة'];

export function explainPage(x, depth) {
  if (x.steps) return tabernaclePage(x, depth);
  const b = bookById[x.book];
  const P = x.plagues;
  const r = (ref) => `<a class="r" href="${refHref(ref, depth)}">${refLabel(ref)}</a>`;
  // pattern grid: rows = rounds of three, columns = warning type
  const grid = [0, 1, 2].map((row) => [0, 1, 2].map((col) => P[row * 3 + col])).flat();
  const tile = (p) => `<a class="xt" href="#pl${p.n}" data-go="${p.n}" style="--c:${p.color};--k:${p.ink}"><b>${ar(p.n)}</b>${glyph(p.icon, 40)}<span>${esc(p.name)}</span></a>`;
  const track = (k) => P.map((p) => {
    let st = 'off', tip = '';
    if (k === 'magi') { st = p.n <= 2 ? 'mid' : p.n === 3 || p.n === 6 ? 'on' : 'off'; tip = p.magi || (p.n > 3 ? 'اختفى السحرة من القصة' : ''); }
    if (k === 'goshen') { st = p.goshen ? 'on' : 'off'; tip = p.goshen ? `تمييز صريح (${refLabel(p.goshen)})` : 'النص لا يذكر التمييز هنا'; }
    if (k === 'heart') { st = p.heart.who === 'l' ? 'on' : 'mid'; tip = `${p.heart.t} (${refLabel(p.heart.ref)})`; }
    return `<button type="button" class="tc ${st}" style="--c:${p.color}" data-tip="${esc(`الضربة ${ORD[p.n]}: ${tip}`)}" aria-label="الضربة ${ORD[p.n]}">${ar(p.n)}</button>`;
  }).join('');
  const card = (p) => `<article class="xc" id="pl${p.n}" style="--c:${p.color};--k:${p.ink}">
<div class="xc-top"><span class="no">الضربة ${ORD[p.n]}</span><span class="cy">${p.cycle === 3 ? 'الضربة الأخيرة' : esc(x.cycles[p.cycle].t)}</span></div>
<div class="xc-ic">${glyph(p.icon, 92)}</div>
<h2>${esc(p.name)}</h2>
<div class="xc-ref">${r(p.ref)} · ${esc(p.by)}</div>
<blockquote>${vq(p.key)}<small>${refLabel(p.key)}</small></blockquote>
<div class="xc-sec"><small>ماذا حدث؟</small><p>${md(p.what)}</p></div>
<div class="xc-god"><div class="h"><small>ضد من؟</small><span class="tg2 ${p.god.tag}">${TAGS[p.god.tag]}</span></div><b>${esc(p.god.n)}</b><p>${md(p.god.d)}</p></div>
<div class="xc-sec"><small>المعنى والهدف</small><p>${md(p.meaning)}</p></div>
<div class="xc-sec"><small>فرعون</small><p>${md(p.pharaoh)}</p></div>
<div class="xc-nav">${p.n > 1 ? `<a href="#pl${p.n - 1}" data-go="${p.n - 1}">${IC.back}${esc(P[p.n - 2].name)}</a>` : '<span></span>'}<a class="ch" href="${chapterHref(b, p.ch, depth)}">${IC.read}${esc(b.name.replace(/^سفر /, ''))} ${ar(p.ch)}</a>${p.n < 10 ? `<a href="#pl${p.n + 1}" data-go="${p.n + 1}">${esc(P[p.n].name)}${IC.chev}</a>` : '<span></span>'}</div>
</article>`;
  const body = `${header({ back: `${'../'.repeat(depth)}book/${b.slug}.html`, title: 'شرح مصوّر' })}
<section class="xhero">
<span class="ey" style="color:#D7C49A">${esc(b.name)} ٧ – ١٢ · شرح مصوّر</span>
<h1>${esc(x.title)}</h1>
<p class="sub">${esc(x.sub)}</p>
<div class="xrain">${P.map((p) => `<i style="--c:${p.color}"></i>`).join('')}</div>
<blockquote>${vq(x.heroRef)}<small>${refLabel(x.heroRef)}</small></blockquote>
</section>
<div class="xbody">
<p class="lead">${md(x.intro)}</p>

<h3 class="xh"><span>١</span>النمط: ثلاث جولات وضربة أخيرة</h3>
<p class="xp">الضربات ليست عشوائية. تأتي في ثلاث جولات، كل جولة فيها ثلاث ضربات بنفس الترتيب. اضغط على أي ضربة لتفتحها.</p>
<div class="xgrid">
<div class="xcol"><span></span>${x.cycles.map((c) => `<span class="xch">${esc(c.t)}</span>`).join('')}</div>
${[0, 1, 2].map((row) => `<div class="xrow"><span class="xrl">الجولة ${['الأولى', 'الثانية', 'الثالثة'][row]}</span>${grid.slice(row * 3, row * 3 + 3).map(tile).join('')}</div>`).join('')}
<div class="xrow last"><span class="xrl">الختام</span>${tile(P[9])}<span class="xlast">الرب نفسه يجتاز في مصر نصف الليل، والدم على الأبواب هو الفرق الوحيد.</span></div>
</div>
<div class="xkeys">${x.cycles.map((c, i) => `<div><b>${ar(i + 1)}</b><span><strong>${esc(c.t)}:</strong> ${md(c.d)}</span></div>`).join('')}</div>

<h3 class="xh"><span>٢</span>القصة تشتد</h3>
<p class="xp">تابع ثلاثة خيوط عبر الضربات العشر. اضغط على أي رقم لترى ما يقوله النص.</p>
<div class="xtracks">${x.tracks.map((t) => `<div class="xtr" data-track="${t.k}"><div class="xtl"><b>${esc(t.t)}</b><small>${md(t.d)}</small></div><div class="tcs">${track(t.k)}</div><div class="tip" aria-live="polite"></div></div>`).join('')}
<div class="xleg"><span><i class="mid"></i>${'فرعون / السحرة يقلّدون'}</span><span><i class="on"></i>${'الرب يشدد / تمييز / عجز'}</span><span><i class="off"></i>لا يُذكر</span></div></div>

<h3 class="xh"><span>٣</span>الضربات واحدة واحدة</h3>
<p class="xp">اسحب يميناً ويساراً، أو اضغط على شريط الأرقام.</p>
<div class="xnums" id="xnums">${P.map((p) => `<button type="button" data-go="${p.n}" style="--c:${p.color};--k:${p.ink}">${ar(p.n)}</button>`).join('')}</div>
</div>
<div class="xcards" id="xcards">${P.map(card).join('')}</div>
<div class="xbody">

<h3 class="xh"><span>٤</span>لماذا الضربات؟</h3>
<p class="xp">عبارة واحدة تتكرر في القصة: «أني أنا الرب». الضربات رسالة قبل أن تكون عقوبة.</p>
<div class="xpurp">${x.purposes.map((u, i) => `<div class="xpu" style="--i:${i}"><b>${esc(u.t)}</b><q>${vq(u.ref)}</q><small>${r(u.ref)}</small><p>${md(u.d)}</p></div>`).join('')}</div>

<h3 class="xh"><span>٥</span>الخليقة تنقلب على مصر</h3>
<div class="xcre">${x.creation.map((c) => { const p = P[c.n - 1]; return `<div class="xcr"><span class="g">${esc(c.g)}</span><span class="ar">←</span><span class="e" style="--c:${p.color};--k:${p.ink}">${glyph(p.icon, 22)}${esc(c.e)}</span></div>`; }).join('')}</div>
<p class="note">${md(x.creationNote)}</p>

<h3 class="xh"><span>٦</span>صدى الضربات في سفر الرؤيا</h3>
<div class="xecho">${x.echoes.map((e) => { const p = P[e.n - 1]; return `<a href="${refHref(e.ref, depth)}" style="--c:${p.color};--k:${p.ink}"><span class="ic2">${glyph(p.icon, 26)}</span><span><b>${esc(p.name)}</b><small>${esc(e.t)} · ${refLabel(e.ref)}</small></span></a>`; }).join('')}</div>
<p class="note">${md(x.echoNote)}</p>

<h3 class="xh"><span>٧</span>سؤال صعب</h3>
<div class="blk xhard"><h3>${md(x.hard.q)}</h3><p>${md(x.hard.a)}</p></div>
</div>
<section class="xchrist">
<div class="dd">${glyph('door', 70)}</div>
<span class="ey" style="color:#D7C49A">من القديم إلى الجديد</span>
<h2>الدم على الباب</h2>
<blockquote>${vq(x.christ.ref)}<small>${refLabel(x.christ.ref)}</small></blockquote>
${x.christ.p.map((p) => `<p>${md(p)}</p>`).join('')}
<a class="btn l" href="${chapterHref(b, 12, depth)}">${IC.read}ادرس الأصحاح الثاني عشر: الفصح</a>
</section>`;
  return body;
}

// ---------- the tabernacle ----------
function tabernaclePage(x, depth) {
  const b = bookById[x.book];
  const S = x.steps;
  const r = (ref) => `<a class="r" href="${refHref(ref, depth)}">${refLabel(ref)}</a>`;
  const shape = (s, i) => s.round
    ? `<circle cx="${s.x}" cy="${s.y}" r="${s.w / 2 + 0.6}" fill="${s.color}"/>`
    : `<rect x="${s.x}" y="${s.y}" width="${s.w}" height="${s.h}" rx=".3" fill="${s.color}"/>`;
  const num = (s, i) => { const cx = s.round ? s.x : s.x + s.w / 2, cy = s.round ? s.y : s.y + s.h / 2; const off = s.id === 'veil' ? [8, 0] : s.id === 'gate' ? [0, -4] : s.id === 'table' ? [4, 0] : s.id === 'lamp' ? [-4, 0] : s.id === 'incense' ? [3.2, 0] : s.id === 'ark' ? [0, 3.6] : [s.w / 2 + 3.2, 0]; return `<g class="pn"><circle cx="${cx + off[0]}" cy="${cy + off[1]}" r="2.1"/><text x="${cx + off[0]}" y="${cy + off[1] + 0.75}">${ar(i + 1)}</text></g>`; };
  const plan = `<svg class="tplan" viewBox="-6 -8 62 116" role="img" aria-label="مخطط المسكن من أعلى">
<defs><pattern id="sand" width="3" height="3" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".25" fill="#D9CDB5"/></pattern></defs>
<rect x="0" y="0" width="50" height="100" fill="#F6F1E6"/><rect x="0" y="0" width="50" height="100" fill="url(#sand)"/>
<rect x="0" y="0" width="50" height="100" fill="none" stroke="#C9BFAE" stroke-width=".7" stroke-dasharray="1.6 .8"/>
<path d="M25 96 V44" stroke="#B39459" stroke-width=".55" stroke-dasharray="1.2 1" fill="none"/><path d="M25 40 V22" stroke="#B39459" stroke-width=".55" stroke-dasharray="1.2 1" fill="none" opacity=".6"/>
<rect x="20" y="10" width="10" height="30" fill="#EADFC6" stroke="#B39459" stroke-width=".4"/>
<rect x="20" y="10" width="10" height="10" fill="#D9C79A"/>
<text class="zl" x="25" y="8.4">قدس الأقداس</text><text class="zl" x="25" y="38.3">القدس</text><text class="zl" x="9" y="86">الدار</text>
<text class="dir" x="25" y="-3.5">الغرب</text><text class="dir" x="25" y="106">الشرق</text>
${S.map((s, i) => `<g class="it" data-it="${s.id}" tabindex="0" role="button" aria-label="${esc(s.name)}">${shape(s, i)}<rect x="${(s.round ? s.x - 4 : s.x - 2)}" y="${(s.round ? s.y - 4 : s.y - 2)}" width="${(s.round ? 8 : s.w + 4)}" height="${(s.round ? 8 : s.h + 4)}" fill="transparent"/>${num(s, i)}</g>`).join('')}
</svg>`;
  const panel = (s, i) => `<article class="tpanel" id="it-${s.id}" data-panel="${s.id}" style="--c:${s.color};--k:${s.ink}"${i ? ' hidden' : ''}>
<div class="tp-h"><span class="tp-ic">${glyph(s.icon, 44)}</span><span><small>الخطوة ${ar(i + 1)} من ${ar(S.length)} · ${esc(x.zones[s.zone].t)}</small><b>${esc(s.name)}</b><em>${esc(s.mat)} · ${r(s.ref)}</em></span></div>
<blockquote>${vq(s.key)}<small>${refLabel(s.key)}</small></blockquote>
<div class="xc-sec"><small>ما هو؟</small><p>${md(s.what)}</p></div>
<div class="xc-sec"><small>ماذا علّم إسرائيل؟</small><p>${md(s.teach)}</p></div>
<div class="xc-sec tp-x"><small>يتمم في المسيح · ${r(s.christ.ref)}</small><p>${md(s.christ.t)}</p></div>
<div class="xc-nav">${i ? `<a href="#it-${S[i - 1].id}" data-it-go="${S[i - 1].id}">${IC.back}${esc(S[i - 1].name)}</a>` : '<span></span>'}<a class="ch" href="${chapterHref(b, s.ch, depth)}">${IC.read}الخروج ${ar(s.ch)}</a>${i < S.length - 1 ? `<a href="#it-${S[i + 1].id}" data-it-go="${S[i + 1].id}">${esc(S[i + 1].name)}${IC.chev}</a>` : '<span></span>'}</div>
</article>`;
  return `${header({ back: `${'../'.repeat(depth)}book/${b.slug}.html`, title: 'شرح مصوّر' })}
<section class="xhero th">
<span class="ey" style="color:#D7C49A">${esc(b.name)} ٢٥ – ٤٠ · شرح مصوّر</span>
<h1>${esc(x.title)}</h1>
<p class="sub">${esc(x.sub)}</p>
<div class="xrain">${S.map((s) => `<i style="--c:${s.color}"></i>`).join('')}</div>
<blockquote>${vq(x.heroRef)}<small>${refLabel(x.heroRef)}</small></blockquote>
</section>
<div class="xbody">
<p class="lead">${md(x.intro)}</p>
<h3 class="xh"><span>١</span>الطريق إلى الحضور</h3>
<p class="xp">ثماني محطات من الباب في الشرق إلى التابوت في الغرب. اضغط على أي قطعة في المخطط، أو تنقّل بالترتيب.</p>
<div class="tchips" id="tchips">${S.map((s, i) => `<button type="button" data-it-go="${s.id}" style="--c:${s.color};--k:${s.ink}" aria-pressed="${i ? 'false' : 'true'}">${glyph(s.icon, 22)}<span>${ar(i + 1)}</span></button>`).join('')}</div>
<div class="tlay"><div class="tmap">${plan}</div></div>
<div class="tpanels" id="tpanels">${S.map(panel).join('')}</div>

<h3 class="xh"><span>٢</span>ثلاث دوائر من القداسة</h3>
<p class="xp">كلما اقتربت من التابوت ازدادت القداسة، وقلّ عدد من يستطيع الدخول.</p>
<div class="tzones">${x.zones.map((z, i) => `<div class="tz${i}" style="--c:${z.color}"><b>${esc(z.t)}</b><span>${esc(z.who)}</span><small>${esc(z.metal)} · ${ar(esc(z.size))}</small></div>`).join('')}</div>
<p class="note">${md(x.zoneNote)}</p>

<h3 class="xh"><span>٣</span>من الخارج ومن الداخل</h3>
<p class="xp">أربع طبقات تغطي الخيمة، من الداخل إلى الخارج.</p>
<div class="tlayers">${x.layers.map((l, i) => `<div style="--c:${l.color};--i:${i}"><b>${ar(i + 1)}</b><span><strong>${esc(l.t)}</strong>${md(l.d)}</span></div>`).join('')}</div>
<p class="note">${md(x.layerNote)}</p>

<h3 class="xh"><span>٤</span>قصة السكنى عبر الكتاب</h3>
<div class="tstory">${x.story.map((s, i) => `<a href="${refHref(s.ref, depth)}"><i>${ar(i + 1)}</i><span><b>${esc(s.t)}</b><small>${md(s.d)} · ${refLabel(s.ref)}</small></span></a>`).join('')}</div>

<h3 class="xh"><span>٥</span>سؤال صعب</h3>
<div class="blk xhard"><h3>${md(x.hard.q)}</h3><p>${md(x.hard.a)}</p></div>
</div>
<section class="xchrist">
<div class="dd">${glyph('veil', 70)}</div>
<span class="ey" style="color:#D7C49A">من القديم إلى الجديد</span>
<h2>الحجاب انشق</h2>
<blockquote>${vq(x.christ.ref)} ${vq(x.christ.ref2)}<small>${refLabel('Heb.10.19-20')}</small></blockquote>
${x.christ.p.map((p) => `<p>${md(p)}</p>`).join('')}
<a class="btn l" href="${chapterHref(b, 40, depth)}">${IC.read}ادرس الأصحاح الأربعين: المجد يملأ المسكن</a>
</section>`;
}
