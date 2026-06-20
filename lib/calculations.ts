import type { ArtisanDayRow } from "@/lib/database.types";

type EarningInput = Pick<ArtisanDayRow, "daily_rate" | "status">;

export interface DayStats {
  fullDays: number;
  halfDays: number;
  offDays: number;
}

const STATUS_MULTIPLIER: Record<ArtisanDayRow["status"], number> = {
  "Full Day": 1,
  "Half Day": 0.5,
  Holiday: 0,
};

export function getDayEarning(day: EarningInput): number {
  return day.daily_rate * STATUS_MULTIPLIER[day.status];
}

export function calculateTotalEarned(days: EarningInput[]): number {
  return days.reduce((total, day) => total + getDayEarning(day), 0);
}

export function calculateTotalReceived(
  payments: { amount: number }[],
): number {
  return payments.reduce((total, payment) => total + payment.amount, 0);
}

export function calculateRemainingBalance(
  totalEarned: number,
  totalReceived: number,
): number {
  return totalEarned - totalReceived;
}

export function calculateTotalWorkDays(days: EarningInput[]): number {
  return days.reduce(
    (total, day) => total + STATUS_MULTIPLIER[day.status],
    0,
  );
}

export function calculateDayStats(days: ArtisanDayRow[]): DayStats {
  return days.reduce<DayStats>(
    (stats, day) => {
      if (day.status === "Full Day") stats.fullDays += 1;
      else if (day.status === "Half Day") stats.halfDays += 1;
      else stats.offDays += 1;
      return stats;
    },
    { fullDays: 0, halfDays: 0, offDays: 0 },
  );
}
