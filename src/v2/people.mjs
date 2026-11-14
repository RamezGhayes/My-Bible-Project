// Aggregates the people named in chapter studies into person cards.
import { ar, esc, md, shortName, refLabel, bookById } from '../lib.mjs';
import { PROFILES } from '../../content/people/profiles.mjs';

const ALIAS = {
  'أبرام': 'إبراهيم', 'ساراي': 'سارة', 'سمعان بطرس': 'بطرس', 'صفا': 'بطرس', 'يعقوب / إسرائيل': 'يعقوب',
  'بيلاطس البنطي': 'بيلاطس', 'يوحنا مرقس': 'مرقس', 'سلوانس': 'سيلا', 'فرسكا': 'بريسكلا', 'أم يسوع': 'مريم أم يسوع',
  'فيلبس المبشر': 'فيلبس المبشر', 'بلعام بن بصور': 'بلعام', 'حنانيا رئيس الكهنة': 'حنانيا رئيس الكهنة'
};
const NT_ALIAS = { 'شاول': 'بولس', 'شاول الطرسوسي': 'بولس', 'بولس الأسير': 'بولس', 'سمعان بطرس بن يونا': 'بطرس', 'متى العشّار': 'متى', 'لاوي بن حلفى': 'متى', 'يوحنا الباكي': 'يوحنا الرسول', 'يوحنا بن زبدي': 'يوحنا الرسول' };
const RAW_ALIAS = { 'سمعان (بطرس)': 'بطرس', 'صفا (بطرس)': 'بطرس', 'يهوذا (ليس الإسخريوطي)': 'يهوذا بن يعقوب', 'حنانيا (الدمشقي)': 'حنانيا الدمشقي', 'أبرام العبراني': 'إبراهيم' };
const BOOK_ALIAS = {
  Matt: { 'يوسف': 'يوسف خطيب مريم', 'مريم': 'مريم أم يسوع' },
  Mark: { 'يوحنا': 'يوحنا الرسول' },
  Luke: { 'مريم': 'مريم أم يسوع', 'يوحنا': 'يوحنا المعمدان', 'سمعان': 'سمعان الشيخ', 'لاوي': 'متى' },
  John: { 'يهوذا': 'يهوذا الإسخريوطي', 'فيلبس': 'فيلبس الرسول', 'مريم': 'مريم أخت لعازر' },
  Acts: { 'يهوذا': 'يهوذا الإسخريوطي', 'فيلبس': 'فيلبس الرسول', 'حنانيا': 'حنانيا الدمشقي' },
  '1Cor': { 'يعقوب': 'يعقوب أخو الرب' }, Jas: { 'يعقوب': 'يعقوب أخو الرب' }, Jude: { 'يهوذا': 'يهوذا أخو يعقوب' }, Rev: { 'يوحنا': 'يوحنا الرسول' }
};
// Names shared by different people in the New Testament: keep them apart per book.
const AMBIG = new Set(['يعقوب', 'مريم', 'يهوذا', 'يوحنا', 'سمعان', 'يوسف', 'حنانيا', 'هيرودس', 'فيلبس', 'إسكندر', 'غايس']);
const NOT_PERSON = /^(إسرائيل$|بناة|رجال|بنتا|تلاميذ|نازفة|أبو |جباة|رب |إخوتي|حماة|أعمى|والد|أرملة|جمهور|عبد |خادم|قوم |واحد|نسل|جيل|سحابة|شبه|في |راكب|كل |باقي|سبعة|عشرة|صغار|أهل|إنسان|رئيس|رؤساء|امرأة|ابن |ابنة|بنات|أبناء|بنو|إخوة|أخ |أم |كنائس|آباؤنا|غير|أناس|أولاد|ملكة|كاهن|كاتب|قائد|قادة|وجوه|رفقاء|شيوخ|عبيد|نساء|رجل|أختك|كلمة|راعي|إله|فائقو|أكثر|حجاج|خالق|فرعون$|ملك |ملوك|شعب|سجان|جارية|حارس|جند)/;
const DIVINE = /(بعلزبول|لجئون|جبرائيل|^قيصر$|يسوع|المسيح|الله|الرب|الروح|إبليس|الشيطان|بليعال|ملاك|ملائكة|الآب|التنين|الوحش)/;

const hash = (s) => { let h = 5381; for (const c of s) h = ((h * 33) ^ c.codePointAt(0)) >>> 0; return h.toString(36); };

