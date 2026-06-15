import { Suspense } from "react";
import { AppHeaderServer } from "@/components/layout/AppHeaderServer";
import { ArchiveContent } from "@/components/archive/ArchiveContent";

export const dynamic = "force-dynamic";

export default function ArchivePage() {
  return (
    <>
      <AppHeaderServer title="الأرشيف" subtitle="العملاء المؤرشفون" />
      <main className="mx-auto flex max-w-4xl flex-col gap-4 px-4 py-4">
        <Suspense fallback={<div className="text-center text-slate-500">جاري التحميل...</div>}>
          <ArchiveContent />
        </Suspense>
      </main>
    </>
  );
}
