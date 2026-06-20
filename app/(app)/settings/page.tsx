import { AppHeaderServer } from "@/components/layout/AppHeaderServer";
import { SettingsContent } from "@/components/settings/SettingsContent";
import { getActiveClientsWithStats } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const clients = await getActiveClientsWithStats();

  return (
    <>
      <AppHeaderServer
        title="الإعدادات"
        subtitle="تخصيص التطبيق وإدارة العملاء"
      />

      <main className="mx-auto max-w-lg px-4 py-4 pb-28">
        <SettingsContent clients={clients} />
      </main>
    </>
  );
}
