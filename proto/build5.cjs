const fs=require('fs');const t=fs.readFileSync('t5.html','utf8');const d=fs.readFileSync('data3.json','utf8').replace(/<\//g,'<\\/');const m=fs.readFileSync('mapfn.js','utf8');
fs.writeFileSync('formal.html',t.replace('__DATA__',()=>d).replace('__MAP__',()=>m));
