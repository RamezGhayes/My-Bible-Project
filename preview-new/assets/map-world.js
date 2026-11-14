/* Whole-Bible journey map: shows a card for the selected era or station. */
(function () {
  var data = JSON.parse(document.getElementById('journey-data').textContent);
  var atlas = document.querySelector('.atlas');
  var card = atlas.querySelector('.map-card');
  var W = 1360, H = 880;
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function place(x, y, below) {
    var rect = atlas.getBoundingClientRect();
    var sx = rect.width / W, sy = rect.height / H;
    var cw = Math.min(380, rect.width * 0.9);
    var left = Math.max(10, Math.min(rect.width - cw - 10, x * sx - cw / 2));
    card.style.left = left + 'px';
    card.style.right = 'auto';
    if (below) { card.style.top = (y * sy + 70) + 'px'; card.style.bottom = 'auto'; }
    else { card.style.top = 'auto'; card.style.bottom = (rect.height - y * sy + 70) + 'px'; }
  }
  function show(html, x, y, below) {
    card.innerHTML = '<button type="button" class="close" aria-label="إغلاق">✕</button>' + html;
    card.hidden = false;
    card.querySelector('.close').addEventListener('click', function () { card.hidden = true; });
    place(x, y, below);
  }
  atlas.querySelectorAll('[data-era]').forEach(function (b) {
    b.addEventListener('click', function () {
      var e = data.eras[+b.getAttribute('data-era') - 1];
      var h = '<span class="eyebrow">المرحلة ' + e.num + ' من ١٤</span><span class="t">' + esc(e.title) + '</span><span class="m">' + esc(e.dates) + '</span><p>' + esc(e.summary) + '</p>';
      if (e.books && e.books.length) h += '<div class="chips">' + e.books.map(function (bk) { return '<a class="chip" href="' + bk.href + '">' + esc(bk.name) + '</a>'; }).join('') + '</div>';
      if (e.open) h += '<div class="acts"><a class="btn" href="book/galatians.html">تابع من غلاطية</a><a class="btn ghost" href="paul.html">رحلات بولس</a></div>';
      else h += '<span class="tag" style="padding-top:6px;color:#6A5A43">الدراسة المفصّلة لهذه المرحلة قيد الإعداد، ونص الأسفار متاح الآن.</span>';
      show(h, +b.getAttribute('data-x'), +b.getAttribute('data-y'), +b.getAttribute('data-y') < 500);
    });
  });
  atlas.querySelectorAll('[data-stn]').forEach(function (b) {
    b.addEventListener('click', function () {
      var p = data.paul[+b.getAttribute('data-stn')];
      var h = '<span class="eyebrow">' + esc(p.typeLabel) + ' · المحطة ' + p.num + ' من ٢٠</span><span class="t">' + esc(p.t) + '</span><span class="m">' + esc(p.meta) + '</span><p>' + esc(p.note) + '</p>';
      h += '<div class="acts"><a class="btn" href="' + p.href + '">' + esc(p.cta) + '</a></div>';
      show(h, +b.getAttribute('data-x'), +b.getAttribute('data-y'), false);
    });
  });
  window.addEventListener('resize', function () { card.hidden = true; });
})();
