import { z } from "zod";
import { DAY_STATUSES, PAYMENT_METHODS } from "@/lib/constants";

export const workSessionSchema = z.object({
  date: z.string().min(1, "التاريخ مطلوب"),
  daily_rate: z.coerce
    .number({ error: "الأجر اليومي يجب أن يكون رقماً" })
    .positive("الأجر اليومي يجب أن يكون أكبر من صفر"),
  status: z.enum(DAY_STATUSES, { error: "اختر حالة اليوم" }),
  profession_type: z.string().trim().min(1, "المهنة مطلوبة"),
  client_name: z.string().trim().min(1, "اسم المقاول مطلوب"),
  location: z.string().trim().optional(),
  notes: z.string().trim().optional(),
});

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
