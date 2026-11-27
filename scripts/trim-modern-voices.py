# Trim copyrighted-author voice entries (guzik, mac, sproul, piper) to 3 sentences, keeping a trailing (...) editorial note.
# usage: python3 scripts/trim-modern-voices.py dry|write [skip,books,...]
import re,glob,sys,os
KEYS=('guzik','mac','sproul','piper')
SKIP=set(sys.argv[2].split(',')) if len(sys.argv)>2 else set()
MAX=3
write=sys.argv[1]=='write'
def split(t):
    out=[];cur='';q=0;g=0
    i=0
    while i<len(t):
        c=t[i];cur+=c
        if c=='"': q^=1
        elif c=='«': g+=1
        elif c=='»': g=max(0,g-1)
        elif c in '.؟!' and not q and not g and (i+1==len(t) or t[i+1]==' '):
            out.append(cur.strip());cur=''
        i+=1
    if cur.strip(): out.append(cur.strip())
    return out
NOTES=[0]
def tailnote(t):
    u=t.rstrip()
    end=len(u)
    if u.endswith(').'): end-=1
    if not u[:end].endswith(')'): return t,''
    d=0
    for j in range(end-1,-1,-1):
        if u[j]==')': d+=1
        elif u[j]=='(':
            d-=1
            if d==0: break
    inner=u[j+1:end-1]
    if len(inner.split())<8 or j==0 or u[j-1]!=' ': return t,''
    return u[:j].rstrip(),u[j:]
pat=re.compile(r"(\{ r: '[^']*', k: '(%s)'[^\n]*?p: ')(.*?)(' \},?)$"%'|'.join(KEYS))
tot=0;files=0
for f in sorted(glob.glob('content/books/*/voices/*.mjs')):
    book=f.split('/')[2]
    if book in SKIP: continue
    L=open(f,encoding='utf8').read().split('\n');ch=0
    for i,l in enumerate(L):
        m=pat.search(l)
        if not m: continue
        body,note=tailnote(m.group(3))
        s=split(body)
        if len(s)<=MAX: continue
        keep=' '.join(s[:MAX])+((' '+note) if note else '')
        NOTES[0]+=bool(note)
        if keep.count('"')%2: print('QUOTE?',f,i);continue
        L[i]=l[:m.start(3)]+keep+l[m.end(3):];ch+=1
    if ch:
        tot+=ch;files+=1
        if write: open(f,'w',encoding='utf8').write('\n'.join(L))
print('entries',tot,'files',files,'notes kept',NOTES[0])
