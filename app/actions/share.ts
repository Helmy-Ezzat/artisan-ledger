"use server";

import { createClient } from "@/lib/supabase";
import { createServiceClient } from "@/lib/supabaseService";
import type { ArtisanDayRow, ArtisanPaymentRow, ShareTokenRow } from "@/lib/database.types";

// ── توليد / حذف رابط المشاركة (يحتاج auth) ──────────

export async function createShareToken(
  clientName: string,
): Promise<{ success: boolean; token?: string; message: string }> {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) return { success: false, message: "يجب تسجيل الدخول أولاً." };

  // احذف أي توكن قديم لنفس المقاول
  await supabase.from("share_tokens").delete().eq("user_id", user.id).eq("client_name", clientName);

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  const { data, error } = await supabase
    .from("share_tokens")
    .insert({ user_id: user.id, client_name: clientName, expires_at: expiresAt.toISOString() })
    .select("token")
    .single();

  if (error || !data) return { success: false, message: `تعذّر إنشاء رابط المشاركة: ${error?.message}` };
  return { success: true, token: data.token, message: "تم إنشاء الرابط بنجاح." };
}

export async function revokeShareToken(clientName: string): Promise<{ success: boolean; message: string }> {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) return { success: false, message: "يجب تسجيل الدخول أولاً." };

  await supabase.from("share_tokens").delete().eq("user_id", user.id).eq("client_name", clientName);
  return { success: true, message: "تم إلغاء الرابط." };
}

export async function getShareToken(clientName: string): Promise<ShareTokenRow | null> {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) return null;

  const { data } = await supabase
    .from("share_tokens")
    .select("*")
    .eq("user_id", user.id)
    .eq("client_name", clientName)
    .gt("expires_at", new Date().toISOString())
    .single();

  return data as ShareTokenRow | null;
}

// ── قراءة البيانات بالتوكن (بدون auth — صفحة عامة) ──

export interface SharedClientData {
  clientName: string;
  artisanName: string | null;
  days: ArtisanDayRow[];
  payments: ArtisanPaymentRow[];
  expiresAt: string;
}

export async function getSharedClientData(token: string): Promise<SharedClientData | null> {
  const supabase = createServiceClient();

  const { data: tokenRow, error: tokenError } = await supabase
    .from("share_tokens")
    .select("*")
    .eq("token", token)
    .gt("expires_at", new Date().toISOString())
    .single();

  if (tokenError || !tokenRow) return null;

  const { user_id, client_name, expires_at } = tokenRow as ShareTokenRow;

  const { data: userData } = await supabase.auth.admin.getUserById(user_id);
  const artisanName =
    userData?.user?.user_metadata?.full_name ??
    userData?.user?.email ??
    null;

  const [daysResult, paymentsResult] = await Promise.all([
    supabase.from("artisan_days").select("*").eq("user_id", user_id).eq("client_name", client_name).order("date", { ascending: false }),
    supabase.from("artisan_payments").select("*").eq("user_id", user_id).eq("client_name", client_name).order("date", { ascending: false }),
  ]);

  return {
    clientName: client_name,
    artisanName,
    days: (daysResult.data ?? []) as ArtisanDayRow[],
    payments: (paymentsResult.data ?? []) as ArtisanPaymentRow[],
    expiresAt: expires_at,
  };
}
