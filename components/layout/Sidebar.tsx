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

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 lg:hidden z-40"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed top-0 right-0 h-full bg-white border-l border-slate-200 shadow-xl z-50 transition-transform duration-300
        w-80 lg:w-72
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        lg:translate-x-0
      `}>
        {/* Header */}
        <div className="flex items-center justify-center p-4 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-900">دفتر الصنايعي</h2>
        </div>

        {/* Navigation */}
        <nav className="p-4">
          <div className="space-y-2">
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
                  onClick={onClose}
                  className={`
                    flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group
                    ${isActive
                      ? "bg-teal-50 text-teal-700 shadow-sm"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }
                  `}
                >
                  <Icon className={`
                    h-6 w-6 transition-colors
                    ${isActive ? "text-teal-600" : ""}
                    group-hover:scale-105
                  `} />
                  
                  <span className="font-medium text-base">
                    {item.label}
                  </span>
                  
                  {isActive && (
                    <div className="w-2 h-2 bg-teal-500 rounded-full ml-auto" />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <p className="text-xs text-slate-500 text-center leading-relaxed">
              دفتر حسابات الصنايعي
              <br />
              <span className="text-slate-400">v1.0.0</span>
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}