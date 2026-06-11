import { PAYMENT_METHOD_LABELS } from "@/lib/constants";
import type { ArtisanPaymentRow } from "@/lib/database.types";
import { formatCurrency, formatDate } from "@/lib/format";
import { Receipt } from "lucide-react";

interface PaymentsFeedProps {
  payments: ArtisanPaymentRow[];
}

export function PaymentsFeed({ payments }: PaymentsFeedProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <header className="mb-4 flex items-center gap-2">
        <Receipt className="h-5 w-5 text-emerald-600" />
        <h2 className="text-base font-semibold text-slate-900">آخر المدفوعات</h2>
      </header>

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
                <p className="shrink-0 font-semibold text-emerald-700">
                  {formatCurrency(payment.amount)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
