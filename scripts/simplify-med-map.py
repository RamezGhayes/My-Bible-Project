#!/usr/bin/env python3
"""Second step after make-med-map.mjs: simplify the land outline (Douglas-Peucker, 0.5 px) and drop specks."""
import json, re, pathlib
f = pathlib.Path(__file__).resolve().parent.parent / 'data/med-map.json'
d = json.loads(f.read_text())
def dp(pts, eps):
    if len(pts) < 3: return pts
    (x1, y1), (x2, y2) = pts[0], pts[-1]
    dx, dy = x2 - x1, y2 - y1; L = (dx * dx + dy * dy) ** .5 or 1e-9
    best, bi = 0, 0
    for i in range(1, len(pts) - 1):
        x, y = pts[i]; dist = abs(dy * x - dx * y + x2 * y1 - y2 * x1) / L
        if dist > best: best, bi = dist, i
    if best <= eps: return [pts[0], pts[-1]]
    return dp(pts[:bi + 1], eps)[:-1] + dp(pts[bi:], eps)
import sys; sys.setrecursionlimit(100000)
out = []
for s in re.findall(r'M[^M]*', d['land']):
    n = list(map(float, re.findall(r'-?\d+\.?\d*', s)))
    pts = list(zip(n[0::2], n[1::2]))
    xs = [p[0] for p in pts]; ys = [p[1] for p in pts]
    if (max(xs) - min(xs)) < 1.5 and (max(ys) - min(ys)) < 1.5: continue
    if len(pts) <= 16 and min(xs) <= -319 and max(xs) >= d['W'] + 319 and max(ys) >= d['H'] + 300: continue  # clip-extent frame ring
    if len(pts) > 4:
        mid = len(pts) // 2
        pts = dp(pts[:mid + 1], .5)[:-1] + dp(pts[mid:], .5)
    out.append('M' + 'L'.join(f'{x:g},{y:g}' for x, y in pts) + 'Z')
d['land'] = ''.join(out)
f.write_text(json.dumps(d, ensure_ascii=False))
print(len(d['land']))
