"use client";

import { createClient } from "@/lib/supabaseBrowser";
import { useState } from "react";
import { toast } from "sonner";
import { Settings, Trash2, User } from "lucide-react";
import { useRouter } from "next/navigation";

export function SettingsContent() {
  const router = useRouter();
  const supabase = createClient();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    if (!confirm("هل أنت متأكد من حذف حسابك؟ هذه العملية لا يمكن التراجع عنها!")) {
      return;
    }

    setIsDeleting(true);
    try {
      // First sign out
      await supabase.auth.signOut();
      toast.success("تم تسجيل الخروج بنجاح");
      router.push("/login");
    } catch (err) {
      console.error(err);
      toast.error("حدث خطأ أثناء تسجيل الخروج");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
            <Settings className="h-5 w-5 text-slate-700" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900">الإعدادات العامة</h2>
        </div>
        <p className="text-sm text-slate-500">
          سيتم إضافة المزيد من الإعدادات قريباً!
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100">
            <User className="h-5 w-5 text-rose-700" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900">الحساب</h2>
        </div>
        <button
          onClick={handleDeleteAccount}
          disabled={isDeleting}
          className="w-full flex items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 hover:bg-rose-100 transition-colors disabled:opacity-50"
        >
          <Trash2 className="h-4 w-4" />
          {isDeleting ? "جارٍ تسجيل الخروج..." : "تسجيل الخروج"}
        </button>
      </div>
    </div>
  );
}
