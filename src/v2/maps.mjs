// Maps: an Ancient Near East plate for Old Testament journeys, and the Roman-world plate for Paul.
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, ar, esc, md, refLabel, refHref } from '../lib.mjs';

const readJSON = (rel) => JSON.parse(fs.readFileSync(path.join(ROOT, rel), 'utf8'));

// ---------- Ancient Near East plate ----------
const P = (lo, la) => [+((lo - 28) * 30).toFixed(1), +((39 - la) * 30).toFixed(1)];
const pth = (pts) => 'M' + pts.map((p) => P(...p).join(' ')).join(' L');
const SEA = [[26, 31.1], [29.9, 31.2], [31.0, 31.6], [31.8, 31.5], [32.3, 31.2], [33.3, 31.1], [34.2, 31.3], [34.6, 31.8], [34.8, 32.1], [34.95, 32.8], [35.1, 33.1], [35.5, 33.9], [35.9, 34.6], [35.8, 35.5], [35.9, 36.2], [36.15, 36.75], [35.6, 36.6], [34.6, 36.8], [33.5, 36.2], [32.5, 36.1], [31.5, 36.6], [30.6, 36.85], [29.5, 36.3], [28.2, 36.7], [26, 37], [26, 41], [24, 41], [24, 30]];
const BLACK = [[29, 41.2], [31, 41.1], [33, 42], [35, 42.1], [36.5, 41.3], [38.5, 40.95], [40, 41], [41.5, 41.5], [41.5, 44], [29, 44]];
const CASPIAN = [[49, 38.4], [48.9, 37.6], [49.5, 37.4], [50.4, 37.1], [51.5, 36.8], [53, 36.9], [54, 37.3], [54, 41], [49, 41]];
const RED = [[32.55, 29.95], [32.75, 29.85], [33.6, 28.1], [34.25, 27.9], [34.95, 29.5], [35.05, 29.4], [34.7, 28.2], [35.6, 26.5], [36.6, 24.5], [34.6, 24.5], [33.7, 26.6], [32.9, 28.4]];
const GULF = [[47.9, 30.0], [48.5, 29.9], [49.5, 29.3], [51, 28], [51, 26], [49.5, 26], [48.6, 28.2], [48.0, 29.3]];
const RIVERS = [
  [[32.9, 24.1], [32.6, 25.7], [32.7, 26.2], [31.2, 27.2], [30.9, 28.5], [31.2, 30.0], [30.6, 30.9], [30.4, 31.4]],
  [[31.2, 30.0], [31.6, 31.0], [31.85, 31.45]],
  [[38.5, 38.6], [38.3, 37.0], [38.0, 36.1], [40.1, 35.3], [41.0, 34.4], [42.4, 33.6], [43.3, 32.6], [44.3, 32.0], [46.0, 31.0], [47.4, 30.5], [48.0, 30.0]],
  [[39.9, 38.4], [42.4, 37.3], [43.1, 36.3], [43.9, 35.0], [44.4, 33.3], [46.0, 32.2], [47.1, 31.0], [47.4, 30.5]],
  [[35.6, 33.2], [35.55, 32.8], [35.55, 32.0], [35.5, 31.75]],
  [[35.75, 32.17], [35.55, 32.14]]
];
const REGIONS = [['البحر المتوسط', 31.6, 33.4, 1.1], ['بلاد ما بين النهرين', 42.6, 34.6, 1, -38], ['البرية العربية', 40.5, 30.4, .9], ['كنعان', 36.15, 31.6, .8], ['مصر', 30.2, 28.6, 1], ['أرام', 38.5, 35.6, .8], ['سيناء', 33.9, 29.4, .8], ['جبال أراراط', 43.6, 39.3, .8]];

const PLACE = {
  ur: [46.1, 30.96], haran: [39.03, 36.87], shechem: [35.28, 32.21], bethel: [35.22, 31.93], negev: [34.8, 30.85], egypt: [31.25, 29.85],
  hebron: [35.1, 31.53], dan: [35.65, 33.25], sodom: [35.45, 31.1], gerar: [34.6, 31.38], beersheba: [34.79, 31.25], moriah: [35.23, 31.78],
  gilead: [35.82, 32.45], peniel: [35.68, 32.18], bethlehem: [35.2, 31.7], goshen: [31.9, 30.75], dothan: [35.22, 32.42], ararat: [44.3, 39.7], babel: [44.42, 32.54]
};

