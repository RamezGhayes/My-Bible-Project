import asyncio, base64
from playwright.async_api import async_playwright
img = 'data:image/jpeg;base64,' + base64.b64encode(open('/mnt/user-data/uploads/cbf664c9-image.jpg','rb').read()).decode()
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome')
        pg = await b.new_page(viewport={'width':390,'height':844}, device_scale_factor=2, is_mobile=True, has_touch=True)
        errs=[]; pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto('file:///home/claude/site/proto/formal.html'); await pg.wait_for_timeout(500)
        await pg.screenshot(path='/tmp/f0.png')
        await pg.click('.cta'); await pg.wait_for_timeout(400); await pg.screenshot(path='/tmp/f1.png')
        for i in range(1,10):
            await pg.click('#story .tz.l'); await pg.wait_for_timeout(350)
            if i in (1,4,6,9): await pg.screenshot(path=f'/tmp/f1{i}.png')
        await pg.click('#story .stop [data-more=hub]'); await pg.wait_for_timeout(400); await pg.screenshot(path='/tmp/fhub.png')
        await pg.mouse.click(195,40); await pg.wait_for_timeout(300)
        await pg.evaluate("openPerson('abram')"); await pg.wait_for_timeout(400); await pg.screenshot(path='/tmp/fc0.png')
        await pg.evaluate("flip(1)"); await pg.wait_for_timeout(800); await pg.screenshot(path='/tmp/fc1.png')
        await pg.evaluate("flip(1)"); await pg.wait_for_timeout(800); await pg.screenshot(path='/tmp/fc2.png')
        await pg.evaluate(f"IMG.abram='{img}'; face=0; renderViewer()"); await pg.wait_for_timeout(500); await pg.screenshot(path='/tmp/fc3.png')
        await pg.evaluate("document.getElementById('viewer').classList.remove('on');document.getElementById('story').classList.remove('on')")
        await pg.click('#nav [data-v=people]'); await pg.wait_for_timeout(300); await pg.screenshot(path='/tmp/fp.png')
        print(errs); await b.close()
asyncio.run(main())
