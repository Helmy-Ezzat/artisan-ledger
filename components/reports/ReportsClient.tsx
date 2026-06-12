"use client";

import { useState, useMemo } from "react";
import { calculateTotalEarned, calculateTotalReceived, calculateRemainingBalance } from "@/lib/calculations";
import { formatCurrency } from "@/lib/format";
import { Coins, Filter } from "lucide-react";
import type { ArtisanDayRow, ArtisanPaymentRow } from "@/lib/database.types";

export function ReportsClient({ 
  initialWorkDays, 
  initialPayments, 
  clientNames 
}: { 
  initialWorkDays: ArtisanDayRow[]; 
  initialPayments: ArtisanPaymentRow[]; 
  clientNames: string[]; 
}) {
  // Filter state
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  // Filter data
  const filteredWorkDays = useMemo(() => {
    return initialWorkDays.filter((day) => {
      const matchesClient = !selectedClient || day.client_name === selectedClient;
      const matchesStatus = !selectedStatus || day.status === selectedStatus;
      const matchesStart = !startDate || day.date >= startDate;
      const matchesEnd = !endDate || day.date <= endDate;
      return matchesClient && matchesStatus && matchesStart && matchesEnd;
    });
  }, [initialWorkDays, selectedClient, selectedStatus, startDate, endDate]);

  const filteredPayments = useMemo(() => {
    return initialPayments.filter((payment) => {
      const matchesClient = !selectedClient || payment.client_name === selectedClient;
      const matchesStart = !startDate || payment.date >= startDate;
      const matchesEnd = !endDate || payment.date <= endDate;
      return matchesClient && matchesStart && matchesEnd;
    });
  }, [initialPayments, selectedClient, startDate, endDate]);

  const totalEarned = calculateTotalEarned(filteredWorkDays);
  const totalReceived = calculateTotalReceived(filteredPayments);
  const remainingBalance = calculateRemainingBalance(totalEarned, totalReceived);

  // Group by month for monthly stats
  const monthlyStats = useMemo(() => {
    const months = new Map();

    filteredWorkDays.forEach((day) => {
      const date = new Date(day.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      if (!months.has(monthKey)) {
        months.set(monthKey, {
          year: date.getFullYear(),
          month: date.getMonth(),
          workDays: 0,
          halfDays: 0,
          offDays: 0,
          earned: 0,
          received: 0,
        });
      }
      const stat = months.get(monthKey);
      stat.workDays += day.status === "Full Day" ? 1 : 0;
      stat.halfDays += day.status === "Half Day" ? 1 : 0;
      stat.offDays += day.status === "Holiday" ? 1 : 0;
      stat.earned += day.status === "Full Day" ? day.daily_rate : day.status === "Half Day" ? day.daily_rate / 2 : 0;
    });

    filteredPayments.forEach((payment) => {
      const date = new Date(payment.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      if (!months.has(monthKey)) {
        months.set(monthKey, {
          year: date.getFullYear(),
          month: date.getMonth(),
          workDays: 0,
          halfDays: 0,
          offDays: 0,
          earned: 0,
          received: 0,
        });
      }
      const stat = months.get(monthKey);
      stat.received += payment.amount;
    });

    return Array.from(months.values()).sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      return b.month - a.month;
    });
  }, [filteredWorkDays, filteredPayments]);

  const monthNames = [
    "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
    "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
  ];

  return (
    <div className="space-y-4">
      {/* Filters Section */}
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-slate-700" />
          <h3 className="font-semibold text-slate-900">تصفية</h3>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">العميل</label>
            <select
              value={selectedClient || ""}
              onChange={(e) => setSelectedClient(e.target.value || null)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="">الكل</option>
              {clientNames.map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">الحالة</label>
            <select
              value={selectedStatus || ""}
              onChange={(e) => setSelectedStatus(e.target.value || null)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="">الكل</option>
              <option value="Full Day">يوم كامل</option>
              <option value="Half Day">نصف يوم</option>
              <option value="Holiday">إجازة</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">من التاريخ</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">إلى التاريخ</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <button
            onClick={() => {
              setSelectedClient(null);
              setSelectedStatus(null);
              setStartDate("");
              setEndDate("");
            }}
            className="flex-1 px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-sm font-medium hover:bg-slate-200"
          >
            إعادة التفعيل
          </button>
        </div>
      </section>

      {/* Summary Cards */}
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Coins className="h-5 w-5 text-emerald-600" />
          <h3 className="font-semibold text-slate-900">الملخص</h3>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-xl bg-sky-50 px-2 py-3 text-center">
            <p className="text-[11px] font-bold leading-tight text-sky-600">اللي ليا</p>
            <p className="mt-1 text-sm font-extrabold leading-tight text-slate-900">
              {formatCurrency(totalEarned)}
            </p>
          </div>
          <div className="rounded-xl bg-emerald-50 px-2 py-3 text-center">
            <p className="text-[11px] font-bold leading-tight text-emerald-600">وصلني</p>
            <p className="mt-1 text-sm font-extrabold leading-tight text-slate-900">
              {formatCurrency(totalReceived)}
            </p>
          </div>
          <div className="rounded-xl bg-amber-50 px-2 py-3 text-center">
            <p className="text-[11px] font-bold leading-tight text-amber-600">باقي ليا</p>
            <p className={`mt-1 text-sm font-extrabold leading-tight ${remainingBalance < 0 ? "text-red-600" : "text-slate-900"}`}>
              {formatCurrency(remainingBalance)}
            </p>
          </div>
        </div>
      </section>

      {/* Monthly Stats */}
      {monthlyStats.length > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
          <h3 className="font-semibold text-slate-900">الإحصائيات الشهرية</h3>
          <div className="space-y-3">
            {monthlyStats.map((stat, index) => (
              <div key={index} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                <h4 className="font-semibold text-slate-900 mb-2">
                  {monthNames[stat.month]} {stat.year}
                </h4>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="text-center">
                    <p className="text-[10px] text-slate-500">أيام كاملة</p>
                    <p className="text-base font-bold text-sky-700">{stat.workDays}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] text-slate-500">نصف يوم</p>
                    <p className="text-base font-bold text-amber-600">{stat.halfDays}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] text-slate-500">إجازات</p>
                    <p className="text-base font-bold text-rose-600">{stat.offDays}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center justify-between rounded-lg bg-sky-100 px-2 py-1.5">
                    <span className="text-sky-700 text-xs">الإيرادات</span>
                    <span className="text-sky-700 font-semibold">{formatCurrency(stat.earned)}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-emerald-100 px-2 py-1.5">
                    <span className="text-emerald-700 text-xs">المدفوعات</span>
                    <span className="text-emerald-700 font-semibold">{formatCurrency(stat.received)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
          <p className="text-slate-500">لا توجد بيانات للفترة المحددة</p>
        </div>
      )}
    </div>
  );
}