const OT_MAPS = [
  {
    id: 'beginnings', title: 'البدايات', sub: 'من الفلك إلى بابل', book: 'Gen', vb: [270, -60, 330, 340], vh: 700, z: 1,
    note: 'موقع جنة عدن غير معروف. يذكر النص نهري الفرات وحداقل (دجلة) بين أنهارها الأربعة (٢: ١٤).',
    stops: [
      { p: 'ararat', n: 'جبال أراراط', ch: [8], ref: 'Gen.8.4', t: 'استقر الفلك على جبال أراراط، في المنطقة الجبلية بين أرمينيا وشرق تركيا اليوم.' },
      { p: 'babel', n: 'بابل في أرض شنعار', ch: [10, 11], ref: 'Gen.11.9', t: 'بنى الناس مدينة وبرجاً ليصنعوا لأنفسهم اسماً، فبلبل الرب لسانهم وبددهم على وجه كل الأرض.' },
      { p: 'ur', n: 'أور الكلدانيين', ch: [11], ref: 'Gen.11.28', t: 'مدينة سومرية غنية في جنوب العراق. فيها وُلد أبرام، ومات هاران أخوه.' },
      { p: 'haran', n: 'حاران', ch: [11], ref: 'Gen.11.31', t: 'خرج تارح ببيته من أور قاصداً كنعان، فأتوا إلى حاران وأقاموا هناك، ومات تارح فيها.' }
    ]
  },
  {
    id: 'abraham', title: 'رحلة إبراهيم', sub: 'من أور إلى أرض الموعد', book: 'Gen', vb: [70, 30, 520, 280], vh: 760, z: 1,
    stops: [
      { p: 'ur', n: 'أور الكلدانيين', ch: [11], ref: 'Gen.11.31', t: 'نقطة البداية. خرج تارح بأبرام وساراي ولوط من أور ليذهبوا إلى أرض كنعان.' },
      { p: 'haran', n: 'حاران', ch: [11, 12], ref: 'Gen.12.4', t: 'أقاموا فيها حتى مات تارح. ومنها خرج أبرام بدعوة الله وهو ابن خمس وسبعين سنة.' },
      { p: 'shechem', n: 'شكيم', ch: [12], ref: 'Gen.12.6-7', t: 'عند بلوطة مورة ظهر له الرب ووعده بالأرض لنسله، فبنى أول مذبح في كنعان.' },
      { p: 'bethel', n: 'بيت إيل', ch: [12, 13], ref: 'Gen.12.8', t: 'نصب خيمته بين بيت إيل وعاي، وبنى مذبحاً ودعا باسم الرب. وإليها رجع بعد مصر.' },
      { p: 'egypt', n: 'مصر', ch: [12], ref: 'Gen.12.10', t: 'نزل إليها بسبب الجوع، وخاف فقال عن ساراي إنها أخته، فحفظها الله بضربات على بيت فرعون.' },
      { p: 'hebron', n: 'حبرون (ممرا)', ch: [13, 14, 18, 23, 25], ref: 'Gen.13.18', t: 'سكن عند بلوطات ممرا بعد انفصال لوط. هناك زاره الرب (ص ١٨)، وفيها دفن سارة في مغارة المكفيلة (ص ٢٣).' },
      { p: 'dan', n: 'دان', ch: [14], ref: 'Gen.14.14', t: 'تبع الملوك الأربعة حتى دان ليحرر لوط المسبي، وفي رجوعه باركه ملكي صادق ملك شاليم.' },
      { p: 'sodom', n: 'سدوم', ch: [13, 14, 18, 19], ref: 'Gen.19.24', t: 'المدينة التي اختارها لوط. شفع فيها إبراهيم، ثم أمطر الرب عليها كبريتاً وناراً. موقعها غير مؤكد، والأرجح قرب جنوب البحر الميت.' },
      { p: 'gerar', n: 'جرار', ch: [20], ref: 'Gen.20.1-2', t: 'تكرر فيها خوف إبراهيم، فقال عن سارة إنها أخته، وحفظها الله من أبيمالك ملك جرار.' },
      { p: 'beersheba', n: 'بئر سبع', ch: [21, 22], ref: 'Gen.21.31-33', t: 'قطع عهداً مع أبيمالك عند البئر، وغرس أثلاً ودعا هناك باسم الرب الإله السرمدي.' },
      { p: 'moriah', n: 'جبل المريا', ch: [22], ref: 'Gen.22.2', t: 'قدّم إسحاق فأعطاه الله كبشاً عوضاً عنه. وعلى جبل المريا بُني الهيكل لاحقاً (٢ أخ ٣: ١).' }
    ]
  },
  {
    id: 'jacob', title: 'رحلة يعقوب', sub: 'من بئر سبع إلى حاران ثم إلى مصر', book: 'Gen', vb: [90, 40, 300, 250], vh: 430, z: 1,
    stops: [
      { p: 'beersheba', n: 'بئر سبع', ch: [26, 28], ref: 'Gen.28.10', t: 'خرج يعقوب منها هارباً من عيسو بعد أن أخذ البركة، متجهاً إلى بيت خاله لابان.' },
      { p: 'bethel', n: 'بيت إيل', ch: [28, 35], ref: 'Gen.28.19', t: 'رأى في الحلم سلماً منصوبة إلى السماء، وجدد الله له وعد إبراهيم. وإليها رجع بعد عشرين سنة ليبني مذبحاً (ص ٣٥).' },
      { p: 'haran', n: 'حاران', ch: [29, 30, 31], ref: 'Gen.29.4-5', t: 'عشرون سنة عند لابان: تزوج ليئة وراحيل، ووُلد له أحد عشر ابناً وابنة.' },
      { p: 'gilead', n: 'جبل جلعاد', ch: [31], ref: 'Gen.31.25', t: 'أدركه لابان هنا، فقطعا عهداً وأقاما رجمة شهادة سمّاها يعقوب جلعيد.' },
      { p: 'peniel', n: 'فنيئيل عند مخاضة يبوق', ch: [32, 33], ref: 'Gen.32.30', t: 'صارع إنساناً حتى طلوع الفجر، فدعا الله اسمه إسرائيل. وقريباً منها التقى عيسو بسلام.' },
      { p: 'shechem', n: 'شكيم', ch: [33, 34], ref: 'Gen.33.18-20', t: 'اشترى قطعة حقل وبنى مذبحاً دعاه إيل إله إسرائيل. وهنا وقعت حادثة دينة (ص ٣٤).' },
      { p: 'bethlehem', n: 'أفراتة (بيت لحم)', ch: [35, 48], ref: 'Gen.35.19', t: 'ماتت راحيل وهي تلد بنيامين، ودُفنت في طريق أفراتة التي هي بيت لحم.' },
      { p: 'hebron', n: 'حبرون (ممرا)', ch: [35, 37, 50], ref: 'Gen.35.27', t: 'رجع إلى أبيه إسحاق في ممرا. وإلى مغارة المكفيلة هنا حُمل جسده بعد موته (٥٠: ١٣).' },
      { p: 'goshen', n: 'أرض جاسان (مصر)', ch: [46, 47, 49], ref: 'Gen.46.28-29', t: 'نزل بكل بيته إلى مصر، والتقى يوسف بعد سنين طويلة، وسكنوا في جاسان.' }
    ]
  },
  {
    id: 'joseph', title: 'رحلة يوسف', sub: 'من حبرون إلى مصر', book: 'Gen', vb: [60, 160, 210, 150], vh: 300, z: 1,
    stops: [
      { p: 'hebron', n: 'حبرون', ch: [37, 50], ref: 'Gen.37.14', t: 'أرسله أبوه من وادي حبرون ليفتقد سلامة إخوته. وإليها صعد يوسف بعد سنين ليدفن أباه (٥٠: ١٣).' },
      { p: 'shechem', n: 'شكيم', ch: [37], ref: 'Gen.37.12-14', t: 'ذهب إخوته يرعون الغنم عند شكيم، فجاء يوسف إليها ولم يجدهم هناك.' },
      { p: 'dothan', n: 'دوثان', ch: [37], ref: 'Gen.37.17', t: 'وجد إخوته فطرحوه في البئر، ثم باعوه لقافلة إسماعيليين نازلة إلى مصر.' },
      { p: 'egypt', n: 'مصر', ch: [39, 40, 41, 42, 43, 44, 45, 50], ref: 'Gen.41.41', t: 'عبد في بيت فوطيفار، ثم سجين، ثم صار المتسلط على كل أرض مصر، وفيها التقى إخوته.' },
      { p: 'goshen', n: 'أرض جاسان', ch: [46, 47, 48], ref: 'Gen.47.27', t: 'أسكن أباه وإخوته في أفضل أرض مصر، وهناك بارك يعقوب ابنَي يوسف.' }
    ]
  }
];

