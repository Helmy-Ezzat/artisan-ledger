import { WorkCalendar } from "@/components/calendar/WorkCalendar";
import { getAllWorkDays } from "@/lib/data";

export async function CalendarContent() {
  const days = await getAllWorkDays();
  return <WorkCalendar days={days} />;
}
