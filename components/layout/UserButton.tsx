"use client";

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
  const [imgError, setImgError] = useState(false);

  const fallbackInitial = (user.user_metadata.full_name?.charAt(0) || user.email?.charAt(0)?.toUpperCase() || "U");
  const displayName = user.user_metadata.full_name || user.email?.split("@")[0] || "مستخدم";

  return (
    <div className="flex items-center gap-2">
      <div className="text-right hidden sm:block">
        <p className="text-sm font-semibold text-slate-900 leading-tight">
          {displayName}
        </p>
      </div>

      {user.user_metadata.avatar_url && !imgError ? (
        <img
          src={user.user_metadata.avatar_url}
          alt="الصورة الشخصية"
          className="h-10 w-10 rounded-full border border-slate-200 object-cover shadow-sm"
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
