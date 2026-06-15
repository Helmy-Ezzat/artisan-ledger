import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { getDashboardData, getClientNames } from "@/lib/data";

export async function DashboardContent() {
  const dashboard = await getDashboardData();
  const clientNames = await getClientNames();
  
  return (
    <>
      <SummaryCards
        totalEarned={dashboard.totalEarned}
        totalReceived={dashboard.totalReceived}
        remainingBalance={dashboard.remainingBalance}
        stats={dashboard.dayStats}
      />
      <QuickActions clientNames={clientNames} />
    </>
  );
}
