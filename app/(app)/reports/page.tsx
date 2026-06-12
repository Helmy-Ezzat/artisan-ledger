import { Suspense } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { ReportsContent } from "@/components/reports/ReportsContent";

export const dynamic = "force-dynamic";

export default function ReportsPage() {
  return (
    <>
      <AppHeader title="التقارير" subtitle="إحصائيات العمل والمدفوعات" />
      <main className="mx-auto flex max-w-lg flex-col gap-4 px-4 py-4 pb-28">
        <Suspense fallback={<div>جاري التحميل...</div>}>
          <ReportsContent />
        </Suspense>
      </main>
    </>
  );
}
