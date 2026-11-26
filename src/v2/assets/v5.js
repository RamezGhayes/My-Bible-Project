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
})();
