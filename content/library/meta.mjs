// Theological library metadata. Works are aggregated automatically from the
// "voices" used in chapter studies; this file adds classification, licensing
// and verified links. Rule: never invent a link, edition or page number.
// verified: what was actually checked, and how (date of check: Nov 2026).

export const CATS = {
  otc: 'تفاسير العهد القديم',
  ntc: 'تفاسير العهد الجديد',
  bt: 'اللاهوت الكتابي',
  st: 'اللاهوت النظامي',
  cov: 'لاهوت العهد',
  disp: 'اللاهوت التدبيري',
  hist: 'تاريخ الكنيسة والإصلاح',
  conf: 'الإقرارات والتعاليم',
  lang: 'اللغات الأصلية',
  bg: 'الدراسات التاريخية والثقافية',
  acad: 'دراسات أكاديمية مساعدة',
  herm: 'علم التفسير',
  life: 'الحياة المسيحية والرعاية'
};

export const TAGS = {
  ref: 'مصدر مُصلَح معتمد',
  acad: 'مصدر أكاديمي مساعد',
  crit: 'مصدر يحتاج إلى قراءة نقدية'
};

export const LIC = {
  pd: 'ملكية عامة',
  open: 'رخصة مفتوحة',
  paid: 'مدفوع أو محمي بحقوق النشر',
  free: 'مجاني للقراءة بشروط الموقع',
  unk: 'غير محدد'
};

