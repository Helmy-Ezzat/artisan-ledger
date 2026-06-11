import { Suspense } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { CalendarContent } from "@/components/calendar/CalendarContent";
import { WorkCalendarSkeleton } from "@/components/calendar/WorkCalendarSkeleton";

export const dynamic = "force-dynamic";

export default function CalendarPage() {
  return (
    <>
      <AppHeader
        title="تقويم الشغل"
        subtitle="اضغط على أي يوم مسجّل لعرض التفاصيل"
      />

      <main className="mx-auto max-w-lg px-4 py-4 pb-28">
        <Suspense fallback={<WorkCalendarSkeleton />}>
          <CalendarContent />
        </Suspense>
      </main>
    </>
  );
}
