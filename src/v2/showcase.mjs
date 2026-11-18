// Home showcase: a carousel of the site's parts. Each slide is a short looping animation that shows how that part
// works (a person card that turns over, a chapter study that unfolds, a plan day being ticked, a route being
// travelled, a family line growing). Everything shown comes from the site's own reviewed content.
import fs from 'fs';
import path from 'path';
import { ROOT, ar, esc, verseText, refLabel } from '../lib.mjs';
import { IC, firstSentences } from './ui.mjs';
import { PROFILES } from '../../content/people/profiles.mjs';

const MED = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/med-map.json'), 'utf8'));
const PJ = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/paul-journeys.json'), 'utf8'));
const plain = (s) => String(s || '').replace(/\*\*/g, '');

export function showcase({ content, imgOf, plans }) {
  // 1. people: portrait card that flips to its facts
  const PPL = ['abraham', 'sarah', 'moses', 'joseph', 'peter', 'paul'].map((id) => PROFILES[id]).filter((P) => P && imgOf(P.id));
  const people = `<div class="scp">${PPL.map((P, i) => `<div class="scc${i ? '' : ' on'}"><div class="sci">
<div class="scf"><img src="${imgOf(P.id)}" alt=""><span><b>${esc(P.n)}</b><small>${esc(P.role)}</small></span></div>
<div class="scb"><b>${esc(P.n)}</b><small>${esc(P.role)}</small><p>${esc(P.line)}</p><dl>${P.cells.slice(0, 2).map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl></div>
</div></div>`).join('')}</div>`;

  // 2. study: a chapter page that unfolds step by step (Mark 1)
  const S = content.Mark.chapters[1];
  const study = `<div class="scs"><div class="scsh"><span>مرقس ١</span><b>${esc(plain(S.title))}</b></div>
<p class="scv">${(() => { const v = verseText(S.keyVerse); return /[«»]/.test(v) ? esc(v) : `«${esc(v)}»`; })()}<small>${refLabel(S.keyVerse)}</small></p>
<div class="scn n1"><i>الفكرة</i>${esc(firstSentences(plain(S.summary[0]), 40))}</div>
<div class="scn n2"><i>المسيح في النص</i>${esc(firstSentences(plain(S.christ[0]), 40))}</div>
</div>`;

  // 3. plans: a day being read, steps ticked, progress filling
  const P0 = plans.find((p) => p.id === 'start');
  const steps = ['اقرأ', 'افهم', 'تأمّل', 'طبّق', 'صلِّ'];
  const plan = `<div class="scl"><div class="sclh"><span>${esc(P0.t)}</span><b>اليوم ٣ من ${ar(P0.days.length)}</b><i class="bar"><i></i></i></div>
<ol>${steps.map((s, i) => `<li style="--i:${i}"><i>${IC.check}</i>${esc(s)}</li>`).join('')}</ol><span class="scdone">${IC.check} أنهيت قراءة اليوم</span></div>`;

  // 4. Paul: the first journey drawn on the real map
  const J = PJ[0].stops.map((s) => MED.cities[s.c]);
  const xs = J.map((p) => p[0]), ys = J.map((p) => p[1]);
  const x0 = Math.min(...xs) - 70, y0 = Math.min(...ys) - 60, w = Math.max(...xs) - x0 + 70, h = Math.max(...ys) - y0 + 60;
  const route = 'M' + J.map((p) => p.join(' ')).join(' L');
  const paul = `<div class="scm"><svg viewBox="${x0} ${y0} ${w} ${h}" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect x="${x0 - 50}" y="${y0 - 50}" width="${w + 100}" height="${h + 100}" fill="#C9DCE0"/><path d="${MED.land}" fill="#F1E8D4" stroke="#A3906B" stroke-width=".8" vector-effect="non-scaling-stroke"/>
<path class="rt" d="${route}" pathLength="100"/>${J.map((p, i) => `<circle class="pt" style="--i:${i}" cx="${p[0]}" cy="${p[1]}" r="5"/>`).join('')}</svg>
<div class="scmc"><img src="assets/place-paphos.webp" alt=""><span><b>بافوس</b><small>المحطة ٤: الوالي يؤمن (أع ١٣: ١٢)</small></span></div></div>`;

  // 5. family line: generations appear one by one
  const LINE = ['آدم', 'إبراهيم', 'يعقوب', 'داود', 'يسوع المسيح'];
  const tree = `<div class="sct">${LINE.map((n, i) => `<span style="--i:${i}"${i === LINE.length - 1 ? ' class="end"' : ''}>${esc(n)}</span>`).join('<i></i>')}</div>`;

  const SL = [
    ['people.html', 'الشخصيات', 'تعرّف على شخصيات الكتاب', 'بطاقة لكل شخصية: صورتها، ومعنى اسمها، ودورها. اقلب البطاقة لترى قصتها وأين ظهرت.', people],
    ['book/mark/1.html', 'دراسة الأصحاح', 'افهم الأصحاح خطوة بخطوة', 'الآية المفتاحية، وفكرة الأصحاح، والمسيح في النص، وأسئلة للتأمل، وتطبيق عملي.', study],
    ['plans.html', 'خطط القراءة', 'خلوة يومية في ٢٠ دقيقة', 'اختر خطة وابدأ. كل يوم ثماني خطوات قصيرة، وتكمل من حيث توقفت.', plan],
    ['maps/paul.html', 'رحلات بولس', 'امشِ مع بولس على الخريطة', 'محطة بعد محطة: ماذا حدث، ومن كان هناك، وصورة المكان اليوم.', paul],
    ['tree.html', 'شجرة العائلة', 'نسل الوعد من آدم إلى المسيح', 'نسب المسيح جيلاً بعد جيل، وكل اسم مع الآية التي تذكره.', tree]
  ];
  return `<div class="sctext">${SL.map(([h, k, t, d], i) => `<div class="sctx${i ? '' : ' on'}"><span class="hxk">${esc(k)}</span><h2>${esc(t)}</h2><p>${esc(d)}</p><a class="hxbtn" href="${h}">افتح ${esc(k)} ${IC.chev}</a></div>`).join('')}
<div class="scdots" role="tablist">${SL.map(([, k], i) => `<button type="button" role="tab" aria-selected="${i ? 'false' : 'true'}" aria-label="${esc(k)}"><i></i></button>`).join('')}</div></div>
<div class="scstage">${SL.map(([, , , , html], i) => `<div class="scsl${i ? '' : ' on'}">${html}</div>`).join('')}</div>`;
}