// Author-level classification. trad = short tradition note.
export const AUTHORS = {
  'جون كالفن': { tag: 'ref', trad: 'المصلح الفرنسي في جنيف', en: 'John Calvin' },
  'مارتن لوثر': { tag: 'acad', trad: 'مصلح ألماني، التقليد اللوثري', en: 'Martin Luther' },
  'أغسطينوس': { tag: 'acad', trad: 'من آباء الكنيسة اللاتينية، أسقف هيبو', en: 'Augustine of Hippo' },
  'أثناسيوس': { tag: 'acad', trad: 'من آباء الكنيسة، أسقف الإسكندرية', en: 'Athanasius' },
  'ماثيو هنري': { tag: 'ref', trad: 'واعظ مشيخي إنجليزي', en: 'Matthew Henry' },
  'جون أوين': { tag: 'ref', trad: 'لاهوتي بيوريتاني', en: 'John Owen' },
  'توماس واتسون': { tag: 'ref', trad: 'واعظ بيوريتاني', en: 'Thomas Watson' },
  'توماس جودوين': { tag: 'ref', trad: 'لاهوتي بيوريتاني', en: 'Thomas Goodwin' },
  'توماس مانتون': { tag: 'ref', trad: 'واعظ بيوريتاني', en: 'Thomas Manton' },
  'توماس بروكس': { tag: 'ref', trad: 'واعظ بيوريتاني', en: 'Thomas Brooks' },
  'توماس بوستون': { tag: 'ref', trad: 'لاهوتي اسكتلندي', en: 'Thomas Boston' },
  'توماس آدامز': { tag: 'ref', trad: 'واعظ إنجليزي', en: 'Thomas Adams' },
  'ريتشارد باكستر': { tag: 'ref', trad: 'راعٍ بيوريتاني', en: 'Richard Baxter' },
  'ريتشارد سيبز': { tag: 'ref', trad: 'واعظ بيوريتاني', en: 'Richard Sibbes' },
  'جيريمايا بوروز': { tag: 'ref', trad: 'واعظ بيوريتاني', en: 'Jeremiah Burroughs' },
  'جون فلافل': { tag: 'ref', trad: 'واعظ بيوريتاني', en: 'John Flavel' },
  'جون بنيان': { tag: 'ref', trad: 'واعظ معمداني بيوريتاني', en: 'John Bunyan' },
  'ويليام بيركنز': { tag: 'ref', trad: 'لاهوتي بيوريتاني', en: 'William Perkins' },
  'وليم جوج': { tag: 'ref', trad: 'لاهوتي بيوريتاني', en: 'William Gouge' },
  'وليم جنكن': { tag: 'ref', trad: 'واعظ بيوريتاني', en: 'William Jenkyn' },
  'جيمس درهام': { tag: 'ref', trad: 'لاهوتي اسكتلندي', en: 'James Durham' },
  'صموئيل رذرفورد': { tag: 'ref', trad: 'لاهوتي اسكتلندي', en: 'Samuel Rutherford' },
  'ستيفن تشارنوك': { tag: 'ref', trad: 'لاهوتي بيوريتاني', en: 'Stephen Charnock' },
  'هيرمان ويتسيوس': { tag: 'ref', trad: 'لاهوتي هولندي', en: 'Herman Witsius' },
  'فرانسيس توريتين': { tag: 'ref', trad: 'لاهوتي في جنيف', en: 'Francis Turretin' },
  'هنري سكوجال': { tag: 'ref', trad: 'لاهوتي اسكتلندي', en: 'Henry Scougal' },
  'جون كوتون': { tag: 'ref', trad: 'بيوريتاني في نيو إنجلاند', en: 'John Cotton' },
  'روبرت لايتون': { tag: 'ref', trad: 'رئيس أساقفة اسكتلندي', en: 'Robert Leighton' },
  'جوناثان إدواردز': { tag: 'ref', trad: 'لاهوتي أمريكي', en: 'Jonathan Edwards' },
  'تشارلز سبرجن': { tag: 'ref', trad: 'واعظ معمداني مُصلح', en: 'Charles H. Spurgeon' },
  'تشارلز هودج': { tag: 'ref', trad: 'لاهوتي برنستون', en: 'Charles Hodge' },
  'بنجامين وارفيلد': { tag: 'ref', trad: 'لاهوتي برنستون', en: 'B. B. Warfield' },
  'تشارلز بريدجز': { tag: 'ref', trad: 'راعٍ أنجليكاني إنجيلي', en: 'Charles Bridges' },
  'جيه. سي. رايل': { tag: 'ref', trad: 'أسقف أنجليكاني إنجيلي', en: 'J. C. Ryle' },
  'أندرو بونار': { tag: 'ref', trad: 'راعٍ اسكتلندي', en: 'Andrew Bonar' },
  'روبرت موراي ماكشين': { tag: 'ref', trad: 'راعٍ اسكتلندي', en: 'Robert Murray M\'Cheyne' },
  'روبرت كاندليش': { tag: 'ref', trad: 'لاهوتي اسكتلندي', en: 'Robert Candlish' },
  'جون براون من إدنبرة': { tag: 'ref', trad: 'لاهوتي اسكتلندي', en: 'John Brown of Edinburgh' },
  'باتريك فيربيرن': { tag: 'ref', trad: 'لاهوتي اسكتلندي', en: 'Patrick Fairbairn' },
  'توماس تشالمرز': { tag: 'ref', trad: 'راعٍ اسكتلندي', en: 'Thomas Chalmers' },
  'أبراهام كايبر': { tag: 'ref', trad: 'لاهوتي ورجل دولة هولندي', en: 'Abraham Kuyper' },
  'هيرمان بافينك': { tag: 'ref', trad: 'لاهوتي هولندي', en: 'Herman Bavinck' },
  'جيرهاردوس فوس': { tag: 'ref', trad: 'لاهوتي برنستون، رائد اللاهوت الكتابي', en: 'Geerhardus Vos' },
  'جيه. جريشام ماكن': { tag: 'ref', trad: 'لاهوتي برنستون ووستمنستر', en: 'J. Gresham Machen' },
  'جون موراي': { tag: 'ref', trad: 'لاهوتي وستمنستر', en: 'John Murray' },
  'كورنيليوس فان تيل': { tag: 'ref', trad: 'لاهوتي وستمنستر', en: 'Cornelius Van Til' },
  'ميريديث كلاين': { tag: 'ref', trad: 'لاهوتي عهدي', en: 'Meredith G. Kline' },
  'إدموند كلوني': { tag: 'ref', trad: 'لاهوتي وستمنستر', en: 'Edmund P. Clowney' },
  'أو. بالمر روبرتسون': { tag: 'ref', trad: 'لاهوتي عهدي', en: 'O. Palmer Robertson' },
  'ريتشارد جافن': { tag: 'ref', trad: 'لاهوتي وستمنستر', en: 'Richard B. Gaffin Jr.' },
  'أنتوني هوكيما': { tag: 'ref', trad: 'لاهوتي في كالفن سمينري', en: 'Anthony A. Hoekema' },
  'هيرمان ريدربوس': { tag: 'ref', trad: 'عالم عهد جديد هولندي', en: 'Herman Ridderbos' },
  'كلاس سكيلدر': { tag: 'ref', trad: 'لاهوتي هولندي', en: 'Klaas Schilder' },
  'وليم هندريكسن': { tag: 'ref', trad: 'مفسر مُصلح', en: 'William Hendriksen' },
  'سايمون كيستمكر': { tag: 'ref', trad: 'مفسر مُصلح', en: 'Simon J. Kistemaker' },
  'آر. سي. سبرول': { tag: 'ref', trad: 'لاهوتي مشيخي، مؤسس ليجونير', en: 'R. C. Sproul' },
  'جيمس مونتجمري بويس': { tag: 'ref', trad: 'راعٍ مشيخي', en: 'James Montgomery Boice' },
  'فيليب جراهام رايكن': { tag: 'ref', trad: 'راعٍ مشيخي', en: 'Philip Graham Ryken' },
  'سنكلير فيرجسون': { tag: 'ref', trad: 'لاهوتي اسكتلندي', en: 'Sinclair B. Ferguson' },
  'جيه. آي. باكر': { tag: 'ref', trad: 'لاهوتي أنجليكاني مُصلح', en: 'J. I. Packer' },
  'مارتن لويد جونز': { tag: 'ref', trad: 'واعظ ويلزي', en: 'D. Martyn Lloyd-Jones' },
  'جون ستوت': { tag: 'acad', trad: 'واعظ أنجليكاني إنجيلي', en: 'John Stott' },
  'جون بايبر': { tag: 'ref', trad: 'راعٍ معمداني مُصلح', en: 'John Piper' },
  'تيموثي كلر': { tag: 'ref', trad: 'راعٍ مشيخي', en: 'Timothy Keller' },
  'دي. إيه. كارسون': { tag: 'ref', trad: 'عالم عهد جديد إنجيلي مُصلح', en: 'D. A. Carson' },
  'جي. كي. بيل': { tag: 'ref', trad: 'عالم عهد جديد ولاهوت كتابي', en: 'G. K. Beale' },
  'توماس شراينر': { tag: 'ref', trad: 'عالم عهد جديد معمداني مُصلح', en: 'Thomas R. Schreiner' },
  'دوجلاس مو': { tag: 'acad', trad: 'عالم عهد جديد إنجيلي', en: 'Douglas J. Moo' },
  'بروس والتكي': { tag: 'ref', trad: 'عالم عهد قديم', en: 'Bruce K. Waltke' },
  'أليك موتير': { tag: 'acad', trad: 'عالم عهد قديم أنجليكاني إنجيلي', en: 'J. Alec Motyer' },
  'جاي سكلار': { tag: 'acad', trad: 'عالم عهد قديم إنجيلي', en: 'Jay Sklar' },
  'ل. مايكل موراليس': { tag: 'ref', trad: 'عالم عهد قديم مُصلح', en: 'L. Michael Morales' },
  'دين أورتلند': { tag: 'ref', trad: 'كاتب وراعٍ مُصلح', en: 'Dane Ortlund' },
  'جيري بريدجز': { tag: 'ref', trad: 'كاتب إنجيلي مُصلح', en: 'Jerry Bridges' },
  'جويل بيكي': { tag: 'ref', trad: 'لاهوتي مُصلح', en: 'Joel R. Beeke' },
  'آيان موراي': { tag: 'ref', trad: 'مؤرخ مُصلح', en: 'Iain H. Murray' },
  'مارك ديفر': { tag: 'ref', trad: 'راعٍ معمداني مُصلح', en: 'Mark Dever' },
  'جوناثان ليمان': { tag: 'ref', trad: 'كاتب معمداني مُصلح', en: 'Jonathan Leeman' },
  'ليجون دنكن': { tag: 'ref', trad: 'لاهوتي مشيخي', en: 'J. Ligon Duncan' },
  'روبرت ليثام': { tag: 'ref', trad: 'لاهوتي مُصلح', en: 'Robert Letham' },
  'دونالد ماكلويد': { tag: 'ref', trad: 'لاهوتي اسكتلندي', en: 'Donald Macleod' },
  'دونالد ويتني': { tag: 'ref', trad: 'لاهوتي معمداني مُصلح', en: 'Donald S. Whitney' },
  'فيرن بويثريس': { tag: 'ref', trad: 'لاهوتي وستمنستر', en: 'Vern S. Poythress' },
  'دنيس جونسون': { tag: 'ref', trad: 'لاهوتي وستمنستر كاليفورنيا', en: 'Dennis E. Johnson' },
  'كيم ريدلبارجر': { tag: 'ref', trad: 'لاهوتي مُصلح', en: 'Kim Riddlebarger' },
  'ر. كنت هيوز': { tag: 'acad', trad: 'راعٍ إنجيلي', en: 'R. Kent Hughes' },
  'موراي هاريس': { tag: 'acad', trad: 'عالم عهد جديد إنجيلي', en: 'Murray J. Harris' },
  'بول بارنيت': { tag: 'acad', trad: 'أسقف ومؤرخ أنجليكاني إنجيلي', en: 'Paul Barnett' },
  'فيليب إدجكومب هيوز': { tag: 'ref', trad: 'لاهوتي أنجليكاني مُصلح', en: 'Philip E. Hughes' },
  'ليون موريس': { tag: 'acad', trad: 'عالم عهد جديد أنجليكاني إنجيلي', en: 'Leon Morris' },
  'جورج نايت الثالث': { tag: 'ref', trad: 'عالم عهد جديد مشيخي', en: 'George W. Knight III' },
  'ف. ف. بروس': { tag: 'acad', trad: 'عالم عهد جديد إنجيلي', en: 'F. F. Bruce' },
  'دارل بوك': { tag: 'acad', trad: 'عالم عهد جديد إنجيلي', en: 'Darrell L. Bock' },
  'كينيث بيلي': { tag: 'acad', trad: 'عالم عهد جديد، خلفية شرق أوسطية', en: 'Kenneth E. Bailey' },
  'مايكل جرين': { tag: 'acad', trad: 'لاهوتي أنجليكاني إنجيلي', en: 'Michael Green' },
  'واين جرودم': { tag: 'acad', trad: 'لاهوتي إنجيلي', en: 'Wayne Grudem' },
  'جوردن وينام': { tag: 'acad', trad: 'عالم عهد قديم إنجيلي', en: 'Gordon J. Wenham' },
  'كريستوفر رايت': { tag: 'acad', trad: 'عالم عهد قديم إنجيلي، أخلاقيات وإرسالية', en: 'Christopher J. H. Wright' },
  'صموئيل بولتون': { tag: 'ref', trad: 'لاهوتي بيوريتاني من مجمع وستمنستر', en: 'Samuel Bolton' },
  'آرثر بينك': { tag: 'crit', trad: 'كاتب مستقل، كالفيني الفكر ومتفرد في بعض آرائه', en: 'Arthur W. Pink' },
  'راندي ألكورن': { tag: 'acad', trad: 'كاتب إنجيلي', en: 'Randy Alcorn' },
  'سام ألبري': { tag: 'acad', trad: 'راعٍ أنجليكاني إنجيلي', en: 'Sam Allberry' },
  'كيفن ديانج': { tag: 'ref', trad: 'راعٍ مشيخي', en: 'Kevin DeYoung' },
  'كولن مارشال وتوني باين': { tag: 'acad', trad: 'خدام أنجليكان إنجيليون', en: 'Colin Marshall & Tony Payne' },
  'جوني إريكسون تادا': { tag: 'acad', trad: 'كاتبة إنجيلية', en: 'Joni Eareckson Tada' },
  'فرانسيس شيفر': { tag: 'ref', trad: 'لاهوتي ومدافع مشيخي', en: 'Francis A. Schaeffer' },
  'جون نيوتن': { tag: 'ref', trad: 'راعٍ أنجليكاني إنجيلي وكاتب ترانيم', en: 'John Newton' },
  'أوغسطس توبلادي': { tag: 'ref', trad: 'راعٍ أنجليكاني كالفيني', en: 'Augustus Toplady' },
  'دانيال ويتل': { tag: 'acad', trad: 'كاتب ترانيم إنجيلي', en: 'Daniel W. Whittle' },
  'جون فوكس': { tag: 'acad', trad: 'مؤرخ إنجليزي بروتستانتي', en: 'John Foxe' },
  'وليم كيري': { tag: 'acad', trad: 'مرسل معمداني كالفيني', en: 'William Carey' },
  'صموئيل زويمر': { tag: 'ref', trad: 'مرسل من الكنيسة المصلحة في أمريكا', en: 'Samuel M. Zwemer' }
};

