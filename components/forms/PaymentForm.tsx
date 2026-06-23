"use client";

import { useEffect, useState } from "react";
import { createPayment, type PaymentActionState } from "@/app/actions/payments";
import { ArabicDateField } from "@/components/ui/ArabicDateField";
import { ClientField } from "@/components/ui/ClientField";
import { FieldError } from "@/components/ui/FieldError";
import { PAYMENT_METHODS, PAYMENT_METHOD_LABELS } from "@/lib/constants";
import { getTodayISO } from "@/lib/dates";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface PaymentFormProps {
  clientNames?: string[];
  action?: (formData: FormData) => Promise<PaymentActionState>;
  isPending?: boolean;
  initialData?: {
    date: string;
    amount: number;
    client_name: string;
    payment_method: string;
    location?: string;
    notes?: string;
  };
  submitLabel?: string;
  onSuccess?: () => void;
}

export function PaymentForm({ clientNames = [], action, isPending, initialData, submitLabel, onSuccess }: PaymentFormProps) {
  const [state, setState] = useState<PaymentActionState>({ success: false, message: "" });
  const [localPending, setLocalPending] = useState(false);
  const pending = isPending ?? localPending;

  const handleSubmit = async (formData: FormData) => {
    setLocalPending(true);
    try {
      const result = action ? await action(formData) : await createPayment(state, formData);
      setState(result);
      if (result.success) { toast.success(result.message); onSuccess?.(); }
      else if (result.message) toast.error(result.message);
    } catch {
      setState({ success: false, message: "حدث خطأ غير متوقع" });
    } finally {
      setLocalPending(false);
    }
  };

  const [useCustomClient, setUseCustomClient] = useState(
    clientNames.length === 0 || !clientNames.includes(initialData?.client_name || ""),
  );
  const [formKey, setFormKey] = useState(0);

  useEffect(() => {
    if (!action && state.success) {
      setUseCustomClient(clientNames.length === 0);
      setFormKey((k) => k + 1);
    }
  }, [action, state.success, state.message, clientNames.length]);

  return (
    <form key={formKey} onSubmit={(e) => { e.preventDefault(); handleSubmit(new FormData(e.target as HTMLFormElement)); }}
      className="space-y-4">

      <div>
        <label htmlFor="payment_date" className="mb-1.5 block text-sm font-medium text-slate-700">التاريخ</label>
        <ArabicDateField id="payment_date" name="date" defaultValue={initialData?.date || getTodayISO()} accent="emerald" />
        <FieldError message={state.fieldErrors?.date} />
      </div>

      <div>
        <label htmlFor="amount" className="mb-1.5 block text-sm font-medium text-slate-700">المبلغ (﷼)</label>
        <input id="amount" name="amount" type="number" min="0" step="1" inputMode="numeric"
          placeholder="مثال: 1000" required defaultValue={initialData?.amount}
          className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" />
        <FieldError message={state.fieldErrors?.amount} />
      </div>

      <ClientField clientNames={clientNames} useCustomClient={useCustomClient} onModeChange={setUseCustomClient}
        error={state.fieldErrors?.client_name} accent="emerald" initialValue={initialData?.client_name} />

      <div>
        <label htmlFor="payment_method" className="mb-1.5 block text-sm font-medium text-slate-700">طريقة الدفع</label>
        <select id="payment_method" name="payment_method" defaultValue={initialData?.payment_method || "Cash"} required
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100">
          {PAYMENT_METHODS.map((m) => <option key={m} value={m}>{PAYMENT_METHOD_LABELS[m]}</option>)}
        </select>
        <FieldError message={state.fieldErrors?.payment_method} />
      </div>

      <div>
        <label htmlFor="payment_location" className="mb-1.5 block text-sm font-medium text-slate-700">الموقع</label>
        <input id="payment_location" name="location" type="text" placeholder="اسم الموقع أو المشروع"
          defaultValue={initialData?.location}
          className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" />
        <FieldError message={state.fieldErrors?.location} />
      </div>

      <div>
        <label htmlFor="payment_notes" className="mb-1.5 block text-sm font-medium text-slate-700">ملاحظات</label>
        <textarea id="payment_notes" name="notes" rows={3} placeholder="تفاصيل إضافية (اختياري)"
          defaultValue={initialData?.notes}
          className="w-full resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" />
        <FieldError message={state.fieldErrors?.notes} />
      </div>

      {state.message && !state.success && (
        <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{state.message}</p>
      )}

      <button type="submit" disabled={pending}
        className="touch-manipulation flex w-full min-h-[52px] items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3.5 text-base font-bold text-white transition active:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60">
        {pending && <Loader2 className="h-5 w-5 animate-spin" />}
        {pending ? "جاري الحفظ..." : submitLabel || "حفظ الدفعة"}
      </button>
    </form>
  );
}
