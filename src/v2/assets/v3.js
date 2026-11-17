/* v3 behaviour (design-v3). Nothing here is saved between visits. */
(function () {
  'use strict';
  var $ = function (s, e) { return (e || document).querySelector(s); };
  var $$ = function (s, e) { return Array.prototype.slice.call((e || document).querySelectorAll(s)); };
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- rails: horizontal card rows with prev/next buttons (RTL aware) ----------
  $$('[data-rail]').forEach(function (rail) {
    var k = rail.getAttribute('data-rail');
    var prev = $('[data-rail-prev="' + k + '"]'), next = $('[data-rail-next="' + k + '"]');
    var stepW = function () { var c = rail.children[0]; return c ? c.getBoundingClientRect().width + 16 : 300; };
    // In RTL, scrollLeft is 0 at the start and negative going forward (modern browsers).
    var go = function (d) { rail.scrollBy({ left: -d * stepW(), behavior: reduce ? 'auto' : 'smooth' }); };
    var paint = function () {
      var max = rail.scrollWidth - rail.clientWidth, x = Math.abs(rail.scrollLeft);
      if (prev) prev.disabled = x < 4;
      if (next) next.disabled = x > max - 4;
    };
    if (prev) prev.addEventListener('click', function () { go(-1); });
    if (next) next.addEventListener('click', function () { go(1); });
    rail.addEventListener('scroll', paint, { passive: true });
    window.addEventListener('resize', paint);
    paint();
  });

  // ---------- tabs that filter cards by group: [data-tg] buttons, [data-g] cards in the next .h3cg ----------
  $$('[role=tablist]').forEach(function (bar) {
    var btns = $$('[data-tg]', bar);
    if (!btns.length) return;
    var grid = bar.nextElementSibling;
    btns.forEach(function (b) {
      b.addEventListener('click', function () {
        var g = b.getAttribute('data-tg');
        btns.forEach(function (o) { o.setAttribute('aria-selected', o === b ? 'true' : 'false'); });
        $$('[data-g]', grid).forEach(function (c, i) {
          var on = c.getAttribute('data-g') === g;
          c.hidden = !on;
          if (on) c.style.animationDelay = (i % 12) * 0.04 + 's';
        });
      });
    });
  });
})();
