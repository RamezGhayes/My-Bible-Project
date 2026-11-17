#!/usr/bin/env python3
"""Generate the remaining character portraits with Amazon Bedrock (Stability AI, Stable Image Ultra).

Run on your own machine, from the repo root:
    pip install boto3 pillow
    aws configure            # or export AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY
    python3 scripts/bedrock-portraits.py            # all missing portraits
    python3 scripts/bedrock-portraits.py --limit 3  # try 3 first
    python3 scripts/bedrock-portraits.py --only isaac p15hgaz5

It reads docs/portrait-prompts.json (page id -> scene), skips any id that already
has src/v2/assets/person-<id>.webp, and saves new images there as 960x720 WebP.
Then: git add src/v2/assets && git commit && git push (branch design-v3).
"""
import argparse, base64, io, json, pathlib, sys, time

import boto3
from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parent.parent
import os
SET = 'places' if '--places' in sys.argv else 'people'
PROMPTS = json.loads((ROOT / ('docs/place-prompts.json' if SET == 'places' else 'docs/portrait-prompts.json')).read_text('utf-8'))
OUT = ROOT / 'src/v2/assets'
PREFIX = 'place-' if SET == 'places' else 'person-'

PRE = 'Real documentary photograph from the ancient biblical world. '
SUF = (' Real people with natural skin texture, visible pores, sun-weathered faces and slight imperfections; '
       'rough handwoven wool and linen with real fabric texture. Shot on Canon EOS R5, 50mm lens, natural light, '
       'National Geographic documentary style, muted earthy colors, subtle film grain.')
NEG = ('anime, manga, cartoon, illustration, painting, digital art, CGI, 3d render, doll, smooth plastic skin, airbrushed, '
       'beauty retouch, fashion model, makeup, oversaturated, text, watermark, halo, deformed hands, extra fingers, nudity, blood, '
       'book, bound book, codex, notebook, paper, pen, ballpoint pen, microphone, wristwatch, watch, glasses, cross, crucifix, '
       'banknotes, paper money, modern clothing, modern people, t-shirt, cap, church, dome, cathedral, tourist, sun hat, '
       'asphalt road, power line, leather satchel with buckle, glass jar')


def prompt(pid):
    if SET == 'places':
        return ('Photorealistic historical reconstruction of a living city in the first century AD, as it stood in the time of the apostle Paul, buildings complete and in use, wide view, natural light. Ships, if any, are small ancient Roman merchant ships with one mast and one square sail. ' + PROMPTS[pid] + ' No text.')
    s = PROMPTS[pid].replace('a beautiful young', 'a young').replace('beautiful young', 'young').replace('a beautiful ', 'a ')
    return PRE + s + SUF


def to_webp(png_bytes, dest):
    im = Image.open(io.BytesIO(png_bytes)).convert('RGB')
    w, h = im.size
    sw, sh = w, w * 3 / 4
    if sh > h:
        sh, sw = h, h * 4 / 3
    left, top = (w - sw) / 2, (h - sh) / 2
    im = im.crop((round(left), round(top), round(left + sw), round(top + sh))).resize((960, 720), Image.LANCZOS)
    im.save(dest, 'WEBP', quality=82, method=6)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--model', default='stability.stable-image-ultra-v1:1')
    ap.add_argument('--region', default='us-east-1')
    ap.add_argument('--limit', type=int, default=0)
    ap.add_argument('--only', nargs='*')
    ap.add_argument('--redo', action='store_true', help='overwrite existing images')
    ap.add_argument('--places', action='store_true', help='make place images for the Paul map (docs/place-prompts.json)')
    a = ap.parse_args()

    # most important / best-known people first (docs/portrait-priority.json), then the rest in book order
    prio = json.loads((ROOT / 'docs/portrait-priority.json').read_text('utf-8')) if SET == 'people' else []
    ids = a.only or prio + [k for k in PROMPTS if k not in prio]
    todo = [i for i in ids if i in PROMPTS and (a.redo or not (OUT / f'{PREFIX}{i}.webp').exists())]
    if a.limit:
        todo = todo[:a.limit]
    neg = NEG + (', ruins, ruined, broken columns, archaeological site, tourists, galleon, frigate, three-masted ship, two-masted ship, pirate ship, tall ship, dome, mosque, minaret, church, cathedral, bell tower, castle, medieval fortress, crenellated towers, lamp post, modern town' if SET == 'places' else '')
    print(f'{len(todo)} portraits to generate with {a.model} in {a.region}')
    br = boto3.client('bedrock-runtime', region_name=a.region)
    failed = []
    model = a.model
    for n, pid in enumerate(todo, 1):
        body = {'prompt': prompt(pid), 'negative_prompt': neg, 'aspect_ratio': '5:4', 'output_format': 'png'}
        try:
            try:
                r = br.invoke_model(modelId=model, body=json.dumps(body))
            except br.exceptions.ValidationException:
                # In some regions Stability models are reachable only through the US cross-Region profile ("us." prefix)
                if model.startswith('us.'):
                    raise
                model = 'us.' + model
                print(f'  switching to inference profile {model}')
                r = br.invoke_model(modelId=model, body=json.dumps(body))
            out = json.loads(r['body'].read())
            reason = (out.get('finish_reasons') or [None])[0]
            if reason:  # e.g. content filtered
                raise RuntimeError(f'finish_reason={reason}')
            to_webp(base64.b64decode(out['images'][0]), OUT / f'{PREFIX}{pid}.webp')
            print(f'[{n}/{len(todo)}] ok   {pid}')
        except Exception as e:
            failed.append(pid)
            print(f'[{n}/{len(todo)}] FAIL {pid}: {e}', file=sys.stderr)
            time.sleep(2)
    if failed:
        print('failed:', ' '.join(failed))
    print('Done. Now: git add src/v2/assets && git commit -m "portraits" && git push')


if __name__ == '__main__':
    main()
