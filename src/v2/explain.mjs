// Visual explainers ("شروح مصوّرة"): colourful, interactive pages that explain a passage
// with diagrams rather than text alone. Data lives in content/explain/*.mjs.
import { esc, md, ar, refLabel, refHref, verseText, bookById, chapterHref } from '../lib.mjs';
import { IC, header } from './ui.mjs';
import plagues from '../../content/explain/plagues.mjs';
import tabernacle from '../../content/explain/tabernacle.mjs';
import offerings from '../../content/explain/offerings.mjs';
import atonement from '../../content/explain/atonement.mjs';
import feasts from '../../content/explain/feasts.mjs';
import camp from '../../content/explain/camp.mjs';
import serpent from '../../content/explain/serpent.mjs';

export const EXPLAINERS = [plagues, tabernacle, offerings, atonement, feasts, camp, serpent];
// Uniform "chips" for strips and cards: {id, name, color, ink, icon, ch:[chapters]}
export const chips = (x) => x.items ? x.items.map((p) => ({ id: 'of-' + p.id, name: p.name, color: p.color, ink: p.ink, icon: p.icon, ch: x.id === 'offerings' && p.id !== 'guilt' && p.id !== 'grain' ? [...p.ch, 9] : p.ch, label: x.id === 'offerings' ? 'ذبيحة ' + p.name : p.name })) : x.plagues ? x.plagues.map((p) => ({ id: 'pl' + p.n, name: p.name, color: p.color, ink: p.ink, icon: p.icon, ch: p.n === 10 ? [11, 12] : [p.ch], label: 'الضربة ' + ORD[p.n] })) : x.steps.map((p) => ({ id: 'it-' + p.id, name: p.name, color: p.color, ink: p.ink, icon: p.icon, ch: [p.ch, ...(CH2[p.id] || [])], label: p.name }));
const CH2 = { gate: [38], altar: [38], laver: [38], table: [37], lamp: [37], incense: [37], veil: [36], ark: [37, 40] };
const hereOf = (x, n) => chips(x).filter((c) => c.ch.includes(n));

