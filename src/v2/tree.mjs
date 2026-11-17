// Family tree: from Adam to the twelve sons of Jacob (Genesis 4–35).
// Every name carries the verse where Genesis names it; lines between generations follow the text.
// Gaps compress the genealogies of Genesis 5 and 11 (seven named generations each).
import { ar, esc, refLabel, refHref, verseText } from '../lib.mjs';
import { header } from './ui.mjs';

// id, label, x, y (design units: 1000 × 1110, x measured from the right), kind, parent, ref, note
const N = [
  ['adam', 'آدم', 480, 40, 'main', null, 'Gen.2.7', ''],
  ['eve', 'حواء', 610, 40, 'wife', null, 'Gen.3.20', 'زوجة آدم، دعاها حواء لأنها أم كل حي.'],
  ['cain', 'قايين', 250, 132, 'side', 'adam', 'Gen.4.1', 'ابن آدم البكر، قتل أخاه هابيل.'],
  ['abel', 'هابيل', 365, 132, 'side', 'adam', 'Gen.4.2', 'ابن آدم، قدّم من أبكار غنمه فنظر الرب إلى قربانه.'],
  ['seth', 'شيث', 480, 132, 'main', 'adam', 'Gen.4.25', 'وُلد لآدم عوضاً عن هابيل، ومنه يستمر خط الوعد.'],
  ['g1', '٧ أجيال: أنوش … لامك', 480, 224, 'gap', 'seth', 'Gen.5.6-28', 'أنوش، قينان، مهللئيل، يارد، أخنوخ، متوشالح، لامك.'],
  ['noah', 'نوح', 480, 316, 'main', 'g1', 'Gen.5.29', ''],
  ['shem', 'سام', 480, 408, 'main', 'noah', 'Gen.5.32', 'ابن نوح، ومن نسله جاء إبراهيم.'],
  ['ham', 'حام', 600, 408, 'side', 'noah', 'Gen.5.32', 'ابن نوح.'],
  ['japheth', 'يافث', 720, 408, 'side', 'noah', 'Gen.5.32', 'ابن نوح.'],
  ['g2', '٧ أجيال: أرفكشاد … ناحور', 480, 500, 'gap', 'shem', 'Gen.11.10-25', 'أرفكشاد، شالح، عابر، فالج، رعو، سروج، ناحور.'],
  ['terah', 'تارح', 480, 592, 'main', 'g2', 'Gen.11.24', 'أبو أبرام وناحور وهاران، خرج بهم من أور الكلدانيين.'],
  ['haran', 'هاران', 230, 684, 'side', 'terah', 'Gen.11.26', 'أخو إبراهيم وأبو لوط، مات في أور الكلدانيين قبل أبيه تارح.'],
  ['nahor', 'ناحور', 355, 684, 'side', 'terah', 'Gen.11.26', 'أخو إبراهيم، ومن نسله رفقة.'],
  ['abraham', 'إبراهيم', 480, 684, 'main', 'terah', 'Gen.11.26', ''],
  ['sarah', 'سارة', 610, 684, 'wife', null, 'Gen.11.29', ''],
  ['lot', 'لوط', 230, 776, 'side', 'haran', 'Gen.11.27', ''],
  ['ishmael', 'إسماعيل', 355, 776, 'side', 'abraham', 'Gen.16.15', 'ابن إبراهيم من هاجر.'],
  ['isaac', 'إسحاق', 480, 776, 'main', 'abraham', 'Gen.21.3', ''],
  ['rebekah', 'رفقة', 610, 776, 'wife', null, 'Gen.24.67', 'زوجة إسحاق، ابنة بتوئيل بن ناحور.'],
  ['esau', 'عيسو', 355, 868, 'side', 'isaac', 'Gen.25.25', 'ابن إسحاق البكر، باع بكوريته ليعقوب.'],
  ['jacob', 'يعقوب', 480, 868, 'main', 'isaac', 'Gen.25.26', ''],
  ['leah', 'ليئة', 610, 868, 'wife', null, 'Gen.29.16', 'ابنة لابان الكبرى، زوجة يعقوب، وأم ستة من أبنائه.'],
  ['rachel', 'راحيل', 730, 868, 'wife', null, 'Gen.29.16', 'ابنة لابان الصغرى، زوجة يعقوب، وأم يوسف وبنيامين.']
];
const MAIN = new Set(['adam', 'seth', 'g1', 'noah', 'shem', 'g2', 'terah', 'abraham', 'isaac', 'jacob']);
const MOM = { L: ['ليئة', '#8C2F1E'], B: ['بلهة جارية راحيل', '#4B3D63'], Z: ['زلفة جارية ليئة', '#3E7A5A'], R: ['راحيل', '#1F2A44'] };
// Birth order as Genesis gives it (Dinah, a daughter, is not a tribe and is not drawn).
const SONS = [['reuben', 'رأوبين', 'L', 'Gen.29.32'], ['simeon', 'شمعون', 'L', 'Gen.29.33'], ['levi', 'لاوي', 'L', 'Gen.29.34'], ['judah', 'يهوذا', 'L', 'Gen.29.35'], ['dan', 'دان', 'B', 'Gen.30.6'], ['naphtali', 'نفتالي', 'B', 'Gen.30.8'], ['gad', 'جاد', 'Z', 'Gen.30.11'], ['asher', 'أشير', 'Z', 'Gen.30.13'], ['issachar', 'يساكر', 'L', 'Gen.30.18'], ['zebulun', 'زبولون', 'L', 'Gen.30.20'], ['joseph', 'يوسف', 'R', 'Gen.30.24'], ['benjamin', 'بنيامين', 'R', 'Gen.35.18']];

