-- نفّذ هذا الملف في Supabase → SQL Editor
-- سياسات أمان صارمة لربط كل صف بالمستخدم الذي أنشأه

alter table public.artisan_days enable row level security;
alter table public.artisan_payments enable row level security;

-- إزالة سياسات قديمة إن وُجدت (تجاهل الخطأ إن لم تكن موجودة)
drop policy if exists "artisan_days_all" on public.artisan_days;
drop policy if exists "artisan_payments_all" on public.artisan_payments;

-- سياسات لجدول أيام العمل
create policy "Users can view their own days"
  on public.artisan_days
  for select
  using (auth.uid() = user_id);

create policy "Users can insert their own days"
  on public.artisan_days
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own days"
  on public.artisan_days
  for update
  using (auth.uid() = user_id);

create policy "Users can delete their own days"
  on public.artisan_days
  for delete
  using (auth.uid() = user_id);

-- سياسات لجدول المدفوعات
create policy "Users can view their own payments"
  on public.artisan_payments
  for select
  using (auth.uid() = user_id);

create policy "Users can insert their own payments"
  on public.artisan_payments
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own payments"
  on public.artisan_payments
  for update
  using (auth.uid() = user_id);

create policy "Users can delete their own payments"
  on public.artisan_payments
  for delete
  using (auth.uid() = user_id);
