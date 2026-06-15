"use client";

import { useEffect, useState } from "react";
import {
  createPayment,
  type PaymentActionState,
} from "@/app/actions/payments";
import { ArabicDateField } from "@/components/ui/ArabicDateField";
import { ClientField } from "@/components/ui/ClientField";
import { FieldError } from "@/components/ui/FieldError";
import { PAYMENT_METHODS, PAYMENT_METHOD_LABELS } from "@/lib/constants";
import { getTodayISO } from "@/lib/dates";
import { toast } from "sonner";

interface PaymentFormProps {
  clientNames?: string[];
  action?: (formData: FormData) => Promise<PaymentActionState>;
  isPending?: boolean;
  initialData?: {
    date: string;
    amount: number;
    client_name: string;
    payment_method: string;
    notes?: string;
  };
  submitLabel?: string;
  onSuccess?: () => void;
}

export function PaymentForm({ 
  clientNames = [],
  action,
  isPending,
  initialData,
  submitLabel,
  onSuccess
}: PaymentFormProps) {
  const [state, setState] = useState<PaymentActionState>({
    success: false,
    message: "",
  });
  const [localPending, setLocalPending] = useState(false);
  const pending = isPending ?? localPending;
  
  const handleSubmit = async (formData: FormData) => {
    setLocalPending(true);
    try {
      let result;
      if (action) {
        result = await action(formData);
      } else {
        result = await createPayment(state, formData);
      }
      setState(result);
      if (result.success) {
        toast.success(result.message);
        onSuccess?.();
      } else if (result.message) {
        toast.error(result.message);
      }
    } catch (e) {
      setState({
        success: false,
        message: "حدث خطأ غير متوقع",
      });
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
      setFormKey((key) => key + 1);
    }
  }, [action, state.success, state.message, clientNames.length]);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <form
        key={formKey}
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(new FormData(e.target as HTMLFormElement));
        }}
        className="space-y-4"
      >
        <div>
          <label
            htmlFor="payment_date"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            التاريخ
          </label>
          <ArabicDateField
            id="payment_date"
            name="date"
            defaultValue={initialData?.date || getTodayISO()}
            accent="emerald"
          />
          <FieldError message={state.fieldErrors?.date} />
        </div>

        <div>
          <label htmlFor="amount" className="mb-1.5 block text-sm font-medium text-slate-700">
            المبلغ (ريال)
          </label>
          <input
            id="amount"
            name="amount"
            type="number"
            min="0"
            step="1"
            inputMode="numeric"
            placeholder="مثال: 1000"
            required
            defaultValue={initialData?.amount}
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
          <FieldError message={state.fieldErrors?.amount} />
        </div>

        <ClientField
          clientNames={clientNames}
          useCustomClient={useCustomClient}
          onModeChange={setUseCustomClient}
          error={state.fieldErrors?.client_name}
          accent="emerald"
          initialValue={initialData?.client_name}
        />

        <div>
          <label
            htmlFor="payment_method"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            طريقة الدفع
          </label>
          <select
            id="payment_method"
            name="payment_method"
            defaultValue={initialData?.payment_method || "Cash"}
            required
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          >
            {PAYMENT_METHODS.map((method) => (
              <option key={method} value={method}>
                {PAYMENT_METHOD_LABELS[method]}
              </option>
            ))}
          </select>
          <FieldError message={state.fieldErrors?.payment_method} />
        </div>

        <div>
          <label
            htmlFor="payment_notes"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            ملاحظات
          </label>
          <textarea
            id="payment_notes"
            name="notes"
            rows={3}
            placeholder="تفاصيل إضافية (اختياري)"
            defaultValue={initialData?.notes}
            className="w-full resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
          <FieldError message={state.fieldErrors?.notes} />
        </div>

        {state.message && !state.success ? (
          <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
            {state.message}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={pending}
          className="touch-manipulation w-full min-h-[52px] rounded-xl bg-emerald-600 px-4 py-3.5 text-base font-bold text-white transition active:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "جاري الحفظ..." : submitLabel || "حفظ الدفعة"}
        </button>
      </form>
    </section>
  );
}
