import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { getDashboardData } from "@/lib/data";

export async function DashboardContent() {
  const dashboard = await getDashboardData();
  
  return (
    <>
      <SummaryCards
        totalEarned={dashboard.totalEarned}
        totalReceived={dashboard.totalReceived}
        remainingBalance={dashboard.remainingBalance}
        stats={dashboard.dayStats}
      />
      <QuickActions />
    </>
  );
}
