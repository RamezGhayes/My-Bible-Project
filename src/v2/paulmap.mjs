// Paul's journeys as an interactive story map: a real-geography map (data/med-map.json, Natural Earth), a step bar
// for the stops, and a horizontal row of short cards. Choosing a stop (card, step, marker, arrows, swipe or Play)
// moves a traveller along the route on the map and opens that stop's card; details open on demand.
import fs from 'fs';
import path from 'path';
import { ROOT, ar, esc, bookById, verseText, up } from '../lib.mjs';
import { IC, firstSentences } from './ui.mjs';

const read = (f) => JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8'));
const MED = read('data/med-map.json');
const PJ = read('data/paul-journeys.json');
const EX = read('data/paul-extra.json');

// "أع 13: 6–12" -> "Acts.13.6-12"
const actsRef = (s) => {
  const m = /أع\s*(\d+)(?::\s*(\d+)(?:\s*[–-]\s*(\d+)(?!\s*:))?)?/.exec(s);
  if (!m) return null;
  return `Acts.${m[1]}` + (m[2] ? `.${m[2]}` + (m[3] && +m[3] > +m[2] ? `-${m[3]}` : '') : '');
};
// short map label for each place (the card title can be longer, like «الرجوع وتثبيت الكنائس»)
const CITY = { antioch: 'أنطاكية', seleucia: 'سلوكية', salamis: 'سلاميس', paphos: 'بافوس', perga: 'برجة', attalia: 'أتالية', pantioch: 'أنطاكية بيسيدية', iconium: 'إيقونية', lystra: 'لسترة', derbe: 'دربة', galatia: 'غلاطية وفريجية', troas: 'ترواس', neapolis: 'نيابوليس', philippi: 'فيلبي', thessalonica: 'تسالونيكي', berea: 'بيرية', athens: 'أثينا', corinth: 'كورنثوس', cenchreae: 'كنخريا', ephesus: 'أفسس', caesarea: 'قيصرية', macedonia: 'مكدونية', assos: 'أسوس', miletus: 'ميليتس', rhodes: 'رودس', tyre: 'صور', ptolemais: 'بتولمايس', sidon: 'صيدا', myra: 'ميرا', fairhavens: 'المواني الحسنة', storm: 'العاصفة', malta: 'مالطة', syracuse: 'سراكوسا', rhegium: 'ريغيون', puteoli: 'بوطيولي', rome: 'روما', jerusalem: 'أورشليم' };
const firstCh = (s) => +/أع\s*(\d+)/.exec(s)[1];
const COLORS = ['#8C2F1E', '#2F5D8C', '#4E7A3A', '#7A4A8C'];