// Line icons, 64-unit box, drawn with currentColor.
const G = {
  house: '<path d="M10 30 32 12l22 18"/><path d="M16 26v26h32V26"/><path d="M27 52V38h10v14"/>',
  bag: '<rect x="10" y="22" width="44" height="30" rx="4"/><path d="M24 22v-6h16v6"/><path d="M10 34h44"/>',
  phone: '<rect x="20" y="8" width="24" height="48" rx="5"/><path d="M29 49h6"/>',
  people: '<circle cx="24" cy="22" r="7"/><circle cx="42" cy="24" r="6"/><path d="M12 50c0-9 6-15 12-15s12 6 12 15"/><path d="M34 50c0-7 4-12 8-12s9 5 9 12"/>',
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
  burnt: '<rect x="14" y="36" width="36" height="20" rx="2"/><path d="M14 36l-3-6M50 36l3-6"/><path d="M32 6c6 8 10 12 10 18a10 10 0 0 1-20 0c0-4 2-7 4-9 0 4 2 6 4 6-1-6 0-10 2-15z" fill="currentColor" fill-opacity=".35"/>',
  grain: '<path d="M32 58V14"/><path d="M32 18c-6-2-8-8-8-12 5 1 8 5 8 12zM32 18c6-2 8-8 8-12-5 1-8 5-8 12zM32 30c-6-2-9-8-9-12 5 1 9 5 9 12zM32 30c6-2 9-8 9-12-5 1-9 5-9 12zM32 42c-6-2-9-8-9-12 5 1 9 5 9 12zM32 42c6-2 9-8 9-12-5 1-9 5-9 12z" fill="currentColor" fill-opacity=".3"/><path d="M22 58h20"/>',
  peace: '<path d="M8 34h48"/><path d="M12 34c0 11 9 18 20 18s20-7 20-18" fill="currentColor" fill-opacity=".2"/><path d="M22 26c0-6 4-10 10-10s10 4 10 10" /><path d="M26 58h12"/><path d="M32 52v6"/><path d="M20 12l3 4M44 12l-3 4M32 8v5"/>',
  sin: '<path d="M28 8c5 8 9 13 9 18a9 9 0 0 1-18 0c0-5 4-10 9-18z" fill="currentColor" fill-opacity=".35"/><path d="M8 44h30" stroke-dasharray="3 3"/><path d="M8 38v12M38 38v12"/><path d="M42 44h14m-5-5 5 5-5 5"/>',
  guilt: '<path d="M32 10v44M20 56h24"/><path d="M12 18h40"/><path d="M12 18L6 34h12zM52 18l-6 16h12z"/><path d="M6 34a6 4 0 0 0 12 0M46 34a6 4 0 0 0 12 0" fill="currentColor" fill-opacity=".3"/><circle cx="32" cy="10" r="2.5" fill="currentColor"/>',
  linen: '<path d="M22 8h20l10 12-8 5-2-5v36H22V20l-2 5-8-5z"/><path d="M22 34h20" opacity=".6"/><path d="M28 8c0 4 8 4 8 0"/>',
  lots: '<path d="M10 40l12-14 12 14-12 14z" fill="currentColor" fill-opacity=".3"/><path d="M30 26l12-14 12 14-12 14z"/><circle cx="22" cy="40" r="2" fill="currentColor"/><circle cx="42" cy="26" r="2" fill="currentColor"/>',
  goat: '<path d="M18 14c-2 6 0 12 6 14M46 14c2 6 0 12-6 14"/><path d="M24 26h16c3 0 5 3 5 6v8c0 8-6 14-13 14s-13-6-13-14v-8c0-3 2-6 5-6z"/><circle cx="27" cy="36" r="1.8" fill="currentColor"/><circle cx="37" cy="36" r="1.8" fill="currentColor"/><path d="M28 54c0 4 2 6 4 6s4-2 4-6"/><path d="M14 30l-6-2M50 30l6-2"/>',
  dark: '<circle cx="32" cy="30" r="16"/><circle cx="38" cy="26" r="15" fill="currentColor"/><path d="M6 56h52"/><path d="M14 48h36" opacity=".5"/>',
  matzah: '<rect x="10" y="14" width="44" height="36" rx="7"/><g fill="currentColor" stroke="none"><circle cx="20" cy="24" r="1.8"/><circle cx="32" cy="24" r="1.8"/><circle cx="44" cy="24" r="1.8"/><circle cx="20" cy="32" r="1.8"/><circle cx="32" cy="32" r="1.8"/><circle cx="44" cy="32" r="1.8"/><circle cx="20" cy="40" r="1.8"/><circle cx="32" cy="40" r="1.8"/><circle cx="44" cy="40" r="1.8"/></g>',
  loaves: '<path d="M4 42c0-11 8-18 17-18s17 7 17 18z"/><path d="M26 46c0-11 8-18 17-18s17 7 17 18z"/><path d="M12 34l4-4M20 32l4-4M34 38l4-4M42 36l4-4"/>',
  shofar: '<path d="M8 46c9 4 22 1 31-8 7-7 11-17 17-22l3 4c-3 4-5 14-14 25-9 10-23 13-34 9z"/><path d="M8 46l-3 2 3 4 3-2"/><path d="M48 46c3 2 5 5 6 9M54 40c4 1 7 4 8 7" opacity=".6"/>',
  booth: '<path d="M10 54V30M54 54V30"/><path d="M6 30c8-10 18-14 26-14s18 4 26 14"/><path d="M14 24l-4-8M24 19l-2-9M40 19l2-9M50 24l4-8"/><path d="M10 54h44"/><path d="M26 54V40h12v14"/>',
  serpent: '<path d="M32 6v54"/><path d="M22 11h20"/><path d="M33 16c-11 2-11 9 0 11s11 9 0 11-11 9 0 11" stroke-width="3.2"/><circle cx="34" cy="15" r="2.2" fill="currentColor"/>',
  snake: '<path d="M6 46c5-11 13-11 18 0s13 11 18 0 9-11 14-6"/><circle cx="54" cy="40" r="4" fill="currentColor" fill-opacity=".35"/><path d="M58 40l4-3M58 41l4 2"/>',
  grumble: '<path d="M8 12h48v28H28L17 51V40H8z"/><path d="M16 28l6-7 6 7 6-7 6 7 6-7"/>',
  confess: '<circle cx="32" cy="14" r="7"/><path d="M18 58V38c0-8 6-14 14-14s14 6 14 14v20"/><path d="M24 42l8 8 8-8"/>',
  eye: '<path d="M4 32c8-12 18-18 28-18s20 6 28 18c-8 12-18 18-28 18S12 44 4 32z"/><circle cx="32" cy="32" r="9" fill="currentColor" fill-opacity=".3"/><circle cx="32" cy="32" r="3.5" fill="currentColor"/>',
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
<p style="opacity:.75;font-size:15px;margin-bottom:14px">${here.length && here.length < C.length ? `في هذا الأصحاح: ${here.map((c) => esc(c.label)).join('، ')}` : esc(x.sub)}</p>
<div class="xstrip${here.length && here.length < C.length ? ' part' : ''}">${C.map((c) => `<span class="${!here.length || here.includes(c) ? 'on' : ''}" style="--c:${c.color};--k:${c.ink}">${glyph(c.icon, 26)}</span>`).join('')}</div>
<a class="btn l" style="margin-top:16px" href="${explainHref(x, depth, here[0] ? '#' + here[0].id : '')}">افتح الشرح المصوّر</a>`;
}
export function bentoTile(x, n, depth) {
  const C = chips(x), here = hereOf(x, n);
  return `<a class="tile w t-explain" href="${explainHref(x, depth, here[0] ? '#' + here[0].id : '')}"><span class="tl"><span>شرح مصوّر</span>${IC.chev}</span><span class="xstrip sm${here.length && here.length < C.length ? ' part' : ''}">${C.map((c) => `<span class="${!here.length || here.includes(c) ? 'on' : ''}" style="--c:${c.color};--k:${c.ink}">${glyph(c.icon, 20)}</span>`).join('')}</span><span class="tt">${esc(x.title)}: ${x.plagues ? 'المعنى والهدف' : x.id === 'atonement' ? 'خطوة خطوة' : x.items ? 'مقارنة ومعنى' : 'خطوة خطوة نحو الحضور'}</span></a>`;
}
export const xCard = (x) => `<a class="mcard xm" href="${explainHref(x, 0)}"><div class="mv xmv${chips(x).length === 8 ? ' c4' : ''}">${chips(x).map((c) => `<span style="--c:${c.color};--k:${c.ink}">${glyph(c.icon, 22)}</span>`).join('')}</div><div class="mt"><small>العهد القديم · ${esc(bookById[x.book].name.replace(/^سفر /, ''))} · شرح مصوّر</small><b>${esc(x.title)}</b><span>${esc(x.sub)}</span></div></a>`;

const ORD = ['', 'الأولى', 'الثانية', 'الثالثة', 'الرابعة', 'الخامسة', 'السادسة', 'السابعة', 'الثامنة', 'التاسعة', 'العاشرة'];

export function explainPage(x, depth) {
  const html = explainBody(x, depth);
  if (x.id === 'plagues') return html;
  // design-v3: icon mosaic beside every explainer's hero (the same items the page explains).
  const C = chips(x);
  const mo = `<div class="xmo3 c${C.length > 8 ? 5 : 4}" aria-hidden="true">${C.map((c, k) => `<i style="--c:${c.color};--k:${c.ink};--d:${(0.15 + k * 0.07).toFixed(2)}s">${glyph(c.icon, 40)}</i>`).join('')}</div>`;
  const h0 = html.indexOf('class="xhero'), i = html.indexOf('</section>', h0);
  if (h0 < 0 || i < 0) return html;
  const pres = `<a class="xpres" href="${x.id}-present.html">${IC.read}<span>وضع العرض: شرائح للبروجكتور ومدارس الأحد</span></a>`;
  const own = html.slice(h0, i).split('<svg').length > 3; // hero already draws its own icons
  return html.slice(0, i) + pres + (own ? '' : mo) + html.slice(i);
}
function explainBody(x, depth) {
  if (x.id === 'offerings') return offeringsPage(x, depth);
  if (x.id === 'atonement') return atonementPage(x, depth);
  if (x.id === 'feasts') return feastsPage(x, depth);
  if (x.id === 'camp') return campPage(x, depth);
  if (x.id === 'serpent') return serpentPage(x, depth);
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
  // Literal Van Dyck fragments for the Passover scene; the build stops if any is not found in the verse.
  const norm = (w) => w.replace(/[ً-ْٰـ]/g, '').replace(/[ٱأإآ]/g, 'ا').replace(/[.،:؛,«»]/g, '');
  const piece = (ref, t) => {
    const vw = verseText(ref).split(/\s+/), tw = t.split(/\s+/).map(norm);
    for (let i = 0; i + tw.length <= vw.length; i++) if (tw.every((w, j) => norm(vw[i + j]) === w)) return vw.slice(i, i + tw.length).join(' ').replace(/[.،:؛,]$/, '');
    throw new Error(`Passover caption not in ${ref}: ${t}`);
  };
  const caps = [
    [piece('Exod.12.7', 'ويأخذون من الدم ويجعلونه على القائمتين والعتبة العليا'), 'Exod.12.7'],
    [piece('Exod.12.12', 'فاني اجتاز في ارض مصر هذه الليلة'), 'Exod.12.12'],
    [piece('Exod.12.13', 'فارى الدم واعبر عنكم'), 'Exod.12.13']
  ];
  const thread = (k) => P.map((p) => {
    let c = '', t = '';
    if (k === 'magi') { if (p.magi) { c = p.n <= 2 ? 'imit' : 'fail'; t = p.magi; } }
    if (k === 'goshen') { if (p.goshen) { c = 'kept'; t = `التمييز مذكور صراحة (${refLabel(p.goshen)}).`; } }
    if (k === 'heart') { c = p.heart.who === 'l' ? 'lord' : 'self'; t = `${p.heart.t} (${refLabel(p.heart.ref)}).`; }
    return `<button type="button" class="pt3c ${c || 'none'}" style="--pc:${p.color}" data-t="${esc(t || 'النص لا يذكر هذا الخيط في هذه الضربة.')}" data-h="${esc(`الضربة ${ORD[p.n]} · ${p.name}`)}" aria-label="الضربة ${ORD[p.n]}">${ar(p.n)}</button>`;
  }).join('');
  const legend = { magi: [['imit', 'قلّدوها'], ['fail', 'عجزوا']], goshen: [['kept', 'تمييز صريح بين مصر وجاسان']], heart: [['self', 'فرعون يقسّي قلبه'], ['lord', 'الرب يشدد قلب فرعون']] };
  const sh = (n, t, sub, dark) => `<div class="p3h${dark ? ' dk' : ''}"><div><span>${ar(n)}</span><h2>${t}</h2></div><p>${sub}</p></div>`;
  const bigTile = (p, last) => `<a class="p3t${last ? ' last' : ''}" href="#pl${p.n}" data-go="${p.n}" style="--c:${p.color};--k:${p.ink}"><em>${ar(p.n)}</em>${glyph(p.icon, last ? 44 : 40)}${last ? `<span><b>${ar(10)} · ${esc(p.name)}</b><small>الرب نفسه يجتاز في مصر نصف الليل، والدم على الأبواب هو الفرق الوحيد.</small></span>` : `<b>${esc(p.name)}</b>`}</a>`;
  const deep = [
    ['لماذا الضربات؟', 'عبارة واحدة تتكرر: «أني أنا الرب».', `<div class="xpurp">${x.purposes.map((u, i) => `<div class="xpu" style="--i:${i}"><b>${esc(u.t)}</b><q>${vq(u.ref)}</q><small>${r(u.ref)}</small><p>${md(u.d)}</p></div>`).join('')}</div>`],
    ['الخليقة تنقلب', 'ما رتبه الله في التكوين ينقلب على مصر.', `<div class="xcre">${x.creation.map((c) => { const p = P[c.n - 1]; return `<div class="xcr"><span class="g">${esc(c.g)}</span><span class="ar">←</span><span class="e" style="--c:${p.color};--k:${p.ink}">${glyph(p.icon, 22)}${esc(c.e)}</span></div>`; }).join('')}</div><p class="note">${md(x.creationNote)}</p>`],
    ['أصداء في الرؤيا', `${ar(x.echoes.length)} ضربات تعود في دينونة الله الأخيرة.`, `<div class="xecho">${x.echoes.map((e) => { const p = P[e.n - 1]; return `<a href="${refHref(e.ref, depth)}" style="--c:${p.color};--k:${p.ink}"><span class="ic2">${glyph(p.icon, 26)}</span><span><b>${esc(p.name)}</b><small>${esc(e.t)} · ${refLabel(e.ref)}</small></span></a>`; }).join('')}</div><p class="note">${md(x.echoNote)}</p>`],
    ['سؤال صعب', esc(x.hard.q.replace(/\*\*/g, '')), `<p>${md(x.hard.a)}</p>`]
  ];
  const body = `${header({ back: `${'../'.repeat(depth)}book/${b.slug}.html`, title: 'شرح مصوّر' })}
<section class="p3hero">
<div class="in">
<div class="tx"><span class="ey">شرح مصوّر · ${esc(b.name)} ${ar(x.chapters[0])}–${ar(x.chapters[x.chapters.length - 1])}</span><h1>${esc(x.title)}</h1><p class="sub">${esc(x.sub)}</p>
<blockquote>${vq(x.heroRef)}<small>${refLabel(x.heroRef)}</small></blockquote></div>
<div class="mo" aria-hidden="true">${P.map((p, k) => `<i style="--c:${p.color};--k:${p.ink};--d:${(0.15 + k * 0.08).toFixed(2)}s">${glyph(p.icon, 44)}</i>`).join('')}</div>
</div>
<nav class="p3nav" aria-label="أقسام الشرح">${['النمط', 'الضربات واحدة واحدة', 'القصة تشتد', 'الفصح', 'للتعمق', 'اختبر نفسك'].map((t, k) => `<a href="#s${k + 1}">${t}</a>`).join('')}</nav>
</section>
<div class="p3b">
<p class="p3lead">${md(x.intro)}</p>

<section id="s1" class="p3s">${sh(1, 'ثلاث جولات، وضربة أخيرة', 'كل جولة فيها ثلاث ضربات بالترتيب نفسه. اضغط أي ضربة لتفتح بطاقتها.')}
<div class="p3grid">
<span></span>${x.cycles.map((c) => `<span class="ch">${esc(c.t)}</span>`).join('')}
${[0, 1, 2].map((row) => `<span class="rl">الجولة ${['الأولى', 'الثانية', 'الثالثة'][row]}</span>${grid.slice(row * 3, row * 3 + 3).map((p) => bigTile(p)).join('')}`).join('')}
<span class="rl">الختام</span>${bigTile(P[9], true)}
</div>
<div class="xkeys">${x.cycles.map((c, i) => `<div><b>${ar(i + 1)}</b><span><strong>${esc(c.t)}:</strong> ${md(c.d)}</span></div>`).join('')}</div>
</section>

<section id="s2" class="p3s">${sh(2, 'الضربات واحدة واحدة', 'اسحب أو اضغط على الأرقام. كل بطاقة: ماذا حدث، وضد من، وماذا تعني.')}
<div class="xnums" id="xnums">${P.map((p) => `<button type="button" data-go="${p.n}" style="--c:${p.color};--k:${p.ink}" aria-label="الضربة ${ORD[p.n]}: ${esc(p.name)}">${ar(p.n)}</button>`).join('')}</div>
</section>
</div>
<div class="xcards p3cards" id="xcards">${P.map(card).join('')}</div>
<div class="p3b">

<section id="s3" class="p3s">${sh(3, 'القصة تشتد', 'ثلاثة خيوط تمتد عبر الضربات العشر. اختر خيطاً، ثم اضغط أي ضربة.')}
<div class="p3th" data-threads>
<div class="tabs" role="tablist" aria-label="الخيوط">${x.tracks.map((t, i) => `<button type="button" role="tab" aria-selected="${i === 2}" data-th="${t.k}">${esc(t.t)}</button>`).join('')}</div>
${x.tracks.map((t, i) => `<div class="pane" data-pane="${t.k}"${i === 2 ? '' : ' hidden'}><p class="d">${md(t.d)}</p><div class="cells">${thread(t.k)}</div><div class="leg">${legend[t.k].map(([c, l]) => `<span><i class="pt3c ${c}"></i>${l}</span>`).join('')}<span><i class="pt3c none"></i>لا يُذكر</span></div></div>`).join('')}
<div class="det" aria-live="polite"><b>اختر ضربة</b><span>اضغط أي رقم لترى ما يقوله النص.</span></div>
</div>
</section>
</div>

<section id="s4" class="p3pass" data-pass>
<div class="p3b">${sh(4, 'الفصح: الفرق الوحيد كان الدم', 'الضربة العاشرة لم تميز بين بيت وبيت على أساس الجنس أو الصلاح. شاهد المشهد.', true)}</div>
<svg class="stars" viewBox="0 0 1440 200" preserveAspectRatio="none" aria-hidden="true"><path d="M120 60h2M300 40h2M520 90h2M760 30h2M980 70h2M1180 50h2M1320 100h2M210 120h2M640 140h2M880 120h2M1080 150h2M420 70h2"/></svg>
<div class="houses" aria-hidden="true">${[0, 1, 1, 0, 1].map((m) => `<div class="hs${m ? ' m' : ''}"><i class="wall"></i><i class="win"></i><i class="door"></i>${m ? '<i class="lin"></i><i class="po a"></i><i class="po b"></i>' : ''}</div>`).join('')}</div>
<div class="ground"></div>
<div class="cap">
<p class="q" data-cap>اضغط لتشاهد ليلة الفصح</p><small data-capref></small>
<button type="button" data-play>شاهد المشهد</button>
<noscript><p class="q">${caps.map((c) => esc(c[0])).join(' … ')}</p></noscript>
<template data-caps>${caps.map(([t, ref]) => `<i data-t="${esc(t)}" data-r="${refLabel(ref)}"></i>`).join('')}</template>
<div class="end">${x.christ.p.map((p) => `<p>${md(p)}</p>`).join('')}</div>
</div>
</section>

<div class="p3b">
<section id="s5" class="p3s">${sh(5, 'للتعمق', 'نوافذ لمن يريد أكثر. كل واحدة تُفتح وحدها.')}
<div class="p3deep">${deep.map(([t, d], k) => `<button type="button" aria-expanded="false" aria-controls="dp${k}" data-deep="${k}"><b>${t}</b><span>${d}</span><em>افتح</em></button>`).join('')}</div>
${deep.map(([t, , h], k) => `<div class="p3panel" id="dp${k}" hidden><h3>${t}</h3>${h}</div>`).join('')}
</section>

<section id="s6" class="p3s">${sh(6, 'اختبر نفسك', `${ar(x.quiz.length)} أسئلة سريعة. كل جواب له شاهد من النص. لا يُحفظ شيء.`)}
<div class="p3quiz" data-quiz>
<div class="qtop"><span data-qn>السؤال ${ar(1)} من ${ar(x.quiz.length)}</span><span class="bar"><i data-qbar></i></span></div>
${x.quiz.map((q, i) => `<article class="qz" data-a="${q.a}"${i ? ' hidden' : ''}><h3>${esc(q.q)}</h3><div class="op">${q.o.map((o, k) => `<button type="button" data-k="${k}">${esc(o)}</button>`).join('')}</div><div class="why" hidden><b></b><p>${esc(q.why)} <a class="r" href="${refHref(q.ref, depth)}">${refLabel(q.ref)}</a></p></div></article>`).join('')}
<div class="qend" hidden><b data-qscore></b><p>راجع أي ضربة من البطاقات أعلاه، أو أعد الاختبار.</p><button type="button" data-qagain>أعد الاختبار</button></div>
<button type="button" class="qnext" data-qnext hidden>السؤال التالي</button>
</div>
<a class="p3present" href="plagues-present.html">${IC.read}<span><b>وضع العرض</b><small>شرائح للبروجكتور ومدارس الأحد، مع ملاحظات للمعلم</small></span>${IC.chev}</a>
</section>

<section class="p3s p3next">
<a href="${'../'.repeat(depth)}maps.html"><small>عودة</small><b>كل الشروح المصوّرة</b></a>
<a class="dk" href="${chapterHref(b, 12, depth)}"><small>التالي</small><b>ادرس الأصحاح الثاني عشر: الفصح</b>${IC.chev}</a>
</section>
</div>`;
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
<h3 class="xh"><span>١</span>المسكن بالأبعاد الثلاثة</h3>
<p class="xp">مجسّم تقريبي بالمقاسات المذكورة في الخروج ٢٥–٢٧. لفّه وقرّبه، واكشف السقف لترى ما بالداخل، ثم ابدأ جولة يوم الكفارة.</p>
${scene3d(depth, 'explore')}
<h3 class="xh"><span>٢</span>الطريق إلى الحضور</h3>
<p class="xp">ثماني محطات من الباب في الشرق إلى التابوت في الغرب. اضغط على أي قطعة في المخطط، أو تنقّل بالترتيب.</p>
<div class="tchips" id="tchips">${S.map((s, i) => `<button type="button" data-it-go="${s.id}" style="--c:${s.color};--k:${s.ink}" aria-pressed="${i ? 'false' : 'true'}">${glyph(s.icon, 22)}<span>${ar(i + 1)}</span></button>`).join('')}</div>
<div class="tst3"><div class="tlay"><div class="tmap">${plan}</div></div>
<div class="tpanels" id="tpanels">${S.map(panel).join('')}</div></div>

<h3 class="xh"><span>٣</span>ثلاث دوائر من القداسة</h3>
<p class="xp">كلما اقتربت من التابوت ازدادت القداسة، وقلّ عدد من يستطيع الدخول.</p>
<div class="tzones">${x.zones.map((z, i) => `<div class="tz${i}" style="--c:${z.color}"><b>${esc(z.t)}</b><span>${esc(z.who)}</span><small>${esc(z.metal)} · ${ar(esc(z.size))}</small></div>`).join('')}</div>
<p class="note">${md(x.zoneNote)}</p>

<h3 class="xh"><span>٤</span>من الخارج ومن الداخل</h3>
<p class="xp">أربع طبقات تغطي الخيمة، من الداخل إلى الخارج.</p>
<div class="tlayers">${x.layers.map((l, i) => `<div style="--c:${l.color};--i:${i}"><b>${ar(i + 1)}</b><span><strong>${esc(l.t)}</strong>${md(l.d)}</span></div>`).join('')}</div>
<p class="note">${md(x.layerNote)}</p>

<h3 class="xh"><span>٥</span>قصة السكنى عبر الكتاب</h3>
<div class="tstory">${x.story.map((s, i) => `<a href="${refHref(s.ref, depth)}"><i>${ar(i + 1)}</i><span><b>${esc(s.t)}</b><small>${md(s.d)} · ${refLabel(s.ref)}</small></span></a>`).join('')}</div>

<h3 class="xh"><span>٦</span>سؤال صعب</h3>
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

// ---------- the five offerings ----------
function offeringsPage(x, depth) {
  const b = bookById[x.book];
  const I = x.items, by = Object.fromEntries(I.map((i) => [i.id, i]));
  const r = (ref) => `<a class="r" href="${refHref(ref, depth)}">${refLabel(ref)}</a>`;
  const dot = (on, c) => `<i class="od ${on ? 'on' : ''}" style="--c:${c}"></i>`;
  const row = (label, f) => `<tr><th>${label}</th>${I.map((i) => `<td>${f(i)}</td>`).join('')}</tr>`;
  const matrix = `<div class="omx"><table><thead><tr><th></th>${I.map((i) => `<th><a href="#of-${i.id}" data-of-go="${i.id}" style="--c:${i.color};--k:${i.ink}">${glyph(i.icon, 24)}<span>${esc(i.name)}</span></a></th>`).join('')}</tr></thead><tbody>
${row('النوع', (i) => `<span class="ok ${i.kind === 'طوعية' ? 'v' : 'r'}">${i.kind}</span>`)}
${row('دم', (i) => dot(i.blood, i.color))}
${row('لله', (i) => dot(i.eat[0], i.color))}
${row('للكاهن', (i) => dot(i.eat[1], i.color))}
${row('للمقدّم', (i) => dot(i.eat[2], i.color))}
${row('للفقير بديل', (i) => dot(/^نعم/.test(i.poor), i.color))}
</tbody></table></div>`;
  const card = (i, k) => `<article class="xc oc" id="of-${i.id}" data-panel="${i.id}" style="--c:${i.color};--k:${i.ink}"${k ? ' hidden' : ''}>
<div class="xc-top"><span class="no">الذبيحة ${['الأولى', 'الثانية', 'الثالثة', 'الرابعة', 'الخامسة'][k]}</span><span class="cy">${i.kind}</span></div>
<div class="xc-ic">${glyph(i.icon, 84)}</div>
<h2>${esc(i.name)}</h2>
<div class="xc-ref">«${esc(i.heb)}»: ${esc(i.mean)} · ${r(i.ref)} · الشريعة ${r(i.law)}</div>
<blockquote>${vq(i.key)}<small>${refLabel(i.key)}</small></blockquote>
<div class="xc-sec"><small>كيف تُقدّم؟</small><p>${md(i.what)}</p></div>
<div class="xc-god"><div class="h"><small>أي حاجة تسدّ؟</small></div><b>${esc(i.need)}</b></div>
<div class="xc-sec"><small>لمن تكون؟</small><p>${md(i.share)}</p><p style="margin-top:6px;opacity:.85"><b style="font-family:var(--ui);font-weight:500">للفقير:</b> ${md(i.poor)}</p></div>
<div class="xc-sec tp-x"><small>يتمم في المسيح · ${r(i.christ.ref)}</small><p>${md(i.christ.t)}</p></div>
<div class="xc-nav">${k ? `<a href="#of-${I[k - 1].id}" data-of-go="${I[k - 1].id}">${IC.back}${esc(I[k - 1].name)}</a>` : '<span></span>'}<a class="ch" href="${chapterHref(b, i.ch[0], depth)}">${IC.read}اللاويين ${ar(i.ch[0])}</a>${k < I.length - 1 ? `<a href="#of-${I[k + 1].id}" data-of-go="${I[k + 1].id}">${esc(I[k + 1].name)}${IC.chev}</a>` : '<span></span>'}</div>
</article>`;
  return `${header({ back: `${'../'.repeat(depth)}book/${b.slug}.html`, title: 'شرح مصوّر' })}
<section class="xhero of">
<span class="ey" style="color:#D7C49A">${esc(b.name)} ${x.range} · شرح مصوّر</span>
<h1>${esc(x.title)}</h1>
<p class="sub">${esc(x.sub)}</p>
<div class="ofan">${I.map((i) => `<span style="--c:${i.color};--k:${i.ink}">${glyph(i.icon, 30)}<small>${esc(i.name)}</small></span>`).join('')}</div>
<blockquote>${vq(x.heroRef)}<small>${refLabel(x.heroRef)}</small></blockquote>
</section>
<div class="xbody">
<p class="lead">${md(x.intro)}</p>
<h3 class="xh"><span>١</span>المقارنة في لمحة</h3>
<p class="xp">اضغط على أي ذبيحة لتفتح بطاقتها.</p>
${matrix}
<h3 class="xh"><span>٢</span>كل ذبيحة بالتفصيل</h3>
<div class="tchips" id="ochips" style="grid-template-columns:repeat(5,1fr)">${I.map((i, k) => `<button type="button" data-of-go="${i.id}" style="--c:${i.color};--k:${i.ink}" aria-pressed="${k ? 'false' : 'true'}">${glyph(i.icon, 22)}<span>${esc(i.name)}</span></button>`).join('')}</div>
<div class="opanels" id="opanels">${I.map(card).join('')}</div>
<h3 class="xh"><span>٣</span>ماذا كان يفعل المقدّم؟</h3>
<div class="osteps">${x.steps.map((t, k) => `<div><b>${ar(k + 1)}</b><span>${esc(t)}</span></div>`).join('')}</div>
<p class="note">${md(x.stepsNote)}</p>
<h3 class="xh"><span>٤</span>الترتيب له معنى</h3>
<div class="oorder">${x.order.ids.map((id, k) => `<a href="#of-${id}" data-of-go="${id}" style="--c:${by[id].color};--k:${by[id].ink}">${glyph(by[id].icon, 28)}<b>${esc(by[id].name)}</b><small>${esc(x.order.labels[k])}</small></a>${k < x.order.ids.length - 1 ? '<i>←</i>' : ''}`).join('')}</div>
<p class="note">${md(x.order.note)} ${r(x.order.ref)}</p>
<h3 class="xh"><span>٥</span>سؤال صعب</h3>
<div class="blk xhard"><h3>${md(x.hard.q)}</h3><p>${md(x.hard.a)}</p></div>
</div>
<section class="xchrist">
<div class="oconv">${I.map((i) => `<i style="--c:${i.color}"></i>`).join('')}<span>${glyph('burnt', 40)}</span></div>
<span class="ey" style="color:#D7C49A">من القديم إلى الجديد</span>
<h2>ذبيحة واحدة</h2>
<blockquote>${vq(x.christ.ref)} ${vq(x.christ.ref2)}<small>${refLabel('Heb.10.12-14')}</small></blockquote>
${x.christ.p.map((p) => `<p>${md(p)}</p>`).join('')}
<a class="btn l" href="${chapterHref(b, 1, depth)}">${IC.read}ادرس اللاويين من الأصحاح الأول</a>
</section>`;
}

// ---------- the day of atonement ----------
function atonementPage(x, depth) {
  const b = bookById[x.book];
  const S = x.steps;
  const r = (ref) => `<a class="r" href="${refHref(ref, depth)}">${refLabel(ref)}</a>`;
  const plan = `<svg class="aplan" viewBox="-14 -8 78 146" role="img" aria-label="مخطط المسكن وما حوله">
<rect x="-14" y="104" width="78" height="34" fill="#EFE3C8"/>
<path d="M-14 118c10-4 18 4 28 0s18-4 28 0 18 4 36 0" stroke="#D9C79A" stroke-width=".6" fill="none"/><path d="M-14 128c10-4 18 4 28 0s18-4 28 0 18 4 36 0" stroke="#D9C79A" stroke-width=".6" fill="none"/>
<text class="zl" x="44" y="134">البرية</text><text class="zl" x="0" y="112">خارج المحلة</text>
<rect x="0" y="0" width="50" height="100" fill="#F6F1E6" stroke="#C9BFAE" stroke-width=".7" stroke-dasharray="1.6 .8" data-z="court"/>
<rect x="20" y="20" width="10" height="20" fill="#EADFC6" stroke="#B39459" stroke-width=".4" data-z="holy"/>
<rect x="20" y="10" width="10" height="10" fill="#D9C79A" stroke="#B39459" stroke-width=".4" data-z="most"/>
<path d="M20 20h10" stroke="#2C3E7A" stroke-width="1"/>
<rect x="22.5" y="67.5" width="5" height="5" fill="#9A4E21"/><circle cx="25" cy="52" r="1.8" fill="#2E7D86"/><rect x="23.75" y="14.25" width="2.5" height="1.5" fill="#7A5A12"/>
<rect x="15" y="98.5" width="20" height="3" fill="#5B3F8C"/>
<text class="zl" x="25" y="8.4">قدس الأقداس</text><text class="zl" x="25" y="38.3">القدس</text><text class="zl" x="9" y="86">الدار</text>
<path id="apath" d="" fill="none" stroke="#B39459" stroke-width=".7" stroke-dasharray="1.4 1"/>
<g id="ahp"><circle r="3.4" fill="#D7C49A" opacity=".35"><animate attributeName="r" values="2.6;4.4;2.6" dur="2s" repeatCount="indefinite"/></circle><circle r="1.9" fill="#B39459" stroke="#17191E" stroke-width=".4"/></g>
</svg>`;
  return `${header({ back: `${'../'.repeat(depth)}book/${b.slug}.html`, title: 'شرح مصوّر' })}
<section class="xhero at">
<span class="ey" style="color:#D7C49A">${esc(b.name)} ${x.range} · شرح مصوّر</span>
<h1>${esc(x.title)}</h1>
<p class="sub">${esc(x.sub)}</p>
<div class="xrain">${S.map((s) => `<i style="--c:${s.color}"></i>`).join('')}</div>
<blockquote>${vq(x.heroRef)}<small>${refLabel(x.heroRef)}</small></blockquote>
</section>
<div class="xbody">
<p class="lead">${md(x.intro)}</p>
<h3 class="xh"><span>١</span>اليوم خطوة خطوة</h3>
<p class="xp">تابع رئيس الكهنة (النور الذهبي) في المسكن، من الدار إلى ما وراء الحجاب ثم إلى البرية. تقدر في أي وقت تلفّ المجسّم وتقرّبه بإصبعك.</p>
${scene3d(depth, 'atone')}
<h3 class="xh"><span>٢</span>تيسان، ذبيحة واحدة</h3>
<div class="agoats">${x.goats.map((g) => `<div style="--c:${g.color};--k:${g.ink}"><span class="gi">${glyph(g.icon, 40)}</span><b>${esc(g.t)}</b><p>${md(g.d)}</p><small>المعنى</small><p>${md(g.m)}</p><small>في المسيح</small><p>${md(g.c)}</p></div>`).join('')}</div>
<h3 class="xh"><span>٣</span>هارون والمسيح</h3>
<div class="acmp"><div class="hd"><span></span><b>هارون</b><b>المسيح</b></div>${x.compare.map(([q, a, c, ref]) => `<div><span>${esc(q)}</span><em>${esc(a)}</em><strong>${esc(c)}<a class="r" href="${refHref(ref, depth)}">${refLabel(ref)}</a></strong></div>`).join('')}</div>
<h3 class="xh"><span>٤</span>سؤال صعب</h3>
<div class="blk xhard"><h3>${md(x.hard.q)}</h3><p>${md(x.hard.a)}</p></div>
</div>
<section class="xchrist">
<div class="dd">${glyph('veil', 70)}</div>
<span class="ey" style="color:#D7C49A">من القديم إلى الجديد</span>
<h2>مرة واحدة</h2>
<blockquote>${vq(x.christ.ref)}<small>${refLabel(x.christ.ref)}</small></blockquote>
${x.christ.p.map((p) => `<p>${md(p)}</p>`).join('')}
<a class="btn l" href="${chapterHref(b, 16, depth)}">${IC.read}ادرس اللاويين ١٦</a>
</section>`;
}

// ---------- 3D tabernacle scene (geometry is built in assets/t3d.js) ----------
export function scene3d(depth, mode = 'explore') {
  const T = tabernacle, A = atonement;
  const first = (s) => String(s).split(/(?<=\.)\s/)[0];
  const items = T.steps.map((s, i) => ({ id: s.id, num: ar(i + 1), name: s.name, color: s.color, mat: s.mat, what: first(s.what) + (first(s.what) !== s.what ? ' ' + String(s.what).split(/(?<=\.)\s/)[1] : ''), christ: s.christ.t.replace(/«|»/g, '"'), href: mode === 'explore' ? `#it-${s.id}` : `${'../'.repeat(depth)}explain/tabernacle.html#it-${s.id}` }));
  const steps = A.steps.map((s) => ({ num: ar(s.n), t: s.t, d: s.d.replace(/«|»/g, '"'), v: String(verseText(s.ref) || ''), ref: refLabel(s.ref), at: s.at, zone: s.zone, color: s.color }));
  const J = (o) => esc(JSON.stringify(o));
  return `<div class="t3d" data-mode="${mode}" data-items="${J(items)}" data-steps="${J(steps)}">
<div class="t3v" role="img" aria-label="مجسم ثلاثي الأبعاد للمسكن"></div>
<div class="t3c"><button type="button" data-c="in" aria-label="تكبير">+</button><button type="button" data-c="out" aria-label="تصغير">−</button><button type="button" data-c="top" aria-label="منظر علوي">${IC.up}</button><button type="button" data-c="roof" class="w">السقف</button><button type="button" data-c="reset" aria-label="إعادة">↺</button></div>
<div class="t3hint">اسحب للتدوير · قرّب بإصبعين أو بالعجلة · اضغط على أي قطعة</div>
<button type="button" class="t3go" data-c="atone">${glyph('veil', 22)}<span>شاهد يوم الكفارة: محاكاة كاملة</span></button>
<div class="t3i" hidden></div>
<div class="t3tour"><div class="th"><span class="n"></span><b class="tt"></b><button type="button" data-c="exit" aria-label="إنهاء الجولة">${IC.close}</button></div><p class="d"></p><blockquote class="v"></blockquote><div class="tn"><button type="button" data-c="prev">${IC.back}السابق</button><span class="dots">${A.steps.map(() => '<i></i>').join('')}</span><button type="button" data-c="next">التالي${IC.chev}</button></div></div>
</div>
<script type="module" src="${'../'.repeat(depth)}assets/t3d.js"></script>`;
}

