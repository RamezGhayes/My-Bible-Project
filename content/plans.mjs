// Reading plans. Each day is one studied chapter; the day page is built only from that chapter's reviewed study
// (content/books/<book>/chapters/<n>.mjs) and its practical application (content/apply), so nothing in a plan is new
// unchecked teaching. The build stops if a day points to a chapter without a full study.
// days: 'Book.Chapter'. For a whole book use range('Mark', 16).
const range = (b, n, from = 1) => Array.from({ length: n - from + 1 }, (_, i) => `${b}.${from + i}`);

export default [
  {
    id: 'start', t: 'ابدأ من هنا', sub: '٧ أيام في القصة الكبيرة',
    d: 'إن كنت لا تعرف من أين تبدأ: سبعة أصحاحات تمشي معك في قصة الكتاب كلها. الخلق، ثم السقوط، ثم وعد الله لإبراهيم، ثم الفداء بدم خروف الفصح، ثم المسيح الذي جاء ليخلّص، وصليبه، وقيامته.',
    level: 'للبداية',
    days: ['Gen.1', 'Gen.3', 'Gen.15', 'Exod.12', 'John.3', 'Mark.15', 'Mark.16']
  },
  {
    id: 'philippians', t: 'فرح في المسيح', sub: 'رسالة فيلبي في ٤ أيام',
    d: 'رسالة قصيرة كتبها بولس من السجن، ومع ذلك تتكرر فيها كلمة الفرح. أربعة أيام لتبني بها عادة القراءة اليومية.',
    level: 'قصيرة',
    days: range('Phil', 4)
  },
  {
    id: 'mark', t: 'إنجيل مرقس', sub: '١٦ يوماً مع يسوع',
    d: 'أقصر الأناجيل وأسرعها إيقاعاً. من يكون يسوع؟ ولماذا جاء؟ أصحاح كل يوم، من معمودية يسوع إلى القبر الفارغ.',
    level: 'للبداية',
    days: range('Mark', 16)
  },
  {
    id: 'john', t: 'إنجيل يوحنا', sub: '٢١ يوماً لتؤمن',
    d: 'كتبه يوحنا «لتؤمنوا أن يسوع هو المسيح ابن الله» (يو 20: 31). آيات يسوع وأقواله «أنا هو»، وحديثه الأخير مع تلاميذه، والصليب والقيامة.',
    level: 'متوسطة',
    days: range('John', 21)
  },
  {
    id: 'acts', t: 'أعمال الرسل', sub: '٢٨ يوماً مع الكنيسة الأولى',
    d: 'كيف انتشر الإنجيل من أورشليم إلى روما. وفي أيام رحلات بولس تجد رابطاً إلى المحطة نفسها على خريطة الرحلات.',
    level: 'متوسطة',
    days: range('Acts', 28)
  },
  {
    id: 'romans', t: 'رسالة رومية', sub: '١٦ يوماً في الإنجيل',
    d: 'أوضح عرض في الكتاب لرسالة الإنجيل: الخطية، والتبرير بالإيمان، والحياة الجديدة في الروح، وخطة الله، والحياة المسيحية العملية.',
    level: 'أعمق',
    days: range('Rom', 16)
  },
  {
    id: 'genesis', t: 'سفر التكوين', sub: '٥٠ يوماً في البدايات',
    d: 'بداية كل شيء: الخلق والسقوط والطوفان، ثم إبراهيم وإسحاق ويعقوب ويوسف. ووعد الله الذي يسير في القصة كلها.',
    level: 'طويلة',
    days: range('Gen', 50)
  }
];