// Confessional documents: always present in the library.
export const CONFESSIONS = [
  { n: 'قانون الإيمان النيقاوي', en: 'Nicene Creed', y: '325، 381', note: 'الاعتراف المشترك للكنيسة الجامعة بلاهوت الابن والروح القدس.', links: [] },
  { n: 'إقرار الإيمان البلجيكي', en: 'Belgic Confession', y: '1561', note: 'من الإقرارات الثلاثة للكنائس المصلحة القارية (الصيغ الثلاث للوحدة).', links: [{ t: 'CRCNA: الإقرارات', u: 'https://www.crcna.org/welcome/beliefs/confessions' }] },
  { n: 'التعليم المسيحي لهايدلبرج', en: 'Heidelberg Catechism', y: '1563', note: '129 سؤالاً وجواباً، مرتبة في ثلاثة أقسام: الشقاء، والخلاص، والشكر.', links: [{ t: 'CRCNA: الإقرارات', u: 'https://www.crcna.org/welcome/beliefs/confessions' }] },
  { n: 'إقرار الإيمان الهلفيتي الثاني', en: 'Second Helvetic Confession', y: '1566', note: 'كتبه هاينريش بولينجر، وانتشر في الكنائس المصلحة في سويسرا وأوروبا الشرقية.', links: [] },
  { n: 'قوانين مجمع دورت', en: 'Canons of Dort', y: '1618–1619', note: 'جواب الكنائس المصلحة على الأرمينية، في خمسة فصول عن النعمة السيادية.', links: [{ t: 'CRCNA: الإقرارات', u: 'https://www.crcna.org/welcome/beliefs/confessions' }] },
  { n: 'إقرار إيمان وستمنستر', en: 'Westminster Confession of Faith', y: '1647', note: 'الإقرار المعتمد للكنائس المشيخية، 33 فصلاً. توجد ترجمة عربية من خدمات الألفية الثالثة.', links: [{ t: 'PCA: إقرار وستمنستر', u: 'https://www.pcaac.org/resources/wcf/' }] },
  { n: 'التعليم المسيحي الكبير لوستمنستر', en: 'Westminster Larger Catechism', y: '1647', note: '196 سؤالاً، شرح أوسع للعقيدة وللوصايا العشر وللصلاة الربانية.', links: [] },
  { n: 'التعليم المسيحي المختصر لوستمنستر', en: 'Westminster Shorter Catechism', y: '1647', note: '107 أسئلة، أولها: "ما هي الغاية الرئيسية للإنسان؟".', links: [] }
];

