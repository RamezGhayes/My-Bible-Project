// «أسفار الكتاب المقدس» (overview/books.html), calm version. Data in window.OVB (built by booksatlas.mjs).
// Without this script the page still reads top to bottom, and every book is a link to its page.
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

  // reading progress, shared with the chapter pages (sola.read = ["Gen:1", ...])
  var readSet = {}; try { JSON.parse(get('sola.read') || '[]').forEach(function (k) { readSet[k] = 1; }); } catch (e) {}
  var readIn = function (b) { var n = 0; for (var c = 1; c <= b.ch; c++) if (readSet[b.id + ':' + c]) n++; return n; };
  // units: studied + notes (this page only)
  var U = { done: [], notes: {} }; try { var s = JSON.parse(get('sola.ovb') || '{}'); U.done = s.done || []; U.notes = s.notes || {}; } catch (e) {}
  var saveU = function () { set('sola.ovb', JSON.stringify(U)); };

  // ---------- hero: numbers count up once ----------
  if (!reduce) $$('[data-count]').forEach(function (el) {
    var to = +el.getAttribute('data-count'), t0 = null;
    var step = function (t) { if (!t0) t0 = t; var p = Math.min(1, (t - t0) / 1200); el.textContent = AR(Math.round(to * (1 - Math.pow(1 - p, 3)))); if (p < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  });

  // ---------- library: quiet progress line on books you have started ----------
  $$('.ob-tile').forEach(function (t) { var b = BOOK[t.getAttribute('data-book')], r = readIn(b); if (r) t.style.setProperty('--p', Math.round((r / b.ch) * 100) + '%'); });

  // ---------- the side panel ----------
  var sheet = $('#obsheet'); if (sheet) document.body.appendChild(sheet);
  var pane = sheet && $('.pn', sheet), box = $('#obsh-c'), lastFocus = null, current = null;
  var open = function (kind, id, push) {
    var html = kind === 'b' ? bookHTML(BOOK[id]) : unitHTML(UNIT[id]);
    if (!html) return;
    current = { kind: kind, id: id };
    box.innerHTML = html;
    if (sheet.hidden) { lastFocus = document.activeElement; sheet.hidden = false; document.documentElement.style.overflow = 'hidden'; }
    box.scrollTop = 0; pane.focus({ preventScroll: true });
    wire();
    var h = '#' + kind + '-' + id;
    if (push !== false && location.hash !== h) history.pushState({ ob: 1 }, '', h);
  };
  var close = function (fromPop) {
    if (!sheet || sheet.hidden) return;
    sheet.hidden = true; document.documentElement.style.overflow = ''; current = null;
    if (!fromPop && /^#[bu]-/.test(location.hash)) { if (history.state && history.state.ob) history.back(); else history.replaceState(null, '', location.pathname); }
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  };
  var route = function () { var m = location.hash.match(/^#([bu])-(.+)$/); if (m && (m[1] === 'b' ? BOOK[m[2]] : UNIT[m[2]])) open(m[1], m[2], false); else close(true); };
  window.addEventListener('popstate', route);
  sheet.addEventListener('click', function (e) { if (e.target.closest('[data-close]')) close(); });
  document.addEventListener('keydown', function (e) {
    if (sheet.hidden) return;
    if (e.key === 'Escape') close();
    if ((e.key === 'ArrowLeft' || e.key === 'ArrowRight') && !/TEXTAREA|INPUT/.test(document.activeElement.tagName)) {
      var list = current.kind === 'b' ? D.books : D.units, i = (current.kind === 'b' ? BOOK : UNIT)[current.id].i + (e.key === 'ArrowLeft' ? 1 : -1);
      if (list[i]) open(current.kind, list[i].id);
    }
  });
  var busy = false;
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-book],[data-unit]');
    if (!t || busy || e.metaKey || e.ctrlKey || e.shiftKey) return;
    var b = t.getAttribute('data-book'), u = t.getAttribute('data-unit');
    if (b && BOOK[b]) { e.preventDefault(); open('b', b); } else if (u && UNIT[u]) { e.preventDefault(); open('u', u); }
  });

  var thumb = function (u) { return u.img ? '<img src="' + u.img + '" alt="">' : '<span class="g">' + esc(u.books.length ? BOOK[u.books[0]].ab : '٤٠٠') + '</span>'; };
  var pn = function (kind, list, i, name) {
    var p = list[i - 1], n = list[i + 1];
    return '<div class="sh-pn">' + (p ? '<button type="button" data-go-' + kind + '="' + p.id + '">' + IC.back + esc(name(p)) + '</button>' : '<span></span>') + (n ? '<button type="button" data-go-' + kind + '="' + n.id + '">' + esc(name(n)) + IC.chev + '</button>' : '<span></span>') + '</div>';
  };

  function bookHTML(b) {
    if (!b) return '';
    var r = readIn(b), keys = [];
    D.units.forEach(function (u) { u.key.forEach(function (k) { if (k.b === b.id) keys.push(k); }); });
    var chs = ''; for (var c = 1; c <= b.ch; c++) chs += '<a href="' + b.ch1 + c + '.html"' + (readSet[b.id + ':' + c] ? ' class="rd"' : '') + '>' + AR(c) + '</a>';
    return '<header class="sh-hd" style="--c:' + GC[b.g] + '"><div class="sh-mk"><i></i>' + esc(b.gn) + ' · السفر ' + AR(b.o) + ' من ٦٦</div><h2 id="obsh-t">' + esc(b.full) + '</h2><div class="sh-meta">' + AR(b.ch) + (b.ch === 1 ? ' أصحاح' : ' أصحاحاً') + ' · ' + AR(b.vs) + ' آية</div></header>' +
      '<div class="sh-bd"><p class="sh-lead">' + esc(b.s) + '</p>' +
      ((b.who || b.when) ? '<div class="sh-sec"><h3>الكاتب والزمن</h3><div class="sh-kv">' + (b.who ? '<div><span>الكاتب</span><p style="margin:0">' + esc(b.who) + tag(b.whoTag) + '</p></div>' : '') + (b.when ? '<div><span>الزمن</span><p style="margin:0">' + esc(b.when) + tag(b.whenTag) + '</p></div>' : '') + '</div></div>' : '') +
      '<div class="sh-sec"><h3>مكانه في القصة</h3>' + b.units.map(function (id) { var u = UNIT[id], rg = u.range && u.range[b.id] ? ' · الأصحاحات ' + u.range[b.id] : ''; return '<button type="button" class="sh-u" data-go-u="' + id + '">' + thumb(u) + '<span><b>' + esc(u.t) + '</b><small>' + esc(ERA[u.era].t) + rg + '</small></span>' + IC.chev + '</button>'; }).join('') + '</div>' +
      (keys.length ? '<div class="sh-sec"><h3>أصحاحات مفتاحية</h3><div class="sh-keys">' + keys.slice(0, 4).map(function (k) { return '<a href="' + k.href + '"><b>' + esc(k.t) + '</b><em>' + esc(k.label) + '</em><span>' + esc(k.d) + '</span></a>'; }).join('') + '</div></div>' : '') +
      '<div class="sh-sec"><h3>الأصحاحات</h3><div class="sh-chs">' + chs + '</div><small>' + (r ? 'قرأت ' + AR(r) + ' من ' + AR(b.ch) : 'الأصحاح المقروء يظهر بالأخضر') + '</small></div>' +
      '<div class="sh-act"><a class="pri" href="' + b.href + '">صفحة السفر</a><a href="' + b.ch1 + '1.html">ابدأ القراءة</a></div>' +
      pn('b', D.books, b.i, function (x) { return x.n; }) + '</div>';
  }

  function unitHTML(u) {
    if (!u) return '';
    var done = U.done.indexOf(u.id) >= 0;
    var bks = u.books.map(function (id) { return '<a href="' + BOOK[id].href + '" data-go-b="' + id + '" class="r">' + esc(BOOK[id].n) + (u.range && u.range[id] ? ' ' + u.range[id] : '') + '</a>'; }).join('، ');
    return (u.img ? '<div class="sh-pic"><img src="' + u.img + '" alt=""></div>' : '') +
      '<header class="sh-hd"><div class="sh-mk">' + esc(ERA[u.era].t) + ' · ' + esc(u.when) + tag(u.whenTag) + '</div><h2 id="obsh-t">' + esc(u.t) + '</h2><div class="sh-meta">' + esc(u.sub) + '</div></header>' +
      '<div class="sh-bd">' + (bks ? '<p class="sh-lead" style="font-size:15.5px">' + bks + '</p>' : '') +
      '<div class="sh-sec"><h3>في سطور</h3><ol class="sh-ol">' + u.outline.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ol></div>' +
      '<div class="sh-sec sh-kc"><h3>أصحاحات مفتاحية</h3><div class="pills">' + u.key.map(function (k, i) { return '<button type="button" data-k="' + i + '" aria-label="' + esc(k.label) + '" aria-pressed="' + (i ? 'false' : 'true') + '">' + AR(i + 1) + '</button>'; }).join('') + '</div><div class="card" data-kc></div></div>' +
      '<div class="sh-sec"><h3>المسيح في هذا الجزء</h3><div class="sh-call"><p>' + esc(u.christ) + '</p><a class="r" href="' + u.cref.href + '">' + esc(u.cref.label) + '</a></div></div>' +
      '<div class="sh-sec"><h3>للتطبيق</h3><p style="margin:0;font-size:16px;line-height:1.95">' + esc(u.apply) + '</p></div>' +
      '<details class="sh-more"><summary>الشخصيات والموضوعات' + (u.fixes.length ? ' والتصحيحات' : '') + '</summary>' +
        '<h4>الشخصيات</h4><p>' + u.people.map(esc).join('، ') + '</p><h4>موضوعات</h4><ul>' + u.themes.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>' +
        (u.terms.length ? '<h4>مصطلحات</h4>' + u.terms.map(function (t) { return '<p><b>' + esc(t.t) + ':</b> ' + esc(t.d) + '</p>'; }).join('') : '') +
        (u.fixes.length ? '<h4>تصحيح</h4>' + u.fixes.map(function (f) { return '<p>' + esc(f) + '</p>'; }).join('') : '') +
        (u.pages.length ? '<h4>تعمّق في النظرة العامة</h4><div class="sh-pages">' + u.pages.map(function (p) { return '<a href="' + p.href + '">' + esc(p.t) + '</a>'; }).join('') + '</div>' : '') +
      '</details>' +
      '<details class="sh-more sh-note"' + (U.notes[u.id] ? ' open' : '') + '><summary>ملاحظاتي</summary><textarea data-note placeholder="ما تعلّمته، أو سؤال، أو شاهد تريد الرجوع إليه. يُحفظ في متصفحك.">' + esc(U.notes[u.id] || '') + '</textarea><small data-saved></small></details>' +
      '<div class="sh-act"><button type="button" data-done class="' + (done ? 'on' : '') + '">' + IC.check + (done ? 'درستها' : 'علّمها كمدروسة') + '</button></div>' +
      pn('u', D.units, u.i, function (x) { return x.t; }) + '</div>';
  }

  function wire() {
    $$('[data-go-b]', box).forEach(function (x) { x.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); open('b', x.getAttribute('data-go-b')); }); });
    $$('[data-go-u]', box).forEach(function (x) { x.addEventListener('click', function (e) { e.stopPropagation(); open('u', x.getAttribute('data-go-u')); }); });
    if (current.kind !== 'u') return;
    var u = UNIT[current.id], card = $('[data-kc]', box);
    var show = function (i) {
      var k = u.key[i]; card.innerHTML = '<b>' + esc(k.t) + '</b><p>' + esc(k.d) + '</p><a class="r" href="' + k.href + '">اقرأ ' + esc(k.label) + '</a>';
      card.style.animation = 'none'; void card.offsetWidth; card.style.animation = '';
      $$('[data-k]', box).forEach(function (p) { p.setAttribute('aria-pressed', String(+p.getAttribute('data-k') === i)); });
    };
    $$('[data-k]', box).forEach(function (p) { p.addEventListener('click', function () { show(+p.getAttribute('data-k')); }); });
    show(0);
    var ta = $('[data-note]', box), sv = $('[data-saved]', box), tm;
    ta.addEventListener('input', function () { clearTimeout(tm); tm = setTimeout(function () { var v = ta.value.trim(); if (v) U.notes[u.id] = v; else delete U.notes[u.id]; saveU(); sv.textContent = 'حُفظت'; setTimeout(function () { sv.textContent = ''; }, 1500); }, 400); });
    $('[data-done]', box).addEventListener('click', function () {
      var i = U.done.indexOf(u.id); if (i >= 0) U.done.splice(i, 1); else U.done.push(u.id); saveU();
      var on = U.done.indexOf(u.id) >= 0; this.className = on ? 'on' : ''; this.innerHTML = IC.check + (on ? 'درستها' : 'علّمها كمدروسة');
    });
  }

  // ---------- library: our order / the Hebrew order (the same tiles move) ----------
  var ord = $('#obord');
  if (ord) {
    var seg = $('.ob-seg'), note = $('.ob-ordnote'); seg.hidden = false;
    var tiles = {}; $$('.ob-tile', ord).forEach(function (t) { tiles[t.getAttribute('data-book')] = t; });
    var oursRows = $$('.ob-grp', ord).map(function (g) { return { label: $('.gl', g).outerHTML, ids: $$('.ob-tile', g).map(function (t) { return [t.getAttribute('data-book')]; }) }; });
    var HEBC = ['#8C2F1E', '#4E5D32', '#B39459'];
    var hebRows = D.heb.map(function (c, i) { return { label: '<div class="gl"><i style="background:' + HEBC[i] + '"></i><b>' + c[0] + '</b><small>' + AR(c[1].length) + '</small></div>', ids: c[1] }; });
    var build = function (rows) {
      Object.keys(tiles).forEach(function (k) { if (tiles[k].parentNode) tiles[k].parentNode.removeChild(tiles[k]); });
      ord.innerHTML = '';
      rows.forEach(function (r) {
        var g = document.createElement('div'); g.className = 'ob-grp'; g.innerHTML = r.label + '<div class="gt"></div>';
        var gt = $('.gt', g);
        r.ids.forEach(function (slot) {
          var host = gt; if (slot.length > 1) { host = document.createElement('span'); host.className = 'mg'; gt.appendChild(host); }
          slot.forEach(function (id) { host.appendChild(tiles[id]); });
        });
        ord.appendChild(g);
      });
    };
    var flip = function (change) {
      var els = Object.keys(tiles).map(function (k) { return tiles[k]; });
      if (reduce) { change(); return; }
      var first = els.map(function (el) { return el.getBoundingClientRect(); });
      change();
      els.forEach(function (el, i) { var l = el.getBoundingClientRect(), f = first[i], dx = f.left - l.left, dy = f.top - l.top; if (dx || dy) el.animate([{ transform: 'translate(' + dx + 'px,' + dy + 'px)' }, { transform: 'none' }], { duration: 650, easing: 'cubic-bezier(.2,.8,.2,1)', delay: i * 8 }); });
    };
    $$('[data-ord]', seg).forEach(function (b) {
      b.addEventListener('click', function () {
        if (b.getAttribute('aria-pressed') === 'true') return;
        var heb = b.getAttribute('data-ord') === 'heb';
        $$('[data-ord]', seg).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        note.hidden = !heb; busy = true; setTimeout(function () { busy = false; }, 400);
        flip(function () { build(heb ? hebRows : oursRows); });
      });
    });
  }

  // ---------- story: one scene at a time ----------
  var tabs = $$('.ob-line [data-era]'), panels = $$('[data-era-p]'), num = $('[data-step-n]'), cur = 0;
  if (tabs.length) {
    var go = function (i, focus) {
      cur = Math.max(0, Math.min(tabs.length - 1, i));
      tabs.forEach(function (t, j) { t.setAttribute('aria-selected', String(j === cur)); t.classList.toggle('past', j < cur); });
      panels.forEach(function (p, j) { p.hidden = j !== cur; });
      num.textContent = AR(cur + 1) + ' من ' + AR(tabs.length);
      $('[data-step="-1"]').disabled = cur === 0; $('[data-step="1"]').disabled = cur === tabs.length - 1;
      var t = tabs[cur], line = t.parentNode; line.scrollTo({ left: t.offsetLeft - line.clientWidth / 2 + t.clientWidth / 2, behavior: reduce ? 'auto' : 'smooth' });
      if (focus) t.focus({ preventScroll: true });
    };
    tabs.forEach(function (t, i) { t.addEventListener('click', function () { go(i); }); t.addEventListener('keydown', function (e) { if (e.key === 'ArrowLeft') go(cur + 1, true); if (e.key === 'ArrowRight') go(cur - 1, true); }); });
    $$('[data-step]').forEach(function (b) { b.addEventListener('click', function () { go(cur + +b.getAttribute('data-step')); }); });
    go(0);
  }

  route();
})();
