// Static site generator (v2 design). Run: node src/build.mjs
import fs from 'node:fs';
import path from 'node:path';
import { PREVIEW, previewSkip, ROOT, config, books, bookById, bookBySlug, bible, ar, esc, md, up, parseRef, refLabel, refHref, bookHref, chapterHref, shortName, verseText, verses } from './lib.mjs';
import { blocks } from './render.mjs';
import { page, header, IC, plain, clip, firstSentences, chWord, bkWord, vWord, secWord, countWord, BRAND } from './v2/ui.mjs';
import { buildPeople, cardTemplate, cleanName } from './v2/people.mjs';
import { paulMapPage } from './v2/paulmap.mjs';
import { studyRefs } from './v2/studyrefs.mjs';
import { buildPlans } from './v2/plans.mjs';
import { buildOverview } from './v2/overview.mjs';
import { booksStrip } from './v2/booksatlas.mjs';
import { MAPS, mapForChapter, thumb, mapHref, viewer } from './v2/maps.mjs';
import { TOPICS, topicLinks, chapterTopicsBlock, topicsIndex, topicPage, topicsHomeSection } from './v2/topics.mjs';
import { treePage } from './v2/tree.mjs';
import { harmonyPage } from './v2/harmony.mjs';
import { glossChapter, glossaryPage } from './v2/glossary.mjs';
import { GLOSSARY } from '../content/glossary.mjs';
import { applySection, APPLY } from './v2/apply.mjs';
import { buildLibrary, libraryPage, workId } from './v2/library.mjs';
import { EXPLAINERS, explainersFor, explainPage, explainPresent, storyCard as xStory, bentoTile as xTile, explainHref, glyph, xCard, chips as xChips } from './v2/explain.mjs';

const DIST = path.join(ROOT, 'dist');
fs.rmSync(DIST, { recursive: true, force: true });
const PAGES = [];
// Social preview images (1200×630), made by scripts/make-og.py and kept in src/v2/assets as og-*.png.
const ogFor = (rel) => { let m, k = 'default'; if ((m = rel.match(/^explain\/([a-z]+)(-present)?\.html$/))) k = 'explain-' + m[1]; else if ((m = rel.match(/^book\/([a-z0-9-]+)(\.html|\/)/))) k = 'book-' + m[1]; else if ((m = rel.match(/^topics\/([a-z0-9-]+)\.html$/))) k = 'topic-' + m[1]; else if (rel === 'tree.html' || rel === 'harmony.html') k = rel.slice(0, -5); return fs.existsSync(path.join(ROOT, 'src/v2/assets', `og-${k}.jpg`)) ? `og-${k}.jpg` : 'og-default.jpg'; };
const write = (rel, html) => { if (rel.endsWith('.html')) { PAGES.push(rel); const url = config.domain + '/' + (rel === 'index.html' ? '' : rel.replace(/index\.html$/, '')); const og = ogFor(rel); html = html.replace('</head>', `<link rel="canonical" href="${url}">\n<meta property="og:url" content="${url}">\n<meta property="og:image" content="${config.domain}/assets/${og}">\n<meta property="og:image:width" content="1200">\n<meta property="og:image:height" content="630">\n</head>`).replace('<meta name="twitter:card" content="summary">', '<meta name="twitter:card" content="summary_large_image">'); } const f = path.join(DIST, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, html); };
const readJSON = (rel) => JSON.parse(fs.readFileSync(path.join(ROOT, rel), 'utf8'));

// ---------- content ----------
const content = {};
for (const slug of fs.readdirSync(path.join(ROOT, 'content/books'))) {
  const dir = path.join(ROOT, 'content/books', slug);
  const b = bookBySlug[slug];
  if (!b) throw new Error('Unknown book folder: ' + slug);
  const c = { intro: null, chapters: {}, deep: {} };
  if (fs.existsSync(path.join(dir, 'intro.mjs'))) c.intro = (await import(path.join(dir, 'intro.mjs'))).default;
  if (fs.existsSync(path.join(dir, 'chapters'))) {
    for (const f of fs.readdirSync(path.join(dir, 'chapters')).filter((f) => f.endsWith('.mjs'))) c.chapters[+f.replace('.mjs', '')] = (await import(path.join(dir, 'chapters', f))).default;
  }
  if (fs.existsSync(path.join(dir, 'deep'))) {
    for (const f of fs.readdirSync(path.join(dir, 'deep')).filter((f) => f.endsWith('.mjs'))) c.deep[+f.replace('.mjs', '')] = (await import(path.join(dir, 'deep', f))).default;
  }
  content[b.id] = c;
}
const TLINKS = topicLinks();
const study = (b, n) => content[b.id]?.chapters[n];
const deepOf = (b, n) => content[b.id]?.deep?.[n];
const studiedCount = (b) => Object.keys(content[b.id]?.chapters || {}).length;
const isFull = (b) => content[b.id]?.intro && studiedCount(b) === b.chapters;
const T_NAME = { ot: 'العهد القديم', nt: 'العهد الجديد' };
const arr = (x) => (x == null ? [] : Array.isArray(x) ? x : [x]);
const chTitle = (b, n) => `${shortName(b)} ${ar(n)}`;
const prevOf = (b, n) => (n > 1 ? { b, n: n - 1 } : b.order > 1 ? { b: books[b.order - 2], n: books[b.order - 2].chapters } : null);
const nextOf = (b, n) => (n < b.chapters ? { b, n: n + 1 } : b.order < 66 ? { b: books[b.order], n: 1 } : null);
const quoteText = (ref) => { const t = verseText(ref).replace(/[.،:؛,]\s*$/, ''); return t; };
// the site's verse, without a psalm title (superscription) if the range starts at verse 1
const mainVerse = () => quoteText(config.verseRef).replace(/^مَزْمُورٌ[^،.]*?يَهُوذَا\s+/, '');
const firstRef = (r) => arr(r)[0];

// ---------- assets ----------
fs.mkdirSync(path.join(DIST, 'assets'), { recursive: true });
// illustrated scenes for people, where one exists (src/v2/assets/person-<id>.svg)
// person-<id>.webp (photo-style image) wins over person-<id>.svg (drawn trial); PIMG: id -> file name
const PIMG = new Map();
for (const f of fs.readdirSync(path.join(ROOT, 'src/v2/assets')).sort((a, b) => (a.endsWith('.svg') ? 0 : 1) - (b.endsWith('.svg') ? 0 : 1))) { const m = f.match(/^person-(.+)\.(svg|webp|jpg)$/); if (m) PIMG.set(m[1], f); }
// some people appear under two page ids (e.g. «يثرون» and «رعوئيل»): share one portrait
for (const [a, b] of Object.entries(JSON.parse(fs.readFileSync(path.join(ROOT, 'docs/portrait-alias.json'), 'utf8')))) if (!PIMG.has(a) && PIMG.has(b)) PIMG.set(a, PIMG.get(b));
// portrait of a person at a given page depth, and a card template that shows it
const pimgSrc = (p, depth) => (PIMG.has(p.id) ? `${'../'.repeat(depth)}assets/${PIMG.get(p.id)}` : '');
const cardWithImg = (p, depth) => {
  const src = pimgSrc(p, depth);
  if (src) { p.img = src; p.imgCredit = PIMG.get(p.id).endsWith('.svg') ? 'رسم توضيحي (تجريبي)' : 'صورة تخيلية'; }
  const html = cardTemplate(p, {});
  delete p.img; delete p.imgCredit;
  return html;
};
for (const f of fs.readdirSync(path.join(ROOT, 'src/v2/assets'))) fs.copyFileSync(path.join(ROOT, 'src/v2/assets', f), path.join(DIST, 'assets', f));

const PEOPLE = buildPeople(books, content);
// The preview artifact holds at most 512 files, so it keeps full pages only for curated people.
const hasPage = (p) => !PREVIEW || !!p.prof;
const personHref = (p, depth) => (hasPage(p) ? `${up(depth)}people/${p.id}.html` : `${up(depth)}book/${p.apps[0].b.slug}/${p.apps[0].n}.html#p-${p.id}`);

// ---------- intro + home (redesign Nov 2026: three calm zones) ----------
const ARW = '<span class="arw" aria-hidden="true">←</span>';
const BACK = '<span class="arw" aria-hidden="true">→</span>';
// The welcome shown on a first visit only (v5.js decides, localStorage "sola.intro"). Same look as the old splash.
function introOverlay(ps) {
  return `<div id="intro5" class="i5" hidden role="dialog" aria-modal="true" aria-labelledby="i5t">
<svg class="i5r" viewBox="0 0 900 900" aria-hidden="true"><circle cx="450" cy="450" r="440"/><circle cx="450" cy="450" r="360" stroke-dasharray="2 10"/><circle cx="450" cy="450" r="280"/></svg>
<div class="i5in">
<div class="wm" id="i5t">${BRAND}<span>${esc(config.nameAr)}</span></div>
<p class="vs">${esc(ps)}</p><div class="rf">${refLabel(config.verseRef)}</div>
<p class="i5l">مكان هادئ لتقرأ الكتاب المقدس وتفهمه، من منظور مُصلَح. اختر كيف تبدأ:</p>
<div class="i5w">
<button type="button" data-i5-mode="qt"><span class="k">كل يوم</span><b>الخلوة اليومية</b><small>أصحاح في نحو ٢٠ دقيقة: النص، والآية المفتاحية، والتأمل، والصلاة.</small><span class="i5g">ابدأ بالخلوة ${IC.chev}</span></button>
<button type="button" data-i5-mode="ds"><span class="k">آية بآية</span><b>الدراسة المعمّقة</b><small>الكلمات الأصلية، والخلفية، والعهد القديم، والمسيح في النص، وآراء المفسرين.</small><span class="i5g">ابدأ بالدراسة ${IC.chev}</span></button>
</div>
<button type="button" class="i5skip" data-i5-go>تصفّح الموقع أولاً</button>
</div></div>`;
}
function home() {
  const ps = mainVerse();
  const words = ps.split(/\s+/);
  const studiedIn = (t) => books.filter((b) => b.testament === t).reduce((n, b) => n + studiedCount(b), 0);
  const tcard = (t, d) => { const list = books.filter((b) => b.testament === t); const ch = list.reduce((n, b) => n + b.chapters, 0); const st = studiedIn(t); return `<a class="h3t" href="${t}.html"><b>${T_NAME[t]}</b><span class="d">${d}</span><span class="mt"><span>${bkWord(list.length)} · ${chWord(ch)} · ${st === ch ? 'كلها مدروسة' : `${ar(st)} مدروساً`}</span><span class="go">افتح ${IC.chev}</span></span></a>`; };
  const start = PLANS_UI.PLANS.find((P) => P.id === 'start');
  const S5 = (k, t, d, inner, more, tone) => `<section class="hs4 hxx${tone ? ' ' + tone : ''}"><div class="hs4w"><header class="hs4h"><span>${k}</span><h2>${t}</h2>${d ? `<p>${d}</p>` : ''}</header>${inner}${more ? `<a class="hs4m" href="${more[0]}">${more[1]} ${IC.chev}</a>` : ''}</div></section>`;
  const body = `${introOverlay(ps)}
<section class="h3hero full">
<svg class="rings" viewBox="0 0 900 900" aria-hidden="true"><circle cx="450" cy="450" r="440"/><circle cx="450" cy="450" r="360" stroke-dasharray="2 10"/><circle cx="450" cy="450" r="280"/></svg>
<div class="in">
<span class="mark">${BRAND}</span>
<p class="v" lang="ar">${words.map((w, i) => `<span style="--d:${(0.3 + i * 0.09).toFixed(2)}s">${esc(w)} </span>`).join('')}</p>
<small class="rf" style="--d:${(0.5 + words.length * 0.09).toFixed(1)}s">${refLabel(config.verseRef)}</small>
<button type="button" class="hs" data-search style="--d:${(0.8 + words.length * 0.09).toFixed(1)}s">${IC.search}<span>ابحث عن سفر، أو شاهد مثل يو ٣: ١٦، أو شخصية، أو موضوع</span><b>ابحث</b></button>
</div></section>
${S5('كل يوم', 'خلوة اليوم', 'أصحاح واحد في نحو ٢٠ دقيقة: تقرأ، وتفهم، وتتأمل، وتصلي.', `<a class="htc" data-today-card hidden href="plans.html"><span class="pk">تابع من حيث توقفت</span><b data-today-name></b><span data-today-day></span><span class="go">اقرأ الآن ${IC.chev}</span></a>
<a class="htc" data-today-start href="plans/start/1.html"><span class="pk">ابدأ من هنا · ${ar(start.days.length)} أيام</span><b>${esc(start.t)}</b><span>${esc(start.sub)}</span><span class="go">ابدأ اليوم الأول ${IC.chev}</span></a>
<div hidden>${PLANS_UI.PLANS.map((P) => PLANS_UI.card(P, 0)).join('')}</div>`, ['plans.html', 'كل خطط القراءة'])}
${S5('سفراً بعد سفر', 'ادرس الكتاب المقدس', 'مقدمة لكل سفر، ودراسة لكل أصحاح، وتطبيق عملي.', `<div class="h3tg">${tcard('ot', 'من الخلق إلى الأنبياء: الوعد والانتظار.')}${tcard('nt', 'المسيح، والكنيسة، والرجاء الأخير.')}</div>`)}
${S5('في لمحة', 'الكتاب كله في صفحة واحدة', 'ستة وستون سفراً، وقصة واحدة.', `<div class="hob">${booksStrip(0)}<div class="ft"><span>التكوين</span><span>الرؤيا</span></div></div>`, ['overview/books.html', 'تصفّح الأسفار'])}
${S5('بالصور والخرائط', 'افهم ما تقرأ', 'أماكن وأشخاص وأحداث، مرسومة ومشروحة لتراها بعينك.', `<div class="hxtiles x3">${[
    ['maps/paul.html', 'place-ephesus', 'رحلات بولس', 'على الخريطة، محطة بعد محطة', 'big'],
    ['people.html', 'person-abraham', 'الشخصيات', 'وجوه وقصص من الكتاب'],
    ['journey.html', 'person-moses', 'القصة في مراحل', 'تاريخ الفداء على خط واحد']
  ].map(([h, img, b, s, c]) => `<a class="hxt${c ? ' ' + c : ''}" href="${h}"><img src="assets/${img}.webp" alt=""><span><b>${b}</b><small>${s}</small></span></a>`).join('')}</div>`, ['explore.html', 'كل الأدوات في «استكشف»'], 'soft')}
<footer class="h3f full"><div><p class="s">${esc(quoteText('2Tim.3.16'))}</p><small>${refLabel('2Tim.3.16')}</small><span>${esc(config.description)} · النص: ${esc(config.bibleVersion)}</span><button type="button" data-i5-again>شاهد المقدمة مرة أخرى</button></div></footer>`;
  write('index.html', page({ title: '', depth: 0, nav: 'home', body, cls: 'home v3', head: '<link rel="stylesheet" href="assets/ovbooks.css">', after: '<script src="assets/plans.js" defer></script>' }));
}
// ---------- hubs: «الكتاب المقدس» and «استكشف» ----------
function hubs() {
  const tcard = (t, d) => { const list = books.filter((b) => b.testament === t); const ch = list.reduce((n, b) => n + b.chapters, 0); return `<a class="h3t" href="${t}.html"><b>${T_NAME[t]}</b><span class="d">${d}</span><span class="mt"><span>${bkWord(list.length)} · ${chWord(ch)}</span><span class="go">افتح ${IC.chev}</span></span></a>`; };
  write('bible.html', page({ title: 'الكتاب المقدس', depth: 0, nav: 'bible', cls: 'v3 v5hub', body: `<section class="hub5h"><a class="back5" href="index.html">${BACK} العودة إلى الرئيسية</a><h1>الكتاب المقدس</h1><p>اختر العهد، ثم السفر، ثم الأصحاح.</p>
<div class="h3tg bib5">${tcard('ot', 'من الخلق إلى الأنبياء: الوعد والانتظار.')}${tcard('nt', 'المسيح، والكنيسة، والرجاء الأخير.')}</div>
<a class="ov-cta" href="overview.html"><span><small>ابدأ من هنا إن كنت جديداً</small><b>نظرة عامة على الكتاب المقدس</b><span>الأسفار الستة والستون في صفحة تفاعلية، ثم القصة كلها في صفحات قصيرة مصوّرة: العصور، والشخصيات، والأنبياء، وما بين العهدين، وحياة المسيح.</span></span>${IC.chev}</a></section>` }));
  const items = [
    ['overview.html', IC.time, 'نظرة عامة على الكتاب المقدس', 'الأسفار الستة والستون، والقصة كلها في صفحات مصوّرة.'],
    ['people.html', IC.person, 'الشخصيات', 'بطاقة لكل شخص في الأصحاحات المدروسة.'],
    ['maps.html', IC.map, 'الخرائط والشروح', 'المسكن، والضربات، ويوم الكفارة، والخروج.'],
    ['maps/paul.html', IC.map, 'رحلات بولس', 'خريطة تفاعلية، محطة بعد محطة.'],
    ['journey.html', IC.time, 'القصة في مراحل', 'تاريخ الفداء على خط واحد.'],
    ['tree.html', IC.web, 'شجرة العائلة', 'نسب المسيح من آدم.'],
    ['topics.html', IC.list, 'الموضوعات', 'العقائد الكتابية بترتيب وستمنستر.'],
    ['glossary.html', IC.read, 'القاموس', 'كلمات فاندايك الصعبة، بمصدرها.'],
    ['harmony.html', IC.shelf, 'الأناجيل جنباً إلى جنب', 'حدث واحد في الأناجيل الأربعة.'],
    ['library.html', IC.col, 'المكتبة', 'كتب ومراجع مُصلَحة للتوسع.']
  ];
  write('explore.html', page({ title: 'استكشف', depth: 0, nav: 'explore', cls: 'v3 v5hub', body: `<section class="hub5h"><a class="back5" href="index.html">${BACK} العودة إلى الرئيسية</a><h1>استكشف</h1><p>أدوات تساعدك على رؤية الكتاب كله: أشخاصه، وأماكنه، وعقائده.</p>
<div class="ex5">${items.map(([h, e, b, d]) => `<a href="${h}"><span class="e">${e}</span><span><b>${b}</b><small>${d}</small></span><span class="g5">${IC.chev}</span></a>`).join('')}</div></section>` }));
}

