const numberFormatter = new Intl.NumberFormat("ar-SA", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

const gregorianFormatter = new Intl.DateTimeFormat("ar-SA", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "Asia/Riyadh",
});

const shortDateFormatter = new Intl.DateTimeFormat("ar-SA", {
  year: "numeric",
  month: "short",
  day: "numeric",
  timeZone: "Asia/Riyadh",
});

const monthYearFormatter = new Intl.DateTimeFormat("ar-SA", {
  month: "long",
  year: "numeric",
  timeZone: "Asia/Riyadh",
});

function parseLocalDate(date: string): Date {
  return new Date(`${date}T12:00:00+03:00`);
}

export function formatCurrency(amount: number): string {
  return `${numberFormatter.format(amount)} ريال`;
}

export function formatDate(date: string): string {
  return shortDateFormatter.format(parseLocalDate(date));
}

export function formatDateLong(date: string): string {
  return gregorianFormatter.format(parseLocalDate(date));
}

export function formatMonthYear(year: number, month: number): string {
  return monthYearFormatter.format(new Date(year, month, 1));
}
