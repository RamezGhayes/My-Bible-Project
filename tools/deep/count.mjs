// usage: node count.mjs <lemma|form> [Book] [--form]  -> occurrences with refs
import fs from 'fs'; import path from 'path'; import { fileURLToPath } from 'url';
const GK = process.env.GK_DIR || path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../.gk');
const B={61:'Matt',62:'Mark',63:'Luke',64:'John',65:'Acts',66:'Rom',67:'1Cor',68:'2Cor',69:'Gal',70:'Eph',71:'Phil',72:'Col',73:'1Thess',74:'2Thess',75:'1Tim',76:'2Tim',77:'Titus',78:'Phlm',79:'Heb',80:'Jas',81:'1Pet',82:'2Pet',83:'1John',84:'2John',85:'3John',86:'Jude',87:'Rev'};
const norm=s=>s.normalize('NFD').replace(/\p{Mn}/gu,'').toLowerCase();
const [q,bk,flag]=process.argv.slice(2); const form=flag==='--form'||bk==='--form';
const book=bk&&bk!=='--form'?bk:null; const out={}; let n=0;
for(const f of fs.readdirSync(GK+'/sblgnt').filter(x=>x.endsWith('.txt'))){ const name=B[f.slice(0,2)]; if(book&&name!==book)continue;
 for(const l of fs.readFileSync(GK+'/sblgnt/'+f,'utf8').split('\n')){ if(!l)continue; const p=l.split(' '); const key=form?p[4]:p[6]; if(norm(key)!==norm(q))continue; n++; const r=name+' '+(+p[0].slice(2,4))+':'+(+p[0].slice(4,6)); (out[name]=out[name]||[]).push(r.split(' ')[1]); } }
console.log('total',n); for(const k in out) console.log(k,out[k].length,out[k].join(' '));
