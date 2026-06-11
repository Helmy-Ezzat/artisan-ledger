import { AppHeader } from "@/components/layout/AppHeader";
import { PaymentForm } from "@/components/forms/PaymentForm";
import { getClientNames } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function PaymentPage() {
  const clientNames = await getClientNames();

  return (
    <>
      <AppHeader
        title="تسجيل دفعة"
        subtitle="سجّل المبلغ المستلم من العميل"
      />

      <main className="mx-auto max-w-lg px-4 py-4 pb-28">
        <PaymentForm clientNames={clientNames} />
      </main>
    </>
  );
}
