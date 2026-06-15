import { Suspense } from "react";
import { AppHeaderServer } from "@/components/layout/AppHeaderServer";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { HomePageSkeleton } from "@/components/dashboard/HomePageSkeleton";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <>
      <AppHeaderServer
        title="دفتر حسابات الصنايعي"
        subtitle="متابعة الأعمال والمدفوعات"
      />

      <main className="mx-auto flex max-w-4xl flex-col gap-4 px-4 py-4">
        <Suspense fallback={<HomePageSkeleton />}>
          <DashboardContent />
        </Suspense>
      </main>
    </>
  );
}

