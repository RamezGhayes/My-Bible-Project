// «نظرة عامة على أسفار الكتاب المقدس»: interactions for overview/books.html. Data in window.OVB (built by booksatlas.mjs).
// Everything degrades: without this script the page is a long readable article with links.
(function () {
  var D = window.OVB; if (!D) return;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var AR = function (n) { return String(n).replace(/[0-9]/g, function (d) { return '٠١٢٣٤٥٦٧٨٩'[d]; }); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); };
  var get = function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } };
  var set = function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} };
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var TAGS = { agreed: 'متفق عليه', likely: 'راجح', debated: 'مختلف عليه' };
  var tag = function (t) { return t && TAGS[t] ? ' <span class="dtag ' + t + '">' + TAGS[t] + '</span>' : ''; };
  var IC = {
    chev: '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg>',
    back: '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>',
    check: '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>'
  };
  var BOOK = {}; D.books.forEach(function (b, i) { b.i = i; BOOK[b.id] = b; });
  var UNIT = {}; D.units.forEach(function (u, i) { u.i = i; UNIT[u.id] = u; });
  var ERA = {}; D.eras.forEach(function (e) { ERA[e.id] = e; });
  var GC = {}; D.groups.forEach(function (g) { GC[g.g] = g.c; });

  // ---------- reading progress (shared with the chapter pages: sola.read = ["Gen:1", ...]) ----------
  var read = []; try { read = JSON.parse(get('sola.read') || '[]'); } catch (e) {}
  var readSet = {}; read.forEach(function (k) { readSet[k] = 1; });
  var readIn = function (b) { var n = 0; for (var c = 1; c <= b.ch; c++) if (readSet[b.id + ':' + c]) n++; return n; };
  // unit progress and notes (this page only)
  var U = { done: [], notes: {} }; try { U = Object.assign(U, JSON.parse(get('sola.ovb') || '{}')); } catch (e) {}
  var saveU = function () { set('sola.ovb', JSON.stringify(U)); };

  document.documentElement.classList.add('js-rv');

  // header height for the sticky table of contents
  var top = $('#top'); if (top) document.documentElement.style.setProperty('--toptop', top.offsetHeight + 'px');

  // ---------- hero ----------
  var countUp = function (el) {
    var to = +el.getAttribute('data-count'); if (reduce || !to) return;
    var t0 = null; var step = function (t) { if (!t0) t0 = t; var p = Math.min(1, (t - t0) / 1100); el.textContent = AR(Math.round(to * (1 - Math.pow(1 - p, 3)))); if (p < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  };
  $$('[data-count]').forEach(countUp);
  if (read.length) { var me = $('.ob-stats .me'); if (me) { me.hidden = false; $('[data-read]', me).textContent = AR(read.length); } }

  // ---------- sheet ----------
  var sheet = $('#obsheet'); if (sheet) document.body.appendChild(sheet);
  var pane = sheet && $('.pn', sheet), box = $('#obsh-c'), lastFocus = null, current = null;
  var open = function (kind, id, push) {
    var html = kind === 'b' ? bookHTML(BOOK[id]) : unitHTML(UNIT[id]);
    if (!html) return;
    current = { kind: kind, id: id };
    box.innerHTML = html;
    if (sheet.hidden) { lastFocus = document.activeElement; sheet.hidden = false; document.body.style.overflow = 'hidden'; }
    box.scrollTop = 0; pane.focus({ preventScroll: true });
    wireSheet();
    var h = '#' + kind + '-' + id;
    if (push !== false && location.hash !== h) history.pushState({ ob: 1 }, '', h);
  };
  var close = function (fromPop) {
    if (!sheet || sheet.hidden) return;
    sheet.hidden = true; document.body.style.overflow = ''; current = null;
    if (!fromPop && /^#[bu]-/.test(location.hash)) {
      if (history.state && history.state.ob) history.back(); else history.replaceState(null, '', location.pathname);
    }
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  };
  var route = function () {
    var m = location.hash.match(/^#([bu])-(.+)$/);
    if (m && (m[1] === 'b' ? BOOK[m[2]] : UNIT[m[2]])) open(m[1], m[2], false); else close(true);
  };
  window.addEventListener('popstate', route);
  if (sheet) {
    sheet.addEventListener('click', function (e) { if (e.target.closest('[data-close]')) close(); });
    document.addEventListener('keydown', function (e) {
      if (sheet.hidden) return;
      if (e.key === 'Escape') close();
      if ((e.key === 'ArrowLeft' || e.key === 'ArrowRight') && !/TEXTAREA|INPUT/.test(document.activeElement.tagName)) {
        var list = current.kind === 'b' ? D.books : D.units, i = (current.kind === 'b' ? BOOK : UNIT)[current.id].i + (e.key === 'ArrowLeft' ? 1 : -1);
        if (list[i]) open(current.kind, list[i].id);
      }
    });
  }
  // any [data-book] / [data-unit] on the page opens its card
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-book],[data-unit]');
    if (!t || e.metaKey || e.ctrlKey || e.shiftKey) return;
    if (t.closest('#obord') && ordBusy) return;
    var b = t.getAttribute('data-book'), u = t.getAttribute('data-unit');
    if (b && BOOK[b]) { e.preventDefault(); open('b', b); } else if (u && UNIT[u]) { e.preventDefault(); open('u', u); }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    var t = e.target.closest && e.target.closest('[role=button][data-book]'); if (!t) return;
    e.preventDefault(); open('b', t.getAttribute('data-book'));
  });

  var unitThumb = function (u) {
    var c = u.books.length ? GC[BOOK[u.books[0]].g] : '#5A4A2E';
    return u.img ? '<img src="' + u.img + '" alt="">' : '<span class="g" style="--c:' + c + '">' + esc(u.books.length ? BOOK[u.books[0]].ab : '٤٠٠') + '</span>';
  };
  var unitRow = function (u) {
    var c = u.books.length ? GC[BOOK[u.books[0]].g] : '#5A4A2E';
    return '<button type="button" class="sh-u" data-go-u="' + u.id + '" style="--c:' + c + '">' + unitThumb(u) + '<span><b>' + esc(u.t) + '</b><small>' + esc(ERA[u.era] ? ERA[u.era].t : '') + ' · ' + esc(u.sub) + '</small></span></button>';
  };

  function bookHTML(b) {
    if (!b) return '';
    var r = readIn(b), st = {}; b.st.forEach(function (n) { st[n] = 1; });
    var keys = []; D.units.forEach(function (u) { u.key.forEach(function (k) { if (k.b === b.id) keys.push(k); }); });
    var chs = ''; for (var c = 1; c <= b.ch; c++) chs += '<a href="' + b.ch1 + c + '.html" class="' + (readSet[b.id + ':' + c] ? 'rd' : st[c] ? 's' : '') + '" title="الأصحاح ' + AR(c) + '">' + AR(c) + '</a>';
    var prev = D.books[b.i - 1], next = D.books[b.i + 1];
    var units = b.units.map(function (id) { var u = UNIT[id]; var rg = u.range && u.range[b.id] ? ' (الأصحاحات ' + u.range[b.id] + ')' : ''; return unitRow(u).replace('</small>', rg + '</small>'); }).join('');
    return '<header class="sh-hd" style="--c:' + GC[b.g] + '"><span class="ab" aria-hidden="true">' + esc(b.ab) + '</span><small>' + esc(b.gn) + ' · السفر ' + AR(b.o) + ' من ٦٦</small><h2 id="obsh-t">' + esc(b.full) + '</h2></header>' +
      '<div class="sh-bd"><div class="sh-st"><div><b>' + AR(b.ch) + '</b><small>' + (b.ch === 1 ? 'أصحاح واحد' : 'أصحاحاً') + '</small></div><div><b>' + AR(b.vs) + '</b><small>آية</small></div><div><b>' + AR(r) + '</b><small>قرأت منها</small></div></div>' +
      '<div class="sh-sec"><h3>باختصار</h3><p>' + esc(b.s) + '</p></div>' +
      ((b.who || b.when) ? '<div class="sh-sec"><h3>الكاتب والزمن</h3><div class="sh-kv">' + (b.who ? '<div><span>الكاتب</span><p style="margin:0">' + esc(b.who) + tag(b.whoTag) + '</p></div>' : '') + (b.when ? '<div><span>الزمن</span><p style="margin:0">' + esc(b.when) + tag(b.whenTag) + '</p></div>' : '') + '</div></div>' : '') +
      '<div class="sh-sec"><h3>مكانه في القصة</h3>' + units + '</div>' +
      (keys.length ? '<div class="sh-sec"><h3>أصحاحات مفتاحية</h3><div class="sh-kv">' + keys.map(function (k) { return '<div style="grid-template-columns:1fr"><p style="margin:0"><b style="font-family:var(--ui);font-weight:600">' + esc(k.t) + '</b> · <a class="r" href="' + k.href + '">' + esc(k.label) + '</a><br><span style="font-family:var(--body);font-size:15px;color:var(--soft)">' + esc(k.d) + '</span></p></div>'; }).join('') + '</div></div>' : '') +
      '<div class="sh-sec"><h3>الأصحاحات</h3><div class="sh-chs">' + chs + '</div><div class="sh-lg"><span><i class="s"></i>دراسة كاملة</span><span><i class="rd"></i>قرأته</span><span><i></i>النص</span></div></div>' +
      '<div class="sh-btns"><a class="pri" href="' + b.href + '">صفحة السفر ' + IC.chev + '</a>' + (b.about ? '<a href="' + D.root + 'book/' + b.slug + '/about.html">عن السفر والكاتب</a>' : '') + '<a href="' + b.ch1 + '1.html">ابدأ القراءة</a></div>' +
      '<div class="sh-pn">' + (prev ? '<button type="button" data-go-b="' + prev.id + '">' + IC.back + ' <b>' + esc(prev.n) + '</b></button>' : '<span></span>') + (next ? '<button type="button" data-go-b="' + next.id + '"><b>' + esc(next.n) + '</b> ' + IC.chev + '</button>' : '<span></span>') + '</div></div>';
  }

  function unitHTML(u) {
    if (!u) return '';
    var c = u.books.length ? GC[BOOK[u.books[0]].g] : '#5A4A2E', done = U.done.indexOf(u.id) >= 0;
    var prev = D.units[u.i - 1], next = D.units[u.i + 1];
    var bks = u.books.map(function (id) { var b = BOOK[id]; return '<button type="button" class="ot" data-go-b="' + id + '" style="--c:' + GC[b.g] + '">' + esc(b.n) + (u.range && u.range[id] ? ' ' + u.range[id] : '') + '</button>'; }).join(' ');
    return '<header class="sh-hd' + (u.img ? ' pic' : '') + '" style="--c:' + c + '">' + (u.img ? '<img src="' + u.img + '" alt="">' : '<span class="ab" aria-hidden="true">' + esc(u.books.length ? BOOK[u.books[0]].ab : '٤٠٠') + '</span>') + '<small>الوحدة ' + AR(u.i + 1) + ' من ' + AR(D.units.length) + ' · ' + esc(ERA[u.era] ? ERA[u.era].t : '') + '</small><h2 id="obsh-t">' + esc(u.t) + '</h2><p>' + esc(u.sub) + '</p></header>' +
      '<div class="sh-bd">' + (bks ? '<div class="sh-sec" style="margin-top:0"><h3>الأسفار</h3><div style="display:flex;flex-wrap:wrap;gap:5px">' + bks + '</div></div>' : '') +
      '<div class="sh-sec"><h3>متى وأين</h3><div class="sh-kv"><div><span>الزمن</span><p style="margin:0">' + esc(u.when) + tag(u.whenTag) + '</p></div><div><span>المكان</span><p style="margin:0">' + esc(u.place) + '</p></div></div></div>' +
      '<div class="sh-sec"><h3>الهيكل</h3><ol class="sh-ol">' + u.outline.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ol></div>' +
      '<div class="sh-sec sh-kc"><h3>أصحاحات مفتاحية</h3><div class="pills">' + u.key.map(function (k, i) { return '<button type="button" data-k="' + i + '" aria-pressed="' + (i ? 'false' : 'true') + '">' + esc(k.label) + '</button>'; }).join('') + '</div><div class="card" data-kc></div></div>' +
      '<div class="sh-sec"><h3>الشخصيات</h3><div class="sh-chip">' + u.people.map(function (p) { return '<span>' + esc(p) + '</span>'; }).join('') + '</div></div>' +
      '<div class="sh-sec"><h3>موضوعات</h3><ul class="sh-ul">' + u.themes.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul></div>' +
      '<div class="sh-call c"><b>المسيح في هذا الجزء</b><p>' + esc(u.christ) + '</p><a class="r" href="' + u.cref.href + '">' + esc(u.cref.label) + '</a></div>' +
      '<div class="sh-call a"><b>للتطبيق</b><p>' + esc(u.apply) + '</p></div>' +
      (u.terms.length ? '<div class="sh-sec sh-terms"><h3>مصطلحات</h3>' + u.terms.map(function (t) { return '<div><b>' + esc(t.t) + ':</b> ' + esc(t.d) + '</div>'; }).join('') + '</div>' : '') +
      u.fixes.map(function (f) { return '<div class="sh-fix"><b>تصحيح</b><p>' + esc(f) + '</p></div>'; }).join('') +
      (u.pages.length ? '<div class="sh-sec"><h3>تعمّق في النظرة العامة</h3><div class="sh-pages">' + u.pages.map(function (p) { return '<a href="' + p.href + '">' + esc(p.t) + '</a>'; }).join('') + '</div></div>' : '') +
      '<div class="sh-sec sh-note"><h3>ملاحظاتي</h3><textarea data-note placeholder="اكتب ما تعلّمته، أو سؤالاً، أو شاهداً تريد الرجوع إليه. يُحفظ في متصفحك.">' + esc(U.notes[u.id] || '') + '</textarea><small data-saved></small></div>' +
      '<div class="sh-btns"><button type="button" class="sh-done' + (done ? ' on' : '') + '" data-done>' + IC.check + (done ? 'درستها' : 'علّمها كمدروسة') + '</button></div>' +
      '<div class="sh-pn">' + (prev ? '<button type="button" data-go-u="' + prev.id + '">' + IC.back + ' <b>' + esc(prev.t) + '</b></button>' : '<span></span>') + (next ? '<button type="button" data-go-u="' + next.id + '"><b>' + esc(next.t) + '</b> ' + IC.chev + '</button>' : '<span></span>') + '</div></div>';
  }

  function wireSheet() {
    $$('[data-go-b]', box).forEach(function (x) { x.addEventListener('click', function () { open('b', x.getAttribute('data-go-b')); }); });
    $$('[data-go-u]', box).forEach(function (x) { x.addEventListener('click', function () { open('u', x.getAttribute('data-go-u')); }); });
    if (current.kind !== 'u') return;
    var u = UNIT[current.id], card = $('[data-kc]', box);
    var showK = function (i) {
      var k = u.key[i]; card.innerHTML = '<b>' + esc(k.t) + '</b><p>' + esc(k.d) + '</p><a class="r" href="' + k.href + '">اقرأ ' + esc(k.label) + '</a>';
      card.style.animation = 'none'; void card.offsetWidth; card.style.animation = '';
      $$('[data-k]', box).forEach(function (p) { p.setAttribute('aria-pressed', String(+p.getAttribute('data-k') === i)); });
    };
    $$('[data-k]', box).forEach(function (p) { p.addEventListener('click', function () { showK(+p.getAttribute('data-k')); }); });
    showK(0);
    var ta = $('[data-note]', box), sv = $('[data-saved]', box), tm;
    ta.addEventListener('input', function () { clearTimeout(tm); tm = setTimeout(function () { var v = ta.value.trim(); if (v) U.notes[u.id] = v; else delete U.notes[u.id]; saveU(); sv.textContent = 'حُفظت'; setTimeout(function () { sv.textContent = ''; }, 1500); }, 400); });
    $('[data-done]', box).addEventListener('click', function () {
      var i = U.done.indexOf(u.id); if (i >= 0) U.done.splice(i, 1); else U.done.push(u.id); saveU(); unitProgress();
      var on = U.done.indexOf(u.id) >= 0, btn = this; btn.classList.toggle('on', on); btn.innerHTML = IC.check + (on ? 'درستها' : 'علّمها كمدروسة');
    });
  }

  // ---------- table of contents: highlight the section in view ----------
  var tocLinks = $$('.ob-toc a');
  if ('IntersectionObserver' in window && tocLinks.length) {
    var secs = tocLinks.map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); }).filter(Boolean);
    var spy = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { tocLinks.forEach(function (a) { var on = a.getAttribute('href') === '#' + e.target.id; a.classList.toggle('on', on); if (on && a.scrollIntoView) { var p = a.parentNode; p.scrollTo({ left: a.offsetLeft - p.clientWidth / 2 + a.clientWidth / 2, behavior: reduce ? 'auto' : 'smooth' }); } }); } });
    }, { rootMargin: '-45% 0px -50% 0px' });
    secs.forEach(function (s) { spy.observe(s); });
  }

  // ---------- reveal ----------
  if ('IntersectionObserver' in window && !reduce) {
    var rv = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); rv.unobserve(e.target); } }); }, { rootMargin: '0px 0px -8% 0px' });
    $$('.ob-h, .ob-pair > div, .ob-sum > div, .ob-unit, .ob-notes > div, .ob-facts > div, .ob-pch, .ob-und').forEach(function (el, i) { el.classList.add('rv'); el.style.transitionDelay = (i % 3) * 70 + 'ms'; rv.observe(el); });
  }

  // ---------- FLIP helper ----------
  var flip = function (els, change, dur) {
    if (reduce) { change(); return; }
    var first = els.map(function (el) { return el.getBoundingClientRect(); });
    change();
    els.forEach(function (el, i) {
      var l = el.getBoundingClientRect(), f = first[i];
      if (!l.width) return;
      var dx = f.left - l.left, dy = f.top - l.top;
      if (!dx && !dy) return;
      el.animate([{ transform: 'translate(' + dx + 'px,' + dy + 'px)' }, { transform: 'none' }], { duration: dur || 450, easing: 'cubic-bezier(.2,.8,.2,1)', delay: Math.min(i * 6, 220) });
    });
  };

  // ---------- library ----------
  var lib = $('#oblib');
  if (lib) {
    $('.ob-filt').hidden = false; $('.ob-chips').hidden = false;
    var tiles = $$('.ob-tile', lib), ft = 'all', fg = null, q = '', byLen = false;
    tiles.forEach(function (t) { var b = BOOK[t.getAttribute('data-book')], r = readIn(b); if (r) t.style.setProperty('--p', Math.round((r / b.ch) * 100) + '%'); t.title = b.full + ' · ' + AR(b.ch) + (r ? ' · قرأت ' + AR(r) : ''); });
    var norm = function (s) { return s.replace(/[ً-ْٰـ]/g, '').replace(/[أإآٱ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه').replace(/ؤ/g, 'و').replace(/ئ/g, 'ي').replace(/ء/g, '').trim(); };
    var apply = function () {
      flip(tiles, function () {
        var vis = 0;
        tiles.forEach(function (t) {
          var ok = (ft === 'all' || t.getAttribute('data-t') === ft) && (!fg || t.getAttribute('data-g') === fg) && (!q || t.getAttribute('data-q').indexOf(q) >= 0);
          t.classList.toggle('off', !ok); if (ok) vis++;
        });
        var order = tiles.slice().sort(function (a, b) { var A = BOOK[a.getAttribute('data-book')], B = BOOK[b.getAttribute('data-book')]; return byLen ? B.ch - A.ch || A.i - B.i : A.i - B.i; });
        order.forEach(function (t) { lib.appendChild(t); });
        $('.ob-empty').hidden = vis > 0;
      }, 420);
    };
    $$('[data-ft]').forEach(function (b) { b.addEventListener('click', function () { ft = b.getAttribute('data-ft'); $$('[data-ft]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); }); $$('[data-fg]').forEach(function (c) { c.hidden = ft !== 'all' && c.getAttribute('data-t') !== ft; if (c.hidden && fg === c.getAttribute('data-fg')) { fg = null; c.setAttribute('aria-pressed', 'false'); } }); apply(); }); });
    $$('[data-fg]').forEach(function (c) { c.addEventListener('click', function () { var g = c.getAttribute('data-fg'); fg = fg === g ? null : g; $$('[data-fg]').forEach(function (x) { x.setAttribute('aria-pressed', String(x.getAttribute('data-fg') === fg)); }); apply(); }); });
    var qi = $('#obq'), qt; qi.addEventListener('input', function () { clearTimeout(qt); qt = setTimeout(function () { q = norm(qi.value); apply(); }, 120); });
    var so = $('[data-sort]'); so.addEventListener('click', function () { byLen = !byLen; so.setAttribute('aria-pressed', String(byLen)); apply(); });
  }

  // ---------- two orders ----------
  var ord = $('#obord'), ordBusy = false;
  if (ord) {
    var otiles = {}; $$('.ot', ord).forEach(function (t) { otiles[t.getAttribute('data-book')] = t; });
    var ours = $$('.oc', ord).map(function (oc) { return { h: $('h4', oc).outerHTML, ids: $$('.ot', oc).map(function (t) { return t.getAttribute('data-book'); }) }; });
    var HEBC = ['#8C2F1E', '#4E5D32', '#B39459'];
    var totals = { ours: '٥ + ١٢ + ٥ + ٥ + ١٢ = ٣٩ سفراً', heb: 'التوراة ٥ + الأنبياء ٨ + الكتب ١١ = ٢٤ سفراً (نفس محتوى الـ ٣٩)' };
    var build = function (mode) {
      Object.keys(otiles).forEach(function (k) { if (otiles[k].parentNode) otiles[k].parentNode.removeChild(otiles[k]); });
      ord.innerHTML = '';
      var cols = mode === 'ours' ? ours.map(function (c) { return { h: c.h, slots: c.ids.map(function (id) { return [id]; }) }; }) :
        D.heb.map(function (c, i) { return { h: '<h4 style="--c:' + HEBC[i] + '">' + c[0] + '<small>' + AR(c[1].length) + '</small></h4>', slots: c[1] }; });
      cols.forEach(function (c) {
        var oc = document.createElement('div'); oc.className = 'oc'; oc.innerHTML = c.h + '<div class="os"></div>';
        var os = $('.os', oc);
        c.slots.forEach(function (s, i) {
          var sl = document.createElement('div'); sl.className = 'slot' + (s.length > 1 ? ' mg' : '');
          if (s.length > 1) sl.setAttribute('data-l', s.length > 2 ? 'سفر واحد: الاثنا عشر' : 'سفر واحد');
          if (mode === 'heb') { var n = document.createElement('span'); n.className = 'num'; n.textContent = AR(i + 1); sl.appendChild(n); }
          s.forEach(function (id) { sl.appendChild(otiles[id]); });
          os.appendChild(sl);
        });
        ord.appendChild(oc);
      });
      ord.setAttribute('data-mode', mode);
      $('[data-ord-tot]').textContent = totals[mode];
    };
    $$('[data-ord]').forEach(function (b) {
      b.addEventListener('click', function () {
        var mode = b.getAttribute('data-ord'); if (ord.getAttribute('data-mode') === mode) return;
        $$('[data-ord]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        ordBusy = true; flip(Object.keys(otiles).map(function (k) { return otiles[k]; }), function () { build(mode); }, 700); setTimeout(function () { ordBusy = false; }, 300);
      });
    });
  }

  // ---------- story: eras carousel ----------
  var track = $('#obtrack');
  if (track) {
    var eras = $$('.era', track), dots = $$('.ob-dots i'), prevB = $('.ob-eras .prev'), nextB = $('.ob-eras .next');
    var idx = function () { var c = track.getBoundingClientRect(), mid = c.left + c.width / 2, best = 0, bd = 1e9; eras.forEach(function (e, i) { var r = e.getBoundingClientRect(), d = Math.abs(r.left + r.width / 2 - mid); if (d < bd) { bd = d; best = i; } }); return best; };
    var mark = function () { var i = idx(); dots.forEach(function (d, j) { d.classList.toggle('on', i === j); }); prevB.disabled = i === 0; nextB.disabled = i === eras.length - 1; };
    var go = function (i) { var e = eras[Math.max(0, Math.min(eras.length - 1, i))]; track.scrollTo({ left: e.offsetLeft - (track.clientWidth - e.clientWidth) / 2, behavior: reduce ? 'auto' : 'smooth' }); };
    prevB.addEventListener('click', function () { go(idx() - 1); });
    nextB.addEventListener('click', function () { go(idx() + 1); });
    var st; track.addEventListener('scroll', function () { clearTimeout(st); st = setTimeout(mark, 60); }, { passive: true });
    // drag with the mouse
    var down = null, moved = false;
    track.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse') return; down = { x: e.clientX, l: track.scrollLeft }; moved = false; });
    window.addEventListener('pointermove', function (e) { if (!down) return; var dx = e.clientX - down.x; if (Math.abs(dx) > 5) { moved = true; track.classList.add('drag'); } track.scrollLeft = down.l - dx; });
    window.addEventListener('pointerup', function () { if (!down) return; down = null; track.classList.remove('drag'); if (moved) go(idx()); });
    track.addEventListener('click', function (e) { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
    mark();
  }

  // ---------- units progress ----------
  function unitProgress() {
    $$('.ob-unit').forEach(function (c) { c.classList.toggle('is-done', U.done.indexOf(c.getAttribute('data-unit')) >= 0); });
    var p = $('.ob-prog'); if (!p) return; p.hidden = false;
    $('[data-udone]', p).textContent = AR(U.done.length);
    $('i', p).style.setProperty('--p', Math.round((U.done.length / D.units.length) * 100) + '%');
  }
  unitProgress();
  var ex = $('[data-export]');
  if (ex) ex.addEventListener('click', function () {
    var lines = ['نظرة عامة على أسفار الكتاب المقدس: ملاحظاتي', ''];
    D.units.forEach(function (u) { var n = U.notes[u.id], d = U.done.indexOf(u.id) >= 0; if (!n && !d) return; lines.push('## ' + u.t + (d ? ' (درستها)' : '')); if (n) lines.push(n); lines.push(''); });
    if (lines.length === 2) lines.push('لا توجد ملاحظات بعد.');
    var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob(['﻿' + lines.join('\n')], { type: 'text/plain;charset=utf-8' })); a.download = 'ملاحظاتي-نظرة-عامة.txt'; document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  });

  // ---------- numbers ----------
  var bars = $('.ob-bars');
  if (bars) {
    var metric = 'ch', shown = false;
    var draw = function () { var mx = +bars.getAttribute('data-max-' + metric); $$('.ob-gbar', bars).forEach(function (g) { var v = +g.getAttribute('data-' + metric); $('.tr i', g).style.width = (shown ? (v / mx) * 100 : 0) + '%'; $('[data-num]', g).textContent = AR(v); }); };
    $$('[data-metric]').forEach(function (b) { b.addEventListener('click', function () { metric = b.getAttribute('data-metric'); $$('[data-metric]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); }); draw(); }); });
    if ('IntersectionObserver' in window) { var bo = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { shown = true; draw(); bo.disconnect(); } }, { threshold: 0.3 }); bo.observe(bars); } else { shown = true; draw(); }
  }

  // ---------- road: the line fills as you scroll ----------
  var road = $('.ob-road');
  if (road) {
    var items = $$('li', road), tick = false;
    var upd = function () {
      tick = false; var r = road.getBoundingClientRect(), vh = window.innerHeight, line = vh * 0.62;
      var f = Math.max(0, Math.min(1, (line - r.top) / r.height)); road.style.setProperty('--fill', f.toFixed(3));
      items.forEach(function (li) { li.classList.toggle('on', li.getBoundingClientRect().top + 20 < line); });
    };
    window.addEventListener('scroll', function () { if (!tick) { tick = true; requestAnimationFrame(upd); } }, { passive: true });
    upd();
  }

  route();
})();
