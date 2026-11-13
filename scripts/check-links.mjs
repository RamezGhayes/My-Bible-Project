// Verifies that every internal link in the built site points to an existing file.
import fs from 'node:fs';
import path from 'node:path';
const DIST = path.resolve('dist');
const files = [];
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).forEach((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : files.push(path.join(d, e.name))));
walk(DIST);
let bad = 0, n = 0;
for (const f of files.filter((f) => f.endsWith('.html'))) {
  const html = fs.readFileSync(f, 'utf8');
  for (const m of html.matchAll(/(?:href|src)="([^"#][^"]*)"/g)) {
    const u = m[1];
    if (/^(https?:|mailto:|data:)/.test(u)) continue;
    n++;
    const target = path.resolve(path.dirname(f), u.split('#')[0]);
    if (!fs.existsSync(target)) { bad++; if (bad < 20) console.log('✗', path.relative(DIST, f), '→', u); }
  }
}
console.log(`checked ${n} links, ${bad} broken`);
