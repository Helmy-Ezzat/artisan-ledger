import type { DayStats } from "@/lib/calculations";
import { CalendarCheck } from "lucide-react";

interface WorkDayStatsProps {
  stats: DayStats;
}

const items = [
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

export function WorkDayStats({ stats }: WorkDayStatsProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <header className="mb-3 flex items-center gap-2">
        <CalendarCheck className="h-5 w-5 text-teal-600" />
        <h2 className="text-base font-semibold text-slate-900">إحصائيات الشغل</h2>
      </header>

      <div className="grid grid-cols-3 gap-2">
        {items.map((item) => (
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
    </section>
  );
}
