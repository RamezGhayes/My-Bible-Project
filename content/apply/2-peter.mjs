// تطبيقات عملية: بطرس الثانية. المبادئ من كالفن ومن تكملة تفسير ماثيو هنري (النص الإنجليزي حرفياً في basis).
// المثال والسؤال والخطوة من إعداد الموقع.
import { H, C, also } from './_v.mjs';

export default [
  {
    book: '2Pet', ch: 1,
    lead: 'قدموا في إيمانكم فضيلة ومعرفة وتعففاً وصبراً وتقوى ومودة ومحبة. والنبوة ليست من تفسير خاص.',
    items: [
      {
        id: 'add', t: 'باذلون كل اجتهاد', ref: '2Pet.1.5', cut: 'قدموا في إيمانكم فضيلة وفي الفضيلة معرفة', arenas: ['home', 'church'],
        p: 'النمو يحتاج اجتهاداً. يقول كالفن: يلمح إلى أنه لا مكان للكسل هنا، وأنه يجب أن نطيع دعوة الله لا ببطء أو إهمال، بل بنشاط.',
        by: C('He intimates that no place is to be given in this case to sloth, and that we ought to obey God calling us, not slowly or carelessly, but that there is need of alacrity;'),
        today: 'تنتظر أن تنمو روحياً تلقائياً. بطرس يقول: ابذل كل اجتهاد، كما تجتهد في دراستك أو شغلك.',
        ask: 'أي فضيلة في القائمة (2 بطرس 1: 5-7) تحتاج أن تجتهد فيها الآن؟',
        step: 'اختر فضيلة واحدة من القائمة، وابحث عنها في الكتاب، واطلبها في الصلاة كل يوم هذا الأسبوع.'
      },
      {
        id: 'fruitful', t: 'لا متكاسلين ولا غير مثمرين', ref: '2Pet.1.8', cut: 'تصيركم لا متكاسلين ولا غير مثمرين لمعرفة ربنا يسوع المسيح', arenas: ['church'],
        p: 'المعرفة تثمر أو تذبل. يقول كالفن: يجب أن نتقدم دائماً، لكي تزداد عطايا الله فينا باستمرار.',
        by: C('We ought, therefore, always to make advances, so that God’s gifts may continually increase in us.'),
        today: 'معرفة كتابية كبيرة لا تُنتج ثمراً: لا خدمة، ولا محبة عملية، ولا تغيير.',
        ask: 'هل معرفتك بالمسيح تُثمر في حياتك؟',
        step: 'حوّل شيئاً واحداً تعرفه عن المسيح إلى ثمر عملي هذا الأسبوع.'
      },
      {
        id: 'scripture', t: 'ليست من تفسير خاص', ref: '2Pet.1.20', cut: 'أن كل نبوة الكتاب ليست من تفسير خاص', arenas: ['online', 'church'],
        p: 'الكتاب من الله، لا من رأي إنسان. يقول هنري: لا توجد نبوة في الكتاب من تفسير خاص، أي من رأي الإنسان أو شرح فكره، بل هي إعلان فكر الله.',
        by: H("No scripture prophecy is of private interpretation (or a man's own proper opinion, an explication of his own mind), but the revelation of the mind of God."),
        also: also(C('But almost all give this meaning, that we ought not to rush on headlong and rashly when we read Scripture, confiding in our own understanding.'), 'ويذكر كالفن أن أغلب المفسرين يرون المعنى: ألا نندفع بتهور حين نقرأ الكتاب معتمدين على فهمنا الخاص.'),
        today: 'كل واحد يقول: الآية دي بالنسبة لي معناها كذا. الكتاب له معنى أراده الله، نبحث عنه بتواضع.',
        ask: 'هل تقرأ الكتاب لتجد فيه رأيك، أم لتعرف فكر الله؟',
        step: 'في نص تدرسه هذا الأسبوع، استعن بتفسير موثوق قبل أن تقرر معناه.'
      }
    ]
  },
  {
    book: '2Pet', ch: 2,
    lead: 'معلمون كذبة سيأتون، والله يعرف أن ينقذ الأتقياء ويحفظ الأثمة ليوم الدين.',
    items: [
      {
        id: 'false', t: 'معلمون كذبة', ref: '2Pet.2.1', cut: 'كما سيكون فيكم أيضا معلمون كذبة', arenas: ['church', 'online'],
        p: 'لا تتفاجأ بوجود معلمين كذبة. يقول كالفن: يجب أن نطبق هذه الحقيقة على زماننا، لئلا تكسرنا هذه التجربة حين نرى معلمين كذبة يقومون ضد حق الله.',
        by: C('We ought, then, to apply this truth to our own time, lest, when we see false teachers rising up to oppose the truth of God, this trial should break us down.'),
        today: 'واعظ مشهور ينحرف، أو خادم تعلمت منه يترك الإيمان. هذا لا يعني أن الحق ضعيف، فقد أنبأنا الكتاب.',
        ask: 'هل يهز إيمانك سقوط أو انحراف معلمين معروفين؟',
        step: 'اقرأ 2 بطرس 2: 1-3 هذا الأسبوع، وصلِّ لأجل تمييز وثبات في الحق.'
      },
      {
        id: 'rescue', t: 'يعرف الرب أن ينقذ', ref: '2Pet.2.9', cut: 'يعلم الرب أن ينقذ الأتقياء من التجربة', arenas: ['home'],
        p: 'الله يعرف كيف ينقذ ومتى يدين. يقول كالفن: يذكّرنا أن هذا العمل يجب أن يُترك له، ولذلك يجب أن نحتمل التجارب ولا نخور حين يؤجل انتقامه من الأشرار.',
        by: C('By these words he reminds us that this office ought to be left to him, and that therefore we ought to endure temptations, and not to faint, when at any time he defers his vengeance against the ungodly.'),
        today: 'ظالم ينجح ويفلت، وأنت تتألم. الله لم ينسَ، وله يوم.',
        ask: 'هل تحاول أن تأخذ دور الله في معاقبة الظالمين؟',
        step: 'سلّم هذا الأسبوع ظلماً وقع عليك لله في صلاة، واترك العقاب له.'
      }
    ]
  },
  {
    book: '2Pet', ch: 3,
    lead: 'مستهزئون يقولون: أين موعد مجيئه؟ الرب لا يتباطأ بل يتأنى. فأي أناس يجب أن تكونوا؟',
    items: [
      {
        id: 'patient', t: 'يتأنى علينا', ref: '2Pet.3.9', cut: 'لا يتباطأ الرب عن وعده كما يحسب قوم التباطؤ لكنه يتأنى علينا', arenas: ['home', 'church'],
        p: 'التأخير رحمة. يقول هنري: ونستعمل استعمالاً صحيحاً صبر ربنا الذي ما زال يؤخر مجيئه.',
        by: H('then to make a right use of the patience of our Lord, who does as yet delay his coming.'),
        today: 'تأخر مجيء المسيح ليس فشلاً في الوعد، بل فرصة لتوبة من لم يتب بعد، ربما أحد أفراد عائلتك.',
        ask: 'كيف تستخدم وقت أناة الله؟',
        step: 'تكلم هذا الأسبوع مع شخص غير مؤمن قريب منك عن المسيح، مستغلاً وقت الأناة.'
      },
      {
        id: 'holy', t: 'أي أناس يجب أن تكونوا', ref: '2Pet.3.11', cut: 'أي أناس يجب أن تكونوا أنتم في سيرة مقدسة وتقوى', arenas: ['home', 'work'],
        p: 'النبوة هدفها السلوك لا الفضول. يقول كالفن: لم يكن غرضه أن يتكلم بتفصيل عن النار والعاصفة، بل أن يمهد لوصية يضيفها حالاً: أن نسعى لجدة الحياة.',
        by: C('For it was not his purpose to speak refinedly of fire and storm, and other things, but only that he might introduce an exhortation, which he immediately adds, even that we ought to strive after newness of life.'),
        today: 'جداول زمنية وخرائط لنهاية العالم، ونقاشات بلا نهاية. بطرس يسأل سؤالاً واحداً: كيف تعيش الآن؟',
        ask: 'هل يغيّر يقينك بنهاية العالم طريقة حياتك اليوم؟',
        step: 'اسأل نفسك كل صباح هذا الأسبوع: لو انتهى العالم اليوم، ماذا يجب أن أغيّر؟'
      },
      {
        id: 'blameless', t: 'بلا دنس ولا عيب', ref: '2Pet.3.14', cut: 'اجتهدوا لتوجدوا عنده بلا دنس ولا عيب في سلام', arenas: ['home', 'church'],
        p: 'الانتظار الحقيقي يصنع اجتهاداً. يقول كالفن: يجب أن نلاحظ أنه يقول إنه يجب أن يجدنا المسيح بلا لوم.',
        by: C('But we must notice that he says, that we ought to be found blameless by Christ;'),
        today: 'نتكلم عن مجيء المسيح كخبر، ولا نفكر: في أي حال سيجدني؟ في سلام، أم في خصام وخطية مخفية؟',
        ask: 'لو جاء المسيح اليوم، في أي حال سيجدك؟',
        step: 'صحّح هذا الأسبوع أمراً واحداً لا تريد أن يجدك المسيح فيه: خصام، أو خطية، أو إهمال.'
      }
    ]
  }
];
