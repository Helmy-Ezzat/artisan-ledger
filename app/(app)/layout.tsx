import { BottomNav } from "@/components/layout/BottomNav";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-full bg-gradient-to-b from-slate-100 to-slate-50">
      {children}
      <BottomNav />
    </div>
  );
}
