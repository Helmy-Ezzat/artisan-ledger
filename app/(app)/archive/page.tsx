import { Suspense } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { ArchiveContent } from "@/components/archive/ArchiveContent";

export const dynamic = "force-dynamic";

export default function ArchivePage() {
  return (
    <>
      <AppHeader title="الأرشيف" subtitle="العملاء المؤرشفون" />
      <main className="mx-auto flex max-w-lg flex-col gap-4 px-4 py-4 pb-28">
        <Suspense fallback={<div className="text-center text-slate-500">جاري التحميل...</div>}>
          <ArchiveContent />
        </Suspense>
      </main>
    </>
  );
}
