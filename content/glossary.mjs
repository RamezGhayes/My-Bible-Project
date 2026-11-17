// القاموس: كلمات صعبة في نص فاندايك، بتعريف قصير من مصدر مُصلَح موثوق.
//
// المصادر (كلاهما ملكية عامة، ونصهما الأصلي محفوظ في data/sources):
//  - easton: قاموس إيستون للكتاب المقدس (M. G. Easton، خادم في الكنيسة الحرة الإسكتلندية المشيخية، الطبعة الثالثة 1897).
//  - wsc: التعليم المسيحي المختصر لوستمنستر (1647). التعريف ترجمة أمينة لنص الجواب.
//
// قواعد كل مادة:
//  - basis: عبارات إنجليزية منقولة حرفياً من المصدر. البناء يتوقف إن لم توجد حرفياً في نص المصدر المحفوظ.
//  - checks: [شاهد، عبارة] كل رقم أو تفصيلة مأخوذة من الكتاب نفسه. البناء يتوقف إن لم توجد العبارة في الآية (بلا تشكيل).
//  - حين يخالف المصدر نص الكتاب نتبع نص الكتاب (مثال: إيستون يذكر طول التابوت ذراعين، والخروج 25: 10 يقول ذراعين ونصفاً).
//  - find: صيغ الكلمة كما في فاندايك (بلا تشكيل). auto: false للكلمات التي لها معنى آخر شائع (ذراع، رَبّي...) فلا تُعلَّم في النص تلقائياً.
//  - books: يقصر التعليم التلقائي على أسفار بعينها حين يتغير معنى الكلمة في غيرها.
//  - لا علامات «» هنا: كل ما بينها يجب أن يكون نصاً حرفياً من فاندايك.

export const CATS = [
  { id: 'worship', t: 'المسكن والعبادة', c: '#B39459', k: '#17191E' },
  { id: 'sacrifice', t: 'الذبائح والأعياد', c: '#8C2F1E', k: '#FAF8F4' },
  { id: 'people', t: 'جماعات ووظائف', c: '#1F2A44', k: '#FAF8F4' },
  { id: 'measure', t: 'مقاييس وعملات', c: '#4E5D32', k: '#FAF8F4' },
  { id: 'words', t: 'كلمات بلغتها الأصلية', c: '#4B3D63', k: '#FAF8F4' },
  { id: 'doctrine', t: 'كلمات عقائدية', c: '#5A3A22', k: '#FAF8F4' }
];

