// Merge depth additions into chapter files: node scripts/deepen.mjs <additions.mjs>
// additions default export: { 'book/ch': { background:[], words:[], links:[], voices:[], hard:[], christ:[], questions:[], apply:'...' (replace), ... } }
import fs from 'fs'; import path from 'path'; import { pathToFileURL } from 'url';
const q = s => "'" + String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n') + "'";
const key = k => /^[A-Za-z_$][\w$]*$/.test(k) ? k : q(k);
function ser(v, ind) {
  const pad = '  '.repeat(ind);
  if (Array.isArray(v)) {
    if (!v.length) return '[]';
    if (v.every(x => x && typeof x === 'object' && !Array.isArray(x) && JSON.stringify(x).length < 70 && !Object.values(x).some(y => typeof y === 'object')))
      return '[' + v.map(x => ser(x, ind)).join(', ') + ']';
    return '[\n' + v.map(x => pad + '  ' + ser(x, ind + 1)).join(',\n') + '\n' + pad + ']';
  }
  if (v && typeof v === 'object') {
    const ent = Object.entries(v);
    return '{ ' + ent.map(([k, x]) => key(k) + ': ' + ser(x, ind)).join(', ') + ' }';
  }
  if (typeof v === 'string') return q(v);
  return JSON.stringify(v);
}
export function write(file, obj) {
  const body = Object.entries(obj).map(([k, v]) => '  ' + key(k) + ': ' + ser(v, 1)).join(',\n');
  fs.writeFileSync(file, 'export default {\n' + body + '\n};\n');
}
const add = (await import(pathToFileURL(path.resolve(process.argv[2])) + '?' + Date.now())).default;
for (const [k, a] of Object.entries(add)) {
  const [b, ch] = k.split('/');
  const file = `content/books/${b}/chapters/${ch}.mjs`;
  const cur = (await import(pathToFileURL(path.resolve(file)) + '?' + Date.now())).default;
  for (const [f, v] of Object.entries(a)) {
    if (f.startsWith('=')) { cur[f.slice(1)] = v; continue; }
    if (Array.isArray(v)) cur[f] = [...(cur[f] || []), ...v]; else cur[f] = v;
  }
  write(file, cur);
  const back = (await import(pathToFileURL(path.resolve(file)) + '?r' + Date.now())).default;
  if (JSON.stringify(back) !== JSON.stringify(cur)) throw new Error('roundtrip ' + file);
  console.log('ok', k);
}
