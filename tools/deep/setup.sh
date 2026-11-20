#!/usr/bin/env bash
# One-time setup for the deep-study tools. Clones MorphGNT (SBLGNT), OSHB (WLC Hebrew), the Strong Hebrew lexicon and the Dodson lexicon into <repo>/.gk
# and builds .gk/lex.json. Needs git, node, python3 (pip install betacode).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"; GK="$ROOT/.gk"; mkdir -p "$GK"; cd "$GK"
[ -d sblgnt ] || git clone --depth 1 https://github.com/morphgnt/sblgnt.git sblgnt
[ -d morphhb ] || git clone --depth 1 https://github.com/openscriptures/morphhb.git morphhb
[ -d HebrewLexicon ] || git clone --depth 1 https://github.com/openscriptures/HebrewLexicon.git HebrewLexicon
[ -d dodson ] || git clone --depth 1 https://github.com/biblicalhumanities/Dodson-Greek-Lexicon.git dodson
python3 -m pip install --quiet --break-system-packages betacode 2>/dev/null || python3 -m pip install --quiet betacode
python3 - <<'PY'
import csv, json, unicodedata, betacode.conv as bc
norm=lambda s:''.join(c for c in unicodedata.normalize('NFD',s) if unicodedata.category(c)!='Mn').lower()
lex={}
for r in csv.reader(open('dodson/dodson.csv',encoding='utf-8'),delimiter='\t'):
    if not r or r[0].startswith('Strong'): continue
    s,_,beta,brief=[x.strip().strip('"') for x in r[:4]]
    w=unicodedata.normalize('NFC',bc.beta_to_uni(beta.split(',')[0].strip()))
    lex.setdefault(norm(w),[]).append({'s':s,'w':w,'g':brief})
json.dump(lex,open('lex.json','w'),ensure_ascii=False)
print('lex.json:',len(lex),'lemmas')
PY
node "$ROOT/tools/deep/heb-setup.mjs"
echo "OK. Tools ready in $GK"
