// v5: welcome shown on a first visit only, and the reading mode (Quiet Time / Deep Study) kept in this browser.
(function () {
  var AR = function (n) { return String(n).replace(/[0-9]/g, function (d) { return '٠١٢٣٤٥٦٧٨٩'[d]; }); };
  var get = function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } };
  var set = function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} };

  var i5 = document.getElementById('intro5');
  if (i5) {
    if (i5.parentNode !== document.body) document.body.appendChild(i5);
    var open = function () { i5.hidden = false; i5.classList.remove('out'); var b = i5.querySelector('.i5go'); if (b) b.focus(); };
    var close = function () { set('sola.intro', '1'); i5.classList.add('out'); setTimeout(function () { i5.hidden = true; }, 450); };
    if (!get('sola.intro')) open();
    i5.addEventListener('click', function (e) { var m = e.target.closest('[data-i5-mode]'); if (m) { try { localStorage.setItem('sola.mode', m.getAttribute('data-i5-mode')); } catch (er) {} document.documentElement.dataset.mode = m.getAttribute('data-i5-mode'); if (window.SolaMode) { var pk = document.querySelectorAll('[data-mode-pick]'); pk.forEach(function (p) { p.setAttribute('aria-checked', p.getAttribute('data-mode-pick') === m.getAttribute('data-i5-mode') ? 'true' : 'false'); }); } close(); var t = document.querySelector(m.getAttribute('data-i5-mode') === 'qt' ? '[data-today-start]:not([hidden]),[data-today-card]:not([hidden])' : '.h3tg'); if (t) setTimeout(function () { t.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 500); return; } if (e.target.closest('[data-i5-go]')) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !i5.hidden) close(); });
    var again = document.querySelector('[data-i5-again]'); if (again) again.addEventListener('click', open);
  }

  // Reading mode: 'qt' (Quiet Time) or 'ds' (Deep Study). Pages read it from <html data-mode>.
  window.SolaMode = {
    get: function () { return get('sola.mode') === 'ds' ? 'ds' : 'qt'; },
    set: function (m) { set('sola.mode', m === 'ds' ? 'ds' : 'qt'); document.documentElement.dataset.mode = m === 'ds' ? 'ds' : 'qt'; }
  };
  document.documentElement.dataset.mode = window.SolaMode.get();

  // Chapters read in this browser: a chapter page marks itself; the book grid shows a tick.
  var readList = function () { try { return JSON.parse(get('sola.read') || '[]'); } catch (e) { return []; } };
  var here = document.querySelector('[data-chapter]');
  if (here) { var r = readList(), k = here.getAttribute('data-chapter'); if (r.indexOf(k) < 0) { r.push(k); set('sola.read', JSON.stringify(r)); } }

  // Book page: two mode cards, and the chapter links follow the mode.
  var picks = document.querySelectorAll('[data-mode-pick]');
  function paint() {
    var m = window.SolaMode.get();
    picks.forEach(function (p) { p.setAttribute('aria-checked', p.getAttribute('data-mode-pick') === m ? 'true' : 'false'); });
    if (window.SolaC5) window.SolaC5.paint();
  }
  if (picks.length) { picks.forEach(function (p) { p.addEventListener('click', function () { window.SolaMode.set(p.getAttribute('data-mode-pick')); paint(); }); }); paint(); }
  var rl = readList();
  var st5 = document.querySelector('[data-start]');
  if (st5) { var all = [].slice.call(document.querySelectorAll('.cr5[data-key], .chg5 a[data-key], .car .cc[data-key]')); var any = all.some(function (a) { return rl.indexOf(a.getAttribute('data-key')) >= 0; }); var nx = all.filter(function (a) { return rl.indexOf(a.getAttribute('data-key')) < 0; })[0]; if (any && nx) { st5.setAttribute('href', nx.getAttribute('href')); st5.firstChild.nodeValue = 'تابع القراءة: الأصحاح ' + AR(nx.getAttribute('data-key').split(':')[1]) + ' '; } }
  document.querySelectorAll('.chg5 a[data-key], .cr5[data-key], .car .cc[data-key]').forEach(function (a) { if (rl.indexOf(a.getAttribute('data-key')) >= 0) { a.classList.add('read');  } });

  // ---------- chapter: hub and focused views (hash routing) ----------
  var c5 = document.querySelector('[data-c5]');
  if (c5) {
    var hub = document.getElementById('hub'), back = c5.querySelector('[data-c5back]'), backT = back.querySelector('span:not(.arw)');
    var bookHref = back.getAttribute('href'), bookName = back.getAttribute('data-book'), hereName = back.getAttribute('data-here');
    var views = [].slice.call(c5.querySelectorAll('.c5v'));
    var OLD = { 'read': 'x-read', 'study': '', 'study3': '', 'live3': 'x-reflect', 's-sum': 'x-idea', 's-christ': 'x-christ', 's-map': 'x-bg', 's-people': 'x-bg', 's-bg': 'x-bg', 's-word': 'x-comm', 's-hard': 'x-hard', 's-views': 'x-hard', 's-refs': 'x-more', 's-voices': 'x-voices', 's-you': 'x-reflect' };
    var mode = function () { return window.SolaMode.get(); };
    var inMode = function (v) { return (v.getAttribute('data-modes') || 'qt ds').indexOf(mode()) >= 0; };
    var order = function () { return views.filter(inMode); };
    var cur = null;
    function show(v, target) {
      cur = v;
      hub.hidden = !!v;
      views.forEach(function (x) { x.hidden = x !== v; });
      if (v) {
        backT.textContent = 'العودة إلى ' + hereName; back.setAttribute('href', '#');
        var o = order(), i = o.indexOf(v), nx = v.querySelector('[data-c5next]');
        if (nx) { var n2 = o[i + 1]; if (n2) { nx.textContent = 'القسم التالي: ' + n2.getAttribute('data-t') + ' ←'; nx.setAttribute('href', '#' + n2.id); } else { nx.textContent = ''; nx.removeAttribute('href'); } }
        if (target) { target.classList.add('hl'); setTimeout(function () { window.scrollTo(0, target.getBoundingClientRect().top + window.scrollY - 150); }, 60); }
        else { window.scrollTo(0, 0); setTimeout(function () { window.scrollTo(0, 0); }, 120); v.focus({ preventScroll: true }); }
      } else { backT.textContent = 'العودة إلى ' + bookName; back.setAttribute('href', bookHref); }
    }
    function route() {
      var h = decodeURIComponent(location.hash.slice(1));
      if (OLD.hasOwnProperty(h)) { h = OLD[h]; history.replaceState(null, '', h ? '#' + h : location.pathname + location.search); }
      if (!h || h === 'hub') { var was = cur; show(null); if (was) { var c = hub.querySelector('a[href="#' + was.id + '"]'); if (c) { c.scrollIntoView({ block: 'center' }); } } else window.scrollTo(0, 0); return; }
      if (/^p-/.test(h)) return; // person card overlay
      var el = document.getElementById(h);
      if (!el) return;
      var v = el.classList.contains('c5v') ? el : el.closest('.c5v');
      if (!v) return;
      if (!inMode(v)) window.SolaMode.set('ds');
      [].slice.call(c5.querySelectorAll('.hl')).forEach(function (x) { x.classList.remove('hl'); });
      show(v, v === el ? null : el);
    }
    back.addEventListener('click', function (e) { if (cur) { e.preventDefault(); location.hash = ''; } });
    c5.addEventListener('click', function (e) { if (e.target.closest('[data-c5hub]')) { e.preventDefault(); location.hash = ''; } });
    window.addEventListener('hashchange', route);
    window.SolaC5 = { paint: function () { if (cur && !inMode(cur)) location.hash = ''; else if (cur) show(cur); } };
    route();
    // notes, kept in this browser only
    var ta = c5.querySelector('[data-note]');
    if (ta) {
      var nk = 'sola.note.' + ta.getAttribute('data-note'), st = c5.querySelector('[data-note-state]'), tm;
      ta.value = get(nk) || '';
      ta.addEventListener('input', function () { clearTimeout(tm); tm = setTimeout(function () { set(nk, ta.value); st.textContent = ta.value ? 'حُفظت ملاحظاتك على هذا الجهاز.' : ''; }, 400); });
    }
  }
})();
