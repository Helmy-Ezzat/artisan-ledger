"use client";

import { useActionState, useEffect, useState } from "react";
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

const initialState: PaymentActionState = {
  success: false,
  message: "",
};

interface PaymentFormProps {
  clientNames: string[];
}

export function PaymentForm({ clientNames }: PaymentFormProps) {
  const [state, formAction, isPending] = useActionState(
    createPayment,
    initialState,
  );
  const [useCustomClient, setUseCustomClient] = useState(
    clientNames.length === 0,
  );
  const [formKey, setFormKey] = useState(0);

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
      setUseCustomClient(clientNames.length === 0);
      setFormKey((key) => key + 1);
    }
  }, [state.success, state.message, clientNames.length]);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <form key={formKey} action={formAction} className="space-y-4">
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
            defaultValue={getTodayISO()}
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
            step="0.01"
            inputMode="decimal"
            placeholder="مثال: 1000"
            required
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
            defaultValue="Cash"
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
            className="w-full resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
          <FieldError message={state.fieldErrors?.notes} />
        </div>

        {!state.success && state.message ? (
          <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
            {state.message}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isPending}
          className="touch-manipulation w-full min-h-[52px] rounded-xl bg-emerald-600 px-4 py-3.5 text-base font-bold text-white transition active:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "جاري الحفظ..." : "حفظ الدفعة"}
        </button>
      </form>
    </section>
  );
}
