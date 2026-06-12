"use client";

import { useState } from "react";
import { getTodayISO } from "@/lib/dates";

interface ArabicDateFieldProps {
  id: string;
  name: string;
  defaultValue?: string;
  accent?: "sky" | "emerald";
}

const accentClasses = {
  sky: {
    input: "focus:border-sky-500 focus:ring-sky-100",
  },
  emerald: {
    input: "focus:border-emerald-500 focus:ring-emerald-100",
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
          max={today} // منع اختيار تاريخ في المستقبل
          required
          className={`min-w-0 flex-1 rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2 ${styles.input}`}
        />
      </div>
    </div>
  );
}
