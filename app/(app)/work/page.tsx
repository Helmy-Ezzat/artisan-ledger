import { Suspense } from "react";
import { AppHeaderServer } from "@/components/layout/AppHeaderServer";
import { WorkSessionForm } from "@/components/forms/WorkSessionForm";
import { PaymentForm } from "@/components/forms/PaymentForm";
import { getClientNames } from "@/lib/data";
import CombinedRecordClient from "./ClientComponent";

export const dynamic = "force-dynamic";

export default async function CombinedRecordPage() {
  const clientNames = await getClientNames();

  return (
    <>
      <AppHeaderServer
        title="تسجيل"
        subtitle="سجل يوم عمل أو دفعة"
      />

      <main className="mx-auto max-w-lg px-4 py-4 pb-28 space-y-4">
        <Suspense fallback={<div className="animate-pulse space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-10 bg-slate-200 rounded-lg" />
          ))}
        </div>}>
          <CombinedRecordClient clientNames={clientNames} />
        </Suspense>
      </main>
    </>
  );
}
