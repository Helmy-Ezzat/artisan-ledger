import {
  calculateDayStats,
  calculateRemainingBalance,
  calculateTotalEarned,
  calculateTotalReceived,
  type DayStats,
} from "@/lib/calculations";
import type { ArtisanDayRow, ArtisanPaymentRow } from "@/lib/database.types";
import { supabaseServer as supabase } from "@/lib/supabaseServer";

export interface DashboardData {
  totalEarned: number;
  totalReceived: number;
  remainingBalance: number;
  dayStats: DayStats;
  recentPayments: ArtisanPaymentRow[];
  clientNames: string[];
}

export async function getAllWorkDays(): Promise<ArtisanDayRow[]> {
  const { data, error } = await supabase
    .from("artisan_days")
    .select("*")
    .order("date", { ascending: false });

  if (error) {
    throw new Error(`تعذّر تحميل أيام العمل: ${error.message}`);
  }

  return (data ?? []) as ArtisanDayRow[];
}

export async function getDashboardData(): Promise<DashboardData> {
  const [daysResult, paymentsResult, clientsResult] = await Promise.all([
    supabase.from("artisan_days").select("*").order("date", { ascending: false }),
    supabase
      .from("artisan_payments")
      .select("*")
      .order("date", { ascending: false }),
    supabase.from("artisan_days").select("client_name"),
  ]);

  if (daysResult.error) {
    throw new Error(`تعذّر تحميل أيام العمل: ${daysResult.error.message}`);
  }

  if (paymentsResult.error) {
    throw new Error(`تعذّر تحميل المدفوعات: ${paymentsResult.error.message}`);
  }

  const allDays = (daysResult.data ?? []) as ArtisanDayRow[];
  const allPayments = (paymentsResult.data ?? []) as ArtisanPaymentRow[];

  const totalEarned = calculateTotalEarned(allDays);
  const totalReceived = calculateTotalReceived(allPayments);
  const remainingBalance = calculateRemainingBalance(
    totalEarned,
    totalReceived,
  );

  const paymentClients =
    (
      await supabase.from("artisan_payments").select("client_name")
    ).data?.map((row) => row.client_name) ?? [];

  const dayClients =
    clientsResult.data?.map((row) => row.client_name) ?? [];

  const clientNames = [...new Set([...dayClients, ...paymentClients])].sort(
    (a, b) => a.localeCompare(b, "ar"),
  );

  return {
    totalEarned,
    totalReceived,
    remainingBalance,
    dayStats: calculateDayStats(allDays),
    recentPayments: allPayments.slice(0, 5),
    clientNames,
  };
}

export async function getClientNames(): Promise<string[]> {
  const [daysResult, paymentsResult] = await Promise.all([
    supabase.from("artisan_days").select("client_name"),
    supabase.from("artisan_payments").select("client_name"),
  ]);

  const dayClients = daysResult.data?.map((row) => row.client_name) ?? [];
  const paymentClients =
    paymentsResult.data?.map((row) => row.client_name) ?? [];

  return [...new Set([...dayClients, ...paymentClients])].sort((a, b) =>
    a.localeCompare(b, "ar"),
  );
}
