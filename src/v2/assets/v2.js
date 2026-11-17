/* v2 behaviour: carousels, chapter story, study, reader, person cards, maps.
   Nothing is saved between visits: no accounts, no progress. Reading settings last for this tab only (sessionStorage). */
(function () {
  'use strict';
  var $ = function (s, e) { return (e || document).querySelector(s); };
  var $$ = function (s, e) { return Array.prototype.slice.call((e || document).querySelectorAll(s)); };
  var AR = function (x) { return String(x).replace(/[0-9]/g, function (d) { return '٠١٢٣٤٥٦٧٨٩'[d]; }); };
  var store = {
    get: function (k, d) { try { var v = sessionStorage.getItem('bs:' + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { try { sessionStorage.setItem('bs:' + k, JSON.stringify(v)); } catch (e) {} }
  };
  var ss = { get: function (k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } }, set: function (k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} } };
  var root = document.body.getAttribute('data-root') || '';
  var tt;
  function toast(m) { var t = $('#toast'); if (!t) return; t.textContent = m; t.classList.add('on'); clearTimeout(tt); tt = setTimeout(function () { t.classList.remove('on'); }, 1900); }
  var read = {};

  // sticky headers get a rule once scrolled
  function bindHeaders(scroller) {
    var h = $('.sh', scroller === window ? document : scroller);
    if (!h) return;
    var f = function () { h.classList.toggle('sc', (scroller === window ? window.scrollY : scroller.scrollTop) > 8); };
    scroller.addEventListener('scroll', f, { passive: true }); f();
  }
  bindHeaders(window);
  $$('.pg').forEach(function (p) { p.addEventListener('scroll', function () { var h = $('.sh', p); if (h) h.classList.toggle('sc', p.scrollTop > 8); }, { passive: true }); });

  // ---------- splash ----------
  var sp = $('#splash');
  function showSplash() { sp.hidden = false; sp.classList.remove('out'); }
  if (sp) {
    if (!ss.get('seen')) showSplash();
    sp.addEventListener('click', function (e) { if (e.target.closest('[data-enter]')) { ss.set('seen', '1'); sp.classList.add('out'); setTimeout(function () { sp.hidden = true; }, 600); } });
    var again = $('[data-splash]'); if (again) again.addEventListener('click', showSplash);
  }

  // ---------- carousels ----------
  function bindCarousel(car, onChange, start, labelOf) {
    var items = $$('.cc', car);
    if (!items.length) return;
    var cur = -1, lock = 0, rng = null, bub = null, paint = function () {};
    var set = function (el) { var i = items.indexOf(el); if (i === cur) return; cur = i; items.forEach(function (x) { x.classList.toggle('on', x === el); }); if (rng) { rng.value = i + 1; paint(); } onChange(el, i); };
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (es) { if (Date.now() < lock) return; es.forEach(function (en) { if (en.intersectionRatio > 0.6) set(en.target); }); }, { root: car, threshold: [0.6] });
      items.forEach(function (x) { io.observe(x); });
    }
    var moved = false;
    items.forEach(function (x) {
      x.addEventListener('click', function (e) { if (moved) { e.preventDefault(); e.stopPropagation(); return; } if (!x.classList.contains('on') && !e.target.closest('.pchips a')) { e.preventDefault(); go(items.indexOf(x), true); } }, true);
    });
    var go = function (i, smooth) {
      var el = items[Math.max(0, Math.min(items.length - 1, i))]; if (!el) return;
      lock = Date.now() + (smooth ? 650 : 150);
      set(el);
      car.scrollTo({ left: el.offsetLeft - (car.clientWidth - el.clientWidth) / 2, behavior: smooth ? 'smooth' : 'auto' });
    };
    // frame with previous / next arrows (RTL: previous on the right)
    var wrap = document.createElement('div'); wrap.className = 'carw';
    car.parentNode.insertBefore(wrap, car); wrap.appendChild(car);
    ['1', '-1'].forEach(function (d) {
      var b = document.createElement('button'); b.type = 'button'; b.className = 'carnav ' + (d === '1' ? 'nx' : 'pv');
      b.setAttribute('aria-label', d === '1' ? 'التالي' : 'السابق');
      b.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="' + (d === '1' ? 'M15 6l-6 6 6 6' : 'M9 6l6 6-6 6') + '"/></svg>';
      b.addEventListener('click', function () { go(cur + (+d), true); });
      wrap.appendChild(b);
    });
    // mouse drag (touch already scrolls natively)
    var dx0 = null, sl0 = 0;
    car.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse' || e.button !== 0) return; dx0 = e.clientX; sl0 = car.scrollLeft; moved = false; });
    window.addEventListener('pointermove', function (e) { if (dx0 === null) return; var d = e.clientX - dx0; if (Math.abs(d) > 6) { moved = true; car.classList.add('drag'); } if (moved) car.scrollLeft = sl0 - d; });
    window.addEventListener('pointerup', function () {
      if (dx0 === null) return; dx0 = null;
      if (!moved) return;
      car.classList.remove('drag');
      var mid = car.getBoundingClientRect().left + car.clientWidth / 2, best = 0, bd = 1e9;
      items.forEach(function (x, k) { var r = x.getBoundingClientRect(); var dd = Math.abs(r.left + r.width / 2 - mid); if (dd < bd) { bd = dd; best = k; } });
      go(best, true); setTimeout(function () { moved = false; }, 30);
    });
    // keyboard
    document.addEventListener('keydown', function (e) {
      if (location.hash.length > 1 && !/^#(b-|c\d)/.test(location.hash)) return;
      if (/INPUT|TEXTAREA/.test((e.target.tagName || ''))) return;
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(cur + 1, true); }
      if (e.key === 'ArrowRight') { e.preventDefault(); go(cur - 1, true); }
    });
    // range slider: flip through quickly before choosing
    if (labelOf && items.length > 6) {
      var rw = document.createElement('div'); rw.className = 'crange';
      rw.innerHTML = '<input type="range" min="1" max="' + items.length + '" value="1" dir="rtl" aria-label="تنقّل سريع"><output></output>';
      wrap.parentNode.insertBefore(rw, wrap.nextSibling);
      rng = rw.querySelector('input'); bub = rw.querySelector('output');
      paint = function () { var p = items.length > 1 ? (rng.value - 1) / (items.length - 1) * 100 : 0; rng.style.setProperty('--p', p + '%'); bub.style.right = (rng.parentNode.clientWidth - rng.offsetLeft - rng.clientWidth + 11 + p / 100 * (rng.clientWidth - 22)) + 'px'; bub.textContent = labelOf(items[rng.value - 1], rng.value - 1); };
      rng.addEventListener('input', function () { rw.classList.add('act'); go(+rng.value - 1, false); paint(); });
      ['change', 'pointerup', 'touchend', 'blur'].forEach(function (ev) { rng.addEventListener(ev, function () { rw.classList.remove('act'); }); });
    }
    requestAnimationFrame(function () { go(start || 0, false); });
    return go;
  }
  var car = $('#car');
  if (car) {
    var kind = car.getAttribute('data-kind');
    if (kind === 'books') {
      var chips = $$('#gchips button');
      var cards = $$('.cc', car);
      cards.forEach(function (c) {
        var id = c.getAttribute('data-book'), tot = +c.getAttribute('data-total');
        var n = Object.keys(read).filter(function (k) { return k.indexOf(id + ':') === 0; }).length;
        if (n) $('[data-prog]', c).textContent = 'قرأت ' + AR(n) + ' من ' + AR(tot);
      });
      var startSlug = (location.hash.match(/^#b-(.+)$/) || [])[1];
      var s0 = Math.max(0, cards.findIndex(function (c) { return c.getAttribute('data-slug') === startSlug; }));
      var goB = bindCarousel(car, function (el, i) {
        var g = el.getAttribute('data-g');
        chips.forEach(function (c) { c.setAttribute('aria-pressed', c.getAttribute('data-g') === g ? 'true' : 'false'); });
        var on = chips.filter(function (c) { return c.getAttribute('data-g') === g; })[0];
        if (on) on.parentNode.scrollTo({ left: on.offsetLeft - (on.parentNode.clientWidth - on.clientWidth) / 2, behavior: 'smooth' });
        $('#ccount').textContent = AR(i + 1) + ' / ' + AR(cards.length);
        try { history.replaceState(null, '', '#b-' + el.getAttribute('data-slug')); } catch (e) {}
      }, s0, function (el, i) { return AR(i + 1) + ' · ' + $('.num', el).textContent; });
      chips.forEach(function (c) { c.addEventListener('click', function () { var i = cards.findIndex(function (x) { return x.getAttribute('data-g') === c.getAttribute('data-g'); }); goB(i, true); }); });
    }
    if (kind === 'chapters') {
      var book = car.getAttribute('data-book');
      var cs = $$('.cc', car), sb = $$('#scrub button');
      var hc = (location.hash.match(/^#c(\d+)$/) || [])[1];
      var start = hc ? +hc - 1 : 0;
      var goC = bindCarousel(car, function (el, i) {
        $('#secl').textContent = el.getAttribute('data-sec') || '';
        sb.forEach(function (b, k) { b.classList.toggle('on', k === i); });
        var s = sb[i]; if (s) s.parentNode.scrollTo({ left: s.offsetLeft - (s.parentNode.clientWidth - s.clientWidth) / 2, behavior: 'smooth' });
        try { history.replaceState(null, '', '#c' + (i + 1)); } catch (e) {}
      }, start, function (el, i) { var h = $('h3', el); return AR(i + 1) + (h ? ' · ' + h.textContent : ''); });
      sb.forEach(function (b) { b.addEventListener('click', function () { goC(+b.getAttribute('data-jump'), true); }); });
    }
    if (kind === 'eras') {
      var sbe = $$('#scrub button');
      var goE = bindCarousel(car, function (el, i) { sbe.forEach(function (b, k) { b.classList.toggle('on', k === i); }); }, 0);
      sbe.forEach(function (b) { b.addEventListener('click', function () { goE(+b.getAttribute('data-jump'), true); }); });
    }
  }

  // ---------- reader text size ----------
  var size = store.get('textSize', 0);
  function applySize() { $$('.scr').forEach(function (s) { s.style.fontSize = (21 + size * 2) + 'px'; }); }
  applySize();
  $$('[data-size]').forEach(function (b) { b.addEventListener('click', function () { size = Math.max(-2, Math.min(4, size + (+b.getAttribute('data-size')))); store.set('textSize', size); applySize(); }); });

  // ---------- story ----------
  var story = $('#story');
  var si = 0, scs = story ? $$('.sc', story) : [];
  function showCard() {
    scs.forEach(function (c, k) { c.classList.toggle('on', k === si); });
    $$('.bars i', story).forEach(function (b, k) { b.classList.toggle('on', k <= si); });
    var fg = scs[si].getAttribute('data-fg');
    $('.bars', story).style.color = fg; $('.stop', story).style.color = fg;
  }
  function step(d) {
    var n = Math.max(0, Math.min(scs.length - 1, si + d));
    if (n === si) return;
    scs.forEach(function (c, k) { c.style.setProperty('--from', k === n ? (d > 0 ? '-24px' : '24px') : (d > 0 ? '24px' : '-24px')); });
    si = n; showCard();
  }
  if (story) {
    showCard();
    $$('.tz', story).forEach(function (z) { z.addEventListener('click', function () { step(+z.getAttribute('data-dir')); }); });
    var sx = 0, sy = 0, down = false;
    story.addEventListener('pointerdown', function (e) { down = true; sx = e.clientX; sy = e.clientY; });
    story.addEventListener('pointerup', function (e) {
      if (!down) return; down = false;
      var dx = e.clientX - sx, dy = e.clientY - sy;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) step(dx > 0 ? 1 : -1);
      else if (dy < -70 && Math.abs(dy) > Math.abs(dx)) { var m = $('.more', scs[si]); if (m) location.hash = m.getAttribute('href'); }
    });
    document.addEventListener('keydown', function (e) {
      if (location.hash.length > 1) { if (e.key === 'Escape') location.hash = ''; return; }
      if (e.key === 'ArrowLeft') step(1); if (e.key === 'ArrowRight') step(-1);
    });
  }

  // ---------- overlay router (chapter + about pages) ----------
  var study = $('#study'), reader = $('#read'), vw = $('#viewer:not(.inline)');
  var isAbout = study && study.classList.contains('stat');
  function route() {
    var h = decodeURIComponent(location.hash.slice(1));
    [study, reader].forEach(function (o) { if (o) { o.scrollLeft = 0; o.scrollTop = 0; } });
    if (study) {
      var det = h && $('.pg.det[id="' + h + '"]', study);
      var sOn = isAbout || h === 'study' || !!det;
      study.classList.toggle('on', sOn);
      $$('.pg.det', study).forEach(function (p) { var on = p === det; if (on && !p.classList.contains('on')) p.scrollTop = 0; p.classList.toggle('on', on); });
      var idx = $('#pg-idx'); if (idx) idx.classList.toggle('away', !!det);
      if (det) { var t = $('.sh .t', det); if (t && !t.textContent) t.textContent = $('h1', det).textContent; }
    }
    if (reader) {
      var vm = h.match(/^v(\d+)$/);
      var rOn = h === 'read' || !!vm;
      reader.classList.toggle('on', rOn);
      $$('.v.hl', reader).forEach(function (v) { v.classList.remove('hl'); });
      if (vm) { var v = $('#v' + vm[1], reader); if (v) { v.classList.add('hl'); setTimeout(function () { var pg = $('.pg', reader); pg.scrollTop = v.offsetTop - 140; }, 380); } }
    } else if (/^v\d+$/.test(h)) {
      var v2 = document.getElementById(h); if (v2) { v2.classList.add('hl'); setTimeout(function () { window.scrollTo(0, v2.getBoundingClientRect().top + window.scrollY - 140); }, 60); }
    }
    if (vw) { var pm = h.match(/^p-(.+)$/); if (pm) openPerson(pm[1]); else vw.classList.remove('on'); }
  }
  // links between sections inside the reader overlay (verse ranges in the study)
  window.addEventListener('hashchange', route);

  // ---------- intro interactive blocks ----------
  $$('[data-tabs]').forEach(function (bar) {
    var btns = $$('[data-panel]', bar);
    btns.forEach(function (b) { b.addEventListener('click', function () { btns.forEach(function (o) { var on = o === b; o.setAttribute('aria-selected', on ? 'true' : 'false'); var p = document.getElementById(o.getAttribute('data-panel')); if (p) p.hidden = !on; }); }); });
  });
  $$('[data-filter]').forEach(function (bar) {
    var target = document.getElementById(bar.getAttribute('data-filter'));
    var btns = $$('button', bar);
    btns.forEach(function (b) { b.addEventListener('click', function () { var v = b.getAttribute('data-value'); btns.forEach(function (o) { o.setAttribute('aria-selected', o === b ? 'true' : 'false'); }); $$('[data-group]', target).forEach(function (it) { it.hidden = !(v === 'all' || it.getAttribute('data-group') === v); }); }); });
  });
  $$('[data-outline]').forEach(function (wrap) {
    var btns = $$('[data-part]', wrap);
    btns.forEach(function (b) { b.addEventListener('click', function () { btns.forEach(function (o) { var on = o === b; o.setAttribute('aria-pressed', on ? 'true' : 'false'); var p = document.getElementById(o.getAttribute('data-part')); if (p) p.hidden = !on; }); }); });
  });

  // ---------- person card ----------
  var faces = [], fi = 0, curP = null;
  var card = $('.pcard'), pin = $('.pin');
  function paintFace() {
    pin.innerHTML = faces[fi] || '';
    $$('.dots i').forEach(function (d, k) { d.classList.toggle('on', k === fi); });
  }
  function loadPerson(id) {
    var tpl = document.getElementById('pc-' + id);
    if (!tpl) return false;
    var box = document.createElement('div'); box.appendChild(tpl.content.cloneNode(true));
    faces = $$('.f', box).map(function (f) { return f.innerHTML; }); fi = 0; curP = id;
    $('.dots').innerHTML = faces.map(function () { return '<i></i>'; }).join('');
    var nm = $('[data-vname]'); if (nm) nm.textContent = tpl.getAttribute('data-name');
    $$('.who button').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-p') === id ? 'true' : 'false'); });
    var full = $('[data-vfull]'); var hr = $('[data-pid="' + id + '"]'); if (full && hr) full.href = hr.getAttribute('href');
    paintFace(); return true;
  }
  function openPerson(id) { if (loadPerson(id)) vw.classList.add('on'); }
  function flip(dir) {
    if (faces.length < 2) return;
    card.style.transition = 'transform .18s ease-in'; card.style.transform = 'rotateY(' + (dir * 90) + 'deg)';
    setTimeout(function () {
      fi = (fi + dir + faces.length) % faces.length; paintFace();
      card.style.transition = 'none'; card.style.transform = 'rotateY(' + (-dir * 90) + 'deg)';
      requestAnimationFrame(function () { requestAnimationFrame(function () { card.style.transition = 'transform .26s cubic-bezier(.2,.8,.2,1)'; card.style.transform = 'none'; }); });
    }, 180);
  }
  if (card) {
    var px = 0, pdown = false, moved = false;
    var stage = $('.stage');
    stage.addEventListener('pointerdown', function (e) { pdown = true; moved = false; px = e.clientX; card.style.transition = 'none'; });
    stage.addEventListener('pointermove', function (e) { if (!pdown) return; var dx = e.clientX - px; if (Math.abs(dx) > 6) moved = true; card.style.transform = 'rotateY(' + Math.max(-40, Math.min(40, dx / 4)) + 'deg)'; });
    var end = function (e) {
      if (!pdown) return; pdown = false; var dx = e.clientX - px;
      if (Math.abs(dx) > 50) flip(dx > 0 ? 1 : -1);
      else { card.style.transition = 'transform .25s'; card.style.transform = 'none'; if (!moved && !e.target.closest('a,button')) flip(1); }
    };
    stage.addEventListener('pointerup', end); stage.addEventListener('pointercancel', function () { pdown = false; card.style.transform = 'none'; });
    $$('.who button').forEach(function (b) { b.addEventListener('click', function () { location.replace('#p-' + b.getAttribute('data-p')); }); });
    var inline = $('#viewer.inline');
    if (inline) { var t0 = $('template', inline); if (t0) loadPerson(t0.id.slice(3)); }
  }
  route();

  // ---------- people index ----------
  var pq = $('#pq');
  if (pq) {
    var tf = 'all';
    var minis = $$('#pgrid .mini');
    var norm = function (s) { return String(s).replace(/[ً-ْٰ]/g, '').replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي'); };
    var filt = function () { var q = norm(pq.value.trim()); minis.forEach(function (m) { m.hidden = !((tf === 'all' || m.getAttribute('data-t') === tf) && (!q || norm(m.getAttribute('data-q')).indexOf(q) >= 0)); }); };
    pq.addEventListener('input', filt);
    $$('#pchips button').forEach(function (b) { b.addEventListener('click', function () { tf = b.getAttribute('data-t'); $$('#pchips button').forEach(function (o) { o.setAttribute('aria-pressed', o === b ? 'true' : 'false'); }); filt(); }); });
  }

  // ---------- map viewer ----------
  var mv = $('#mapv');
  if (mv) {
    var D = JSON.parse($('#map-data').textContent);
    var wrap = $('.pwrap', mv), mks = $('.mks', mv), info = $('.minfo', mv), scroller = $('.mapv', mv);
    var J = 0, S = 0, Z = D.z || 1;
    var hm = location.hash.match(/^#j(\d+)-(\d+)$/), hs = location.hash.match(/^#s(\d+)$/);
    if (hm) { J = Math.min(D.journeys.length - 1, +hm[1] - 1); S = +hm[2] - 1; } else if (hs) S = +hs[1] - 1;
    function drawMarkers() {
      var st = D.journeys[J].stops;
      mks.innerHTML = st.map(function (s, i) { return '<button type="button" class="mk" data-i="' + i + '" style="left:' + s.x + '%;top:' + s.y + '%" aria-label="' + AR(i + 1) + '، ' + s.n + '">' + AR(i + 1) + '</button><span class="mkl" data-l="' + i + '" style="left:' + s.x + '%;top:' + s.y + '%">' + s.n + '</span>'; }).join('');
      $$('.plate', wrap).forEach(function (p) { p.hidden = +p.getAttribute('data-j') !== J && $$('.plate', wrap).length > 1; });
      $$('.mjs button', mv).forEach(function (b) { b.setAttribute('aria-pressed', +b.getAttribute('data-j') === J ? 'true' : 'false'); });
    }
    function center() {
      var m = $('.mk[data-i="' + S + '"]', mks); if (!m) return;
      scroller.scrollTo({ left: m.offsetLeft - scroller.clientWidth / 2, top: m.offsetTop - scroller.clientHeight / 2, behavior: 'smooth' });
    }
    function paint() {
      var st = D.journeys[J].stops; S = Math.max(0, Math.min(st.length - 1, S));
      var s = st[S];
      $$('.mk', mks).forEach(function (m, i) { m.classList.toggle('on', i === S); m.classList.toggle('done', i < S); });
      $$('.mkl', mks).forEach(function (l, i) { l.classList.toggle('on', i === S); });
      info.innerHTML = '<div class="row"><button type="button" data-step="-1" aria-label="المحطة السابقة"' + (S === 0 ? ' disabled' : '') + '><svg class="ic" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg></button><b><span style="font-family:var(--ui);font-size:13px;color:var(--faint);font-weight:400">' + AR(S + 1) + ' / ' + AR(st.length) + '</span><br>' + s.n + '</b><button type="button" data-step="1" aria-label="المحطة التالية"' + (S === st.length - 1 ? ' disabled' : '') + '><svg class="ic" viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6"/></svg></button></div>' +
        (s.ref ? (s.href ? '<a class="mr" href="' + s.href + '">' + s.ref + ' · اقرأ الأصحاح</a>' : '<span class="mr">' + s.ref + '</span>') : '') + '<p>' + s.t + '</p>' + (s.more ? '<details><summary>المزيد عن هذه المحطة</summary><div class="mx">' + s.more + '</div></details>' : '');
      center();
      try { history.replaceState(null, '', '#j' + (J + 1) + '-' + (S + 1)); } catch (e) {}
    }
    function zoom(z) { Z = z; wrap.style.height = (100 * Z) + '%'; mv.classList.toggle('z2', Z > 1); setTimeout(center, 50); }
    mv.addEventListener('click', function (e) {
      var m = e.target.closest('.mk'); if (m) { S = +m.getAttribute('data-i'); paint(); return; }
      var s = e.target.closest('[data-step]'); if (s) { S += +s.getAttribute('data-step'); paint(); return; }
      var j = e.target.closest('.mjs button'); if (j) { J = +j.getAttribute('data-j'); S = 0; drawMarkers(); paint(); return; }
      if (e.target.closest('[data-zoom]')) zoom(Z > 1 ? 1 : 2);
    });
    drawMarkers(); zoom(Z); paint();
  }
})();

/* ---------- visual explainers ---------- */
(function () {
  'use strict';
  var cards = document.getElementById('xcards');
  if (!cards) return;
  var nums = Array.prototype.slice.call(document.querySelectorAll('#xnums button'));
  function go(n, smooth) {
    var c = document.getElementById('pl' + n);
    if (!c) return;
    c.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', inline: 'center', block: 'nearest' });
    mark(n);
  }
  function mark(n) { nums.forEach(function (b) { b.setAttribute('aria-current', String(b.getAttribute('data-go') === String(n))); }); }
  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-go]');
    if (a) {
      e.preventDefault();
      var n = a.getAttribute('data-go');
      go(n, true);
      if (!a.closest('#xcards') && !a.closest('#xnums')) setTimeout(function () { document.getElementById('xnums').scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 30);
      history.replaceState(null, '', '#pl' + n);
      return;
    }
    var t = e.target.closest('.tc');
    if (t) {
      var row = t.closest('.xtr');
      Array.prototype.forEach.call(row.querySelectorAll('.tc'), function (x) { x.setAttribute('aria-pressed', String(x === t)); });
      row.querySelector('.tip').textContent = t.getAttribute('data-tip');
    }
  });
  var tm;
  cards.addEventListener('scroll', function () {
    clearTimeout(tm);
    tm = setTimeout(function () {
      var mid = cards.getBoundingClientRect().left + cards.clientWidth / 2, best = null, bd = 1e9;
      Array.prototype.forEach.call(cards.children, function (c) { var r = c.getBoundingClientRect(); var d = Math.abs(r.left + r.width / 2 - mid); if (d < bd) { bd = d; best = c; } });
      if (best) mark(best.id.slice(2));
    }, 80);
  }, { passive: true });
  Array.prototype.forEach.call(document.querySelectorAll('.xrain i'), function (i, k) { i.style.setProperty('--d', (k * 0.08).toFixed(2)); });
  var h = (location.hash.match(/^#pl(\d+)$/) || [])[1];
  if (h) { var jump = function () { go(h, false); document.getElementById('xnums').scrollIntoView({ block: 'start' }); }; setTimeout(jump, 60); if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { setTimeout(jump, 30); }); } else mark(1);
})();

/* ---------- tabernacle explainer ---------- */
(function () {
  'use strict';
  var panels = document.getElementById('tpanels');
  if (!panels) return;
  function sel(id, scroll) {
    Array.prototype.forEach.call(panels.children, function (p) { p.hidden = p.getAttribute('data-panel') !== id; });
    Array.prototype.forEach.call(document.querySelectorAll('.tplan .it'), function (g) { g.classList.toggle('on', g.getAttribute('data-it') === id); });
    Array.prototype.forEach.call(document.querySelectorAll('#tchips button'), function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-it-go') === id)); });
    history.replaceState(null, '', '#it-' + id);
    if (scroll) document.getElementById('tchips').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-it-go]');
    if (a) { e.preventDefault(); sel(a.getAttribute('data-it-go'), !!a.closest('.tpanel')); return; }
    var g = e.target.closest('.tplan .it');
    if (g) { sel(g.getAttribute('data-it'), false); var p = document.getElementById('it-' + g.getAttribute('data-it')); if (p && p.getBoundingClientRect().top > innerHeight - 120) p.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
  document.addEventListener('keydown', function (e) { var g = e.target.closest && e.target.closest('.tplan .it'); if (g && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); sel(g.getAttribute('data-it'), false); } });
  var h = (location.hash.match(/^#it-(\w+)$/) || [])[1];
  if (h && document.getElementById('it-' + h)) { sel(h, false); var jump = function () { document.getElementById('tchips').scrollIntoView({ block: 'start' }); }; setTimeout(jump, 60); if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { setTimeout(jump, 30); }); }
  else sel(panels.children[0].getAttribute('data-panel'), false);
})();

/* ---------- offerings explainer ---------- */
(function () {
  'use strict';
  var panels = document.getElementById('opanels');
  if (!panels) return;
  function sel(id, scroll) {
    Array.prototype.forEach.call(panels.children, function (p) { p.hidden = p.getAttribute('data-panel') !== id; });
    Array.prototype.forEach.call(document.querySelectorAll('#ochips button'), function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-of-go') === id)); });
    history.replaceState(null, '', '#of-' + id);
    if (scroll) document.getElementById('ochips').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-of-go]');
    if (a) { e.preventDefault(); sel(a.getAttribute('data-of-go'), !a.closest('#ochips')); }
  });
  var h = (location.hash.match(/^#of-(\w+)$/) || [])[1];
  if (h && document.getElementById('of-' + h)) { sel(h, false); var jump = function () { document.getElementById('ochips').scrollIntoView({ block: 'start' }); }; setTimeout(jump, 60); if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { setTimeout(jump, 30); }); }
})();

/* ---------- day of atonement stepper ---------- */
(function () {
  'use strict';
  var st = document.getElementById('astage');
  if (!st) return;
  var pts = JSON.parse(st.getAttribute('data-steps')), cards = st.querySelectorAll('.acard'), dots = st.querySelectorAll('.adots i');
  var hp = document.getElementById('ahp'), path = document.getElementById('apath'), i = 0;
  var zones = ['court', 'court', 'court', 'most', 'most', 'most', 'court', 'wild', 'court', 'out'];
  function show(k) {
    i = Math.max(0, Math.min(cards.length - 1, k));
    Array.prototype.forEach.call(cards, function (c, n) { c.hidden = n !== i; });
    Array.prototype.forEach.call(dots, function (d, n) { d.classList.toggle('on', n === i); });
    hp.setAttribute('transform', 'translate(' + pts[i][0] + ' ' + pts[i][1] + ')');
    path.setAttribute('d', 'M' + pts.slice(0, i + 1).map(function (p) { return p[0] + ' ' + p[1]; }).join(' L'));
    Array.prototype.forEach.call(st.querySelectorAll('[data-z]'), function (z) { z.classList.toggle('on', z.getAttribute('data-z') === zones[i]); });
    st.querySelector('[data-a="-1"]').disabled = i === 0;
    st.querySelector('[data-a="1"]').disabled = i === cards.length - 1;
  }
  st.addEventListener('click', function (e) {
    var a = e.target.closest('[data-a]'); if (a) { show(i + Number(a.getAttribute('data-a'))); return; }
    var d = e.target.closest('[data-go]'); if (d) show(Number(d.getAttribute('data-go')));
  });
  var x0 = null;
  st.addEventListener('pointerdown', function (e) { x0 = e.clientX; });
  st.addEventListener('pointerup', function (e) { if (x0 === null) return; var dx = e.clientX - x0; x0 = null; if (Math.abs(dx) > 50) show(i + (dx > 0 ? 1 : -1)); });
  show(0);
})();

/* ---------- search ---------- */
(function () {
  'use strict';
  var box = document.getElementById('srch');
  if (!box) return;
  var root = document.body.getAttribute('data-root') || '';
  var q = document.getElementById('sq'), res = document.getElementById('sres'), loaded = false, last = null;
  var KIND = { l: 'المكتبة', t: 'موضوع',  r: 'شاهد', b: 'سفر', i: 'مقدمة', c: 'أصحاح', p: 'شخصية', x: 'شرح مصوّر', m: 'خريطة' };
  var AR = function (n) { return String(n).replace(/\d/g, function (d) { return '٠١٢٣٤٥٦٧٨٩'[d]; }); };
  function norm(s) {
    return String(s).replace(/[ً-ٰٟـ]/g, '').replace(/[أإآٱ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي')
      .replace(/[٠-٩]/g, function (d) { return '٠١٢٣٤٥٦٧٨٩'.indexOf(d); }).replace(/^سفر\s+/, '').replace(/\s+/g, ' ').trim();
  }
  function load(cb) {
    if (loaded) return cb();
    var s = document.createElement('script'); s.src = root + 'assets/search.js';
    s.onload = function () { loaded = true; prep(); cb(); }; document.head.appendChild(s);
  }
  var alias = [];
  function prep() {
    window.SIDX.refs.forEach(function (r) {
      var n = norm(r[0]), a = norm(r[1]).replace(/\s+/g, '');
      [n, n.replace(/^انجيل /, ''), a].forEach(function (k) { if (k) alias.push([k.replace(/\s+/g, ''), r]); });
    });
    alias.sort(function (x, y) { return y[0].length - x[0].length; });
    window.SIDX.items.forEach(function (it) { it.n = norm(it[1]); it.s = norm(it[2]); });
  }
  function ref(v) {
    var m = v.match(/^(.*?[^\d\s:.])\s*(\d+)(?:\s*[:.\s]\s*(\d+))?\s*$/);
    if (!m) return null;
    var name = m[1].replace(/\s+/g, ''), hit = null;
    for (var i = 0; i < alias.length; i++) if (alias[i][0] === name) { hit = alias[i][1]; break; }
    if (!hit && name.length >= 2) for (var j = 0; j < alias.length; j++) if (alias[j][0].indexOf(name) === 0) { hit = alias[j][1]; break; }
    if (!hit) return null;
    var ch = +m[2], vs = m[3] ? +m[3] : 0;
    if (ch < 1 || ch > hit[3]) return null;
    var href = hit[4] ? 'book/' + hit[2] + '.html' : 'book/' + hit[2] + '/' + ch + '.html' + (vs ? '#v' + vs : '');
    return ['r', hit[0] + ' ' + AR(ch) + (vs ? ': ' + AR(vs) : ''), vs ? 'افتح الآية في القارئ' : 'افتح الأصحاح', href];
  }
  function run() {
    var v = norm(q.value);
    if (v === last) return; last = v;
    if (!v) { res.innerHTML = '<p class="shint">جرّب: الخروج، أو يوم الكفارة، أو إبراهيم، أو رو ٨: ٢٨</p>'; return; }
    var out = [], r = ref(v); if (r) out.push(r);
    var toks = v.split(' ');
    var scored = [];
    window.SIDX.items.forEach(function (it) {
      var hay = it.n + ' ' + it.s, ok = toks.every(function (t) { return hay.indexOf(t) >= 0; });
      if (!ok) return;
      var sc = (it.n.indexOf(v) === 0 ? 0 : it.n.indexOf(v) >= 0 ? 1 : 2) * 10 + ('bitxmplc'.indexOf(it[0]) + 1);
      scored.push([sc, it]);
    });
    scored.sort(function (a, b) { return a[0] - b[0]; });
    scored.slice(0, 40).forEach(function (x) { out.push(x[1]); });
    res.innerHTML = out.length ? out.map(function (it) {
      return '<a href="' + root + it[3] + '"><small>' + KIND[it[0]] + '</small><b>' + esc(it[1]) + '</b>' + (it[2] ? '<span>' + esc(it[2]) + '</span>' : '') + '</a>';
    }).join('') : '<p class="shint">لا نتائج. جرّب كلمة أقصر.</p>';
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function open() { box.hidden = false; document.documentElement.classList.add('noscroll'); setTimeout(function () { q.focus(); }, 30); load(function () { last = null; run(); }); }
  function close() { box.hidden = true; document.documentElement.classList.remove('noscroll'); }
  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-search]')) { e.preventDefault(); open(); return; }
    if (e.target.closest('[data-sclose]') || e.target === box) close();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !box.hidden) close();
    if ((e.key === '/' || (e.key === 'k' && (e.metaKey || e.ctrlKey))) && box.hidden && !/INPUT|TEXTAREA/.test(e.target.tagName)) { e.preventDefault(); open(); }
  });
  q.addEventListener('input', function () { if (loaded) run(); });
  q.addEventListener('keydown', function (e) { if (e.key === 'Enter') { var a = res.querySelector('a'); if (a) location.href = a.href; } });
})();

/* ---------- theological library filters ---------- */
(function () {
  var list = document.getElementById('lworks'); if (!list) return;
  var q = document.getElementById('lq'), cat = document.getElementById('lcat'), bk = document.getElementById('lbook'), tg = document.getElementById('ltag'), lc = document.getElementById('llic'), cnt = document.getElementById('lcount');
  var cards = [].slice.call(list.children);
  var AR = function (n) { return String(n).replace(/[0-9]/g, function (d) { return '٠١٢٣٤٥٦٧٨٩'[d]; }); };
  var norm = function (s) { return String(s).toLowerCase().replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي').replace(/[ً-ْ]/g, ''); };
  cards.forEach(function (c) { c._q = norm(c.dataset.q); });
  function run() {
    var t = norm(q.value.trim()), n = 0;
    cards.forEach(function (c) {
      var ok = (!t || t.split(/\s+/).every(function (x) { return c._q.indexOf(x) >= 0; })) && (!cat.value || c.dataset.cat === cat.value) && (!tg.value || c.dataset.tag === tg.value) && (!lc.value || c.dataset.lic === lc.value) && (!bk.value || (' ' + c.dataset.books + ' ').indexOf(' ' + bk.value + ' ') >= 0);
      c.hidden = !ok; if (ok) n++;
    });
    cnt.textContent = AR(n) + ' من ' + AR(cards.length) + ' عملاً';
  }
  [q, cat, bk, tg, lc].forEach(function (el) { el.addEventListener('input', run); });
  run();
  if (location.hash) { var el = document.getElementById(location.hash.slice(1)); if (el) { el.classList.add('hit'); setTimeout(function () { el.scrollIntoView({ block: 'center' }); }, 60); } }
})();
/* ---------- topics: index filters, views, back-to-chapter context ---------- */
(function () {
  var q = document.getElementById('tq');
  if (q) {
    var vg = document.getElementById('tviewg'), va = document.getElementById('tviewa');
    var norm = function (s) { return String(s).toLowerCase().replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي').replace(/[ً-ْ]/g, ''); };
    var run = function () {
      var t = norm(q.value.trim());
      [].forEach.call(document.querySelectorAll('.topics .tpc'), function (c) { c.hidden = !!t && norm(c.dataset.q).indexOf(t) < 0; });
      [].forEach.call(document.querySelectorAll('.tgrp'), function (g) { g.hidden = !g.querySelector('.tpc:not([hidden])'); });
    };
    q.addEventListener('input', run);
    [].forEach.call(document.querySelectorAll('.tseg button'), function (b) {
      b.addEventListener('click', function () {
        [].forEach.call(document.querySelectorAll('.tseg button'), function (x) { x.classList.toggle('on', x === b); });
        var a = b.dataset.view === 'a'; vg.hidden = a; va.hidden = !a;
        try { sessionStorage.setItem('tview', b.dataset.view); } catch (e) {}
      });
    });
    try { if (sessionStorage.getItem('tview') === 'a') document.querySelector('.tseg [data-view=a]').click(); } catch (e) {}
    [].forEach.call(document.querySelectorAll('.tgrp'), function (g) { g.id = 'g' + g.dataset.g; });
  }
  var back = document.getElementById('tback');
  if (back) {
    var from = new URLSearchParams(location.search).get('from');
    if (from && /^[a-z0-9-]+\/\d+$/.test(from)) {
      back.href = document.body.dataset.root + 'book/' + from + '.html#s-refs';
      back.hidden = false;
      try { sessionStorage.setItem('tfrom', from); } catch (e) {}
    }
  }
})();