export const GLOSSARY = [
  // ---------- المسكن والعبادة ----------
  {
    id: 'ark', w: 'تابوت العهد', en: 'Ark of the covenant', cat: 'worship', icon: 'ark',
    find: ['تابوت العهد', 'تابوت الرب', 'تابوت الله', 'تابوت الشهادة', 'التابوت', 'تابوتا'], books: ['Exod', 'Lev', 'Num', 'Deut', 'Josh', 'Judg', '1Sam', '2Sam', '1Kgs', '2Kgs', '1Chr', '2Chr', 'Ps', 'Jer', 'Heb', 'Rev'],
    d: 'صندوق مقدس من خشب السنط مغشّى بالذهب، وُضع داخل الحجاب في قدس الأقداس.',
    more: 'طوله ذراعان ونصف، وعرضه وارتفاعه ذراع ونصف. يُسمّى أيضاً تابوت الله وتابوت الشهادة. وُضع فيه لوحا العهد وقسط المن وعصا هارون التي أفرخت.',
    refs: ['Exod.25.10', 'Exod.25.22', 'Heb.9.4'],
    checks: [['Exod.25.10', 'طوله ذراعان ونصف وعرضه ذراع ونصف وارتفاعه ذراع ونصف'], ['Heb.9.4', 'عصا هارون التي افرخت'], ['Exod.26.34', 'قدس الاقداس']],
    src: { k: 'easton', t: 'Ark' },
    basis: ['It is distinguished from all others by such titles as the "ark of God" (1 Sam. 3:3), "ark of the covenant" (Josh. 3:6; Heb. 9:4), "ark of the testimony" (Ex. 25:22).', 'It was made of acacia or shittim wood']
  },
  {
    id: 'mercy-seat', w: 'الغطاء', en: 'Mercy-seat', cat: 'worship', icon: 'ark',
    find: ['الغطاء'], books: ['Exod', 'Lev', 'Num', '1Chr', 'Heb'],
    d: 'غطاء تابوت العهد، من ذهب نقي. عليه كان رئيس الكهنة يرش الدم في يوم الكفارة.',
    more: 'طوله ذراعان ونصف وعرضه ذراع ونصف. الكلمة العبرية معناها الغطاء، والترجمة اليونانية تسميه موضع الكفارة. وتُسمّي الرسالة إلى العبرانيين الكروبين فوقه كروبي المجد.',
    refs: ['Exod.25.17', 'Lev.16.14', 'Heb.9.5'],
    checks: [['Exod.25.17', 'وتصنع غطاء من ذهب نقي طوله ذراعان ونصف'], ['Heb.9.5', 'كروبا المجد مظللين الغطاء']],
    src: { k: 'easton', t: 'Mercy-seat' },
    basis: ['the covering or lid of the ark of the covenant', 'kapporeth, a "covering;" LXX. and N.T., hilasterion']
  },
  {
    id: 'cherub', w: 'الكروبيم', en: 'Cherubim', cat: 'worship', icon: 'ark',
    find: ['كروبيم', 'كروبين', 'كروبا', 'كروب'],
    d: 'صور رمزية تُذكر أولاً عند طرد الإنسان من جنة عدن، ثم على غطاء التابوت حيث وعد الله أن يكلّم موسى من بينهما.',
    more: 'كان على الغطاء كروبان، واحد عند كل طرف، وجهاهما نحو الغطاء. ولم يذكر الكتاب شكلهم عند أول ذكر.',
    refs: ['Gen.3.24', 'Exod.25.18', 'Exod.25.22'],
    checks: [['Gen.3.24', 'الكروبيم'], ['Exod.25.22', 'من بين الكروبين']],
    src: { k: 'easton', t: 'Cherub' },
    basis: ['They are first mentioned in connection with the expulsion of our first parents from Eden (Gen. 3:24). There is no intimation given of their shape or form.', 'God promised to commune with Moses "from between the cherubim" (25:22).']
  },
  {
    id: 'altar', w: 'المذبح', en: 'Altar', cat: 'worship', icon: 'altar',
    find: ['مذبح', 'مذابح'],
    d: 'بناء من تراب أو حجارة غير منحوتة تُقدَّم عليه الذبائح. أول مذبح يذكره الكتاب بناه نوح بعد الطوفان.',
    more: 'في المسكن مذبحان: مذبح المحرقة في الدار (خمس أذرع طولاً وعرضاً وثلاث ارتفاعاً، من خشب السنط مغشّى بالنحاس)، ومذبح البخور الذهبي في القدس.',
    refs: ['Gen.8.20', 'Exod.20.24', 'Exod.27.1'],
    checks: [['Gen.8.20', 'وبنى نوح مذبحا للرب'], ['Exod.27.1', 'طوله خمس اذرع وعرضه خمس اذرع'], ['Exod.27.1', 'وارتفاعه ثلاث اذرع']],
    src: { k: 'easton', t: 'Altar' },
    basis: ['any structure of earth (Ex. 20:24) or unwrought stone (20:25) on which sacrifices were offered', 'The first altar we read of is that erected by Noah (Gen. 8:20).', 'In the tabernacle, and afterwards in the temple, two altars were erected.']
  },
  {
    id: 'laver', w: 'المرحضة', en: 'Laver', cat: 'worship', icon: 'laver',
    find: ['مرحضة'],
    d: 'حوض من نحاس في دار المسكن، بين المذبح وباب الخيمة، يغسل فيه الكهنة أيديهم وأرجلهم قبل الدخول.',
    more: 'صُنعت من مرائي النساء المتجندات عند باب خيمة الاجتماع.',
    refs: ['Exod.30.18', 'Exod.38.8'],
    checks: [['Exod.30.18', 'وتصنع مرحضة من نحاس'], ['Exod.38.8', 'من مرائي المتجندات']],
    src: { k: 'easton', t: 'Laver' },
    basis: ['It contained water wherewith the priests washed their hands and feet when they entered the tabernacle (40:32). It stood in the court between the altar and the door of the tabernacle (30:19, 21).']
  },
  {
    id: 'lampstand', w: 'المنارة', en: 'Candlestick (lampstand)', cat: 'worship', icon: 'lamp',
    find: ['منارة', 'منائر'],
    d: 'منارة من ذهب نقي بسبعة سُرُج، كانت تضيء القدس في المسكن، لأن الخيمة بلا نوافذ.',
    more: 'كانت في الجهة الجنوبية من القدس مقابل مائدة خبز الوجوه، ويُرتّبها الكهنة من المساء إلى الصباح.',
    refs: ['Exod.25.31', 'Exod.25.37', 'Lev.24.3'],
    checks: [['Exod.25.31', 'وتصنع منارة من ذهب نقي'], ['Exod.25.37', 'سرجها سبعة'], ['Lev.24.3', 'من المساء الى الصباح']],
    src: { k: 'easton', t: 'Candlestick' },
    basis: ['The tabernacle was a tent without windows, and thus artificial light was needed.', 'This candlestick was placed on the south side of the Holy Place, opposite the table of shewbread']
  },
  {
    id: 'shewbread', w: 'خبز الوجوه', en: 'Shewbread', cat: 'worship', icon: 'loaves',
    find: ['خبز الوجوه', 'خبز التقدمة'],
    d: 'اثنا عشر قرصاً تُرتَّب صفين على المائدة الذهبية في القدس أمام الرب، وتُجدَّد كل سبت.',
    more: 'الخبز المرفوع يأكله الكهنة في مكان مقدس. وعدد الأقراص يمثّل أسباط إسرائيل الاثني عشر.',
    refs: ['Exod.25.30', 'Lev.24.5', 'Lev.24.8', 'Matt.12.4'],
    checks: [['Lev.24.5', 'اثني عشر قرصا'], ['Lev.24.6', 'صفين كل صف ستة'], ['Lev.24.8', 'في كل يوم سبت']],
    src: { k: 'easton', t: 'Shewbread' },
    basis: ['This bread consisted of twelve loaves made of the finest flour.', 'They were renewed every Sabbath (Lev. 24:5-9)', 'The number of the loaves represented the twelve tribes of Israel']
  },
  {
    id: 'incense', w: 'البخور', en: 'Incense', cat: 'worship', icon: 'incense',
    find: ['بخور', 'البخور'],
    d: 'خليط عطري من أربعة أجزاء متساوية، يُحرق كل يوم على مذبح البخور الذهبي في القدس، وفي يوم الكفارة داخل قدس الأقداس.',
    more: 'البخور الذي لا يُصنع حسب الوصفة سُمّي بخوراً غريباً. وفي المزامير والرؤيا هو صورة للصلاة.',
    refs: ['Exod.30.34', 'Exod.30.7', 'Ps.141.2', 'Rev.5.8'],
    checks: [['Exod.30.34', 'تكون اجزاء متساوية']],
    src: { k: 'easton', t: 'Incense' },
    basis: ['It consisted of four ingredients "beaten small" (Ex. 30:34-36).', 'It was the symbol of prayer (Ps. 141:1, 2; Rev. 5:8; 8:3, 4).']
  },
  {
    id: 'veil', w: 'الحجاب', en: 'Veil (of the tabernacle)', cat: 'worship', icon: 'veil',
    find: ['الحجاب', 'حجاب الهيكل'], books: ['Exod', 'Lev', 'Num', '2Chr', 'Matt', 'Mark', 'Luke', 'Heb'],
    d: 'الستارة التي تفصل القدس عن قدس الأقداس في المسكن ثم في الهيكل. لا يدخل خلفها إلا رئيس الكهنة في يوم الكفارة.',
    more: 'انشق حجاب الهيكل حين مات المسيح على الصليب.',
    refs: ['Exod.26.31', 'Exod.26.33', 'Matt.27.51'],
    checks: [['Matt.27.51', 'حجاب الهيكل قد انشق']],
    src: { k: 'easton', t: 'Veil, vail' },
    basis: ['the veil of the tabernacle and the temple, which hung between the holy place and the most holy', 'This veil was rent when Christ died on the cross (Matt. 27:51; Mark 15:38; Luke 23:45).']
  },
  {
    id: 'tabernacle', w: 'خيمة الاجتماع', en: 'Tabernacle', cat: 'worship', icon: 'gate',
    find: ['خيمة الاجتماع', 'المسكن'], books: ['Exod', 'Lev', 'Num', 'Deut'],
    d: 'الخيمة المقدسة المتنقلة التي صنعها موسى لعبادة الله حسب المثال الذي أراه الله إياه على الجبل.',
    more: 'سُمّيت خيمة الاجتماع لأن الله وعد أن يجتمع هناك ببني إسرائيل. ونفّذ صنعتها بصلئيل وأهولياب.',
    refs: ['Exod.25.9', 'Exod.29.42', 'Exod.35.30'],
    checks: [['Exod.29.42', 'خيمة الاجتماع'], ['Exod.35.30', 'بصلئيل']],
    src: { k: 'easton', t: 'Tabernacle' },
    basis: ['the movable tent-temple which Moses erected for the service of God, according to the "pattern" which God himself showed to him on the mount (Ex. 25:9; Heb. 8:5)', 'It is called "the tabernacle of the congregation," rather "of meeting", i.e., where God promised to meet with Israel (Ex. 29:42)']
  },
  {
    id: 'temple', w: 'الهيكل', en: 'Temple', cat: 'worship', icon: 'gate',
    find: ['الهيكل', 'هيكل'],
    d: 'بيت الله المبني على جبل المريا في أورشليم للعبادة. وأول استعمال للكلمة كان عن خيمة الرب في شيلوه.',
    more: 'في العهد الجديد يتكلم المسيح عن جسده بأنه الهيكل، ويُسمّى المؤمنون هيكل الله.',
    refs: ['1Sam.1.9', '2Chr.3.1', 'John.2.21', '1Cor.3.16'],
    checks: [['1Sam.1.9', 'هيكل الرب'], ['2Chr.3.1', 'جبل المريا'], ['John.2.21', 'هيكل جسده']],
    src: { k: 'easton', t: 'Temple' },
    basis: ['First used of the tabernacle, which is called "the temple of the Lord" (1 Sam. 1:9).', 'In the New Testament the word is used figuratively of Christ\'s human body (John 2:19, 21). Believers are called "the temple of God" (1 Cor. 3:16, 17).', 'the sacred house erected on the summit of Mount Moriah for the worship of God']
  },
  {
    id: 'ephod', w: 'الأفود (الرداء)', en: 'Ephod', cat: 'worship', icon: 'linen',
    find: ['أفود'],
    d: 'ثوب كهنوتي مقدس لبسه رئيس الكهنة أولاً ثم الكهنة. فاندايك يسميه في سفر الخروج الرداء.',
    more: 'رداء رئيس الكهنة مصنوع من ذهب وأسمانجوني وأرجوان وقرمز وبوص مبروم، وتُثبَّت عليه الصدرة. ولبس داود أفوداً من كتان.',
    refs: ['Exod.28.4', 'Exod.28.6', '2Sam.6.14'],
    checks: [['Exod.28.4', 'صدرة ورداء وجبة'], ['Exod.28.6', 'فيصنعون الرداء من ذهب واسمانجوني'], ['2Sam.6.14', 'افود من كتان']],
    src: { k: 'easton', t: 'Ephod' },
    basis: ['a sacred vestment worn originally by the high priest (Ex. 28:4), afterwards by the ordinary priest (1 Sam. 22:18)', 'It was worn by Samuel, and also by David (2 Sam. 6:14).']
  },
  {
    id: 'urim', w: 'الأوريم والتميم', en: 'Urim and Thummim', cat: 'worship', icon: 'lots',
    find: ['الأوريم'],
    d: 'وسيلة أعطاها الله يوضع في صدرة رئيس الكهنة، كان الله يعطي بها إرشاده لإسرائيل وقت الحاجة.',
    more: 'ما هي بالضبط وكيف كانت تُستعمل لا يمكن الجزم به. ومعنى الاسمين على الأرجح: الأنوار والكمالات.',
    refs: ['Exod.28.30', 'Num.27.21'],
    checks: [['Exod.28.30', 'في صدرة القضاء الاوريم والتميم']],
    src: { k: 'easton', t: 'Thummim' },
    basis: ['What the "Urim and Thummim" were cannot be determined with any certainty.', 'they were a certain divinely-given means by which God imparted, through the high priest, direction and counsel to Israel when these were needed.']
  },

  // ---------- الذبائح والأعياد ----------
  {
    id: 'burnt-offering', w: 'المحرقة', en: 'Burnt offering', cat: 'sacrifice', icon: 'burnt',
    find: ['محرقة', 'محرقات'],
    d: 'ذبيحة تُحرق كلها على المذبح ولا يؤكل منها شيء. وهي أكثر الذبائح تكراراً، والوحيدة على الأرجح المذكورة في سفر التكوين.',
    more: 'كانت تعبّر عن تكريس مقدّمها لله تكريساً كاملاً، وإلى هذا المعنى تشير رومية 12: 1.',
    refs: ['Gen.8.20', 'Lev.1.9', 'Rom.12.1'],
    checks: [['Lev.1.9', 'محرقة']],
    src: { k: 'easton', t: 'Burnt offering' },
    basis: ['this was wholly burnt, a "whole burnt offering." It was the most frequent form of sacrifice, and apparently the only one mentioned in the book of Genesis.', 'These offerings signified the complete dedication of the offerers unto God. This is referred to in Rom. 12:1.']
  },
  {
    id: 'sin-offering', w: 'ذبيحة الخطية', en: 'Sin-offering', cat: 'sacrifice', icon: 'sin',
    find: ['ذبيحة خطية', 'ذبيحة الخطية'],
    d: 'ذبيحة يقدمها من أخطأ، فرداً كان أو الجماعة كلها أو رئيس الكهنة. في يوم الكفارة كان دمها يُدخل إلى قدس الأقداس ويُرش على الغطاء.',
    more: 'تُظهر حاجة كل خاطئ إلى خلاص المسيح، الذي يسمّي العهد الجديد دمه الدم الكريم الذي يطهّر من كل خطية.',
    refs: ['Lev.4.3', 'Lev.16.15', '1John.1.7'],
    checks: [['1John.1.7', 'يطهرنا من كل خطية']],
    src: { k: 'easton', t: 'Sin-offering' },
    basis: ['The blood was then carried into the holy of holies and sprinkled on the mercy-seat.', 'we see thus impressively disclosed the need in which every sinner stands of the salvation of Christ']
  },
  {
    id: 'atonement', w: 'الكفارة', en: 'Atonement', cat: 'sacrifice', icon: 'sin',
    find: ['كفارة', 'الكفارة'],
    d: 'المصالحة بين الله والخاطئ، والوسيلة التي تتم بها: إيفاء عن الذنب. وفي المسيح هي عمله الذي أوفى به عن خطايانا نائباً عنا.',
    more: 'لاهوتيو الإصلاح فضّلوا كلمة الإيفاء: كل ما عمله المسيح بدلاً من الخطاة ولأجلهم ليوفي مطالب ناموس الله وعدله، بآلامه وطاعته.',
    refs: ['Exod.32.30', 'Lev.4.26', 'Rom.5.11'],
    checks: [['Lev.4.26', 'يكفر']],
    src: { k: 'easton', t: 'Atonement' },
    basis: ['atonement is reconciliation', 'it means satisfaction, and in this sense to make an atonement for one is to make satisfaction for his offences', 'Christ\'s satisfaction is all he did in the room and in behalf of sinners to satisfy the demands of the law and justice of God.']
  },
  {
    id: 'day-of-atonement', w: 'يوم الكفارة', en: 'Day of Atonement', cat: 'sacrifice', icon: 'goat',
    find: ['يوم الكفارة'],
    d: 'اليوم السنوي العظيم للتذلل والتكفير عن خطايا الشعب كله، في العاشر من الشهر السابع، وهو الصوم الوحيد الذي أمرت به شريعة موسى.',
    more: 'تفاصيله في اللاويين 16، وفيه يدخل رئيس الكهنة إلى قدس الأقداس.',
    refs: ['Lev.16.29', 'Lev.23.27', 'Acts.27.9'],
    checks: [['Lev.23.27', 'العاشر من هذا الشهر السابع فهو يوم الكفارة']],
    src: { k: 'easton', t: 'Atonement, Day of' },
    basis: ['The great annual day of humiliation and expiation for the sins of the nation, "the fast" (Acts 27:9), and the only one commanded in the law of Moses.']
  },
  {
    id: 'passover', w: 'الفصح', en: 'Passover', cat: 'sacrifice', icon: 'door',
    find: ['فصح', 'الفصح'],
    d: 'أهم الأعياد السنوية الثلاثة الكبرى، تذكاراً لعبور الرب عن بيوت بني إسرائيل حين ضرب أبكار مصر.',
    more: 'يُسمّى أيضاً عيد الفطير لأن الخمير لا يؤكل فيه. وصارت الكلمة تعني أيضاً الخروف المذبوح، ولذلك يقول بولس: فصحنا أيضاً المسيح قد ذُبح لأجلنا.',
    refs: ['Exod.12.13', 'Exod.12.15', '1Cor.5.7'],
    checks: [['Exod.12.13', 'فارى الدم واعبر عنكم'], ['1Cor.5.7', 'فصحنا ايضا المسيح قد ذبح لاجلنا']],
    src: { k: 'easton', t: 'Passover' },
    basis: ['It was kept in remembrance of the Lord\'s passing over the houses of the Israelites (Ex. 12:13) when the first born of all the Egyptians were destroyed.', 'The word afterwards came to denote the lamb that was slain at the feast (Mark 14:12-14; 1 Cor. 5:7).']
  },
  {
    id: 'pentecost', w: 'يوم الخمسين', en: 'Pentecost', cat: 'sacrifice', icon: 'loaves',
    find: ['يوم الخمسين'],
    d: 'عيد الحصاد، بعد الفصح بسبعة أسابيع كاملة، في اليوم الخمسين. وفيه حلّ الروح القدس على التلاميذ في أورشليم.',
    more: 'في العهد القديم يُسمّى عيد الحصاد ويوم الباكورة، وتُقدَّم فيه تقدمة جديدة للرب.',
    refs: ['Lev.23.15', 'Lev.23.16', 'Acts.2.1'],
    checks: [['Lev.23.16', 'تحسبون خمسين يوما'], ['Acts.2.1', 'يوم الخمسين']],
    src: { k: 'easton', t: 'Pentecost' },
    basis: ['seven complete weeks, i.e., forty-nine days, were to be reckoned, and this feast was held on the fiftieth day.', 'the day on which the Spirit descended upon the apostles']
  },
  {
    id: 'booths', w: 'عيد المظال', en: 'Feast of Tabernacles', cat: 'sacrifice', icon: 'booth',
    find: ['عيد المظال'],
    d: 'ثالث الأعياد السنوية الكبرى، بعد الحصاد في الشهر السابع، يسكن فيه الشعب في مظال من أغصان الشجر.',
    more: 'كان تذكاراً لسكنى إسرائيل في المظال في البرية، وشكراً على الحصاد.',
    refs: ['Lev.23.34', 'Lev.23.42', 'Lev.23.43'],
    checks: [['Lev.23.34', 'عيد المظال سبعة ايام'], ['Lev.23.43', 'في مظال اسكنت بني اسرائيل']],
    src: { k: 'easton', t: 'Tabernacles, Feast of' },
    basis: ['The third of the great annual festivals of the Jews (Lev. 23:33-43).', 'the people left their homes and lived in booths formed of the branches of trees', 'to be a memorial of the wilderness wanderings']
  },
  {
    id: 'jubilee', w: 'سنة اليوبيل', en: 'Jubilee', cat: 'sacrifice', icon: 'shofar',
    find: ['اليوبيل', 'يوبيلا'],
    d: 'السنة الخمسون، تُعلَن بالبوق. فيها ترجع الأرض إلى صاحبها الأصلي، ويُعتق العبيد، ولا يُزرع الحقل.',
    more: 'لا يسجل الكتاب احتفالاً فعلياً بها، لكن فيه إشارات كثيرة إليها.',
    refs: ['Lev.25.10', 'Lev.25.11', 'Lev.25.13'],
    checks: [['Lev.25.10', 'وتقدسون السنة الخمسين'], ['Lev.25.13', 'في سنة اليوبيل هذه ترجعون كل الى ملكه']],
    src: { k: 'easton', t: 'Jubilee' },
    basis: ['All landed property during that year reverted to its original owner', 'There is no record in Scripture of the actual observance of this festival, but there are numerous allusions']
  },
  {
    id: 'sabbath', w: 'السبت', en: 'Sabbath', cat: 'sacrifice', icon: 'matzah',
    find: ['السبت', 'سبت', 'السبوت'],
    d: 'يوم الراحة. الكلمة العبرية معناها الراحة من العمل. أسسه الله منذ الخليقة حين استراح في اليوم السابع وقدّسه.',
    more: 'أعطته شريعة سيناء وصية. ثم حرّف اليهود معناه بتقاليدهم، فأعاده الرب يسوع إلى قصده: السبت إنما جُعل لأجل الإنسان.',
    refs: ['Gen.2.3', 'Exod.20.8', 'Mark.2.27'],
    checks: [['Gen.2.3', 'وبارك الله اليوم السابع وقدسه'], ['Mark.2.27', 'السبت انما جعل لاجل الانسان']],
    src: { k: 'easton', t: 'Sabbath' },
    basis: ['(Heb. verb shabbath, meaning "to rest from labour"), the day of rest.', 'Our Lord rescued it from their perversions, and recalled to them its true nature and intent']
  },
  {
    id: 'tithe', w: 'العشور', en: 'Tithe', cat: 'sacrifice', icon: 'grain',
    find: ['العشور', 'عشور'],
    d: 'عُشر الدخل يُخصَّص لله. عرفه الآباء قبل موسى: أعطى إبراهيم ملكي صادق العشر، ونذر يعقوب العشر.',
    more: 'في الشريعة كانت العشور ميراث اللاويين عوض خدمتهم في خيمة الاجتماع.',
    refs: ['Gen.14.20', 'Gen.28.22', 'Num.18.21', 'Mal.3.10'],
    checks: [['Gen.14.20', 'فاعطاه عشرا من كل شيء'], ['Num.18.21', 'كل عشر في اسرائيل ميراثا'], ['Gen.28.22', 'اعشره لك']],
    src: { k: 'easton', t: 'Tithe' },
    basis: ['A tenth of the produce of the earth consecrated and set apart for special purposes.', 'Abraham paid tithes to Melchizedek (Gen. 14:20; Heb. 7:6)']
  },
  {
    id: 'corban', w: 'قربان', en: 'Corban', cat: 'words', icon: 'grain',
    find: ['قربان*'],
    d: 'كلمة عبرية معناها عطية أو تقدمة مكرّسة لله. وفاندايك يستعملها لكل تقدمة يقرّبها الإنسان.',
    more: 'في مرقس 7 وبّخ الرب يسوع من يقول عن ماله إنه قربان ليتهرب من إكرام أبيه وأمه.',
    refs: ['Lev.1.2', 'Mark.7.11'],
    checks: [['Mark.7.11', 'قربان اي هدية'], ['Lev.1.2', 'قربانا']],
    src: { k: 'easton', t: 'Corban' },
    basis: ['It means a gift or offering consecrated to God.']
  },
  {
    id: 'nazirite', w: 'النذير', en: 'Nazarite', cat: 'people', icon: 'booth',
    find: ['نذير', 'النذير'], books: ['Num', 'Judg', 'Amos', 'Lam'],
    d: 'إسرائيلي ينذر نفسه للرب مدة معلومة. معنى الكلمة المنفصل المكرّس لله.',
    more: 'النذر يعني ثلاثة أشياء: لا خمر ولا شيء من العنب، ولا يمر موسى على رأسه، ولا يقترب من جسد ميت.',
    refs: ['Num.6.2', 'Num.6.3', 'Num.6.5', 'Num.6.6'],
    checks: [['Num.6.3', 'فعن الخمر والمسكر يفترز'], ['Num.6.5', 'لا يمر موسى على راسه'], ['Num.6.6', 'لا ياتي الى جسد ميت']],
    src: { k: 'easton', t: 'Nazarite' },
    basis: ['The word denotes generally one who is separated from others and consecrated to God.', 'The vow of a Nazarite involved these three things']
  },
  {
    id: 'circumcision', w: 'الختان', en: 'Circumcision', cat: 'sacrifice', icon: 'confess',
    find: ['ختان', 'الختان'],
    d: 'علامة العهد التي أعطاها الله لإبراهيم ونسله: يُختن كل ذكر ابن ثمانية أيام.',
    more: 'كعلامة في الكنيسة انتهى مع العهد الجديد، وقاوم الرسل من أرادوا فرضه على المؤمنين من الأمم.',
    refs: ['Gen.17.10', 'Gen.17.12', 'Gal.6.15', 'Acts.15.1'],
    checks: [['Gen.17.12', 'ابن ثمانية ايام يختن منكم كل ذكر']],
    src: { k: 'easton', t: 'Circumcision' },
    basis: ['was appointed by God to be the special badge of his chosen people, an abiding sign of their consecration to him', 'As a rite of the church it ceased when the New Testament times began (Gal. 6:15; Col. 3:11).']
  },
  {
    id: 'birthright', w: 'البكورية', en: 'Birthright', cat: 'people', icon: 'confess',
    find: ['بكورية*'],
    d: 'الامتيازات الخاصة بالابن البكر: نصيب اثنين من ميراث أبيه، وسلطة أبيه في البيت.',
    more: 'باع عيسو بكوريته ليعقوب. والعهد الجديد يسمّي المسيح بكراً بين إخوة كثيرين.',
    refs: ['Deut.21.17', 'Gen.25.33', 'Rom.8.29'],
    checks: [['Gen.25.33', 'فباع بكوريته ليعقوب'], ['Deut.21.17', 'نصيب اثنين']],
    src: { k: 'easton', t: 'Birthright' },
    basis: ['This word denotes the special privileges and advantages belonging to the first-born son among the Jews.', 'a double portion of the paternal inheritance (Deut. 21:15-17)', 'Esau transferred his birth-right to Jacob (Gen. 25:33).']
  },
  {
    id: 'manna', w: 'المن', en: 'Manna', cat: 'sacrifice', icon: 'matzah',
    find: ['المن'],
    d: 'الطعام الذي أعطاه الله لإسرائيل بمعجزة في البرية أربعين سنة. أبيض كبزر الكزبرة، وطعمه كرقاق بعسل.',
    more: 'لم يكن ينزل في السبت، فكان الشعب يجمع نصيبين في اليوم السادس. وانقطع حين أكلوا من غلة أرض كنعان.',
    refs: ['Exod.16.15', 'Exod.16.31', 'Exod.16.35', 'Josh.5.12'],
    checks: [['Exod.16.31', 'وهو كبزر الكزبرة ابيض وطعمه كرقاق بعسل'], ['Exod.16.35', 'اربعين سنة']],
    src: { k: 'easton', t: 'Manna' },
    basis: ['the food miraculously supplied to them during their wanderings in the wilderness (Ex. 16:15-35)', 'as on the Sabbath none fell, on the preceding day a double portion was given']
  },

  // ---------- جماعات ووظائف ----------
  {
    id: 'levites', w: 'اللاويون', en: 'Levites', cat: 'people', icon: 'table',
    find: ['اللاويين', 'اللاويون', 'لاويين', 'لاويون', 'اللاوي'],
    d: 'نسل سبط لاوي. وغالباً يقصد بالاسم من أُفرزوا من السبط لخدمة المقدس مساعدين للكهنة.',
    more: 'أعطاهم الرب لهارون وبنيه ليخدموا في خيمة الاجتماع، ولم يكن لهم نصيب أرض بل كانت العشور ميراثهم.',
    refs: ['Num.3.6', 'Num.3.9', 'Num.18.21'],
    checks: [['Num.3.9', 'فتعطي اللاويين لهارون ولبنيه'], ['Num.18.23', 'لا ينالون نصيبا']],
    src: { k: 'easton', t: 'Levite' },
    basis: ['A descendant of the tribe of Levi', 'that portion of the tribe which was set apart for the subordinate offices of the sanctuary service (1 Kings 8:4; Ezra 2:70), as assistants to the priests.']
  },
  {
    id: 'high-priest', w: 'رئيس الكهنة', en: 'High priest', cat: 'people', icon: 'linen',
    find: ['رئيس الكهنة', 'الكاهن العظيم'],
    d: 'رأس الكهنوت في إسرائيل. أول من مُسح لهذه الوظيفة هارون، وكانت له ثياب خاصة تنتقل إلى من يخلفه.',
    more: 'وحده كان يدخل قدس الأقداس في يوم الكفارة. والرسالة إلى العبرانيين تقدّم المسيح رئيس كهنة عظيماً.',
    refs: ['Exod.29.7', 'Exod.29.29', 'Lev.16.32', 'Heb.4.14'],
    checks: [['Exod.29.29', 'والثياب المقدسة التي لهارون تكون لبنيه بعده'], ['Heb.4.14', 'رئيس كهنة عظيم']],
    src: { k: 'easton', t: 'High priest' },
    basis: ['Aaron was the first who was solemnly set apart to this office', 'He wore a peculiar dress, which on his death passed to his successor in office (Ex. 29:29, 30).']
  },
  {
    id: 'pharisees', w: 'الفريسيون', en: 'Pharisees', cat: 'people', icon: 'confess',
    find: ['الفريسيين', 'الفريسيون', 'فريسي', 'فريسيا'],
    d: 'إحدى فرق اليهود الثلاث، وكانت في زمن المسيح الفرقة الشعبية. الاسم معناه المنفصلون.',
    more: 'كانوا مدققين جداً في تفاصيل الناموس، لكن ديانتهم صارت شكلاً، فوبّخهم الرب على بر الذات. وبولس كان فريسياً.',
    refs: ['Matt.3.7', 'Matt.23.23', 'Acts.23.6'],
    checks: [['Acts.23.6', 'انا فريسي']],
    src: { k: 'easton', t: 'Pharisees' },
    basis: ['Separatists (Heb. persahin, from parash, "to separate").', 'In the time of our Lord they were the popular party (John 7:48).', 'Paul, when brought before the council of Jerusalem, professed himself a Pharisee']
  },
  {
    id: 'sadducees', w: 'الصدوقيون', en: 'Sadducees', cat: 'people', icon: 'confess',
    find: ['الصدوقيين', 'الصدوقيون'],
    d: 'فرقة يهودية أنكرت القيامة ووجود الملائكة والأرواح، وكان منها كثيرون من شيوخ المجمع.',
    more: 'لا يذكرهم إنجيل يوحنا. وأصلهم غير معروف بيقين.',
    refs: ['Matt.22.23', 'Acts.23.8'],
    checks: [['Acts.23.8', 'الصدوقيين يقولون انه ليس قيامة ولا ملاك ولا روح']],
    src: { k: 'easton', t: 'Sadducees' },
    basis: ['their attempting to ridicule the doctrine of the resurrection, which they denied, as they also denied the existence of angels', 'The origin of this Jewish sect cannot definitely be traced.']
  },
  {
    id: 'scribes', w: 'الكتبة', en: 'Scribes', cat: 'people', icon: 'confess',
    find: ['الكتبة'],
    d: 'في البداية موظفون كبار يكتبون أوامر الملك. وبعد السبي صاروا دارسي الناموس ونُسّاخه ومعلّميه.',
    more: 'في الأناجيل يظهرون مع الفريسيين كمعلمين للشريعة.',
    refs: ['2Sam.8.17', 'Jer.36.4', 'Matt.23.2'],
    checks: [['Matt.23.2', 'الكتبة والفريسيون']],
    src: { k: 'easton', t: 'Scribes' },
    basis: ['The scribes acted as secretaries of state', 'after the Captivity, when the nation lost its independence, the scribes turned their attention to the law']
  },
  {
    id: 'publicans', w: 'العشارون', en: 'Publicans', cat: 'people', icon: 'eye',
    find: ['عشار', 'العشارين', 'العشارون', 'عشارين', 'عشارا'],
    d: 'جباة الضرائب. في زمن العهد الجديد كانت الضرائب تُدفع للرومان، فكان اليهود يكرهون جباتها.',
    more: 'كثيراً ما ظلموا الناس. وكان زكا رئيساً للعشارين، واتُّهم الرب يسوع بأنه محب للعشارين والخطاة.',
    refs: ['Luke.19.2', 'Luke.7.34', 'Luke.18.10'],
    checks: [['Luke.19.2', 'رئيس للعشارين'], ['Luke.7.34', 'محب للعشارين والخطاة']],
    src: { k: 'easton', t: 'Publican' },
    basis: ['In New Testament times these taxes were paid to the Romans, and hence were regarded by the Jews as a very heavy burden', 'Jesus was accused of being a "friend of publicans and sinners" (Luke 7:34).']
  },
  {
    id: 'samaritans', w: 'السامريون', en: 'Samaritans', cat: 'people', icon: 'gate',
    find: ['السامريين', 'السامريون', 'سامري', 'سامريا', 'سامرية', 'السامرية'],
    d: 'سكان السامرة المختلطون: أقوام أسكنهم ملك أشور في مدن السامرة عوضاً عن بني إسرائيل، وأخذوا بعض ديانة اليهود.',
    more: 'بعد رفض اليهود مشاركتهم في بناء الهيكل نشأت عداوة شديدة بين الفريقين، استمرت إلى زمن المسيح.',
    refs: ['2Kgs.17.24', 'John.4.9', 'Luke.10.33'],
    checks: [['2Kgs.17.24', 'واسكنهم في مدن السامرة عوضا عن بني اسرائيل'], ['John.4.9', 'لان اليهود لا يعاملون السامريين']],
    src: { k: 'easton', t: 'Samaritans' },
    basis: ['These strangers (comp. Luke 17:18) amalgamated with the Jews still remaining in the land, and gradually abandoned their old idolatry and adopted partly the Jewish religion.', 'The bitter enmity between the Jews and Samaritans continued in the time of our Lord']
  },
  {
    id: 'leprosy', w: 'البرص', en: 'Leprosy', cat: 'people', icon: 'boils',
    find: ['برص', 'أبرص', 'البرص', 'برصا'],
    d: 'مرض جلدي وصفته الشريعة بالتفصيل في اللاويين 13 و14، وكان صاحبه يسكن وحده خارج المحلة.',
    more: 'الكلمة العبرية معناها ضربة، لأن المرض كان يُعدّ ضربة من الله.',
    refs: ['Lev.13.2', 'Lev.13.46', 'Num.12.10'],
    checks: [['Lev.13.46', 'خارج المحلة يكون مقامه']],
    src: { k: 'easton', t: 'Leprosy' },
    basis: ['(Heb. tsara\'ath, a "smiting," a "stroke," because the disease was regarded as a direct providential infliction).', 'Lepers were required to live outside the camp or city']
  },

  // ---------- مقاييس وعملات ----------
  {
    id: 'cubit', w: 'الذراع', en: 'Cubit', cat: 'measure', icon: 'gate', auto: false,
    find: ['ذراع', 'ذراعا', 'أذرع'],
    d: 'مقياس طول: من المرفق إلى طرف الأصابع على الأرجح. طوله بالضبط غير مؤكد، وأشهر تقدير نحو نصف متر.',
    more: 'كلمة ذراع في فاندايك تعني أيضاً اليد والقوة، مثل ذراع الرب، فلا تخلط بين المعنيين.',
    refs: ['Gen.6.15', 'Exod.25.10'],
    checks: [['Gen.6.15', 'ثلاث مئة ذراع']],
    src: { k: 'easton', t: 'Cubit' },
    basis: ['It is difficult to determine the exact length of this measure', 'The probability is that the longer was the original cubit. The common computation as to the length of the cubit makes it 20.24 inches for the ordinary cubit']
  },
  {
    id: 'shekel', w: 'الشاقل', en: 'Shekel', cat: 'measure', icon: 'grain',
    find: ['شاقل', 'شاقلا', 'شواقل', 'الشاقل'],
    d: 'وحدة الوزن والقيمة الأساسية عند العبرانيين. شاقل القدس عشرون جيرة.',
    more: 'كان كل من يُحصى يعطي نصف شاقل تقدمة للرب. وهناك شواقل من ذهب ومن فضة.',
    refs: ['Exod.30.13', 'Gen.23.15'],
    checks: [['Exod.30.13', 'الشاقل هو عشرون جيرة']],
    src: { k: 'easton', t: 'Shekel' },
    basis: ['Weight, the common standard both of weight and value among the Hebrews.', 'The "shekel of the sanctuary" (Ex. 30:13; Num. 3:47) was equal to twenty gerahs (Ezek. 45:12).']
  },
  {
    id: 'talent', w: 'الوزنة', en: 'Talent', cat: 'measure', icon: 'grain',
    find: ['وزنة', 'وزنات'],
    d: 'أكبر وحدة وزن عند العبرانيين: وزنة الفضة ثلاثة آلاف شاقل.',
    more: 'منها أمثال الرب يسوع: العبد المديون بعشرة آلاف وزنة، والعبيد الذين أُعطوا وزنات.',
    refs: ['Exod.38.25', 'Matt.18.24', 'Matt.25.15'],
    checks: [['Exod.38.25', 'مئة وزنة']],
    src: { k: 'easton', t: 'Talent' },
    basis: ['Of silver contained 3,000 shekels (Ex. 38:25, 26)', 'Parable of the talents (Matt. 18:24; 25:15).']
  },
  {
    id: 'denarius', w: 'الدينار', en: 'Penny (denarius)', cat: 'measure', icon: 'grain',
    find: ['دينار', 'دينارا', 'الدينار'],
    d: 'عملة رومانية من فضة، أكثر العملات ذكراً في العهد الجديد. في مثل الكرم كان الدينار أجرة الفاعل في اليوم.',
    more: 'وهي عملة الجزية التي سأل عنها الرب: لمن هذه الصورة والكتابة؟',
    refs: ['Matt.20.2', 'Matt.22.19'],
    checks: [['Matt.20.2', 'على دينار في اليوم']],
    src: { k: 'easton', t: 'Penny' },
    basis: ['(Gr. denarion), a silver coin', 'is more frequently mentioned than any other coin', 'It was the daily pay of a Roman soldier in the time of Christ.']
  },
  {
    id: 'mite', w: 'الفلس', en: 'Mite', cat: 'measure', icon: 'grain',
    find: ['فلسين'],
    d: 'أصغر عملة من النحاس. ألقت الأرملة الفقيرة فلسين، قيمتهما ربع.',
    more: 'الربع هو ربع الأَس الروماني.',
    refs: ['Mark.12.42', 'Luke.21.2'],
    checks: [['Mark.12.42', 'فلسين قيمتهما ربع']],
    src: { k: 'easton', t: 'Mite' },
    basis: ['the very smallest bronze of copper coin (Luke 12:59; 21:2). Two mites made one quadrans, i.e., the fourth part of a Roman as']
  },
  {
    id: 'ephah', w: 'الإيفة', en: 'Ephah', cat: 'measure', icon: 'grain',
    find: ['إيفة', 'الإيفة'],
    d: 'مكيال للحبوب، يساوي عشرة أعمار. والعُمِر عُشر الإيفة.',
    more: 'الإيفتان المختلفتان في الأمثال والتثنية: واحدة صادقة وأخرى غاشة.',
    refs: ['Exod.16.36', 'Deut.25.14', 'Prov.20.10'],
    checks: [['Exod.16.36', 'واما العمر فهو عشر الايفة']],
    src: { k: 'easton', t: 'Ephah' },
    basis: ['a grain measure containing "three seahs or ten omers,"']
  },

  // ---------- كلمات بلغتها الأصلية ----------
  {
    id: 'amen', w: 'آمين', en: 'Amen', cat: 'words', icon: 'confess',
    find: ['آمين'],
    d: 'كلمة عبرية معناها ثابت وأمين. تُقال في آخر الصلاة لتأكيدها وطلب تحقيقها.',
    more: 'الرب يسوع يبدأ بها كلامه المهم، ويترجمها فاندايك الحق. ويُسمّى المسيح نفسه الآمين، ومواعيد الله كلها فيه النعم وفيه الآمين.',
    refs: ['Ps.41.13', 'Rev.3.14', '2Cor.1.20'],
    checks: [['Rev.3.14', 'الامين'], ['2Cor.1.20', 'وفيه الامين'], ['Matt.5.18', 'الحق اقول لكم']],
    src: { k: 'easton', t: 'Amen' },
    basis: ['This Hebrew word means firm, and hence also faithful (Rev. 3:14).', 'to confirm the words and invoke the fulfilment of them', 'The promises of God are Amen; i.e., they are all true and sure (2 Cor. 1:20).']
  },
  {
    id: 'hallelujah', w: 'هللويا', en: 'Hallelujah', cat: 'words', icon: 'shofar',
    find: ['هللويا'],
    d: 'كلمة عبرية معناها سبّحوا الرب. صارت صيغة تسبيح متكررة في المزامير، وفي الرؤيا 19.',
    refs: ['Ps.106.1', 'Rev.19.1'],
    checks: [['Rev.19.1', 'هللويا']],
    src: { k: 'easton', t: 'Hallelujah' },
    basis: ['Praise ye Jehovah, frequently rendered "Praise ye the LORD,"', 'The Greek form of the word (alleluia) is found in Rev. 19:1, 3, 4, 6.']
  },
  {
    id: 'hosanna', w: 'أوصنا', en: 'Hosanna', cat: 'words', icon: 'booth',
    find: ['أوصنا'],
    d: 'هتاف معناه خلّص الآن، أو خلّص نطلب. هتفت به الجموع عند دخول الرب يسوع أورشليم.',
    more: 'أصله في المزمور 118: 25، وكان هتافاً معتاداً في عيد المظال.',
    refs: ['Matt.21.9', 'Ps.118.25'],
    checks: [['Matt.21.9', 'اوصنا لابن داود'], ['Ps.118.25', 'يارب خلص']],
    src: { k: 'easton', t: 'Hosanna' },
    basis: ['Save now! or Save, we beseech, (Matt. 21:9). This was a customary form of acclamation at the feast of Tabernacles. (Comp. Ps. 118:25.)']
  },
  {
    id: 'abba', w: 'أبا', en: 'Abba', cat: 'words', icon: 'confess',
    find: ['أبا الآب'],
    d: 'كلمة آرامية معناها أب، تعبّر عن محبة دافئة وثقة البنين. ترد ثلاث مرات في العهد الجديد، وبعدها دائماً كلمة الآب.',
    refs: ['Mark.14.36', 'Rom.8.15', 'Gal.4.6'],
    checks: [['Mark.14.36', 'يا ابا الاب'], ['Rom.8.15', 'يا ابا الاب'], ['Gal.4.6', 'يا ابا الاب']],
    src: { k: 'easton', t: 'Abba' },
    basis: ['This Syriac or Chaldee word is found three times in the New Testament (Mark 14:36; Rom. 8:15; Gal. 4:6), and in each case is followed by its Greek equivalent, which is translated "father."', 'It is a term expressing warm affection and filial confidence.']
  },
  {
    id: 'rabbi', w: 'رَبِّي (رابي)', en: 'Rabbi', cat: 'words', icon: 'confess', auto: false,
    find: ['ربي'],
    d: 'لقب تكريم معناه سيدي، كان اليهود يطلقونه على معلمي الناموس. وفي يوحنا 1: 38 يفسّره الإنجيل: يا معلم.',
    more: 'يكتبه فاندايك رَبِّي، فلا تخلط بينه وبين ربّي بمعنى إلهي.',
    refs: ['John.1.38', 'Matt.23.7'],
    checks: [['John.1.38', 'الذي تفسيره يا معلم']],
    src: { k: 'easton', t: 'Rabbi' },
    basis: ['My master, a title of dignity given by the Jews to their doctors of the law and their distinguished teachers.']
  },
  {
    id: 'messiah', w: 'مسيّا', en: 'Messiah', cat: 'words', icon: 'lamp',
    find: ['مسيا'],
    d: 'كلمة عبرية معناها الممسوح، وترجمتها اليونانية المسيح. كان الكهنة والأنبياء والملوك يُمسحون بالزيت لوظائفهم.',
    more: 'المسيح الموعود يجمع في نفسه الوظائف الثلاث. وأول وعد به في التكوين 3: 15.',
    refs: ['John.1.41', 'John.4.25', 'Gen.3.15'],
    checks: [['John.1.41', 'مسيا الذي تفسيره المسيح']],
    src: { k: 'easton', t: 'Messiah' },
    basis: ['It means anointed. Thus priests (Ex. 28:41; 40:15; Num. 3:3), prophets (1 Kings 19:16), and kings (1 Sam. 9:16; 16:3; 2 Sam. 12:7) were anointed with oil', 'he embraces in himself all the three offices', 'The first great promise (Gen. 3:15)']
  },
  {
    id: 'gehenna', w: 'جهنم', en: 'Gehenna', cat: 'words', icon: 'dark',
    find: ['جهنم'],
    d: 'اسم وادي ابن هنوم جنوب أورشليم، حيث قدّم عابدو الأوثان أولادهم لمولك. صار صورة لمكان الهلاك الأبدي.',
    more: 'بهذا المعنى استعمله الرب يسوع في الأناجيل.',
    refs: ['Jer.7.31', 'Matt.5.22', 'Matt.10.28'],
    checks: [['Jer.7.31', 'وادي ابن هنوم']],
    src: { k: 'easton', t: 'Gehenna' },
    basis: ['(originally Ge bene Hinnom; i.e., "the valley of the sons of Hinnom"), a deep, narrow glen to the south of Jerusalem', 'It thus in process of time became the image of the place of everlasting destruction.']
  },
  {
    id: 'sheol', w: 'الهاوية', en: 'Hades (Sheol)', cat: 'words', icon: 'dark',
    find: ['الهاوية', 'هاوية'], books: ['Gen', 'Num', 'Deut', '1Sam', '2Sam', '1Kgs', 'Job', 'Ps', 'Prov', 'Eccl', 'Isa', 'Ezek', 'Hos', 'Amos', 'Jonah', 'Hab', 'Matt', 'Acts'],
    d: 'في العهد القديم مكان الأموات أو حالتهم، بالعبرية شِئول. يذهب إليه كل الأموات، والنزول إليه يعني الموت والدفن.',
    more: 'في العهد الجديد يربطها الرب يسوع في لوقا 16 بعذاب الهالكين. وبطرس في أعمال 2 يستشهد بالمزمور 16 ليثبت أن المسيح لم يُترك فيها بل قام.',
    refs: ['Gen.37.35', 'Ps.16.10', 'Acts.2.27'],
    checks: [['Gen.37.35', 'الهاوية'], ['Acts.2.27', 'لن تترك نفسي في الهاوية']],
    src: { k: 'easton', t: 'Hades' },
    basis: ['a Greek word used to denote the state or place of the dead. All the dead alike go into this place.', 'In the LXX. this word is the usual rendering of the Hebrew sheol', 'In Luke 16:23 it is most distinctly associated with the doom and misery of the lost.']
  },
  {
    id: 'covenant', w: 'العهد', en: 'Covenant', cat: 'doctrine', icon: 'ark',
    find: ['عهد', 'العهد', 'عهدي', 'عهده'],
    d: 'اتفاق ملزم بين طرفين. الكلمة العبرية ترتبط بالقطع، إشارة إلى شق الذبائح والمرور بين نصفيها عند قطع العهد.',
    more: 'كلمة العهد اليونانية في العهد الجديد تُفهم بالمعنى نفسه. وفي التكوين 15 جاز تنور دخان ومصباح نار بين القطع.',
    refs: ['Gen.15.17', 'Jer.34.18'],
    checks: [['Jer.34.18', 'العجل الذي قطعوه الى اثنين وجازوا بين قطعتيه'], ['Gen.15.17', 'تنور دخان ومصباح نار يجوز بين تلك القطع']],
    src: { k: 'easton', t: 'Covenant' },
    basis: ['A contract or agreement between two parties.', 'with reference to the cutting or dividing of animals into two parts, and the contracting parties passing between them, in making a covenant (Gen. 15; Jer. 34:18, 19).']
  },

  // ---------- كلمات عقائدية (التعليم المختصر لوستمنستر) ----------
  {
    id: 'sin', w: 'الخطية', en: 'Sin', cat: 'doctrine', icon: 'sin',
    find: ['خطية', 'الخطية'],
    d: 'الخطية هي أي نقص في المطابقة لناموس الله، أو أي تعدٍّ عليه.',
    refs: ['1John.3.4'],
    checks: [['1John.3.4', 'والخطية هي التعدي']],
    src: { k: 'wsc', q: 14 },
    basis: ['Sin is any want of conformity unto, or transgression of, the law of God.']
  },
  {
    id: 'justification', w: 'التبرير', en: 'Justification', cat: 'doctrine', icon: 'confess', topic: 'justification',
    find: ['تبرير*', 'التبرير'], books: ['Acts', 'Rom', '1Cor', '2Cor', 'Gal', 'Eph', 'Phil', 'Col', 'Titus', 'Heb', 'Jas'],
    d: 'التبرير عمل من نعمة الله المجانية، به يغفر كل خطايانا ويقبلنا أبراراً في نظره، فقط لأجل بر المسيح المحسوب لنا والمقبول بالإيمان وحده.',
    refs: ['Rom.3.24', 'Rom.4.25', 'Rom.5.1'],
    checks: [['Rom.4.25', 'تبريرنا']],
    src: { k: 'wsc', q: 33 },
    basis: ['Justification is an act of God\'s free grace, wherein he pardoneth all our sins, and accepteth us as righteous in his sight, only for the righteousness of Christ imputed to us, and received by faith alone.']
  },
  {
    id: 'adoption', w: 'التبني', en: 'Adoption', cat: 'doctrine', icon: 'confess', topic: 'adoption',
    find: ['التبني'],
    d: 'التبني عمل من نعمة الله المجانية، به نُقبل في عداد أولاد الله، ويصير لنا حق في كل امتيازاتهم.',
    refs: ['Rom.8.15', 'Gal.4.5', '1John.3.1'],
    checks: [['Rom.8.15', 'روح التبني']],
    src: { k: 'wsc', q: 34 },
    basis: ['Adoption is an act of God\'s free grace, whereby we are received into the number, and have a right to all the privileges, of the sons of God.']
  },
  {
    id: 'sanctification', w: 'التقديس', en: 'Sanctification', cat: 'doctrine', icon: 'laver', topic: 'sanctification',
    find: ['تقديس', 'التقديس', 'بتقديس'], books: ['Rom', '1Cor', '2Cor', 'Gal', 'Eph', 'Phil', 'Col', '1Thess', '2Thess', '1Tim', '2Tim', 'Titus', 'Heb', '1Pet', '2Pet'],
    d: 'التقديس عمل من نعمة الله المجانية، به نتجدد في الإنسان كله على صورة الله، ونتمكن أكثر فأكثر أن نموت عن الخطية ونحيا للبر.',
    refs: ['2Thess.2.13', '1Thess.4.3', 'Rom.6.11'],
    checks: [['2Thess.2.13', 'بتقديس الروح']],
    src: { k: 'wsc', q: 35 },
    basis: ['Sanctification is the work of God\'s free grace, whereby we are renewed in the whole man after the image of God, and are enabled more and more to die unto sin, and live unto righteousness.']
  },
  {
    id: 'faith', w: 'الإيمان', en: 'Faith', cat: 'doctrine', icon: 'eye', topic: 'faith',
    find: ['إيمان', 'الإيمان', 'بالإيمان', 'إيمانك*', 'إيمانكم'],
    d: 'الإيمان بيسوع المسيح نعمة مخلّصة، بها نقبله ونستند عليه وحده للخلاص، كما يُقدَّم لنا في الإنجيل.',
    refs: ['John.1.12', 'Eph.2.8', 'Heb.11.1'],
    checks: [['Eph.2.8', 'بالنعمة مخلصون بالايمان']],
    src: { k: 'wsc', q: 86 },
    basis: ['Faith in Jesus Christ is a saving grace, whereby we receive and rest upon him alone for salvation, as he is offered to us in the gospel.']
  },
  {
    id: 'repentance', w: 'التوبة', en: 'Repentance', cat: 'doctrine', icon: 'door', topic: 'repentance',
    find: ['توبة', 'التوبة', 'بالتوبة'],
    d: 'التوبة للحياة نعمة مخلّصة، بها يرى الخاطئ خطيته على حقيقتها، ويدرك رحمة الله في المسيح، فيحزن عليها ويكرهها، ويرجع عنها إلى الله، عازماً ومجتهداً في طاعة جديدة.',
    refs: ['Acts.11.18', '2Cor.7.10', 'Acts.2.37'],
    checks: [['Acts.11.18', 'التوبة للحياة']],
    src: { k: 'wsc', q: 87 },
    basis: ['Repentance unto life is a saving grace, whereby a sinner, out of a true sense of his sin, and apprehension of the mercy of God in Christ, doth, with grief and hatred of his sin, turn from it unto God, with full purpose of, and endeavour after, new obedience.']
  },
  {
    id: 'prayer', w: 'الصلاة', en: 'Prayer', cat: 'doctrine', icon: 'incense', topic: 'prayer',
    find: ['صلاة', 'الصلاة', 'صلاتي', 'صلاتك'],
    d: 'الصلاة هي أن نرفع رغباتنا إلى الله، في أمور توافق مشيئته، باسم المسيح، مع الاعتراف بخطايانا والشكر على مراحمه.',
    refs: ['Ps.62.8', '1John.5.14', 'John.16.23', 'Phil.4.6'],
    checks: [['1John.5.14', 'حسب مشيئته']],
    src: { k: 'wsc', q: 98 },
    basis: ['Prayer is an offering up of our desires unto God, for things agreeable to his will, in the name of Christ, with confession of our sins, and thankful acknowledgement of his mercies.']
  }
];
