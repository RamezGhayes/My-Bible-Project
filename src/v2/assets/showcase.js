// Home showcase: rotate slides every 8s (pause on hover/focus), restart each slide's animation when it shows,
// and turn the person cards over in turn.
(function () {
  var root = document.querySelector('[data-sc]'); if (!root) return;
  var slides = root.querySelectorAll('.scsl'), texts = root.querySelectorAll('.sctx'), dots = root.querySelectorAll('.scdots button');
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var i = 0, timer = null, flip = null, paused = false;
  function people(on) {
    clearInterval(flip); var cards = root.querySelectorAll('.scc'), k = 0, back = false;
    cards.forEach(function (c, n) { c.classList.toggle('on', n === 0); c.classList.remove('flip'); });
    if (!on || reduce) return;
    flip = setInterval(function () {
      if (paused) return;
      if (!back) { cards[k].classList.add('flip'); back = true; }
      else { cards[k].classList.remove('on', 'flip'); k = (k + 1) % cards.length; cards[k].classList.add('on'); back = false; }
    }, 2200);
  }
  function show(n) {
    i = (n + slides.length) % slides.length;
    slides.forEach(function (s, k) {
      var on = k === i;
      if (on) { s.classList.remove('on'); void s.offsetWidth; } // restart the CSS animations
      s.classList.toggle('on', on);
    });
    texts.forEach(function (t, k) { t.classList.toggle('on', k === i); });
    dots.forEach(function (d, k) { d.setAttribute('aria-selected', k === i ? 'true' : 'false'); });
    people(slides[i].querySelector('.scp') !== null);
  }
  function run() { clearInterval(timer); if (!reduce) timer = setInterval(function () { if (!paused) show(i + 1); }, 9000); }
  dots.forEach(function (d, k) { d.addEventListener('click', function () { show(k); run(); }); });
  root.addEventListener('mouseenter', function () { paused = true; });
  root.addEventListener('mouseleave', function () { paused = false; });
  root.addEventListener('focusin', function () { paused = true; });
  root.addEventListener('focusout', function () { paused = false; });
  var sx = null; root.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
  root.addEventListener('touchend', function (e) { if (sx === null) return; var dx = e.changedTouches[0].clientX - sx; sx = null; if (Math.abs(dx) > 50) { show(i + (dx < 0 ? 1 : -1)); run(); } });
  show(0); run();
})();
