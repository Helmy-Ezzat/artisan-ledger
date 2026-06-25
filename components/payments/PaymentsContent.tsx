"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { PaymentForm } from "@/components/forms/PaymentForm";
import { formatDateNumeric } from "@/lib/format";
import { CurrencyText } from "@/components/ui/CurrencyText";
import { Plus, Receipt, Trash2, Edit, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { Drawer } from "@/components/ui/Drawer";
import type { ArtisanPaymentRow } from "@/lib/database.types";
import { deletePayment, updatePayment, type PaymentActionState } from "@/app/actions/payments";
import { toast } from "sonner";
import { PAYMENT_METHOD_LABELS } from "@/lib/constants";

// ─── Month grouping ───────────────────────────────────

const MONTH_NAMES = ["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"];

function groupByMonth(payments: ArtisanPaymentRow[]) {
  const map = new Map<string, { key: string; label: string; payments: ArtisanPaymentRow[]; total: number }>();
  for (const p of payments) {
    const d = new Date(`${p.date.slice(0,10)}T12:00:00+03:00`);
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`;
    const label = `${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`;
    if (!map.has(key)) map.set(key, { key, label, payments: [], total: 0 });
    const g = map.get(key)!;
    g.payments.push(p);
    g.total += p.amount;
  }
  return Array.from(map.entries()).sort((a,b)=>b[0].localeCompare(a[0])).map(([,v])=>v);
}

// ─── Single payment accordion ─────────────────────────

function PaymentItem({
  payment,
  onEdit,
  onDelete,
  isDeleting,
}: {
  payment: ArtisanPaymentRow;
  onEdit: (p: ArtisanPaymentRow) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <li className="rounded-xl border border-slate-100 overflow-hidden">
      {/* Header row — always visible */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="flex w-full items-center justify-between bg-slate-50 px-3 py-2.5 active:bg-slate-100"
      >
        <div className="flex items-center gap-2 min-w-0">
          {open ? <ChevronUp className="h-4 w-4 shrink-0 text-slate-400"/> : <ChevronDown className="h-4 w-4 shrink-0 text-slate-400"/>}
          <div className="min-w-0 text-right">
            <p className="truncate text-sm font-semibold text-slate-900">{payment.client_name}</p>
            <p className="text-xs text-slate-500">{formatDateNumeric(payment.date)}</p>
          </div>
        </div>
        <span className="shrink-0 font-semibold text-sm mr-2">
          <CurrencyText amount={payment.amount} numberClass="text-slate-900 font-semibold" symbolClass="text-slate-400" />
        </span>
      </button>

      {/* Details — shown when open */}
      {open && (
        <div className="bg-white px-3 pb-3 pt-2 space-y-2">
          {payment.location && (
            <p className="text-xs text-slate-600">📍 {payment.location}</p>
          )}
          <p className="text-xs text-slate-500">{PAYMENT_METHOD_LABELS[payment.payment_method]}</p>
          {payment.notes && (
            <p className="text-xs text-slate-500">{payment.notes}</p>
          )}
          <div className="flex gap-2 pt-1">
            <button
              onClick={() => onEdit(payment)}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-emerald-50 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 active:scale-95 transition-transform"
            >
              <Edit className="h-3.5 w-3.5"/>تعديل
            </button>
            <button
              onClick={() => onDelete(payment.id)}
              disabled={isDeleting}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-rose-50 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-100 active:scale-95 transition-transform disabled:opacity-50"
            >
              <Trash2 className="h-3.5 w-3.5"/>حذف
            </button>
          </div>
        </div>
      )}
    </li>
  );
}

// ─── Month accordion ──────────────────────────────────

function PaymentMonthGroup({
  group, defaultOpen, onEdit, onDelete, isDeleting,
}: {
  group: ReturnType<typeof groupByMonth>[number];
  defaultOpen: boolean;
  onEdit: (p: ArtisanPaymentRow) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-xl border border-slate-200 overflow-hidden">
      <button type="button" onClick={() => setOpen(o => !o)}
        className="flex w-full items-center justify-between bg-slate-100 px-3 py-2.5 active:bg-slate-200">
        <div className="flex items-center gap-2">
          {open ? <ChevronUp className="h-4 w-4 text-slate-500"/> : <ChevronDown className="h-4 w-4 text-slate-500"/>}
          <span className="text-sm font-bold text-slate-700">{group.label}</span>
          <span className="text-xs text-slate-500">({group.payments.length} دفعة)</span>
        </div>
        <span className="text-xs font-semibold bg-emerald-50 rounded-lg px-2 py-0.5">
          <CurrencyText amount={group.total} numberClass="text-emerald-700 font-semibold" symbolClass="text-emerald-400" />
        </span>
      </button>
      {open && (
        <ul className="divide-y divide-slate-100 bg-white">
          {group.payments.map(p => (
            <PaymentItem key={p.id} payment={p} onEdit={onEdit} onDelete={onDelete} isDeleting={isDeleting}/>
          ))}
        </ul>
      )}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────

interface PaymentsContentProps {
  initialPayments: ArtisanPaymentRow[];
  clientNames: string[];
}

export function PaymentsContent({ initialPayments, clientNames }: PaymentsContentProps) {
  const [payments, setPayments] = useState<ArtisanPaymentRow[]>(initialPayments);
  const [deletePaymentId, setDeletePaymentId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingPayment, setEditingPayment] = useState<ArtisanPaymentRow | null>(null);
  const [showPaymentDrawer, setShowPaymentDrawer] = useState(false);
  const router = useRouter();

  useEffect(() => { setPayments(initialPayments); }, [initialPayments]);

  const grouped = useMemo(() => groupByMonth(payments), [payments]);

  const handleDelete = useCallback(async () => {
    if (!deletePaymentId) return;
    setIsDeleting(true);
    try {
      const result = await deletePayment(deletePaymentId);
      if (result.success) {
        toast.success(result.message);
        setPayments(prev => prev.filter(p => p.id !== deletePaymentId));
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } finally {
      setIsDeleting(false);
      setDeletePaymentId(null);
    }
  }, [deletePaymentId, router]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="mb-4 flex justify-end">
        <button onClick={() => setShowPaymentDrawer(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 active:scale-95 transition-all">
          <Plus className="h-5 w-5"/>تسجيل دفعة جديدة
        </button>
      </div>

      {/* Payment List */}
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Receipt className="h-5 w-5 text-emerald-600"/>
          <h2 className="text-lg font-semibold text-slate-900">سجل المدفوعات</h2>
        </div>

        {payments.length === 0 ? (
          <p className="rounded-xl bg-slate-50 px-3 py-6 text-center text-sm text-slate-500">
            لا توجد مدفوعات مسجّلة بعد.
          </p>
        ) : (
          <div className="space-y-2">
            {grouped.map((group, i) => (
              <PaymentMonthGroup key={group.key} group={group} defaultOpen={i === 0}
                onEdit={setEditingPayment} onDelete={setDeletePaymentId} isDeleting={isDeleting}/>
            ))}
          </div>
        )}
      </section>

      {/* New Payment Drawer */}
      <Drawer isOpen={showPaymentDrawer} onClose={() => setShowPaymentDrawer(false)} title="تسجيل دفعة جديدة">
        <PaymentForm clientNames={clientNames}
          onSuccess={() => { setShowPaymentDrawer(false); router.refresh(); }}/>
      </Drawer>

      {/* Edit Payment Drawer */}
      <Drawer isOpen={!!editingPayment} onClose={() => setEditingPayment(null)} title="تعديل الدفعة">
        {editingPayment && (
          <PaymentEditForm payment={editingPayment} clientNames={clientNames}
            onClose={() => setEditingPayment(null)}
            onSuccess={() => { setEditingPayment(null); router.refresh(); }}/>
        )}
      </Drawer>

      {/* Delete Confirmation */}
      {deletePaymentId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="rounded-2xl bg-white p-6 shadow-2xl max-w-sm w-full">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">حذف الدفعة</h3>
            <p className="text-slate-600 mb-6">هل أنت متأكد من حذف هذه الدفعة؟</p>
            <div className="flex gap-3">
              <button onClick={() => setDeletePaymentId(null)} disabled={isDeleting}
                className="flex-1 px-4 py-2 rounded-xl bg-slate-100 text-slate-900 font-medium hover:bg-slate-200">
                إلغاء
              </button>
              <button onClick={handleDelete} disabled={isDeleting}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white active:bg-rose-700 disabled:opacity-50">
                {isDeleting ? <Loader2 className="h-4 w-4 animate-spin"/> : <Trash2 className="h-4 w-4"/>}
                {isDeleting ? "جاري الحذف..." : "حذف"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Edit Form ────────────────────────────────────────

function PaymentEditForm({ payment, clientNames, onClose, onSuccess }:
  { payment: ArtisanPaymentRow; clientNames: string[]; onClose: () => void; onSuccess: () => void }) {
  const [isPending, setIsPending] = useState(false);
  const [state, setState] = useState<PaymentActionState>({ success: false, message: "" });

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
    <PaymentForm action={handleUpdate} isPending={isPending} clientNames={clientNames}
      initialData={{ ...payment, location: payment.location ?? undefined, notes: payment.notes ?? undefined }}
      submitLabel="تحديث الدفعة" onSuccess={onSuccess}/>
  );
}
