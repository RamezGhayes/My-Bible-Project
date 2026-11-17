// Static site generator (v2 design). Run: node src/build.mjs
import fs from 'node:fs';
import path from 'node:path';
import { PREVIEW, previewSkip, ROOT, config, books, bookById, bookBySlug, bible, ar, esc, md, up, parseRef, refLabel, refHref, bookHref, chapterHref, shortName, verseText, verses } from './lib.mjs';
import { blocks } from './render.mjs';
import { page, header, IC, plain, clip, firstSentences, chWord, bkWord, vWord, secWord, countWord, BRAND } from './v2/ui.mjs';
import { buildPeople, cardTemplate, cleanName } from './v2/people.mjs';
import { MAPS, mapForChapter, thumb, mapHref, viewer } from './v2/maps.mjs';
import { TOPICS, topicLinks, chapterTopicsBlock, topicsIndex, topicPage, topicsHomeSection } from './v2/topics.mjs';
import { buildLibrary, libraryPage, workId } from './v2/library.mjs';
import { EXPLAINERS, explainersFor, explainPage, plaguesPresent, storyCard as xStory, bentoTile as xTile, explainHref, glyph, xCard, chips as xChips } from './v2/explain.mjs';

const DIST = path.join(ROOT, 'dist');
fs.rmSync(DIST, { recursive: true, force: true });
const PAGES = [];
const write = (rel, html) => { if (rel.endsWith('.html')) { PAGES.push(rel); const url = config.domain + '/' + (rel === 'index.html' ? '' : rel.replace(/index\.html$/, '')); html = html.replace('</head>', `<link rel="canonical" href="${url}">\n<meta property="og:url" content="${url}">\n</head>`); } const f = path.join(DIST, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, html); };
const readJSON = (rel) => JSON.parse(fs.readFileSync(path.join(ROOT, rel), 'utf8'));

// ---------- content ----------
const content = {};
for (const slug of fs.readdirSync(path.join(ROOT, 'content/books'))) {
  const dir = path.join(ROOT, 'content/books', slug);
  const b = bookBySlug[slug];
  if (!b) throw new Error('Unknown book folder: ' + slug);
  const c = { intro: null, chapters: {} };
  if (fs.existsSync(path.join(dir, 'intro.mjs'))) c.intro = (await import(path.join(dir, 'intro.mjs'))).default;
  if (fs.existsSync(path.join(dir, 'chapters'))) {
    for (const f of fs.readdirSync(path.join(dir, 'chapters')).filter((f) => f.endsWith('.mjs'))) c.chapters[+f.replace('.mjs', '')] = (await import(path.join(dir, 'chapters', f))).default;
  }
  content[b.id] = c;
}
const TLINKS = topicLinks();
const study = (b, n) => content[b.id]?.chapters[n];
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
for (const f of fs.readdirSync(path.join(ROOT, 'src/v2/assets'))) fs.copyFileSync(path.join(ROOT, 'src/v2/assets', f), path.join(DIST, 'assets', f));

const PEOPLE = buildPeople(books, content);
// The preview artifact holds at most 512 files, so it keeps full pages only for curated people.
const hasPage = (p) => !PREVIEW || !!p.prof;
const personHref = (p, depth) => (hasPage(p) ? `${up(depth)}people/${p.id}.html` : `${up(depth)}book/${p.apps[0].b.slug}/${p.apps[0].n}.html#p-${p.id}`);

