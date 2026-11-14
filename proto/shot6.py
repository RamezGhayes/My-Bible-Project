import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome')
        pg = await b.new_page(viewport={'width':390,'height':844}, device_scale_factor=2, is_mobile=True, has_touch=True)
        errs=[]; pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto('file:///home/claude/site/proto/journey.html'); await pg.wait_for_timeout(2800)
        await pg.screenshot(path='/tmp/j0.png')
        await pg.click('[data-enter]'); await pg.wait_for_timeout(700); await pg.screenshot(path='/tmp/j1.png')
        await pg.click('[data-testament=ot]'); await pg.wait_for_timeout(700); await pg.screenshot(path='/tmp/j2.png')
        await pg.click('#gchips [data-g="الأنبياء الكبار"]'); await pg.wait_for_timeout(900); await pg.screenshot(path='/tmp/j3.png')
        await pg.click('#gchips [data-g="التوراة"]'); await pg.wait_for_timeout(900)
        await pg.click('#car .cc.on'); await pg.wait_for_timeout(900); await pg.screenshot(path='/tmp/j4.png')
        await pg.click('#scrub [data-jump="2"]'); await pg.wait_for_timeout(900); await pg.screenshot(path='/tmp/j5.png')
        await pg.click('[data-more=intro]'); await pg.wait_for_timeout(500); await pg.screenshot(path='/tmp/j6.png')
        print(errs); await b.close()
asyncio.run(main())
