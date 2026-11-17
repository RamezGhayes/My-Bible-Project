// Paul's journeys as a story map: a real-geography map (data/med-map.json, Natural Earth) beside an ordered
// carousel of cards. Each card is one stop: what happened, the key verse, the place, the people, why it matters,
// a lesson, and the letters tied to it. Moving between cards moves the map.
import fs from 'fs';
import path from 'path';
import { ROOT, ar, esc, bookById, verseText, up } from '../lib.mjs';
import { IC } from './ui.mjs';

const read = (f) => JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8'));
const MED = read('data/med-map.json');
const PJ = read('data/paul-journeys.json');
const EX = read('data/paul-extra.json');

// "أع 13: 6–12" -> "Acts.13.6-12" ; "أع 19" -> "Acts.19" ; "أع 21: 27 – 23: 30" -> "Acts.21.27" (start)
const actsRef = (s) => {
  const m = /أع\s*(\d+)(?::\s*(\d+)(?:\s*[–-]\s*(\d+)(?!\s*:))?)?/.exec(s);
  if (!m) return null;
  return `Acts.${m[1]}` + (m[2] ? `.${m[2]}` + (m[3] && +m[3] > +m[2] ? `-${m[3]}` : '') : '');
};
// short map label for each place (the card title can be longer, like «الرجوع وتثبيت الكنائس»)
const CITY = { antioch: 'أنطاكية', seleucia: 'سلوكية', salamis: 'سلاميس', paphos: 'بافوس', perga: 'برجة', attalia: 'أتالية', pantioch: 'أنطاكية بيسيدية', iconium: 'إيقونية', lystra: 'لسترة', derbe: 'دربة', galatia: 'غلاطية وفريجية', troas: 'ترواس', neapolis: 'نيابوليس', philippi: 'فيلبي', thessalonica: 'تسالونيكي', berea: 'بيرية', athens: 'أثينا', corinth: 'كورنثوس', cenchreae: 'كنخريا', ephesus: 'أفسس', caesarea: 'قيصرية', macedonia: 'مكدونية', assos: 'أسوس', miletus: 'ميليتس', rhodes: 'رودس', tyre: 'صور', ptolemais: 'بتولمايس', sidon: 'صيدا', myra: 'ميرا', fairhavens: 'المواني الحسنة', storm: 'العاصفة', malta: 'مالطة', syracuse: 'سراكوسا', rhegium: 'ريغيون', puteoli: 'بوطيولي', rome: 'روما', jerusalem: 'أورشليم' };
const firstCh = (s) => +/أع\s*(\d+)/.exec(s)[1];
// «...» in authored text stays as is; plain text otherwise.
const txt = (s) => esc(s || '');

