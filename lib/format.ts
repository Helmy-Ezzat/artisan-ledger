import { format } from "date-fns";
import { arSA } from "date-fns/locale";

// منسق الأرقام الإنجليزية البسيط (عشان الفواصل زي 1,500)
// بدون تقسيم عشوائي أو خصم
const numberFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
  useGrouping: false,
});

function parseLocalDate(dateString: string): Date {
  return new Date(`${dateString}T12:00:00+03:00`);
}

// ١. تنسيق العملة بالأرقام الإنجليزية
export function formatCurrency(amount: number): string {
  // نضبط العدد عشان ميجيش أرقام عشوائية زي 149.96 بدل 150
  const roundedAmount = Math.round(amount * 100) / 100;
  return `${numberFormatter.format(roundedAmount)} ريال`;
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
