import { WorkCalendar } from "@/components/calendar/WorkCalendar";
import { getAllWorkDays, getClientNames } from "@/lib/data";

export async function CalendarContent() {
  const [days, clientNames] = await Promise.all([
    getAllWorkDays(),
    getClientNames()
  ]);
  return <WorkCalendar days={days} clientNames={clientNames} />;
}