// ---------- the feasts of the LORD ----------
const FTAG = { explicit: 'صريح في العهد الجديد', likely: 'ارتباط راجح', possible: 'اقتراح تفسيري' };
function feastsPage(x, depth) {
  const b = bookById[x.book];
  const I = x.items;
  const r = (ref) => `<a class="r" href="${refHref(ref, depth)}">${refLabel(ref)}</a>`;
  // calendar ring: month 1 (Nisan) at top, clockwise
  const C = 160, R1 = 128, R2 = 98, ang = (m, d) => ((m - 1 + (d - 1) / 30) / 12) * 2 * Math.PI - Math.PI / 2;
  const pt = (a, r0) => [C + r0 * Math.cos(a), C + r0 * Math.sin(a)];
  const arc = (a0, a1, r0, r1) => { const [x0, y0] = pt(a0, r1), [x1, y1] = pt(a1, r1), [x2, y2] = pt(a1, r0), [x3, y3] = pt(a0, r0); const lg = a1 - a0 > Math.PI ? 1 : 0; return `M${x0.toFixed(1)} ${y0.toFixed(1)}A${r1} ${r1} 0 ${lg} 1 ${x1.toFixed(1)} ${y1.toFixed(1)}L${x2.toFixed(1)} ${y2.toFixed(1)}A${r0} ${r0} 0 ${lg} 0 ${x3.toFixed(1)} ${y3.toFixed(1)}Z`; };
  const seg = x.months.map((mn, k) => { const a0 = ang(k + 1, 1), a1 = ang(k + 2, 1); const [tx, ty] = pt((a0 + a1) / 2, (R1 + R2) / 2); const cls = k < 3 ? 'sp' : k === 6 ? 'au' : ''; return `<path class="fm ${cls}" d="${arc(a0 + 0.012, a1 - 0.012, R2, R1)}"/><text class="fmt" x="${tx.toFixed(1)}" y="${(ty + 4).toFixed(1)}">${mn}</text>`; }).join('');
  const marks = I.map((i, k) => { const a = ang(i.m, i.d); const [mx, my] = pt(a + (i.off || 0) * Math.PI / 180, R2 - 28); const [lx, ly] = pt(a, R2 - 1); return `<a href="#of-${i.id}" data-of-go="${i.id}"><line x1="${lx.toFixed(1)}" y1="${ly.toFixed(1)}" x2="${mx.toFixed(1)}" y2="${my.toFixed(1)}" stroke="${i.color}"/><circle cx="${mx.toFixed(1)}" cy="${my.toFixed(1)}" r="15.5" fill="${i.color}"/><g transform="translate(${(mx - 10).toFixed(1)} ${(my - 10).toFixed(1)})" color="${i.ink}">${glyph(i.icon, 20)}</g></a>`; }).join('');
  const ring = `<svg class="fring" viewBox="0 0 320 320" role="img" aria-label="السنة العبرية وأعيادها">${seg}<circle cx="${C}" cy="${C}" r="38" class="fc"/><text x="${C}" y="${C - 2}" class="fct">السنة</text><text x="${C}" y="${C + 15}" class="fcs">المقدسة</text>${marks}</svg>`;
  const card = (i, k) => `<article class="xc oc" id="of-${i.id}" data-panel="${i.id}" style="--c:${i.color};--k:${i.ink}"${k ? ' hidden' : ''}>
<div class="xc-top"><span class="no">العيد ${ORD[k + 1]}</span><span class="cy">${esc(i.season)}</span></div>
<div class="xc-ic">${glyph(i.icon, 84)}</div>
<h2>${esc(i.name)}</h2>
<div class="xc-ref">«${esc(i.heb)}»: ${esc(i.mean)} · ${esc(i.when)} · ${r(i.ref)}</div>
<blockquote>${vq(i.key)}<small>${refLabel(i.key)}</small></blockquote>
<div class="xc-sec"><small>كيف يُحفظ؟</small><p>${md(i.what)}</p></div>
<div class="xc-god"><div class="h"><small>ماذا يتذكر؟</small></div><b>${esc(i.need)}</b></div>
<div class="xc-sec"><small>في حياة إسرائيل</small><p>${md(i.share)}</p><p style="margin-top:6px;opacity:.85">انظر أيضاً ${r(i.law)}</p></div>
<div class="xc-sec tp-x"><small>يتمم في المسيح · ${r(i.christ.ref)} · <span class="ftag ${i.christ.tag}">${FTAG[i.christ.tag]}</span></small><p>${md(i.christ.t)}</p></div>
<div class="xc-nav">${k ? `<a href="#of-${I[k - 1].id}" data-of-go="${I[k - 1].id}">${IC.back}${esc(I[k - 1].name)}</a>` : '<span></span>'}<a class="ch" href="${chapterHref(b, 23, depth)}#v${String(i.ref.split('.')[2]).split('-')[0]}">${IC.read}اللاويين ٢٣</a>${k < I.length - 1 ? `<a href="#of-${I[k + 1].id}" data-of-go="${I[k + 1].id}">${esc(I[k + 1].name)}${IC.chev}</a>` : '<span></span>'}</div>
</article>`;
  const table = `<div class="ftbl">${I.map((i) => `<a href="#of-${i.id}" data-of-go="${i.id}" style="--c:${i.color};--k:${i.ink}"><span class="fi">${glyph(i.icon, 26)}</span><b>${esc(i.name)}</b><span class="fs">${esc(i.need)}</span><span class="fx">${esc(i.nt)}</span><span class="ftag ${i.christ.tag}">${FTAG[i.christ.tag]}</span></a>`).join('')}</div>`;
  return `${header({ back: `${'../'.repeat(depth)}book/${b.slug}.html`, title: 'شرح مصوّر' })}
<section class="xhero of fe">
<span class="ey" style="color:#D7C49A">${esc(b.name)} ${x.range} · شرح مصوّر</span>
<h1>${esc(x.title)}</h1>
<p class="sub">${esc(x.sub)}</p>
<div class="ofan">${I.map((i) => `<span style="--c:${i.color};--k:${i.ink}">${glyph(i.icon, 28)}<small>${esc(i.short)}</small></span>`).join('')}</div>
<blockquote>${vq(x.heroRef)}<small>${refLabel(x.heroRef)}</small></blockquote>
</section>
<div class="xbody">
<p class="lead">${md(x.intro)}</p>
<h3 class="xh"><span>١</span>السنة في دائرة</h3>
<p class="xp">الشهر الأول في الأعلى، والسنة تدور مع عقارب الساعة. أعياد الربيع في الأشهر الأولى، وأعياد الخريف كلها في الشهر السابع. اضغط على أي عيد.</p>
${ring}
<div class="fleg"><span class="sp">الربيع: الفصح، والفطير، والباكورة</span><span>أول الصيف: الخمسين</span><span class="au">الخريف: الهتاف، والكفارة، والمظال</span></div>
<h3 class="xh"><span>٢</span>كل عيد بالتفصيل</h3>
<div class="tchips" id="ochips" style="grid-template-columns:repeat(7,1fr)">${I.map((i, k) => `<button type="button" data-of-go="${i.id}" style="--c:${i.color};--k:${i.ink}" aria-pressed="${k ? 'false' : 'true'}">${glyph(i.icon, 20)}<span>${esc(i.short)}</span></button>`).join('')}</div>
<div class="opanels" id="opanels">${I.map(card).join('')}</div>
<h3 class="xh"><span>٣</span>إيقاع السبعة</h3>
<p class="xp">التقويم كله مبني على رقم الخليقة: ستة وسابع. والإيقاع يمتد من الأيام إلى السنين.</p>
<div class="fsev">${x.sevens.map((s) => `<a href="${refHref(s.ref, depth)}"><b>${esc(s.n)}</b><span>${esc(s.t)}</span><small>${refLabel(s.ref)}</small></a>`).join('')}</div>
<h3 class="xh"><span>٤</span>من الظل إلى الجسد</h3>
<p class="xp">كل عيد كما عاشته إسرائيل، وكيف يقرأه العهد الجديد. لاحظ قوة الارتباط: بعضه صريح، وبعضه اقتراح.</p>
${table}
<h3 class="xh"><span>٥</span>سؤال صعب</h3>
<div class="blk xhard"><h3>${md(x.hard.q)}</h3><p>${md(x.hard.a)}</p></div>
</div>
<section class="xchrist">
<span class="ey" style="color:#D7C49A">من القديم إلى الجديد</span>
<h2>الظل والجسد</h2>
<blockquote>${vq(x.christ.ref)}<small>${refLabel(x.christ.ref)}</small></blockquote>
${x.christ.p.map((p) => `<p>${md(p)}</p>`).join('')}
<a class="btn l" href="${chapterHref(b, 23, depth)}">${IC.read}ادرس اللاويين ٢٣</a>
</section>`;
}

