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
//  - not: عبارات تعني شيئاً آخر (بيد رفيعة = بتحدٍّ)، فلا تُعلَّم الآية التي فيها.
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
  {
    id: 'teraphim', w: 'الترافيم', en: 'Teraphim', cat: 'worship', icon: 'eye',
    find: ['الترافيم', 'ترافيم'],
    d: 'أصنام على هيئة إنسان، كبيرة أو صغيرة، كانت تُحفظ في البيوت.',
    more: 'وضعت ميكال الترافيم في الفراش وغطته بثوب لتخدع رسل شاول فينجو داود. ويضعها صموئيل مع العرافة في الإدانة: التمرد كخطية العرافة، والعناد كالوثن والترافيم.',
    refs: ['1Sam.19.13', '1Sam.15.23', 'Judg.18.17'],
    checks: [['1Sam.19.13', 'فاخذت ميكال الترافيم ووضعته في الفراش'], ['1Sam.15.23', 'والعناد كالوثن والترافيم']],
    src: { k: 'easton', t: 'Teraphim' },
    basis: ['idols in human shape, large or small', 'Michal his wife prepared one of the household teraphim']
  },
  {
    id: 'high-place', w: 'المرتفعات', en: 'High places', cat: 'worship', icon: 'altar',
    find: ['المرتفعات'], books: ['1Kgs', '2Kgs', '2Chr'],
    d: 'أماكن عالية، طبيعية أو مصنوعة، كانت تُقدَّم فيها الذبائح والقرابين.',
    more: 'أُمر بنو إسرائيل أن يخرّبوا أماكن عبادة الكنعانيين على الجبال والتلال، وأن يقدّموا ذبائحهم في المكان الذي يختاره الرب. لكن الوصية لم تُطَع كما يجب، فيتكرر في سفري الملوك: وأما المرتفعات فلم تنزع.',
    refs: ['Deut.12.2', 'Deut.12.11', '1Kgs.15.14', '2Kgs.18.4'],
    checks: [['Deut.12.2', 'على الجبال الشامخة وعلى التلال'], ['Deut.12.11', 'فالمكان الذي يختاره الرب'], ['1Kgs.15.14', 'واما المرتفعات فلم تنزع'], ['2Kgs.18.4', 'هو ازال المرتفعات']],
    src: { k: 'easton', t: 'High place' },
    basis: ['An eminence, natural or artificial, where worship by sacrifice or offerings was made', 'they were strictly enjoined to overthrow the high places of the Canaanites', 'The injunction against high places was, however, very imperfectly obeyed']
  },
  {
    id: 'phylacteries', w: 'العصائب', en: 'Phylacteries', cat: 'worship', icon: 'linen',
    find: ['عصائبهم'],
    d: 'رقائق كُتبت عليها أربعة نصوص من الشريعة، توضع في علبة من جلد تُربط على الجبهة بين العينين، وأخرى على الذراع.',
    more: 'تُذكر في العهد الجديد مرة واحدة: يعرّضون عصائبهم، أي يكبّرون العلبة لتلفت الأنظار. والنصوص المكتوبة فيها من الخروج 13 والتثنية 6 و11، ومنها: ولتكن عصائب بين عينيك.',
    refs: ['Matt.23.5', 'Deut.6.8', 'Exod.13.9'],
    checks: [['Matt.23.5', 'فيعرضون عصائبهم'], ['Deut.6.8', 'ولتكن عصائب بين عينيك']],
    src: { k: 'easton', t: 'Phylacteries' },
    basis: ['are mentioned only in Matt. 23:5', 'strips of parchment on which were inscribed these four texts', 'fastened by certain straps to the forehead just between the eyes', 'The "making broad the phylacteries" refers to the enlarging of the case so as to make it conspicuous.', 'This was worn on the left arm near the elbow']
  },
  {
    id: 'sackcloth', w: 'المِسْح', en: 'Sackcloth', cat: 'worship', icon: 'linen', auto: false,
    find: ['مسح', 'مسوح', 'المسوح'],
    d: 'قماش خشن غليظ من شعر الماعز الأسود، تُصنع منه الأكياس، ويلبسه الحزين والتائب.',
    more: 'لبسه يعقوب حين ناح على يوسف، وتغطى به ملك نينوى حين تاب، وغُطّي به الناس والبهائم هناك. وقال الرب إن صور وصيداء لو رأتا قواته لتابتا في المسوح والرماد.',
    refs: ['Gen.37.34', 'Jonah.3.6', 'Matt.11.21'],
    checks: [['Gen.37.34', 'ووضع مسحا على حقويه'], ['Jonah.3.6', 'وتغطى بمسح'], ['Jonah.3.8', 'وليتغط بمسوح الناس والبهائم'], ['Matt.11.21', 'لتابتا قديما في المسوح والرماد']],
    src: { k: 'easton', t: 'Sackcloth' },
    basis: ["Cloth made of black goats' hair, coarse, rough, and thick, used for sacks, and also worn by mourners", 'and as a sign of repentance (Matt. 11:21)', 'It was put upon animals by the people of Nineveh']
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
  {
    id: 'peace-offering', w: 'ذبيحة السلامة', en: 'Peace offering', cat: 'sacrifice', icon: 'burnt',
    find: ['ذبيحة السلامة', 'ذبائح السلامة', 'ذبيحة سلامة', 'ذبائح سلامتهم', 'ذبائح سلامتكم'],
    d: 'ذبيحة شريعتها في اللاويين 3 و7، وهي ثلاثة أنواع: للشكر على بركة نالها صاحبها، ووفاءً لنذر، وتطوّعاً من القلب.',
    more: 'يسمّي فاندايك ذبيحة التطوع نافلة: وإن كانت ذبيحة قربانه نذراً أو نافلة.',
    refs: ['Lev.3.1', 'Lev.7.11', 'Lev.7.12', 'Lev.7.16'],
    checks: [['Lev.7.11', 'وهذه شريعة ذبيحة السلامة'], ['Lev.7.12', 'ان قربها لاجل الشكر'], ['Lev.7.16', 'نذرا او نافلة']],
    src: { k: 'easton', t: 'Peace offerings' },
    basis: ['detailed regulations regarding given in Lev. 3; 7:11-21, 29-34. They were of three kinds', 'eucharistic or thanksgiving offerings, expressive of gratitude for blessings received', 'in fulfilment of a vow', 'free-will offerings, something spontaneously devoted to God']
  },
  {
    id: 'heave-offering', w: 'الرفيعة', en: 'Heave offering', cat: 'sacrifice', icon: 'grain',
    find: ['رفيعة', 'الرفيعة'], books: ['Exod', 'Lev', 'Num'], not: ['بيد رفيعة'],
    d: 'الكلمة العبرية تعني ببساطة تقدمة أو هدية للرب. ومنها الساق اليمنى من ذبائح السلامة التي كانت للكاهن، وأول العجين من الحصاد.',
    more: 'يقول بعض معلمي اليهود إن الرفيعة كانت تُرفع إلى فوق وتُنزل، أما الترديد فكان يُحرَّك أفقياً. لكن معنى الكلمة في الأصل هو التقدمة.',
    refs: ['Lev.7.32', 'Lev.7.34', 'Num.15.20'],
    checks: [['Lev.7.32', 'والساق اليمنى تعطونها رفيعة للكاهن'], ['Num.15.20', 'اول عجينكم ترفعون قرصا رفيعة']],
    src: { k: 'easton', t: 'Heave offering' },
    basis: ['means simply an offering, a present', 'Some of the rabbis attach to the word the meaning of elevation', 'The right shoulder, which fell to the priests in presenting thank offerings, was called the heave shoulder', 'The first fruits offered in harvest-time (Num. 15:20, 21) were heave offerings.']
  },
  {
    id: 'meat-offering', w: 'التقدمة', en: 'Meat offering (minhah)', cat: 'sacrifice', icon: 'grain', auto: false,
    find: ['تقدمة', 'التقدمة'],
    d: 'قربان بلا دم، من دقيق أو أقراص مخبوزة، عليه زيت ولبان. شريعته في اللاويين 2، وكان يُقدَّم كل يوم مع المحرقة.',
    more: 'الكلمة العبرية منحة، ومعناها في الأصل هدية من أي نوع. كانت اعترافاً بسيادة الله وبأنه معطي كل البركات الأرضية، وكان يرافقها عادة سكيب.',
    refs: ['Lev.2.1', 'Exod.29.40', 'Exod.29.41'],
    checks: [['Lev.2.1', 'يكون قربانه من دقيق ويسكب عليها زيتا ويجعل عليها لبانا']],
    src: { k: 'easton', t: 'Meat-offering' },
    basis: ['originally a gift of any kind', 'came latterly to denote an "unbloody" sacrifice', 'A "drink-offering" generally accompanied it.', 'It was a recognition of the sovereignty of God and of his bounty in giving all earthly blessings', 'It was presented every day with the burnt-offering (Ex. 29:40, 41), and consisted of flour or of cakes prepared in a special way with oil and frankincense.']
  },
  {
    id: 'drink-offering', w: 'السكيب', en: 'Drink offering', cat: 'sacrifice', icon: 'laver',
    find: ['سكيب', 'السكيب', 'سكيبه', 'سكائب'],
    d: 'خمر تُسكب للرب مع التقدمة، كل يوم وفي السبوت والأعياد.',
    more: 'ربع الهين من الخمر للخروف، وثلث الهين للكبش، ونصف الهين للثور.',
    refs: ['Exod.29.40', 'Num.15.5', 'Num.15.7', 'Num.15.10'],
    checks: [['Exod.29.40', 'وسكيب ربع الهين من الخمر للخروف الواحد'], ['Num.15.5', 'وخمرا للسكيب ربع الهين'], ['Num.15.7', 'ثلث الهين'], ['Num.15.10', 'نصف الهين']],
    src: { k: 'easton', t: 'Drink-offering' },
    basis: ['Consisted of wine (Num. 15:5; Hos. 9:4) poured around the altar', 'Joined with meat-offerings', 'presented daily (Ex. 29:40), on the Sabbath (Num. 28:9), and on feast-days', 'One-fourth of an hin of wine was required for one lamb, one-third for a ram, and one-half for a bullock']
  },
  {
    id: 'firstfruits', w: 'الباكورة', en: 'First-fruits', cat: 'sacrifice', icon: 'grain',
    find: ['باكورة', 'الباكورة'],
    d: 'أول ثمر الأرض، يُقدَّم لله كما يُقدَّم له بكر الإنسان والحيوان.',
    more: 'في غد السبت يردّد الكاهن حزمة أول الحصيد أمام الرب، وفي الخمسين رغيفان مخبوزان خميراً باكورة للرب. ويقول بولس إن المسيح قام من الأموات وصار باكورة الراقدين.',
    refs: ['Lev.23.10', 'Lev.23.17', '1Cor.15.20'],
    checks: [['Lev.23.11', 'في غد السبت يرددها الكاهن'], ['Lev.23.17', 'ويخبزان خميرا باكورة للرب'], ['1Cor.15.20', 'وصار باكورة الراقدين']],
    src: { k: 'easton', t: 'First-fruits' },
    basis: ['The first-fruits of the ground were offered unto God just as the first-born of man and animals.', 'a sheaf of new corn should be waved by the priest before the altar', 'two loaves of leavened bread, made from the new flour, were to be waved in like manner']
  },
  {
    id: 'trumpets', w: 'تذكار هتاف البوق', en: 'Feast of Trumpets', cat: 'sacrifice', icon: 'shofar',
    find: ['هتاف البوق', 'هتاف بوق'], books: ['Lev', 'Num'],
    d: 'عيد في أول الشهر السابع، يوم عطلة ومحفل مقدس.',
    more: 'كانت الأبواق تُضرب في أول كل شهر، لكنها في هذا اليوم كانت تُضرب بوقار خاص. ولا يُعرف الغرض الخاص من هذا العيد.',
    refs: ['Lev.23.24', 'Num.29.1', 'Num.10.10'],
    checks: [['Lev.23.24', 'في الشهر السابع في اول الشهر يكون لكم عطلة تذكار هتاف البوق محفل مقدس'], ['Num.29.1', 'يوم هتاف بوق يكون لكم']],
    src: { k: 'easton', t: 'Trumpets, Feast of' },
    basis: ['the trumpets usually blown at the commencement of each month were on that occasion blown with unusual solemnity', 'It was one of the seven days of holy convocation. The special design of this feast, which is described in these verses, is not known.']
  },
  {
    id: 'purim', w: 'الفوريم', en: 'Purim', cat: 'sacrifice', icon: 'lots',
    find: ['الفوريم', 'فوريم'],
    d: 'عيد أقامه اليهود في أيام أستير، في اليومين الرابع عشر والخامس عشر من شهر أذار، تذكاراً لنجاتهم من مؤامرة هامان.',
    more: 'الاسم من كلمة فور، أي قرعة، لأن هامان ألقى فوراً ليختار يوماً لإبادة اليهود.',
    refs: ['Esth.9.21', 'Esth.9.24', 'Esth.9.26'],
    checks: [['Esth.9.21', 'في اليوم الرابع عشر من شهر اذار واليوم الخامس عشر منه'], ['Esth.9.24', 'والقى فورا اي قرعة'], ['Esth.9.26', 'على اسم الفور']],
    src: { k: 'easton', t: 'Pur, Purim' },
    basis: ['A lot, lots, a festival instituted by the Jews (Esther 9:24-32)', 'on the 14th and 15th of the month Adar']
  },
  {
    id: 'dedication', w: 'عيد التجديد', en: 'Feast of Dedication', cat: 'sacrifice', icon: 'lamp',
    find: ['عيد التجديد'],
    d: 'عيد ثمانية أيام يذكّر بتطهير الهيكل وتجديد المذبح بعد أن نجّسه أنطيوخس أبيفانس. يذكره يوحنا مرة واحدة، وكان يسوع حينئذ في أورشليم.',
    more: 'أُقيم سنة 164 ق.م. وكان يبدأ في الخامس والعشرين من شهر كسلو، في الشتاء.',
    refs: ['John.10.22', 'John.10.23'],
    checks: [['John.10.22', 'وكان عيد التجديد في اورشليم وكان شتاء']],
    src: { k: 'easton', t: 'Dedication, Feast of the' },
    basis: ['It was instituted B.C. 164 to commemorate the purging of the temple after its pollution by Antiochus Epiphanes', 'the rebuilding of the altar', 'It lasted for eight days, beginning on the 25th of the month Chisleu (December)']
  },
  {
    id: 'leaven', w: 'الخمير', en: 'Leaven', cat: 'sacrifice', icon: 'matzah',
    find: ['خمير', 'الخمير', 'خميرة', 'الخميرة', 'خميرا'],
    d: 'بقية عجين من خبزة سابقة تخمّرت، يُخمَّر بها العجين الجديد.',
    more: 'كان ممنوعاً في كل قربان يوقد للرب. ويستعمله الكتاب صورة لقوته الخفية في الانتشار: لنمو ملكوت السماوات في مثل الخميرة، وللفساد في خمير الفريسيين والخميرة العتيقة.',
    refs: ['Lev.2.11', 'Matt.13.33', 'Matt.16.6', '1Cor.5.7'],
    checks: [['Lev.2.11', 'لا توقدوا منهما وقودا للرب'], ['Matt.13.33', 'يشبه ملكوت السماوات خميرة'], ['Matt.16.6', 'خمير الفريسيين'], ['1Cor.5.7', 'الخميرة العتيقة']],
    src: { k: 'easton', t: 'Leaven' },
    basis: ['the remnant of dough from the preceding baking which had fermented and become acid', 'The use of leaven was strictly forbidden in all offerings made to the Lord by fire', 'Its secretly penetrating and diffusive power is referred to in 1 Cor. 5:6.', 'it is used to illustrate the growth of the kingdom of heaven', 'It is a figure also of corruptness and of perverseness of heart and life']
  },
  {
    id: 'hyssop', w: 'الزوفا', en: 'Hyssop', cat: 'sacrifice', icon: 'grain',
    find: ['زوفا', 'الزوفا'],
    d: 'نبات يُذكر أولاً ليلة الفصح، حين أُمر بنو إسرائيل أن يغمسوا باقة منه في الدم ويمسّوا به العتبة العليا والقائمتين. ثم استُعمل في طقوس التطهير.',
    more: 'يصفه الكتاب بأنه ينبت في الحائط. ولا يُعرف على وجه اليقين أي نبات هو. وعلى زوفا قُدّم الخل ليسوع على الصليب.',
    refs: ['Exod.12.22', 'Num.19.18', 'Ps.51.7', 'John.19.29'],
    checks: [['Exod.12.22', 'وخذوا باقة زوفا واغمسوها في الدم'], ['1Kgs.4.33', 'الزوفا النابت في الحائط'], ['John.19.29', 'ووضعوها على زوفا']],
    src: { k: 'easton', t: 'Hyssop' },
    basis: ['first mentioned in Ex. 12:22 in connection with the institution of the Passover', 'It is spoken of as a plant "springing out of the wall" (1 Kings 4:33). Many conjectures have been formed as to what this plant really was.']
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
  {
    id: 'nethinim', w: 'النثينيم', en: 'Nethinim', cat: 'people', icon: 'gate',
    find: ['النثينيم'],
    d: 'خدّام الهيكل بالوراثة في أسفار ما بعد السبي، جعلهم داود والرؤساء لخدمة اللاويين.',
    more: 'الاسم معناه المُعطَون، أي المعطَون للاويين ليخدموهم. ولا يذكرهم العهد الجديد، والأرجح أنهم ذابوا في عموم الشعب اليهودي.',
    refs: ['Ezra.8.20', 'Ezra.2.58', 'Neh.7.46'],
    checks: [['Ezra.8.20', 'الذين جعلهم داود مع الرؤساء لخدمة اللاويين']],
    src: { k: 'easton', t: 'Nethinim' },
    basis: ['The name given to the hereditary temple servants in all the post-Exilian books of Scripture. The word means given', 'No reference to them appears in the New Testament, because it is probable that they became merged in the general body of the Jewish people.']
  },
  {
    id: 'herodians', w: 'الهيرودسيون', en: 'Herodians', cat: 'people', icon: 'eye',
    find: ['الهيرودسيين', 'الهيرودسيون'],
    d: 'حزب سياسي يهودي أيّد حكام بيت هيرودس في سياستهم، ووافق الصدوقيين في وجوب الخضوع لروما.',
    more: 'تشاوروا مع الفريسيين على يسوع ليهلكوه، وجاءوا معهم يسألونه: أيجوز أن تعطى جزية لقيصر؟',
    refs: ['Mark.3.6', 'Matt.22.16', 'Mark.12.13'],
    checks: [['Mark.3.6', 'فخرج الفريسيون للوقت مع الهيرودسيين وتشاوروا عليه لكي يهلكوه'], ['Matt.22.17', 'ايجوز ان تعطى جزية لقيصر']],
    src: { k: 'easton', t: 'Herodians' },
    basis: ['A Jewish political party who sympathized with', 'the Herodian rulers in their general policy of government', 'They were at one with the Sadducees in holding the duty of submission to Rome']
  },
  {
    id: 'proselyte', w: 'الدخيل', en: 'Proselyte', cat: 'people', icon: 'door',
    find: ['دخيلا', 'دخلاء'], books: ['Matt', 'Acts'],
    d: 'في العهد الجديد: من دخل ديانة اليهود وهو ليس من بني إسرائيل.',
    more: 'نظّمت شريعة موسى قبول الغرباء في جماعة إسرائيل. ومن الدخلاء نيقولاوس، أحد السبعة الذين اختيروا في أورشليم. ويُسمّون في العهد الجديد غالباً الأتقياء أو خائفي الله.',
    refs: ['Matt.23.15', 'Acts.2.10', 'Acts.6.5', 'Acts.13.43'],
    checks: [['Matt.23.15', 'لتكسبوا دخيلا واحدا'], ['Acts.6.5', 'ونيقولاوس دخيلا انطاكيا']],
    src: { k: 'easton', t: 'Proselyte' },
    basis: ['in the New Testament for a convert to Judaism', 'The law of Moses made specific regulations regarding the admission into the Jewish church of such as were not born Israelites', 'The name by which they are commonly designated is that of "devout men," or men "fearing God" or "worshipping God."']
  },
  {
    id: 'centurion', w: 'قائد المئة', en: 'Centurion', cat: 'people', icon: 'gate',
    find: ['قائد المئة', 'قائد مئة'],
    d: 'ضابط روماني يقود مئة جندي.',
    more: 'كرنيليوس الذي بشّره بطرس كان قائد مئة. وقائد المئة عند الصليب قال: حقاً كان هذا ابن الله.',
    refs: ['Acts.10.1', 'Matt.8.5', 'Matt.27.54'],
    checks: [['Acts.10.1', 'كرنيليوس قائد مئة'], ['Matt.27.54', 'حقا كان هذا ابن الله']],
    src: { k: 'easton', t: 'Centurion' },
    basis: ['A Roman officer in command of a hundred men', 'was a centurion (Acts 10:1, 22)', 'A centurion watched the crucifixion of our Lord']
  },
  {
    id: 'tetrarch', w: 'رئيس الربع', en: 'Tetrarch', cat: 'people', icon: 'gate',
    find: ['رئيس الربع', 'رئيس ربع'],
    d: 'حرفياً حاكم ربع مقاطعة، لكن اللقب صار يعني حاكم مقاطعة عموماً.',
    more: 'هيرودس رئيس الربع كان حاكماً على الجليل، وهو الذي قطع رأس يوحنا. ويسمّيه متى الملك أيضاً.',
    refs: ['Luke.3.1', 'Matt.14.1', 'Matt.14.9'],
    checks: [['Luke.3.1', 'وهيرودس رئيس ربع على الجليل'], ['Matt.14.9', 'فاغتم الملك'], ['Matt.14.10', 'وقطع راس يوحنا']],
    src: { k: 'easton', t: 'Tetrarch' },
    basis: ['Strictly the ruler over the fourth part of a province; but the word denotes a ruler of a province generally', 'Herod the tetrarch had the title of king (Matt. 14:9).']
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
  {
    id: 'homer', w: 'الحومر', en: 'Homer', cat: 'measure', icon: 'grain',
    find: ['حومر', 'الحومر', 'للحومر'],
    d: 'أكبر مكاييل الجافّ، يساوي عشر إيفات.',
    refs: ['Ezek.45.11', 'Lev.27.16'],
    checks: [['Ezek.45.11', 'والايفة عشر الحومر']],
    src: { k: 'easton', t: 'Homer' },
    basis: ['the largest of dry measures', '= 10 ephahs']
  },
  {
    id: 'omer', w: 'العُمِر', en: 'Omer', cat: 'measure', icon: 'grain',
    find: ['العمر', 'عمرا'], books: ['Exod'],
    d: 'مكيال يساوي عُشر الإيفة. به جمع بنو إسرائيل المنّ: عمراً لكل شخص.',
    refs: ['Exod.16.16', 'Exod.16.36'],
    checks: [['Exod.16.36', 'واما العمر فهو عشر الايفة'], ['Exod.16.16', 'عمرا للراس']],
    src: { k: 'easton', t: 'Omer' },
    basis: ['one-tenth of an ephah']
  },
  {
    id: 'bath', w: 'البث', en: 'Bath', cat: 'measure', icon: 'laver', auto: false,
    find: ['البث', 'بثا'],
    d: 'مكيال عبري للسوائل يساوي عُشر الحومر.',
    more: 'يقول إشعياء: عشرة فدادين كرم تصنع بثاً واحداً، أي محصولاً قليلاً جداً.',
    refs: ['Ezek.45.11', 'Isa.5.10'],
    checks: [['Ezek.45.11', 'لكي يسع البث عشر الحومر'], ['Isa.5.10', 'عشرة فدادين كرم تصنع بثا واحدا']],
    src: { k: 'easton', t: 'Bath' },
    basis: ['A Hebrew liquid measure, the tenth part of an homer', 'denotes great unproductiveness']
  },
  {
    id: 'gerah', w: 'الجيرة', en: 'Gerah', cat: 'measure', icon: 'grain',
    find: ['جيرة'],
    d: 'أصغر وزن وأصغر قطعة نقد عند العبرانيين، تساوي جزءاً من عشرين من الشاقل.',
    refs: ['Exod.30.13', 'Num.3.47'],
    checks: [['Exod.30.13', 'الشاقل هو عشرون جيرة']],
    src: { k: 'easton', t: 'Gerah' },
    basis: ['the smallest weight, and also the smallest piece of money, among the Hebrews, equal to the twentieth part of a shekel']
  },
  {
    id: 'furlong', w: 'الغلوة', en: 'Furlong (stadium)', cat: 'measure', icon: 'gate',
    find: ['غلوة'],
    d: 'مقياس يوناني للمسافة يساوي 606 أقدام و9 بوصات، أي نحو 185 متراً.',
    more: 'كانت بيت عنيا قريبة من أورشليم نحو خمس عشرة غلوة، وعمواس على ستين غلوة.',
    refs: ['John.11.18', 'Luke.24.13'],
    checks: [['John.11.18', 'نحو خمس عشرة غلوة'], ['Luke.24.13', 'ستين غلوة']],
    src: { k: 'easton', t: 'Furlong' },
    basis: ['A stadium, a Greek measure of distance equal to 606 feet and 9 inches']
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
  {
    id: 'selah', w: 'سلاه', en: 'Selah', cat: 'words', icon: 'shofar',
    find: ['سلاه'],
    d: 'كلمة تتكرر في المزامير وفي حبقوق 3، نحو أربع وسبعين مرة. معناها غير مؤكد: قيل سكوت أو وقفة، وقيل غير ذلك.',
    refs: ['Ps.3.2', 'Hab.3.3'],
    checks: [['Ps.3.2', 'سلاه'], ['Hab.3.3', 'سلاه']],
    src: { k: 'easton', t: 'Selah' },
    basis: ['about seventy-four times in all in Scripture. Its meaning is doubtful. Some interpret it as meaning "silence" or "pause;"']
  },
  {
    id: 'maranatha', w: 'ماران أثا', en: 'Maranatha', cat: 'words', icon: 'confess',
    find: ['ماران أثا'],
    d: 'كلمتان أراميتان معناهما: ربنا آتٍ، أو ربنا يأتي.',
    refs: ['1Cor.16.22'],
    checks: [['1Cor.16.22', 'ماران اثا']],
    src: { k: 'easton', t: 'Maranatha' },
    basis: ['consists of two Aramean words', 'meaning, "our Lord comes," or is "coming."']
  },
  {
    id: 'raca', w: 'رَقا', en: 'Raca', cat: 'words', icon: 'confess',
    find: ['رقا'], books: ['Matt'],
    d: 'كلمة احتقار عند اليهود، معناها: فارغ، تافه، لا قيمة له. وردت مرة واحدة، في كلام المسيح عن الغضب.',
    refs: ['Matt.5.22'],
    checks: [['Matt.5.22', 'ومن قال لاخيه رقا']],
    src: { k: 'easton', t: 'Raca' },
    basis: ['Vain, empty, worthless, only found in Matt. 5:22. The Jews used it as a word of contempt.']
  },
  {
    id: 'ephphatha', w: 'إفثا', en: 'Ephphatha', cat: 'words', icon: 'confess',
    find: ['إفثا'],
    d: 'كلمة أرامية معناها: انفتح. قالها المسيح حين شفى الأصم الأعقد.',
    more: 'من سمات إنجيل مرقس أنه يحفظ الكلمات الأرامية نفسها التي نطق بها الرب.',
    refs: ['Mark.7.34'],
    checks: [['Mark.7.34', 'افثا اي انفتح'], ['Mark.7.32', 'باصم اعقد']],
    src: { k: 'easton', t: 'Ephphatha' },
    basis: ['meaning "Be opened," uttered by Christ when healing the man who was deaf and dumb', "It is one of the characteristics of Mark that he uses the very Aramaic words which fell from our Lord's lips."]
  },
  {
    id: 'talitha', w: 'طليثا قومي', en: 'Talitha cumi', cat: 'words', icon: 'confess',
    find: ['طليثا'],
    d: 'عبارة أرامية قالها المسيح لابنة يايرس حين أقامها، معناها: يا صبية قومي.',
    refs: ['Mark.5.41', 'Mark.5.22'],
    checks: [['Mark.5.41', 'الذي تفسيره يا صبية لك اقول قومي'], ['Mark.5.22', 'اسمه يايرس']],
    src: { k: 'easton', t: 'Talitha cumi' },
    basis: ['a Syriac or Aramaic expression, meaning, "Little maid, arise."']
  },
  {
    id: 'mammon', w: 'المال (مامون)', en: 'Mammon', cat: 'words', icon: 'confess', auto: false,
    find: ['المال', 'بمال الظلم'],
    d: 'كلمة أرامية معناها الثروة أو الغنى، وتأتي أيضاً مشخّصة كإله للغنى. يترجمها فاندايك المال: لا تقدرون أن تخدموا الله والمال.',
    refs: ['Matt.6.24', 'Luke.16.9', 'Luke.16.13'],
    checks: [['Matt.6.24', 'لا تقدرون ان تخدموا الله والمال'], ['Luke.16.9', 'بمال الظلم']],
    src: { k: 'easton', t: 'Mammon' },
    basis: ['meaning "wealth" or "riches"', 'by personification, the god of riches']
  },
  {
    id: 'anathema', w: 'أناثيما', en: 'Anathema', cat: 'words', icon: 'confess',
    find: ['أناثيما'],
    d: 'كلمة يونانية تعني في العهد الجديد دائماً: ملعون، محروم.',
    more: 'يقابلها في العهد القديم المُحرَّم: ما كُرّس للرب نهائياً فلا يُباع ولا يُفك. ويقول بولس: إن بشّركم أحد بغير ما بشّرناكم فليكن أناثيما.',
    refs: ['Gal.1.8', '1Cor.16.22', 'Lev.27.28'],
    checks: [['Gal.1.8', 'فليكن اناثيما'], ['Lev.27.28', 'فلا يباع ولا يفك']],
    src: { k: 'easton', t: 'Anathema' },
    basis: ['Any object so devoted to the Lord could not be redeemed', 'In the New Testament this word always implies execration.', 'If any one preached another gospel, the apostle says, "let him be accursed"']
  },
  {
    id: 'golgotha', w: 'جلجثة', en: 'Golgotha', cat: 'words', icon: 'dark',
    find: ['جلجثة'],
    d: 'اسم المكان الذي صُلب فيه يسوع، ومعناه موضع الجمجمة. كان خارج الباب، قريباً من المدينة، وفيه بستان.',
    more: 'وهو نفسه الموضع الذي يسمّيه لوقا جمجمة.',
    refs: ['Matt.27.33', 'John.19.17', 'Heb.13.12'],
    checks: [['Matt.27.33', 'وهو المسمى موضع الجمجمة'], ['John.19.20', 'كان قريبا من المدينة'], ['John.19.41', 'وكان في الموضع الذي صلب فيه بستان'], ['Heb.13.12', 'تالم خارج الباب'], ['Luke.23.33', 'الموضع الذي يدعى جمجمة']],
    src: { k: 'easton', t: 'Golgotha' },
    basis: ['It is interpreted by the evangelists as meaning "the place of a skull"', 'It is identical with the word Calvary', 'some well-known spot outside the gate', 'near the city (Luke 23:26), containing a "garden" (John 19:41)']
  },
  {
    id: 'immanuel', w: 'عمانوئيل', en: 'Immanuel', cat: 'words', icon: 'lamp',
    find: ['عمانوئيل'],
    d: 'اسم معناه: الله معنا. ورد في نبوة إشعياء، ويقول متى إنها تمّت في ميلاد يسوع من العذراء.',
    refs: ['Isa.7.14', 'Matt.1.22', 'Matt.1.23'],
    checks: [['Isa.7.14', 'ها العذراء تحبل وتلد ابنا'], ['Matt.1.22', 'لكي يتم ما قيل من الرب بالنبي'], ['Matt.1.23', 'الذي تفسيره الله معنا']],
    src: { k: 'easton', t: 'Immanuel' },
    basis: ['God with us. In the Old Testament it occurs only in Isa. 7:14 and 8:8.', 'an interpretation borne out by the words of the evangelist Matthew (1:23)']
  },
  // ---------- doctrine (WSC) ----------
  {
    id: 'baptism', w: 'المعمودية', en: 'Baptism', cat: 'doctrine', icon: 'laver',
    find: ['المعمودية', 'معمودية', 'بالمعمودية'], books: ['Rom', '1Cor', 'Gal', 'Eph', 'Col', '1Pet'],
    d: 'المعمودية سرّ مقدس فيه الغسل بالماء باسم الآب والابن والروح القدس يرمز إلى اتحادنا بالمسيح (تطعيمنا فيه) ويختمه، وإلى اشتراكنا في بركات عهد النعمة، وتعهّدنا أن نكون للرب.',
    refs: ['Matt.28.19', 'Rom.6.4', 'Gal.3.27'],
    checks: [['Matt.28.19', 'باسم الاب والابن والروح القدس']],
    src: { k: 'wsc', q: 94 },
    basis: ["Baptism is a sacrament, wherein the washing with water in the name of the Father, and of the Son, and of the Holy Ghost, doth signify and seal our ingrafting into Christ, and partaking of the benefits of the covenant of grace, and our engagement to be the Lord's."]
  },
  {
    id: 'lords-supper', w: 'عشاء الرب', en: "Lord's Supper", cat: 'doctrine', icon: 'loaves',
    find: ['عشاء الرب'],
    d: 'عشاء الرب سرّ مقدس، فيه بإعطاء الخبز والخمر وتناولهما حسب ترتيب المسيح يُخبَر بموته. والذين يتناولون باستحقاق يشتركون في جسده ودمه مع كل بركاته، لا بطريقة جسدية مادية بل بالإيمان، لغذائهم الروحي ونموّهم في النعمة.',
    refs: ['1Cor.11.23', '1Cor.11.26', '1Cor.10.16'],
    checks: [['1Cor.11.20', 'عشاء الرب'], ['1Cor.11.26', 'تخبرون بموت الرب الى ان يجيء']],
    src: { k: 'wsc', q: 96 },
    basis: ["The Lord's Supper is a sacrament, wherein, by giving and receiving bread and wine, according to Christ's appointment, his death is showed forth; and the worthy receivers are, not after a corporal and carnal manner, but by faith, made partakers of his body and blood, with all his benefits, to their spiritual nourishment, and growth in grace."]
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
