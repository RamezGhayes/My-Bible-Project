#!/usr/bin/env python3
"""Make the social preview images (1200x630) in src/v2/assets/og-*.jpg: site, explainers, tree, harmony, every book and every topic.

Needs: Python with Playwright, a Chrome/Chromium, and the site fonts as woff2 files
(for example from npm: @fontsource/ibm-plex-sans-arabic, @fontsource/readex-pro).

    OG=1 node src/build.mjs
    python3 scripts/make-og.py --fonts /path/to/folder/with/woff2 [--chrome /usr/bin/google-chrome]
    node src/build.mjs        # rebuild without the og sources

Run it again only when an explainer's title or icons change.
"""
import argparse, asyncio, functools, glob, http.server, os, shutil, threading
from playwright.async_api import async_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DIST = os.path.join(ROOT, 'dist')
FACES = [('IBM Plex Sans Arabic', 'ibm-plex-sans-arabic-arabic-{w}-normal.woff2', (400, 600)),
         ('Readex Pro', 'readex-pro-arabic-{w}-normal.woff2', (500, 600))]

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--fonts', required=True)
    ap.add_argument('--chrome', default=None)
    a = ap.parse_args()
    srcs = sorted(glob.glob(os.path.join(DIST, 'og-src-*.html')))
    if not srcs: raise SystemExit('No og-src pages. Run: OG=1 node src/build.mjs')
    os.makedirs(os.path.join(DIST, 'og-fonts'), exist_ok=True)
    css = []
    for fam, pat, ws in FACES:
        for w in ws:
            name = pat.format(w=w)
            found = glob.glob(os.path.join(a.fonts, '**', name), recursive=True)
            if not found: raise SystemExit('Missing font file: ' + name)
            shutil.copy(found[0], os.path.join(DIST, 'og-fonts', name))
            css.append("@font-face{font-family:'%s';font-weight:%d;src:url(og-fonts/%s) format('woff2')}" % (fam, w, name))
    open(os.path.join(DIST, 'og-fonts.css'), 'w').write('\n'.join(css))

    class Q(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *x): pass
    srv = http.server.ThreadingHTTPServer(('127.0.0.1', 0), functools.partial(Q, directory=DIST))
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    port = srv.server_address[1]

    async def shoot():
        async with async_playwright() as p:
            b = await p.chromium.launch(executable_path=a.chrome) if a.chrome else await p.chromium.launch()
            pg = await b.new_page(viewport={'width': 1200, 'height': 630})
            for f in srcs:
                k = os.path.basename(f)[len('og-src-'):-len('.html')]
                await pg.goto('http://127.0.0.1:%d/%s' % (port, os.path.basename(f)))
                await pg.evaluate('document.fonts.ready')
                await pg.wait_for_timeout(300)
                out = os.path.join(ROOT, 'src', 'v2', 'assets', 'og-%s.jpg' % k)
                await pg.screenshot(path=out, type='jpeg', quality=86)
                print('wrote', os.path.relpath(out, ROOT))
            await b.close()
    asyncio.run(shoot())
    for f in srcs: os.remove(f)
    shutil.rmtree(os.path.join(DIST, 'og-fonts')); os.remove(os.path.join(DIST, 'og-fonts.css'))

if __name__ == '__main__':
    main()
