"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { getDayEarning } from "@/lib/calculations";
import {
  PROFESSION_LABELS,
  STATUS_COLORS,
  STATUS_LABELS,
} from "@/lib/constants";
import type { ArtisanDayRow } from "@/lib/database.types";
import { formatCurrency, formatDateLong, formatHijriDate } from "@/lib/format";
import { X } from "lucide-react";

interface DayDetailSheetProps {
  day: ArtisanDayRow | null;
  onClose: () => void;
}

export function DayDetailSheet({ day, onClose }: DayDetailSheetProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!day) return;

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [day]);

  if (!mounted || !day) return null;

  const profession =
    PROFESSION_LABELS[day.profession_type as keyof typeof PROFESSION_LABELS] ??
    day.profession_type;
  const earning = getDayEarning(day);
  const colors = STATUS_COLORS[day.status];

  return createPortal(
    <div className="fixed inset-0 z-[100] flex flex-col justify-end">
      <button
        type="button"
        aria-label="إغلاق"
        onTouchStart={(e) => { e.preventDefault(); onClose(); }}
        onClick={onClose}
        className="absolute inset-0 touch-manipulation bg-black/50"
      />
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className="relative mx-auto w-full max-w-lg rounded-t-3xl border border-slate-200 bg-white shadow-2xl"
      >
        <div className="flex justify-center pt-3">
          <div className="h-1 w-10 rounded-full bg-slate-300" />
        </div>

        <div className="max-h-[75vh] overflow-y-auto overscroll-contain px-4 pb-[max(5.5rem,env(safe-area-inset-bottom))] pt-2">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <p className="text-xs text-slate-500">{formatHijriDate(day.date)}</p>
              <h3 className="text-lg font-bold text-slate-900">
                {formatDateLong(day.date)}
              </h3>
            </div>
            <button
              type="button"
              onTouchStart={(e) => { e.preventDefault(); onClose(); }}
              onClick={onClose}
              className="touch-manipulation flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 active:bg-slate-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-2.5">
            <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-3">
              <span className="text-sm text-slate-500">الحالة</span>
              <span className={`text-sm font-semibold ${colors.text}`}>
                {STATUS_LABELS[day.status]}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-3">
              <span className="text-sm text-slate-500">الأجر</span>
              <span className="text-sm font-bold text-slate-900">
                {formatCurrency(earning)}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-3">
              <span className="text-sm text-slate-500">العميل</span>
              <span className="text-sm font-semibold text-slate-900">
                {day.client_name}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-3">
              <span className="text-sm text-slate-500">المهنة</span>
              <span className="text-sm font-semibold text-slate-900">
                {profession}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-3">
              <span className="text-sm text-slate-500">الأجر اليومي</span>
              <span className="text-sm font-semibold text-slate-900">
                {formatCurrency(day.daily_rate)}
              </span>
            </div>

            {day.location ? (
              <div className="rounded-xl bg-slate-50 px-3 py-3">
                <p className="mb-1 text-sm text-slate-500">الموقع</p>
                <p className="text-sm font-semibold text-slate-900">
                  {day.location}
                </p>
              </div>
            ) : null}

            {day.notes ? (
              <div className="rounded-xl bg-amber-50 px-3 py-3">
                <p className="mb-1 text-sm font-medium text-amber-800">ملاحظات</p>
                <p className="text-sm leading-relaxed text-amber-900">
                  {day.notes}
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
