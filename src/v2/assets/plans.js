// Reading plan progress, kept only in this browser (localStorage). Nothing is sent anywhere.
// Store: { active: 'mark', plans: { mark: { done: [1,2], at: 3 } } }  (at = next day to read)
(function () {
  var KEY = 'lmg-plans';
  var AR = function (n) { return String(n).replace(/[0-9]/g, function (d) { return '٠١٢٣٤٥٦٧٨٩'[d]; }); };
  function load() { try { return JSON.parse(localStorage.getItem(KEY)) || { plans: {} }; } catch (e) { return { plans: {} }; } }
  function save(s) { try { localStorage.setItem(KEY, JSON.stringify(s)); return true; } catch (e) { return false; } }
  var S = load(); S.plans = S.plans || {};
  var root = document.body.dataset.root || '';
  function prog(id) { return S.plans[id] || { done: [], at: 1 }; }

  // day page
  var day = document.querySelector('.pday');
  if (day) {
    var id = day.dataset.plan, d = +day.dataset.day, total = +day.dataset.total;
    var btn = day.querySelector('[data-done]'), msg = day.querySelector('[data-done-msg]');
    var p = prog(id);
    function paint() {
      var done = p.done.indexOf(d) >= 0;
      btn.classList.toggle('on', done);
      btn.querySelector('span').textContent = done ? 'قرأت هذا اليوم' : 'أنهيت قراءة اليوم';
    }
    paint();
    btn.addEventListener('click', function () {
      p = prog(id);
      if (p.done.indexOf(d) < 0) p.done.push(d);
      p.at = Math.min(total, Math.max(p.at || 1, d + 1));
      if (p.done.length >= total) p.finished = true;
      S.plans[id] = p; S.active = id;
      var ok = save(S); paint();
      msg.hidden = false;
      msg.textContent = !ok ? 'لم يتمكن المتصفح من حفظ تقدّمك، لكن يمكنك المتابعة بالروابط.' : d < total ? 'رائع. يوم ' + AR(d + 1) + ' في انتظارك غداً، أو متى عدت.' : 'أكملت الخطة كلها. الحمد لله!';
    });
  }

  // plan page: progress bar, ticks, continue button
  var plan = document.querySelector('.pplan');
  if (plan) {
    var pid = plan.dataset.plan, tot = +plan.dataset.total, pp = S.plans[pid];
    if (pp && pp.done.length) {
      plan.querySelector('[data-bar]').style.width = Math.round(pp.done.length / tot * 100) + '%';
      plan.querySelector('[data-count]').textContent = 'قرأت ' + AR(pp.done.length) + ' من ' + AR(tot);
      var go = plan.querySelector('[data-continue]'), next = Math.min(tot, pp.at || 1);
      go.href = pid + '/' + next + '.html';
      go.firstChild.nodeValue = pp.done.length >= tot ? 'أكملت الخطة. اقرأها مرة أخرى ' : 'تابع: اليوم ' + AR(next) + ' ';
      if (pp.done.length >= tot) go.href = pid + '/1.html';
      pp.done.forEach(function (n) { var a = plan.querySelector('[data-day="' + n + '"]'); if (a) a.classList.add('done'); });
    }
  }

  // plan cards (plans.html and home): progress bars
  document.querySelectorAll('.plcard').forEach(function (c) {
    var pc = S.plans[c.dataset.plan]; if (!pc || !pc.done.length) return;
    c.querySelector('[data-bar]').style.width = Math.round(pc.done.length / +c.dataset.total * 100) + '%';
    c.classList.add('started');
  });

  // today: home card and today.html
  var act = S.active && S.plans[S.active] ? S.active : null;
  var tc = document.querySelector('[data-today-card]');
  if (tc && act) {
    var a = S.plans[act], card = document.querySelector('.plcard[data-plan="' + act + '"]');
    var total2 = card ? +card.dataset.total : 0, name = card ? card.querySelector('b').textContent : '';
    if (total2 && !(a.done.length >= total2)) {
      tc.hidden = false;
      tc.href = root + 'plans/' + act + '/' + Math.min(total2, a.at || 1) + '.html';
      tc.querySelector('[data-today-name]').textContent = name;
      tc.querySelector('[data-today-day]').textContent = 'اليوم ' + AR(Math.min(total2, a.at || 1)) + ' من ' + AR(total2);
      var st = document.querySelector('[data-today-start]'); if (st) st.hidden = true;
    }
  }
  if (document.querySelector('[data-today-title]')) {
    if (act) { var b = S.plans[act]; location.replace(root + 'plans/' + act + '/' + (b.at || 1) + '.html'); }
    else location.replace(root + 'plans.html');
  }
})();
