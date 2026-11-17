// تطبيقات عملية: كولوسي. المبادئ من كالفن ومن تكملة تفسير ماثيو هنري (النص الإنجليزي حرفياً في basis).
// المثال والسؤال والخطوة من إعداد الموقع.
import { H, C, also } from './_v.mjs';

export default [
  {
    book: 'Col', ch: 1,
    lead: 'صلاة لأجل النمو، والمسيح بكر كل خليقة ورأس الكنيسة، وصالحكم بعد أن كنتم أعداء.',
    items: [
      {
        id: 'grow', t: 'نامين في معرفة الله', ref: 'Col.1.10', cut: 'مثمرين في كل عمل صالح ونامين في معرفة الله', arenas: ['church', 'home'],
        p: 'النمو لا يتوقف. يقول كالفن: ما قيل للكولوسيين ليأخذه كل المؤمنين كأنه قيل لهم، فيستخرجوا منه وصية عامة: يجب أن نتقدم دائماً في تعليم التقوى حتى الموت.',
        by: C('What is here said to the Colossians, let all believers take as said to themselves, and draw from this a common exhortation that we must always make progress in the doctrine of piety until death.'),
        today: 'بعد التخرج من مدارس الأحد أو مؤتمرات الشباب، يتوقف كثيرون عن التعلم. النمو حتى الموت.',
        ask: 'ما آخر شيء جديد تعلمته عن الله؟',
        step: 'ابدأ هذا الأسبوع دراسة سفر أو موضوع لم تدرسه من قبل.'
      },
      {
        id: 'enemies', t: 'كنتم أعداء، قد صالحكم', ref: 'Col.1.21', cut: 'وأنتم الذين كنتم قبلا أجنبيين وأعداء في الفكر', arenas: ['home', 'church'],
        p: 'المصالحة وصلت لأبعد الناس. يقول هنري: أعظم أعداء الله، الذين وقفوا أبعد مسافة وتحدّوه، يمكن أن يتصالحوا.',
        by: H('The greatest enemies to God, who have stood at the greatest distance and bidden him defiance, may be reconciled'),
        today: 'شخص يعادي الإيمان علناً، أو قريب يسخر من الله. لا أحد أبعد من أن يُصالح.',
        ask: 'من تعتبره أبعد من أن يصل إليه المسيح؟',
        step: 'صلِّ لأجل خلاص أكثر شخص معادٍ للإيمان تعرفه، بالاسم، كل يوم هذا الأسبوع.'
      },
      {
        id: 'teach', t: 'منذرين ومعلمين', ref: 'Col.1.28', cut: 'منذرين كل إنسان ومعلمين كل إنسان بكل حكمة', arenas: ['home', 'church'],
        p: 'الإنذار وحده لا يكفي. يقول هنري: حين نحذر الناس مما يفعلونه خطأ، يجب أن نعلّمهم أن يفعلوا الأفضل، فالإنذار والتعليم يسيران معاً.',
        by: H('When we warn people of what they do amiss, we must teach them to do better: warning and teaching must go together.'),
        today: 'تقول لابنك: بلاش الموبايل، بلاش الصحاب دول، بلاش... ولا تعلمه البديل. النقد بلا تعليم يحبط.',
        ask: 'هل تكتفي بالتحذير، أم تعلّم البديل الصحيح؟',
        step: 'في أي تحذير توجهه هذا الأسبوع، أضف: وبدلاً من ذلك، جرّب...'
      }
    ]
  },
  {
    book: 'Col', ch: 2,
    lead: 'متأصلين ومبنيين في المسيح، واحذروا الفلسفات الفارغة والطقوس البشرية.',
    items: [
      {
        id: 'rooted', t: 'متأصلين ومبنيين', ref: 'Col.2.7', cut: 'متأصلين ومبنيين فيه وموطدين في الإيمان', arenas: ['church', 'home'],
        p: 'لا بناء بلا جذور. يقول هنري: لا نقدر أن نُبنى في المسيح ما لم نتأصل فيه أولاً. وإذ نتثبت في الإيمان، يجب أن نزداد فيه ونتحسن أكثر فأكثر، مع الشكر.',
        by: H('We cannot be built up in Christ, unless we be first rooted in him.', 'Being established in the faith, we must abound therein, and improve in it more and more; and this with thanksgiving.'),
        today: 'تريد خدمة كبيرة وتأثيراً واسعاً، وجذورك ضعيفة: صلاة قليلة، ومعرفة سطحية. الشجرة تسقط أول ريح.',
        ask: 'هل جذورك في المسيح عميقة بما يكفي لما تبنيه؟',
        step: 'خصص هذا الأسبوع وقتاً لتعميق الجذور: كلمة، وصلاة، وشركة، قبل أي نشاط خدمي إضافي.'
      },
      {
        id: 'philosophy', t: 'لا يسبيكم أحد', ref: 'Col.2.8', cut: 'انظروا أن لا يكون أحد يسبيكم بالفلسفة وبغرور باطل', arenas: ['online'],
        p: 'أفكار جذابة تأخذك بعيداً عن المسيح. يقول كالفن: إن دعانا أحد إلى غير المسيح، حتى لو بدا ممتلئاً بالسماء والأرض، فهو فارغ مملوء ريحاً، فلنودّعه بلا اهتمام.',
        by: C('should any one call us anywhere else than to Christ, though in other respects he were big with heaven and earth, he is empty and full of wind: let us, therefore, without concern, bid him farewell.'),
        today: 'كورسات التنمية الذاتية بلغة روحية، وفلسفات الطاقة والجذب، وأفكار تقول إن كل الطرق واحدة.',
        ask: 'ما الفكرة الجذابة التي بدأت تأخذك بعيداً عن المسيح؟',
        step: 'افحص هذا الأسبوع فكرة تتابعها: هل تقودك إلى المسيح أم تجعلك تستغني عنه؟'
      },
      {
        id: 'judge', t: 'لا يحكم عليكم أحد', ref: 'Col.2.16', cut: 'فلا يحكم عليكم أحد في أكل أو شرب أو من جهة عيد', arenas: ['church'],
        p: 'المسيح حرر الضمير من قيود البشر. يقول كالفن: إن نصّب أحد البشر نفسه قاضياً في هذا الأمر، فلا نخضع له، لأن المسيح، القاضي الوحيد المختص، يحررنا.',
        by: C('should any one of mortals assume to himself in this matter the office of judge, let us not submit to him, inasmuch as Christ, the only competent Judge, sets us free.'),
        today: 'من يدينك لأنك لم تصم صوماً معيناً، أو لم تحتفل بطريقة معينة. ومن يدينك لأنك تصوم. المسيح هو القاضي.',
        ask: 'هل يوجد من يقيدك بأحكام بشرية في أمور ثانوية؟',
        step: 'فرّق هذا الأسبوع بين وصايا الله الواضحة والأحكام البشرية في حياتك الروحية.'
      }
    ]
  },
  {
    book: 'Col', ch: 3,
    lead: 'اطلبوا ما فوق، وأميتوا الأرضي، والبسوا الجديد، ولتسكن فيكم كلمة المسيح بغنى.',
    items: [
      {
        id: 'above', t: 'اهتموا بما فوق', ref: 'Col.3.2', cut: 'اهتموا بما فوق لا بما على الأرض', arenas: ['home', 'online'],
        p: 'القلب يتبع ما يهتم به. يقول هنري: أن نطلب الأمور السماوية يعني أن نضع عواطفنا عليها، ونحبها، ونوجه رغباتنا نحوها.',
        by: H('To seek heavenly things is to set our affections upon them, to love them and let our desires be towards them.'),
        today: 'تصفح الموبايل يكشف ما تهتم به: إعلانات، وموضة، وأخبار، ونميمة. أين ما فوق في اهتماماتك؟',
        ask: 'ماذا تكشف اهتماماتك اليومية عن قلبك؟',
        step: 'تابع هذا الأسبوع حساباً أو مصدراً يوجه اهتمامك لما فوق، واحذف مصدراً يشدّك للأرض.'
      },
      {
        id: 'covet', t: 'الطمع عبادة أوثان', ref: 'Col.3.5', cut: 'فأميتوا أعضاءكم التي على الأرض', arenas: ['work', 'online'],
        p: 'بولس يضع الطمع مع الزنا والنجاسة. يقول هنري: الطمع عبادة أوثان روحية: أن نعطي للثروة الدنيوية المحبة والتقدير اللذين لله وحده، وفيه خبث أكبر وإغاظة لله أكثر مما يُظن عادة.',
        by: H('Covetousness is spiritual idolatry: it is the giving of that love and regard to worldly wealth which are due to God only, and carries a greater degree of malignity in it, and is more highly provoking to God, than is commonly thought.'),
        today: 'لا أحد يعتبر نفسه طماعاً. لكن انظر: فيم تفكر حين لا تفكر في شيء؟ وعلى ماذا تقلق أكثر؟',
        ask: 'هل المال أو الممتلكات تأخذ مكاناً في قلبك يخص الله؟',
        step: 'تخلَّ هذا الأسبوع عن شيء تتعلق به أكثر من اللازم، بالعطاء أو الاستغناء.'
      },
      {
        id: 'sing', t: 'مترنمين في قلوبكم', ref: 'Col.3.16', cut: 'بمزامير وتسابيح وأغاني روحية بنعمة مترنمين في قلوبكم للرب', arenas: ['church', 'home'],
        p: 'الترنيم تعليم وعبادة معاً. يقول كالفن: كما يجب أن نحث الآخرين، يجب أيضاً أن نرنم من القلب، لئلا يكون مجرد صوت خارجي من الفم.',
        by: C('for as we ought to stir up others, so we ought also to sing from the heart, that there may not be merely an external sound with the mouth.'),
        today: 'ترنيمة تحبها للحن، ولم تفكر أبداً في كلماتها. أو ترنم في الكنيسة وعقلك في مكان آخر.',
        ask: 'هل ترنم من قلبك أم من فمك فقط؟',
        step: 'اختر ترنيمة واحدة هذا الأسبوع، واقرأ كلماتها ببطء كصلاة قبل أن ترنمها.'
      }
    ]
  },
  {
    book: 'Col', ch: 4,
    lead: 'واظبوا على الصلاة، وكلامكم بنعمة، وتحيات: أنسيمس العبد، وأبفراس المجاهد في الصلاة، ولوقا الطبيب.',
    items: [
      {
        id: 'prayers', t: 'صلّوا لأجلنا أيضاً', ref: 'Col.4.3', cut: 'مصلين في ذلك لأجلنا نحن أيضا ليفتح الرب لنا بابا للكلام', arenas: ['church'],
        p: 'الرسول العظيم يطلب صلاتهم. يقول كالفن: لا يجب أن يصلي كل منا لأجل إخوته فقط، بل أن يطلب أيضاً باجتهاد معونة صلوات الآخرين كلما دعت الحاجة.',
        by: C('Not only, therefore, ought each of us to pray for his brethren, but we ought also, on our part, diligently to seek help from the prayers of others, as often as occasion requires.'),
        today: 'تخجل أن تطلب من أحد أن يصلي لأجلك، كأنه ضعف. بولس طلب كثيراً.',
        ask: 'متى كانت آخر مرة طلبت فيها من أحد أن يصلي لأجلك بالتحديد؟',
        step: 'اطلب هذا الأسبوع من شخصين أن يصليا لأجل احتياج محدد عندك.'
      },
      {
        id: 'onesimus', t: 'الأخ الأمين الحبيب', ref: 'Col.4.9', cut: 'مع أنسيمس الأخ الأمين الحبيب', arenas: ['church'],
        p: 'عبد هارب صار أخاً محبوباً. يقول هنري: مع أنه كان عبداً فقيراً، وكان رجلاً سيئاً، فبعد أن رجع إلى المسيح سماه بولس الأخ الأمين الحبيب.',
        by: H('Though he was a poor servant, and had been a bad man, yet, being now a convert, Paul calls him a *faithful and beloved brother.'),
        today: 'شخص بسيط اجتماعياً، أو له ماضٍ معروف، رجع للمسيح. هل تعامله كأخ حقيقي أم كضيف تحت المراقبة؟',
        ask: 'هل تعطي المؤمنين ذوي الماضي الصعب كرامتهم الجديدة في المسيح؟',
        step: 'قل لشخص له ماضٍ صعب هذا الأسبوع كلمة تقدير لأمانته الحالية.'
      },
      {
        id: 'epaphras', t: 'مجاهد في الصلاة', ref: 'Col.4.12', cut: 'مجاهد كل حين لأجلكم بالصلوات لكي تثبتوا كاملين', arenas: ['church', 'home'],
        p: 'أبفراس لم يكن مشهوراً، لكنه كان يجاهد في الصلاة. يقول هنري: أن نثبت كاملين تامين في مشيئة الله هو ما يجب أن نشتهيه بحرارة لأنفسنا ولغيرنا.',
        by: H('To stand perfect and complete in the will of God is what we should earnestly desire both for ourselves and others.'),
        also: also(C('Let us carefully meditate on these examples, that they may stir us up to all imitation of the like pursuit.'), 'ويقول كالفن عن أمثال هؤلاء الخدام: لنتأمل في هذه الأمثلة بعناية، لتحثنا على الاقتداء بها.'),
        today: 'صلاة الجهاد ليست كلمتين سريعتين، بل وقت وتعب لأجل نضج الآخرين: أولادك، ومخدوميك، وكنيستك.',
        ask: 'لأجل من تجاهد في الصلاة؟',
        step: 'اختر ثلاثة أشخاص، وصلِّ لأجل ثباتهم ونضجهم بجهاد كل يوم هذا الأسبوع.'
      }
    ]
  }
];
