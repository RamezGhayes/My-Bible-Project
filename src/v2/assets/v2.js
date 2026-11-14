/* v2 behaviour: carousels, chapter story, study, reader, person cards, maps. Progress stays in this browser. */
(function () {
  'use strict';
  var $ = function (s, e) { return (e || document).querySelector(s); };
  var $$ = function (s, e) { return Array.prototype.slice.call((e || document).querySelectorAll(s)); };
  var AR = function (x) { return String(x).replace(/[0-9]/g, function (d) { return '٠١٢٣٤٥٦٧٨٩'[d]; }); };
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem('bs:' + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem('bs:' + k, JSON.stringify(v)); } catch (e) {} }
  };
  var ss = { get: function (k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } }, set: function (k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} } };
  var root = document.body.getAttribute('data-root') || '';
  var tt;
  function toast(m) { var t = $('#toast'); if (!t) return; t.textContent = m; t.classList.add('on'); clearTimeout(tt); tt = setTimeout(function () { t.classList.remove('on'); }, 1900); }
  var read = store.get('read', {});
  function setRead(k, on) { read[k] = on ? 1 : 0; if (!on) delete read[k]; store.set('read', read); paintRead(); }
  function paintRead() {
    $$('[data-read]').forEach(function (b) {
      var on = !!read[b.getAttribute('data-read')];
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
      b.textContent = on ? 'قرأت هذا الأصحاح ✓' : 'علّم الأصحاح كمقروء';
    });
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-read]');
    if (b) { var k = b.getAttribute('data-read'); setRead(k, !read[k]); toast(read[k] ? 'أُضيف إلى ما قرأته' : 'أُزيل من ما قرأته'); }
  });
  paintRead();

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

  // ---------- home: continue ----------
  var cont = $('#cont');
  if (cont) {
    var last = store.get('last', null);
    if (last && last.href && last.b) {
      cont.href = root + last.href;
      var cnt = Object.keys(read).filter(function (k) { return k.indexOf(last.b + ':') === 0; }).length;
      $('[data-k]', cont).textContent = 'تابع القراءة · ' + last.bn;
      $('[data-n]', cont).textContent = AR(last.n);
      $('[data-t]', cont).textContent = last.title || last.t;
      $('[data-p]', cont).style.width = Math.round(cnt / last.total * 100) + '%';
      $('[data-m]', cont).textContent = AR(cnt) + ' من ' + AR(last.total) + ' مقروءة';
    }
  }

  // ---------- carousels ----------
  function bindCarousel(car, onChange, start) {
    var items = $$('.cc', car);
    if (!items.length) return;
    var cur = -1;
    var set = function (el) { var i = items.indexOf(el); if (i === cur) return; cur = i; items.forEach(function (x) { x.classList.toggle('on', x === el); }); onChange(el, i); };
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.intersectionRatio > 0.6) set(en.target); }); }, { root: car, threshold: [0.6] });
      items.forEach(function (x) { io.observe(x); });
    }
    items.forEach(function (x) {
      x.addEventListener('click', function (e) { if (!x.classList.contains('on') && !e.target.closest('.pchips a')) { e.preventDefault(); x.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' }); } });
    });
    var go = function (i, smooth) { var el = items[Math.max(0, Math.min(items.length - 1, i))]; if (!el) return; car.scrollTo({ left: el.offsetLeft - (car.clientWidth - el.clientWidth) / 2, behavior: smooth ? 'smooth' : 'auto' }); set(el); };
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
      }, s0);
      chips.forEach(function (c) { c.addEventListener('click', function () { var i = cards.findIndex(function (x) { return x.getAttribute('data-g') === c.getAttribute('data-g'); }); goB(i, true); }); });
    }
    if (kind === 'chapters') {
      var book = car.getAttribute('data-book');
      var cs = $$('.cc', car), sb = $$('#scrub button');
      var lastB = store.get('last', null);
      var nextIdx = -1;
      cs.forEach(function (c, i) {
        var k = c.getAttribute('data-key'), st = $('[data-stat]', c);
        if (read[k]) { st.className = 'st done'; st.textContent = 'قرأته'; sb[i].classList.add('d'); }
      });
      for (var i = 0; i < cs.length; i++) { if (!read[cs[i].getAttribute('data-key')]) { nextIdx = i; break; } }
      if (nextIdx >= 0 && Object.keys(read).some(function (k) { return k.indexOf(book + ':') === 0; })) { var st2 = $('[data-stat]', cs[nextIdx]); st2.className = 'st next'; st2.textContent = 'التالي'; sb[nextIdx].classList.add('nx'); }
      var hc = (location.hash.match(/^#c(\d+)$/) || [])[1];
      var start = hc ? +hc - 1 : (lastB && lastB.b === book ? lastB.n - 1 : Math.max(0, nextIdx));
      var goC = bindCarousel(car, function (el, i) {
        $('#secl').textContent = el.getAttribute('data-sec') || '';
        sb.forEach(function (b, k) { b.classList.toggle('on', k === i); });
        var s = sb[i]; if (s) s.parentNode.scrollTo({ left: s.offsetLeft - (s.parentNode.clientWidth - s.clientWidth) / 2, behavior: 'smooth' });
        try { history.replaceState(null, '', '#c' + (i + 1)); } catch (e) {}
      }, start);
      sb.forEach(function (b) { b.addEventListener('click', function () { goC(+b.getAttribute('data-jump'), true); }); });
    }
    if (kind === 'eras') {
      var sbe = $$('#scrub button');
      var goE = bindCarousel(car, function (el, i) { sbe.forEach(function (b, k) { b.classList.toggle('on', k === i); }); }, 0);
      sbe.forEach(function (b) { b.addEventListener('click', function () { goE(+b.getAttribute('data-jump'), true); }); });
    }
  }

  // ---------- chapter: remember place ----------
  var lastEl = $('[data-last]');
  if (lastEl) { try { store.set('last', JSON.parse(lastEl.getAttribute('data-last'))); } catch (e) {} }

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
    if (si === scs.length - 1) { var ch = $('[data-chapter]'); if (ch && !read[ch.getAttribute('data-chapter')]) setRead(ch.getAttribute('data-chapter'), true); }
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
  $$('textarea.reflect').forEach(function (t, i) { var k = 'reflect:' + location.pathname + ':' + i; t.value = store.get(k, ''); t.addEventListener('input', function () { store.set(k, t.value); }); });

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
