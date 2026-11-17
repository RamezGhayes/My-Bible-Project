// Portrait batch helper, pasted into a gemini.google.com tab (via Claude in Chrome).
// Prompts: docs/portrait-prompts.json (page id -> scene). Already done = src/v2/assets/person-<id>.webp.
// The free Gemini account allows only about 10 to 20 images a day; the queue stops on the quota message.
// Usage: __q.items = [[id, prompt], ...]; __run(); then poll __q. Images land in window.__imgs[id] as 960x720 WebP data URLs.
window.__imgs = window.__imgs || {};
window.__big = () => [...document.querySelectorAll('img')].filter((i) => i.naturalWidth > 400);
window.__send = async (txt) => {
  const ed = document.querySelector('.ql-editor'); ed.focus();
  document.execCommand('selectAll'); document.execCommand('insertText', false, txt);
  await new Promise((r) => setTimeout(r, 800));
  const b = [...document.querySelectorAll('button')].find((b) => /send|إرسال/i.test(b.getAttribute('aria-label') || ''));
  if (!b) return 'nobtn'; b.click(); return 'sent';
};
window.__cap = (img) => {
  const c = document.createElement('canvas'); c.width = 960; c.height = 720;
  const w = img.naturalWidth, h = img.naturalHeight; let sw = w, sh = (w * 3) / 4; if (sh > h) { sh = h; sw = (h * 4) / 3; }
  c.getContext('2d').drawImage(img, (w - sw) / 2, (h - sh) / 2, sw, sh, 0, 0, 960, 720);
  return c.toDataURL('image/webp', 0.8);
};
window.__pre = 'Generate a photorealistic cinematic image, landscape 4:3 aspect ratio, shot on 35mm film with natural light, rich vivid colors, fine realistic detail, historically accurate faces, clothing and setting for the ancient biblical world. ';
window.__post = ' No text, no halo, no watermark.';
window.__q = window.__q || { items: [], i: 0, done: [], fail: [], log: [] };
window.__run = async () => {
  const S = (ms) => new Promise((x) => setTimeout(x, ms));
  if (__q.running) return; __q.running = true; __q.stop = false;
  while (__q.i < __q.items.length && !__q.stop) {
    const [id, p] = __q.items[__q.i];
    const seen = new Set(__big().map((i) => i.src));
    const nResp = document.querySelectorAll('model-response').length;
    let ok = false;
    try {
      await __send(__pre + p + __post);
      for (let t = 0; t < 60; t++) {
        await S(2000);
        const resps = document.querySelectorAll('model-response');
        const resp = resps.length > nResp ? resps[resps.length - 1] : null;
        if (resp && /can't (create|generate) more images|come back tomorrow/i.test(resp.innerText)) { __q.log.push(id + ': quota'); __q.stop = true; break; }
        const im = resp && [...resp.querySelectorAll('img')].find((i) => i.naturalWidth > 400 && !seen.has(i.src));
        if (im) {
          await S(1500);
          if (im.src.startsWith('blob:')) { __imgs[id] = __cap(im); ok = true; break; }
          im.click(); await S(3000);
          const bl = [...document.querySelectorAll('img')].filter((i) => i.src.startsWith('blob:') && i.naturalWidth > 400 && !seen.has(i.src)).pop();
          if (bl) { __imgs[id] = __cap(bl); ok = true; }
          document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })); await S(1000); break;
        }
        const busy = [...document.querySelectorAll('button')].some((b) => /stop|إيقاف/i.test(b.getAttribute('aria-label') || ''));
        if (t > 8 && !busy && resp) { __q.log.push(id + ': ' + resp.innerText.slice(0, 120)); break; }
      }
    } catch (e) { __q.log.push(id + ' err ' + e); }
    if (__q.stop && !ok) break;
    (ok ? __q.done : __q.fail).push(id); __q.i++; await S(3000);
  }
  __q.running = false;
};
