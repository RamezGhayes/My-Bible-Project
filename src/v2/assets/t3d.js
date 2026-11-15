/* Tabernacle in 3D: CSS 3D scene with orbit, zoom, selection, and a guided Day of Atonement walk-through.
   Units: cubits. Court is 50 wide (x) by 100 long (y). West (the ark) is y = 0, the gate (east) is y = 100. */
(function () {
  'use strict';
  var host = document.querySelector('.t3d');
  if (!host) return;
  var U = 8; // px per cubit
  var G = { x0: -40, y0: -24, w: 130, h: 180 }; // ground extent in cubits (includes the wilderness east of the gate)
  var items = JSON.parse(host.getAttribute('data-items') || '[]');
  var steps = JSON.parse(host.getAttribute('data-steps') || '[]');
  var vp = host.querySelector('.t3v'), info = host.querySelector('.t3i');
  var W = document.createElement('div'); W.className = 'w3';
  W.style.width = G.w * U + 'px'; W.style.height = G.h * U + 'px';
  W.style.marginLeft = -G.w * U / 2 + 'px'; W.style.marginTop = -G.h * U / 2 + 'px';
  vp.appendChild(W);
  var px = function (x) { return (x - G.x0) * U; }, py = function (y) { return (y - G.y0) * U; };

  function el(cls, css, tf, parent, html) {
    var d = document.createElement('div'); d.className = cls;
    for (var k in css) { if (k.indexOf('--') === 0) d.style.setProperty(k, css[k]); else d.style[k] = css[k]; }
    if (tf) d.style.transform = tf;
    if (html) d.innerHTML = html;
    (parent || W).appendChild(d); return d;
  }
  function plane(cls, x, y, w, d, z, bg, parent) { return el(cls, { width: w * U + 'px', height: d * U + 'px', background: bg }, 'translate3d(' + px(x) + 'px,' + py(y) + 'px,' + z * U + 'px)', parent); }
  // vertical wall along x (facing south) or along y (facing east)
  function wallX(cls, x, y, w, h, bg, z0) { return el(cls, { width: w * U + 'px', height: h * U + 'px', background: bg }, 'translate3d(' + px(x) + 'px,' + py(y) + 'px,' + (z0 || 0) * U + 'px) rotateX(90deg)'); }
  function wallY(cls, x, y, d, h, bg, z0) { return el(cls, { width: d * U + 'px', height: h * U + 'px', background: bg }, 'translate3d(' + px(x) + 'px,' + py(y) + 'px,' + (z0 || 0) * U + 'px) rotateZ(90deg) rotateX(90deg)'); }
  function box(cls, x, y, w, d, h, top, side, side2, z0) {
    z0 = z0 || 0;
    var g = [];
    g.push(wallX(cls + ' bs', x, y, w, h, side, z0));
    g.push(wallX(cls + ' bs', x, y + d, w, h, side, z0));
    g.push(wallY(cls + ' bs', x, y, d, h, side2 || side, z0));
    g.push(wallY(cls + ' bs', x + w, y, d, h, side2 || side, z0));
    g.push(plane(cls + ' bt', x, y, w, d, z0 + h, top));
    return g;
  }

  // ground, wilderness, camp hint
  plane('q-gr', G.x0, G.y0, G.w, G.h, 0, 'radial-gradient(ellipse at 50% 38%,#E9DDC1 0%,#DCCBA6 55%,#CDB88E 100%)');
  plane('q-wild', G.x0, 112, G.w, G.h - 136, 0.02, 'repeating-linear-gradient(175deg,rgba(160,130,80,.0) 0 18px,rgba(160,130,80,.18) 18px 20px)');
  el('q-glab', {}, 'translate3d(' + px(15) + 'px,' + py(138) + 'px,1px)', W, 'البرية');
  el('q-glab', {}, 'translate3d(' + px(-36) + 'px,' + py(108) + 'px,1px)', W, 'خارج المحلة');
  // court floor and linen fence (5 cubits high), gate on the east
  plane('q-court', 0, 0, 50, 100, 0.05, '#F4EEDF');
  var linen = 'linear-gradient(180deg,#C9CDD2 0 3px,transparent 3px),repeating-linear-gradient(90deg,#FFFDF7 0,#F3EEE2 ' + (1.2 * U) + 'px,#FFFDF7 ' + (2.5 * U) + 'px)';
  wallY('q-fence', 0, 0, 100, 5, linen); wallY('q-fence', 50, 0, 100, 5, linen);
  wallX('q-fence', 0, 0, 50, 5, linen);
  wallX('q-fence', 0, 100, 15, 5, linen); wallX('q-fence', 35, 100, 15, 5, linen);
  wallX('q-gate q-hot', 15, 100, 20, 5, 'linear-gradient(180deg,#C9CDD2 0 3px,transparent 3px),repeating-linear-gradient(90deg,rgba(255,255,255,.12) 0 2px,transparent 2px 10px),linear-gradient(90deg,#2C3E7A,#5B3F8C 30%,#8C2F1E 62%,#FBF8F0 100%)').setAttribute('data-it', 'gate');
  // 60 pillars: bronze sockets, silver-capped posts (two crossed planes each, cheap to draw)
  var POST = 'linear-gradient(0deg,#8A5A2B 0 10%,#C9A87A 10% 88%,#D9DDE2 88%)';
  function pillar(x, y, h, bg) {
    el('q-post', { width: 0.45 * U + 'px', height: h * U + 'px', background: bg || POST }, 'translate3d(' + (px(x) - 0.22 * U) + 'px,' + py(y) + 'px,0) rotateX(90deg)');
    el('q-post', { width: 0.45 * U + 'px', height: h * U + 'px', background: bg || POST }, 'translate3d(' + px(x) + 'px,' + (py(y) - 0.22 * U) + 'px,0) rotateZ(90deg) rotateX(90deg)');
  }
  for (var k = 0; k <= 20; k++) { pillar(0, k * 5, 5.3); pillar(50, k * 5, 5.3); }
  for (var k2 = 1; k2 < 10; k2++) { pillar(k2 * 5, 0, 5.3); if (k2 * 5 <= 15 || k2 * 5 >= 35) pillar(k2 * 5, 100, 5.3); }
  [15, 20, 25, 30, 35].forEach(function (x) { pillar(x, 100, 5.3); });
  // soft contact shadows
  function shadow(x, y, w, d, o) { plane('q-shadow', x, y, w, d, 0.06, 'radial-gradient(ellipse,rgba(60,40,10,' + (o || .35) + ') 0,rgba(60,40,10,0) 70%)'); }
  shadow(17, 7, 16, 37, .45); shadow(21, 66, 8, 8); shadow(23, 49.5, 5, 5, .25);
  // the camp of Israel around the court: simple A-frame tents (two planes each)
  function tentlet(x, y, c, r) {
    var w = 4, d = 3, h = 2.4;
    el('q-tl', { width: w * U + 'px', height: Math.hypot(d / 2, h) * U + 'px', background: c }, 'translate3d(' + px(x) + 'px,' + py(y) + 'px,0) rotateZ(' + r + 'deg) rotateX(' + (90 - Math.atan2(h, d / 2) * 180 / Math.PI) + 'deg)');
    el('q-tl q-tl2', { width: w * U + 'px', height: Math.hypot(d / 2, h) * U + 'px', background: c }, 'translate3d(' + px(x) + 'px,' + py(y) + 'px,0) rotateZ(' + (r + 180) + 'deg) translateX(' + (-w * U) + 'px) translateY(' + (-d * U) + 'px) rotateX(' + (90 - Math.atan2(h, d / 2) * 180 / Math.PI) + 'deg)');
  }
  var TC = ['#8B7355', '#6E5B45', '#9C8462', '#7D6650'];
  for (var t = 0; t < 46; t++) {
    var a = t / 46 * Math.PI * 2, rx = 46 + (t % 3) * 4, ry = 78 + (t % 2) * 5;
    var tx = 25 + Math.cos(a) * rx, ty = 50 + Math.sin(a) * ry;
    if (ty > 108 && Math.abs(tx - 25) < 18) continue; // keep the east approach open
    if (tx < G.x0 + 3 || tx > G.x0 + G.w - 6 || ty < G.y0 + 2 || ty > G.y0 + G.h - 4) continue;
    tentlet(tx, ty, TC[t % 4], (a * 180 / Math.PI) + 90);
  }

  // the tent: gold boards on silver sockets; the four coverings drape over the top and down the sides
  var boards = 'linear-gradient(0deg,#C8CCD1 0 7%,transparent 7%),repeating-linear-gradient(90deg,#D4AF46 0,#E6C766 ' + (0.75 * U) + 'px,#B8932F ' + (1.5 * U - 2) + 'px,#7A5F1C ' + (1.5 * U - 2) + 'px ' + 1.5 * U + 'px)';
  wallY('q-tent', 20, 10, 30, 10, boards); wallY('q-tent', 30, 10, 30, 10, boards);
  wallX('q-tent', 20, 10, 10, 10, boards);
  var screen = 'repeating-linear-gradient(90deg,rgba(255,255,255,.10) 0 2px,transparent 2px 9px),linear-gradient(90deg,#2C3E7A,#5B3F8C 35%,#8C2F1E 70%,#F4EEDF)';
  wallX('q-tent q-door q-fade', 20, 40, 10, 10, screen);
  [20, 22.5, 25, 27.5, 30].forEach(function (x) { pillar(x, 40, 10, 'linear-gradient(0deg,#9C7A3A 0 6%,#E3C25A 6%)'); });
  var veil = wallX('q-veil q-hot', 20, 20, 10, 10, 'radial-gradient(ellipse at 30% 45%,rgba(232,201,120,.55) 0 9%,transparent 10%),radial-gradient(ellipse at 70% 45%,rgba(232,201,120,.55) 0 9%,transparent 10%),repeating-linear-gradient(90deg,rgba(255,255,255,.08) 0 2px,transparent 2px 8px),linear-gradient(90deg,#24346B,#4B3A86 45%,#8C2F1E)');
  veil.setAttribute('data-it', 'veil');
  [21.25, 23.75, 26.25, 28.75].forEach(function (x) { pillar(x, 20.2, 10, 'linear-gradient(0deg,#C8CCD1 0 6%,#E3C25A 6%)'); });
  plane('q-floor-in', 20, 10, 10, 30, 0.08, 'repeating-linear-gradient(0deg,#E7D9B3 0 ' + 1.5 * U + 'px,#DCCB9E ' + 1.5 * U + 'px ' + (1.5 * U + 1) + 'px)');
  // coverings: tachash on top, ram skins (red) and goat hair showing at the hem
  var cover = 'linear-gradient(180deg,#5A4C40 0 86%,#3E3530 86% 92%,#8C2F1E 92%)';
  var roof = plane('q-roof', 19.3, 9.3, 11.4, 31.4, 10.05, 'repeating-linear-gradient(90deg,rgba(0,0,0,.06) 0 1px,transparent 1px ' + 2 * U + 'px),linear-gradient(90deg,#4E4238,#62554A 50%,#4E4238)');
  el('q-roof q-drape', { width: 31.4 * U + 'px', height: 7 * U + 'px', background: cover }, 'translate3d(' + px(19.3) + 'px,' + py(9.3) + 'px,' + 10.05 * U + 'px) rotateZ(90deg) rotateX(-90deg)');
  el('q-roof q-drape', { width: 31.4 * U + 'px', height: 7 * U + 'px', background: cover }, 'translate3d(' + px(30.7) + 'px,' + py(9.3) + 'px,' + 10.05 * U + 'px) rotateZ(90deg) rotateX(-90deg)');
  el('q-roof q-drape', { width: 11.4 * U + 'px', height: 7 * U + 'px', background: cover }, 'translate3d(' + px(19.3) + 'px,' + py(9.3) + 'px,' + 10.05 * U + 'px) rotateX(-90deg)');

  // furniture
  function addItem(id, parts) { parts.forEach(function (p) { p.classList.add('q-hot'); p.setAttribute('data-it', id); }); }
  addItem('altar', box('q-brz', 22.5, 67.5, 5, 5, 3, 'radial-gradient(circle,#F2A13B 0 18%,#9A4E21 40%,#6A3414)', '#8A4A20', '#73401C'));
  ['22.5,67.5', '27,67.5', '22.5,72', '27,72'].forEach(function (c) { var a = c.split(','); box('q-brz q-horn', +a[0], +a[1], 0.5, 0.5, 0.6, '#B8642B', '#8A4A20', null, 3); });
  plane('q-grate', 22.4, 67.4, 5.2, 5.2, 1.4, 'transparent').style.boxShadow = 'inset 0 0 0 3px #5A3315';
  box('q-brz', 21.2, 69.5, 7.6, 0.25, 0.25, '#B8642B', '#8A4A20', null, 1.6);
  var fire = el('q-fire', {}, 'translate3d(' + px(25) + 'px,' + py(70) + 'px,' + 3 * U + 'px) rotateX(-90deg)');
  box('q-brz', 24.6, 51.6, 0.8, 0.8, 1.2, '#7A4A20', '#87592A', '#73401C');
  addItem('laver', box('q-brz q-basin', 23.9, 50.9, 2.2, 2.2, 0.9, 'radial-gradient(circle,#8FC6D0 0 55%,#2E7D86 56%,#7A4A20 70%)', '#9A6A2E', '#87592A', 1.2));
  addItem('table', box('q-gld', 27.5, 25, 1.5, 3, 1.5, 'repeating-linear-gradient(0deg,#E8D9A8 0 10px,#C49A2C 10px 12px)', '#C49A2C', '#A9831F'));
  [[27.6, 25.3], [27.6, 26.6]].forEach(function (c) { box('q-gld', c[0] + 0.1, c[1], 1.1, 1.1, 0.5, 'repeating-linear-gradient(90deg,#E9C98C 0 5px,#D6AE6B 5px 6px)', '#C99A55', '#B88A48', 1.5); });
  addItem('incense', box('q-gld', 24.5, 21.5, 1, 1, 2, 'radial-gradient(circle,#F7E2A0,#B08A2E)', '#B08A2E', '#977620'));
  var lamp = el('q-lamp q-hot', {}, 'translate3d(' + px(21.75) + 'px,' + py(26.5) + 'px,0) rotateZ(90deg) rotateX(90deg)', W,
    '<svg viewBox="0 0 64 64"><path d="M32 18v36M22 58h20M32 46c-14 0-20-10-20-28M32 46c14 0 20-10 20-28M32 40c-8 0-12-8-12-22M32 40c8 0 12-8 12-22M32 34c-3 0-5-6-5-16M32 34c3 0 5-6 5-16" fill="none" stroke="#E2B53C" stroke-width="3" stroke-linecap="round"/><g fill="#FFD36B"><circle cx="12" cy="14" r="3"/><circle cx="20" cy="14" r="3"/><circle cx="27" cy="14" r="3"/><circle cx="32" cy="12" r="3"/><circle cx="37" cy="14" r="3"/><circle cx="44" cy="14" r="3"/><circle cx="52" cy="14" r="3"/></g></svg>');
  lamp.setAttribute('data-it', 'lamp');
  addItem('ark', box('q-gld q-ark', 23.75, 14.25, 2.5, 1.5, 1.5, 'linear-gradient(90deg,#FFE9A8,#D9B04A)', '#C9A13B', '#B08A2E'));
  box('q-gld', 23.6, 14.1, 0.18, 1.8, 0.18, '#E8C35A', '#C9A13B', null, 0.5); box('q-gld', 26.22, 14.1, 0.18, 1.8, 0.18, '#E8C35A', '#C9A13B', null, 0.5);
  [23.9, 25.8].forEach(function (x, k) {
    var c = el('q-cher q-hot', {}, 'translate3d(' + px(x) + 'px,' + py(15) + 'px,' + 1.5 * U + 'px) rotateZ(90deg) rotateX(90deg)', W,
      '<svg viewBox="0 0 40 40"><path d="' + (k ? 'M4 38C8 22 20 10 36 4C30 16 24 26 22 38z' : 'M36 38C32 22 20 10 4 4C10 16 16 26 18 38z') + '" fill="#E8C35A" stroke="#9C7A22" stroke-width="1"/></svg>');
    c.setAttribute('data-it', 'ark');
  });
  // glory cloud above the most holy place
  var glory = el('q-glory', {}, 'translate3d(' + px(25) + 'px,' + py(15) + 'px,' + 13 * U + 'px)');

  // numbered pins (billboards: turned to face the camera)
  var pins = [];
  var PIN = { gate: [25, 101, 6], altar: [25, 70, 5], laver: [25, 52, 4], table: [28.25, 26.5, 12], lamp: [21.75, 26.5, 12], incense: [25, 22, 12], veil: [25, 20, 12.5], ark: [25, 15, 12] };
  items.forEach(function (it, i) {
    var p = PIN[it.id]; if (!p) return;
    var e = el('q-pin', { '--c': it.color }, '', W, '<b>' + it.num + '</b>');
    e.setAttribute('data-it', it.id); e.classList.add('q-hot');
    pins.push([e, p]);
  });

  // atonement props: high priest's light, two goats, smoke, blood, outside fire
  var hp = el('q-hp', {}, '', W, '<i></i>');
  var goatA = el('q-goat', { '--c': '#7A2433' }, '', W, '<svg viewBox="0 0 64 64"><path d="M18 14c-2 6 0 12 6 14M46 14c2 6 0 12-6 14M24 26h16c3 0 5 3 5 6v8c0 8-6 14-13 14s-13-6-13-14v-8c0-3 2-6 5-6z" fill="none" stroke="#fff" stroke-width="3"/></svg>');
  var goatB = el('q-goat', { '--c': '#B08A2E' }, '', W, goatA.innerHTML);
  var smoke = el('q-smoke', {}, 'translate3d(' + px(25) + 'px,' + py(15) + 'px,' + 2 * U + 'px)', W, '<i></i><i></i><i></i>');
  var blood = el('q-blood', {}, 'translate3d(' + px(25) + 'px,' + py(15) + 'px,' + 1.56 * U + 'px)', W, '<i></i><i></i><i></i><i></i><i></i><i></i><i></i>');
  var fireOut = el('q-fire q-out', {}, 'translate3d(' + px(-30) + 'px,' + py(118) + 'px,0) rotateX(-90deg)');

  // ---------- camera ----------
  var cam = { yaw: -24, pitch: 58, zoom: 0.62, fx: 25, fy: 52, fz: 0 }, home = JSON.parse(JSON.stringify(cam));
  var fit = function () { var s = Math.min(vp.clientWidth / 420, vp.clientHeight / 520); return Math.max(0.55, Math.min(1.6, s)); };
  function apply(smooth) {
    W.classList.toggle('anim', !!smooth);
    var z = cam.zoom * fit();
    W.style.transform = 'rotateX(' + cam.pitch + 'deg) rotateZ(' + cam.yaw + 'deg) scale(' + z + ') translate3d(' + (-(px(cam.fx) - G.w * U / 2)) + 'px,' + (-(py(cam.fy) - G.h * U / 2)) + 'px,' + (-cam.fz * U) + 'px)';
    var bb = 'rotateZ(' + (-cam.yaw) + 'deg) rotateX(' + (-cam.pitch) + 'deg)';
    pins.forEach(function (p) { p[0].style.transform = 'translate3d(' + px(p[1][0]) + 'px,' + py(p[1][1]) + 'px,' + p[1][2] * U + 'px) ' + bb + ' scale(' + (1 / Math.max(0.7, cam.zoom)) + ')'; });
    [hp, goatA, goatB].forEach(function (e) { if (e._p) e.style.transform = 'translate3d(' + px(e._p[0]) + 'px,' + py(e._p[1]) + 'px,' + (e._p[2] || 0) * U + 'px) ' + bb; });
    glory.style.transform = 'translate3d(' + px(25) + 'px,' + py(15) + 'px,' + 14 * U + 'px) ' + bb;
  }
  function place(e, p) { e._p = p; apply(W.classList.contains('anim')); }
  apply(false);
  window.addEventListener('resize', function () { apply(false); });

  // drag to orbit, pinch / wheel to zoom
  var ptrs = {}, start = null, moved = false;
  vp.addEventListener('pointerdown', function (e) {
    ptrs[e.pointerId] = [e.clientX, e.clientY]; moved = false;
    start = { yaw: cam.yaw, pitch: cam.pitch, zoom: cam.zoom, x: e.clientX, y: e.clientY, d: dist() };
  });
  function dist() { var k = Object.keys(ptrs); if (k.length < 2) return 0; var a = ptrs[k[0]], b = ptrs[k[1]]; return Math.hypot(a[0] - b[0], a[1] - b[1]); }
  vp.addEventListener('pointermove', function (e) {
    if (!ptrs[e.pointerId] || !start) return;
    ptrs[e.pointerId] = [e.clientX, e.clientY];
    var k = Object.keys(ptrs).length;
    if (k >= 2) { var d = dist(); if (start.d) { cam.zoom = clamp(start.zoom * d / start.d, 0.35, 4); moved = true; apply(false); } return; }
    var dx = e.clientX - start.x, dy = e.clientY - start.y;
    if (Math.abs(dx) + Math.abs(dy) > 4 && !moved) { moved = true; try { vp.setPointerCapture(e.pointerId); } catch (er) {} }
    if (!moved) return;
    cam.yaw = start.yaw - dx * 0.35; cam.pitch = clamp(start.pitch - dy * 0.25, 18, 82);
    apply(false);
  });
  function up(e) { delete ptrs[e.pointerId]; if (!Object.keys(ptrs).length) start = null; else start = { yaw: cam.yaw, pitch: cam.pitch, zoom: cam.zoom, x: e.clientX, y: e.clientY, d: dist() }; }
  vp.addEventListener('pointerup', up); vp.addEventListener('pointercancel', up);
  vp.addEventListener('wheel', function (e) { e.preventDefault(); cam.zoom = clamp(cam.zoom * (e.deltaY < 0 ? 1.12 : 0.89), 0.35, 4); apply(false); }, { passive: false });
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  // ---------- controls ----------
  host.addEventListener('click', function (e) {
    var b = e.target.closest('[data-c]');
    if (b) {
      var c = b.getAttribute('data-c');
      if (c === 'in') cam.zoom = clamp(cam.zoom * 1.3, 0.35, 4);
      if (c === 'q-out') cam.zoom = clamp(cam.zoom / 1.3, 0.35, 4);
      if (c === 'reset') { cam = JSON.parse(JSON.stringify(home)); host.classList.remove('open'); select(null); }
      if (c === 'q-roof') host.classList.toggle('open');
      if (c === 'top') { cam.pitch = cam.pitch > 30 ? 12 : 58; cam.yaw = 0; }
      if (c === 'atone') { startTour(); return; }
      if (c === 'exit') { endTour(); return; }
      if (c === 'next') { go(si + 1); return; }
      if (c === 'prev') { go(si - 1); return; }
      apply(true); return;
    }
    if (moved || host.classList.contains('tour')) return;
    var h = e.target.closest('.q-hot');
    if (h) select(h.getAttribute('data-it'));
  });
  function select(id) {
    Array.prototype.forEach.call(W.querySelectorAll('.q-hot'), function (x) { x.classList.toggle('q-sel', !!id && x.getAttribute('data-it') === id); });
    var it = items.filter(function (x) { return x.id === id; })[0];
    if (!it) { info.hidden = true; return; }
    var p = PIN[id];
    cam.fx = p[0]; cam.fy = p[1]; cam.zoom = Math.max(cam.zoom, id === 'q-gate' || id === 'altar' ? 1.4 : 2.2);
    if (p[1] < 41) host.classList.add('open');
    info.hidden = false;
    info.style.setProperty('--c', it.color);
    info.innerHTML = '<div class="t3h"><b>' + it.num + '</b><span><strong>' + it.name + '</strong><small>' + it.mat + '</small></span><button type="button" data-c="reset" aria-label="إغلاق">×</button></div><p>' + it.what + '</p><p class="t3x">' + it.christ + '</p>' + (it.href ? '<a href="' + it.href + '">التفاصيل والشواهد</a>' : '');
    apply(true);
  }

  // ---------- Day of Atonement walk-through ----------
  var si = -1, tourBox = host.querySelector('.t3tour');
  function startTour() { host.classList.add('tour', 'open'); info.hidden = true; select(null); goatA.hidden = goatB.hidden = false; go(0); }
  function endTour() { host.classList.remove('tour', 'fx-smoke', 'fx-blood', 'fx-fire', 'fx-fire2'); si = -1; hp._p = null; hp.style.transform = 'scale(0)'; goatA.hidden = goatB.hidden = true; cam = JSON.parse(JSON.stringify(home)); apply(true); }
  function go(k) {
    if (!steps.length) return;
    si = clamp(k, 0, steps.length - 1);
    var s = steps[si], at = s.at;
    host.classList.toggle('fx-smoke', si >= 3 && si <= 5);
    host.classList.toggle('fx-blood', si >= 4 && si <= 6);
    host.classList.toggle('fx-fire', si === 1 || si === 6 || si === 8);
    host.classList.toggle('fx-fire2', si === 9);
    host.classList.toggle('open', si >= 2 && si <= 6);
    place(hp, [at[0], at[1], 0.5]);
    // goats: wait at the door from the lots onwards; the Lord's goat goes in (step 6), the live goat leaves (step 8)
    place(goatA, si < 2 ? [23.5, 47, 0] : si < 5 ? [23.5, 44, 0] : [23.5, 44, -40]);
    place(goatB, si < 2 ? [26.5, 47, 0] : si < 7 ? [26.5, 44, 0] : [26.5, 132, 0]);
    goatA.style.opacity = si >= 5 ? 0 : 1;
    cam.fx = at[0]; cam.fy = at[1]; cam.zoom = s.zone === 'most' ? 2.6 : s.zone === 'q-wild' || s.zone === 'q-out' ? 0.85 : 1.5;
    cam.pitch = s.zone === 'most' ? 50 : 58;
    apply(true);
    tourBox.querySelector('.n').textContent = s.num;
    tourBox.querySelector('.tt').textContent = s.t;
    tourBox.querySelector('.d').textContent = s.d;
    tourBox.querySelector('.v').innerHTML = s.v + '<small>' + s.ref + '</small>';
    tourBox.style.setProperty('--c', s.color);
    tourBox.querySelector('[data-c="prev"]').disabled = si === 0;
    tourBox.querySelector('[data-c="next"]').disabled = si === steps.length - 1;
    Array.prototype.forEach.call(tourBox.querySelectorAll('.dots i'), function (d, n) { d.classList.toggle('on', n === si); });
  }
  goatA.hidden = goatB.hidden = true; hp.style.transform = 'scale(0)';
  if (host.getAttribute('data-mode') === 'atone') setTimeout(startTour, 400);
  document.addEventListener('keydown', function (e) {
    if (!host.classList.contains('tour')) return;
    if (e.key === 'ArrowLeft') go(si + 1); if (e.key === 'ArrowRight') go(si - 1); if (e.key === 'Escape') endTour();
  });
})();
