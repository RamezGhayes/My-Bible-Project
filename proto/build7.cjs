const fs=require('fs');const t=fs.readFileSync('t7.html','utf8');const d=fs.readFileSync('data6.json','utf8').replace(/<\//g,'<\\/');const m=fs.readFileSync('mapfn.js','utf8');
fs.writeFileSync('journey2.html',t.replace('__DATA__',()=>d).replace('__MAP__',()=>m));
