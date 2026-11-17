// اختصارات للأصوات في ملفات التطبيقات. basis: عبارات إنجليزية حرفية من المصدر المحفوظ في data/sources.
export const H = (...basis) => ({ k: 'mhc', basis });        // ماثيو هنري (وتكملته من رومية إلى الرؤيا)
export const C = (...basis) => ({ k: 'calvin', basis });     // جون كالفن
export const also = (v, p) => ({ ...v, p });                  // صوت ثانٍ مع جملته العربية