// ---------- the camp of Israel ----------
function campPage(x, depth) {
  const b = bookById[x.book];
  const I = x.items, by = Object.fromEntries(I.map((i) => [i.side, i]));
  const r = (ref) => `<a class="r" href="${refHref(ref, depth)}">${refLabel(ref)}</a>`;
  const n = (v) => ar(v.toLocaleString('en-US')).replace(/,/g, '٬');
  // west at top (holy of holies), east (door) at bottom
  const block = (i, x0, y0, w, h, vert) => {
    const cells = i.tribes.map((t, k) => {
      const cx = vert ? x0 + w / 2 : x0 + (w / 3) * k + w / 6, cy = vert ? y0 + (h / 3) * k + h / 6 : y0 + h / 2;
      return `<text class="ct" x="${cx}" y="${cy - 3}">${t[0]}</text><text class="cn" x="${cx}" y="${cy + 12}">${n(t[1])}</text>`;
    }).join('');
    return `<a href="#of-${i.id}" data-of-go="${i.id}"><rect class="cb" x="${x0}" y="${y0}" width="${w}" height="${h}" rx="10" style="fill:${i.color}"/>${cells}</a>`;
  };
  const L = by.C;
  const plan = `<svg class="cplan" viewBox="0 0 360 380" role="img" aria-label="مخطط المحلة حول المسكن">
<text class="cd" x="180" y="12">الغرب</text><text class="cd" x="180" y="376">الشرق · الباب</text><text class="cd" x="8" y="194" transform="rotate(-90 8 194)">الجنوب</text><text class="cd" x="352" y="194" transform="rotate(90 352 194)">الشمال</text>
${block(by.W, 70, 20, 220, 62, false)}
${block(by.S, 14, 96, 62, 190, true)}
${block(by.N, 284, 96, 62, 190, true)}
${block(by.E, 70, 300, 220, 62, false)}
<a href="#of-levites" data-of-go="levites">
<rect class="lv" x="96" y="96" width="168" height="22" rx="6"/><text class="lt" x="180" y="111">الجرشونيون ٧٬٥٠٠</text>
<rect class="lv" x="84" y="124" width="22" height="146" rx="6"/><text class="lt" x="95" y="197" transform="rotate(-90 95 197)">القهاتيون ٨٬٦٠٠</text>
<rect class="lv" x="254" y="124" width="22" height="146" rx="6"/><text class="lt" x="265" y="197" transform="rotate(90 265 197)">المراريون ٦٬٢٠٠</text>
<rect class="lv k" x="96" y="276" width="168" height="18" rx="6"/><text class="lt k" x="180" y="289">موسى وهارون والكهنة</text>
<rect class="court" x="118" y="128" width="124" height="142" rx="3"/>
<rect class="tent" x="160" y="140" width="40" height="70"/><rect class="hh" x="160" y="140" width="40" height="22"/>
<rect class="alt" x="172" y="236" width="16" height="14"/><text class="tt" x="180" y="228">المسكن</text>
</a></svg>`;
  const march = [['judah', 'يهوذا ويساكر وزبولون'], ['levites', 'الجرشونيون والمراريون يحملون المسكن'], ['reuben', 'رأوبين وشمعون وجاد'], ['levites', 'القهاتيون يحملون الأقداس'], ['ephraim', 'أفرايم ومنسى وبنيامين'], ['dan', 'دان وأشير ونفتالي']];
  const byId = Object.fromEntries(I.map((i) => [i.id, i]));
  const card = (i, k) => `<article class="xc oc" id="of-${i.id}" data-panel="${i.id}" style="--c:${i.color};--k:${i.ink}"${k ? ' hidden' : ''}>
<div class="xc-top"><span class="no">${esc(i.dir)}</span><span class="cy">${i.id === 'levites' ? 'لا يُعدّون للحرب' : 'يرحل ' + ['', 'أولاً', 'ثانياً', '', 'ثالثاً', 'أخيراً'][i.order]}</span></div>
<div class="xc-ic">${glyph(i.icon, 72)}</div>
<h2>${esc(i.name)}</h2>
<div class="xc-ref">${r(i.ref)}${i.id !== 'levites' ? ` · المجموع ${n(i.total)}` : ' · ٢٢٬٠٠٠ ذكر من ابن شهر'}</div>
<div class="ctr">${i.tribes.map((t) => `<div><b>${esc(t[0])}</b><span>${t[1] ? n(t[1]) : ''}</span><small>${esc(t[2])}</small></div>`).join('')}</div>
<div class="xc-sec"><p>${md(i.note)}</p></div>
<div class="xc-nav">${k ? `<a href="#of-${I[k - 1].id}" data-of-go="${I[k - 1].id}">${IC.back}${esc(I[k - 1].short)}</a>` : '<span></span>'}<a class="ch" href="${chapterHref(b, i.id === 'levites' ? 3 : 2, depth)}">${IC.read}العدد ${i.id === 'levites' ? '٣' : '٢'}</a>${k < I.length - 1 ? `<a href="#of-${I[k + 1].id}" data-of-go="${I[k + 1].id}">${esc(I[k + 1].short)}${IC.chev}</a>` : '<span></span>'}</div>
</article>`;
  return `${header({ back: `${'../'.repeat(depth)}book/${b.slug}.html`, title: 'شرح مصوّر' })}
<section class="xhero of cp">
<span class="ey" style="color:#D7C49A">${esc(b.name)} ${x.range} · شرح مصوّر</span>
<h1>${esc(x.title)}</h1>
<p class="sub">${esc(x.sub)}</p>
<div class="ofan">${I.map((i) => `<span style="--c:${i.color};--k:${i.ink}">${glyph(i.icon, 28)}<small>${esc(i.short)}</small></span>`).join('')}</div>
<blockquote>${vq(x.heroRef)}<small>${refLabel(x.heroRef)}</small></blockquote>
</section>
<div class="xbody">
<p class="lead">${md(x.intro)}</p>
<h3 class="xh"><span>١</span>المحلة من فوق</h3>
<p class="xp">الغرب في الأعلى حيث قدس الأقداس، والباب في الشرق أسفل. اضغط على أي محلة.</p>
${plan}
<p class="note">الأعداد للرجال من ابن عشرين سنة فصاعداً (العدد 1–2)، واللاويون من ابن شهر (العدد 3). المجموع ${n(603550)}. المساحات للتوضيح لا للقياس.</p>
<h3 class="xh"><span>٢</span>كل محلة بالتفصيل</h3>
<div class="tchips" id="ochips" style="grid-template-columns:repeat(5,1fr)">${I.map((i, k) => `<button type="button" data-of-go="${i.id}" style="--c:${i.color};--k:${i.ink}" aria-pressed="${k ? 'false' : 'true'}">${glyph(i.icon, 20)}<span>${esc(i.short)}</span></button>`).join('')}</div>
<div class="opanels" id="opanels">${I.map(card).join('')}</div>
<h3 class="xh"><span>٣</span>ترتيب الرحيل</h3>
<p class="xp">حين ترتفع السحابة يرحل الشعب بهذا الترتيب (العدد 10: 14–28). المسكن يُفكك ويُحمل في الوسط.</p>
<div class="cmarch">${march.map(([id, t], k) => `<a href="#of-${id}" data-of-go="${id}" style="--c:${byId[id].color};--k:${byId[id].ink}"><b>${ar(k + 1)}</b><span>${esc(t)}</span></a>`).join('<i>←</i>')}</div>
<p class="note">${r('Num.10.14-28')}</p>
</div>
<section class="xchrist">
<span class="ey" style="color:#D7C49A">من القديم إلى الجديد</span>
<h2>الله في الوسط</h2>
<blockquote>${vq(x.christ.ref)}<small>${refLabel(x.christ.ref)}</small></blockquote>
${x.christ.p.map((p) => `<p>${md(p)}</p>`).join('')}
<a class="btn l" href="${chapterHref(b, 2, depth)}">${IC.read}ادرس العدد ٢</a>
</section>`;
}

