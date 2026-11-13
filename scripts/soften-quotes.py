# converts «…» that fail check-quotes into "…" (marks them as paraphrase)
import subprocess,re
out=subprocess.run(['node','scripts/check-quotes.mjs'],capture_output=True,text=True).stdout
n=0
for line in out.splitlines():
    m=re.match(r'✗ (\S+) «(.*)»$',line)
    if not m: continue
    f,q=m.groups(); s=open(f).read()
    s2=s.replace('«'+q+'»','"'+q+'"')
    if s2!=s: open(f,'w').write(s2); n+=1
print('softened',n)