const THEMES = {
  sand: { land: '#EFE6D3', sea: '#B9CFCB', river: '#8DB1B1', ink: '#3b352c', route: '#8C2F1E', faint: '#8d7f68' },
  navy: { land: '#2D3B5E', sea: '#18223A', river: '#55688F', ink: '#F6EFE3', route: '#D7C49A', faint: '#9AA6C2' }
};

function fitVB(pts, minW, aspect) {
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
  let x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  let w = Math.max(minW, (x1 - x0) * 1.35), h = Math.max(minW / aspect, (y1 - y0) * 1.45);
  if (w / h < aspect) w = h * aspect; else h = w / aspect;
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
  return [+(cx - w / 2).toFixed(1), +(cy - h / 2).toFixed(1), +w.toFixed(1), +h.toFixed(1)];
}

function nePlate(m, theme, { route = true, pins = null, active = [], vb = null, k: kk = null } = {}) {
  const T = THEMES[theme];
  const [x, y, w, h] = vb || m.vb;
  const k = kk || w / 520; // scale relative to the widest map
  const lbl = ([t, lo, la, s, rot]) => { const [px, py] = P(lo, la); return `<text x="${px}" y="${py}" font-size="${(15 * s * k).toFixed(1)}" fill="${T.faint}" font-family="Readex Pro" text-anchor="middle"${rot ? ` transform="rotate(${rot} ${px} ${py})"` : ''}>${t}</text>`; };
  const pts = m.stops.map((s) => P(...PLACE[s.p]));
  const routeD = 'M' + pts.map((p) => p.join(' ')).join(' L');
  let pinSvg = '';
  if (pins) {
    const r = 9 * k + 2;
    pinSvg = m.stops.map((s, i) => {
      const [px, py] = pts[i];
      const on = active.includes(i);
      if (!on && pins === 'active') return `<circle cx="${px}" cy="${py}" r="${(r * 0.35).toFixed(1)}" fill="${T.route}" opacity=".6"/>`;
      return `<g><circle cx="${px}" cy="${py}" r="${r.toFixed(1)}" fill="${T.route}" stroke="${T.land}" stroke-width="${(1.5 * k + .5).toFixed(1)}"/><text x="${px}" y="${(py + r * 0.38).toFixed(1)}" font-size="${(r * 1.05).toFixed(1)}" font-family="Readex Pro" font-weight="600" text-anchor="middle" fill="${theme === 'navy' ? '#17191E' : '#fff'}">${ar(i + 1)}</text></g>`;
    }).join('');
  }
  return `<svg viewBox="${x} ${y} ${w} ${h}" preserveAspectRatio="xMidYMid ${vb ? 'meet' : 'slice'}" role="img" aria-label="${esc(m.title)}">
<rect x="-600" y="-600" width="2000" height="1800" fill="${T.land}"/>
<path d="${pth(SEA)} Z" fill="${T.sea}"/><path d="${pth(BLACK)} Z" fill="${T.sea}"/><path d="${pth(CASPIAN)} Z" fill="${T.sea}"/>
<ellipse cx="${P(33.2, 35.1)[0]}" cy="${P(33.2, 35.1)[1]}" rx="36" ry="11" transform="rotate(-12 ${P(33.2, 35.1).join(' ')})" fill="${T.land}"/>
<path d="${pth(RED)} Z" fill="${T.sea}"/><path d="${pth(GULF)} Z" fill="${T.sea}"/>
<g fill="none" stroke="${T.river}" stroke-width="${(2.2 * k + .4).toFixed(1)}" stroke-linecap="round" stroke-linejoin="round">${RIVERS.map((r) => `<path d="${pth(r)}"/>`).join('')}</g>
<ellipse cx="${P(35.5, 31.5)[0]}" cy="${P(35.5, 31.5)[1]}" rx="3.5" ry="12" fill="${T.sea}"/><ellipse cx="${P(35.58, 32.82)[0]}" cy="${P(35.58, 32.82)[1]}" rx="2.4" ry="4" fill="${T.sea}"/>
${REGIONS.map(lbl).join('')}
${route ? `<path d="${routeD}" fill="none" stroke="${T.route}" stroke-width="${(2.6 * k + .5).toFixed(1)}" stroke-dasharray="${(9 * k + 2).toFixed(1)} ${(6 * k + 2).toFixed(1)}" stroke-linecap="round" stroke-linejoin="round" opacity=".85"/>` : ''}
${pinSvg}</svg>`;
}