// ---------- the bronze serpent ----------
function serpentPage(x, depth) {
  const b = bookById[x.book], I = x.items;
  const r = (ref) => `<a class="r" href="${refHref(ref, depth)}">${refLabel(ref)}</a>`;
  // the camp scene: twelve people around the pole; each one who looks, lives
  const N = 12, cx = 180, cy = 150;
  const people = Array.from({ length: N }, (_, k) => {
    const a = (k / N) * Math.PI * 2 + 0.26, rx = 140, ry = 92;
    const px = cx + Math.cos(a) * rx, py = cy + 18 + Math.sin(a) * ry;
    return `<g class="sp" data-i="${k}" transform="translate(${px.toFixed(1)} ${py.toFixed(1)})" tabindex="0" role="button" aria-label="ملدوغ رقم ${ar(k + 1)}: اضغط لينظر"><line class="sl" x1="0" y1="-14" x2="${(cx - px).toFixed(1)}" y2="${(cy - 40 - py).toFixed(1)}"/><circle class="halo" r="17" cy="-4"/><circle class="hd" r="5.5" cy="-17"/><path class="bd" d="M-8 10c0-12 3-20 8-20s8 8 8 20z"/></g>`;
  }).join('');
  const scene = `<div class="spx" id="spx"><svg viewBox="0 0 360 290" role="img" aria-label="المحلة والحية النحاسية على الراية">
<defs><linearGradient id="spsand" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F1E3C4"/><stop offset="1" stop-color="#DCC394"/></linearGradient></defs>
<rect width="360" height="290" fill="url(#spsand)"/>
<g class="tents">${[[28, 40], [70, 22], [290, 24], [330, 44], [16, 250], [344, 252]].map(([tx, ty]) => `<path d="M${tx - 14} ${ty + 12}l14-14 14 14z"/>`).join('')}</g>
<g class="snk">${[[60, 200], [300, 210], [110, 270], [250, 64], [96, 92]].map(([sx, sy]) => `<path d="M${sx} ${sy}c4-6 8-6 12 0s8 6 12 0"/>`).join('')}</g>
<line x1="${cx}" y1="${cy + 24}" x2="${cx}" y2="${cy - 92}" class="pole"/><line x1="${cx - 14}" y1="${cy - 84}" x2="${cx + 14}" y2="${cy - 84}" class="pole"/>
<path class="brz" d="M${cx + 1} ${cy - 78}c-15 3-15 12 0 15s15 12 0 15-15 12 0 15"/><circle class="brz-h" cx="${cx + 2}" cy="${cy - 79}" r="3.4"/>
${people}
</svg>
<div class="spbar"><span id="spn">لم ينظر أحد بعد</span><button type="button" class="btn" id="splook">انظر إلى الحية</button><button type="button" class="btn ghost" id="spreset">من جديد</button></div>
<p class="note">اضغط على أي شخص ليرفع عينيه إلى الراية، أو اضغط «انظر إلى الحية». لم يُطلب من أحد شيء آخر.</p></div>
<script>(function(){var w=document.getElementById('spx');if(!w)return;var P=w.querySelectorAll('.sp'),n=document.getElementById('spn');
function cnt(){var k=w.querySelectorAll('.sp.lv').length;n.textContent=k===0?'لم ينظر أحد بعد':k===P.length?'كل من نظر حيا':('نظر '+k.toLocaleString('ar-EG')+' من '+P.length.toLocaleString('ar-EG')+' فحيوا');}
function look(g){if(g.classList.contains('lv'))return;g.classList.add('lk');setTimeout(function(){g.classList.add('lv');cnt();},650);}
P.forEach(function(g){g.addEventListener('click',function(){look(g);});g.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();look(g);}});});
document.getElementById('splook').addEventListener('click',function(){Array.prototype.forEach.call(P,function(g,i){setTimeout(function(){look(g);},i*160);});});
document.getElementById('spreset').addEventListener('click',function(){P.forEach(function(g){g.classList.remove('lk','lv');});cnt();});})();</script>`;
  const card = (i, k) => `<article class="xc oc" id="of-${i.id}" data-panel="${i.id}" style="--c:${i.color};--k:${i.ink}"${k ? ' hidden' : ''}>
<div class="xc-top"><span class="no">الخطوة ${ORD[k + 1]}</span><span class="cy">${r(i.ref)}</span></div>
<div class="xc-ic">${glyph(i.icon, 72)}</div>
<h2>${esc(i.name)}</h2>
<blockquote>${vq(i.ref)}<small>${refLabel(i.ref)}</small></blockquote>
<div class="xc-sec"><small>ماذا حدث؟</small><p>${md(i.what)}</p></div>
<div class="xc-sec"><small>المعنى</small><p>${md(i.meaning)}</p></div>
<div class="xc-nav">${k ? `<a href="#of-${I[k - 1].id}" data-of-go="${I[k - 1].id}">${IC.back}${esc(I[k - 1].short)}</a>` : '<span></span>'}<a class="ch" href="${chapterHref(b, 21, depth)}">${IC.read}العدد ٢١</a>${k < I.length - 1 ? `<a href="#of-${I[k + 1].id}" data-of-go="${I[k + 1].id}">${esc(I[k + 1].short)}${IC.chev}</a>` : '<span></span>'}</div>
</article>`;
  return `${header({ back: `${'../'.repeat(depth)}book/${b.slug}.html`, title: 'شرح مصوّر' })}
<section class="xhero of sp-h">
<span class="ey" style="color:#D7C49A">${esc(b.name)} ${x.range} · شرح مصوّر</span>
<h1>${esc(x.title)}</h1>
<p class="sub">${esc(x.sub)}</p>
<div class="ofan">${I.map((i) => `<span style="--c:${i.color};--k:${i.ink}">${glyph(i.icon, 28)}<small>${esc(i.short)}</small></span>`).join('')}</div>
<blockquote>${vq(x.heroRef)}<small>${refLabel(x.heroRef)}</small></blockquote>
</section>
<div class="xbody">
<p class="lead">${md(x.intro)}</p>
<h3 class="xh"><span>١</span>في المحلة: انظر فتحيا</h3>
<p class="xp">الملدوغون حول الراية. السم واحد في الجميع، والعلاج واحد للجميع.</p>
${scene}
<h3 class="xh"><span>٢</span>القصة في خمس خطوات</h3>
<div class="tchips" id="ochips" style="grid-template-columns:repeat(5,1fr)">${I.map((i, k) => `<button type="button" data-of-go="${i.id}" style="--c:${i.color};--k:${i.ink}" aria-pressed="${k ? 'false' : 'true'}">${glyph(i.icon, 20)}<span>${esc(i.short)}</span></button>`).join('')}</div>
<div class="opanels" id="opanels">${I.map(card).join('')}</div>
<h3 class="xh"><span>٣</span>من الراية إلى الصليب</h3>
<p class="xp">يسوع نفسه ربط بين الحية والصليب (يو 3: 14–15). قارن العمودين.</p>
<div class="sptype"><div class="sph"><span></span><b>العدد ٢١</b><b>يوحنا ٣ والصليب</b></div>${x.type.map((t) => `<div class="spr"><span>${esc(t[0])}</span><p>${md(t[1])}</p><p>${md(t[2])}</p></div>`).join('')}</div>
<h3 class="xh"><span>٤</span>قصة الحية عبر الكتاب</h3>
<div class="sptl">${x.timeline.map((t) => `<a href="${refHref(t.ref, depth)}"><small>${esc(t.y)} · ${refLabel(t.ref)}</small><b>${esc(t.t)}</b><span>${md(t.d)}</span></a>`).join('')}</div>
<h3 class="xh"><span>٥</span>سؤال صعب</h3>
<div class="blk xhard"><h3>${md(x.hard.q)}</h3><p>${md(x.hard.a)}</p></div>
</div>
<section class="xchrist">
<div class="dd">${glyph('serpent', 70)}</div>
<span class="ey" style="color:#D7C49A">من القديم إلى الجديد</span>
<h2>هكذا ينبغي أن يُرفع ابن الإنسان</h2>
<blockquote>${vq(x.christ.ref)}<small>${refLabel(x.christ.ref)}</small></blockquote>
${x.christ.p.map((p) => `<p>${md(p)}</p>`).join('')}
<a class="btn l" href="${chapterHref(b, 21, depth)}">${IC.read}ادرس العدد ٢١</a>
</section>`;
}

