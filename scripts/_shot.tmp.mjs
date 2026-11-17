import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
for (const [u, f, y] of [['people.html', 'ppl', 600], ['people/p1lng3mo.html', 'pilate', 0], ['people/pjwpwlo.html', 'reuel', 0]]) {
  await p.goto('http://localhost:8765/' + u, { waitUntil: 'networkidle' });
  await p.evaluate((y) => window.scrollTo(0, y), y); await p.waitForTimeout(800);
  await p.screenshot({ path: `/tmp/s-${f}.png` });
}
await p.setViewportSize({ width: 390, height: 844 });
await p.goto('http://localhost:8765/people.html', { waitUntil: 'networkidle' }); await p.evaluate(() => window.scrollTo(0, 900)); await p.waitForTimeout(800);
await p.screenshot({ path: '/tmp/s-mob.png' });
await b.close();
