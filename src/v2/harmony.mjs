// Gospel harmony: the feeding of the five thousand, the four accounts side by side.
// All verse text comes from the Van Dyck data at build time. Each "only here" detail is a phrase
// the build checks against its verse, so the page cannot drift from the text.
import { esc, ar, refLabel, refHref, verseText, chapterHref, bookById } from '../lib.mjs';
import { header } from './ui.mjs';

const G = [
  { id: 'Matt', n: 'متى', range: 'Matt.14.13-21', c: '#8C2F1E' },
  { id: 'Mark', n: 'مرقس', range: 'Mark.6.30-44', c: '#1F2A44' },
  { id: 'Luke', n: 'لوقا', range: 'Luke.9.10-17', c: '#3E7A5A' },
  { id: 'John', n: 'يوحنا', range: 'John.6.1-15', c: '#7A6232' }
];
const ROWS = [
  { t: 'ماذا كان عندهم؟', refs: ['Matt.14.17', 'Mark.6.38', 'Luke.9.13', 'John.6.9'] },
  { t: 'البركة والتوزيع', refs: ['Matt.14.19', 'Mark.6.41', 'Luke.9.16', 'John.6.11'] },
  { t: 'كم كان عدد الآكلين؟', refs: ['Matt.14.21', 'Mark.6.44', 'Luke.9.14', 'John.6.10'] },
  { t: 'ما فضل', refs: ['Matt.14.20', 'Mark.6.43', 'Luke.9.17', 'John.6.13'] }
];
// Details found in one account of this event only. [phrase as it appears in the verse, ref, plain note]
const ONLY = {
  Matt: [['ما عدا النساء والاولاد', 'Matt.14.21', 'يذكر أن العدد خمسة آلاف رجل غير النساء والأولاد.']],
  Mark: [['كخراف لا راعي لها', 'Mark.6.34', 'يذكر سبب تحنن يسوع: كانوا كخراف لا راعي لها.'], ['اذهبوا وانظروا', 'Mark.6.38', 'يسأل يسوع: كم رغيفاً عندكم؟ ويرسلهم ليروا.'], ['العشب الاخضر', 'Mark.6.39', 'يذكر أن العشب كان أخضر، وأن الناس اتكأوا صفوفاً: مئة مئة وخمسين خمسين.']],
  Luke: [['بيت صيدا', 'Luke.9.10', 'يسمّي المكان: موضع خلاء لمدينة تسمى بيت صيدا.'], ['ملكوت الله', 'Luke.9.11', 'يذكر موضوع كلام يسوع للجموع: ملكوت الله.']],
  John: [['الفصح', 'John.6.4', 'يذكر أن الفصح كان قريباً.'], ['لفيلبس', 'John.6.5', 'يسأل يسوع فيلبس: من أين نبتاع خبزاً؟'], ['غلام', 'John.6.9', 'أندراوس يذكر غلاماً معه خمسة أرغفة شعير وسمكتان.'], ['لكي لا يضيع شيء', 'John.6.12', 'يسوع يأمر بجمع الكسر لكي لا يضيع شيء.'], ['ليجعلوه ملكا', 'John.6.15', 'الناس أرادوا أن يجعلوه ملكاً، فانصرف إلى الجبل وحده.']]
};
const COMMON = [['خمسة أرغفة وسمكتان', 'ROW0'], ['نحو خمسة آلاف رجل', 'ROW2'], ['اثنتا عشرة قفة من الكسر', 'ROW3']];

const norm = (s) => s.replace(/[ً-ْٰـ]/g, '').replace(/[ٱأإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي');

export function harmonyPage(depth = 0) {
  for (const [id, list] of Object.entries(ONLY)) for (const [ph, ref] of list) if (!norm(verseText(ref)).includes(norm(ph))) throw new Error(`Harmony: "${ph}" not in ${ref} (${id})`);
  const col = (g) => `--gc:${g.c}`;
  const head = G.map((g) => `<a class="hm-g" style="${col(g)}" href="${refHref(g.range, depth)}"><b>${g.n}</b><small>${refLabel(g.range)}</small></a>`).join('');
  const rows = ROWS.map((r) => `<section class="hm-row"><h2>${r.t}</h2><div class="hm-c">${r.refs.map((ref, i) => `<div class="hm-v" style="${col(G[i])}"><small><b>${G[i].n}</b> · <a href="${refHref(ref, depth)}">${refLabel(ref)}</a></small><p>${esc(verseText(ref))}</p></div>`).join('')}</div></section>`).join('');
  const only = G.map((g) => `<div class="hm-o" style="${col(g)}"><b>${g.n} وحده</b><ul>${ONLY[g.id].map(([, ref, d]) => `<li>${esc(d)} <a class="r" href="${refHref(ref, depth)}">${refLabel(ref)}</a></li>`).join('')}</ul></div>`).join('');
  return `${header({ back: 'index.html', title: 'الأناجيل جنباً إلى جنب' })}
<div class="hm">
<section class="hm-hero"><span class="ey">الأناجيل جنباً إلى جنب</span><h1>إشباع الخمسة الآلاف</h1><p>حادثة واحدة يرويها الإنجيليون الأربعة جميعاً. اقرأ الروايات متجاورة: ما تتفق عليه، وما يضيفه كل واحد منها.</p>
<div class="hm-common">${COMMON.map(([t]) => `<span>${t}</span>`).join('')}<em>في الروايات الأربع</em></div></section>
<div class="hm-head">${head}</div>
${rows}
<section class="hm-row"><h2>تفاصيل ينفرد بها كل إنجيل في هذه الحادثة</h2><div class="hm-c">${only}</div>
<p class="note">كل إنجيلي كتب بإرشاد الروح القدس لقرّاء معيّنين، فاختار من التفاصيل ما يخدم غرضه. اختلاف التفاصيل تكامل لا تناقض، والصورة الكاملة تأتي من الروايات معاً.</p></section>
<nav class="hm-next">${G.map((g) => { const [b, c] = g.range.split('.'); return `<a style="${col(g)}" href="${chapterHref(bookById[b], +c, depth)}"><small>ادرس الأصحاح</small><b>${esc(bookById[b].name)} ${ar(c)}</b></a>`; }).join('')}</nav>
</div>`;
}
