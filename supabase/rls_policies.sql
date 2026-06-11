-- نفّذ هذا الملف في Supabase → SQL Editor
-- يسمح للتطبيق بالقراءة والكتابة عبر مفتاح anon (بدون تسجيل دخول)
-- عند إضافة المصادقة لاحقاً، استبدل هذه السياسات بسياسات مرتبطة بـ auth.uid()

alter table public.artisan_days enable row level security;
alter table public.artisan_payments enable row level security;

-- إزالة سياسات قديمة إن وُجدت (تجاهل الخطأ إن لم تكن موجودة)
drop policy if exists "artisan_days_all" on public.artisan_days;
drop policy if exists "artisan_payments_all" on public.artisan_payments;

create policy "artisan_days_all"
  on public.artisan_days
  for all
  to anon, authenticated
  using (true)
  with check (true);

create policy "artisan_payments_all"
  on public.artisan_payments
  for all
  to anon, authenticated
  using (true)
  with check (true);
