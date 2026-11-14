import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome')
        pg = await b.new_page(viewport={'width':390,'height':844}, device_scale_factor=2, is_mobile=True, has_touch=True)
        errs=[]; pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto('file:///home/claude/site/proto/path.html'); await pg.wait_for_timeout(600)
        await pg.screenshot(path='/tmp/p0.png')
        await pg.evaluate("document.getElementById('v-path').scrollTop=0"); await pg.wait_for_timeout(200); await pg.screenshot(path='/tmp/p00.png')
        await pg.click('.today'); await pg.wait_for_timeout(400); await pg.screenshot(path='/tmp/s0.png')
        for i in range(1,10):
            await pg.click('#story .tz.l'); await pg.wait_for_timeout(350)
            if i in (1,3,4,6,9): await pg.screenshot(path=f'/tmp/s{i}.png')
        await pg.click('#story .stop [data-more=hub]'); await pg.wait_for_timeout(400); await pg.screenshot(path='/tmp/hub.png')
        await pg.mouse.click(195,40); await pg.wait_for_timeout(300)
        await pg.evaluate("openPerson('abram')"); await pg.wait_for_timeout(400); await pg.screenshot(path='/tmp/pd.png')
        await pg.evaluate("document.getElementById('pdet').scrollTop=700"); await pg.wait_for_timeout(200); await pg.screenshot(path='/tmp/pd2.png')
        await pg.evaluate("document.getElementById('pdet').classList.remove('on');document.getElementById('story').classList.remove('on')")
        await pg.click('#nav [data-v=cards]'); await pg.wait_for_timeout(300); await pg.screenshot(path='/tmp/cards.png')
        await pg.click('#nav [data-v=maps]'); await pg.wait_for_timeout(300); await pg.screenshot(path='/tmp/maps.png')
        print(errs); await b.close()
asyncio.run(main())
