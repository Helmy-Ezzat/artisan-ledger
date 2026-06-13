import { Suspense } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { getClientNames } from "@/lib/data";
import { SettleAccountForm } from "@/components/forms/SettleAccountForm";

export const dynamic = "force-dynamic";

async function SettleContent() {
  const clientNames = await getClientNames();

  if (clientNames.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <p className="text-slate-500">لا يوجد عملاء للتصفية.</p>
        <p className="text-sm text-slate-400 mt-2">قم بإضافة عملاء أولاً من صفحة التسجيل.</p>
      </div>
    );
  }

  return <SettleAccountForm clientNames={clientNames} />;
}

export default function SettlePage() {
  return (
    <>
      <AppHeader title="تصفية حساب" subtitle="تسوية نهائية وأرشفة العميل" />
      <main className="mx-auto flex max-w-lg flex-col gap-4 px-4 py-4 pb-28">
        <Suspense fallback={<div className="text-center text-slate-500">جاري التحميل...</div>}>
          <SettleContent />
        </Suspense>
      </main>
    </>
  );
}