// ---------- splash + home ----------
function home() {
  const ps = mainVerse();
  const splash = `<div id="splash" hidden role="dialog" aria-label="مقدمة"><div class="wm">${esc(config.nameAr)}</div><div class="vs">${esc(ps)}</div><div class="rf">${refLabel(config.verseRef)}</div><div class="ln"></div><button type="button" data-enter>ادخل</button><small>دراسة الكتاب المقدس من منظور مُصلَح</small></div>`;
  const studiedIn = (t) => books.filter((b) => b.testament === t).reduce((n, b) => n + studiedCount(b), 0);
  // Book spines: height follows chapter count; a filled spine is a fully studied book.
  const SPINE = { torah: '#8C2F1E', history: '#9A5A24', poetry: '#B39459', major: '#4E5D32', minor: '#6B7A4A', gospels: '#1F2A44', acts: '#1F2A44', paul: '#4B3D63', general: '#34496B', prophecy: '#34496B' };
  const spines = (t) => books.filter((b) => b.testament === t).map((b, i) => `<i class="${isFull(b) ? 'f' : studiedCount(b) ? 'p' : ''}" style="--c:${SPINE[b.group]};--h:${Math.round(30 + Math.sqrt(b.chapters) * 6.2)}px;--d:${(i * 0.02).toFixed(2)}s" title="${esc(b.name)}"></i>`).join('');
  const tcard = (t, d) => { const list = books.filter((b) => b.testament === t); const ch = list.reduce((n, b) => n + b.chapters, 0); const st = studiedIn(t); return `<a class="h3t" href="${t}.html"><span class="sp" aria-hidden="true">${spines(t)}</span><b>${T_NAME[t]}</b><span class="d">${d}</span><span class="mt"><span>${bkWord(list.length)} · ${chWord(ch)} · ${st === ch ? 'كلها مدروسة' : `${ar(st)} مدروساً`}</span><span class="go">ابدأ ${IC.chev}</span></span></a>`; };
  const words = ps.split(/\s+/);
  const xcards = EXPLAINERS.map((x) => { const c = xChips(x); const b = bookById[x.book]; const chs = x.chapters; return `<a class="h3x" href="${explainHref(x, 0)}"><span class="ch c${c.length > 8 ? 5 : 4}" aria-hidden="true">${c.map((k, j) => `<i style="--c:${k.color};--k:${k.ink};--d:${(j * 0.05).toFixed(2)}s">${glyph(k.icon, 30)}</i>`).join('')}</span><span class="tx"><small>${esc(b.name)} · ${ar(chs[0])}${chs.length > 1 ? '–' + ar(chs[chs.length - 1]) : ''}</small><b>${esc(x.title)}</b><span>${esc(x.sub)}</span></span></a>`; }).join('');
  const GN = { 1: 'الأسس', 2: 'الخلاص', 3: 'حياة المؤمن', 4: 'الكنيسة والعبادة', 5: 'الأمور الأخيرة' };
  const tgroups = Object.keys(GN).map((g, i) => `<button type="button" role="tab" aria-selected="${i === 0}" data-tg="${g}"><i class="g${g}"></i>${GN[g]} <span>${ar(TOPICS.filter((t) => t.group === +g).length)}</span></button>`).join('');
  const tcards = TOPICS.map((t) => `<a class="h3c g${t.group}" href="topics/${t.id}.html" data-g="${t.group}"${t.group === 1 ? '' : ' hidden'}><span class="hd"><i></i><span dir="ltr">${esc(t.en)}</span></span><b>${esc(t.ar)}</b><span>${esc(t.short)}</span></a>`).join('');
  const PBG = ['#26231F', '#1F2A44', '#3A2A2E', '#2A3328', '#33281F', '#2B2F40'];
  const ppl = PEOPLE.list.filter((p) => p.prof && hasPage(p)).sort((a, b) => a.apps[0].b.order - b.apps[0].b.order || a.apps[0].n - b.apps[0].n);
  const pcards = ppl.map((p, i) => { const P = p.prof; return `<a class="h3p" href="${personHref(p, 0)}"><span class="hd"><b>${esc(P.n)}</b>${P.he ? `<span lang="${p.testament === 'ot' ? 'he' : 'el'}">${esc(P.he)}</span>` : ''}</span><span class="im" style="--bg:${PBG[i % 6]}"><span>${esc([...P.n][0])}</span><em>${esc(P.era || '')}</em></span><span class="rl">${esc(P.role)}</span><span class="ln">${esc(P.line)}</span><span class="cl">${(P.cells || []).slice(0, 3).map(([k, v]) => `<span><small>${esc(k)}</small>${esc(v)}</span>`).join('')}</span></a>`; }).join('');
  const T = (h, ic, t, d) => `<a href="${h}"><span class="ti">${ic}</span><span><b>${t}</b><small>${d}</small></span></a>`;
  const arrows = (k) => `<span class="h3a"><button type="button" data-rail-prev="${k}" aria-label="السابق">${IC.chev.replace('class="ic"', 'class="ic" style="transform:scaleX(-1)"')}</button><button type="button" data-rail-next="${k}" aria-label="التالي">${IC.chev}</button></span>`;
  const head = (t, s, extra = '') => `<div class="h3h"><div><h2>${t}</h2><p>${s}</p></div>${extra}</div>`;
  const body = `${splash}
<section class="h3hero full">
<svg class="rings" viewBox="0 0 900 900" aria-hidden="true"><circle cx="450" cy="450" r="440"/><circle cx="450" cy="450" r="360" stroke-dasharray="2 10"/><circle cx="450" cy="450" r="280"/></svg>
<div class="in">
<span class="mark">${BRAND}</span>
<p class="v" lang="ar">${words.map((w, i) => `<span style="--d:${(0.3 + i * 0.09).toFixed(2)}s">${esc(w)} </span>`).join('')}</p>
<small class="rf" style="--d:${(0.5 + words.length * 0.09).toFixed(1)}s">${refLabel(config.verseRef)}</small>
<button type="button" class="hs" data-search style="--d:${(0.8 + words.length * 0.09).toFixed(1)}s">${IC.search}<span>ابحث عن سفر، أو شاهد مثل يو ٣: ١٦، أو شخصية، أو موضوع</span><b>ابحث</b></button>
<nav class="q" aria-label="انتقال سريع" style="--d:${(1 + words.length * 0.09).toFixed(1)}s"><a href="ot.html">العهد القديم</a><a href="nt.html">العهد الجديد</a><a href="maps.html">الشروح المصوّرة</a><a href="topics.html">الموضوعات</a><a href="people.html">الشخصيات</a></nav>
</div></section>
<section class="h3s">${head('دراسة الكتاب المقدس', 'سفراً سفراً، وأصحاحاً أصحاحاً. الكعب الممتلئ سفر مدروس بالكامل.')}
<div class="h3tg">${tcard('ot', 'من الخلق إلى الأنبياء: الوعد والانتظار.')}${tcard('nt', 'المسيح، والكنيسة، والرجاء الأخير.')}</div></section>
<section class="h3s">${head('شروح مصوّرة', 'أحداث ومواضع شرحها النص بالتفصيل، مرسومة لتراها خطوة خطوة.', arrows('x'))}
<div class="h3r" data-rail="x">${xcards}</div></section>
<section class="h3s">${head('موضوعات كتابية', `فصول إقرار إيمان وستمنستر الـ٣٣، وموضوعات مكمّلة، مرتبطة بالأصحاحات.`, '<a class="all" href="topics.html">كل الموضوعات ‹</a>')}
<div class="h3g" role="tablist" aria-label="مجموعات الموضوعات">${tgroups}</div>
<div class="h3cg" aria-live="polite">${tcards}</div></section>
<section class="h3s h3dark full"><div class="wrap">${head('الشخصيات', 'بطاقات تُقلب: الاسم، والمعنى، والدور، ورحلة كل شخصية.', arrows('p'))}
<div class="h3r" data-rail="p">${pcards}</div></div></section>
<section class="h3s">${head('أدوات الدراسة', 'كل ما تحتاجه بجانب النص.')}
<div class="h3tools">${T('maps.html', IC.map, 'الخرائط والشروح', 'رحلات وأماكن وشروح مصوّرة')}${T('journey.html', IC.time, 'القصة في مراحل', 'تاريخ الخلاص على خط واحد')}${T('paul.html', IC.map, 'رحلات بولس', 'أربع رحلات على الخريطة')}${T('tree.html', IC.person, 'شجرة العائلة', 'من آدم إلى أسباط إسرائيل')}${T('harmony.html', IC.list, 'الأناجيل جنباً إلى جنب', 'إشباع الخمسة الآلاف في الأربعة')}${T('library.html', IC.shelf, 'المكتبة اللاهوتية', 'مصادر وإقرارات')}</div></section>
<footer class="h3f full"><div><p class="s">${esc(quoteText('2Tim.3.16'))}</p><small>${refLabel('2Tim.3.16')}</small><span>${esc(config.description)} · النص: ${esc(config.bibleVersion)}</span><button type="button" data-splash>شاهد المقدمة مرة أخرى</button></div></footer>`;
  write('index.html', page({ title: '', depth: 0, nav: 'home', body, cls: 'home v3' }));
}