// ---------- plagues: presentation mode (projector / Sunday school) ----------
export function plaguesPresent(x, depth) {
  const P = x.plagues;
  const norm = (w) => w.replace(/[ً-ْٰـ]/g, '').replace(/[ٱأإآ]/g, 'ا').replace(/[.،:؛,«»؟]/g, '');
  const piece = (ref, t) => {
    const vw = verseText(ref).split(/\s+/), tw = t.split(/\s+/).map(norm);
    for (let i = 0; i + tw.length <= vw.length; i++) if (tw.every((w, j) => norm(vw[i + j]) === w)) return vw.slice(i, i + tw.length).join(' ').replace(/[«»]/g, '').replace(/[.،:؛,]$/, '');
    throw new Error(`Present: fragment not in ${ref}: ${t}`);
  };
  const slides = [];
  slides.push({ bg: '#17191E', fg: '#FAF8F4', title: x.title, note: 'ابدأ بسؤال: ماذا تعرف عن الضربات العشر؟ ثم اقرأ الخروج ٥: ٢ بصوت عالٍ. سؤال فرعون هو مفتاح القصة: الضربات جواب الله عليه.',
    h: `<div class="ps-title"><small>${esc(bookById[x.book].name)} ${ar(x.chapters[0])}–${ar(x.chapters[x.chapters.length - 1])}</small><h1>${esc(x.title)}</h1><p class="v">${esc(piece('Exod.5.2', 'من هو الرب حتى اسمع لقوله'))}…</p><span class="rf">${refLabel('Exod.5.2')} · فرعون لموسى وهارون</span><div class="mo">${P.map((p) => `<i style="--c:${p.color};--k:${p.ink}">${glyph(p.icon, 40)}</i>`).join('')}</div></div>` });
  slides.push({ bg: '#17191E', fg: '#FAF8F4', title: 'ثلاث جولات وضربة أخيرة', note: 'اطلب من المجموعة أن تكتشف النمط قبل أن تشرحه: ماذا يتكرر في كل جولة من الجولات الثلاث؟',
    h: `<div class="ps-grid"><h2>ثلاث جولات وضربة أخيرة</h2><div class="g">${x.cycles.map((c) => `<span class="ch">${esc(c.t)}</span>`).join('')}${[0, 1, 2].map((r) => [0, 1, 2].map((c) => P[r * 3 + c])).flat().map((p) => `<span class="t" style="--c:${p.color};--k:${p.ink}">${glyph(p.icon, 34)}${ar(p.n)} · ${esc(p.name)}</span>`).join('')}<span class="t last" style="--c:${P[9].color};--k:${P[9].ink}">${glyph(P[9].icon, 34)}${ar(10)} · ${esc(P[9].name)}</span></div></div>` });
  for (const p of P) slides.push({ bg: p.color, fg: p.ink, title: `${ar(p.n)} · ${p.name}`,
    note: `اقرأ ${refLabel(p.ref)} معاً. سؤال للنقاش: ماذا تعلن هذه الضربة عن الرب؟${p.god.tag === 'explicit' ? '' : ` تنبيه: الربط بـ${p.god.n} ${TAGS[p.god.tag]}، فقدّمه كذلك لا كحقيقة مؤكدة.`}`,
    h: `<div class="ps-pl"><span class="ic">${glyph(p.icon, 170)}</span><div><small>الضربة ${ORD[p.n]} · ${refLabel(p.ref)}</small><h2>${esc(p.name)}</h2><p class="v">${vq(p.key)}</p><span class="rf">${refLabel(p.key)}</span><span class="god">ضد من؟ ${esc(p.god.n)} <em>${TAGS[p.god.tag]}</em></span></div></div>` });
  slides.push({ bg: '#101216', fg: '#FAF8F4', title: 'الفصح', note: 'اختم بالخروج ١٢: ١٣ ثم ١ كورنثوس ٥: ٧. اسأل: لماذا كان الدم هو الفرق الوحيد؟ وماذا يعني أن المسيح فصحنا؟',
    h: `<div class="ps-end"><span class="ic">${glyph('door', 90)}</span><p class="v">${esc(piece('Exod.12.13', 'فارى الدم واعبر عنكم'))}</p><span class="rf">${refLabel('Exod.12.13')}</span><p class="v s">${vq('1Cor.5.7')}</p><span class="rf">${refLabel('1Cor.5.7')}</span></div>` });
  return presentShell(x, slides);
}

