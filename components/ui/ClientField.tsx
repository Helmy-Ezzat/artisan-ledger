"use client";

import { FieldError } from "@/components/ui/FieldError";
import { useId } from "react";

interface ClientFieldProps {
  clientNames: string[];
  useCustomClient: boolean;
  onModeChange: (custom: boolean) => void;
  error?: string;
  accent?: "sky" | "emerald";
}

const accentStyles = {
  sky: {
    active: "border-sky-600 bg-sky-600 text-white shadow-sm",
    idle: "border-slate-200 bg-white text-slate-700 active:bg-slate-50",
    focus: "focus:border-sky-500 focus:ring-sky-100",
  },
  emerald: {
    active: "border-emerald-600 bg-emerald-600 text-white shadow-sm",
    idle: "border-slate-200 bg-white text-slate-700 active:bg-slate-50",
    focus: "focus:border-emerald-500 focus:ring-emerald-100",
  },
};

export function ClientField({
  clientNames,
  useCustomClient,
  onModeChange,
  error,
  accent = "sky",
}: ClientFieldProps) {
  const id = useId();
  const styles = accentStyles[accent];
  const inputClass = `w-full rounded-xl border border-slate-200 px-3 py-3 text-base outline-none focus:ring-2 ${styles.focus}`;

  return (
    <div>
      <p className="mb-2 text-sm font-medium text-slate-700">العميل</p>

      {clientNames.length > 0 ? (
        <div className="mb-3 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onModeChange(false)}
            className={`touch-manipulation min-h-[48px] rounded-xl border-2 px-3 py-2.5 text-sm font-bold transition ${
              !useCustomClient ? styles.active : styles.idle
            }`}
          >
            عميل سابق
          </button>
          <button
            type="button"
            onClick={() => onModeChange(true)}
            className={`touch-manipulation min-h-[48px] rounded-xl border-2 px-3 py-2.5 text-sm font-bold transition ${
              useCustomClient ? styles.active : styles.idle
            }`}
          >
            عميل جديد
          </button>
        </div>
      ) : null}

      {useCustomClient || clientNames.length === 0 ? (
        <input
          id={id}
          name="client_name"
          type="text"
          placeholder="اكتب اسم العميل"
          required
          autoComplete="off"
          className={inputClass}
        />
      ) : (
        <select
          id={id}
          name="client_name"
          required
          defaultValue=""
          className={`${inputClass} bg-white text-base`}
        >
          <option value="" disabled>
            اختر العميل
          </option>
          {clientNames.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      )}

      <FieldError message={error} />
    </div>
  );
}
