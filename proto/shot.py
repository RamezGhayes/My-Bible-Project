import asyncio, sys
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome')
        pg = await b.new_page(viewport={'width':390,'height':844}, device_scale_factor=2, is_mobile=True, has_touch=True)
        errs=[]; pg.on('pageerror', lambda e: errs.append(str(e)))
        url='file:///home/claude/site/proto/index.html'
        for name,h in [('home','#home'),('book','#genesis'),('ch-text','#genesis-1')]:
            await pg.goto(url+h); await pg.wait_for_timeout(600)
            await pg.screenshot(path=f'/tmp/{name}.png')
        await pg.click('[data-tab=study]'); await pg.wait_for_timeout(300); await pg.screenshot(path='/tmp/ch-study.png')
        await pg.click('details summary'); await pg.wait_for_timeout(200); await pg.mouse.wheel(0,600); await pg.wait_for_timeout(200); await pg.screenshot(path='/tmp/ch-study2.png')
        await pg.click('[data-tab=reflect]'); await pg.wait_for_timeout(300); await pg.screenshot(path='/tmp/ch-reflect.png')
        await pg.click('[data-open=chapters]'); await pg.wait_for_timeout(400); await pg.screenshot(path='/tmp/sheet-ch.png')
        await pg.mouse.click(195,40); await pg.wait_for_timeout(300)
        await pg.click('.top [data-open=settings]'); await pg.wait_for_timeout(400); await pg.screenshot(path='/tmp/sheet-set.png')
        print('errors:',errs)
        await b.close()
asyncio.run(main())
