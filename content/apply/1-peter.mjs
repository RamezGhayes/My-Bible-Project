// تطبيقات عملية: بطرس الأولى. المبادئ من كالفن ومن تكملة تفسير ماثيو هنري (النص الإنجليزي حرفياً في basis).
// المثال والسؤال والخطوة من إعداد الموقع.
import { H, C, also } from './_v.mjs';

export default [
  {
    book: '1Pet', ch: 1,
    lead: 'إلى المتغربين: رجاء حي، وخلاص تشتهي الملائكة أن تطلع عليه. كونوا قديسين، فقد افتديتم بدم كريم.',
    items: [
      {
        id: 'holy', t: 'كونوا قديسين', ref: '1Pet.1.15', cut: 'بل نظير القدوس الذي دعاكم كونوا أنتم أيضا قديسين في كل سيرة', arenas: ['home', 'work', 'online'],
        p: 'القداسة ليست لمجال واحد. يقول كالفن: نتعلم من هذا ما يجب أن يضعه المسيحيون هدفاً لهم طول الحياة: أن يشبهوا الله في القداسة والطهارة.',
        by: C('Hence we learn what Christians ought to propose to themselves as an object throughout life, that is, to resemble God in holiness and purity.'),
        today: 'قديس في الكنيسة، وعادي في الشغل، ومختلف أونلاين. بطرس يقول: في كل سيرة.',
        ask: 'في أي مجال من حياتك لا تفكر في القداسة؟',
        step: 'اختر هذا الأسبوع المجال الأقل قداسة في حياتك، وطبّق فيه تغييراً واحداً.'
      },
      {
        id: 'fear', t: 'سيروا بخوف', ref: '1Pet.1.17', cut: 'فسيروا زمان غربتكم بخوف', arenas: ['home', 'work'],
        p: 'الآب يرى القلب. يقول كالفن: لأن عيني الله تخترقان خفايا القلب، يجب أن نسلك معه بعناية لا بإهمال.',
        by: C('For, as God’s eyes are such that they penetrate into the hidden recesses of the heart, we ought to walk with him carefully and not negligently.'),
        today: 'تهتم بما يراه الناس، وتهمل ما يراه الله وحده: أفكارك، ودوافعك، وما تفعله حين لا يراك أحد.',
        ask: 'هل تعيش أمام عيني الله أم أمام عيون الناس فقط؟',
        step: 'في لحظة خصوصية هذا الأسبوع (موبايل، أو قرار مالي)، تذكر أن الله يرى، واختر بحسب ذلك.'
      },
      {
        id: 'fathers', t: 'السيرة التي تقلدتموها من الآباء', ref: '1Pet.1.18', cut: 'من سيرتكم الباطلة التي تقلدتموها من الآباء', arenas: ['home'],
        p: 'التقاليد العائلية ليست مقدسة. يقول كالفن: لكي يكون فداء المسيح فعالاً ونافعاً لنا، يجب أن نترك حياتنا السابقة، حتى لو كانت مأخوذة من تعليم آبائنا وممارستهم.',
        by: C('for, in order that the redemption of Christ may be effectual and useful to us, we must renounce our former life, though derived from the teaching and practice of our fathers.'),
        today: 'عادات عائلية: طريقة تعامل مع الزوجة، أو مع المال، أو مع الغضب، ورثتها ولم تفحصها بالكتاب.',
        ask: 'ما العادة التي ورثتها من عائلتك وتحتاج أن تتركها في المسيح؟',
        step: 'سمِّ عادة عائلية ورثتها لا تتفق مع الكتاب، وابدأ هذا الأسبوع كسرها.'
      }
    ]
  },
  {
    book: '1Pet', ch: 2,
    lead: 'حجارة حية في بيت روحي، وشعب مقتنى. كغرباء امتنعوا عن الشهوات، واخضعوا، واتبعوا خطوات المسيح في الألم.',
    items: [
      {
        id: 'strangers', t: 'كغرباء ونزلاء', ref: '1Pet.2.11', cut: 'أطلب إليكم كغرباء ونزلاء أن تمتنعوا عن الشهوات الجسدية التي تحارب النفس', arenas: ['online', 'home'],
        p: 'من يعرف أنه غريب لا يتعلق بالأرض. يقول كالفن: حين نعبر هذه الحياة كغرباء، لا نكون مستعبدين للجسد.',
        by: C('but when we pass as strangers through this life, we are not in bondage to the flesh.'),
        today: 'السائح لا يشتري أثاثاً للفندق. والمؤمن الذي يعرف أن وطنه في السماء يتحرر من شهوات كثيرة.',
        ask: 'هل تعيش كمقيم دائم أم كغريب عابر؟',
        step: 'حين تهاجمك شهوة هذا الأسبوع، قل لنفسك: أنا غريب هنا، وهذا ليس وطني.'
      },
      {
        id: 'good-conduct', t: 'سيرتكم حسنة', ref: '1Pet.2.12', cut: 'وأن تكون سيرتكم بين الأمم حسنة', arenas: ['work', 'online'],
        p: 'الناس يراقبون المؤمنين. يقول كالفن: اتهامات الأشرار وتلميحاتهم الخبيثة يجب أن تحفزنا لحياة مستقيمة.',
        by: C('Therefore the evil speakings and the wicked insinuations of the ungodly ought to stimulate us to lead an upright life;'),
        today: 'زملاء يتوقعون أن يمسكوا عليك غلطة لأنك مسيحي. بدل أن تغضب، اجعل حياتك ترد عليهم.',
        ask: 'ماذا يقول عنك من لا يؤمنون، بناءً على حياتك؟',
        step: 'كن هذا الأسبوع أكثر أمانة ولطفاً مع شخص ينتقد إيمانك.'
      },
      {
        id: 'reviled', t: 'إذ شتم لم يكن يشتم', ref: '1Pet.2.23', cut: 'الذي إذ شتم لم يكن يشتم عوضا وإذ تألم لم يكن يهدد', arenas: ['work', 'home', 'online'],
        p: 'المسيح مثالنا في احتمال الظلم. يقول كالفن: هنا يبيّن بطرس ما يجب أن نقتدي به في المسيح: أن نحتمل الظلم بهدوء، ولا ننتقم.',
        by: C('Here Peter points out what we are to imitate in Christ, even calmly to bear wrongs, and not to avenge wrongs.'),
        today: 'إهانة في الشغل، أو شتيمة أونلاين، أو ظلم من قريب. رد الفعل الطبيعي: الرد بالمثل.',
        ask: 'كيف ترد حين تُهان؟',
        step: 'حين تُهان هذا الأسبوع، لا ترد فوراً، بل سلّم الأمر لمن يقضي بعدل.'
      }
    ]
  },
  {
    book: '1Pet', ch: 3,
    lead: 'الزوجات والأزواج، وكونوا جميعاً متحدي الرأي، مباركين بدل الشتيمة، ومستعدين للمجاوبة عن رجائكم.',
    items: [
      {
        id: 'husbands', t: 'معطين إياهن كرامة', ref: '1Pet.3.7', cut: 'كذلكم أيها الرجال كونوا ساكنين بحسب الفطنة مع الإناء النسائي كالأضعف معطين إياهن كرامة', arenas: ['home'],
        p: 'المحبة الزوجية تحتاج احتراماً. يقول كالفن: لا شيء يهدم صداقة الحياة أكثر من الاحتقار، ولا نقدر أن نحب حقاً إلا من نقدّرهم، لأن المحبة يجب أن تقترن بالاحترام.',
        by: C('For nothing destroys the friendship of life more than contempt; nor can we really love any but those whom we esteem; for love must be connected with respect.'),
        today: 'سخرية من الزوجة أمام الناس، أو تجاهل رأيها، أو معاملتها كأقل. هذا يعيق صلواتك.',
        ask: 'هل تُظهر لزوجتك الاحترام والكرامة، خاصة أمام الآخرين؟',
        step: 'امدح زوجتك أمام الآخرين هذا الأسبوع، واطلب رأيها في قرار مهم.'
      },
      {
        id: 'bless', t: 'بل بالعكس مباركين', ref: '1Pet.3.9', cut: 'غير مجازين عن شر بشر أو عن شتيمة بشتيمة بل بالعكس مباركين', arenas: ['work', 'online'],
        p: 'الشر يُغلب بالخير. يقول كالفن: يعلّمنا بطرس عموماً أن الشرور تُغلب بأعمال اللطف. ويطلب أيضاً أن نصلي لأجل من يعيروننا.',
        by: C('But Peter teaches us in general, that evils are to be overcome by acts of kindness.', 'but Peter requires also that we should pray for those who reproach us;'),
        today: 'جار يضايقك، أو زميل يتكلم عنك بسوء. البركة لا تعني السذاجة، بل أن ترد بالخير.',
        ask: 'من تحتاج أن تباركه بدل أن ترد عليه بالمثل؟',
        step: 'صلِّ بالاسم هذا الأسبوع لأجل شخص أساء إليك، واعمل له خيراً عملياً.'
      },
      {
        id: 'answer', t: 'مستعدين دائماً لمجاوبة', ref: '1Pet.3.15', cut: 'مستعدين دائما لمجاوبة كل من يسألكم عن سبب الرجاء الذي فيكم بوداعة وخوف', arenas: ['work', 'online'],
        p: 'الصمت أحياناً خيانة. يقول كالفن: يجب أن نكون مستعدين للاعتراف بإيماننا وعرضه كلما لزم، لئلا يدين غير المؤمنين الدين الذي نتبعه بسبب صمتنا.',
        by: C('The meaning then is, that we ought to be prompt in avowing our faith, so as to set it forth whenever necessary, lest the unbelieving through our silence should condemn the religion we follow.'),
        also: also(H('An awful sense of the divine perfections is the best antidote against the fear of sufferings; did we fear God more, we should certainly fear men less.'), 'ويقول هنري: الشعور المهيب بكمالات الله هو أفضل علاج لخوف الآلام؛ لو خفنا الله أكثر، لخفنا الناس أقل.'),
        today: 'زميل يسأل: ليه بتصوم؟ أو ليه بتروح الكنيسة؟ فتغير الموضوع. بطرس يقول: كن مستعداً، بوداعة.',
        ask: 'لو سألك أحد اليوم عن سبب رجائك، ماذا ستقول؟',
        step: 'اكتب هذا الأسبوع في دقيقتين لماذا تؤمن بالمسيح، وتدرّب على قولها بوداعة.'
      }
    ]
  },
  {
    book: '1Pet', ch: 4,
    lead: 'المسيح تألم بالجسد، فتسلحوا بهذه النية. لتكن محبتكم شديدة، واخدموا بمواهبكم. لا تستغربوا البلوى.',
    items: [
      {
        id: 'love', t: 'المحبة تستر كثرة من الخطايا', ref: '1Pet.4.8', cut: 'ولكن قبل كل شيء لتكن محبتكم بعضكم لبعض شديدة لأن المحبة تستر كثرة من الخطايا', arenas: ['church', 'home'],
        p: 'المحبة لا تفضح بل تستر. يقول كالفن: هذه فائدة فريدة تجلبها المحبة حين توجد بيننا: أن شروراً لا تُحصى تُغطى بالنسيان.',
        by: C('This singular benefit love brings to us when it exists among us, so that innumerable evils are covered in oblivion.'),
        today: 'تحفظ قائمة بأخطاء زوجك أو أخيك أو صديقك، وتفتحها عند كل خلاف.',
        ask: 'ما الخطأ القديم الذي تحتاج أن تستره بالمحبة وتنساه؟',
        step: 'قرر هذا الأسبوع ألا تذكر خطأً قديماً لشخص قريب منك مرة أخرى.'
      },
      {
        id: 'stewards', t: 'كوكلاء صالحين', ref: '1Pet.4.10', cut: 'ليكن كل واحد بحسب ما أخذ موهبة يخدم بها بعضكم بعضا كوكلاء صالحين', arenas: ['church', 'work'],
        p: 'المواهب ليست ملكك. يقول كالفن: إن تفوقنا على الآخرين في موهبة، لنتذكر أننا في هذا وكلاء الله، لكي نعطيها بلطف لقريبنا حسب احتياجه أو منفعته.',
        by: C('If then we excel others in any gift, let us remember that we are as to this the stewards of God, in order that we may kindly impart it to our neighbors as their necessity or benefit may require.'),
        today: 'مهارة في الحسابات، أو الطبخ، أو التصميم، أو التعليم. تستخدمها فقط في الشغل أو للنفس.',
        ask: 'ما الموهبة التي عندك ولا تستخدمها لخدمة الآخرين؟',
        step: 'قدّم موهبة مهنية لخدمة شخص أو خدمة كنسية هذا الأسبوع مجاناً.'
      },
      {
        id: 'fiery', t: 'لا تستغربوا البلوى', ref: '1Pet.4.12', cut: 'لا تستغربوا البلوى المحرقة التي بينكم حادثة لأجل امتحانكم', arenas: ['home'],
        p: 'الاستعداد للألم قبل أن يأتي. يقول كالفن: لكي نكون مستعدين حين تجتاحنا أمواج الاضطهاد، يجب أن نعوّد أنفسنا في الوقت المناسب على ذلك بالتأمل المستمر في الصليب.',
        by: C('That we may then be in a prepared state of mind when the waves of persecutions roll over us, we ought in due time to habituate ourselves to such an event by meditating continually on the cross.'),
        today: 'إيمان مبني على توقع الراحة، فيتحطم عند أول ضيق. التأمل في الصليب يجهزك.',
        ask: 'هل إيمانك مستعد للألم أم مبني على توقع الراحة؟',
        step: 'تأمل هذا الأسبوع في آلام المسيح (مرقس 15 مثلاً)، واطلب قلباً مستعداً.'
      }
    ]
  },
  {
    book: '1Pet', ch: 5,
    lead: 'ارعوا رعية الله، وتسربلوا بالتواضع، وألقوا همكم عليه، واصحوا فإبليس كأسد زائر.',
    items: [
      {
        id: 'shepherd', t: 'ارعوا رعية الله', ref: '1Pet.5.2', cut: 'ارعوا رعية الله التي بينكم نظارا لا عن اضطرار بل بالاختيار', arenas: ['church'],
        p: 'الرعاية الحقيقية طعامها التعليم الصحيح. يقول كالفن: قطيع المسيح لا يُرعى إلا بالتعليم النقي، وهو وحده طعامنا الروحي.',
        by: C('for the flock of Christ cannot be fed except with pure doctrine, which is alone our spiritual food.'),
        today: 'خدمة مليئة بالأنشطة والترفيه، والكلمة قليلة. القطيع يجوع وسط الزحمة.',
        ask: 'إن كنت تخدم، هل تطعم مخدوميك الكلمة أم الأنشطة فقط؟',
        step: 'اجعل الكلمة مركز اجتماعك أو خدمتك القادمة، لا مجرد إضافة.'
      },
      {
        id: 'humble', t: 'تسربلوا بالتواضع', ref: '1Pet.5.5', cut: 'وكونوا جميعا خاضعين بعضكم لبعض وتسربلوا بالتواضع', arenas: ['church', 'home'],
        p: 'التواضع أمام الله يظهر أمام الناس. يقول كالفن: يجب أن نتذكر دائماً لأي غاية يأمرنا أن نتضع أمام الله: لكي نكون ألطف وأرق مع إخوتنا، ولا نرفض الخضوع لهم بقدر ما تطلب المحبة.',
        by: C('We must ever bear in mind for what end he bids us to be humble before God, even that we may be more courteous and kind to our brethren, and not refuse to submit to them as far as love demands.'),
        today: 'تتضع في الصلاة أمام الله، ثم تتعالى على أخيك في اجتماع الخدمة.',
        ask: 'هل يظهر تواضعك أمام الله في تعاملك مع الناس؟',
        step: 'اقبل هذا الأسبوع رأي شخص آخر في أمر كنت متمسكاً فيه برأيك.'
      },
      {
        id: 'cares', t: 'ملقين كل همكم عليه', ref: '1Pet.5.7', cut: 'ملقين كل همكم عليه لأنه هو يعتني بكم', arenas: ['home', 'work'],
        p: 'القلق علاجه معرفة رعاية الله. يقول كالفن: حين نقتنع أن الله يعتني بنا، تنقاد أذهاننا بسهولة للصبر والتواضع.',
        by: C('Now, on the other hand, as soon as we are convinced that God cares for us, our minds are easily led to patience and humility.'),
        today: 'تحمل هموم البيت والشغل والأولاد وحدك. الله لا يطلب منك أن تحملها، بل أن تلقيها عليه.',
        ask: 'ما الهم الذي تحمله وحدك ولم تلقه على الله؟',
        step: 'اكتب هذا الأسبوع قائمة بهمومك، وصلِّ على كل واحد: ألقيه عليك لأنك تعتني بي.'
      },
      {
        id: 'watch', t: 'اصحوا واسهروا', ref: '1Pet.5.8', cut: 'اصحوا واسهروا لأن إبليس خصمكم كأسد زائر يجول ملتمسا من يبتلعه هو', arenas: ['online', 'home'],
        p: 'العدو حقيقي ويقظ. يقول كالفن: يذكّرنا أننا لا نتعامل مع عدو عادي، بل مع واحد كالأسد يجول هنا وهناك مستعداً للافتراس، ولذلك يجب أن نسهر بعناية.',
        by: C('and he reminds us that we have to do with no common enemy, but one who, like a lion, runs here and there, ready to devour.', 'He hence concludes that we ought carefully to watch.'),
        today: 'لحظات التعب، والوحدة، والملل في آخر الليل على الموبايل: هذه أوقات يجول فيها الأسد.',
        ask: 'متى تكون أكثر عرضة للتجربة؟',
        step: 'حدد وقتك الأضعف، وضع له حماية عملية هذا الأسبوع (الموبايل خارج الغرفة مثلاً).'
      }
    ]
  }
];
