import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome')
        pg = await b.new_page(viewport={'width':390,'height':844}, device_scale_factor=2, is_mobile=True, has_touch=True)
        errs=[]; pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto('file:///home/claude/site/proto/ideas.html'); await pg.wait_for_timeout(500)
        shots=[]
        for k in [0,1,3,5,8]:
            await pg.evaluate(f"""(()=>{{const A=document.getElementById('A');}})()""")
        # A cards
        await pg.screenshot(path='/tmp/a0.png')
        for i in range(1,9):
            await pg.click('#A .tapzone.l'); await pg.wait_for_timeout(300)
            if i in (1,3,4,7): await pg.screenshot(path=f'/tmp/a{i}.png')
        await pg.click('[data-c=B]'); await pg.wait_for_timeout(300); await pg.screenshot(path='/tmp/b0.png')
        await pg.evaluate("document.querySelector('[data-pin=shechem]').dispatchEvent(new MouseEvent('click',{bubbles:true}))"); await pg.wait_for_timeout(300); await pg.screenshot(path='/tmp/b1.png')
        await pg.click('[data-bt=text]'); await pg.wait_for_timeout(400); await pg.screenshot(path='/tmp/b2.png')
        await pg.click('[data-c=C]'); await pg.wait_for_timeout(300); await pg.screenshot(path='/tmp/c0.png')
        for sid,name in [('c-sum','c1'),('c-map','c2'),('c-christ','c3')]:
            await pg.evaluate(f"document.getElementById('{sid}').scrollIntoView()"); await pg.wait_for_timeout(500); await pg.screenshot(path=f'/tmp/{name}.png')
        print(errs); await b.close()
asyncio.run(main())
