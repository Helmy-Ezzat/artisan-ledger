"use client";

import { useState, useEffect } from "react";
import { Share2, Copy, Trash2, Loader2, CheckCheck } from "lucide-react";
import { createShareToken, revokeShareToken, getShareToken } from "@/app/actions/share";
import { toast } from "sonner";
import type { ShareTokenRow } from "@/lib/database.types";

export function ShareButton({ clientName }: { clientName: string }) {
  const [token, setToken] = useState<ShareTokenRow | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isRevoking, setIsRevoking] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    getShareToken(clientName).then(setToken).finally(() => setIsLoading(false));
  }, [clientName]);

  const shareUrl = token ? `${window.location.origin}/share/${token.token}` : null;

  const handleCreate = async () => {
    setIsCreating(true);
    try {
      const result = await createShareToken(clientName);
      if (result.success) {
        const updated = await getShareToken(clientName);
        setToken(updated);
        toast.success("تم إنشاء رابط المشاركة");
      } else {
        toast.error(result.message);
      }
    } finally {
      setIsCreating(false);
    }
  };

  const handleCopy = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("تم نسخ الرابط");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("تعذّر نسخ الرابط");
    }
  };

  const handleRevoke = async () => {
    setIsRevoking(true);
    try {
      await revokeShareToken(clientName);
      setToken(null);
      toast.success("تم إلغاء الرابط");
    } finally {
      setIsRevoking(false);
    }
  };

  if (isLoading) return (
    <div className="flex items-center justify-center py-3">
      <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
    </div>
  );

  if (!token) return (
    <button onClick={handleCreate} disabled={isCreating}
      className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-700 active:scale-95 transition-all disabled:opacity-50">
      {isCreating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Share2 className="h-4 w-4" />}
      {isCreating ? "جاري الإنشاء..." : "إنشاء رابط مشاركة"}
    </button>
  );

  return (
    <div className="space-y-2">
      {/* URL display — يتكسر بشكل صح على الموبايل */}
      <div className="rounded-xl border border-teal-200 bg-teal-50 px-3 py-2 overflow-hidden">
        <p className="text-xs text-teal-700 mb-1 font-medium">رابط المشاركة:</p>
        <p
          className="text-xs text-teal-800 break-all leading-relaxed"
          dir="ltr"
          style={{ fontFamily: "monospace", wordBreak: "break-all" }}
        >
          {shareUrl}
        </p>
      </div>
      <div className="flex gap-2">
        {/* Copy */}
        <button
          onClick={handleCopy}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-teal-600 px-3 py-2.5 text-sm font-semibold text-white hover:bg-teal-700 active:scale-95 transition-all"
        >
          {copied ? <CheckCheck className="h-4 w-4 shrink-0" /> : <Copy className="h-4 w-4 shrink-0" />}
          {copied ? "تم النسخ" : "نسخ الرابط"}
        </button>
        {/* Revoke */}
        <button
          onClick={handleRevoke}
          disabled={isRevoking}
          className="flex items-center justify-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-100 active:scale-95 transition-all disabled:opacity-50"
        >
          {isRevoking ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
          إلغاء
        </button>
      </div>
      <p className="text-center text-[11px] text-slate-400">الرابط صالح 30 يوماً · للقراءة فقط</p>
    </div>
  );
}
