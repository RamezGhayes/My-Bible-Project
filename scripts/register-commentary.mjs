// Safely add entries to data/sources/commentary.json (file lock, read-modify-write), so parallel workers don't clash.
// Usage:
//   node scripts/register-commentary.mjs guzik luke-4 '{"url":"...","lang":"ar","secs":{"A1":"..."}}'
//   node scripts/register-commentary.mjs mac 42-150 '{"t":"Title","date":"2003-01-05","book":"Luke","ch":12,"v":[1,7],"url":"..."}'
//   node scripts/register-commentary.mjs ryle mark-1-1 '{"t":"Mark 1:1-8","book":"Mark","ch":1,"v":[1,8],"url":"..."}'   (also hodge, owen, piper, sproul; optional "kind" label, "date")
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FILE = path.join(ROOT, 'data/sources/commentary.json');
const LOCK = FILE + '.lock';
const [kind, key, json] = process.argv.slice(2);
const SERK = ['mac', 'ryle', 'hodge', 'owen', 'piper', 'sproul'];
const META = {
  ryle: { who: 'J. C. Ryle', work: 'Expository Thoughts on the Gospels (1856-1873), public domain' },
  hodge: { who: 'Charles Hodge', work: 'Commentaries on Romans, 1-2 Corinthians, Ephesians, public domain' },
  owen: { who: 'John Owen', work: 'An Exposition of the Epistle to the Hebrews (1668-1684), public domain' },
  piper: { who: 'John Piper', work: 'Sermons and articles, desiringGod.org' },
  sproul: { who: 'R. C. Sproul', work: 'Sermons, articles and commentaries, Ligonier Ministries' }
};
if (!(kind === 'guzik' || SERK.includes(kind)) || !key || !json) { console.error('usage: guzik <slug-n> <json> | <mac|ryle|hodge|owen|piper|sproul> <id> <json>'); process.exit(2); }
const val = JSON.parse(json);
if (kind !== 'guzik') for (const k of ['t', 'book', 'ch', 'v', 'url']) if (val[k] === undefined) { console.error('mac entry needs ' + k); process.exit(2); }
if (kind === 'guzik') for (const k of ['url', 'lang', 'secs']) if (val[k] === undefined) { console.error('guzik entry needs ' + k); process.exit(2); }
const sleep = (ms) => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
let fd, tries = 0;
for (;;) { try { fd = fs.openSync(LOCK, 'wx'); break; } catch { if (++tries > 200) { console.error('lock busy: ' + LOCK); process.exit(1); } sleep(100); } }
try {
  const d = JSON.parse(fs.readFileSync(FILE, 'utf8'));
  if (META[kind] && !d[kind]) d[kind] = { ...META[kind], items: {} };
  const box = kind === 'guzik' ? d.guzik.chapters : kind === 'mac' ? d.mac.sermons : d[kind].items;
  const had = key in box;
  box[key] = val;
  fs.writeFileSync(FILE + '.tmp', JSON.stringify(d, null, 1));
  fs.renameSync(FILE + '.tmp', FILE);
  console.log(`${had ? 'updated' : 'added'} ${kind} ${key}`);
} finally { fs.closeSync(fd); fs.unlinkSync(LOCK); }
