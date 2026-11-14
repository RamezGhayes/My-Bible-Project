import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome')
        pg = await b.new_page(viewport={'width':390,'height':844}, device_scale_factor=2, is_mobile=True, has_touch=True)
        errs=[]; pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto('file:///home/claude/site/proto/journey3.html'); await pg.wait_for_timeout(500)
        await pg.evaluate("document.getElementById('splash').classList.add('out'); openStory(12)"); await pg.wait_for_timeout(500)
        await pg.click('#story .stop [data-more=hub]'); await pg.wait_for_timeout(1200); await pg.screenshot(path='/tmp/q0.png')
        await pg.evaluate("document.getElementById('sidx').scrollTop=500"); await pg.wait_for_timeout(300); await pg.screenshot(path='/tmp/q1.png')
        await pg.click('#sidx [data-sec=word]'); await pg.wait_for_timeout(900); await pg.screenshot(path='/tmp/q2.png')
        await pg.evaluate("showDet('christ')"); await pg.wait_for_timeout(900); await pg.screenshot(path='/tmp/q3.png')
        await pg.evaluate("showDet('map')"); await pg.wait_for_timeout(900); await pg.screenshot(path='/tmp/q4.png')
        await pg.evaluate("document.getElementById('sdet').scrollTop=99999"); await pg.wait_for_timeout(300); await pg.screenshot(path='/tmp/q5.png')
        print(errs); await b.close()
asyncio.run(main())
