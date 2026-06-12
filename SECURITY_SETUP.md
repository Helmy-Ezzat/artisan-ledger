# 🔒 إعداد الأمان (Row Level Security)

## ⚠️ مهم جداً: يجب تنفيذ هذه الخطوات!

بدون تطبيق Row Level Security (RLS)، سيتمكن جميع المستخدمين من رؤية بيانات بعضهم البعض!

---

## 📋 الخطوات المطلوبة:

### 1️⃣ افتح Supabase Dashboard
- اذهب إلى: https://app.supabase.com
- اختر مشروعك

### 2️⃣ افتح SQL Editor
- من القائمة الجانبية، اختر **SQL Editor**
- أو اذهب مباشرة إلى: `https://app.supabase.com/project/YOUR_PROJECT/sql`

### 3️⃣ نفّذ الـ SQL Script
- انسخ محتوى ملف `supabase/rls_policies.sql` بالكامل
- الصقه في SQL Editor
- اضغط على **Run** أو **Ctrl + Enter**

### 4️⃣ تحقق من النجاح
يجب أن ترى رسائل نجاح مثل:
```
✓ ALTER TABLE
✓ CREATE POLICY
✓ CREATE POLICY
... إلخ
```

---

## ✅ التحقق من تطبيق RLS:

### طريقة 1: من Supabase Dashboard
1. اذهب إلى **Table Editor**
2. اختر جدول `artisan_days` أو `artisan_payments`
3. اضغط على أيقونة **🔒** (Settings)
4. تحقق من أن **Row Level Security** مفعّل (Enabled)

### طريقة 2: من التطبيق
1. سجّل دخول بإيميل
2. أضف بعض البيانات
3. سجّل خروج
4. سجّل دخول بإيميل آخر
5. يجب ألا ترى أي بيانات من الحساب الأول ✓

---

## 🛡️ ماذا يفعل RLS؟

### بدون RLS (خطر! 🚨):
```javascript
// جميع المستخدمين يشوفوا كل البيانات!
SELECT * FROM artisan_days
→ يرجع بيانات الجميع ❌
```

### مع RLS (آمن! ✅):
```javascript
// كل مستخدم يشوف بياناته فقط
SELECT * FROM artisan_days WHERE user_id = auth.uid()
→ يرجع بيانات المستخدم الحالي فقط ✓
```

---

## 📝 ملاحظات مهمة:

1. **يجب تنفيذ الـ SQL** في Supabase مرة واحدة فقط
2. **الكود الجديد** يفلتر تلقائيًا بناءً على `user_id`
3. **لا تحتاج** إلى SUPABASE_SERVICE_ROLE_KEY إلا إذا أردت تجاوز RLS (غير مستحسن)

---

## 🆘 حل المشاكل:

### إذا ظهرت رسالة خطأ "row-level security":
```
صلاحيات قاعدة البيانات غير مكتملة. نفّذ ملف supabase/rls_policies.sql
```
**الحل**: نفّذ الملف كما في الخطوات أعلاه ☝️

### إذا مازلت ترى بيانات مستخدمين آخرين:
1. تأكد من تنفيذ `rls_policies.sql`
2. امسح cache المتصفح
3. سجّل خروج ثم دخول مرة أخرى
4. تحقق من أن RLS مفعّل في Supabase Dashboard

---

## 📞 للمساعدة:
إذا واجهت أي مشكلة، تحقق من:
- Supabase Logs في Dashboard
- Console المتصفح (F12)
- ملف `.env.local` يحتوي على المفاتيح الصحيحة
