"use client";

import { useEffect, useState } from "react";
import {
  createWorkSession,
  type WorkSessionActionState,
} from "@/app/actions/days";
import { ArabicDateField } from "@/components/ui/ArabicDateField";
import { ClientField } from "@/components/ui/ClientField";
import { FieldError } from "@/components/ui/FieldError";
import {
  DAY_STATUSES,
  STATUS_LABELS,
} from "@/lib/constants";
import { getTodayISO } from "@/lib/dates";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface WorkSessionFormProps {
  clientNames?: string[];
  action?: (formData: FormData) => Promise<WorkSessionActionState>;
  isPending?: boolean;
  initialData?: {
    date: string;
    daily_rate: number;
    status: string;
    profession_type: string;
    client_name: string;
    location?: string;
    notes?: string;
  };
  submitLabel?: string;
  onSuccess?: () => void;
  showWrapper?: boolean;
}

export function WorkSessionForm({ 
  clientNames = [], 
  action,
  isPending,
  initialData,
  submitLabel,
  onSuccess,
  showWrapper = true
}: WorkSessionFormProps) {
  const [state, setState] = useState<WorkSessionActionState>({
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
        result = await createWorkSession(state, formData);
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
    <form
      key={formKey}
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(new FormData(e.target as HTMLFormElement));
      }}
      className="space-y-4"
    >
        <div>
          <label htmlFor="date" className="mb-1.5 block text-sm font-medium text-slate-700">
            التاريخ
          </label>
          <ArabicDateField
            id="date"
            name="date"
            defaultValue={initialData?.date || getTodayISO()}
            accent="sky"
          />
          <FieldError message={state.fieldErrors?.date} />
        </div>

        <div>
          <label
            htmlFor="daily_rate"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            الأجر اليومي (﷼)
          </label>
          <input
            id="daily_rate"
            name="daily_rate"
            type="number"
            min="0"
            step="1"
            inputMode="numeric"
            placeholder="مثال: 500"
            required
            defaultValue={initialData?.daily_rate}
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
              defaultValue={initialData?.status || "Full Day"}
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
            <input
              id="profession_type"
              name="profession_type"
              type="text"
              required
              placeholder="مثال: سباك، كهربائي، دهان..."
              defaultValue={initialData?.profession_type || ""}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            />
            <FieldError message={state.fieldErrors?.profession_type} />
          </div>
        </div>

        <ClientField
          clientNames={clientNames}
          useCustomClient={useCustomClient}
          onModeChange={setUseCustomClient}
          error={state.fieldErrors?.client_name}
          accent="sky"
          initialValue={initialData?.client_name}
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
            defaultValue={initialData?.location}
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
            defaultValue={initialData?.notes}
            className="w-full resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
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
        className="touch-manipulation flex w-full min-h-[52px] items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 py-3.5 text-base font-bold text-white transition active:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending && <Loader2 className="h-5 w-5 animate-spin" />}
        {pending ? "جاري الحفظ..." : submitLabel || "حفظ يوم عمل"}
      </button>
    </form>
  );
}
