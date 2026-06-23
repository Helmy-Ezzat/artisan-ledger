"use client";

import { useState } from "react";
import { toast } from "sonner";
import { LogOut, Users, ArchiveRestore, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { ConfirmDialog } from "@/components/ui/Dialog";
import { archiveClientAction } from "@/app/actions/clients";
import { createClient } from "@/lib/supabaseBrowser";
import type { ClientWithStats } from "@/lib/data";
import { ShareButton } from "@/components/share/ShareButton";

export function SettingsContent({ clients = [] }: { clients?: ClientWithStats[] }) {
  const router = useRouter();
  const supabase = createClient();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [archivingClient, setArchivingClient] = useState<string | null>(null);
  const [clientToArchive, setClientToArchive] = useState<string | null>(null);
  const [expandedShare, setExpandedShare] = useState<string | null>(null);

  const handleArchiveClient = async (clientName: string) => {
    setArchivingClient(clientName);
    try {
      const result = await archiveClientAction(clientName);
      if (result.success) toast.success(result.message);
      else toast.error(result.message);
    } catch {
      toast.error("حدث خطأ أثناء أرشفة المقاول");
    } finally {
      setArchivingClient(null);
      setClientToArchive(null);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await supabase.auth.signOut();
      toast.success("تم تسجيل الخروج بنجاح");
      router.push("/login");
    } catch (err) {
      console.error(err);
      toast.error("حدث خطأ أثناء تسجيل الخروج");
    } finally {
      setIsLoggingOut(false);
      setShowConfirm(false);
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-5 w-5 text-indigo-600" />
            <h2 className="text-lg font-semibold text-slate-900">إدارة المقاولين النشطين</h2>
          </div>

          {clients.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-4">لا يوجد مقاولون نشطون حالياً.</p>
          ) : (
            <ul className="space-y-3">
              {clients.map((client) => (
                <li key={client.name} className="rounded-xl border border-slate-100 bg-slate-50 p-3 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-700">{client.name}</span>
                      {client.workDays > 0 && (
                        <span className="text-[11px] font-semibold text-emerald-600 mt-0.5">
                          {client.workDays} يوم عمل
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setExpandedShare(expandedShare === client.name ? null : client.name)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-teal-600 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors"
                      >
                        مشاركة
                      </button>
                      <button
                        onClick={() => setClientToArchive(client.name)}
                        disabled={archivingClient === client.name}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-600 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {archivingClient === client.name
                          ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          : <ArchiveRestore className="h-3.5 w-3.5" />}
                        {archivingClient === client.name ? "جاري..." : "أرشفة"}
                      </button>
                    </div>
                  </div>

                  {expandedShare === client.name && (
                    <div className="pt-1 border-t border-slate-200">
                      <ShareButton clientName={client.name} />
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">الحساب</h2>
          <button
            onClick={() => setShowConfirm(true)}
            disabled={isLoggingOut}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-rose-600 text-white px-4 py-3 text-sm font-semibold hover:bg-rose-700 transition-colors disabled:opacity-50"
          >
            {isLoggingOut ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
            {isLoggingOut ? "جارٍ تسجيل الخروج..." : "تسجيل الخروج"}
          </button>
        </div>
      </div>

      <ConfirmDialog isOpen={showConfirm} onClose={() => setShowConfirm(false)} onConfirm={handleLogout}
        title="تسجيل الخروج" message="هل أنت متأكد أنك تريد تسجيل الخروج؟"
        confirmLabel="تسجيل الخروج" cancelLabel="إلغاء" isLoading={isLoggingOut} />

      <ConfirmDialog
        isOpen={clientToArchive !== null}
        onClose={() => setClientToArchive(null)}
        onConfirm={() => { if (clientToArchive) handleArchiveClient(clientToArchive); }}
        title="أرشفة المقاول"
        message={`هل أنت متأكد من أرشفة المقاول "${clientToArchive}"؟`}
        confirmLabel="أرشفة" cancelLabel="إلغاء" isLoading={archivingClient !== null} />
    </>
  );
}
