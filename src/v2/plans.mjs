// Reading plans: an index page, one page per plan, one page per day, and today.html (continues the reader's plan).
// Every day page is assembled from the chapter's reviewed study and application only (see content/plans.mjs).
import fs from 'fs';
import path from 'path';
import { ROOT, ar, esc, md, bookById, verseText, refLabel, refHref, bible, up } from '../lib.mjs';
import { IC, firstSentences } from './ui.mjs';
import { applyBrief } from './apply.mjs';

const PLANS = (await import(path.join(ROOT, 'content/plans.mjs'))).default;
const PJ = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/paul-journeys.json'), 'utf8'));
export { PLANS };

// chapters of Acts touched by each Paul map stop -> link to that stop
const paulStops = {};
PJ.forEach((j, ji) => j.stops.forEach((s, si) => {
  const nums = [...s.ref.matchAll(/(\d+)\s*:/g)].map((m) => +m[1]);
  const all = nums.length ? nums : [+s.ref.match(/\d+/)[0]];
  for (let c = Math.min(...all); c <= Math.max(...all); c++) (paulStops[c] ||= []).push({ ji, si, n: s.t });
}));

const words = (s) => String(s).split(/\s+/).length;
const plain = (s) => String(s ?? '').replace(/\*\*/g, '');

