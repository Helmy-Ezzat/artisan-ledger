import { formatCurrency } from "@/lib/format";

interface FinancialCardsProps {
  totalEarned: number;
  totalReceived: number;
  remainingBalance: number;
}

const items = [
  { key: "earned" as const, label: "اللي ليا", color: "text-sky-600" },
  { key: "received" as const, label: "وصلتني", color: "text-emerald-600" },
  { key: "balance" as const, label: "باقي ليا", color: "text-amber-600" },
];

export function FinancialCards({
  totalEarned,
  totalReceived,
  remainingBalance,
}: FinancialCardsProps) {
  const values = {
    earned: totalEarned,
    received: totalReceived,
    balance: remainingBalance,
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
      <div className="grid grid-cols-3 divide-x divide-x-reverse divide-slate-100">
        {items.map((item) => {
          const value = values[item.key];
          const isNegative = item.key === "balance" && value < 0;

          return (
            <div key={item.key} className="px-1 py-1 text-center">
              <p className={`text-[11px] font-bold leading-tight ${item.color}`}>
                {item.label}
              </p>
              <p
                className={`mt-1 text-sm font-extrabold leading-tight ${
                  isNegative ? "text-red-600" : "text-slate-900"
                }`}
              >
                {formatCurrency(value)}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