// ---------- Paul ----------
const geo = readJSON('data/geo.json');
const PJ = readJSON('data/paul-journeys.json');
const paulBase = readJSON('data/paul-atlas.json').svg;
const paulRef = (s) => {
  const m = /أع\s*(\d+)(?::\s*(\d+)(?:\s*[–-]\s*(\d+)(?!\s*:))?)?/.exec(s);
  if (!m) return null;
  return `Acts.${m[1]}` + (m[2] ? `.${m[2]}` + (m[3] && +m[3] > +m[2] ? `-${m[3]}` : '') : '');
};
const paulChs = (s) => { let nums = [...s.matchAll(/(\d+)\s*:/g)].map((x) => +x[1]); if (!nums.length) nums = [+s.match(/\d+/)[0]]; const a = Math.min(...nums), z = Math.max(...nums); return Array.from({ length: z - a + 1 }, (_, i) => a + i); };
const PAUL = {
  id: 'paul', title: 'رحلات بولس', sub: 'من أنطاكية إلى روما', book: 'Acts', vb: [0, 0, 1000, 560], z: 1, paul: true,
  journeys: PJ.map((j) => ({
    t: j.tab, sub: `${j.title} · ${ar(j.ref)} · ${ar(j.dates)}`,
    stops: j.stops.map((s) => ({ p: s.c, n: s.t, ch: paulChs(s.ref.replace(/أع\s*/, '')), ref: paulRef(s.ref), refText: ar(s.ref), t: s.happened, more: { was: s.was, why: s.why, learn: s.learn, q: s.q, qr: s.qr } }))
  }))
};
for (const m of OT_MAPS) m.journeys = [{ t: m.title, sub: m.sub, stops: m.stops }];
export const MAPS = [...OT_MAPS, PAUL];
export const mapById = Object.fromEntries(MAPS.map((m) => [m.id, m]));

