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
PROMPTS = json.loads((ROOT / 'docs/portrait-prompts.json').read_text('utf-8'))
OUT = ROOT / 'src/v2/assets'

PRE = ('Photorealistic cinematic film still, shot on 35mm film with natural light, rich vivid colors, '
       'fine realistic skin and fabric detail, historically accurate faces, clothing and setting for the ancient biblical world. ')
NEG = ('text, letters, watermark, signature, logo, halo, nimbus, glowing head, cartoon, illustration, painting, 3d render, '
       'anime, modern clothing, glasses, deformed hands, extra fingers, extra limbs, distorted face, nudity, blood, gore')


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
    a = ap.parse_args()

    ids = a.only or list(PROMPTS)
    todo = [i for i in ids if i in PROMPTS and (a.redo or not (OUT / f'person-{i}.webp').exists())]
    if a.limit:
        todo = todo[:a.limit]
    print(f'{len(todo)} portraits to generate with {a.model} in {a.region}')
    br = boto3.client('bedrock-runtime', region_name=a.region)
    failed = []
    model = a.model
    for n, pid in enumerate(todo, 1):
        body = {'prompt': PRE + PROMPTS[pid], 'negative_prompt': NEG, 'aspect_ratio': '3:2', 'output_format': 'png'}
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
            to_webp(base64.b64decode(out['images'][0]), OUT / f'person-{pid}.webp')
            print(f'[{n}/{len(todo)}] ok   {pid}')
        except Exception as e:
            failed.append(pid)
            print(f'[{n}/{len(todo)}] FAIL {pid}: {e}', file=sys.stderr)
            time.sleep(2)
    if failed:
        print('failed:', ' '.join(failed))


if __name__ == '__main__':
    main()