export function paulMapPage({ depth, people, imgOf, personHref }) {
  const u = up(depth);
  const OK = new Set(JSON.parse(fs.readFileSync(path.join(ROOT, 'docs/place-approved.json'), 'utf8')));
  const P = (id) => people.find((p) => p.id === id);
  const pchip = (id) => {
    const p = P(id);
    if (!p) throw new Error(`paul map: unknown person ${id}`);
    const im = imgOf(id, depth);
    return `<a class="pmp" href="${personHref(p, depth)}">${im ? `<img src="${im}" alt="" loading="lazy">` : `<i>${esc(p.mono)}</i>`}<span>${esc(p.prof ? p.prof.n : p.label)}</span></a>`;
  };
  const letter = (l) => {
    const b = bookById[l.b];
    if (!b) throw new Error(`paul map: unknown book ${l.b}`);
    return `<a class="pml" href="${u}book/${b.slug}.html"><b>${esc(b.name)}</b>${l.n ? `<span>${esc(l.n)}</span>` : ''}</a>`;
  };
  // Only images checked by hand against the period are shown (docs/place-approved.json).
  const placeImg = (c) => {
    if (!OK.has(c)) return '';
    const f = ['webp', 'jpg'].map((x) => `place-${c}.${x}`).find((x) => fs.existsSync(path.join(ROOT, 'src/v2/assets', x)));
    return f ? `<figure class="pmi"><img src="${u}assets/${f}" alt="" loading="lazy"><figcaption>تصوّر فني</figcaption></figure>` : '';
  };

  const data = PJ.map((j, ji) => ({
    t: j.tab, col: COLORS[ji],
    stops: j.stops.map((s) => {
      const xy = MED.cities[s.c];
      if (!xy) throw new Error(`paul map: no coordinates for ${s.c}`);
      if (!CITY[s.c]) throw new Error(`paul map: no label for ${s.c}`);
      return { xy, n: s.t, c: CITY[s.c] };
    })
  }));

  const journeys = PJ.map((j, ji) => {
    const X = EX.journeys[ji];
    const n = j.stops.length;
    const intro = `<article class="pmc pmc0" data-i="-1">
<span class="pmk">${esc(j.title)}</span><h2>${esc(j.tab)}</h2>
<p class="pmr">${ar(esc(j.ref))}، ${ar(esc(j.dates))}، ${ar(n)} محطة</p>
<p class="pms">${esc(X.intro)}</p>
<div class="pmps">${X.with.map(pchip).join('')}</div>
<p class="pmnote">${esc(X.withText)}</p>
</article>`;
    const cards = j.stops.map((s, i) => {
      const x = EX.stops[`${ji}.${i}`] || {};
      const ch = firstCh(s.ref);
      const qref = s.qr ? actsRef(s.qr) : null;
      if (s.q && qref && !verseText(qref)) throw new Error(`paul map: bad quote ref ${s.qr}`);
      const short = firstSentences(s.happened, 60);
      const details = [
        short !== s.happened ? `<div class="pmb"><h3>القصة كاملة</h3><p>${esc(s.happened)}</p></div>` : '',
        s.was ? `<div class="pmb"><h3>المكان</h3><p>${esc(s.was)}</p></div>` : '',
        x.people?.length ? `<div class="pmb"><h3>مَن هنا؟</h3><div class="pmps">${x.people.map(pchip).join('')}</div></div>` : '',
        s.why ? `<div class="pmb"><h3>لماذا يهمّ؟</h3><p>${esc(s.why)}</p></div>` : '',
        s.learn ? `<div class="pmb pmlearn"><h3>لنا اليوم</h3><p>${esc(s.learn)}</p></div>` : '',
        x.letters?.length ? `<div class="pmb"><h3>رسائل مرتبطة</h3><div class="pmls">${x.letters.map(letter).join('')}</div></div>` : ''
      ].join('');
      return `<article class="pmc" data-i="${i}">
${placeImg(s.c)}<span class="pmk">المحطة ${ar(i + 1)} من ${ar(n)}</span><h2>${esc(s.t)}</h2>
<p class="pms">${esc(short)}</p>
${s.q ? `<blockquote class="pmq">«${esc(s.q)}»<cite>${ar(esc(s.qr || s.ref))}</cite></blockquote>` : ''}
${details ? `<details class="pmd"><summary>اعرف أكثر</summary>${details}</details>` : ''}
<a class="pmread" href="${u}book/acts/${ch}.html">${ar(esc(s.ref))}: اقرأ الأصحاح ${IC.chev}</a>
</article>`;
    }).join('');
    return `<div class="pmrow" data-j="${ji}"${ji ? ' hidden' : ''}>${intro}${cards}</div>`;
  }).join('');

  const regions = Object.values(MED.regions).map((r) => `<text class="rg" x="${r.xy[0]}" y="${r.xy[1]}">${esc(r.n)}</text>`).join('');
  const svg = `<svg class="pmsvg" viewBox="0 0 ${MED.W} ${MED.H}" preserveAspectRatio="xMidYMid slice" role="img" aria-label="خريطة شرق البحر المتوسط ورحلات بولس">
<defs><pattern id="pmwv" width="28" height="16" patternUnits="userSpaceOnUse"><path d="M0 8q7-5 14 0t14 0" fill="none" stroke="#8FB3BC" stroke-width=".8" opacity=".45"/></pattern>
<filter id="pmsh" x="-5%" y="-5%" width="110%" height="110%"><feDropShadow dx="0" dy="2" stdDeviation="2.5" flood-color="#4F6A66" flood-opacity=".35"/></filter></defs>
<rect class="sea" x="-400" y="-400" width="${MED.W + 800}" height="${MED.H + 800}"/><rect x="-400" y="-400" width="${MED.W + 800}" height="${MED.H + 800}" fill="url(#pmwv)"/>
<path class="coast" d="${MED.land}"/><path class="land" d="${MED.land}" filter="url(#pmsh)"/>${regions}
<g class="routes"></g><g class="pins"></g><g class="trav"><circle r="9"/><circle r="4" class="in"/></g></svg>`;

  const play = '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5l11 7-11 7z" fill="currentColor" stroke="none"/></svg>';
  return `<div class="pm" id="pm">
<div class="pmtop"><a class="pmback" href="${u}maps.html" aria-label="الخرائط">${IC.back}</a><h1>رحلات بولس</h1>
<div class="pmtabs" role="tablist">${PJ.map((j, ji) => `<button type="button" role="tab" data-tab="${ji}" style="--jc:${COLORS[ji]}" aria-selected="${ji ? 'false' : 'true'}"><i></i>${esc(j.tab)}</button>`).join('')}</div></div>
<div class="pmmap">${svg}
<button type="button" class="pmplay" data-play>${play}<span>شاهد الرحلة</span></button>
<p class="pmsrc">الخريطة: Natural Earth. مواقع المدن تقريبية.</p></div>
<div class="pmsteps" aria-label="المحطات"></div>
<div class="pmcards"><button type="button" class="pmarr" data-step="-1" aria-label="السابق">${IC.back}</button><div class="pmtrack">${journeys}</div><button type="button" class="pmarr" data-step="1" aria-label="التالي">${IC.chev}</button></div>
<script type="application/json" id="pmdata">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>
</div>
<script src="${u}assets/paulmap.js" defer></script>`;
}
