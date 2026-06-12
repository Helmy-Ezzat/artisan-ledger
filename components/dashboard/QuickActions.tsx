import { Briefcase, ChevronLeft } from "lucide-react";
import Link from "next/link";

const actions = [
  {
    href: "/work",
    label: "تسجيل يوم عمل أو دفعة",
    icon: Briefcase,
    className:
      "bg-sky-600 text-white shadow-md shadow-sky-600/25 active:bg-sky-700",
  },
] as const;

export function QuickActions() {
  return (
    <section className="flex flex-col gap-2.5">
      {actions.map((action) => {
        const Icon = action.icon;

        return (
          <Link
            key={action.href}
            href={action.href}
            className={`touch-manipulation flex min-h-[56px] items-center justify-between gap-3 rounded-2xl px-4 py-3.5 font-bold transition active:scale-[0.98] ${action.className}`}
          >
            <span className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
                <Icon className="h-5 w-5" />
              </span>
              <span className="text-base">{action.label}</span>
            </span>
            <ChevronLeft className="h-5 w-5 opacity-80" />
          </Link>
        );
      })}
    </section>
  );
}
