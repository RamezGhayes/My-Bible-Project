// Safely add entries to data/sources/commentary.json (file lock, read-modify-write), so parallel workers don't clash.
// Usage:
//   node scripts/register-commentary.mjs guzik luke-4 '{"url":"...","lang":"ar","secs":{"A1":"..."}}'
//   node scripts/register-commentary.mjs mac 42-150 '{"t":"Title","date":"2003-01-05","book":"Luke","ch":12,"v":[1,7],"url":"..."}'
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FILE = path.join(ROOT, 'data/sources/commentary.json');
const LOCK = FILE + '.lock';
const [kind, key, json] = process.argv.slice(2);
if (!['guzik', 'mac'].includes(kind) || !key || !json) { console.error('usage: guzik <slug-n> <json> | mac <code> <json>'); process.exit(2); }
const val = JSON.parse(json);
if (kind === 'mac') for (const k of ['t', 'book', 'ch', 'v', 'url']) if (val[k] === undefined) { console.error('mac entry needs ' + k); process.exit(2); }
if (kind === 'guzik') for (const k of ['url', 'lang', 'secs']) if (val[k] === undefined) { console.error('guzik entry needs ' + k); process.exit(2); }
const sleep = (ms) => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
let fd, tries = 0;
for (;;) { try { fd = fs.openSync(LOCK, 'wx'); break; } catch { if (++tries > 200) { console.error('lock busy: ' + LOCK); process.exit(1); } sleep(100); } }
try {
  const d = JSON.parse(fs.readFileSync(FILE, 'utf8'));
  const box = kind === 'guzik' ? d.guzik.chapters : d.mac.sermons;
  const had = key in box;
  box[key] = val;
  fs.writeFileSync(FILE + '.tmp', JSON.stringify(d, null, 1));
  fs.renameSync(FILE + '.tmp', FILE);
  console.log(`${had ? 'updated' : 'added'} ${kind} ${key}`);
} finally { fs.closeSync(fd); fs.unlinkSync(LOCK); }
