import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { getDashboardData, getClientNames } from "@/lib/data";

export async function DashboardContent() {
  const [dashboard, clientNames] = await Promise.all([
    getDashboardData(),
    getClientNames(),
  ]);
  return (
    <>
      <SummaryCards
        totalEarned={dashboard.totalEarned}
        totalReceived={dashboard.totalReceived}
        remainingBalance={dashboard.remainingBalance}
        stats={dashboard.dayStats}
        recentPayments={dashboard.recentPayments}
        clientNames={clientNames}
      />
      <QuickActions />
    </>
  );
}
