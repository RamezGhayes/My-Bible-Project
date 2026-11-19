// usage: node tools/deep/bk.mjs <BookId> <ch> [ch...]   -> Van Dyck text (no tashkeel), one verse per line
// BookId = file name in data/bible (Matt, Mark, Luke, John, Acts, Rom, 1Cor, Isa, Ps, 1Sam ...)
import { bible } from '../../src/lib.mjs';
const [b, ...chs] = process.argv.slice(2);
const B = bible(b);
for (const n of chs.map(Number)) {
  console.log(`== ${n}`);
  B.chapters[n - 1].verses.forEach((v) => console.log(v.number + ' ' + v.text.replace(/[ً-ْٰ]/g, '').replace(/ٱ/g, 'ا')));
}
