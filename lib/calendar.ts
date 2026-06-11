/** السبت = 0 (بداية الأسبوع في السعودية) */
export function getSaturdayBasedWeekday(date: Date): number {
  return (date.getDay() + 1) % 7;
}

export function toDateKey(year: number, month: number, day: number): string {
  const m = String(month + 1).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  return `${year}-${m}-${d}`;
}

export interface CalendarCell {
  dateKey: string;
  day: number;
  inMonth: boolean;
}

export function buildMonthGrid(year: number, month: number): CalendarCell[] {
  const firstOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startOffset = getSaturdayBasedWeekday(firstOfMonth);

  const cells: CalendarCell[] = [];

  const prevMonthDays = new Date(year, month, 0).getDate();
  for (let i = startOffset - 1; i >= 0; i--) {
    const day = prevMonthDays - i;
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    cells.push({
      dateKey: toDateKey(prevYear, prevMonth, day),
      day,
      inMonth: false,
    });
  }

  for (let day = 1; day <= daysInMonth; day++) {
    cells.push({
      dateKey: toDateKey(year, month, day),
      day,
      inMonth: true,
    });
  }

  while (cells.length % 7 !== 0) {
    const nextDay = cells.length - startOffset - daysInMonth + 1;
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;
    cells.push({
      dateKey: toDateKey(nextYear, nextMonth, nextDay),
      day: nextDay,
      inMonth: false,
    });
  }

  return cells;
}
