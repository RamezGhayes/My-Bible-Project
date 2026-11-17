# Usage: python3 scripts/add-portrait.py <id> <image file>
# Crops the image to 4:3 around the centre (a little above, where faces usually are), resizes to 960x720,
# and saves src/v2/assets/person-<id>.webp. The site then uses it instead of the drawn SVG.
import sys, os
from PIL import Image
pid, src = sys.argv[1], sys.argv[2]
im = Image.open(src).convert('RGB')
w, h = im.size; r = 4 / 3
if w / h > r: nw = int(h * r); box = ((w - nw) // 2, 0, (w - nw) // 2 + nw, h)
else: nh = int(w / r); top = max(0, int((h - nh) * 0.35)); box = (0, top, w, top + nh)
im = im.crop(box).resize((960, 720), Image.LANCZOS)
out = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'src', 'v2', 'assets', f'person-{pid}.webp')
im.save(out, 'WEBP', quality=82, method=6)
print('saved', os.path.normpath(out), os.path.getsize(out) // 1024, 'KB')
