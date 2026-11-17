// Paul's journeys: tabs pick the journey; the step bar, the cards (horizontal, swipeable), the markers, the arrows
// and Play all move to a stop. Moving forward one stop animates a traveller along the route.
(function () {
  var root = document.getElementById('pm'); if (!root) return;
  var D = JSON.parse(document.getElementById('pmdata').textContent);
  var svg = root.querySelector('.pmsvg'), routes = svg.querySelector('.routes'), pins = svg.querySelector('.pins'), trav = svg.querySelector('.trav');
  var steps = root.querySelector('.pmsteps'), track = root.querySelector('.pmtrack');
  var NS = 'http://www.w3.org/2000/svg', W = 1200, H = 680;
  var J = 0, I = -1, vb = [0, 0, W, H], cam = null, run = null, playing = null, lock = false;
  var rgs = [].slice.call(svg.querySelectorAll('.rg'));
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var AR = function (n) { return String(n).replace(/[0-9]/g, function (d) { return '٠١٢٣٤٥٦٧٨٩'[d]; }); };
  function el(tag, a, p) { var e = document.createElementNS(NS, tag); for (var k in a) e.setAttribute(k, a[k]); if (p) p.appendChild(e); return e; }
  function pd(pts) { return 'M' + pts.map(function (p) { return p[0] + ' ' + p[1]; }).join(' L'); }
  function S() { return D[J].stops; }
  function k() { var r = svg.getBoundingClientRect(); return Math.max(vb[2] / (r.width || 800), vb[3] / (r.height || 500)); }

  // ---------- map ----------
  var donePath = null;
  function draw(upto) {
    if (upto === undefined) upto = I;
    routes.textContent = ''; pins.textContent = '';
    var col = D[J].col, st = S(), pts = st.map(function (s) { return s.xy; });
    root.style.setProperty('--jc', col);
    el('path', { d: pd(pts), class: 'rt-all', stroke: col }, routes);
    donePath = el('path', { d: pd(pts.slice(0, Math.max(upto, 0) + 1)), class: 'rt-done', stroke: col }, routes);
    for (var n = 1; n < pts.length; n++) { // arrows half-way on each leg show the direction of travel
      var a = pts[n - 1], b = pts[n]; if (a[0] === b[0] && a[1] === b[1]) continue;
      var g = el('g', { class: 'rt-arw' + (n <= upto ? ' on' : ''), 'data-x': (a[0] + b[0]) / 2, 'data-y': (a[1] + b[1]) / 2, 'data-r': Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI }, routes);
      el('path', { d: 'M-5 -5 L4 0 L-5 5', fill: 'none', stroke: col }, g);
    }
    var labelled = [], seen = {}, s0 = k();
    st.forEach(function (s, i) {
      var on = i === I, done = I >= 0 && i < I, key = s.xy.join(',');
      var g = el('g', { class: 'pmpin' + (on ? ' on' : '') + (done ? ' done' : '') + (seen[key] !== undefined && !on ? ' dup' : ''), 'data-i': i, 'data-x': s.xy[0], 'data-y': s.xy[1], tabindex: 0, role: 'button', 'aria-label': AR(i + 1) + ' ' + s.n }, pins);
      seen[key] = i;
      el('circle', { r: on ? 14 : 10, fill: on || done ? col : '#fff', stroke: on ? '#fff' : col }, g);
      el('text', { y: on ? 4.6 : 3.8, fill: on || done ? '#fff' : col }, g).textContent = AR(i + 1);
      var show = on;
      if (I < 0) { show = !labelled.some(function (q) { return Math.abs(q[0] - s.xy[0]) < 75 * s0 && Math.abs(q[1] - s.xy[1]) < 26 * s0; }); if (show) labelled.push(s.xy); }
      if (show) el('text', { y: on ? -22 : -16, class: 'lb' + (on ? ' on' : '') }, g).textContent = s.c;
    });
    var cur = pins.querySelector('.on'); if (cur) pins.appendChild(cur);
    trav.style.display = 'none';
    resize();
  }
  function resize() {
    var s = k();
    pins.querySelectorAll('.pmpin').forEach(function (g) { g.setAttribute('transform', 'translate(' + g.dataset.x + ' ' + g.dataset.y + ') scale(' + s + ')'); });
    routes.querySelectorAll('.rt-arw').forEach(function (g) { g.setAttribute('transform', 'translate(' + g.dataset.x + ' ' + g.dataset.y + ') rotate(' + g.dataset.r + ') scale(' + s + ')'); });
    trav.setAttribute('transform', (trav.dataset.t || 'translate(0 0)') + ' scale(' + s + ')');
    rgs.forEach(function (r) { r.setAttribute('font-size', 15 * s); });
    routes.querySelectorAll('.rt-all').forEach(function (p) { p.setAttribute('stroke-width', 2 * s); p.setAttribute('stroke-dasharray', 7 * s + ' ' + 7 * s); });
    if (donePath) donePath.setAttribute('stroke-width', 3.6 * s);
  }
  function fit(pts) {
    var xs = pts.map(function (p) { return p[0]; }), ys = pts.map(function (p) { return p[1]; });
    var x0 = Math.min.apply(0, xs), x1 = Math.max.apply(0, xs), y0 = Math.min.apply(0, ys), y1 = Math.max.apply(0, ys);
    var r = svg.getBoundingClientRect(), asp = (r.width || 4) / (r.height || 3);
    var w = Math.max(x1 - x0 + 220, 520), h = Math.max(y1 - y0 + 200, 300);
    if (w / h > asp) h = w / asp; else w = h * asp;
    return [(x0 + x1) / 2 - w / 2, (y0 + y1) / 2 - h / 2, w, h];
  }
  function camera(dur) {
    var st = S(), pts = I < 0 ? st.map(function (s) { return s.xy; }) : [st[I].xy].concat(I > 0 ? [st[I - 1].xy] : [], I < st.length - 1 ? [st[I + 1].xy] : []);
    var to = fit(pts), from = vb.slice(), t0 = performance.now(); dur = reduce ? 0 : dur;
    cancelAnimationFrame(cam);
    (function f(t) {
      var e = dur ? Math.min(1, (t - t0) / dur) : 1; e = e < .5 ? 2 * e * e : 1 - Math.pow(-2 * e + 2, 2) / 2;
      vb = from.map(function (v, n) { return v + (to[n] - v) * e; }); svg.setAttribute('viewBox', vb.join(' ')); resize();
      if (e < 1) cam = requestAnimationFrame(f);
    })(t0);
  }
  // traveller from stop a to stop b, drawing the travelled route as it goes
  function travel(a, b, done) {
    var st = S(), A = st[a].xy, B = st[b].xy, t0 = performance.now(), dur = reduce ? 0 : 1100;
    donePath.setAttribute('d', pd(st.slice(0, b + 1).map(function (s) { return s.xy; })));
    var L = donePath.getTotalLength(), seg = Math.hypot(B[0] - A[0], B[1] - A[1]);
    trav.style.display = '';
    cancelAnimationFrame(run);
    (function f(t) {
      var e = dur ? Math.min(1, (t - t0) / dur) : 1; e = e < .5 ? 2 * e * e : 1 - Math.pow(-2 * e + 2, 2) / 2;
      trav.dataset.t = 'translate(' + (A[0] + (B[0] - A[0]) * e) + ' ' + (A[1] + (B[1] - A[1]) * e) + ')'; resize();
      donePath.setAttribute('stroke-dasharray', L + ' ' + L); donePath.setAttribute('stroke-dashoffset', (1 - e) * seg);
      if (e < 1) run = requestAnimationFrame(f); else { trav.style.display = 'none'; done(); }
    })(t0);
  }

  // ---------- steps and cards ----------
  function buildSteps() {
    steps.innerHTML = '<button type="button" data-go="-1" class="s0">المقدمة</button>' + S().map(function (s, i) {
      return '<button type="button" data-go="' + i + '" title="' + s.n.replace(/"/g, '&quot;') + '"><i>' + AR(i + 1) + '</i><span>' + s.c + '</span></button>';
    }).join('');
  }
  function paintSteps() {
    steps.querySelectorAll('[data-go]').forEach(function (b) { var i = +b.dataset.go; b.classList.toggle('on', i === I); b.classList.toggle('done', i >= 0 && i < I); });
    var on = steps.querySelector('.on');
    if (on) { var r = on.getBoundingClientRect(), sr = steps.getBoundingClientRect(); steps.scrollBy({ left: (r.left + r.width / 2) - (sr.left + sr.width / 2), behavior: reduce ? 'auto' : 'smooth' }); }
  }
  function row() { return track.querySelector('.pmrow[data-j="' + J + '"]'); }
  function showCard(smooth) {
    var r = row(), c = r.querySelector('.pmc[data-i="' + I + '"]');
    r.querySelectorAll('.pmc').forEach(function (x) { x.classList.toggle('on', x === c); });
    lock = true; clearTimeout(showCard.t);
    var cr = c.getBoundingClientRect(), tr = track.getBoundingClientRect();
    track.scrollBy({ left: (cr.left + cr.width / 2) - (tr.left + tr.width / 2), behavior: smooth && !reduce ? 'smooth' : 'auto' });
    showCard.t = setTimeout(function () { lock = false; }, 800);
  }

  // ---------- state ----------
  function go(j, i, how) {
    var forward = j === J && i === I + 1 && i > 0 && how === 'next';
    var tabChange = j !== J;
    J = j; I = i;
    root.querySelectorAll('[data-tab]').forEach(function (b) { b.setAttribute('aria-selected', +b.dataset.tab === J ? 'true' : 'false'); });
    track.querySelectorAll('.pmrow').forEach(function (r) { r.hidden = +r.dataset.j !== J; });
    if (tabChange) buildSteps();
    if (forward) { draw(I - 1); camera(900); travel(I - 1, I, function () { draw(); }); }
    else { draw(); camera(tabChange ? 0 : 750); }
    paintSteps(); if (how !== 'scroll') showCard(!tabChange);
    try { history.replaceState(null, '', '#j' + (J + 1) + (I >= 0 ? '-' + (I + 1) : '')); } catch (e) {}
  }
  function step(d) {
    var n = S().length, i = I + d;
    if (i >= n) return J < D.length - 1 ? go(J + 1, -1, 'jump') : stop();
    if (i < -1) return J > 0 ? go(J - 1, D[J - 1].stops.length - 1, 'jump') : null;
    go(J, i, d === 1 ? 'next' : 'jump');
  }
  function stop() { if (!playing) return; clearInterval(playing); playing = null; root.classList.remove('playing'); root.querySelector('[data-play] span').textContent = 'شاهد الرحلة'; }
  function play() {
    if (playing) return stop();
    root.classList.add('playing'); root.querySelector('[data-play] span').textContent = 'إيقاف';
    if (I >= S().length - 1) go(J, -1, 'jump');
    step(1); playing = setInterval(function () { if (I >= S().length - 1) return stop(); step(1); }, 4200);
  }
  var how = function (i) { return i === I + 1 ? 'next' : 'jump'; };

  root.addEventListener('click', function (e) {
    var b = e.target.closest('[data-play]'); if (b) return play();
    if (e.target.closest('a,summary')) { stop(); return; }
    b = e.target.closest('[data-tab]'); if (b) { stop(); return go(+b.dataset.tab, -1, 'jump'); }
    b = e.target.closest('[data-step]'); if (b) { stop(); return step(+b.dataset.step); }
    b = e.target.closest('[data-go]'); if (b) { stop(); return go(J, +b.dataset.go, how(+b.dataset.go)); }
    b = e.target.closest('.pmpin'); if (b) { stop(); return go(J, +b.dataset.i, how(+b.dataset.i)); }
    b = e.target.closest('.pmc'); if (b && +b.dataset.i !== I) { stop(); return go(J, +b.dataset.i, how(+b.dataset.i)); }
  });
  pins.addEventListener('keydown', function (e) { var g = e.target.closest('.pmpin'); if (g && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); go(J, +g.dataset.i, 'jump'); } });
  document.addEventListener('keydown', function (e) {
    if (/input|textarea|summary/i.test(e.target.tagName || '')) return;
    if (e.key === 'ArrowLeft') { stop(); step(1); } else if (e.key === 'ArrowRight') { stop(); step(-1); }
  });
  // swiping the cards: when scrolling settles, the card nearest the middle becomes the current stop
  var settle;
  track.addEventListener('scroll', function () {
    if (lock) return; clearTimeout(settle);
    settle = setTimeout(function () {
      var tr = track.getBoundingClientRect(), mid = tr.left + tr.width / 2, best = null, bd = 1e9;
      row().querySelectorAll('.pmc').forEach(function (c) { var r = c.getBoundingClientRect(), d = Math.abs(r.left + r.width / 2 - mid); if (d < bd) { bd = d; best = c; } });
      if (best && +best.dataset.i !== I) { stop(); var i = +best.dataset.i; go(J, i, i === I + 1 ? 'next' : 'scroll'); showCard(true); }
    }, 160);
  }, { passive: true });
  addEventListener('resize', function () { camera(0); showCard(false); });

  buildSteps();
  var m = /^#j(\d)(?:-(\d+))?$/.exec(location.hash);
  if (m && D[m[1] - 1]) { J = m[1] - 1; buildSteps(); go(J, m[2] ? Math.min(+m[2] - 1, D[J].stops.length - 1) : -1, 'jump'); }
  else go(0, -1, 'jump');
})();
