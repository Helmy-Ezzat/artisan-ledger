-- ========================================
-- إعداد كامل لقاعدة بيانات Artisan Ledger
-- نفّذ هذا الملف مرة واحدة في Supabase → SQL Editor
-- ========================================
-- يحتوي على:
-- 1. RLS Policies للجداول الأساسية
-- 2. إصلاح unique constraint لجدول artisan_days
-- 3. إنشاء جدول archived_clients
-- ========================================

-- ========================================
-- الجزء 1: تفعيل RLS للجداول الأساسية
-- ========================================

ALTER TABLE public.artisan_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artisan_payments ENABLE ROW LEVEL SECURITY;

-- إزالة سياسات قديمة إن وُجدت
DROP POLICY IF EXISTS "artisan_days_all" ON public.artisan_days;
DROP POLICY IF EXISTS "artisan_payments_all" ON public.artisan_payments;
DROP POLICY IF EXISTS "Users can view their own days" ON public.artisan_days;
DROP POLICY IF EXISTS "Users can insert their own days" ON public.artisan_days;
DROP POLICY IF EXISTS "Users can update their own days" ON public.artisan_days;
DROP POLICY IF EXISTS "Users can delete their own days" ON public.artisan_days;
DROP POLICY IF EXISTS "Users can view their own payments" ON public.artisan_payments;
DROP POLICY IF EXISTS "Users can insert their own payments" ON public.artisan_payments;
DROP POLICY IF EXISTS "Users can update their own payments" ON public.artisan_payments;
DROP POLICY IF EXISTS "Users can delete their own payments" ON public.artisan_payments;

-- سياسات لجدول أيام العمل
CREATE POLICY "Users can view their own days"
  ON public.artisan_days
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own days"
  ON public.artisan_days
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own days"
  ON public.artisan_days
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own days"
  ON public.artisan_days
  FOR DELETE
  USING (auth.uid() = user_id);

-- سياسات لجدول المدفوعات
CREATE POLICY "Users can view their own payments"
  ON public.artisan_payments
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own payments"
  ON public.artisan_payments
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own payments"
  ON public.artisan_payments
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own payments"
  ON public.artisan_payments
  FOR DELETE
  USING (auth.uid() = user_id);

-- ========================================
-- الجزء 2: إصلاح unique constraint لجدول artisan_days
-- ========================================

-- حذف أي unique constraint قديم (غير صحيح)
DO $$ 
DECLARE
    constraint_rec RECORD;
BEGIN
    FOR constraint_rec IN 
        SELECT con.conname
        FROM pg_constraint con
        WHERE con.conrelid = 'public.artisan_days'::regclass
        AND con.contype = 'u'
        AND con.conname != 'artisan_days_pkey'
        AND con.conname != 'artisan_days_user_date_unique'
    LOOP
        EXECUTE 'ALTER TABLE public.artisan_days DROP CONSTRAINT IF EXISTS ' || quote_ident(constraint_rec.conname);
        RAISE NOTICE 'Dropped old constraint: %', constraint_rec.conname;
    END LOOP;
END $$;

-- إضافة الـ constraint الصحيح (user_id + date)
ALTER TABLE public.artisan_days 
DROP CONSTRAINT IF EXISTS artisan_days_user_date_unique;

ALTER TABLE public.artisan_days 
ADD CONSTRAINT artisan_days_user_date_unique 
UNIQUE (user_id, date);

-- إضافة index لتحسين الأداء
CREATE INDEX IF NOT EXISTS artisan_days_user_id_date_idx 
ON public.artisan_days(user_id, date);

-- ========================================
-- الجزء 3: إنشاء جدول archived_clients
-- ========================================

-- إنشاء الجدول
CREATE TABLE IF NOT EXISTS public.archived_clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_name TEXT NOT NULL,
  archived_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  final_payment_id UUID NULL,
  notes TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  -- Unique constraint: نفس العميل لا يمكن أرشفته مرتين لنفس المستخدم
  UNIQUE(user_id, client_name)
);

-- تفعيل RLS
ALTER TABLE public.archived_clients ENABLE ROW LEVEL SECURITY;

-- إزالة policies قديمة إن وُجدت
DROP POLICY IF EXISTS "Users can view their own archived clients" ON public.archived_clients;
DROP POLICY IF EXISTS "Users can insert their own archived clients" ON public.archived_clients;
DROP POLICY IF EXISTS "Users can update their own archived clients" ON public.archived_clients;
DROP POLICY IF EXISTS "Users can delete their own archived clients" ON public.archived_clients;

-- سياسات RLS لجدول archived_clients
CREATE POLICY "Users can view their own archived clients"
  ON public.archived_clients
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own archived clients"
  ON public.archived_clients
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own archived clients"
  ON public.archived_clients
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own archived clients"
  ON public.archived_clients
  FOR DELETE
  USING (auth.uid() = user_id);

-- Indexes لتحسين الأداء
CREATE INDEX IF NOT EXISTS archived_clients_user_id_idx 
  ON public.archived_clients(user_id);

CREATE INDEX IF NOT EXISTS archived_clients_client_name_idx 
  ON public.archived_clients(user_id, client_name);

-- ========================================
-- التحقق من النجاح
-- ========================================

-- عرض ملخص لجميع الجداول والـ RLS
SELECT 
    '✅ SETUP COMPLETE!' as status,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('artisan_days', 'artisan_payments', 'archived_clients')
ORDER BY tablename;

-- عرض جميع الـ constraints
SELECT 
    '=== Constraints ===' as info,
    conrelid::regclass::text as table_name,
    conname as constraint_name,
    pg_get_constraintdef(oid) as definition
FROM pg_constraint 
WHERE conrelid IN (
    'public.artisan_days'::regclass,
    'public.artisan_payments'::regclass,
    'public.archived_clients'::regclass
)
AND contype = 'u'
ORDER BY conrelid, conname;

-- ========================================
-- النتيجة المتوقعة
-- ========================================
-- يجب أن ترى:
-- ✅ rls_enabled = true لجميع الجداول
-- ✅ artisan_days_user_date_unique: UNIQUE (user_id, date)
-- ✅ archived_clients_user_id_client_name_key: UNIQUE (user_id, client_name)
-- ========================================