function presentShell(x, slides) {
  return `<div class="ps" data-present>
<div class="ps-top"><a href="${x.id}.html">${IC.close}<span>خروج من العرض</span></a><b>وضع العرض · ${esc(x.title)}</b><span><button type="button" data-notes aria-pressed="false">ملاحظات المعلم</button><button type="button" data-fs>ملء الشاشة</button></span></div>
<div class="ps-main"><div class="ps-stage">${slides.map((s, i) => `<section class="sl" style="--bg:${s.bg};--fg:${s.fg}" aria-label="${esc(s.title)}"${i ? ' hidden' : ''}>${s.h}<span class="brand">لمجد الله</span><span class="num">${ar(i + 1)} / ${ar(slides.length)}</span></section>`).join('')}</div>
<aside class="ps-notes" hidden><small>ملاحظات للمعلم</small>${slides.map((s, i) => `<p data-n="${i}"${i ? ' hidden' : ''}>${esc(s.note)}</p>`).join('')}<small class="k">المفاتيح: الأسهم للتنقل · N للملاحظات · F لملء الشاشة</small></aside></div>
<div class="ps-ctl"><button type="button" data-prev aria-label="الشريحة السابقة">${IC.chev.replace('class="ic"', 'class="ic" style="transform:scaleX(-1)"')}</button><div class="th" role="tablist" aria-label="الشرائح">${slides.map((s, i) => `<button type="button" role="tab" data-go-sl="${i}" aria-selected="${i === 0}" style="--bg:${s.bg};--fg:${s.fg}">${esc(s.title)}</button>`).join('')}</div><button type="button" data-next aria-label="الشريحة التالية">${IC.chev}</button></div>
</div>`;
}

