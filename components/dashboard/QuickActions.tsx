"use client";

import { Briefcase, ChevronLeft, HandCoins } from "lucide-react";
import Link from "next/link";

interface QuickActionsProps {
  clientNames: string[];
}

export function QuickActions({ clientNames }: QuickActionsProps) {

  return (
    <>
      <section className="flex flex-col gap-2.5">
        {/* تسجيل يوم عمل */}
        <Link
          href="/calendar"
          className="touch-manipulation flex min-h-[56px] items-center justify-between gap-3 rounded-2xl px-4 py-3.5 font-bold transition active:scale-[0.98] bg-sky-600 text-white shadow-md shadow-sky-600/25 active:bg-sky-700"
        >
          <span className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
              <Briefcase className="h-5 w-5" />
            </span>
            <span className="text-base">تسجيل يوم عمل</span>
          </span>
          <ChevronLeft className="h-5 w-5 opacity-80" />
        </Link>

        {/* تسجيل دفعة */}
        <Link
          href="/payments"
          className="touch-manipulation flex min-h-[56px] items-center justify-between gap-3 rounded-2xl px-4 py-3.5 font-bold transition active:scale-[0.98] bg-emerald-600 text-white shadow-md shadow-emerald-600/25 active:bg-emerald-700"
        >
          <span className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
              <HandCoins className="h-5 w-5" />
            </span>
            <span className="text-base">تسجيل دفعة</span>
          </span>
          <ChevronLeft className="h-5 w-5 opacity-80" />
        </Link>

        {/* تصفية حساب عميل */}
        <Link
          href="/settle"
          className="touch-manipulation flex min-h-[56px] items-center justify-between gap-3 rounded-2xl px-4 py-3.5 font-bold transition active:scale-[0.98] bg-rose-600 text-white shadow-md shadow-rose-600/25 active:bg-rose-700"
        >
          <span className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
              <HandCoins className="h-5 w-5" />
            </span>
            <span className="text-base">تصفية حساب عميل</span>
          </span>
          <ChevronLeft className="h-5 w-5 opacity-80" />
        </Link>
      </section>

    </>
  );
}
