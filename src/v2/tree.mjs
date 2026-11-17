// Family tree: the line from Adam to Christ, generation by generation, with the main people around it.
// The spine follows Genesis 5 and 11 (Adam to Abraham) and Matthew 1 (Abraham to Christ).
// Every name carries a verse that names it; the build checks the name is really in that verse (Van Dyck).
// Side people: wives and mothers on one side, brothers, sons and relatives on the other.
import { ar, esc, refLabel, refHref, verseText } from '../lib.mjs';
import { header } from './ui.mjs';

// Person: [id, name, ref, note, match?]  (match = how the verse spells the name, when it differs)
// Row: { s: Person (on the line), w: [ [rel, ...Person] ] wives/mothers, k: [ [rel, ...Person] ] kin, br: branch }
const P = (id, n, ref, note = '', m = '') => ({ id, n, ref, note, m });
const ERAS = [
  {
    id: 'e1', t: 'من آدم إلى نوح', r: 'تك ٤–٥', d: 'عشرة أجيال قبل الطوفان. سفر التكوين يذكر لكل واحد عمره حين وَلد ابنه، ثم «ومات»، إلا أخنوخ.',
    rows: [
      { s: P('adam', 'آدم', 'Gen.5.1', 'أول إنسان، خلقه الله على صورته. ولوقا يختم نسب المسيح به: «بن آدم، ابن الله» (لو ٣: ٣٨).'), w: [['زوجته', P('eve', 'حواء', 'Gen.3.20', 'دعاها آدم حواء «لأنها أم كل حي».')]], k: [['ابنه', P('cain', 'قايين', 'Gen.4.1', 'ابن آدم البكر، قتل أخاه هابيل.')], ['ابنه', P('abel', 'هابيل', 'Gen.4.2', 'قدّم من أبكار غنمه، فنظر الرب إليه وإلى قربانه.')]] },
      { s: P('seth', 'شيث', 'Gen.4.25', 'وُلد عوضاً عن هابيل، ومنه يستمر خط الوعد.') },
      { s: P('enosh', 'أنوش', 'Gen.4.26', 'في أيامه «ابتُدئ أن يُدعى باسم الرب».') },
      { s: P('kenan', 'قينان', 'Gen.5.9') },
      { s: P('mahalalel', 'مهللئيل', 'Gen.5.12') },
      { s: P('jared', 'يارد', 'Gen.5.15') },
      { s: P('enoch', 'أخنوخ', 'Gen.5.18', 'سار مع الله، ولم يوجد لأن الله أخذه (تك ٥: ٢٤؛ عب ١١: ٥).') },
      { s: P('methuselah', 'متوشالح', 'Gen.5.21', 'أطول عمر يذكره الكتاب: ٩٦٩ سنة (تك ٥: ٢٧).') },
      { s: P('lamech', 'لامك', 'Gen.5.25', 'أبو نوح. (غير لامك نسل قايين في تك ٤.)') },
      { s: P('noah', 'نوح', 'Gen.5.29', 'وجد نعمة في عيني الرب، وبنى الفلك، ونجا مع عائلته من الطوفان.') }
    ]
  },
  {
    id: 'e2', t: 'من نوح إلى إبراهيم', r: 'تك ١١', d: 'من نسل سام بعد الطوفان. ولوقا ٣: ٣٦ يذكر «قينان» بين أرفكشاد وشالح، وهو اسم موجود في الترجمة السبعينية لا في النص العبري.',
    rows: [
      { s: P('shem', 'سام', 'Gen.5.32', 'ابن نوح، ومن نسله جاء إبراهيم.'), k: [['أخوه', P('ham', 'حام', 'Gen.5.32', 'ابن نوح، أبو كنعان.')], ['أخوه', P('japheth', 'يافث', 'Gen.5.32', 'ابن نوح.')]] },
      { s: P('arphaxad', 'أرفكشاد', 'Gen.11.10', 'وُلد بعد الطوفان بسنتين.') },
      { s: P('shelah', 'شالح', 'Gen.11.12') },
      { s: P('eber', 'عابر', 'Gen.11.14', 'كثيرون يربطون اسمه بكلمة «عبراني»، وهذا رأي شائع لا يقوله النص صراحة.') },
      { s: P('peleg', 'فالج', 'Gen.11.16', 'في أيامه «قُسمت الأرض» (تك ١٠: ٢٥).') },
      { s: P('reu', 'رعو', 'Gen.11.18') },
      { s: P('serug', 'سروج', 'Gen.11.20') },
      { s: P('nahor1', 'ناحور', 'Gen.11.22', 'جد إبراهيم.') },
      { s: P('terah', 'تارح', 'Gen.11.24', 'أبو أبرام وناحور وهاران، خرج بهم من أور الكلدانيين.') }
    ]
  },
  {
    id: 'e3', t: 'الآباء', r: 'تك ١٢–٥٠ · مت ١: ٢', d: 'الله يدعو أبرام ويعده بنسل وأرض وبركة لكل الأمم. ومن هنا يبدأ متى نسب المسيح: «إبراهيم ولد إسحاق».',
    rows: [
      { s: P('abraham', 'إبراهيم', 'Gen.11.26', 'دعاه الله من أور، ووعده أن تتبارك فيه جميع قبائل الأرض.', 'ابرام'), w: [['زوجته', P('sarah', 'سارة', 'Gen.11.29', 'أم إسحاق، ابن الموعد.', 'ساراي')], ['جارية سارة', P('hagar', 'هاجر', 'Gen.16.1', 'أم إسماعيل.')], ['زوجته بعد سارة', P('keturah', 'قطورة', 'Gen.25.1')]], k: [['أخوه', P('nahor', 'ناحور', 'Gen.11.26', 'من نسله رفقة زوجة إسحاق.')], ['ابن أخيه', P('lot', 'لوط', 'Gen.11.27', 'رافق إبراهيم، ثم سكن سدوم ونجا منها.')]] },
      { s: P('isaac', 'إسحاق', 'Gen.21.3', 'ابن الموعد، وُلد لإبراهيم وسارة في شيخوختهما.'), w: [['زوجته', P('rebekah', 'رفقة', 'Gen.24.67', 'ابنة بتوئيل بن ناحور.')]], k: [['أخوه من أبيه', P('ishmael', 'إسماعيل', 'Gen.16.15', 'ابن إبراهيم من هاجر.')]] },
      { s: P('jacob', 'يعقوب', 'Gen.25.26', 'سماه الله «إسرائيل» (تك ٣٢: ٢٨)، ومن أبنائه الاثني عشر جاءت الأسباط.'), w: [['زوجته', P('leah', 'ليئة', 'Gen.29.16', 'أم يهوذا وخمسة آخرين.')], ['زوجته', P('rachel', 'راحيل', 'Gen.29.16', 'أم يوسف وبنيامين.')], ['جارية راحيل', P('bilhah', 'بلهة', 'Gen.30.4', 'أم دان ونفتالي.')], ['جارية ليئة', P('zilpah', 'زلفة', 'Gen.30.9', 'أم جاد وأشير.')]], k: [['أخوه التوأم', P('esau', 'عيسو', 'Gen.25.25', 'البكر، باع بكوريته ليعقوب. ومنه أدوم.')]] },
      {
        s: P('judah', 'يهوذا', 'Gen.29.35', 'رابع أبناء ليئة. بارَكه يعقوب: «لا يزول قضيب من يهوذا... حتى يأتي شيلون» (تك ٤٩: ١٠).'),
        br: [
          { t: 'باقي أبناء يعقوب: إخوة يهوذا، وأختهم دينة', g: [[P('reuben', 'رأوبين', 'Gen.29.32', 'بكر يعقوب.', 'راوبين'), P('simeon', 'شمعون', 'Gen.29.33'), P('levi', 'لاوي', 'Gen.29.34', 'من نسله الكهنة واللاويون، وموسى وهارون.'), P('issachar', 'يساكر', 'Gen.30.18'), P('zebulun', 'زبولون', 'Gen.30.20'), P('dan', 'دان', 'Gen.30.6'), P('naphtali', 'نفتالي', 'Gen.30.8'), P('gad', 'جاد', 'Gen.30.11'), P('asher', 'أشير', 'Gen.30.13'), P('joseph', 'يوسف', 'Gen.30.24', 'بيع إلى مصر وصار المتسلط على أرضها. ابناه منسى وأفرايم صارا سبطين.'), P('dinah', 'دينة', 'Gen.30.21')]] },
          { t: 'فرع لاوي: لاوي ← قهات ← عمرام ← أولاده الثلاثة', g: [[P('kohath', 'قهات', 'Exod.6.16', 'ابن لاوي.')], [P('amram', 'عمرام', 'Exod.6.18', 'ابن قهات، أبو هارون وموسى.')], [P('aaron', 'هارون', 'Exod.6.20', 'أول رئيس كهنة.'), P('moses', 'موسى', 'Exod.6.20', 'أخرج الشعب من مصر، واستلم الشريعة.'), P('miriam', 'مريم', 'Exod.15.20', 'النبية، أخت هارون وموسى.')]] },
          { t: 'فرع يوسف: زوجته، ثم ابناه', g: [[P('asenath', 'أسنات', 'Gen.41.45', 'زوجة يوسف.')], [P('manasseh', 'منسى', 'Gen.41.51', 'بكر يوسف.'), P('ephraim', 'أفرايم', 'Gen.41.52', 'باركه يعقوب قبل أخيه الأكبر.')]] }
        ]
      }
    ]
  },
  {
    id: 'e4', t: 'من يهوذا إلى داود', r: 'مت ١: ٣–٦ · را ٤: ١٨–٢٢', d: 'عبودية مصر، والبرية، ودخول الأرض، وأيام القضاة. متى يذكر هنا ثلاث نساء غريبات أو مجروحات السيرة: ثامار وراحاب وراعوث، ثم «التي لأوريا».',
    rows: [
      { s: P('perez', 'فارص', 'Matt.1.3', 'ابن يهوذا من ثامار.'), w: [['أمه', P('tamar', 'ثامار', 'Matt.1.3', 'كنة يهوذا. قصتها في تكوين ٣٨.')]], k: [['أخوه التوأم', P('zerah', 'زارح', 'Gen.38.30')]] },
      { s: P('hezron', 'حصرون', 'Matt.1.3') },
      { s: P('ram', 'أرام', 'Matt.1.3', 'يُسمى «رام» في راعوث ٤: ١٩.') },
      { s: P('amminadab', 'عميناداب', 'Matt.1.4') },
      { s: P('nahshon', 'نحشون', 'Matt.1.4', 'رئيس سبط يهوذا في البرية (عد ١: ٧).'), k: [['أخته', P('elisheba', 'أليشابع', 'Exod.6.23', 'زوجة هارون رئيس الكهنة: خط الملوك وخط الكهنة يلتقيان هنا.')]] },
      { s: P('salmon', 'سلمون', 'Matt.1.4'), w: [['زوجته', P('rahab', 'راحاب', 'Matt.1.5', 'أم بوعز. والأرجح أنها راحاب أريحا التي خبأت الجاسوسين (يش ٢؛ عب ١١: ٣١).')]] },
      { s: P('boaz', 'بوعز', 'Matt.1.5', 'الولي الفادي في سفر راعوث.'), w: [['زوجته', P('ruth', 'راعوث', 'Matt.1.5', 'موآبية تركت آلهتها وقالت: «شعبك شعبي وإلهك إلهي» (را ١: ١٦).')]] },
      { s: P('obed', 'عوبيد', 'Matt.1.5') },
      { s: P('jesse', 'يسى', 'Matt.1.5', 'من بيت لحم. «ويخرج قضيب من جذع يسى» (إش ١١: ١).') },
      { s: P('david', 'داود', 'Matt.1.6', 'الملك، ووعده الله أن يقيم من نسله ملكاً يثبت كرسيه إلى الأبد (٢ صم ٧: ١٢–١٦).'), w: [['زوجته', P('michal', 'ميكال', '1Sam.18.27', 'ابنة شاول.')], ['زوجته', P('abigail', 'أبيجايل', '2Sam.3.3', 'كانت امرأة نابال الكرملي.')], ['زوجته، أم سليمان', P('bathsheba', 'بثشبع', '2Sam.11.3', 'متى يسميها «التي لأوريا» (مت ١: ٦).')]], k: [['الملك قبله', P('saul', 'شاول', '1Sam.9.2', 'أول ملوك إسرائيل، من سبط بنيامين.')], ['ابنه', P('absalom', 'أبشالوم', '2Sam.3.3', 'تمرد على أبيه.')], ['ابنه', P('nathan', 'ناثان', '2Sam.5.14', 'نسب المسيح في لوقا ٣ يمر من خلاله، لا من خلال سليمان (لو ٣: ٣١).')]] }
    ]
  },
  {
    id: 'e5', t: 'ملوك يهوذا', r: 'مت ١: ٦–١١ · ١ و٢ ملوك', d: 'من سليمان إلى السبي. انقسمت المملكة بعد سليمان، وبقي نسل داود يملك في أورشليم. متى يختصر القائمة فلا يذكر بعض الملوك.',
    rows: [
      { s: P('solomon', 'سليمان', 'Matt.1.6', 'بنى الهيكل، وأُعطي حكمة.') },
      { s: P('rehoboam', 'رحبعام', 'Matt.1.7', 'في أيامه انقسمت المملكة.'), k: [['ملك الشمال', P('jeroboam', 'يربعام', '1Kgs.12.20', 'ملك على أسباط الشمال العشرة بعد الانقسام.')]] },
      { s: P('abijah', 'أبيا', 'Matt.1.7') },
      { s: P('asa', 'آسا', 'Matt.1.7') },
      { s: P('jehoshaphat', 'يهوشافاط', 'Matt.1.8') },
      { s: P('joram', 'يورام', 'Matt.1.8'), br: [{ t: 'ملوك لم يذكرهم متى بين يورام وعزيا، كل واحد ابن الذي قبله', g: [[P('ahaziah', 'أخزيا', '2Kgs.8.25', 'ابن يورام.')], [P('joash', 'يوآش', '2Kgs.11.2', 'ابن أخزيا، خُبئ طفلاً من عثليا.')], [P('amaziah', 'أمصيا', '2Kgs.14.1', 'ابن يوآش، وأبو عزيا.')]] }] },
      { s: P('uzziah', 'عزيا', 'Matt.1.8', 'يُسمى أيضاً «عزريا» (٢ مل ١٥: ١). في سنة موته رأى إشعياء الرب (إش ٦: ١).') },
      { s: P('jotham', 'يوثام', 'Matt.1.9') },
      { s: P('ahaz', 'أحاز', 'Matt.1.9', 'في أيامه أعطى الله علامة العذراء (إش ٧: ١٤).') },
      { s: P('hezekiah', 'حزقيا', 'Matt.1.9', 'ملك تقي، أنقذ الله أورشليم في أيامه من أشور.') },
      { s: P('manasseh2', 'منسى', 'Matt.1.10', 'أطول ملوك يهوذا حكماً وأكثرهم شراً، ثم تاب (٢ أخ ٣٣: ١٢–١٣).') },
      { s: P('amon', 'آمون', 'Matt.1.10') },
      { s: P('josiah', 'يوشيا', 'Matt.1.10', 'وُجد سفر الشريعة في أيامه فأصلح العبادة.'), k: [['ابنه، ملك', P('jehoahaz', 'يهوآحاز', '2Kgs.23.30')], ['ابنه، أبو يكنيا', P('jehoiakim', 'يهوياقيم', '2Kgs.23.34', 'متى لا يذكره، ويقفز من يوشيا إلى يكنيا حفيده.')], ['ابنه، آخر الملوك', P('zedekiah', 'صدقيا', '2Kgs.24.17', 'في أيامه خربت أورشليم.')]] }
    ]
  },
  {
    id: 'e6', t: 'من السبي إلى المسيح', r: 'مت ١: ١١–١٦', d: 'السبي إلى بابل، ثم الرجوع وبناء الهيكل الثاني. معظم الأسماء بعد زربابل لا يذكرها العهد القديم، ويحفظها متى وحده.',
    rows: [
      { s: P('jeconiah', 'يكنيا', 'Matt.1.11', 'يُسمى «يهوياكين»، سُبي إلى بابل (٢ مل ٢٤: ١٥).') },
      { s: P('shealtiel', 'شألتئيل', 'Matt.1.12') },
      { s: P('zerubbabel', 'زربابل', 'Matt.1.12', 'قاد الراجعين من السبي، وبدأ بناء بيت الرب (عز ٣: ٨).') },
      { s: P('abiud', 'أبيهود', 'Matt.1.13') },
      { s: P('eliakim', 'ألياقيم', 'Matt.1.13') },
      { s: P('azor', 'عازور', 'Matt.1.13') },
      { s: P('zadok', 'صادوق', 'Matt.1.14') },
      { s: P('achim', 'أخيم', 'Matt.1.14') },
      { s: P('eliud', 'أليود', 'Matt.1.14') },
      { s: P('eleazar', 'أليعازر', 'Matt.1.15') },
      { s: P('matthan', 'متان', 'Matt.1.15') },
      { s: P('jacob2', 'يعقوب', 'Matt.1.15', 'أبو يوسف بحسب متى.') },
      { s: P('josephm', 'يوسف', 'Matt.1.16', '«رجل مريم»، من بيت داود (لو ١: ٢٧). أبو يسوع بحسب الشريعة، لا بحسب الجسد.'), w: [['خطيبته', P('mary', 'مريم', 'Matt.1.16', 'العذراء، «التي وُلد منها يسوع». حبلت به من الروح القدس (مت ١: ١٨).')]], k: [['نسيبة مريم', P('elizabeth', 'أليصابات', 'Luke.1.36', 'من بنات هارون، زوجة زكريا الكاهن.')], ['ابن أليصابات', P('john', 'يوحنا', 'Luke.1.13', 'المعمدان، الذي هيأ الطريق أمام المسيح.')]] },
      { s: P('jesus', 'يسوع المسيح', 'Matt.1.16', '«ابن داود ابن إبراهيم» (مت ١: ١). وُلد من مريم العذراء بالروح القدس، وفيه تتم مواعيد الله لإبراهيم وداود.', 'يسوع'), end: true }
    ]
  }
];

