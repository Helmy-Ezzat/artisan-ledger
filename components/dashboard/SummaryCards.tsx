"use client";

import { useState, useActionState, useEffect } from "react";
import { createPortal } from "react-dom";
import { formatCurrency, formatDate } from "@/lib/format";
import type { DayStats } from "@/lib/calculations";
import type { ArtisanPaymentRow } from "@/lib/database.types";
import { PAYMENT_METHOD_LABELS } from "@/lib/constants";
import { CalendarCheck, Coins, Receipt, Edit, Trash2, X } from "lucide-react";
import { PaymentForm } from "@/components/forms/PaymentForm";
import { updatePayment, deletePayment, type PaymentActionState } from "@/app/actions/payments";
import { toast } from "sonner";

interface SummaryCardsProps {
  totalEarned: number;
  totalReceived: number;
  remainingBalance: number;
  stats: DayStats;
  recentPayments: ArtisanPaymentRow[];
  clientNames: string[];
}

const financialItems = [
  { key: "earned" as const, label: "اللي ليا", color: "text-sky-600", bg: "bg-sky-50" },
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
  stats,
  recentPayments,
  clientNames,
}: SummaryCardsProps) {
  const financialValues = {
    earned: totalEarned,
    received: totalReceived,
    balance: remainingBalance,
  };

  const [editingPayment, setEditingPayment] = useState<ArtisanPaymentRow | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = (payment: ArtisanPaymentRow) => {
    setEditingPayment(payment);
  };

  const handleDelete = async (paymentId: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه الدفعة؟")) return;
    setIsDeleting(true);
    try {
      const result = await deletePayment(paymentId);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCloseEdit = () => {
    setEditingPayment(null);
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
              const value = financialValues[item.key];
              const isNegative = item.key === "balance" && value < 0;

              return (
                <div
                  key={item.key}
                  className={`rounded-xl px-2 py-3 text-center ${item.bg}`}
                >
                  <p className={`text-[11px] font-bold leading-tight ${item.color}`}>
                    {item.label}
                  </p>
                  <p
                    className={`mt-1 text-sm font-extrabold leading-tight ${
                      isNegative ? "text-red-600" : "text-slate-900"
                    }`}
                  >
                    {formatCurrency(value)}
                  </p>
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

        <div className="border-t border-slate-100" />

        {/* Recent Payments Section */}
        <div>
          <div className="mb-3 flex items-center gap-2">
            <Receipt className="h-5 w-5 text-emerald-600" />
            <h2 className="text-base font-semibold text-slate-900">آخر المدفوعات</h2>
          </div>

          {recentPayments.length === 0 ? (
            <p className="rounded-xl bg-slate-50 px-3 py-6 text-center text-sm text-slate-500">
              لا توجد مدفوعات مسجّلة بعد.
            </p>
          ) : (
            <ul className="space-y-3">
              {recentPayments.map((payment) => (
                <li
                  key={payment.id}
                  className="rounded-xl border border-slate-100 bg-slate-50 p-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-medium text-slate-900">
                        {payment.client_name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {formatDate(payment.date)}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {PAYMENT_METHOD_LABELS[payment.payment_method]}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="shrink-0 font-semibold text-emerald-700">
                        {formatCurrency(payment.amount)}
                      </p>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleEdit(payment)}
                          className="h-7 w-7 flex items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(payment.id)}
                          disabled={isDeleting}
                          className="h-7 w-7 flex items-center justify-center rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {editingPayment &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex items-end justify-center p-4 bg-black/50">
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-4"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900">تعديل الدفعة</h3>
                <button
                  onClick={handleCloseEdit}
                  className="h-9 w-9 flex items-center justify-center rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>
              <PaymentEditForm
                payment={editingPayment}
                clientNames={clientNames}
                onClose={handleCloseEdit}
              />
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}

function PaymentEditForm({
  payment,
  clientNames,
  onClose,
}: {
  payment: ArtisanPaymentRow;
  clientNames: string[];
  onClose: () => void;
}) {
  const [isPending, setIsPending] = useState(false);
  const [localState, setLocalState] = useState<PaymentActionState>({
    success: false,
    message: ""
  });
  
  const handleUpdate = async (formData: FormData) => {
    setIsPending(true);
    try {
      const result = await updatePayment(payment.id, localState, formData);
      setLocalState(result);
      if (result.success) {
        toast.success(result.message);
        onClose();
      } else if (result.message) {
        toast.error(result.message);
      }
      return result;
    } finally {
      setIsPending(false);
    }
  };

  return (
    <PaymentForm
      action={handleUpdate}
      isPending={isPending}
      clientNames={clientNames}
      initialData={{
        ...payment,
        notes: payment.notes ?? undefined
      }}
      submitLabel="تحديث الدفعة"
    />
  );
}