export function paulMapPage({ depth, people, imgOf, personHref }) {
  const u = up(depth);
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
  const placeImg = (c) => {
    const f = ['webp', 'jpg'].map((x) => `place-${c}.${x}`).find((x) => fs.existsSync(path.join(ROOT, 'src/v2/assets', x)));
    return f ? `<figure class="pmi"><img src="${u}assets/${f}" alt="" loading="lazy"><figcaption>تصوّر فني للمكان</figcaption></figure>` : '';
  };

  const data = PJ.map((j, ji) => ({
    t: j.tab,
    stops: j.stops.map((s) => { const xy = MED.cities[s.c]; if (!xy) throw new Error(`paul map: no coordinates for ${s.c}`); if (!CITY[s.c]) throw new Error(`paul map: no label for ${s.c}`); return { xy, n: s.t, c: CITY[s.c] }; })
  }));

  const sections = PJ.map((j, ji) => {
    const X = EX.journeys[ji];
    const n = j.stops.length;
    const intro = `<article class="pmc pmc0" data-i="-1">
<div class="pmh"><span class="pmk">${esc(j.title)}</span><h2>${esc(j.tab)}</h2><p class="pmr">${ar(esc(j.ref))} · ${ar(esc(j.dates))} · ${ar(n)} محطة</p></div>
<p class="pml0">${txt(X.intro)}</p>
<div class="pmb"><h3>رفقاء الرحلة</h3><div class="pmps">${X.with.map(pchip).join('')}</div><p class="pmnote">${esc(X.withText)}</p></div>
<ol class="pmlist">${j.stops.map((s, i) => `<li><button type="button" data-go="${i}"><i>${ar(i + 1)}</i>${esc(s.t)}</button></li>`).join('')}</ol>
</article>`;
    const cards = j.stops.map((s, i) => {
      const x = EX.stops[`${ji}.${i}`] || {};
      const ch = firstCh(s.ref);
      const qref = s.qr ? actsRef(s.qr) : null;
      if (s.q && qref && !verseText(qref)) throw new Error(`paul map: bad quote ref ${s.qr}`);
      return `<article class="pmc" data-i="${i}" hidden>
<div class="pmh"><span class="pmk">المحطة ${ar(i + 1)} من ${ar(n)}</span><h2>${esc(s.t)}</h2><p class="pmr"><a href="${u}book/acts/${ch}.html">${ar(esc(s.ref))} · اقرأ الأصحاح ${IC.chev}</a></p></div>
${placeImg(s.c)}
<div class="pmb"><h3>ماذا حدث هنا؟</h3><p>${txt(s.happened)}</p></div>
${s.q ? `<blockquote class="pmq">«${esc(s.q)}»<cite>${ar(esc(s.qr || s.ref))}</cite></blockquote>` : ''}
${s.was ? `<div class="pmb"><h3>المكان</h3><p>${txt(s.was)}</p></div>` : ''}
${x.people?.length ? `<div class="pmb"><h3>مَن هنا؟</h3><div class="pmps">${x.people.map(pchip).join('')}</div></div>` : ''}
${s.why ? `<div class="pmb"><h3>لماذا يهمّ؟</h3><p>${txt(s.why)}</p></div>` : ''}
${s.learn ? `<div class="pmb pmlearn"><h3>لنا اليوم</h3><p>${txt(s.learn)}</p></div>` : ''}
${x.letters?.length ? `<div class="pmb"><h3>رسائل مرتبطة</h3><div class="pmls">${x.letters.map(letter).join('')}</div></div>` : ''}
</article>`;
    }).join('');
    return `<section class="pmj" data-j="${ji}"${ji ? ' hidden' : ''}>${intro}${cards}</section>`;
  }).join('');

  const regions = Object.values(MED.regions).map((r) => `<text class="rg" x="${r.xy[0]}" y="${r.xy[1]}">${esc(r.n)}</text>`).join('');
  const svg = `<svg class="pmsvg" viewBox="0 0 ${MED.W} ${MED.H}" preserveAspectRatio="xMidYMid slice" role="img" aria-label="خريطة شرق البحر المتوسط ورحلات بولس">
<rect class="sea" x="-400" y="-400" width="${MED.W + 800}" height="${MED.H + 800}"/><path class="land" d="${MED.land}"/>${regions}
<g class="routes"></g><g class="pins"></g></svg>`;

  return `<div class="pm" id="pm">
<div class="pmtop"><a class="pmback" href="${u}maps.html" aria-label="الخرائط">${IC.back}</a><h1>رحلات بولس</h1>
<div class="pmtabs" role="tablist">${PJ.map((j, ji) => `<button type="button" role="tab" data-tab="${ji}" aria-selected="${ji ? 'false' : 'true'}">${esc(j.tab)}</button>`).join('')}</div></div>
<div class="pmmap">${svg}<p class="pmsrc">الخريطة: Natural Earth (ملكية عامة). مواقع المدن تقريبية لمواقعها القديمة.</p></div>
<div class="pmpanel">
<div class="pmcards">${sections}</div>
<nav class="pmnav" aria-label="التنقل بين المحطات"><button type="button" data-step="-1" aria-label="السابق">${IC.back}</button><span class="pmcount" aria-live="polite"></span><button type="button" data-step="1" class="pmnext" aria-label="التالي">التالي ${IC.chev}</button></nav>
</div>
<script type="application/json" id="pmdata">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>
</div>
<script src="${u}assets/paulmap.js" defer></script>`;
}
