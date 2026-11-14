import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome')
        pg = await b.new_page(viewport={'width':390,'height':844}, device_scale_factor=2, is_mobile=True, has_touch=True)
        errs=[]; pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto('file:///home/claude/site/proto/journey.html'); await pg.wait_for_timeout(500)
        await pg.evaluate("document.getElementById('splash').classList.add('out'); push({v:'book',slug:'genesis'})"); await pg.wait_for_timeout(1200)
        await pg.screenshot(path='/tmp/k0.png')
        await pg.click('#scrub [data-jump="2"]', force=True); await pg.wait_for_timeout(1200); await pg.screenshot(path='/tmp/k1.png')
        await pg.click('[data-more=intro]'); await pg.wait_for_timeout(500); await pg.screenshot(path='/tmp/k2.png')
        await pg.mouse.click(195,40); await pg.wait_for_timeout(300)
        await pg.evaluate("push({v:'testament',t:'ot'})"); await pg.wait_for_timeout(800)
        await pg.click('#gchips [data-g="الأسفار التاريخية"]'); await pg.wait_for_timeout(1000); await pg.screenshot(path='/tmp/k3.png')
        print(errs); await b.close()
asyncio.run(main())
