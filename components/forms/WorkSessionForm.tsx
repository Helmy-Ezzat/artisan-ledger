"use client";

import { useActionState, useEffect, useState } from "react";
import {
  createWorkSession,
  type WorkSessionActionState,
} from "@/app/actions/days";
import { ArabicDateField } from "@/components/ui/ArabicDateField";
import { ClientField } from "@/components/ui/ClientField";
import { FieldError } from "@/components/ui/FieldError";
import {
  DAY_STATUSES,
  PROFESSION_LABELS,
  PROFESSION_TYPES,
  STATUS_LABELS,
} from "@/lib/constants";
import { getTodayISO } from "@/lib/dates";
import { toast } from "sonner";

const initialState: WorkSessionActionState = {
  success: false,
  message: "",
};

interface WorkSessionFormProps {
  clientNames: string[];
}

export function WorkSessionForm({ clientNames }: WorkSessionFormProps) {
  const [state, formAction, isPending] = useActionState(
    createWorkSession,
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
          <label htmlFor="date" className="mb-1.5 block text-sm font-medium text-slate-700">
            التاريخ
          </label>
          <ArabicDateField
            id="date"
            name="date"
            defaultValue={getTodayISO()}
            accent="sky"
          />
          <FieldError message={state.fieldErrors?.date} />
        </div>

        <div>
          <label
            htmlFor="daily_rate"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            الأجر اليومي (ريال)
          </label>
          <input
            id="daily_rate"
            name="daily_rate"
            type="number"
            min="0"
            step="0.01"
            inputMode="decimal"
            placeholder="مثال: 500"
            required
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
          />
          <FieldError message={state.fieldErrors?.daily_rate} />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="status" className="mb-1.5 block text-sm font-medium text-slate-700">
              حالة اليوم
            </label>
            <select
              id="status"
              name="status"
              defaultValue="Full Day"
              required
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            >
              {DAY_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {STATUS_LABELS[status]}
                </option>
              ))}
            </select>
            <FieldError message={state.fieldErrors?.status} />
          </div>

          <div>
            <label
              htmlFor="profession_type"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              المهنة
            </label>
            <select
              id="profession_type"
              name="profession_type"
              required
              defaultValue=""
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            >
              <option value="" disabled>
                اختر المهنة
              </option>
              {PROFESSION_TYPES.map((profession) => (
                <option key={profession} value={profession}>
                  {PROFESSION_LABELS[profession]}
                </option>
              ))}
            </select>
            <FieldError message={state.fieldErrors?.profession_type} />
          </div>
        </div>

        <ClientField
          clientNames={clientNames}
          useCustomClient={useCustomClient}
          onModeChange={setUseCustomClient}
          error={state.fieldErrors?.client_name}
          accent="sky"
        />

        <div>
          <label htmlFor="location" className="mb-1.5 block text-sm font-medium text-slate-700">
            الموقع
          </label>
          <input
            id="location"
            name="location"
            type="text"
            placeholder="الحي أو موقع العمل"
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
          />
          <FieldError message={state.fieldErrors?.location} />
        </div>

        <div>
          <label htmlFor="notes" className="mb-1.5 block text-sm font-medium text-slate-700">
            ملاحظات
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            placeholder="تفاصيل إضافية (اختياري)"
            className="w-full resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
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
          className="touch-manipulation w-full min-h-[52px] rounded-xl bg-sky-600 px-4 py-3.5 text-base font-bold text-white transition active:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "جاري الحفظ..." : "حفظ يوم العمل"}
        </button>
      </form>
    </section>
  );
}
