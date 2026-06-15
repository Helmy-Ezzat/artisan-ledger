"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { PaymentForm } from "@/components/forms/PaymentForm";
import { formatDate, formatCurrency } from "@/lib/format";
import { Plus, Receipt, Trash2, Edit } from "lucide-react";
import { Drawer } from "@/components/ui/Drawer";
import type { ArtisanPaymentRow } from "@/lib/database.types";
import { deletePayment, updatePayment, type PaymentActionState } from "@/app/actions/payments";
import { toast } from "sonner";
import { PAYMENT_METHOD_LABELS } from "@/lib/constants";

interface PaymentsContentProps {
  initialPayments: ArtisanPaymentRow[];
  clientNames: string[];
}

export function PaymentsContent({ initialPayments, clientNames }: PaymentsContentProps) {
  const [payments, setPayments] = useState<ArtisanPaymentRow[]>(initialPayments);
  const [deletePaymentId, setDeletePaymentId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingPayment, setEditingPayment] = useState<ArtisanPaymentRow | null>(null);
  const [editState, setEditState] = useState<PaymentActionState>({ success: false, message: "" });
  const [showPaymentDrawer, setShowPaymentDrawer] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setPayments(initialPayments);
  }, [initialPayments]);

  const handleDelete = useCallback(async () => {
    if (!deletePaymentId) return;
    setIsDeleting(true);
    try {
      const result = await deletePayment(deletePaymentId);
      if (result.success) {
        toast.success(result.message);
        setPayments((prev) => prev.filter((p) => p.id !== deletePaymentId));
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } finally {
      setIsDeleting(false);
      setDeletePaymentId(null);
    }
  }, [deletePaymentId]);

  return (
    <div className="space-y-4">
      {/* Header Actions */}
      <div className="mb-4 flex justify-end">
        <button
          onClick={() => setShowPaymentDrawer(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 active:scale-95 transition-all"
        >
          <Plus className="h-5 w-5" />
          تسجيل دفعة جديدة
        </button>
      </div>

      {/* Recent Payments */}
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Receipt className="h-5 w-5 text-emerald-600" />
          <h2 className="text-lg font-semibold text-slate-900">سجل المدفوعات</h2>
        </div>

        {payments.length === 0 ? (
          <p className="rounded-xl bg-slate-50 px-3 py-6 text-center text-sm text-slate-500">
            لا توجد مدفوعات مسجّلة بعد.
          </p>
        ) : (
          <ul className="space-y-3">
            {payments.map((payment) => (
              <li
                key={payment.id}
                className="rounded-xl border border-slate-100 bg-slate-50 p-3"
              >
                <div className="flex items-start gap-3">
                  <div className="min-w-0 flex-1">
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
                  <div className="flex shrink-0 flex-col items-end gap-2">
                    <p className="font-semibold text-emerald-700 whitespace-nowrap">
                      {formatCurrency(payment.amount)}
                    </p>
                    <div className="flex gap-1">
                      <button
                        onClick={() => setEditingPayment(payment)}
                        className="h-8 w-8 flex items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 active:scale-95 transition-transform"
                        title="تعديل"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeletePaymentId(payment.id)}
                        disabled={isDeleting}
                        className="h-8 w-8 flex items-center justify-center rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 active:scale-95 transition-transform disabled:opacity-50"
                        title="حذف"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* New Payment Drawer */}
      <Drawer
        isOpen={showPaymentDrawer}
        onClose={() => setShowPaymentDrawer(false)}
        title="تسجيل دفعة جديدة"
      >
        <PaymentForm 
          clientNames={clientNames} 
          onSuccess={() => {
            setShowPaymentDrawer(false);
            router.refresh();
          }}
        />
      </Drawer>

      {/* Edit Payment Drawer */}
      <Drawer
        isOpen={!!editingPayment}
        onClose={() => setEditingPayment(null)}
        title="تعديل الدفعة"
      >
        {editingPayment && (
          <PaymentEditForm
            payment={editingPayment}
            clientNames={clientNames}
            onClose={() => setEditingPayment(null)}
            onSuccess={() => {
              setEditingPayment(null);
              router.refresh();
            }}
          />
        )}
      </Drawer>

      {/* Delete Confirmation */}
      {deletePaymentId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="rounded-2xl bg-white p-6 shadow-2xl max-w-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">حذف الدفعة</h3>
            <p className="text-slate-600 mb-6">هل أنت متأكد من حذف هذه الدفعة؟</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeletePaymentId(null)}
                className="flex-1 px-4 py-2 rounded-xl bg-slate-100 text-slate-900 font-medium hover:bg-slate-200"
                disabled={isDeleting}
              >
                إلغاء
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 rounded-xl bg-rose-600 text-white font-medium hover:bg-rose-700 disabled:opacity-50"
              >
                {isDeleting ? "جاري الحذف..." : "حذف"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PaymentEditForm({
  payment,
  clientNames,
  onClose,
  onSuccess,
}: {
  payment: ArtisanPaymentRow;
  clientNames: string[];
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [isPending, setIsPending] = useState(false);
  const [state, setState] = useState<PaymentActionState>({
    success: false,
    message: "",
  });

  const handleUpdate = async (formData: FormData) => {
    setIsPending(true);
    try {
      const result = await updatePayment(payment.id, state, formData);
      setState(result);
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
        notes: payment.notes ?? undefined,
      }}
      submitLabel="تحديث الدفعة"
      onSuccess={onSuccess}
    />
  );
}
