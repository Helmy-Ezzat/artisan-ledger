import { AppHeader } from "@/components/layout/AppHeader";

export default function Loading() {
  return (
    <>
      <AppHeader
        title="جارِ التحميل..."
        subtitle=""
      />
      <main className="mx-auto flex max-w-lg flex-col gap-4 px-4 py-4 pb-28">
        {/* Skeleton will be per-page, but for now this is a fallback */}
      </main>
    </>
  );
}
