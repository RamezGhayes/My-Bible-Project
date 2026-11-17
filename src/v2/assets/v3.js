/* v3 behaviour (design-v3). Nothing here is saved between visits. */
(function () {
  'use strict';
  var $ = function (s, e) { return (e || document).querySelector(s); };
  var $$ = function (s, e) { return Array.prototype.slice.call((e || document).querySelectorAll(s)); };
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- rails: horizontal card rows with prev/next buttons (RTL aware) ----------
  $$('[data-rail]').forEach(function (rail) {
    var k = rail.getAttribute('data-rail');
    var prev = $('[data-rail-prev="' + k + '"]'), next = $('[data-rail-next="' + k + '"]');
    var stepW = function () { var c = rail.children[0]; return c ? c.getBoundingClientRect().width + 16 : 300; };
    // In RTL, scrollLeft is 0 at the start and negative going forward (modern browsers).
    var go = function (d) { rail.scrollBy({ left: -d * stepW(), behavior: reduce ? 'auto' : 'smooth' }); };
    var paint = function () {
      var max = rail.scrollWidth - rail.clientWidth, x = Math.abs(rail.scrollLeft);
      if (prev) prev.disabled = x < 4;
      if (next) next.disabled = x > max - 4;
    };
    if (prev) prev.addEventListener('click', function () { go(-1); });
    if (next) next.addEventListener('click', function () { go(1); });
    rail.addEventListener('scroll', paint, { passive: true });
    window.addEventListener('resize', paint);
    paint();
  });

  // ---------- tabs that filter cards by group: [data-tg] buttons, [data-g] cards in the next .h3cg ----------
  $$('[role=tablist]').forEach(function (bar) {
    var btns = $$('[data-tg]', bar);
    if (!btns.length) return;
    var grid = bar.nextElementSibling;
    btns.forEach(function (b) {
      b.addEventListener('click', function () {
        var g = b.getAttribute('data-tg');
        btns.forEach(function (o) { o.setAttribute('aria-selected', o === b ? 'true' : 'false'); });
        $$('[data-g]', grid).forEach(function (c, i) {
          var on = c.getAttribute('data-g') === g;
          c.hidden = !on;
          if (on) c.style.animationDelay = (i % 12) * 0.04 + 's';
        });
      });
    });
  });

  // ---------- plagues: threads ----------
  $$('[data-threads]').forEach(function (box) {
    var tabs = $$('[data-th]', box), det = $('.det', box);
    var pick = function (c) {
      $$('.pt3c', box).forEach(function (o) { if (o.tagName === 'BUTTON') o.setAttribute('aria-pressed', o === c ? 'true' : 'false'); });
      det.innerHTML = '<b></b><span></span>'; $('b', det).textContent = c.getAttribute('data-h'); $('span', det).textContent = c.getAttribute('data-t');
    };
    tabs.forEach(function (t) {
      t.addEventListener('click', function () {
        tabs.forEach(function (o) { o.setAttribute('aria-selected', o === t ? 'true' : 'false'); });
        $$('[data-pane]', box).forEach(function (p) { p.hidden = p.getAttribute('data-pane') !== t.getAttribute('data-th'); });
        var first = $('[data-pane="' + t.getAttribute('data-th') + '"] .pt3c:not(.none)', box);
        if (first) pick(first);
      });
    });
    box.addEventListener('click', function (e) { var c = e.target.closest('button.pt3c'); if (c) pick(c); });
    var start = $('[data-pane]:not([hidden]) button.pt3c:nth-child(6)', box); if (start) pick(start);
  });

  // ---------- plagues: Passover night (blood, night, the Lord passes over) ----------
  $$('[data-pass]').forEach(function (sec) {
    var caps = $$('i', $('template[data-caps]', sec).content), q = $('[data-cap]', sec), r = $('[data-capref]', sec), btn = $('[data-play]', sec), ts = [];
    sec.classList.add('armed');
    var cap = function (k) { q.textContent = caps[k].getAttribute('data-t'); r.textContent = caps[k].getAttribute('data-r'); };
    var reset = function () { ts.forEach(clearTimeout); ts = []; sec.classList.remove('blood', 'night', 'dark', 'done'); };
    btn.addEventListener('click', function () {
      reset();
      var t = reduce ? 0.35 : 1;
      sec.classList.add('blood'); cap(0);
      ts.push(setTimeout(function () { sec.classList.add('night'); cap(1); }, 2600 * t));
      ts.push(setTimeout(function () { sec.classList.add('dark'); cap(2); }, 4800 * t));
      ts.push(setTimeout(function () { sec.classList.add('done'); btn.textContent = 'أعد المشهد'; }, 7000 * t));
    });
  });

  // ---------- disclosure cards: [data-deep] opens its panel, one at a time ----------
  var deeps = $$('[data-deep]');
  deeps.forEach(function (b) {
    b.addEventListener('click', function () {
      var open = b.getAttribute('aria-expanded') !== 'true';
      deeps.forEach(function (o) { o.setAttribute('aria-expanded', 'false'); $('em', o).textContent = 'افتح'; var p = document.getElementById(o.getAttribute('aria-controls')); if (p) p.hidden = true; });
      if (open) { b.setAttribute('aria-expanded', 'true'); $('em', b).textContent = 'إغلاق'; var p = document.getElementById(b.getAttribute('aria-controls')); p.hidden = false; }
    });
  });

  // ---------- in-page section nav highlights the section in view ----------
  var pnav = $$('.p3nav a');
  if (pnav.length && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) pnav.forEach(function (a) { a.classList.toggle('on', a.getAttribute('href') === '#' + en.target.id); }); }); }, { rootMargin: '-40% 0px -55% 0px' });
    pnav.forEach(function (a) { var t = document.querySelector(a.getAttribute('href')); if (t) io.observe(t); });
  }

  // ---------- quiz: one question at a time, score shown at the end, nothing saved ----------
  $$('[data-quiz]').forEach(function (box) {
    var qs = $$('.qz', box), i = 0, score = 0, nx = $('[data-qnext]', box), end = $('.qend', box), AR = function (n) { return String(n).replace(/\d/g, function (d) { return '٠١٢٣٤٥٦٧٨٩'[d]; }); };
    var show = function () {
      qs.forEach(function (q, k) { q.hidden = k !== i; });
      $('[data-qn]', box).textContent = 'السؤال ' + AR(i + 1) + ' من ' + AR(qs.length);
      $('[data-qbar]', box).style.width = ((i + 1) / qs.length * 100) + '%';
      nx.hidden = true;
    };
    qs.forEach(function (q) {
      var a = +q.getAttribute('data-a');
      $$('.op button', q).forEach(function (b) {
        b.addEventListener('click', function () {
          var k = +b.getAttribute('data-k'), right = k === a;
          if (right) score++;
          $$('.op button', q).forEach(function (o) { o.disabled = true; if (+o.getAttribute('data-k') === a) o.classList.add('ok'); });
          if (!right) b.classList.add('no');
          var w = $('.why', q); $('b', w).textContent = right ? 'إجابة صحيحة.' : 'ليست هذه.'; w.hidden = false;
          nx.textContent = i < qs.length - 1 ? 'السؤال التالي' : 'النتيجة'; nx.hidden = false;
        });
      });
    });
    nx.addEventListener('click', function () {
      if (i < qs.length - 1) { i++; show(); return; }
      qs.forEach(function (q) { q.hidden = true; }); nx.hidden = true;
      $('[data-qscore]', box).textContent = AR(score) + ' من ' + AR(qs.length);
      end.hidden = false;
    });
    $('[data-qagain]', box).addEventListener('click', function () {
      i = 0; score = 0; end.hidden = true;
      qs.forEach(function (q) { $$('.op button', q).forEach(function (o) { o.disabled = false; o.classList.remove('ok', 'no'); }); $('.why', q).hidden = true; });
      show();
    });
  });

  // ---------- presentation mode ----------
  var ps = $('[data-present]');
  if (ps) {
    var sl = $$('.sl', ps), th = $$('[data-go-sl]', ps), notes = $$('.ps-notes p', ps), aside = $('.ps-notes', ps), nb = $('[data-notes]', ps), cur = 0;
    var go = function (k) {
      cur = Math.max(0, Math.min(sl.length - 1, k));
      sl.forEach(function (s, i) { s.hidden = i !== cur; });
      notes.forEach(function (n, i) { n.hidden = i !== cur; });
      th.forEach(function (t, i) { t.setAttribute('aria-selected', i === cur ? 'true' : 'false'); });
      var t = th[cur]; t.parentNode.scrollTo({ left: t.offsetLeft - (t.parentNode.clientWidth - t.clientWidth) / 2, behavior: reduce ? 'auto' : 'smooth' });
      try { history.replaceState(null, '', '#' + (cur + 1)); } catch (e) {}
    };
    var toggleNotes = function () { aside.hidden = !aside.hidden; nb.setAttribute('aria-pressed', aside.hidden ? 'false' : 'true'); };
    var fs = function () { try { if (document.fullscreenElement) document.exitFullscreen(); else ps.requestFullscreen(); } catch (e) {} };
    $('[data-prev]', ps).addEventListener('click', function () { go(cur - 1); });
    $('[data-next]', ps).addEventListener('click', function () { go(cur + 1); });
    th.forEach(function (t, i) { t.addEventListener('click', function () { go(i); }); });
    nb.addEventListener('click', toggleNotes);
    $('[data-fs]', ps).addEventListener('click', fs);
    document.addEventListener('keydown', function (e) {
      if (e.target.closest && e.target.closest('input,textarea')) return;
      if (e.key === 'ArrowLeft' || e.key === ' ' || e.key === 'PageDown') { e.preventDefault(); go(cur + 1); }
      else if (e.key === 'ArrowRight' || e.key === 'PageUp') { e.preventDefault(); go(cur - 1); }
      else if (e.key === 'Home') go(0); else if (e.key === 'End') go(sl.length - 1);
      else if (e.key === 'n' || e.key === 'N') toggleNotes(); else if (e.key === 'f' || e.key === 'F') fs();
    });
    var h = +(location.hash.slice(1)); if (h) go(h - 1);
  }

  // ---------- topic intro: replay / skip ----------
  $$('[data-intro]').forEach(function (h) {
    var r = $('[data-replay]', h), k = $('[data-skip]', h);
    k.addEventListener('click', function () { h.classList.add('skip'); k.hidden = true; });
    r.addEventListener('click', function () {
      h.classList.remove('skip'); k.hidden = false;
      h.classList.add('reset'); void h.offsetWidth; h.classList.remove('reset');
    });
  });

  // ---------- family tree: pick a name, show its card ----------
  var tree = $('.tr3');
  if (tree) {
    var slot = $('.slot', tree), tpl = $('template[data-cards]', tree).content;
    var pickN = function (b) {
      $$('[data-node]', tree).forEach(function (o) { o.setAttribute('aria-pressed', o === b ? 'true' : 'false'); });
      var c = tpl.querySelector('[data-card="' + b.getAttribute('data-node') + '"]');
      if (c) { slot.innerHTML = c.innerHTML; if (window.innerWidth < 980) slot.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' }); }
    };
    $$('[data-node]', tree).forEach(function (b) { b.addEventListener('click', function () { pickN(b); }); });
    var a0 = $('[data-node="abraham"]', tree); if (a0) a0.setAttribute('aria-pressed', 'true');
  }
  // ---------- print the chapter study sheet ----------
  $$('[data-print]').forEach(function (b) { b.addEventListener('click', function () { window.print(); }); });
  // ---------- offline reading: register the service worker (pages you open stay readable offline) ----------
  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
    window.addEventListener('load', function () { navigator.serviceWorker.register((document.body.getAttribute('data-root') || '') + 'sw.js').catch(function () {}); });
  }
  // ---------- chapter study: #s-xxx opens and shows its section ----------
  var openAcc = function () {
    var id = decodeURIComponent(location.hash.slice(1)), d = id && document.getElementById(id);
    if (!d || d.tagName !== 'DETAILS') return;
    d.open = true; d.classList.add('hit'); setTimeout(function () { d.classList.remove('hit'); }, 1600);
    setTimeout(function () { d.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' }); }, 30);
  };
  window.addEventListener('hashchange', openAcc); openAcc();
  // ---------- testament shelf: a spine moves the books carousel to that book ----------
  var spines = $$('[data-spine]');
  if (spines.length) {
    var mark = function (slug) { spines.forEach(function (a) { a.classList.toggle('on', a.getAttribute('data-spine') === slug); }); };
    spines.forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        var slug = a.getAttribute('data-spine'), card = $('.car [data-slug="' + slug + '"]');
        if (card) { card.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', inline: 'center', block: 'nearest' }); setTimeout(function () { var c = $('.car'); if (c) c.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' }); }, 350); }
        mark(slug);
      });
    });
    var m = location.hash.match(/^#b-(.+)$/); if (m) mark(m[1]);
    var car = $('.car'), tsc;
    if (car) car.addEventListener('scroll', function () { clearTimeout(tsc); tsc = setTimeout(function () { var h = location.hash.match(/^#b-(.+)$/); if (h) { mark(h[1]); var sp = $('[data-spine="' + h[1] + '"]'); if (sp) sp.parentNode.scrollTo({ left: sp.offsetLeft - sp.parentNode.clientWidth / 2, behavior: 'auto' }); } }, 150); }, { passive: true });
  }
})();
