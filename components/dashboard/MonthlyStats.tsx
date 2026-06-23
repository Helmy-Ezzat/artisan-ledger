"use client";

import { useMemo, useState } from "react";
import { formatCurrency } from "@/lib/format";
import type { ArtisanDayRow, ArtisanPaymentRow } from "@/lib/database.types";
import { BarChart3, ChevronDown, ChevronUp } from "lucide-react";

interface MonthlyStatsProps {
  workDays: ArtisanDayRow[];
  payments: ArtisanPaymentRow[];
}

const monthNames = [
  "يناير","فبراير","مارس","أبريل","مايو","يونيو",
  "يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر",
];

type MonthStat = {
  key: string;
  year: number;
  month: number;
  workDays: number;
  halfDays: number;
  offDays: number;
  vacationDays: number;
  earned: number;
  received: number;
};

function MonthAccordion({ stat, defaultOpen }: { stat: MonthStat; defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="rounded-xl border border-slate-200 overflow-hidden">
      {/* Header */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between bg-slate-50 px-3 py-2.5 active:bg-slate-100"
      >
        <div className="flex items-center gap-2">
          {open
            ? <ChevronUp className="h-4 w-4 text-slate-400" />
            : <ChevronDown className="h-4 w-4 text-slate-400" />}
          <span className="text-sm font-bold text-slate-700">
            {monthNames[stat.month]} {stat.year}
          </span>
        </div>
        <span className="text-xs font-semibold text-sky-700 bg-sky-50 rounded-lg px-2 py-0.5">
          {formatCurrency(stat.earned)}
        </span>
      </button>

      {/* Body */}
      {open && (
        <div className="bg-white px-3 py-3 space-y-3">
          {/* Day type counts */}
          <div className="grid grid-cols-4 gap-2">
            <div className="text-center">
              <p className="text-[10px] text-slate-500">أيام كاملة</p>
              <p className="text-base font-bold text-sky-700">{stat.workDays}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-slate-500">نصف يوم</p>
              <p className="text-base font-bold text-amber-600">{stat.halfDays}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-slate-500">رجع من الشغل</p>
              <p className="text-base font-bold text-rose-600">{stat.offDays}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-slate-500">إجازة</p>
              <p className="text-base font-bold text-violet-600">{stat.vacationDays}</p>
            </div>
          </div>

          {/* Financial summary */}
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center justify-between rounded-lg bg-sky-50 px-2 py-1.5">
              <span className="text-sky-700 text-xs font-semibold">المستحقات</span>
              <span className="text-sky-700 font-bold text-sm">{formatCurrency(stat.earned)}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-emerald-50 px-2 py-1.5">
              <span className="text-emerald-700 text-xs font-semibold">وصلني</span>
              <span className="text-emerald-700 font-bold text-sm">{formatCurrency(stat.received)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function MonthlyStats({ workDays, payments }: MonthlyStatsProps) {
  const monthlyStats = useMemo(() => {
    const months = new Map<string, MonthStat>();

    workDays.forEach((day) => {
      const date = new Date(`${day.date.slice(0, 10)}T12:00:00+03:00`);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      if (!months.has(key)) {
        months.set(key, {
          key,
          year: date.getFullYear(),
          month: date.getMonth(),
          workDays: 0,
          halfDays: 0,
          offDays: 0,
          vacationDays: 0,
          earned: 0,
          received: 0,
        });
      }
      const stat = months.get(key)!;
      const rate = typeof day.daily_rate === "number" ? day.daily_rate : 0;
      if (day.status === "Full Day")  { stat.workDays++;     stat.earned += rate; }
      else if (day.status === "Half Day")  { stat.halfDays++;    stat.earned += rate / 2; }
      else if (day.status === "Vacation")  { stat.vacationDays++; }
      else                                 { stat.offDays++; }
    });

    payments.forEach((payment) => {
      const date = new Date(`${payment.date.slice(0, 10)}T12:00:00+03:00`);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      if (!months.has(key)) {
        months.set(key, { key, year: date.getFullYear(), month: date.getMonth(),
          workDays: 0, halfDays: 0, offDays: 0, vacationDays: 0, earned: 0, received: 0 });
      }
      const amount = typeof payment.amount === "number" ? payment.amount : 0;
      months.get(key)!.received += amount;
    });

    return Array.from(months.values())
      .sort((a, b) => b.key.localeCompare(a.key))
      .slice(0, 6); // آخر 6 أشهر في الداشبورد
  }, [workDays, payments]);

  if (monthlyStats.length === 0) return null;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-2">
      <div className="flex items-center gap-2 mb-1">
        <BarChart3 className="h-5 w-5 text-violet-600" />
        <h2 className="text-base font-semibold text-slate-900">الإحصائيات الشهرية</h2>
      </div>

      {monthlyStats.map((stat, i) => (
        <MonthAccordion key={stat.key} stat={stat} defaultOpen={i === 0} />
      ))}
    </section>
  );
}
