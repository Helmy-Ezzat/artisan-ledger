import { Suspense } from "react";
import { AppHeaderServer } from "@/components/layout/AppHeaderServer";
import { CalendarContent } from "@/components/calendar/CalendarContent";
import { WorkCalendarSkeleton } from "@/components/calendar/WorkCalendarSkeleton";
import { CalendarPageClient } from "./CalendarPageClient";
import { getClientNames } from "@/lib/data";

export const dynamic = "force-dynamic";

async function CalendarPageWrapper() {
  const clientNames = await getClientNames();

  return (
    <div className="space-y-4">
      <CalendarPageClient clientNames={clientNames} />
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
