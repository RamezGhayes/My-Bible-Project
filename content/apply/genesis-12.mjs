// «عِش النص»: تطبيقات عملية للتكوين 12.
//
// القواعد (البناء يتحقق منها):
//  - كل مبدأ (p) ملخص عربي أمين لكلام مصدر مُصلَح معروف. basis: عبارات إنجليزية منقولة حرفياً، يجب أن توجد في النص المحفوظ في data/sources.
//  - المصادر هنا: ماثيو هنري (تفسير الكتاب المقدس، data/sources/mhc/genesis-12.md)، وإقرار وستمنستر والتعليم الكبير (data/sources/westminster.json).
//  - cut: كلمات الآية بلا تشكيل؛ يأخذ البناء النص الحرفي من فاندايك، ويتوقف إن لم يجدها.
//  - today: مثال معاصر من إعداد الموقع، ويُعرض بهذا الوصف صراحة. لا يُنسب لأي كاتب.
//  - لا علامات «» في هذا الملف إلا لنص فاندايك الحرفي، ولا شرطة طويلة.

export default {
  book: 'Gen', ch: 12,
  lead: 'قرأت عن رجل ترك أرضه وأهله على كلمة واحدة من الله. ماذا يعني هذا لك هذا الأسبوع، في بيتك وشغلك وموبايلك؟',
  items: [
    {
      id: 'trust', t: 'اتبع الله قبل أن ترى الخريطة', ref: 'Gen.12.1', cut: 'اذهب من ارضك ومن عشيرتك ومن بيت ابيك الى الارض التي اريك',
      arenas: ['work', 'online'],
      p: 'لم يقل الله لأبرام: أرضاً سأعطيك إياها، بل: أرضاً سأريك إياها. ويعلّق ماثيو هنري: من يتعامل مع الله يتعامل معه بالثقة، فنترك ما يُرى لأجل ما لا يُرى. ويرى أن هذه الدعوة تشبه دعوة الإنجيل: من يترك خطاياه ويرجع إلى الله هو الرابح بلا شك.',
      by: { k: 'mhc', file: 'genesis-12', basis: ['He does not say, "It is a land that I will give thee," but merely, "a land that I will show thee."', 'Those that will deal with God must deal upon trust; we must quit the things that are seen for things that are not seen', 'This command which God gave to Abram is much the same with the gospel call', 'Those who leave their sins, and turn to God, will themselves be unspeakable gainers by the change'] },
      also: { k: 'wcf', at: '1.1', p: 'تنبيه: الله كلّم أبرام مباشرة. أما نحن فنسمع صوته اليوم في الكتاب المقدس المكتوب، لأن الطرق السابقة التي أعلن بها مشيئته لشعبه قد انتهت. فلا تنتظر صوتاً أو علامة، بل أطع ما هو مكتوب بوضوح.', basis: ["those former ways of God's revealing his will unto his people being now ceased"] },
      today: 'أنت تعرف بوضوح ما يقوله الكتاب عن عادة أو علاقة في حياتك، لكن تركها يكلّفك شيئاً تراه الآن: أصحاباً، أو متعة، أو فرصة. هذا هو امتحان أبرام في 2026: هل تثق في الله أكثر مما ترى؟',
      ask: 'ما الشيء الذي تعرف أن الكتاب يطلب منك تركه، وتؤجله لأنك لا ترى ما بعده؟',
      step: 'اكتب هذا الشيء في ورقة، وصلِّ لأجله كل يوم هذا الأسبوع، واحكِ عنه لمؤمن تثق فيه.'
    },
    {
      id: 'blessing', t: 'كن بركة حيث تعيش', ref: 'Gen.12.2', cut: 'وتكون بركة',
      arenas: ['home', 'work'],
      p: 'من وعود الله لأبرام: وتكون بركة. ويشرح ماثيو هنري: حياتك تكون بركة للأماكن التي تتغرب فيها. فالصالحون بركة لبلادهم، وأن يُجعلوا كذلك شرف وسعادة لا توصف.',
      by: { k: 'mhc', file: 'genesis-12', basis: ['"Thy life shall be a blessing to the places where thou shalt sojourn." Note, Good men are the blessings of their country, and it is their unspeakable honour and happiness to be made so.'] },
      today: 'في العمارة، أو في جروب الشغل، أو في المدرّج: هل وجودك يجعل المكان أفضل؟ البركة قد تكون أمانة في شغل لا يراقبه أحد، أو كلمة طيبة وسط الشكوى، أو مساعدة جار كبير في السن.',
      ask: 'لو غبت عن مكان شغلك أو دراستك شهراً، ماذا سيفتقد الناس فيك؟',
      step: 'اختر شخصاً واحداً في الشغل أو الجامعة أو العمارة، واعمل له خيراً عملياً هذا الأسبوع دون أن تنتظر مقابلاً.'
    },
    {
      id: 'altar', t: 'أينما نصبت خيمتك، ابنِ مذبحاً', ref: 'Gen.12.8', cut: 'فبنى هناك مذبحا للرب ودعا باسم الرب',
      arenas: ['home', 'church'],
      p: 'يلاحظ ماثيو هنري أنه حيثما كانت لأبرام خيمة كان لله مذبح، مذبح مقدَّس بالصلاة. وأبرام، وهو غريب ونزيل، أقام عبادة الله في بيته وحافظ عليها.',
      by: { k: 'mhc', file: 'genesis-12', basis: ['wherever he had a tent God had an altar, and that an altar sanctified by prayer', 'he set up, and kept up, the worship of God in his family'] },
      also: { k: 'wcf', at: '21.6', p: 'ويقول إقرار وستمنستر إن الله يُعبد في كل مكان بالروح والحق: في العائلات يومياً، وفي الخلوة كل واحد بمفرده، وبوقار أكبر في الاجتماعات العامة.', basis: ['God is to be worshipped everywhere in spirit and truth; as in private families daily, and in secret each one by himself, so more solemnly in the public assemblies'] },
      today: 'انتقلت لمدينة جديدة، أو بدأت سكن الجامعة، أو اتجوزت حديثاً، أو اتغيّر جدولك. أول ما يضيع في الزحمة هو وقتك مع الله. أبرام لم ينتظر حتى يستقر: بنى المذبح وهو في خيمة.',
      ask: 'أين ومتى تلتقي بالله كل يوم الآن؟ هل لهذا مكان ووقت ثابت، أم يحدث صدفة؟',
      step: 'حدّد وقتاً ثابتاً، ولو عشر دقائق، لقراءة الكتاب والصلاة. وإن كنت تعيش مع أسرتك، اقرأوا أصحاحاً معاً مرة واحدة هذا الأسبوع.'
    },
    {
      id: 'truth', t: 'لا تقل نصف الحقيقة لتنجو', ref: 'Gen.12.13', cut: 'قولي انك اختي',
      arenas: ['work', 'online'],
      p: 'ما قاله أبرام كان صحيحاً بمعنى ما، لكنه قاله بقصد الخداع. ويقول ماثيو هنري: خشية الإنسان تضع شركاً، وكثيرون يُدفعون إلى الخطية خوفاً من الموت. والكتاب يروي سقطات القديسين لا لنقلدها بل لنحذر، وكان أكرم لأبرام وأريح له أن يقول الحق من البداية.',
      by: { k: 'mhc', file: 'genesis-12', basis: ['What he said was, in a sense, true (Ge 20:12), but with a purpose to deceive', 'The fear of man brings a snare, and many are driven to sin by the dread of death', 'which are recorded, not for our imitation, but for our admonition', "It would have been more for Abram's credit and comfort to have told the truth at first"] },
      also: { k: 'wlc', at: '145', p: 'والتعليم الكبير لوستمنستر يعدّ من الخطايا ضد الوصية التاسعة: تحريف الحق إلى معنى خاطئ، أو قوله بعبارات ملتبسة تحتمل وجهين، إضراراً بالحق أو العدل.', basis: ['perverting it to a wrong meaning, or in doubtful and equivocal expressions, to the prejudice of truth or justice'] },
      today: 'سيرة ذاتية تجمّل الخبرة، أو رسالة للمدير صحيحة حرفياً لكنها تخفي غلطتك، أو صورة على السوشيال تحكي نصف الحكاية. كلها صيغ حديثة لجملة أبرام لسارة.',
      ask: 'أين تستعمل كلاماً صحيحاً حرفياً لتترك عند الناس انطباعاً غير صحيح؟',
      step: 'صحّح هذا الأسبوع شيئاً واحداً قلته أو كتبته بنصف الحقيقة، حتى لو كلّفك ذلك قليلاً.'
    }
  ],
  christ: {
    t: 'البركة الأولى في بيتك', ref: 'Gen.12.3', cut: 'وتتبارك فيك جميع قبائل الارض', also: 'Gal.3.8',
    p: 'يرى ماثيو هنري أن هذا الوعد يتوّج كل الوعود لأنه يشير إلى المسيا. يسوع المسيح هو بركة العالم العظمى، وهو بركة للعائلات. وحين نعدّ بركات بيتنا، فلنضع المسيح في المقام الأول، بركة البركات.',
    by: { k: 'mhc', file: 'genesis-12', basis: ['This was the promise that crowned all the rest; for it points at the Messiah', 'Jesus Christ is the great blessing of the world', 'He is a family blessing', 'when we reckon up our family blessings, let us put Christ in the', 'as the blessing of blessings'] }
  }
};
