"use client";

import { splitCurrency } from "@/lib/format";

interface CurrencyTextProps {
  amount: number;
  className?: string;
  /** لون الرقم — default: text-slate-900 */
  numberClass?: string;
  /** لون رمز الريال — default: text-slate-500 */
  symbolClass?: string;
}

/**
 * يعرض المبلغ بلون موحد:
 * الرقم بـ numberClass، ورمز ﷼ بـ symbolClass (أخف شوية)
 */
export function CurrencyText({
  amount,
  className = "",
  numberClass = "text-slate-900",
  symbolClass = "text-slate-400",
}: CurrencyTextProps) {
  const { number, symbol } = splitCurrency(amount);
  return (
    <span className={className}>
      <span className={numberClass}>{number}</span>
      <span className={`mr-0.5 text-[0.85em] ${symbolClass}`}>{symbol}</span>
    </span>
  );
}
