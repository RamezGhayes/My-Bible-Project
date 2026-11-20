// Builds .gk/heb/<Book>.json from the OSHB (morphhb, Westminster Leningrad Codex) and the
// Open Scriptures Strong's Hebrew lexicon. Keys are "chapter:verse" in KJV numbering (which Van Dyck follows),
// using morphhb's VerseMap.xml. Each word: { w: pointed form without accents, s: Strong's number, l: lemma, m: morph }.
// Run once after setup.sh (which clones both repos into .gk).
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..');
const GK = path.join(ROOT, '.gk');
const WLC = path.join(GK, 'morphhb/wlc');
const lex = {};
for (const m of fs.readFileSync(path.join(GK, 'HebrewLexicon/HebrewStrong.xml'), 'utf8').matchAll(/<entry id="H(\d+)">\s*<w[^>]*>([^<]+)<\/w>/g)) lex[+m[1]] = m[2];

const map = {};
for (const m of fs.readFileSync(path.join(WLC, 'VerseMap.xml'), 'utf8').matchAll(/<verse wlc="([^"]+)" kjv="([^"]+)"/g)) if (!map[m[1]]) map[m[1]] = m[2];

// keep consonants and vowel points; drop cantillation, meteg, paseq, sof pasuq, morpheme slashes
const clean = (s) => s.replace(/\//g, '').replace(/[֑-ֽ֯׀׃-׆]/g, '').normalize('NFC');
fs.mkdirSync(path.join(GK, 'heb'), { recursive: true });
for (const f of fs.readdirSync(WLC).filter((x) => x.endsWith('.xml') && x !== 'VerseMap.xml')) {
  const id = f.replace('.xml', '');
  const out = {};
  const xml = fs.readFileSync(path.join(WLC, f), 'utf8');
  for (const v of xml.matchAll(/<verse osisID="([^"]+)">([\s\S]*?)<\/verse>/g)) {
    const kjv = map[v[1]] || v[1];
    const [, c, n] = kjv.split('.');
    const key = +c + ':' + +n;
    const words = (out[key] = out[key] || []);
    // ketiv forms are skipped when a qere follows; the qere (inside <note><rdg>) is what is read
    for (const w of v[2].matchAll(/<w ([^>]*)>([^<]+)<\/w>/g)) {
      if (/type="x-ketiv"/.test(w[1])) continue;
      const lemma = (w[1].match(/lemma="([^"]+)"/) || [])[1] || '';
      const nums = lemma.split('/').map((x) => parseInt(x)).filter((x) => !isNaN(x));
      const s = nums.length ? nums[nums.length - 1] : null;
      words.push({ w: clean(w[2]), s, l: s ? lex[s] || '' : '', m: (w[1].match(/morph="([^"]+)"/) || [])[1] || '' });
    }
  }
  fs.writeFileSync(path.join(GK, 'heb', id + '.json'), JSON.stringify(out));
}
console.log('Hebrew index built in', path.join(GK, 'heb'), Object.keys(lex).length, 'lexicon entries');