// ---------- testaments: books carousel ----------
function testament(t) {
  const list = books.filter((b) => b.testament === t);
  const groups = [...new Set(list.map((b) => b.groupName))];
  const chs = list.reduce((a, b) => a + b.chapters, 0);
  const card = (b) => { const st = isFull(b) ? '<i class="s5 f" title="دراسة كاملة"></i>' : studiedCount(b) ? '<i class="s5 p" title="دراسة جارية"></i>' : ''; return `<a class="bk5" href="book/${b.slug}.html" id="b-${b.slug}"><b>${esc(shortName(b))}</b><small>${chWord(b.chapters)}</small>${st}</a>`; };
  const body = `<section class="bk3h hd5"><svg class="rings" viewBox="0 0 760 760" aria-hidden="true"><circle cx="380" cy="380" r="370"/><circle cx="380" cy="380" r="290" stroke-dasharray="2 10"/></svg><div class="in"><a class="back5 lt" href="bible.html">${BACK} العودة إلى الكتاب المقدس</a><span class="ey">${bkWord(list.length)} · ${chWord(chs)}</span><h1>${T_NAME[t]}</h1><p class="lg5"><span><i class="s5 f"></i>دراسة كاملة</span><span><i class="s5 p"></i>دراسة جارية</span><span><i class="s5"></i>النص متاح</span></p></div></section>
<div class="z5 bkl5">${groups.map((g) => `<section class="grp5"><h2>${esc(g)}</h2><div class="bkg5">${list.filter((b) => b.groupName === g).map(card).join('')}</div></section>`).join('')}</div>`;
  write(`${t}.html`, page({ title: T_NAME[t], depth: 0, nav: t, body, cls: 'v3 v5hub' }));
}

// ---------- book: chapters carousel ----------
function personChips(S, b) {
  const names = [];
  for (const p of S.people || []) { const n = cleanName(p.n, b.testament, b.id); if (n && !names.includes(n)) names.push(n); if (names.length === 3) break; }
  return names;
}
function bookPage(b) {
  const c = content[b.id];
  const skip = previewSkip(b);
  const I = c?.intro;
  const TG = { agreed: 'متفق عليه', likely: 'راجح', debated: 'مختلف عليه' };
  const PC = ['#8C2F1E', '#A8584A', '#B39459', '#4E5D32', '#1F2A44', '#4B3D63', '#7A6232', '#34496B'];
  const href = (n) => (skip ? '#' : `${b.slug}/${n}.html`);
  const vs = bible(b.id).chapters;
  const cards = vs.map((ch, i) => {
    const n = i + 1;
    const S = study(b, n);
    const href = skip ? '#' : `${b.slug}/${n}.html`;
    if (S) {
      const kv = firstRef(S.keyVerse);
      return `<a class="cc" href="${href}" data-i="${i}" data-key="${b.id}:${n}" data-sec="${esc(plain(S.section).replace(/\s*\([^)]*\)/g, ''))}">
<div class="k"><span>الأصحاح</span><span data-stat></span></div>
<div class="num">${ar(n)}</div>
<h3>${md(S.title)}</h3>
<p>${esc(firstSentences(S.summary?.[0] || S.where, 110))}</p>
<div class="pchips">${personChips(S, b).map((p) => `<span>${esc(p)}</span>`).join('')}</div>
${kv ? `<div class="kv2"><div class="s">${esc(quoteText(kv))}</div><small>${refLabel(kv)}</small></div>` : ''}
<div class="ft"><span>${vWord(ch.verses.length)}</span><span class="go">اقرأ ${IC.chev}</span></div></a>`;
    }
    return `<a class="cc" href="${href}" data-i="${i}" data-key="${b.id}:${n}" data-sec="">
<div class="k"><span>الأصحاح</span><span data-stat></span></div>
<div class="num">${ar(n)}</div>
<h3 style="font-family:var(--ui);font-weight:400;font-size:13px;color:var(--faint)">${skip ? 'النص في النسخة الكاملة من الموقع' : 'النص متاح · الدراسة قيد الإعداد'}</h3>
<p style="font-family:var(--nas);font-size:16.5px;line-height:1.95">${esc(clip(ch.verses.slice(0, 3).map((v) => v.text).join(' '), 200))}</p>
<div class="ft" style="margin-top:auto"><span>${vWord(ch.verses.length)}</span><span class="go">اقرأ ${IC.chev}</span></div></a>`;
  }).join('');
  // sections of the book, from the chapters' own section labels
  const parts = [];
  for (let n = 1; n <= b.chapters; n++) { const S = study(b, n); const lab = S ? plain(S.section).replace(/\s*\([^)]*\)\s*$/, '') : ''; const last = parts[parts.length - 1]; if (last && last.t === lab) last.z = n; else parts.push({ t: lab, a: n, z: n }); }
  const hasMap = parts.length > 1 || !!parts[0]?.t;
  const first = bible(b.id).chapters[0].verses[0].text;
  const facts = I ? I.facts.slice(0, 4) : [];
  const hero = `<section class="bk3h hd5"><svg class="rings" viewBox="0 0 760 760" aria-hidden="true"><circle cx="380" cy="380" r="370"/><circle cx="380" cy="380" r="290" stroke-dasharray="2 10"/></svg><div class="in">
<a class="back5 lt" href="../${b.testament}.html#b-${b.slug}">${BACK} العودة إلى ${T_NAME[b.testament]}</a>
<div class="bkr5"><div class="tx"><span class="ey">${esc(b.groupName)} · السفر ${ar(b.order)} من ٦٦</span><h1>${esc(shortName(b))}</h1><p class="v">${esc(first)}<small>${refLabel(`${b.id}.1.1`)}</small></p>${I ? `<p class="s">${esc(firstSentences(I.summary, 150))}</p>` : '<p class="s">النص كاملاً متاح الآن، أصحاحاً أصحاحاً. والمقدمة والدراسة لهذا السفر قيد الإعداد.</p>'}</div>
<aside class="fx5"><dl>${facts.map((f) => `<div><dt>${esc(f.k)}</dt><dd>${md(f.v)}</dd></div>`).join('')}<div><dt>الأصحاحات</dt><dd>${chWord(b.chapters)}${studiedCount(b) ? ` · ${studiedCount(b) === b.chapters ? 'كلها مدروسة' : `${ar(studiedCount(b))} مدروساً`}` : ''}</dd></div></dl>
<a class="go5" data-start href="${href(1)}">ابدأ القراءة من الأصحاح الأول ${ARW}</a></aside></div>
${hasMap ? `<div class="map"><small>أقسام السفر · عرض كل قسم يتبع عدد أصحاحاته</small><div class="mbar">${parts.map((q, i) => `<a href="#c${q.a}" style="flex:${q.z - q.a + 1};--c:${PC[i % PC.length]};--d:${(0.4 + i * 0.1).toFixed(2)}s" title="${esc(q.t)}"></a>`).join('')}</div><div class="mlb">${parts.map((q) => `<span style="flex:${q.z - q.a + 1}"><b>${esc(q.t || 'بلا دراسة بعد')}</b><em>${ar(q.a)}${q.z > q.a ? '–' + ar(q.z) : ''}</em></span>`).join('')}</div></div>` : ''}
</div></section>`;
  const hasDeep = Object.keys(c?.deep || {}).length > 0;
  const modes = `<section class="mode5" aria-label="اختر طريقة القراءة"><div class="mode5h"><h2>اختر طريقة القراءة</h2><p>تتغير الأقسام التي تراها في كل أصحاح، ويُحفظ اختيارك.</p></div><div class="mode5g" role="radiogroup">
<button type="button" class="mc5 qt" role="radio" data-mode-pick="qt" aria-checked="true"><span class="e">${IC.read}</span><span class="t"><b>وضع الخلوة اليومية <small>(٢٠ دقيقة)</small></b><span class="d">قراءة مركّزة + الآية المفتاحية + تأمل وتطبيق + صلاة</span></span><span class="b5">مُفعّل حالياً</span></button>
<button type="button" class="mc5 ds" role="radio" data-mode-pick="ds" aria-checked="false"><span class="e">${IC.list}</span><span class="t"><b>وضع الدراسة المعمّقة</b><span class="d">النص الكامل + الفكرة الرئيسية + المسيح في النص + الخرائط والشروح</span></span><span class="b5">مُفعّل حالياً</span></button>
</div>${hasDeep ? '' : '<p class="note5">الشرح آية بآية لهذا السفر قيد الإعداد. في وضع الدراسة المعمّقة ستجد كل ما هو متاح من الدراسة الحالية.</p>'}</section>`;
  const chCard = (n) => { const S = study(b, n); return S ? `<a class="cr5" href="${href(n)}" data-key="${b.id}:${n}"><em>${ar(n)}</em><span>${md(S.title)}</span></a>` : `<a class="cr5 no" href="${href(n)}" data-key="${b.id}:${n}"><em>${ar(n)}</em><span>النص فقط</span></a>`; };
  const grid = hasMap
    ? `<section class="chs5"><h2>الأصحاحات</h2>${parts.map((q, i) => `<div class="pt5" id="p${i + 1}" style="--c:${PC[i % PC.length]}"><h3><span>${esc(q.t || 'أصحاحات بلا دراسة بعد')}</span><small>${q.z > q.a ? `الأصحاحات ${ar(q.a)}–${ar(q.z)}` : `الأصحاح ${ar(q.a)}`}</small></h3><div class="crg5">${Array.from({ length: q.z - q.a + 1 }, (_, k) => chCard(q.a + k)).join('')}</div></div>`).join('')}</section>`
    : `<section class="chs5"><h2>الأصحاحات</h2><div class="chg5">${bible(b.id).chapters.map((_, i) => `<a href="${href(i + 1)}" data-key="${b.id}:${i + 1}">${ar(i + 1)}</a>`).join('')}</div></section>`;
  const about = I ? `<section class="ab5"><h2>تعرّف على السفر</h2>
<details class="acc acc5"><summary><span class="ai">${IC.read}</span><span class="at"><b>نبذة عن السفر والكاتب</b><small>الملخص، والحقائق، وأين يقع في القصة</small></span><span class="ar" aria-hidden="true">${IC.chev}</span></summary><div class="acc5b">
<p class="lead5">${md(I.summary)}</p>
<dl class="facts5">${I.facts.map((f) => `<div><dt>${esc(f.k)}${f.tag && TG[f.tag] ? ` <em class="t-${f.tag}">${TG[f.tag]}</em>` : ''}</dt><dd>${md(f.v)}</dd></div>`).join('')}</dl>
${I.context ? `<div class="ctx5">${[['before', 'قبله'], ['now', 'هذا السفر'], ['after', 'بعده']].map(([k, l]) => { const x = I.context[k]; if (!x) return ''; const inner = `<small>${l}</small><b>${md(x.t)}</b>`; return x.href ? `<a href="${up(1)}${x.href}">${inner}</a>` : `<div class="now">${inner}</div>`; }).join('')}</div>` : ''}
</div></details>
<details class="acc acc5"><summary><span class="ai">${IC.list}</span><span class="at"><b>مقدمة السفر في ${secWord(I.sections.length)}</b><small>${I.sections.slice(0, 3).map((x) => esc(plain(x.short || x.title || ''))).join('، ')}...</small></span><span class="ar" aria-hidden="true">${IC.chev}</span></summary><div class="acc5b">
<ol class="secs5">${I.sections.map((x, i) => `<li><a href="${b.slug}/about.html#sec${i + 1}"><em>${ar(i + 1)}</em><span>${md(x.title || x.t || '')}</span>${ARW}</a></li>`).join('')}</ol>
</div></details></section>` : '';
  const carousel = `<section class="bk3s bk3ch"><h2>الأصحاحات</h2><p>اسحب البطاقات، أو اختر رقماً.</p></section>
<div class="secl" id="secl"></div>
<div class="car" id="car" data-kind="chapters" data-book="${b.id}" data-total="${b.chapters}">${cards}</div>
<div class="scrub" id="scrub">${vs.map((_, i) => `<button type="button" data-jump="${i}" data-key="${b.id}:${i + 1}">${ar(i + 1)}</button>`).join('')}</div>`;
  const body = `${hero}<div class="z5 bk5p bk5top">${modes}</div>${carousel}<div class="z5 bk5p">${about}</div>`;
  write(`book/${b.slug}.html`, page({ title: b.name, depth: 1, nav: b.testament, body, cls: 'v3 bk3 v5hub v5book' }));
}

// ---------- book introduction (about) ----------
function aboutPage(b) {
  const I = content[b.id].intro;
  const depth = 2;
  const ctx = { depth, book: b };
  const S = I.sections;
  const snippet = (s) => {
    for (const bl of s.blocks) {
      if (typeof bl === 'string') return clip(bl, 140);
      if (bl.p) return clip(arr(bl.p)[0], 140);
      if (bl.callout) return clip(arr(bl.callout.text)[0], 140);
    }
    return '';
  };
  const tiles = S.map((s, i) => {
    const wide = i === 0 || (i === S.length - 1 && S.length % 2 === 0);
    const cls = i === 0 ? 'w t-christ' : i === S.length - 1 ? 't-you' + (wide ? ' w' : '') : i % 3 === 1 ? 't-text' : '';
    return `<a class="tile ${cls}" href="#sec${i + 1}"><span class="tl"><span>الجزء ${ar(i + 1)}</span>${IC.chev}</span><span class="vis" style="font-size:13.5px;line-height:1.75;display:-webkit-box;-webkit-line-clamp:${i === 0 ? 3 : 4};-webkit-box-orient:vertical;overflow:hidden;align-items:flex-start">${esc(snippet(s))}</span><span class="tt">${md(s.short || s.title)}</span></a>`;
  }).join('');
  const ctxNav = I.context ? `<div class="ctx">${['before', 'now', 'after'].map((k) => { const x = I.context[k]; const lab = { before: 'ما قبله', now: 'أنت هنا', after: 'ما بعده' }[k]; return x.href ? `<a href="${up(depth)}${x.href}"><small>${lab}</small><b>${md(x.t)}</b></a>` : `<div class="${k === 'now' ? 'here' : ''}"><small>${lab}</small><b>${md(x.t)}</b></div>`; }).join('')}</div>` : '';
  const hv = I.heroVerse ? `<div class="otnt" style="margin:18px 0 0"><div style="background:var(--cream)"><small>${refLabel(I.heroVerse)}</small><span class="s">${esc(quoteText(I.heroVerse))}</span></div></div>` : '';
  const idx = `<div class="pg idx" id="pg-idx">
${header({ back: `../${b.slug}.html`, title: 'عن السفر' })}
<div class="dh" style="padding-top:18px"><span class="ey">${md(I.eyebrow || b.groupName)}</span><h1 style="font-size:34px">${esc(I.title || b.name)}</h1><p class="lead" style="color:#3b3934;font-family:var(--body);font-size:16px;margin-top:8px">${md(I.summary)}</p>${hv}
<dl class="facts">${I.facts.map((f) => `<div><dt><span class="dot ${f.tag || 'agreed'}"></span>${md(f.k)}</dt><dd>${md(f.v)}</dd></div>`).join('')}</dl>${ctxNav}</div>
<div class="sec-t" style="margin-inline:24px">المقدمة في ${secWord(S.length)}</div>
<div class="bento" style="padding-top:4px">${tiles}<a class="tile w t-map" href="../${b.slug}.html" style="min-height:110px;background:var(--ink)"><span class="tl" style="position:static;color:var(--gold2)"><span>${chWord(b.chapters)}</span>${IC.chev}</span><span class="tt" style="color:#fff">ادرس الأصحاحات</span></a></div>
</div>`;
  const dets = S.map((s, i) => `<div class="pg det" id="sec${i + 1}" data-det>
<header class="sh"><a class="b" href="#">${IC.back}المقدمة</a><span class="t">${md(s.short || s.title)}</span><a class="b" href="../${b.slug}.html" aria-label="الأصحاحات">${IC.list}</a></header>
<div class="dh"><span class="ey">الجزء ${ar(i + 1)} من ${ar(S.length)}</span><h1>${md(s.title)}</h1></div>
<div class="dc">${blocks(s.blocks, ctx)}</div>
${i < S.length - 1 ? `<a class="nextsec" href="#sec${i + 2}"><span><small>الجزء التالي</small><b>${md(S[i + 1].short || S[i + 1].title)}</b></span>${IC.chev}</a>` : `<a class="nextsec" href="../${b.slug}.html"><span><small>انتهت المقدمة</small><b>ابدأ الأصحاحات</b></span>${IC.chev}</a>`}
</div>`).join('');
  const body = `<div class="ovl on stat" id="study" data-intro="${b.id}">${idx}${dets}</div>`;
  write(`book/${b.slug}/about.html`, page({ title: `عن ${b.name}`, depth, body, cls: 'immersive' }));
}

