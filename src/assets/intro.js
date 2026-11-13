/* Opening sequence and calm generated music (Web Audio, no audio files). */
(function () {
  var store = window.BS.store;
  var intro = document.querySelector('.intro');
  var soundBtn = document.querySelector('.sound');
  var music = null;

  function Music() {
    var AC = window.AudioContext || window.webkitAudioContext;
    var ctx = new AC();
    var master = ctx.createGain(); master.gain.value = 0;
    var lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1400; lp.Q.value = 0.3;
    // simple reverb from a decaying noise impulse
    var conv = ctx.createConvolver();
    var len = ctx.sampleRate * 4.5, imp = ctx.createBuffer(2, len, ctx.sampleRate);
    for (var c = 0; c < 2; c++) { var d = imp.getChannelData(c); for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6); }
    conv.buffer = imp;
    var wet = ctx.createGain(); wet.gain.value = 0.55;
    var dry = ctx.createGain(); dry.gain.value = 0.6;
    lp.connect(dry); lp.connect(conv); conv.connect(wet);
    dry.connect(master); wet.connect(master); master.connect(ctx.destination);

    var hz = function (m) { return 440 * Math.pow(2, (m - 69) / 12); };
    // D major: Dmaj9, Bm7, Gmaj7, Asus2
    var chords = [[50, 57, 62, 66, 69, 76], [47, 54, 62, 66, 69, 74], [43, 55, 59, 62, 66, 71], [45, 52, 57, 59, 64, 69]];
    var bells = [74, 76, 78, 81, 83, 86];
    var step = 0, timer = null, bellTimer = null;
    function pad(notes, t, dur) {
      notes.forEach(function (m, idx) {
        [-4, 4].forEach(function (det) {
          var o = ctx.createOscillator(); o.type = idx < 2 ? 'sine' : 'triangle';
          o.frequency.value = hz(m); o.detune.value = det;
          var g = ctx.createGain(); var peak = (idx < 2 ? 0.05 : 0.03);
          g.gain.setValueAtTime(0, t);
          g.gain.linearRampToValueAtTime(peak, t + 3.2);
          g.gain.setValueAtTime(peak, t + dur - 1);
          g.gain.linearRampToValueAtTime(0, t + dur + 3.5);
          o.connect(g); g.connect(lp); o.start(t); o.stop(t + dur + 4);
        });
      });
    }
    function bell() {
      var t = ctx.currentTime + 0.05;
      var o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = hz(bells[Math.floor(Math.random() * bells.length)]);
      var g = ctx.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.035, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + 5);
      o.connect(g); g.connect(conv); g.connect(dry); o.start(t); o.stop(t + 5.2);
      bellTimer = setTimeout(bell, 3500 + Math.random() * 5000);
    }
    function loop() { pad(chords[step % chords.length], ctx.currentTime + 0.05, 8); step++; timer = setTimeout(loop, 8000); }
    return {
      start: function () {
        if (ctx.state === 'suspended') ctx.resume();
        master.gain.cancelScheduledValues(ctx.currentTime);
        master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
        master.gain.linearRampToValueAtTime(0.8, ctx.currentTime + 4);
        if (!timer) { loop(); bellTimer = setTimeout(bell, 2500); }
      },
      stop: function () {
        master.gain.cancelScheduledValues(ctx.currentTime);
        master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
        master.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.5);
        clearTimeout(timer); clearTimeout(bellTimer); timer = null;
      }
    };
  }

  var playing = false;
  function setSound(on) {
    try {
      if (on) { if (!music) music = Music(); music.start(); } else if (music) music.stop();
      playing = on;
    } catch (e) { playing = false; }
    if (soundBtn) {
      soundBtn.classList.add('show');
      soundBtn.setAttribute('aria-pressed', playing ? 'true' : 'false');
      soundBtn.setAttribute('aria-label', playing ? 'إيقاف الموسيقى' : 'تشغيل الموسيقى');
      soundBtn.innerHTML = playing
        ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11"/></svg>'
        : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9z"/><path d="M17 9l5 6M22 9l-5 6"/></svg>';
    }
  }
  if (soundBtn) soundBtn.addEventListener('click', function () { setSound(!playing); });

  if (!intro) return;
  var seen = store.get('introSeen', false);
  var force = location.hash === '#intro';
  if (seen && !force) { intro.remove(); if (soundBtn) setSound(false); return; }

  document.documentElement.style.overflow = 'hidden';
  var words = intro.querySelectorAll('.iv span');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var route = intro.querySelector('.route');
  if (route && route.getTotalLength) route.style.setProperty('--len', Math.ceil(route.getTotalLength()));
  requestAnimationFrame(function () { intro.classList.add('is-playing'); });
  var t0 = reduce ? 200 : 4200;
  words.forEach(function (w, i) { setTimeout(function () { w.classList.add('on'); }, t0 + i * (reduce ? 0 : 380)); });
  setTimeout(function () { intro.querySelector('.ivref').classList.add('on'); }, t0 + words.length * (reduce ? 0 : 380) + 400);
  setTimeout(function () { intro.querySelector('.actions').classList.add('on'); }, reduce ? 300 : t0 + words.length * 380 + 1200);

  function close(withMusic) {
    store.set('introSeen', true);
    intro.classList.add('gone');
    document.documentElement.style.overflow = '';
    setSound(!!withMusic);
    setTimeout(function () { intro.remove(); }, 1100);
    if (location.hash === '#intro') history.replaceState(null, '', location.pathname);
  }
  intro.querySelector('.enter').addEventListener('click', function () { close(true); });
  intro.querySelector('.enter-quiet').addEventListener('click', function () { close(false); });
  intro.querySelector('.skip-intro').addEventListener('click', function () { close(false); });
})();
