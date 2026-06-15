import { Suspense } from "react";
import { AppHeaderServer } from "@/components/layout/AppHeaderServer";
import { WorkSessionForm } from "@/components/forms/WorkSessionForm";
import { getClientNames } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function WorkRecordPage() {
  const clientNames = await getClientNames();

  return (
    <>
      <AppHeaderServer
        title="تسجيل يوم عمل"
        subtitle="سجّل يوماً جديداً من أيام الشغل"
      />

      <main className="mx-auto max-w-lg px-4 py-4 pb-28">
        <Suspense fallback={<div className="text-center text-slate-500">جاري التحميل...</div>}>
          <WorkSessionForm clientNames={clientNames} />
        </Suspense>
      </main>
    </>
  );
}
