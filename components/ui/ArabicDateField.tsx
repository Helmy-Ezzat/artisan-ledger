"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { getTodayISO } from "@/lib/dates";
import { format, parseISO } from "date-fns";
import { ar } from "date-fns/locale";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { CalendarIcon } from "lucide-react";

interface ArabicDateFieldProps {
  id: string;
  name: string;
  defaultValue?: string;
  accent?: "sky" | "emerald";
  /** ISO date strings (YYYY-MM-DD) of already-registered work days */
  registeredDates?: string[];
}

const accentClasses = {
  sky: {
    input: "focus:border-sky-500 focus:ring-sky-100",
    text: "text-sky-700",
  },
  emerald: {
    input: "focus:border-emerald-500 focus:ring-emerald-100",
    text: "text-emerald-700",
  },
};

export function ArabicDateField({
  id,
  name,
  defaultValue,
  accent = "sky",
  registeredDates = [],
}: ArabicDateFieldProps) {
  const today = getTodayISO();
  const [dateStr, setDateStr] = useState(defaultValue ?? today);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const styles = accentClasses[accent];

  // Convert ISO strings → Date objects once
  const registeredDateObjects = useMemo(
    () => registeredDates.map((d) => parseISO(d)),
    [registeredDates],
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Parse current date string to Date object
  let selectedDate: Date | undefined;
  try {
    if (dateStr) {
      selectedDate = parseISO(dateStr);
    }
  } catch (e) {
    // Ignore invalid dates
  }

  return (
    <div className="relative" ref={containerRef}>
      {/* Hidden input to submit the actual YYYY-MM-DD value */}
      <input type="hidden" id={id} name={name} value={dateStr} />
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 ${styles.input}`}
      >
        <span className="font-medium text-slate-700">
          {selectedDate ? format(selectedDate, "PPP", { locale: ar }) : "اختر التاريخ"}
        </span>
        <CalendarIcon className={`h-4 w-4 ${styles.text}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl left-0 sm:right-0 sm:left-auto" dir="rtl">
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              if (date) {
                setDateStr(format(date, "yyyy-MM-dd"));
                setIsOpen(false);
              }
            }}
            locale={ar}
            disabled={[
              { after: new Date() },
              ...registeredDateObjects,
            ]}
            modifiers={{ registered: registeredDateObjects }}
            modifiersClassNames={{ registered: "rdp-registered" }}
            showOutsideDays
            className="font-sans"
          />
        </div>
      )}
    </div>
  );
}
