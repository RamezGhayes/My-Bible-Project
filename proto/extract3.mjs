import fs from 'node:fs';
import { verseText, refLabel } from '../src/lib.mjs';
const d = JSON.parse(fs.readFileSync('proto/data2.json','utf8'));
const refs = ['Gen.12.3','Gal.3.8','Gal.3.16','John.8.56','Heb.11.8','Rom.4.3','Jas.2.23','Gen.15.6','Gal.3.29','Heb.11.11','1Pet.3.6','2Pet.2.7'];
d.v = Object.fromEntries(refs.map(r=>[r,{t:verseText(r),l:refLabel(r)}]));
fs.writeFileSync('proto/data3.json', JSON.stringify(d));
console.log(d.v['Gal.3.16'].t);