export function cleanName(raw, testament, bookId) {
  if (RAW_ALIAS[raw.trim()]) return RAW_ALIAS[raw.trim()];
  let n = raw.replace(/\s*\([^)]*\)/g, '').replace(/\s*«[^»]*»/g, '').replace(/\s+/g, ' ').trim();
  n = (BOOK_ALIAS[bookId] && BOOK_ALIAS[bookId][n]) || ALIAS[n] || (testament === 'nt' && NT_ALIAS[n]) || n;
  if (!n || /[«»"،\/:]/.test(n) || n.startsWith('ال') || / و\S/.test(n) || NOT_PERSON.test(n) || DIVINE.test(n)) return null;
  return n;
}

export function buildPeople(books, content) {
  const map = new Map();
  const keyOf = (b, raw) => {
    const name = cleanName(raw, b.testament, b.id);
    if (!name) return null;
    if (b.testament === 'nt' && AMBIG.has(name)) return 'nt:' + name + ':' + b.id;
    if (b.testament === 'nt' && map.has('ot:' + name)) return 'ot:' + name;
    return b.testament + ':' + name;
  };
  for (const b of books) {
    const c = content[b.id];
    if (!c) continue;
    for (const n of Object.keys(c.chapters).map(Number).sort((x, y) => x - y)) {
      for (const p of c.chapters[n].people || []) {
        const key = keyOf(b, p.n);
        if (!key) continue;
        const name = cleanName(p.n, b.testament, b.id);
        if (!map.has(key)) {
          const prof = Object.values(PROFILES).find((x) => x.key === key);
          map.set(key, { key, name, testament: b.testament, id: prof ? prof.id : 'p' + hash(key), prof, apps: [], book: AMBIG.has(name) && b.testament === 'nt' ? b : null });
        }
        map.get(key).apps.push({ b, n, d: p.d, raw: p.n });
      }
    }
  }
  const list = [...map.values()];
  for (const p of list) {
    p.mono = [...p.name][0];
    p.label = p.book ? `${p.name} (${p.book.name})` : p.name;
    p.chapters = new Set(p.apps.map((a) => a.b.id + ':' + a.n)).size;
  }
  const byChapterName = (b, raw) => { const k = keyOf(b, raw); return k ? map.get(k) : null; };
  return { list, byChapterName };
}

const chLabel = (a) => ar(`${shortName(a.b)} ${a.n}`);
const firstSentence = (s, max = 150) => { const t = String(s).split(/(?<=[.؟!])\s/)[0]; return t.length > max ? t.slice(0, max).replace(/\s\S*$/, '') + '…' : t; };

// Card faces: [front, who, story]. Each face is the inner HTML of .pin
export function cardFaces(p, { hrefChapter, hrefPerson }) {
  const P = p.prof;
  const first = p.apps[0];
  const total = P ? 3 : 2;
  const foot = (i) => `<div class="pf"><span>${P && P.img ? esc(P.imgCredit || '') : 'الصورة قريباً'}</span><span>${ar(i)} / ${ar(total)}</span></div>`;
  const portrait = `<div class="portrait">${P && P.img ? `<img src="${P.img}" alt="">` : `<span class="mono">${esc(p.mono)}</span>`}${P && P.era ? `<span class="era">${md(P.era)}</span>` : `<span class="era">${p.testament === 'ot' ? 'العهد القديم' : 'العهد الجديد'}</span>`}</div>`;
  const cells = P ? P.cells : [['أول ظهور', chLabel(first)], ['يظهر في', p.chapters === 1 ? 'أصحاح واحد' : p.chapters === 2 ? 'أصحاحين' : ar(p.chapters) + (p.chapters <= 10 ? ' أصحاحات' : ' أصحاحاً')], ['العهد', p.testament === 'ot' ? 'القديم' : 'الجديد']];
  const front = `<div class="ph"><b>${esc(P ? P.full : p.label)}</b>${P && P.he ? `<small>${esc(P.he)}</small>` : ''}</div>${portrait}
<div class="role"><div class="r">${md(P ? P.role : chLabel(first))}</div><p>${md(P ? P.line : firstSentence(first.d))}</p></div>
<div class="cells">${cells.map(([k, v]) => `<div><small>${md(k)}</small><b>${md(v)}</b></div>`).join('')}</div>${foot(1)}`;
  if (!P) {
    const apps = p.apps.slice(0, 6);
    const who = `<div class="ph"><b>${esc(p.label)}</b><small>أين يظهر</small></div><div class="face"><h4>في الأصحاحات المدروسة</h4><div class="tl2">${apps.map((a) => `<div><span>${chLabel(a)}</span><p>${md(firstSentence(a.d, 110))}</p></div>`).join('')}</div>${p.apps.length > 6 ? `<p class="note">و${ar(p.apps.length - 6)} مواضع أخرى في الملف الكامل.</p>` : ''}</div>${foot(2)}`;
    return [front, who];
  }
  const who = `<div class="ph"><b>${esc(P.full)}</b><small>من هو</small></div><div class="face"><h4>بطاقة تعريف</h4>${P.facts.map(([k, v]) => `<div class="kv"><span>${md(k)}</span><div>${md(v)}</div></div>`).join('')}<h4>في شخصيته</h4><div class="duo"><div><small>قوة</small>${md(P.strong)}</div><div><small>ضعف</small>${md(P.weak)}</div></div></div>${foot(2)}`;
  const story = `<div class="ph"><b>${esc(P.full)}</b><small>قصته والمسيح</small></div><div class="face"><h4>محطات حياته</h4><div class="tl2">${P.life.map(([k, v]) => `<div><span>${md(k)}</span><p>${md(v)}</p></div>`).join('')}</div>${P.nt?.length ? `<h4>${P.ntLabel || 'في العهد الجديد'}</h4><div class="nts">${P.nt.map((r) => `<span>${refLabel(r)}</span>`).join('')}</div>` : ''}<div class="cx"><small>${P.cxLabel || 'كيف يشير إلى المسيح'}</small>${md(P.christ)}</div></div>${foot(3)}`;
  return [front, who, story];
}

export const cardTemplate = (p, opts) => `<template id="pc-${p.id}" data-name="${esc(p.prof ? p.prof.n : p.label)}">${cardFaces(p, opts).map((f) => `<div class="f">${f}</div>`).join('')}</template>`;
