"use client";

import { createClient } from "@/lib/supabaseBrowser";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export function UserButton({
  user,
}: {
  user: {
    email?: string | null;
    user_metadata: {
      avatar_url?: string | null;
      full_name?: string | null;
    };
  };
}) {
  const supabase = createClient();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
    router.push("/login");
  };

  return (
    <div className="flex items-center gap-3">
      <div className="text-right">
        <p className="text-sm font-semibold text-slate-900">
          {user.user_metadata.full_name || user.email?.split("@")[0] || "مستخدم"}
        </p>
      </div>
      <button
        onClick={handleLogout}
        className="flex items-center justify-center h-11 w-11 rounded-2xl bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
        aria-label="تسجيل الخروج"
      >
        <LogOut className="h-5 w-5" />
      </button>
      {user.user_metadata.avatar_url ? (
        <img
          src={user.user_metadata.avatar_url}
          alt="الصورة الشخصية"
          className="h-11 w-11 rounded-2xl border border-slate-200 object-cover"
        />
      ) : (
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-200 text-slate-500">
          {user.user_metadata.full_name?.charAt(0) || user.email?.charAt(0)?.toUpperCase() || "U"}
        </div>
      )}
    </div>
  );
}
