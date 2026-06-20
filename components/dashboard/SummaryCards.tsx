"use client";

import { formatCurrency } from "@/lib/format";
import type { DayStats } from "@/lib/calculations";
import { CalendarCheck, Coins } from "lucide-react";

interface SummaryCardsProps {
  totalEarned: number;
  totalReceived: number;
  remainingBalance: number;
  totalWorkDays: number;
  stats: DayStats;
}

const financialItems = [
  { key: "earned" as const, label: "المستحقات", color: "text-sky-600", bg: "bg-sky-50" },
  { key: "received" as const, label: "وصلني", color: "text-emerald-600", bg: "bg-emerald-50" },
  { key: "balance" as const, label: "باقي ليا", color: "text-amber-600", bg: "bg-amber-50" },
];

const workItems = [
  {
    key: "fullDays" as const,
    label: "أيام شغل كاملة",
    color: "bg-sky-500",
    light: "bg-sky-50 text-sky-800",
  },
  {
    key: "halfDays" as const,
    label: "أيام نصف يوم",
    color: "bg-amber-400",
    light: "bg-amber-50 text-amber-800",
  },
  {
    key: "offDays" as const,
    label: "أيام رجعت من الشغل",
    color: "bg-rose-400",
    light: "bg-rose-50 text-rose-800",
  },
];

export function SummaryCards({
  totalEarned,
  totalReceived,
  remainingBalance,
  totalWorkDays,
  stats,
}: SummaryCardsProps) {
  const financialValues = {
    earned: totalEarned,
    received: totalReceived,
    balance: remainingBalance,
  };

  return (
    <>
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-4">
        {/* Financial Section */}
        <div>
          <div className="mb-3 flex items-center gap-2">
            <Coins className="h-5 w-5 text-emerald-600" />
            <h2 className="text-base font-semibold text-slate-900">المالية</h2>
          </div>
          <div className="grid grid-cols-3 gap-2">
          {financialItems.map((item) => {
            let value = 0;
            let displayValue = "";
            let extraClasses = "";
            
            if (item.key === "earned") value = totalEarned;
            else if (item.key === "received") value = totalReceived;
            else value = remainingBalance;

            if (item.key === "balance") {
              if (value > 0) {
                displayValue = formatCurrency(value);
                extraClasses = "text-emerald-700";
              } else if (value < 0) {
                displayValue = formatCurrency(Math.abs(value));
                extraClasses = "text-rose-700";
              } else {
                displayValue = formatCurrency(0);
              }
            } else {
              displayValue = formatCurrency(value);
            }

            return (
              <div
                key={item.key}
                className={`rounded-xl px-2 py-3 text-center ${item.bg}`}
              >
                <p className={`text-[11px] font-bold leading-tight ${item.color}`}>
                  {item.key === "balance" 
                    ? (value > 0 ? "باقي ليا" : value < 0 ? "لقد تجاوزت" : "باقي ليا") 
                    : item.label}
                </p>
                <p
                  className={`mt-1 text-sm font-extrabold leading-tight ${extraClasses || (value < 0 ? "text-red-600" : "text-slate-900")}`}
                >
                  {item.key === "balance" && value < 0 ? `${displayValue} زائد` : displayValue}
                </p>
                {item.key === "earned" && totalWorkDays > 0 && (
                  <p className="mt-0.5 text-[10px] font-medium text-slate-500">
                    ({totalWorkDays} يوم عمل)
                  </p>
                )}
              </div>
            );
          })}
        </div>
        </div>

        <div className="border-t border-slate-100" />

        {/* Work Stats Section */}
        <div>
          <div className="mb-3 flex items-center gap-2">
            <CalendarCheck className="h-5 w-5 text-teal-600" />
            <h2 className="text-base font-semibold text-slate-900">إحصائيات الشغل</h2>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {workItems.map((item) => (
              <div
                key={item.key}
                className={`rounded-xl px-2 py-3 text-center ${item.light}`}
              >
                <div
                  className={`mx-auto mb-2 h-1.5 w-8 rounded-full ${item.color}`}
                />
                <p className="text-2xl font-bold">{stats[item.key]}</p>
                <p className="mt-1 text-[11px] leading-tight font-medium">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
