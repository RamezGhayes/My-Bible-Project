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
      if (c) {
        slot.innerHTML = c.innerHTML;
        var aside = $('.tr3a', tree), sheet = $('.tsheet', tree);
        if (window.innerWidth < 980) { sheet.classList.add('open'); document.body.classList.add('tsheet-on'); sheet.scrollTop = 0; }
        else if (aside) aside.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
      }
    };
    var cl = $('.tclose', tree); if (cl) cl.addEventListener('click', function () { $('.tsheet', tree).classList.remove('open'); document.body.classList.remove('tsheet-on'); });
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
  // ---------- people deck: flip cards and era tabs ----------
  $$('.fl3 .in').forEach(function (b) { b.addEventListener('click', function () { b.setAttribute('aria-pressed', b.getAttribute('aria-pressed') === 'true' ? 'false' : 'true'); }); });
  var eraTabs = $$('[data-era-tab]');
  eraTabs.forEach(function (t) {
    t.addEventListener('click', function () {
      var e = t.getAttribute('data-era-tab');
      eraTabs.forEach(function (o) { o.setAttribute('aria-selected', o === t ? 'true' : 'false'); });
      $$('.fl3').forEach(function (c) { c.hidden = !(e === 'all' || c.getAttribute('data-era') === e); });
    });
  });
  // ---------- map journeys: play the journey stop by stop (camera follows) ----------
  var mapv = $('#mapv');
  if (mapv) {
    var pb = document.createElement('button');
    pb.type = 'button'; pb.className = 'mplay'; pb.setAttribute('aria-pressed', 'false');
    pb.innerHTML = '<span>▶</span> شاهد الرحلة';
    var anchor = $('.minfo', mapv); anchor.parentNode.insertBefore(pb, anchor);
    var tm = null;
    var stop = function () { clearInterval(tm); tm = null; pb.setAttribute('aria-pressed', 'false'); pb.innerHTML = '<span>▶</span> شاهد الرحلة'; };
    var tick = function () { var n = $('[data-step="1"]', mapv); if (!n || n.disabled) { stop(); return; } n.click(); };
    pb.addEventListener('click', function () {
      if (tm) { stop(); return; }
      if (!mapv.classList.contains('z2')) { var z = $('[data-zoom]', mapv); if (z) z.click(); }
      var first = $('.mk[data-i="0"]', mapv); if (first) first.click();
      pb.setAttribute('aria-pressed', 'true'); pb.innerHTML = '<span>❚❚</span> إيقاف';
      tm = setInterval(tick, reduce ? 4500 : 3400);
    });
    mapv.addEventListener('click', function (e) { if (e.isTrusted && tm && !e.target.closest('.mplay')) stop(); });
  }
  // ---------- share a verse: tap verses in the reader, then copy or make an image card ----------
  // Text is copied exactly as shown (Van Dyck). The image is drawn here in the browser; nothing is uploaded.
  var AR2 = function (n) { return String(n).replace(/\d/g, function (d) { return '٠١٢٣٤٥٦٧٨٩'[d]; }); };
  $$('[data-share]').forEach(function (box) {
    var parts = box.getAttribute('data-share').split('|'), book = parts[0], ch = +parts[1];
    var bar = document.createElement('div'); bar.className = 'shr3'; bar.hidden = true;
    bar.innerHTML = '<span data-sl></span><button type="button" data-xr hidden>شواهد مرتبطة</button><button type="button" data-copy>نسخ</button><button type="button" data-img>صورة للمشاركة</button><button type="button" data-clear aria-label="إلغاء التحديد">×</button>';
    document.body.appendChild(bar);
    var sel = [];
    var picked = function () { return sel.slice().sort(function (a, b) { return a - b; }); };
    var refOf = function () { var p = picked(), a = p[0], z = p[p.length - 1]; return book + ' ' + AR2(ch) + ': ' + AR2(a) + (z > a ? '–' + AR2(z) : ''); };
    var textOf = function () { return picked().map(function (n) { var v = box.querySelector('#v' + n).cloneNode(true); var vn = v.querySelector('.vn'); if (vn) vn.remove(); return v.textContent.trim(); }).join(' '); };
    var paint = function () {
      $$('.v', box).forEach(function (v) { v.classList.toggle('sel3', sel.indexOf(+v.id.slice(1)) >= 0); });
      bar.hidden = !sel.length; if (sel.length) $('[data-sl]', bar).textContent = refOf();
      var xb = $('[data-xr]', bar); if (xb) xb.hidden = !(sel.length === 1 && box.hasAttribute('data-xref'));
    };
    var xb0 = $('[data-xr]', bar);
    if (xb0) xb0.addEventListener('click', function () { if (window.openXref) window.openXref(box.getAttribute('data-xref') + '.' + sel[0], refOf()); });
    box.addEventListener('click', function (e) {
      var v = e.target.closest('.v'); if (!v || e.target.closest('a') || e.target.closest('.gw')) return;
      var n = +v.id.slice(1), i = sel.indexOf(n);
      if (i >= 0) sel.splice(i, 1); else if (sel.length < 6) sel.push(n);
      paint();
    });
    $('[data-clear]', bar).addEventListener('click', function () { sel = []; paint(); });
    $('[data-copy]', bar).addEventListener('click', function () {
      var t = textOf() + '\n(' + refOf() + ')';
      var ok = function () { var b = $('[data-copy]', bar); b.textContent = 'نُسخ'; setTimeout(function () { b.textContent = 'نسخ'; }, 1400); };
      if (navigator.clipboard) navigator.clipboard.writeText(t).then(ok, function () {}); 
    });
    $('[data-img]', bar).addEventListener('click', function () {
      var W = 1080, H = 1350, c = document.createElement('canvas'); c.width = W; c.height = H;
      var x = c.getContext('2d');
      var draw = function () {
        x.fillStyle = '#17191E'; x.fillRect(0, 0, W, H);
        x.strokeStyle = 'rgba(179,148,89,.35)'; x.lineWidth = 2; x.beginPath(); x.arc(W / 2, -120, 620, 0, Math.PI * 2); x.stroke();
        x.fillStyle = '#B39459'; x.fillRect(W / 2 - 40, 220, 80, 4);
        x.direction = 'rtl'; x.textAlign = 'center'; x.fillStyle = '#FAF8F4';
        var text = textOf(), size = text.length > 420 ? 40 : text.length > 240 ? 48 : 58, lh = size * 1.85;
        x.font = size + 'px "Noto Naskh Arabic", serif';
        var words = text.split(/\s+/), lines = [], ln = '';
        words.forEach(function (w) { var t = ln ? ln + ' ' + w : w; if (x.measureText(t).width > W - 200 && ln) { lines.push(ln); ln = w; } else ln = t; });
        if (ln) lines.push(ln);
        var y0 = Math.max(300, (H - lines.length * lh) / 2);
        lines.forEach(function (l, i) { x.fillText(l, W / 2, y0 + i * lh); });
        x.font = '600 34px "IBM Plex Sans Arabic", sans-serif'; x.fillStyle = '#D7C49A';
        x.fillText(refOf(), W / 2, y0 + lines.length * lh + 50);
        x.font = '500 30px "Readex Pro", sans-serif'; x.fillStyle = '#A8A296'; x.fillText('لمجد الله', W / 2, H - 90);
        c.toBlob(function (blob) {
          var name = 'آية-' + refOf().replace(/[\s:–]+/g, '-') + '.png';
          var file = window.File ? new File([blob], name, { type: 'image/png' }) : null;
          if (file && navigator.canShare && navigator.canShare({ files: [file] })) { navigator.share({ files: [file], title: refOf() }).catch(function () {}); return; }
          var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
        }, 'image/png');
      };
      if (document.fonts && document.fonts.load) Promise.all([document.fonts.load('58px "Noto Naskh Arabic"'), document.fonts.load('600 34px "IBM Plex Sans Arabic"')]).then(draw, draw); else draw();
    });
  });
  // ---------- reading colours: light / paper / night / high contrast, for this tab only ----------
  var thb = $$('[data-theme3]');
  if (thb.length) {
    var getT = function () { try { return sessionStorage.getItem('bs:theme3') || 'paper'; } catch (e) { return 'paper'; } };
    var setT = function (k) { document.documentElement.setAttribute('data-read', k); try { sessionStorage.setItem('bs:theme3', k); } catch (e) {} thb.forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-theme3') === k ? 'true' : 'false'); }); };
    thb.forEach(function (b) { b.addEventListener('click', function () { setT(b.getAttribute('data-theme3')); }); });
    setT(getT());
  }
  // ---------- glossary: tap a marked word in the reader ----------
  var gtpl = $('#glcards');
  if (gtpl) {
    var pop = document.createElement('div'); pop.className = 'glpop'; pop.hidden = true; pop.setAttribute('role', 'dialog'); pop.setAttribute('aria-live', 'polite');
    document.body.appendChild(pop);
    var openBtn = null;
    var closeP = function () { pop.hidden = true; if (openBtn) { openBtn.setAttribute('aria-expanded', 'false'); openBtn = null; } };
    document.addEventListener('click', function (e) {
      var w = e.target.closest('.gw');
      if (w) {
        e.preventDefault(); e.stopPropagation();
        if (openBtn === w) { closeP(); return; }
        var c = gtpl.content.querySelector('[data-g="' + w.getAttribute('data-g') + '"]'); if (!c) return;
        if (openBtn) openBtn.setAttribute('aria-expanded', 'false');
        pop.innerHTML = '<button type="button" class="x" aria-label="إغلاق">×</button>' + c.innerHTML; pop.hidden = false; openBtn = w; w.setAttribute('aria-expanded', 'true');
        $('.x', pop).addEventListener('click', closeP);
        return;
      }
      if (!pop.hidden && !e.target.closest('.glpop')) closeP();
    }, true);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeP(); });
  }

  // ---------- glossary page: search, categories, open a card ----------
  var gq = $('[data-gq]');
  if (gq) {
    var gcards = $$('.gl3c'), gcat = 'all', none = $('[data-gnone]');
    var fold = function (s) { return s.replace(/[ً-ْٰـ]/g, '').replace(/[ٱأإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي').toLowerCase().trim(); };
    var applyG = function () {
      var q = fold(gq.value), shown = 0;
      gcards.forEach(function (c) { var ok = (gcat === 'all' || c.getAttribute('data-cat') === gcat) && (!q || fold(c.getAttribute('data-k')).indexOf(q) >= 0 || fold($('.d', c).textContent).indexOf(q) >= 0); c.hidden = !ok; if (ok) shown++; });
      none.hidden = shown > 0;
    };
    gq.addEventListener('input', applyG);
    var gtabs = $$('[data-gc]');
    gtabs.forEach(function (t) { t.addEventListener('click', function () { gcat = t.getAttribute('data-gc'); gtabs.forEach(function (o) { o.setAttribute('aria-selected', o === t ? 'true' : 'false'); }); applyG(); }); });
    var toggle = function (c, open) { var h = $('.hd', c), m = $('.gmore', c); var o = open === undefined ? h.getAttribute('aria-expanded') !== 'true' : open; h.setAttribute('aria-expanded', o ? 'true' : 'false'); m.hidden = !o; };
    gcards.forEach(function (c) { $('.hd', c).addEventListener('click', function () { toggle(c); }); });
    var hashG = function () { var c = location.hash && document.getElementById(decodeURIComponent(location.hash.slice(1))); if (c && c.classList.contains('gl3c')) { toggle(c, true); c.classList.add('hit'); setTimeout(function () { c.classList.remove('hit'); }, 1800); setTimeout(function () { c.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' }); }, 40); } };
    window.addEventListener('hashchange', hashG); hashG();
  }
  // ---------- cross references (Treasury of Scripture Knowledge) ----------
  (function () {
    var rootX = document.body.getAttribute('data-root') || '';
    var sheet = null, cache = {};
    var AR3 = function (n) { return String(n).replace(/\d/g, function (d) { return '٠١٢٣٤٥٦٧٨٩'[d]; }); };
    var needScript = function (src, test, cb) { if (test()) return cb(); var s = document.createElement('script'); s.src = rootX + src; s.onload = cb; document.head.appendChild(s); };
    var bookOf = function (id) { var R = window.SIDX.refs; for (var i = 0; i < R.length; i++) if (R[i][5] === id) return [i, R[i]]; return null; };
    var label = function (r) {
      var m = r.match(/^(\w+)\.(\d+)\.(\d+)(?:-(?:(\w+)\.(\d+)\.)?(\d+))?$/); if (!m) return r;
      var b = bookOf(m[1]); if (!b) return r;
      var s = b[1][0] + ' ' + AR3(m[2]) + ': ' + AR3(m[3]);
      if (m[6]) s += m[4] && (m[4] !== m[1] || m[5] !== m[2]) ? '–' + AR3(m[5]) + ': ' + AR3(m[6]) : '–' + AR3(m[6]);
      return s;
    };
    var textOf = function (r) {
      var m = r.match(/^(\w+)\.(\d+)\.(\d+)/), b = m && bookOf(m[1]); if (!b) return '';
      if (!window.__BT) window.__BT = window.BTXT.split('\v');
      var ch = window.__BT[b[0]].split('\f')[+m[2] - 1]; return ch ? (ch.split('\n')[+m[3] - 1] || '') : '';
    };
    var hrefOf = function (r) { var m = r.match(/^(\w+)\.(\d+)\.(\d+)/), b = m && bookOf(m[1]); if (!b) return '#'; return rootX + (b[1][4] ? 'book/' + b[1][2] + '.html' : 'book/' + b[1][2] + '/' + m[2] + '.html#v' + m[3]); };
    var close = function () { if (sheet) sheet.hidden = true; };
    window.openXref = function (key, title) {
      if (!sheet) {
        sheet = document.createElement('div'); sheet.className = 'xr3'; sheet.setAttribute('role', 'dialog'); sheet.setAttribute('aria-label', 'شواهد مرتبطة');
        sheet.innerHTML = '<div class="pn"><header><div><small>شواهد مرتبطة</small><b data-xt></b></div><button type="button" class="x" aria-label="إغلاق">×</button></header><div class="ls" data-xl></div><footer>المصدر: كنز المعرفة الكتابية (Treasury of Scripture Knowledge)، ملكية عامة. الشواهد فقط، والنص من فاندايك بلا تشكيل. اضغط الشاهد لتقرأه مشكولاً في سياقه.</footer></div>';
        document.body.appendChild(sheet);
        sheet.addEventListener('click', function (e) { if (e.target === sheet || e.target.closest('.x')) close(); });
        document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
      }
      $('[data-xt]', sheet).textContent = title; var list = $('[data-xl]', sheet); list.innerHTML = '<p class="shint">جارٍ التحميل…</p>'; sheet.hidden = false;
      var p = key.split('.'), file = 'xref/' + p[0] + '/' + p[1] + '.json';
      var show = function (data) {
        var refs = (data && data[p[2]]) || [];
        if (!refs.length) { list.innerHTML = '<p class="shint">لا توجد شواهد مرتبطة بهذه الآية في المصدر.</p>'; return; }
        var draw = function (n) {
          list.innerHTML = refs.slice(0, n).map(function (r) { var t = textOf(r); return '<a href="' + hrefOf(r) + '"><small>' + label(r) + '</small><span>' + (t.length > 180 ? t.slice(0, 178).replace(/\s+\S*$/, '') + '…' : t).replace(/[&<>]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]; }) + '</span></a>'; }).join('') + (refs.length > n ? '<button type="button" class="all" data-more>عرض كل الشواهد (' + AR3(refs.length) + ')</button>' : '');
          var mb = $('[data-more]', list); if (mb) mb.addEventListener('click', function () { draw(refs.length); });
        };
        draw(12);
      };
      needScript('assets/search.js', function () { return !!window.SIDX; }, function () {
        needScript('assets/bible-search.js', function () { return !!window.BTXT; }, function () {
          if (cache[file]) return show(cache[file]);
          fetch(rootX + file).then(function (r) { return r.ok ? r.json() : {}; }).then(function (d) { cache[file] = d; show(d); }).catch(function () { list.innerHTML = '<p class="shint">تعذّر تحميل الشواهد. تأكد من الاتصال.</p>'; });
        });
      });
    };
  })();
  // ---------- عِش النص: arenas, pick steps, this week's commitment (nothing saved) ----------
  $$('.lv3').forEach(function (sec) {
    var cards = $$('.lv3c', sec), tabs = $$('[data-arena]', sec), list = $('[data-list]', sec), steps = $('template[data-steps]', sec).content, chosen = [];
    var bImg = $('[data-cimg]', sec), bPr = $('[data-cprint]', sec), title = $('.lv3m h3', sec).textContent;
    tabs.forEach(function (t) { t.addEventListener('click', function () { var a = t.getAttribute('data-arena'); tabs.forEach(function (o) { o.setAttribute('aria-selected', o === t ? 'true' : 'false'); }); cards.forEach(function (c) { c.hidden = !(a === 'all' || (' ' + c.getAttribute('data-arenas') + ' ').indexOf(' ' + a + ' ') >= 0); }); }); });
    var paint = function () {
      if (!chosen.length) { list.innerHTML = '<li class="l3em">اختر خطوة أو اثنتين من البطاقات أعلاه.</li>'; bImg.disabled = bPr.disabled = true; return; }
      list.innerHTML = chosen.map(function (id) { var i = steps.querySelector('[data-id="' + id + '"]'); return '<li><b>' + i.getAttribute('data-t') + ':</b> ' + i.getAttribute('data-s') + '</li>'; }).join('');
      bImg.disabled = bPr.disabled = false;
    };
    $$('[data-pick]', sec).forEach(function (b) {
      b.addEventListener('click', function () {
        var id = b.getAttribute('data-pick'), k = chosen.indexOf(id);
        if (k >= 0) chosen.splice(k, 1); else chosen.push(id);
        b.setAttribute('aria-pressed', k >= 0 ? 'false' : 'true'); $('span', b).textContent = k >= 0 ? 'اخترها لهذا الأسبوع' : 'اخترتها';
        paint();
      });
    });
    bPr.addEventListener('click', function () { document.body.classList.add('print-commit'); window.print(); setTimeout(function () { document.body.classList.remove('print-commit'); }, 500); });
    bImg.addEventListener('click', function () {
      var W = 1080, H = 1350, c = document.createElement('canvas'); c.width = W; c.height = H; var x = c.getContext('2d');
      var wrap = function (t, max) { var w = t.split(/\s+/), L = [], ln = ''; w.forEach(function (p) { var tt = ln ? ln + ' ' + p : p; if (x.measureText(tt).width > max && ln) { L.push(ln); ln = p; } else ln = tt; }); if (ln) L.push(ln); return L; };
      var draw = function () {
        x.fillStyle = '#FAF8F4'; x.fillRect(0, 0, W, H);
        x.strokeStyle = '#B39459'; x.setLineDash([14, 10]); x.lineWidth = 4; x.strokeRect(60, 60, W - 120, H - 120); x.setLineDash([]);
        x.direction = 'rtl'; x.textAlign = 'right'; var R = W - 120;
        x.fillStyle = '#7A6232'; x.font = '600 34px "IBM Plex Sans Arabic", sans-serif'; x.fillText('التزامي هذا الأسبوع', R, 170);
        x.fillStyle = '#17191E'; x.font = '700 64px "Readex Pro", sans-serif'; x.fillText(title, R, 250);
        var y = 340;
        chosen.forEach(function (id, n) {
          var i = steps.querySelector('[data-id="' + id + '"]');
          x.fillStyle = '#8C2F1E'; x.font = '600 36px "IBM Plex Sans Arabic", sans-serif'; x.fillText((n + 1) + '. ' + i.getAttribute('data-t'), R, y); y += 58;
          x.fillStyle = '#3B3833'; x.font = '36px "IBM Plex Sans Arabic", sans-serif';
          wrap(i.getAttribute('data-s'), W - 260).forEach(function (l) { x.fillText(l, R, y); y += 56; }); y += 30;
        });
        x.textAlign = 'center'; x.fillStyle = '#A8A296'; x.font = '500 30px "Readex Pro", sans-serif'; x.fillText('لمجد الله', W / 2, H - 100);
        c.toBlob(function (blob) {
          var name = 'التزامي-' + title.replace(/\s+/g, '-') + '.png', file = window.File ? new File([blob], name, { type: 'image/png' }) : null;
          if (file && navigator.canShare && navigator.canShare({ files: [file] })) { navigator.share({ files: [file], title: 'التزامي هذا الأسبوع' }).catch(function () {}); return; }
          var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
        }, 'image/png');
      };
      if (document.fonts && document.fonts.load) Promise.all([document.fonts.load('600 36px "IBM Plex Sans Arabic"'), document.fonts.load('700 64px "Readex Pro"')]).then(draw, draw); else draw();
    });
  });
})();
