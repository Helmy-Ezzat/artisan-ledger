import { z } from "zod";
import { DAY_STATUSES, PAYMENT_METHODS } from "@/lib/constants";

export const workSessionSchema = z.object({
  date: z.string().min(1, "التاريخ مطلوب"),
  status: z.enum(DAY_STATUSES, { error: "اختر حالة اليوم" }),
  daily_rate: z.coerce
    .number({ error: "الأجر اليومي يجب أن يكون رقماً" })
    .nonnegative("الأجر اليومي يجب أن يكون صفراً أو أكبر")
    .optional()
    .default(0),
  profession_type: z.string().trim().optional().default(""),
  client_name: z.string().trim().optional().default(""),
  location: z.string().trim().optional(),
  notes: z.string().trim().optional(),
}).refine(
  (data) => data.status === "Vacation" || (data.daily_rate ?? 0) > 0,
  { message: "الأجر اليومي يجب أن يكون أكبر من صفر", path: ["daily_rate"] }
).refine(
  (data) => data.status === "Vacation" || (data.profession_type ?? "").length > 0,
  { message: "المهنة مطلوبة", path: ["profession_type"] }
).refine(
  (data) => data.status === "Vacation" || (data.client_name ?? "").length > 0,
  { message: "اسم المقاول مطلوب", path: ["client_name"] }
);

export const paymentSchema = z.object({
  date: z.string().min(1, "التاريخ مطلوب"),
  amount: z.coerce
    .number({ error: "المبلغ يجب أن يكون رقماً" })
    .positive("المبلغ يجب أن يكون أكبر من صفر"),
  client_name: z.string().trim().min(1, "اسم المقاول مطلوب"),
  payment_method: z.enum(PAYMENT_METHODS, { error: "اختر طريقة الدفع" }),
  location: z.string().trim().optional(),
  notes: z.string().trim().optional(),
});

export type WorkSessionInput = z.infer<typeof workSessionSchema>;
export type PaymentInput = z.infer<typeof paymentSchema>;
