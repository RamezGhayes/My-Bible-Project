// usage: (cd dist && python3 -m http.server 8765 &) ; node tools/deep/shot.mjs  -> /tmp/d1..d5.png (desktop + mobile of a study page). Edit the URLs.

import { createRequire } from 'module'; const { chromium } = createRequire(process.cwd() + '/')('playwright');
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
const p = await b.newPage({ viewport: { width: 1366, height: 900 } });
p.on('pageerror', (e) => console.log('ERR', e.message));
await p.goto('http://localhost:8765/book/john/3-study.html', { waitUntil: 'networkidle' });
await p.screenshot({ path: '/tmp/d1.png' });
await p.goto('http://localhost:8765/book/john/3-study.html#dv3', { waitUntil: 'networkidle' }); await p.waitForTimeout(300);
await p.screenshot({ path: '/tmp/d2.png' });
await p.goto('http://localhost:8765/book/john/3-study.html#d-ot', { waitUntil: 'networkidle' }); await p.waitForTimeout(300);
await p.screenshot({ path: '/tmp/d3.png' });
const m = await b.newPage({ viewport: { width: 390, height: 844 } });
await m.goto('http://localhost:8765/book/john/3-study.html#dv5', { waitUntil: 'networkidle' }); await m.waitForTimeout(300);
await m.screenshot({ path: '/tmp/d4.png' });
await m.goto('http://localhost:8765/book/john/3.html', { waitUntil: 'networkidle' });
await m.screenshot({ path: '/tmp/d5.png' });
await b.close();
