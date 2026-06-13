-- التحقق من جميع الـ Constraints في جداول التطبيق
-- نفّذ هذا الملف في Supabase → SQL Editor للتحقق من الأمان

-- ========================================
-- 1. فحص جدول artisan_days
-- ========================================

SELECT 
    '=== artisan_days Constraints ===' as info;

SELECT 
    conname as constraint_name,
    contype as type,
    pg_get_constraintdef(oid) as definition
FROM pg_constraint 
WHERE conrelid = 'public.artisan_days'::regclass
ORDER BY contype, conname;

-- يجب أن ترى:
-- ✅ artisan_days_pkey: PRIMARY KEY (id)
-- ✅ artisan_days_user_date_unique: UNIQUE (user_id, date)
-- ⚠️ إذا رأيت unique constraint على date فقط، فهناك مشكلة!

-- ========================================
-- 2. فحص جدول artisan_payments
-- ========================================

SELECT 
    '=== artisan_payments Constraints ===' as info;

SELECT 
    conname as constraint_name,
    contype as type,
    pg_get_constraintdef(oid) as definition
FROM pg_constraint 
WHERE conrelid = 'public.artisan_payments'::regclass
ORDER BY contype, conname;

-- المتوقع:
-- ✅ artisan_payments_pkey: PRIMARY KEY (id)
-- ✅ لا يوجد unique constraints أخرى (يمكن للمستخدم تسجيل عدة دفعات في نفس اليوم)

-- ========================================
-- 3. فحص جدول archived_clients
-- ========================================

SELECT 
    '=== archived_clients Constraints ===' as info;

SELECT 
    conname as constraint_name,
    contype as type,
    pg_get_constraintdef(oid) as definition
FROM pg_constraint 
WHERE conrelid = 'public.archived_clients'::regclass
ORDER BY contype, conname;

-- المتوقع:
-- ✅ archived_clients_pkey: PRIMARY KEY (id)
-- ✅ archived_clients_user_id_client_name_key: UNIQUE (user_id, client_name)

-- ========================================
-- 4. فحص RLS (Row Level Security)
-- ========================================

SELECT 
    '=== RLS Status ===' as info;

SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('artisan_days', 'artisan_payments', 'archived_clients')
ORDER BY tablename;

-- يجب أن يكون rls_enabled = true لجميع الجداول

-- ========================================
-- 5. فحص RLS Policies
-- ========================================

SELECT 
    '=== RLS Policies ===' as info;

SELECT 
    tablename,
    policyname,
    cmd as command,
    qual as using_expression
FROM pg_policies 
WHERE schemaname = 'public'
AND tablename IN ('artisan_days', 'artisan_payments', 'archived_clients')
ORDER BY tablename, policyname;

-- يجب أن ترى policies للعمليات: SELECT, INSERT, UPDATE, DELETE
-- كل policy يجب أن يحتوي على: auth.uid() = user_id

-- ========================================
-- 6. ملخص المشاكل المحتملة
-- ========================================

SELECT 
    '=== Potential Issues ===' as info;

-- البحث عن unique constraints خاطئة (بدون user_id)
SELECT 
    'WARNING: ' || conrelid::regclass::text || ' has unique constraint without user_id: ' || conname as issue
FROM pg_constraint con
WHERE conrelid IN (
    'public.artisan_days'::regclass,
    'public.artisan_payments'::regclass,
    'public.archived_clients'::regclass
)
AND contype = 'u'
AND conname NOT LIKE '%pkey'
AND NOT EXISTS (
    SELECT 1 
    FROM pg_attribute 
    WHERE attrelid = con.conrelid 
    AND attnum = ANY(con.conkey)
    AND attname = 'user_id'
)
UNION ALL
-- البحث عن جداول بدون RLS
SELECT 
    'WARNING: Table ' || tablename || ' does not have RLS enabled!' as issue
FROM pg_tables 
WHERE schemaname = 'public'
AND tablename IN ('artisan_days', 'artisan_payments', 'archived_clients')
AND rowsecurity = false;

-- ========================================
-- النتيجة المتوقعة
-- ========================================

-- إذا لم تظهر أي WARNING، فكل شيء آمن! ✅
-- إذا ظهرت WARNING، اتبع التعليمات لإصلاحها