const xy = (m, s) => (m.paul ? geo.cities[s.p].px : P(...PLACE[s.p]));

function paulPlate(m, j, { pins = null, active = [], theme = 'sand', vb = null } = {}) {
  const stops = m.journeys[j].stops;
  const pts = stops.map((s) => xy(m, s));
  const d = 'M' + pts.map((p) => p.join(' ')).join(' L');
  let svg = paulBase.replace('<svg width="100%" height="100%"', '<svg').replace(' style="position: absolute; inset: 0"', '').replace('preserveAspectRatio="xMidYMid meet"', 'preserveAspectRatio="xMidYMid slice"').replace('d="{{otherD}}"', 'd=""').replace('d="{{fullD}}"', 'd=""').replaceAll('d="{{doneD}}"', 'd=""');
  const pinSvg = pins ? pts.map(([px, py], i) => {
    const on = active.includes(i);
    if (!on && pins === 'active') return `<circle cx="${px}" cy="${py}" r="4" fill="#8C2F1E" opacity=".55"/>`;
    return `<g><circle cx="${px}" cy="${py}" r="11" fill="#8C2F1E" stroke="#fff" stroke-width="2"/><text x="${px}" y="${py + 4.2}" font-size="11.5" font-family="Readex Pro" font-weight="600" text-anchor="middle" fill="#fff">${ar(i + 1)}</text></g>`;
  }).join('') : '';
  if (vb) svg = svg.replace('viewBox="0 0 1000 560"', `viewBox="${vb.join(' ')}"`).replace('preserveAspectRatio="xMidYMid slice"', 'preserveAspectRatio="xMidYMid meet"');
  svg = svg.replace(/<\/svg>\s*$/, `<path d="${d}" fill="none" stroke="#8C2F1E" stroke-width="2.4" stroke-dasharray="8 5" stroke-linecap="round" stroke-linejoin="round" opacity=".9"/>${pinSvg}</svg>`);
  return svg;
}