export function treePage({ profiles, depth = 0 }) {
  // Safety net: each name must appear in its verse (letters only, ignoring vowel marks and hamza forms).
  const norm = (s) => s.replace(/[ً-ْٰـ]/g, '').replace(/[ٱأإآ]/g, 'ا');
  const stem = { abraham: 'ابرام', sarah: 'ساراي', seth: 'شيث', noah: 'نوح', dan: 'دان', gad: 'جاد', reuben: 'راوبين' };
  for (const [id, lab, , , kind, , ref] of N) if (kind !== 'gap' && !norm(verseText(ref)).includes(stem[id] || norm(lab))) throw new Error(`Tree: ${lab} not in ${ref}`);
  for (const [id, lab, , ref] of SONS) if (!norm(verseText(ref)).includes(stem[id] || norm(lab))) throw new Error(`Tree: ${lab} not in ${ref}`);

  const pos = Object.fromEntries(N.map((n) => [n[0], [n[2], n[3]]]));
  const sx = SONS.map((_, i) => 40 + i * 80), SY = 992;
  const L = [];
  const elbow = (a, b, gold) => { const [x1, y1] = pos[a], [x2, y2] = pos[b], my = (y1 + y2) / 2 + 30; return `<path class="${gold ? 'gd' : ''}" d="M${1000 - x1} ${y1 + 50} V${my} H${1000 - x2} V${y2 + 10}"/>`; };
  for (const n of N) if (n[5]) L.push(elbow(n[5], n[0], MAIN.has(n[0]) && MAIN.has(n[5])));
  for (const [a, b] of [['adam', 'eve'], ['abraham', 'sarah'], ['isaac', 'rebekah'], ['jacob', 'leah'], ['leah', 'rachel']]) { const [x1, y1] = pos[a], [x2] = pos[b]; L.push(`<path class="mr" d="M${1000 - x1 - 52} ${y1 + 30} H${1000 - x2 + 52}"/>`); }
  const [jx, jy] = pos.jacob;
  L.push(`<path class="gd" d="M${1000 - jx} ${jy + 50} V${SY - 22}"/>`, `<path d="M${1000 - sx[0]} ${SY - 22} H${1000 - sx[11]}"/>`);
  sx.forEach((x, i) => L.push(`<path class="${i === 3 ? 'gd' : ''}" d="M${1000 - x} ${SY - 22} V${SY}"/>`));

  const P = (x, y) => `left:${((1000 - x) / 10).toFixed(2)}%;top:${(y / 11.8).toFixed(2)}%`;
  const node = ([id, lab, x, y, kind], k) => `<button type="button" class="tn k-${kind}${profiles[id] ? ' pf' : ''}" data-node="${id}" style="${P(x, y + 30)};--d:${(k * 0.04).toFixed(2)}s" aria-pressed="false">${esc(lab)}</button>`;
  const son = ([id, lab, m], i) => `<button type="button" class="tn son${i === 3 ? ' jd' : ''}${profiles[id] ? ' pf' : ''}" data-node="${id}" style="${P(sx[i], SY + 32)};--c:${MOM[m][1]};--d:${(1 + i * 0.04).toFixed(2)}s" aria-pressed="false">${esc(lab)}</button>`;

  // Side-panel content per node, kept in templates.
  const info = {};
  for (const [id, lab, , , kind, , ref, note] of N) info[id] = { lab, ref, note, kind };
  for (const [id, lab, m, ref] of SONS) info[id] = { lab, ref, note: `ابن يعقوب من ${MOM[m][0]}.${id === 'judah' ? ' ومن نسله جاء داود ثم المسيح (مت ١: ٢–١٦).' : ''}` };
  const card = (id) => {
    const I = info[id], pr = profiles[id];
    const head = `<small>${I.kind === 'gap' ? 'أجيال مختصرة' : 'في سفر التكوين'} · <a class="r" href="${refHref(I.ref, depth)}">${refLabel(I.ref)}</a></small>`;
    if (!pr) return `<div class="tcd">${head}<b>${esc(I.lab)}</b><p>${esc(I.note)}</p></div>`;
    const Q = pr.prof;
    return `<div class="tcd">${head}<div class="h3p"><span class="hd"><b>${esc(Q.n)}</b>${Q.he ? `<span lang="he">${esc(Q.he)}</span>` : ''}</span><span class="im" style="--bg:#2A3328"><span>${esc([...Q.n][0])}</span><em>${esc(Q.era || '')}</em></span><span class="rl">${esc(Q.role)}</span><span class="ln">${esc(Q.line)}</span><span class="cl">${(Q.cells || []).slice(0, 3).map(([k, v]) => `<span><small>${esc(k)}</small>${esc(v)}</span>`).join('')}</span></div><a class="full" href="${pr.href}">الملف الكامل للشخصية</a></div>`;
  };
  const ids = [...N.map((n) => n[0]), ...SONS.map((s) => s[0])];
  return `${header({ back: 'index.html', title: 'شجرة العائلة' })}
<div class="tr3">
<aside class="tr3a"><span class="ey">شجرة العائلة · من آدم إلى أسباط إسرائيل</span><h1>خط الوعد</h1><p>الخط الذهبي يتبع نسل الوعد من آدم إلى يهوذا، كما يرويه سفر التكوين. اضغط أي اسم لترى أين يذكره النص.</p>
<div class="slot" aria-live="polite">${card('abraham')}</div>
<div class="leg"><span><i class="dot" style="background:var(--accent)"></i>له بطاقة شخصية</span><span><i class="gd"></i>خط الوعد</span><span><i class="mr"></i>زواج</span>${Object.values(MOM).map(([m, c]) => `<span><i class="dot" style="background:${c}"></i>أبناء ${m.split(' ')[0]}</span>`).join('')}</div>
<template data-cards>${ids.map((id) => `<div data-card="${id}">${card(id)}</div>`).join('')}</template>
</aside>
<div class="tr3s"><div class="tr3t">
<svg viewBox="0 0 1000 1110" preserveAspectRatio="none" aria-hidden="true">${L.join('')}</svg>
${N.map(node).join('')}${SONS.map(son).join('')}
<span class="tn note" style="${P(sx[3], SY + 100)}">يهوذا ← داود ← المسيح (متى ١)</span>
</div></div>
</div>`;
}
