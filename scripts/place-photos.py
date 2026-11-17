#!/usr/bin/env python3
"""Real photographs of the sites on Paul's journeys, from Wikimedia Commons (free licences only).

Step 1, find candidates (run on your machine, it needs internet):
    python3 scripts/place-photos.py search
  -> docs/place-candidates/<id>-<n>.jpg (small previews) and docs/place-candidates.json
  push them, and the choices are made by reviewing the previews.

Step 2, download the chosen photos:
    python3 scripts/place-photos.py fetch
  -> reads docs/place-choice.json {place id: "File:..."}, saves src/v2/assets/place-<id>.webp (960x720)
     and docs/place-credits.json (author, licence, source page) shown under each photo.
"""
import io, json, pathlib, re, sys, time, urllib.parse, urllib.request
from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parent.parent
API = 'https://commons.wikimedia.org/w/api.php'
UA = {'User-Agent': 'LiMajdAllah-BibleStudy/1.0 (https://github.com/RamezGhayes/My-Bible-Project)'}
FREE = re.compile(r'^(CC0|Public domain|PD|CC BY(-SA)? [0-9.]+)', re.I)

# search words per place (ancient site or landscape as it is today)
Q = {
    'antioch': 'Antakya Orontes Habib-i Neccar mountain', 'seleucia': 'Seleucia Pieria Titus tunnel',
    'salamis': 'Salamis Cyprus gymnasium ruins', 'paphos': 'Kato Paphos archaeological park',
    'perga': 'Perge Hellenistic gate towers', 'attalia': 'Antalya old harbour Kaleiçi',
    'pantioch': 'Pisidian Antioch ruins Yalvaç', 'iconium': 'Konya plain landscape',
    'lystra': 'Lystra Hatunsaray mound', 'derbe': 'Derbe Kerti Höyük',
    'galatia': 'Phrygia landscape Anatolia plateau', 'troas': 'Alexandria Troas ruins',
    'neapolis': 'Kavala aqueduct harbour', 'philippi': 'Philippi forum ruins basilica',
    'thessalonica': 'Thessaloniki Roman Agora', 'berea': 'Veria Paul step Bema',
    'athens': 'Areopagus hill Acropolis view', 'corinth': 'Ancient Corinth Temple of Apollo Acrocorinth',
    'cenchreae': 'Kechries ancient harbour Cenchreae', 'ephesus': 'Ephesus great theatre Arcadian way',
    'caesarea': 'Caesarea Maritima theatre aerial', 'macedonia': 'Via Egnatia road ruins',
    'assos': 'Assos temple of Athena view Behramkale', 'miletus': 'Miletus theatre',
    'rhodes': 'Lindos acropolis Rhodes', 'tyre': 'Tyre Lebanon Roman ruins al-Mina',
    'ptolemais': 'Acre Akko old city sea', 'sidon': 'Sidon Sea Castle harbour',
    'myra': 'Myra Lycian rock tombs Demre', 'fairhavens': 'Kali Limenes Crete',
    'malta': "St Paul's Islands Malta bay", 'syracuse': 'Ortygia Syracuse harbour',
    'rhegium': 'Strait of Messina Reggio Calabria view', 'puteoli': 'Pozzuoli Macellum Serapeum',
    'rome': 'Roman Forum view Palatine', 'jerusalem': 'Jerusalem Southern Wall steps Temple Mount excavations',
}

def api(**p):
    p.update(format='json', formatversion='2')
    req = urllib.request.Request(API + '?' + urllib.parse.urlencode(p), headers=UA)
    return json.load(urllib.request.urlopen(req, timeout=30))

def meta(ii):
    m = ii.get('extmetadata', {})
    g = lambda k: re.sub('<[^>]+>', '', (m.get(k) or {}).get('value', '')).strip()
    return {'license': g('LicenseShortName'), 'artist': g('Artist') or g('Credit'), 'page': ii.get('descriptionurl', '')}

def get(url):
    return urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=60).read()

def search():
    out_dir = ROOT / 'docs/place-candidates'; out_dir.mkdir(parents=True, exist_ok=True)
    found = {}
    for pid, q in Q.items():
        r = api(action='query', generator='search', gsrnamespace=6, gsrlimit=20, gsrsearch=f'{q} filetype:bitmap',
                prop='imageinfo', iiprop='url|size|extmetadata', iiurlwidth=480)
        pages = sorted(r.get('query', {}).get('pages', []), key=lambda x: x.get('index', 99))
        keep = []
        for pg in pages:
            ii = (pg.get('imageinfo') or [{}])[0]
            md = meta(ii)
            if not FREE.match(md['license']) or ii.get('width', 0) < 1200 or ii.get('width', 0) < ii.get('height', 1):
                continue
            n = len(keep) + 1
            (out_dir / f'{pid}-{n}.jpg').write_bytes(get(ii['thumburl']))
            keep.append({'n': n, 'title': pg['title'], **md})
            if len(keep) == 6: break
            time.sleep(.3)
        found[pid] = keep
        print(f'{pid}: {len(keep)} candidates')
    (ROOT / 'docs/place-candidates.json').write_text(json.dumps(found, ensure_ascii=False, indent=1))
    print('Done. Now: git add docs && git commit -m "place candidates" && git push')

def fetch():
    choice = json.loads((ROOT / 'docs/place-choice.json').read_text())
    credits = {}
    for pid, title in choice.items():
        r = api(action='query', titles=title, prop='imageinfo', iiprop='url|extmetadata', iiurlwidth=1600)
        ii = r['query']['pages'][0]['imageinfo'][0]
        md = meta(ii)
        if not FREE.match(md['license']): raise SystemExit(f'{pid}: licence not free: {md["license"]}')
        im = Image.open(io.BytesIO(get(ii['thumburl']))).convert('RGB')
        w, h = im.size; sw, sh = w, w * 3 / 4
        if sh > h: sh, sw = h, h * 4 / 3
        l, t = (w - sw) / 2, (h - sh) / 2
        im.crop((round(l), round(t), round(l + sw), round(t + sh))).resize((960, 720), Image.LANCZOS) \
          .save(ROOT / f'src/v2/assets/place-{pid}.webp', 'WEBP', quality=82, method=6)
        credits[pid] = {'title': title, **md}
        print('ok', pid, md['license'])
        time.sleep(.3)
    (ROOT / 'docs/place-credits.json').write_text(json.dumps(credits, ensure_ascii=False, indent=1))
    print('Done. Now: git add src/v2/assets docs && git commit -m "place photos" && git push')

if __name__ == '__main__':
    {'search': search, 'fetch': fetch}[sys.argv[1] if len(sys.argv) > 1 else 'search']()
