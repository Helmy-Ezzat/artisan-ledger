"use client";

import { useState, useEffect } from "react";
import type { ArchivedClientRow } from "@/lib/database.types";
import { getClientStats, unarchiveClientAction } from "@/app/actions/clients";
import { CurrencyText } from "@/components/ui/CurrencyText";
import { Archive, ArchiveRestore, ChevronDown, ChevronUp, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ui/Dialog";
import { deleteClientPermanentlyAction } from "@/app/actions/clients";

interface ArchiveClientProps {
  client: ArchivedClientRow;
}

export function ArchiveClient({ client }: ArchiveClientProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isUnarchiving, setIsUnarchiving] = useState(false);
  const [stats, setStats] = useState<{
    totalEarned: number;
    totalReceived: number;
    workDaysCount: number;
    paymentsCount: number;
  } | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (isExpanded && !stats && !isLoadingStats) {
      setIsLoadingStats(true);
      getClientStats(client.client_name)
        .then(setStats)
        .catch((error) => {
          console.error("Error loading stats:", error);
          toast.error("تعذر تحميل الإحصائيات");
        })
        .finally(() => setIsLoadingStats(false));
    }
  }, [isExpanded, stats, isLoadingStats, client.client_name]);

  const handleUnarchive = async () => {
    setIsUnarchiving(true);
    try {
      const result = await unarchiveClientAction(client.client_name);
      if (result.success) {
        toast.success(result.message);
        // Refresh the page to update the list
        window.location.reload();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error unarchiving client:", error);
      toast.error("حدث خطأ أثناء إلغاء الأرشفة");
    } finally {
      setIsUnarchiving(false);
    }
  };

  const handleDeletePermanently = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteClientPermanentlyAction(client.client_name);
      if (result.success) {
        toast.success(result.message);
        window.location.reload();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error deleting client:", error);
      toast.error("حدث خطأ أثناء حذف العميل");
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const archivedDate = new Date(client.archived_at).toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const balance = stats ? stats.totalEarned - stats.totalReceived : 0;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
            <Archive className="h-5 w-5 text-slate-600" />
          </div>
          <div className="text-right">
            <p className="font-semibold text-slate-900">{client.client_name}</p>
            <p className="text-xs text-slate-500">تم الأرشفة: {archivedDate}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-slate-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-slate-400" />
          )}
        </div>
      </button>

      {isExpanded && (
        <div className="border-t border-slate-100 px-4 py-4 space-y-4 bg-slate-50">
          {isLoadingStats ? (
            <div className="text-center py-4">
              <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-sky-600"></div>
              <p className="text-xs text-slate-500 mt-2">جاري التحميل...</p>
            </div>
          ) : stats ? (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl bg-white px-3 py-2.5 border border-slate-100">
                  <p className="text-xs text-slate-500 mb-1">المستحقات</p>
                  <p className="text-base font-bold text-sky-700">
                    <CurrencyText amount={stats.totalEarned} numberClass="text-sky-700 font-bold" symbolClass="text-sky-400" />
                  </p>
                </div>
                <div className="rounded-xl bg-white px-3 py-2.5 border border-slate-100">
                  <p className="text-xs text-slate-500 mb-1">وصلني</p>
                  <p className="text-base font-bold text-emerald-700">
                    <CurrencyText amount={stats.totalReceived} numberClass="text-emerald-700 font-bold" symbolClass="text-emerald-400" />
                  </p>
                </div>
                <div className="rounded-xl bg-white px-3 py-2.5 border border-slate-100">
                  <p className="text-xs text-slate-500 mb-1">الرصيد النهائي</p>
                  <p
                    className={`text-base font-bold ${
                      balance > 0
                        ? "text-amber-600"
                        : balance < 0
                          ? "text-rose-600"
                          : "text-slate-600"
                    }`}
                  >
                    <CurrencyText
                      amount={Math.abs(balance)}
                      numberClass={`text-base font-bold ${balance > 0 ? "text-amber-600" : balance < 0 ? "text-rose-600" : "text-slate-600"}`}
                      symbolClass="text-slate-400"
                    />
                    {balance < 0 && <span className="text-rose-600 text-sm"> زائد</span>}
                  </p>
                </div>
                <div className="rounded-xl bg-white px-3 py-2.5 border border-slate-100">
                  <p className="text-xs text-slate-500 mb-1">عدد الأيام</p>
                  <p className="text-base font-bold text-slate-700">
                    {stats.workDaysCount}
                  </p>
                </div>
              </div>

              {/* Notes */}
              {client.notes && (
                <div className="rounded-xl bg-amber-50 border border-amber-100 px-3 py-2.5">
                  <p className="text-xs font-medium text-amber-800 mb-1">ملاحظات</p>
                  <p className="text-sm text-amber-900">{client.notes}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 mt-4">
                <button
                  onClick={handleUnarchive}
                  disabled={isUnarchiving || isDeleting}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 text-white font-medium hover:bg-sky-700 active:scale-98 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUnarchiving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ArchiveRestore className="h-4 w-4" />
                  )}
                  {isUnarchiving ? "جاري الإلغاء..." : "إلغاء الأرشفة"}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={isUnarchiving || isDeleting}
                  className="flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-50 text-rose-600 font-medium border border-rose-200 hover:bg-rose-100 active:scale-98 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 className="h-4 w-4" />
                  حذف نهائي
                </button>
              </div>
            </>
          ) : null}
        </div>
      )}

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeletePermanently}
        title="حذف العميل نهائياً"
        message="هل أنت متأكد من حذف العميل؟ سيتم مسح جميع أيام العمل والمدفوعات الخاصة به بشكل نهائي ولن تتمكن من استرجاعها!"
        confirmLabel="نعم، احذف نهائياً"
        cancelLabel="تراجع"
        isLoading={isDeleting}
      />
    </div>
  );
}
