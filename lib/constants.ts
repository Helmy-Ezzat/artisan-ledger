import type { DayStatus, PaymentMethod } from "@/lib/database.types";

export const DAY_STATUSES: DayStatus[] = ["Full Day", "Half Day", "Holiday"];

export const PAYMENT_METHODS: PaymentMethod[] = ["Cash", "Bank Transfer"];

export const PROFESSION_TYPES = [
  "Gypsum Installer",
  "Baladi Gypsum Installer",
  "Plumber",
  "Electrician",
  "Painter",
  "Carpenter",
  "Tiler",
  "HVAC Technician",
  "General Labor",
] as const;

export const PROFESSION_LABELS: Record<
  (typeof PROFESSION_TYPES)[number],
  string
> = {
  "Gypsum Installer": "فني جبس بورد",
  "Baladi Gypsum Installer": "فني جبس بلدي",
  Plumber: "سباك",
  Electrician: "كهربائي",
  Painter: "دهان",
  Carpenter: "نجار",
  Tiler: "مبلط",
  "HVAC Technician": "فني تكييف",
  "General Labor": "عامل عام",
};

export const STATUS_LABELS: Record<DayStatus, string> = {
  "Full Day": "يوم كامل",
  "Half Day": "نصف يوم",
  Holiday: "رجعت من الشغل",
};

export const STATUS_COLORS: Record<
  DayStatus,
  { bg: string; dot: string; text: string }
> = {
  "Full Day": {
    bg: "bg-sky-500",
    dot: "bg-sky-500",
    text: "text-sky-700",
  },
  "Half Day": {
    bg: "bg-amber-400",
    dot: "bg-amber-400",
    text: "text-amber-700",
  },
  Holiday: {
    bg: "bg-rose-300",
    dot: "bg-rose-400",
    text: "text-rose-700",
  },
};

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  Cash: "نقدي",
  "Bank Transfer": "تحويل بنكي",
};

export const WEEKDAY_LABELS = ["سبت", "أحد", "إثن", "ثلا", "أرب", "خمي", "جمعة"] as const;

export const NAV_ITEMS = [
  { href: "/", label: "الرئيسية", icon: "home" as const },
  { href: "/calendar", label: "التقويم", icon: "calendar" as const },
  { href: "/work", label: "تسجيل", icon: "work" as const },
  { href: "/reports", label: "التقارير", icon: "reports" as const },
  { href: "/archive", label: "الأرشيف", icon: "archive" as const },
  { href: "/settings", label: "الإعدادات", icon: "settings" as const },
] as const;