// ---------- testaments: books carousel ----------
function testament(t) {
  const list = books.filter((b) => b.testament === t);
  const groups = [...new Set(list.map((b) => b.groupName))];
  const card = (b, i) => {
    const c = content[b.id];
    const st = isFull(b) ? '<span class="st full">دراسة كاملة</span>' : c ? '<span class="st part">دراسة جارية</span>' : '<span class="st">النص متاح</span>';
    const sum = c?.intro ? clip(c.intro.summary, 220) : 'النص كاملاً متاح الآن، أصحاحاً أصحاحاً. والمقدمة والدراسة لهذا السفر قيد الإعداد.';
    const done = studiedCount(b);
    return `<a class="cc bk" href="book/${b.slug}.html" data-i="${i}" data-g="${esc(b.groupName)}" data-slug="${b.slug}" data-book="${b.id}" data-total="${b.chapters}">
<div class="k"><span>${esc(b.groupName)}</span>${st}</div>
<div class="num">${esc(shortName(b))}</div>
<h3>${b.name.startsWith('إنجيل') ? 'الإنجيل بحسب ' + esc(shortName(b)) + ' · ' : ''}السفر ${ar(b.order)} من ٦٦</h3>
<p style="margin-top:14px">${esc(sum)}</p>
<div class="kv2"><small>${chWord(b.chapters)}${done && done < b.chapters ? ` · ${ar(done)} مدروس` : ''}</small></div>
<div class="ft"><span data-prog></span><span class="go">افتح ${IC.chev}</span></div></a>`;
  };
  const body = `${header({ back: 'index.html', title: T_NAME[t] })}
<div class="chips" id="gchips">${groups.map((g) => `<button type="button" data-g="${esc(g)}" aria-pressed="false">${esc(g)}</button>`).join('')}</div>
<div class="car" id="car" data-kind="books">${list.map(card).join('')}</div>
<div class="count" id="ccount"></div>`;
  write(`${t}.html`, page({ title: T_NAME[t], depth: 0, nav: t, body }));
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
  const body = `${header({ back: `../${b.testament}.html#b-${b.slug}`, title: esc(b.name), end: c?.intro ? `<a class="b" href="${b.slug}/about.html">عن السفر</a>` : '<span style="width:44px"></span>' })}
<div class="secl" id="secl"></div>
<div class="car" id="car" data-kind="chapters" data-book="${b.id}" data-total="${b.chapters}">${cards}</div>
<div class="scrub" id="scrub">${vs.map((_, i) => `<button type="button" data-jump="${i}" data-key="${b.id}:${i + 1}">${ar(i + 1)}</button>`).join('')}</div>
${c?.intro ? `<a class="wide" href="${b.slug}/about.html" style="background:#fff;color:var(--ink);border:1px solid var(--line)">${IC.read}مقدمة السفر في ${secWord(c.intro.sections.length)}</a>` : ''}`;
  write(`book/${b.slug}.html`, page({ title: b.name, depth: 1, nav: 'home', body }));
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

function readerHTML(b, n, S, depth, { overlay }) {
  const vs = bible(b.id).chapters[n - 1].verses;
  const per = Object.fromEntries((S?.pericopes || []).map((p) => [p.at, p.t]));
  let key = [0, -1];
  if (S?.keyVerse) { try { const p = parseRef(firstRef(S.keyVerse)); if (p.ch === n && p.vs) key = [p.vs, p.ve]; } catch {} }
  const prev = prevOf(b, n), next = nextOf(b, n);
  const nav = `<div class="chnav">${next ? `<a href="${chapterHref(next.b, next.n, depth)}"><small>التالي</small><b>${chTitle(next.b, next.n)}</b></a>` : '<span></span>'}${prev ? `<a class="n" href="${chapterHref(prev.b, prev.n, depth)}"><small>السابق</small><b>${chTitle(prev.b, prev.n)}</b></a>` : '<span></span>'}</div>`;
  const head = overlay
    ? `<header class="sh"><a class="b" href="#" aria-label="رجوع إلى القصة">${IC.close}</a><span class="t">${chTitle(b, n)}${S ? ' · ' + md(S.title) : ''}</span><a class="b" href="#study" aria-label="الدراسة">${IC.menu}</a></header>`
    : `<header class="sh"><a class="b" href="../${b.slug}.html#c${n}" aria-label="الأصحاحات">${IC.back}</a><span class="t">${chTitle(b, n)}</span><span style="width:44px"></span></header>`;
  return `${head}
<div class="rtools"><span>${esc(config.bibleVersion)}</span><span style="display:flex;gap:6px"><button type="button" data-size="-1" aria-label="تصغير الخط">أ−</button><button type="button" data-size="1" aria-label="تكبير الخط">أ+</button></span></div>
${overlay ? '' : `<div class="dh"><span class="ey">${esc(b.name)} · الأصحاح ${ar(n)} من ${ar(b.chapters)}</span><h1>${chTitle(b, n)}</h1></div><div class="soon">دراسة هذا الأصحاح قيد الإعداد. اقرأ النص الآن، وستُضاف قريباً القصة والخريطة والشخصيات والدراسة الكاملة.</div>`}
<div class="rbody"><div class="scr" lang="ar">${vs.map((v) => `${per[v.number] ? `</div><div class="peri">${md(per[v.number])}</div><div class="scr">` : ''}<span class="v${v.number >= key[0] && v.number <= key[1] ? ' key' : ''}" id="v${v.number}"><span class="vn">${ar(v.number)}</span>${esc(v.text)}</span> `).join('')}</div></div>
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
    const rows = [...people.slice(0, 5).map(({ p, d }) => `<a class="pr" href="#p-${p.id}"><span class="av">${esc(p.mono)}</span><span><b>${esc(p.prof ? p.prof.full : p.label)}</b><small>${esc(p.prof ? p.prof.role : clip(d, 60))}</small></span>${IC.chev}</a>`), ...groups.slice(0, Math.max(0, 4 - people.length)).map((g) => `<div class="pr"><span class="av" style="font-size:16px;color:#888">·</span><span><b>${md(g.n)}</b><small>${esc(clip(g.d, 60))}</small></span></div>`)];
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

  const story = `<div class="story" id="story">
<div class="bars">${cards.map(() => '<i></i>').join('')}</div>
<div class="stop"><a href="../${b.slug}.html#c${n}" aria-label="رجوع إلى الأصحاحات">${IC.close}</a><span>${chTitle(b, n)}</span><a href="#study" aria-label="الدراسة الكاملة">${IC.menu}</a></div>
${cards.map((c, i) => `<section class="sc${i === 0 ? ' on' : ''}" style="background:${c.bg};color:${c.fg}" data-fg="${c.fg}">${c.html}${c.more ? `<a class="more" href="#s-${c.more}">${IC.up}التفاصيل</a>` : ''}</section>`).join('')}
<div class="tz r" data-dir="-1"></div><div class="tz l" data-dir="1"></div></div>`;

  // --- study: tiles + detail pages ---
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
    DET.views = { t: plain(S.views.t || 'قراءتان للنص'), ey: 'قراءتان', h: `<div class="blk"><h3>لاهوت العهد</h3><p>${md(S.views.covenant)}</p></div><div class="blk"><h3>التدبيرية</h3><p>${md(S.views.dispensational)}</p></div>${S.views.common ? `<div class="agree"><small>ما نتفق عليه</small><p>${md(S.views.common)}</p></div>` : ''}` };
  }
  if (S.voices?.length) {
    tiles.push({ w: 1, h: `<a class="tile w t-voice" href="#s-voices"><span class="tl"><span>${countWord(S.voices.length, 'صوت واحد', 'صوتان', 'أصوات', 'صوتاً')}</span>${IC.chev}</span><span class="vis"><q>${esc(firstSentences(S.voices[0].b, 60))}</q><span class="names">${S.voices.map((v) => esc(plain(v.n))).join(' · ')}</span></span><span class="tt">من التقليد المُصلَح</span></a>` });
    DET.voices = { t: 'من التقليد المُصلَح', ey: 'ماذا قال معلمو الكنيسة', h: `${S.voices.map((v) => `<div class="blk"><h3>${md(v.n)}</h3><span class="who2">${md(v.y || '')}${v.w ? ` · <a href="${up(2)}library.html#${workId(v.n, v.w)}">${md(v.w)}</a>` : ''}</span><p>${md(v.b)}</p></div>`).join('')}<p class="note">ملخصات بتصرّف لأفكارهم، وليست اقتباسات حرفية. الأعمال المذكورة مقترحة للتوسع، وتجدها مصنّفة في <a href="${up(2)}library.html">المكتبة اللاهوتية</a>.</p>` };
  }
  half.push(`<a class="tile t-you" href="#s-you"><span class="tl"><span>${countWord(S.questions?.length || 0, 'سؤال واحد', 'سؤالان', 'أسئلة', 'سؤالاً')}</span>${IC.chev}</span><span class="vis">${esc(clip(S.questions?.[0] || '', 90))}</span><span class="tt">للتأمل والتطبيق</span></a>`);
  DET.you = { t: 'للتأمل والتطبيق', ey: 'عِشها', h: `${(S.questions || []).map((q, i) => `<div class="blk"><h3><span class="n">${ar(i + 1)}</span><span>${md(q)}</span></h3></div>`).join('')}${S.apply ? `<div class="applyb"><small>للحياة</small>${arr(S.apply).map((p) => `<p>${md(p)}</p>`).join('')}</div>` : ''}` };
  // Arrange: christ, [text, people], map, [word, sum], [hard, bg], views, voices, [refs, you]
  if (half.length % 2) half[half.length - 1] = half[half.length - 1].replace('class="tile ', 'class="tile w ');
  const wide = Object.fromEntries(tiles.map((t) => [(t.h.match(/href="#s-(\w+)"/) || t.h.match(/data-k="(\w+)"/))[1], t.h]));
  const grid = [wide.christ, wide.explain || '', ...half.slice(0, 2), wide.map || '', ...half.slice(2, 4), wide.views || '', ...half.slice(4, 6), wide.voices || '', ...half.slice(6)].join('');
  const ORDER = ['christ', 'sum', 'map', 'people', 'word', 'bg', 'hard', 'views', 'refs', 'voices', 'you'].filter((k) => DET[k]);
  const studyHtml = `<div class="ovl" id="study">
<div class="pg idx" id="pg-idx"><header class="sh"><a class="b" href="#" aria-label="رجوع إلى القصة">${IC.close}</a><span class="t">الدراسة الكاملة</span><a class="b" href="#read" aria-label="النص">${IC.read}</a></header>
<div class="dh"><span class="ey">${md(S.section)}</span><h1>${chTitle(b, n)} · ${md(S.title)}</h1><p>${vWord(vs.length)} · ${secWord(ORDER.length + 1)}</p></div>
<div class="bento">${grid}</div></div>
${ORDER.map((k, i) => `<div class="pg det" id="s-${k}" data-det><header class="sh"><a class="b" href="#study">${IC.back}الدراسة</a><span class="t"></span><a class="b" href="#" aria-label="إغلاق">${IC.close}</a></header>
<div class="dh"><span class="ey">${DET[k].ey}</span><h1>${esc(DET[k].t)}</h1><p>${chTitle(b, n)} · ${md(S.title)}</p></div><div class="dc">${DET[k].h}</div>
${ORDER[i + 1] ? `<a class="nextsec" href="#s-${ORDER[i + 1]}"><span><small>القسم التالي</small><b>${esc(DET[ORDER[i + 1]].t)}</b></span>${IC.chev}</a>` : next ? `<a class="nextsec" href="${chapterHref(next.b, next.n, depth)}"><span><small>الأصحاح التالي</small><b>${chTitle(next.b, next.n)}</b></span>${IC.chev}</a>` : ''}</div>`).join('')}
</div>`;
  const readerOv = `<div class="ovl" id="read"><div class="pg">${readerHTML(b, n, S, depth, { overlay: true })}</div></div>`;
  const viewerHtml = people.length ? `<div class="viewer" id="viewer" aria-label="بطاقة الشخصية">
<div class="vtop"><a href="#" aria-label="إغلاق">${IC.close}</a><span data-vname></span><span style="width:44px"></span></div>
<div class="stage"><div class="pcard"><div class="pin"></div></div></div>
<div class="dots"></div><div class="hint">اسحب يميناً أو يساراً لتقلب البطاقة</div>
<div class="who">${people.map(({ p }) => `<button type="button" data-p="${p.id}" aria-pressed="false">${esc(p.prof ? p.prof.n : p.label)}</button>`).join('')}</div>
<a class="full" data-vfull href="#">الملف الكامل للشخصية</a>
${people.map(({ p }) => cardTemplate(p, {})).join('')}
${people.map(({ p }) => `<a hidden data-pid="${p.id}" href="${personHref(p, depth)}"></a>`).join('')}
</div>` : '';
  const body = `<div data-chapter="${b.id}:${n}"></div>`;
  write(`book/${b.slug}/${n}.html`, page({ title: `${chTitle(b, n)}: ${plain(S.title)}`, depth, body, cls: 'immersive chapter', after: story + studyHtml + readerOv + viewerHtml }));
}

