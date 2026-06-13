"use client";

import { NAV_ITEMS } from "@/lib/constants";
import { Briefcase, CalendarDays, LayoutDashboard, Settings, BarChart3, Archive } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const icons = {
  home: LayoutDashboard,
  calendar: CalendarDays,
  work: Briefcase,
  reports: BarChart3,
  archive: Archive,
  settings: Settings,
};

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto grid max-w-lg grid-cols-6 px-1 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2">
        {NAV_ITEMS.map((item) => {
          const Icon = icons[item.icon];
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 rounded-2xl px-1 py-2 text-[10px] font-medium transition ${
                isActive
                  ? "bg-teal-50 text-teal-700"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? "text-teal-600" : ""}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
