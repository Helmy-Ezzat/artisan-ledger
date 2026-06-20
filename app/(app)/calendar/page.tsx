import { Suspense } from "react";
import { AppHeaderServer } from "@/components/layout/AppHeaderServer";
import { CalendarContent } from "@/components/calendar/CalendarContent";
import { WorkCalendarSkeleton } from "@/components/calendar/WorkCalendarSkeleton";
import { CalendarPageClient } from "./CalendarPageClient";
import { getClientNames, getAllWorkDays } from "@/lib/data";

export const dynamic = "force-dynamic";

async function CalendarPageWrapper() {
  const [clientNames, days] = await Promise.all([
    getClientNames(),
    getAllWorkDays(),
  ]);

  const registeredDates = days.map((d) => d.date.slice(0, 10));

  return (
    <div className="space-y-4">
      <CalendarPageClient clientNames={clientNames} registeredDates={registeredDates} />
      <Suspense fallback={<WorkCalendarSkeleton />}>
        <CalendarContent />
      </Suspense>
    </div>
  );
}

export default function CalendarPage() {
  return (
    <>
      <AppHeaderServer
        title="تقويم الشغل"
        subtitle="اضغط على أي يوم مسجّل لعرض التفاصيل"
      />

      <main className="mx-auto max-w-4xl px-4 py-4">
        <Suspense fallback={<WorkCalendarSkeleton />}>
          <CalendarPageWrapper />
        </Suspense>
      </main>
    </>
  );
}
