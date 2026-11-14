// Static site generator. Run: node src/build.mjs
import fs from 'node:fs';
import path from 'node:path';
import { PREVIEW, previewSkip, ROOT, config, books, bookById, bookBySlug, bible, ar, esc, md, up, refLabel, refHref, bookHref, chapterHref, shortName, verseText } from '../lib.mjs';
import { layout, logo } from '../layout.mjs';
import { blocks, verseFigure } from '../render.mjs';

const DIST = path.join(ROOT, 'dist');
fs.rmSync(DIST, { recursive: true, force: true });
const write = (rel, html) => { const f = path.join(DIST, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, html); };
const readJSON = (rel) => JSON.parse(fs.readFileSync(path.join(ROOT, rel), 'utf8'));

// ---------- load authored content ----------
const content = {};
for (const slug of fs.readdirSync(path.join(ROOT, 'content/books'))) {
  const dir = path.join(ROOT, 'content/books', slug);
  const b = bookBySlug[slug];
  if (!b) throw new Error('Unknown book folder: ' + slug);
  const c = { intro: null, chapters: {} };
  if (fs.existsSync(path.join(dir, 'intro.mjs'))) c.intro = (await import(path.join(dir, 'intro.mjs'))).default;
  if (fs.existsSync(path.join(dir, 'chapters'))) {
    for (const f of fs.readdirSync(path.join(dir, 'chapters')).filter((f) => f.endsWith('.mjs'))) {
      c.chapters[+f.replace('.mjs', '')] = (await import(path.join(dir, 'chapters', f))).default;
    }
  }
  content[b.id] = c;
}
const status = (b) => {
  const c = content[b.id];
  if (!c) return 'text';
  const n = Object.keys(c.chapters).length;
  if (c.intro && n === b.chapters) return 'full';
  return 'partial';
};
const countWord = (n, one, two, few, many) => (n === 1 ? one : n === 2 ? two : n <= 10 ? `${ar(n)} ${few}` : `${ar(n)} ${many}`);
const chWord = (n) => countWord(n, 'أصحاح واحد', 'أصحاحان', 'أصحاحات', 'أصحاحاً');
const bkWord = (n) => countWord(n, 'سفر واحد', 'سفران', 'أسفار', 'سفراً');
const STATUS_LABEL = { full: 'دراسة كاملة', partial: 'دراسة جارية', text: 'النص متاح' };

// ---------- assets ----------
fs.mkdirSync(path.join(DIST, 'assets'), { recursive: true });
for (const f of fs.readdirSync(path.join(ROOT, 'src/assets'))) fs.copyFileSync(path.join(ROOT, 'src/assets', f), path.join(DIST, 'assets', f));

const geo = readJSON('data/geo.json');
const icons = readJSON('data/atlas.json').icons;
const landPaths = geo.land.map((d) => `<path d="${d}"/>`).join('');

