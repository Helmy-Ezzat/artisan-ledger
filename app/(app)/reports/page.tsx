import { Suspense } from "react";
import { AppHeaderServer } from "@/components/layout/AppHeaderServer";
import { ReportsContent } from "@/components/reports/ReportsContent";

export const dynamic = "force-dynamic";

export default function ReportsPage() {
  return (
    <>
      <AppHeaderServer title="التقارير" subtitle="إحصائيات العمل والمدفوعات" />
      <main className="mx-auto flex max-w-4xl flex-col gap-4 px-4 py-4">
        <Suspense fallback={<div>جاري التحميل...</div>}>
          <ReportsContent />
        </Suspense>
      </main>
    </>
  );
}
