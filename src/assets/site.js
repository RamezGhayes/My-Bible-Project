/* Site-wide behaviour: tabs, filters, progress kept in this browser. */
(function () {
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem('bs:' + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem('bs:' + k, JSON.stringify(v)); } catch (e) {} }
  };
  window.BS = { store: store };
  var AR = function (x) { return String(x).replace(/[0-9]/g, function (d) { return '٠١٢٣٤٥٦٧٨٩'[d]; }); };
  window.BS.ar = AR;

  // Tabs: <div class="tabs" data-tabs> <button role="tab" data-panel="id">
  document.querySelectorAll('[data-tabs]').forEach(function (bar) {
    var btns = bar.querySelectorAll('[data-panel]');
    btns.forEach(function (b) {
      b.addEventListener('click', function () {
        btns.forEach(function (o) {
          var on = o === b;
          o.setAttribute('aria-selected', on ? 'true' : 'false');
          var p = document.getElementById(o.getAttribute('data-panel'));
          if (p) { p.hidden = !on; if (on) { p.classList.remove('fade-in'); void p.offsetWidth; p.classList.add('fade-in'); } }
        });
      });
    });
  });

  // Filter pills: <div class="pills" data-filter="target-id"> <button data-value="x">; items carry data-group
  document.querySelectorAll('[data-filter]').forEach(function (bar) {
    var target = document.getElementById(bar.getAttribute('data-filter'));
    var btns = bar.querySelectorAll('button');
    btns.forEach(function (b) {
      b.addEventListener('click', function () {
        var v = b.getAttribute('data-value');
        btns.forEach(function (o) { o.setAttribute('aria-selected', o === b ? 'true' : 'false'); });
        target.querySelectorAll('[data-group]').forEach(function (it) { it.hidden = !(v === 'all' || it.getAttribute('data-group') === v); });
      });
    });
  });

  // Outline parts
  document.querySelectorAll('[data-outline]').forEach(function (wrap) {
    var btns = wrap.querySelectorAll('[data-part]');
    btns.forEach(function (b) {
      b.addEventListener('click', function () {
        btns.forEach(function (o) {
          var on = o === b;
          o.setAttribute('aria-pressed', on ? 'true' : 'false');
          var p = document.getElementById(o.getAttribute('data-part'));
          if (p) { p.hidden = !on; if (on) { p.classList.remove('fade-in'); void p.offsetWidth; p.classList.add('fade-in'); } }
        });
      });
    });
  });

  // Book intro progress: sections with [data-complete="book:n"], steps list [data-steps="book"]
  var stepsList = document.querySelector('[data-steps]');
  if (stepsList) {
    var book = stepsList.getAttribute('data-steps');
    var total = +stepsList.getAttribute('data-total');
    var key = 'intro:' + book;
    var done = store.get(key, {});
    var render = function () {
      var count = 0, firstOpen = -1;
      stepsList.querySelectorAll('li:not([data-extra])').forEach(function (li, i) {
        var d = !!done[i + 1];
        if (d) count++; else if (firstOpen < 0) firstOpen = i;
        li.classList.toggle('done', d);
        li.querySelector('.badge').textContent = d ? '✓' : AR(i + 1);
      });
      stepsList.querySelectorAll('li:not([data-extra])').forEach(function (li, i) { li.classList.toggle('next', i === firstOpen); });
      var c = document.querySelector('[data-count]'); if (c) c.textContent = AR(count);
      var bar = document.querySelector('[data-progress]'); if (bar) bar.style.width = Math.round(count / total * 100) + '%';
      var seal = document.querySelector('[data-seal]');
      if (seal) {
        var all = count === total;
        seal.classList.toggle('earned', all);
        seal.querySelector('.d').textContent = all ? 'خُتمت في جواز سفرك' : 'أكمل الأجزاء لتحصل عليه';
        if (all) { var s = store.get('seals', {}); s[book] = 1; store.set('seals', s); }
      }
      document.querySelectorAll('[data-complete]').forEach(function (b) {
        var n = +b.getAttribute('data-complete');
        var d = !!done[n];
        b.classList.toggle('done', d);
        b.textContent = d ? 'أكملت هذا الجزء ✓' : 'أكملت هذا الجزء';
      });
    };
    document.querySelectorAll('[data-complete]').forEach(function (b) {
      b.addEventListener('click', function () {
        var n = +b.getAttribute('data-complete');
        done[n] = !done[n]; store.set(key, done); render();
      });
    });
    render();
  }

  // Reading checklist (chapters read)
  var readAll = store.get('read', {});
  document.querySelectorAll('[data-read]').forEach(function (b) {
    var k = b.getAttribute('data-read');
    var paint = function () {
      var on = !!readAll[k];
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
      if (b.classList.contains('read-toggle')) { b.textContent = on ? 'قرأت هذا الإصحاح ✓' : 'علّم كمقروء'; b.classList.toggle('done', on); }
    };
    b.addEventListener('click', function () { readAll[k] = !readAll[k]; store.set('read', readAll); paint(); });
    paint();
  });
  document.querySelectorAll('.chapter-grid a[data-key]').forEach(function (a) {
    if (readAll[a.getAttribute('data-key')]) a.classList.add('read');
  });

  // Chapter page: remember last place, chapter select, highlight verse ranges from outline
  var chap = document.querySelector('[data-chapter]');
  if (chap) {
    store.set('last', { href: location.pathname.split('/').slice(-3).join('/'), title: chap.getAttribute('data-title'), depth: 2 });
  }
  document.querySelectorAll('select[data-nav]').forEach(function (s) {
    s.addEventListener('change', function () { if (s.value) location.href = s.value; });
  });
  document.querySelectorAll('[data-hl]').forEach(function (a) {
    a.addEventListener('click', function () {
      var r = a.getAttribute('data-hl').split('-');
      var from = +r[0], to = +(r[1] || r[0]);
      document.querySelectorAll('.scripture .v').forEach(function (v) {
        var n = +v.id.slice(1);
        v.classList.toggle('hl', n >= from && n <= to);
      });
    });
  });
  var textSize = store.get('textSize', 0);
  var scr = document.querySelector('.scripture');
  var applySize = function () { if (scr) scr.style.fontSize = (24 + textSize * 2) + 'px'; };
  applySize();
  document.querySelectorAll('[data-size]').forEach(function (b) {
    b.addEventListener('click', function () { textSize = Math.max(-2, Math.min(4, textSize + (+b.getAttribute('data-size')))); store.set('textSize', textSize); applySize(); });
  });

  // Home: continue where you left off
  var cont = document.querySelector('[data-continue]');
  if (cont) {
    var last = store.get('last', null);
    if (last && last.href) {
      cont.querySelector('.t').textContent = last.title;
      cont.querySelector('a').setAttribute('href', last.href);
      cont.classList.add('show');
    }
  }
})();