// ---------- home ----------
function home() {
  const ntCount = books.filter((b) => b.testament === 'nt').length;
  const studied = books.filter((b) => content[b.id]);
  const route = fs.readFileSync(path.join(ROOT, 'data/intro-route.txt'), 'utf8');
  const introSvg = `<svg viewBox="0 0 1000 560" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><g fill="#C9A96E" fill-opacity="0.07" stroke="#C9A96E" stroke-width="0.8" stroke-linejoin="round">${landPaths}</g><path class="route" d="${route}" fill="none" stroke="#E9CF96" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const words = verseText(config.verseRef).replace(/\.$/, '').split(' ');
  const tool = (href, icon, t, d, soon) => `<a class="tool${soon ? ' hub soon' : ''}" href="${href}"><span class="ic">${icon}</span><span><b>${t}</b><span>${d}</span>${soon ? '<span class="soon"> · قريباً</span>' : ''}</span></a>`;
  const I = {
    map: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2-6-2z"/><path d="M9 4v14M15 6v14"/></svg>',
    ship: '<svg width="22" height="22" viewBox="-22 -34 44 40" aria-hidden="true"><path d="M-17 -3h34l-5 8h-24z" fill="currentColor"/><path d="M0 -3v-29" stroke="currentColor" stroke-width="2"/><path d="M1.5 -29c10 5 10 19 0 24z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M-1.5 -26c-8 4-8 15 0 20z" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
    people: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.8-3.6 3.4-5.5 6.5-5.5s5.7 1.9 6.5 5.5"/><circle cx="17" cy="9" r="2.5"/><path d="M16 14.6c2.7.2 4.6 1.9 5.4 4.9"/></svg>',
    time: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M3 12h18"/><circle cx="6" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="18" cy="12" r="2"/></svg>',
    search: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/></svg>'
  };
  const body = `
<div class="intro" role="dialog" aria-label="مقدمة الموقع">
  <div class="map">${introSvg}</div>
  <button type="button" class="skip-intro">تخطَّ المقدمة</button>
  <div class="center">
    <div class="mark">${logo(86)}</div>
    <div class="name" dir="auto">${esc(config.name)}</div>
    <div class="name-ar">${esc(config.nameAr)} · ${esc(config.tagline)}</div>
    <div class="iv">${words.map((w) => `<span>${esc(w)}</span>`).join(' ')}</div>
    <div class="ivref">${refLabel(config.verseRef)}</div>
    <div class="actions"><button type="button" class="enter">ادخل مع الموسيقى</button><button type="button" class="enter enter-quiet" style="border-color:rgba(233,207,150,.3);color:#A79E8E">ادخل بهدوء</button></div>
  </div>
</div>
<button type="button" class="sound" aria-label="تشغيل الموسيقى"></button>
<section class="home-hero">
  <div class="bg">${introSvg.replace('class="route"', 'class="route-static" stroke-dasharray="3 7"')}</div>
  <div class="wrap inner">
    <span class="eyebrow">${esc(config.nameAr)}</span>
    <h1>رحلة عبر الكتاب المقدس</h1>
    <p class="tag-line">${esc(config.description)}</p>
    <p class="verse">«${esc(verseText(config.verseRef).replace(/\.$/, ''))}» <span style="font-family:var(--f-display);font-size:13px;color:#A79E8E">${refLabel(config.verseRef)}</span></p>
  </div>
</section>
<div class="wrap">
  <div class="doors">
    <a class="door" href="ot.html"><span class="k">٣٩ سفراً</span><h2>العهد القديم</h2><p>من الخليقة إلى انتظار المسيا: التوراة، والتاريخ، والشعر والحكمة، والأنبياء.</p><span class="meta"><span>التوراة</span><span>التاريخ</span><span>الحكمة</span><span>الأنبياء</span></span><span class="go">ادخل ←</span></a>
    <a class="door" href="nt.html"><span class="k">${ar(ntCount)} سفراً</span><h2>العهد الجديد</h2><p>المسيح الموعود قد جاء: الأناجيل، وأعمال الرسل، والرسائل، والرؤيا.</p><span class="meta"><span>الأناجيل</span><span>الأعمال</span><span>الرسائل</span><span>الرؤيا</span></span><span class="go">ادخل ←</span></a>
  </div>
  <div class="continue" data-continue><span><span class="k">تابع من حيث توقفت</span><br><span class="t"></span></span><a class="btn" href="#">تابع القراءة</a></div>
  <section class="tools">
    <div class="group-head"><h2>أدوات الدراسة</h2><span>متاحة من أي مكان في الموقع</span></div>
    <div class="tools-grid">
      ${tool('journey.html', I.map, 'خريطة الرحلة', 'الكتاب كله في ١٤ مرحلة بالترتيب التاريخي.')}
      ${tool('paul.html', I.ship, 'رحلات بولس', 'تتبّع الرحلات الأربع محطة بمحطة.')}
      ${tool('people.html', I.people, 'الشخصيات', 'بطاقات تعريف بالشخصيات الرئيسية.')}
      ${tool('#', I.time, 'الخط الزمني', 'أحداث الكتاب على محور واحد.', true)}
      ${tool('#', I.search, 'البحث', 'ابحث في النص والدراسات.', true)}
    </div>
  </section>
  <section class="tools">
    <div class="group-head"><h2>دراسات متاحة الآن</h2><span>${bkWord(studied.length)}</span></div>
    <div class="book-grid">${studied.map((b) => tile(b, 0)).join('')}</div>
  </section>
</div>`;
  write('index.html', layout({ title: '', depth: 0, active: 'home', body, scripts: ['intro.js'], bodyClass: 'home' }));
}

function tile(b, depth) {
  const s = status(b);
  const c = content[b.id];
  const n = c ? Object.keys(c.chapters).length : 0;
  return `<a class="book-tile" href="${bookHref(b, depth)}"><span class="n">${ar(b.order)} · ${esc(b.groupName)}</span><span class="t">${esc(b.name)}</span><span class="m">${chWord(b.chapters)}${n ? ` · ${ar(n)} مدروس` : ''}</span><span class="st"><span class="status ${s}">${STATUS_LABEL[s]}</span></span></a>`;
}

// ---------- testament lists ----------
function testament(t) {
  const list = books.filter((b) => b.testament === t);
  const groups = [...new Set(list.map((b) => b.group))];
  const body = `<div class="wrap"><div class="page-head"><span class="eyebrow">${t === 'nt' ? '٢٧ سفراً' : '٣٩ سفراً'}</span><h1>${t === 'nt' ? 'العهد الجديد' : 'العهد القديم'}</h1><p class="lead">${t === 'nt' ? 'الأسفار بترتيبها في الكتاب المقدس. افتح أي سفر لتقرأ نصه كاملاً، وحيث توجد دراسة ستجد المقدمة والتقسيم والشرح لكل أصحاح.' : 'الأسفار بترتيبها في الكتاب المقدس. النص كامل متاح الآن، والدراسات تُضاف تباعاً.'}</p></div>
${groups.map((g) => { const gb = list.filter((b) => b.group === g); return `<section class="group"><div class="group-head"><h2>${esc(gb[0].groupName)}</h2><span>${bkWord(gb.length)}</span></div><div class="book-grid">${gb.map((b) => tile(b, 0)).join('')}</div></section>`; }).join('')}</div>`;
  write(`${t}.html`, layout({ title: t === 'nt' ? 'العهد الجديد' : 'العهد القديم', depth: 0, active: t, body, crumbs: [{ label: t === 'nt' ? 'العهد الجديد' : 'العهد القديم' }] }));
}

// ---------- book page ----------
function chapterGrid(b, depth) {
  const c = content[b.id];
  return `<div class="chapter-grid">${Array.from({ length: b.chapters }, (_, i) => i + 1).map((n) => `<a href="${chapterHref(b, n, depth)}" data-key="${b.id}:${n}" class="${c && c.chapters[n] ? 'studied' : ''}" aria-label="الأصحاح ${ar(n)}">${ar(n)}</a>`).join('')}</div>`;
}

function bookPage(b) {
  const depth = 1;
  const c = content[b.id];
  const tCrumb = { label: b.testament === 'nt' ? 'العهد الجديد' : 'العهد القديم', href: `${b.testament}.html` };
  if (!c || !c.intro) {
    const body = `<section class="hero"><div class="wrap hero-stack"><span class="eyebrow">${esc(b.groupName)} · السفر ${ar(b.order)} من ٦٦</span><h1>${esc(b.name)}</h1><p class="hero-sum">${chWord(b.chapters)} · ${ar(b.verses.reduce((a, x) => a + x, 0))} آية</p></div></section>
<div class="wrap" style="padding-top:40px;display:flex;flex-direction:column;gap:24px"><div class="no-study">المقدمة والدراسة التفصيلية لهذا السفر قيد الإعداد. ${PREVIEW && b.testament === 'ot' ? 'نص العهد القديم كاملاً متاح في النسخة المنشورة من الموقع، وهذه نسخة معاينة للعهد الجديد.' : 'يمكنك الآن قراءة النص كاملاً، أصحاحاً أصحاحاً.'}</div><h2 style="font-size:24px">الأصحاحات</h2>${chapterGrid(b, depth)}</div>`;
    write(`book/${b.slug}.html`, layout({ title: b.name, depth, active: b.testament, body, crumbs: [tCrumb, { label: b.name }] }));
    return;
  }
  const I = c.intro;
  const ctx = { depth, book: b };
  const sections = I.sections;
  const body = `<section class="hero"><div class="wrap hero-stack">
  <span class="eyebrow">${md(I.eyebrow || `${b.groupName} · السفر ${b.order} من 66`)}</span>
  <h1>${esc(I.title || b.name)}</h1>
  ${I.heroVerse ? `<p class="hero-verse">${esc((() => { const v = verseText(I.heroVerse).replace(/[.،:,]$/, ''); return v.includes('«') ? v : '«' + v + '»'; })())} <a href="${refHref(I.heroVerse, depth)}">${refLabel(I.heroVerse)}</a></p>` : ''}
  <p class="hero-sum">${md(I.summary)}</p>
  <dl class="facts">${I.facts.map((f) => `<div><dt><span class="dot ${f.tag || 'agreed'}"></span>${md(f.k)}</dt><dd>${md(f.v)}</dd></div>`).join('')}</dl>
  <div class="legend"><span><span class="dot agreed"></span>متفق عليه</span><span><span class="dot likely"></span>الرأي الراجح</span><span><span class="dot debated"></span>قضية تفسيرية</span></div>
  ${I.context ? `<div class="context-nav">${I.context.before.href ? `<a href="${up(depth)}${I.context.before.href}">` : '<div>'}<span class="k">ما قبله</span><span class="t">${md(I.context.before.t)}</span><span class="d">${md(I.context.before.d)}</span>${I.context.before.href ? '</a>' : '</div>'}<div class="here"><span class="k">أنت هنا</span><span class="t">${md(I.context.now.t)}</span><span class="d">${md(I.context.now.d)}</span></div>${I.context.after.href ? `<a href="${up(depth)}${I.context.after.href}">` : '<div>'}<span class="k">ما بعده</span><span class="t">${md(I.context.after.t)}</span><span class="d">${md(I.context.after.d)}</span>${I.context.after.href ? '</a>' : '</div>'}</div>` : ''}
</div></section>
<div class="wrap study">
  <aside class="study-aside" aria-label="أجزاء المقدمة">
    <div style="display:flex;flex-direction:column;gap:4px"><span class="eyebrow">رحلة المقدمة</span><span style="font-family:var(--f-display);font-size:20px"><span data-count>٠</span> من ${ar(sections.length)} أجزاء</span><div class="progress-bar" style="margin-top:6px"><div data-progress></div></div></div>
    <ol class="steps" data-steps="${b.id}" data-total="${sections.length}">${sections.map((s, i) => `<li><a href="#sec${i + 1}"><span class="badge">${ar(i + 1)}</span><span>${md(s.short || s.title)}</span></a></li>`).join('')}<li data-extra><a href="#chapters"><span class="badge" style="border-style:dashed">◆</span><span>الأصحاحات</span></a></li></ol>
    <div class="seal" data-seal><svg width="54" height="54" viewBox="0 0 34 34" role="img" aria-label="ختم ${esc(shortName(b))}"><path d="M17 1.5l3.2 2.6 4-1 1.6 3.8 3.9 1.3-.6 4.1 2.7 3.1-2.7 3.1.6 4.1-3.9 1.3-1.6 3.8-4-1-3.2 2.6-3.2-2.6-4 1-1.6-3.8-3.9-1.3.6-4.1L1.4 17l2.7-3.1-.6-4.1 3.9-1.3 1.6-3.8 4 1z" fill="#7E2F25"/><circle cx="17" cy="17" r="9.5" fill="none" stroke="#E3B5A8" stroke-width="0.8"/><text x="17" y="20.5" text-anchor="middle" font-size="8" fill="#FBF7EE" font-family="Reem Kufi, sans-serif">${esc(b.abbr)}</text></svg><span style="display:flex;flex-direction:column"><span class="k">ختم ${esc(shortName(b))}</span><span class="d">أكمل الأجزاء لتحصل عليه</span></span></div>
  </aside>
  <article class="study-main">
    ${sections.map((s, i) => `<section class="sec" id="sec${i + 1}"><div class="sec-head"><span class="n">${ar(i + 1)}</span><h2>${md(s.title)}</h2></div>${blocks(s.blocks, ctx)}<button type="button" class="btn complete" data-complete="${i + 1}">أكملت هذا الجزء</button></section>`).join('\n')}
    <section class="sec" id="chapters"><div class="sec-head"><span class="n">◆</span><h2>ادرس الأصحاحات</h2></div><p>كل أصحاح له صفحة فيها النص كاملاً، ومعه الملخص والتقسيم والخلفيات والشواهد والأسئلة. الأصحاحات المعلّمة بالذهبي دراستها جاهزة.</p>${chapterGrid(b, depth)}</section>
    ${I.pager ? `<nav class="pager" aria-label="التنقل بين المحطات"><a href="${up(depth)}${I.pager.prev.href}"><span class="k">السابق</span><span class="t">${md(I.pager.prev.t)}</span></a><a href="${up(depth)}${I.pager.next.href}"><span class="k">التالي</span><span class="t">${md(I.pager.next.t)}</span></a></nav>` : ''}
  </article>
</div>`;
  write(`book/${b.slug}.html`, layout({ title: b.name, depth, active: b.testament, body, crumbs: [tCrumb, { label: b.name }] }));
}

// ---------- chapter page ----------
const ICON = {
  views: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 3v18M4 7h6M4 12h6M4 17h6M14 7h6M14 12h6M14 17h6"/></svg>',
  sum: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M5 6h14M5 12h14M5 18h9"/></svg>',
  bg: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2-6-2z"/></svg>',
  word: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M5 19L12 5l7 14M8 14h8"/></svg>',
  link: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/></svg>',
  cross: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M12 3v18M7 8h10"/></svg>',
  q: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M9 9a3 3 0 1 1 4 2.8c-.6.3-1 .9-1 1.6V15M12 18.5v.5"/></svg>',
  voice: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M5 5h14v10H9l-4 4z"/></svg>',
  apply: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg>'
};

function chapterPage(b, n) {
  const depth = 2;
  const S = content[b.id]?.chapters[n];
  const vs = bible(b.id).chapters[n - 1].verses;
  const per = Object.fromEntries((S?.pericopes || []).map((p) => [p.at, p.t]));
  const prev = n > 1 ? { b, n: n - 1 } : (b.order > 1 ? { b: books[b.order - 2], n: books[b.order - 2].chapters } : null);
  const next = n < b.chapters ? { b, n: n + 1 } : (b.order < 66 ? { b: books[b.order], n: 1 } : null);
  const label = (x) => `${shortName(x.b)} ${ar(x.n)}`;
  const title = `${shortName(b)} ${ar(n)}`;
  const sec = (ic, h, inner) => `<section class="block"><h2><span class="ic">${ICON[ic]}</span>${h}</h2>${inner}</section>`;
  const ctx = { depth, book: b };
  const text = `<div class="text-tools"><span>${esc(config.bibleVersion)}</span><span style="display:flex;gap:6px"><button type="button" data-size="-1" aria-label="تصغير الخط">أ−</button><button type="button" data-size="1" aria-label="تكبير الخط">أ+</button></span></div>
<div class="scripture" lang="ar">${vs.map((v) => `${per[v.number] ? `<span class="pericope">${md(per[v.number])}</span>` : ''}<span class="v" id="v${v.number}"><sup><a href="#v${v.number}">${ar(v.number)}</a></sup>${esc(v.text)}</span> `).join('')}</div>`;
  let side = '', full = '', where = '';
  if (S) {
    where = `<div class="where"><div><span class="k">أين نحن؟</span><span class="d">${md(S.where)}</span></div><div><span class="k">ما قبله</span><span class="d">${md(S.before)}</span></div><div><span class="k">ما بعده</span><span class="d">${md(S.after)}</span></div></div>`;
    side = `${S.keyVerse ? verseFigure(S.keyVerse, { depth, label: 'الآية المفتاحية' }) : ''}
<div class="side-box"><h3>تقسيم الأصحاح</h3><ol class="outline-list">${S.outline.map((o) => `<li><a href="#v${o.r.split('-')[0]}" data-hl="${o.r}">${ar(o.r.replace('-', '–'))}</a><span>${md(o.t)}</span></li>`).join('')}</ol></div>
${S.people?.length ? `<div class="side-box"><h3>أشخاص</h3><div class="mini-list">${S.people.map((p) => `<div><b>${md(p.n)}</b><span>${md(p.d)}</span></div>`).join('')}</div></div>` : ''}
${S.places?.length ? `<div class="side-box"><h3>أماكن</h3><div class="mini-list">${S.places.map((p) => `<div><b>${md(p.n)}</b><span>${md(p.d)}</span></div>`).join('')}</div></div>` : ''}`;
    full = `<div class="study-full">
${sec('sum', 'الملخص', `<div class="block">${S.summary.map((p) => `<p>${md(p)}</p>`).join('')}</div>`)}
${S.background?.length ? sec('bg', 'خلفيات تساعدك على الفهم', `<div class="grid-cards">${S.background.map((x) => `<div class="card"><h4>${md(x.t)}</h4><p>${md(x.d)}</p></div>`).join('')}</div>`) : ''}
${S.words?.length ? sec('word', 'كلمات مفتاحية', `<div>${S.words.map((w) => `<div class="word"><span class="w">${md(w.w)} ${w.orig ? `<span>${esc(w.orig)}</span>` : ''}</span><span class="d">${md(w.d)}</span></div>`).join('')}</div>`) : ''}
${S.otQuotes?.length || S.parallels?.length || S.links?.length ? sec('link', 'شواهد وروابط', `${S.otQuotes?.length ? `<h3 style="font-size:17px;color:var(--ox)">من العهد القديم</h3><div class="table-scroll"><table class="data"><thead><tr><th>هنا</th><th>المصدر</th><th>الفكرة</th></tr></thead><tbody>${S.otQuotes.map((q) => `<tr><td class="ref"><a href="#v${q.at}" data-hl="${q.at}">${ar(n + ': ' + q.at)}</a></td><td class="ref"><a href="${refHref(q.src, depth)}">${refLabel(q.src)}</a></td><td>${md(q.d)}</td></tr>`).join('')}</tbody></table></div>` : ''}
${S.parallels?.length ? `<h3 style="font-size:17px;color:var(--ox)">في الأناجيل الأخرى</h3><div class="table-scroll"><table class="data"><tbody>${S.parallels.map((q) => `<tr><td class="ref"><a href="${refHref(q.ref, depth)}">${refLabel(q.ref)}</a></td><td>${md(q.d)}</td></tr>`).join('')}</tbody></table></div>` : ''}
${S.links?.length ? `<h3 style="font-size:17px;color:var(--ox)">شواهد مرتبطة</h3><div class="table-scroll"><table class="data"><tbody>${S.links.map((q) => `<tr><td class="ref"><a href="${refHref(q.ref, depth)}">${refLabel(q.ref)}</a></td><td>${md(q.d)}</td></tr>`).join('')}</tbody></table></div>` : ''}`) : ''}
${S.christ ? sec('cross', 'المسيح في هذا الأصحاح', `<div class="block">${(Array.isArray(S.christ) ? S.christ : [S.christ]).map((p) => `<p>${md(p)}</p>`).join('')}</div>`) : ''}
${S.views ? sec('views', md(S.views.t || 'قراءتان للنص'), `<div class="grid-cards"><div class="card"><h4>لاهوت العهد</h4><p>${md(S.views.covenant)}</p></div><div class="card"><h4>التدبيرية</h4><p>${md(S.views.dispensational)}</p></div></div>${S.views.common ? `<div class="callout green"><span class="callout-title">ما نتفق عليه</span><p>${md(S.views.common)}</p></div>` : ''}`) : ''}
${S.hard?.length ? sec('q', 'مواضع تحتاج إلى تأمل', S.hard.map((h) => `<details class="qa"><summary><span style="display:flex;align-items:center;gap:10px"><span class="dot ${h.tag || 'debated'}"></span>${md(h.q)}</span></summary><div class="ans">${(Array.isArray(h.a) ? h.a : [h.a]).map((p) => `<p>${md(p)}</p>`).join('')}</div></details>`).join('')) : ''}
${S.voices?.length ? sec('voice', 'من التقليد المُصلَح', `<div class="voices">${S.voices.map((v) => `<div class="voice"><div class="who"><b>${md(v.n)}</b><span>${md(v.y || '')}</span></div><div class="what"><p>${md(v.b)}</p><span class="src"><i>المصدر: </i>${md(v.w)}</span></div></div>`).join('')}</div><p style="font-size:16px;color:var(--muted)">ملخصات بتصرّف لأفكارهم، وليست اقتباسات حرفية.</p>`) : ''}
${sec('apply', 'للتأمل والتطبيق', `<ol class="plain">${S.questions.map((q) => `<li>${md(q)}</li>`).join('')}</ol>${S.apply ? `<div class="callout"><span class="callout-title">للحياة</span>${(Array.isArray(S.apply) ? S.apply : [S.apply]).map((p) => `<p>${md(p)}</p>`).join('')}</div>` : ''}<button type="button" class="btn read-toggle" data-read="${b.id}:${n}">علّم كمقروء</button>`)}
</div>`;
  } else {
    side = `<div class="no-study">دراسة هذا الأصحاح قيد الإعداد. اقرأ النص الآن، وعُد قريباً للملخص والتقسيم والشرح.</div><button type="button" class="btn read-toggle" data-read="${b.id}:${n}">علّم كمقروء</button>`;
  }
  const options = Array.from({ length: b.chapters }, (_, i) => `<option value="${chapterHref(b, i + 1, depth)}"${i + 1 === n ? ' selected' : ''}>الأصحاح ${ar(i + 1)}</option>`).join('');
  const body = `<section class="chap-hero" data-chapter data-title="${esc(title + (S ? ': ' + S.title : ''))}"><div class="wrap">
  <span class="eyebrow">${esc(b.name)} · الأصحاح ${ar(n)} من ${ar(b.chapters)}</span>
  <h1>${S ? md(S.title) : esc(title)}</h1>
  ${S ? `<p class="sub">${esc(title)} · ${md(S.section)}</p>` : ''}
  <div class="chap-tools">
    ${prev ? `<a href="${chapterHref(prev.b, prev.n, depth)}">→ ${esc(label(prev))}</a>` : ''}
    <label class="sr-only" for="chsel">اختر أصحاحاً</label><select id="chsel" data-nav>${options}</select>
    <a href="${bookHref(b, depth)}">مقدمة السفر</a>
    ${next ? `<a href="${chapterHref(next.b, next.n, depth)}">${esc(label(next))} ←</a>` : ''}
  </div>
</div></section>
<div class="wrap">
  ${where}
  <div class="chap-body"><div class="chap-text">${text}</div><aside class="chap-side">${side}</aside></div>
  ${full}
  <nav class="pager" style="margin-top:56px" aria-label="التنقل بين الأصحاحات">${prev ? `<a href="${chapterHref(prev.b, prev.n, depth)}"><span class="k">السابق</span><span class="t">${esc(label(prev))}</span></a>` : '<span></span>'}${next ? `<a href="${chapterHref(next.b, next.n, depth)}"><span class="k">التالي</span><span class="t">${esc(label(next))}</span></a>` : ''}</nav>
</div>`;
  write(`book/${b.slug}/${n}.html`, layout({ title: `${title}${S ? ': ' + S.title : ''}`, depth, active: b.testament, body, crumbs: [{ label: b.testament === 'nt' ? 'العهد الجديد' : 'العهد القديم', href: `${b.testament}.html` }, { label: b.name, href: `book/${b.slug}.html` }, { label: `الأصحاح ${ar(n)}` }] }));
}

// ---------- journey map ----------
function journeyPage() {
  const A = readJSON('data/atlas.json');
  const J = readJSON('data/journey.json');
  const ERA_BOOKS = { 1: ['Gen'], 2: ['Gen', 'Job'], 3: ['Exod', 'Lev', 'Num', 'Deut'], 4: ['Josh', 'Judg', 'Ruth'], 5: ['1Sam', '2Sam', '1Chr', 'Ps', 'Prov', 'Eccl', 'Song'], 6: ['1Kgs', '2Kgs', '2Chr', 'Joel', 'Jonah', 'Amos', 'Hos', 'Isa', 'Mic', 'Nah', 'Zeph', 'Hab'], 7: ['Jer', 'Lam', 'Ezek', 'Dan', 'Obad'], 8: ['Ezra', 'Neh', 'Esth', 'Hag', 'Zech', 'Mal'], 9: [], 10: ['Matt', 'Mark', 'Luke', 'John'], 11: ['Acts', 'Jas'], 12: ['Acts', 'Gal', '1Thess', '2Thess', '1Cor', '2Cor', 'Rom', 'Eph', 'Col', 'Phlm', 'Phil', '1Tim', 'Titus', '2Tim'], 13: ['Heb', '1Pet', '2Pet', 'Jude', '1John', '2John', '3John'], 14: ['Rev'] };
  const TYPE = { journey: 'رحلة', letter: 'رسالة', event: 'حدث' };
  const STN_HREF = { 1: 'paul.html#j1-1', 2: 'book/galatians.html', 4: 'paul.html#j2-1', 5: 'book/1-thessalonians.html', 6: 'book/2-thessalonians.html', 7: 'paul.html#j3-1', 8: 'book/1-corinthians.html', 9: 'book/2-corinthians.html', 10: 'book/romans.html', 12: 'paul.html#j4-1', 13: 'book/ephesians.html', 14: 'book/colossians.html', 15: 'book/philemon.html', 16: 'book/philippians.html', 17: 'book/1-timothy.html', 18: 'book/titus.html', 19: 'book/2-timothy.html', 0: 'book/acts/9.html', 3: 'book/acts/15.html', 11: 'book/acts/21.html' };
  const data = {
    eras: J.eras.map((e) => ({ num: ar(e.n), title: e.title, dates: e.dates, summary: e.summary, open: !!e.open, books: (ERA_BOOKS[e.n] || []).map((id) => ({ name: shortName(bookById[id]), href: bookHref(bookById[id], 0) })) })),
    paul: J.paul.map((p, i) => ({ num: ar(i + 1), t: p.t, meta: p.meta, note: p.note, typeLabel: TYPE[p.type], href: STN_HREF[i], cta: p.type === 'journey' ? 'افتح الرحلة على الخريطة' : p.type === 'letter' ? 'افتح السفر' : 'اقرأ الأصحاح' }))
  };
  const cur = 2;
  const medal = (e) => {
    const [x, y] = A.eras[e.n];
    return `<button type="button" class="medal ${e.open ? 'open' : 'locked'}" data-era="${e.n}" data-x="${x}" data-y="${y}" style="left:${(x / 13.6).toFixed(2)}%;top:${(y / 8.8).toFixed(2)}%" aria-label="المرحلة ${ar(e.n)}: ${esc(e.title)}"><span class="disc"><svg viewBox="-32 -32 64 64" aria-hidden="true">${A.icons[e.n]}</svg><span class="num">${ar(e.n)}</span></span><span class="lbl">${esc(e.title)}</span><span class="sub2">${e.open ? 'مفتوحة الآن' : esc(e.dates)}</span></button>`;
  };
  const markStyle = (p, i) => {
    if (i < cur) return 'width:20px;height:20px;border-radius:50%;background:#C9A96E;border:1.5px solid #8C7556';
    if (i === cur) return 'width:24px;height:24px;border-radius:50%;background:#7E2F25;border:2px solid #FBF7EE;box-shadow:0 0 0 2px #7E2F25';
    if (p.type === 'journey') return 'width:20px;height:20px;border-radius:50%;background:#FBF7EE;border:2.5px solid #7E2F25';
    if (p.type === 'letter') return 'width:18px;height:18px;border-radius:50%;background:#9A3A2E;box-shadow:inset 0 0 0 2.5px #9A3A2E,inset 0 0 0 3.5px #E3B5A8';
    return 'width:13px;height:13px;transform:rotate(45deg);background:#6A6152';
  };
  const stations = J.paul.map((p, i) => {
    const [x, y] = A.st[i];
    return `<button type="button" class="stn" data-stn="${i}" data-x="${x}" data-y="${y}" style="left:${(x / 13.6).toFixed(2)}%;top:${(y / 8.8).toFixed(2)}%" aria-label="${ar(i + 1)}، ${TYPE[p.type]}: ${esc(p.t)}"><span class="mk" style="${markStyle(p, i)}"></span></button><span class="stn-lbl" style="left:${(x / 13.6).toFixed(2)}%;top:calc(${(y / 8.8).toFixed(2)}% + 14px);${i === cur ? 'color:#7E2F25;font-weight:700' : ''}">${esc(p.s)}</span>`;
  }).join('');
  const [hx, hy] = A.st[cur];
  const list = J.eras.map((e) => `<a class="ml-item ${e.open ? '' : 'locked'}" href="${e.open ? 'paul.html' : (ERA_BOOKS[e.n][0] ? bookHref(bookById[ERA_BOOKS[e.n][0]], 0) : '#')}"><span class="n">${ar(e.n)}</span><span><b>${esc(e.title)}</b><span>${esc(e.dates)}${e.open ? ' · مفتوحة الآن' : ''}</span></span></a>`).join('');
  const svg = A.svg.replace('<svg width="1360" height="880"', '<svg viewBox="0 0 1360 880" preserveAspectRatio="none"').replace(/ width="1360" height="880"/, '');
  const body = `<div class="wrap"><div class="page-head"><span class="eyebrow">خريطة الرحلة</span><h1>من الخليقة إلى السماء الجديدة</h1><p class="lead">أربع عشرة مرحلة بالترتيب التاريخي. اضغط على أي مرحلة أو محطة لتعرف عنها وتفتح أسفارها. المرحلة الثانية عشرة مدروسة بالتفصيل الآن، والباقي يُفتح تباعاً.</p></div>
<div class="atlas-desktop"><div class="atlas">${svg}${J.eras.map(medal).join('')}${stations}<span class="pulse" style="left:${(hx / 13.6).toFixed(2)}%;top:${(hy / 8.8).toFixed(2)}%"></span><span class="here-pin" style="left:${(hx / 13.6).toFixed(2)}%;top:calc(${(hy / 8.8).toFixed(2)}% - 22px)">أنت هنا</span><div class="map-card" hidden></div></div></div>
<div class="map-list">${list}</div></div>
<script type="application/json" id="journey-data">${JSON.stringify(data)}</script>`;
  write('journey.html', layout({ title: 'خريطة الرحلة', depth: 0, active: 'maps', body, crumbs: [{ label: 'الخرائط', href: 'maps.html' }, { label: 'خريطة الرحلة' }], scripts: ['map-world.js'] }));
}

// ---------- Paul map ----------
function paulPage() {
  const P = readJSON('data/paul-atlas.json');
  const J = readJSON('data/paul-journeys.json');
  const META = [
    'أول رحلة منظَّمة لحمل الإنجيل إلى الأمم: من أنطاكية إلى قبرس ثم إلى قلب الأناضول. رفيقاه: برنابا، ويوحنا مرقس حتى برجة.',
    'بعد مجمع أورشليم: تثبيت الكنائس، ثم عبور الإنجيل إلى أوروبا. رفقاؤه: سيلا وتيموثاوس، ولوقا من ترواس.',
    'إقامة طويلة في أفسس سمعت فيها أسيا كلها الكلمة، ثم جمع العطية لفقراء أورشليم. كتب فيها كورنثوس الأولى والثانية ورومية.',
    'بولس سجين، لكن كلمة الله لا تُقيَّد: من محاكمات قيصرية إلى عاصفة البحر حتى روما. كتب من سجنه أفسس وكولوسي وفليمون وفيلبي.'
  ];
  const svg = P.svg.replace('<svg width="100%" height="100%"', '<svg').replace('d="{{otherD}}"', 'id="pm-other" d=""').replace('d="{{fullD}}"', 'id="pm-full" d=""').replaceAll('d="{{doneD}}"', 'class="pm-done" d=""');
  const data = { geo: Object.fromEntries(Object.entries(geo.cities).map(([k, v]) => [k, { px: v.px }])), journeys: J, meta: META };
  const body = `<div class="wrap"><div class="page-head"><span class="eyebrow">المرحلة ١٢ · بولس ورسائله</span><h1>رحلات بولس الرسول</h1><p class="lead">أربع رحلات من أنطاكية إلى روما. اختر رحلة، ثم اضغط «تتبّع الرحلة» لتبحر مع بولس محطة بعد محطة، أو اختر أي مدينة مباشرة.</p></div>
<div class="pm-tabs" role="tablist" aria-label="الرحلات" style="margin-bottom:16px">${J.map((j) => `<button type="button" role="tab" aria-selected="false"><b>${esc(j.tab)}</b><span>${esc(ar(j.dates))}</span></button>`).join('')}</div>
<div class="pm">
  <div class="pm-map">
    <div class="pm-plate">${svg}
      <div class="pm-cartouche"><b>العالم الروماني</b><span>في القرن الأول الميلادي</span></div>
      <div class="pm-markers"></div>
      <span class="pulse"></span>
      <div class="pm-ship"><svg width="44" height="40" viewBox="-22 -34 44 40" aria-hidden="true"><path d="M-17 -3h34l-5 8h-24z" fill="#2A2620"/><path d="M0 -3v-29" stroke="#2A2620" stroke-width="1.6"/><path d="M1.5 -29c10 5 10 19 0 24z" fill="#FBF7EE" stroke="#2A2620" stroke-width="1.3"/><path d="M-1.5 -26c-8 4-8 15 0 20z" fill="#FBF7EE" stroke="#2A2620" stroke-width="1.3"/><path d="M0 -32l7 2-7 2" fill="#7E2F25"/></svg></div>
      <span class="pm-label"></span>
    </div>
    <div class="pm-controls">
      <button type="button" class="round" data-prev aria-label="المحطة السابقة"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button>
      <button type="button" class="play"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17 5v14L6 12z"/></svg><span>تتبّع الرحلة</span></button>
      <button type="button" class="round" data-next aria-label="المحطة التالية"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"/></svg></button>
      <div class="pm-sum"><b></b><span></span></div>
    </div>
    <div class="pm-chips"></div>
  </div>
  <aside class="pm-panel" aria-live="polite"></aside>
</div></div>
<script type="application/json" id="paul-data">${JSON.stringify(data)}</script>`;
  write('paul.html', layout({ title: 'رحلات بولس', depth: 0, active: 'maps', body, crumbs: [{ label: 'الخرائط', href: 'maps.html' }, { label: 'رحلات بولس' }], scripts: ['map-paul.js'] }));
}

// ---------- hubs and people ----------
function mapsHub() {
  const hub = (href, k, t, d, soon) => `<a class="hub${soon ? ' soon' : ''}" href="${href}"><span class="k">${k}${soon ? ' · قريباً' : ''}</span><b>${t}</b><span>${d}</span></a>`;
  const body = `<div class="wrap"><div class="page-head"><span class="eyebrow">الخرائط</span><h1>خرائط الكتاب المقدس</h1><p class="lead">خرائط بأسلوب الأطلس القديم، تربط الأحداث بأماكنها، وتساعدك أن ترى القصة كما جرت على الأرض.</p></div>
<div class="hub-grid">
${hub('journey.html', 'الكتاب كله', 'خريطة الرحلة', 'أربع عشرة مرحلة من الخليقة إلى السماء الجديدة.')}
${hub('paul.html', 'العهد الجديد', 'رحلات بولس', 'الرحلات الأربع، محطة بمحطة، مع سفينة تتبع المسار.')}
${hub('book/galatians.html#sec2', 'العهد الجديد', 'ولاية غلاطية', 'المدن التي أسّس فيها بولس كنائسه الأولى.')}
${hub('#', 'العهد الجديد', 'خدمة المسيح', 'الجليل واليهودية والسامرة وأورشليم.', true)}
${hub('#', 'العهد القديم', 'رحلة الخروج', 'من مصر عبر البحر إلى سيناء ثم البرية.', true)}
${hub('#', 'العهد القديم', 'الممالك والإمبراطوريات', 'إسرائيل ويهوذا وأشور وبابل وفارس.', true)}
</div></div>`;
  write('maps.html', layout({ title: 'الخرائط', depth: 0, active: 'maps', body, crumbs: [{ label: 'الخرائط' }] }));
}

function peopleHub() {
  const PA = '<svg width="36" height="36" viewBox="-40 -42 80 84" aria-hidden="true"><g fill="none" stroke="#E9CF96" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M-30 8q15-7 30 0q15-7 30 0v22q-15-7-30 0q-15-7-30 0z"/><path d="M0 -40l4.5 8v34h-9v-34z"/><path d="M-15 -2h30"/></g></svg>';
  const soon = (t, d) => `<div class="hub soon"><span class="k">قريباً</span><b>${t}</b><span>${d}</span></div>`;
  const body = `<div class="wrap"><div class="page-head"><span class="eyebrow">الشخصيات</span><h1>شخصيات الكتاب المقدس</h1><p class="lead">بطاقة تعريف لكل شخصية رئيسية: من هو، وأين عاش، وما دوره في القصة، وكيف تشير حياته إلى المسيح.</p></div>
<div class="hub-grid">
<a class="hub" href="people/paul.html"><span class="em">${PA}</span><span class="k">العهد الجديد</span><b>بولس الرسول</b><span>من مضطهِد للكنيسة إلى رسول للأمم.</span></a>
<div class="hub" style="background:var(--ink);color:#F3EBDD;border-color:var(--gold);opacity:.85"><span class="k" style="color:var(--gold-light)">بطاقة خاصة · قريباً</span><b style="color:#F3EBDD">الرب يسوع المسيح</b><span style="color:#C9C1B2">أسماؤه وألقابه، ونبوات العهد القديم عنه، ووظائفه نبياً وكاهناً وملكاً.</span></div>
${soon('بطرس', 'الصياد الذي صار راعياً.')}${soon('يوحنا المعمدان', 'الصوت الصارخ في البرية.')}${soon('إبراهيم', 'أبو المؤمنين.')}${soon('موسى', 'النبي ووسيط العهد القديم.')}${soon('داود', 'الملك الذي وُعد بنسل يملك إلى الأبد.')}
</div></div>`;
  write('people.html', layout({ title: 'الشخصيات', depth: 0, active: 'people', body, crumbs: [{ label: 'الشخصيات' }] }));
}

function paulCard() {
  const tpl = fs.readFileSync(path.join(ROOT, 'src/templates/paul-card.html'), 'utf8').replace('__MINI__', fs.readFileSync(path.join(ROOT, 'data/paul-mini.svg'), 'utf8'));
  write('people/paul.html', layout({ title: 'بولس الرسول', depth: 1, active: 'people', body: `<div class="wrap">${tpl.replaceAll('{{up}}', '../')}</div>`, crumbs: [{ label: 'الشخصيات', href: 'people.html' }, { label: 'بولس الرسول' }] }));
}

// ---------- run ----------
home();
testament('ot');
testament('nt');
for (const b of books) {
  bookPage(b);
  if (previewSkip(b)) continue;
  for (let n = 1; n <= b.chapters; n++) chapterPage(b, n);
}
journeyPage();
paulPage();
mapsHub();
peopleHub();
paulCard();
const count = (d) => fs.readdirSync(d, { withFileTypes: true }).reduce((a, e) => a + (e.isDirectory() ? count(path.join(d, e.name)) : 1), 0);
console.log('Built', count(DIST), 'files');
