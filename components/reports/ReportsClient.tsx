"use client";

import { useState, useMemo } from "react";
import { Filter } from "lucide-react";
import { calculateTotalEarned, calculateTotalReceived, calculateRemainingBalance } from "@/lib/calculations";
import { formatCurrency } from "@/lib/format";
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

  const hasFilters = selectedClient || selectedStatus || startDate || endDate;

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

      {/* Filtered Summary */}
      {hasFilters && (
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="font-semibold text-slate-900 mb-3">نتائج التصفية</h3>
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-xl bg-sky-50 px-2 py-3 text-center">
              <p className="text-[11px] font-bold text-sky-600">المستحقات</p>
              <p className="mt-1 text-sm font-extrabold text-slate-900">{formatCurrency(totalEarned)}</p>
            </div>
            <div className="rounded-xl bg-emerald-50 px-2 py-3 text-center">
              <p className="text-[11px] font-bold text-emerald-600">وصلني</p>
              <p className="mt-1 text-sm font-extrabold text-slate-900">{formatCurrency(totalReceived)}</p>
            </div>
            <div className="rounded-xl bg-amber-50 px-2 py-3 text-center">
              <p className="text-[11px] font-bold text-amber-600">باقي</p>
              <p className={`mt-1 text-sm font-extrabold ${remainingBalance > 0 ? "text-emerald-700" : remainingBalance < 0 ? "text-rose-700" : "text-slate-900"}`}>
                {formatCurrency(Math.abs(remainingBalance))}
              </p>
            </div>
          </div>
          <p className="mt-2 text-xs text-slate-500 text-center">
            {filteredWorkDays.length} يوم عمل · {filteredPayments.length} دفعة
          </p>
        </section>
      )}
    </div>
  );
}
