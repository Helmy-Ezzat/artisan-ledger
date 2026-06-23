import { createClient } from "@supabase/supabase-js";

/**
 * Service-role client — يُستخدم فقط في Server Actions/API Routes
 * لا تستخدمه أبداً في الـ client side
 */
export function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  if (!serviceKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY غير موجود في متغيرات البيئة.");
  }

  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
