"use client";

import { useState, useMemo } from "react";
import { Filter, CalendarDays, Receipt, ChevronDown, ChevronUp } from "lucide-react";
import { calculateTotalEarned, calculateTotalReceived, calculateRemainingBalance, getDayEarning, calculateTotalWorkDays } from "@/lib/calculations";
import { formatDateNumeric } from "@/lib/format";
import { CurrencyText } from "@/components/ui/CurrencyText";
import { STATUS_LABELS, STATUS_COLORS, PAYMENT_METHOD_LABELS } from "@/lib/constants";
import type { ArtisanDayRow, ArtisanPaymentRow } from "@/lib/database.types";

const MONTH_NAMES = ["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"];

function mkKey(dateStr: string) {
  const d = new Date(`${dateStr.slice(0,10)}T12:00:00+03:00`);
  return { key: `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`, label: `${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}` };
}

function groupDays(days: ArtisanDayRow[]) {
  const map = new Map<string,{key:string;label:string;days:ArtisanDayRow[];total:number}>();
  for (const d of days) {
    const {key,label} = mkKey(d.date);
    if (!map.has(key)) map.set(key,{key,label,days:[],total:0});
    const g = map.get(key)!; g.days.push(d); g.total += getDayEarning(d);
  }
  return Array.from(map.entries()).sort((a,b)=>b[0].localeCompare(a[0])).map(([,v])=>v);
}

function groupPayments(payments: ArtisanPaymentRow[]) {
  const map = new Map<string,{key:string;label:string;payments:ArtisanPaymentRow[];total:number}>();
  for (const p of payments) {
    const {key,label} = mkKey(p.date);
    if (!map.has(key)) map.set(key,{key,label,payments:[],total:0});
    const g = map.get(key)!; g.payments.push(p); g.total += p.amount;
  }
  return Array.from(map.entries()).sort((a,b)=>b[0].localeCompare(a[0])).map(([,v])=>v);
}

