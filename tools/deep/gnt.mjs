// usage: node gnt.mjs John 3 [from] [to]  -> Greek text + word study per verse (SBLGNT/MorphGNT + Dodson)
import fs from 'fs'; import path from 'path'; import { fileURLToPath } from 'url';
const GK = process.env.GK_DIR || path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../.gk');
const B={Matt:61,Mark:62,Luke:63,John:64,Acts:65,Rom:66,'1Cor':67,'2Cor':68,Gal:69,Eph:70,Phil:71,Col:72,'1Thess':73,'2Thess':74,'1Tim':75,'2Tim':76,Titus:77,Phlm:78,Heb:79,Jas:80,'1Pet':81,'2Pet':82,'1John':83,'2John':84,'3John':85,Jude:86,Rev:87};
const [bk,ch,a=1,z=999]=process.argv.slice(2);
const f=fs.readdirSync(GK+'/sblgnt').find(x=>x.startsWith(B[bk]+'-'));
const lex=JSON.parse(fs.readFileSync(GK+'/lex.json','utf8'));
const norm=s=>s.normalize('NFD').replace(/\p{Mn}/gu,'').toLowerCase();
const P={P:'1',A:'',I:''};
const dec=(pos,p)=>{const [pe,t,v,m,ca,n,g,d]=p.split('');const T={P:'pres',I:'impf',F:'fut',A:'aor',X:'perf',Y:'plpf'}[t]||'';const V={A:'act',M:'mid',P:'pass'}[v]||'';const M={I:'ind',D:'impv',S:'subj',O:'opt',N:'inf',P:'ptc'}[m]||'';const C={N:'nom',G:'gen',D:'dat',A:'acc',V:'voc'}[ca]||'';return [pe!=='-'?pe:'',T,V,M,C,n!=='-'?n:'',g!=='-'?g:''].filter(Boolean).join('.');};
let cur='';
for(const l of fs.readFileSync(GK+'/sblgnt/'+f,'utf8').split('\n')){ if(!l)continue; const [bcv,pos,par,text,word,nrm,lem]=l.split(' '); const c=+bcv.slice(2,4), v=+bcv.slice(4,6); if(c!=+ch||v<+a||v>+z)continue;
 if(bcv!==cur){ cur=bcv; console.log('\n== '+c+':'+v); }
 const L=(lex[norm(lem)]||[])[0]; console.log(`  ${word.padEnd(16)} ${lem.padEnd(14)} ${pos} ${dec(pos,par).padEnd(22)} ${L?L.g:''}`); }
