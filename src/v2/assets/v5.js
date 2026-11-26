// v5: welcome shown on a first visit only, and the reading mode (Quiet Time / Deep Study) kept in this browser.
(function () {
  var get = function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } };
  var set = function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} };

  var i5 = document.getElementById('intro5');
  if (i5) {
    var open = function () { i5.hidden = false; i5.classList.remove('out'); var b = i5.querySelector('.i5go'); if (b) b.focus(); };
    var close = function () { set('sola.intro', '1'); i5.classList.add('out'); setTimeout(function () { i5.hidden = true; }, 450); };
    if (!get('sola.intro')) open();
    i5.addEventListener('click', function (e) { if (e.target.closest('[data-i5-go]')) close(); });
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
    document.querySelectorAll('.chg5 a[data-deep]').forEach(function (a) { var h = a.getAttribute('href').replace(/-study\.html$/, '.html'); a.setAttribute('href', m === 'ds' ? h.replace(/\.html$/, '-study.html') : h); });
  }
  if (picks.length) { picks.forEach(function (p) { p.addEventListener('click', function () { window.SolaMode.set(p.getAttribute('data-mode-pick')); paint(); }); }); paint(); }
  var rl = readList();
  document.querySelectorAll('.chg5 a[data-key]').forEach(function (a) { if (rl.indexOf(a.getAttribute('data-key')) >= 0) { a.classList.add('read'); a.setAttribute('aria-label', a.textContent + ' (قرأته)'); } });
})();
