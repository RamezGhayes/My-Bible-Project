// The overview journey (overview.html). Each step opens in one large window over the hub: read it, go to the next step
// from inside the window, close it, and you are back where you were. Steps are the existing overview pages, loaded
// into the window. Progress is kept in the browser (sola.ovj = ids of steps opened).
(function () {
  var D = window.OVJ; if (!D) return;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var AR = function (n) { return String(n).replace(/[0-9]/g, function (d) { return '٠١٢٣٤٥٦٧٨٩'[d]; }); };
  var get = function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } };
  var set = function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} };
  var N = D.steps.length, IDX = {}; D.steps.forEach(function (s, i) { IDX[s.id] = i; });
  var seen = []; try { seen = JSON.parse(get('sola.ovj') || '[]').filter(function (id) { return id in IDX; }); } catch (e) {}

  var sheet = $('#obsheet'); document.body.appendChild(sheet);
  var pane = $('.pn', sheet), body = $('#jm-c'), peek = $('.ob-peek', sheet), prevB = $('[data-jm-prev]'), nextB = $('[data-jm-next]');
  var cur = -1, lastFocus = null, cache = {};
  var closePeek = window.obPeek ? window.obPeek(body, peek) : function () {};

  // ---------- hub: progress and "continue" ----------
  var paint = function () {
    $$('[data-step]').forEach(function (a) { a.classList.toggle('seen', seen.indexOf(a.getAttribute('data-step')) >= 0); });
    var cta = $('[data-start-l]'), pr = $('.ovh-prog');
    if (!seen.length) return;
    var next = D.steps.find(function (s) { return seen.indexOf(s.id) < 0; });
    cta.textContent = next ? 'تابع: ' + next.t : 'أنهيت الرحلة. ابدأ من جديد';
    $('[data-start]').setAttribute('data-to', next ? next.id : D.steps[0].id);
    pr.hidden = false; $('[data-prog]').textContent = AR(seen.length) + ' من ' + AR(N);
    $('i > i', pr).style.width = Math.round((seen.length / N) * 100) + '%';
  };

  // ---------- load a step (an overview page) into the window ----------
  var load = function (id) {
    if (!cache[id]) cache[id] = fetch('overview/' + id + '.html').then(function (r) { if (!r.ok) throw 0; return r.text(); }).then(function (t) {
      var doc = new DOMParser().parseFromString(t, 'text/html'), w = doc.querySelector('.ov-w');
      if (!w) throw 0;
      $$('.ov-nav, .c5ch', w).forEach(function (n) { n.remove(); });
      var base = new URL('overview/' + id + '.html', location.href);
      $$('[href]', w).forEach(function (n) { var h = n.getAttribute('href'); if (h && h[0] !== '#' && !/^[a-z]+:/i.test(h)) n.setAttribute('href', new URL(h, base).pathname + new URL(h, base).hash); });
      $$('[src]', w).forEach(function (n) { n.setAttribute('src', new URL(n.getAttribute('src'), base).pathname); });
      return w.innerHTML;
    });
    return cache[id];
  };

  var open = function (i, push) {
    if (i < 0 || i >= N) return;
    cur = i; var s = D.steps[i];
    if (sheet.hidden) { lastFocus = document.activeElement; sheet.hidden = false; document.documentElement.style.overflow = 'hidden'; }
    closePeek();
    $('[data-jm-k]').textContent = s.part + ' · ' + AR(i + 1) + ' من ' + AR(N);
    $('[data-jm-t]').textContent = s.t;
    $('[data-jm-bar]').style.width = ((i + 1) / N * 100) + '%';
    body.innerHTML = '<div class="jm-load"><i></i><i></i><i></i></div>';
    body.scrollTop = 0;
    var p = D.steps[i - 1], n = D.steps[i + 1];
    prevB.hidden = !p; nextB.querySelector('span').textContent = n ? n.t : 'إنهاء';
    if (p) prevB.querySelector('span').textContent = p.t;
    load(s.id).then(function (html) {
      if (cur !== i) return;
      body.innerHTML = '<p class="jm-sub"></p>' + html; body.firstChild.textContent = s.sub;
      body.classList.remove('in'); void body.offsetWidth; body.classList.add('in');
    }).catch(function () { body.innerHTML = '<p class="jm-sub">تعذّر التحميل. <a href="overview/' + s.id + '.html">افتح الصفحة</a></p>'; });
    if (seen.indexOf(s.id) < 0) { seen.push(s.id); set('sola.ovj', JSON.stringify(seen)); paint(); }
    pane.focus({ preventScroll: true });
    var h = '#s-' + s.id;
    if (push !== false) { if (/^#s-/.test(location.hash)) history.replaceState({ jm: 1 }, '', h); else history.pushState({ jm: 1 }, '', h); }
  };
  var close = function (fromPop) {
    if (sheet.hidden) return;
    sheet.hidden = true; document.documentElement.style.overflow = ''; cur = -1;
    if (!fromPop && /^#s-/.test(location.hash)) { if (history.state && history.state.jm) history.back(); else history.replaceState(null, '', location.pathname); }
    var row = lastFocus && lastFocus.closest && lastFocus.closest('[data-step]');
    if (row) row.focus({ preventScroll: true });
  };
  var route = function () { var m = location.hash.match(/^#s-(.+)$/); if (m && m[1] in IDX) open(IDX[m[1]], false); else close(true); };

  // ---------- events ----------
  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-step],[data-start]');
    if (!a || e.metaKey || e.ctrlKey) return;
    e.preventDefault();
    open(IDX[a.getAttribute('data-step') || a.getAttribute('data-to') || D.steps[0].id]);
  });
  sheet.addEventListener('click', function (e) { if (e.target.closest('[data-close]')) close(); });
  prevB.addEventListener('click', function () { open(cur - 1); });
  nextB.addEventListener('click', function () { if (cur < N - 1) open(cur + 1); else close(); });
  // links inside a step that point to another step open it here
  body.addEventListener('click', function (e) {
    var a = e.target.closest('a[href]'); if (!a) return;
    var m = a.getAttribute('href').match(/\/overview\/([a-z0-9-]+)\.html$/);
    if (m && m[1] in IDX) { e.preventDefault(); open(IDX[m[1]]); }
  });
  document.addEventListener('keydown', function (e) {
    if (sheet.hidden) return;
    if (e.key === 'Escape') { if (!peek.hidden) closePeek(); else close(); }
    if (/TEXTAREA|INPUT/.test(document.activeElement.tagName)) return;
    if (e.key === 'ArrowLeft') open(cur + 1);
    if (e.key === 'ArrowRight') open(cur - 1);
  });
  // swipe between steps on touch screens
  var sx = 0, sy = 0;
  body.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
  body.addEventListener('touchend', function (e) { var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy; if (Math.abs(dx) > 80 && Math.abs(dx) > Math.abs(dy) * 2 && !e.target.closest('.ov-tbl,.ob-chart,svg')) open(cur + (dx > 0 ? 1 : -1)); }, { passive: true });
  window.addEventListener('popstate', route);

  paint(); route();
})();
