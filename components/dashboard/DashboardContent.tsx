import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { MonthlyStats } from "@/components/dashboard/MonthlyStats";
import { getDashboardData } from "@/lib/data";
import { calculateTotalWorkDays } from "@/lib/calculations";

export async function DashboardContent() {
  const dashboard = await getDashboardData();
  const totalWorkDays = calculateTotalWorkDays(dashboard.allDays);
  
  return (
    <>
      <SummaryCards
        totalEarned={dashboard.totalEarned}
        totalReceived={dashboard.totalReceived}
        remainingBalance={dashboard.remainingBalance}
        totalWorkDays={totalWorkDays}
        stats={dashboard.dayStats}
      />
      <MonthlyStats
        workDays={dashboard.allDays}
        payments={dashboard.allPayments}
      />
      <QuickActions />
    </>
  );
}
