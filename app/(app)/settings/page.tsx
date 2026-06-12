import { AppHeader } from "@/components/layout/AppHeader";
import { SettingsContent } from "@/components/settings/SettingsContent";

export const dynamic = "force-dynamic";

export default function SettingsPage() {
  return (
    <>
      <AppHeader
        title="الإعدادات"
        subtitle="تخصيص التطبيق"
      />

      <main className="mx-auto max-w-lg px-4 py-4 pb-28">
        <SettingsContent />
      </main>
    </>
  );
}