// ---------- people ----------
function peoplePages() {
  const list = [...PEOPLE.list].sort((a, b) => (b.prof ? 1 : 0) - (a.prof ? 1 : 0) || b.chapters - a.chapters || a.apps[0].b.order - b.apps[0].b.order);
  const mini = (p) => `<a class="mini" href="${personHref(p, 0)}" data-t="${p.testament}" data-q="${esc(p.label + ' ' + (p.prof ? p.prof.full + ' ' + p.prof.role : ''))}"><div class="in"><div class="im"><span>${esc(p.mono)}</span></div><div class="tx"><b>${esc(p.prof ? p.prof.n : p.label)}</b><small>${esc(p.prof ? p.prof.role : ar(`${shortName(p.apps[0].b)} ${p.apps[0].n}`))}</small></div></div></a>`;
  const body = `${header({ back: 'index.html', title: 'الشخصيات' })}
<div class="pad" style="padding-top:8px"><p class="lead" style="font-size:15.5px">بطاقة تعريف لكل شخص في الأصحاحات المدروسة. اقلب البطاقة لتعرف من هو، وأين يظهر، وكيف ترتبط قصته بالمسيح.</p></div>
<label class="search">${IC.search}<input type="search" id="pq" placeholder="ابحث باسم الشخصية" aria-label="ابحث باسم الشخصية"></label>
<div class="chips" id="pchips"><button type="button" data-t="all" aria-pressed="true">الكل · ${ar(list.length)}</button><button type="button" data-t="ot" aria-pressed="false">العهد القديم</button><button type="button" data-t="nt" aria-pressed="false">العهد الجديد</button></div>
<div class="pgrid" id="pgrid">${list.map(mini).join('')}</div>`;
  write('people.html', page({ title: 'الشخصيات', depth: 0, nav: 'people', body }));
  for (const p of list.filter(hasPage)) {
    const depth = 1;
    const P = p.prof;
    const map = P?.map ? MAPS.find((m) => m.id === P.map) : null;
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
  const PL = EXPLAINERS.find((x) => x.id === 'plagues');
  write('explain/plagues-present.html', page({ title: `وضع العرض · ${PL.title}`, depth: 1, body: plaguesPresent(PL, 1), cls: 'present immersive' }));
  for (const m of MAPS) {
    write(`maps/${m.id}.html`, page({ title: m.title, depth: 1, body: '', cls: 'immersive mappage', after: viewer(m, 1, { back: '../maps.html' }) }));
  }
  const pm = MAPS.find((m) => m.paul);
  write('paul.html', page({ title: pm.title, depth: 0, body: '', cls: 'immersive mappage', after: viewer(pm, 0, { back: 'maps.html' }) }));
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
  write('journey.html', page({ title: 'القصة في مراحل', depth: 0, nav: 'maps', body }));
}

// ---------- search index (loaded on demand by the search panel) ----------
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
  const refs = books.map((b) => [b.name, b.abbr, b.slug, b.chapters, previewSkip(b) ? 1 : 0]);
  fs.writeFileSync(path.join(DIST, 'assets/search.js'), `window.SIDX=${JSON.stringify({ refs, items })};`);
}

// ---------- run ----------
home();
testament('ot');
testament('nt');
for (const b of books) {
  bookPage(b);
  if (content[b.id]?.intro) aboutPage(b);
  if (previewSkip(b)) continue;
  for (let n = 1; n <= b.chapters; n++) chapterPage(b, n);
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
const count = (d) => fs.readdirSync(d, { withFileTypes: true }).reduce((a, e) => a + (e.isDirectory() ? count(path.join(d, e.name)) : 1), 0);
console.log('Built', count(DIST), 'files');
