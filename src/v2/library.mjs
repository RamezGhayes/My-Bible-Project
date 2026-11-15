// Theological library: a structured database built from the works cited in
// chapter studies, plus confessions and verified websites.
import { ar, esc, md, shortName, chapterHref } from '../lib.mjs';
import { header } from './ui.mjs';
import { CATS, TAGS, LIC, AUTHORS, CONFESSIONS, SITES, WORK_LINKS, PD_BEFORE } from '../../content/library/meta.mjs';

const CONF_NAMES = { 'إقرار إيمان وستمنستر': 5, 'التعليم المسيحي الكبير لوستمنستر': 6, 'التعليم المسيحي المختصر لوستمنستر': 7, 'التعليم المسيحي لهايدلبرج': 2, 'قانون دورت': 4 };
const baseTitle = (w) => String(w || '').split(/ \(|، (?=الكتاب|الفصل|المجلد|على |فصل|في كتاب)/)[0].replace(/^عظة\s+/, 'عظة ').trim();
const hash = (s) => { let h = 5381; for (const c of s) h = ((h * 33) ^ c.codePointAt(0)) >>> 0; return h.toString(36); };
export const workId = (n, w) => (n in CONF_NAMES ? 'conf-' + CONF_NAMES[n] : 'w-' + hash(n + '|' + baseTitle(w)));

const COMM = /^(تفسير|شرح|عظات على|خطابات تفسيرية|تأملات تفسيرية|رسالة |رسائل |الرسالة|الرسائل|التكوين|الخروج|اللاويين|متى|مرقس|لوقا|يوحنا|أعمال الرسل|العبرانيين|سفر الرؤيا|1 و2|رسالتا|الإنجيل بحسب|حياة موسى|انتصار الحمل|أعظم من منتصرين|الخروج:|رومية|غلاطية لك|ملك الصليب)/;
function category(n, w, tests) {
  if (n in CONF_NAMES) return 'conf';
  const t = baseTitle(w);
  if (/أسس الدين|العقائد المصلحة|اللاهوت النظامي|مبادئ اللاهوت|الفداء المكتمل|شخص المسيح|احتساب خطية|عقيدة التبرير|موت الموت|عن الروح القدس|سر الروح|قداسة الله|اختارنا الله|الإيمان وحده|وحي الكتاب|عبودية الإرادة|حرية الإرادة|غاية الله|عن تجسد|ضد الآريوسيين|الكرازة الرسولية بالصليب|صليب المسيح|ميلاد المسيح العذراوي|يسوع كإله|الدفاع عن الإيمان|بولس في أثينا|المعجزات المزيفة|الأصولية/.test(t)) return 'st';
  if (/عن وجود الله وصفاته|الطبيعة البشرية في حالتها|مثابرة القديسين|الخطية الساكنة|الشركة مع الله|^الروح القدس$|^معرفة الله$|الكرازة وسيادة الله|تبرير الله|الحرية المسيحية|النعمة والإرادة الحرة|مدينة الله|نور إلهي/.test(t)) return 'st';
  if (/الشريعة هي الملك|^الاعترافات$|حاشية على رومية|مقدمة رسالة فليمون/.test(t)) return 'hist';
  if (/عظات (على|عن|في)|دراسات في|الموعظة على الجبل|أمثال يسوع|خزانة داود|التطويبات|الصلاة الربانية|الوصايا العشر|ملاحظات على سفر|وداع يسوع|من الانتصارية|إنجيل الأزمنة|كلمات مكتوبة على حجر|أسئلة على الأناجيل|عظة عن الكنعانية|الطفل في المذود|المسيح في آلامه/.test(t)) return tests.ot > tests.nt ? 'otc' : 'ntc';
  if (/العهود|معاهدة|مقدمة الملكوت|مسيح العهود/.test(t)) return 'cov';
  if (/اللاهوت الكتابي|لاهوت كتابي|الهيكل ورسالة|نصير مثل|الأخرويات|القيامة والفداء|مجيء الملكوت|السر المُعلَن|الكرازة بالمسيح من كل|تعليم الرسالة إلى العبرانيين|الكتاب المقدس والمستقبل|ظل المسيح|من يصعد|رموز الكتاب|إنسان الخطية|الألف سنة|تاريخ عمل الفداء/.test(t)) return 'bt';
  if (/كتاب الشهداء|رجاء البيوريتانيين|خطاب افتتاح|سيادة المجالات|محاضرات ستون|النعمة العامة|إلى النبلاء|مقدمة لمؤلفاته|بحث في التزام|الإسلام: تحدٍّ/.test(t)) return 'hist';
  if (/الفلاح والشاعر/.test(t)) return 'bg';
  if (/وجهات نظر حول الخمسين|إظهار الروح|مقدمة للعهد الجديد|النساء في الكنيسة|السباق الموضوع/.test(t)) return 'acad';
  if (COMM.test(t) || /NICNT|NIGTC|TNTC|BST/.test(w)) return tests.ot > tests.nt ? 'otc' : 'ntc';
  return 'life';
}

export function buildLibrary({ books, content }) {
  const map = new Map();
  for (const b of books) {
    for (const [n, S] of Object.entries(content[b.id]?.chapters || {})) {
      for (const v of S.voices || []) {
        const id = workId(v.n, v.w);
        let w = map.get(id);
        if (!w) map.set(id, (w = { id, n: v.n, y: v.y || '', title: baseTitle(v.w) || v.w, full: new Set(), chs: [], ot: 0, nt: 0 }));
        w.full.add(v.w);
        w.chs.push({ b, n: +n });
        w[b.testament]++;
      }
    }
  }
  const works = [];
  for (const w of map.values()) {
    if (w.id.startsWith('conf-')) continue;
    const yr = +((String([...w.full][0]).match(/1\d{3}|20\d{2}/) || [])[0] || 0) || (/^(أغسطينوس|أثناسيوس)$/.test(w.n) ? 400 : 0);
    const a = AUTHORS[w.n] || { tag: 'ref', trad: '', en: '' };
    const wl = WORK_LINKS.find((x) => x.a === w.n && w.title.startsWith(x.w));
    const lic = wl?.lic || (yr && yr < PD_BEFORE ? 'pd' : yr ? 'paid' : 'unk');
    works.push({ ...w, full: [...w.full], year: yr, cat: category(w.n, [...w.full][0], w), tag: a.tag, trad: a.trad, en: a.en, lic, links: wl?.links || [] });
  }
  works.sort((x, z) => x.n.localeCompare(z.n, 'ar') || x.year - z.year);
  const confUse = {};
  for (const w of map.values()) if (w.id.startsWith('conf-')) confUse[w.id] = w.chs;
  return { works, confUse };
}

const chChip = (c, depth) => `<a class="lchip" href="${chapterHref(c.b, c.n, depth)}">${esc(shortName(c.b))} ${ar(c.n)}</a>`;
const uniqCh = (chs) => { const s = new Set(); return chs.filter((c) => { const k = c.b.id + c.n; if (s.has(k)) return false; s.add(k); return true; }); };

export function libraryPage(L, depth = 0) {
  const { works, confUse } = L;
  const nCh = new Set(works.flatMap((w) => w.chs.map((c) => c.b.id + c.n))).size;
  const card = (w) => {
    const chs = uniqCh(w.chs);
    const books = [...new Set(chs.map((c) => c.b.id))].join(' ');
    return `<article class="lw" id="${w.id}" data-cat="${w.cat}" data-tag="${w.tag}" data-lic="${w.lic}" data-books="${books}" data-q="${esc((w.n + ' ' + w.en + ' ' + w.title + ' ' + w.trad).toLowerCase())}">
<div class="lwh"><b>${esc(w.title)}</b><span class="ly">${w.year ? ar(w.year) : ''}</span></div>
<div class="la">${esc(w.n)}${w.y ? ` <small>(${ar(w.y)})</small>` : ''}${w.en ? ` <small dir="ltr">${esc(w.en)}</small>` : ''}</div>
${w.trad ? `<div class="lt">${esc(w.trad)}</div>` : ''}
<div class="lm"><span class="lb c">${CATS[w.cat]}</span><span class="lb t-${w.tag}">${TAGS[w.tag]}</span><span class="lb l-${w.lic}">${LIC[w.lic]}</span></div>
${w.full.length > 1 || w.full[0] !== w.title ? `<div class="lf">${w.full.map(esc).join(' · ')}</div>` : ''}
<div class="lch"><span>يُذكر في:</span>${chs.slice(0, 8).map((c) => chChip(c, depth)).join('')}${chs.length > 8 ? `<span class="more">و${ar(chs.length - 8)} أخرى</span>` : ''}</div>
${w.links.length ? `<div class="ll">${w.links.map((l) => `<a href="${l.u}" target="_blank" rel="noopener">${esc(l.t)} ↗</a>`).join('')}</div>` : ''}
</article>`;
  };
  const conf = CONFESSIONS.map((c, i) => {
    const chs = uniqCh(confUse['conf-' + i] || []);
    return `<article class="lw conf" id="conf-${i}"><div class="lwh"><b>${esc(c.n)}</b><span class="ly">${ar(c.y)}</span></div><div class="la"><small dir="ltr">${esc(c.en)}</small></div><p class="lt">${esc(c.note)}</p>
${chs.length ? `<div class="lch"><span>يُذكر في:</span>${chs.map((x) => chChip(x, depth)).join('')}</div>` : ''}${c.links.length ? `<div class="ll">${c.links.map((l) => `<a href="${l.u}" target="_blank" rel="noopener">${esc(l.t)} ↗</a>`).join('')}</div>` : ''}</article>`;
  }).join('');
  const AI = { ok: 'لا يوجد منع معروف', no: 'يمنع الاستعمال في الذكاء الاصطناعي', unk: 'لم يتم التحقق' };
  const sites = SITES.map((s) => `<article class="lw site"><div class="lwh"><b dir="ltr">${esc(s.n)}</b></div><div class="lm"><span class="lb c">${esc(s.cat)}</span><span class="lb l-${s.lic}">${LIC[s.lic]}</span><span class="lb ai-${s.ai}">${AI[s.ai]}</span></div><p class="lt">${esc(s.ver)}</p><div class="ll"><a href="${s.u}" target="_blank" rel="noopener">زيارة الموقع ↗</a></div></article>`).join('');
  const usedCats = Object.keys(CATS).filter((k) => works.some((w) => w.cat === k));
  const bookOpts = [...new Map(works.flatMap((w) => w.chs.map((c) => [c.b.id, c.b]))).values()].sort((a, z) => a.order - z.order);
  return `${header({ back: 'index.html', title: 'المكتبة اللاهوتية' })}
<div class="lib">
<p class="lead">الكتاب المقدس هو السلطة النهائية، وهذه المكتبة أدوات تساعد على فهمه. تجمع الأعمال المذكورة في دراسات الأصحاحات، مع الإقرارات المصلحة والمواقع الموثوقة، وتربط كل عمل بالأصحاحات التي يرد فيها.</p>
<div class="lstats"><div><b>${ar(works.length)}</b><span>عملاً</span></div><div><b>${ar(new Set(works.map((w) => w.n)).size)}</b><span>كاتباً</span></div><div><b>${ar(nCh)}</b><span>أصحاحاً مرتبطاً</span></div></div>
<details class="lhonest"><summary>كيف نستعمل المصادر؟</summary>
<p>الآراء المنسوبة للكتّاب في الدراسات ملخصات بتصرّف لأفكارهم العامة المعروفة، وليست اقتباسات، ولم تُراجع صفحاتها كلها بعد. لذلك نعرضها هنا كـ«أعمال مقترحة للتوسع»، لا كمراجع تمت مراجعتها صفحة بصفحة. لا نضع رابط تحميل إلا لمصدر تحققنا أنه ملكية عامة أو مفتوح الرخصة، ولا نستعمل محتوى المواقع التي تمنع ذلك.</p>
<p><b>${TAGS.ref}</b>: من التقليد المُصلح التاريخي أو المعاصر. <b>${TAGS.acad}</b>: إنجيلي أو أكاديمي أو تاريخي (مثل آباء الكنيسة ولوثر) مفيد مع اختلاف في بعض النقاط. <b>${TAGS.crit}</b>: مفيد لكن فيه آراء تحتاج تمييزاً.</p></details>
<div class="lfilters">
<input type="search" id="lq" placeholder="ابحث باسم الكاتب أو العمل" aria-label="بحث في المكتبة">
<div class="lrow"><select id="lcat" aria-label="التصنيف"><option value="">كل التصنيفات</option>${usedCats.map((k) => `<option value="${k}">${CATS[k]}</option>`).join('')}</select>
<select id="lbook" aria-label="السفر"><option value="">كل الأسفار</option>${bookOpts.map((b) => `<option value="${b.id}">${esc(shortName(b))}</option>`).join('')}</select>
<select id="ltag" aria-label="نوع المصدر"><option value="">كل المصادر</option>${Object.entries(TAGS).map(([k, t]) => `<option value="${k}">${t}</option>`).join('')}</select>
<select id="llic" aria-label="الإتاحة"><option value="">كل الحالات</option>${Object.entries(LIC).map(([k, t]) => `<option value="${k}">${t}</option>`).join('')}</select></div>
<div class="lcount" id="lcount"></div></div>
<h2 class="lsec">الإقرارات والتعاليم المصلحة</h2><div class="lgrid">${conf}</div>
<h2 class="lsec">الأعمال</h2><div class="lgrid" id="lworks">${works.map(card).join('')}</div>
<h2 class="lsec">مواقع ومكتبات رقمية</h2><p class="lnote">ما تحققنا منه مكتوب بجانب كل موقع. المواقع التي تمنع الاستعمال في الذكاء الاصطناعي نضع رابطها فقط.</p><div class="lgrid">${sites}</div>
</div>`;
}