// ---------- chapter ----------
const TAG = { agreed: 'متفق عليه', debated: 'قضية تفسيرية', likely: 'الرأي الراجح' };
function christPair(b, n, S) {
  const vref = (r) => { try { const p = parseRef(r); return p.vs ? r : null; } catch { return null; } };
  const kv = vref(firstRef(S.keyVerse) || '') || `${b.id}.${n}.1`;
  if (b.testament === 'ot') {
    const l = (S.links || []).find((x) => vref(x.ref) && parseRef(x.ref).book.testament === 'nt');
    if (l) return { ot: kv, nt: l.ref };
    return null;
  }
  const q = (S.otQuotes || []).find((x) => vref(x.src));
  if (q) { const at = String(q.at).split(/[-–]/)[0]; return { ot: q.src, nt: `${b.id}.${n}.${+at || 1}` }; }
  const l = (S.links || []).find((x) => vref(x.ref) && parseRef(x.ref).book.testament === 'ot');
  if (l) return { ot: l.ref, nt: kv };
  return null;
}
const rng = (r) => { const [a, z] = String(r).split(/[-–]/).map(Number); return [a, z || a]; };

const readerTools = () => `<span>${esc(config.bibleVersion)}</span><span style="display:flex;gap:6px"><button type="button" class="fsz" data-size="-1" aria-label="تصغير الخط" title="تصغير الخط"><b>أ</b><i>−</i></button><button type="button" class="fsz up" data-size="1" aria-label="تكبير الخط" title="تكبير الخط"><b>أ</b><i>+</i></button></span><span class="thm3" role="group" aria-label="ألوان القراءة (لهذه الزيارة فقط)">${[['light', 'فاتح'], ['paper', 'ورقي'], ['night', 'ليلي'], ['contrast', 'تباين عالٍ']].map(([k, l]) => `<button type="button" data-theme3="${k}" aria-label="${l}" title="${l}"></button>`).join('')}</span>`;
function readerHTML(b, n, S, depth, { overlay, embed }) {
  const vs = bible(b.id).chapters[n - 1].verses;
  const GL = glossChapter(b.id, vs);
  const per = Object.fromEntries((S?.pericopes || []).map((p) => [p.at, p.t]));
  let key = [0, -1];
  if (S?.keyVerse) { try { const p = parseRef(firstRef(S.keyVerse)); if (p.ch === n && p.vs) key = [p.vs, p.ve]; } catch {} }
  const prev = prevOf(b, n), next = nextOf(b, n);
  const nav = `<div class="chnav">${next ? `<a href="${chapterHref(next.b, next.n, depth)}"><small>التالي</small><b>${chTitle(next.b, next.n)}</b></a>` : '<span></span>'}${prev ? `<a class="n" href="${chapterHref(prev.b, prev.n, depth)}"><small>السابق</small><b>${chTitle(prev.b, prev.n)}</b></a>` : '<span></span>'}</div>`;
  const head = overlay
    ? `<header class="sh"><a class="b" href="#" aria-label="إغلاق النص">${IC.close}</a><span class="t">${chTitle(b, n)}${S ? ' · ' + md(S.title) : ''}</span><a class="b" href="#study3" aria-label="الدراسة">${IC.menu}</a></header>`
    : `<header class="sh"><a class="b" href="../${b.slug}.html#c${n}" aria-label="الأصحاحات">${IC.back}</a><span class="t">${chTitle(b, n)}</span><span style="width:44px"></span></header>`;
  if (embed) return `<div class="rtools">${readerTools()}</div>
<div class="rbody" data-share="${esc(b.name)}|${n}" data-xref="${b.id}.${n}"><p class="shint">اضغط أي آية لتنسخها، أو تحفظها صورة، أو ترى الشواهد المرتبطة بها. والكلمة التي تحتها خط منقّط لها شرح في القاموس.</p><div class="scr" lang="ar">${vs.map((v) => `${per[v.number] ? `</div><div class="peri">${md(per[v.number])}</div><div class="scr">` : ''}<span class="v${v.number >= key[0] && v.number <= key[1] ? ' key' : ''}" id="v${v.number}"><span class="vn">${ar(v.number)}</span>${GL.html(v)}</span> `).join('')}</div></div>${GL.cards}`;
  return `${head}
<div class="rtools">${readerTools()}</div>
${overlay ? '' : `<div class="dh"><span class="ey">${esc(b.name)} · الأصحاح ${ar(n)} من ${ar(b.chapters)}</span><h1>${chTitle(b, n)}</h1></div><div class="soon">دراسة هذا الأصحاح قيد الإعداد. اقرأ النص الآن، وستُضاف قريباً القصة والخريطة والشخصيات والدراسة الكاملة.</div>`}
<div class="rbody" data-share="${esc(b.name)}|${n}" data-xref="${b.id}.${n}"><p class="shint">اضغط أي آية لتنسخها، أو تحفظها صورة، أو ترى الشواهد المرتبطة بها. والكلمة التي تحتها خط منقّط لها شرح في القاموس.</p><div class="scr" lang="ar">${vs.map((v) => `${per[v.number] ? `</div><div class="peri">${md(per[v.number])}</div><div class="scr">` : ''}<span class="v${v.number >= key[0] && v.number <= key[1] ? ' key' : ''}" id="v${v.number}"><span class="vn">${ar(v.number)}</span>${GL.html(v)}</span> `).join('')}</div></div>${GL.cards}
${nav}`;
}

