"use client";

import { useState } from "react";
import { createPayment, type PaymentActionState } from "@/app/actions/payments";
import { archiveClientAction } from "@/app/actions/clients";
import { ArabicDateField } from "@/components/ui/ArabicDateField";
import { FieldError } from "@/components/ui/FieldError";
import { PAYMENT_METHODS, PAYMENT_METHOD_LABELS } from "@/lib/constants";
import { getTodayISO } from "@/lib/dates";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface SettleAccountFormProps {
  clientNames: string[];
}

export function SettleAccountForm({ clientNames }: SettleAccountFormProps) {
  const router = useRouter();
  const [state, setState] = useState<PaymentActionState>({
    success: false,
    message: "",
  });
  const [pending, setPending] = useState(false);
  const [selectedClient, setSelectedClient] = useState("");

  const handleSubmit = async (formData: FormData) => {
    const clientName = formData.get("client_name") as string;
    
    if (!clientName || clientName.trim() === "") {
      setState({
        success: false,
        message: "يرجى اختيار العميل",
      });
      return;
    }

    setPending(true);
    try {
      // Step 1: Create the final payment
      const paymentResult = await createPayment(state, formData);
      setState(paymentResult);

      if (!paymentResult.success) {
        toast.error(paymentResult.message);
        setPending(false);
        return;
      }

      toast.success(paymentResult.message);

      // Step 2: Archive the client
      const archiveNotes = formData.get("archive_notes") as string;
      const archiveResult = await archiveClientAction(
        clientName,
        undefined, // We don't have the payment ID yet from the action
        archiveNotes
      );

      if (archiveResult.success) {
        toast.success(archiveResult.message);
        // Redirect to archive page after successful settlement
        router.push("/archive");
      } else {
        toast.error(archiveResult.message);
      }
    } catch (e) {
      console.error("Settle account error:", e);
      toast.error("حدث خطأ غير متوقع");
    } finally {
      setPending(false);
    }
  };

  return (
    <section className="space-y-4">
      {/* Warning Card */}
      <div className="rounded-2xl border-2 border-amber-200 bg-amber-50 p-4">
        <p className="text-sm font-medium text-amber-900 mb-2">
          ⚠️ تصفية الحساب
        </p>
        <p className="text-xs text-amber-800 leading-relaxed">
          عند تصفية الحساب، سيتم نقل العميل إلى الأرشيف ولن يظهر في القوائم الرئيسية. 
          يمكنك الوصول إلى بياناته من صفحة الأرشيف.
        </p>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(new FormData(e.target as HTMLFormElement));
          }}
          className="space-y-4"
        >
          {/* Client Selection */}
          <div>
            <label
              htmlFor="client_name"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              اختر العميل للتصفية
            </label>
            <select
              id="client_name"
              name="client_name"
              required
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
            >
              <option value="">-- اختر العميل --</option>
              {clientNames.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
            <FieldError message={state.fieldErrors?.client_name} />
          </div>

          {/* Date */}
          <div>
            <label
              htmlFor="settle_date"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              تاريخ الدفعة النهائية
            </label>
            <ArabicDateField
              id="settle_date"
              name="date"
              defaultValue={getTodayISO()}
              accent="emerald"
            />
            <FieldError message={state.fieldErrors?.date} />
          </div>

          {/* Amount */}
          <div>
            <label htmlFor="settle_amount" className="mb-1.5 block text-sm font-medium text-slate-700">
              المبلغ النهائي (ريال)
            </label>
            <input
              id="settle_amount"
              name="amount"
              type="number"
              min="0"
              step="1"
              inputMode="numeric"
              placeholder="مثال: 1000"
              required
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
            <FieldError message={state.fieldErrors?.amount} />
          </div>

          {/* Payment Method */}
          <div>
            <label
              htmlFor="settle_payment_method"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              طريقة الدفع
            </label>
            <select
              id="settle_payment_method"
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

          {/* Payment Notes */}
          <div>
            <label
              htmlFor="payment_notes"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              ملاحظات الدفعة
            </label>
            <textarea
              id="payment_notes"
              name="notes"
              rows={2}
              placeholder="تفاصيل إضافية (اختياري)"
              className="w-full resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
            <FieldError message={state.fieldErrors?.notes} />
          </div>

          {/* Archive Notes */}
          <div>
            <label
              htmlFor="archive_notes"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              ملاحظات الأرشفة
            </label>
            <textarea
              id="archive_notes"
              name="archive_notes"
              rows={2}
              placeholder="سبب التصفية أو ملاحظات إضافية (اختياري)"
              className="w-full resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
            />
          </div>

          {state.message && !state.success ? (
            <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
              {state.message}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={pending}
            className="touch-manipulation w-full min-h-[52px] rounded-xl bg-rose-600 px-4 py-3.5 text-base font-bold text-white transition active:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? "جاري التصفية..." : "تصفية الحساب وأرشفة العميل"}
          </button>
        </form>
      </section>
    </section>
  );
}
