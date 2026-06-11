import { Suspense } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { HomePageSkeleton } from "@/components/dashboard/HomePageSkeleton";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <>
      <AppHeader
        title="دفتر حسابات الصنايعي"
        subtitle="متابعة الأعمال والمدفوعات"
      />

      <main className="mx-auto flex max-w-lg flex-col gap-4 px-4 py-4 pb-28">
        <Suspense fallback={<HomePageSkeleton />}>
          <DashboardContent />
        </Suspense>
      </main>
    </>
  );
}

