#!/usr/bin/env python3
"""Cross references from the Treasury of Scripture Knowledge (TSK), CrossWire SWORD module 1.5 (public domain).

Reads the original module (TSK.zip from CrossWire) with pysword and writes data/sources/tsk-xref.json:
only the Scripture references for each verse, in TSK order, without TSK's English notes and catchwords.

    pip install pysword
    python3 scripts/make-xref.py /path/to/TSK.zip

Apocrypha references (1-2 Maccabees) and Strong's number links are dropped. References are checked against the Van Dyck text at build time.
"""
import json, os, re, sys, tempfile, zipfile
from pysword.bible import SwordBible
from pysword.canons import canons

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
z = sys.argv[1]
tmp = tempfile.mkdtemp()
zipfile.ZipFile(z).extractall(tmp)
conf = open(os.path.join(tmp, 'mods.d', 'tsk.conf'), encoding='utf8').read()
assert 'DistributionLicense=Public Domain' in conf and 'Version=1.5' in conf
b = SwordBible(os.path.join(tmp, 'modules/comments/zcom/tsk/'), 'ztext', 'kjv', 'utf8', 'osis', 'BOOK', 'ZIP')
OSIS = {}
for testament in ('ot', 'nt'):
    for name, osis, _abbr, chapters in canons['kjv'][testament]:
        OSIS[name] = (osis, chapters)
out, n = {}, 0
for name, (osis, chapters) in OSIS.items():
    for c, nv in enumerate(chapters, 1):
        for v in range(1, nv + 1):
            t = b.get(books=[name], chapters=[c], verses=[v], clean=False)
            refs = [r for r in re.findall(r'osisRef="([^"]+)"', t) if not re.match(r'[12]Macc\.|strong:', r)]
            seen, uniq = set(), []
            for r in refs:
                if r not in seen: seen.add(r); uniq.append(r)
            if uniq:
                out[f'{osis}.{c}.{v}'] = uniq; n += len(uniq)
meta = {'source': 'The Treasury of Scripture Knowledge (Canne, Browne, Blayney, Scott and others), CrossWire SWORD module TSK 1.5 (2008-06-23). Public domain.',
        'from': 'https://crosswire.org/sword/modules/ModInfo.jsp?modName=TSK (module zip as copied in https://github.com/man4christ/Treasury-of-Scripture-Knowledge, data/TSK.zip)',
        'kept': 'Scripture references only, in TSK order. English notes and catchwords are not used.', 'verses': len(out), 'refs': n}
json.dump({'meta': meta, 'x': out}, open(os.path.join(ROOT, 'data', 'sources', 'tsk-xref.json'), 'w'), ensure_ascii=False, separators=(',', ':'))
print(meta)
