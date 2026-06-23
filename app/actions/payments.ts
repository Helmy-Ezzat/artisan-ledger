"use server";

import { createClient } from "@/lib/supabase";
import { revalidateApp } from "@/lib/revalidate";
import { paymentSchema, type PaymentInput } from "@/lib/validations";
import type { ArtisanPaymentRow } from "@/lib/database.types";

export type PaymentActionState = {
  success: boolean;
  message: string;
  fieldErrors?: Partial<Record<keyof PaymentInput, string>>;
};

export async function createPayment(
  _prevState: PaymentActionState,
  formData: FormData,
): Promise<PaymentActionState> {
  const raw = {
    date: formData.get("date"),
    amount: formData.get("amount"),
    client_name: formData.get("client_name"),
    payment_method: formData.get("payment_method"),
    location: formData.get("location") || undefined,
    notes: formData.get("notes") || undefined,
  };

  const parsed = paymentSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Partial<Record<keyof PaymentInput, string>> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0];
      if (typeof field === "string" && !fieldErrors[field as keyof PaymentInput])
        fieldErrors[field as keyof PaymentInput] = issue.message;
    }
    return { success: false, message: "يرجى تصحيح الحقول المحددة.", fieldErrors };
  }

  const { data } = parsed;
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) return { success: false, message: "يجب تسجيل الدخول أولاً." };

  const { error } = await supabase.from("artisan_payments").insert({
    user_id: user.id,
    date: data.date,
    amount: data.amount,
    client_name: data.client_name,
    payment_method: data.payment_method,
    location: data.location || null,
    notes: data.notes || null,
  });

  if (error) {
    const message = error.message.includes("row-level security")
      ? "صلاحيات قاعدة البيانات غير مكتملة."
      : `تعذّر حفظ الدفعة: ${error.message}`;
    return { success: false, message };
  }

  revalidateApp();
  return { success: true, message: "تم تسجيل الدفعة بنجاح." };
}

export async function updatePayment(
  id: string,
  _prevState: PaymentActionState,
  formData: FormData,
): Promise<PaymentActionState> {
  const raw = {
    date: formData.get("date"),
    amount: formData.get("amount"),
    client_name: formData.get("client_name"),
    payment_method: formData.get("payment_method"),
    location: formData.get("location") || undefined,
    notes: formData.get("notes") || undefined,
  };

  const parsed = paymentSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Partial<Record<keyof PaymentInput, string>> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0];
      if (typeof field === "string" && !fieldErrors[field as keyof PaymentInput])
        fieldErrors[field as keyof PaymentInput] = issue.message;
    }
    return { success: false, message: "يرجى تصحيح الحقول المحددة.", fieldErrors };
  }

  const { data } = parsed;
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) return { success: false, message: "يجب تسجيل الدخول أولاً." };

  const { error } = await supabase.from("artisan_payments").update({
    date: data.date,
    amount: data.amount,
    client_name: data.client_name,
    payment_method: data.payment_method,
    location: data.location || null,
    notes: data.notes || null,
  }).eq("id", id).eq("user_id", user.id);

  if (error) return { success: false, message: `تعذّر تحديث الدفعة: ${error.message}` };
  revalidateApp();
  return { success: true, message: "تم تحديث الدفعة بنجاح." };
}

export async function deletePayment(id: string): Promise<{ success: boolean; message: string }> {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) return { success: false, message: "يجب تسجيل الدخول أولاً." };

  const { error } = await supabase.from("artisan_payments").delete().eq("id", id).eq("user_id", user.id);
  if (error) return { success: false, message: `تعذّر حذف الدفعة: ${error.message}` };
  revalidateApp();
  return { success: true, message: "تم حذف الدفعة بنجاح." };
}

export async function getPaymentById(id: string): Promise<ArtisanPaymentRow | null> {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) throw new Error("Unauthorized");

  const { data, error } = await supabase.from("artisan_payments").select("*").eq("id", id).eq("user_id", user.id).single();
  if (error || !data) return null;
  return data as ArtisanPaymentRow;
}