export function treePage({ profiles, pages = {}, depth = 0 }) {
  // Safety net: each name must appear in its verse (letters only, ignoring vowel marks and hamza forms).
  const norm = (s) => s.replace(/[ً-ْٰـ]/g, '').replace(/[ٱأإآ]/g, 'ا');
  const all = [];
  for (const e of ERAS) for (const r of e.rows) { all.push(r.s); for (const x of [...(r.w || []), ...(r.k || [])]) all.push(x[1]); for (const b of r.br || []) for (const gr of b.g) all.push(...gr); }
  const seen = new Set();
  for (const p of all) {
    if (seen.has(p.id)) throw new Error(`Tree: duplicate id ${p.id}`);
    seen.add(p.id);
    if (!norm(verseText(p.ref)).includes(norm(p.m || p.n))) throw new Error(`Tree: ${p.n} not in ${p.ref}`);
    if (/—/.test(p.note)) throw new Error(`Tree: em dash in note for ${p.n}`);
  }

  let gen = 0;
  const rel = {};
  const btn = (p, cls, r = '') => { rel[p.id] = r; return `<button type="button" class="tq ${cls}${profiles[p.id] || pages[p.id] ? ' pf' : ''}" data-node="${p.id}" aria-pressed="false">${r ? `<small>${esc(r)}</small>` : ''}<b>${esc(p.n)}</b></button>`; };
  const row = (r) => {
    gen += 1;
    const side = (xs) => (xs || []).map(([rl, p]) => btn(p, 'sd', rl)).join('');
    const br = (r.br || []).map((b) => `<div class="tbr"><span class="tbt">${esc(b.t)}</span><div class="tbc">${b.g.map((gr) => `<span class="tbg">${gr.map((p) => btn(p, 'sd', '')).join('')}</span>`).join('<i aria-hidden="true">←</i>')}</div></div>`).join('');
    return `<li class="trw${r.end ? ' end' : ''}"><div class="tw">${side(r.w)}</div><div class="tsp">${btn(r.s, `ln${r.end ? ' xch' : ''}`)}<span class="tg" aria-label="الجيل ${ar(gen)}">${ar(gen)}</span></div><div class="tk">${side(r.k)}${br}</div></li>`;
  };
  const body = ERAS.map((e) => `<section class="ter" id="${e.id}"><header><span class="ey">${esc(e.r)}</span><h2>${esc(e.t)}</h2><p>${esc(e.d)}</p></header><ol class="tls">${e.rows.map(row).join('')}</ol></section>`).join('');

  const card = (p) => {
    const pr = profiles[p.id], r = rel[p.id];
    const head = `<small>${r ? `${esc(r)} · ` : ''}<a class="r" href="${refHref(p.ref, depth)}">${refLabel(p.ref)}</a></small>`;
    const vs = `<blockquote class="tvq">«${esc(verseText(p.ref))}»</blockquote>`;
    const pg = pages[p.id];
    if (!pr && pg) return `<div class="tcd">${head}${pg.img ? `<a class="tpi" href="${pg.href}"><img src="${pg.img}" alt="" loading="lazy"></a>` : ''}<b>${esc(p.n)}</b>${p.note ? `<p>${esc(p.note)}</p>` : ''}${vs}<a class="tpl" href="${pg.href}">صفحة الشخصية ‹</a></div>`;
    if (!pr) return `<div class="tcd">${head}<b>${esc(p.n)}</b>${p.note ? `<p>${esc(p.note)}</p>` : ''}${vs}</div>`;
    const Q = pr.prof;
    return `<div class="tcd">${head}<div class="h3p"><span class="hd"><b>${esc(Q.n)}</b>${Q.he ? `<span lang="he">${esc(Q.he)}</span>` : ''}</span><span class="im${pr.img ? ' pic' : ''}" style="--bg:#2A3328">${pr.img ? `<img src="${pr.img}" alt="" loading="lazy">` : `<span>${esc([...Q.n][0])}</span>`}<em>${esc(Q.era || '')}</em></span><span class="rl">${esc(Q.role)}</span><span class="ln">${esc(Q.line)}</span><span class="cl">${(Q.cells || []).slice(0, 3).map(([k, v]) => `<span><small>${esc(k)}</small>${esc(v)}</span>`).join('')}</span></div>${p.note ? `<p>${esc(p.note)}</p>` : ''}${vs}<a class="full" href="${pr.href}">الملف الكامل للشخصية</a></div>`;
  };
  const start = all.find((p) => p.id === 'abraham');
  return `${header({ back: 'index.html', title: 'شجرة العائلة' })}
<div class="tr3 tr4">
<aside class="tr3a"><div class="tahd"><span class="ey">شجرة العائلة · من آدم إلى المسيح</span><h1>نسل الوعد</h1>
<nav class="tjump" aria-label="المراحل">${ERAS.map((e) => `<a href="#${e.id}">${esc(e.t)}</a>`).join('')}</nav></div>
<div class="tsheet"><button type="button" class="tclose" aria-label="إغلاق">${'×'}</button><div class="slot" aria-live="polite">${card(start)}</div></div>
<details class="tabout"><summary>كيف تقرأ الشجرة؟</summary><p>الخط الأحمر في الوسط هو نسب المسيح جيلاً بعد جيل، مرقّماً بالترتيب: من آدم إلى إبراهيم كما في التكوين ٥ و١١، ومن إبراهيم إلى المسيح كما في متى ١. وحوله الزوجات والإخوة وأهم الأقارب. اضغط أي اسم لترى الآية التي تذكره.</p><p class="tnum">الأرقام ترتيب الأسماء في هذه القائمة، لا العدد الفعلي للأجيال: الأنساب في الكتاب تختصر أحياناً، ومتى نفسه يحذف بعض الأسماء.</p>
<div class="leg"><span><i class="ln"></i>نسب المسيح</span><span><i class="sd"></i>زوجة أو أم</span><span><i class="kn"></i>إخوة وأقارب</span><span><i class="dot" style="background:var(--gold)"></i>له صفحة شخصية</span></div></details>
<template data-cards>${all.map((p) => `<div data-card="${p.id}">${card(p)}</div>`).join('')}</template>
</aside>
<div class="tr4s">${body}
<div class="tnote"><b>عن النسبين في متى ولوقا</b><p>متى ١ يتتبع النسب من إبراهيم عبر سليمان والملوك إلى يوسف، ويقسمه ثلاث مجموعات من أربعة عشر جيلاً (مت ١: ١٧)، مع حذف بعض الأسماء كما كانت عادة كتابة الأنساب. ولوقا ٣ يصعد من يوسف إلى آدم عبر ناثان بن داود. والمفسرون يشرحون الفرق بأكثر من طريقة، أشهرها أن لوقا يتتبع نسب مريم، أو أن أحدهما يذكر النسب الشرعي والآخر الطبيعي. في الحالتين يسوع ابن داود بحسب الوعد.</p></div>
</div>
</div>`;
}
