"use server";

import { createClient } from "@/lib/supabase";
import { revalidateApp } from "@/lib/revalidate";
import type { ArchivedClientRow } from "@/lib/database.types";

export type ClientActionState = {
  success: boolean;
  message: string;
};

/**
 * Archive a client by moving them to the archived_clients table
 * This is used for the "Settle Account" flow
 */
export async function archiveClientAction(
  clientName: string,
  finalPaymentId?: string,
  notes?: string
): Promise<ClientActionState> {
  if (!clientName || clientName.trim() === "") {
    return { success: false, message: "اسم العميل مطلوب." };
  }

  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return { success: false, message: "يجب تسجيل الدخول أولاً." };
  }

  // Check if client is already archived
  const { data: existingArchive } = await supabase
    .from("archived_clients")
    .select("id")
    .eq("user_id", user.id)
    .eq("client_name", clientName)
    .single();

  if (existingArchive) {
    return { success: false, message: "هذا العميل مؤرشف بالفعل." };
  }

  // Archive the client
  const { error } = await supabase.from("archived_clients").insert({
    user_id: user.id,
    client_name: clientName,
    final_payment_id: finalPaymentId || null,
    notes: notes || null,
  });

  if (error) {
    console.error("Archive client error:", error);
    return { 
      success: false, 
      message: `تعذّر أرشفة العميل: ${error.message}` 
    };
  }

  revalidateApp();
  return { success: true, message: `تم أرشفة العميل "${clientName}" بنجاح.` };
}

/**
 * Unarchive a client by removing them from the archived_clients table
 */
export async function unarchiveClientAction(
  clientName: string
): Promise<ClientActionState> {
  if (!clientName || clientName.trim() === "") {
    return { success: false, message: "اسم العميل مطلوب." };
  }

  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return { success: false, message: "يجب تسجيل الدخول أولاً." };
  }

  const { error } = await supabase
    .from("archived_clients")
    .delete()
    .eq("user_id", user.id)
    .eq("client_name", clientName);

  if (error) {
    console.error("Unarchive client error:", error);
    return { 
      success: false, 
      message: `تعذّر إلغاء أرشفة العميل: ${error.message}` 
    };
  }

  revalidateApp();
  return { success: true, message: `تم إلغاء أرشفة العميل "${clientName}" بنجاح.` };
}

/**
 * Get all archived clients for the current user
 */
export async function getArchivedClients(): Promise<ArchivedClientRow[]> {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase
    .from("archived_clients")
    .select("*")
    .eq("user_id", user.id)
    .order("archived_at", { ascending: false });

  if (error) {
    throw new Error(`تعذّر تحميل الأرشيف: ${error.message}`);
  }

  return (data ?? []) as ArchivedClientRow[];
}

/**
 * Get client statistics (work days and payments) for archived view
 */
export async function getClientStats(clientName: string): Promise<{
  totalEarned: number;
  totalReceived: number;
  workDaysCount: number;
  paymentsCount: number;
}> {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("Unauthorized");
  }

  const [daysResult, paymentsResult] = await Promise.all([
    supabase
      .from("artisan_days")
      .select("*")
      .eq("user_id", user.id)
      .eq("client_name", clientName),
    supabase
      .from("artisan_payments")
      .select("*")
      .eq("user_id", user.id)
      .eq("client_name", clientName),
  ]);

  const days = daysResult.data ?? [];
  const payments = paymentsResult.data ?? [];

  const totalEarned = days.reduce((sum, day) => {
    if (day.status === "Full Day") return sum + day.daily_rate;
    if (day.status === "Half Day") return sum + day.daily_rate / 2;
    return sum;
  }, 0);

  const totalReceived = payments.reduce((sum, payment) => sum + payment.amount, 0);

  return {
    totalEarned,
    totalReceived,
    workDaysCount: days.length,
    paymentsCount: payments.length,
  };
}
