import { Suspense } from "react";
import { AppHeaderServer } from "@/components/layout/AppHeaderServer";
import { PaymentsContent } from "@/components/payments/PaymentsContent";
import { getReportsData, getClientNames } from "@/lib/data";

export const dynamic = "force-dynamic";

async function PaymentsData() {
  const [data, clientNames] = await Promise.all([
    getReportsData(),
    getClientNames(),
  ]);

  return (
    <PaymentsContent
      initialPayments={data.allPayments}
      clientNames={clientNames}
    />
  );
}

export default function PaymentsPage() {
  return (
    <>
      <AppHeaderServer
        title="المدفوعات"
        subtitle="سجل الدفعات وآخر المبالغ المستلمة"
      />

      <main className="mx-auto max-w-4xl px-4 py-4 pb-28">
        <Suspense fallback={<div className="text-center text-slate-500">جاري التحميل...</div>}>
          <PaymentsData />
        </Suspense>
      </main>
    </>
  );
}
