// Paul's journeys story map: tabs choose the journey, cards walk through its stops, the map follows.
(function () {
  var root = document.getElementById('pm'); if (!root) return;
  var D = JSON.parse(document.getElementById('pmdata').textContent);
  var svg = root.querySelector('.pmsvg'), routes = svg.querySelector('.routes'), pins = svg.querySelector('.pins');
  var NS = 'http://www.w3.org/2000/svg';
  var W = 1200, H = 680, J = 0, I = -1, vb = [0, 0, W, H], anim = null;
  var rgs = [].slice.call(svg.querySelectorAll('.rg'));
  var AR = function (n) { return String(n).replace(/[0-9]/g, function (d) { return '٠١٢٣٤٥٦٧٨٩'[d]; }); };
  function el(tag, attrs, parent) { var e = document.createElementNS(NS, tag); for (var k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; }
  function d(pts) { return 'M' + pts.map(function (p) { return p[0] + ' ' + p[1]; }).join(' L'); }

  function draw() {
    routes.textContent = ''; pins.textContent = '';
    var S = D[J].stops, pts = S.map(function (s) { return s.xy; });
    el('path', { d: d(pts), class: 'rt-all' }, routes);
    if (I > 0) el('path', { d: d(pts.slice(0, I + 1)), class: 'rt-done' }, routes);
    var seen = {}, seen2 = {}, labelled = [];
    S.forEach(function (s, i) {
      var key = s.xy.join(',');
      var on = i === I, near = I >= 0 && Math.abs(i - I) === 1;
      var g = el('g', { class: 'pmpin' + (on ? ' on' : '') + (I >= 0 && i < I ? ' done' : ''), 'data-i': i, tabindex: 0, role: 'button', 'aria-label': AR(i + 1) + ' ' + s.n }, pins);
      // a city visited twice on one journey keeps one marker: the later number sits on top unless it is the current stop
      if (seen[key] !== undefined && !on) g.setAttribute('class', g.getAttribute('class') + ' dup');
      seen[key] = i;
      g.setAttribute('data-x', s.xy[0]); g.setAttribute('data-y', s.xy[1]);
      el('circle', { cx: 0, cy: 0, r: on ? 13 : 9 }, g);
      var t = el('text', { x: 0, y: on ? 4.5 : 3.6 }, g); t.textContent = AR(i + 1);
      var cur0 = I >= 0 ? S[I].xy : null, k0 = scale();
      var show = on || (near && Math.hypot(s.xy[0] - cur0[0], s.xy[1] - cur0[1]) > 60 * k0);
      if (I < 0) { // overview: one label per place, skipping places too close to one already labelled
        show = !labelled.some(function (q) { return Math.abs(q[0] - s.xy[0]) < 70 && Math.abs(q[1] - s.xy[1]) < 26; });
        if (show) labelled.push(s.xy);
      }
      if (show && !(near && seen2[s.c])) {
        var lb = el('text', { x: 0, y: on ? -20 : -15, class: 'lb' + (on ? ' on' : '') }, g);
        lb.textContent = s.c; seen2[s.c] = 1;
      }
    });
    // current stop on top
    var cur = pins.querySelector('.pmpin.on'); if (cur) pins.appendChild(cur);
    resize();
  }
  // markers and labels keep the same size on screen whatever the zoom
  function scale() { var w = svg.getBoundingClientRect().width || 800; var sl = Math.max(vb[2] / w, vb[3] / (svg.getBoundingClientRect().height || 600)); return sl; }
  function resize() {
    var k = scale();
    pins.querySelectorAll('.pmpin').forEach(function (g) { g.setAttribute('transform', 'translate(' + g.getAttribute('data-x') + ' ' + g.getAttribute('data-y') + ') scale(' + k + ')'); });
    rgs.forEach(function (r) { r.setAttribute('font-size', 15 * k); });
  }

  function fit(pts) {
    var xs = pts.map(function (p) { return p[0]; }), ys = pts.map(function (p) { return p[1]; });
    var x0 = Math.min.apply(0, xs), x1 = Math.max.apply(0, xs), y0 = Math.min.apply(0, ys), y1 = Math.max.apply(0, ys);
    var box = svg.getBoundingClientRect(), asp = (box.width || 4) / (box.height || 3);
    var pad = 110, w = Math.max(x1 - x0 + pad * 2, 560), h = Math.max(y1 - y0 + pad * 2, 320);
    if (w / h > asp) h = w / asp; else w = h * asp;
    var cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
    return [cx - w / 2, cy - h / 2, w, h];
  }
  function camera() {
    var S = D[J].stops, pts;
    if (I < 0) pts = S.map(function (s) { return s.xy; });
    else pts = [S[I].xy].concat(I > 0 ? [S[I - 1].xy] : []).concat(I < S.length - 1 ? [S[I + 1].xy] : []);
    var to = fit(pts), from = vb.slice(), t0 = performance.now(), dur = matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 700;
    cancelAnimationFrame(anim);
    (function step(t) {
      var k = dur ? Math.min(1, (t - t0) / dur) : 1; k = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
      vb = from.map(function (v, n) { return v + (to[n] - v) * k; });
      svg.setAttribute('viewBox', vb.join(' '));
      resize();
      if (k < 1) anim = requestAnimationFrame(step);
    })(t0);
  }

  function show() {
    var sec = root.querySelector('.pmj[data-j="' + J + '"]');
    root.querySelectorAll('.pmj').forEach(function (s) { s.hidden = s !== sec; });
    sec.querySelectorAll('.pmc').forEach(function (c) { c.hidden = +c.dataset.i !== I; });
    root.querySelectorAll('[data-tab]').forEach(function (b) { b.setAttribute('aria-selected', +b.dataset.tab === J ? 'true' : 'false'); });
    var n = D[J].stops.length;
    root.querySelector('.pmcount').textContent = I < 0 ? 'مقدمة الرحلة' : AR(I + 1) + ' / ' + AR(n);
    root.querySelector('[data-step="-1"]').disabled = I < 0 && J === 0;
    var nx = root.querySelector('.pmnext');
    nx.firstChild.nodeValue = I < 0 ? 'ابدأ الرحلة ' : I === n - 1 ? (J < D.length - 1 ? 'الرحلة التالية ' : 'النهاية ') : 'التالي ';
    nx.disabled = I === n - 1 && J === D.length - 1;
    var panel = root.querySelector('.pmcards'); panel.scrollTop = 0;
    draw(); camera();
    try { history.replaceState(null, '', '#j' + (J + 1) + (I >= 0 ? '-' + (I + 1) : '')); } catch (e) {}
  }
  function go(j, i) { J = j; I = i; show(); }
  function step(k) {
    var n = D[J].stops.length, i = I + k;
    if (i >= n) { if (J < D.length - 1) return go(J + 1, -1); return; }
    if (i < -1) { if (J > 0) return go(J - 1, D[J - 1].stops.length - 1); return; }
    go(J, i);
  }

  root.addEventListener('click', function (e) {
    var b = e.target.closest('[data-tab]'); if (b) return go(+b.dataset.tab, -1);
    b = e.target.closest('[data-step]'); if (b) return step(+b.dataset.step);
    b = e.target.closest('[data-go]'); if (b) return go(J, +b.dataset.go);
    b = e.target.closest('.pmpin'); if (b) return go(J, +b.dataset.i);
  });
  pins.addEventListener('keydown', function (e) { var g = e.target.closest('.pmpin'); if (g && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); go(J, +g.dataset.i); } });
  document.addEventListener('keydown', function (e) {
    if (/input|textarea/i.test((e.target.tagName || ''))) return;
    if (e.key === 'ArrowLeft') step(1); else if (e.key === 'ArrowRight') step(-1);
  });
  // swipe on the cards (RTL: swipe left = next)
  var sx = null, sy = null, cards = root.querySelector('.pmcards');
  cards.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
  cards.addEventListener('touchend', function (e) {
    if (sx === null) return; var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy; sx = null;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) step(dx < 0 ? 1 : -1);
  });
  addEventListener('resize', function () { camera(); });

  var m = /^#j(\d)(?:-(\d+))?$/.exec(location.hash);
  if (m && D[m[1] - 1]) { J = m[1] - 1; I = m[2] ? Math.min(+m[2] - 1, D[J].stops.length - 1) : -1; }
  show();
})();
