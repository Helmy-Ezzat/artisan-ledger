"use client";

import { useEffect, useState, useActionState } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { getDayEarning } from "@/lib/calculations";
import {
  PROFESSION_LABELS,
  STATUS_COLORS,
  STATUS_LABELS,
} from "@/lib/constants";
import type { ArtisanDayRow } from "@/lib/database.types";
import { formatCurrency, formatDateLong } from "@/lib/format";
import { X, Edit, Trash2 } from "lucide-react";
import { WorkSessionForm } from "@/components/forms/WorkSessionForm";
import { ConfirmDialog } from "@/components/ui/Dialog";
import { updateWorkSession, deleteWorkSession, type WorkSessionActionState } from "@/app/actions/days";
import { toast } from "sonner";

interface DayDetailSheetProps {
  day: ArtisanDayRow | null;
  clientNames: string[];
  onClose: () => void;
}

export function DayDetailSheet({ day, clientNames, onClose }: DayDetailSheetProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isPending, setIsPending] = useState(false);
  const [localState, setLocalState] = useState<WorkSessionActionState>({
    success: false,
    message: ""
  });
  
  const handleUpdate = async (formData: FormData) => {
    setIsPending(true);
    try {
      const result = await updateWorkSession(day!.id, localState, formData);
      setLocalState(result);
      return result;
    } finally {
      setIsPending(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!day) return;
    setIsDeleting(true);
    try {
      const result = await deleteWorkSession(day.id);
      if (result.success) {
        toast.success(result.message);
        onClose();
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

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

  function handleClose() {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
      setIsEditing(false);
    }, 150);
  }

  if (!mounted || !day) return null;

  const profession =
    PROFESSION_LABELS[day.profession_type as keyof typeof PROFESSION_LABELS] ??
    day.profession_type;
  const earning = getDayEarning(day);
  const colors = STATUS_COLORS[day.status as keyof typeof STATUS_COLORS] ?? {
    bg: "bg-slate-500",
    dot: "bg-slate-500",
    text: "text-slate-700",
  };
  const statusLabel = STATUS_LABELS[day.status as keyof typeof STATUS_LABELS] ?? day.status;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex flex-col justify-end">
      <button
        type="button"
        aria-label="إغلاق"
        onClick={handleClose}
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
              <h3 className="text-lg font-bold text-slate-900">
                {isEditing ? "تعديل يوم العمل" : formatDateLong(day.date)}
              </h3>
            </div>
            <div className="flex gap-2">
              {!isEditing ? (
                <>
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="touch-manipulation flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 active:bg-emerald-200"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    disabled={isDeleting}
                    className="touch-manipulation flex h-11 w-11 items-center justify-center rounded-full bg-red-100 text-red-700 active:bg-red-200 disabled:opacity-50"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="touch-manipulation flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 active:bg-slate-200"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>

          {isEditing ? (
            <div className="mb-6">
              <WorkSessionForm 
                clientNames={clientNames}
                action={handleUpdate} 
                isPending={isPending}
                initialData={{
                  date: day.date,
                  daily_rate: day.daily_rate,
                  status: day.status,
                  profession_type: day.profession_type,
                  client_name: day.client_name,
                  location: day.location ?? undefined,
                  notes: day.notes ?? undefined
                }}
                onSuccess={() => {
                  setIsEditing(false);
                  onClose();
                  router.refresh();
                }}
              />
            </div>
          ) : (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-3">
                <span className="text-sm text-slate-500">الحالة</span>
                <span className={`text-sm font-semibold ${colors.text}`}>
                  {statusLabel}
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
          )}
        </div>
      </div>
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteConfirm}
        title="حذف يوم العمل"
        message="هل أنت متأكد من حذف يوم العمل هذا؟"
        confirmLabel="حذف"
        isLoading={isDeleting}
      />
    </div>,
    document.body,
  );
}
