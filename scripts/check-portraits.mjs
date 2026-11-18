// Fails if a person portrait (src/v2/assets/person-<id>.*) has no people page in dist/.
// People ids are hashes of 'ot:'/'nt:' + name, so adding an OT entry for a name that
// only appeared in the NT (or a new name colliding with an existing one) silently moves
// the person to a new id and orphans the portrait. Run after `node src/build.mjs`.
import fs from 'node:fs';
import path from 'node:path';
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const bad = [];
for (const f of fs.readdirSync(path.join(ROOT, 'src/v2/assets'))) {
  const m = f.match(/^person-(.+)\.(svg|webp|jpg)$/);
  if (!m) continue;
  if (!fs.existsSync(path.join(ROOT, 'dist/people', m[1] + '.html'))) bad.push(f);
}
if (bad.length) { console.error('orphaned portraits (no people page):\n  ' + bad.join('\n  ')); process.exit(1); }
console.log('portraits: all attached');
