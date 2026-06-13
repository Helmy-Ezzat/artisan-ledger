import {
  calculateDayStats,
  calculateRemainingBalance,
  calculateTotalEarned,
  calculateTotalReceived,
  type DayStats,
} from "@/lib/calculations";
import type { ArtisanDayRow, ArtisanPaymentRow } from "@/lib/database.types";
import { createClient } from "@/lib/supabase";

export interface DashboardData {
  totalEarned: number;
  totalReceived: number;
  remainingBalance: number;
  dayStats: DayStats;
  recentPayments: ArtisanPaymentRow[];
}

export interface ReportsData {
  allWorkDays: ArtisanDayRow[];
  allPayments: ArtisanPaymentRow[];
}

export async function getAllWorkDays(): Promise<ArtisanDayRow[]> {
  const supabase = await createClient();

  // Get current authenticated user first
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) throw new Error("Unauthorized");

  const { data, error } = await supabase
    .from("artisan_days")
    .select("*")
    .eq("user_id", user.id)
    .order("date", { ascending: false });

  if (error) {
    throw new Error(`تعذّر تحميل أيام العمل: ${error.message}`);
  }

  return (data ?? []) as ArtisanDayRow[];
}

export async function getDashboardData(): Promise<DashboardData> {
  const supabase = await createClient();

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) throw new Error("Unauthorized");

  // Get archived clients first
  const { data: archivedData } = await supabase
    .from("archived_clients")
    .select("client_name")
    .eq("user_id", user.id);

  const archivedClients = new Set(
    (archivedData ?? []).map((row) => row.client_name)
  );

  const [daysResult, paymentsResult] = await Promise.all([
    supabase
      .from("artisan_days")
      .select("*")
      .eq("user_id", user.id)
      .order("date", { ascending: false }),
    supabase
      .from("artisan_payments")
      .select("*")
      .eq("user_id", user.id)
      .order("date", { ascending: false }),
  ]);

  if (daysResult.error) {
    throw new Error(`تعذّر تحميل أيام العمل: ${daysResult.error.message}`);
  }

  if (paymentsResult.error) {
    throw new Error(`تعذّر تحميل المدفوعات: ${paymentsResult.error.message}`);
  }

  // Filter out archived clients
  const allDays = ((daysResult.data ?? []) as ArtisanDayRow[]).filter(
    (day) => !archivedClients.has(day.client_name)
  );
  const allPayments = ((paymentsResult.data ?? []) as ArtisanPaymentRow[]).filter(
    (payment) => !archivedClients.has(payment.client_name)
  );

  const totalEarned = calculateTotalEarned(allDays);
  const totalReceived = calculateTotalReceived(allPayments);
  const remainingBalance = calculateRemainingBalance(
    totalEarned,
    totalReceived,
  );

  return {
    totalEarned,
    totalReceived,
    remainingBalance,
    dayStats: calculateDayStats(allDays),
    recentPayments: allPayments.slice(0, 5),
  };
}

export async function getClientNames(): Promise<string[]> {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) throw new Error("Unauthorized");

  // Get archived clients first
  const { data: archivedData } = await supabase
    .from("archived_clients")
    .select("client_name")
    .eq("user_id", user.id);

  const archivedClients = new Set(
    (archivedData ?? []).map((row) => row.client_name)
  );

  const [daysResult, paymentsResult] = await Promise.all([
    supabase
      .from("artisan_days")
      .select("client_name")
      .eq("user_id", user.id),
    supabase
      .from("artisan_payments")
      .select("client_name")
      .eq("user_id", user.id),
  ]);

  const dayClients = daysResult.data?.map((row) => row.client_name) ?? [];
  const paymentClients =
    paymentsResult.data?.map((row) => row.client_name) ?? [];

  // Combine and remove archived clients
  const allClients = [...new Set([...dayClients, ...paymentClients])];
  const activeClients = allClients.filter(
    (clientName) => !archivedClients.has(clientName)
  );

  return activeClients.sort((a, b) => a.localeCompare(b, "ar"));
}

export async function getReportsData(): Promise<ReportsData> {
  const supabase = await createClient();

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) throw new Error("Unauthorized");

  const [daysResult, paymentsResult] = await Promise.all([
    supabase
      .from("artisan_days")
      .select("*")
      .eq("user_id", user.id)
      .order("date", { ascending: false }),
    supabase
      .from("artisan_payments")
      .select("*")
      .eq("user_id", user.id)
      .order("date", { ascending: false }),
  ]);

  if (daysResult.error) {
    throw new Error(`تعذّر تحميل أيام العمل: ${daysResult.error.message}`);
  }

  if (paymentsResult.error) {
    throw new Error(`تعذّر تحميل المدفوعات: ${paymentsResult.error.message}`);
  }

  return {
    allWorkDays: (daysResult.data ?? []) as ArtisanDayRow[],
    allPayments: (paymentsResult.data ?? []) as ArtisanPaymentRow[],
  };
}
