// Verse peek: inside the overview windows, a link to a verse ("التكوين ١٢: ٣") shows the verse text in a small card
// at the bottom of the window, so the reader stays where they are. The card has a link to open the whole chapter.
(function () {
  var cache = {};
  var toLatin = function (s) { return String(s).replace(/[٠-٩]/g, function (d) { return '٠١٢٣٤٥٦٧٨٩'.indexOf(d); }); };
  var esc = function (s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); };
  var load = function (url) {
    if (!cache[url]) cache[url] = fetch(url).then(function (r) { if (!r.ok) throw 0; return r.text(); }).then(function (t) { return new DOMParser().parseFromString(t, 'text/html'); });
    return cache[url];
  };
  window.obPeek = function (container, card) {
    var close = function () { card.classList.remove('on'); setTimeout(function () { card.hidden = true; }, 200); };
    container.addEventListener('click', function (e) {
      var a = e.target.closest('a[href]'); if (!a || e.metaKey || e.ctrlKey) return;
      var u; try { u = new URL(a.getAttribute('href'), a.baseURI); } catch (x) { return; }
      if (u.origin !== location.origin || !/\/book\/[^/]+\/\d+\.html$/.test(u.pathname) || !/^#v\d+$/.test(u.hash)) return;
      e.preventDefault();
      var from = +u.hash.slice(2), label = (a.getAttribute('data-pk') || a.textContent).trim(), m = toLatin(label).match(/(\d+)\s*[–-]\s*(\d+)\s*$/);
      var to = m && +m[2] > from && +m[2] - from < 8 ? +m[2] : from;
      card.innerHTML = '<div class="pk-h"><b>' + esc(label) + '</b><button type="button" aria-label="إغلاق" data-pk-x>×</button></div><p class="pk-t">…</p>';
      card.hidden = false; requestAnimationFrame(function () { card.classList.add('on'); });
      card.querySelector('[data-pk-x]').onclick = close;
      load(u.pathname).then(function (doc) {
        var parts = [];
        for (var v = from; v <= to; v++) { var el = doc.getElementById('v' + v); if (!el) continue; var c = el.cloneNode(true); var n = c.querySelector('.vn'); if (n) n.remove(); parts.push(c.textContent.trim()); }
        card.querySelector('.pk-t').textContent = parts.join(' ') || 'تعذّر عرض الآية.';
        card.insertAdjacentHTML('beforeend', '<a class="pk-a" href="' + u.pathname + u.hash + '">اقرأ الأصحاح كاملاً</a>');
      }).catch(function () { card.querySelector('.pk-t').textContent = 'تعذّر تحميل الآية الآن.'; });
    });
    return close;
  };
})();