// Websites and digital libraries, with what was actually verified.
// ai: 'no' = terms forbid using content in AI systems (link only, never ingest).
export const SITES = [
  { n: 'Christian Classics Ethereal Library (CCEL)', u: 'https://ccel.org', cat: 'مكتبة رقمية', lic: 'pd', ai: 'ok', ver: 'تم التحقق: تفاسير كالفن (ترجمة جمعية كالفن) وتفسير ماثيو هنري مُعلنة كملكية عامة على الموقع.' },
  { n: 'Thirdmill (خدمات الألفية الثالثة)', u: 'https://thirdmill.org', cat: 'تعليم لاهوتي مجاني', lic: 'free', ai: 'unk', ver: 'تم التحقق: دروس مجانية بلغات منها العربية، ويسمح الموقع بنسخ الدروس المحمّلة وتوزيعها مجاناً. ترجمة عربية لإقرار وستمنستر.' },
  { n: 'Monergism', u: 'https://www.monergism.com', cat: 'مكتبة رقمية مُصلحة', lic: 'free', ai: 'no', ver: 'تم التحقق: شروط الموقع تمنع إدخال إصداراته في أنظمة الذكاء الاصطناعي وقواعد البيانات. نضع الرابط فقط ولا نستعمل محتواه.' },
  { n: 'STEP Bible (Tyndale House)', u: 'https://www.stepbible.org', cat: 'أدوات اللغات الأصلية', lic: 'open', ai: 'ok', ver: 'تم التحقق: أداة مجانية من تيندال هاوس، وبياناتها متاحة للاستعمال في مشاريع أخرى.' },
  { n: 'SBL Greek New Testament', u: 'https://sblgnt.com', cat: 'نص يوناني', lic: 'open', ai: 'unk', ver: 'تم التحقق: رخصة CC BY 4.0، مع شرط ترخيص منفصل للطبعات ثنائية اللغة.' },
  { n: 'Open Scriptures Hebrew Bible', u: 'https://hb.openscriptures.org', cat: 'نص عبري', lic: 'open', ai: 'unk', ver: 'تم التحقق: نص لينينجراد ملكية عامة، والتحليل الصرفي برخصة CC BY 4.0.' },
  { n: 'Blue Letter Bible', u: 'https://www.blueletterbible.org', cat: 'أدوات دراسة', lic: 'free', ai: 'unk', ver: 'لم نجد صفحة شروط تتعلق بالذكاء الاصطناعي. للاستعمال كأداة بحث فقط.' },
  { n: 'Bible Study Tools: تفسير جون جِل', u: 'https://www.biblestudytools.com/commentaries/gills-exposition-of-the-bible/', cat: 'تفاسير', lic: 'pd', ai: 'unk', ver: 'تم التحقق: تفسير جِل (القرن الثامن عشر) ملكية عامة.' },
  { n: 'Ligonier Ministries', u: 'https://www.ligonier.org', cat: 'مؤسسة تعليمية مُصلحة', lic: 'paid', ai: 'unk', ver: 'تم التحقق: سياسة حقوق النشر تتطلب إذناً لإعادة النشر. نضع الرابط فقط.' },
  { n: 'PCA: إقرار وستمنستر', u: 'https://www.pcaac.org/resources/wcf/', cat: 'إقرارات', lic: 'pd', ai: 'ok', ver: 'تم التحقق من وجود الصفحة. نصوص الإقرارات التاريخية ملكية عامة.' },
  { n: 'CRCNA: الإقرارات المصلحة', u: 'https://www.crcna.org/welcome/beliefs/confessions', cat: 'إقرارات', lic: 'free', ai: 'unk', ver: 'تم التحقق من وجود الصفحة: الإقرار البلجيكي وهايدلبرج ودورت.' },
  { n: 'Bible Hub', u: 'https://biblehub.com', cat: 'أدوات دراسة', lic: 'free', ai: 'unk', ver: 'لم يتم التحقق من الشروط بعد.' },
  { n: 'Internet Archive', u: 'https://archive.org', cat: 'مكتبة رقمية', lic: 'free', ai: 'unk', ver: 'لم يتم التحقق من الشروط بعد. الحالة القانونية تختلف من كتاب لآخر.' },
  { n: 'Reformed.org', u: 'https://reformed.org', cat: 'مكتبة رقمية مُصلحة', lic: 'free', ai: 'unk', ver: 'لم يتم التحقق من الشروط بعد.' }
];

// Work-level overrides keyed by title prefix: verified public-domain links.
export const WORK_LINKS = [
  { a: 'جون كالفن', w: 'أسس الدين المسيحي', lic: 'pd', links: [{ t: 'CCEL', u: 'https://ccel.org/ccel/calvin/institutes' }] },
  { a: 'جون كالفن', w: 'تفسير', lic: 'pd', links: [{ t: 'CCEL: تفاسير كالفن', u: 'https://ccel.org/ccel/calvin/commentaries' }] },
  { a: 'ماثيو هنري', w: 'تفسير الكتاب المقدس كله', lic: 'pd', links: [{ t: 'CCEL', u: 'https://ccel.org/ccel/henry/mhc' }] }
];

// Old works (before 1900) are treated as public domain in their original language.
export const PD_BEFORE = 1900;
