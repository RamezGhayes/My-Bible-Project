import fs from 'fs'; import path from 'path'; import { fileURLToPath } from 'url';
const GK = process.env.GK_DIR || path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../.gk');
const B={Matt:61,Mark:62,Luke:63,John:64,Acts:65,Rom:66,'1Cor':67,'2Cor':68,Gal:69,Eph:70,Phil:71,Col:72,'1Thess':73,'2Thess':74,'1Tim':75,'2Tim':76,Titus:77,Phlm:78,Heb:79,Jas:80,'1Pet':81,'2Pet':82,'1John':83,'2John':84,'3John':85,Jude:86,Rev:87};
const [bk,ch]=process.argv.slice(2);
const f=fs.readdirSync(GK+'/sblgnt').find(x=>x.startsWith(B[bk]+'-'));
const out={};
for(const l of fs.readFileSync(GK+'/sblgnt/'+f,'utf8').split('\n')){ if(!l)continue; const p=l.split(' '); if(+p[0].slice(2,4)!=+ch)continue; const v=+p[0].slice(4,6); (out[v]=out[v]||[]).push(p[3]); }
for(const v in out) console.log(v, out[v].join(' '));
