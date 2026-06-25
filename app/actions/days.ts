"use server";

import { createClient } from "@/lib/supabase";
import { revalidateApp } from "@/lib/revalidate";
import { workSessionSchema, type WorkSessionInput } from "@/lib/validations";
import type { ArtisanDayRow } from "@/lib/database.types";

export type WorkSessionActionState = {
  success: boolean;
  message: string;
  fieldErrors?: Partial<Record<keyof WorkSessionInput, string>>;
};

/** تحضير الـ raw object من FormData مع معالجة Vacation */
function buildRaw(formData: FormData) {
  const status = (formData.get("status") as string) ?? "";
  const isVacation = status === "Vacation";
  return {
    date: formData.get("date"),
    status,
    daily_rate: isVacation ? "0" : formData.get("daily_rate"),
    profession_type: isVacation ? "" : formData.get("profession_type"),
    client_name: isVacation ? "" : formData.get("client_name"),
    location: formData.get("location") || undefined,
    notes: formData.get("notes") || undefined,
  };
}

export async function createWorkSession(
  _prevState: WorkSessionActionState,
  formData: FormData,
): Promise<WorkSessionActionState> {
  const parsed = workSessionSchema.safeParse(buildRaw(formData));

  if (!parsed.success) {
    const fieldErrors: Partial<Record<keyof WorkSessionInput, string>> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0];
      if (typeof field === "string" && !fieldErrors[field as keyof WorkSessionInput]) {
        fieldErrors[field as keyof WorkSessionInput] = issue.message;
      }
    }
    return { success: false, message: "يرجى تصحيح الحقول المحددة.", fieldErrors };
  }

  const { data } = parsed;
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) return { success: false, message: "يجب تسجيل الدخول أولاً." };

  const { error } = await supabase.from("artisan_days").insert({
    user_id: user.id,
    date: data.date,
    daily_rate: data.daily_rate ?? 0,
    status: data.status,
    profession_type: data.profession_type ?? "",
    client_name: data.client_name ?? "",
    location: data.location || null,
    notes: data.notes || null,
  });

  if (error) {
    let message: string;
    if (error.code === "23505") {
      message = "يوجد يوم عمل مسجّل بالفعل في هذا التاريخ.";
    } else if (error.message.includes("row-level security")) {
      message = "صلاحيات قاعدة البيانات غير مكتملة.";
    } else {
      message = `تعذّر حفظ يوم العمل: ${error.message}`;
    }
    return { success: false, message };
  }

  revalidateApp();
  return { success: true, message: "تم تسجيل يوم العمل بنجاح." };
}

export async function updateWorkSession(
  id: string,
  _prevState: WorkSessionActionState,
  formData: FormData,
): Promise<WorkSessionActionState> {
  const parsed = workSessionSchema.safeParse(buildRaw(formData));

  if (!parsed.success) {
    const fieldErrors: Partial<Record<keyof WorkSessionInput, string>> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0];
      if (typeof field === "string" && !fieldErrors[field as keyof WorkSessionInput]) {
        fieldErrors[field as keyof WorkSessionInput] = issue.message;
      }
    }
    return { success: false, message: "يرجى تصحيح الحقول المحددة.", fieldErrors };
  }

  const { data } = parsed;
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) return { success: false, message: "يجب تسجيل الدخول أولاً." };

  const { error } = await supabase.from("artisan_days").update({
    date: data.date,
    daily_rate: data.daily_rate ?? 0,
    status: data.status,
    profession_type: data.profession_type ?? "",
    client_name: data.client_name ?? "",
    location: data.location || null,
    notes: data.notes || null,
  }).eq("id", id).eq("user_id", user.id);

  if (error) {
    const message = error.code === "23505"
      ? "يوجد يوم عمل مسجّل بالفعل في هذا التاريخ."
      : `تعذّر تحديث يوم العمل: ${error.message}`;
    return { success: false, message };
  }

  revalidateApp();
  return { success: true, message: "تم تحديث يوم العمل بنجاح." };
}

export async function deleteWorkSession(
  id: string,
): Promise<{ success: boolean; message: string }> {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) return { success: false, message: "يجب تسجيل الدخول أولاً." };

  const { error } = await supabase.from("artisan_days").delete().eq("id", id).eq("user_id", user.id);
  if (error) return { success: false, message: `تعذّر حذف يوم العمل: ${error.message}` };

  revalidateApp();
  return { success: true, message: "تم حذف يوم العمل بنجاح." };
}

export async function getWorkSessionById(id: string): Promise<ArtisanDayRow | null> {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) throw new Error("Unauthorized");

  const { data, error } = await supabase.from("artisan_days").select("*").eq("id", id).eq("user_id", user.id).single();
  if (error || !data) return null;
  return data as ArtisanDayRow;
}
