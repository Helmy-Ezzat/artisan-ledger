import { AppHeader } from "@/components/layout/AppHeader";
import { WorkCalendar } from "@/components/calendar/WorkCalendar";
import { getAllWorkDays } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function CalendarPage() {
  const days = await getAllWorkDays();

  return (
    <>
      <AppHeader
        title="تقويم الشغل"
        subtitle="اضغط على أي يوم مسجّل لعرض التفاصيل"
      />

      <main className="mx-auto max-w-lg px-4 py-4 pb-28">
        <WorkCalendar days={days} />
      </main>
    </>
  );
}
