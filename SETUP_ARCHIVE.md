# 🚀 إعداد ميزة الأرشيف (Archive)

## المشكلة
لما تفتح صفحة الأرشيف (`/archive`)، يظهر خطأ:
```
تعذّر تحميل الأرشيف: Could not find the table 'public.archived_clients'
```

**السبب:** الجدول مش موجود في قاعدة البيانات بعد!

---

## ✅ الحل (خطوة واحدة)

### نفّذ Migration للأرشيف

1. **افتح Supabase Dashboard**
   - اذهب إلى: https://app.supabase.com
   - اختر مشروعك

2. **افتح SQL Editor**
   - من القائمة الجانبية، اختر **SQL Editor**

3. **نفّذ الكود**
   - افتح الملف: `supabase/archived_clients_migration.sql`
   - انسخ **كل** المحتوى
   - الصقه في SQL Editor
   - اضغط **Run** (أو Ctrl + Enter)

---

## ✨ ماذا سيحدث؟

سيتم إنشاء:
- ✅ جدول `archived_clients` لتخزين العملاء المؤرشفين
- ✅ Row Level Security (RLS) policies للأمان
- ✅ Indexes لتحسين الأداء
- ✅ Unique constraint على (user_id, client_name)

---

## 🎯 تأكد من النجاح

بعد تنفيذ الـ SQL، يجب أن ترى رسائل نجاح مثل:
```
CREATE TABLE
ALTER TABLE
CREATE POLICY
CREATE POLICY
...
CREATE INDEX
```

لو شفت أي خطأ، تحقق من:
- ✅ نسخت كل الملف (من أول سطر لآخر سطر)
- ✅ أنت في المشروع الصحيح
- ✅ لديك صلاحيات الإدارة

---

## 🧪 جرب الميزة

بعد تنفيذ الـ migration:

1. **صفحة الأرشيف:**
   - روح على `/archive` في التطبيق
   - يجب أن تشوف صفحة فاضية (لأن مافيش عملاء مؤرشفين بعد)
   - الرسالة: "لا يوجد عملاء مؤرشفون"

2. **أرشفة عميل:**
   - روح على الصفحة الرئيسية
   - اضغط على "تصفية حساب عميل"
   - اختر عميل واملأ البيانات
   - اضغط "تصفية الحساب"
   - يجب أن يتم نقلك لصفحة الأرشيف ✅

3. **إلغاء الأرشفة:**
   - في صفحة الأرشيف، اضغط على أي عميل
   - اضغط "إلغاء الأرشفة"
   - العميل يرجع للقوائم العادية ✅

---

## 📋 الترتيب الصحيح لإعداد التطبيق

إذا كنت تعد التطبيق لأول مرة، نفذ بهذا الترتيب:

### 1️⃣ RLS Policies (الأساسي)
```
supabase/rls_policies.sql
```
لإنشاء سياسات الأمان للجداول الأساسية

### 2️⃣ Fix Unique Constraint (إصلاح مشكلة التاريخ)
```
supabase/fix_unique_constraints.sql
```
لإصلاح مشكلة "يوجد يوم عمل مسجّل بالفعل"

### 3️⃣ Archive Migration (ميزة الأرشيف)
```
supabase/archived_clients_migration.sql
```
لإضافة ميزة أرشفة العملاء

---

## ⚠️ ملاحظات مهمة

### الجدول جديد
- لو التطبيق كان شغال قبل كده، `archived_clients` جدول جديد
- مش هيأثر على أي بيانات موجودة
- آمن 100% للتنفيذ

### الميزة اختيارية
- لو مش عايز تستخدم الأرشيف دلوقتي، عادي
- بس لازم تنفذ الـ migration عشان ما يظهرش خطأ
- تقدر تستخدم الميزة في أي وقت بعدين

### التراجع
لو عايز تشيل الميزة كاملة:
```sql
DROP TABLE IF EXISTS public.archived_clients CASCADE;
```

---

## 🔍 التحقق من الجدول

بعد التنفيذ، تأكد أن الجدول موجود:

```sql
-- في Supabase SQL Editor
SELECT * FROM public.archived_clients LIMIT 5;
```

يجب أن ترى:
```
0 rows returned (or actual data if you archived clients)
```

إذا ظهر خطأ "table does not exist"، يعني الـ migration لم يتم تنفيذه بنجاح.

---

## 🆘 حل المشاكل

### خطأ: "relation already exists"
**معناها:** الجدول موجود بالفعل
**الحل:** امسح الجدول وأعد التنفيذ:
```sql
DROP TABLE IF EXISTS public.archived_clients CASCADE;
-- ثم نفذ migration مرة أخرى
```

### خطأ: "permission denied"
**معناها:** ليس لديك صلاحيات
**الحل:** تأكد أنك:
- صاحب المشروع أو لديك صلاحيات admin
- في المشروع الصحيح في Supabase

### الصفحة لا تزال تعرض خطأ
**الحل:**
1. تأكد من تنفيذ الـ SQL بنجاح
2. أعد تشغيل التطبيق (npm run dev)
3. امسح cache المتصفح (Ctrl + Shift + R)
4. سجل خروج ثم دخول مرة أخرى

---

## 📞 للمساعدة

تحقق من:
- ✅ Supabase Logs في Dashboard
- ✅ Browser Console (F12)
- ✅ ملف `.env.local` يحتوي على المفاتيح الصحيحة
- ✅ الاتصال بالإنترنت جيد

---

## 📚 مستندات إضافية

للمزيد من التفاصيل عن ميزة الأرشيف:
- اقرأ: `ARCHIVE_FEATURE.md`
- للأمان: `SECURITY_SETUP.md`