function chapterPage(b, n) {
  const depth = 2;
  const S = study(b, n);
  const vs = bible(b.id).chapters[n - 1].verses;
  if (!S) {
    const body = `<div class="reader-page">${readerHTML(b, n, null, depth, { overlay: false })}</div>`;
    write(`book/${b.slug}/${n}.html`, page({ title: chTitle(b, n), depth, body, cls: 'immersive' }));
    return;
  }
  const prev = prevOf(b, n), next = nextOf(b, n);
  const words = vs.reduce((a, v) => a + v.text.split(/\s+/).length, 0);
  const mins = Math.max(2, Math.round(words / 120));
  const hit = mapForChapter(b, n);
  const people = [];
  const groups = [];
  for (const p of S.people || []) { const per = PEOPLE.byChapterName(b, p.n); if (per && !people.some((x) => x.p === per)) people.push({ p: per, d: p.d }); else if (!per) groups.push(p); }
  const pair = christPair(b, n, S);
  const christ = arr(S.christ);
  const kvRef = firstRef(S.keyVerse);
  const W = S.words?.[0];
  const outline = S.outline || [];
  const isHeb = b.testament === 'ot';

  // --- story cards ---
  const card = (bg, fg, html, more) => ({ bg, fg, html, more });
  const cards = [];
  cards.push(card('#17191E', '#FAF8F4', `<div class="lab">${chTitle(b, n)}</div><h1>${md(S.title)}</h1><p style="margin-top:14px;opacity:.75" class="clip">${esc(firstSentences(S.where, 80))}</p><p style="margin-top:26px;font-family:var(--ui);font-size:13px;opacity:.5">${vWord(vs.length)} · نحو ${ar(mins)} دقائق</p>`));
  const steps = (S.pericopes?.length >= 2 ? S.pericopes.map((p) => [String(p.at), p.t]) : outline.map((o) => [String(o.r).split(/[-–]/)[0], o.t])).slice(0, 6);
  cards.push(card('#FAF8F4', '#17191E', `<div class="lab">في دقيقة</div><h2>ماذا يحدث هنا؟</h2><ol>${steps.map(([at, t]) => `<li><small>${ar(at)}</small><span>${md(clip(t, 90))}</span></li>`).join('')}</ol>`, 'sum'));
  const opening = (() => { let s = ''; for (const v of vs) { if (s.length > 180) break; s += (s ? ' ' : '') + v.text; } return clip(s, 260); })();
  cards.push(card('#F2EEE6', '#17191E', `<div class="lab">النص</div><p style="font-family:var(--nas);font-size:21px;line-height:2.05" class="clip">${esc(opening)}</p><a class="btn d" href="#read">${IC.read}اقرأ الأصحاح كاملاً</a>`));
  if (hit) {
    const J = hit.m.journeys[hit.j];
    cards.push(card('#1F2A44', '#FAF8F4', `<div class="lab">الخريطة · ${esc(hit.m.title)}</div><h2 style="margin-bottom:12px">${esc(J.stops[hit.idx[0]].n)}${hit.idx.length > 1 ? ' إلى ' + esc(J.stops[hit.idx[hit.idx.length - 1]].n) : ''}</h2><div class="smap">${thumb(hit, 'navy', 'active')}</div><div class="legend">${hit.idx.slice(0, 6).map((i) => `<span><b>${ar(i + 1)}</b>${esc(J.stops[i].n)}</span>`).join('')}</div>`, 'map'));
  } else if (S.places?.length) {
    cards.push(card('#F2EEE6', '#17191E', `<div class="lab">الأماكن</div><h2>أماكن في هذا الأصحاح</h2><ol>${S.places.slice(0, 4).map((p) => `<li><span><b style="font-family:var(--ui);font-weight:500">${md(p.n)}</b><br><span style="font-size:14.5px;opacity:.75">${md(clip(p.d, 90))}</span></span></li>`).join('')}</ol>`, 'map'));
  }
  const XS = explainersFor(b, n);
  for (const x of XS) cards.push(card('#14161C', '#FAF8F4', xStory(x, b, n, depth)));
  if (people.length || groups.length) {
    const rows = [...people.slice(0, 5).map(({ p, d }) => `<a class="pr" href="#p-${p.id}"><span class="av${pimgSrc(p, depth) ? ' pic' : ''}">${pimgSrc(p, depth) ? `<img src="${pimgSrc(p, depth)}" alt="" loading="lazy">` : esc(p.mono)}</span><span><b>${esc(p.prof ? p.prof.full : p.label)}</b><small>${esc(p.prof ? p.prof.role : clip(d, 60))}</small></span>${IC.chev}</a>`), ...groups.slice(0, Math.max(0, 4 - people.length)).map((g) => `<div class="pr"><span class="av" style="font-size:16px;color:#888">·</span><span><b>${md(g.n)}</b><small>${esc(clip(g.d, 60))}</small></span></div>`)];
    cards.push(card('#17191E', '#FAF8F4', `<div class="lab">الشخصيات</div><h2>من في القصة؟</h2><div>${rows.join('')}</div>`, people.length ? null : null));
  }
  if (kvRef) cards.push(card('#FAF8F4', '#17191E', `<div class="lab">الآية المفتاحية</div><q class="q">${esc(clip(quoteText(kvRef), 260))}</q><span class="ref">${refLabel(kvRef)}</span>`, 'refs'));
  if (pair) {
    cards.push(card('#17191E', '#FAF8F4', `<div class="lab" style="color:#D7C49A">من القديم إلى الجديد</div><h2>${b.testament === 'ot' ? 'الوعد يجد تحقيقه' : 'الجديد يتمم القديم'}</h2><div class="thread">
<div class="bx" style="background:#23262D"><small>العهد القديم · ${refLabel(pair.ot)}</small><span class="s">${esc(clip(quoteText(pair.ot), 170))}</span></div>
<div class="ln">يتحقق في</div>
<div class="bx" style="background:#FAF8F4;color:#17191E"><small>العهد الجديد · ${refLabel(pair.nt)}</small><span class="s">${esc(clip(quoteText(pair.nt), 170))}</span></div></div>
${christ[0] ? `<p style="font-size:15.5px;margin-top:16px;opacity:.75" class="clip">${esc(firstSentences(christ[0], 60))}</p>` : ''}`, 'christ'));
  } else if (christ[0]) {
    cards.push(card('#17191E', '#FAF8F4', `<div class="lab" style="color:#D7C49A">المسيح في هذا الأصحاح</div><p style="font-family:var(--nas);font-size:21px;line-height:1.95" class="clip">${esc(firstSentences(christ[0], 160))}</p>`, 'christ'));
  }
  if (W) cards.push(card('#F2EEE6', '#17191E', `<div class="lab">كلمة من الأصل ${isHeb ? 'العبري' : 'اليوناني'}</div><div class="heb">${esc(String(W.orig || '').split(' (')[0])}</div><h2 style="margin:6px 0 10px">${md(W.w)}</h2><p class="clip" style="font-size:16.5px">${md(clip(W.d, 260))}</p>`, 'word'));
  if (S.views) cards.push(card('#1F2A44', '#FAF8F4', `<div class="lab">${md(S.views.t || 'قراءتان للنص')}</div><h2 style="font-size:23px">كيف يقرأ المفسرون هذا النص؟</h2><div class="vw"><div><small>لاهوت العهد</small><p>${md(clip(S.views.covenant, 200))}</p></div><div><small>التدبيرية</small><p>${md(clip(S.views.dispensational, 200))}</p></div></div>`, 'views'));
  if (S.questions?.length) cards.push(card('#FAF8F4', '#17191E', `<div class="lab">للتأمل</div><h2 style="font-size:23px">${md(S.questions[0])}</h2>${S.apply ? `<div style="border-top:1px solid #E4DED3;padding-top:14px;margin-top:4px"><div class="lab" style="margin-bottom:6px">خطوة للحياة</div><p style="font-size:16.5px" class="clip">${md(clip(arr(S.apply)[0], 300))}</p></div>` : ''}`, 'you'));
  cards.push(card('#17191E', '#FAF8F4', `<div class="lab">نهاية الأصحاح</div><h2>تريد أن تتعمق؟</h2><p style="opacity:.75">الخلفيات، والكلمات، والأسئلة الصعبة، وما قاله معلمو الكنيسة.</p>
<a class="btn l" href="#study">${IC.list}الدراسة الكاملة</a>
${next ? `<a class="btn o" style="margin-top:10px" href="${chapterHref(next.b, next.n, depth)}">${chTitle(next.b, next.n)}${study(next.b, next.n) ? ' · ' + md(study(next.b, next.n).title) : ''}</a>` : ''}`));

  // Story: cards in a horizontal row (design-v3), each card as before.
  const story = `<section class="ch3s" aria-label="القصة في بطاقات">
<div class="ch3sh"><div><h2>القصة في بطاقات</h2><p>الأصحاح في ${countWord(cards.length, 'بطاقة واحدة', 'بطاقتين', 'بطاقات', 'بطاقة')}. اسحب أو استخدم الأسهم.</p></div><span class="h3a"><button type="button" data-rail-prev="st" aria-label="السابق">${IC.chev.replace('class="ic"', 'class="ic" style="transform:scaleX(-1)"')}</button><button type="button" data-rail-next="st" aria-label="التالي">${IC.chev}</button></span></div>
<div class="ch3seg" aria-hidden="true">${cards.map(() => '<i></i>').join('')}</div>
<div class="h3r ch3r" data-rail="st">${cards.map((c, i) => `<article class="sc" style="background:${c.bg};color:${c.fg}" aria-label="بطاقة ${ar(i + 1)} من ${ar(cards.length)}"><span class="no">${ar(i + 1)} / ${ar(cards.length)}</span>${c.html.replace(/href="#study"/g, 'href="#study3"')}${c.more ? `<a class="more" href="#s-${c.more}">${IC.up}التفاصيل</a>` : ''}</article>`).join('')}</div>
</section>`;

  // --- study sections (DET). The old bento tiles are still built alongside; only DET is used on the page. ---
  const DET = {};
  const T = (k, cls, label, title, vis) => `<a class="tile ${cls}" href="#s-${k}"><span class="tl"><span>${label}</span>${IC.chev}</span><span class="vis">${vis}</span><span class="tt">${title}</span></a>`;
  const tiles = [];
  // Christ (wide)
  tiles.push({ w: 1, h: `<a class="tile w t-christ" href="#s-christ"><span class="tl"><span>من القديم إلى الجديد</span>${IC.chev}</span>${pair ? `<span class="pair"><div><small>${refLabel(pair.ot)}</small>${esc(clip(quoteText(pair.ot), 110))}</div><div><small>${refLabel(pair.nt)}</small>${esc(clip(quoteText(pair.nt), 110))}</div></span>` : `<span class="tx">${esc(firstSentences(christ[0] || '', 80))}</span>`}<span class="tt">المسيح في هذا الأصحاح</span></a>` });
  DET.christ = { t: 'المسيح في هذا الأصحاح', ey: 'من القديم إلى الجديد', h: `${christ[0] ? `<p class="lead">${md(christ[0])}</p>` : ''}${pair ? `<div class="otnt"><div style="background:var(--cream)"><small>العهد القديم · <a class="r" href="${refHref(pair.ot, depth)}">${refLabel(pair.ot)}</a></small><span class="s">${esc(quoteText(pair.ot))}</span></div><div style="background:var(--ink);color:#fff"><small style="color:var(--gold2)">العهد الجديد · <a href="${refHref(pair.nt, depth)}" style="color:inherit">${refLabel(pair.nt)}</a></small><span class="s">${esc(quoteText(pair.nt))}</span></div></div>` : ''}${christ.slice(1).map((p) => `<p>${md(p)}</p>`).join('')}` };
  const half = [];
  half.push(T('read', 't-text', vWord(vs.length), 'النص كاملاً', esc(vs[0].text)));
  if (people.length) half.push(T('people', '', countWord(people.length, 'شخصية واحدة', 'شخصيتان', 'شخصيات', 'شخصية'), 'الشخصيات', `<span class="avs">${people.slice(0, 4).map(({ p }) => `<span>${esc(p.mono)}</span>`).join('')}</span>`));
  DET.people = { t: 'الشخصيات', ey: 'من في القصة', h: `${people.map(({ p, d }) => `<div class="blk"><h3>${esc(p.prof ? p.prof.full : p.label)}</h3><p>${md(d)}</p><p style="margin-top:8px"><a class="r" href="#p-${p.id}">بطاقة الشخصية</a> · <a class="r" href="${personHref(p, depth)}">الملف الكامل</a></p></div>`).join('')}${groups.map((g) => `<div class="blk"><h3>${md(g.n)}</h3><p>${md(g.d)}</p></div>`).join('')}` };
  for (const x of XS) tiles.push({ w: 1, h: xTile(x, n, depth).replace('class="tile w t-explain"', 'class="tile w t-explain" data-k="explain"') });
  // map / places
  if (hit) {
    const J = hit.m.journeys[hit.j];
    tiles.push({ w: 1, h: `<a class="tile w t-map" href="#s-map"><span class="mapb">${thumb(hit, 'navy', 'active', 1.9)}</span><span class="tl"><span>${esc(hit.m.title)}</span>${IC.chev}</span><span class="ov2"><span class="tt" style="padding:0">الأماكن والخريطة</span><small>${hit.idx.map((i) => esc(J.stops[i].n)).join('، ')}</small></span></a>` });
    DET.map = { t: 'الأماكن والخريطة', ey: esc(hit.m.title), h: `<div class="smap" style="height:auto;aspect-ratio:1.45;border-color:var(--line);margin-bottom:16px">${thumb(hit, 'sand', 'all')}</div>${hit.idx.map((i) => `<div class="blk"><h3><span class="n">${ar(i + 1)}</span>${esc(J.stops[i].n)}</h3><p>${md(J.stops[i].t)}</p></div>`).join('')}${(S.places || []).length ? `<div class="blk"><h3>أماكن أخرى في الأصحاح</h3>${S.places.map((p) => `<p><b>${md(p.n)}:</b> ${md(p.d)}</p>`).join('')}</div>` : ''}<a class="btn d" href="${mapHref(hit.m, depth)}#j${hit.j + 1}-${hit.idx[0] + 1}">${IC.map}افتح الخريطة كاملة</a>` };
  } else if (S.places?.length) {
    half.push(T('map', 't-places', countWord(S.places.length, 'مكان واحد', 'مكانان', 'أماكن', 'مكاناً'), 'الأماكن', S.places.slice(0, 4).map((p) => `<span>${esc(plain(p.n).replace(/\s*\([^)]*\)/g, ''))}</span>`).join('')));
    DET.map = { t: 'الأماكن', ey: 'أين تجري الأحداث وما يُذكر من أماكن', h: S.places.map((p) => `<div class="blk"><h3>${md(p.n)}</h3><p>${md(p.d)}</p></div>`).join('') };
  }
  if (W) half.push(T('word', 't-word', countWord(S.words.length, 'كلمة واحدة', 'كلمتان', 'كلمات', 'كلمة'), `كلمات من الأصل ${isHeb ? 'العبري' : 'اليوناني'}`, `<span style="font-size:${String(W.orig || '').split(' (')[0].length > 7 ? 24 : 36}px">${esc(String(W.orig || plain(W.w)).split(' (')[0])}</span><small>${esc(plain(W.w))}</small>`));
  if (S.words?.length) DET.word = { t: `كلمات من الأصل ${isHeb ? 'العبري' : 'اليوناني'}`, ey: 'تعمّق', h: S.words.map((w) => `<div class="blk">${w.orig ? `<span class="hw">${esc(w.orig)}</span>` : ''}<h3>${md(w.w)}</h3><p>${md(w.d)}</p></div>`).join('') };
  const ranges = outline.map((o) => { const [a, z] = rng(o.r); return Math.max(1, z - a + 1); });
  const mx = Math.max(1, ...ranges);
  half.push(T('sum', 't-out', secWord(outline.length), 'نظرة عامة وتقسيم', `<span class="bars2">${ranges.map((r) => `<i style="height:${Math.round(20 + 80 * r / mx)}%"></i>`).join('')}</span>`));
  DET.sum = { t: 'نظرة عامة وتقسيم', ey: 'افهم النص', h: `<p class="lead">${md(S.where)}</p><div class="ctx" style="margin:0 0 18px"><div><small>ما قبله</small><span style="font-size:15px;line-height:1.75">${md(S.before)}</span></div><div><small>ما بعده</small><span style="font-size:15px;line-height:1.75">${md(S.after)}</span></div></div>${outline.map((o) => `<div class="blk"><a class="rng" href="#v${rng(o.r)[0]}">الآيات ${ar(String(o.r).replace('-', '–'))}</a><p>${md(o.t)}</p></div>`).join('')}<div class="blk"><h3>الملخص</h3>${arr(S.summary).map((p) => `<p>${md(p)}</p>`).join('')}</div>` };
  if (S.hard?.length) {
    half.push(`<a class="tile t-hard" href="#s-hard"><span class="qm">؟</span><span class="tl"><span>${countWord(S.hard.length, 'سؤال واحد', 'سؤالان', 'أسئلة', 'سؤالاً')}</span>${IC.chev}</span><span class="vis">${esc(clip(S.hard[0].q, 90))}</span><span class="tt">أسئلة صعبة</span></a>`);
    DET.hard = { t: 'أسئلة صعبة', ey: 'تعمّق', h: S.hard.map((h) => `<div class="blk"><span class="tg ${h.tag || 'debated'}">${TAG[h.tag] || TAG.debated}</span><h3 style="margin-top:6px">${md(h.q)}</h3>${arr(h.a).map((a) => `<p>${md(a)}</p>`).join('')}</div>`).join('') };
  }
  if (S.background?.length) {
    half.push(T('bg', 't-bg', countWord(S.background.length, 'خلفية واحدة', 'خلفيتان', 'خلفيات', 'خلفية'), 'خلفيات', S.background.slice(0, 3).map((x) => `<span>${esc(plain(x.t))}</span>`).join('')));
    DET.bg = { t: 'خلفيات تساعدك على الفهم', ey: 'تعمّق', h: S.background.map((x, i) => `<div class="blk"><h3><span class="n">${ar(i + 1)}</span>${md(x.t)}</h3><p>${md(x.d)}</p></div>`).join('') };
  }
  const refs = [...(S.otQuotes || []).map((q) => q.src), ...(S.parallels || []).map((q) => q.ref), ...(S.links || []).map((q) => q.ref)];
  if (refs.length) {
    half.push(T('refs', 't-refs', countWord(refs.length, 'شاهد واحد', 'شاهدان', 'شواهد', 'شاهداً'), 'شواهد وروابط', refs.slice(0, 6).map((r) => `<span>${refLabel(r)}</span>`).join('')));
    DET.refs = { t: 'شواهد وروابط', ey: 'الكتاب يفسر الكتاب', h: `${S.otQuotes?.length ? `<div class="blk"><h3>من العهد القديم</h3>${S.otQuotes.map((q) => `<p><a class="r" href="${refHref(q.src, depth)}">${refLabel(q.src)}</a> ← <a class="r" href="#v${String(q.at).split(/[-–]/)[0]}">الآية ${ar(q.at)}</a>: ${md(q.d)}</p>`).join('')}</div>` : ''}${S.parallels?.length ? `<div class="blk"><h3>في الأناجيل الأخرى</h3>${S.parallels.map((q) => `<p><a class="r" href="${refHref(q.ref, depth)}">${refLabel(q.ref)}</a>: ${md(q.d)}</p>`).join('')}</div>` : ''}${S.links?.length ? `<div class="blk"><h3>شواهد مرتبطة</h3>${S.links.map((q) => `<p><a class="r" href="${refHref(q.ref, depth)}">${refLabel(q.ref)}</a>: ${md(q.d)}</p>`).join('')}</div>` : ''}${chapterTopicsBlock(TLINKS[b.id + ':' + n], b, n, depth)}` };
  }
  if (S.views) {
    tiles.push({ w: 1, h: `<a class="tile w t-views" href="#s-views"><span class="tl"><span>${md(S.views.t || 'قراءتان للنص')}</span>${IC.chev}</span><span class="vis"><span>لاهوت العهد</span><span>التدبيرية</span></span><span class="tt">كيف يُقرأ هذا النص؟</span></a>` });
    DET.views = { t: plain(S.views.t || 'قراءتان للنص'), ey: 'قراءتان', h: `<div class="blk"><h3>لاهوت العهد ${RTAG}</h3><p>${md(S.views.covenant)}</p></div><div class="blk"><h3>التدبيرية</h3><p>${md(S.views.dispensational)}</p></div>${S.views.common ? `<div class="agree"><small>ما نتفق عليه</small><p>${md(S.views.common)}</p></div>` : ''}` };
  }
  if (S.voices?.length) {
    tiles.push({ w: 1, h: `<a class="tile w t-voice" href="#s-voices"><span class="tl"><span>${countWord(S.voices.length, 'صوت واحد', 'صوتان', 'أصوات', 'صوتاً')}</span>${IC.chev}</span><span class="vis"><q>${esc(firstSentences(S.voices[0].b, 60))}</q><span class="names">${S.voices.map((v) => esc(plain(v.n))).join(' · ')}</span></span><span class="tt">آراء اللاهوتيين</span></a>` });
    DET.voices = { t: 'آراء اللاهوتيين', ey: 'ماذا قال معلمو الكنيسة', h: `${S.voices.map((v) => `<div class="blk"><h3>${md(v.n)} ${isRf(v.n) ? RTAG : ''}</h3><span class="who2">${md(v.y || '')}${v.w ? ` · <a href="${up(2)}library.html#${workId(v.n, v.w)}">${md(v.w)}</a>` : ''}</span><p>${md(v.b)}</p></div>`).join('')}<p class="note">ملخصات بتصرّف لأفكارهم، وليست اقتباسات حرفية. الأعمال المذكورة مقترحة للتوسع، وتجدها مصنّفة في <a href="${up(2)}library.html">المكتبة اللاهوتية</a>.</p>` };
  }
  half.push(`<a class="tile t-you" href="#s-you"><span class="tl"><span>${countWord(S.questions?.length || 0, 'سؤال واحد', 'سؤالان', 'أسئلة', 'سؤالاً')}</span>${IC.chev}</span><span class="vis">${esc(clip(S.questions?.[0] || '', 90))}</span><span class="tt">للتأمل والتطبيق</span></a>`);
  DET.you = { t: 'للتأمل والتطبيق', ey: 'عِشها', h: `${(S.questions || []).map((q, i) => `<div class="blk"><h3><span class="n">${ar(i + 1)}</span><span>${md(q)}</span></h3></div>`).join('')}${S.apply ? `<div class="applyb"><small>للحياة</small>${arr(S.apply).map((p) => `<p>${md(p)}</p>`).join('')}</div>` : ''}` };
  const viewerHtml = people.length ? `<div class="viewer" id="viewer" aria-label="بطاقة الشخصية">
<div class="vtop"><a href="#" aria-label="إغلاق">${IC.close}</a><span data-vname></span><span style="width:44px"></span></div>
<div class="stage"><div class="pcard"><div class="pin"></div></div></div>
<div class="dots"></div><div class="hint">اسحب يميناً أو يساراً لتقلب البطاقة</div>
<div class="who">${people.map(({ p }) => `<button type="button" data-p="${p.id}" aria-pressed="false">${esc(p.prof ? p.prof.n : p.label)}</button>`).join('')}</div>
<a class="full" data-vfull href="#">الملف الكامل للشخصية</a>
${people.map(({ p }) => cardWithImg(p, depth)).join('')}
${people.map(({ p }) => `<a hidden data-pid="${p.id}" href="${personHref(p, depth)}"></a>`).join('')}
</div>` : '';
  // Printable study sheet: hidden on screen, the only thing printed from a chapter page.
  const handout = `<section class="handout" aria-hidden="true">
<header><span>${esc(config.nameAr)} · ورقة دراسة</span><span>${esc(b.name)} · الأصحاح ${ar(n)}</span></header>
<h1>${chTitle(b, n)}: ${md(S.title)}</h1><p class="sec">${md(S.section)}</p>
${kvRef ? `<blockquote>${esc(quoteText(kvRef))}<small>${refLabel(kvRef)}</small></blockquote>` : ''}
<h2>أين نحن؟</h2><p>${md(firstSentences(S.where, 160))}</p>
${outline.length ? `<h2>تقسيم الأصحاح</h2><ol class="hol">${outline.map((o) => `<li><b>${ar(o.r)}</b> ${esc(clip(o.t, 110))}</li>`).join('')}</ol>` : ''}
${christ[0] ? `<h2>المسيح في هذا الأصحاح</h2><p>${md(firstSentences(christ[0], 200))}</p>` : ''}
${S.questions?.length ? `<h2>أسئلة للمناقشة</h2><ol class="hq">${S.questions.slice(0, 5).map((q) => `<li>${md(q)}<span class="ln"></span></li>`).join('')}</ol>` : ''}
<h2>ملاحظاتي</h2><div class="notes">${'<span class="ln"></span>'.repeat(4)}</div>
<footer>النص: ${esc(config.bibleVersion)} · ${esc(config.domain.replace(/^https?:\/\//, ''))}/book/${b.slug}/${n}.html</footer>
</section>`;
  // ---- hub-and-spoke (redesign Nov 2026): one hub of cards, one focused view per section ----
  const D = deepOf(b, n);
  const DS = D ? deepSecs(b, n) : {};
  const dsec = (...ids) => ids.map((id) => DS[id]?.html || '').join('');
  const kvHtml = kvRef ? `<figure class="kv5"><blockquote>${esc(quoteText(kvRef))}</blockquote><figcaption>${refLabel(kvRef)}</figcaption></figure><p class="c5p"><a class="lnk5" href="#v${(() => { try { return parseRef(kvRef).vs || 1; } catch { return 1; } })()}">اقرأها في سياقها داخل الأصحاح ${ARW}</a></p>${D ? (() => { const kv = (D.verses || []).find((V) => V.key && (() => { try { const p = parseRef(kvRef); return vspan(V.r).includes(p.vs); } catch { return false; } })()); return kv?.notes?.length ? `<div class="dso"><h3 class="h5">ملاحظات على الآية</h3><ul class="dnotes">${kv.notes.map((x) => `<li>${gmd(x)}</li>`).join('')}</ul></div>` : ''; })() : ''}` : '';
  const noteKey = `${b.id}:${n}`;
  const notesBox = `<div class="note5b"><label for="nt5"><b>ملاحظاتي على هذا الأصحاح</b><small>تُحفظ على هذا الجهاز فقط، ولا تُرسل إلى أي مكان.</small></label><textarea id="nt5" data-note="${noteKey}" rows="6" placeholder="اكتب ما لمسك في الأصحاح، أو صلاة، أو خطوة تريد أن تعملها..."></textarea><span class="ns5" data-note-state aria-live="polite"></span></div>`;
  const prayHtml = `<p class="lead">هذا إرشاد للصلاة من كلمات الأصحاح، وليس صلاة مكتوبة بالنيابة عنك. خذ دقيقتين أو ثلاثاً، وتكلم مع الله بكلماتك.</p>
<ol class="pray5">
<li><b>سبّح</b><p>${kvRef ? `اقرأ الآية المفتاحية ببطء: «${esc(quoteText(kvRef))}» (${refLabel(kvRef)}). ماذا تعلن لك عن الله؟ سبّحه على ذلك.` : 'ماذا يعلن لك هذا الأصحاح عن الله؟ سبّحه على ذلك.'}</p></li>
<li><b>اعترف</b><p>${S.questions?.[0] ? `توقّف عند هذا السؤال: ${md(S.questions[0])} واعترف لله بما كشفه فيك النص.` : 'اعترف لله بما كشفه فيك النص.'}</p></li>
<li><b>اشكر</b><p>${christ[0] ? `اشكر الله على المسيح كما يظهر في هذا الأصحاح: ${esc(firstSentences(christ[0], 80))}` : 'اشكر الله على المسيح، الذي فيه نلنا كل بركة.'}</p></li>
<li><b>اطلب</b><p>${S.apply ? `اطلب نعمة لتعيش ما قرأته اليوم: ${esc(firstSentences(arr(S.apply)[0], 70))}` : 'اطلب نعمة لتعيش ما قرأته اليوم، ولأجل من حولك.'}</p></li>
</ol>
<p class="c5fine">طريقة السجود والاعتراف والشكر والطلبة من الطرق المعروفة لتنظيم الصلاة. ويعلّم التعليم المختصر لوستمنستر (السؤال ٩٨) أن الصلاة تقديم رغباتنا لله، باسم المسيح، مع الاعتراف بخطايانا والشكر على مراحمه.</p>`;
  const reflectHtml = `${(S.questions || []).length ? `<ol class="q5">${S.questions.map((q) => `<li>${md(q)}</li>`).join('')}</ol>` : ''}${S.apply ? `<div class="applyb"><small>خطوة للحياة</small>${arr(S.apply).map((p) => `<p>${md(p)}</p>`).join('')}</div>` : ''}${notesBox}${applySection(b, n, depth)}`;
  const ideaHtml = `<p class="lead">${md(S.where)}</p>${arr(S.summary).map((p) => `<p>${md(p)}</p>`).join('')}<div class="dso">${DET.sum ? `<h3 class="h5">التقسيم وما قبله وما بعده</h3><div class="ctx" style="margin:0 0 18px"><div><small>ما قبله</small><span>${md(S.before)}</span></div><div><small>ما بعده</small><span>${md(S.after)}</span></div></div>${outline.map((o) => `<div class="blk"><a class="rng" href="#v${rng(o.r)[0]}">الآيات ${ar(String(o.r).replace('-', '–'))}</a><p>${md(o.t)}</p></div>`).join('')}` : ''}${dsec('d-flow')}</div>`;
  const commHtml = D ? dsec('d-verses') : `${DET.word ? DET.word.h : ''}${outline.map((o) => `<div class="blk"><a class="rng" href="#v${rng(o.r)[0]}">الآيات ${ar(String(o.r).replace('-', '–'))}</a><p>${md(o.t)}</p></div>`).join('')}<p class="c5fine">الشرح آية بآية لهذا الأصحاح قيد الإعداد.</p>`;
  const V = [];
  const view = (id, e, t, sub, html, modes) => { if (html && String(html).replace(/<[^>]+>/g, '').trim()) V.push({ id, e, t, sub, html, modes }); };
  view('idea', IC.bulb, 'الفكرة الرئيسية', D ? 'الملخص، والتقسيم، ومسار الفكر' : 'الملخص والتقسيم', ideaHtml, 'qt ds');
  view('key', IC.key, 'الآية المفتاحية', kvRef ? refLabel(kvRef) : '', kvHtml, 'qt ds');
  view('christ', IC.cross, 'المسيح في النص', 'من القديم إلى الجديد', `${DET.christ?.h || ''}${dsec('d-ot')}`, 'ds');
  view('comm', IC.shelf, 'التفسير والسياق', D ? 'آية بآية، مع الكلمات الأصلية' : 'الكلمات والتقسيم', commHtml, 'ds');
  view('bg', IC.map, 'الخلفية والخرائط', 'الأماكن، والشخصيات، والخلفية التاريخية', `${DET.map?.h || ''}${DET.people ? `<h3 class="h5">الشخصيات</h3>${DET.people.h}` : ''}${DET.bg ? `<h3 class="h5">خلفيات</h3>${DET.bg.h}` : ''}${dsec('d-bg')}${XS.map((x) => `<a class="xa5" href="${explainHref(x, depth)}"><small>شرح مصوّر</small><b>${esc(x.title)}</b><span>${esc(x.sub)}</span></a>`).join('')}`, 'ds');
  view('theo', IC.col, 'اللاهوت والتعليم', 'العقائد التي يؤسسها الأصحاح', dsec('d-theo', 'd-teach'), 'ds');
  view('voices', IC.col, 'آراء اللاهوتيين', 'ماذا قال معلمو الكنيسة عبر القرون', `${DET.voices?.h || ''}${dsec('d-hist')}`, 'ds');
  view('hard', IC.q, 'أسئلة صعبة ومسائل الخلاف', 'كل رأي بحجته، ومدى الاتفاق عليه', `${DET.hard?.h || ''}${DET.views ? `<h3 class="h5">${esc(DET.views.t)}</h3>${DET.views.h}` : ''}${dsec('d-issues')}`, 'ds');
  view('reflect', IC.pen, 'تأمل وتطبيق عملي', 'أسئلة، وخطوة عملية، وملاحظاتك', reflectHtml, 'qt ds');
  view('pray', IC.pray, 'صلاة الأصحاح', 'سبّح، واعترف، واشكر، واطلب', prayHtml, 'qt ds');
  view('more', IC.list, 'شواهد ومراجع للتوسع', 'الكتاب يفسر الكتاب، وكتب موثوقة', `${DET.refs?.h || ''}${dsec('d-more')}`, 'ds');
  const readSub = `${ar(1)}–${ar(vs.length)}`;
  const hub = `<section class="c5hub" id="hub" aria-labelledby="c5t">
<div class="ch3h c5h"><div class="hd"><span class="big">${ar(n)}</span><div><small>${esc(b.name)} · ${md(S.section)}</small><h1 id="c5t">${md(S.title)}</h1><p>${esc(b.name)} · الأصحاح ${ar(n)} من ${ar(b.chapters)}</p></div></div></div>
<div class="c5hw">
<a class="c5read" href="#x-read"><span class="e">${IC.read}</span><span><b>اقرأ نص الأصحاح كاملاً (${readSub})</b><small>${vWord(vs.length)} · نحو ${ar(mins)} دقائق · ${esc(config.bibleVersion.split('،')[0])}</small></span>${ARW}</a>
<div class="c5grid">${V.map((x) => `<a class="c5c" href="#x-${x.id}" data-modes="${x.modes}"><span class="e">${x.e}</span><b>${x.t}</b><small>${esc(plain(x.sub))}</small></a>`).join('')}</div>
<p class="c5mode qt">أنت في <b>وضع الخلوة اليومية</b>. للتفسير والخلفية والمسيح في النص اختر «الدراسة المعمّقة» من الأعلى.</p>
<div class="c5tools"><button type="button" data-print>${IC.print}اطبع ورقة الدراسة</button></div>
<nav class="c5ch" aria-label="أصحاحات أخرى">${prev ? `<a href="${chapterHref(prev.b, prev.n, depth)}"><small>→ السابق</small><b>${chTitle(prev.b, prev.n)}</b></a>` : '<span></span>'}${next ? `<a class="nx" href="${chapterHref(next.b, next.n, depth)}"><small>التالي ←</small><b>${chTitle(next.b, next.n)}</b></a>` : '<span></span>'}</nav>
</div></section>`;
  const views = [{ id: 'read', e: IC.read, t: 'نص الأصحاح', sub: '', html: readerHTML(b, n, S, depth, { overlay: false, embed: true }), modes: 'qt ds' }, ...V].map((x) => `<article class="c5v" id="x-${x.id}" data-modes="${x.modes}" data-t="${esc(x.t)}" hidden tabindex="-1" aria-label="${esc(x.t)}">
<div class="c5in"><header class="c5vh"><span class="e">${x.e}</span><div><span class="z5k">${chTitle(b, n)}</span><h2>${x.t}</h2></div></header>
<div class="c5body${x.id === 'read' ? ' rd5' : ' dc'}">${x.html}</div>${x.id === 'read' ? `<p class="by5">النص: ${esc(config.bibleVersion)}.</p>` : `<p class="by5">الشرح في هذا القسم من إعداد «لمجد الله». كل رأي منسوب إلى شخص مكتوب معه اسمه ومصدره، والآراء المُصلَحة عليها علامة ${RTAG}.</p>`}
<nav class="c5foot"><a href="#" data-c5hub>${BACK} العودة لاختيار قسم آخر</a><a href="#" data-c5next class="nx"></a></nav></div></article>`).join('');
  const bar = `<div class="c5bar"><div class="c5bw"><a class="back5" data-c5back href="../${b.slug}.html" data-book="${esc(b.name)}" data-here="${esc(chTitle(b, n))}">${BACK} <span>العودة إلى ${esc(b.name)}</span></a>
<div class="pill5" role="radiogroup" aria-label="وضع القراءة"><button type="button" role="radio" data-mode-pick="qt" aria-checked="true"><span class="lf">وضع </span>الخلوة<span class="lf"> اليومية</span></button><button type="button" role="radio" data-mode-pick="ds" aria-checked="false"><span class="lf">وضع </span>الدراسة المعمّقة</button></div></div></div>`;
  const body = `<div class="c5" data-c5 data-chapter="${b.id}:${n}">${bar}${hub}${views}</div>${handout}`;
  write(`book/${b.slug}/${n}.html`, page({ title: `${chTitle(b, n)}: ${plain(S.title)}`, depth, nav: b.testament, body, cls: 'chapter v3 v5ch', after: viewerHtml }));
}