// Which map, journey and stops belong to a chapter.
export function mapForChapter(b, n) {
  let best = null;
  for (const m of MAPS) {
    if (m.book !== b.id) continue;
    m.journeys.forEach((j, ji) => {
      const idx = j.stops.map((s, i) => (s.ch.includes(n) ? i : -1)).filter((i) => i >= 0);
      if (idx.length && (!best || idx.length > best.idx.length)) best = { m, j: ji, idx };
    });
  }
  return best;
}

export function thumb(hit, theme = 'navy', pins = 'all', aspect = 1.45) {
  const { m, j, idx } = hit;
  const stops = m.journeys[j].stops;
  const pts = (idx.length ? idx : stops.map((_, i) => i)).map((i) => xy(m, stops[i]));
  const vb = fitVB(pts, m.paul ? 260 : 150, aspect);
  if (m.paul) return paulPlate(m, j, { pins, active: idx, vb });
  return nePlate(m, theme, { pins, active: idx, vb });
}

export const mapHref = (m, depth) => `${'../'.repeat(depth)}maps/${m.id}.html`;

// Full map viewer: plate + HTML markers + info panel. Data for v2.js lives in a JSON script.
function viewerVB(m) {
  if (m.paul) return m.vb;
  const [x, y, w, h] = m.vb;
  const H = m.vh, W = Math.max(w * 1.15, H * 1.7);
  return [+(x + w / 2 - W / 2).toFixed(1), +(y + h / 2 - H / 2).toFixed(1), +W.toFixed(1), H];
}

export function viewer(m, depth, { back }) {
  const vvb = viewerVB(m);
  const [x, y, w, h] = vvb;
  const plates = m.paul ? m.journeys.map((_, j) => `<div class="plate" data-j="${j}"${j ? ' hidden' : ''}>${paulPlate(m, j)}</div>`).join('') : `<div class="plate" data-j="0">${nePlate(m, 'sand', { vb: vvb, k: h / 640 })}</div>`;
  const data = {
    id: m.id, ar: w / h, z: m.z,
    journeys: m.journeys.map((J) => ({
      t: J.t, sub: J.sub,
      stops: J.stops.map((s) => {
        const [sx, sy] = xy(m, s);
        return {
          n: s.n, x: +((sx - x) / w * 100).toFixed(2), y: +((sy - y) / h * 100).toFixed(2),
          ref: s.refText || (s.ref ? refLabel(s.ref) : ''), href: s.ref ? refHref(s.ref, depth) : '', t: md(s.t),
          more: s.more ? `${s.more.q ? `<q>${md(s.more.q)}</q><span class="mr">${md(s.more.qr)}</span>` : ''}<h5>المكان</h5><p>${md(s.more.was)}</p><h5>لماذا يهمنا</h5><p>${md(s.more.why)}</p><h5>نتعلم</h5><p>${md(s.more.learn)}</p>` : ''
        };
      })
    }))
  };
  return `<div class="mapfull${m.paul ? ' paul' : ''}" id="mapv">
<div class="mtop"><a href="${back}" aria-label="رجوع"><svg class="ic" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg></a><b>${esc(m.title)}</b><button type="button" data-zoom aria-label="تكبير الخريطة"><svg class="ic" viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2M8.5 11h5M11 8.5v5"/></svg></button></div>
<div class="mapv"><div class="pwrap" style="aspect-ratio:${w}/${h}">${plates}<div class="mks"></div></div></div>
${m.journeys.length > 1 ? `<div class="mjs">${m.journeys.map((J, i) => `<button type="button" data-j="${i}" aria-pressed="${i === 0}">${esc(J.t)}</button>`).join('')}</div>` : ''}
<div class="minfo" aria-live="polite"></div>
${m.note ? `<p class="mnote">${md(m.note)}</p>` : ''}
<script type="application/json" id="map-data">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>
</div>`;
}