// ---------- presentation mode for the other explainers (same shell, slides from each explainer's own data) ----------
const ASK = {
  offerings: 'ماذا تكشف هذه الذبيحة عن حاجتنا، وكيف تمّت في المسيح؟',
  atonement: 'ماذا يحدث في هذه الخطوة، ولماذا كانت ضرورية؟',
  feasts: 'ماذا كان الشعب يتذكر في هذا العيد، وإلى ماذا يشير؟',
  camp: 'ماذا يعلّمنا ترتيب الأسباط حول المسكن؟',
  serpent: 'أين نرى في هذا المشهد خطية الشعب، وأين نرى رحمة الله؟',
  tabernacle: 'ماذا علّمت هذه القطعة إسرائيل عن الاقتراب إلى الله؟'
};
export function explainPresent(x, depth) {
  if (x.id === 'plagues') return plaguesPresent(x, depth);
  const plainT = (t) => String(t || '').replace(/\*\*/g, '').replace(/\s+/g, ' ').trim();
  const lead = (t, n = 190) => { const p = plainT(t); if (p.length <= n) return p; const cut = p.slice(0, n); const i = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('، ')); return (i > 80 ? cut.slice(0, i + 1) : cut.replace(/\s+\S*$/, '')) + (i > 80 ? '' : '…'); };
  const C = chips(x);
  const list = x.id === 'atonement' ? x.steps.map((s) => ({ name: s.t, ref: s.ref, icon: s.icon, color: s.color, ink: '#FFFFFF', what: s.d, label: `الخطوة ${ar(s.n)}` }))
    : (x.items || x.steps).map((it, i) => ({ name: it.name, ref: it.ref, key: it.key, icon: it.icon, color: it.color, ink: it.ink, what: it.what || it.note || it.meaning, label: x.id === 'offerings' ? `ذبيحة ${ar(i + 1)} من ${ar(x.items.length)}` : x.id === 'camp' ? 'جهة من المحلة' : `${ar(i + 1)} من ${ar((x.items || x.steps).length)}` }));
  const slides = [];
  slides.push({ bg: '#17191E', fg: '#FAF8F4', title: x.title, note: `ابدأ بقراءة ${refLabel(x.heroRef)} بصوت عالٍ، ثم اسأل: ماذا تعرف عن ${x.title}؟`,
    h: `<div class="ps-title"><small>شرح مصوّر · ${esc(bookById[x.book].name)}</small><h1>${esc(x.title)}</h1><p class="v">${vq(x.heroRef)}</p><span class="rf">${refLabel(x.heroRef)}</span><div class="mo">${C.slice(0, 10).map((c) => `<i style="--c:${c.color};--k:${c.ink}">${glyph(c.icon, 40)}</i>`).join('')}</div></div>` });
  for (const it of list) slides.push({ bg: it.color, fg: it.ink || '#FFFFFF', title: it.name,
    note: `${it.ref ? `اقرأ ${refLabel(it.ref)} معاً. ` : ''}سؤال للنقاش: ${ASK[x.id] || 'ماذا يعلّمنا هذا عن الله؟'}`,
    h: `<div class="ps-pl"><span class="ic">${glyph(it.icon, 170)}</span><div><small>${esc(it.label)}${it.ref ? ` · ${refLabel(it.ref)}` : ''}</small><h2>${esc(it.name)}</h2>${it.key ? `<p class="v">${vq(it.key)}</p><span class="rf">${refLabel(it.key)}</span>` : it.what ? `<p class="d">${esc(lead(it.what))}</p>` : ''}</div></div>` });
  slides.push({ bg: '#101216', fg: '#FAF8F4', title: 'في المسيح', note: `اختم بقراءة ${refLabel(x.christ.ref)}. اسأل: كيف تمّ هذا في المسيح؟`,
    h: `<div class="ps-end"><span class="ic">${glyph(C[C.length - 1].icon, 90)}</span><p class="v">${vq(x.christ.ref)}</p><span class="rf">${refLabel(x.christ.ref)}</span><p class="v s">${esc(lead(x.christ.p[0], 220))}</p></div>` });
  return presentShell(x, slides);
}
