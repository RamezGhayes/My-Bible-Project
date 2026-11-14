// Shared helpers: config, books, scripture lookup, text formatting.
import fs from 'node:fs';
import path from 'node:path';

export const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
export const config = JSON.parse(fs.readFileSync(path.join(ROOT, 'site.config.json'), 'utf8'));
export const books = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/books.json'), 'utf8'));
export const bookById = Object.fromEntries(books.map((b) => [b.id, b]));
export const bookBySlug = Object.fromEntries(books.map((b) => [b.slug, b]));

const bibleCache = {};
export function bible(id) {
  if (!bibleCache[id]) bibleCache[id] = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/bible', id + '.json'), 'utf8'));
  return bibleCache[id];
}

// Arabic-Indic digits
export const ar = (x) => String(x ?? '').replace(/[0-9]/g, (d) => '٠١٢٣٤٥٦٧٨٩'[d]);

export const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Light inline formatting for authored text: **bold**, digits to Arabic-Indic.
export function md(s) {
  return ar(esc(s)).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
}

// Short display name of a book: "متى" instead of "إنجيل متى"
export const shortName = (b) => b.name.replace(/^إنجيل /, '');

// References use OSIS-like strings: "Matt.5.3-12", "Gal.2.16", "Matt.5", "Gen.12.3;22.18" is not supported (use arrays).
export function parseRef(ref) {
  const m = /^([1-3]?[A-Za-z]+)\.(\d+)(?:\.(\d+)(?:-(\d+))?)?$/.exec(ref);
  if (!m) throw new Error('Bad reference: ' + ref);
  const b = bookById[m[1]];
  if (!b) throw new Error('Unknown book in reference: ' + ref);
  const ch = +m[2];
  if (ch < 1 || ch > b.chapters) throw new Error('Chapter out of range: ' + ref);
  const vs = m[3] ? +m[3] : null;
  const ve = m[4] ? +m[4] : vs;
  if (vs && (vs < 1 || ve > b.verses[ch - 1] || ve < vs)) throw new Error('Verse out of range: ' + ref);
  return { book: b, ch, vs, ve };
}

export function refLabel(ref, { full = false } = {}) {
  const r = parseRef(ref);
  const name = full ? r.book.name : shortName(r.book);
  if (!r.vs) return ar(`${name} ${r.ch}`);
  return ar(`${name} ${r.ch}: ${r.vs}${r.ve !== r.vs ? '–' + r.ve : ''}`);
}

export function verses(ref) {
  const r = parseRef(ref);
  const chap = bible(r.book.id).chapters[r.ch - 1].verses;
  const from = r.vs ?? 1, to = r.ve ?? chap.length;
  return chap.filter((v) => v.number >= from && v.number <= to);
}

export function verseText(ref) {
  return verses(ref).map((v) => v.text).join(' ');
}

// Strip Arabic diacritics and normalise letter forms, for checking quotations against the text.
export function normalize(s) {
  return String(s)
    .replace(/[ً-ٰٟۖ-ۭ]/g, '')
    .replace(/[ٱأإآ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/ؤ/g, 'و')
    .replace(/ئ/g, 'ي')
    .replace(/ـ/g, '')
    .replace(/[^ء-ي\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Relative path prefix for a page at a given depth (0 = site root).
export const up = (depth) => (depth ? '../'.repeat(depth) : '');

export const bookHref = (b, depth) => `${up(depth)}book/${b.slug}.html`;
export const PREVIEW = process.env.PREVIEW === '1';
export const previewSkip = (b) => PREVIEW && b.testament === 'ot' && !fs.existsSync(path.join(ROOT, 'content/books', b.slug, 'intro.mjs'));
export const chapterHref = (b, ch, depth) => (previewSkip(b) ? `${up(depth)}book/${b.slug}.html` : `${up(depth)}book/${b.slug}/${ch}.html`);
export function refHref(ref, depth) {
  const r = parseRef(ref);
  return chapterHref(r.book, r.ch, depth) + (r.vs && !previewSkip(r.book) ? `#v${r.vs}` : '');
}
