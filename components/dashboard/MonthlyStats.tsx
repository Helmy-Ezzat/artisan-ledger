"use client";

import { useMemo } from "react";
import { formatCurrency } from "@/lib/format";
import type { ArtisanDayRow, ArtisanPaymentRow } from "@/lib/database.types";
import { BarChart3 } from "lucide-react";

interface MonthlyStatsProps {
  workDays: ArtisanDayRow[];
  payments: ArtisanPaymentRow[];
}

const monthNames = [
  "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
  "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
];

export function MonthlyStats({ workDays, payments }: MonthlyStatsProps) {
  const monthlyStats = useMemo(() => {
    const months = new Map<string, {
      year: number;
      month: number;
      workDays: number;
      halfDays: number;
      offDays: number;
      earned: number;
      received: number;
    }>();

    workDays.forEach((day) => {
      const date = new Date(day.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      if (!months.has(monthKey)) {
        months.set(monthKey, {
          year: date.getFullYear(),
          month: date.getMonth(),
          workDays: 0,
          halfDays: 0,
          offDays: 0,
          earned: 0,
          received: 0,
        });
      }
      const stat = months.get(monthKey)!;
      stat.workDays += day.status === "Full Day" ? 1 : 0;
      stat.halfDays += day.status === "Half Day" ? 1 : 0;
      stat.offDays += day.status === "Holiday" ? 1 : 0;
      stat.earned += day.status === "Full Day" ? day.daily_rate : day.status === "Half Day" ? day.daily_rate / 2 : 0;
    });

    payments.forEach((payment) => {
      const date = new Date(payment.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      if (!months.has(monthKey)) {
        months.set(monthKey, {
          year: date.getFullYear(),
          month: date.getMonth(),
          workDays: 0,
          halfDays: 0,
          offDays: 0,
          earned: 0,
          received: 0,
        });
      }
      const stat = months.get(monthKey)!;
      stat.received += payment.amount;
    });

    return Array.from(months.values())
      .sort((a, b) => {
        if (a.year !== b.year) return b.year - a.year;
        return b.month - a.month;
      })
      .slice(0, 3); // آخر 3 أشهر فقط في الداشبورد
  }, [workDays, payments]);

  if (monthlyStats.length === 0) return null;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
      <div className="flex items-center gap-2">
        <BarChart3 className="h-5 w-5 text-violet-600" />
        <h2 className="text-base font-semibold text-slate-900">الإحصائيات الشهرية</h2>
      </div>
      <div className="space-y-3">
        {monthlyStats.map((stat, index) => (
          <div key={index} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
            <h4 className="font-semibold text-slate-900 mb-2">
              {monthNames[stat.month]} {stat.year}
            </h4>
            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className="text-center">
                <p className="text-[10px] text-slate-500">أيام كاملة</p>
                <p className="text-base font-bold text-sky-700">{stat.workDays}</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] text-slate-500">نصف يوم</p>
                <p className="text-base font-bold text-amber-600">{stat.halfDays}</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] text-slate-500">إجازات</p>
                <p className="text-base font-bold text-rose-600">{stat.offDays}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center justify-between rounded-lg bg-sky-100 px-2 py-1.5">
                <span className="text-sky-700 text-xs font-semibold">المستحقات</span>
                <span className="text-sky-700 font-bold">{formatCurrency(stat.earned)}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-emerald-100 px-2 py-1.5">
                <span className="text-emerald-700 text-xs font-semibold">وصلني</span>
                <span className="text-emerald-700 font-bold">{formatCurrency(stat.received)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
