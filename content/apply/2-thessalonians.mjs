// تطبيقات عملية: تسالونيكي الثانية. المبادئ من كالفن ومن تكملة تفسير ماثيو هنري (النص الإنجليزي حرفياً في basis).
// المثال والسؤال والخطوة من إعداد الموقع.
import { H, C, also } from './_v.mjs';

export default [
  {
    book: '2Thess', ch: 1,
    lead: 'شكر على إيمان ينمو ومحبة تزداد وسط الضيقات، ووعد بعدل الله، وصلاة ليتمجد اسم المسيح فيهم.',
    items: [
      {
        id: 'growing', t: 'إيمانكم ينمو كثيراً', ref: '2Thess.1.3', cut: 'ينبغي لنا أن نشكر الله كل حين من جهتكم أيها الإخوة كما يحق لأن إيمانكم ينمو كثيرا', arenas: ['church'],
        p: 'بولس يفرح بنمو غيره كأنه نموه. يقول كالفن: يجب أن يكون خير إخوتنا عزيزاً علينا حتى نحسب بين بركاتنا كل ما أُعطي لهم.',
        by: C('Farther, the welfare of our brethren ought to be so dear to us, that we ought to reckon among our own benefits everything that has been conferred upon them.'),
        today: 'أخ في الكنيسة نمت خدمته أو موهبته، وأنت تشعر بالغيرة بدل الفرح. بركته بركتك.',
        ask: 'هل تفرح بنمو الآخرين أم تقارن نفسك بهم؟',
        step: 'اشكر الله هذا الأسبوع بالاسم على نمو شخص تشعر نحوه بالغيرة، وقل له كلمة تشجيع.'
      },
      {
        id: 'pray', t: 'لأجله نصلي كل حين', ref: '2Thess.1.11', cut: 'الأمر الذي لأجله نصلي أيضا كل حين من جهتكم', arenas: ['home', 'church'],
        p: 'التفكير في مجيء المسيح يقود للصلاة. يقول هنري: الأفكار المؤمنة وانتظار مجيء المسيح الثاني يجب أن تدفعنا للصلاة إلى الله لأجل أنفسنا وغيرنا.',
        by: H('The believing thoughts and expectation of the second coming of Christ should put us upon prayer to God for ourselves and others.'),
        today: 'نقاشات طويلة عن علامات الأزمنة ونهاية العالم، بلا صلاة. الرجاء الحقيقي يقود للركب.',
        ask: 'هل يقودك التفكير في مجيء المسيح للصلاة أم للفضول؟',
        step: 'صلِّ هذا الأسبوع لأجل شخص ليكون مستعداً لمجيء المسيح.'
      },
      {
        id: 'glory', t: 'لكي يتمجد اسم ربنا', ref: '2Thess.1.12', cut: 'لكي يتمجد اسم ربنا يسوع المسيح فيكم', arenas: ['work', 'home'],
        p: 'الهدف النهائي مجد المسيح. يقول كالفن: يجب أن نسعى بكل قوتنا لتقدم مجد المسيح، المرتبط بمجدنا.',
        by: C('In the mean time, if we are not worse than stupid, we must aim with all our might at the advancement of the glory of Christ, which is connected with ours.'),
        today: 'تخطط لمستقبلك وشغلك وعائلتك. أين مجد المسيح في هذه الخطط؟',
        ask: 'هل مجد المسيح هدف حقيقي في قراراتك الكبيرة؟',
        step: 'في قرار تتخذه هذا الأسبوع، اسأل صراحة: كيف يتمجد المسيح بهذا؟'
      }
    ]
  },
  {
    book: '2Thess', ch: 2,
    lead: 'لا تتزعزعوا من أخبار كاذبة عن يوم الرب. إنسان الخطية سيأتي أولاً، وأنتم مختارون فاثبتوا.',
    items: [
      {
        id: 'shaken', t: 'لا تتزعزعوا سريعاً', ref: '2Thess.2.2', cut: 'أن لا تتزعزعوا سريعا عن ذهنكم ولا ترتاعوا', arenas: ['online'],
        p: 'التعليم الخاطئ يسبب الذعر. يقول هنري: الأخطاء في الذهن تضعف إيماننا جداً وتسبب لنا الاضطراب، والضعفاء في الإيمان والمضطربو الذهن كثيراً ما يسهل خداعهم ويقعون فريسة للمضلين.',
        by: H('Errors in the mind tend greatly to weaken our faith, and cause us trouble; and such as are weak in faith and of troubled minds are oftentimes apt to be deceived, and fall a prey to seducers.'),
        today: 'فيديوهات عن موعد نهاية العالم، ونبوات عن أحداث سياسية، تنتشر بسرعة وتخيف الناس.',
        ask: 'هل تتأثر بسرعة بتعاليم مثيرة عن نهاية الأيام؟',
        step: 'قبل مشاركة أي محتوى نبوي هذا الأسبوع، افحصه بالكتاب واسأل راعيك.'
      },
      {
        id: 'love-truth', t: 'محبة الحق', ref: '2Thess.2.10', cut: 'لأنهم لم يقبلوا محبة الحق حتى يخلصوا', arenas: ['church', 'home'],
        p: 'لا يكفي قبول الحق، بل محبته. يقول كالفن: الإيمان دائماً مقترن بتوقير حلو واختياري لله، لأننا لا نؤمن بكلمة الله إيماناً صحيحاً ما لم تكن محبوبة وحلوة لنا.',
        by: C('Hence we learn that faith is always conjoined with a sweet and voluntary reverence for God, because we do not properly believe the word of God, unless it is lovely and pleasant to us.'),
        today: 'تقبل العقيدة الصحيحة لأنك نشأت عليها، لكنها لا تفرحك. محبة الحق حماية من الخداع.',
        ask: 'هل كلمة الله حلوة لك، أم مجرد واجب؟',
        step: 'اقرأ مزمور 119: 97-104 هذا الأسبوع، واطلب من الله أن يجعل كلمته حلوة لك.'
      },
      {
        id: 'stand', t: 'فاثبتوا', ref: '2Thess.2.15', cut: 'فاثبتوا إذا أيها الإخوة وتمسكوا بالتعاليم التي تعلمتموها', arenas: ['church'],
        p: 'الاختيار لا يعني الكسل بل الثبات. يقول هنري: لا يقول: أنتم مختارون للخلاص، لذلك يمكنكم أن تكونوا مهملين ومطمئنين، بل: فاثبتوا.',
        by: H('He does not say, "You are chosen to salvation, and therefore you may be careless and secure;" but *therefore stand fast.'),
        today: 'من يقول: مادام الله اختارني، فلا داعي لأن أجتهد. بولس يستنتج العكس.',
        ask: 'هل يقودك يقين خلاصك للثبات أم للإهمال؟',
        step: 'حدد تعليماً كتابياً تعلمته وبدأت تتهاون فيه، وارجع للتمسك به هذا الأسبوع.'
      }
    ]
  },
  {
    book: '2Thess', ch: 3,
    lead: 'صلوا لأجلنا. ثم توبيخ لمن يسلكون بلا ترتيب ولا يعملون. ولا تفشلوا في عمل الخير.',
    items: [
      {
        id: 'work', t: 'إن كان أحد لا يريد أن يشتغل', ref: '2Thess.3.10', cut: 'أنه إن كان أحد لا يريد أن يشتغل فلا يأكل أيضا', arenas: ['work', 'home'],
        p: 'العمل جزء من الخليقة. يقول كالفن: نعلم أن الإنسان خُلق ليعمل شيئاً. ويلاحظ أن من لا عمل لهم يتعبون من الفراغ أكثر مما لو انشغلوا بعمل مهم، فيتنقلون هنا وهناك ويجمعون الأخبار وينشرونها.',
        by: C('Besides, we know that man was created with this view, that he might do something.', 'For we see, that those who have nothing to do are much more fatigued by doing nothing, than if they were employing themselves in some very important work'),
        today: 'لاحظ: يريد. الوصية ليست ضد العاطل رغماً عنه، بل ضد من يرفض العمل ويعتمد على غيره، وكثيراً ما يملأ فراغه بالقيل والقال.',
        ask: 'هل تستخدم وقتك ومواهبك في عمل منتج؟',
        step: 'إن كان عندك وقت فراغ كبير، حوّل جزءاً منه هذا الأسبوع لعمل نافع أو خدمة.'
      },
      {
        id: 'weary', t: 'لا تفشلوا في عمل الخير', ref: '2Thess.3.13', cut: 'أما أنتم أيها الإخوة فلا تفشلوا في عمل الخير', arenas: ['church', 'home'],
        p: 'وجود مستغلين لا يبرر وقف العطاء. يقول كالفن: مع أن كثيرين غير مستحقين، وآخرين يسيئون استخدام كرمنا، يجب ألا نتوقف لهذا السبب عن مساعدة من يحتاجون.',
        by: C('Hence Paul admonishes us, that, although there are many that are undeserving, while others abuse our liberality, we must not on this account leave off helping those that need our aid.'),
        today: 'ساعدت شخصاً فاكتشفت أنه كذب عليك، فقررت ألا تساعد أحداً بعد ذلك. لا تفشل، بل كن حكيماً.',
        ask: 'هل جعلتك تجربة سيئة تتوقف عن عمل الخير؟',
        step: 'ارجع هذا الأسبوع لعمل خير توقفت عنه، مع حكمة أكبر في الاختيار.'
      },
      {
        id: 'brother', t: 'أنذروه كأخ', ref: '2Thess.3.15', cut: 'ولكن لا تحسبوه كعدو بل أنذروه كأخ', arenas: ['church'],
        p: 'التأديب الكنسي هدفه الرد لا التحطيم. يقول كالفن: يجب أن نحرص ألا يُبتلع المخطئ من الحزن، وهو ما يحدث إن كانت الصرامة مفرطة.',
        by: C('for, as he elsewhere commands, we must take care that the offender be not swallowed up with sorrow'),
        today: 'أخ أخطأ علناً، فتعامل الكنيسة معه كعدو: مقاطعة كاملة، وكلام عنه في غيابه. الكتاب يقول: أخ.',
        ask: 'كيف تتعامل مع أخ أخطأ: كعدو أم كأخ يحتاج إنذاراً؟',
        step: 'إن كنت تعرف أخاً تحت تأديب، أرسل له هذا الأسبوع كلمة تشجعه على التوبة والرجوع.'
      }
    ]
  }
];
