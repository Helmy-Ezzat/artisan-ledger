import { SummaryCardsSkeleton } from "@/components/dashboard/SummaryCardsSkeleton";
import { QuickActions } from "@/components/dashboard/QuickActions";

export function HomePageSkeleton() {
  return (
    <>
      <SummaryCardsSkeleton />
      <QuickActions />
    </>
  );
}
