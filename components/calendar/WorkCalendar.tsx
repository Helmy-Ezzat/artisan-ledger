"use client";

import { useMemo, useState } from "react";
import { DayDetailSheet } from "@/components/calendar/DayDetailSheet";
import {
  STATUS_COLORS,
  STATUS_LABELS,
  WEEKDAY_LABELS,
} from "@/lib/constants";
import { buildMonthGrid } from "@/lib/calendar";
import type { ArtisanDayRow } from "@/lib/database.types";
import { getTodayISO, normalizeDateKey } from "@/lib/dates";
import { formatMonthYear } from "@/lib/format";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface WorkCalendarProps {
  days: ArtisanDayRow[];
  clientNames: string[];
}

export function WorkCalendar({ days, clientNames }: WorkCalendarProps) {
  const now = new Date();
  const [view, setView] = useState({
    year: now.getFullYear(),
    month: now.getMonth(),
  });
  const [selectedDay, setSelectedDay] = useState<ArtisanDayRow | null>(null);
  const { year, month } = view;

  const daysByDate = useMemo(
    () =>
      new Map(
        days.map((day) => [normalizeDateKey(day.date), day]),
      ),
    [days],
  );

  const cells = useMemo(() => buildMonthGrid(year, month), [year, month]);
  const todayKey = getTodayISO();

  function goToPrevMonth() {
    setView(({ year: y, month: m }) =>
      m === 0 ? { year: y - 1, month: 11 } : { year: y, month: m - 1 },
    );
  }

  function goToNextMonth() {
    setView(({ year: y, month: m }) =>
      m === 11 ? { year: y + 1, month: 0 } : { year: y, month: m + 1 },
    );
  }

  function goToToday() {
    setView({ year: now.getFullYear(), month: now.getMonth() });
  }

  function openDay(record: ArtisanDayRow) {
    // debug: log when openDay is invoked
    // eslint-disable-next-line no-console
    console.log("WorkCalendar.openDay", record.date);
    setSelectedDay(record);
  }

  return (
    <>
      <section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
        <div className="mb-3 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={goToPrevMonth}
            className="touch-manipulation flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 active:bg-slate-200"
            aria-label="الشهر السابق"
          >
            <ChevronRight className="h-6 w-6 pointer-events-none" />
          </button>

          <div className="min-w-0 flex-1 text-center">
            <p className="truncate text-base font-bold text-slate-900">
              {formatMonthYear(year, month)}
            </p>
            <button
              type="button"
              onClick={goToToday}
              className="touch-manipulation mt-1 min-h-[32px] px-2 text-xs font-bold text-teal-600 active:text-teal-800"
            >
              الرجوع لليوم
            </button>
          </div>

          <button
            type="button"
            onClick={goToNextMonth}
            className="touch-manipulation flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 active:bg-slate-200"
            aria-label="الشهر التالي"
          >
            <ChevronLeft className="h-6 w-6 pointer-events-none" />
          </button>
        </div>

        <div className="mb-1 grid grid-cols-7 gap-1">
          {WEEKDAY_LABELS.map((label) => (
            <div
              key={label}
              className="py-1 text-center text-[10px] font-bold text-slate-400"
            >
              {label}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1.5">
          {cells.map((cell) => {
            const record = daysByDate.get(cell.dateKey);
            const isToday = cell.dateKey === todayKey;
            const statusColor = record ? STATUS_COLORS[record.status] : null;

            if (record) {
              return (
                <button
                  key={cell.dateKey}
                  type="button"
                  onClick={() => openDay(record)}
                  className={`touch-manipulation relative flex min-h-[44px] flex-col items-center justify-center rounded-xl text-sm font-bold text-white shadow-sm active:scale-95 ${statusColor?.bg} ${
                    !cell.inMonth ? "opacity-60" : ""
                  }`}
                >
                  {cell.day}
                </button>
              );
            }

            return (
              <div
                key={cell.dateKey}
                className={`flex min-h-[44px] items-center justify-center rounded-xl text-sm ${
                  !cell.inMonth
                    ? "text-slate-300"
                    : isToday
                      ? "font-bold text-teal-700 ring-2 ring-teal-400 ring-inset"
                      : "text-slate-600"
                }`}
              >
                {cell.day}
              </div>
            );
          })}
        </div>

        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 border-t border-slate-100 pt-3">
          {(["Full Day", "Half Day", "Holiday"] as const).map((status) => (
            <div
              key={status}
              className="flex items-center gap-1.5 text-xs text-slate-600"
            >
              <span
                className={`h-3 w-3 rounded-full ${STATUS_COLORS[status].dot}`}
              />
              {STATUS_LABELS[status]}
            </div>
          ))}
        </div>
      </section>

      <DayDetailSheet
        day={selectedDay}
        clientNames={clientNames}
        onClose={() => setSelectedDay(null)}
      />
    </>
  );
}
