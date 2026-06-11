"use client";

import { createClient } from "@/lib/supabaseBrowser";
import { LogOut, User, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";

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
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
    router.push("/login");
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const fallbackInitial = (user.user_metadata.full_name?.charAt(0) || user.email?.charAt(0)?.toUpperCase() || "U");
  const displayName = user.user_metadata.full_name || user.email?.split("@")[0] || "مستخدم";

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 transition-all hover:opacity-90 active:scale-95"
      >
        <div className="text-right hidden sm:block">
          <p className="text-sm font-semibold text-slate-900 leading-tight">
            {displayName}
          </p>
          {user.email ? (
            <p className="text-[11px] text-slate-500 truncate max-w-[140px] leading-tight">
              {user.email}
            </p>
          ) : null}
        </div>

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
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 top-full mt-2 w-56 rounded-2xl border border-slate-200 bg-white shadow-xl p-1 z-50">
          {/* User Info in Dropdown */}
          <div className="px-3 py-3 border-b border-slate-100 mb-1">
            <div className="flex items-center gap-3">
              {user.user_metadata.avatar_url && !imgError ? (
                <img
                  src={user.user_metadata.avatar_url}
                  alt="الصورة الشخصية"
                  className="h-10 w-10 rounded-xl border border-slate-200 object-cover"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white font-bold text-base">
                  {fallbackInitial}
                </div>
              )}
              <div>
                <p className="text-sm font-semibold text-slate-900 leading-tight">
                  {displayName}
                </p>
                {user.email ? (
                  <p className="text-[11px] text-slate-500 truncate max-w-[160px] leading-tight">
                    {user.email}
                  </p>
                ) : null}
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <button
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-700 hover:bg-slate-100 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <Settings className="h-4.5 w-4.5 text-slate-500" />
            <span>الإعدادات</span>
          </button>
          <button
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-600 hover:bg-red-50 transition-colors"
            onClick={handleLogout}
          >
            <LogOut className="h-4.5 w-4.5" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      )}
    </div>
  );
}
