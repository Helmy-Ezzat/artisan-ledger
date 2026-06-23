import type { ArtisanDayRow } from "@/lib/database.types";

type EarningInput = Pick<ArtisanDayRow, "daily_rate" | "status">;

export interface DayStats {
  fullDays: number;
  halfDays: number;
  offDays: number;
  vacationDays: number;
}

const STATUS_MULTIPLIER: Record<ArtisanDayRow["status"], number> = {
  "Full Day": 1,
  "Half Day": 0.5,
  Holiday: 0,
  Vacation: 0,
};

export function getDayEarning(day: EarningInput): number {
  const rate = typeof day.daily_rate === "number" ? day.daily_rate : 0;
  return rate * (STATUS_MULTIPLIER[day.status] ?? 0);
}

export function calculateTotalEarned(days: EarningInput[]): number {
  return days.reduce((total, day) => {
    const earning = getDayEarning(day);
    return total + (isNaN(earning) ? 0 : earning);
  }, 0);
}

export function calculateTotalReceived(payments: { amount: number }[]): number {
  return payments.reduce((total, payment) => {
    const amount = typeof payment.amount === "number" ? payment.amount : 0;
    return total + (isNaN(amount) ? 0 : amount);
  }, 0);
}

export function calculateRemainingBalance(totalEarned: number, totalReceived: number): number {
  return totalEarned - totalReceived;
}

export function calculateTotalWorkDays(days: EarningInput[]): number {
  return days.reduce((total, day) => total + STATUS_MULTIPLIER[day.status], 0);
}

export function calculateDayStats(days: ArtisanDayRow[]): DayStats {
  return days.reduce<DayStats>(
    (stats, day) => {
      if (day.status === "Full Day") stats.fullDays += 1;
      else if (day.status === "Half Day") stats.halfDays += 1;
      else if (day.status === "Vacation") stats.vacationDays += 1;
      else stats.offDays += 1;
      return stats;
    },
    { fullDays: 0, halfDays: 0, offDays: 0, vacationDays: 0 },
  );
}
