/* Paul's journeys: tabs per journey, markers, a ship that sails stop to stop, and a study panel. */
(function () {
  var D = JSON.parse(document.getElementById('paul-data').textContent);
  var GEO = D.geo, J = D.journeys, META = D.meta;
  var AR = window.BS.ar;
  var plate = document.querySelector('.pm-plate');
  var mkLayer = plate.querySelector('.pm-markers');
  var ship = plate.querySelector('.pm-ship');
  var label = plate.querySelector('.pm-label');
  var halo = plate.querySelector('.pulse');
  var tabs = document.querySelector('.pm-tabs');
  var chips = document.querySelector('.pm-chips');
  var panel = document.querySelector('.pm-panel');
  var playBtn = document.querySelector('.play');
  var state = { j: 0, s: 0, playing: false };
  var timer = null;
  var hash = location.hash.replace('#', '');
  var m = /^j(\d)(?:-(\d+))?$/.exec(hash);
  if (m) { state.j = Math.min(J.length - 1, +m[1] - 1); state.s = m[2] ? +m[2] - 1 : 0; }

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function pct(c) { return [GEO[c].px[0] / 10, GEO[c].px[1] / 5.6]; }
  function line(stops) { return stops.map(function (st, i) { return (i ? 'L' : 'M') + GEO[st.c].px[0] + ' ' + GEO[st.c].px[1]; }).join(' '); }
  function stopTimer() { if (timer) { clearInterval(timer); timer = null; } state.playing = false; }

  function render() {
    var jr = J[state.j], stop = jr.stops[state.s];
    tabs.querySelectorAll('button').forEach(function (b, i) { b.setAttribute('aria-selected', i === state.j ? 'true' : 'false'); });
    document.getElementById('pm-other').setAttribute('d', J.filter(function (x, i) { return i !== state.j; }).map(function (x) { return line(x.stops); }).join(' '));
    document.getElementById('pm-full').setAttribute('d', line(jr.stops));
    var dd = line(jr.stops.slice(0, state.s + 1)); document.querySelectorAll('.pm-done').forEach(function (e) { e.setAttribute('d', dd); });
    // markers: one per city (first visit)
    var first = {};
    jr.stops.forEach(function (st, i) { if (first[st.c] === undefined) first[st.c] = i; });
    mkLayer.innerHTML = Object.keys(first).map(function (c) {
      var i = first[c], p = pct(c);
      var cls = c === stop.c ? 'cur' : (i <= state.s ? 'done' : '');
      return '<button type="button" class="pm-mk ' + cls + '" data-i="' + i + '" style="left:' + p[0] + '%;top:' + p[1] + '%" aria-label="' + AR(i + 1) + ': ' + esc(jr.stops[i].t) + '" title="' + esc(jr.stops[i].t) + '">' + AR(i + 1) + '</button>';
    }).join('');
    mkLayer.querySelectorAll('.pm-mk').forEach(function (b) { b.addEventListener('click', function () { stopTimer(); state.s = +b.getAttribute('data-i'); render(); }); });
    var p = pct(stop.c);
    ship.style.left = 'calc(' + p[0] + '% - 26px)'; ship.style.top = 'calc(' + p[1] + '% - 8px)';
    halo.style.left = p[0] + '%'; halo.style.top = p[1] + '%';
    label.style.left = p[0] + '%'; label.style.top = 'calc(' + p[1] + '% + 18px)'; label.textContent = stop.t;
    // chips
    chips.innerHTML = jr.stops.map(function (st, i) {
      return '<button type="button" class="' + (i === state.s ? 'cur' : (i < state.s ? 'done' : '')) + '" data-i="' + i + '"><i>' + AR(i + 1) + '</i>' + esc(st.t) + '</button>';
    }).join('');
    chips.querySelectorAll('button').forEach(function (b) { b.addEventListener('click', function () { stopTimer(); state.s = +b.getAttribute('data-i'); render(); }); });
    document.querySelector('.pm-sum b').textContent = jr.title + ' · ' + AR(jr.ref);
    document.querySelector('.pm-sum span').textContent = META[state.j];
    // panel
    var h = '<div class="head"><span class="eyebrow">المحطة ' + AR(state.s + 1) + ' من ' + AR(jr.stops.length) + '</span><h2>' + esc(stop.t) + '</h2><span class="ref">' + esc(AR(stop.ref)) + '</span></div><div class="body fade-in">';
    if (stop.q) h += '<figure class="verse-block"><blockquote>«' + esc(stop.q) + '»</blockquote><figcaption>' + esc(AR(stop.qr)) + '</figcaption></figure>';
    [['was', 'المكان'], ['happened', 'ماذا حدث هنا'], ['why', 'لماذا يهمّنا'], ['learn', 'ماذا نتعلّم']].forEach(function (k) {
      if (stop[k[0]]) h += '<div class="sec2"><b>' + k[1] + '</b><p>' + esc(AR(stop[k[0]])) + '</p></div>';
    });
    if (stop.letter) h += '<a class="letter" href="' + (stop.letter.href ? 'book/galatians.html' : '#') + '"><i>رسالة كُتبت في هذه المرحلة</i><b>' + esc(stop.letter.t) + '</b><span>' + esc(AR(stop.letter.n)) + '</span></a>';
    h += '</div><div class="foot"><button type="button" class="btn ghost" data-go="-1">السابقة</button><button type="button" class="btn" data-go="1" style="flex:1">' + (state.s === jr.stops.length - 1 ? 'نهاية الرحلة' : 'المحطة التالية') + '</button></div>';
    panel.innerHTML = h;
    panel.querySelectorAll('[data-go]').forEach(function (b) { b.addEventListener('click', function () { go(+b.getAttribute('data-go')); }); });
    playBtn.querySelector('span').textContent = state.playing ? 'إيقاف' : 'تتبّع الرحلة';
    try { history.replaceState(null, '', '#j' + (state.j + 1) + '-' + (state.s + 1)); } catch (e) {}
  }
  function go(d) { stopTimer(); state.s = Math.max(0, Math.min(J[state.j].stops.length - 1, state.s + d)); render(); }
  tabs.querySelectorAll('button').forEach(function (b, i) { b.addEventListener('click', function () { stopTimer(); state.j = i; state.s = 0; render(); }); });
  document.querySelector('[data-prev]').addEventListener('click', function () { go(-1); });
  document.querySelector('[data-next]').addEventListener('click', function () { go(1); });
  playBtn.addEventListener('click', function () {
    if (state.playing) { stopTimer(); render(); return; }
    if (state.s >= J[state.j].stops.length - 1) state.s = 0;
    state.playing = true; render();
    timer = setInterval(function () {
      if (state.s >= J[state.j].stops.length - 1) { stopTimer(); render(); return; }
      state.s++; render();
    }, 3200);
  });
  render();
})();
