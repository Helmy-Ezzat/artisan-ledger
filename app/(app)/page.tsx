import { AppHeader } from "@/components/layout/AppHeader";
import { FinancialCards } from "@/components/dashboard/FinancialCards";
import { PaymentsFeed } from "@/components/feeds/PaymentsFeed";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { WorkDayStats } from "@/components/dashboard/WorkDayStats";
import { getDashboardData } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const dashboard = await getDashboardData();

  return (
    <>
      <AppHeader
        title="دفتر حسابات الصنايعي"
        subtitle="متابعة الأعمال والمدفوعات"
      />

      <main className="mx-auto flex max-w-lg flex-col gap-4 px-4 py-4 pb-28">
        <FinancialCards
          totalEarned={dashboard.totalEarned}
          totalReceived={dashboard.totalReceived}
          remainingBalance={dashboard.remainingBalance}
        />

        <WorkDayStats stats={dashboard.dayStats} />

        <QuickActions />

        <PaymentsFeed payments={dashboard.recentPayments} />
      </main>
    </>
  );
}
