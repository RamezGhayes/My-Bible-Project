// Home page prototype (home-v6.html): greeting, the story line (cycles through the stations until you touch it),
// your place (last chapter read, overview journey progress), reveal on scroll.
(function () {
  var D = window.H6 || { st: [] };
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var AR = function (n) { return String(n).replace(/[0-9]/g, function (d) { return '٠١٢٣٤٥٦٧٨٩'[d]; }); };
  var get = function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } };
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  // greeting by the hour
  var h = new Date().getHours(), hi = $('[data-hi]');
  if (hi) hi.textContent = h < 5 ? 'سلام في هدوء الليل' : h < 12 ? 'صباح الخير' : h < 17 ? 'نعمة وسلام' : 'مساء الخير';

  // the story line
  var marks = $$('.h6-line .lm'), cap = $('.h6-cap'), cur = -1, timer = null;
  var show = function (i) {
    if (i === cur || !D.st[i]) return; cur = i; var s = D.st[i];
    marks.forEach(function (m, j) { m.classList.toggle('on', j === i); });
    $('[data-cap-n]').textContent = AR(i + 1);
    $('[data-cap-t]').textContent = s[0]; $('[data-cap-t2]').textContent = s[0]; $('[data-cap-r]').textContent = s[1]; $('[data-cap-d]').textContent = s[2];
    $('[data-cap-a]').setAttribute('href', 'overview.html#s-' + s[3]);
    var sc = $('.h6-sc'); if (sc && sc.scrollWidth > sc.clientWidth + 4) { var r = marks[i].getBoundingClientRect(), c = sc.getBoundingClientRect(); sc.scrollBy({ left: r.left + r.width / 2 - (c.left + c.width / 2), behavior: reduce ? 'auto' : 'smooth' }); }
    cap.classList.remove('swap'); void cap.offsetWidth; cap.classList.add('swap');
  };
  var stop = function () { clearInterval(timer); timer = null; };
  marks.forEach(function (m, i) {
    m.addEventListener('mouseenter', function () { if (window.matchMedia && matchMedia('(hover: hover)').matches) { stop(); show(i); } });
    m.addEventListener('focus', function () { stop(); show(i); });
    m.addEventListener('click', function () { stop(); show(i); });
    m.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); stop(); show(i); } });
  });
  show(0);
  if (!reduce) setTimeout(function () { var i = 0; timer = setInterval(function () { i = (cur + 1) % D.st.length; show(i); }, 3800); }, 3600);

  // your place: last chapter read, overview journey
  try {
    var read = JSON.parse(get('sola.read') || '[]'), last = read[read.length - 1];
    if (last && D.bk) {
      var p = last.split(':'), bk = D.bk[p[0]], a = $('[data-last]');
      if (bk) { a.hidden = false; a.setAttribute('href', 'book/' + bk[0] + '/' + p[1] + '.html'); $('[data-last-t]').textContent = bk[1] + ' ' + AR(p[1]); }
    }
    var seen = JSON.parse(get('sola.ovj') || '[]');
    if (seen.length) { $('[data-ovj-t]').textContent = 'قرأت ' + AR(seen.length) + ' من ٣٢ محطة'; $('[data-ovj-bar]').style.width = Math.round(seen.length / 32 * 100) + '%'; }
  } catch (e) {}

  // reveal sections as they arrive
  if ('IntersectionObserver' in window && !reduce) {
    document.documentElement.classList.add('h6-js');
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { rootMargin: '0px 0px -10% 0px' });
    $$('.h6-h, .h6-door, .h6-mine, .h6-places, .h6-tools').forEach(function (el, i) { el.classList.add('h6-rv'); el.style.transitionDelay = (i % 3) * 90 + 'ms'; io.observe(el); });
  }
})();