function DayGroup({group,defaultOpen}:{group:ReturnType<typeof groupDays>[number];defaultOpen:boolean}) {
  const [open,setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-xl border border-slate-200 overflow-hidden">
      <button type="button" onClick={()=>setOpen(o=>!o)} className="flex w-full items-center justify-between bg-slate-50 px-3 py-2.5 active:bg-slate-100">
        <div className="flex items-center gap-2">
          {open?<ChevronUp className="h-4 w-4 text-slate-400"/>:<ChevronDown className="h-4 w-4 text-slate-400"/>}
          <span className="text-sm font-bold text-slate-700">{group.label}</span>
          <span className="text-xs text-slate-500">({calculateTotalWorkDays(group.days)} يوم)</span>
        </div>
        <span className="text-xs bg-sky-50 rounded-lg px-2 py-0.5">
          <CurrencyText amount={group.total} numberClass="text-sky-700 font-semibold" symbolClass="text-sky-400" />
        </span>
      </button>
      {open && (
        <div className="divide-y divide-slate-100">
          {group.days.map(day=>{
            const colors = STATUS_COLORS[day.status];
            return (
              <div key={day.id} className="flex items-center justify-between bg-white px-3 py-2">
                <div className="flex items-center gap-2.5">
                  <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${colors.dot}`}/>
                  <div>
                    <p className="text-sm font-medium text-slate-800">{formatDateNumeric(day.date)}</p>
                    <p className={`text-xs ${colors.text}`}>{STATUS_LABELS[day.status]}</p>
                    <p className="text-xs text-slate-400">{day.client_name}</p>
                  </div>
                </div>
                <CurrencyText amount={getDayEarning(day)} numberClass="text-slate-900 font-bold text-sm" symbolClass="text-slate-400 text-xs" />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function PaymentGroup({group,defaultOpen}:{group:ReturnType<typeof groupPayments>[number];defaultOpen:boolean}) {
  const [open,setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-xl border border-slate-200 overflow-hidden">
      <button type="button" onClick={()=>setOpen(o=>!o)} className="flex w-full items-center justify-between bg-slate-50 px-3 py-2.5 active:bg-slate-100">
        <div className="flex items-center gap-2">
          {open?<ChevronUp className="h-4 w-4 text-slate-400"/>:<ChevronDown className="h-4 w-4 text-slate-400"/>}
          <span className="text-sm font-bold text-slate-700">{group.label}</span>
          <span className="text-xs text-slate-500">({group.payments.length} دفعة)</span>
        </div>
        <span className="text-xs bg-emerald-50 rounded-lg px-2 py-0.5">
          <CurrencyText amount={group.total} numberClass="text-emerald-700 font-semibold" symbolClass="text-emerald-400" />
        </span>
      </button>
      {open && (
        <div className="divide-y divide-slate-100">
          {group.payments.map(p=>(
            <div key={p.id} className="flex items-center justify-between bg-white px-3 py-2.5">
              <div>
                <p className="text-sm font-medium text-slate-800">{formatDateNumeric(p.date)}</p>
                <p className="text-xs text-slate-400">{p.client_name}</p>
                {p.location && <p className="text-xs text-slate-500">📍 {p.location}</p>}
                <p className="text-xs text-slate-500">{PAYMENT_METHOD_LABELS[p.payment_method]}</p>
              </div>
              <CurrencyText amount={p.amount} numberClass="text-slate-900 font-bold text-sm" symbolClass="text-slate-400 text-xs" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function ReportsClient({ initialWorkDays, initialPayments, clientNames }:
  { initialWorkDays: ArtisanDayRow[]; initialPayments: ArtisanPaymentRow[]; clientNames: string[] }) {
  const [selectedClient, setSelectedClient] = useState<string|null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string|null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const filteredWorkDays = useMemo(()=>initialWorkDays.filter(d=>
    (!selectedClient||d.client_name===selectedClient)&&
    (!selectedStatus||d.status===selectedStatus)&&
    (!startDate||d.date>=startDate)&&
    (!endDate||d.date<=endDate)
  ),[initialWorkDays,selectedClient,selectedStatus,startDate,endDate]);

  const filteredPayments = useMemo(()=>initialPayments.filter(p=>
    (!selectedClient||p.client_name===selectedClient)&&
    (!startDate||p.date>=startDate)&&
    (!endDate||p.date<=endDate)
  ),[initialPayments,selectedClient,startDate,endDate]);

  const totalEarned = calculateTotalEarned(filteredWorkDays);
  const totalReceived = calculateTotalReceived(filteredPayments);
  const remainingBalance = calculateRemainingBalance(totalEarned,totalReceived);
  const totalWorkDays = calculateTotalWorkDays(filteredWorkDays);

  const groupedDays = useMemo(()=>groupDays(filteredWorkDays),[filteredWorkDays]);
  const groupedPayments = useMemo(()=>groupPayments(filteredPayments),[filteredPayments]);
  const hasFilters = !!(selectedClient||selectedStatus||startDate||endDate);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-slate-700"/>
          <h3 className="font-semibold text-slate-900">تصفية</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">المقاول</label>
            <select value={selectedClient||""} onChange={e=>setSelectedClient(e.target.value||null)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500">
              <option value="">الكل</option>
              {clientNames.map(n=><option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">الحالة</label>
            <select value={selectedStatus||""} onChange={e=>setSelectedStatus(e.target.value||null)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500">
              <option value="">الكل</option>
              <option value="Full Day">يوم كامل</option>
              <option value="Half Day">نصف يوم</option>
              <option value="Holiday">رجعت من الشغل</option>
              <option value="Vacation">يوم إجازة</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">من التاريخ</label>
            <input type="date" value={startDate} onChange={e=>setStartDate(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"/>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">إلى التاريخ</label>
            <input type="date" value={endDate} onChange={e=>setEndDate(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"/>
          </div>
        </div>
        <button onClick={()=>{setSelectedClient(null);setSelectedStatus(null);setStartDate("");setEndDate("");}}
          className="w-full px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-sm font-medium hover:bg-slate-200">
          إعادة التعيين
        </button>
      </section>

      {/* Summary */}
      {hasFilters && (
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="font-semibold text-slate-900 mb-3">نتائج التصفية</h3>
          <div className="grid grid-cols-3 gap-2 mb-2">
            <div className="rounded-xl bg-sky-50 px-2 py-3 text-center">
              <p className="text-[11px] font-bold text-sky-600">المستحقات</p>
              <p className="mt-1 text-sm font-extrabold">
                <CurrencyText amount={totalEarned} numberClass="text-slate-900 font-extrabold" symbolClass="text-slate-400" />
              </p>
            </div>
            <div className="rounded-xl bg-emerald-50 px-2 py-3 text-center">
              <p className="text-[11px] font-bold text-emerald-600">وصلني</p>
              <p className="mt-1 text-sm font-extrabold">
                <CurrencyText amount={totalReceived} numberClass="text-slate-900 font-extrabold" symbolClass="text-slate-400" />
              </p>
            </div>
            <div className="rounded-xl bg-amber-50 px-2 py-3 text-center">
              <p className="text-[11px] font-bold text-amber-600">باقي</p>
              <p className="mt-1 text-sm font-extrabold">
                <CurrencyText
                  amount={Math.abs(remainingBalance)}
                  numberClass={`font-extrabold ${remainingBalance>0?"text-emerald-700":remainingBalance<0?"text-rose-700":"text-slate-900"}`}
                  symbolClass="text-slate-400"
                />
              </p>
            </div>
          </div>
          {/* العداد الصح: calculateTotalWorkDays يحسب Full=1, Half=0.5 */}
          <p className="text-xs text-slate-500 text-center">{totalWorkDays} يوم عمل · {filteredPayments.length} دفعة</p>
        </section>
      )}

      {/* أيام العمل */}
      {filteredWorkDays.length>0 && (
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <CalendarDays className="h-5 w-5 text-sky-600"/>
            <h3 className="font-semibold text-slate-900">أيام العمل ({totalWorkDays})</h3>
          </div>
          <div className="space-y-2">
            {groupedDays.map((g,i)=><DayGroup key={g.key} group={g} defaultOpen={i===0}/>)}
          </div>
        </section>
      )}

      {/* المدفوعات */}
      {filteredPayments.length>0 && (
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Receipt className="h-5 w-5 text-emerald-600"/>
            <h3 className="font-semibold text-slate-900">المدفوعات ({filteredPayments.length})</h3>
          </div>
          <div className="space-y-2">
            {groupedPayments.map((g,i)=><PaymentGroup key={g.key} group={g} defaultOpen={i===0}/>)}
          </div>
        </section>
      )}
    </div>
  );
}
