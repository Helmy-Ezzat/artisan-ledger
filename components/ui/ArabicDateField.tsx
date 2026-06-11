"use client";

import { useState } from "react";
import { getTodayISO } from "@/lib/dates";
import { formatDateLong, formatHijriDate } from "@/lib/format";

interface ArabicDateFieldProps {
  id: string;
  name: string;
  defaultValue?: string;
  accent?: "sky" | "emerald";
}

const accentClasses = {
  sky: {
    input: "focus:border-sky-500 focus:ring-sky-100",
    chip: "border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100",
    chipActive: "border-sky-500 bg-sky-600 text-white",
  },
  emerald: {
    input: "focus:border-emerald-500 focus:ring-emerald-100",
    chip: "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
    chipActive: "border-emerald-500 bg-emerald-600 text-white",
  },
};

export function ArabicDateField({
  id,
  name,
  defaultValue,
  accent = "sky",
}: ArabicDateFieldProps) {
  const today = getTodayISO();
  const [date, setDate] = useState(defaultValue ?? today);
  const styles = accentClasses[accent];
  const isToday = date === today;

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          id={id}
          name={name}
          type="date"
          value={date}
          onChange={(event) => setDate(event.target.value)}
          lang="ar-SA"
          required
          className={`min-w-0 flex-1 rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2 ${styles.input}`}
        />
        <button
          type="button"
          onClick={() => setDate(today)}
          className={`shrink-0 rounded-xl border px-3 py-2.5 text-sm font-medium transition ${
            isToday ? styles.chipActive : styles.chip
          }`}
        >
          اليوم
        </button>
      </div>
      {date ? (
        <div className="rounded-xl bg-slate-50 px-3 py-2 text-xs leading-relaxed text-slate-600">
          <p>{formatDateLong(date)}</p>
          <p className="mt-0.5 text-slate-500">{formatHijriDate(date)}</p>
        </div>
      ) : null}
    </div>
  );
}
