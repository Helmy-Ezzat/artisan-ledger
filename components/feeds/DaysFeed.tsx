import { getDayEarning } from "@/lib/calculations";
import { PROFESSION_LABELS, STATUS_LABELS } from "@/lib/constants";
import type { ArtisanDayRow } from "@/lib/database.types";
import { formatCurrency, formatDate } from "@/lib/format";
import { CalendarDays } from "lucide-react";

interface DaysFeedProps {
  days: ArtisanDayRow[];
}

export function DaysFeed({ days }: DaysFeedProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <header className="mb-4 flex items-center gap-2">
        <CalendarDays className="h-5 w-5 text-sky-600" />
        <h2 className="text-base font-semibold text-slate-900">
          آخر أيام العمل
        </h2>
      </header>

      {days.length === 0 ? (
        <p className="rounded-xl bg-slate-50 px-3 py-6 text-center text-sm text-slate-500">
          لا توجد أيام عمل مسجّلة بعد.
        </p>
      ) : (
        <ul className="space-y-3">
          {days.map((day) => {
            const earning = getDayEarning(day);
            const profession =
              PROFESSION_LABELS[
                day.profession_type as keyof typeof PROFESSION_LABELS
              ] ?? day.profession_type;

            return (
              <li
                key={day.id}
                className="rounded-xl border border-slate-100 bg-slate-50 p-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-slate-900">
                      {day.client_name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {formatDate(day.date)} · {profession}
                    </p>
                    {day.location ? (
                      <p className="mt-1 truncate text-xs text-slate-500">
                        {day.location}
                      </p>
                    ) : null}
                  </div>
                  <div className="shrink-0 text-left">
                    <p className="font-semibold text-slate-900">
                      {formatCurrency(earning)}
                    </p>
                    <p className="text-xs text-slate-500">
                      {STATUS_LABELS[day.status]}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