export function buildPlans({ content, write, page, people, personHref, pimg, topicLinks, explainersFor, explainHref, mapForChapter }) {
  const TL = topicLinks();
  const dayRef = (d) => { const [b, n] = d.split('.'); const B = bookById[b]; if (!B) throw new Error(`plans: unknown book ${b}`); return { B, n: +n }; };
  for (const P of PLANS) {
    if (!/^[a-z0-9-]+$/.test(P.id)) throw new Error(`plans: bad id ${P.id}`);
    for (const d of P.days) {
      const { B, n } = dayRef(d); const S = content[B.id]?.chapters[n];
      if (!S) throw new Error(`plans: ${P.id} ${d} has no study`);
      for (const k of ['where', 'summary', 'keyVerse', 'christ', 'questions']) if (!S[k] || (Array.isArray(S[k]) && !S[k].length)) throw new Error(`plans: ${d} lacks ${k}`);
    }
  }

  const chText = (B, n, S) => {
    const ch = bible(B.id).chapters[n - 1];
    const heads = Object.fromEntries((S.pericopes || []).map((p) => [p.at, p.t]));
    return ch.verses.map((v) => `${heads[v.number] ? `<h4>${esc(heads[v.number])}</h4>` : ''}<span class="rpv"><sup>${ar(v.number)}</sup>${esc(v.text)} </span>`).join('');
  };

  const dayPage = (P, i) => {
    const depth = 2, u = up(depth);
    const { B, n } = dayRef(P.days[i]); const S = content[B.id].chapters[n];
    const total = P.days.length;
    const ch = bible(B.id).chapters[n - 1];
    const mins = Math.max(10, Math.round(ch.verses.reduce((a, v) => a + words(v.text), 0) / 130 + 9));
    const kv = verseText(S.keyVerse);
    const A = applyBrief(B.id, n);
    const ppl = (S.people || []).map((p) => people.byChapterName(B, p.n)).filter(Boolean).filter((p, k, a) => a.indexOf(p) === k).slice(0, 6);
    const chip = (p) => { const im = pimg(p.id, depth); return `<a class="pmp" href="${personHref(p, depth)}">${im ? `<img src="${im}" alt="" loading="lazy">` : `<i>${esc(p.mono)}</i>`}<span>${esc(p.prof ? p.prof.n : p.label)}</span></a>`; };
    const topics = (TL[`${B.id}:${n}`] || []).slice(0, 3);
    const XS = explainersFor(B, n);
    const mp = B.id === 'Acts' ? (paulStops[n] || []).slice(0, 8) : [];
    const om = B.id !== 'Acts' ? mapForChapter(B, n) : null;
    const more = [
      `<a class="plk" href="${u}book/${B.slug}/${n}.html">${IC.read}<span><b>الدراسة الكاملة للأصحاح</b><small>الشرح، والخلفية، والأسئلة الصعبة، والآراء</small></span></a>`,
      ...XS.map((x) => `<a class="plk" href="${explainHref(x, depth)}">${IC.map}<span><b>${esc(x.title)}</b><small>شرح مصوّر</small></span></a>`),
      ...(mp.length ? [`<a class="plk" href="${u}maps/paul.html#j${mp[0].ji + 1}-${mp[0].si + 1}">${IC.map}<span><b>رحلات بولس على الخريطة</b><small>${esc(mp.map((s) => s.n).join('، '))}</small></span></a>`] : []),
      ...(om && om.m && !om.m.paul ? [`<a class="plk" href="${u}maps/${om.m.id}.html">${IC.map}<span><b>${esc(om.m.title)}</b><small>على الخريطة</small></span></a>`] : []),
      ...topics.map(({ t }) => `<a class="plk" href="${u}topics/${t.id}.html">${IC.shelf}<span><b>${esc(t.ar)}</b><small>موضوع كتابي مرتبط بهذا الأصحاح</small></span></a>`)
    ].join('');
    const bg = S.background?.[0], wd = S.words?.[0], vc = S.voices?.[0], hd = S.hard?.[0];
    const deeper = [
      bg ? `<div class="pdx"><h4>هل تعلم؟ ${esc(bg.t)}</h4><p>${md(bg.d)}</p></div>` : '',
      wd ? `<div class="pdx"><h4>كلمة من الأصل: «${esc(wd.w)}» <span dir="ltr" lang="${B.testament === 'ot' ? 'he' : 'el'}">${esc(wd.orig)}</span></h4><p>${md(wd.d)}</p></div>` : '',
      vc ? `<div class="pdx"><h4>من تاريخ الكنيسة: ${esc(vc.n)} <small>(${esc(vc.y)})</small></h4><p>${md(vc.b)}</p><small class="pws">${esc(vc.w)}</small></div>` : '',
      hd ? `<div class="pdx"><h4>سؤال صعب: ${md(hd.q)}</h4>${(hd.a || []).slice(0, 1).map((a) => `<p>${md(a)}</p>`).join('')}<a class="r" href="${u}book/${B.slug}/${n}.html">باقي الإجابة في الدراسة الكاملة</a></div>` : ''
    ].join('');
    const nav = `<nav class="pnav">${i ? `<a href="${i}.html">${IC.back}<span><small>اليوم ${ar(i)}</small>${esc(bookById[dayRef(P.days[i - 1]).B.id].name.replace(/^إنجيل /, ''))} ${ar(dayRef(P.days[i - 1]).n)}</span></a>` : '<span></span>'}${i < total - 1 ? `<a class="rnx" href="${i + 2}.html"><span><small>اليوم ${ar(i + 2)}</small>${esc(dayRef(P.days[i + 1]).B.name.replace(/^إنجيل /, ''))} ${ar(dayRef(P.days[i + 1]).n)}</span>${IC.chev}</a>` : `<a class="rnx" href="../../plans.html"><span><small>انتهت الخطة</small>اختر خطة أخرى</span>${IC.chev}</a>`}</nav>`;
    const body = `<article class="pday" data-plan="${P.id}" data-day="${i + 1}" data-total="${total}">
<header class="rph"><a class="pback" href="../${P.id}.html">${IC.back}<span>${esc(P.t)}</span></a>
<div class="pbar" aria-hidden="true"><i style="width:${Math.round(((i + 1) / total) * 100)}%"></i></div>
<span class="pk">اليوم ${ar(i + 1)} من ${ar(total)}، نحو ${ar(mins)} دقيقة</span>
<h1>${esc(B.name)} ${ar(n)}</h1><p class="pt">${md(S.title)}</p></header>
<section class="rps"><h2><i>١</i>قبل أن تقرأ</h2><p>${md(firstSentences(S.where, 140))}</p></section>
<section class="rps pread"><h2><i>٢</i>اقرأ</h2><p class="pnote">خذ وقتك. اقرأ الأصحاح كله بهدوء، ولاحظ ما يلفت انتباهك.</p><div class="ptext">${chText(B, n, S)}</div></section>
<section class="rps pkv"><h2><i>٣</i>الآية المفتاحية</h2><blockquote>«${esc(kv)}»<cite>${refLabel(S.keyVerse)}</cite></blockquote></section>
<section class="rps"><h2><i>٤</i>فكرة الأصحاح</h2><p>${md(S.summary[0])}</p></section>
<section class="rps"><h2><i>٥</i>المسيح في هذا النص</h2><p>${md(S.christ[0])}</p></section>
<section class="rps"><h2><i>٦</i>تأمّل</h2><ul class="pq">${S.questions.slice(0, 2).map((q) => `<li>${md(q)}</li>`).join('')}</ul></section>
<section class="rps papp"><h2><i>٧</i>طبّق اليوم</h2>${A ? `<h3>${esc(A.t)}</h3><blockquote class="pqs">«${esc(A.q)}»<cite>${refLabel(A.ref)}</cite></blockquote><p><b>من حياتنا الآن:</b> ${esc(A.today)}</p><p><b>اسأل نفسك:</b> ${esc(A.ask)}</p><p class="pstep"><b>خطوة لليوم:</b> ${esc(A.step)}</p><small class="pws">مبني على ${esc(A.by)}</small>` : `<p>${md(S.apply)}</p>`}</section>
<section class="rps ppray"><h2><i>٨</i>صلِّ</h2><p>خذ دقيقتين قبل أن تغلق: اشكر الله على ما أراك في هذا الأصحاح، واعترف بما كشفه فيك، واطلب منه نعمة لتعيش ما فهمته اليوم.</p></section>
${ppl.length ? `<section class="rps"><h2>في هذا الأصحاح</h2><div class="pmps">${ppl.map(chip).join('')}</div></section>` : ''}
<details class="rps pdeep"><summary>لمن يريد أن يتعمّق أكثر</summary>${deeper}</details>
<section class="rps"><h2>اذهب أبعد</h2><div class="plks">${more}</div></section>
<div class="pdone"><button type="button" data-done>${IC.check}<span>أنهيت قراءة اليوم</span></button><p data-done-msg hidden></p></div>
${nav}
</article>`;
    write(`plans/${P.id}/${i + 1}.html`, page({ title: `${P.t} · اليوم ${ar(i + 1)}: ${B.name} ${ar(n)}`, depth, nav: 'plans', body, cls: 'v3 plan', after: `<script src="${u}assets/plans.js" defer></script>` }));
  };

  const planPage = (P) => {
    const depth = 1;
    const list = P.days.map((d, i) => { const { B, n } = dayRef(d); const S = content[B.id].chapters[n]; return `<li><a href="${P.id}/${i + 1}.html" data-day="${i + 1}"><i>${ar(i + 1)}</i><span><b>${esc(B.name)} ${ar(n)}</b><small>${md(S.title)}</small></span><em class="pchk" aria-hidden="true">${IC.check}</em></a></li>`; }).join('');
    const body = `<article class="pplan" data-plan="${P.id}" data-total="${P.days.length}">
<header class="rph"><a class="pback" href="../plans.html">${IC.back}<span>خطط القراءة</span></a><span class="pk">${esc(P.level)}، ${ar(P.days.length)} ${P.days.length <= 10 ? 'أيام' : 'يوماً'}</span><h1>${esc(P.t)}</h1><p class="pt">${esc(P.sub)}</p><p>${esc(P.d)}</p>
<div class="pprog"><div class="pbar"><i data-bar style="width:0%"></i></div><span data-count>لم تبدأ بعد</span></div>
<a class="pgo" data-continue href="${P.id}/1.html">ابدأ اليوم الأول ${IC.chev}</a></header>
<ol class="pdays">${list}</ol>
<p class="pfine">كل يوم مبني من دراسة الأصحاح المراجَعة في الموقع: النص، والفكرة، والمسيح في النص، وأسئلة للتأمل، وتطبيق عملي. يُحفظ تقدّمك على هذا الجهاز فقط.</p>
</article>`;
    write(`plans/${P.id}.html`, page({ title: P.t, depth, nav: 'plans', body, cls: 'v3 plan', after: `<script src="../assets/plans.js" defer></script>` }));
  };

  const card = (P, depth) => `<a class="plcard" href="${up(depth)}plans/${P.id}.html" data-plan="${P.id}" data-total="${P.days.length}"><span class="pk">${esc(P.level)}، ${ar(P.days.length)} ${P.days.length <= 10 ? 'أيام' : 'يوماً'}</span><b>${esc(P.t)}</b><span class="d">${esc(P.sub)}</span><span class="pbar"><i data-bar style="width:0%"></i></span></a>`;
  const indexBody = `<article class="pindex"><header class="rph"><span class="pk">خطط القراءة</span><h1>اقرأ كل يوم، وابنِ عادة</h1><p>اختر خطة واحدة وابدأ. كل يوم أصحاح واحد في نحو ٢٠ دقيقة: تقرأ النص، وتفهم فكرته، وترى المسيح فيه، وتتأمل، وتخرج بخطوة عملية. وإن فاتك يوم، تكمل من حيث توقفت.</p></header>
<div class="rpgrid">${PLANS.map((P) => card(P, 0)).join('')}</div>
<p class="pfine">تقدّمك يُحفظ على هذا الجهاز. <a href="login.html">سجّل الدخول</a> ليُحفظ على كل أجهزتك.</p></article>`;
  write('plans.html', page({ title: 'خطط القراءة', depth: 0, nav: 'plans', body: indexBody, cls: 'v3 plan', after: '<script src="assets/plans.js" defer></script>' }));
  write('today.html', page({ title: 'خلوة اليوم', depth: 0, nav: 'plans', body: `<article class="pindex"><header class="rph"><span class="pk">خلوة اليوم</span><h1 data-today-title>جارٍ فتح قراءة اليوم…</h1><p data-today-text>إن لم تبدأ خطة بعد، اختر واحدة من خطط القراءة.</p><a class="pgo" href="plans.html">خطط القراءة ${IC.chev}</a></header></article>`, cls: 'v3 plan', after: '<script src="assets/plans.js" defer></script>' }));
  for (const P of PLANS) { planPage(P); P.days.forEach((_, i) => dayPage(P, i)); }
  return { card, PLANS };
}
