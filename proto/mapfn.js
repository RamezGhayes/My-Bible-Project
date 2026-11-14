// ---------- map ----------
const P = (lo, la) => [+((lo - 28) * 30).toFixed(1), +((39 - la) * 30).toFixed(1)];
const pth = (pts) => 'M' + pts.map((p) => P(...p).join(' ')).join(' L');
const PLACES = [
  { id: 'ur', n: 'أور الكلدانيين', ll: [46.1, 30.96], d: 'نقطة البداية (تك ١١: ٣١). مدينة سومرية غنية في جنوب العراق، مركز عبادة إله القمر.', prev: true },
  { id: 'haran', n: 'حاران', ll: [39.03, 36.87], d: '' },
  { id: 'shechem', n: 'شكيم', ll: [35.28, 32.21], d: '' },
  { id: 'bethel', n: 'بيت إيل', ll: [35.22, 31.93], d: '' },
  { id: 'negev', n: 'النقب', ll: [34.8, 30.85], d: '' },
  { id: 'egypt', n: 'مصر', ll: [31.25, 29.85], d: '' },
];
for (const p of PLACES) { const f = C.places.find((x) => x.n === p.n); if (f) p.d = f.d; }
function mapSVG({ theme = 'sand', big = false, active = null, labels = true, vb: VB = null, fit = 'slice' } = {}) {
  const T = {
    sand: { land: '#EFE6D3', sea: '#A9C7C5', river: '#7FA9AB', ink: '#3b352c', route: '#C2502D', pin: '#C2502D', halo: '#EFE6D3', faint: '#8d7f68' },
    dark: { land: '#2C4C4A', sea: '#173130', river: '#4F7C79', ink: '#F6EFE3', route: '#F2C14E', pin: '#F2C14E', halo: '#2C4C4A', faint: '#9DB8B4' },
    navy: { land: '#2D3B5E', sea: '#18223A', river: '#55688F', ink: '#F6EFE3', route: '#E2B53E', pin: '#E2B53E', halo: '#2D3B5E', faint: '#9AA6C2' },
  }[theme];
  const sea = [[26, 31.1], [29.9, 31.2], [31.0, 31.6], [31.8, 31.5], [32.3, 31.2], [33.3, 31.1], [34.2, 31.3], [34.6, 31.8], [34.8, 32.1], [34.95, 32.8], [35.1, 33.1], [35.5, 33.9], [35.9, 34.6], [35.8, 35.5], [35.9, 36.2], [36.15, 36.75], [35.6, 36.6], [34.6, 36.8], [33.5, 36.2], [32.5, 36.1], [31.5, 36.6], [30.6, 36.85], [29.5, 36.3], [28.2, 36.7], [26, 37]];
  const red = [[32.55, 29.95], [32.75, 29.85], [33.6, 28.1], [34.25, 27.9], [34.95, 29.5], [35.05, 29.4], [34.7, 28.2], [35.6, 26.5], [36.6, 24.5], [34.6, 24.5], [33.7, 26.6], [32.9, 28.4]];
  const gulf = [[47.9, 30.0], [48.5, 29.9], [49.5, 29.3], [51, 28], [51, 26], [49.5, 26], [48.6, 28.2], [48.0, 29.3]];
  const nile = [[32.9, 24.1], [32.6, 25.7], [32.7, 26.2], [31.2, 27.2], [30.9, 28.5], [31.2, 30.0], [30.6, 30.9], [30.4, 31.4]];
  const nile2 = [[31.2, 30.0], [31.6, 31.0], [31.85, 31.45]];
  const euph = [[38.5, 38.6], [38.3, 37.0], [38.0, 36.1], [40.1, 35.3], [41.0, 34.4], [42.4, 33.6], [43.3, 32.6], [44.3, 32.0], [46.0, 31.0], [47.4, 30.5], [48.0, 30.0]];
  const tig = [[39.9, 38.4], [42.4, 37.3], [43.1, 36.3], [43.9, 35.0], [44.4, 33.3], [46.0, 32.2], [47.1, 31.0], [47.4, 30.5]];
  const jor = [[35.6, 33.2], [35.55, 32.8], [35.55, 32.0], [35.5, 31.75]];
  const r1 = [[46.1, 30.96], [44.3, 32.0], [43.3, 32.6], [41.0, 34.4], [40.1, 35.3], [39.03, 36.87]];
  const r2 = [[39.03, 36.87], [37.2, 36.2], [36.3, 33.5], [35.6, 32.8], [35.28, 32.21], [35.22, 31.93], [34.8, 30.85], [33.8, 30.6], [32.3, 30.5], [31.25, 29.85]];
  const lbl = (txt, lo, la, sz = 14, op = .55, extra = '') => { const [x, y] = P(lo, la); return `<text x="${x}" y="${y}" font-size="${sz}" fill="${T.faint}" opacity="${op}" font-family="Readex Pro" text-anchor="middle" ${extra}>${txt}</text>`; };
  const pins = PLACES.map((p, i) => {
    const [x, y] = P(...p.ll); const a = active === p.id; const r = a ? 15 : 12;
    const lx = p.id === 'bethel' ? x - 20 : p.id === 'shechem' ? x - 20 : x; const ly = p.id === 'bethel' ? y + 16 : p.id === 'shechem' ? y - 12 : y - 20;
    const anchor = (p.id === 'bethel' || p.id === 'shechem') ? 'end' : 'middle';
    return `<g data-pin="${p.id}" style="cursor:pointer">
      <circle cx="${x}" cy="${y}" r="${r + 10}" fill="transparent"/>
      ${a ? `<circle cx="${x}" cy="${y}" r="${r + 7}" fill="${T.pin}" opacity=".25"/>` : ''}
      <circle cx="${x}" cy="${y}" r="${r}" fill="${p.prev ? T.halo : T.pin}" stroke="${T.pin}" stroke-width="2.5"/>
      <text x="${x}" y="${y + 4.5}" font-size="${a ? 14 : 12}" font-family="Readex Pro" font-weight="600" text-anchor="middle" fill="${p.prev ? T.pin : '#fff'}">${ar(i + 1)}</text>
      ${labels ? `<text x="${lx}" y="${ly}" font-size="${a ? 17 : 15}" font-weight="600" font-family="Readex Pro" text-anchor="${anchor}" fill="${T.ink}" stroke="${T.halo}" stroke-width="5" paint-order="stroke">${p.n}</text>` : ''}
    </g>`;
  }).join('');
  const vb = VB || (big ? '40 0 560 420' : '40 20 560 380');
  return `<svg viewBox="${vb}" preserveAspectRatio="xMidYMid ${fit}" style="overflow:visible" role="img" aria-label="خريطة رحلة أبرام">
    <rect x="-400" y="-400" width="1500" height="1300" fill="${T.land}"/>
    <path d="${pth(sea)} Z" fill="${T.sea}"/>
    <ellipse cx="${P(33.2, 35.1)[0]}" cy="${P(33.2, 35.1)[1]}" rx="36" ry="11" transform="rotate(-12 ${P(33.2, 35.1).join(' ')})" fill="${T.land}"/>
    <path d="${pth(red)} Z" fill="${T.sea}"/><path d="${pth(gulf)} Z" fill="${T.sea}"/>
    <g fill="none" stroke="${T.river}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="${pth(nile)}"/><path d="${pth(nile2)}"/><path d="${pth(euph)}"/><path d="${pth(tig)}"/><path d="${pth(jor)}" stroke-width="1.8"/></g>
    <ellipse cx="${P(35.5, 31.5)[0]}" cy="${P(35.5, 31.5)[1]}" rx="3.5" ry="12" fill="${T.sea}"/>
    ${lbl('البحر المتوسط', 31.6, 33.4, 16, .8)}${lbl('بلاد ما بين النهرين', 42.6, 34.6, 14, .7, `transform="rotate(-38 ${P(42.6, 34.6).join(' ')})"`)}${lbl('البرية العربية', 40.5, 30.4, 14, .6)}${lbl('كنعان', 36.2, 32.0, 13, .8)}
    <path d="${pth(r1)}" fill="none" stroke="${T.route}" stroke-width="3" stroke-dasharray="2 7" stroke-linecap="round" opacity=".75"/>
    <path d="${pth(r2)}" fill="none" stroke="${T.route}" stroke-width="3.5" stroke-dasharray="10 7" stroke-linecap="round"/>
    ${pins}
  </svg>`;
}

