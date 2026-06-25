import { format } from "date-fns";
import { arSA } from "date-fns/locale";

const numberFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
  useGrouping: false,
});

function parseLocalDate(dateString: string): Date {
  return new Date(`${dateString}T12:00:00+03:00`);
}

// ١. تنسيق العملة — الرقم + ريال بنفس اللون الموحد
export function formatCurrency(amount: number): string {
  const safeAmount = isNaN(amount) || !isFinite(amount) ? 0 : amount;
  const roundedAmount = Math.round(safeAmount * 100) / 100;
  return `${numberFormatter.format(roundedAmount)} ﷼`;
}

/** نفس formatCurrency لكن يرجع الأجزاء منفصلة عشان تقدر تلوّنهم */
export function splitCurrency(amount: number): { number: string; symbol: string } {
  const safeAmount = isNaN(amount) || !isFinite(amount) ? 0 : amount;
  const roundedAmount = Math.round(safeAmount * 100) / 100;
  return { number: numberFormatter.format(roundedAmount), symbol: "﷼" };
}

// ٢. التاريخ القصير (مثل: 11 يونيو 2026)
export function formatDate(date: string): string {
  return format(parseLocalDate(date), "d MMMM yyyy", { locale: arSA });
}

// ٣. التاريخ الطويل بالتفصيل (مثل: الخميس، 11 يونيو 2026)
export function formatDateLong(date: string): string {
  return format(parseLocalDate(date), "EEEE، d MMMM yyyy", { locale: arSA });
}

// ٤. تنسيق تقرير الشهر والسنة (مثل: يونيو 2026)
export function formatMonthYear(year: number, month: number): string {
  return format(new Date(year, month, 1), "MMMM yyyy", { locale: arSA });
}

// ٥. تنسيق التاريخ بالأرقام فقط (مثل: 2026/06/11)
export function formatDateNumeric(date: string): string {
  return format(parseLocalDate(date), "yyyy/MM/dd");
}
