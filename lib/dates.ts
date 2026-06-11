/** تاريخ اليوم بصيغة ISO (YYYY-MM-DD) حسب توقيت السعودية */
export function getTodayISO(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Riyadh",
  }).format(new Date());
}

/** توحيد صيغة التاريخ القادمة من Supabase */
export function normalizeDateKey(date: string): string {
  return date.slice(0, 10);
}