// ---------- deep study (دراسة متعمقة) ----------
const deepHref = (b, n) => `${n}-study.html`;
const modeSwitch = (b, n, on) => `<nav class="dmode" aria-label="طريقة الدراسة"><a href="${n}.html"${on === 'k' ? ' aria-current="page"' : ''}><b>خلوة</b><small>قراءة وتأمل</small></a><a href="${deepHref(b, n)}"${on === 'd' ? ' aria-current="page"' : ''}><b>دراسة متعمقة</b><small>آية بآية</small></a></nav>`;
// Greek/Hebrew written as **...** in content becomes a styled foreign-script span.
const wl = (t) => (/[֐-׿]/.test(t) ? 'lang="he" dir="rtl"' : 'lang="el" dir="ltr"');
const gmd = (s) => md(s).replace(/<b>([Ͱ-Ͽἀ-῿֐-׿\s’'·,.]+)<\/b>/g, (m, g) => (/[֐-׿]/.test(g) ? `<span class="gk" lang="he" dir="rtl">${g}</span>` : `<span class="gk" lang="el" dir="ltr">${g}</span>`));
// Reformed voices get a visible tag. A name counts when it contains one of these.
const RF_NAMES = ['كالفن', 'ماثيو هنري', 'سبرجن', 'سبرول', 'بايبر', 'كيلر', 'إدواردز', 'هودج', 'وارفيلد', 'بافينك', 'كايبر', 'لويد جونز', 'فوس', 'ريدربوس', 'جون موراي', 'أوين', 'باكستر', 'روثرفورد', 'فيرغسون', 'بيركوف', 'فان تيل', 'هندريكسن', 'بيزا', 'تورتين', 'بونيان', 'وستمنستر', 'بوسطن', 'كلوني', 'كارسون', 'هورتون', 'روبرتسون', 'كلاين', 'فالتكه', 'والتكه', 'غودفري', 'جودفري', 'بوايس', 'بويس'];
const RTAG = '<span class="rtag" title="رأي من الإيمان المُصلَح">مُصلَح</span>';
const isRf = (name) => RF_NAMES.some((k) => String(name || '').includes(k));
const rfView = (t) => /المُصلَح|المصلح|كالفن|وستمنستر|لاهوت العهد/.test(String(t || ''));
// Reformed commentators on a chapter: content/books/<book>/voices/<n>.mjs, each basis checked word for word in data/sources.
const vspan = (r) => String(r).split(/[;,]/).flatMap((p) => { const [a, z] = p.trim().split(/[-–]/).map(Number); const o = []; for (let i = a; i <= (z || a); i++) o.push(i); return o; });
const VOX = {};
const CMT = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/sources/commentary.json'), 'utf8'));
// Paraphrased voices registered per source item (sermon, chapter section, article) in commentary.json: CMT[k].items (MacArthur: CMT.mac.sermons).
const SERK = ['mac', 'ryle', 'hodge', 'owen', 'piper', 'sproul'];
const SREG = (k) => (k === 'mac' ? CMT.mac.sermons : (CMT[k] && CMT[k].items) || {});
const SLAB = { mac: 'عظة', ryle: 'تأملات تفسيرية على الأناجيل، القسم', hodge: 'تفسير، القسم', owen: 'شرح الرسالة إلى العبرانيين، القسم', piper: 'عظة', sproul: '' };
const bookEn = (b) => ({ Matt: 'Matthew', Mark: 'Mark', Luke: 'Luke', John: 'John', Acts: 'Acts', Rom: 'Romans', '1Cor': '1 Corinthians', '2Cor': '2 Corinthians', Gal: 'Galatians', Eph: 'Ephesians', Phil: 'Philippians', Col: 'Colossians', '1Thess': '1 Thessalonians', '2Thess': '2 Thessalonians', '1Tim': '1 Timothy', '2Tim': '2 Timothy', Titus: 'Titus', Phlm: 'Philemon', Heb: 'Hebrews', Jas: 'James', '1Pet': '1 Peter', '2Pet': '2 Peter', '1John': '1 John', '2John': '2 John', '3John': '3 John', Jude: 'Jude', Rev: 'Revelation' })[b.id] || b.id;
{
  const flat = (x) => x.replace(/\s+/g, ' ');
  for (const b of books) {
    const dir = path.join(ROOT, 'content/books', b.slug, 'voices');
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.mjs'))) {
      const n = +f.replace('.mjs', '');
      const list = (await import(path.join(dir, f))).default;
      for (const v of list) {
        let src;
        if (v.k === 'calvin') { const J = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/sources/calvin', `${b.slug}-${n}.json`), 'utf8')); src = v.at ? J[v.at] : Object.values(J).join('\n'); if (!src) throw new Error(`Voices ${b.slug} ${n}: no Calvin entry at ${v.at}`); }
        else if (v.k === 'mhc') src = fs.readFileSync(path.join(ROOT, 'data/sources/mhc', `${b.slug}-${n}.md`), 'utf8').replace(/[*_]/g, '').replace(/\\/g, '');
        else if (v.k === 'guzik') { const C = CMT.guzik.chapters[`${b.slug}-${n}`]; if (!C || !C.secs[v.sec]) throw new Error(`Voices ${b.slug} ${n} (${v.r}): Guzik section "${v.sec}" is not in data/sources/commentary.json`); if (!fs.existsSync(path.join(ROOT, 'data/sources/guzik', `${b.slug}-${n}.md`))) throw new Error(`Voices ${b.slug} ${n}: no Guzik reading notes`); }
        else if (SERK.includes(v.k)) { const M = SREG(v.k)[v.ser]; if (!M) throw new Error(`Voices ${b.slug} ${n} (${v.r}): ${v.k} source ${v.ser} is not in data/sources/commentary.json`); const sp = vspan(v.r); if (M.book !== b.name && M.book !== bookEn(b) || M.ch !== n || sp[0] < M.v[0] || sp[sp.length - 1] > M.v[1]) throw new Error(`Voices ${b.slug} ${n} (${v.r}): outside ${v.k} ${v.ser} (${M.book} ${M.ch}:${M.v.join('-')})`); if (!fs.existsSync(path.join(ROOT, 'data/sources', v.k, `${b.slug}-${n}.md`))) throw new Error(`Voices ${b.slug} ${n}: no ${v.k} reading notes`); }
        else throw new Error(`Voices ${b.slug} ${n}: unknown voice ${v.k}`);
        if (v.k === 'guzik' || SERK.includes(v.k)) { if (v.basis) throw new Error(`Voices ${b.slug} ${n} (${v.r}): no quoted basis for copyrighted commentators`); }
        const S = flat(src || '');
        for (const x of v.basis || []) if (!S.includes(flat(x))) throw new Error(`Voices ${b.slug} ${n} (${v.r}): not word for word in ${v.k}: "${x}"`);
        if (/[—]/.test(v.p)) throw new Error(`Voices ${b.slug} ${n} (${v.r}): no em dash in the paraphrase`);
        const nz = (t) => t.replace(/[ً-ْٰـ]/g, '').replace(/[ٱأإآ]/g, 'ا').replace(/[.،:؛,!؟«»"]/g, '').replace(/\s+/g, ' ').trim();
        const chText = nz(bible(b.id).chapters[n - 1].verses.map((x) => x.text).join(' '));
        for (const m of v.p.matchAll(/«([^»]+)»/g)) if (!chText.includes(nz(m[1]))) throw new Error(`Voices ${b.slug} ${n} (${v.r}): «${m[1]}» is not Van Dyck text of this chapter`);
        if ((v.basis || []).some((x) => x.split(/\s+/).length > 40)) throw new Error(`Voices ${b.slug} ${n} (${v.r}): basis too long`);
      }
      VOX[`${b.id}:${n}`] = list;
    }
  }
}
const VWHO = {
  calvin: { n: 'جون كالفن', d: 'مُصلِح جنيف (1509–1564)', rf: 1 },
  mhc: { n: 'ماثيو هنري', d: 'خادم مشيخي إنجليزي (1662–1714)', rf: 1 },
  mac: { n: 'جون ماك آرثر', d: 'راعي كنيسة جريس في كاليفورنيا (1939–2025)، كالفيني في عقيدة الخلاص' },
  guzik: { n: 'ديفيد جوزيك', d: 'راعٍ ومعلّم كتابي أمريكي، من كنائس كالفاري تشابل' },
  ryle: { n: 'ج. ك. رايل', d: 'أول أسقف لليفربول، إنجيلي مُصلَح (1816–1900)', rf: 1 },
  hodge: { n: 'تشارلز هودج', d: 'لاهوتي مشيخي في كلية برنستون (1797–1878)', rf: 1 },
  owen: { n: 'جون أوين', d: 'لاهوتي بيوريتاني إنجليزي (1616–1683)', rf: 1 },
  sproul: { n: 'ر. س. سبرول', d: 'لاهوتي مشيخي أمريكي، مؤسس خدمات ليجونير (1939–2017)', rf: 1 },
  piper: { n: 'جون بايبر', d: 'راعٍ ولاهوتي معمداني إصلاحي أمريكي، مؤسس Desiring God (وُلد 1946)' }
};
const VORDER = ['calvin', 'ryle', 'hodge', 'owen', 'mhc', 'sproul', 'piper', 'mac', 'guzik'];
const VWORK = (k, b) => (k === 'calvin' ? (b.group === 'gospels' && b.id !== 'John' ? 'تفسير توافق الأناجيل (1555)' : 'تفسير') : 'تفسير الكتاب المقدس كله (1706–1714)');
const MONTHS = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
const arDate = (d) => { const [y, m, dd] = d.split('-').map(Number); return `${ar(dd)} ${MONTHS[m - 1]} ${ar(y)}`; };
const vsrc = (v, b, n) => {
  const bn = esc(b.name.replace(/^إنجيل /, ''));
  if (v.k === 'guzik') { const C = CMT.guzik.chapters[`${b.slug}-${n}`]; return `<p class="vx5s"><b>المصدر:</b> تفسير Enduring Word (${C.lang === 'en' ? 'الأصل الإنجليزي' : 'الترجمة العربية'})، ${bn} ${ar(n)}، قسم «${esc(C.secs[v.sec])}». <a href="${esc(C.url)}" rel="noopener" target="_blank">افتح الصفحة</a></p>`.replace(/«([^»]*)»/g, '"$1"'); }
  if (v.k === 'mac') { const M = CMT.mac.sermons[v.ser]; return `<p class="vx5s"><b>المصدر:</b> عظة "${esc(M.t)}"، ${M.date ? arDate(M.date) + '، ' : ''}على ${bn} ${ar(M.ch)}: ${ar(M.v[0])}–${ar(M.v[1])} (رقم ${esc(v.ser.split('@')[0])}). <a href="${esc(M.url)}" rel="noopener" target="_blank">افتح العظة</a></p>`; }
  if (SERK.includes(v.k)) { const M = SREG(v.k)[v.ser]; const lab = M.kind || SLAB[v.k] || ''; return `<p class="vx5s"><b>المصدر:</b> ${lab ? lab + ' ' : ''}"${esc(M.t)}"، ${M.date ? arDate(M.date) + '، ' : ''}على ${bn} ${ar(M.ch)}: ${ar(M.v[0])}${M.v[1] !== M.v[0] ? '–' + ar(M.v[1]) : ''}. <a href="${esc(M.url)}" rel="noopener" target="_blank">افتح المصدر</a></p>`; }
  return `<p class="vx5s"><b>المصدر:</b> ${VWORK(v.k, b)}، على ${bn} ${ar(String(v.r).replace('-', '–'))}.</p><details><summary>العبارة الأصلية (بالإنجليزية)</summary>${(v.basis || []).map((x) => `<blockquote dir="ltr" lang="en">${esc(x)}</blockquote>`).join('')}</details>`;
};
let vxN = 0;
const voxBox = (b, n, r) => {
  const L = (VOX[`${b.id}:${n}`] || []).filter((v) => { const a = vspan(v.r), z = vspan(r); return a.some((x) => z.includes(x)); });
  if (!L.length) return '';
  const who = VORDER.filter((k) => L.some((v) => v.k === k));
  const id = 'vx' + (++vxN);
  const tabs = who.length > 1 ? `<div class="vx5t" role="tablist">${who.map((k, i) => `<button type="button" role="tab" data-vt="${id}-${k}" aria-selected="${i ? 'false' : 'true'}">${VWHO[k].n}${VWHO[k].rf ? '<i class="rd" title="مُصلَح"></i>' : ''}</button>`).join('')}</div>` : '';
  const panels = who.map((k, i) => `<div class="vx5p" id="${id}-${k}" role="tabpanel"${i ? ' hidden' : ''}><div class="vx5w"><b>${VWHO[k].n}</b>${VWHO[k].rf ? RTAG : ''}<small>${VWHO[k].d}</small></div>${L.filter((v) => v.k === k).map((v) => `<div class="vx5i"><p>${esc(v.p)}</p>${vsrc(v, b, n)}</div>`).join('')}</div>`).join('');
  const credit = who.includes('guzik') ? `<p class="vx5f" dir="ltr">${esc(CMT.guzik.credit)}</p>` : '';
  return `<div class="vx5"><div class="vx5h"><b>ماذا قال المفسرون؟</b><small>${who.length === 1 ? 'مفسر واحد' : who.length === 2 ? 'مفسران' : ar(who.length) + ' مفسرين'}</small></div>${tabs}${panels}<p class="vx5f">كلامهم ملخّص بتصرّف بالعربية، مع اسم الكتاب أو العظة والقسم بالضبط. اقتباسات كالفن وهنري الإنجليزية منقولة حرفياً من مصادرها.</p>${credit}</div>`;
};
const DTAG = { agreed: 'متفق عليه', likely: 'الرأي الراجح', debated: 'قضية تفسيرية' };
const dtag = (t) => (t && DTAG[t] ? `<span class="dtag ${t}">${DTAG[t]}</span>` : '');
const rlab = (n, r) => { const t = ar(String(r).replace(/\s*[-–]\s*/g, ' – ').replace(/;\s*/g, '، ')); return /[–،]/.test(t) ? `الآيات ${t}` : `الآية ${t}`; };

function deepSecs(b, n) {
  const depth = 2;
  const S = study(b, n), D = deepOf(b, n);
  const vs = bible(b.id).chapters[n - 1].verses;
  const prev = prevOf(b, n), next = nextOf(b, n);
  const F = D.flow || {};
  const units = F.units || [];
  const unitOf = (r) => { const a = vspan(r)[0]; return units.findIndex((u) => { const s = vspan(u.r); return a >= s[0] && a <= s[s.length - 1]; }); };
  const SEC = [];
  const sec = (id, t, sub, html) => { if (html) SEC.push({ id, t, sub, html: `<section class="dsec" id="${id}"><header class="dsh"><div><h2>${t}</h2><p>${sub}</p></div></header>${html}</section>` }); };

  // 1. flow of thought
  sec('d-flow', 'مسار الأصحاح', 'كيف يتحرك الفكر من البداية إلى النهاية', `${(F.intro || []).map((p) => `<p class="dbody">${gmd(p)}</p>`).join('')}
${units.length ? `<div class="dunits">${units.map((u) => `<a class="du" href="#dv${vspan(u.r)[0]}"><span class="dr">${ar(String(u.r).replace('-', ' – '))}</span><span class="dt"><b>${md(u.t)}</b><small>${gmd(u.d || '')}</small></span><span class="dk">${esc(u.kind || '')}</span></a>`).join('')}</div>` : ''}
${F.threads?.length ? `<h3 class="dh3">خيوط تربط الأصحاح</h3><div class="dgrid">${F.threads.map((t) => `<div class="dcard"><b>${md(t.t)}</b><p>${gmd(t.d)}</p></div>`).join('')}</div>` : ''}
${F.note ? `<div class="dnote"><b>${md(F.note.t)}</b><p>${gmd(F.note.d)}</p></div>` : ''}`);

  // 2. verse by verse
  const chips = `<nav class="dchips" aria-label="الآيات">${vs.map((v) => `<a href="#dv${v.number}">${ar(v.number)}</a>`).join('')}</nav>`;
  let lastU = -2;
  const blocks = (D.verses || []).map((V) => {
    const nums = vspan(V.r);
    const u = unitOf(V.r);
    const uh = u !== lastU && u >= 0 ? `<div class="dunit" id="du${u}"><span>${ar(String(units[u].r).replace('-', ' – '))}</span><h3>${md(units[u].t)}</h3></div>` : '';
    lastU = u;
    const text = nums.map((i) => `<sup>${ar(i)}</sup>${esc(vs[i - 1].text)}`).join(' ');
    return `${uh}<article class="dv${V.key ? ' key' : ''}" id="dv${nums[0]}">${nums.slice(1).map((i) => `<span id="dv${i}" class="anc"></span>`).join('')}
<div class="dvh"><span class="dref">${rlab(n, V.r)}</span>${V.key ? '<span class="dkey">آية محورية</span>' : ''}${dtag(V.tag)}</div>
<p class="dvt">${text}</p>
${V.notes?.length ? `<ul class="dnotes">${V.notes.map((x) => `<li>${gmd(x)}</li>`).join('')}</ul>` : ''}
${V.words?.length ? `<div class="dwords">${V.words.map((w) => `<div class="dw"><div class="dwg"><span class="gk" ${wl(w.g)}>${esc(w.g)}</span>${w.l && w.l !== w.g ? `<small ${wl(w.l)}>${esc(w.l)}</small>` : ''}</div><div class="dwb"><b>${md(w.t)}</b>${w.p ? `<small>${esc(w.p)}</small>` : ''}<p>${gmd(w.d)}</p></div></div>`).join('')}</div>` : ''}
${V.views?.length ? `<div class="dviews"><div class="dvlh"><b>قراءات المفسرين</b>${dtag(V.viewsTag)}</div><div class="dvg">${V.views.map((x) => `<div><b>${md(x.t)}</b>${dtag(x.tag)}<p>${gmd(x.d)}</p></div>`).join('')}</div></div>` : ''}
${V.extra ? `<div class="dnote sm"><b>${md(V.extra.t)}</b>${dtag(V.extra.tag)}<p>${gmd(V.extra.d)}</p></div>` : ''}
${voxBox(b, n, V.r)}</article>`;
  }).join('');
  sec('d-verses', 'الشرح آية بآية', `${vWord(vs.length)}، مع الكلمات ${b.testament === 'ot' ? 'العبرية' : 'اليونانية'} وتصريفها`, chips + blocks);

  // 3. background
  sec('d-bg', 'الخلفية التاريخية والثقافية', 'ما كان يعرفه القارئ الأول', D.background?.length ? `<div class="dgrid">${D.background.map((x) => `<div class="dcard"><div class="dch"><b>${md(x.t)}</b>${dtag(x.tag)}</div><p>${gmd(x.d)}</p></div>`).join('')}</div>` : '');

  // 4. Old Testament
  sec('d-ot', b.testament === 'nt' ? 'العهد القديم في الأصحاح' : 'الأصحاح في ضوء الكتاب كله', 'كل نص في سياقه الأصلي، ثم كيف يُبنى عليه', D.ot?.length ? D.ot.map((o) => `<div class="dot"><div><small>النص في سياقه</small><a class="r" href="${refHref(o.src, depth)}">${refLabel(o.src)}</a><p>${gmd(o.ctx)}</p></div><div><small>في ${esc(shortName(b))} ${ar(n)}${o.at ? `: ${ar(o.at)}` : ''}</small><p>${gmd(o.use)}</p>${dtag(o.tag)}</div><div class="add"><small>ماذا يضيف</small><p>${gmd(o.adds)}</p></div></div>`).join('') : '');

  // 5. theology
  sec('d-theo', 'اللاهوت', 'العقائد التي يؤسسها الأصحاح', D.theology?.length ? D.theology.map((x) => `<div class="dth"><div class="dthh"><b>${md(x.t)}</b>${x.r ? `<span>${rlab(n, x.r)}</span>` : ''}</div><p class="dbody">${gmd(x.d)}</p>${x.reformed || x.others ? `<div class="dth2">${x.reformed ? `<div><small>في الإيمان المُصلَح ${RTAG}</small><p>${gmd(x.reformed)}</p></div>` : ''}${x.others ? `<div><small>قراءات أخرى</small><p>${gmd(x.others)}</p></div>` : ''}</div>` : ''}</div>`).join('') : '');

  // 6. history of interpretation
  sec('d-hist', 'تاريخ التفسير', 'كيف قرأت الكنيسة هذا الأصحاح عبر القرون', D.history?.length ? `<div class="dhist">${D.history.map((v) => `<div class="dhv"><div><b>${md(v.n)}</b>${isRf(v.n) ? RTAG : ''}<small>${esc(v.y || '')}</small></div><div><small>${md(v.w || '')}</small><p>${gmd(v.d)}</p></div></div>`).join('')}</div><p class="dfine">ملخصات بتصرّف لأفكارهم من المؤلفات المذكورة، وليست اقتباسات حرفية.</p>` : '');

  // 7. issues
  sec('d-issues', 'مسائل الخلاف والنص', 'كل رأي بحجته، ومدى الاتفاق عليه', D.issues?.length ? `<div class="dissues">${D.issues.map((x) => `<div class="dis"><div class="dch"><b>${md(x.q)}</b>${dtag(x.tag)}</div>${x.d ? `<p>${gmd(x.d)}</p>` : ''}${x.views?.length ? `<div class="dvg">${x.views.map((y) => `<div><b>${md(y.t)}</b>${y.rf || rfView(y.t + ' ' + y.d) ? ' ' + RTAG : ''}<p>${gmd(y.d)}</p></div>`).join('')}</div>` : ''}${x.note ? `<p class="dfine">${gmd(x.note)}</p>` : ''}</div>`).join('')}</div>` : '');

  // 8. what it teaches
  sec('d-teach', 'ماذا يعلّمنا الأصحاح', 'خلاصة لاهوتية', D.teaches?.length ? `<div class="dteach">${D.teaches.map((x) => `<div><b>${md(x.t)}</b><p>${gmd(x.d)}</p></div>`).join('')}</div>` : '');

  // 9. further reading
  sec('d-more', 'للتوسع', 'مراجع موثوقة لمن يريد أن يكمل', D.further?.length ? `<div class="dmore">${D.further.map((x) => `<div><span dir="auto"><b>${esc(x.t)}</b></span><p>${md(x.d)}</p>${x.k ? `<small>${esc(x.k)}</small>` : ''}</div>`).join('')}</div>` : '');

  return Object.fromEntries(SEC.map((x) => [x.id, x]));
}

// ---------- people ----------
function peoplePages() {
  const list = [...PEOPLE.list].sort((a, b) => (b.prof ? 1 : 0) - (a.prof ? 1 : 0) || b.chapters - a.chapters || a.apps[0].b.order - b.apps[0].b.order);
  const mini = (p) => `<a class="mini" href="${personHref(p, 0)}" data-t="${p.testament}" data-q="${esc(p.label + ' ' + (p.prof ? p.prof.full + ' ' + p.prof.role : ''))}"><div class="in"><div class="im${PIMG.has(p.id) ? ' pic' : ''}">${PIMG.has(p.id) ? `<img src="assets/${PIMG.get(p.id)}" alt="" loading="lazy">` : `<span>${esc(p.mono)}</span>`}</div><div class="tx"><b>${esc(p.prof ? p.prof.n : p.label)}</b><small>${esc(p.prof ? p.prof.role : ar(`${shortName(p.apps[0].b)} ${p.apps[0].n}`))}</small></div></div></a>`;
  // design-v3: the curated profiles as a deck of flip cards, grouped by era (from where each first appears).
  const eraOf = (p) => { const a = p.apps[0]; return p.testament === 'nt' ? 'العهد الجديد' : a.b.id === 'Gen' ? (a.n <= 11 ? 'البدايات' : 'الآباء') : 'الخروج والبرية'; };
  const curated = PEOPLE.list.filter((p) => p.prof && hasPage(p)).sort((a, b) => a.apps[0].b.order - b.apps[0].b.order || a.apps[0].n - b.apps[0].n);
  const eras = [...new Set(curated.map(eraOf))];
  const PBG = ['#26231F', '#1F2A44', '#3A2A2E', '#2A3328', '#33281F', '#2B2F40'];
  const flip = (p, i) => { const P = p.prof; return `<div class="fl3" data-era="${esc(eraOf(p))}" style="--d:${(i * 0.04).toFixed(2)}s"><button type="button" class="in" aria-pressed="false" aria-label="اقلب بطاقة ${esc(P.n)}">
<span class="fc h3p"><span class="hd"><b>${esc(P.n)}</b>${P.he ? `<span lang="${p.testament === 'ot' ? 'he' : 'el'}">${esc(P.he)}</span>` : ''}</span><span class="im${PIMG.has(P.id) ? ' pic' : ''}" style="--bg:${PBG[i % 6]}">${PIMG.has(P.id) ? `<img src="assets/${PIMG.get(P.id)}" alt="" loading="lazy">` : `<span>${esc([...P.n][0])}</span>`}<em>${esc(P.era || '')}</em></span><span class="rl">${esc(P.role)}</span><span class="ln">${esc(P.line)}</span><span class="cl">${(P.cells || []).slice(0, 3).map(([k, v]) => `<span><small>${esc(k)}</small>${esc(v)}</span>`).join('')}</span><span class="tip">اضغط لتقلب البطاقة</span></span>
<span class="bc"><b>${esc(P.full)}</b>${(P.facts || []).slice(0, 3).map(([k, v]) => `<span class="f"><small>${esc(k)}</small>${esc(v)}</span>`).join('')}${P.strong ? `<span class="f"><small>القوة</small>${esc(P.strong)}</span>` : ''}${P.weak ? `<span class="f"><small>الضعف</small>${esc(P.weak)}</span>` : ''}</span>
</button><a class="go3" href="${personHref(p, 0)}">الملف الكامل ${IC.chev}</a></div>`; };
  const deck = `<section class="pp3"><div class="top"><div><span class="ey">مجموعة بطاقات</span><h1>الشخصيات</h1><p>${ar(curated.length)} بطاقة منسّقة: الاسم، والمعنى، والدور. اقلب البطاقة لترى الحقائق، ونقاط القوة والضعف.</p></div>
<div class="h3g" role="tablist" aria-label="العصور"><button type="button" role="tab" aria-selected="true" data-era-tab="all">الكل</button>${eras.map((e) => `<button type="button" role="tab" aria-selected="false" data-era-tab="${esc(e)}">${esc(e)}</button>`).join('')}</div></div>
<div class="fl3g">${curated.map(flip).join('')}</div></section>
<h2 class="pp3all">كل الشخصيات في الأصحاحات المدروسة</h2>`;
  const body = `${deck}
<div class="pad" style="padding-top:8px"><p class="lead" style="font-size:15.5px">بطاقة تعريف لكل شخص في الأصحاحات المدروسة. اقلب البطاقة لتعرف من هو، وأين يظهر، وكيف ترتبط قصته بالمسيح.</p></div>
<label class="search">${IC.search}<input type="search" id="pq" placeholder="ابحث باسم الشخصية" aria-label="ابحث باسم الشخصية"></label>
<div class="chips" id="pchips"><button type="button" data-t="all" aria-pressed="true">الكل · ${ar(list.length)}</button><button type="button" data-t="ot" aria-pressed="false">العهد القديم</button><button type="button" data-t="nt" aria-pressed="false">العهد الجديد</button></div>
<div class="pgrid" id="pgrid">${list.map(mini).join('')}</div>`;
  write('people.html', page({ title: 'الشخصيات', depth: 0, nav: 'people', body, cls: 'v3' }));
  for (const p of list.filter(hasPage)) {
    const depth = 1;
    const P = p.prof;
    const map = P?.map ? MAPS.find((m) => m.id === P.map) : null;
    if (PIMG.has(p.id)) { p.img = `../assets/${PIMG.get(p.id)}`; p.imgCredit = PIMG.get(p.id).endsWith('.svg') ? 'رسم توضيحي (تجريبي)' : 'صورة تخيلية'; }
    const after = `<div class="viewer on inline" id="viewer">
<div class="vtop"><a href="../people.html" aria-label="الشخصيات">${IC.back}</a><span>${esc(P ? P.full : p.label)}</span><span style="width:44px"></span></div>
<div class="stage"><div class="pcard"><div class="pin"></div></div></div>
<div class="dots"></div><div class="hint">اسحب يميناً أو يساراً لتقلب البطاقة</div>
${cardTemplate(p, {})}
<a class="full" href="#file">الملف الكامل ${IC.up.replace('M6 15l6-6 6 6', 'M6 9l6 6 6-6').replace('class="ic"', 'class="ic" style="width:14px;height:14px;display:inline;vertical-align:middle"')}</a>
</div>`;
    const body = `<div id="file" class="pp-app" data-person="${p.id}"><div class="dh" style="padding:24px 0 6px"><span class="ey">${p.testament === 'ot' ? 'العهد القديم' : 'العهد الجديد'}</span><h1>${esc(P ? P.full : p.label)}</h1>${P ? `<p>${md(P.role)}</p>` : ''}</div>
<div class="dc" style="padding:8px 0 0">${P ? `<p class="lead">${md(P.line)}</p>` : ''}
${map ? `<a class="mcard" href="../maps/${map.id}.html" style="margin:0 0 20px"><div class="mv">${thumb({ m: map, j: 0, idx: map.journeys[0].stops.map((_, i) => i) }, 'navy', 'all', 2.15)}</div><div class="mt"><b>${esc(map.title)}</b><span>${esc(map.sub)}</span></div></a>` : ''}
<h3>في الأصحاحات المدروسة</h3>${p.apps.map((a) => `<div class="blk"><h3><a class="r" href="../book/${a.b.slug}/${a.n}.html#p-${p.id}">${chTitle(a.b, a.n)}</a>${study(a.b, a.n) ? `<span class="meta" style="margin-inline-start:auto">${md(study(a.b, a.n).title)}</span>` : ''}</h3><p>${md(a.d)}</p></div>`).join('')}
</div></div>`;
    write(`people/${p.id}.html`, page({ title: P ? P.full : p.label, depth, nav: 'people', body, cls: 'person', after: '' }).replace('<main class="main">', `<main class="main">${after}`));
    delete p.img; delete p.imgCredit;
  }
}

// ---------- maps ----------
function mapsPages() {
  const card = (m) => `<a class="mcard" href="maps/${m.id}.html"><div class="mv">${thumb({ m, j: 0, idx: m.journeys[0].stops.map((_, i) => i) }, 'navy', 'all', 2.15)}</div><div class="mt"><small>${bookById[m.book].testament === 'nt' ? 'العهد الجديد' : 'العهد القديم'} · ${esc(shortName(bookById[m.book]))}</small><b>${esc(m.title)}</b><span>${esc(m.sub)} · ${ar(m.journeys.reduce((a, j) => a + j.stops.length, 0))} محطة${m.journeys.length > 2 ? ` في ${ar(m.journeys.length)} رحلات` : m.journeys.length === 2 ? ' في رحلتين' : ''}</span></div></a>`;
  const soon = (t, d) => `<div class="mcard off"><div class="mv">قريباً</div><div class="mt"><b>${t}</b><span>${d}</span></div></div>`;
  const body = `${header({ back: 'index.html', title: 'الخرائط والشروح' })}
<div class="pad" style="padding-top:8px"><p class="lead" style="font-size:15.5px">خرائط تربط الأحداث بأماكنها. افتح خريطة، ثم تنقّل بين المحطات بالترتيب، وكل محطة تأخذك إلى الأصحاح الذي جرت فيه.</p></div>
<div class="mcards">
<a class="mcard" href="journey.html"><div class="mv" style="background:var(--ink);display:grid;place-items:center;color:var(--gold2);font-family:var(--nas);font-size:40px">١٤</div><div class="mt"><small>الكتاب كله</small><b>القصة في أربع عشرة مرحلة</b><span>من الخليقة إلى السماء الجديدة، بالترتيب التاريخي.</span></div></a>
${MAPS.map(card).join('')}
${soon('خدمة المسيح', 'الجليل واليهودية والسامرة وأورشليم.')}${soon('الممالك والإمبراطوريات', 'إسرائيل ويهوذا وأشور وبابل وفارس.')}
</div>`;
  const xcard = xCard;
  const body2 = body.replace('<div class="mcards">', `<div class="sec-t" style="padding:0 20px">شروح مصوّرة</div><div class="mcards">${EXPLAINERS.map(xcard).join('')}</div><div class="sec-t" style="padding:0 20px">الخرائط</div><div class="mcards">`);
  write('maps.html', page({ title: 'الخرائط والشروح', depth: 0, nav: 'maps', body: body2 }));
  for (const x of EXPLAINERS) write(`explain/${x.id}.html`, page({ title: x.title, depth: 1, body: explainPage(x, 1), cls: 'explain' }));
  for (const x of EXPLAINERS) write(`explain/${x.id}-present.html`, page({ title: `وضع العرض · ${x.title}`, depth: 1, body: explainPresent(x, 1), cls: 'present immersive' }));
  for (const m of MAPS) {
    if (m.paul) continue;
    write(`maps/${m.id}.html`, page({ title: m.title, depth: 1, body: '', cls: 'immersive mappage', after: viewer(m, 1, { back: '../maps.html' }) }));
  }
  // Paul: story map (real geography + ordered cards)
  const pmArgs = (depth) => ({ depth, people: PEOPLE.list, personHref, imgOf: (id, d) => (PIMG.has(id) ? `${'../'.repeat(d)}assets/${PIMG.get(id)}` : '') });
  write('maps/paul.html', page({ title: 'رحلات بولس', depth: 1, nav: 'maps', body: paulMapPage(pmArgs(1)), cls: 'v3 pmpage' }));
  write('paul.html', page({ title: 'رحلات بولس', depth: 0, nav: 'maps', body: paulMapPage(pmArgs(0)), cls: 'v3 pmpage' }));
}

function journeyPage() {
  const J = readJSON('data/journey.json');
  const ERA_BOOKS = { 1: ['Gen'], 2: ['Gen', 'Job'], 3: ['Exod', 'Lev', 'Num', 'Deut'], 4: ['Josh', 'Judg', 'Ruth'], 5: ['1Sam', '2Sam', '1Chr', 'Ps', 'Prov', 'Eccl', 'Song'], 6: ['1Kgs', '2Kgs', '2Chr', 'Joel', 'Jonah', 'Amos', 'Hos', 'Isa', 'Mic', 'Nah', 'Zeph', 'Hab'], 7: ['Jer', 'Lam', 'Ezek', 'Dan', 'Obad'], 8: ['Ezra', 'Neh', 'Esth', 'Hag', 'Zech', 'Mal'], 9: [], 10: ['Matt', 'Mark', 'Luke', 'John'], 11: ['Acts', 'Jas'], 12: ['Acts', 'Gal', '1Thess', '2Thess', '1Cor', '2Cor', 'Rom', 'Eph', 'Col', 'Phlm', 'Phil', '1Tim', 'Titus', '2Tim'], 13: ['Heb', '1Pet', '2Pet', 'Jude', '1John', '2John', '3John'], 14: ['Rev'] };
  const ERA_MAP = { 1: 'beginnings', 2: 'abraham', 3: 'exodus', 12: 'paul' };
  const cards = J.eras.map((e, i) => `<div class="cc" data-i="${i}">
<div class="k"><span>المرحلة ${ar(e.n)} من ١٤</span><span class="st">${esc(e.dates)}</span></div>
<div class="num" style="font-size:40px;line-height:1.35;margin-top:18px">${esc(e.title)}</div>
<p style="margin-top:12px;-webkit-line-clamp:7">${md(e.summary)}</p>
<div class="pchips" style="margin-top:auto;padding-top:14px">${(ERA_BOOKS[e.n] || []).map((id) => `<a href="${bookHref(bookById[id], 0)}" style="font-family:var(--ui);font-size:12px;border:1px solid var(--line);border-radius:6px;padding:3px 9px;color:var(--ink)">${esc(shortName(bookById[id]))}</a>`).join('')}${e.n === 9 ? '<span>فترة ما بين العهدين: لا أسفار قانونية</span>' : ''}</div>
${ERA_MAP[e.n] ? `<a class="go" style="margin-top:12px;align-self:flex-start" href="maps/${ERA_MAP[e.n]}.html">${IC.map}الخريطة</a>` : ''}</div>`).join('');
  const body = `${header({ back: 'maps.html', title: 'القصة في مراحل' })}
<div class="pad" style="padding-top:6px"><p class="lead" style="font-size:15.5px">الكتاب المقدس قصة واحدة تتجه نحو المسيح. اسحب لتتنقل بين مراحلها الأربع عشرة بالترتيب التاريخي.</p></div>
<div class="car" id="car" data-kind="eras">${cards}</div>
<div class="scrub" id="scrub" style="justify-content:center">${J.eras.map((e, i) => `<button type="button" data-jump="${i}">${ar(e.n)}</button>`).join('')}</div>`;
  write('journey.html', page({ title: 'القصة في مراحل', depth: 0, nav: 'explore', body }));
}

// ---------- search index (loaded on demand by the search panel) ----------
function treeHtml() {
  const profiles = {};
  for (const p of PEOPLE.list) if (p.prof && hasPage(p)) profiles[p.prof.id] = { prof: p.prof, href: personHref(p, 0), img: PIMG.has(p.prof.id) ? `assets/${PIMG.get(p.prof.id)}` : '' };
  // Tree nodes without a full profile that are the same person as a people page (checked by hand: same verse and
  // context). Not mapped on purpose: lamech (Noah's father; the people page «لامك» is Cain's line), the king Manasseh,
  // Eleazar and Jacob of Matthew 1, and Mary (Christ's mother is not pictured).
  const TREE_PEOPLE = { cain: 'p158t56v', abel: 'p1548w9u', seth: 'pscebrl', enoch: 'p13dxyjt', methuselah: 'p1ig2dy1', shem: 'pscgl4l', ham: 'psce2nf', japheth: 'pc0l4tf', peleg: 'pc0c59m', terah: 'pbyj791', hagar: 'pc0amqh', keturah: 'p158hk81', rebekah: 'pc0ohq7', ishmael: 'p1ofuu2v', leah: 'pc0x5j9', rachel: 'p15hgaz5', esau: 'pc0ugb0', judah: 'p15d5vee', reuben: 'pjkxdne', simeon: 'p13mfeea', levi: 'p1s6xtlw', dan: 'psce48a', benjamin: 'pq4ihwu', dinah: 'pbyjqcu', amram: 'p15lr6nf', asenath: 'p13dklcv', manasseh: 'pc0wfp9', ephraim: 'pn20yv3', tamar: 'p13isqmz', hezron: 'p13h15oj', nahshon: 'pm66z64', elisheba: 'p1dog8a3', rahab: 'p15hgdio', david: 'pbyh5cb', josephm: 'p10canbp', john: 'pd599of' };
  const pages = {};
  for (const [tid, pid] of Object.entries(TREE_PEOPLE)) {
    const p = PEOPLE.list.find((x) => x.id === pid);
    if (!p || !hasPage(p)) throw new Error(`tree: no people page ${pid} for ${tid}`);
    pages[tid] = { href: personHref(p, 0), img: PIMG.has(pid) ? `assets/${PIMG.get(pid)}` : '' };
  }
  write('tree.html', page({ title: 'شجرة العائلة', depth: 0, nav: 'explore', body: treePage({ profiles, pages }), cls: 'v3' }));
}
treeHtml();
write('glossary.html', page({ title: 'القاموس: كلمات الكتاب الصعبة', depth: 0, nav: 'explore', body: glossaryPage(0), cls: 'v3' }));
write('harmony.html', page({ title: 'الأناجيل جنباً إلى جنب: إشباع الخمسة الآلاف', depth: 0, nav: 'explore', body: harmonyPage(0), cls: 'v3' }));

function searchIndex() {
  const items = [];
  const add = (k, t, sub, h) => items.push([k, t, sub, h]);
  for (const b of books) {
    add('b', b.name, `${b.groupName} · ${chWord(b.chapters)}`, `book/${b.slug}.html`);
    if (content[b.id]?.intro) add('i', `عن سفر ${shortName(b)}`, 'مقدمة السفر', `book/${b.slug}/about.html`);
    for (const [n, S] of Object.entries(content[b.id]?.chapters || {})) if (!previewSkip(b)) add('c', `${shortName(b)} ${ar(n)}: ${S.title}`, S.section || '', `book/${b.slug}/${n}.html`);
  }
  for (const p of PEOPLE.list) add('p', p.prof ? p.prof.full : p.label, p.prof ? p.prof.role : `${shortName(p.apps[0].b)} ${ar(p.apps[0].n)}`, personHref(p, 0));
  for (const x of EXPLAINERS) add('x', x.title, 'شرح مصوّر · ' + x.sub, `explain/${x.id}.html`);
  for (const m of MAPS) add('m', m.title, 'خريطة', mapHref(m, 0));
  for (const t of TOPICS) add('t', t.ar, 'موضوع كتابي · ' + t.short.slice(0, 60), `topics/${t.id}.html`);
  for (const w of buildLibrary({ books, content }).works) add('l', w.title, 'المكتبة · ' + w.n, 'library.html#' + w.id);
  for (const e of GLOSSARY) add('g', e.w, 'القاموس · ' + e.d.slice(0, 70), 'glossary.html#' + e.id);
  const refs = books.map((b) => [b.name, b.abbr, b.slug, b.chapters, previewSkip(b) ? 1 : 0, b.id]);
  fs.writeFileSync(path.join(DIST, 'assets/search.js'), `window.SIDX=${JSON.stringify({ refs, items })};`);
  // Full text of Van Dyck for searching inside verses, loaded only when someone searches the text.
  // Shown as written, without vowel marks (spelling, hamza, ة and ى kept). The page folds a copy for matching; folding is one letter for one letter, so positions line up.
  // Books separated by \v, chapters by \f, verses by \n (verse numbers are contiguous).
  const bare = (t) => t.replace(/[\u064B-\u065F\u0670\u0640]/g, '').replace(/ٱ/g, 'ا');
  fs.writeFileSync(path.join(DIST, 'assets/bible-search.js'), `window.BTXT=${JSON.stringify(books.map((b) => bible(b.id).chapters.map((c) => c.verses.map((v) => bare(v.text)).join('\n')).join('\f')).join('\v'))};`);
}

// ---------- run ----------
const PLANS_UI = buildPlans({ content, write, page, people: PEOPLE, personHref, pimg: (id, d) => (PIMG.has(id) ? `${'../'.repeat(d)}assets/${PIMG.get(id)}` : ''), topicLinks, explainersFor, explainHref, mapForChapter });
home();
hubs();
await buildOverview({ write, page });
// ---------- sign in (works once site.config.json auth keys are set; see docs/login-setup.md) ----------
write('login.html', page({ title: 'تسجيل الدخول', depth: 0, nav: 'login', cls: 'v3 loginpage', body: `<section class="lg" data-login>
<div class="lgart" aria-hidden="true"><img src="assets/person-p129y7pi.webp" alt=""><div><p>«${esc(quoteText('Ps.119.105'))}»</p><small>${refLabel('Ps.119.105')}</small></div></div>
<div class="lgbox">
<div class="lgout">
<span class="lgk">${BRAND}</span><h1>أهلاً بك</h1>
<p class="lgs">سجّل دخولك ليُحفظ تقدّمك في خطط القراءة، وتكمل من حيث توقفت على أي جهاز.</p>
<button type="button" class="lgg" data-google><svg viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.6l6.7-6.7C35.6 2.4 30.2 0 24 0 14.6 0 6.6 5.4 2.7 13.2l7.8 6.1C12.4 13.6 17.7 9.5 24 9.5z"/><path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17.5z"/><path fill="#FBBC05" d="M10.5 28.7A14.5 14.5 0 0 1 9.5 24c0-1.6.3-3.2.8-4.7l-7.8-6.1A24 24 0 0 0 0 24c0 3.9.9 7.5 2.6 10.8l7.9-6.1z"/><path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.9 2.3-8.4 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.6 42.6 14.6 48 24 48z"/></svg>المتابعة بحساب Google</button>
<div class="lgor"><span>أو</span></div>
<form data-email-form novalidate><label for="lgemail">البريد الإلكتروني</label><input id="lgemail" name="email" type="email" inputmode="email" autocomplete="email" placeholder="name@example.com" dir="ltr"><button type="submit">أرسل لي رابط الدخول</button></form>
<p class="lgmsg" data-msg hidden role="status"></p>
<p class="lgfine">بلا كلمة مرور: نرسل لك رابطاً تدخل به. لا نستخدم بريدك إلا للدخول، ولا نرسل رسائل أخرى.</p>
<a class="lgskip" href="index.html">المتابعة بدون حساب ${IC.chev}</a>
<p class="lgsoon">تسجيل الدخول غير مفعّل بعد في هذه النسخة من الموقع. يمكنك استخدام كل شيء بدون حساب، ويُحفظ تقدّمك على هذا الجهاز.</p>
</div>
<div class="lgin"><span class="lgk">${BRAND}</span><h1>أنت مسجّل الدخول</h1><p class="lgs" data-who></p><p class="lgs">تقدّمك في خطط القراءة محفوظ ومتزامن على أجهزتك.</p><a class="lgbtn" href="plans.html">خطط القراءة ${IC.chev}</a><button type="button" class="lgsignout" data-signout>تسجيل الخروج</button></div>
</div></section>` }));
testament('ot');
testament('nt');
for (const b of books) {
  bookPage(b);
  if (content[b.id]?.intro) aboutPage(b);
  if (previewSkip(b)) continue;
  for (let n = 1; n <= b.chapters; n++) { chapterPage(b, n); if (deepOf(b, n) && study(b, n)) write(`book/${b.slug}/${n}-study.html`, `<!DOCTYPE html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><title>${esc(chTitle(b, n))}: دراسة معمّقة</title><meta name="robots" content="noindex"><script>try{localStorage.setItem('sola.mode','ds')}catch(e){}location.replace('${n}.html'+(location.hash||'#x-comm'))</script><meta http-equiv="refresh" content="0;url=${n}.html#x-comm"></head><body><a href="${n}.html#x-comm">${esc(chTitle(b, n))}: الدراسة المعمّقة</a></body></html>`); }
}
peoplePages();
mapsPages();
journeyPage();
const LIB = buildLibrary({ books, content });
write('topics.html', page({ title: 'موضوعات كتابية', depth: 0, nav: 'topics', body: topicsIndex(0), cls: 'library' }));
for (const t of TOPICS) write(`topics/${t.id}.html`, page({ title: t.ar, depth: 1, nav: 'topics', body: topicPage(t, 1), cls: 'library topicpage' }));
write('library.html', page({ title: 'المكتبة اللاهوتية', depth: 0, nav: 'library', body: libraryPage(LIB, 0), cls: 'library' }));
searchIndex();
// sitemap, robots, icon
fs.writeFileSync(path.join(DIST, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${PAGES.filter((r) => !r.startsWith('maps/')).map((r) => `<url><loc>${config.domain}/${r === 'index.html' ? '' : r}</loc></url>`).join('\n')}\n</urlset>\n`);
fs.writeFileSync(path.join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${config.domain}/sitemap.xml\n`);
fs.writeFileSync(path.join(DIST, 'assets/icon.svg'), '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#17191E"/><g fill="none" stroke="#D7C49A" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"><path d="M32 19c-6-4-13-5-20-4v30c7-1 14 0 20 4 6-4 13-5 20-4V15c-7-1-14 0-20 4z"/><path d="M32 19v30"/></g></svg>');
// ---------- social image sources (only with OG=1; scripts/make-og.py turns them into PNGs) ----------
if (process.env.OG) {
  const card = (k, ey, title, sub, mo) => fs.writeFileSync(path.join(DIST, `og-src-${k}.html`), `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><link rel="stylesheet" href="og-fonts.css"><style>html{overflow:hidden;width:1200px;height:630px}body{margin:0;width:1200px;height:630px;background:#17191E;color:#FAF8F4;font-family:'IBM Plex Sans Arabic',sans-serif;display:flex;align-items:center;gap:56px;padding:0 72px;box-sizing:border-box;overflow:hidden;position:relative}.t{flex:1;min-width:0}small{color:#D7C49A;font-size:26px;font-weight:600}h1{font-family:'Readex Pro',sans-serif;font-size:${title.length > 14 ? 72 : 96}px;line-height:1.1;margin:12px 0 0}p{font-size:28px;color:#C9C3B8;margin:18px 0 0;line-height:1.6}.b{position:absolute;bottom:40px;right:72px;font-family:'Readex Pro';font-size:24px;color:#A8A296}.m{display:grid;grid-template-columns:repeat(${mo.length > 8 ? 4 : mo.length > 4 ? 3 : 2},96px)}.sp{display:flex;align-items:flex-end;gap:3px;height:300px;border-bottom:4px solid #B39459;width:420px}.sp i{flex:1;border-radius:2px 2px 0 0;opacity:.6}.sp i.on{opacity:1;box-shadow:0 0 0 2px #FAF8F4}.em{width:260px;height:260px;border-radius:56px;display:grid;place-items:center}.em svg{width:62%;height:62%}.x{display:none;gap:12px}.m i{width:96px;height:96px;border-radius:20px;display:grid;place-items:center}.m svg{width:60%;height:60%}circle.r{fill:none;stroke:#B39459;opacity:.18}</style></head><body><svg style="position:absolute;left:0;top:0" width="1200" height="630"><circle class="r" cx="180" cy="120" r="370"/></svg><div class="t"><small>${ey}</small><h1>${esc(title)}</h1><p>${esc(sub)}</p></div>${typeof mo === 'string' ? mo : mo.length ? `<div class="m">${mo.slice(0, 12).map((c) => `<i style="background:${c.color};color:${c.ink}">${glyph(c.icon, 40)}</i>`).join('')}</div>` : ''}<span class="b">لمجد الله · ${esc(config.domain.replace(/^https?:\/\//, ''))}</span></body></html>`);
  card('default', 'دراسة الكتاب المقدس من منظور مُصلَح', config.nameAr, 'سفراً سفراً، وأصحاحاً أصحاحاً: النص، والقصة، والدراسة، والشروح المصوّرة.', EXPLAINERS.flatMap((x) => xChips(x)).filter((c, i, a) => a.findIndex((d) => d.icon === c.icon) === i).filter((_, i) => i % 3 === 0).slice(0, 12));
  for (const x of EXPLAINERS) card(`explain-${x.id}`, `شرح مصوّر · ${bookById[x.book].name}`, x.title, x.sub, xChips(x));
  // one image per book (the testament's shelf with this book lit) and per topic (its emblem in the group colour)
  const SPC = { torah: '#8C2F1E', history: '#9A5A24', poetry: '#B39459', major: '#4E5D32', minor: '#6B7A4A', gospels: '#1F2A44', acts: '#2E4A6B', paul: '#4B3D63', general: '#34496B', prophecy: '#5A3A22' };
  for (const b of books) {
    const list = books.filter((o) => o.testament === b.testament);
    const sp = `<div class="sp">${list.map((o) => `<i class="${o === b ? 'on' : ''}" style="background:${o === b ? '#B39459' : SPC[o.group]};height:${Math.round(40 + Math.sqrt(o.chapters) * 22)}px"></i>`).join('')}</div>`;
    const v = bible(b.id).chapters[0].verses[0].text, vs = v.length > 120 ? v.slice(0, 118).replace(/\s+\S*$/, '') + '…' : v;
    card(`book-${b.slug}`, `${esc(T_NAME[b.testament])} · السفر ${ar(b.order)} من ٦٦ · ${chWord(b.chapters)}`, b.name, `${vs} (${plain(refLabel(`${b.id}.1.1`))})`, sp);
  }
  const GC = { 1: '#B39459', 2: '#8C2F1E', 3: '#3E7A5A', 4: '#1F2A44', 5: '#5A4A7A' }, EMB = { 1: 'lamp', 2: 'door', 3: 'loaves', 4: 'table', 5: 'shofar' }, GN = { 1: 'الأسس', 2: 'الخلاص', 3: 'حياة المؤمن', 4: 'الكنيسة والعبادة', 5: 'الأمور الأخيرة' };
  for (const t of TOPICS) card(`topic-${t.id}`, `موضوع كتابي · ${GN[t.group]}`, t.ar, t.short, `<div class="em" style="background:${GC[t.group]};color:#FAF8F4">${glyph(EMB[t.group], 120)}</div>`);
  card('tree', 'شجرة العائلة · من آدم إلى المسيح', 'نسل الوعد', 'نسب المسيح جيلاً بعد جيل، ومعه الزوجات والإخوة وأهم الأقارب، وكل اسم مربوط بآيته.', []);
  card('harmony', 'الأناجيل جنباً إلى جنب', 'إشباع الخمسة الآلاف', 'حادثة واحدة في الأناجيل الأربعة: ما تتفق عليه، وما ينفرد به كل إنجيل.', []);
}

// ---------- cross references ----------
// One small file per chapter: { verse: { s: [[ref, why, kind]], o: [[ref, votes]], t: [refs] } }.
//   s: references our deep study cites for the verse, with the sentence that explains the link (best, shown first).
//   o: OpenBible.info pairs ranked by readers' votes (neighbouring verses joined), weak ones (< 3 votes) dropped.
//   t: the rest of the Treasury of Scripture Knowledge, for the "more" list.
// Every reference must exist in Van Dyck, or the build stops.
{
  const X = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/sources/tsk-xref.json'), 'utf8')).x;
  const O = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/sources/openbible-xref.json'), 'utf8')).x;
  const has = (id, c, v) => { const B = bookById[id] && bible(id); return !!(B && B.chapters[c - 1] && B.chapters[c - 1].verses[v - 1]); };
  const per = {};
  const at = (k) => { const [id, c, v] = k.split('.'); return (((per[id] ||= {})[c] ||= {})[v] ||= {}); };
  for (const [k, refs] of Object.entries(X)) {
    for (const r of refs) { const m = r.match(/^(\w+)\.(\d+)\.(\d+)(?:-(\w+)\.(\d+)\.(\d+))?$/); if (!m || !has(m[1], +m[2], +m[3]) || (m[4] && !has(m[4], +m[5], +m[6]))) throw new Error(`TSK: ${k} -> ${r} not in Van Dyck`); }
    at(k).t = refs.map((r) => r.replace(/^(\w+)\.(\d+)\.(\d+)-\1\.\2\.(\d+)$/, '$1.$2.$3-$4'));
  }
  for (const [k, list] of Object.entries(O)) {
    // join neighbouring verses of the same chapter into one range (votes: the highest)
    const keep = list.filter((x) => x[1] >= 3).map(([r, n]) => { const [b, c, v] = r.split('.'); const [a, z] = v.split('-').map(Number); return { b, c: +c, a, z: z || a, n }; });
    keep.sort((p, q) => (p.b + p.c).localeCompare(q.b + q.c) || p.a - q.a);
    const joined = [];
    for (const x of keep) { const L = joined[joined.length - 1]; if (L && L.b === x.b && L.c === x.c && x.a <= L.z + 1) { L.z = Math.max(L.z, x.z); L.n = Math.max(L.n, x.n); } else joined.push({ ...x }); }
    joined.sort((p, q) => q.n - p.n);
    if (joined.length) at(k).o = joined.slice(0, 40).map((x) => [`${x.b}.${x.c}.${x.a}` + (x.z > x.a ? `-${x.z}` : ''), x.n]);
  }
  let nS = 0;
  for (const b of books) for (const [n, d] of Object.entries(content[b.id]?.deep || {})) {
    const S = studyRefs(b.id, +n, d);
    for (const [v, list] of Object.entries(S)) { at(`${b.id}.${n}.${v}`).s = list; nS += list.length; }
  }
  for (const [id, chs] of Object.entries(per)) for (const [c, vs] of Object.entries(chs)) {
    for (const e of Object.values(vs)) {
      const seen = new Set((e.s || []).map((x) => x[0]));
      if (e.o) { e.o = e.o.filter((x) => !seen.has(x[0])); e.o.forEach((x) => seen.add(x[0])); if (!e.o.length) delete e.o; }
      if (e.t) { const cov = (r) => { const [b2, c2, v2] = r.split('.'); const a2 = +v2.split('-')[0]; return [...seen].some((s) => { const [b1, c1, v1] = s.split('.'); const [x, z] = v1.split('-').map(Number); return b1 === b2 && c1 === c2 && a2 >= x && a2 <= (z || x); }); }; e.t = e.t.filter((r) => !cov(r)); if (!e.t.length) delete e.t; }
    }
    const dir = path.join(DIST, 'xref', id); fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, `${c}.json`), JSON.stringify(vs));
  }
  console.log('cross references: ' + nS + ' from the studies');
}

// ---------- offline reading (PWA) ----------
// Pages are kept in the browser's cache as you open them, so they can be read again without a connection.
// This is a cache of public pages only: nothing about the reader is stored.
write('offline.html', page({ title: 'لا يوجد اتصال', depth: 0, nav: 'home', cls: 'v3', body: `<section class="off3"><span class="ic">${IC.read}</span><h1>لا يوجد اتصال بالإنترنت</h1><p>هذه الصفحة لم تُفتح من قبل على هذا الجهاز، فلا توجد نسخة محفوظة منها. الصفحات التي فتحتها سابقاً تعمل بدون إنترنت.</p><a class="btn3" href="index.html">الرئيسية</a></section>` }));
fs.writeFileSync(path.join(DIST, 'manifest.webmanifest'), JSON.stringify({
  name: config.nameAr, short_name: config.nameAr, description: config.description, lang: 'ar', dir: 'rtl',
  start_url: './index.html', scope: './', display: 'standalone', background_color: '#FAF8F4', theme_color: '#17191E',
  icons: [{ src: 'assets/icon-192.png', sizes: '192x192', type: 'image/png' }, { src: 'assets/icon-512.png', sizes: '512x512', type: 'image/png' }, { src: 'assets/icon-512-mask.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }]
}, null, 1));
{
  const hash = (str) => { let h = 2166136261; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0).toString(36); };
  const core = ['index.html', 'offline.html', 'assets/v2.css', 'assets/v3.css', 'assets/v2.js', 'assets/v3.js', 'assets/search.js', 'assets/icon.svg'];
  // the version covers every script and stylesheet (not only the core list), so a change to any of them, like the
  // atonement film in t3d.js, makes browsers drop the old cache instead of serving the old file
  const allAssets = fs.readdirSync(path.join(DIST, 'assets')).filter((f) => /\.(js|css)$/.test(f)).sort().map((f) => 'assets/' + f);
  const ver = hash([...core, ...allAssets].map((f) => fs.readFileSync(path.join(DIST, f), 'utf8')).join(''));
  fs.writeFileSync(path.join(DIST, 'sw.js'), `/* offline reading: network first for pages, cache as you go. Version ${ver} */
const V = 'lmg-${ver}', CORE = ${JSON.stringify(core)};
self.addEventListener('install', (e) => { e.waitUntil(caches.open(V).then((c) => c.addAll(CORE)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== V).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', (e) => {
  const r = e.request; if (r.method !== 'GET') return;
  const u = new URL(r.url);
  const font = u.hostname === 'fonts.googleapis.com' || u.hostname === 'fonts.gstatic.com';
  if (u.origin !== location.origin && !font) return;
  if (r.mode === 'navigate') {
    e.respondWith(fetch(r).then((res) => { const c = res.clone(); caches.open(V).then((ca) => ca.put(r, c)); return res; })
      .catch(() => caches.match(r).then((m) => m || caches.match('offline.html'))));
    return;
  }
  e.respondWith(caches.match(r).then((m) => { const net = fetch(r).then((res) => { if (res.ok || res.type === 'opaque') { const c = res.clone(); caches.open(V).then((ca) => ca.put(r, c)); } return res; }).catch(() => m); return m || net; }));
});
`);
}

const count = (d) => fs.readdirSync(d, { withFileTypes: true }).reduce((a, e) => a + (e.isDirectory() ? count(path.join(d, e.name)) : 1), 0);
console.log('Built', count(DIST), 'files');
