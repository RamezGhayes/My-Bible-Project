// Accounts (optional). When site.config.json "auth" has a Supabase url and anon key, readers can sign in with
// Google or an email link, and their reading-plan progress (localStorage 'lmg-plans') is kept in sync across devices
// in the table public.progress (see docs/login-setup.md). Without those keys nothing is loaded and nothing is sent.
const cfg = JSON.parse(document.body.dataset.auth || '{}');
const root = document.body.dataset.root || '';
const KEY = 'lmg-plans';
const on = cfg.provider === 'supabase' && cfg.url && cfg.anonKey;
const $ = (s) => document.querySelector(s);
const label = (t) => document.querySelectorAll('[data-acct-label]').forEach((e) => { e.textContent = t; });

let sb = null;
async function client() {
  if (!on) return null;
  if (sb) return sb;
  const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
  sb = createClient(cfg.url, cfg.anonKey);
  return sb;
}
const local = () => { try { return JSON.parse(localStorage.getItem(KEY)) || { plans: {} }; } catch (e) { return { plans: {} }; } };
const setLocal = (v) => { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) {} };
// merge two progress records: union of finished days, furthest next day
function merge(a, b) {
  const out = { active: a.active || b.active, plans: {} };
  for (const id of new Set([...Object.keys(a.plans || {}), ...Object.keys(b.plans || {})])) {
    const x = (a.plans || {})[id] || { done: [], at: 1 }, y = (b.plans || {})[id] || { done: [], at: 1 };
    out.plans[id] = { done: [...new Set([...(x.done || []), ...(y.done || [])])].sort((m, n) => m - n), at: Math.max(x.at || 1, y.at || 1) };
  }
  return out;
}
async function sync(c, user) {
  const { data } = await c.from('progress').select('data').eq('user_id', user.id).maybeSingle();
  const merged = merge(local(), (data && data.data) || { plans: {} });
  setLocal(merged);
  await c.from('progress').upsert({ user_id: user.id, data: merged, updated_at: new Date().toISOString() });
}

(async () => {
  const c = await client();
  const page = $('[data-login]');
  if (!c) { if (page) page.classList.add('off'); return; }
  const { data: { session } } = await c.auth.getSession();
  const user = session && session.user;
  if (user) {
    label((user.user_metadata && (user.user_metadata.full_name || user.user_metadata.name)) || 'حسابي');
    await sync(c, user);
    // keep the server copy up to date whenever a plan day is marked as read
    document.addEventListener('click', (e) => { if (e.target.closest('[data-done]')) setTimeout(() => sync(c, user), 300); });
  }
  if (!page) return;
  page.classList.toggle('in', !!user);
  if (user) { const n = $('[data-who]'); if (n) n.textContent = user.email || ''; }
  const back = root + 'index.html';
  const msg = (t, bad) => { const m = $('[data-msg]'); m.hidden = false; m.textContent = t; m.classList.toggle('bad', !!bad); };
  const google = $('[data-google]');
  if (google) google.addEventListener('click', async () => {
    const { error } = await c.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: location.href } });
    if (error) msg('تعذّر الدخول بحساب Google. حاول مرة أخرى.', true);
  });
  const form = $('[data-email-form]');
  if (form) form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = form.email.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return msg('اكتب بريداً إلكترونياً صحيحاً.', true);
    form.querySelector('button').disabled = true;
    const { error } = await c.auth.signInWithOtp({ email, options: { emailRedirectTo: location.href } });
    form.querySelector('button').disabled = false;
    if (error) msg('لم نتمكن من إرسال الرابط. حاول بعد قليل.', true);
    else msg('أرسلنا رابط الدخول إلى ' + email + '. افتحه من نفس الجهاز.');
  });
  const out = $('[data-signout]');
  if (out) out.addEventListener('click', async () => { await c.auth.signOut(); location.href = back; });
})();
