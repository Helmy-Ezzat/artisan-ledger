-- Fix unique constraints to include user_id
-- نفّذ هذا الملف في Supabase → SQL Editor
-- هذا الملف يصلح المشكلة اللي كل المستخدمين بيشوفوا خطأ "يوجد يوم عمل مسجّل بالفعل"

-- ========================================
-- الخطوة 1: حذف أي unique constraint قديم على التاريخ فقط
-- ========================================

-- ابحث عن الـ constraint واحذفه
DO $$ 
DECLARE
    constraint_rec RECORD;
BEGIN
    -- ابحث عن كل الـ unique constraints على جدول artisan_days
    FOR constraint_rec IN 
        SELECT con.conname
        FROM pg_constraint con
        WHERE con.conrelid = 'public.artisan_days'::regclass
        AND con.contype = 'u'
        AND con.conname != 'artisan_days_pkey' -- ما نحذفش الـ primary key
    LOOP
        -- احذف الـ constraint
        EXECUTE 'ALTER TABLE public.artisan_days DROP CONSTRAINT IF EXISTS ' || quote_ident(constraint_rec.conname);
        RAISE NOTICE 'Dropped constraint: %', constraint_rec.conname;
    END LOOP;
END $$;

-- ========================================
-- الخطوة 2: إضافة الـ constraint الصحيح (user_id + date)
-- ========================================

ALTER TABLE public.artisan_days 
ADD CONSTRAINT artisan_days_user_date_unique 
UNIQUE (user_id, date);

-- ========================================
-- الخطوة 3: إضافة index لتحسين الأداء
-- ========================================

CREATE INDEX IF NOT EXISTS artisan_days_user_id_date_idx 
ON public.artisan_days(user_id, date);

-- ========================================
-- تأكيد النجاح
-- ========================================

-- اعرض الـ constraints الحالية
SELECT 
    'SUCCESS: Constraint created' as status,
    conname as constraint_name, 
    pg_get_constraintdef(oid) as definition
FROM pg_constraint 
WHERE conrelid = 'public.artisan_days'::regclass
AND contype = 'u'
ORDER BY conname;
