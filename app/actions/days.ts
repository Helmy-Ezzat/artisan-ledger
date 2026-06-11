"use server";

import { createClient } from "@/lib/supabase";
import { revalidateApp } from "@/lib/revalidate";
import { workSessionSchema, type WorkSessionInput } from "@/lib/validations";

export type WorkSessionActionState = {
  success: boolean;
  message: string;
  fieldErrors?: Partial<Record<keyof WorkSessionInput, string>>;
};

export async function createWorkSession(
  _prevState: WorkSessionActionState,
  formData: FormData,
): Promise<WorkSessionActionState> {
  const raw = {
    date: formData.get("date"),
    daily_rate: formData.get("daily_rate"),
    status: formData.get("status"),
    profession_type: formData.get("profession_type"),
    client_name: formData.get("client_name"),
    location: formData.get("location") || undefined,
    notes: formData.get("notes") || undefined,
  };

  const parsed = workSessionSchema.safeParse(raw);

  if (!parsed.success) {
    const fieldErrors: Partial<Record<keyof WorkSessionInput, string>> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0];
      if (typeof field === "string" && !fieldErrors[field as keyof WorkSessionInput]) {
        fieldErrors[field as keyof WorkSessionInput] = issue.message;
      }
    }

    return {
      success: false,
      message: "يرجى تصحيح الحقول المحددة.",
      fieldErrors,
    };
  }

  const { data } = parsed;

  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return { success: false, message: "يجب تسجيل الدخول أولاً." };
  }

  const { error } = await supabase.from("artisan_days").insert({
    user_id: user.id,
    date: data.date,
    daily_rate: data.daily_rate,
    status: data.status,
    profession_type: data.profession_type,
    client_name: data.client_name,
    location: data.location || null,
    notes: data.notes || null,
  });

  if (error) {
    let message: string;

    if (error.code === "23505") {
      message = "يوجد يوم عمل مسجّل بالفعل في هذا التاريخ.";
    } else if (error.message.includes("row-level security")) {
      message =
        "صلاحيات قاعدة البيانات غير مكتملة. نفّذ ملف supabase/rls_policies.sql في Supabase → SQL Editor، أو أضف SUPABASE_SERVICE_ROLE_KEY في .env.local.";
    } else {
      message = `تعذّر حفظ يوم العمل: ${error.message}`;
    }

    return { success: false, message };
  }

  revalidateApp();
  return { success: true, message: "تم تسجيل يوم العمل بنجاح." };
}
