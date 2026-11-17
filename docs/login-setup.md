# تفعيل تسجيل الدخول

صفحة الدخول (login.html) جاهزة، وتعمل حين يُضاف مفتاحا مشروع Supabase إلى site.config.json. بدونهما يعمل الموقع كله بلا حساب، والتقدّم يُحفظ على الجهاز.

## الخطوات (مرة واحدة)
1. أنشئ مشروعاً مجانياً على supabase.com.
2. من **SQL Editor** شغّل:
```sql
create table public.progress (
  user_id uuid primary key references auth.users on delete cascade,
  data jsonb not null default '{}',
  updated_at timestamptz default now()
);
alter table public.progress enable row level security;
create policy "own progress" on public.progress
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
```
3. **Authentication → Providers**: فعّل Email (رابط الدخول السحري)، وفعّل Google وأضف Client ID وSecret من Google Cloud Console.
4. **Authentication → URL Configuration**: ضع رابط الموقع النهائي في Site URL، وأضف `http://localhost:3000/*` للتجربة.
5. من **Settings → API** انسخ Project URL و anon public key إلى site.config.json:
```json
"auth": { "provider": "supabase", "url": "https://xxxx.supabase.co", "anonKey": "eyJ..." }
```
المفتاح anon مصمَّم ليكون علنياً، والحماية في سياسة RLS أعلاه: كل قارئ يرى صفّه فقط.

## ما يُحفظ
فقط تقدّم خطط القراءة (الأيام المقروءة واليوم التالي). لا يُحفظ شيء آخر عن القارئ.
