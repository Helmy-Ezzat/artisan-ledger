"use client";

import { createClient } from "@/lib/supabaseBrowser";
import { useState } from "react";
import { toast } from "sonner";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { ConfirmDialog } from "@/components/ui/Dialog";

export function SettingsContent() {
  const router = useRouter();
  const supabase = createClient();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await supabase.auth.signOut();
      toast.success("تم تسجيل الخروج بنجاح");
      router.push("/login");
    } catch (err) {
      console.error(err);
      toast.error("حدث خطأ أثناء تسجيل الخروج");
    } finally {
      setIsLoggingOut(false);
      setShowConfirm(false);
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-3">الإعدادات العامة</h2>
          <p className="text-sm text-slate-500">
            سيتم إضافة المزيد من الإعدادات قريباً!
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">الحساب</h2>
          <button
            onClick={() => setShowConfirm(true)}
            disabled={isLoggingOut}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-rose-600 text-white px-4 py-3 text-sm font-semibold hover:bg-rose-700 transition-colors disabled:opacity-50"
          >
            <LogOut className="h-4 w-4" />
            {isLoggingOut ? "جارٍ تسجيل الخروج..." : "تسجيل الخروج"}
          </button>
        </div>
      </div>
      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleLogout}
        title="تسجيل الخروج"
        message="هل أنت متأكد أنك تريد تسجيل الخروج؟"
        confirmLabel="تسجيل الخروج"
        cancelLabel="إلغاء"
        isLoading={isLoggingOut}
      />
    </>
  );
}
