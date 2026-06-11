"use client";

import { createClient } from "@/lib/supabaseBrowser";
import { LogIn } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    try {
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl border border-slate-200 p-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 mb-4">
            <LogIn className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">دفتر الحسابات</h1>
          <p className="text-slate-500 mt-2">سجل دخول لإدارة عملك</p>
        </div>

        <button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:bg-slate-50 active:scale-[0.99] transition-all"
        >
          <svg
            className="w-6 h-6"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M23.7663 12.2764V12.0001H12V24H18.6904C21.5431 21.4975 23.7663 17.1869 23.7663 12.2764Z"
              fill="#4285F4"
            />
            <path
              d="M12 24C15.2281 24 17.9794 22.9687 19.9444 21.2406L13.7736 16.1594C12.722 16.9137 11.4022 17.3333 10.05 17.3333C6.76415 17.3333 4.04054 15.2096 3.05879 12.3058H3L0.209802 12.3344L0 14.8867L0.0255395 14.9182C2.04787 20.1679 6.70034 24 12 24Z"
              fill="#34A853"
            />
            <path
              d="M3.05878 12.3058C2.79658 11.5529 2.64006 10.7519 2.64006 9.99998C2.64006 9.24811 2.79658 8.44711 3.04766 7.69419L3.03882 7.65688L0.238056 5.08829L0 5.11333C0.879397 2.51003 3.18794 0.392975 6.06886 0.0905003L9.09322 0.294881L7.26016 2.84043C6.17807 3.10458 5.22343 3.77986 4.50446 4.73689L3.05878 7.69419Z"
              fill="#FBBC04"
            />
            <path
              d="M23.7664 5.05013C23.7664 2.00651 21.9223 0 19.6226 0C14.9608 0 10.8815 2.96357 10.8815 6.72409C10.8815 8.12079 11.4249 9.4131 12.3311 10.4467L18.5877 15.7831C18.4345 15.9076 18.3129 16.0638 18.2343 16.2426C18.2146 16.2889 18.1969 16.3352 18.1805 16.3809C17.9501 17.0274 17.8173 17.7231 17.8173 18.4722V20.7955H21.5785C23.2157 19.0952 24 15.8754 24 12.2038C24 12.0649 23.7664 11.9365 23.7664 11.8202V5.05013Z"
              fill="#EA4335"
            />
          </svg>
          <span className="text-slate-700 font-semibold">تسجيل دخول باستخدام Google</span>
        </button>
      </div>
    </div>
  );
}
