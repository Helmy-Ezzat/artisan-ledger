"use client";

import { createClient } from "@/lib/supabaseBrowser";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
  const [imgError, setImgError] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
    router.push("/login");
  };

  const fallbackInitial = (user.user_metadata.full_name?.charAt(0) || user.email?.charAt(0)?.toUpperCase() || "U");

  return (
    <div className="flex items-center gap-3">
      <div className="text-right">
        <p className="text-sm font-semibold text-slate-900">
          {user.user_metadata.full_name || user.email?.split("@")[0] || "مستخدم"}
        </p>
        {user.email ? (
          <p className="text-[11px] text-slate-500 truncate max-w-[120px]">
            {user.email}
          </p>
        ) : null}
      </div>
      <button
        onClick={handleLogout}
        className="flex items-center justify-center h-10 w-10 rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 transition-all active:scale-95"
        aria-label="تسجيل الخروج"
      >
        <LogOut className="h-4.5 w-4.5" />
      </button>
      {user.user_metadata.avatar_url && !imgError ? (
        <img
          src={user.user_metadata.avatar_url}
          alt="الصورة الشخصية"
          className="h-10 w-10 rounded-xl border border-slate-200 object-cover shadow-sm"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white font-bold text-base shadow-sm">
          {fallbackInitial}
        </div>
      )}
    </div>
  );
}
