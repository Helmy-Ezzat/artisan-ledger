import { AppHeader } from "@/components/layout/AppHeader";
import { WorkSessionForm } from "@/components/forms/WorkSessionForm";
import { getClientNames } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function WorkPage() {
  const clientNames = await getClientNames();

  return (
    <>
      <AppHeader
        title="تسجيل يوم عمل"
        subtitle="أضف يوم عمل جديد مع تفاصيل العميل"
      />

      <main className="mx-auto max-w-lg px-4 py-4 pb-28">
        <WorkSessionForm clientNames={clientNames} />
      </main>
    </>
  );
}
